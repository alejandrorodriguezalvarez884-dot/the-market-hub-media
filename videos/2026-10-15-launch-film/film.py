"""The launch film: the takes of takes.py, put together by film.html, with the sound of sound.js.

    python film.py sheet [SECONDS ...]      frames of the film as it is drawn now, side by side: build/sheet.jpg
    python film.py still SECONDS            one frame, full size: build/still.png
    python film.py sound                    play the score into build/sound.wav
    python film.py film                     every frame, and the sound under them: build/film.mp4
    python film.py cover                    the thumbnail: build/cover.jpg

Add --v to any of them for the upright cut (1080 by 1920; build/upright-*).

It is not a video of the channel (CLAUDE.md, "Una demo de la app no es un vídeo del canal"): no
presenter, no slides, no voice. What is seen of the site is the site, recorded; the words, the
drawings and the moves are computed frame by frame, the same in every render.
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

HERE = Path(__file__).resolve().parent
BUILD = HERE / "build"
FPS = 30
RATE = 48000
PEAK = 0.89


def _page(play, upright: bool):
    size = {"width": 1080, "height": 1920} if upright else {"width": 1920, "height": 1080}
    browser = play.chromium.launch(channel="chrome", headless=True, args=["--autoplay-policy=no-user-gesture-required"])
    page = browser.new_page(viewport=size, device_scale_factor=1)
    page.on("pageerror", lambda error: print(f"  page error: {error}"))
    page.on("console", lambda msg: msg.type == "error" and print(f"  console: {msg.text}"))
    page.goto((HERE / "film.html").as_uri() + ("?v" if upright else ""))
    total = page.evaluate("async () => await window.filmReady")
    return browser, page, total


def _name(upright: bool, what: str) -> Path:
    return BUILD / (f"upright-{what}" if upright else what)


def sheet(times: list[float], upright: bool) -> None:
    BUILD.mkdir(exist_ok=True)
    with sync_playwright() as play:
        browser, page, total = _page(play, upright)
        times = times or [n * total / 18 + total / 36 for n in range(18)]
        stills = []
        for n, t in enumerate(times):
            page.evaluate("(t) => window.seekTo(t)", t)
            still = BUILD / f"sheet-{n:02d}.jpg"
            page.screenshot(path=str(still), type="jpeg", quality=85)
            stills.append(still)
        browser.close()
    cols = 6 if upright else 4
    w, h = (270, 480) if upright else (480, 270)
    inputs = [arg for still in stills for arg in ("-i", str(still))]
    labels = "".join(f"[{n}:v]scale={w}:{h},drawtext=text='{t:.2f}':x=8:y=8:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6[s{n}];"
                     for n, t in enumerate(times))
    layout = "|".join(f"{(n % cols) * (w + 4)}_{(n // cols) * (h + 4)}" for n in range(len(stills)))
    out = _name(upright, "sheet.jpg")
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", *inputs, "-filter_complex",
                    labels + "".join(f"[s{n}]" for n in range(len(stills))) + f"xstack=inputs={len(stills)}:fill=black:layout={layout}",
                    "-frames:v", "1", "-update", "1", str(out)], check=True)
    for still in stills:
        still.unlink()
    print(f"sheet: {out.relative_to(HERE)} at {[round(t, 2) for t in times]}")


def still(t: float, upright: bool) -> None:
    with sync_playwright() as play:
        browser, page, _ = _page(play, upright)
        page.evaluate("(t) => window.seekTo(t)", t)
        page.screenshot(path=str(_name(upright, "still.png")))
        browser.close()
    print(f"still: {_name(upright, 'still.png').relative_to(HERE)} at {t}")


def sound(upright: bool) -> Path:
    """sound.js played by Chrome into a file: 16-bit stereo."""
    BUILD.mkdir(exist_ok=True)
    out = _name(upright, "sound.wav")
    with sync_playwright() as play:
        browser = play.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page()
        page.on("pageerror", lambda error: print(f"  page error: {error}"))
        page.goto((HERE / "sound.html").as_uri() + ("?v" if upright else ""))
        played = page.evaluate("(rate) => window.play(rate)", RATE)
        browser.close()
    left, right = (array("f", base64.b64decode(played[side])) for side in ("left", "right"))
    peak = max(max(map(abs, left)), max(map(abs, right)))
    gain = PEAK / peak
    samples = array("h", [0]) * (2 * len(left))
    samples[0::2] = array("h", (int(v * gain * 32767) for v in left))
    samples[1::2] = array("h", (int(v * gain * 32767) for v in right))
    with wave.open(str(out), "wb") as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(samples.tobytes())
    by_bar = []
    bar = int(RATE * 2.5)
    for k in range(len(left) // bar):
        part = left[k * bar:(k + 1) * bar]
        by_bar.append(round(gain * (sum(v * v for v in part) / len(part)) ** 0.5, 3))
    print(f"sound: {len(left) / RATE:.2f} s, peak {peak:.3f} brought to {PEAK}, loudness by bar {by_bar}")
    return out


WORKERS = 3


def frames(upright: bool, first: int, last: int) -> None:
    """Frames first to last - 1, photographed by one Chrome (film() runs several of these at once)."""
    folder = BUILD / ("upright-frames" if upright else "frames")
    with sync_playwright() as play:
        browser, page, total = _page(play, upright)
        last = min(last, round(total * FPS))
        for n in range(first, last):
            page.evaluate("(t) => window.seekTo(t)", n / FPS)
            page.screenshot(path=str(folder / f"{n:05d}.jpg"), type="jpeg", quality=94)
            if (n - first) % 300 == 0:
                print(f"  [{first}] frame {n} of {last}", flush=True)
        browser.close()


def film(upright: bool) -> None:
    folder = BUILD / ("upright-frames" if upright else "frames")
    shutil.rmtree(folder, ignore_errors=True)
    folder.mkdir(parents=True)
    with sync_playwright() as play:
        browser, _, total = _page(play, upright)
        browser.close()
    count = round(total * FPS)
    step = -(-count // WORKERS)
    runs = [subprocess.Popen([sys.executable, __file__, "frames", str(k * step), str(min(count, (k + 1) * step)), *(["--v"] if upright else [])])
            for k in range(WORKERS)]
    if any(run.wait() for run in runs):
        sys.exit("film: a worker failed")
    missing = [n for n in range(count) if not (folder / f"{n:05d}.jpg").is_file()]
    if missing:
        sys.exit(f"film: {len(missing)} frames missing, from {missing[0]}")
    print(f"film: {count} frames, {total:.2f} s")
    track = _name(upright, "sound.wav")
    out = _name(upright, "film.mp4")
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(folder / "%05d.jpg"),
                    *(["-i", str(track)] if track.exists() else []),
                    "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p",
                    "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-r", str(FPS),
                    *(["-c:a", "aac", "-b:a", "256k"] if track.exists() else []),
                    "-t", f"{total:.3f}", "-movflags", "+faststart", str(out)], check=True)
    print(f"film: {out.relative_to(HERE)} ({out.stat().st_size / 1e6:.1f} MB)")


def cover(upright: bool) -> None:
    """The thumbnail: the title, at rest (YouTube takes a JPEG of at most 2 MB)."""
    with sync_playwright() as play:
        browser, page, _ = _page(play, upright)
        at = page.evaluate("() => { const s = window.FILM.scenes.find((s) => s.kind === 'title'); return s.at + 3.4; }")
        page.evaluate("(t) => window.seekTo(t)", at)
        page.screenshot(path=str(_name(upright, "cover.jpg")), type="jpeg", quality=92)
        browser.close()
    print(f"cover: {_name(upright, 'cover.jpg').relative_to(HERE)}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--v"]
    upright = "--v" in sys.argv
    command, rest = (args[0] if args else ""), args[1:]
    if command == "sheet":
        sheet([float(t) for t in rest], upright)
    elif command == "still":
        still(float(rest[0]), upright)
    elif command == "sound":
        sound(upright)
    elif command == "film":
        film(upright)
    elif command == "frames":
        frames(upright, int(rest[0]), int(rest[1]))
    elif command == "cover":
        cover(upright)
    else:
        sys.exit(__doc__)
