"""The long video on YouTube that goes with a reel the owner asked for (kind: long; skill long-video)."""

import shutil
from dataclasses import replace

import pytest

from marketmedia import channel as channels
from marketmedia import check, frames, reels, render, youtube
from marketmedia import script as scripts
from marketmedia.videos import Video

from .conftest import REPO

REEL = """---
title: ¿Se pincha la IA?
description: Una reflexión sobre el ciclo de la inteligencia artificial en bolsa.
kind: reel
voice: reflexion
sources:
  - Yahoo Finance, cierres diarios de Nvidia | https://finance.yahoo.com/quote/NVDA/history/
  - FactSet, Earnings Insight | https://advantage.factset.com/insight
---

## 01-hook

Desde que salió ChatGPT, Nvidia ha multiplicado su precio por once.
"""

CHAPTERS = "\n".join(f"  - {n:02d}-part | Parte {n}" for n in range(1, 7))
LONG = f"""---
title: ¿Se pincha la IA? Tres años de ChatGPT en bolsa
description: La versión larga del reel: el ciclo entero, con sus cifras y la mejor objeción.
kind: long
reel: 2026-11-06-ai-crash
voice: reflexion
chapters:
{CHAPTERS}
sources:
  - Yahoo Finance, cierres diarios de Nvidia | https://finance.yahoo.com/quote/NVDA/history/
  - FactSet, Earnings Insight | https://advantage.factset.com/insight
---
""" + "\n".join(f"## {n:02d}-part\n\nUna frase que dice algo de la parte {n}.\n" for n in range(1, 7))


@pytest.fixture
def root(tmp_path):
    """A repo of its own: the templates, one reel the owner asked for and one daily reel."""
    shutil.copytree(REPO / "templates", tmp_path / "templates")
    for name, text in (("2026-11-06-ai-crash", REEL), ("2026-11-06-open", REEL.replace("voice: reflexion\n", ""))):
        (tmp_path / "reels" / name / "slides").mkdir(parents=True)
        (tmp_path / "reels" / name / "script.md").write_text(text, encoding="utf-8")
    return tmp_path


@pytest.fixture
def long(root):
    path = root / "videos" / "2026-11-06-ai-crash"
    (path / "slides").mkdir(parents=True)
    (path / "script.md").write_text(LONG, encoding="utf-8")
    for n in range(1, 7):
        (path / "slides" / f"{n:02d}-part.html").write_text("<!doctype html><h1>Una diapositiva</h1>", encoding="utf-8")
    (path / "thumbnail.html").write_text("<!doctype html><h1>Miniatura</h1>", encoding="utf-8")
    return Video(path)


def seen(**changes):
    """The channel as a long video in the reflective voice sees it."""
    return replace(channels.load(REPO / "channel.toml").for_long("reflexion"), **changes)


def test_a_long_video_sees_the_channel_as_its_reel_does_but_wide_and_long():
    channel = channels.load(REPO / "channel.toml")
    long = channel.for_long("reflexion")
    reel = channel.for_reels("reflexion")
    assert (long.language, long.voice_engine, long.voice_name, long.voice_model) == \
        (reel.language, reel.voice_engine, reel.voice_name, reel.voice_model) == ("es", "elevenlabs", reel.voice_name, "eleven_v4")
    assert long.minutes == (10, 12)
    assert (long.width, long.height) == (1920, 1080)
    assert long.intro is None and long.outro is None
    assert "No es una recomendación de inversión" in long.disclaimer
    assert channel.for_script("long", "didactico").voice_name == channel.for_reels("didactico").voice_name
    assert channel.for_script("", "") is channel   # every other video sees the channel as it is


def test_a_long_script_names_its_reel_has_chapters_and_no_short():
    script = scripts.parse(LONG)
    assert (script.kind, script.reel, script.voice) == ("long", "2026-11-06-ai-crash", "reflexion")
    assert script.cut(short=True) == []
    assert scripts.problems(script) == []
    bare = scripts.parse(LONG.replace("reel: 2026-11-06-ai-crash\n", "").replace(CHAPTERS, "  - 01-part | Una"))
    found = scripts.problems(bare)
    assert any("names its reel" in p for p in found)
    assert any("5 chapters at least" in p for p in found)
    shorted = scripts.parse(LONG.replace("kind: long\n", "kind: long\nshort: 01-part\n"))
    assert any("has no Short" in p for p in scripts.problems(shorted))
    assert any("'reel:' is for a long video" in p for p in scripts.problems(scripts.parse(LONG.replace("kind: long\n", ""))))


