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


def _tone(seconds: float, rate: int = 24000, loud: bool = True) -> bytes:
    import array
    import math
    from marketmedia import voice
    samples = array.array("h", (int(8000 * math.sin(n / 5)) if loud else 0 for n in range(int(rate * seconds))))
    return voice.wav(samples.tobytes(), rate)


def test_a_narration_is_cut_into_sentences_but_not_at_an_ellipsis():
    from marketmedia import voice
    said = "Mira este gráfico. Cae... rebota... y vuelve a caer. ¿Qué crees que pasó después? Tienes cinco segundos."
    assert voice.sentences(said) == ["Mira este gráfico.", "Cae... rebota... y vuelve a caer.",
                                     "¿Qué crees que pasó después?", "Tienes cinco segundos."]
    assert voice.sentences("Y justo aquí... lo acaba de tocar.") == ["Y justo aquí... lo acaba de tocar."]


def test_sentences_are_said_one_by_one_with_their_context_and_a_set_pause_between_them():
    from dataclasses import replace

    from marketmedia import voice
    channel = replace(channels.load().for_reels("grafico"), voice_sentence_gap=0.5)
    asked = []

    def say(text, channel, before, after, speed):
        asked.append((text, before, after, speed))
        return voice.joined([_tone(0.2, loud=False), _tone(1.0), _tone(0.3, loud=False)], 0)   # silence round the voice

    sound = voice.eleven_sentences("Una frase. Otra frase.", channel, "Lo de antes.", "Lo de después.", speed=0.85, say=say)
    assert asked == [("Una frase.", "Lo de antes.", "Otra frase. Lo de después.", 0.85),
                     ("Otra frase.", "Lo de antes. Una frase.", "Lo de después.", 0.85)]
    seconds = len(voice._samples(sound)[1]) / 24000
    assert abs(seconds - (1.0 + 0.24 + 0.5 + 1.0 + 0.24)) < 0.02   # each trimmed to its voice (and 0.12 s a side), 0.5 s between


