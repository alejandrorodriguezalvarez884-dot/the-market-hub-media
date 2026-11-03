"""The chart-reading reels, "Lee el gráfico" (skill chart-reel): the candles read from Yahoo
Finance, the countdown's ticking clock, and the voice of the line."""

import json
import subprocess
from pathlib import Path

from marketmedia import candles, render
from marketmedia import channel as channels
from marketmedia import script as scripts

# Yahoo's answer, cut down: two days with prices and one without (a day it has nothing for).
ANSWER = {"chart": {"result": [{
    "meta": {"symbol": "TSLA", "longName": "Tesla, Inc.", "currency": "USD", "gmtoffset": -14400},
    "timestamp": [1743427800, 1743514200, 1743600600],   # 31 March, 1 and 2 April 2025, 13:30 UTC
    "indicators": {"quote": [{"open": [249.31, None, 254.6], "high": [260.56, None, 284.99],
                              "low": [243.36, None, 251.27], "close": [259.16, None, 282.76],
                              "volume": [134008900, None, 212787800]}]},
}], "error": None}}

COUNTDOWN = """---
title: Un doble suelo
description: Un gráfico real y cinco segundos para pensar.
kind: reel
sources:
  - Yahoo Finance | https://finance.yahoo.com/quote/TSLA/history/
  - StockCharts | https://chartschool.stockcharts.com/
---

## 01-hook

¿Qué crees que pasó después? Tienes cinco segundos.

## 02-countdown
seconds: 5
sound: tick

## 03-name

Un doble suelo.
"""


def test_the_candles_are_the_days_yahoo_has_prices_for():
    rows = candles.rows(ANSWER)
    assert rows == [["2025-03-31", 249.31, 260.56, 243.36, 259.16, 134008900],
                    ["2025-04-02", 254.6, 284.99, 251.27, 282.76, 212787800]]


def test_the_address_asks_for_daily_candles_from_the_first_day_to_the_last():
    address = candles.url("^GSPC", "2025-01-02", "2025-07-10")
    assert address.startswith("https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?")
    assert "interval=1d" in address
    assert "period1=1735776000" in address          # 2025-01-02 00:00 UTC
    assert "period2=1752192000" in address          # 2025-07-11 00:00 UTC: the last day is kept


def test_the_candles_are_kept_as_read_and_as_the_slides_read_them(tmp_path):
    given = candles.keep(tmp_path, "TSLA", "2025-03-31", "2025-04-02", answer=ANSWER)
    assert json.loads((tmp_path / "data" / "candles.json").read_text(encoding="utf-8")) == ANSWER
    script = (tmp_path / "data" / "candles.js").read_text(encoding="utf-8")
    assert "window.CANDLES = " in script
    slides = json.loads(script.split("window.CANDLES = ", 1)[1].strip().rstrip(";"))
    assert slides == given
    assert slides["name"] == "Tesla, Inc." and slides["symbol"] == "TSLA" and len(slides["rows"]) == 2
    assert slides["source"].endswith("https://finance.yahoo.com/quote/TSLA/history/")


def test_no_candles_is_an_error_not_an_empty_chart(tmp_path):
    empty = {"chart": {"result": None, "error": {"description": "No data found"}}}
    try:
        candles.keep(tmp_path, "XXXX", "2025-01-02", "2025-01-03", answer=empty)
    except ValueError as exc:
        assert "No data found" in str(exc)
    else:
        raise AssertionError("an empty answer was kept")
    assert not (tmp_path / "data" / "candles.js").exists()


def test_a_countdown_is_a_scene_where_nothing_is_said_and_a_clock_ticks():
    script = scripts.parse(COUNTDOWN)
    countdown = script.scenes[1]
    assert countdown.narration == "" and countdown.seconds == 5 and countdown.sound == "tick"
    assert script.scenes[0].sound == ""
    assert not [p for p in scripts.problems(script) if "sound" in p]


def test_a_sound_is_only_one_the_code_makes_and_only_where_nothing_is_said():
    unknown = scripts.parse(COUNTDOWN.replace("sound: tick", "sound: drums"))
    assert any("'sound: drums' is not one of tick" in p for p in scripts.problems(unknown))
    spoken = scripts.parse(COUNTDOWN.replace("## 03-name\n", "## 03-name\nsound: tick\n"))
    assert any("scene 03-name: 'sound:' is for a scene where nothing is said" in p for p in scripts.problems(spoken))


def test_the_tick_is_made_by_ffmpeg_and_heard(tmp_path):
    out = tmp_path / "tick.wav"
    subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", "-f", "lavfi", "-i", render.TICK, "-t", "2",
                    "-ac", "2", "-ar", "48000", str(out)], check=True)
    assert abs(render.length(out) - 2.0) < 0.05
    level = subprocess.run([render.ffmpeg(), "-hide_banner", "-i", str(out), "-af", "volumedetect", "-f", "null", "-"],
                           capture_output=True, text=True, errors="replace").stderr
    loudest = float(level.split("max_volume:")[1].split("dB")[0])
    assert -20 < loudest < 0     # heard, and not clipping


def test_the_line_has_its_own_voice():
    channel = channels.load().for_reels("grafico")
    assert channel.voice_name == "7xK0jqLEWCrIBJ8ymBJi"   # Rafalupi, picked by the owner (2026-11-03)
    others = {channels.load().for_reels(v).voice_name for v in ("reflexion", "didactico")} | {channels.load().for_reels().voice_name}
    assert channel.voice_name not in others


def test_the_chart_script_is_loaded_after_the_reel_script_in_every_chart_slide():
    root = Path(__file__).resolve().parents[1]
    for slide in sorted(root.glob("reels/*grafico*/slides/*.html")):
        text = slide.read_text(encoding="utf-8")
        if "chart.js" in text:
            assert text.index("theme/reel.js") < text.index("theme/chart.js"), slide
            assert "../data/candles.js" in text, slide
