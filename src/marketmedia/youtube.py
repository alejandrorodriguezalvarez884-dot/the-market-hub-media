"""Publishing a video on the channel.

Today it is published by hand: ``kit`` writes what to paste into YouTube Studio, and ``by_hand``
remembers where the video ended up. YouTube keeps private whatever an API project uploads until
the project passes its audit, so the upload through the YouTube Data API (``upload``) is for
after that. For it, the channel's owner signs in once (``make auth``) with an OAuth client of
their own Google Cloud project, kept in .secrets/client_secret.json; the token it gives is kept
beside it. Neither is ever in git. Uploading is free: it spends the API's daily quota, not money.
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

from .channel import ROOT, Channel
from .script import Script

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
DESCRIPTION_MAX = 5000  # YouTube's own limit


def _secrets() -> tuple[Path, Path]:
    folder = ROOT / ".secrets"
    return (Path(os.environ.get("YOUTUBE_CLIENT_SECRET") or folder / "client_secret.json"),
            Path(os.environ.get("YOUTUBE_TOKEN") or folder / "youtube-token.json"))


def description(script: Script, channel: Channel) -> str:
    """What goes under the video: its description, where its facts come from, and the notice."""
    parts = [script.description]
    if script.sources:
        parts.append("Sources:\n" + "\n".join(f"- {label}: {address}" for label, address in script.sources))
    if channel.disclaimer:
        parts.append(channel.disclaimer)
    if channel.site:
        parts.append(channel.site)
    return "\n\n".join(parts)


def body(script: Script, channel: Channel, privacy: str | None = None) -> dict:
    """The video as the API takes it."""
    return {
        "snippet": {
            "title": script.title,
            "description": description(script, channel),
            "tags": script.tags,
            "categoryId": channel.category,
            "defaultLanguage": channel.language,
            "defaultAudioLanguage": channel.language,
        },
        "status": {
            "privacyStatus": privacy or channel.privacy,
            "selfDeclaredMadeForKids": channel.made_for_kids,
            "containsSyntheticMedia": channel.synthetic_media,
        },
    }


def sign_in() -> Path:
    """Open the browser for the channel's owner to give this machine leave to upload."""
    from google_auth_oauthlib.flow import InstalledAppFlow
    client, token = _secrets()
    if not client.is_file():
        raise FileNotFoundError(f"no OAuth client at {client}: see 'Publishing' in the README")
    credentials = InstalledAppFlow.from_client_secrets_file(str(client), SCOPES).run_local_server(port=0)
    token.parent.mkdir(parents=True, exist_ok=True)
    token.write_text(credentials.to_json(), encoding="utf-8")
    return token


def _service():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    _, token = _secrets()
    if not token.is_file():
        raise FileNotFoundError("not signed in to YouTube: run 'make auth'")
    credentials = Credentials.from_authorized_user_file(str(token), SCOPES)
    if not credentials.valid:
        credentials.refresh(Request())
        token.write_text(credentials.to_json(), encoding="utf-8")
    return build("youtube", "v3", credentials=credentials, cache_discovery=False)


def upload(film: Path, thumbnail: Path | None, script: Script, channel: Channel, privacy: str | None = None) -> dict:
    """Upload the film and its thumbnail. Returns what to remember of it (published.json)."""
    from googleapiclient.http import MediaFileUpload
    service = _service()
    request = service.videos().insert(part="snippet,status", body=body(script, channel, privacy),
                                      media_body=MediaFileUpload(str(film), chunksize=-1, resumable=True))
    response = None
    while response is None:
        _, response = request.next_chunk()
    record = {
        "id": response["id"],
        "url": f"https://www.youtube.com/watch?v={response['id']}",
        "title": script.title,
        "privacy": response.get("status", {}).get("privacyStatus", privacy or channel.privacy),
        "uploaded_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "thumbnail": False,
    }
    if thumbnail and thumbnail.is_file():
        try:
            service.thumbnails().set(videoId=response["id"], media_body=MediaFileUpload(str(thumbnail))).execute()
            record["thumbnail"] = True
        except Exception as exc:  # noqa: BLE001 - the video is up: say the thumbnail is not, do not lose the record
            record["thumbnail_error"] = type(exc).__name__
    return record


def kit(script: Script, channel: Channel) -> str:
    """What to paste into YouTube Studio to publish the video and its Short by hand."""
    words = description(script, channel)
    parts = [
        "Paste into YouTube Studio. The files are in this folder.",
        "=== VIDEO: video.mp4 ===",
        f"Title:\n{script.title}",
        f"Description:\n{words}",
        f"Tags:\n{', '.join(script.tags)}",
        "Thumbnail: thumbnail.jpg\nCaptions: captions.srt\nAudience: not made for kids",
    ]
    series = channel.series.get(script.series)
    if series:
        parts.append(f"Playlist: {series.name}" + (f"  {series.playlist}" if series.playlist else "  (make it in YouTube Studio the first time)"))
    if script.short:
        parts += [
            "=== SHORT: short.mp4 ===",
            f"Title:\n{script.short_title or script.title}",
            f"Description:\n{words}",
            "Captions: already in the picture\nRelated video: the video above, once it is public",
        ]
    return "\n\n".join(parts) + "\n"


ADDRESS = re.compile(r"https://(www\.)?(youtube\.com/(watch\?v=|shorts/)|youtu\.be/)[\w\-]{6,}\S*")


def by_hand(url: str, short_url: str | None = None) -> dict:
    """What to remember of a video its owner published in YouTube Studio."""
    for address in filter(None, (url, short_url)):
        if not ADDRESS.fullmatch(address):
            raise ValueError(f"not the address of a YouTube video: {address}")
    record = {"url": url, "by": "hand", "published_utc": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    if short_url:
        record["short_url"] = short_url
    return record


def remember(path: Path, record: dict) -> None:
    path.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8", newline="\n")
