"""Returns since ChatGPT (close of 29 Nov 2022), peak, drawdown, YTD, 1 month and the last day, from the yahoo-*.json here."""
import json, datetime as dt
from pathlib import Path
here = Path(__file__).parent
out = {}
for f in sorted(here.glob("yahoo-*.json")):
    r = json.loads(f.read_text())["chart"]["result"][0]
    ts = r["timestamp"]; c = r["indicators"]["quote"][0]["close"]
    tz = r["meta"]["gmtoffset"]
    rows = [(dt.datetime.utcfromtimestamp(t + tz).date().isoformat(), v) for t, v in zip(ts, c) if v is not None]
    d = dict(rows)
    def at(day):  # last close on or before day
        return [v for k, v in rows if k <= day][-1]
    base = at("2022-11-29"); last_day, last = rows[-1]; prev = rows[-2][1]
    peak_day, peak = max(rows, key=lambda x: x[1])
    ye = at("2025-12-31"); m1 = at("2026-10-05")
    pre = [ (k,v) for k,v in rows if k <= "2026-11-04"]
    out[f.stem[6:]] = dict(base=round(base,2), last_day=last_day, last=round(last,2), since=round((last/base-1)*100,1),
        peak_day=peak_day, peak=round(peak,2), to_peak=round((peak/base-1)*100,1), from_peak=round((last/peak-1)*100,1),
        ytd=round((last/ye-1)*100,1), m1=round((last/m1-1)*100,1), day=round((last/prev-1)*100,2))
for k, v in out.items():
    print(f"{k:6} base {v['base']:>9} last {v['last_day']} {v['last']:>9} since {v['since']:>7}% peak {v['peak_day']} {v['to_peak']:>7}% fromPeak {v['from_peak']:>6}% ytd {v['ytd']:>6}% 1m {v['m1']:>6}% day {v['day']:>6}%")
(here / "returns.json").write_text(json.dumps(out, indent=1))
