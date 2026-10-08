"""What every video of the channel shares: channel.toml, at the root of the repo."""

from __future__ import annotations

import os
import tomllib
from dataclasses import dataclass
from pathlib import Path

# The repo. MEDIA_ROOT moves it, for tests.
ROOT = Path(os.environ.get("MEDIA_ROOT") or Path(__file__).resolve().parents[2])


@dataclass(frozen=True)
class Series:
    """A run of videos on one subject, with a look of its own: a playlist on YouTube."""
    slug: str
    name: str
    tagline: str
    accent: str      # its colour on every slide
    playlist: str    # the playlist's address on YouTube, once it exists


@dataclass(frozen=True)
class Shared:
    """A scene every video of the channel has: its intro or its outro. Its drawing is
    channel/<name>.html and its narration channel/voice/<name>.wav, made once for all of them."""
    name: str          # "intro" or "outro"
    scene: str         # its name as a scene of a film: 00-intro, 99-outro
    narration: str
    after: int         # the intro: how many of the video's own scenes play before it (0 opens the video)
    seconds: float     # the outro: held at least this long, for YouTube's end screen

    @property
    def drawing(self) -> Path:
        return ROOT / "channel" / f"{self.name}.html"


SHARED = {"00-intro": "intro", "99-outro": "outro"}   # the scene names no script may use


@dataclass(frozen=True)
class Channel:
    name: str
    language: str
    site: str
    # The video
    width: int
    height: int
    fps: int
    minutes: tuple[float, float]
    trailer_seconds: tuple[float, float]
    words_per_minute: int
    gap_seconds: float
    # The Short
    short_width: int
    short_height: int
    short_seconds: tuple[float, float]
    # The narration
    voice_name: str
    voice_language: str
    voice_rate: float
    # YouTube
    category: str
    privacy: str
    made_for_kids: bool
    synthetic_media: bool
    disclaimer: str
    series: dict[str, Series]
    intro: Shared | None = None
    outro: Shared | None = None
    # Instagram
    instagram_handle: str = ""
    instagram_bucket: str = ""   # where a film is parked while Instagram fetches it


def _range(value, default: tuple[float, float]) -> tuple[float, float]:
    low, high = value if value else default
    return float(low), float(high)


def _shared(data: dict, name: str, scene: str) -> Shared | None:
    said = " ".join(str(data.get(name, {}).get("narration", "")).split())
    if not said:
        return None
    return Shared(name, scene, said, int(data[name].get("after", 0)), float(data[name].get("seconds", 0)))


def load(path: Path | None = None) -> Channel:
    data = tomllib.loads((path or ROOT / "channel.toml").read_text(encoding="utf-8"))
    video, short, voice, youtube, instagram = (data.get(k, {}) for k in ("video", "short", "voice", "youtube", "instagram"))
    return Channel(
        name=data["name"],
        language=data.get("language", "en"),
        site=data.get("site", ""),
        width=int(video.get("width", 1920)),
        height=int(video.get("height", 1080)),
        fps=int(video.get("fps", 30)),
        minutes=_range(video.get("minutes"), (4, 6)),
        trailer_seconds=_range(data.get("trailer", {}).get("seconds"), (30, 90)),
        words_per_minute=int(video.get("words_per_minute", 150)),
        gap_seconds=float(video.get("gap_seconds", 0.4)),
        short_width=int(short.get("width", 1080)),
        short_height=int(short.get("height", 1920)),
        short_seconds=_range(short.get("seconds"), (30, 60)),
        voice_name=voice.get("name", ""),
        voice_language=voice.get("language", "en-US"),
        voice_rate=float(voice.get("rate", 1.0)),
        category=str(youtube.get("category", "27")),
        privacy=youtube.get("privacy", "private"),
        made_for_kids=bool(youtube.get("made_for_kids", False)),
        synthetic_media=bool(youtube.get("synthetic_media", False)),
        disclaimer=" ".join(youtube.get("disclaimer", "").split()),
        series={slug: Series(slug, s.get("name", slug), s.get("tagline", ""), s.get("accent", ""), s.get("playlist", ""))
                for slug, s in data.get("series", {}).items()},
        intro=_shared(data, "intro", "00-intro"),
        outro=_shared(data, "outro", "99-outro"),
        instagram_handle=instagram.get("handle", ""),
        instagram_bucket=instagram.get("bucket", ""),
    )
