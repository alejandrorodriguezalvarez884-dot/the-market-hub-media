"""The narration: each scene's words spoken by Google Cloud Text-to-Speech (the channel's videos)
or by ElevenLabs (the daily reels, [reel] engine in channel.toml), one sound file each.

    videos/<video>/voice/01-hook.wav
    videos/<video>/voice/made.json     what each file was made from, so that nothing is made twice
    channel/voice/intro.wav            the intro and the outro, the same in every video: said once

ElevenLabs takes the owner's key, from ELEVENLABS_API_KEY or .secrets/elevenlabs-key.txt (never in
git), and is paid by the character. Google uses the owner's own Google Cloud session (``gcloud auth application-default login``) and
project. The service is paid by the character once a monthly free allowance is spent, so a scene
is spoken again only when its words or the voice change. A sound file that this did not make (a
recording the owner dropped in voice/) is left alone.

A reel's voice may say each sentence on its own and join them with a set pause (``sentence_gap``
in its [reel.voices.*]: the chart reels), and a scene may set its own speed ("speed:" in the
script): both go into what a file was made from, so changing them speaks the scene again.
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import os
import re
import urllib.error
import urllib.request
import wave
from collections.abc import Callable
from dataclasses import replace

from .channel import ROOT, Channel
from . import render
from .script import Scene, Script
from .videos import Video

URL = "https://texttospeech.googleapis.com/v1/text:synthesize"
ELEVEN = "https://api.elevenlabs.io/v1/text-to-speech"
ELEVEN_RATE = 24000   # pcm_24000: plain 16-bit samples, made into a WAV file here
Speak = Callable[[str, Channel], bytes]


def request(text: str, channel: Channel) -> dict:
    """What is asked of the service for one scene."""
    sound: dict = {"audioEncoding": "LINEAR16"}  # a WAV file
    if channel.voice_rate != 1.0:
        sound["speakingRate"] = channel.voice_rate
    return {
        "input": {"text": text},
        "voice": {"languageCode": channel.voice_language, "name": channel.voice_name},
        "audioConfig": sound,
    }


def cloud(text: str, channel: Channel) -> bytes:
    """Speak ``text`` with Google Cloud Text-to-Speech and return the WAV file."""
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    # The project that is billed: said by the Makefile, or the one of the session.
    wanted = os.environ.get("GOOGLE_CLOUD_PROJECT") or None
    credentials, project = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"],
                                               quota_project_id=wanted)
    project = wanted or project
    if not project:
        raise RuntimeError("no Google Cloud project: set GOOGLE_CLOUD_PROJECT or 'gcloud config set project'")
    response = AuthorizedSession(credentials).post(URL, json=request(text, channel),
                                                   headers={"x-goog-user-project": project}, timeout=120)
    if response.status_code != 200:
        try:
            reason = response.json()["error"]["message"]
        except (ValueError, KeyError):
            reason = ""
        raise RuntimeError(f"Text-to-Speech answered {response.status_code}: {reason[:300]}")
    return base64.b64decode(response.json()["audioContent"])


def eleven_request(text: str, channel: Channel, before: str = "", after: str = "", speed: float | None = None) -> dict:
    """What is asked of ElevenLabs for one scene (or one sentence of it). The words around it let
    the voice carry its tone from one to the next, as one person speaking. ``speed`` is the
    scene's own, over the voice's."""
    model = channel.voice_model or "eleven_multilingual_v2"
    if channel.voice_cue and model == "eleven_v3":   # v3 reads a bracketed cue as how to speak
        text = f"{channel.voice_cue} {text}"
    body: dict = {"text": text, "model_id": model, "language_code": channel.voice_language.split("-")[0]}
    if channel.voice_settings or speed:
        body["voice_settings"] = dict(channel.voice_settings)
    if speed:
        body["voice_settings"]["speed"] = speed
    if before and body["model_id"] != "eleven_v3":   # v3 does not take the words around it
        body["previous_text"] = before
    if after and body["model_id"] != "eleven_v3":
        body["next_text"] = after
    return body


def _eleven_key() -> str:
    """The ElevenLabs key, or "" in a cloud session where the environment's proxy adds it to each
    request to api.elevenlabs.io (ELEVENLABS_KEY_BY_PROXY=1, a network secret: docs/reels.md)."""
    if os.environ.get("ELEVENLABS_KEY_BY_PROXY", "").strip() in ("1", "true", "yes"):
        return ""
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()   # a cloud session's environment, or...
    file = ROOT / ".secrets" / "elevenlabs-key.txt"
    if not key and file.is_file():
        key = file.read_text(encoding="utf-8").strip()
    if not key:
        raise FileNotFoundError("no ElevenLabs key: set ELEVENLABS_API_KEY or put it in .secrets/elevenlabs-key.txt")
    return key


def wav(pcm: bytes, rate: int = ELEVEN_RATE) -> bytes:
    """Plain 16-bit mono samples as a WAV file."""
    out = io.BytesIO()
    with wave.open(out, "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(rate)
        file.writeframes(pcm)
    return out.getvalue()


def shorten_pauses(sound: bytes, longest: float, quiet: float = 0.0126, window: float = 0.01) -> bytes:
    """A WAV file whose silences inside the speech last ``longest`` seconds at most: a pause longer
    than that is cut down, its middle taken out, so the voice keeps moving. ``quiet`` is how loud
    (of full scale) a stretch may be and still count as silence; the start and the end are kept."""
    import array
    with wave.open(io.BytesIO(sound), "rb") as file:
        rate, width, channels = file.getframerate(), file.getsampwidth(), file.getnchannels()
        frames = file.readframes(file.getnframes())
    if width != 2 or channels != 1 or longest <= 0:
        return sound
    samples = array.array("h", frames)
    step = max(1, int(rate * window))
    limit = quiet * 32768
    loud = [max((abs(v) for v in samples[i:i + step]), default=0) > limit for i in range(0, len(samples), step)]
    keep = max(1, int(longest / window))
    out, n = array.array("h"), 0
    first = next((i for i, l in enumerate(loud) if l), len(loud))
    last = len(loud) - next((i for i, l in enumerate(reversed(loud)) if l), len(loud))
    while n < len(loud):
        if first <= n < last and not loud[n]:
            end = n
            while end < last and not loud[end]:
                end += 1
            if end - n > keep:   # keep the pause's two ends, take out its middle
                half = keep // 2
                out.extend(samples[n * step:(n + half) * step])
                out.extend(samples[(end - (keep - half)) * step:end * step])
            else:
                out.extend(samples[n * step:end * step])
            n = end
        else:
            out.extend(samples[n * step:(n + 1) * step])
            n += 1
    return wav(out.tobytes(), rate)


def sentences(text: str) -> list[str]:
    """A narration cut into its sentences, at a full stop, a question or an exclamation mark. An
    ellipsis is a hold inside the sentence, not its end ("Cae... rebota... y vuelve a caer.")."""
    parts = re.split(r"(?<=[^.][.!?])\s+|(?<=[!?][»”\"])\s+", " ".join(text.split()))
    return [p for p in parts if p]


def _samples(sound: bytes) -> tuple[int, "array.array"]:
    import array
    with wave.open(io.BytesIO(sound), "rb") as file:
        return file.getframerate(), array.array("h", file.readframes(file.getnframes()))


FADE_IN, FADE_OUT = 0.03, 0.08   # seconds: how a sentence said on its own comes in and goes out


def trimmed(sound: bytes, quiet: float = 0.004, keep: float = 0.12) -> bytes:
    """A WAV file without the silence before its first sound and after its last, but ``keep``
    seconds of each. ``quiet`` is low, and ``keep`` long, so the end of a word dies away as the
    voice said it instead of being cut while it still sounds (the owner heard those cuts,
    2026-11-03)."""
    rate, samples = _samples(sound)
    limit = quiet * 32768
    loud = [n for n, v in enumerate(samples) if abs(v) > limit]
    if not loud:
        return sound
    margin = int(rate * keep)
    return wav(samples[max(0, loud[0] - margin):loud[-1] + margin + 1].tobytes(), rate)


def faded(sound: bytes, fade_in: float = FADE_IN, fade_out: float = FADE_OUT) -> bytes:
    """A WAV file that rises from silence at its start and sinks to it at its end (a raised
    cosine), so that silence put next to it does not click."""
    import math
    rate, samples = _samples(sound)
    for seconds, at_start in ((fade_in, True), (fade_out, False)):
        n = min(len(samples) // 2, int(rate * seconds))
        for k in range(n):
            gain = 0.5 - 0.5 * math.cos(math.pi * k / n)
            i = k if at_start else len(samples) - 1 - k
            samples[i] = int(samples[i] * gain)
    return wav(samples.tobytes(), rate)


def joined(sounds: list[bytes], gap: float) -> bytes:
    """WAV files one after another, with ``gap`` seconds of silence between each two."""
    import array
    rate, out = _samples(sounds[0])
    for sound in sounds[1:]:
        out.extend(array.array("h", bytes(2 * int(rate * gap))))
        out.extend(_samples(sound)[1])
    return wav(out.tobytes(), rate)


def eleven_sentences(text: str, channel: Channel, before: str = "", after: str = "",
                     speed: float | None = None, say: Callable[..., bytes] | None = None) -> bytes:
    """Speak a scene a sentence at a time, each with the sentences around it as its context, and
    join them with ``channel.voice_sentence_gap`` seconds of silence: the voice keeps its pace
    inside a sentence and takes a breath between two (the owner, 2026-11-03, on the chart reels).
    Each sentence keeps a little of its own silence and fades in and out, so the joins are not heard."""
    say = say or eleven
    parts = sentences(text)
    sounds = []
    for n, sentence in enumerate(parts):
        said_before = " ".join(filter(None, [before, *parts[:n]]))
        said_after = " ".join(filter(None, [*parts[n + 1:], after]))
        sounds.append(faded(trimmed(say(sentence, channel, said_before, said_after, speed))))
    return joined(sounds, channel.voice_sentence_gap)


def paused(sound: bytes, text: str, at_least: float, fps: int = 100) -> bytes:
    """A scene said in one go, with each pause at the end of a sentence made at least ``at_least``
    seconds long; commas and ellipses stay as the voice said them. When each sentence ends is
    worked out as for the slides (timing.words: the written stops matched to the voice's silences
    when it makes them, the words spread by their length when it does not), and the time is added
    at the quietest moment near there: a fast voice may leave a tenth of a second, or a breath,
    between two sentences. The sound sinks to silence over 10 ms before the pause and rises from
    it after, so nothing clicks. The owner asked for more pause between sentences, and sentences
    said one by one sounded odd (2026-11-03)."""
    import array
    import math

    from . import mouth, timing
    rate, samples = _samples(sound)
    block = max(1, rate // 200)                                  # 5 ms
    loud = [math.sqrt(sum(v * v for v in samples[i:i + block]) / block) for i in range(0, len(samples) - block + 1, block)]
    quiet_level = 0.006 * 32768
    said = timing.words(text, len(samples) / rate, mouth.levels(samples.tobytes(), rate, fps), fps)
    ends = [w.end for n, w in enumerate(said)
            if n < len(said) - 1 and w.word.rstrip("»”\"')")[-1:] in ".!?" and not w.word.rstrip("»”\"')").endswith("..")]
    width = 6                                                    # 30 ms: the stretch that must be quiet
    cuts = []
    for end in ends:
        first, last = max(0, int((end - 0.25) * 200)), min(len(loud) - width, int((end + 0.35) * 200))
        if last <= first:
            continue
        best = min(range(first, last), key=lambda b: sum(loud[b:b + width]))
        centre = best + width // 2
        left = right = centre
        while left > 0 and loud[left - 1] < quiet_level:
            left -= 1
        while right < len(loud) - 1 and loud[right + 1] < quiet_level:
            right += 1
        have = (right - left + 1) * block / rate if loud[centre] < quiet_level else 0.0
        if have < at_least:
            at = centre * block
            at = min(range(max(1, at - block // 2), min(len(samples) - 1, at + block // 2)), key=lambda i: abs(samples[i]))
            cuts.append((at, at_least - have))
    fade = rate // 100                                           # 10 ms
    out, done = array.array("h"), 0
    for at, seconds in sorted(cuts):
        if at <= done:
            continue
        piece = samples[done:at]
        for k in range(min(fade, len(piece))):                   # sink to silence...
            piece[len(piece) - 1 - k] = int(piece[len(piece) - 1 - k] * (0.5 - 0.5 * math.cos(math.pi * k / fade)))
        out.extend(piece)
        out.extend(array.array("h", bytes(2 * int(rate * seconds))))
        for k in range(min(fade, len(samples) - at)):            # ...and rise from it
            samples[at + k] = int(samples[at + k] * (0.5 - 0.5 * math.cos(math.pi * k / fade)))
        done = at
    out.extend(samples[done:])
    return wav(out.tobytes(), rate)


def eleven(text: str, channel: Channel, before: str = "", after: str = "", speed: float | None = None) -> bytes:
    """Speak ``text`` with ElevenLabs and return a WAV file."""
    request = urllib.request.Request(
        f"{ELEVEN}/{channel.voice_name}?output_format=pcm_{ELEVEN_RATE}",
        data=json.dumps(eleven_request(text, channel, before, after, speed)).encode(), method="POST",
        headers={"Content-Type": "application/json", **({"xi-api-key": key} if (key := _eleven_key()) else {})})
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            sound = wav(response.read())
            return shorten_pauses(sound, channel.voice_pause) if channel.voice_pause else sound
    except urllib.error.HTTPError as exc:
        try:
            reason = json.load(exc)["detail"]
            reason = reason.get("message", reason) if isinstance(reason, dict) else reason
        except (ValueError, KeyError, TypeError):
            reason = ""
        raise RuntimeError(f"ElevenLabs answered {exc.code}: {str(reason)[:300]}") from None


def _mark(scene: Scene, channel: Channel) -> str:
    """What a scene's sound depends on: its words, who says them and how."""
    how = (f"{channel.voice_engine}|{channel.voice_model}|{channel.voice_settings}|{channel.voice_cue}|"
           + (f"{channel.voice_pause}|" if channel.voice_pause else "")
           + (f"gap {channel.voice_sentence_gap}|" if channel.voice_sentence_gap else "")
           + (f"stop {channel.voice_sentence_pause}|" if channel.voice_sentence_pause else "")
           + (f"speed {scene.speed}|" if scene.speed else "")
           if channel.voice_engine != "google" else "")
    made_from = f"{how}{channel.voice_name}|{channel.voice_language}|{channel.voice_rate}|{scene.narration}"
    return hashlib.sha256(made_from.encode()).hexdigest()[:16]


