"""A daily reel: Wall Street's open or its close, told in Spanish, on Instagram. A folder in reels/,
named by its date and its moment.

    reels/2026-11-02-open/
        script.md           what is said, scene by scene (kind: reel), with its sources (script.py)
        slides/01-hook.html the picture of each scene, drawn upright as code (theme/reel.css)
        caption.txt         what goes under the reel on Instagram
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

MOMENTS = ("open", "close")
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
    return found


def remember(reel: Reel, record: dict) -> None:
    reel.published.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
