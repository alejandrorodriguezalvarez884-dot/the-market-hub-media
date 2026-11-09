"""Films drawn with Remotion (https://www.remotion.dev): the scenes are React components
(slides/<scene>.tsx, with the kit in remotion/src/kit) instead of HTML pages, and Remotion draws
every frame and makes the film. It replaces frames.py and render.film for the pieces drawn that
way; everything else stays as it is: the script and its checks, the voice and its timing, the
captions, the cover, publishing.

What Python does here is what it did before the frames: it works out the film (render.plan: the
scenes in order, how long each is held, its voice, and when each word is said, timing.py) and
hands it to remotion/render.mjs as props, with the piece's voice in a public folder. The film
comes out where the ffmpeg montage left it (build/reel.mp4 or build/video.mp4), and each scene's
still as its narration ends where frames.py left it (build/short-frames/ or build/frames/), so
`make reelcheck`, `make reelpost`, the cover and the review of every frame do not change.

A piece is drawn with Remotion when its slides are .tsx: all of them, or none (docs/remotion.md).
Rendering is local and free (Remotion's free licence: individuals and companies of up to three
people); nothing goes to Remotion Lambda or any other paid service.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from collections.abc import Callable
from pathlib import Path

from . import mouth, render, timing
from .channel import ROOT, Channel
from .script import Script
from .videos import Video

HOME = ROOT / "remotion"
RENDER = HOME / "render.mjs"
SUFFIX = ".tsx"
VOICE_FADE = render.VOICE_FADE


class Missing(RuntimeError):
    """Remotion is not ready on this machine (Node or its packages)."""


def drawings(video: Video, script: Script) -> dict[str, Path | None]:
    """Each scene's drawing, by name: slides/<scene>.tsx, .html or .svg, or None."""
    return {scene.name: video.drawing(scene.name) for scene in script.scenes}


def used(video: Video, script: Script) -> bool:
    """Whether this piece is drawn with Remotion: every scene's drawing is a .tsx. A piece with some
    scenes in .tsx and others in HTML is an error: one film, one way of drawing it."""
    kinds = {path.suffix for path in drawings(video, script).values() if path}
    if SUFFIX in kinds and len(kinds) > 1:
        raise ValueError(f"{video.name}: some slides are .tsx and some are not; a film is drawn one way (docs/remotion.md)")
    return kinds == {SUFFIX}


def problems(video: Video, script: Script) -> list[str]:
    """What stops a piece drawn with Remotion from being made: the checks of check.py and
    reels.problems for an HTML slide, said for a .tsx."""
    found = []
    try:
        used(video, script)
    except ValueError as exc:
        return [str(exc)]
    for name, path in drawings(video, script).items():
        if not path or path.suffix != SUFFIX:
            continue
        text = path.read_text(encoding="utf-8")
        if not re.search(r"export\s+default|export\s*\{\s*default\b", text):
            found.append(f"slides/{path.name} has no 'export default' (the scene's component)")
        if render_remote(text):
            found.append(f"slides/{path.name} loads something from the network")
        if "TODO" in text:
            found.append(f"slides/{path.name} still has TODO in it")
    return found


def render_remote(text: str) -> bool:
    """Whether a .tsx loads something from the network (an http address in an import or a src)."""
    return bool(re.search(r"""(from|import|src=|href=|url\()\s*\(?\s*["'`]?\s*(https?:)?//""", text, re.I))


def props(video: Video, script: Script, channel: Channel, short: bool) -> tuple[dict, list[render.Cut]]:
    """The film as Remotion is told it: its size, pace and dissolve, and each scene with where it
    starts, how long it is held, how long its voice lasts, its voice's file and its words' times."""
    cuts = render.plan(video, script, channel, short)
    width, height = (channel.short_width, channel.short_height) if short else (channel.width, channel.height)
    scenes, start = [], 0.0
    for n, cut in enumerate(cuts):
        levels = mouth.voice(cut.voice, channel.fps)["levels"] if cut.voice else None
        said = timing.words(cut.scene.narration, cut.spoken, levels, channel.fps)
        scenes.append({
            "name": cut.scene.name, "index": n, "count": len(cuts),
            "start": round(start, 4), "seconds": round(cut.seconds, 4), "spoken": round(cut.spoken, 4),
            "words": [{"word": w.word, "at": round(w.at, 4), "end": round(w.end, 4)} for w in said],
            "voice": f"voice/{cut.voice.name}" if cut.voice else None,
            "sound": f"sound/{cut.scene.name}.wav" if not cut.voice and cut.scene.sound == "tick" else None,
        })
        start += cut.seconds
    for scene in scenes:
        scene["total"] = round(start, 4)
    return ({"width": width, "height": height, "fps": channel.fps, "crossfade": channel.crossfade,
             "voiceFade": VOICE_FADE, "total": round(start, 4), "scenes": scenes}, cuts)


