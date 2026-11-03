"""The S&P 500 around each US midterm election since 1946, from data/sp500-daily.json (Yahoo).

Base: the last close before election day (the NYSE shut on election day until 1968).
After: the last close on or before the same day 3, 6 and 12 months later.
Midterm year: from the last close of the year before to the base; and the deepest fall
from a closing high to a later closing low within the midterm year, up to its last close.
Presidential cycle: calendar-year price returns 1949-2025 (Truman's 2nd term on), by year of term.
Price only (no dividends), as Yahoo gives ^GSPC.
"""
import json
from datetime import date
from pathlib import Path
from statistics import mean, median

here = Path(__file__).parent
rows = [(date.fromisoformat(d), c) for d, c in json.loads((here / "sp500-daily.json").read_text())]

ELECTIONS = ["1946-11-05", "1950-11-07", "1954-11-02", "1958-11-04", "1962-11-06", "1966-11-08",
             "1970-11-03", "1974-11-05", "1978-11-07", "1982-11-02", "1986-11-04", "1990-11-06",
             "1994-11-08", "1998-11-03", "2002-11-05", "2006-11-07", "2010-11-02", "2014-11-04",
             "2018-11-06", "2022-11-08"]


def before(day):
    return [r for r in rows if r[0] < day][-1]


def on_or_before(day):
    return [r for r in rows if r[0] <= day][-1]


def shift(day, months):
    m = day.month - 1 + months
    y, m = day.year + m // 12, m % 12 + 1
    return date(y, m, min(day.day, 28))


def pct(a, b):
    return round((b / a - 1) * 100, 2)


out = []
for e in ELECTIONS:
    day = date.fromisoformat(e)
    base = before(day)
    prev_year_end = before(date(day.year, 1, 1))
    year = [r for r in rows if r[0].year == day.year]
    peak, dd, trough_day, peak_day_at = year[0][1], 0.0, None, None
    pk_day = year[0][0]
    for d, c in year:
        if c > peak:
            peak, pk_day = c, d
        fall = (c / peak - 1) * 100
        if fall < dd:
            dd, trough_day, peak_day_at = fall, d, pk_day
    rec = {"election": e, "base_day": base[0].isoformat(), "base": base[1],
           "ytd_to_election": pct(prev_year_end[1], base[1]),
           "max_drawdown_in_year": round(dd, 2), "dd_peak": str(peak_day_at), "dd_trough": str(trough_day)}
    for m in (3, 6, 12):
        tgt = shift(day, m)
        r = on_or_before(tgt)
        rec[f"after_{m}m"] = pct(base[1], r[1])
    # 3 and 6 months before
    for m in (3, 6):
        r = on_or_before(shift(day, -m))
        rec[f"before_{m}m"] = pct(r[1], base[1])
    out.append(rec)

summary = {}
for k in ("before_6m", "before_3m", "ytd_to_election", "max_drawdown_in_year", "after_3m", "after_6m", "after_12m"):
    v = [r[k] for r in out]
    summary[k] = {"mean": round(mean(v), 2), "median": round(median(v), 2), "positive": sum(x > 0 for x in v),
                  "n": len(v), "min": min(v), "max": max(v)}

# Presidential cycle: calendar years 1949..2025; year 1 = inauguration year.
cyc = {1: [], 2: [], 3: [], 4: []}
for y in range(1949, 2026):
    a, b = before(date(y, 1, 1))[1], before(date(y + 1, 1, 1))[1]
    cyc[(y - 1949) % 4 + 1].append(pct(a, b))
cycle = {k: {"mean": round(mean(v), 2), "median": round(median(v), 2), "n": len(v),
             "positive": sum(x > 0 for x in v)} for k, v in cyc.items()}

# 2026 so far
ytd2026 = pct(before(date(2026, 1, 1))[1], rows[-1][1])
year26 = [r for r in rows if r[0].year == 2026]
peak, dd = year26[0][1], 0
for d, c in year26:
    peak = max(peak, c)
    dd = min(dd, (c / peak - 1) * 100)

res = {"elections": out, "summary": summary, "cycle_1949_2025": cycle,
       "y2026": {"last": [rows[-1][0].isoformat(), rows[-1][1]], "ytd": ytd2026, "max_drawdown": round(dd, 2),
                 "high": max(year26, key=lambda r: r[1])[0].isoformat(), "high_close": max(r[1] for r in year26)}}
(here / "midterms.json").write_text(json.dumps(res, indent=1, default=str), encoding="utf-8")
for r in out:
    print(r["election"], r["ytd_to_election"], r["max_drawdown_in_year"], r["after_3m"], r["after_6m"], r["after_12m"])
print(json.dumps(summary, indent=1))
print(json.dumps(cycle, indent=1))
print(res["y2026"])
