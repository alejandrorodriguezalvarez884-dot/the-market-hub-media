"""Read the S&P 500 (^GSPC) daily closes from Yahoo Finance, 1945 to today, into data/.

candles.rows uses time.gmtime, which fails on Windows before 1970, so the days are made here.
"""
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "src"))
from marketmedia import candles  # noqa: E402

here = Path(__file__).parent
answer = candles.read("^GSPC", "1945-01-01", "2026-11-03")
(here / "yahoo-GSPC.json").write_text(json.dumps(answer), encoding="utf-8")
found = answer["chart"]["result"][0]
offset = int(found["meta"].get("gmtoffset", 0))
closes = found["indicators"]["quote"][0]["close"]
epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
out = [[(epoch + timedelta(seconds=s + offset)).strftime("%Y-%m-%d"), round(c, 4)]
       for s, c in zip(found["timestamp"], closes) if c is not None]
(here / "sp500-daily.json").write_text(json.dumps(out), encoding="utf-8")
print(len(out), out[0], out[-3:])
print(found["meta"].get("regularMarketTime"), found["meta"].get("regularMarketPrice"))
