"""Read Yahoo Finance quotes (regular, after-hours, pre-market) and today's intraday
bars with extended hours for the stocks of this reel, and save them as JSON.

Usage: python fetch_moves.py <out_dir>
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import yfinance as yf

TICKERS = ["CRWV", "IREN", "CIFR", "NBIS", "APLD", "CORZ", "WULF", "GLXY",
           "NVDA", "ORCL", "^GSPC", "^IXIC", "ES=F", "NQ=F", "CL=F", "BZ=F"]

KEYS = ["shortName", "longName", "currency", "marketState", "regularMarketPreviousClose",
        "regularMarketPrice", "regularMarketChangePercent", "regularMarketTime",
        "postMarketPrice", "postMarketChangePercent", "postMarketTime",
        "preMarketPrice", "preMarketChangePercent", "preMarketTime",
        "fiftyTwoWeekHigh", "fiftyTwoWeekLow", "marketCap"]


def main(out: Path) -> None:
    read_at = datetime.now(timezone.utc).isoformat()
    result = {"read_at_utc": read_at, "source": "Yahoo Finance via yfinance", "tickers": {}}
    for sym in TICKERS:
        t = yf.Ticker(sym)
        info = t.info
        entry = {k: info.get(k) for k in KEYS}
        bars = t.history(period="5d", interval="5m", prepost=True)
        entry["bars_5m"] = [
            {"t": ts.tz_convert("UTC").isoformat(), "close": round(float(r.Close), 4)}
            for ts, r in bars.iterrows()
        ]
        daily = t.history(period="1mo", interval="1d")
        entry["daily"] = [
            {"d": ts.strftime("%Y-%m-%d"), "close": round(float(r.Close), 4)}
            for ts, r in daily.iterrows()
        ]
        result["tickers"][sym] = entry
    (out / "moves.json").write_text(json.dumps(result, indent=1), encoding="utf-8")
    print("saved", out / "moves.json", read_at)


if __name__ == "__main__":
    main(Path(sys.argv[1]))