def public(video: Video, cuts: list[render.Cut], log: Callable[[str], None] = print) -> Path:
    """The folder Remotion serves the film's sounds from: the piece's voice files and the ticks it
    makes here (render.TICK), in build/remotion/public."""
    folder = video.build / "remotion" / "public"
    shutil.rmtree(folder, ignore_errors=True)
    (folder / "voice").mkdir(parents=True)
    for cut in cuts:
        if cut.voice:
            target = folder / "voice" / cut.voice.name
            try:
                os.link(cut.voice, target)
            except OSError:
                shutil.copy2(cut.voice, target)
        elif cut.scene.sound == "tick":
            (folder / "sound").mkdir(exist_ok=True)
            render._run([render.ffmpeg(), "-y", "-loglevel", "error", "-f", "lavfi", "-i", render.TICK,
                         "-t", f"{cut.seconds:.3f}", "-ar", "48000", "-ac", "2", str(folder / "sound" / f"{cut.scene.name}.wav")])
    return folder


def node() -> str:
    found = shutil.which("node")
    if not found:
        raise Missing("Remotion needs Node.js 18 or later (docs/remotion.md): install it, then `make remotion`")
    return found


def ready(log: Callable[[str], None] = print) -> None:
    """Install remotion/'s packages when they are not there yet (npm ci, from its lock file)."""
    node()
    if (HOME / "node_modules" / "@remotion" / "renderer").is_dir():
        return
    npm = shutil.which("npm")
    if not npm:
        raise Missing("Remotion needs npm (it comes with Node.js)")
    log("  installing Remotion (npm ci in remotion/, once)")
    done = subprocess.run([npm, "ci", "--no-fund", "--no-audit"], cwd=HOME, capture_output=True, text=True, errors="replace")
    if done.returncode:
        raise Missing(f"npm ci failed in remotion/: {done.stderr.strip()[-600:]}")


def film(video: Video, script: Script, channel: Channel, short: bool, stills: bool = True,
         log: Callable[[str], None] = print) -> Path:
    """Make the piece's film with Remotion (build/reel.mp4 for a reel, build/video.mp4 for a long
    video), its captions beside it, and, with ``stills``, each scene's still as its narration ends."""
    ready(log)
    given, cuts = props(video, script, channel, short)
    if not cuts:
        raise ValueError("the script has no scenes")
    work = video.build / "remotion"
    work.mkdir(parents=True, exist_ok=True)
    folder = public(video, cuts, log)
    told = work / "props.json"
    told.write_text(json.dumps(given, ensure_ascii=False), encoding="utf-8")
    out = video.film(short)
    still = video.frame(cuts[0].scene.name, short).parent
    args = [node(), str(RENDER), "--piece", str(video.path), "--props", str(told), "--public", str(folder), "--out", str(out)]
    if stills:
        args += ["--stills", str(still)]
    _stream(args, log)
    video.captions(short).write_text(render.captions(cuts, render.SHORT_CAPTION_CHARS if short else render.CAPTION_CHARS),
                                     encoding="utf-8", newline="\n")
    return out


def stills(video: Video, script: Script, channel: Channel, short: bool, log: Callable[[str], None] = print) -> Path:
    """Only each scene's still, as its narration ends: to look at the slides before the film."""
    ready(log)
    given, cuts = props(video, script, channel, short)
    work = video.build / "remotion"
    work.mkdir(parents=True, exist_ok=True)
    folder = public(video, cuts, log)
    told = work / "props.json"
    told.write_text(json.dumps(given, ensure_ascii=False), encoding="utf-8")
    still = video.frame(cuts[0].scene.name, short).parent
    _stream([node(), str(RENDER), "--piece", str(video.path), "--props", str(told), "--public", str(folder), "--stills", str(still)], log)
    return still


def _stream(args: list[str], log: Callable[[str], None]) -> None:
    """Run render.mjs, saying its lines as they come."""
    with subprocess.Popen(args, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, errors="replace") as run:
        for line in run.stdout:
            log(line.rstrip())
        error = run.stderr.read()
    if run.returncode:
        raise RuntimeError(f"Remotion failed: {error.strip()[-1500:]}")
