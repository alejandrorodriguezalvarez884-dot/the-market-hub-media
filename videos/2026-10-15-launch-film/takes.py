"""The launch film's takes: the site itself, recorded in a real Chrome, one short take per part.

    python takes.py take NAME [NAME ...]   record those takes (every take if none is named)
    python takes.py clip NAME [NAME ...]   turn their frames into build/clips/NAME.mp4 (30 fps, every frame a key frame)
    python takes.py still NAME SECONDS     a frame of a clip, to look at: build/still.jpg

The recorder is the demo's (../2026-10-08-my-hub-demo/record.py): a Chrome driven by this file,
with a pointer drawn by the page, filmed by Chrome's screencast. Here it films at twice the
window's size, so the film can move in close without blurring, and types like a person.

The public pages are the deployed site. What needs the sign-in is the services on this machine,
with the demo account of the demo's capture/seed.py, and, unlike the demo, the owner's model keys
(the workspace's `film-*-windows` launch configurations), so the AI is seen doing its work: the
owner agreed to spend up to a dollar on it (2026-10-15).
"""

from __future__ import annotations

import importlib.util
import json
import random
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEMO_DIR = HERE.parent / "2026-10-08-my-hub-demo"
_spec = importlib.util.spec_from_file_location("demo_record", DEMO_DIR / "record.py")
demo = importlib.util.module_from_spec(_spec)
sys.modules["demo_record"] = demo
_spec.loader.exec_module(demo)

from playwright.sync_api import sync_playwright  # noqa: E402

PUBLIC = demo.PUBLIC
HUB = demo.HUB
TOOLS = {"fundamentals": "http://localhost:8094", "radar": "http://localhost:8093", "peers": "http://localhost:8095",
         "playground": "http://localhost:8097", "options": "http://localhost:8096"}
SCALE = 2.0                       # the window is 1280 by 720 and is filmed at 2560 by 1440
FPS = 30
BUILD = HERE / "build"
CLIPS = BUILD / "clips"
demo.SCALE = SCALE
demo.BUILD = BUILD


class Take(demo.Tour):
    """The demo's take, filmed sharper, and typing at a person's uneven pace."""

    def __init__(self, play, name: str):
        super().__init__(play, name)
        self.keys = random.Random(name)

    def film(self) -> None:
        self.cdp = self.context.new_cdp_session(self.page)
        self.cdp.on("Page.screencastFrame", self._frame)
        self.cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 95, "everyNthFrame": 1})

    def type(self, target, text: str, after: float = 0.6) -> None:
        self.click(target, after=0.25)
        for n, char in enumerate(text):
            self.page.keyboard.type(char)
            pause = self.keys.uniform(0.055, 0.13)
            if char == " ":
                pause += self.keys.uniform(0.02, 0.09)
            if n and self.keys.random() < 0.06:           # a moment's thought now and then
                pause += self.keys.uniform(0.15, 0.3)
            self.wait(pause)
        self.wait(after)

    def mark(self, name: str) -> None:
        """A moment of the take the film cuts to: its name and the time it happened."""
        self.marks.append((name, time.time()))
        print(f"  mark {name} at {time.time() - (self.kept_from or time.time()):.1f}s")


def public(take: Take, path: str, css: str = "") -> None:
    """A public page of the deployed site: it opens, settles, and the film starts."""
    take.page.goto(PUBLIC + path, wait_until="domcontentloaded")
    take.settle(2.0)
    if css:
        take.page.add_style_tag(content=css)
    take.film()
    take.wait(0.4)
    take.roll()


def signed(take: Take, address: str) -> None:
    demo.opened(take, address)
    take.settle(1.2)


# --- The takes ----------------------------------------------------------------------------------


def take_today(t: Take) -> None:
    public(t, "/today/")
    t.to(900, 420, 0.1)
    t.wait(0.8)
    t.down(520, 2.6)
    t.wait(0.6)
    t.down(520, 2.6)
    t.wait(1.0)
    t.cut()


def take_markets(t: Take) -> None:
    # The map of the S&P 500 is TradingView's and carries the companies' logos: left out.
    public(t, "/markets/", "#map { display: none !important }")
    t.to(700, 380, 0.1)
    t.wait(0.6)
    t.down(600, 3.0)
    t.wait(1.0)
    t.cut()


def take_quote(t: Take) -> None:
    public(t, "/quote/?t=NVDA")
    t.to(760, 360, 0.1)
    t.wait(1.0)
    t.to(980, 330, 1.4)
    t.wait(0.6)
    t.down(420, 2.4)
    t.wait(1.0)
    t.cut()


def take_news(t: Take) -> None:
    public(t, "/news/")
    t.to(640, 420, 0.1)
    t.wait(0.6)
    t.down(700, 3.2)
    t.wait(0.4)
    t.down(700, 3.2)
    t.wait(0.8)
    t.cut()


