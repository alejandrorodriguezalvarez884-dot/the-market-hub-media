"""A video: a folder in videos/, named by its date and its slug.

    videos/2026-10-06-what-a-buyback-does/
        brief.md            the idea studied: the angle, the facts and where each comes from
        script.md           what is said, scene by scene, and which scenes make the Short (script.py)
        slides/01-hook.html the picture of each scene, drawn as code
        thumbnail.html      the picture YouTube shows for the video
        voice/01-hook.wav   the narration of each scene, when it is made (not in git)
        build/              what all of it is made into: the video, the Short, their captions,
                            the thumbnail and what to paste into YouTube (not in git)
        published.json      where it is on YouTube, once it is there
"""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from .channel import ROOT

NAME = re.compile(r"(\d{4}-\d{2}-\d{2})-([a-z0-9][a-z0-9\-]{2,70})")
DRAWINGS = (".html", ".svg")
AUDIO = (".wav", ".mp3", ".m4a")


@dataclass(frozen=True)
class Video:
    path: Path

    @property
    def name(self) -> str:
        return self.path.name

    @property
    def slug(self) -> str:
        return NAME.fullmatch(self.name).group(2)

    @property
    def brief(self) -> Path:
        return self.path / "brief.md"

    @property
    def script(self) -> Path:
        return self.path / "script.md"

    @property
    def build(self) -> Path:
        return self.path / "build"

    @property
    def thumbnail(self) -> Path:
        return self.build / "thumbnail.jpg"

    @property
    def kit(self) -> Path:
        """What to paste into YouTube Studio when the video is published by hand."""
        return self.build / "youtube.txt"

    @property
    def published(self) -> Path:
        return self.path / "published.json"

    def film(self, short: bool = False) -> Path:
        return self.build / ("short.mp4" if short else "video.mp4")

    def captions(self, short: bool = False) -> Path:
        return self.build / ("short.srt" if short else "captions.srt")

    def drawing(self, scene: str) -> Path | None:
        """The drawing of a scene, or of the thumbnail when ``scene`` is "thumbnail"."""
        folder = self.path if scene == "thumbnail" else self.path / "slides"
        return next((folder / f"{scene}{ext}" for ext in DRAWINGS if (folder / f"{scene}{ext}").is_file()), None)

    def frame(self, scene: str, short: bool = False) -> Path:
        """A scene's frame: as wide as the video, or upright for the Short."""
        return self.build / ("short-frames" if short else "frames") / f"{scene}.png"

    def voice(self, scene: str) -> Path | None:
        return next((self.path / "voice" / f"{scene}{ext}" for ext in AUDIO
                     if (self.path / "voice" / f"{scene}{ext}").is_file()), None)

    def record(self) -> dict | None:
        return json.loads(self.published.read_text(encoding="utf-8")) if self.published.is_file() else None

    def stage(self) -> str:
        """How far along it is: brief, script, rendered or published."""
        if self.published.is_file():
            return "published"
        if self.film().is_file():
            return "rendered"
        if self.script.is_file() and "TODO" not in self.script.read_text(encoding="utf-8"):
            return "script"
        return "brief"


def folder(root: Path | None = None) -> Path:
    return (root or ROOT) / "videos"


def every(root: Path | None = None) -> list[Video]:
    base = folder(root)
    return [Video(p) for p in sorted(base.iterdir()) if p.is_dir() and NAME.fullmatch(p.name)] if base.is_dir() else []


def find(name: str, root: Path | None = None) -> Video:
    """The video with this folder name, or the only one whose name has ``name`` in it."""
    videos = every(root)
    exact = [v for v in videos if v.name == name]
    matches = exact or [v for v in videos if name and name in v.name]
    if len(matches) != 1:
        raise LookupError(f"no video named {name!r}" if not matches else
                          f"{name!r} is more than one video: {', '.join(v.name for v in matches)}")
    return matches[0]


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug[:60].rstrip("-")


def new(title: str, root: Path | None = None, today: str | None = None) -> Video:
    """A new video's folder, copied from templates/video with the title filled in."""
    slug = slugify(title)
    today = today or datetime.now(timezone.utc).date().isoformat()
    name = f"{today}-{slug}"
    if not NAME.fullmatch(name):
        raise ValueError(f"{title!r} does not make a usable name; give a title of a few plain words")
    if any(v.slug == slug for v in every(root)):
        raise ValueError(f"there is already a video with the slug {slug}")
    path = folder(root) / name
    shutil.copytree((root or ROOT) / "templates" / "video", path)
    for file in path.rglob("*"):
        if file.is_file() and file.suffix in (".md", ".html", ".svg"):
            file.write_text(file.read_text(encoding="utf-8").replace("{{title}}", title), encoding="utf-8", newline="\n")
    return Video(path)
