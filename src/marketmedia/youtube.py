"""Publishing a video on the channel.

Two ways. By hand: ``kit`` writes what to paste into YouTube Studio, and ``by_hand`` remembers
where the video ended up. Through the YouTube Data API: ``upload`` sends a film (the video or its
Short) and, for the video, its thumbnail, its captions and its place in the playlist of its
series. For it, the channel's owner signs in once (``make auth``) with an OAuth client of their
own Google Cloud project, kept in .secrets/client_secret.json; the token it gives is kept beside
it. Neither is ever in git. Uploading is free: it spends the API's daily quota, not money.

YouTube keeps private whatever an API project uploads until the project passes its audit
(https://developers.google.com/youtube/v3/docs/videos/insert), so until then an upload is there
but nobody else can see it. What the API cannot set stays by hand in YouTube Studio: the end
screen, and the Short's related video.
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

from .channel import ROOT, Channel
from .script import Script

# Uploading a film, and (force-ssl) its captions and its place in a playlist.
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"]
DESCRIPTION_MAX = 5000  # YouTube's own limit
CHAPTER_MIN = 10        # seconds: YouTube ignores chapters when one is shorter


def _secrets() -> tuple[Path, Path]:
    folder = ROOT / ".secrets"
    return (Path(os.environ.get("YOUTUBE_CLIENT_SECRET") or folder / "client_secret.json"),
            Path(os.environ.get("YOUTUBE_TOKEN") or folder / "youtube-token.json"))


def chapters(script: Script, cuts: list) -> str:
    """The video's chapters as YouTube reads them in a description: a time and a title on each
    line, the first at 0:00. ``cuts`` is the plan of the video (render.plan). Empty when the
    script names fewer than three, which is the least YouTube takes. No chapter may be shorter
    than ten seconds, so a short intro belongs to the first chapter instead of being one."""
    starts, at = {}, 0.0
    for cut in cuts:
        starts[cut.scene.name] = at
        at += cut.seconds
    marks = sorted((starts[scene], title) for scene, title in script.chapters if scene in starts)
    if len(marks) < 3:
        return ""
    if 0 < marks[0][0] < CHAPTER_MIN:
        marks[0] = (0.0, marks[0][1])
    elif marks[0][0] > 0:
        marks.insert(0, (0.0, "Intro"))
    return "\n".join(f"{int(t) // 60}:{int(t) % 60:02d} {title}" for t, title in marks)


def description(script: Script, channel: Channel, chapters: str = "") -> str:
    """What goes under the video: its description, its chapters, where its facts come from, and
    the notice."""
    parts = [script.description]
    if chapters:
        parts.append("Chapters:\n" + chapters)
    if script.sources:
        parts.append("Sources:\n" + "\n".join(f"- {label}: {address}" for label, address in script.sources))
    if channel.disclaimer:
        parts.append(channel.disclaimer)
    if channel.site:
        parts.append(channel.site)
    return "\n\n".join(parts)


def body(script: Script, channel: Channel, privacy: str | None = None, short: bool = False, chapters: str = "") -> dict:
    """A film as the API takes it: the video, with its chapters, or its Short, with its own title."""
    return {
        "snippet": {
            "title": (script.short_title or script.title) if short else script.title,
            "description": description(script, channel, "" if short else chapters),
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


def service():
    """The API, signed in as the channel's owner."""
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    _, token = _secrets()
    if not token.is_file():
        raise FileNotFoundError("not signed in to YouTube: run 'make auth'")
    granted = set(json.loads(token.read_text(encoding="utf-8")).get("scopes") or [])
    if not set(SCOPES) <= granted:
        raise PermissionError("the sign-in to YouTube does not cover captions and playlists: run 'make auth' again")
    credentials = Credentials.from_authorized_user_file(str(token), SCOPES)
    if not credentials.valid:
        credentials.refresh(Request())
        token.write_text(credentials.to_json(), encoding="utf-8")
    return build("youtube", "v3", credentials=credentials, cache_discovery=False)