def take_fundamentals(t: Take) -> None:
    """The AI reading of a company's numbers, written while the film runs."""
    page = t.page
    signed(t, TOOLS["fundamentals"] + "/stock/?t=MSFT")
    t.to(640, 300, 0.1)
    t.wait(0.8)
    button = t.text("Write the reading")
    t.show(button, at=0.35, seconds=1.6)
    t.wait(0.4)
    t.mark("ask")
    t.click(button, after=0.2)
    page.get_by_text("Reading the numbers", exact=False).first.wait_for(timeout=15000)
    t.mark("reading")
    page.get_by_text("Written by", exact=False).first.wait_for(timeout=120000)
    t.mark("written")
    t.wait(1.0)
    t.down(330, 2.8)
    t.wait(0.8)
    t.down(330, 2.8)
    t.wait(1.2)
    t.cut()


def take_radar(t: Take) -> None:
    """The Earnings Radar reading a company's latest results release."""
    page = t.page
    signed(t, TOOLS["radar"] + "/?hub")
    t.to(600, 320, 0.1)
    t.wait(0.8)
    t.type(page.locator("main input").first, "Nvidia", after=0.5)
    page.keyboard.press("ArrowDown")
    t.wait(0.3)
    page.keyboard.press("Enter")
    t.wait(0.8)
    analyse = page.get_by_role("button", name="Analyse").first
    if analyse.is_visible():
        t.mark("ask")
        t.click(analyse, after=0.3)
    t.mark("steps")
    page.get_by_text("What stands out", exact=False).first.wait_for(timeout=180000)
    t.mark("read")
    t.wait(1.2)
    t.show(t.text("What stands out", exact=False).first, at=0.2, seconds=1.8)
    t.wait(1.0)
    t.down(320, 2.8)
    t.wait(1.2)
    t.cut()


def take_playground(t: Take) -> None:
    """A board asked for in plain words."""
    page = t.page
    signed(t, TOOLS["playground"] + "/")
    t.to(640, 330, 0.1)
    t.wait(0.6)
    box = page.get_by_placeholder("A chart, a comparison, a table")
    working = page.locator('[aria-label="Working on it"]')

    def answered() -> None:
        working.wait_for(state="attached", timeout=5000)
        working.wait_for(state="detached", timeout=180000)

    t.mark("first")
    t.type(box, "Compare Nvidia, AMD and Broadcom this year", after=0.3)
    page.keyboard.press("Enter")
    answered()
    t.mark("board")
    t.settle(1.5)
    t.mark("second")
    t.type(box, "Now add a table with the three of them", after=0.3)
    page.keyboard.press("Enter")
    answered()
    t.mark("table")
    t.settle(1.2)
    t.to(640, 420, 0.8)
    t.down(380, 2.4)
    t.wait(1.2)
    t.cut()


def take_peers(t: Take) -> None:
    page = t.page
    signed(t, TOOLS["peers"] + "/")
    t.to(640, 330, 0.1)
    t.wait(0.6)
    t.down(330, 1.4)
    t.to(560, 330, 1.0)
    t.to(820, 480, 1.4)
    t.click(t.text("Month").first, after=1.0)
    t.mark("search")
    t.type(page.get_by_placeholder("Company or ticker").first, "nvidia", after=0.8)
    page.keyboard.press("ArrowDown")
    t.wait(0.3)
    page.keyboard.press("Enter")
    t.settle(1.5)
    t.mark("peers")
    t.hover(t.text("Most similar business descriptions"), where=(0.5, 4.0), stay=0.6)
    t.to(t.pointer[0], t.pointer[1] + 220, 2.0)
    t.wait(1.2)
    t.cut()


def take_options(t: Take) -> None:
    """A chain read in detail, then a strategy built from a shape, with its payoff."""
    page = t.page
    signed(t, TOOLS["options"] + "/?t=NVDA&e=2026-11-13")
    t.to(700, 300, 0.1)
    t.wait(1.2)
    t.down(330, 2.2)
    t.to(420, 520, 1.2)
    t.to(560, 470, 1.4)
    t.wait(0.6)
    # A cut, in the film, from the chain to the strategy page.
    t.mark("strategy")
    page.goto(TOOLS["options"] + "/strategy/?t=NVDA", wait_until="domcontentloaded")
    t.settle(1.2)
    shape, when = page.locator("main select").nth(0), page.locator("main select").nth(1)
    t.hover(shape, stay=0.3)
    t.page.evaluate("() => { window.__pointer.tap(); }")
    shape.select_option(value="iron-condor")
    t.wait(0.6)
    t.hover(when, stay=0.2)
    t.page.evaluate("() => { window.__pointer.tap(); }")
    label = next(l for l in when.evaluate("(s) => [...s.options].map((o) => o.textContent.trim())") if l.startswith("Nov 13"))
    when.select_option(label=label)
    t.wait(0.6)
    t.click(page.get_by_role("button", name="Use", exact=True).first, after=0.4)
    t.settle(1.5)
    t.mark("payoff")
    t.down(300, 2.4)
    t.wait(0.8)
    t.down(300, 2.4)
    t.wait(1.2)
    t.cut()


