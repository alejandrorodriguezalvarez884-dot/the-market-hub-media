from marketmedia import frames, render
from marketmedia import script as scripts


def test_a_scene_takes_its_seconds_in_frames_and_no_scene_is_filmed_forever():
    assert frames.count(0, 30) == 0
    assert frames.count(1.5, 30) == 45
    assert frames.count(600, 30) == frames.MOVING_MAX * 30


def test_a_page_is_told_its_scene(video, channel):
    script = scripts.load(video.script)
    cuts = render.plan(video, script, channel, short=True)
    scene = frames.told(script, channel, cuts[1], cuts[0].seconds, sum(c.seconds for c in cuts), False, True, True, None)
    assert scene["seconds"] == cuts[1].seconds and scene["start"] == cuts[0].seconds
    assert scene["last"] and not scene["first"] and scene["short"]
    assert [w["word"] for w in scene["words"]][:3] == ["Fewer", "shares,", "same"]
    assert scene["words"][0]["at"] == 0 and scene["words"][-1]["end"] <= cuts[1].spoken + 0.001
    # The Short carries its captions; the video does not.
    assert " ".join(w["word"] for line in scene["captions"] for w in line["words"]) == cuts[1].scene.narration
    assert frames.told(script, channel, cuts[1], 0, 10, True, True, False, None)["captions"] == []
    assert scene["voice"] is None and scene["series"] is None
