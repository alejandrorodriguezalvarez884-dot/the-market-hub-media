"""From the frames and the narration of each scene to a film and its captions.

Two films come out of a script: the video (every scene, as wide as a screen) and its Short (the
scenes the script names, upright). Each scene is its picture, moving while it moves and then
held, for as long as its narration lasts, plus a short silence. A scene whose narration is not made yet is held for the time its
words would take at the channel's pace, in silence: a film can be watched, timed and corrected
before a word is spoken.

The video's captions are a file beside it (captions.srt), for YouTube to show when asked. The
Short's are drawn into the picture, a few words at a time: many Shorts are watched with no sound.
"""

from __future__ import annotations

import re
import subprocess
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from .channel import Channel
from .script import Scene, Script
from .videos import Video

MIN_SECONDS = 2.0          # no picture is shown for less
CAPTION_CHARS = 84         # two lines of text on screen
SHORT_CAPTION_CHARS = 30   # a few words at a time, large, in the Short
# How the Short's captions are drawn (an ASS style; sizes are on a page 288 high). They sit in
# the band the upright slides leave free, above what YouTube draws over a Short.
SHORT_CAPTION_STYLE = ("FontName=Segoe UI,Bold=1,FontSize=11,PrimaryColour=&H00EAF0F2,OutlineColour=&H000D0C0B,"
                       "BorderStyle=1,Outline=1.2,Shadow=0,Alignment=2,MarginV=58,MarginL=31,MarginR=31")
DURATION = re.compile(r"Duration:\s*(\d+):(\d\d):(\d\d(?:\.\d+)?)")


def ffmpeg() -> str:
    """The ffmpeg that comes with the imageio-ffmpeg package: nothing to install on the machine."""
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def length(path: Path) -> float:
    """How long a sound file lasts, in seconds."""
    out = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path)], capture_output=True, text=True, errors="replace").stderr
    found = DURATION.search(out)
    if not found:
        raise ValueError(f"{path.name}: could not read how long it lasts")
    hours, minutes, seconds = found.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


@dataclass(frozen=True)
class Cut:
    """One scene in a film."""
    scene: Scene
    voice: Path | None   # its narration, when it is made
    spoken: float        # how long the narration lasts, or would
    seconds: float       # how long the picture is held: the narration and the silence after it


def spoken(scene: Scene, words_per_minute: int) -> float:
    """How long a scene with no narration yet is held."""
    if scene.seconds:
        return scene.seconds
    return max(MIN_SECONDS, scene.words / words_per_minute * 60)


def plan(video: Video, script: Script, channel: Channel, short: bool = False,
         measure: Callable[[Path], float] = length) -> list[Cut]:
    """The scenes of the video, or of its Short, each with how long it is held."""
    cuts = []
    for scene in script.cut(short):
        voice = video.voice(scene.name)
        said = measure(voice) if voice else spoken(scene, channel.words_per_minute)
        cuts.append(Cut(scene, voice, said, said + channel.gap_seconds))
    return cuts


def _lines(text: str, chars: int = CAPTION_CHARS) -> list[str]:
    """The narration cut into captions: a sentence each, and a long sentence in several."""
    out: list[str] = []
    for sentence in re.split(r"(?<=[.!?…])\s+", " ".join(text.split())):
        line = ""
        for word in sentence.split():
            if line and len(line) + 1 + len(word) > chars:
                out.append(line)
                line = word
            else:
                line = f"{line} {word}".strip()
        if line:
            out.append(line)
    return out


def _stamp(seconds: float) -> str:
    ms = round(seconds * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def captions(cuts: list[Cut], chars: int = CAPTION_CHARS) -> str:
    """The captions as an SRT file. Within a scene, each line gets time by its share of the text."""
    blocks: list[str] = []
    start = 0.0
    for cut in cuts:
        lines = _lines(cut.scene.narration, chars)
        total = sum(len(line) for line in lines)
        at = start
        for line in lines:
            end = at + cut.spoken * len(line) / total
            blocks.append(f"{len(blocks) + 1}\n{_stamp(at)} --> {_stamp(end)}\n{line}\n")
            at = end
        start += cut.seconds
    return "\n".join(blocks)


def _run(args: list[str], cwd: Path | None = None) -> None:
    done = subprocess.run(args, capture_output=True, text=True, errors="replace", cwd=cwd)
    if done.returncode:
        raise RuntimeError(f"ffmpeg failed: {done.stderr.strip()[-600:]}")


def picture(video: Video, scene: str, short: bool, fps: int, seconds: float) -> tuple[list[str], str]:
    """How ffmpeg reads a scene's picture, and the filter that goes with it: its moving frames
    and then the last of them held until the scene ends, or its one still frame."""
    moving = video.moving(scene, short)
    if moving.is_dir() and any(moving.glob("*.jpg")):
        return (["-framerate", str(fps), "-i", str(moving / "%04d.jpg")],
                f"tpad=stop_mode=clone:stop_duration={seconds:.3f}")
    return ["-loop", "1", "-framerate", str(fps), "-i", str(video.frame(scene, short))], ""


def film(video: Video, script: Script, channel: Channel, short: bool = False,
         log: Callable[[str], None] = print) -> Path:
    """Make the video (build/video.mp4) or its Short (build/short.mp4), with its captions.
    The frames must be drawn already (frames.py)."""
    cuts = plan(video, script, channel, short)
    if not cuts:
        raise ValueError("the script names no scenes for the Short" if short else "the script has no scenes")
    missing = [c.scene.name for c in cuts if not video.frame(c.scene.name, short).is_file()]
    if missing:
        raise FileNotFoundError(f"no frame for: {', '.join(missing)}")
    width, height = (channel.short_width, channel.short_height) if short else (channel.width, channel.height)
    parts = video.build / ("short-parts" if short else "parts")
    parts.mkdir(parents=True, exist_ok=True)
    tool = ffmpeg()
    for cut in cuts:
        sound = ["-i", str(cut.voice), "-af", "apad"] if cut.voice else ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]
        source, hold = picture(video, cut.scene.name, short, channel.fps, cut.seconds)
        _run([tool, "-y", "-loglevel", "error", *source, *sound, "-t", f"{cut.seconds:.3f}",
              "-vf", ",".join(f for f in (hold, f"scale={width}:{height}") if f), "-c:v", "libx264",
              "-pix_fmt", "yuv420p", "-r", str(channel.fps), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
              str(parts / f"{cut.scene.name}.mp4")])
        log(f"  {cut.scene.name:<28} {cut.seconds:5.1f}s  {'voice' if cut.voice else 'silent'}"
            f"{'  moving' if hold else ''}")
    order = video.build / f"{parts.name}.txt"
    order.write_text("".join(f"file '{parts.name}/{c.scene.name}.mp4'\n" for c in cuts), encoding="utf-8", newline="\n")
    joined = video.build / "short-plain.mp4" if short else video.film()
    _run([tool, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(order),
          "-c", "copy", "-movflags", "+faststart", str(joined)])
    words = captions(cuts, SHORT_CAPTION_CHARS if short else CAPTION_CHARS)
    video.captions(short).write_text(words, encoding="utf-8", newline="\n")
    if short:
        # Run inside build/, with plain file names: a Windows path in a filter needs escaping.
        _run([tool, "-y", "-loglevel", "error", "-i", joined.name,
              "-vf", f"subtitles={video.captions(short).name}:force_style='{SHORT_CAPTION_STYLE}'",
              "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart",
              video.film(short).name], cwd=video.build)
    return video.film(short)
