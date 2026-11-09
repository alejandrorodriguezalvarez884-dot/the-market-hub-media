"""A daily reel: Wall Street's open or its close, told in Spanish, on Instagram. A folder in reels/,
named by its date and its moment.

    reels/2026-11-02-open/
        script.md           what is said, scene by scene (kind: reel), with its sources (script.py)
        slides/01-hook.html the picture of each scene, drawn upright as code (theme/reel.css)
        caption.txt         what goes under the reel on Instagram
        x.txt               the thread that takes it to X: two to four posts, apart by a line of ---
        data/               what was read to write it, as it was read (the portal's overview...)
        voice/              the narration of each scene (not in git)
        build/reel.mp4      the film (not in git)
        instagram.json      where it went, once it is up

Besides the two daily ones (``open`` and ``close``), the owner asks for reels one by one, to
think something through: their folder is the day and a few words (reels/2026-11-02-not-a-bubble),
and their script names another voice ("voice: reflexion", [reel.voices] in channel.toml).

A reel is a film of its own, not a cut of a video: upright only, with no presenter, no intro and
no outro, no thumbnail and no YouTube. Two a day at most, one per moment: the folder's name is
the day and the moment, and a folder that is up is never published again.
"""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from datetime import date as Date
from pathlib import Path

from . import render
from . import script as scripts
from .channel import ROOT, Channel
from .videos import DRAWINGS, Video

MOMENTS = ("open", "close", "week", "ahead")   # the "market updates" line: daily, Saturday and Sunday night
NAME = re.compile(r"(\d{4}-\d{2}-\d{2})-([a-z0-9][a-z0-9\-]{2,70})")
CAPTION_MAX = 2200          # Instagram's own limit
HASHTAGS_MAX = 8            # Instagram reads a few; more reads as spam
HASHTAG = re.compile(r"(?<!\w)#\w+")
REMOTE = re.compile(r"""(src|href)\s*=\s*["']?\s*(https?:)?//|url\(\s*["']?\s*(https?:)?//|@import""", re.I)


@dataclass(frozen=True)
class Reel(Video):
    """A daily reel. It is kept like a video (script, slides, voice, build), so the same code draws
    and speaks it; what differs is said here."""

    @property
    def date(self) -> str:
        return NAME.fullmatch(self.name).group(1)

    @property
    def moment(self) -> str:
        """open or close for a daily reel; for one the owner asked for, its few words."""
        return NAME.fullmatch(self.name).group(2)

    @property
    def daily(self) -> bool:
        return self.moment in MOMENTS

    def film(self, short: bool = True) -> Path:
        return self.build / "reel.mp4"

    @property
    def caption(self) -> Path:
        return self.path / "caption.txt"

    @property
    def published(self) -> Path:
        return self.path / "instagram.json"

    @property
    def thread_file(self) -> Path:
        return self.path / "x.txt"

    def thread(self) -> list[str]:
        """The posts of its thread on X, in order (the film goes on the first)."""
        if not self.thread_file.is_file():
            return []
        text = self.thread_file.read_text(encoding="utf-8").replace("\r\n", "\n")
        return [part.strip() for part in re.split(r"(?m)^---\s*$", text) if part.strip()]

    def stage(self) -> str:
        """How far along it is: started, script, rendered or published."""
        if self.published.is_file():
            return "published"
        if self.film().is_file():
            return "rendered"
        if self.script.is_file() and "TODO" not in self.script.read_text(encoding="utf-8"):
            return "script"
        return "started"


def folder(root: Path | None = None) -> Path:
    return (root or ROOT) / "reels"


def every(root: Path | None = None) -> list[Reel]:
    base = folder(root)
    return [Reel(p) for p in sorted(base.iterdir()) if p.is_dir() and NAME.fullmatch(p.name)] if base.is_dir() else []


def find(name: str, root: Path | None = None) -> Reel:
    """The reel with this folder name, or the only one whose name has ``name`` in it."""
    reels = every(root)
    exact = [r for r in reels if r.name == name]
    matches = exact or [r for r in reels if name and name in r.name]
    if len(matches) != 1:
        raise LookupError(f"no reel named {name!r}" if not matches else
                          f"{name!r} is more than one reel: {', '.join(r.name for r in matches)}")
    return matches[0]


