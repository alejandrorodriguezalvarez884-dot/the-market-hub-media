"""Turns the drawing of each scene into its frames, and the thumbnail's into its picture, with the
Chrome on this machine.

A drawing is one file that needs nothing from the network: an HTML page that fills its window,
or an SVG with a viewBox and no width or height. The same drawing is photographed twice when its
scene is in the Short: as wide as the video (1920x1080) and upright (1080x1920), so it must read
well both ways (theme/slide.css changes the sizes when the window is upright).

A drawing may move. Its animations are not played and filmed: they are stopped and set to the
time of each frame, one frame after another, so the result is the same every time and no frame
is dropped. What can be set that way:

- CSS animations and transitions and the Web Animations API (the classes of theme/slide.css are
  these). They run once; give one of your own ``animation-fill-mode: both``.
- A script of the page: it sets ``window.slideSeconds`` to how long it moves and
  ``window.slideAt = (seconds) => {...}`` to draw itself at a given time (theme/slide.js does
  this for the figures that count up).
- The presenter (theme/slide.js): his mouth follows the scene's voice for as long as it lasts.
  The page is handed how open the mouth is at each frame (``window.slideVoice``, from mouth.py)
  and says, with ``window.slideKey(seconds)``, which of his few faces a frame shows: once the
  rest of the slide is still, each face is photographed once and used for every frame it is in.

For each scene this leaves ``build/frames/<scene>/0000.jpg ...`` while something moves, and
``build/frames/<scene>.png``, the slide once everything has come to rest. A page that loads
something slowly may set window.slideReady to a promise; nothing is photographed before it settles.
"""

from __future__ import annotations

import os
import shutil
from collections.abc import Callable
from pathlib import Path

from . import mouth
from .channel import ROOT, Channel
from .script import Script
from .videos import Video

THUMBNAIL = {"width": 1280, "height": 720}
THUMBNAIL_BYTES = 2 * 1024 * 1024  # YouTube's limit
MOVING_MAX = 60.0                  # seconds of movement filmed in one scene, at most

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
    """How many frames a movement of ``seconds`` takes."""
    return round(min(seconds, MOVING_MAX) * fps)


def draw(video: Video, script: Script, channel: Channel, everything: bool = False,
         log: Callable[[str], None] = print) -> int:
    """Draw the frames that are missing or older than their drawing. Returns how many scenes it drew."""
    wide = {"width": channel.width, "height": channel.height}
    upright = {"width": channel.short_width, "height": channel.short_height}
    # (the drawing's name, its still frame, the folder of its moving frames, the window)
    wanted = [(s.name, video.frame(s.name), video.moving(s.name), wide) for s in script.scenes]
    wanted += [(s.name, video.frame(s.name, True), video.moving(s.name, True), upright) for s in script.cut(short=True)]
    wanted.append(("thumbnail", video.thumbnail, None, THUMBNAIL))

    theme = _theme_age()
    todo = []
    for name, target, moving, viewport in wanted:
        source = video.drawing(name)
        voice = video.voice(name) if moving else None
        # A new voice redraws the scene: the presenter speaks with it.
        if source and (everything or max(_age(source), theme, _age(voice) if voice else 0.0) > _age(target)):
            todo.append((source, target, moving, viewport, voice))
    if not todo:
        return 0

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(channel=os.environ.get("MEDIA_BROWSER", "chrome"), headless=True)
        try:
            page = browser.new_page(viewport=wide, device_scale_factor=1)
            page.on("pageerror", lambda e: log(f"  page error: {e}"))
            for source, target, moving, viewport, voice in todo:
                target.parent.mkdir(parents=True, exist_ok=True)
                page.set_viewport_size(viewport)
                page.goto(source.resolve().as_uri())
                page.evaluate("async () => { await document.fonts?.ready; await window.slideReady; }")
                seconds = page.evaluate(FREEZE)
                # With a presenter and a voice, the scene moves for as long as he speaks.
                speaks = 0.0
                if voice and page.evaluate("() => typeof window.slideKey === 'function'"):
                    levels = mouth.of(voice, channel.fps)
                    page.evaluate("(voice) => { window.slideVoice = voice; }", {"fps": channel.fps, "levels": levels})
                    speaks = len(levels) / channel.fps
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
                shutil.rmtree(moving, ignore_errors=True)
                whole = max(seconds, speaks)
                frames = count(whole, channel.fps)
                faces: dict[str, Path] = {}  # the presenter's faces already photographed
                if frames:
                    moving.mkdir(parents=True)
                    # One more than the movement takes: the last picture is the slide at rest, which
                    # is the one the film holds until the scene ends.
                    for n in range(frames + 1):
                        at = min(n / channel.fps, whole)
                        picture = moving / f"{n:04d}.jpg"
                        face = page.evaluate("(s) => window.slideKey(s)", at) if speaks and at > seconds else None
                        if face in faces:
                            shutil.copyfile(faces[face], picture)
                            continue
                        page.evaluate(SEEK, at * 1000)
                        page.screenshot(path=str(picture), type="jpeg", quality=95)
                        if face:
                            faces[face] = picture
                page.evaluate(SEEK, whole * 1000)
                page.screenshot(path=str(target), type="png")
                log(f"  {where}" + (f"  moves for {seconds:.1f}s" if seconds else "")
                    + (f"  speaks for {speaks:.1f}s" if speaks else ""))
        finally:
            browser.close()
    return len(todo)
