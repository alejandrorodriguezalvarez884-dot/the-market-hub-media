"""Takes the screenshots the slides show, from a portal running on this machine (see seed.py).

    python shoot.py [http://127.0.0.1:8088] [a name, to take only the shots whose name has it]

Each shot is the browser's window, 1280 by 720, photographed at twice that size so a slide can
move in on a part of it: ../slides/shots/<name>.jpg. The window is signed in as the demo account
of seed.py. A shot is a place (a page, and how far down it) and, for some, what is pressed first.
"""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

from seed import DEMO, PASSWORD

API = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8088").rstrip("/")
ONLY = sys.argv[2] if len(sys.argv) > 2 else ""
SHOTS = Path(__file__).resolve().parent.parent / "slides" / "shots"
WINDOW = {"width": 1280, "height": 720}


def settle(page: Page, ms: int = 1500) -> None:
    page.wait_for_load_state("networkidle", timeout=120000)
    page.wait_for_timeout(ms)


def go(page: Page, path: str) -> None:
    page.goto(API + path, wait_until="domcontentloaded", timeout=120000)
    settle(page, 2500)


def down(page: Page, to: str | int) -> None:
    """Scroll until a heading with this text is near the top of the window, or by so many pixels."""
    if isinstance(to, int):
        page.evaluate("(y) => window.scrollTo(0, y)", to)
    else:
        target = page.get_by_text(to, exact=True).first
        target.evaluate("(el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 28)")
    page.wait_for_timeout(700)


def shot(page: Page, name: str) -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(SHOTS / f"{name}.jpg"), type="jpeg", quality=88)
    print(f"  shots/{name}.jpg")


def wanted(name: str) -> bool:
    return not ONLY or ONLY in name


def overview(page: Page) -> None:
    go(page, "/dashboard/")
    shot(page, "overview-top")
    down(page, "Today's holdings against the indices")
    shot(page, "overview-chart")
    down(page, "Positions")
    shot(page, "overview-positions")
    down(page, "What it is made of")
    shot(page, "overview-made-of")


def portfolio(page: Page) -> None:
    go(page, "/portfolio/")
    shot(page, "portfolio")
    box = page.get_by_placeholder("Company or ticker").first
    box.click()
    box.type("nvid", delay=60)
    page.wait_for_timeout(1500)
    shot(page, "portfolio-search")
    box.fill("")
    down(page, 100000)
    shot(page, "portfolio-watchlist")


def analysis(page: Page) -> None:
    go(page, "/analysis/")
    shot(page, "analysis-sector")
    page.get_by_text("By volatility", exact=True).click()
    page.wait_for_timeout(600)
    shot(page, "analysis-volatility")
    down(page, "Against the indices")
    shot(page, "analysis-indices")
    down(page, "Today, position by position")
    shot(page, "analysis-today")
    down(page, "Every position")
    shot(page, "analysis-every")


def press(page: Page, text: str, nth: int = 0, wait: int = 1200) -> None:
    page.get_by_text(text, exact=True).locator("visible=true").nth(nth).click()
    page.wait_for_timeout(wait)


def watchlist(page: Page) -> None:
    go(page, "/watchlist/")
    settle(page, 3000)
    shot(page, "watch-charts")
    press(page, "all", nth=1, wait=400)      # the positions too
    press(page, "12", wait=400)
    settle(page, 5000)
    shot(page, "watch-wall")
    press(page, "none", nth=1, wait=400)
    press(page, "Readings")
    settle(page, 4000)
    shot(page, "watch-readings")
    down(page, 430)
    shot(page, "watch-readings-2")
    down(page, 0)
    press(page, "Map")
    settle(page, 2500)
    shot(page, "watch-map")
    down(page, 520)
    shot(page, "watch-table")
    page.locator("#watch-stage table tbody tr").first.click()
    settle(page, 4000)
    shot(page, "watch-drawer")
    page.keyboard.press("Escape")
    down(page, 0)
    press(page, "Charts")
    box = page.locator("#watch-add input").first
    box.click()
    box.type("tesla", delay=60)
    page.wait_for_timeout(1500)
    shot(page, "watch-look")


