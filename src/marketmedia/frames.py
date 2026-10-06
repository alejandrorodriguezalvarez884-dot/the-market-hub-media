"""Turns the drawing of each scene into its frame, and the thumbnail's into its picture, with the
Chrome on this machine.

A drawing is one file that needs nothing from the network: an HTML page that fills its window
(16:9), or an SVG with viewBox="0 0 1920 1080" and no width or height. A page that draws with a
script may set window.slideReady to a promise; the picture is taken when it settles.
"""

from __future__ import annotations

import os
from collections.abc import Callable
from pathlib import Path

from .channel import ROOT, Channel
from .script import Script
from .videos import Video

THUMBNAIL = {"width": 1280, "height": 720}
THUMBNAIL_BYTES = 2 * 1024 * 1024  # YouTube's limit


def _age(path: Path) -> float:
    return path.stat().st_mtime if path.is_file() else 0.0


def _theme_age() -> float:
    """A change to the shared style redraws every frame."""
    theme = ROOT / "theme"
    return max((_age(f) for f in theme.rglob("*")), default=0.0) if theme.is_dir() else 0.0


def draw(video: Video, script: Script, channel: Channel, everything: bool = False,
         log: Callable[[str], None] = print) -> int:
    """Draw the frames that are missing or older than their drawing. Returns how many it drew."""
    theme = _theme_age()
    todo: list[tuple[Path, Path, dict]] = []
    size = {"width": channel.width, "height": channel.height}
    for name, target, viewport in [(s.name, video.frame(s.name), size) for s in script.scenes] + \
                                  [("thumbnail", video.thumbnail, THUMBNAIL)]:
        source = video.drawing(name)
        if source and (everything or max(_age(source), theme) > _age(target)):
            todo.append((source, target, viewport))
    if not todo:
        return 0

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(channel=os.environ.get("MEDIA_BROWSER", "chrome"), headless=True)
        try:
            page = browser.new_page(viewport=size, device_scale_factor=1)
            page.on("pageerror", lambda e: log(f"  page error: {e}"))
            for source, target, viewport in todo:
                target.parent.mkdir(parents=True, exist_ok=True)
                page.set_viewport_size(viewport)
                page.goto(source.resolve().as_uri())
                page.evaluate("async () => { await document.fonts?.ready; await window.slideReady; }")
                page.wait_for_timeout(200)
                if target.suffix == ".png":
                    page.screenshot(path=str(target), type="png")
                else:
                    for quality in (90, 80, 70, 60):
                        picture = page.screenshot(type="jpeg", quality=quality)
                        if len(picture) <= THUMBNAIL_BYTES:
                            break
                    target.write_bytes(picture)
                log(f"  {target.relative_to(video.path).as_posix()}")
        finally:
            browser.close()
    return len(todo)
