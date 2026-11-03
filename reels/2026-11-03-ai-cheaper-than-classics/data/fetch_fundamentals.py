"""Read fundamentals and one year of prices from Yahoo Finance (yfinance) and save them as JSON.

Usage: python fetch_fundamentals.py <out_dir>
"""
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

import yfinance as yf

TICKERS = ["NVDA", "MU", "SNDK", "000660.KS", "GOOGL", "META",
           "WMT", "KO", "COST", "PG"]

INFO_KEYS = [
    "shortName", "currency", "financialCurrency", "currentPrice", "regularMarketPrice",
    "marketCap", "enterpriseValue", "trailingPE", "forwardPE", "pegRatio", "trailingPegRatio",
    "trailingEps", "forwardEps", "revenueGrowth", "earningsGrowth", "earningsQuarterlyGrowth",
    "grossMargins", "operatingMargins", "profitMargins", "ebitdaMargins", "ebitda",
    "totalRevenue", "freeCashflow", "operatingCashflow", "totalDebt", "totalCash",
    "debtToEquity", "enterpriseToEbitda", "enterpriseToRevenue", "priceToSalesTrailing12Months",
    "fiftyTwoWeekHigh", "fiftyTwoWeekLow", "fiftyTwoWeekChange", "52WeekChange",
    "dividendYield", "beta", "returnOnEquity", "netIncomeToCommon", "sharesOutstanding",
    "mostRecentQuarter", "lastFiscalYearEnd",
]


def clean(v):
    if v is None:
        return None
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    try:
        import numpy as np
        if isinstance(v, (np.floating,)):
            return None if np.isnan(v) else float(v)
        if isinstance(v, (np.integer,)):
            return int(v)
    except ImportError:
        pass
    return v


def frame(df):
    if df is None or getattr(df, "empty", True):
        return None
    out = {}
    for col in df.columns:
        out[str(col)] = {str(idx): clean(df.loc[idx, col]) for idx in df.index}
    return out


def one(ticker: str) -> dict:
    t = yf.Ticker(ticker)
    info = t.info or {}
    rec = {"ticker": ticker, "info": {k: clean(info.get(k)) for k in INFO_KEYS}}
    for name in ("earnings_estimate", "revenue_estimate", "growth_estimates", "eps_trend"):
        try:
            rec[name] = frame(getattr(t, name))
        except Exception as e:  # noqa: BLE001
            rec[name] = {"error": str(e)}
    try:
        inc = t.income_stmt
        rows = [r for r in ("Total Revenue", "Net Income", "Diluted EPS", "Operating Income", "EBITDA")
                if r in inc.index]
        rec["income_annual"] = frame(inc.loc[rows])
    except Exception as e:  # noqa: BLE001
        rec["income_annual"] = {"error": str(e)}
    try:
        cf = t.cashflow
        rows = [r for r in ("Free Cash Flow", "Operating Cash Flow", "Capital Expenditure") if r in cf.index]
        rec["cashflow_annual"] = frame(cf.loc[rows])
    except Exception as e:  # noqa: BLE001
        rec["cashflow_annual"] = {"error": str(e)}
    try:
        qcf = t.quarterly_cashflow
        rows = [r for r in ("Free Cash Flow", "Operating Cash Flow", "Capital Expenditure") if r in qcf.index]
        rec["cashflow_quarterly"] = frame(qcf.loc[rows])
        qinc = t.quarterly_income_stmt
        rows = [r for r in ("Total Revenue", "Net Income", "Diluted EPS", "Operating Income") if r in qinc.index]
        rec["income_quarterly"] = frame(qinc.loc[rows])
    except Exception as e:  # noqa: BLE001
        rec["quarterly_error"] = str(e)
    hist = t.history(period="2y", interval="1d", auto_adjust=False)
    rec["closes"] = {d.strftime("%Y-%m-%d"): round(float(c), 4) for d, c in hist["Close"].items()}
    return rec


def main():
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    read_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    for tk in TICKERS:
        try:
            rec = one(tk)
        except Exception as e:  # noqa: BLE001
            rec = {"ticker": tk, "error": str(e)}
        rec["read_utc"] = read_at
        rec["source"] = f"Yahoo Finance via yfinance, https://finance.yahoo.com/quote/{tk}"
        (out / f"yahoo-{tk.replace('.', '_')}.json").write_text(json.dumps(rec, indent=1, default=str), encoding="utf-8")
        print(tk, "ok" if "error" not in rec else rec["error"])


if __name__ == "__main__":
    main()
