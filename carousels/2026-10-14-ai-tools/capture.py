"""Photographs of the tools, for the carousels that present them on Instagram.

    uv run python carousels/2026-10-14-ai-tools/capture.py [name ...]     (from the-market-hub-media)

Each tool is photographed as it runs on this machine with the same code as the deployed one, real
prices from Yahoo Finance and no key of a model (the workspace's *-local-windows and
playground-yahoo-windows launch configurations), except the Earnings Radar, which is photographed
from its public deployment (https://earningsradar.app), the same code as the one in My Hub. Nothing
here pays for a model: the PlayGround runs with its scripted composer, which spends nothing.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

HERE = Path(__file__).resolve().parent
SHOTS = HERE / "build" / "shots"
DESK = {"width": 1440, "height": 900}

OPTIONS = "http://127.0.0.1:8089"
PEERS = "http://127.0.0.1:8085"
PLAYGROUND = "http://127.0.0.1:8087"
FUNDAMENTALS = "http://127.0.0.1:8084"
RADAR = "https://earningsradar.app"


def settle(page: Page, wait_ms: int = 2500) -> None:
    page.wait_for_load_state("networkidle", timeout=90000)
    page.wait_for_timeout(wait_ms)


def condor(page: Page) -> None:
    page.locator("select").first.select_option("iron-condor")
    page.get_by_role("button", name="Use").click()
    settle(page, 3000)
    page.add_style_tag(content="#saved, [data-saved] { display: none !important }")


def tab(name: str):
    def go(page: Page) -> None:
        page.get_by_role("tab", name=name, exact=True).click()
        settle(page, 3000)
    return go


def contract(page: Page) -> None:
    page.locator("td", has_text=re.compile(r"^235$")).first.click()
    settle(page, 1500)


def chat(page: Page, words: str) -> None:
    box = page.locator("textarea, input[type=text]").last
    box.fill(words)
    box.press("Enter")
    settle(page, 4000)


# (name, address, what to do on the page before the photograph, how tall the photograph is)
SHOTS_TODO = [
    ("options-chain", OPTIONS + "/?t=NVDA", None, 1800),
    ("options-strategy", OPTIONS + "/strategy/?t=NVDA", condor, 2400),
    ("peers-map", PEERS + "/?t=NVDA", None, 1100),
    ("playground", PLAYGROUND + "/", lambda p: (chat(p, "Compare NVDA, AMD, AVGO and TSM over 1Y"),
                                                chat(p, "Show NVDA over 6M with the 50 and 200 day averages"),
                                                chat(p, "A table of AAPL, MSFT, GOOGL, AMZN and META")), 1800),
    ("fund-overview", FUNDAMENTALS + "/stock/?t=NVDA#overview", None, 1800),
    ("fund-fundamentals", FUNDAMENTALS + "/stock/?t=NVDA", tab("Fundamentals"), 2400),
    ("fund-valuation", FUNDAMENTALS + "/stock/?t=NVDA", tab("Valuation & forward"), 2400),
    ("fund-technical", FUNDAMENTALS + "/stock/?t=NVDA", tab("Technical"), 2400),
    ("fund-compare", FUNDAMENTALS + "/compare/?t=NVDA,AMD,AVGO,INTC", None, 1800),
    ("radar-home", RADAR + "/", None, 1300),
    ("radar-nvda", RADAR + "/company/nvda/", None, 2600),
    ("radar-trends", RADAR + "/trends/", None, 2400),
]


def main(only: list[str]) -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as play:
        browser = play.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport=DESK, device_scale_factor=2, locale="en-US", color_scheme="dark")
        context.route("**/cloudflareinsights.com/**", lambda route: route.abort())
        page = context.new_page()
        for name, address, act, height in SHOTS_TODO:
            if only and name not in only:
                continue
            page.set_viewport_size(DESK)
            page.goto(address, wait_until="domcontentloaded", timeout=90000)
            settle(page)
            if act:
                act(page)
            page.add_style_tag(content="::-webkit-scrollbar { display: none }")
            page.evaluate("window.scrollTo(0, 0)")
            page.set_viewport_size({"width": DESK["width"], "height": height})
            settle(page, 1500)
            page.screenshot(path=str(SHOTS / f"{name}.png"))
            print(f"  {name}.png")
        browser.close()


if __name__ == "__main__":
    main(sys.argv[1:])
