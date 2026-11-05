"""Read today's Yahoo Finance quotes for the companies of this reel's journey and save them.

Usage: uv run python fetch_quotes.py <out_dir>
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import yfinance as yf

TICKERS = ["ASML", "TSM", "NVDA", "AMD", "AMZN", "MSFT", "GOOGL", "CRWV", "NBIS", "^SOX", "^GSPC", "^NDX"]
KEYS = ["shortName", "currency", "marketState", "regularMarketPreviousClose", "regularMarketPrice",
        "regularMarketChangePercent", "regularMarketTime", "preMarketPrice", "preMarketChangePercent",
        "preMarketTime"]


def main(out: Path) -> None:
    read_at = datetime.now(timezone.utc).isoformat()
    result = {"read_at_utc": read_at, "source": "Yahoo Finance via yfinance", "tickers": {}}
    for sym in TICKERS:
        info = yf.Ticker(sym).info
        result["tickers"][sym] = {k: info.get(k) for k in KEYS}
    stamp = datetime.now(timezone.utc).strftime("%H%Mutc")
    path = out / f"quotes-{stamp}.json"
    path.write_text(json.dumps(result, indent=1), encoding="utf-8")
    print("saved", path, read_at)
    for sym, q in result["tickers"].items():
        print(f"{sym:6} {q['marketState']:8} reg {q['regularMarketChangePercent']} pre {q['preMarketChangePercent']}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
