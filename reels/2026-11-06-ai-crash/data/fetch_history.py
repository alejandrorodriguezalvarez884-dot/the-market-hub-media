"""Daily closes from Yahoo Finance's chart API, from 1 Nov 2022 to today, one JSON per symbol."""
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path

SYMBOLS = ["^GSPC", "^NDX", "^SOX", "^DJI", "^VIX", "RSP", "XLK", "XLU", "XLE", "XLP", "XLV", "XLF", "IGV", "SMH",
           "NVDA", "MSFT", "GOOGL", "AMZN", "META", "AAPL", "TSLA", "AVGO", "MU", "AMD", "ORCL", "CSCO", "VST", "CEG", "PLTR"]
P1 = 1667260800  # 2022-11-01 UTC
here = Path(__file__).parent
for s in SYMBOLS:
    q = urllib.parse.urlencode({"period1": P1, "period2": int(time.time()), "interval": "1d", "events": "div,split"})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(s)}?{q}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        data = urllib.request.urlopen(req, timeout=30).read()
    except Exception as e:  # keep going, report
        print(s, "FAILED", e); continue
    name = "yahoo-" + s.replace("^", "").replace("=", "_") + ".json"
    (here / name).write_bytes(data)
    print(s, len(data))
    time.sleep(0.6)
