"""The launch film for X: big words over made-up lines, and the logo. Nothing of the app is shown.

    python film.py sound     play the score (sound.js) into build/sound.wav
    python film.py film      draw every frame of film.html and put the sound under it: build/film.mp4
    python film.py sheet     a few frames side by side, to look the film over: build/sheet.jpg
    python film.py cover     the frame that stands for it: build/cover.jpg

It is not a video of the channel (no presenter, no slides, no voice) and not the teaser of
2026-10-13, which shows the site: this one only promises it. Its pipeline is the teaser's
(2026-10-13-web-teaser/reel.py) without the photographs: the motion is computed frame by frame,
and the sound is synthesised here, with no recording and no music of anyone's.
"""

from __future__ import annotations

import base64
import shutil
import subprocess
import sys
import wave
from array import array
from pathlib import Path

from playwright.sync_api import sync_playwright

from marketmedia import render
from marketmedia.frames import FREEZE, SEEK

HERE = Path(__file__).resolve().parent
SIZE = {"width": 1080, "height": 1080}
FPS = 30
RATE = 48000
PEAK = 0.89
COVER_AT = 15.9   # the close, whole: the logo, the name, the three lines and the address
BUILD = HERE / "build"


def _page(play):
    browser = play.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport=SIZE, device_scale_factor=1)
    page.on("pageerror", lambda error: print(f"  page error: {error}"))
    page.goto((HERE / "film.html").as_uri())
    page.evaluate("async () => { await document.fonts?.ready; await window.reelReady; }")
    return browser, page, page.evaluate(FREEZE)


def sound() -> Path:
    """sound.js played by Chrome into a file: 16-bit stereo."""
    BUILD.mkdir(exist_ok=True)
    out = BUILD / "sound.wav"
    with sync_playwright() as play:
        browser = play.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page()
        page.on("pageerror", lambda error: print(f"  page error: {error}"))
        page.goto((HERE / "sound.html").as_uri())
        played = page.evaluate("(rate) => window.play(rate)", RATE)
        browser.close()
    left, right = (array("f", base64.b64decode(played[side])) for side in ("left", "right"))
    peak = max(max(map(abs, left)), max(map(abs, right)))
    gain = PEAK / peak                                   # as loud as it goes without clipping
    samples = array("h", [0]) * (2 * len(left))
    samples[0::2] = array("h", (int(v * gain * 32767) for v in left))
    samples[1::2] = array("h", (int(v * gain * 32767) for v in right))
    with wave.open(str(out), "wb") as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(samples.tobytes())
    # Loudness by second, to read what cannot be heard here.
    by_second = []
    for second in range(len(left) // RATE):
        part = left[second * RATE:(second + 1) * RATE]
        by_second.append(round(gain * (sum(v * v for v in part) / len(part)) ** 0.5, 2))
    print(f"sound: {len(left) / RATE:.2f} s, peak {peak:.2f} brought to {PEAK}, loudness by second {by_second}")
    return out


def film() -> None:
    frames = BUILD / "frames"
    shutil.rmtree(frames, ignore_errors=True)
    frames.mkdir(parents=True)
    with sync_playwright() as play:
        browser, page, seconds = _page(play)
        count = round(seconds * FPS)
        for n in range(count):
            page.evaluate(SEEK, n / FPS * 1000)
            page.screenshot(path=str(frames / f"{n:04d}.jpg"), type="jpeg", quality=95)
        browser.close()
    print(f"film: {count} frames, {seconds:.2f} s")
    track = BUILD / "sound.wav"
    out = BUILD / "film.mp4"
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(frames / "%04d.jpg"),
                    *(["-i", str(track)] if track.exists() else []),
                    # The frames are JPEGs, full range: the film is given the range and the colours a phone expects.
                    "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p",
                    "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-r", str(FPS),
                    *(["-c:a", "aac", "-b:a", "192k"] if track.exists() else []),
                    "-t", f"{seconds:.3f}", "-movflags", "+faststart", str(out)], check=True)
    shutil.rmtree(frames)
    print(f"film: {out.relative_to(HERE)} ({out.stat().st_size / 1e6:.1f} MB)")


def stills(times: list[float]) -> list[Path]:
    BUILD.mkdir(exist_ok=True)
    out = []
    with sync_playwright() as play:
        browser, page, seconds = _page(play)
        times = times or [n * seconds / 12 + seconds / 24 for n in range(12)]
        for n, t in enumerate(times):
            page.evaluate(SEEK, t * 1000)
            still = BUILD / f"still-{n:02d}.jpg"
            page.screenshot(path=str(still), type="jpeg", quality=90)
            out.append(still)
        browser.close()
    return out


def sheet(times: list[float]) -> None:
    """Frames of the film as it is drawn now, side by side and small."""
    shots = stills(times)
    out = BUILD / "sheet.jpg"
    inputs = [arg for still in shots for arg in ("-i", str(still))]
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", *inputs, "-filter_complex",
                    "".join(f"[{n}:v]scale=360:360[s{n}];" for n in range(len(shots)))
                    + "".join(f"[s{n}]" for n in range(len(shots))) + f"xstack=inputs={len(shots)}:fill=black:layout="
                    + "|".join(f"{(n % 4) * 364}_{(n // 4) * 364}" for n in range(len(shots))),
                    "-frames:v", "1", "-update", "1", str(out)], check=True)
    for still in shots:
        still.unlink()
    print(f"sheet: {out.relative_to(HERE)}")


def cover() -> None:
    [still] = stills([COVER_AT])
    still.replace(BUILD / "cover.jpg")
    print(f"cover: build/cover.jpg at {COVER_AT} s")


if __name__ == "__main__":
    command, rest = (sys.argv[1] if len(sys.argv) > 1 else ""), sys.argv[2:]
    if command == "sound":
        sound()
    elif command == "film":
        film()
    elif command == "sheet":
        sheet([float(t) for t in rest])
    elif command == "cover":
        cover()
    else:
        sys.exit(__doc__)
