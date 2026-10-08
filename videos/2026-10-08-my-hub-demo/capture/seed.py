"""Fills a portal running on this machine with the demo accounts the screenshots are taken from.

    python seed.py [http://127.0.0.1:8088] [the portal's data folder]

The portal is market-hub-landing started with MARKETHUB_OPEN_REGISTRATION=1 and a data folder of
its own (the workspace's `hub-demo-windows` launch configuration): accounts are made without a
captcha there, and nowhere else. Prices are the provider's, so each average cost is set from
today's price, to give the demo account gains and losses of an ordinary size.

With the portal's data folder, it also leaves there today's news as the public portal serves it to
anyone (https://themarkethub.app/api/public/news), so "News on your stocks" has real headlines
without this machine reading the sources or paying a model to write them. Do that before the
portal starts, or restart it.

Running it again signs in to the accounts it made and saves the same things.
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from http.cookiejar import CookieJar
from pathlib import Path

API = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8088").rstrip("/")
if not API.startswith(("http://127.0.0.1:", "http://localhost:")):
    sys.exit(f"seed: {API} is not a portal on this machine")

# Local accounts, good for nothing but a developer's machine.
PASSWORD = "market hub local demo"
# The account the video is seen through: (ticker, shares, average cost as a share of today's price).
DEMO = {
    "email": "demo@markethub.test", "name": "Sam Demo", "handle": "sam demo",
    "positions": [("AAPL", 15, 0.78), ("MSFT", 8, 0.86), ("NVDA", 25, 0.62), ("JPM", 12, 0.81), ("KO", 40, 0.93),
                  ("XOM", 18, 1.06), ("UNH", 6, 1.14), ("ASML", 3, 0.88), ("TSM", 14, 0.7), ("COST", 3, 0.9)],
    "watchlist": ["GOOGL", "AMZN", "META", "LLY", "V", "CAT"],
    "picks": [("NVDA", 25), ("MSFT", 20), ("JPM", 20), ("COST", 15), ("XOM", 10), ("LLY", 10)],
}
# The others on the board: (name they play under, picks with their weights). Their portfolio is
# those same stocks in those proportions.
OTHERS = [
    ("evergreen", [("MSFT", 30), ("COST", 20), ("V", 20), ("JNJ", 15), ("PG", 15)]),
    ("silicon lane", [("NVDA", 35), ("AVGO", 25), ("AMD", 20), ("TSM", 20)]),
    ("slow and steady", [("KO", 25), ("PEP", 20), ("JNJ", 20), ("PG", 20), ("MCD", 15)]),
    ("bluechipper", [("AAPL", 25), ("JPM", 20), ("XOM", 15), ("UNH", 15), ("HD", 15), ("CAT", 10)]),
    ("fast tape", [("TSLA", 30), ("META", 25), ("AMZN", 25), ("NFLX", 20)]),
    ("dividend desk", [("CVX", 25), ("ABBV", 20), ("VZ", 20), ("O", 20), ("T", 15)]),
]

class Portal:
    """One browser's worth of the portal: its own cookies."""

    def __init__(self) -> None:
        self.open = urllib.request.build_opener(urllib.request.ProxyHandler({}), urllib.request.HTTPCookieProcessor(CookieJar())).open

    def call(self, method: str, path: str, body: dict | None = None) -> tuple[int, dict]:
        request = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                         headers={"origin": API, "content-type": "application/json"})
        try:
            with self.open(request, timeout=120) as answer:
                return answer.status, json.loads(answer.read() or b"{}")
        except urllib.error.HTTPError as error:
            return error.code, json.loads(error.read() or b"{}")

    def must(self, method: str, path: str, body: dict | None = None) -> dict:
        status, answer = self.call(method, path, body)
        if status != 200:
            sys.exit(f"seed: {method} {path} -> {status} {answer}")
        return answer

    def enter(self, email: str, name: str) -> None:
        # Signing in comes first: the portal counts every try at a new account, five an hour.
        there, _ = self.call("POST", "/api/auth/password", {"email": email, "password": PASSWORD})
        if there != 200:
            self.must("POST", "/api/auth/register", {"email": email, "password": PASSWORD, "name": name})


def price(portal: Portal, ticker: str) -> float:
    return float(portal.must("GET", f"/api/public/quote?t={ticker}")["price"])


def news(folder: Path, public: str = "https://themarkethub.app") -> None:
    """Today's public news front, saved where a local portal reads its own."""
    with urllib.request.urlopen(f"{public}/api/public/news?limit=200", timeout=60) as answer:
        front = json.loads(answer.read())
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    (folder / "news").mkdir(parents=True, exist_ok=True)
    (folder / "news" / "front.json").write_text(json.dumps({
        "items": front["items"], "press": front.get("press", []), "seen": [],
        "refreshed_utc": now, "started_utc": None, "since_utc": now}), encoding="utf-8")
    print(f"seed: {len(front['items'])} news items in {folder / 'news'}")


def main() -> None:
    if len(sys.argv) > 2:
        news(Path(sys.argv[2]))
    members: dict[str, Portal] = {}
    for handle, picks in OTHERS:
        portal = members[handle] = Portal()
        portal.enter(f"{handle.replace(' ', '.')}@markethub.test", handle.title())
        positions = [{"ticker": t, "shares": round(100 * weight / price(portal, t), 2), "avg_cost": None} for t, weight in picks]
        portal.must("PUT", "/api/portfolio", {"positions": positions, "watchlist": []})
        portal.must("PUT", "/api/sharing", {"enabled": True, "handle": handle})
        portal.must("PUT", "/api/competitions/entry", {"handle": handle, "picks": [{"ticker": t, "weight": w} for t, w in picks]})
        print(f"seed: {handle}")

    portal = members[DEMO["handle"]] = Portal()
    portal.enter(DEMO["email"], DEMO["name"])
    positions = [{"ticker": t, "shares": shares, "avg_cost": round(price(portal, t) * part, 2)} for t, shares, part in DEMO["positions"]]
    portal.must("PUT", "/api/portfolio", {"positions": positions, "watchlist": DEMO["watchlist"]})
    print(f"seed: {DEMO['email']} (its password is at the top of this file)")

    print("seed: done")


if __name__ == "__main__":
    main()
