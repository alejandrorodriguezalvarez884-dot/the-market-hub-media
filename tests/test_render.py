from marketmedia import channel as channels
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


def test_the_shorts_captions_are_a_few_words_at_a_time(video, channel):
    cuts = render.plan(video, scripts.load(video.script), channel, short=True)
    lines = [block.split("\n")[2] for block in render.captions(cuts, render.SHORT_CAPTION_CHARS).strip().split("\n\n")]
    assert all(len(line) <= render.SHORT_CAPTION_CHARS for line in lines)
    assert " ".join(lines) == "Profit did not grow. Earnings per share did. Here is how. Fewer shares, same profit. Each share gets more of it."


def test_a_still_scene_is_one_frame_held_and_a_moving_one_is_its_frames(video, channel):
    source, hold = render.picture(video, "01-hook", False, 30, 7.5)
    assert source[:1] == ["-loop"] and source[-1].endswith("01-hook.png") and hold == ""
    moving = video.moving("01-hook")
    moving.mkdir(parents=True)
    (moving / "0000.jpg").write_bytes(b"a frame")
    source, hold = render.picture(video, "01-hook", False, 30, 7.5)
    assert source == ["-framerate", "30", "-i", str(moving / "%04d.jpg")]
    assert hold == "tpad=stop_mode=clone:stop_duration=7.500"
    # The Short has frames of its own.
    assert render.picture(video, "01-hook", True, 30, 7.5)[1] == ""


def test_scenes_dissolve_into_each_other_without_moving_the_voice():
    graph = render.dissolve([5.0, 4.0, 3.0], 0.3)
    # every picture but the last is held a little longer, for the next to dissolve over it...
    assert "[0:v]tpad=stop_mode=clone:stop_duration=0.300[p0]" in graph
    assert "[1:v]tpad=stop_mode=clone:stop_duration=0.300[p1]" in graph
    assert "[2:v]tpad" not in graph
    # ...and each scene starts where it would have started after a cut
    assert "[p0][p1]xfade=transition=fade:duration=0.300:offset=5.000[x1]" in graph
    assert "[x1][2:v]xfade=transition=fade:duration=0.300:offset=9.000[v]" in graph
    # the sound is not crossed: one scene's voice after the other's
    assert graph.endswith("[0:a][1:a][2:a]concat=n=3:v=0:a=1[a]")


def test_a_reel_dissolves_from_scene_to_scene_and_a_video_still_cuts():
    channel = channels.load()
    assert channel.crossfade == 0
    assert channel.for_reels().crossfade > 0
    assert channel.for_reels("reflexion").crossfade == channel.for_reels().crossfade


def test_a_dissolve_keeps_the_films_length(tmp_path):
    import subprocess
    tool = render.ffmpeg()
    for n, (colour, seconds) in enumerate((("red", 1.0), ("blue", 1.5))):
        subprocess.run([tool, "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color={colour}:s=64x64:r=30:d={seconds}",
                        "-f", "lavfi", "-i", f"sine=f=440:d={seconds}", "-c:v", "libx264", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-ar", "48000", "-ac", "2", "-shortest", str(tmp_path / f"{n}.mp4")], check=True)
    out = tmp_path / "film.mp4"
    subprocess.run([tool, "-y", "-loglevel", "error", "-i", str(tmp_path / "0.mp4"), "-i", str(tmp_path / "1.mp4"),
                    "-filter_complex", render.dissolve([1.0, 1.5], 0.3), "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", str(out)], check=True)
    assert abs(render.length(out) - 2.5) < 0.1


def test_in_a_reel_each_voice_sinks_to_silence_at_its_very_end():
    assert render.voice_filter(7.5, dissolving=True) == f"afade=t=out:st={7.5 - render.VOICE_FADE:.3f}:d={render.VOICE_FADE:.3f},apad"
    assert render.voice_filter(7.5, dissolving=False) == "apad"   # a video's voice is left as it is
