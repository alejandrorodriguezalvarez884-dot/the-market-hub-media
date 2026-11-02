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
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import os
import urllib.error
import urllib.request
import wave
from collections.abc import Callable

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


def eleven_request(text: str, channel: Channel, before: str = "", after: str = "") -> dict:
    """What is asked of ElevenLabs for one scene. The words around it let the voice carry its
    tone from one scene to the next, as one person speaking."""
    model = channel.voice_model or "eleven_multilingual_v2"
    if channel.voice_cue and model == "eleven_v3":   # v3 reads a bracketed cue as how to speak
        text = f"{channel.voice_cue} {text}"
    body: dict = {"text": text, "model_id": model, "language_code": channel.voice_language.split("-")[0]}
    if channel.voice_settings:
        body["voice_settings"] = dict(channel.voice_settings)
    if before and body["model_id"] != "eleven_v3":   # v3 does not take the words around it
        body["previous_text"] = before
    if after and body["model_id"] != "eleven_v3":
        body["next_text"] = after
    return body


def _eleven_key() -> str:
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


def eleven(text: str, channel: Channel, before: str = "", after: str = "") -> bytes:
    """Speak ``text`` with ElevenLabs and return a WAV file."""
    request = urllib.request.Request(
        f"{ELEVEN}/{channel.voice_name}?output_format=pcm_{ELEVEN_RATE}",
        data=json.dumps(eleven_request(text, channel, before, after)).encode(), method="POST",
        headers={"xi-api-key": _eleven_key(), "Content-Type": "application/json"})
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
        if speak:
            sound = speak(scene.narration, channel)
        elif channel.voice_engine == "elevenlabs":
            n = said.index(scene.narration)
            sound = eleven(scene.narration, channel, " ".join(said[max(0, n - 2):n]), said[n + 1] if n + 1 < len(said) else "")
        else:
            sound = cloud(scene.narration, channel)
        folder, stem = video.voices(scene.name)
        folder.mkdir(parents=True, exist_ok=True)
        made = _made(folder)
        (folder / f"{stem}.wav").write_bytes(sound)
        made[stem] = _mark(scene, channel)
        # Written after each scene: a failure half way does not lose what was already paid for.
        (folder / "made.json").write_text(json.dumps(made, indent=2) + "\n", encoding="utf-8", newline="\n")
        sent += len(scene.narration)
        log(f"  {folder.parent.name}/voice/{stem}.wav  {len(scene.narration)} characters")
    return sent
