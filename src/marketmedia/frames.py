"""Turns the drawing of each scene into its frames, and the thumbnail's into its picture, with the
Chrome on this machine.

A drawing is one file that needs nothing from the network: an HTML page that fills its window,
or an SVG with a viewBox and no width or height. The same drawing is photographed twice when its
scene is in the Short: as wide as the video (1920x1080) and upright (1080x1920), so it must read
well both ways (theme/slide.css changes the sizes when the window is upright).

A drawing moves, and it is not played and filmed: it is stopped and set to the time of each
frame, one frame after another, so the result is the same every time and no frame is dropped.
What can be set that way:

- CSS animations and transitions and the Web Animations API (the classes of theme/slide.css are
  these). Give one of your own ``animation-fill-mode: both``.
- A script of the page: ``window.slideAt = (seconds) => {...}`` draws it at a given time.
  theme/slide.js does this for the figures that count up, the presenter, the line that says how
  far into the film it is, the panel between scenes and the Short's captions.

Before any of that the page is told what its scene is, ``window.slideScene`` (see ``told``), and
``window.slideSetup()`` is called: how long the scene lasts, when each word of its narration is
said (timing.py), its voice frame by frame (mouth.py), where it falls in its film and which
series the video is of. So a slide can bring a thing in as the voice names it.

For each scene this leaves ``build/frames/<scene>/0000.jpg ...``, one picture per frame for as
long as the scene lasts, and ``build/frames/<scene>.png``, the slide as the voice ends: the one
to look at. A page that loads something slowly may set window.slideReady to a promise; nothing
is photographed before it settles.
"""

from __future__ import annotations

import os
import shutil
from collections.abc import Callable
from pathlib import Path

from . import mouth, render, timing
from .channel import ROOT, Channel
from .script import Script
from .videos import Video

THUMBNAIL = {"width": 1280, "height": 720}
THUMBNAIL_BYTES = 2 * 1024 * 1024  # YouTube's limit
MOVING_MAX = 90.0                  # seconds of one scene that are filmed, at most

# Stop every animation and say when the last one ends, in seconds.
FREEZE = """() => {
  let end = 0;
  for (const a of document.getAnimations()) {
    a.pause();
    const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().endTime : 0;
    if (Number.isFinite(t)) end = Math.max(end, t);
  }
  return Math.max(end / 1000, Number(window.slideSeconds) || 0);
}"""
# Set the page to a moment of its scene, in milliseconds.
SEEK = """(ms) => {
  for (const a of document.getAnimations()) a.currentTime = ms;
  if (typeof window.slideAt === "function") window.slideAt(ms / 1000);
}"""


def _age(path: Path) -> float:
    return path.stat().st_mtime if path.is_file() else 0.0


def _theme_age() -> float:
    """A change to the shared style redraws every frame."""
    theme = ROOT / "theme"
    return max((_age(f) for f in theme.rglob("*")), default=0.0) if theme.is_dir() else 0.0


def count(seconds: float, fps: int) -> int:
    """How many frames a scene of ``seconds`` takes."""
    return round(min(seconds, MOVING_MAX) * fps)


def told(script: Script, channel: Channel, cut: render.Cut, start: float, total: float, first: bool, last: bool,
         short: bool, voice: dict | None) -> dict:
    """What a page is told of its scene (window.slideScene)."""
    said = timing.words(cut.scene.narration, cut.spoken, voice["levels"] if voice else None, channel.fps)
    series = channel.series.get(script.series)
    return {
        "seconds": cut.seconds, "spoken": cut.spoken, "fps": channel.fps, "short": short,
        "start": start, "total": total, "first": first, "last": last,   # where it falls in its film
        "words": [{"word": w.word, "at": w.at, "end": w.end} for w in said],
        "captions": timing.lines(said, cut.seconds) if short else [],
        "voice": voice,
        "series": {"name": series.name, "accent": series.accent} if series else None,
        "episode": script.episode,
    }


