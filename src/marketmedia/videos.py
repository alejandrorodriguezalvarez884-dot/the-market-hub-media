"""A video: a folder in videos/, named by its date and its slug.

    videos/2026-10-06-what-a-buyback-does/
        brief.md            the idea studied: the angle, the facts and where each comes from
        script.md           what is said, scene by scene (see script.py)
        slides/01-hook.html the picture of each scene, drawn as code
        thumbnail.html      the picture YouTube shows for the video
        voice/01-hook.wav   the narration of each scene, when there is one (not in git)
        build/              what all of it is made into (not in git)
        published.json      where it is on YouTube, once it is there
"""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from . import script as scripts
from . import youtube
from .channel import ROOT, Channel

NAME = re.compile(r"(\d{4}-\d{2}-\d{2})-([a-z0-9][a-z0-9\-]{2,70})")
DRAWINGS = (".html", ".svg")
AUDIO = (".wav", ".mp3", ".m4a")
# A drawing is one file that needs nothing from the network.
REMOTE = re.compile(r"""(src|href)\s*=\s*["']?\s*(https?:)?//|url\(\s*["']?\s*(https?:)?//|@import""", re.I)


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
    def film(self) -> Path:
        return self.build / "video.mp4"

    @property
    def captions(self) -> Path:
        return self.build / "captions.srt"

    @property
    def thumbnail(self) -> Path:
        return self.build / "thumbnail.jpg"

    @property
    def published(self) -> Path:
        return self.path / "published.json"

    def drawing(self, scene: str) -> Path | None:
        """The drawing of a scene, or of the thumbnail when ``scene`` is "thumbnail"."""
        folder = self.path if scene == "thumbnail" else self.path / "slides"
        return next((folder / f"{scene}{ext}" for ext in DRAWINGS if (folder / f"{scene}{ext}").is_file()), None)

    def frame(self, scene: str) -> Path:
        return self.build / "frames" / f"{scene}.png"

    def voice(self, scene: str) -> Path | None:
        return next((self.path / "voice" / f"{scene}{ext}" for ext in AUDIO
                     if (self.path / "voice" / f"{scene}{ext}").is_file()), None)

    def record(self) -> dict | None:
        return json.loads(self.published.read_text(encoding="utf-8")) if self.published.is_file() else None

    def stage(self) -> str:
        """How far along it is: brief, script, rendered or published."""
        if self.published.is_file():
            return "published"
        if self.film.is_file():
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


def check(video: Video, channel: Channel) -> list[str]:
    """What stops this video from being published. Empty when nothing does."""
    if not video.script.is_file():
        return ["no script.md"]
    try:
        script = scripts.load(video.script)
    except scripts.Invalid as exc:
        return [str(exc)]
    found = scripts.problems(script)

    length = len(youtube.description(script, channel))
    if length > youtube.DESCRIPTION_MAX:
        found.append(f"the description, with its sources and the notice, has {length} characters; "
                     f"YouTube takes {youtube.DESCRIPTION_MAX}")

    drawings = {"thumbnail": video.drawing("thumbnail")}
    if not drawings["thumbnail"]:
        found.append("no thumbnail.html (or .svg)")
    for scene in script.scenes:
        drawings[scene.name] = video.drawing(scene.name)
        if not drawings[scene.name]:
            found.append(f"scene {scene.name}: no drawing in slides/")
    scenes = {s.name for s in script.scenes}
    slides = video.path / "slides"
    for file in sorted(slides.iterdir()) if slides.is_dir() else []:
        if file.suffix in DRAWINGS and file.stem not in scenes:
            found.append(f"slides/{file.name} belongs to no scene")
    for name, file in drawings.items():
        if not file:
            continue
        text = file.read_text(encoding="utf-8")
        where = file.relative_to(video.path).as_posix()
        if REMOTE.search(text):
            found.append(f"{where} loads something from the network")
        if "TODO" in text:
            found.append(f"{where} still has TODO in it")
    return found
