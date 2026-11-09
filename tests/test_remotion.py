"""Films drawn with Remotion (remotion.py): which pieces are, what is checked in their .tsx slides,
and what Remotion is told of the film. Rendering itself needs Node and Chrome, and is tried by
hand (make film PIECE=remotion/examples/2026-11-09-jensen-huang)."""

import json
import wave
from dataclasses import replace

import pytest

from marketmedia import channel as channels
from marketmedia import frames, reels, remotion, render
from marketmedia import script as scripts

from .conftest import REPO

SCRIPT = """---
title: Un reel de prueba
description: Dos escenas y una cuenta atrás.
kind: reel
sources:
  - Market Hub, el mercado de hoy | https://themarkethub.app/api/public/overview
  - La nota de la empresa | https://example.com/release
---

## 01-hook

Nvidia cae antes de abrir.

## 02-count
seconds: 5
sound: tick

## 03-question

¿Qué crees que pasó después?
"""

SCENE = 'import React from "react";\nimport { Look } from "@mh/kit";\nexport default () => <Look />;\n'


@pytest.fixture
def channel():
    return replace(channels.load(REPO / "channel.toml").for_reels(), reel_asked_seconds=(0, 100))


@pytest.fixture
def piece(tmp_path):
    path = tmp_path / "reels" / "2026-11-09-prueba"
    (path / "slides" / "look").mkdir(parents=True)
    (path / "script.md").write_text(SCRIPT, encoding="utf-8")
    for name in ("01-hook", "02-count", "03-question"):
        (path / "slides" / f"{name}.tsx").write_text(SCENE, encoding="utf-8")
    (path / "slides" / "look" / "own.tsx").write_text("export const x = 1;\n", encoding="utf-8")
    return reels.Reel(path)


def _voice(path, seconds=1.5, rate=48000):
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(rate)
        out.writeframes(b"\x00\x10" * int(seconds * rate))


def test_a_piece_with_tsx_slides_is_drawn_with_remotion(piece):
    script = scripts.load(piece.script)
    assert remotion.used(piece, script)
    assert piece.drawing("01-hook").suffix == ".tsx"


def test_html_slides_are_not(piece):
    script = scripts.load(piece.script)
    for name in ("01-hook", "02-count", "03-question"):
        (piece.path / "slides" / f"{name}.tsx").rename(piece.path / "slides" / f"{name}.html")
    assert not remotion.used(piece, script)


def test_a_film_is_drawn_one_way(piece):
    script = scripts.load(piece.script)
    (piece.path / "slides" / "02-count.tsx").rename(piece.path / "slides" / "02-count.html")
    with pytest.raises(ValueError, match="one way"):
        remotion.used(piece, script)
    assert any("one way" in p for p in remotion.problems(piece, script))


def test_a_scene_needs_its_component(piece):
    script = scripts.load(piece.script)
    (piece.path / "slides" / "01-hook.tsx").write_text("const x = 1;\n", encoding="utf-8")
    assert remotion.problems(piece, script) == ["slides/01-hook.tsx has no 'export default' (the scene's component)"]
    (piece.path / "slides" / "01-hook.tsx").write_text('export { default } from "../../other/slides/01-hook";\n', encoding="utf-8")
    assert remotion.problems(piece, script) == []


def test_a_scene_loads_nothing_from_the_network(piece):
    script = scripts.load(piece.script)
    (piece.path / "slides" / "01-hook.tsx").write_text(SCENE + 'import x from "https://cdn.example.com/x.js";\n', encoding="utf-8")
    assert any("network" in p for p in remotion.problems(piece, script))
    (piece.path / "slides" / "01-hook.tsx").write_text(SCENE + 'const a = <img src="//cdn.example.com/a.png" />;\n', encoding="utf-8")
    assert any("network" in p for p in remotion.problems(piece, script))


def test_reelcheck_reads_tsx_slides_and_skips_their_own_folder(piece, channel):
    """A .tsx is a drawing like an .html: no "no drawing" for its scene, and the reel's own helpers
    (slides/look/) belong to no scene without being flagged."""
    found = reels.problems(piece, channel)
    assert not any("no drawing" in p or "belongs to no scene" in p for p in found)


