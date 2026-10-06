from marketmedia import frames


def test_a_movement_takes_its_seconds_in_frames_and_no_scene_is_filmed_forever():
    assert frames.count(0, 30) == 0
    assert frames.count(1.5, 30) == 45
    assert frames.count(600, 30) == frames.MOVING_MAX * 30
