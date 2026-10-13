"""The account's latest posts on Instagram, for the Media page of the portal.

The portal shows what the account last posted, whatever it is: a reel, a picture, an album. It
cannot ask Instagram itself: that takes the account's token, which also publishes on it, and a
public service is no place for it. So the posts are read here, where the token is, and left
where the portal reads them (its Firestore, or the folder of a portal on this machine): a card
per post in one "front" document, and each post's cover as a picture of its own, as
market-hub-opinion does with the articles. A visitor's browser asks nothing of Instagram.

The cover of a picture is the picture, and of an album, its first one. For a reel Instagram's API
gives the film's first frame, not the cover the reel has on Instagram, so a reel's cover is taken
here from the film itself, at the moment that was named as its cover when it was published. That
moment is in the reel's own record (`cover_ms` in a video's published.json or instagram.json);
for a reel that has no folder, in channel/instagram-covers.json; and a reel nobody recorded
(posted from the phone) gets its first frame.

A cover that is already where the portal reads it is not made again.
"""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import tempfile
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path

from . import render
from .channel import ROOT
from .instagram import Call, _call

LATEST = 12                # posts kept: what the page shows
TEXT_MAX = 140             # characters of a post's first line
COVER_WIDTH = 720          # pixels: a cover is shown small
COVER_BYTES = 600 * 1024   # a cover travels in one document of the portal's database
DATABASE = os.environ.get("MARKETHUB_FIRESTORE_DATABASE", "market-hub")  # the portal's own
FIELDS = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,shortcode,timestamp,children{media_type,media_url,thumbnail_url}"
Picture = Callable[[str, int], bytes]


def moments(root: Path = ROOT) -> dict[str, int]:
    """Where in its film each reel's cover is, in milliseconds, by the reel's code."""
    found: dict[str, int] = {}
    by_hand = root / "channel" / "instagram-covers.json"
    if by_hand.is_file():
        found.update({code: int(ms) for code, ms in json.loads(by_hand.read_text(encoding="utf-8")).items()})
    for name in ("published.json", "instagram.json"):
        for file in sorted((root / "videos").glob(f"*/{name}")):
            part = json.loads(file.read_text(encoding="utf-8")).get("instagram") or {}
            if part.get("code") and part.get("cover_ms") is not None:
                found[part["code"]] = int(part["cover_ms"])
    return found


def picture(address: str, at_ms: int = 0) -> bytes:
    """A film's frame at a moment, or a picture, as the JPEG the portal keeps: read straight from
    its address, made no wider than a cover is shown."""
    with tempfile.TemporaryDirectory() as folder:
        out = Path(folder) / "cover.jpg"
        for quality in (4, 8, 14):
            done = subprocess.run([render.ffmpeg(), "-y", "-loglevel", "error", *(["-ss", f"{at_ms / 1000:.3f}"] if at_ms else []), "-i", address,
                                   "-frames:v", "1", "-vf", f"scale='min({COVER_WIDTH},iw)':-2", "-q:v", str(quality), "-update", "1", str(out)],
                                  capture_output=True, text=True, timeout=300)
            if done.returncode or not out.is_file():
                raise RuntimeError(f"no cover could be made: {done.stderr.strip()[:200]}")
            if out.stat().st_size <= COVER_BYTES:
                break
        return out.read_bytes()


def _upright(jpeg: bytes) -> bool:
    """Whether a JPEG is taller than wide: read from its own header."""
    at = 2
    while at + 9 < len(jpeg) and jpeg[at] == 0xFF:
        kind, size = jpeg[at + 1], int.from_bytes(jpeg[at + 2:at + 4], "big")
        if 0xC0 <= kind <= 0xCF and kind not in (0xC4, 0xC8, 0xCC):
            return int.from_bytes(jpeg[at + 5:at + 7], "big") > int.from_bytes(jpeg[at + 7:at + 9], "big")
        at += 2 + size
    return False


def card(media: dict, moments: dict[str, int]) -> tuple[dict, str, int]:
    """A post as the page shows it, and where its cover comes from: an address and a moment."""
    code = media.get("shortcode") or ""
    first = ((media.get("children") or {}).get("data") or [{}])[0]
    film = media.get("media_type") == "VIDEO"
    if film:
        kind = "reel" if media.get("media_product_type") == "REELS" else "video"
        at_ms = moments.get(code, 0)
        # With no moment recorded, the frame Instagram already made; with one, the film itself.
        source = media.get("media_url") if at_ms and media.get("media_url") else media.get("thumbnail_url") or media.get("media_url")
        at_ms = at_ms if source == media.get("media_url") else 0
    else:
        kind = "album" if media.get("media_type") == "CAROUSEL_ALBUM" else "photo"
        source, at_ms = media.get("media_url") or first.get("thumbnail_url") or first.get("media_url"), 0
    lines = [line.strip() for line in (media.get("caption") or "").splitlines() if line.strip()]
    text = lines[0] if lines else ""
    if len(text) > TEXT_MAX:
        text = text[:TEXT_MAX - 1].rsplit(" ", 1)[0].rstrip(",;:. ") + "…"
    posted = datetime.strptime(media["timestamp"], "%Y-%m-%dT%H:%M:%S%z").astimezone(timezone.utc).isoformat(timespec="seconds")
    return ({"id": str(media["id"]), "code": code, "url": media.get("permalink") or "", "kind": kind, "text": text, "posted_utc": posted},
            source or "", at_ms)