def draw(video: Video, script: Script, channel: Channel, everything: bool = False,
         log: Callable[[str], None] = print) -> int:
    """Draw the frames that are missing or older than what they are made from. Returns how many
    scenes it drew."""
    wide = {"width": channel.width, "height": channel.height}
    upright = {"width": channel.short_width, "height": channel.short_height}
    # (the drawing's name, its still frame, the folder of its frames, the window, what it is told)
    wanted = []
    voices: dict[str, dict] = {}
    for short, viewport in ((False, wide), (True, upright)):
        cuts = render.plan(video, script, channel, short)
        total = sum(c.seconds for c in cuts)
        start = 0.0
        for n, cut in enumerate(cuts):
            name = cut.scene.name
            if cut.voice and name not in voices:
                voices[name] = mouth.voice(cut.voice, channel.fps)
            scene = told(script, channel, cut, start, total, n == 0, n == len(cuts) - 1, short, voices.get(name))
            wanted.append((name, video.frame(name, short), video.moving(name, short), viewport, scene))
            start += cut.seconds
    series = channel.series.get(script.series)
    wanted.append(("thumbnail", video.thumbnail, None, THUMBNAIL,   # it is told its series, for the colour and the name
                   {"series": {"name": series.name, "accent": series.accent} if series else None, "episode": script.episode}))

    # A change to the shared style, to the script or to the channel redraws every frame: a scene's
    # frames say how far into the film it is, and carry the words of its captions.
    shared = max(_theme_age(), _age(video.script), _age(ROOT / "channel.toml"))
    todo = []
    for name, target, moving, viewport, scene in wanted:
        source = video.drawing(name)
        voice = video.voice(name) if moving else None
        if source and (everything or max(_age(source), shared, _age(voice) if voice else 0.0) > _age(target)):
            todo.append((source, target, moving, viewport, scene))
    if not todo:
        return 0

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(channel=os.environ.get("MEDIA_BROWSER", "chrome"), headless=True)
        try:
            page = browser.new_page(viewport=wide, device_scale_factor=1)
            page.on("pageerror", lambda e: log(f"  page error: {e}"))
            for source, target, moving, viewport, scene in todo:
                target.parent.mkdir(parents=True, exist_ok=True)
                page.set_viewport_size(viewport)
                page.goto(source.resolve().as_uri())
                page.evaluate("async () => { await document.fonts?.ready; await window.slideReady; }")
                if scene:
                    page.evaluate("(scene) => { window.slideScene = scene; window.slideSetup?.(); }", scene)
                seconds = page.evaluate(FREEZE)
                where = target.relative_to(video.path).as_posix()
                if moving is None:  # the thumbnail: the drawing at rest, as a JPEG YouTube takes
                    page.evaluate(SEEK, seconds * 1000)
                    for quality in (90, 80, 70, 60):
                        picture = page.screenshot(type="jpeg", quality=quality)
                        if len(picture) <= THUMBNAIL_BYTES:
                            break
                    target.write_bytes(picture)
                    log(f"  {where}")
                    continue
                for word in page.evaluate("() => window.slideMissing || []"):
                    log(f"  {source.name}: waits for {word!r}, which its narration does not say")
                shutil.rmtree(moving, ignore_errors=True)
                moving.mkdir(parents=True)
                # One more than the scene takes: the film never runs out of pictures.
                for n in range(count(scene["seconds"], channel.fps) + 1):
                    page.evaluate(SEEK, min(n / channel.fps, scene["seconds"]) * 1000)
                    page.screenshot(path=str(moving / f"{n:04d}.jpg"), type="jpeg", quality=92)
                # The one to look at: the slide as the voice ends, before the next scene covers it.
                page.evaluate(SEEK, scene["spoken"] * 1000)
                page.screenshot(path=str(target), type="png")
                log(f"  {where}  {scene['seconds']:.1f}s" + (f", moving for {seconds:.1f}s" if seconds else "")
                    + ("" if scene["voice"] else ", no voice yet"))
        finally:
            browser.close()
    return len(todo)
