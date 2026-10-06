"""How open the presenter's mouth is at each frame of a scene, read from the sound of its narration.

The presenter is a drawing (theme/presenter.js): it has no lips to match to words. Its mouth
follows the voice frame by frame: how loud it is opens it, and how sharp it is (an s, an f, a
sh: sound that crosses zero many times) closes it on the teeth. That is enough for a drawn face
to look like it is the one speaking.
"""

from __future__ import annotations

import array
import math
import subprocess
from pathlib import Path

RATE = 16000    # samples a second the sound is read at
SILENCE = 150   # below this (of 32768) there is nobody speaking
SHARP = (0.12, 0.4)  # the share of samples that cross zero: a vowel is under the first, a hiss over the second


def levels(samples: bytes, rate: int, fps: int) -> list[float]:
    """From 16-bit mono sound to one number per frame, 0 (closed) to 1 (as open as it gets)."""
    sound = array.array("h")
    sound.frombytes(samples[: len(samples) // 2 * 2])
    frames = math.ceil(len(sound) * fps / rate)
    loud = []
    for n in range(frames):
        piece = sound[n * rate // fps: (n + 1) * rate // fps]
        loud.append(math.sqrt(sum(x * x for x in piece) / len(piece)) if piece else 0.0)
    # The voice at its loudest, leaving out the odd peak: that is a mouth wide open.
    top = sorted(loud)[int(len(loud) * 0.95)] if loud else 0.0
    if top < SILENCE:
        return [0.0] * frames
    open_ = [0.0 if v < SILENCE else min(1.0, v / top) for v in loud]
    # A mouth does not flap from one frame to the next: each frame leans on its neighbours.
    last = frames - 1
    return [round((open_[max(n - 1, 0)] + 2 * open_[n] + open_[min(n + 1, last)]) / 4, 3) for n in range(frames)]


def sharpness(samples: bytes, rate: int, fps: int) -> list[float]:
    """From 16-bit mono sound to one number per frame: 0 for a vowel, 1 for a hiss."""
    sound = array.array("h")
    sound.frombytes(samples[: len(samples) // 2 * 2])
    out = []
    for n in range(math.ceil(len(sound) * fps / rate)):
        piece = sound[n * rate // fps: (n + 1) * rate // fps]
        crossings = sum((a < 0) != (b < 0) for a, b in zip(piece, piece[1:])) / max(1, len(piece) - 1)
        out.append(round(min(1.0, max(0.0, (crossings - SHARP[0]) / (SHARP[1] - SHARP[0]))), 3))
    return out


def _read(sound: Path) -> bytes:
    from .render import ffmpeg
    done = subprocess.run([ffmpeg(), "-v", "error", "-i", str(sound), "-f", "s16le", "-ac", "1", "-ar", str(RATE), "-"],
                          capture_output=True)
    if done.returncode:
        raise ValueError(f"{sound.name}: could not read its sound")
    return done.stdout


def of(sound: Path, fps: int) -> list[float]:
    """The mouth for each frame of a sound file."""
    return levels(_read(sound), RATE, fps)


def voice(sound: Path, fps: int) -> dict:
    """What the page is told of a scene's voice: how loud and how sharp it is at each frame."""
    samples = _read(sound)
    return {"fps": fps, "levels": levels(samples, RATE, fps), "sharp": sharpness(samples, RATE, fps)}
