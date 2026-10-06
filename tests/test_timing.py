from marketmedia import timing


def test_with_no_voice_the_words_share_the_scene_and_a_stop_takes_time():
    said = timing.words("One two. Three four", 4.0)
    assert [w.word for w in said] == ["One", "two.", "Three", "four"]
    assert said[0].at == 0 and said[-1].end == 4.0
    assert all(a.end == b.at for a, b in zip(said, said[1:]))
    assert said[1].end - said[1].at > said[0].end - said[0].at   # the full stop is a pause


def test_with_a_voice_the_words_skip_its_silences():
    # A second of voice, a second of silence, a second of voice, at 10 frames a second.
    levels = [0.5] * 10 + [0.0] * 10 + [0.5] * 10
    said = timing.words("aaaa bbbb", 3.0, levels, fps=10)
    assert said[0].at == 0 and said[0].end == 2.0     # the first word ends where the voice comes back
    assert said[1].at == 2.0 and said[1].end == 3.0


def test_nothing_said_is_no_words():
    assert timing.words("", 3.0) == []


def test_captions_are_a_few_words_and_break_at_a_stop():
    said = timing.words("Nobody taught you this in school. How interest works.", 6.0)
    lines = timing.lines(said, 6.4)
    texts = [" ".join(w["word"] for w in line["words"]) for line in lines]
    assert all(len(line["words"]) <= timing.LINE_WORDS for line in lines)
    assert any(text.endswith("school.") for text in texts)       # no line runs past the full stop
    assert all(a["end"] == b["at"] for a, b in zip(lines, lines[1:]))
    assert lines[-1]["end"] <= 6.4


def test_a_written_stop_is_the_silence_of_the_voice():
    # "Debt." takes a whole second on its own, as a voice says a list: its letters would give it far less.
    voice, quiet = [0.5] * 10, [0.0] * 5
    levels = voice + quiet + voice + quiet + voice * 2
    said = timing.words("Debt. Inflation. Compound interest and more", 4.0, levels, fps=10)
    assert (said[0].at, said[0].end) == (0.0, 1.0)
    assert (said[1].at, said[1].end) == (1.5, 2.5)
    assert said[2].at == 3.0 and said[-1].end == 5.0


def test_a_stop_the_voice_runs_through_is_left_without_a_silence():
    # Two sentences said in one breath, then a pause, then a third.
    levels = [0.5] * 20 + [0.0] * 5 + [0.5] * 10
    said = timing.words("Aaaa aaaa. Bbbb bbbb. Cccc cccc.", 3.5, levels, fps=10)
    assert said[3].end == 2.0 and said[4].at == 2.5     # the pause is after the second sentence
    assert said[1].end == said[2].at == 1.0             # and the first two share the first stretch


def test_short_gaps_inside_a_word_are_not_stops():
    assert timing.silences([0.5] * 10 + [0.0] * 3 + [0.5] * 10, 30) == []
    assert timing.silences([0.0] * 9 + [0.5] * 10 + [0.0] * 6 + [0.5] * 5 + [0.0] * 9, 30) == [(19, 25)]
