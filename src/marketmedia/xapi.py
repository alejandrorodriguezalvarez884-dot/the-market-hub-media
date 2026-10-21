"""Posting on X through its API, as the account itself.

X's API is paid by the request, from credits bought in advance in its Developer Console. What the
account does with it costs (X's pricing page, 2026-10-21): $0.015 a post, $0.20 a post with a link
in it, $0.001 to read its own profile. So the posts this channel makes on its own carry no link
(`xposts.problems`), and only the ones the owner asks for do.

The account signs each request with OAuth 1.0a (user context): the app's key and secret, and the
access token and secret the Developer Console gives for the account itself, with "Read and
write". They live in .secrets/x-api.json, which is never in git, or in the environment:

    {"api_key": "...", "api_secret": "...", "access_token": "...", "access_secret": "..."}

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
    """The four keys, from the environment or else from .secrets/x-api.json."""
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
    """The Authorization header of a request signed as the account."""
    oauth = {"oauth_consumer_key": keys["api_key"], "oauth_nonce": nonce or secrets.token_hex(16),
             "oauth_signature_method": "HMAC-SHA1", "oauth_timestamp": str(timestamp or int(time.time())),
             "oauth_token": keys["access_token"], "oauth_version": "1.0"}
    oauth["oauth_signature"] = signature(method, url, oauth, keys["api_secret"], keys["access_secret"])
    return "OAuth " + ", ".join(f'{_quote(k)}="{_quote(v)}"' for k, v in sorted(oauth.items()))


def _call(method: str, url: str, keys: dict, body: dict | None = None) -> dict:
    """One signed request to X's API. What X answers when it refuses is said in a line."""
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Authorization": authorization(method, url, keys)}
    if data is not None:
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        try:
            answer = json.load(exc)
            reason = answer.get("detail") or answer.get("title") or json.dumps(answer)
        except (ValueError, AttributeError):
            reason = ""
        raise RuntimeError(f"X answered {exc.code}: {str(reason)[:300]}") from None
    except urllib.error.URLError as exc:
        raise RuntimeError(f"X could not be reached: {exc.reason}") from None


def create(text: str, keys: dict, call: Call = _call) -> str:
    """Put a post on X as the account; the new post's number."""
    answer = call("POST", f"{API}/tweets", keys, {"text": text})
    number = str((answer.get("data") or {}).get("id", ""))
    if not number.isdigit():
        raise RuntimeError(f"X took the post but gave no number for it: {json.dumps(answer)[:300]}")
    return number


def me(keys: dict, call: Call = _call) -> str:
    """The handle the keys post as."""
    return str((call("GET", f"{API}/users/me", keys, None).get("data") or {}).get("username", ""))