def playlist_id(address: str) -> str:
    """A playlist's id, from its address on YouTube (channel.toml keeps the address) or from the id itself."""
    found = re.search(r"[?&]list=([\w\-]+)", address or "")
    if found:
        return found.group(1)
    return address if re.fullmatch(r"[\w\-]{12,}", address or "") else ""


def _why(exc: Exception) -> str:
    """What went wrong with one step of an upload, in a line, with nothing secret in it."""
    return f"{type(exc).__name__}: {getattr(exc, 'reason', None) or str(exc)}"[:300]


def upload(api, film: Path, script: Script, channel: Channel, *, privacy: str | None = None, short: bool = False,
           chapters: str = "", thumbnail: Path | None = None, captions: Path | None = None, playlist: str = "") -> dict:
    """Upload a film: the video with its thumbnail, its captions and its place in ``playlist`` (an
    id), or the Short. ``api`` is ``service()``. Returns what to remember of it. A step after the
    film that fails does not lose the film: the record says which, and why."""
    from googleapiclient.http import MediaFileUpload
    asked = privacy or channel.privacy
    request = api.videos().insert(part="snippet,status", body=body(script, channel, asked, short, chapters),
                                  media_body=MediaFileUpload(str(film), chunksize=-1, resumable=True))
    response = None
    while response is None:
        _, response = request.next_chunk()
    record = {
        "id": response["id"],
        "url": f"https://www.youtube.com/{'shorts/' if short else 'watch?v='}{response['id']}",
        "privacy": response.get("status", {}).get("privacyStatus", asked),
        "asked": asked,
        "uploaded_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    steps = {
        "thumbnail": thumbnail and thumbnail.is_file() and (lambda: api.thumbnails().set(
            videoId=response["id"], media_body=MediaFileUpload(str(thumbnail))).execute()),
        "captions": captions and captions.is_file() and (lambda: api.captions().insert(
            part="snippet", body={"snippet": {"videoId": response["id"], "language": channel.language, "name": ""}},
            media_body=MediaFileUpload(str(captions), mimetype="application/octet-stream")).execute()),
        "playlist": playlist and (lambda: api.playlistItems().insert(
            part="snippet", body={"snippet": {"playlistId": playlist, "resourceId": {"kind": "youtube#video", "videoId": response["id"]}}}).execute()),
    }
    for name, step in steps.items():
        if not step:
            continue
        try:
            step()
            record[name] = True
        except Exception as exc:  # noqa: BLE001 - the film is up: say what is not, do not lose the record
            record[name] = False
            record[f"{name}_error"] = _why(exc)
    return record


def kit(script: Script, channel: Channel, cuts: list | None = None) -> str:
    """What to paste into YouTube Studio to publish the video and its Short by hand. ``cuts`` is
    the plan of the video (render.plan): with it the description carries the chapters and the
    kit says when the end screen starts."""
    words = description(script, channel)
    parts = [
        "Paste into YouTube Studio. The files are in this folder.",
        "=== VIDEO: video.mp4 ===",
        f"Title:\n{script.title}",
        f"Description:\n{description(script, channel, chapters(script, cuts or []))}",
        f"Tags:\n{', '.join(script.tags)}",
        f"Thumbnail: thumbnail.jpg\nCaptions: captions.srt (language: {channel.language})\n"
        f"Audience: not made for kids\nCategory: Education\nVideo language: {channel.language}",
    ]
    outro = [c for c in cuts or [] if channel.outro and c.scene.name == channel.outro.scene]
    if outro:
        total = sum(c.seconds for c in cuts)
        start = total - outro[0].seconds
        parts.append(f"End screen: from {int(start) // 60}:{int(start) % 60:02d} to the end ({outro[0].seconds:.0f} seconds). "
                     "Put a video element on the frame that says 'Watch next' and the subscribe element on the circle.")
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