def new(moment: str, root: Path | None = None, day: str | None = None) -> Reel:
    """A new reel's folder for ``moment`` of ``day`` (today if not said), copied from
    templates/reel: open or close for a daily reel, or a few words for one the owner asked for."""
    moment = moment.strip().lower()
    if not NAME.fullmatch(f"2000-01-01-{moment}"):
        raise ValueError(f"{moment!r} is not open, close or a few plain words joined by dashes")
    day = day or Date.today().isoformat()
    name = f"{day}-{moment}"
    if not NAME.fullmatch(name):
        raise ValueError(f"{day!r} is not a date like 2026-11-02")
    path = folder(root) / name
    if path.exists():
        raise ValueError(f"reels/{name} is there already")
    shutil.copytree((root or ROOT) / "templates" / "reel", path)
    return Reel(path)


def hashtags(text: str) -> list[str]:
    return HASHTAG.findall(text)


def caption_problems(text: str, channel: Channel) -> list[str]:
    """What stops a caption from going under a reel."""
    found = []
    if not text.strip():
        return ["caption.txt is empty"]
    if len(text) > CAPTION_MAX:
        found.append(f"the caption has {len(text)} characters; Instagram takes {CAPTION_MAX}")
    if channel.reel_disclaimer and channel.reel_disclaimer not in " ".join(text.split()):
        found.append(f"the caption lacks the notice: {channel.reel_disclaimer!r}")
    if not re.search(r"^Fuentes:", text, re.M):
        found.append("the caption names no sources (a line that starts with 'Fuentes:')")
    if len(hashtags(text)) > HASHTAGS_MAX:
        found.append(f"the caption has {len(hashtags(text))} hashtags; {HASHTAGS_MAX} at most")
    for match in scripts.ADVICE.finditer(text):
        found.append(f"the caption reads as advice: {match.group(0)!r}")
    if "TODO" in text:
        found.append("the caption still has TODO in it")
    return found


def voiced(reel: Reel, channel: Channel) -> Channel:
    """The channel as this reel sees it: the reels' own voice, or the one its script names."""
    voice = scripts.load(reel.script).voice if reel.script.is_file() else ""
    return channel.for_reels(voice)


THREAD = (1, 4)   # how few and how many posts take a reel to X


def thread_problems(texts: list[str]) -> list[str]:
    """What stops a reel's thread from going on X: the same rules as the channel's own posts
    (xposts: X's length, no advice, no emoji, two hashtags at most) and, like the posts it makes
    on its own, no link or domain (X charges $0.20 for a post with one)."""
    from . import xposts
    if not THREAD[0] <= len(texts) <= THREAD[1]:
        return [f"x.txt has {len(texts)} posts; a reel's thread has {THREAD[0]} to {THREAD[1]}, apart by a line of ---"]
    found = []
    for n, text in enumerate(texts, 1):
        post = xposts.Post(Path("2000-01-01-reel.md"), text, sources=["the reel's script"], auto=True)
        found += [f"x.txt, post {n}: {problem}" for problem in xposts.problems(post)]
    return found