def test_what_remotion_is_told(piece, channel):
    script = scripts.load(piece.script)
    _voice(piece.path / "voice" / "01-hook.wav", 1.5)
    given, cuts = remotion.props(piece, script, channel, short=True)
    assert (given["width"], given["height"], given["fps"]) == (1080, 1920, channel.fps)
    assert given["crossfade"] == channel.crossfade
    one, two, three = given["scenes"]
    assert one["voice"] == "voice/01-hook.wav" and one["sound"] is None
    assert one["spoken"] == pytest.approx(1.5, abs=0.01)
    assert one["seconds"] == pytest.approx(1.5 + channel.gap_seconds, abs=0.01)
    assert [w["word"] for w in one["words"]] == ["Nvidia", "cae", "antes", "de", "abrir."]
    assert two["start"] == pytest.approx(one["seconds"], abs=0.001)
    assert two["voice"] is None and two["sound"] == "sound/02-count.wav"
    assert two["spoken"] == 5
    assert three["voice"] is None and three["sound"] is None
    assert given["total"] == pytest.approx(sum(c.seconds for c in cuts), abs=0.001)
    assert all(s["total"] == given["total"] for s in given["scenes"])
    assert json.loads(json.dumps(given)) == given


def test_the_public_folder_has_the_voices_and_the_ticks(piece, channel):
    script = scripts.load(piece.script)
    _voice(piece.path / "voice" / "01-hook.wav", 1.0)
    _, cuts = remotion.props(piece, script, channel, short=True)
    folder = remotion.public(piece, cuts)
    assert (folder / "voice" / "01-hook.wav").is_file()
    tick = folder / "sound" / "02-count.wav"
    assert tick.is_file() and render.length(tick) == pytest.approx(5.0 + channel.gap_seconds, abs=0.05)


def test_frames_leaves_tsx_slides_to_remotion(piece, channel, monkeypatch):
    """frames.draw photographs HTML pages; a .tsx is not opened in Chrome there."""
    script = scripts.load(piece.script)
    monkeypatch.setattr("playwright.sync_api.sync_playwright", lambda: (_ for _ in ()).throw(AssertionError("opened Chrome")))
    assert frames.draw(piece, script, channel, log=lambda line: None) == 0


def test_the_kit_and_the_example_are_in_the_repo():
    assert (REPO / "remotion" / "render.mjs").is_file()
    assert (REPO / "remotion" / "package-lock.json").is_file()
    example = REPO / "remotion" / "examples" / "2026-11-09-jensen-huang"
    script = scripts.load(example / "script.md")
    piece = reels.Reel(example)
    assert remotion.used(piece, script) and remotion.problems(piece, script) == []


def test_a_daily_reel_is_drawn_as_channel_toml_says(tmp_path, channel):
    """Until Remotion has passed a test run in the cloud, a daily reel in .tsx is refused, and
    once [reel] daily_drawing says remotion, one in .html is."""
    path = tmp_path / "reels" / "2026-11-09-open"
    (path / "slides").mkdir(parents=True)
    (path / "script.md").write_text(SCRIPT, encoding="utf-8")
    for name in ("01-hook", "02-count", "03-question"):
        (path / "slides" / f"{name}.tsx").write_text(SCENE, encoding="utf-8")
    reel = reels.Reel(path)
    assert channels.load(REPO / "channel.toml").reel_daily_drawing == "html"
    assert any("daily_drawing" in p for p in reels.problems(reel, channel))
    assert not any("daily_drawing" in p for p in reels.problems(reel, replace(channel, reel_daily_drawing="remotion")))
    for name in ("01-hook", "02-count", "03-question"):
        (path / "slides" / f"{name}.tsx").rename(path / "slides" / f"{name}.html")
    assert not any("daily_drawing" in p for p in reels.problems(reel, channel))
    assert any("daily_drawing" in p for p in reels.problems(reel, replace(channel, reel_daily_drawing="remotion")))


def test_a_reel_the_owner_asks_for_may_be_drawn_either_way(piece, channel):
    assert not any("daily_drawing" in p for p in reels.problems(piece, channel))
