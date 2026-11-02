import shutil
from dataclasses import replace

import pytest

from marketmedia import channel as channels
from marketmedia import reels, render
from marketmedia import script as scripts

from .conftest import REPO

SCRIPT = """---
title: Wall Street rebota
description: La apertura de Wall Street del lunes.
kind: reel
sources:
  - Market Hub, el mercado de hoy | https://themarkethub.app/api/public/overview
  - La nota de la empresa | https://example.com/release
---

## 01-hook

Wall Street abre la semana en verde.

## 02-oil

El petróleo cae más de un seis por ciento.
"""

CAPTION = """WALL STREET REBOTA

La apertura del lunes.

Fuentes: Market Hub y la nota de la empresa.

Contenido informativo de The Market Hub. No es una recomendación de inversión.

#bolsa #wallstreet
"""


@pytest.fixture
def channel():
    """The channel as a reel sees it, taking a reel of any length: the reels of the tests are a few seconds."""
    return replace(channels.load(REPO / "channel.toml").for_reels(), reel_seconds=(0, 100))


@pytest.fixture
def reel(tmp_path):
    path = tmp_path / "reels" / "2026-11-02-open"
    (path / "slides").mkdir(parents=True)
    (path / "script.md").write_text(SCRIPT, encoding="utf-8")
    (path / "caption.txt").write_text(CAPTION, encoding="utf-8")
    (path / "x.txt").write_text("Wall Street rebota tras su peor día desde junio.\n---\nEl petróleo cae más de un 6 %.\n", encoding="utf-8")
    for name in ("01-hook", "02-oil"):
        (path / "slides" / f"{name}.html").write_text(
            '<!doctype html><link rel="stylesheet" href="../../../theme/reel.css"><h1>Una diapositiva</h1>', encoding="utf-8")
    return reels.Reel(path)


def test_a_reel_sees_the_channel_in_spanish():
    channel = channels.load(REPO / "channel.toml").for_reels()
    assert channel.language == "es"
    assert channel.voice_language == "es-ES" and channel.voice_name
    assert channel.voice_engine == "elevenlabs" and dict(channel.voice_settings)["stability"] == 0.4
    assert channel.short_seconds == channel.reel_seconds
    assert channel.intro is None and channel.outro is None
    assert "No es una recomendación de inversión" in channel.disclaimer


def test_a_whole_reel_has_no_problems(reel, channel):
    assert reels.problems(reel, channel) == []
    assert (reel.date, reel.moment, reel.stage()) == ("2026-11-02", "open", "script")
    assert reel.film().name == "reel.mp4"
    assert reel.published.name == "instagram.json"


def test_a_reel_is_every_scene_upright_and_needs_no_short_line(reel, channel):
    script = scripts.load(reel.script)
    assert [s.name for s in script.cut(short=True)] == ["01-hook", "02-oil"]
    assert scripts.problems(script) == []
    assert [c.scene.name for c in render.plan(reel, script, channel, short=True)] == ["01-hook", "02-oil"]


def test_a_reel_says_it_is_one(reel, channel):
    reel.script.write_text(SCRIPT.replace("kind: reel\n", ""), encoding="utf-8")
    assert "a reel's script says 'kind: reel'" in reels.problems(reel, channel)


def test_a_reel_runs_what_the_channel_says(reel, channel):
    found = reels.problems(reel, replace(channel, reel_seconds=(40, 100)))
    assert len(found) == 1 and found[0].startswith("the reel runs ") and found[0].endswith("a reel runs 40 to 100 s")


def test_a_reel_scene_needs_its_drawing_and_nothing_from_the_network(reel, channel):
    (reel.path / "slides" / "02-oil.html").unlink()
    (reel.path / "slides" / "01-hook.html").write_text('<img src="https://example.com/logo.png">', encoding="utf-8")
    assert reels.problems(reel, channel) == ["slides/01-hook.html loads something from the network",
                                            "scene 02-oil: no drawing in slides/"]