def community(page: Page) -> None:
    page.context.request.put(API + "/api/sharing", data={"enabled": False}, headers={"origin": API})   # an earlier run's
    go(page, "/community/")
    name = page.get_by_placeholder("A name to be shown under")
    name.click()
    name.type(DEMO["handle"], delay=40)
    shot(page, "share-form")
    press(page, "Share my portfolio")
    settle(page, 2500)
    shot(page, "share-on")
    down(page, "Where you stand")
    shot(page, "board")
    row = page.get_by_text("silicon lane", exact=True).first
    row.click()
    page.wait_for_timeout(1500)
    row.evaluate("(el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150)")
    page.wait_for_timeout(700)
    shot(page, "board-open")


def competition(page: Page) -> None:
    page.context.request.delete(API + "/api/competitions/entry", headers={"origin": API})   # an earlier run's
    go(page, "/community/competitions/")
    shot(page, "competition-top")
    down(page, "How it works")
    shot(page, "competition-rules")
    down(page, 0)
    page.locator("#views button").nth(1).click()   # "Your entry", with a tick once it is in
    settle(page, 1500)
    shot(page, "entry-empty")
    picks = [{"ticker": t, "weight": w} for t, w in DEMO["picks"]]
    sent = page.context.request.put(API + "/api/competitions/entry", data={"handle": DEMO["handle"], "picks": picks}, headers={"origin": API})
    print("  entry", sent.status, sent.text()[:120] if sent.status != 200 else "")
    go(page, "/community/competitions/")
    shot(page, "competition-in")
    page.locator("#views button").nth(1).click()   # "Your entry", with a tick once it is in
    settle(page, 1500)
    shot(page, "entry")
    down(page, 380)
    shot(page, "entry-2")


def account(page: Page) -> None:
    go(page, "/account/")
    shot(page, "account")


# The tools are services of their own. Each is started on this machine with no sign-in asked
# (HUB_URL empty) and with no key of a model, so nothing here is paid for; a tool's shots are
# taken only when it is named, with its server running.
TOOLS = {"fundamentals": "http://127.0.0.1:8094", "earnings": "http://localhost:8093", "peers": "http://127.0.0.1:8085",
         "playground": "http://127.0.0.1:8087"}


def at(page: Page, address: str) -> None:
    page.goto(address, wait_until="domcontentloaded", timeout=120000)
    settle(page, 3500)


def fundamentals(page: Page) -> None:
    at(page, TOOLS["fundamentals"] + "/stock/?t=AAPL")
    shot(page, "fundamentals")
    for tab, name in (("Fundamentals", "fundamentals-statements"), ("Valuation & forward", "fundamentals-valuation"), ("Technical", "fundamentals-technical")):
        page.locator("main").get_by_text(tab, exact=True).locator("visible=true").last.click()
        settle(page, 2500)
        shot(page, name)
    at(page, TOOLS["fundamentals"] + "/compare/?t=AAPL,MSFT,GOOGL")
    shot(page, "fundamentals-compare")


def earnings(page: Page) -> None:
    # Reading a release asks a paid model, so no company is opened: the home page and the trends
    # (worked out beforehand, in the repo) are what is shown. Started with HUB_URL at this portal
    # it asks for its session, and on "localhost" with ?hub it wears My Hub's navigation, as the
    # deployed one does: so the demo account signs in on that name too.
    hub = API.replace("127.0.0.1", "localhost")
    page.context.request.post(hub + "/api/auth/password", data={"email": DEMO["email"], "password": PASSWORD}, headers={"origin": hub})
    at(page, TOOLS["earnings"] + "/?hub")
    shot(page, "earnings")
    at(page, TOOLS["earnings"] + "/trends/")
    shot(page, "earnings-trends")
    down(page, 620)
    shot(page, "earnings-trends-2")


