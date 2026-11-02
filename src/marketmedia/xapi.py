"""Posting on X through its API, as the account itself.

X's API is paid by the request, from credits bought in advance in its Developer Console. What the
account does with it costs (X's pricing page, 2026-10-21): $0.015 a post, $0.20 a post with a link
in it, $0.001 to read its own profile. So the posts this channel makes on its own carry no link
(`xposts.problems`), and only the ones the owner asks for do.

The account signs each request with OAuth 1.0a (user context): the app's key and secret, and the
access token and secret the Developer Console gives for the account itself, with "Read and
write". They live in .secrets/x-api.json, which is never in git, or in the environment:

    {"api_key": "...", "api_secret": "...", "access_token": "...", "access_secret": "..."}

In a cloud session (docs/reels.md) the four keys come from Secret Manager instead
(X_API_KEYS_SECRET, the secret's full name, read with the service account's Google key).

A reel goes to X with its video: uploaded in pieces (POST /2/media/upload/initialize, then
/{id}/append for each piece and /{id}/finalize, and GET /2/media/upload?command=STATUS until X has
processed it; docs.x.com, "Media upload"), then attached to the first post of a short thread.

Nothing here is ever printed: an error says what X answered, never a key.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import time
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Callable
from pathlib import Path

from .channel import ROOT

API = "https://api.x.com/2"
KEYS = ("api_key", "api_secret", "access_token", "access_secret")
ENVIRONMENT = {"api_key": "X_API_KEY", "api_secret": "X_API_SECRET",
               "access_token": "X_ACCESS_TOKEN", "access_secret": "X_ACCESS_SECRET"}

Call = Callable[[str, str, dict, dict | None], dict]


def _keys_file() -> Path:
    return Path(os.environ.get("X_API_KEYS") or ROOT / ".secrets" / "x-api.json")


def keys() -> dict:
    """The four keys, from the environment, from Secret Manager in a cloud session
    (X_API_KEYS_SECRET), or else from .secrets/x-api.json."""
    secret = os.environ.get("X_API_KEYS_SECRET", "").strip()
    if secret:
        from . import cloud
        found = json.loads(cloud.value(secret))
        missing = [name for name in KEYS if not str(found.get(name, "")).strip()]
        if missing:
            raise FileNotFoundError(f"the X API keys in Secret Manager lack {', '.join(missing)}")
        return {name: str(found[name]).strip() for name in KEYS}
    found = {name: os.environ.get(variable, "") for name, variable in ENVIRONMENT.items()}
    if not all(found.values()):
        file = _keys_file()
        if not file.is_file():
            raise FileNotFoundError(f"no X API keys at {file}: see 'X' in the README")
        try:
            found = json.loads(file.read_text(encoding="utf-8"))
        except ValueError:
            raise FileNotFoundError(f"{file} is not JSON: see 'X' in the README") from None
    missing = [name for name in KEYS if not str(found.get(name, "")).strip()]
    if missing:
        raise FileNotFoundError(f"the X API keys lack {', '.join(missing)}: see 'X' in the README")
    return {name: str(found[name]).strip() for name in KEYS}


def _quote(value: str) -> str:
    return urllib.parse.quote(str(value), safe="-._~")


def signature(method: str, url: str, params: dict, api_secret: str, access_secret: str) -> str:
    """OAuth 1.0a's HMAC-SHA1 signature of a request: its method, its address and every
    parameter (the oauth_ ones and any of the query or a form body; a JSON body is not one)."""
    pairs = sorted((_quote(k), _quote(v)) for k, v in params.items())
    base = "&".join([method.upper(), _quote(url), _quote("&".join(f"{k}={v}" for k, v in pairs))])
    key = f"{_quote(api_secret)}&{_quote(access_secret)}"
    return base64.b64encode(hmac.new(key.encode(), base.encode(), hashlib.sha1).digest()).decode()


def authorization(method: str, url: str, keys: dict, *, nonce: str = "", timestamp: int = 0) -> str:
    """The Authorization header of a request signed as the account. A query string in ``url`` is
    signed as parameters, on the address without it (OAuth 1.0a); a JSON or multipart body is not."""
    base, _, query = url.partition("?")
    oauth = {"oauth_consumer_key": keys["api_key"], "oauth_nonce": nonce or secrets.token_hex(16),
             "oauth_signature_method": "HMAC-SHA1", "oauth_timestamp": str(timestamp or int(time.time())),
             "oauth_token": keys["access_token"], "oauth_version": "1.0"}
    signed = {**oauth, **dict(urllib.parse.parse_qsl(query, keep_blank_values=True))}
    oauth["oauth_signature"] = signature(method, base, signed, keys["api_secret"], keys["access_secret"])
    return "OAuth " + ", ".join(f'{_quote(k)}="{_quote(v)}"' for k, v in sorted(oauth.items()))


def _multipart(fields: dict) -> tuple[bytes, str]:
    """A multipart/form-data body: text fields, and bytes as a file part."""
    boundary = secrets.token_hex(16)
    out = b""
    for name, value in fields.items():
        if isinstance(value, bytes):
            out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"; filename=\"blob\"\r\n"
                    f"Content-Type: application/octet-stream\r\n\r\n").encode() + value + b"\r\n"
        else:
            out += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode()
    return out + f"--{boundary}--\r\n".encode(), f"multipart/form-data; boundary={boundary}"


def _call(method: str, url: str, keys: dict, body: dict | None = None) -> dict:
    """One signed request to X's API: a JSON body, or a multipart one when a field is bytes.
    What X answers when it refuses is said in a line."""
    headers = {"Authorization": authorization(method, url, keys)}
    data = None
    if body is not None and any(isinstance(v, bytes) for v in body.values()):
        data, headers["Content-Type"] = _multipart(body)
    elif body is not None:
        data, headers["Content-Type"] = json.dumps(body).encode(), "application/json"
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=300) as response:
            raw = response.read()
            return json.loads(raw) if raw.strip() else {}
    except urllib.error.HTTPError as exc:
        try:
            answer = json.load(exc)
            reason = answer.get("detail") or answer.get("title") or json.dumps(answer)
        except (ValueError, AttributeError):
            reason = ""
        raise RuntimeError(f"X answered {exc.code}: {str(reason)[:300]}") from None
    except urllib.error.URLError as exc:
        raise RuntimeError(f"X could not be reached: {exc.reason}") from None


CHUNK = 4 * 1024 * 1024    # X asks for pieces of 5 MB or less
TRIES = 60                 # asks for the processing status, at most


def upload_video(film: Path, keys: dict, call: Call = _call, wait: Callable[[float], None] = time.sleep) -> str:
    """Upload a film for a post and wait until X has processed it; its media id."""
    data = film.read_bytes()
    started = call("POST", f"{API}/media/upload/initialize", keys,
                   {"media_type": "video/mp4", "total_bytes": len(data), "media_category": "tweet_video"})
    media = str((started.get("data") or {}).get("id", ""))
    if not media:
        raise RuntimeError(f"X did not open an upload: {json.dumps(started)[:300]}")
    for index, start in enumerate(range(0, len(data), CHUNK)):
        call("POST", f"{API}/media/upload/{media}/append", keys, {"segment_index": str(index), "media": data[start:start + CHUNK]})
    state = (call("POST", f"{API}/media/upload/{media}/finalize", keys, None).get("data") or {}).get("processing_info")
    for _ in range(TRIES):
        if not state or state.get("state") == "succeeded":
            return media
        if state.get("state") == "failed":
            raise RuntimeError(f"X could not process the video: {json.dumps(state)[:300]}")
        wait(max(1, int(state.get("check_after_secs", 5))))
        state = (call("GET", f"{API}/media/upload?command=STATUS&media_id={media}", keys, None).get("data") or {}).get("processing_info")
    raise RuntimeError("X was still processing the video after a long wait: nothing was posted")


def create(text: str, keys: dict, call: Call = _call, *, media: str = "", reply_to: str = "") -> str:
    """Put a post on X as the account, with a video already uploaded (``media``) or as a reply to
    another post (``reply_to``, for a thread); the new post's number."""
    body: dict = {"text": text}
    if media:
        body["media"] = {"media_ids": [media]}
    if reply_to:
        body["reply"] = {"in_reply_to_tweet_id": reply_to}
    answer = call("POST", f"{API}/tweets", keys, body)
    number = str((answer.get("data") or {}).get("id", ""))
    if not number.isdigit():
        raise RuntimeError(f"X took the post but gave no number for it: {json.dumps(answer)[:300]}")
    return number


def thread(texts: list[str], film: Path, keys: dict, call: Call = _call,
           wait: Callable[[float], None] = time.sleep) -> list[str]:
    """Post ``texts`` as a thread, the film on the first post; the posts' numbers, in order."""
    media = upload_video(film, keys, call, wait)
    numbers: list[str] = []
    for text in texts:
        numbers.append(create(text, keys, call, media=media if not numbers else "", reply_to=numbers[-1] if numbers else ""))
    return numbers


def me(keys: dict, call: Call = _call) -> str:
    """The handle the keys post as."""
    return str((call("GET", f"{API}/users/me", keys, None).get("data") or {}).get("username", ""))