@pytest.mark.parametrize("change, problem", [
    (lambda c: c.replace("Contenido informativo de The Market Hub. No es una recomendación de inversión.", ""), "the caption lacks the notice"),
    (lambda c: c.replace("Fuentes:", "De:"), "the caption names no sources"),
    (lambda c: c + " ".join(f"#tag{n}" for n in range(9)), "hashtags; 8 at most"),
    (lambda c: c + "\nDeberías comprar Apple.", "the caption reads as advice"),
    (lambda c: c + "x" * 2200, "Instagram takes 2200"),
    (lambda c: "", "caption.txt is empty"),
])
def test_what_stops_a_caption(reel, channel, change, problem):
    reel.caption.write_text(change(CAPTION), encoding="utf-8")
    assert any(problem in found for found in reels.problems(reel, channel))


def test_a_new_reel_is_the_template_for_a_day_and_a_moment(tmp_path):
    shutil.copytree(REPO / "templates", tmp_path / "templates")
    reel = reels.new("close", root=tmp_path, day="2026-11-02")
    assert reel.name == "2026-11-02-close"
    assert "kind: reel" in reel.script.read_text(encoding="utf-8")
    assert reels.find("close", root=tmp_path) == reel
    with pytest.raises(ValueError, match="there already"):
        reels.new("close", root=tmp_path, day="2026-11-02")
    with pytest.raises(ValueError, match="not open, close or a few plain words"):
        reels.new("¡No!", root=tmp_path, day="2026-11-02")
    assert reels.new("week", root=tmp_path, day="2026-11-07").daily
    asked = reels.new("not-a-bubble", root=tmp_path, day="2026-11-02")
    assert (asked.moment, asked.daily, reel.daily) == ("not-a-bubble", False, True)


def test_a_reel_is_drawn_upright_only_and_has_no_thumbnail(reel, channel):
    from marketmedia import frames
    drawn = frames.drawings(reel, scripts.load(reel.script), channel)
    assert [(name, viewport) for name, _, _, viewport, _ in drawn] == [
        ("01-hook", {"width": 1080, "height": 1920}), ("02-oil", {"width": 1080, "height": 1920})]
    assert all("short-frames" in str(still) for _, still, _, _, _ in drawn)


def test_a_reel_may_name_another_voice(reel):
    base = channels.load(REPO / "channel.toml")
    reel.script.write_text(SCRIPT.replace("kind: reel\n", "kind: reel\nvoice: reflexion\n"), encoding="utf-8")
    assert scripts.load(reel.script).voice == "reflexion"
    seen = reels.voiced(reel, base)
    assert seen.voice_name != base.for_reels().voice_name and seen.voice_engine == "elevenlabs"
    assert seen.voice_model == "eleven_v3" and seen.voice_cue.startswith("[")
    assert seen.language == "es" and seen.reel_seconds == base.reel_seconds


def test_the_didactic_reels_speak_with_rafa():
    base = channels.load(REPO / "channel.toml")
    rafa = base.for_reels("didactico")
    assert rafa.voice_name == "iJQjCIhyynnZMKT6NN3H" and rafa.voice_engine == "elevenlabs"
    assert rafa.voice_name not in {base.for_reels().voice_name, base.for_reels("reflexion").voice_name}
    assert dict(rafa.voice_settings)["stability"] == 0.4 and rafa.language == "es"


def test_a_voice_that_is_not_in_the_channel_is_refused(reel, channel):
    reel.script.write_text(SCRIPT.replace("kind: reel\n", "kind: reel\nvoice: nadie\n"), encoding="utf-8")
    assert "'voice: nadie' is not one of [reel.voices] in channel.toml" in reels.problems(reel, channel)
    with pytest.raises(ValueError, match="nadie"):
        channel.for_reels("nadie")


def test_a_reel_goes_to_x_with_a_short_thread_and_no_link(reel, channel):
    assert reel.thread() == ["Wall Street rebota tras su peor día desde junio.", "El petróleo cae más de un 6 %."]
    reel.thread_file.write_text("Míralo en themarkethub.app\n---\nDeberías comprar ya.\n", encoding="utf-8")
    found = reels.problems(reel, channel)
    assert any("post 1" in f and "carries no link" in f for f in found)
    assert any("post 2" in f and "advice" in f for f in found)
    reel.thread_file.write_text("\n---\n".join(["Uno."] * 5), encoding="utf-8")
    assert "x.txt has 5 posts" in reels.problems(reel, channel)[0]
    reel.thread_file.unlink()
    assert any(f.startswith("no x.txt") for f in reels.problems(reel, channel))
