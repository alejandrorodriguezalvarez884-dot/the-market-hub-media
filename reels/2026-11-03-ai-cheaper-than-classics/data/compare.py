"""One comparable table from the saved Yahoo JSON: forward 12-month P/E (consensus EPS weighted by
the months left in each fiscal year), expected EPS growth next fiscal year, a PEG on it, margins,
trailing free-cash-flow yield, EV/EBITDA, net cash, and the price against its one-year high.

Usage: python compare.py <data_dir>   -> prints the table and writes <data_dir>/comparison.json
"""
import json
import sys
from pathlib import Path

d = Path(sys.argv[1])
AS_OF = "2026-11-03"

# Months left in the current fiscal year ("0y" in Yahoo's estimates) as of 2026-11-03,
# from each company's fiscal-year end (Yahoo's lastFiscalYearEnd + 1 year).
MONTHS_LEFT = {
    "NVDA": 3,       # FY2027 ends late January 2027
    "MU": 10,        # FY2027 ends early September 2027
    "SNDK": 8,       # FY2027 ends early July 2027
    "000660.KS": 2,  # calendar year
    "GOOGL": 2, "META": 2, "KO": 2,
    "WMT": 3,        # FY2027 ends 31 January 2027
    "COST": 10,      # FY2027 ends late August 2027
    "PG": 8,         # FY2027 ends 30 June 2027
}
GROUP = {"NVDA": "ai", "MU": "ai", "SNDK": "ai", "000660.KS": "ai", "GOOGL": "ai", "META": "ai",
         "WMT": "classic", "KO": "classic", "COST": "classic", "PG": "classic"}

rows = []
for tk in GROUP:
    r = json.loads((d / f"yahoo-{tk.replace('.', '_')}.json").read_text(encoding="utf-8"))
    i = r["info"]
    ee = r["earnings_estimate"]
    eps0, eps1 = ee["avg"]["0y"], ee["avg"]["+1y"]
    eps_prev = ee["yearAgoEps"]["0y"]
    g0, g1 = ee["growth"]["0y"], ee["growth"]["+1y"]
    rev = r["revenue_estimate"]
    rg0, rg1 = rev["growth"]["0y"], rev["growth"]["+1y"]
    m = MONTHS_LEFT[tk]
    ntm = m / 12 * eps0 + (12 - m) / 12 * eps1
    closes = r["closes"]
    days = sorted(closes)
    last_day = days[-1]
    price = closes[last_day]
    year = [k for k in days if k >= f"{int(last_day[:4]) - 1}{last_day[4:]}"]
    hi_day = max(year, key=lambda k: closes[k])
    q = r["cashflow_quarterly"] or {}
    qcols = sorted(q, reverse=True)[:4]
    fcf4 = sum((q[c].get("Free Cash Flow") or 0) for c in qcols)
    fcf_quarters = [c[:10] for c in qcols]
    mcap = i["marketCap"]
    pe_ntm = price / ntm
    rows.append({
        "ticker": tk, "group": GROUP[tk], "name": i["shortName"], "currency": i["currency"],
        "price": price, "price_day": last_day,
        "high_1y": closes[hi_day], "high_day": hi_day,
        "from_high_pct": round((price / closes[hi_day] - 1) * 100, 1),
        "change_1y_pct": round((price / closes[year[0]] - 1) * 100, 1), "change_1y_from": year[0],
        "eps_last_fy": eps_prev, "eps_this_fy": eps0, "eps_next_fy": eps1, "eps_ntm": round(ntm, 4),
        "eps_growth_this_fy_pct": round(g0 * 100, 1), "eps_growth_next_fy_pct": round(g1 * 100, 1),
        "rev_growth_this_fy_pct": round(rg0 * 100, 1), "rev_growth_next_fy_pct": round(rg1 * 100, 1),
        "pe_ntm": round(pe_ntm, 1), "pe_ttm_yahoo": i["trailingPE"], "pe_fwd_yahoo": i["forwardPE"],
        "peg_next_fy": round(pe_ntm / (g1 * 100), 2) if g1 and g1 > 0 else None,
        "peg_yahoo": i["trailingPegRatio"],
        "rev_growth_last_q_pct": round(i["revenueGrowth"] * 100, 1) if i["revenueGrowth"] is not None else None,
        "gross_margin_pct": round(i["grossMargins"] * 100, 1), "op_margin_pct": round(i["operatingMargins"] * 100, 1),
        "net_margin_pct": round(i["profitMargins"] * 100, 1),
        "fcf_4q": fcf4, "fcf_quarters": fcf_quarters, "market_cap": mcap,
        "fcf_yield_pct": round(fcf4 / mcap * 100, 2),
        "ev_ebitda_yahoo": i["enterpriseToEbitda"],
        "debt": i["totalDebt"], "cash": i["totalCash"], "net_cash": (i["totalCash"] or 0) - (i["totalDebt"] or 0),
        "dividend_yield_pct": i["dividendYield"],
    })

out = {"as_of": AS_OF, "source": "Yahoo Finance via yfinance, read 2026-11-03 (see yahoo-*.json)",
       "method": "pe_ntm = last close / (consensus EPS of this fiscal year x months left/12 + next fiscal year x the rest/12); "
                 "peg_next_fy = pe_ntm / expected EPS growth of the next fiscal year in %; "
                 "fcf_yield = free cash flow of the last four reported quarters / market cap",
       "rows": rows}
import statistics
keys = ["pe_ntm", "eps_growth_next_fy_pct", "rev_growth_this_fy_pct", "rev_growth_next_fy_pct", "op_margin_pct",
        "fcf_yield_pct", "from_high_pct", "change_1y_pct", "peg_next_fy"]
out["medians"] = {g: {k: round(statistics.median([r[k] for r in rows if r["group"] == g and r[k] is not None]), 2) for k in keys}
                  for g in ("ai", "classic")}
print(out["medians"])
(d / "comparison.json").write_text(json.dumps(out, indent=1), encoding="utf-8")

hdr = f"{'tk':10}{'hi%':>7}{'1y%':>7}{'PEntm':>7}{'gEPS0':>7}{'gEPS1':>7}{'gRev0':>7}{'gRev1':>7}{'PEG1':>6}{'opM':>6}{'netM':>6}{'FCFy':>6}{'EV/EB':>7}{'netcash%':>9}"
print(hdr)
for x in rows:
    nc = x["net_cash"] / x["market_cap"] * 100
    peg = "-" if x["peg_next_fy"] is None else f"{x['peg_next_fy']:.2f}"
    print(f"{x['ticker']:10}{x['from_high_pct']:>7}{x['change_1y_pct']:>7}{x['pe_ntm']:>7}{x['eps_growth_this_fy_pct']:>7}{x['eps_growth_next_fy_pct']:>7}"
          f"{x['rev_growth_this_fy_pct']:>7}{x['rev_growth_next_fy_pct']:>7}{peg:>6}{x['op_margin_pct']:>6}{x['net_margin_pct']:>6}{x['fcf_yield_pct']:>6}"
          f"{(x['ev_ebitda_yahoo'] or 0):>7.1f}{nc:>9.1f}")
for x in rows:
    print(x["ticker"], x["price"], x["price_day"], "hi", x["high_1y"], x["high_day"], "1y from", x["change_1y_from"], "fcfq", x["fcf_quarters"], "fcf4", round(x["fcf_4q"] / 1e9, 2))