def pending(video: Video, script: Script, channel: Channel) -> list[Scene]:
    """The scenes whose narration is missing or was made from other words or another voice."""
    out = []
    for scene in render.scenes(script, channel):
        if not scene.narration:
            continue
        folder, stem = video.voices(scene.name)
        made = _made(folder)
        file = video.voice(scene.name)
        if file and stem not in made:
            continue  # the owner's own recording
        if not file or made[stem] != _mark(scene, channel):
            out.append(scene)
    return out


def to_pay(video: Video, script: Script, channel: Channel) -> int:
    """How many characters speaking the pending scenes would send to the service: none for a scene
    whose voice as it came is kept (voice/raw/) and only its pauses change."""
    total = 0
    for scene in pending(video, script, channel):
        folder, stem = video.voices(scene.name)
        kept = (channel.voice_sentence_pause and (folder / "raw" / f"{stem}.wav").is_file()
                and _made(folder).get(f"raw/{stem}") == _mark(scene, replace(channel, voice_sentence_pause=0.0)))
        total += 0 if kept else len(scene.narration)
    return total


def _made(folder) -> dict:
    record = folder / "made.json"
    return json.loads(record.read_text(encoding="utf-8")) if record.is_file() else {}


def make(video: Video, script: Script, channel: Channel, speak: Speak | None = None,
         log: Callable[[str], None] = print) -> int:
    """Speak the scenes that need it. Returns how many characters were sent to the service."""
    if not channel.voice_name:
        raise ValueError("channel.toml names no voice ([voice] name)")
    said = [s.narration for s in render.scenes(script, channel)]
    sent = 0
    for scene in pending(video, script, channel):
        folder, stem = video.voices(scene.name)
        folder.mkdir(parents=True, exist_ok=True)
        made = _made(folder)
        # With sentence_pause, the voice as it came is kept in voice/raw/: a new length of pause is
        # made from it again, and nothing is paid twice.
        raw, raw_mark = folder / "raw" / f"{stem}.wav", _mark(scene, replace(channel, voice_sentence_pause=0.0))
        paid = len(scene.narration)
        if speak:
            sound = speak(scene.narration, channel)
        elif channel.voice_engine == "elevenlabs":
            n = said.index(scene.narration)
            around = (" ".join(said[max(0, n - 2):n]), said[n + 1] if n + 1 < len(said) else "")
            if channel.voice_sentence_gap:
                sound = eleven_sentences(scene.narration, channel, *around, speed=scene.speed)
            elif channel.voice_sentence_pause:
                if raw.is_file() and made.get(f"raw/{stem}") == raw_mark:
                    paid = 0
                else:
                    raw.parent.mkdir(parents=True, exist_ok=True)
                    raw.write_bytes(eleven(scene.narration, channel, *around, speed=scene.speed))
                    made[f"raw/{stem}"] = raw_mark
                sound = paused(raw.read_bytes(), scene.narration, channel.voice_sentence_pause)
            else:
                sound = eleven(scene.narration, channel, *around, speed=scene.speed)
        else:
            sound = cloud(scene.narration, channel)
        (folder / f"{stem}.wav").write_bytes(sound)
        made[stem] = _mark(scene, channel)
        # Written after each scene: a failure half way does not lose what was already paid for.
        (folder / "made.json").write_text(json.dumps(made, indent=2) + "\n", encoding="utf-8", newline="\n")
        sent += paid
        log(f"  {folder.parent.name}/voice/{stem}.wav  " + (f"{paid} characters" if paid else "its pauses made again, nothing paid"))
    return sent
