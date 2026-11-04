"""The daily candles of one stock or index, read from Yahoo Finance, for a chart-reading reel
("Lee el gráfico": skill chart-reel).

A reel of that line shows a real episode of a real chart: the candles are read here once and kept
in the reel's data/ folder, twice:

- data/candles.json, Yahoo's answer as it came (the source, kept as it was read);
- data/candles.js, the same candles as the slides read them: ``window.CANDLES = {...}``, loaded
  by a slide with ``<script src="../data/candles.js"></script>`` before theme/chart.js.

A reel can also show other stocks beside its own (other cases of the same pattern): those are
kept with ``also=True`` as data/candles-<symbol>.json and data/candles-<symbol>.js, which adds
them to ``window.MORE_CANDLES["<SYMBOL>"]``; a slide passes them to theme/chart.js as ``data:``.

Yahoo's daily candles are adjusted for splits, not for dividends. Nothing here picks the episode
or the pattern: that is thought in the session (the skill).
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from datetime import date as Date
from datetime import datetime, timedelta, timezone
from pathlib import Path

CHART = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?{query}"
PAGE = "https://finance.yahoo.com/quote/{symbol}/history/"


def url(symbol: str, start: str, end: str) -> str:
    """Yahoo's address for the daily candles of ``symbol`` from ``start`` to ``end`` (both kept)."""
    first = datetime.combine(Date.fromisoformat(start), datetime.min.time(), timezone.utc)
    last = datetime.combine(Date.fromisoformat(end) + timedelta(days=1), datetime.min.time(), timezone.utc)
    query = urllib.parse.urlencode({"period1": int(first.timestamp()), "period2": int(last.timestamp()),
                                    "interval": "1d", "includePrePost": "false"})
    return CHART.format(symbol=urllib.parse.quote(symbol), query=query)


def read(symbol: str, start: str, end: str) -> dict:
    """Yahoo's answer, as it comes."""
    request = urllib.request.Request(url(symbol, start, end), headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def rows(answer: dict) -> list[list]:
    """Its candles: [day, open, high, low, close, volume], the day as Yahoo's exchange has it."""
    result = (answer.get("chart") or {}).get("result") or []
    if not result:
        error = (answer.get("chart") or {}).get("error") or {}
        raise ValueError(f"Yahoo Finance gave no candles: {error.get('description') or 'empty answer'}")
    found = result[0]
    offset = int(found.get("meta", {}).get("gmtoffset", 0))
    quote = found["indicators"]["quote"][0]
    out = []
    for n, stamp in enumerate(found.get("timestamp") or []):
        values = [quote[k][n] for k in ("open", "high", "low", "close")]
        if any(v is None for v in values):
            continue   # a day Yahoo has no prices for
        day = time.strftime("%Y-%m-%d", time.gmtime(stamp + offset))
        out.append([day, *(round(float(v), 4) for v in values), int(quote["volume"][n] or 0)])
    return out


def chart(answer: dict, read_at: str) -> dict:
    """What a slide is given: who, from where, when it was read, and the candles."""
    candles = rows(answer)   # first: an answer with no candles says why
    meta = answer["chart"]["result"][0].get("meta", {})
    symbol = meta.get("symbol", "")
    return {
        "symbol": symbol,
        "name": meta.get("longName") or meta.get("shortName") or symbol,
        "currency": meta.get("currency", ""),
        "source": f"Yahoo Finance, velas diarias de {symbol} | {PAGE.format(symbol=urllib.parse.quote(symbol))}",
        "read_at": read_at,
        "rows": candles,
    }


def files(symbol: str, also: bool = False) -> str:
    """The name, without its extension, of the files in data/ that keep a stock's candles."""
    if not also:
        return "candles"
    return "candles-" + "".join(ch for ch in symbol.lower() if ch.isalnum() or ch in "-.")


def keep(folder: Path, symbol: str, start: str, end: str, answer: dict | None = None, also: bool = False) -> dict:
    """Read the candles (or take ``answer``) and leave them in ``folder``/data. Returns what the
    slides get. ``also``: another stock beside the reel's own, kept apart (module docstring)."""
    answer = answer if answer is not None else read(symbol, start, end)
    read_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    given = chart(answer, read_at)
    if not given["rows"]:
        raise ValueError(f"Yahoo Finance gave no candles for {symbol} from {start} to {end}")
    data = folder / "data"
    data.mkdir(parents=True, exist_ok=True)
    name = files(symbol, also)
    (data / f"{name}.json").write_text(json.dumps(answer, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    where = (f"(window.MORE_CANDLES = window.MORE_CANDLES || {{}})[{json.dumps(given['symbol'] or symbol)}]"
             if also else "window.CANDLES")
    (data / f"{name}.js").write_text(
        "// Read from Yahoo Finance by `make candles` (src/marketmedia/candles.py). Do not edit by hand.\n"
        f"{where} = {json.dumps(given, ensure_ascii=False)};\n", encoding="utf-8", newline="\n")
    return given
