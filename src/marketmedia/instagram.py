"""The Short on Instagram, as a reel on the channel's account.

Through the Instagram API with Instagram Login (graph.instagram.com). The account's owner makes
a Meta app once, generates a token for the account in the app's dashboard and saves it in
.secrets/instagram-token.txt, which is never in git. That token lasts sixty days and is renewed
from here as it ages, so it only has to be generated again after two months without a reel. An
app that publishes on its owner's own account needs no review by Meta
(https://developers.facebook.com/docs/instagram-platform/overview).

Instagram does not take a file from this API: it fetches the film from an address anybody can
reach (https://developers.facebook.com/docs/instagram-platform/content-publishing). So the film
is parked in a Google Cloud Storage bucket of the owner's project for the minutes the publishing
takes, under a name nobody can guess, and taken away afterwards.
"""

from __future__ import annotations

import json
import os
import re
import secrets
import time
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path

from .channel import ROOT, Channel
from .script import Script

API = "https://graph.instagram.com/v25.0"
CAPTION_MAX = 2200     # Instagram's own limit
HASHTAGS = 5           # of a script's tags: Instagram reads a few, and takes thirty at most
RENEW_DAYS = 7         # a token older than this is renewed before it is used
EVERY, TRIES = 15, 40  # how often Instagram is asked whether it has read the film, and how many times

Call = Callable[..., dict]
Park = Callable[[Path, str], tuple[str, Callable[[], None]]]


def _token_file() -> Path:
    return Path(os.environ.get("INSTAGRAM_TOKEN") or ROOT / ".secrets" / "instagram-token.txt")


def _call(method: str, path: str, key: str, **params) -> dict:
    """One request to Instagram's API. What it answers when it refuses is said in a line, with
    nothing secret in it."""
    url, data = f"{API}/{path}", None
    if method == "GET":
        url += "?" + urllib.parse.urlencode(params)
    else:
        data = json.dumps(params).encode()
    request = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        try:
            reason = json.load(exc)["error"]["message"]
        except (ValueError, KeyError, TypeError):
            reason = ""
        raise RuntimeError(f"Instagram answered {exc.code}: {reason[:300]}") from None
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Instagram could not be reached: {exc.reason}") from None


def token(call: Call = _call, now: Callable[[], float] = time.time) -> str:
    """The account's token, renewed for another sixty days when it has aged. A renewal that
    fails is not the end: the token may still be good, and the next request says if it is not."""
    file = _token_file()
    if not file.is_file():
        raise FileNotFoundError(f"no Instagram token at {file}: see 'Instagram' in the README")
    key = file.read_text(encoding="utf-8").strip()
    if not key:
        raise FileNotFoundError(f"{file} is empty: see 'Instagram' in the README")
    if now() - file.stat().st_mtime > RENEW_DAYS * 86400:
        try:
            key = call("GET", "refresh_access_token", key, grant_type="ig_refresh_token", access_token=key)["access_token"]
            file.write_text(key + "\n", encoding="utf-8", newline="\n")
        except (RuntimeError, KeyError):
            pass
    return key


def account(key: str, call: Call = _call) -> dict:
    """The account a token is for: its id, its name and its kind."""
    return call("GET", "me", key, fields="user_id,username,account_type")


def hashtags(tags: list[str]) -> str:
    """A script's first tags as Instagram writes them: "earnings per share" is #earningspershare."""
    words = [re.sub(r"[^a-z0-9]", "", tag.lower()) for tag in tags]
    return " ".join(f"#{word}" for word in list(dict.fromkeys(filter(None, words)))[:HASHTAGS])


