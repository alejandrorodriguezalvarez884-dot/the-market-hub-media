"""The average S&P 500 path around the 20 midterms since 1946 (data/sp500-daily.json, Yahoo).

For each election: closes from 210 trading days before to 252 after, each divided by the last
close before election day (= 100). The mean and median of the 20, per trading day, go to
data/path.json, with 2026 so far on the same scale (base: the close of 2026-11-02, day -1).
"""
import json
from datetime import date
from pathlib import Path
from statistics import mean, median

from midterms import ELECTIONS, rows  # noqa: E402

here = Path(__file__).parent
BEFORE, AFTER = 210, 252
paths = []
for e in ELECTIONS:
    day = date.fromisoformat(e)
    i = max(n for n, r in enumerate(rows) if r[0] < day)   # base index (day -1 -> x=0)
    base = rows[i][1]
    paths.append([round(rows[i + k][1] / base * 100, 3) for k in range(-BEFORE, AFTER + 1)])
avg = [round(mean(p[k] for p in paths), 3) for k in range(BEFORE + AFTER + 1)]
med = [round(median(p[k] for p in paths), 3) for k in range(BEFORE + AFTER + 1)]
last = len(rows) - 1
now = [round(rows[last + k][1] / rows[last][1] * 100, 3) for k in range(-BEFORE, 1)]
lo = min(range(BEFORE), key=lambda k: avg[k])
out = {"x_from": -BEFORE, "x_to": AFTER, "mean": avg, "median": med, "y2026": now,
       "mean_low": {"day": lo - BEFORE, "value": avg[lo]},
       "mean_start": avg[0], "mean_at_252": avg[-1], "mean_at_126": avg[BEFORE + 126], "mean_at_63": avg[BEFORE + 63]}
(here / "path.json").write_text(json.dumps(out), encoding="utf-8")
print({k: v for k, v in out.items() if k not in ("mean", "median", "y2026")})
print("2026 start of window", now[0], "min", min(now))

# The same, as the slides read it: window.MIDTERMS = {...} (every 3rd trading day, to keep it light).
STEP = 3
js = {"from": -BEFORE, "to": AFTER, "step": STEP,
      "years": [e[:4] for e in ELECTIONS],
      "paths": [p[::STEP] for p in paths], "mean": avg[::STEP], "y2026": now[::STEP]}
(here / "path.js").write_text("window.MIDTERMS = " + json.dumps(js) + ";\n", encoding="utf-8")