def problems(reel: Reel, channel: Channel) -> list[str]:
    """Empty when nothing stops this reel from being published. ``channel`` is the channel as a
    reel sees it (Channel.for_reels)."""
    if not reel.script.is_file():
        return ["no script.md"]
    try:
        script = scripts.load(reel.script)
    except scripts.Invalid as exc:
        return [str(exc)]
    found = scripts.problems(script)
    if script.voice and script.voice not in channel.reel_voice_names():
        found.append(f"'voice: {script.voice}' is not one of [reel.voices] in channel.toml")
    if script.kind != "reel":
        found.append("a reel's script says 'kind: reel'")
    scenes = {s.name for s in script.scenes}
    for scene in script.scenes:
        drawing = reel.drawing(scene.name)
        if not drawing:
            found.append(f"scene {scene.name}: no drawing in slides/")
            continue
        text = drawing.read_text(encoding="utf-8")
        if REMOTE.search(text):
            found.append(f"slides/{drawing.name} loads something from the network")
        if "TODO" in text:
            found.append(f"slides/{drawing.name} still has TODO in it")
    from . import remotion
    found += [p for p in remotion.problems(reel, script) if "TODO" not in p and "network" not in p]
    if reel.daily and script.scenes and not any("one way" in p for p in found):
        drawn = "remotion" if remotion.used(reel, script) else "html"
        if drawn != channel.reel_daily_drawing:
            found.append(f"a daily reel is drawn as {channel.reel_daily_drawing} ([reel] daily_drawing in channel.toml), "
                         f"and these slides are {'.tsx' if drawn == 'remotion' else '.html'} (docs/remotion.md)")
    slides = reel.path / "slides"
    for file in sorted(slides.iterdir()) if slides.is_dir() else []:
        if file.suffix in DRAWINGS and file.stem not in scenes:
            found.append(f"slides/{file.name} belongs to no scene")
    if script.scenes:
        seconds = sum(c.seconds for c in render.plan(reel, script, channel, short=True))
        low, high = channel.reel_seconds if reel.daily else channel.reel_asked_seconds
        if not low <= seconds <= high:
            found.append(f"the reel runs {seconds:.0f} s; a reel runs {low:.0f} to {high:.0f} s")
    found += caption_problems(reel.caption.read_text(encoding="utf-8") if reel.caption.is_file() else "", channel)
    found += ["no x.txt: every reel goes to X too, with its thread (the owner, 2026-11-02)"] if not reel.thread_file.is_file() \
        else thread_problems(reel.thread())
    return found


def cover(reel: Reel, scene: str) -> Path:
    """The reel's cover as the JPEG Instagram takes: ``scene`` as it stands when its narration
    ends (build/short-frames/<scene>.png), with everything on it."""
    from .render import _run, ffmpeg
    still = reel.frame(scene, short=True)
    if not still.is_file():
        raise FileNotFoundError(f"no cover yet ({still.relative_to(reel.path).as_posix()}): run 'make reel' first")
    out = reel.build / "cover.jpg"
    _run([ffmpeg(), "-y", "-loglevel", "error", "-i", str(still), "-q:v", "2", str(out)])
    return out


def remember(reel: Reel, record: dict) -> None:
    reel.published.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")


# A long video's look, by its reel's voice (the reel's line): the body of its slides, the background
# and the brand line. A special reel with a look of its own (reels/2026-11-09-jensen-huang) gets the
# essay look here, and its long video's slides then take the reel's own style instead.
LOOKS = {
    "": ("", "tape", "Al día"),
    "reflexion": ("light essay", "grid", "A fondo"),
    "didactico": ("light", "grid", "Aprende"),
    "grafico": ("light", "plain", "Lee el gráfico"),
}


def new_long(reel: Reel, root: Path | None = None) -> Video:
    """The folder of the long video that goes with ``reel`` (one the owner asked for): videos/ with
    the reel's name, copied from templates/long, with the reel's title, voice and sources in its
    script and the look of the reel's line on its slides (drawn with Remotion, .tsx; the thumbnail
    is an HTML page). The daily reels have none."""
    if reel.daily:
        raise ValueError(f"reels/{reel.name} is a daily reel; only the reels the owner asks for have a long video")
    from . import videos
    script = scripts.load(reel.script)
    path = videos.folder(root) / reel.name
    if path.exists():
        raise ValueError(f"videos/{reel.name} is there already")
    look, background, line = LOOKS.get(script.voice, LOOKS["reflexion"])
    sources = "\n".join(f"  - {label} | {address}" for label, address in script.sources) or "  - TODO lo que dice | https://"
    tone = "essay" if "essay" in look else "light" if "light" in look else "dark"   # the look's name in the Remotion kit
    fill = {"{{title}}": script.title, "{{reel}}": reel.name, "{{voice}}": script.voice, "{{sources}}": sources,
            "{{look}}": look, "{{background}}": background, "{{line}}": line, "{{tone}}": tone}
    shutil.copytree((root or ROOT) / "templates" / "long", path)
    for file in path.rglob("*"):
        if file.is_file() and file.suffix in (".md", ".html", ".svg", ".tsx"):
            text = file.read_text(encoding="utf-8")
            for key, value in fill.items():
                text = text.replace(key, value)
            file.write_text(text.replace(' class=""', "").replace('class=" thumb"', 'class="thumb"'), encoding="utf-8", newline="\n")
    return Video(path)