def caption(script: Script, channel: Channel, video_url: str = "") -> str:
    """What goes under the reel: the Short's title, the description, where the whole video is,
    where its facts come from, and the notice. An address is not a link on Instagram, so the
    sources are given whole only while they fit; past that, by their names."""
    def words(sources: str) -> str:
        parts = [script.short_title or script.title, script.description,
                 f"The full video is on YouTube: {video_url}" if video_url else f"The full video is on YouTube: {channel.name}.",
                 sources, channel.disclaimer, channel.site, hashtags(script.tags)]
        return "\n\n".join(filter(None, parts))

    whole = words("Sources:\n" + "\n".join(f"- {label}: {address}" for label, address in script.sources) if script.sources else "")
    if len(whole) <= CAPTION_MAX:
        return whole
    named = words("Sources: " + "; ".join(label for label, _ in script.sources) + ".")
    if len(named) > CAPTION_MAX:
        raise ValueError(f"the reel's caption is {len(named)} characters and Instagram takes {CAPTION_MAX}: shorten the description")
    return named


def park(film: Path, bucket: str) -> tuple[str, Callable[[], None]]:
    """Put a film in the bucket, where anybody with its address can fetch it, and return that
    address and how to take the film away. It uses the owner's own Google Cloud session, as the
    voice does."""
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"],
                                         quota_project_id=os.environ.get("GOOGLE_CLOUD_PROJECT") or None)
    session = AuthorizedSession(credentials)
    name = f"{secrets.token_urlsafe(24)}{film.suffix}"
    sent = session.post(f"https://storage.googleapis.com/upload/storage/v1/b/{bucket}/o",
                        params={"uploadType": "media", "name": name}, data=film.read_bytes(),
                        headers={"Content-Type": "video/mp4"}, timeout=600)
    if sent.status_code != 200:
        raise RuntimeError(f"the bucket {bucket} answered {sent.status_code}: {sent.text[:200]}")

    def remove() -> None:
        gone = session.delete(f"https://storage.googleapis.com/storage/v1/b/{bucket}/o/{name}", timeout=60)
        if gone.status_code not in (204, 404):
            raise RuntimeError(f"the bucket {bucket} answered {gone.status_code}")

    address = f"https://storage.googleapis.com/{bucket}/{name}"
    try:
        urllib.request.urlopen(urllib.request.Request(address, method="HEAD"), timeout=60).close()
    except urllib.error.URLError:
        remove()
        raise PermissionError(f"the bucket {bucket} does not let anybody read what is in it, and Instagram "
                              "has to fetch the film: see 'Instagram' in the README") from None
    return address, remove


def publish(film: Path, words: str, bucket: str, *, cover_ms: int = 0, key: str | None = None, call: Call = _call,
            park: Park = park, wait: Callable[[float], None] = time.sleep, log: Callable[[str], None] = print) -> dict:
    """Publish a film as a reel, with ``words`` under it and the frame at ``cover_ms`` as its
    cover. Returns what to remember of it. Nothing is published unless Instagram has read the
    whole film; the film leaves the bucket either way."""
    if not bucket:
        raise ValueError("channel.toml names no bucket ([instagram] bucket), and Instagram has to fetch the film from one")
    key = key or token(call)
    me = account(key, call)["user_id"]
    address, remove = park(film, bucket)
    try:
        container = call("POST", f"{me}/media", key, media_type="REELS", video_url=address, caption=words,
                         share_to_feed=True, thumb_offset=cover_ms)["id"]
        for _ in range(TRIES):
            state = call("GET", container, key, fields="status_code,status")
            if state.get("status_code") == "FINISHED":
                break
            if state.get("status_code") in ("ERROR", "EXPIRED"):
                raise RuntimeError(f"Instagram could not take the film: {state.get('status') or state['status_code']}")
            wait(EVERY)
        else:
            raise RuntimeError(f"Instagram was still reading the film after {EVERY * TRIES // 60} minutes: nothing was published")
        media = call("POST", f"{me}/media_publish", key, creation_id=container)["id"]
    finally:
        try:
            remove()
        except Exception as exc:  # noqa: BLE001 - the reel matters more: say the film is still there
            log(f"  the film is still in the bucket {bucket}: {type(exc).__name__}: {exc}")
    record = {"id": media, "url": "", "uploaded_utc": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    try:
        where = call("GET", media, key, fields="permalink,shortcode")
        record.update(url=where.get("permalink", ""), code=where.get("shortcode", ""))
    except RuntimeError as exc:  # the reel is up: do not lose the record for want of its address
        record["url_error"] = str(exc)
    return record