def test_a_long_video_runs_ten_to_twelve_minutes(long):
    script = scripts.load(long.script)
    assert check.problems(long, seen(minutes=(0, 12))) == []
    found = check.problems(long, seen())
    assert any("a long video runs 10:00 to 12:00" in p for p in found)
    # Its length is its scenes' at the pace of its reel's voice, with no intro and no outro.
    assert [c.scene.name for c in render.plan(long, script, seen())] == [f"{n:02d}-part" for n in range(1, 7)]


def test_a_long_video_goes_with_a_reel_the_owner_asked_for(long, root):
    channel = seen(minutes=(0, 12))
    text = long.script.read_text(encoding="utf-8")
    long.script.write_text(text.replace("reel: 2026-11-06-ai-crash", "reel: 2026-11-06-open"), encoding="utf-8")
    assert any("is a daily reel" in p for p in check.problems(long, channel))
    long.script.write_text(text.replace("reel: 2026-11-06-ai-crash", "reel: 2026-11-07-nothing"), encoding="utf-8")
    assert any("is not a folder in reels/" in p for p in check.problems(long, channel))
    long.script.write_text(text.replace("voice: reflexion", "voice: nobody"), encoding="utf-8")
    assert any("'voice: nobody'" in p for p in check.problems(long, channel))


def test_a_long_video_is_drawn_wide_only_with_its_thumbnail(long):
    script = scripts.load(long.script)
    drawn = frames.drawings(long, script, seen())
    assert {d[0] for d in drawn} == {f"{n:02d}-part" for n in range(1, 7)} | {"thumbnail"}
    assert all(d[3] == {"width": 1920, "height": 1080} for d in drawn if d[0] != "thumbnail")


def test_its_description_is_in_spanish(long):
    script = scripts.load(long.script)
    text = youtube.description(script, seen(), "0:00 Parte 1")
    assert "Capítulos:\n0:00 Parte 1" in text and "Fuentes:\n- Yahoo Finance" in text
    assert "Chapters:" not in text and "Sources:" not in text
    assert "No es una recomendación de inversión" in text
    assert youtube.body(script, seen())["snippet"]["defaultLanguage"] == "es"
    english = youtube.description(script, channels.load(REPO / "channel.toml"), "0:00 Part 1")
    assert "Chapters:" in english and "Sources:" in english


def test_longnew_starts_it_from_its_reel(root):
    video = reels.new_long(reels.find("2026-11-06-ai-crash", root), root)
    assert video.path == root / "videos" / "2026-11-06-ai-crash"
    script = scripts.load(video.script)
    assert (script.kind, script.reel, script.voice, script.title) == ("long", "2026-11-06-ai-crash", "reflexion", "¿Se pincha la IA?")
    assert script.sources == scripts.parse(REEL).sources
    slide = (video.path / "slides" / "01-hook.html").read_text(encoding="utf-8")
    assert 'class="light essay"' in slide and "theme/long.css" in slide and "A fondo" in slide
    assert "{{" not in slide and "{{" not in (video.path / "thumbnail.html").read_text(encoding="utf-8")
    assert (video.path / "brief.md").is_file()
    with pytest.raises(ValueError, match="there already"):
        reels.new_long(reels.find("2026-11-06-ai-crash", root), root)
    with pytest.raises(ValueError, match="daily reel"):
        reels.new_long(reels.find("2026-11-06-open", root), root)


def test_a_long_video_may_not_sound_machine_made():
    text = LONG.replace("Una frase que dice algo de la parte 1.",
                        "En un mundo donde todo cambia, esto es revolucionario. ¿El resultado? Subió un tercio. "
                        "No es solo un chip, es una apuesta — y la respuesta te sorprenderá.")
    found = [p for p in scripts.problems(scripts.parse(text)) if p.startswith("sounds machine-made")]
    assert len(found) == 6
    # Said plainly, it passes: a real question, a figure, a sentence that says something.
    plain = LONG.replace("Una frase que dice algo de la parte 1.",
                         "¿Se pincha la IA? Nvidia ha perdido una cuarta parte en un mes. La potencia de los centros de datos es la clave.")
    assert scripts.problems(scripts.parse(plain)) == []
    # A reel is not held to it: its lines keep their own voice.
    assert not [p for p in scripts.problems(scripts.parse(text.replace("kind: long", "kind: reel").replace("reel: 2026-11-06-ai-crash\n", "")))
                if p.startswith("sounds machine-made")]
