"""From the frames and the narration of each scene to the film: build/video.mp4 and its captions.

Each scene is its picture held for as long as its narration lasts, plus a short silence. A scene
with no recording yet is held for the time its words would take at the channel's pace, in
silence: the film can be watched, timed and corrected before a word is recorded.
"""

from __future__ import annotations

import re
import subprocess
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from .channel import Channel
from .script import Scene, Script
from .videos import Video

MIN_SECONDS = 2.0          # no picture is shown for less
CAPTION_CHARS = 84         # two lines of text on screen
DURATION = re.compile(r"Duration:\s*(\d+):(\d\d):(\d\d(?:\.\d+)?)")


def ffmpeg() -> str:
    """The ffmpeg that comes with the imageio-ffmpeg package: nothing to install on the machine."""
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def length(path: Path) -> float:
    """How long a sound file lasts, in seconds."""
    out = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path)], capture_output=True, text=True, errors="replace").stderr
    found = DURATION.search(out)
    if not found:
        raise ValueError(f"{path.name}: could not read how long it lasts")
    hours, minutes, seconds = found.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


@dataclass(frozen=True)
class Cut:
    """One scene in the film."""
    scene: Scene
    voice: Path | None   # its narration, when it is recorded
    spoken: float        # how long the narration lasts, or would
    seconds: float       # how long the picture is held: the narration and the silence after it


def spoken(scene: Scene, words_per_minute: int) -> float:
    """How long a scene with no recording is held."""
    if scene.seconds:
        return scene.seconds
    return max(MIN_SECONDS, scene.words / words_per_minute * 60)


def plan(video: Video, script: Script, channel: Channel, measure: Callable[[Path], float] = length) -> list[Cut]:
    cuts = []
    for scene in script.scenes:
        voice = video.voice(scene.name)
        said = measure(voice) if voice else spoken(scene, channel.words_per_minute)
        cuts.append(Cut(scene, voice, said, said + channel.gap_seconds))
    return cuts


def _lines(text: str) -> list[str]:
    """The narration cut into captions: a sentence each, and a long sentence in several."""
    out: list[str] = []
    for sentence in re.split(r"(?<=[.!?…])\s+", " ".join(text.split())):
        line = ""
        for word in sentence.split():
            if line and len(line) + 1 + len(word) > CAPTION_CHARS:
                out.append(line)
                line = word
            else:
                line = f"{line} {word}".strip()
        if line:
            out.append(line)
    return out


def _stamp(seconds: float) -> str:
    ms = round(seconds * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def captions(cuts: list[Cut]) -> str:
    """The captions as an SRT file. Within a scene, each line gets time by its share of the text."""
    blocks: list[str] = []
    start = 0.0
    for cut in cuts:
        lines = _lines(cut.scene.narration)
        total = sum(len(line) for line in lines)
        at = start
        for line in lines:
            end = at + cut.spoken * len(line) / total
            blocks.append(f"{len(blocks) + 1}\n{_stamp(at)} --> {_stamp(end)}\n{line}\n")
            at = end
        start += cut.seconds
    return "\n".join(blocks)


def _run(args: list[str]) -> None:
    done = subprocess.run(args, capture_output=True, text=True, errors="replace")
    if done.returncode:
        raise RuntimeError(f"ffmpeg failed: {done.stderr.strip()[-600:]}")


def film(video: Video, script: Script, channel: Channel, log: Callable[[str], None] = print) -> Path:
    """Make build/video.mp4 and build/captions.srt. The frames must be drawn already (frames.py)."""
    cuts = plan(video, script, channel)
    missing = [c.scene.name for c in cuts if not video.frame(c.scene.name).is_file()]
    if missing:
        raise FileNotFoundError(f"no frame for: {', '.join(missing)}")
    parts = video.build / "parts"
    parts.mkdir(parents=True, exist_ok=True)
    tool = ffmpeg()
    for cut in cuts:
        sound = ["-i", str(cut.voice), "-af", "apad"] if cut.voice else ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]
        _run([tool, "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(channel.fps),
              "-i", str(video.frame(cut.scene.name)), *sound, "-t", f"{cut.seconds:.3f}",
              "-vf", f"scale={channel.width}:{channel.height}", "-c:v", "libx264", "-tune", "stillimage",
              "-pix_fmt", "yuv420p", "-r", str(channel.fps), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
              str(parts / f"{cut.scene.name}.mp4")])
        log(f"  {cut.scene.name}  {cut.seconds:5.1f}s  {'voice' if cut.voice else 'silent'}")
    order = video.build / "parts.txt"
    order.write_text("".join(f"file 'parts/{c.scene.name}.mp4'\n" for c in cuts), encoding="utf-8", newline="\n")
    _run([tool, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(order),
          "-c", "copy", "-movflags", "+faststart", str(video.film)])
    video.captions.write_text(captions(cuts), encoding="utf-8", newline="\n")
    return video.film
