"""What every video of the channel shares: channel.toml, at the root of the repo."""

from __future__ import annotations

import os
import tomllib
from dataclasses import dataclass, replace
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
    # X
    x_handle: str = ""
    # The daily reels (reels.py): their own language, length, pace and voice
    reel_language: str = "es"
    reel_seconds: tuple[float, float] = (40.0, 120.0)
    reel_asked_seconds: tuple[float, float] = (40.0, 180.0)   # a reel the owner asks for, not a daily one
    reel_words_per_minute: int = 175
    reel_gap_seconds: float = 0.2
    reel_voice_name: str = ""
    reel_voice_language: str = "es-ES"
    reel_voice_rate: float = 1.0
    reel_disclaimer: str = ""
    # Who speaks: "google" (Cloud Text-to-Speech, [voice]) or "elevenlabs" (the reels, [reel])
    voice_engine: str = "google"
    voice_model: str = ""                  # ElevenLabs' model, like eleven_multilingual_v2
    voice_settings: tuple = ()             # ElevenLabs' voice settings, as (name, value) pairs
    voice_cue: str = ""                    # ElevenLabs v3: how to say it, in brackets before each scene
    voice_pause: float = 0.0               # the longest pause inside a scene, in seconds (0: as the voice says it)
    voice_sentence_gap: float = 0.0        # ElevenLabs: each sentence said on its own and this silence between them (0: the scene in one go)
    voice_sentence_pause: float = 0.0      # ElevenLabs: the scene in one go, each pause at a sentence's end made at least this long
    reel_voice_engine: str = "google"
    reel_voice_model: str = ""
    reel_voice_settings: tuple = ()
    reel_voices: tuple = ()                # (name, voice, model, settings, cue, longest pause, sentence gap, sentence pause): other voices a reel may ask for

    def reel_voice_names(self) -> list[str]:
        return [name for name, *_ in self.reel_voices]

    def for_reels(self, voice: str = "") -> "Channel":
        """The channel as a reel sees it: its voice, its language and its pace. ``voice`` names
        another of [reel.voices] (a script's "voice:"), for a reel that is not a daily one."""
        if voice:
            found = [v for v in self.reel_voices if v[0] == voice]
            if not found:
                raise ValueError(f"'voice: {voice}' is not one of [reel.voices] in channel.toml"
                                 + (f" ({', '.join(self.reel_voice_names())})" if self.reel_voices else ""))
            _, name, model, settings, cue, pause, gap, stop = found[0]
            return replace(self.for_reels(), voice_name=name, voice_model=model or self.reel_voice_model,
                           voice_settings=settings, voice_cue=cue, voice_pause=pause, voice_sentence_gap=gap,
                           voice_sentence_pause=stop)
        return replace(self, language=self.reel_language, words_per_minute=self.reel_words_per_minute,
                       gap_seconds=self.reel_gap_seconds, voice_name=self.reel_voice_name,
                       voice_language=self.reel_voice_language, voice_rate=self.reel_voice_rate,
                       voice_engine=self.reel_voice_engine, voice_model=self.reel_voice_model,
                       voice_settings=self.reel_voice_settings,
                       short_seconds=self.reel_seconds, disclaimer=self.reel_disclaimer or self.disclaimer,
                       intro=None, outro=None)


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
    video, short, voice, youtube, instagram, x, reel = (data.get(k, {}) for k in ("video", "short", "voice", "youtube", "instagram", "x", "reel"))
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
        x_handle=x.get("handle", ""),
        reel_language=reel.get("language", "es"),
        reel_seconds=_range(reel.get("seconds"), (40, 120)),
        reel_asked_seconds=_range(reel.get("asked_seconds"), (40, 180)),
        reel_words_per_minute=int(reel.get("words_per_minute", 175)),
        reel_gap_seconds=float(reel.get("gap_seconds", 0.2)),
        reel_voice_name=reel.get("voice", ""),
        reel_voice_language=reel.get("voice_language", "es-ES"),
        reel_voice_rate=float(reel.get("rate", 1.0)),
        reel_disclaimer=" ".join(str(reel.get("disclaimer", "")).split()),
        reel_voice_engine=reel.get("engine", "google"),
        reel_voice_model=reel.get("model", ""),
        reel_voice_settings=tuple(sorted(reel.get("settings", {}).items())),
        reel_voices=tuple((name, v.get("voice", ""), v.get("model", ""), tuple(sorted(v.get("settings", {}).items())), v.get("cue", ""),
                           float(v.get("longest_pause", 0)), float(v.get("sentence_gap", 0)),
                           float(v.get("sentence_pause", 0)))
                          for name, v in reel.get("voices", {}).items()),
    )