def gather(key: str, kept: dict | None = None, *, call: Call = _call, picture: Picture = picture, moments: dict[str, int] | None = None,
           limit: int = LATEST, now: Callable[[], datetime] = lambda: datetime.now(timezone.utc),
           log: Callable[[str], None] = print) -> tuple[dict, dict[str, bytes]]:
    """Read the account's latest posts. Returns the front the portal reads and the covers that
    are new: a post that ``kept`` (the front already there) has, with its cover taken at the same
    moment, keeps that cover. A post whose cover cannot be made is left out, and said."""
    moments = moments if moments is not None else {}
    before = {p["id"]: p for p in (kept or {}).get("posts") or []}
    who = call("GET", "me", key, fields="user_id,username")
    posts, covers = [], {}
    for media in call("GET", "me/media", key, fields=FIELDS, limit=limit).get("data") or []:
        post, source, at_ms = card(media, moments)
        had = (before.get(post["id"]) or {}).get("cover") or {}
        if had.get("v") and had.get("at_ms", 0) == at_ms:
            post["cover"] = had
        else:
            try:
                if not source:
                    raise RuntimeError("Instagram gave no picture of it")
                jpeg = picture(source, at_ms)
            except (RuntimeError, OSError, subprocess.SubprocessError) as exc:
                log(f"  {post['code'] or post['id']} is left out: {exc}")
                continue
            covers[post["id"]] = jpeg
            post["cover"] = {"v": hashlib.sha256(jpeg).hexdigest()[:12], "at_ms": at_ms, "upright": _upright(jpeg)}
        posts.append(post)
    return {"posts": posts, "handle": who.get("username") or "", "read_utc": now().isoformat(timespec="seconds")}, covers


# --- Where the portal reads them -----------------------------------------------------------------


class Folder:
    """The folder a portal on this machine reads: front.json and covers/<id>.jpg."""

    def __init__(self, root: Path):
        self.root = Path(root)

    def front(self) -> dict:
        file = self.root / "front.json"
        return json.loads(file.read_text(encoding="utf-8")) if file.is_file() else {}

    def publish(self, front: dict, covers: dict[str, bytes]) -> None:
        (self.root / "covers").mkdir(parents=True, exist_ok=True)
        for id_, jpeg in covers.items():
            (self.root / "covers" / f"{id_}.jpg").write_bytes(jpeg)
        (self.root / "front.json").write_text(json.dumps(front, indent=2), encoding="utf-8")
        shown = {p["id"] for p in front["posts"]}
        for old in (self.root / "covers").glob("*.jpg"):
            if old.stem not in shown:
                old.unlink()


class Firestore:
    """The portal's database: instagram_state/front and instagram_covers/<id>."""

    def __init__(self, database: str = DATABASE):
        from google.cloud import firestore
        project = os.environ.get("GOOGLE_CLOUD_PROJECT")
        if not project:
            raise SystemExit("error: no Google Cloud project. Run it with `make posts`, or set GOOGLE_CLOUD_PROJECT.")
        self.client = firestore.Client(project=project, database=database)
        self.state = self.client.collection("instagram_state").document("front")
        self.covers = self.client.collection("instagram_covers")

    def front(self) -> dict:
        snap = self.state.get()
        return (snap.to_dict() or {}) if snap.exists else {}

    def publish(self, front: dict, covers: dict[str, bytes]) -> None:
        versions = {p["id"]: p["cover"]["v"] for p in front["posts"]}
        # The covers first, one by one (each is a large document): the front never names one that is not there.
        for id_, jpeg in covers.items():
            self.covers.document(id_).set({"jpeg": jpeg, "v": versions[id_]})
        self.state.set(front)
        for old in self.covers.list_documents():
            if old.id not in versions:
                old.delete()


def sync(key: str, store, *, log: Callable[[str], None] = print, **how) -> dict:
    """Read the account's posts and leave them where the portal reads them. Returns the front."""
    front, covers = gather(key, store.front(), moments=how.pop("moments", None) or moments(), log=log, **how)
    store.publish(front, covers)
    return front
