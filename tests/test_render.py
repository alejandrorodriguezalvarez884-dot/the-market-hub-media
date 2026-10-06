from marketmedia import render
from marketmedia import script as scripts


def test_a_scene_with_no_recording_lasts_what_its_words_take(video, channel):
    cuts = render.plan(video, scripts.load(video.script), channel)
    assert [c.scene.name for c in cuts] == ["01-hook", "02-title", "03-point"]
    assert cuts[0].spoken == 11 / channel.words_per_minute * 60          # 11 words at the channel's pace
    assert cuts[0].seconds == cuts[0].spoken + channel.gap_seconds
    assert cuts[1].spoken == 3                                           # its 'seconds:' line
    assert cuts[2].spoken == 10 / channel.words_per_minute * 60
    assert all(c.voice is None for c in cuts)


def test_a_few_words_still_get_time_to_be_read(channel):
    assert render.spoken(scripts.Scene("01-x", "Three words only."), channel.words_per_minute) == render.MIN_SECONDS


def test_a_recorded_scene_lasts_what_its_recording_lasts(video, channel):
    (video.path / "voice").mkdir()
    (video.path / "voice" / "01-hook.mp3").write_bytes(b"not really sound")
    cuts = render.plan(video, scripts.load(video.script), channel, measure=lambda path: 7.25)
    assert cuts[0].voice.name == "01-hook.mp3"
    assert cuts[0].spoken == 7.25 and cuts[0].seconds == 7.25 + channel.gap_seconds
    assert cuts[1].voice is None


def test_captions_follow_the_scenes(video, channel):
    cuts = render.plan(video, scripts.load(video.script), channel, measure=lambda path: 0.0)
    blocks = render.captions(cuts).strip().split("\n\n")
    assert len(blocks) == 5  # three sentences, nothing for the title card, two sentences
    first = blocks[0].split("\n")
    assert first[0] == "1" and first[1].startswith("00:00:00,000 --> ") and first[2] == "Profit did not grow."
    # The third scene starts after the first two, silences included.
    start = cuts[0].seconds + cuts[1].seconds
    assert blocks[3].split("\n")[1].startswith(render._stamp(start))
    # The last caption ends when the last narration does.
    assert blocks[-1].split("\n")[1].endswith(render._stamp(start + cuts[2].spoken))


def test_a_long_sentence_is_cut_into_several_captions():
    lines = render._lines("word " * 60 + "end.")
    assert len(lines) > 1 and all(len(line) <= render.CAPTION_CHARS for line in lines)


def test_a_stamp_is_hours_minutes_seconds_and_thousandths():
    assert render._stamp(3725.5) == "01:02:05,500"


def test_the_short_is_the_scenes_the_script_names(video, channel):
    script = scripts.load(video.script)
    cuts = render.plan(video, script, channel, short=True)
    assert [c.scene.name for c in cuts] == ["01-hook", "03-point"]
    assert video.frame("01-hook", short=True).parent.name == "short-frames"
    assert video.film(short=True).name == "short.mp4" and video.captions(short=True).name == "short.srt"
