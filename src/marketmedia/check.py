"""What stops a video from being published: its script, its drawings and how long it runs.

It catches what is plain to a machine. It does not replace watching the film.
"""

from __future__ import annotations

import re

from . import render, youtube
from . import script as scripts
from .channel import Channel
from .videos import DRAWINGS, Video

# A drawing is one file that needs nothing from the network.
REMOTE = re.compile(r"""(src|href)\s*=\s*["']?\s*(https?:)?//|url\(\s*["']?\s*(https?:)?//|@import""", re.I)


def _clock(seconds: float) -> str:
    return f"{int(seconds) // 60}:{int(seconds) % 60:02d}"


def problems(video: Video, channel: Channel) -> list[str]:
    """Empty when nothing stops this video from being published."""
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
    for file in drawings.values():
        if not file:
            continue
        text = file.read_text(encoding="utf-8")
        where = file.relative_to(video.path).as_posix()
        if REMOTE.search(text):
            found.append(f"{where} loads something from the network")
        if "TODO" in text:
            found.append(f"{where} still has TODO in it")

    # How long each runs: with the narration that is made, and the channel's pace for the rest.
    if script.scenes:
        seconds = sum(c.seconds for c in render.plan(video, script, channel))
        low, high = (m * 60 for m in channel.minutes)
        if not low <= seconds <= high:
            found.append(f"the video runs {_clock(seconds)}; the channel's videos run {_clock(low)} to {_clock(high)}")
    if script.cut(short=True):
        seconds = sum(c.seconds for c in render.plan(video, script, channel, short=True))
        low, high = channel.short_seconds
        if not low <= seconds <= high:
            found.append(f"the Short runs {_clock(seconds)}; a Short runs {_clock(low)} to {_clock(high)}")
    return found
