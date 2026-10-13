"""The teaser: Market Hub's own pages, as a phone shows them, cut fast under a few big words.

    python reel.py shots     photograph the pages (build/shots/)
    python reel.py sound     play the score (sound.js) into build/sound.wav
    python reel.py film      draw every frame of reel.html and put the sound under it: build/reel.mp4
    python reel.py sheet     a few frames side by side, to look the film over: build/sheet.jpg

It is not a video of the channel (CLAUDE.md, "Una demo de la app no es un vídeo del canal"): no
presenter, no slides, no voice. What is seen is the site itself. The public pages are photographed
from the deployed site (https://themarkethub.app); My Hub, from a portal on this machine running
the same code with the demo account of the demo's capture/seed.py, real prices and no key of a
model (the workspace's `hub-demo` launch configuration, and that seed.py run against it).

A page is photographed once, whole, at a phone's width, and the film moves the photograph: the
motion is computed frame by frame, as in the channel's videos (marketmedia.frames), not recorded.
The sound is synthesised here, with no recording and no music of anyone's (sound.js).
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

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "2026-10-08-my-hub-demo" / "capture"))
from seed import DEMO, PASSWORD  # noqa: E402

from marketmedia import render  # noqa: E402
from marketmedia.frames import FREEZE, SEEK  # noqa: E402

PUBLIC = "https://themarkethub.app"
HUB = "http://localhost:8088"
PHONE = {"width": 390, "height": 844}
SIZE = {"width": 1080, "height": 1920}
FPS = 30
RATE = 48000
PEAK = 0.89
BUILD = HERE / "build"
SHOTS = BUILD / "shots"

# (name, where, the page's address, how much of the page from its top, CSS added before the photograph)
PAGES = [
    ("today", PUBLIC, "/today/", 2500, ""),
    # The map of the S&P 500 is TradingView's and carries the logos of the companies: left out.
    ("markets", PUBLIC, "/markets/", 2300, "#map { display: none }"),
    ("quote", PUBLIC, "/quote/?t=NVDA", 1560, ""),
    ("news", PUBLIC, "/news/", 2700, ""),
    ("opinion", PUBLIC, "/opinion/", 2700, ""),
    ("hub", HUB, "/dashboard/", 2400, ""),
    ("tools", HUB, "/tools/", 900, ""),
]


def shots(only: list[str]) -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as play:
        browser = play.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport=PHONE, device_scale_factor=3, is_mobile=True, has_touch=True, locale="en-US")
        # A visit that finds the news stale asks for a refresh, which the owner's model credit pays for.
        context.route("**/api/public/news/refresh", lambda route: route.abort())
        context.route("**/cloudflareinsights.com/**", lambda route: route.abort())   # not a reader: not counted as one
        entered = context.request.post(HUB + "/api/auth/password", data={"email": DEMO["email"], "password": PASSWORD}, headers={"origin": HUB})
        if entered.status != 200:
            sys.exit(f"shots: the portal on this machine did not take the demo account ({entered.status}): start `hub-demo` and run the demo's seed.py")
        page = context.new_page()
        for name, site, path, height, css in PAGES:
            if only and name not in only:
                continue
            page.goto(site + path, wait_until="networkidle", timeout=90000)
            if css:
                page.add_style_tag(content=css)
            page.add_style_tag(content="::-webkit-scrollbar { display: none }")
            for top in range(0, height, 600):            # what loads when it is scrolled to
                page.evaluate("(y) => window.scrollTo(0, y)", top)
                page.wait_for_timeout(350)
            page.evaluate("window.scrollTo(0, 0)")
            page.wait_for_timeout(3000)
            tall = min(height, page.evaluate("document.documentElement.scrollHeight"))
            page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=True, clip={"x": 0, "y": 0, "width": PHONE["width"], "height": tall})
            print(f"shots: {name} ({tall} px of {path})")
        browser.close()


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
        browser = play.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport=SIZE, device_scale_factor=1)
        page.on("pageerror", lambda error: print(f"  page error: {error}"))
        page.goto((HERE / "reel.html").as_uri())
        page.evaluate("async () => { await document.fonts?.ready; await window.reelReady; }")
        seconds = page.evaluate(FREEZE)
        count = round(seconds * FPS)
        for n in range(count):
            page.evaluate(SEEK, n / FPS * 1000)
            page.screenshot(path=str(frames / f"{n:04d}.jpg"), type="jpeg", quality=95)
        browser.close()
    print(f"film: {count} frames, {seconds:.2f} s")
    track = BUILD / "sound.wav"
    out = BUILD / "reel.mp4"
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(frames / "%04d.jpg"),
                    *(["-i", str(track)] if track.exists() else []),
                    # The frames are JPEGs, full range: the film is given the range and the colours a phone expects.
                    "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p",
                    "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-r", str(FPS),
                    *(["-c:a", "aac", "-b:a", "192k"] if track.exists() else []),
                    "-t", f"{seconds:.3f}", "-movflags", "+faststart", str(out)], check=True)
    print(f"film: {out.relative_to(HERE)} ({out.stat().st_size / 1e6:.1f} MB)")


def sheet(times: list[float]) -> None:
    """Frames of the film as it is drawn now, side by side and small."""
    BUILD.mkdir(exist_ok=True)
    with sync_playwright() as play:
        browser = play.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport=SIZE, device_scale_factor=1)
        page.on("pageerror", lambda error: print(f"  page error: {error}"))
        page.goto((HERE / "reel.html").as_uri())
        page.evaluate("async () => { await document.fonts?.ready; await window.reelReady; }")
        seconds = page.evaluate(FREEZE)
        times = times or [n * seconds / 12 + seconds / 24 for n in range(12)]
        stills = []
        for n, t in enumerate(times):
            page.evaluate(SEEK, t * 1000)
            still = BUILD / f"still-{n:02d}.jpg"
            page.screenshot(path=str(still), type="jpeg", quality=88)
            stills.append(still)
        browser.close()
    rows = -(-len(stills) // 6)
    out = BUILD / "sheet.jpg"
    inputs = [arg for still in stills for arg in ("-i", str(still))]
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", *inputs, "-filter_complex",
                    "".join(f"[{n}:v]scale=270:480[s{n}];" for n in range(len(stills)))
                    + "".join(f"[s{n}]" for n in range(len(stills))) + f"xstack=inputs={len(stills)}:fill=black:layout="
                    + "|".join(f"{(n % 6) * 274}_{(n // 6) * 484}" for n in range(len(stills))),
                    "-frames:v", "1", "-update", "1", str(out)], check=True)
    for still in stills:
        still.unlink()
    print(f"sheet: {out.relative_to(HERE)} at {[round(t, 2) for t in times]} ({rows} rows)")


if __name__ == "__main__":
    command, rest = (sys.argv[1] if len(sys.argv) > 1 else ""), sys.argv[2:]
    if command == "shots":
        shots(rest)
    elif command == "sound":
        sound()
    elif command == "film":
        film()
    elif command == "sheet":
        sheet([float(t) for t in rest])
    else:
        sys.exit(__doc__)
