"""The demo: the app itself on screen, as someone sharing their screen would show it, with a voice.

    python record.py voice [--dry]     speak the stretches of guion.md that are new or changed
    python record.py take A [B ...]    record those takes (every take if none is named)
    python record.py join              put the takes and the voice together: build/demo.mp4

What is seen is a real Chrome driven by this file: a pointer that moves, clicks, types and
scrolls, with no cut inside a take. A take ends where the next page would load and the next take
starts on that page, so the film reads as one sitting. There are several takes only because the
tools are services of their own and this machine runs two of them at a time, and so that a part
that goes wrong is recorded again alone.

The public pages are the deployed site (https://themarkethub.app). Everything behind the sign-in
is a portal on this machine running the same code, with the demo account of capture/seed.py, real
prices and no key of a model, so nothing is paid for: the workspace's `hub-demo-windows` launch
configuration and, for each tool, its `*-demo-windows`.

The voice is guion.md, a stretch at a time (Google Cloud Text-to-Speech, as the channel's videos,
in Spanish). A stretch is spoken first, so that the screen knows how long it has: `tour.say(id)`
starts it, `tour.at(0.5)` waits until half of it has been said, `tour.end()` until all of it has.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import wave
from dataclasses import replace
from pathlib import Path

from playwright.sync_api import Locator, Page, sync_playwright

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "capture"))
from seed import DEMO, PASSWORD  # noqa: E402

from marketmedia import channel as channels  # noqa: E402
from marketmedia import render, voice  # noqa: E402

PUBLIC = "https://themarkethub.app"
HUB = "http://localhost:8088"
TOOLS = {"fundamentals": "http://localhost:8094", "earnings": "http://localhost:8093", "peers": "http://localhost:8095",
         "playground": "http://localhost:8097"}
VOICE = ("es-ES-Chirp3-HD-Schedar", "es-ES")
SCALE = 1.5                            # the window is 1280 by 720 and is filmed at 1920 by 1080
WINDOW = (1280, 720)
EDGES = (16, 94)                       # what Chrome's own window adds around the page, measured
FPS = 30
GAP = 0.35                             # silence after a stretch
BUILD = HERE / "build"
VOICES = HERE / "voice"

# The pointer, drawn by the page itself: a headless Chrome has none. It is put back on every page,
# where the pointer was (window.__pointerAt), and moves, clicks and scrolls when asked.
POINTER = """
(() => {
  if (window.top !== window || window.__pointer) return;
  let x = 0, y = 0, el = null;
  const ease = (k) => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const put = () => { if (el) el.style.transform = `translate(${x}px, ${y}px)`; };
  const run = (ms, step) => new Promise((done) => {
    const from = performance.now();
    const tick = (now) => { const k = Math.min(1, (now - from) / ms); step(ease(k)); k < 1 ? requestAnimationFrame(tick) : done(); };
    requestAnimationFrame(tick);
  });
  const make = async () => {
    if (el) return;
    [x, y] = await window.__pointerAt();
    el = document.createElement("div");
    el.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none";
    el.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" style="position:absolute;left:-2px;top:-2px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">'
      + '<path d="M3 2 L3 18 L7.4 14.2 L10.3 20.4 L13 19.2 L10.2 13.1 L16 12.6 Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>'
      + '<i style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;border:2px solid #fff;opacity:0"></i>';
    put();
    document.documentElement.appendChild(el);
  };
  window.__pointer = {
    glide: async (tx, ty, ms) => { await make(); const fx = x, fy = y; await run(ms, (k) => { x = fx + (tx - fx) * k; y = fy + (ty - fy) * k; put(); }); },
    tap: async () => { await make(); const ring = el.lastChild; await run(320, (k) => { ring.style.opacity = 0.9 * (1 - k); ring.style.transform = `scale(${0.3 + k})`; }); ring.style.opacity = 0; },
    scroll: async (top, ms, box) => {
      const target = box ? document.querySelector(box) : null;
      const from = target ? target.scrollTop : window.scrollY;
      await run(ms, (k) => { const to = from + (top - from) * k; target ? (target.scrollTop = to) : window.scrollTo({ top: to, behavior: "instant" }); });
    },
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", make) : make();
})();
"""


def ffmpeg() -> str:
    return render.ffmpeg()


# --- The words -----------------------------------------------------------------------------------


def stretches() -> dict[str, str]:
    """guion.md: what is said in each stretch, by its name."""
    out: dict[str, str] = {}
    name = None
    for line in (HERE / "guion.md").read_text(encoding="utf-8").splitlines():
        heading = re.fullmatch(r"##\s+([A-Z]\d\d-[a-z0-9\-]+)\s*", line)
        if heading:
            name = heading.group(1)
            out[name] = ""
        elif name and line.strip():
            out[name] = f"{out[name]} {line.strip()}".strip()
    return out


def _mark(text: str) -> str:
    return hashlib.sha256(f"{VOICE}|{text}".encode()).hexdigest()[:16]


def speak(dry: bool = False) -> None:
    """Speak the stretches whose words, or the voice, changed since they were last spoken."""
    said = VOICES / "made.json"
    made = json.loads(said.read_text(encoding="utf-8")) if said.is_file() else {}
    todo = {name: text for name, text in stretches().items() if made.get(name) != _mark(text) or not (VOICES / f"{name}.wav").is_file()}
    print(f"{len(todo)} stretches to speak, {sum(len(t) for t in todo.values())} characters, with {VOICE[0]}")
    if dry or not todo:
        return
    spanish = replace(channels.load(), voice_name=VOICE[0], voice_language=VOICE[1], voice_rate=1.0)
    VOICES.mkdir(exist_ok=True)
    for name, text in todo.items():
        (VOICES / f"{name}.wav").write_bytes(voice.cloud(text, spanish))
        made[name] = _mark(text)
        said.write_text(json.dumps(made, indent=2) + "\n", encoding="utf-8", newline="\n")
        print(f"  voice/{name}.wav  {len(text)} characters")


def lasts(name: str) -> float:
    with wave.open(str(VOICES / f"{name}.wav")) as sound:
        return sound.getnframes() / sound.getframerate()


# --- A take --------------------------------------------------------------------------------------


class Tour:
    """One take: a window being filmed, its pointer, and where each stretch of the voice starts."""

    def __init__(self, play, name: str, window: tuple[int, int] = WINDOW):
        self.name, self.window = name, window
        self.folder = BUILD / "takes" / name
        if self.folder.is_dir():
            for old in self.folder.iterdir():
                old.unlink()
        self.folder.mkdir(parents=True, exist_ok=True)
        self.browser = play.chromium.launch(channel="chrome", headless=True, args=[
            f"--force-device-scale-factor={SCALE}", f"--window-size={window[0] + EDGES[0]},{window[1] + EDGES[1]}", "--hide-scrollbars"])
        self.context = self.browser.new_context(no_viewport=True, locale="en-US")
        # A visit that finds the news stale asks for a refresh, which the owner's model credit pays for.
        self.context.route("**/api/public/news/refresh", lambda route: route.abort())
        self.context.route("**/cloudflareinsights.com/**", lambda route: route.abort())   # not a reader: not counted as one
        # Google words its button for the country the request comes from; the site is in English.
        self.context.route("**/gsi/client*", lambda route: route.continue_(url="https://accounts.google.com/gsi/client?hl=en"))
        self.pointer = [window[0] * 0.6, window[1] * 0.45]
        self.context.expose_binding("__pointerAt", lambda source: self.pointer)
        self.context.add_init_script(POINTER)
        self.page: Page = self.context.new_page()
        self.frames: list[tuple[str, float]] = []
        self.marks: list[tuple[str, float]] = []
        self.kept_from: float | None = None
        self.said: tuple[float, float] = (0.0, 0.0)    # when the stretch being said started, and how long it lasts
        self.cdp = None

    # The film: every picture Chrome paints, with the moment it was painted.
    def _frame(self, event: dict) -> None:
        name = f"{len(self.frames):06d}.jpg"
        (self.folder / name).write_bytes(base64.b64decode(event["data"]))
        self.frames.append((name, float(event["metadata"]["timestamp"])))
        self.cdp.send("Page.screencastFrameAck", {"sessionId": event["sessionId"]})

    def film(self) -> None:
        """Start filming this page. What was painted before `roll` is not in the take."""
        self.cdp = self.context.new_cdp_session(self.page)
        self.cdp.on("Page.screencastFrame", self._frame)
        self.cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 88, "everyNthFrame": 1})

    def roll(self) -> None:
        self.kept_from = time.time()

    def cut(self) -> None:
        """The take ends here."""
        end = time.time()
        self.cdp.send("Page.stopScreencast")
        self.page.wait_for_timeout(200)
        (self.folder / "take.json").write_text(json.dumps({
            "from": self.kept_from, "to": end, "frames": self.frames, "marks": self.marks, "window": self.window,
            "pointer": self.pointer}), encoding="utf-8")
        self.browser.close()
        print(f"take {self.name}: {end - self.kept_from:.1f}s, {len(self.frames)} frames")

    # The voice.
    def say(self, name: str) -> None:
        self.said = (time.time(), lasts(name))
        self.marks.append((name, self.said[0]))
        print(f"  {name}  {self.said[1]:.1f}s")

    def at(self, part: float) -> None:
        """Wait until this much of the stretch has been said (0 to 1)."""
        self.wait(self.said[0] + self.said[1] * part - time.time())

    def left(self, part: float = 1.0) -> float:
        """How long until this much of the stretch has been said."""
        return max(0.0, self.said[0] + self.said[1] * part - time.time())

    def end(self, more: float = GAP) -> None:
        late = time.time() - (self.said[0] + self.said[1])
        if late > 0.5:
            print(f"    the screen ran {late:.1f}s past the voice")
        self.at(1.0)
        self.wait(more)

    def wait(self, seconds: float) -> None:
        if seconds > 0:
            self.page.wait_for_timeout(seconds * 1000)   # never time.sleep: the film's pictures arrive while this waits

    # The pointer.
    def to(self, x: float, y: float, seconds: float | None = None) -> None:
        far = ((x - self.pointer[0]) ** 2 + (y - self.pointer[1]) ** 2) ** 0.5
        seconds = seconds if seconds is not None else min(1.1, 0.3 + far / 1100)
        self.pointer = [x, y]
        self.page.evaluate("([x, y, ms]) => window.__pointer.glide(x, y, ms)", [x, y, seconds * 1000])
        self.page.mouse.move(x, y)

    def _spot(self, target: Locator, where: tuple[float, float] = (0.5, 0.5)) -> tuple[float, float]:
        box = target.bounding_box()
        if box is None:
            raise RuntimeError(f"not on the page: {target}")
        return box["x"] + box["width"] * where[0], box["y"] + box["height"] * where[1]

    def show(self, target: Locator, at: float = 0.4, seconds: float | None = None) -> None:
        """Scroll until ``target`` is ``at`` of the way down the window, if it is not in comfortable view."""
        target.first.wait_for(state="attached", timeout=30000)
        box = target.first.bounding_box()
        if box is None:
            return
        middle = box["y"] + min(box["height"], self.window[1] * 0.5) / 2
        if 0.15 * self.window[1] < middle < 0.8 * self.window[1]:
            return
        top = max(0, self.page.evaluate("window.scrollY") + middle - self.window[1] * at)
        self.scroll(top, seconds)

    def scroll(self, top: float, seconds: float | None = None, box: str | None = None) -> None:
        now = self.page.evaluate("(box) => box ? document.querySelector(box).scrollTop : window.scrollY", box)
        seconds = seconds if seconds is not None else min(2.2, 0.5 + abs(top - now) / 900)
        self.page.evaluate("([top, ms, box]) => window.__pointer.scroll(top, ms, box)", [top, seconds * 1000, box])
        self.page.mouse.move(*self.pointer)   # what is under the pointer has changed

    def down(self, by: float, seconds: float | None = None) -> None:
        self.scroll(self.page.evaluate("window.scrollY") + by, seconds)

    def bottom(self, seconds: float) -> None:
        self.scroll(self.page.evaluate("document.documentElement.scrollHeight - window.innerHeight"), seconds)

    def hover(self, target: Locator, where: tuple[float, float] = (0.5, 0.5), stay: float = 0.0) -> None:
        self.show(target)
        self.to(*self._spot(target.first, where))
        self.wait(stay)

    def click(self, target: Locator, where: tuple[float, float] = (0.5, 0.5), after: float = 0.5) -> None:
        self.hover(target, where)
        self.wait(0.12)
        self.page.evaluate("() => { window.__pointer.tap(); }")
        self.page.mouse.click(*self.pointer)
        self.wait(after)

    def type(self, target: Locator, text: str, after: float = 0.6) -> None:
        self.click(target, after=0.2)
        self.page.keyboard.type(text, delay=85)
        self.wait(after)

    def settle(self, more: float = 0.6) -> None:
        """A page that has just been opened: wait until it has what it shows."""
        try:
            self.page.wait_for_load_state("networkidle", timeout=20000)
        except Exception:
            pass   # a page that keeps asking (a chart's feed) never goes quiet
        self.wait(more)

    def text(self, words: str, exact: bool = True) -> Locator:
        return self.page.get_by_text(words, exact=exact).locator("visible=true")

    def link(self, name: str) -> Locator:
        return self.page.get_by_role("link", name=name, exact=True).locator("visible=true")

    def side(self, name: str) -> Locator:
        """A link of My Hub's menu, at the side."""
        return self.page.locator("aside nav a", has_text=re.compile(rf"^\s*{re.escape(name)}\s*$")).first


def account(tour: Tour):
    """The demo account's own calls, apart from the window that is filmed."""
    api = tour.browser.new_context().request
    done = api.post(HUB + "/api/auth/password", data={"email": DEMO["email"], "password": PASSWORD}, headers={"origin": HUB})
    if done.status != 200:
        raise RuntimeError(f"the demo account could not sign in ({done.status}): is the portal running, and seeded?")
    return api


def opened(tour: Tour, address: str, signed: bool = True) -> None:
    """A take that starts where the last one clicked: the page opens, and the film starts with it."""
    if signed:
        done = tour.context.request.post(HUB + "/api/auth/password", data={"email": DEMO["email"], "password": PASSWORD}, headers={"origin": HUB})
        if done.status != 200:
            raise RuntimeError(f"the demo account could not sign in ({done.status}): is the portal running, and seeded?")
    tour.page.goto("about:blank")
    tour.film()
    tour.page.goto(address, wait_until="domcontentloaded")
    tour.wait(0.15)
    tour.roll()
    tour.settle(0.8)


def pick(tour: Tour, box: Locator, words: str, after: float = 0.9) -> None:
    """Type in a company search and take the first answer."""
    tour.type(box, words, after=after)
    tour.page.keyboard.press("ArrowDown")
    tour.wait(0.3)
    tour.page.keyboard.press("Enter")


def leave(tour: Tour, target: Locator) -> None:
    """End a take on the way to another page: the pointer goes to its link and presses."""
    tour.scroll(0, 0.9)
    tour.hover(target, stay=0.15)
    tour.page.evaluate("() => { window.__pointer.tap(); }")
    tour.wait(0.12)


def head(tour: Tour, name: str) -> Locator:
    """A link of the public site's header."""
    return tour.page.locator("header").get_by_role("link", name=name, exact=True)


# --- The takes -----------------------------------------------------------------------------------


def take_a(tour: Tour) -> None:
    """The public site, as it is deployed."""
    page = tour.page
    page.goto(PUBLIC + "/", wait_until="domcontentloaded")
    tour.settle(1.5)
    tour.film()
    tour.wait(0.5)
    tour.roll()

    tour.say("A01-portada")
    tour.wait(1.2)
    tour.to(420, 300)
    tour.at(0.22)
    tour.bottom(tour.left(0.82))
    tour.scroll(0, 1.4)
    tour.end()

    tour.say("A02-today")
    tour.click(head(tour, "Today"))
    tour.settle()
    tour.hover(page.locator("main svg").first, stay=0.3)
    tour.at(0.22)
    tour.to(380, 420)
    tour.at(0.34)
    tour.hover(tour.text("Today, on one scale"))
    tour.to(tour.pointer[0] + 40, tour.pointer[1] + 150, 1.6)
    tour.at(0.62)
    tour.click(tour.text("Nasdaq 100").first)
    tour.at(0.78)
    tour.bottom(tour.left(0.97))
    tour.end()

    tour.say("A03-markets")
    tour.scroll(0, 0.8)
    tour.click(head(tour, "Markets"))
    tour.settle(0.3)
    tour.to(520, 330)
    tour.bottom(tour.left(0.97))
    tour.end()

    tour.say("A04-ficha")
    tour.scroll(0, 1.0)
    pick(tour, page.locator("header input").first, "Apple", after=1.0)
    page.wait_for_url("**/quote/**")
    tour.settle()
    tour.to(330, 170)
    tour.at(0.58)
    tour.to(700, 380, 1.0)
    tour.at(0.74)
    tour.hover(tour.text("Key figures"))
    tour.at(0.88)
    tour.bottom(1.4)
    tour.end()

    tour.say("A05-news")
    tour.scroll(0, 0.8)
    tour.click(head(tour, "News"))
    tour.settle(0.3)
    tour.to(430, 330)
    tour.at(0.24)
    tour.down(520, 2.6)
    tour.at(0.5)
    tour.scroll(0, 1.0)
    tour.click(tour.text("Bearish").first, after=1.2)
    tour.at(0.8)
    tour.click(tour.text("Bearish").first, after=0.5)
    tour.hover(tour.text("Any sector"))
    tour.end()

    tour.say("A06-articulo")
    tour.click(page.locator("main a[href*='/news/article/']").first)
    page.wait_for_url("**/news/article/**")
    tour.settle(0.3)
    tour.to(520, 330)
    tour.at(0.35)
    tour.bottom(tour.left(0.97))
    tour.end()

    tour.say("A07-opinion")
    tour.scroll(0, 0.8)
    tour.click(head(tour, "Opinion"))
    tour.settle(0.3)
    tour.to(520, 300)
    tour.at(0.3)
    tour.hover(tour.text("Write an article"), stay=0.4)
    tour.at(0.5)
    tour.click(page.locator("main a[href*='/opinion/article/']").first)
    page.wait_for_url("**/opinion/article/**")
    tour.settle(0.3)
    tour.to(640, 360)
    tour.at(0.62)
    tour.bottom(tour.left(0.95))
    tour.end()

    tour.say("A08-media")
    tour.scroll(0, 1.0)
    tour.click(head(tour, "Media"))
    tour.settle(0.3)
    tour.to(520, 320)
    tour.bottom(max(3.5, tour.left(0.97)))
    tour.end(0.6)

    leave(tour, head(tour, "Sign in"))


def take_b(tour: Tour) -> None:
    """Signing in, the portfolio and Overview."""
    page = tour.page
    # The demo account's portfolio as seed.py made it: what an earlier take added is taken out.
    api = account(tour)
    kept = api.get(HUB + "/api/portfolio").json()
    held, followed = {t for t, _, _ in DEMO["positions"]}, set(DEMO["watchlist"])
    api.put(HUB + "/api/portfolio", headers={"origin": HUB}, data={
        "positions": [p for p in kept["positions"] if p["ticker"] in held], "watchlist": [t for t in kept["watchlist"] if t in followed]})
    opened(tour, HUB + "/signin/", signed=False)

    tour.say("B01-entrar")
    tour.at(0.3)
    tour.hover(page.locator("#signin"), stay=0.4)
    tour.at(0.46)
    tour.hover(page.locator("#own-switch"), stay=0.3)
    tour.at(0.68)
    tour.type(page.locator("#own-email"), DEMO["email"], after=0.3)
    tour.type(page.locator("#own-password"), PASSWORD, after=0.3)
    tour.end()
    tour.click(page.locator("#own-send"))
    page.wait_for_url("**/dashboard/**")
    tour.settle(0.6)

    tour.say("B02-cartera")
    tour.click(tour.side("Portfolio"))
    tour.settle(0.3)
    tour.at(0.12)
    pick(tour, page.get_by_placeholder("Company or ticker").first, "netflix", after=1.0)
    tour.wait(0.8)
    row = page.locator("tr", has_text="NFLX").first
    tour.at(0.34)
    tour.type(row.locator("input").first, "4", after=0.4)
    tour.at(0.44)
    tour.hover(row.locator("input").nth(1), stay=0.5)
    tour.at(0.62)
    pick(tour, page.get_by_placeholder("Company or ticker").nth(1), "disney", after=1.0)
    tour.at(0.78)
    tour.hover(tour.text("Save and open the dashboard"))
    tour.end()
    tour.click(tour.text("Save and open the dashboard"))
    page.wait_for_url("**/dashboard/**")
    tour.settle(1.0)

    tour.say("B03-overview")
    main = page.locator("main")
    tour.to(330, 110)
    for part, label in zip((0.14, 0.27, 0.38, 0.5), ("Portfolio value", "Today", "Gain / loss", "Holdings over 1 year")):
        tour.at(part)
        tour.hover(main.get_by_text(label, exact=True).first, where=(0.5, 2.2))
    tour.at(0.7)
    tour.hover(tour.text("Your portfolio, read back"), where=(1.5, 3.5))
    tour.at(0.8)
    tour.down(230, 1.6)
    tour.end()

    tour.say("B04-grafico")
    tour.show(tour.text("Today's holdings against the indices"), at=0.1)
    tour.to(640, 330)
    tour.at(0.2)
    tour.click(main.get_by_text("3M", exact=True).first, after=0.9)
    tour.click(main.get_by_text("YTD", exact=True).first, after=0.9)
    tour.click(main.get_by_text("1Y", exact=True).first, after=0.4)
    tour.at(0.44)
    tour.click(main.get_by_text("Nasdaq 100", exact=True).first, after=0.9)
    tour.click(main.get_by_text("Russell 2000", exact=True).first, after=0.4)
    tour.at(0.64)
    tour.hover(main.get_by_text("Trades are not recorded", exact=False).first, where=(0.8, 0.5))
    tour.end()

    tour.say("B05-posiciones")
    tour.show(main.get_by_text("Positions", exact=True).first, at=0.08, seconds=1.2)
    tour.to(700, 380, 0.6)
    tour.at(0.55)
    tour.bottom(max(4.0, tour.left(1.0)))
    tour.end(0.8)

    leave(tour, tour.side("Analysis"))


def take_c(tour: Tour) -> None:
    """Analysis."""
    page = tour.page
    opened(tour, HUB + "/analysis/")

    tour.say("C01-analysis")
    tour.to(620, 300)
    for part, label in zip((0.52, 0.66, 0.8), ("By country", "By volatility", "By size")):
        tour.at(part)
        tour.click(tour.text(label), after=0.4)
    tour.end(0.6)

    tour.say("C02-riesgo")
    tour.show(tour.text("Against the indices"), at=0.1)
    tour.to(700, 260)
    tour.at(0.3)
    tour.show(tour.text("How it moves"), at=0.2)
    for part, label in zip((0.36, 0.46, 0.56, 0.72, 0.86), ("Volatility", "Beta", "Deepest fall", "Largest position", "Behaves like")):
        tour.at(part)
        tour.hover(tour.text(label).first, where=(0.5, 2.0))
    tour.end()

    tour.say("C03-hoy")
    tour.show(tour.text("Today, position by position"), at=0.1)
    tour.to(1000, 330)
    tour.at(0.52)
    tour.show(tour.text("Every position"), at=0.12)
    tour.at(0.74)
    tour.click(page.locator("th", has_text="Volatility").last, after=0.9)
    tour.end(0.3)
    tour.click(page.locator("th", has_text="Beta").last, after=1.0)

    leave(tour, tour.side("Watchlist"))


def take_d(tour: Tour) -> None:
    """Watchlist: the wall of charts, the readings and the map."""
    page = tour.page
    opened(tour, HUB + "/watchlist/")
    tour.settle(1.0)
    bar, chips = page.locator("#watch-bar"), page.locator("#watch-chips")

    tour.say("D01-watchlist")
    tour.to(700, 420)
    tour.at(0.24)
    tour.click(bar.get_by_text("4", exact=True), after=0.9)
    tour.at(0.36)
    tour.click(bar.get_by_text("2Y", exact=True), after=0.9)
    tour.at(0.44)
    tour.click(bar.get_by_text("Line", exact=True), after=0.9)
    tour.click(bar.get_by_text("Candles", exact=True), after=0.3)
    tour.at(0.6)
    tour.click(chips.get_by_text("META", exact=True), after=0.7)
    tour.click(chips.get_by_text("META", exact=True), after=0.3)
    tour.at(0.76)
    tour.click(chips.get_by_text("all", exact=True).nth(1), after=1.2)
    tour.click(chips.get_by_text("none", exact=True).nth(1), after=0.3)
    tour.at(0.9)
    pick(tour, page.locator("#watch-add input").first, "tesla", after=1.0)
    tour.end(1.6)

    tour.say("D02-readings")
    tour.click(bar.get_by_text("Readings", exact=True))
    tour.settle(0.8)
    tour.to(640, 400)
    tour.at(0.16)
    tour.down(250, 1.4)
    tour.at(0.4)
    tour.down(300, 2.4)
    tour.at(0.62)
    tour.down(280, 2.4)
    tour.end()

    tour.say("D03-map")
    tour.scroll(0, 1.0)
    tour.click(bar.get_by_text("Map", exact=True))
    tour.settle(0.6)
    tour.down(260, 1.0)
    tour.to(520, 380)
    tour.at(0.22)
    tour.to(1050, 380, 1.6)
    tour.at(0.42)
    tour.to(820, 600, 0.8)
    tour.to(820, 200, 1.6)
    tour.at(0.62)
    tour.show(page.locator("#watch-stage table"), at=0.3)
    tour.at(0.82)
    tour.click(page.locator("#watch-stage table tbody tr").first, where=(0.2, 0.5))
    tour.settle(0.8)
    tour.end(2.0)
    page.keyboard.press("Escape")
    tour.wait(0.6)

    leave(tour, tour.side("Community"))


def take_e(tour: Tour) -> None:
    """Community: sharing the portfolio, the board, and the monthly competition."""
    page = tour.page
    api = account(tour)     # as seed.py left it: not shared, and with no entry
    api.put(HUB + "/api/sharing", headers={"origin": HUB}, data={"enabled": False})
    api.delete(HUB + "/api/competitions/entry", headers={"origin": HUB})
    opened(tour, HUB + "/community/")

    tour.say("E01-compartir")
    tour.to(520, 300)
    tour.at(0.38)
    tour.type(page.get_by_placeholder("A name to be shown under"), DEMO["handle"], after=0.3)
    tour.at(0.54)
    tour.hover(tour.text("What others see"), where=(1.2, 2.6), stay=0.4)
    tour.at(0.76)
    tour.hover(tour.text("What nobody sees"), where=(1.2, 2.6), stay=0.4)
    tour.end()
    tour.click(tour.text("Share my portfolio"))
    tour.settle(0.8)

    tour.say("E02-tablero")
    tour.show(tour.text("Where you stand"), at=0.08)
    tour.to(700, 430)
    tour.at(0.28)
    tour.click(tour.text("1 month").last, after=1.0)
    tour.click(tour.text("This year").last, after=0.5)
    tour.at(0.5)
    tour.hover(tour.text("Where you stand"), where=(2.5, 4.0), stay=0.3)
    tour.at(0.64)
    tour.click(tour.text("silicon lane").first, after=0.8)
    tour.at(0.84)
    tour.hover(tour.text("evergreen").first)
    tour.end()

    tour.say("E03-competicion")
    tour.scroll(0, 0.9)
    tour.click(tour.text("Monthly competition").first)
    tour.settle(0.3)
    tour.to(480, 300)
    tour.at(0.36)
    tour.hover(tour.text("October 2026").first, stay=0.3)
    tour.at(0.74)
    tour.hover(tour.text("November 2026").first, where=(0.5, 2.2), stay=0.3)
    tour.end()

    tour.say("E04-apuesta")
    tour.click(page.get_by_role("button", name=re.compile("Build your entry")).first)
    tour.settle(0.4)
    tour.show(tour.text("Add a stock"), at=0.25)
    add = page.get_by_placeholder("Company or ticker").locator("visible=true").first
    for company in ("nvidia", "microsoft", "jpmorgan", "costco"):
        pick(tour, add, company, after=0.8)
        tour.wait(0.5)
    tour.hover(tour.text("What an entry needs"), where=(0.8, 3.0), stay=0.4)
    tour.end(0.2)
    tour.click(page.get_by_role("button", name=re.compile("Send my entry")), after=1.2)
    tour.settle(0.4)
    tour.bottom(3.0)
    tour.wait(1.2)

    leave(tour, tour.side("Fundamentals"))


def take_f(tour: Tour) -> None:
    """Fundamentals Lab."""
    page = tour.page
    opened(tour, TOOLS["fundamentals"] + "/")
    tour.say("F01-fundamentals")
    tour.to(640, 300)
    tour.at(0.2)
    pick(tour, page.locator("main input").first, "Apple")
    page.wait_for_url("**/stock/**")
    tour.settle(1.0)
    tour.at(0.38)
    tour.hover(tour.text("Key numbers"), where=(2.0, 3.5), stay=0.3)
    main = page.locator("main")
    for part, tab in ((0.46, "Fundamentals"), (0.55, "Valuation & forward"), (0.63, "Technical")):
        tour.at(part)
        tour.click(main.get_by_text(tab, exact=True).locator("visible=true").last, after=0.8)
        tour.down(260, 0.9)
        tour.wait(0.3)
        tour.scroll(0, 0.6)
    tour.at(0.72)
    tour.click(main.get_by_text("Overview", exact=True).locator("visible=true").last, after=0.4)
    tour.hover(tour.text("Write the reading"), stay=0.4)
    tour.at(0.88)
    tour.click(page.get_by_role("link", name="Compare", exact=True).first)
    tour.settle(0.5)
    tour.end(0.2)
    box = page.locator("main input").first
    for company in ("Apple", "Microsoft", "Alphabet"):
        pick(tour, box, company)
        tour.wait(0.8)
    tour.settle(1.0)
    tour.bottom(4.0)
    tour.wait(0.8)
    leave(tour, tour.side("Earnings"))


def take_g(tour: Tour) -> None:
    """Earnings Radar. Reading a release asks a paid model, so none is asked for: the box is shown, and the trends."""
    page = tour.page
    opened(tour, TOOLS["earnings"] + "/?hub")
    tour.say("G01-earnings")
    tour.to(600, 300)
    tour.at(0.3)
    tour.hover(tour.text("What you get"), where=(1.0, 4.0), stay=0.3)
    tour.at(0.52)
    tour.scroll(0, 0.6)
    tour.type(page.locator("main input").first, "Nvidia", after=0.6)
    tour.hover(page.get_by_role("button", name="Analyse").first, stay=0.3)
    tour.at(0.82)
    tour.click(page.get_by_role("link", name="Market trends", exact=True).first)
    tour.settle(0.8)
    tour.end(0.2)
    tour.bottom(7.0)
    tour.wait(0.6)
    leave(tour, tour.side("Peers"))


def take_h(tour: Tour) -> None:
    """Peer Map."""
    page = tour.page
    opened(tour, TOOLS["peers"] + "/")
    tour.say("H01-peers")
    tour.to(640, 330)
    tour.at(0.12)
    tour.down(330, 1.2)
    tour.to(560, 330, 1.0)
    tour.to(820, 480, 1.4)
    tour.at(0.56)
    tour.click(tour.text("Month").first, after=1.0)
    tour.at(0.7)
    pick(tour, page.get_by_placeholder("Company or ticker").first, "nvidia")
    tour.settle(1.5)
    tour.end(0.2)
    tour.hover(tour.text("Most similar business descriptions"), where=(0.5, 4.0), stay=0.6)
    tour.to(tour.pointer[0], tour.pointer[1] + 220, 2.0)
    tour.wait(1.0)
    leave(tour, tour.side("Playground"))


def take_i(tour: Tour) -> None:
    """Playground, with its stand-in composer (PLAYGROUND_SCRIPTED=1): it knows tickers in capitals, "table" and a range."""
    page = tour.page
    opened(tour, TOOLS["playground"] + "/")
    tour.say("I01-playground")
    tour.to(640, 330)
    box = page.get_by_placeholder("A chart, a comparison, a table")
    tour.at(0.24)
    tour.type(box, "Compare NVDA, AMD and TSM this year: YTD", after=0.3)
    page.keyboard.press("Enter")
    tour.settle(2.0)
    tour.at(0.6)
    tour.type(box, "A table of AAPL MSFT GOOGL AMZN", after=0.3)
    page.keyboard.press("Enter")
    tour.settle(2.0)
    tour.end(0.2)
    tour.to(520, 380, 0.8)
    tour.bottom(3.0)
    tour.wait(1.0)
    leave(tour, tour.side("Account and data"))


def take_j(tour: Tour) -> None:
    """Account and data, and what the viewer is asked to do."""
    opened(tour, HUB + "/account/")
    tour.say("J01-cuenta")
    tour.hover(tour.text("What we keep"), where=(1.5, 5.0))
    for part, label in ((0.42, "Download my data (JSON)"), (0.6, "Change your password"), (0.78, "Delete my account")):
        tour.at(part)
        tour.hover(tour.text(label).first, stay=0.3)
    tour.end()

    tour.say("J02-probar")
    tour.scroll(0, 0.9)
    tour.click(tour.side("Overview"))
    tour.settle(0.8)
    for part, name in ((0.2, "Overview"), (0.25, "Analysis"), (0.3, "Watchlist"), (0.37, "Community"), (0.5, "Fundamentals")):
        tour.at(part)
        tour.hover(tour.side(name), stay=0.2)
    tour.at(0.6)
    tour.to(700, 380, 1.0)
    tour.down(900, max(2.0, tour.left(0.95)))
    tour.end(0.6)


# A is the deployed site. B to E and J need the portal on this machine (`hub-demo-windows`); F, G, H and I need,
# besides it, their tool (`fundamentals-`, `radar-`, `peers-` and `playground-demo-windows`).
TAKES = {"A": take_a, "B": take_b, "C": take_c, "D": take_d, "E": take_e, "F": take_f, "G": take_g, "H": take_h, "I": take_i,
         "J": take_j}
ORDER = list(TAKES)


# --- The film ------------------------------------------------------------------------------------


def _run(args: list[str], cwd: Path | None = None) -> str:
    done = subprocess.run(args, capture_output=True, text=True, errors="replace", cwd=cwd)
    if done.returncode:
        raise RuntimeError(f"ffmpeg failed: {done.stderr.strip()[-800:]}")
    return done.stderr


def join() -> None:
    """Every take, in order, as one film with the voice where each stretch was started."""
    tool, rate = ffmpeg(), 24000
    parts, sound, at = [], bytearray(), 0.0
    for name in TAKES:
        folder = BUILD / "takes" / name
        if not (folder / "take.json").is_file():
            print(f"take {name} is not recorded: left out")
            continue
        take = json.loads((folder / "take.json").read_text(encoding="utf-8"))
        start, end = take["from"], take["to"]
        # The picture on screen when the take starts is the last one painted before it.
        before = [f for f in take["frames"] if f[1] <= start]
        shown = ([[before[-1][0], start]] if before else []) + [f for f in take["frames"] if start < f[1] < end]
        lines = []
        for (file, when), nxt in zip(shown, [f[1] for f in shown[1:]] + [end]):
            lines += [f"file '{file}'", f"duration {max(nxt - max(when, start), 0.001):.4f}"]
        lines.append(f"file '{shown[-1][0]}'")
        (folder / "frames.txt").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
        phone = tuple(take["window"]) != WINDOW
        look = ("scale=-2:1080:flags=lanczos,pad=1920:1080:(ow-iw)/2:0:color=0x0a0b0d" if phone else "scale=1920:1080:flags=lanczos")
        part = BUILD / f"take-{name}.mp4"
        _run([tool, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "frames.txt", "-vf", f"fps={FPS},{look},format=yuv420p",
              "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-t", f"{end - start:.3f}", str(part)], cwd=folder)
        seconds = render.length(part)
        # Its voice: each stretch where it was started, on silence.
        track = bytearray(int(seconds * rate) * 2)
        for stretch, when in take["marks"]:
            with wave.open(str(VOICES / f"{stretch}.wav")) as said:
                if (said.getframerate(), said.getnchannels(), said.getsampwidth()) != (rate, 1, 2):
                    raise RuntimeError(f"voice/{stretch}.wav is not {rate} Hz, one channel, 16 bits")
                words = said.readframes(said.getnframes())
            first = int((when - start) * rate) * 2
            words = words[:max(0, len(track) - first)]
            track[first:first + len(words)] = words
        sound += track
        parts.append(part)
        print(f"  take {name}  {seconds:6.1f}s  {len(shown)} pictures, {len(take['marks'])} stretches, from {int(at) // 60}:{int(at) % 60:02d}")
        at += seconds
    if not parts:
        raise RuntimeError("no take is recorded")
    with wave.open(str(BUILD / "voice.wav"), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(rate)
        out.writeframes(bytes(sound))
    (BUILD / "takes.txt").write_text("".join(f"file '{p.name}'\n" for p in parts), encoding="utf-8", newline="\n")
    film = BUILD / "demo.mp4"
    _run([tool, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "takes.txt", "-i", "voice.wav", "-c:v", "copy",
          "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", str(film)], cwd=BUILD)
    _run([tool, "-y", "-loglevel", "error", "-i", str(film), "-vf", "scale=1280:720", "-c:v", "libx264", "-crf", "27", "-preset", "slow",
          "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(BUILD / "demo-720p.mp4")])
    print(f"build/demo.mp4  {int(at) // 60}:{int(at) % 60:02d}  (and build/demo-720p.mp4, lighter)")


def record(names: list[str]) -> None:
    with sync_playwright() as play:
        for name in names or list(TAKES):
            print(f"take {name}")
            tour = Tour(play, name)
            # The pointer starts where the take before left it.
            last = BUILD / "takes" / ORDER[ORDER.index(name) - 1] / "take.json" if name != "A" else None
            if last and last.is_file():
                tour.pointer = json.loads(last.read_text(encoding="utf-8")).get("pointer", tour.pointer)
            try:
                TAKES[name](tour)
                tour.cut()
            except Exception:
                shot = BUILD / f"failed-{name}.jpg"
                try:
                    tour.page.screenshot(path=str(shot), type="jpeg", quality=70)
                    print(f"  failed; the page as it was is in {shot}")
                finally:
                    tour.browser.close()
                raise


if __name__ == "__main__":
    command, rest = (sys.argv[1] if len(sys.argv) > 1 else ""), sys.argv[2:]
    if command == "voice":
        speak(dry="--dry" in rest)
    elif command == "take":
        record(rest)
    elif command == "join":
        join()
    else:
        sys.exit(__doc__)
