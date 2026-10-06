"""What every video of the channel shares: channel.toml, at the root of the repo."""

from __future__ import annotations

import os
import tomllib
from dataclasses import dataclass
from pathlib import Path

# The repo. MEDIA_ROOT moves it, for tests.
ROOT = Path(os.environ.get("MEDIA_ROOT") or Path(__file__).resolve().parents[2])


@dataclass(frozen=True)
class Channel:
    name: str
    language: str
    site: str
    width: int
    height: int
    fps: int
    words_per_minute: int
    gap_seconds: float
    category: str
    privacy: str
    made_for_kids: bool
    synthetic_media: bool
    disclaimer: str


def load(path: Path | None = None) -> Channel:
    data = tomllib.loads((path or ROOT / "channel.toml").read_text(encoding="utf-8"))
    video, youtube = data.get("video", {}), data.get("youtube", {})
    return Channel(
        name=data["name"],
        language=data.get("language", "en"),
        site=data.get("site", ""),
        width=int(video.get("width", 1920)),
        height=int(video.get("height", 1080)),
        fps=int(video.get("fps", 30)),
        words_per_minute=int(video.get("words_per_minute", 150)),
        gap_seconds=float(video.get("gap_seconds", 0.4)),
        category=str(youtube.get("category", "27")),
        privacy=youtube.get("privacy", "private"),
        made_for_kids=bool(youtube.get("made_for_kids", False)),
        synthetic_media=bool(youtube.get("synthetic_media", False)),
        disclaimer=" ".join(youtube.get("disclaimer", "").split()),
    )
