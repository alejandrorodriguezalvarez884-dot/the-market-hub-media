import json
from dataclasses import replace

import pytest

from marketmedia import script as scripts
from marketmedia import voice


@pytest.fixture
def spoken():
    """A stand-in for the service that remembers what it was asked to say."""
    calls = []

    def speak(text, channel):
        calls.append(text)
        return b"RIFF" + text.encode()

    speak.calls = calls
    return speak


def test_what_is_asked_of_the_service(channel):
    body = voice.request("Hello.", channel)
    assert body["input"] == {"text": "Hello."}
    assert body["voice"] == {"languageCode": "en-US", "name": channel.voice_name}
    assert body["audioConfig"] == {"audioEncoding": "LINEAR16"}


def test_only_the_scenes_with_words_are_spoken(video, channel, spoken):
    script = scripts.load(video.script)
    sent = voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    assert spoken.calls == [script.scenes[0].narration, script.scenes[2].narration]
    assert sent == sum(len(text) for text in spoken.calls)
    assert video.voice("01-hook").name == "01-hook.wav" and video.voice("02-title") is None
    assert set(json.loads((video.path / "voice" / "made.json").read_text())) == {"01-hook", "03-point"}


def test_nothing_is_spoken_twice(video, channel, spoken):
    script = scripts.load(video.script)
    voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    assert voice.pending(video, script, channel) == []
    assert voice.make(video, script, channel, speak=spoken, log=lambda _: None) == 0
    assert len(spoken.calls) == 2


def test_a_scene_whose_words_changed_is_spoken_again(video, channel, spoken):
    voice.make(video, scripts.load(video.script), channel, speak=spoken, log=lambda _: None)
    video.script.write_text(video.script.read_text(encoding="utf-8").replace("Here is how.", "This is how."), encoding="utf-8")
    script = scripts.load(video.script)
    assert [s.name for s in voice.pending(video, script, channel)] == ["01-hook"]
    voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    assert spoken.calls[-1].endswith("This is how.")


def test_another_voice_speaks_every_scene_again(video, channel, spoken):
    script = scripts.load(video.script)
    voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    other = replace(channel, voice_name="en-US-Chirp3-HD-Kore")
    assert [s.name for s in voice.pending(video, script, other)] == ["01-hook", "03-point"]


def test_a_recording_of_the_owner_is_left_alone(video, channel, spoken):
    (video.path / "voice").mkdir()
    (video.path / "voice" / "01-hook.mp3").write_bytes(b"my own voice")
    script = scripts.load(video.script)
    voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    assert spoken.calls == [script.scenes[2].narration]
    assert (video.path / "voice" / "01-hook.mp3").read_bytes() == b"my own voice"


def test_a_pace_other_than_the_voices_own_is_asked_for_and_speaks_everything_again(video, channel, spoken):
    assert "speakingRate" not in voice.request("Hello.", channel)["audioConfig"]
    slower = replace(channel, voice_rate=0.9)
    assert voice.request("Hello.", slower)["audioConfig"]["speakingRate"] == 0.9
    script = scripts.load(video.script)
    voice.make(video, script, channel, speak=spoken, log=lambda _: None)
    assert [s.name for s in voice.pending(video, script, slower)] == ["01-hook", "03-point"]
