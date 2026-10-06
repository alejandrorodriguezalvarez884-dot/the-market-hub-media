"""The narration: each scene's words spoken by Google Cloud Text-to-Speech, one sound file each.

    videos/<video>/voice/01-hook.wav
    videos/<video>/voice/made.json     what each file was made from, so that nothing is made twice

It uses the owner's own Google Cloud session (``gcloud auth application-default login``) and
project. The service is paid by the character once a monthly free allowance is spent, so a scene
is spoken again only when its words or the voice change. A sound file that this did not make (a
recording the owner dropped in voice/) is left alone.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
from collections.abc import Callable

from .channel import Channel
from .script import Scene, Script
from .videos import Video

URL = "https://texttospeech.googleapis.com/v1/text:synthesize"
Speak = Callable[[str, Channel], bytes]


def request(text: str, channel: Channel) -> dict:
    """What is asked of the service for one scene."""
    return {
        "input": {"text": text},
        "voice": {"languageCode": channel.voice_language, "name": channel.voice_name},
        "audioConfig": {"audioEncoding": "LINEAR16"},  # a WAV file
    }


def cloud(text: str, channel: Channel) -> bytes:
    """Speak ``text`` with Google Cloud Text-to-Speech and return the WAV file."""
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    credentials, project = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or project
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


def _mark(scene: Scene, channel: Channel) -> str:
    """What a scene's sound depends on: its words and the voice."""
    return hashlib.sha256(f"{channel.voice_name}|{channel.voice_language}|{scene.narration}".encode()).hexdigest()[:16]


def pending(video: Video, script: Script, channel: Channel) -> list[Scene]:
    """The scenes whose narration is missing or was made from other words or another voice."""
    made = _made(video)
    out = []
    for scene in script.scenes:
        if not scene.narration:
            continue
        file = video.voice(scene.name)
        if file and scene.name not in made:
            continue  # the owner's own recording
        if not file or made[scene.name] != _mark(scene, channel):
            out.append(scene)
    return out


def _made(video: Video) -> dict:
    record = video.path / "voice" / "made.json"
    return json.loads(record.read_text(encoding="utf-8")) if record.is_file() else {}


def make(video: Video, script: Script, channel: Channel, speak: Speak = cloud,
         log: Callable[[str], None] = print) -> int:
    """Speak the scenes that need it. Returns how many characters were sent to the service."""
    if not channel.voice_name:
        raise ValueError("channel.toml names no voice ([voice] name)")
    folder = video.path / "voice"
    made = _made(video)
    sent = 0
    for scene in pending(video, script, channel):
        sound = speak(scene.narration, channel)
        folder.mkdir(exist_ok=True)
        (folder / f"{scene.name}.wav").write_bytes(sound)
        made[scene.name] = _mark(scene, channel)
        # Written after each scene: a failure half way does not lose what was already paid for.
        (folder / "made.json").write_text(json.dumps(made, indent=2) + "\n", encoding="utf-8", newline="\n")
        sent += len(scene.narration)
        log(f"  voice/{scene.name}.wav  {len(scene.narration)} characters")
    return sent