def peers(page: Page) -> None:
    at(page, TOOLS["peers"] + "/")
    settle(page, 4000)
    shot(page, "peers")
    down(page, 330)
    shot(page, "peers-map")
    box = page.get_by_placeholder("Company or ticker").first
    box.click()
    box.type("nvidia", delay=60)
    page.wait_for_timeout(1500)
    page.keyboard.press("ArrowDown")
    page.keyboard.press("Enter")
    settle(page, 3500)
    down(page, 330)
    shot(page, "peers-company")


def playground(page: Page) -> None:
    # Started with PLAYGROUND_SCRIPTED=1 the board is composed by code that knows a few words
    # (tickers in capitals, "table", a range), not by the model: nothing is paid for. The figures
    # are the provider's all the same.
    at(page, TOOLS["playground"] + "/")
    shot(page, "playground")
    box = page.get_by_placeholder("A chart, a comparison, a table")
    for n, asked in enumerate(("Compare NVDA, AMD and TSM this year: YTD", "A table of AAPL MSFT GOOGL AMZN", "And a chart of KO over 2Y"), 1):
        box.click()
        box.type(asked, delay=25)
        page.keyboard.press("Enter")
        settle(page, 5000)
        shot(page, f"playground-{n}")


# The phone app, in its browser view (market-hub-mobile, `make web`): a phone-sized window, three
# times as sharp. Whatever portal that view was started against, its calls are sent to this one.
APP = "http://localhost:8090"
PHONE = {"width": 390, "height": 844}


def phone(browser) -> None:
    context = browser.new_context(viewport=PHONE, device_scale_factor=3, locale="en-US", has_touch=True)
    page = context.new_page()
    page.route("http://localhost:*/api/**", lambda route: route.continue_(url=API + "/api/" + route.request.url.split("/api/", 1)[1]))
    page.goto(APP + "/sign-in", wait_until="domcontentloaded", timeout=180000)
    settle(page, 4000)
    shot(page, "app-sign-in")
    page.get_by_label("Email").fill(DEMO["email"])
    page.get_by_label("Password").fill(PASSWORD)
    page.get_by_text("Sign in", exact=True).last.click()
    settle(page, 6000)
    shot(page, "app-overview")
    for path, name in (("/analysis", "app-analysis"), ("/watchlist", "app-watchlist"), ("/community", "app-community"),
                       ("/stock/NVDA", "app-stock"), ("/more", "app-more")):
        page.goto(APP + path, wait_until="domcontentloaded", timeout=120000)
        settle(page, 5000)
        shot(page, name)
    context.close()


SCENES = {"overview": overview, "portfolio": portfolio, "analysis": analysis, "watchlist": watchlist, "community": community,
          "competition": competition, "account": account}


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        try:
            context = browser.new_context(viewport=WINDOW, device_scale_factor=2, locale="en-US")
            entered = context.request.post(API + "/api/auth/password", data={"email": DEMO["email"], "password": PASSWORD},
                                           headers={"origin": API})
            if entered.status != 200:
                sys.exit(f"shoot: the demo account is not there ({entered.status}): run seed.py first")
            page = context.new_page()
            for name, scene in SCENES.items():
                if wanted(name):
                    print(name)
                    scene(page)
            for name, scene in {"fundamentals": fundamentals, "earnings": earnings, "peers": peers, "playground": playground}.items():
                if ONLY == name:
                    print(name)
                    scene(page)
            if ONLY == "phone":
                print("phone")
                phone(browser)
            if wanted("signin"):   # as someone who has not signed in sees it
                print("signin")
                page = browser.new_context(viewport=WINDOW, device_scale_factor=2, locale="en-US").new_page()
                # Google words its button for the country the request comes from: ask for English.
                page.route("**/gsi/client*", lambda route: route.continue_(url="https://accounts.google.com/gsi/client?hl=en"))
                go(page, "/signin/")
                shot(page, "signin")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
