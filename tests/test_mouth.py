import array
import math

from marketmedia import mouth


def _sound(seconds, loudness, rate=16000):
    """A tone of a given loudness, as 16-bit mono sound."""
    return array.array("h", (int(loudness * math.sin(n / 5)) for n in range(int(seconds * rate)))).tobytes()


def test_there_is_a_mouth_for_every_frame():
    assert len(mouth.levels(_sound(2, 8000), 16000, 30)) == 60
    assert mouth.levels(b"", 16000, 30) == []


def test_silence_is_a_closed_mouth():
    assert set(mouth.levels(_sound(1, 20), 16000, 30)) == {0.0}


def test_the_mouth_opens_with_the_voice_and_closes_in_the_pauses():
    levels = mouth.levels(_sound(1, 9000) + _sound(1, 0) + _sound(1, 4500), 16000, 30)
    assert levels[15] > 0.95            # speaking at full voice
    assert levels[45] == 0.0            # a pause
    assert 0.4 < levels[75] < 0.6       # speaking half as loud
    assert 0 < levels[30] < 1           # the mouth does not snap shut from one frame to the next


def test_a_hiss_is_sharp_and_a_vowel_is_not():
    hiss = array.array("h", (6000 if n % 2 else -6000 for n in range(16000))).tobytes()   # crosses zero at every sample
    assert set(mouth.sharpness(hiss, 16000, 30)) == {1.0}
    assert set(mouth.sharpness(_sound(1, 8000), 16000, 30)) == {0.0}                       # a low tone
