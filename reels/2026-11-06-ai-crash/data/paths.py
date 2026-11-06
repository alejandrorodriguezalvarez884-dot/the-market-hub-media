"""SVG paths for the reel's line charts, from the yahoo-*.json here: weekly closes (each Friday's, or
the last of the week) from the close of 29 Nov 2022, the day before ChatGPT, to the last close,
as a multiple of that first close. Prints the paths and the points of the marked days."""
import json, datetime as dt
from pathlib import Path
here = Path(__file__).parent

def load(s):
    r = json.loads((here / f"yahoo-{s}.json").read_text())["chart"]["result"][0]
    off = r["meta"]["gmtoffset"]
    return [(dt.datetime.fromtimestamp(t + off, dt.UTC).date(), v) for t, v in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]) if v]

def weekly(rows):
    out = {}
    for d, v in rows:
        if d < dt.date(2022, 11, 29): continue
        out[d.isocalendar()[:2]] = (d, v)
    first = [r for r in rows if r[0] <= dt.date(2022, 11, 29)][-1]
    pts = [first] + [p for p in out.values() if p[0] > first[0]]
    if pts[-1] != rows[-1]: pts.append(rows[-1])
    return pts

START, END = dt.date(2022, 11, 29), None
def path(symbol, W, H, lo, hi, log=False):
    import math
    rows = load(symbol); pts = weekly(rows); base = pts[0][1]
    end = pts[-1][0]; span = (end - START).days
    f = (lambda m: math.log(m)) if log else (lambda m: m)
    def xy(d, v):
        m = v / base
        return round((d - START).days / span * W, 1), round(H - (f(m) - f(lo)) / (f(hi) - f(lo)) * H, 1)
    p = " ".join(("M" if i == 0 else "L") + "%s %s" % xy(d, v) for i, (d, v) in enumerate(pts))
    return p, xy, rows, base

if __name__ == "__main__":
    import sys
    sym, W, H, lo, hi = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
    p, xy, rows, base = path(sym, W, H, lo, hi, log="log" in sys.argv)
    print(p)
    d = dict(rows)
    for day in sys.argv[6:]:
        if day == "log": continue
        k = dt.date.fromisoformat(day); v = [v for dd, v in rows if dd <= k][-1]
        print(day, round(v / base, 2), xy(k, v))
