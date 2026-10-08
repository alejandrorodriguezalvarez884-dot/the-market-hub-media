"""The intro and the outro every video of the channel shares."""
from dataclasses import replace

from marketmedia import channel as channels
from marketmedia import render, voice, youtube
from marketmedia import script as scripts

INTRO = channels.Shared("intro", "00-intro", "This is the channel.", after=0, seconds=0)
OUTRO = channels.Shared("outro", "99-outro", "Thanks for watching.", after=0, seconds=12)


def test_a_video_opens_with_the_intro_and_closes_with_the_outro(video, channel):
    script = scripts.load(video.script)
    with_both = replace(channel, intro=INTRO, outro=OUTRO)
    assert [s.name for s in render.scenes(script, with_both)] == ["00-intro", "01-hook", "02-title", "03-point", "99-outro"]
    # The Short has neither, and neither has a trailer.
    assert [s.name for s in render.scenes(script, with_both, short=True)] == ["01-hook", "03-point"]
    assert [s.name for s in render.scenes(replace(script, kind="trailer"), with_both)] == ["01-hook", "02-title", "03-point"]


def test_the_intro_can_come_after_the_hook(video, channel):
    late = replace(channel, intro=replace(INTRO, after=1))
    assert [s.name for s in render.scenes(scripts.load(video.script), late)][:2] == ["01-hook", "00-intro"]


def test_the_outro_is_held_for_the_end_screen(video, channel):
    cuts = render.plan(video, scripts.load(video.script), replace(channel, outro=OUTRO))
    assert cuts[-1].scene.name == "99-outro" and cuts[-1].seconds == 12
    assert cuts[-1].spoken < 12


def test_the_shared_scenes_are_the_channels_files(video):
    assert video.drawing("00-intro").parts[-2:] == ("channel", "intro.html")
    assert video.voices("99-outro")[0].parts[-2:] == ("channel", "voice") and video.voices("99-outro")[1] == "outro"
    assert video.voices("01-hook") == (video.path / "voice", "01-hook")


def test_the_shared_scenes_are_spoken_with_the_rest(video, channel, monkeypatch, tmp_path):
    monkeypatch.setattr(type(video), "voices", lambda self, scene: (tmp_path / "shared", "intro") if scene == "00-intro" else (self.path / "voice", scene))
    monkeypatch.setattr(type(video), "voice", lambda self, scene: next(iter(self.voices(scene)[0].glob(self.voices(scene)[1] + ".wav")), None))
    script = scripts.load(video.script)
    with_intro = replace(channel, intro=INTRO)
    assert [s.name for s in voice.pending(video, script, with_intro)] == ["00-intro", "01-hook", "03-point"]
    voice.make(video, script, with_intro, speak=lambda text, channel: b"sound", log=lambda line: None)
    assert (tmp_path / "shared" / "intro.wav").read_bytes() == b"sound"
    assert voice.pending(video, script, with_intro) == []


def test_a_script_cannot_take_the_shared_names():
    text = "---\ntitle: T\ndescription: D\nshort: 00-intro\nsources:\n  - a | https://a.example/\n  - b | https://b.example/\n---\n\n## 00-intro\n\nHello.\n"
    assert any("00-intro" in problem for problem in scripts.problems(scripts.parse(text)))


def test_chapters_carry_the_time_each_starts_at(video, channel):
    text = video.script.read_text(encoding="utf-8").replace(
        "sources:", "chapters:\n  - 01-hook | The question\n  - 02-title | The title\n  - 03-point | The point\nsources:")
    script = scripts.parse(text)
    assert script.chapters == (("01-hook", "The question"), ("02-title", "The title"), ("03-point", "The point"))
    cuts = render.plan(video, script, replace(channel, intro=INTRO), measure=lambda path: 0.0)
    lines = youtube.chapters(script, cuts).split("\n")
    # The intro is a few seconds: too short for a chapter of its own, it opens the first one.
    assert lines[0] == "0:00 The question" and len(lines) == 3
    assert "Chapters:\n0:00 The question" in youtube.description(script, channel, youtube.chapters(script, cuts))
    # A long opening before the first chapter is a chapter of its own.
    slow = render.plan(video, script, replace(channel, intro=INTRO), measure=lambda path: 0.0)
    slow[0] = replace(slow[0], seconds=30.0)
    assert youtube.chapters(script, slow).split("\n")[0] == "0:00 Intro"
    # Fewer than three chapters is none: YouTube takes no less.
    assert youtube.chapters(replace(script, chapters=script.chapters[:2]), cuts) == ""
    assert scripts.problems(replace(script, chapters=(("no-such-scene", "X"),)))