def take_hub(t: Take) -> None:
    """My Hub's overview, with its sentences, for the demo account."""
    signed(t, HUB + "/dashboard/")
    t.to(700, 360, 0.1)
    t.wait(2.5)
    t.down(450, 3.0)
    t.wait(0.8)
    t.down(450, 3.0)
    t.wait(1.0)
    t.cut()


def take_watchlist(t: Take) -> None:
    page = t.page
    signed(t, HUB + "/watchlist/")
    t.to(700, 400, 0.1)
    t.wait(1.0)
    t.click(page.locator("#watch-bar").get_by_text("Readings", exact=True))
    t.mark("readings")
    t.settle(2.0)
    t.down(300, 2.4)
    t.wait(0.6)
    t.down(300, 2.4)
    t.wait(1.0)
    t.cut()


def take_community(t: Take) -> None:
    page = t.page
    signed(t, HUB + "/community/")
    t.to(700, 400, 0.1)
    t.show(t.text("Where you stand"), at=0.08, seconds=1.4)
    t.wait(0.6)
    t.click(t.text("This year").last, after=1.0)
    t.mark("board")
    t.down(300, 2.4)
    t.wait(0.8)
    t.scroll(0, 1.0)
    t.click(t.text("Monthly competition").first)
    t.settle(0.6)
    t.mark("competition")
    t.click(page.get_by_role("button", name="Build your entry").first)
    t.settle(0.4)
    t.show(t.text("Add a stock"), at=0.25)
    add = page.get_by_placeholder("Company or ticker").locator("visible=true").first
    for company in ("nvidia", "microsoft", "costco"):
        t.type(add, company, after=0.7)
        page.keyboard.press("ArrowDown")
        t.wait(0.25)
        page.keyboard.press("Enter")
        t.wait(0.6)
    t.mark("entry")
    t.wait(1.2)
    t.cut()


TAKES = {name[5:]: fn for name, fn in globals().items() if name.startswith("take_")}


def record(names: list[str]) -> None:
    with sync_playwright() as play:
        for name in names or list(TAKES):
            take = Take(play, name)
            try:
                TAKES[name](take)
            except Exception:
                take.page.screenshot(path=str(BUILD / f"failed-{name}.jpg"), type="jpeg", quality=80)
                take.browser.close()
                raise


# --- From frames to a clip -------------------------------------------------------------------------


def clip(name: str) -> Path:
    """A take's frames, held each until the next was painted, as a film of 30 frames a second."""
    folder = BUILD / "takes" / name
    take = json.loads((folder / "take.json").read_text(encoding="utf-8"))
    start, end = take["from"], take["to"]
    frames = [(f, t) for f, t in take["frames"]]
    # The frame on screen when the take starts, and every one after it.
    first = max((i for i, (_, t) in enumerate(frames) if t <= start), default=0)
    kept = frames[first:]
    lines = []
    for i, (frame, at) in enumerate(kept):
        begin = max(at, start)
        until = kept[i + 1][1] if i + 1 < len(kept) else end
        if until <= begin:
            continue
        lines.append(f"file '{frame}'\nduration {until - begin:.4f}")
    lines.append(f"file '{kept[-1][0]}'")
    (folder / "frames.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    CLIPS.mkdir(parents=True, exist_ok=True)
    out = CLIPS / f"{name}.mp4"
    subprocess.run([demo.ffmpeg(), "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "frames.txt",
                    "-vf", f"fps={FPS},scale=2560:1440:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow",
                    "-crf", "14", "-g", "1", "-t", f"{end - start:.3f}", str(out.resolve())], check=True, cwd=folder)
    marks = {m: round(t - start, 2) for m, t in take["marks"]}
    (CLIPS / f"{name}.json").write_text(json.dumps({"seconds": round(end - start, 2), "marks": marks}, indent=2) + "\n", encoding="utf-8")
    print(f"clip {name}: {end - start:.1f}s, {len(kept)} frames painted, marks {marks}")
    return out


def still(name: str, seconds: float) -> None:
    subprocess.run([demo.ffmpeg(), "-y", "-loglevel", "error", "-ss", str(seconds), "-i", str(CLIPS / f"{name}.mp4"),
                    "-frames:v", "1", "-vf", "scale=1280:-1", str(BUILD / "still.jpg")], check=True)


if __name__ == "__main__":
    command, rest = (sys.argv[1] if len(sys.argv) > 1 else ""), sys.argv[2:]
    if command == "take":
        record(rest)
        for name in rest or list(TAKES):
            clip(name)
    elif command == "clip":
        for name in rest or list(TAKES):
            clip(name)
    elif command == "still":
        still(rest[0], float(rest[1]))
    else:
        sys.exit(__doc__)