def test_a_sentence_fades_in_and_out_so_its_joins_do_not_click():
    from marketmedia import voice
    rate, samples = voice._samples(voice.faded(_tone(1.0)))
    assert abs(samples[0]) < 50 and abs(samples[-1]) < 50              # it starts and ends at silence...
    step = max(abs(samples[n + 1] - samples[n]) for n in range(len(samples) - 1))
    assert step < 2000                                                   # ...with no jump anywhere
    middle = samples[rate // 2 - 200: rate // 2 + 200]
    assert max(abs(v) for v in middle) > 7000                            # and the middle is untouched


def test_a_scene_can_ask_its_voice_to_go_slower():
    from marketmedia import voice
    script = scripts.parse(COUNTDOWN.replace("## 01-hook\n", "## 01-hook\nspeed: 0.85\n"))
    assert script.scenes[0].speed == 0.85 and script.scenes[2].speed is None
    body = voice.eleven_request("Hola.", channels.load().for_reels("grafico"), speed=script.scenes[0].speed)
    assert body["voice_settings"]["speed"] == 0.85 and body["voice_settings"]["stability"] == 0.4
    too_fast = scripts.parse(COUNTDOWN.replace("## 01-hook\n", "## 01-hook\nspeed: 1.5\n"))
    assert any("'speed:' goes from 0.7 to 1.2" in p for p in scripts.problems(too_fast))


def test_a_change_of_speed_or_of_the_pause_between_sentences_speaks_the_scene_again():
    from dataclasses import replace

    from marketmedia import voice
    channel = channels.load().for_reels("grafico")
    scene = scripts.parse(COUNTDOWN).scenes[0]
    marks = {voice._mark(scene, channel), voice._mark(replace(scene, speed=0.85), channel),
             voice._mark(scene, replace(channel, voice_sentence_gap=0.8))}
    assert len(marks) == 3


def _speech(*parts):
    """A made-up voice: (seconds, loud) pieces one after another."""
    from marketmedia import voice
    return voice.joined([_tone(seconds, loud=loud) for seconds, loud in parts], 0)


def _silences(sound: bytes) -> list[float]:
    from marketmedia import voice
    rate, samples = voice._samples(sound)
    out, run = [], 0
    for v in samples:
        if v == 0 or abs(v) < 20:
            run += 1
        else:
            if run > rate * 0.08:
                out.append(round(run / rate, 2))
            run = 0
    return out


def test_only_the_pauses_at_the_end_of_a_sentence_grow():
    from marketmedia import voice
    said = _speech((0.9, True), (0.25, False), (0.5, True), (0.15, False), (0.7, True))
    text = "Uno dos tres cuatro. Cinco seis, siete ocho nueve."
    assert _silences(said) == [0.25, 0.15]
    longer = voice.paused(said, text, 0.55)
    stop, comma = _silences(longer)
    assert abs(stop - 0.55) <= 0.03 and comma == 0.15          # the full stop's pause, not the comma's
    assert _silences(voice.paused(longer, text, 0.4)) == [stop, comma]   # one long enough already is left alone


def test_an_ellipsis_is_not_the_end_of_a_sentence():
    from marketmedia import voice
    said = _speech((0.6, True), (0.25, False), (0.9, True))
    assert _silences(voice.paused(said, "Cae... y vuelve a caer otra vez.", 0.55)) == [0.25]


def test_a_new_length_of_pause_is_made_from_the_kept_voice_and_nothing_is_paid(tmp_path, monkeypatch):
    from dataclasses import replace

    from marketmedia import reels, voice
    folder = tmp_path / "reels" / "2026-11-03-grafico-prueba"
    folder.mkdir(parents=True)
    (folder / "script.md").write_text(COUNTDOWN, encoding="utf-8")
    reel = reels.Reel(folder)
    script = scripts.parse(COUNTDOWN)
    calls = []
    monkeypatch.setattr(voice, "eleven_timed", lambda text, *a, **k: calls.append(text) or (_speech((0.6, True), (0.2, False), (0.6, True)), {}))
    channel = replace(channels.load().for_reels("grafico"), voice_sentence_gap=0.0, voice_sentence_pause=0.5)
    paid = voice.make(reel, script, channel, log=lambda line: None)
    assert paid == sum(len(s.narration) for s in script.scenes) and len(calls) == 2
    assert (folder / "voice" / "raw" / "01-hook.wav").is_file() and (folder / "voice" / "raw" / "01-hook.json").is_file()
    assert voice.to_pay(reel, script, replace(channel, voice_sentence_pause=0.8)) == 0
    again = voice.make(reel, script, replace(channel, voice_sentence_pause=0.8), log=lambda line: None)
    assert again == 0 and len(calls) == 2                    # the pauses made again from voice/raw/, nothing spoken
    assert not voice.pending(reel, script, replace(channel, voice_sentence_pause=0.8))


def test_the_line_says_each_scene_in_one_go_and_lengthens_its_sentence_pauses():
    channel = channels.load().for_reels("grafico")
    assert channel.voice_sentence_gap == 0 and channel.voice_sentence_pause >= 0.4


ALIGNMENT = {   # "Uno. Dos... tres. Cuatro." as ElevenLabs times it, one character every 0.1 s
    "characters": list("Uno. Dos... tres. Cuatro."),
    "character_start_times_seconds": [n / 10 for n in range(25)],
    "character_end_times_seconds": [n / 10 + 0.1 for n in range(25)],
}


def test_the_end_of_each_sentence_is_read_from_elevenlabs_times():
    from marketmedia import voice
    ends = voice.sentence_ends(ALIGNMENT)
    # "Uno." ends with the o (0.3) and "Dos" starts at 0.5; "tres." ends at 1.6 and "Cuatro" starts at 1.8;
    # the ellipsis after "Dos" is not an end, and the last full stop has nothing after it.
    assert [(round(a, 2), round(b, 2)) for a, b in ends] == [(0.3, 0.5), (1.6, 1.8)]


def test_with_elevenlabs_times_the_pause_goes_between_two_sentences():
    from marketmedia import voice
    said = _speech((0.9, True), (0.05, False), (1.55, True))  # a voice that barely stops between the two
    # the o of "Uno." ends at 0.9 and the D of "Dos." starts at 0.95: 0.05 s apart
    alignment = {"characters": list("Uno. Dos."), "character_start_times_seconds": [0, .3, .6, .9, .95, .95, 1.6, 2.0, 2.4],
                 "character_end_times_seconds": [.3, .6, .9, .95, .95, 1.6, 2.0, 2.4, 2.5]}
    longer = voice.paused(said, "Uno. Dos.", 0.5, alignment)
    assert _silences(longer) and abs(_silences(longer)[0] - 0.5) <= 0.03     # its own 0.05 s and 0.45 s more
    rate, samples = voice._samples(longer)
    start = next(n for n in range(int(0.85 * rate), len(samples)) if samples[n] == 0 and samples[n + 1] == 0)
    assert 0.85 <= start / rate <= 1.3                          # between the o of "Uno." and the D of "Dos."


def test_no_pause_goes_where_the_voice_runs_one_sentence_into_the_next():
    from marketmedia import voice
    said = _speech((2.5, True))                               # it never stops: any pause would cut a sound
    alignment = {"characters": list("Uno. Dos."), "character_start_times_seconds": [0, .3, .6, .9, .95, .95, 1.6, 2.0, 2.4],
                 "character_end_times_seconds": [.3, .6, .9, .95, .95, 1.6, 2.0, 2.4, 2.5]}
    assert voice.paused(said, "Uno. Dos.", 0.5, alignment) == voice.wav(voice._samples(said)[1].tobytes(), 24000)
