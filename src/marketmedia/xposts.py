"""The account's posts on X: each written here, checked here, put on X and recorded here.

A post is a Markdown file in x/, named by its day and a slug, whose body is exactly what goes on X:

    ---
    sources:
      - Market Hub, today's market | https://themarkethub.app/api/public/overview
    ---
    The S&P 500 closed 0.8% higher; ten of its eleven sectors rose.

    The day on one ruler: https://themarkethub.app/today/

A post goes on X through its API (`send`, with `xapi.create`), which is paid by the post: $0.015,
or $0.20 when it has a link. Two kinds of post go there (owner's decision, 2026-10-21):

- the ones the owner asks for, each after a yes to its exact text, which may link to Market Hub;
- the ones the channel makes on its own (`auto: yes` in the header), on a timer, with no link and
  no address X would turn into one, and at most AUTO_PER_DAY of them a day.

It can still be put there by hand, in the browser of a Claude Code session, and recorded with
`posted`. Once it is there, its address is written into the file (`url:` and `posted_utc:`), and
the latest posts are left where the portal's Media page reads them (its Firestore, or the folder
of a portal on this machine), as `posts.py` does for Instagram. A visitor's browser asks nothing
of X.
"""

from __future__ import annotations

import json
import os
import re
import unicodedata
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from .channel import ROOT
from .script import ADVICE

FOLDER = ROOT / "x"
LATEST = 12               # posts the portal is given: what the page shows
LENGTH_MAX = 280          # X's limit, in its own weighted characters
LINK_LENGTH = 23          # X counts any link as this many, whatever its length
HASHTAGS_MAX = 2
AUTO_PER_DAY = 5          # posts the channel makes on its own in a day (UTC), at most
DATABASE = os.environ.get("MARKETHUB_FIRESTORE_DATABASE", "market-hub")  # the portal's own
NAME = re.compile(r"\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9\-]{0,60}")
LINK = re.compile(r"https?://[^\s<>\"]+")
HASHTAG = re.compile(r"(?<![\w&])#\w+")
# A post's address on X: the account's name and the post's number.
STATUS = re.compile(r"https://(?:x|twitter)\.com/([A-Za-z0-9_]{1,15})/status/(\d{5,25})/?")
# Where a post may send its readers: Market Hub and its own accounts.
OURS = re.compile(r"https://(?:[a-z0-9\-]+\.)?(?:themarkethub\.app|earningsradar\.app)(?:/[^\s]*)?"
                  r"|https://(?:www\.)?(?:youtube\.com|youtu\.be|instagram\.com|x\.com)/[^\s]*")
# Text X would turn into a link (and charge for as one): a name, a dot and a domain's ending.
BARE = re.compile(r"(?<![\w@$#/.])[A-Za-z0-9][\w-]*(?:\.[\w-]+)*\.[A-Za-z]{2,24}(?![\w.]*\w)(?:/\S*)?")
FIGURE = re.compile(r"\d")
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️]")


class Invalid(ValueError):
    pass


@dataclass
class Post:
    path: Path
    text: str
    sources: list[str] = field(default_factory=list)
    url: str = ""
    posted_utc: str = ""
    auto: bool = False        # made by the channel on its own, on a timer

    @property
    def name(self) -> str:
        return self.path.stem

    @property
    def id(self) -> str:
        found = STATUS.fullmatch(self.url)
        return found.group(2) if found else ""


def load(path: Path) -> Post:
    raw = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    rest = "\n" + raw[4:]  # the header's own lines, after its first ---
    if not raw.startswith("---\n") or "\n---\n" not in rest:
        raise Invalid(f"{path.name}: it starts with its --- header (sources, and url once posted)")
    head, body = rest.split("\n---\n", 1)
    post = Post(path, body.strip())
    listing = False
    for line in head.splitlines():
        if not line.strip():
            continue
        if listing and line.lstrip().startswith("- "):
            post.sources.append(line.lstrip()[2:].strip())
            continue
        listing = False
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if key == "sources":
            listing = True
            if value:
                post.sources.append(value)
        elif key == "url":
            post.url = value
        elif key == "posted_utc":
            post.posted_utc = value
        elif key == "auto":
            post.auto = value.lower() in ("yes", "true")
        else:
            raise Invalid(f"{path.name}: '{key}' is not a field of a post (sources, auto, url, posted_utc)")
    return post


def save(post: Post) -> None:
    head = []
    if post.sources:
        head += ["sources:", *(f"  - {s}" for s in post.sources)]
    if post.auto:
        head += ["auto: yes"]
    if post.url:
        head += [f"url: {post.url}", f"posted_utc: {post.posted_utc}"]
    post.path.write_text("---\n" + "\n".join(head) + ("\n" if head else "") + "---\n" + post.text + "\n", encoding="utf-8")


def every(folder: Path = FOLDER) -> list[Post]:
    """Every post, oldest first."""
    return [load(p) for p in sorted(folder.glob("*.md"))] if folder.is_dir() else []


def find(name: str, folder: Path = FOLDER) -> Post:
    """A post by its name, or a part of it that only one post has."""
    path = Path(name)
    if path.is_file():
        return load(path)
    hits = [p for p in sorted(folder.glob("*.md")) if name in p.stem] if folder.is_dir() else []
    if len(hits) != 1:
        raise LookupError(f"{len(hits) or 'no'} posts in x/ match '{name}'" + (f": {', '.join(p.stem for p in hits)}" if hits else ""))
    return load(hits[0])


def length(text: str) -> int:
    """How long X counts a text: a link is 23 whatever it is, and most characters outside the
    Latin and Greek alphabets and common punctuation count twice."""
    weight = 0
    for char in unicodedata.normalize("NFC", LINK.sub("", text)):
        code = ord(char)
        light = code <= 0x10FF or 0x2000 <= code <= 0x200D or 0x2010 <= code <= 0x201F or 0x2032 <= code <= 0x2037
        weight += 1 if light else 2
    return weight + LINK_LENGTH * len(LINK.findall(text))


def problems(post: Post, handle: str = "") -> list[str]:
    """Empty when nothing stops this post from going on X."""
    found = []
    if not NAME.fullmatch(post.name):
        found.append("its file is not named <YYYY-MM-DD>-<slug>.md")
    text = post.text
    if not text:
        return found + ["it has no text"]
    links = LINK.findall(text)
    size = length(text)
    if size > LENGTH_MAX:
        found.append(f"it is {size} characters long as X counts them (a link is {LINK_LENGTH}); X takes {LENGTH_MAX}")
    for match in ADVICE.finditer(text):
        found.append(f"reads as advice: {match.group(0)!r}")
    for link in links:
        if not OURS.fullmatch(link.rstrip(".,;:!?)")):
            found.append(f"links outside Market Hub and its own accounts: {link}")
    if len(HASHTAG.findall(text)) > HASHTAGS_MAX:
        found.append(f"it has {len(HASHTAG.findall(text))} hashtags; the account uses {HASHTAGS_MAX} at most")
    if EMOJI.search(text):
        found.append("it has an emoji; the account uses none")
    if post.auto:
        for link in [*links, *BARE.findall(LINK.sub(" ", text))]:
            found.append(f"a post made on its own carries no link (X charges $0.20 for a post with one): {link}")
    if FIGURE.search(LINK.sub("", text)) and not post.sources:
        found.append("it has figures and no sources")
    if post.url:
        status = STATUS.fullmatch(post.url)
        if not status:
            found.append(f"url: {post.url} is not the address of a post on X")
        elif handle and status.group(1).lower() != handle.lower():
            found.append(f"url: {post.url} is a post of @{status.group(1)}, not of @{handle}")
    return found


def posted(post: Post, url: str, handle: str = "", *, now: Callable[[], datetime] = lambda: datetime.now(timezone.utc)) -> Post:
    """Write down where a post went on X."""
    url = url.strip().split("?")[0].rstrip("/").replace("https://twitter.com/", "https://x.com/")
    status = STATUS.fullmatch(url)
    if not status:
        raise Invalid(f"{url} is not the address of a post on X (https://x.com/<account>/status/<number>)")
    if handle and status.group(1).lower() != handle.lower():
        raise Invalid(f"{url} is a post of @{status.group(1)}, not of @{handle}")
    post.url, post.posted_utc = url, now().isoformat(timespec="seconds")
    save(post)
    return post


def auto_today(all_posts: list[Post], now: Callable[[], datetime] = lambda: datetime.now(timezone.utc)) -> int:
    """How many posts the channel made on its own today (UTC)."""
    day = now().date().isoformat()
    return sum(1 for p in all_posts if p.auto and p.url and p.posted_utc.startswith(day))


def send(post: Post, handle: str, create: Callable[[str], str], all_posts: list[Post], *,
         now: Callable[[], datetime] = lambda: datetime.now(timezone.utc)) -> Post:
    """Put a post on X through the API (`create` takes its text and gives the new post's
    number), once, and write down where it went."""
    if not handle:
        raise Invalid("channel.toml has no [x] handle")
    if post.url:
        raise Invalid(f"{post.name} is already on X: {post.url}")
    found = problems(post, handle)
    if found:
        raise Invalid(f"{post.name} cannot go on X: " + "; ".join(found))
    if post.auto and auto_today(all_posts, now) >= AUTO_PER_DAY:
        raise Invalid(f"the channel already made {AUTO_PER_DAY} posts on its own today; that is its most")
    number = create(post.text)
    return posted(post, f"https://x.com/{handle}/status/{number}", handle, now=now)


def front(all_posts: list[Post], handle: str, *, limit: int = LATEST,
          now: Callable[[], datetime] = lambda: datetime.now(timezone.utc)) -> dict:
    """The latest posts that are on X, newest first, as the portal's page shows them."""
    shown = sorted((p for p in all_posts if p.url and p.id), key=lambda p: (p.posted_utc, p.name), reverse=True)[:limit]
    return {"posts": [{"id": p.id, "url": p.url, "text": p.text, "posted_utc": p.posted_utc} for p in shown],
            "handle": handle, "read_utc": now().isoformat(timespec="seconds")}


# --- Where the portal reads them -----------------------------------------------------------------


class Folder:
    """The folder a portal on this machine reads: front.json."""

    def __init__(self, root: Path):
        self.root = Path(root)

    def publish(self, front: dict) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        (self.root / "front.json").write_text(json.dumps(front, indent=2), encoding="utf-8")


class Firestore:
    """The portal's database: x_state/front."""

    def __init__(self, database: str = DATABASE):
        from google.cloud import firestore
        project = os.environ.get("GOOGLE_CLOUD_PROJECT")
        if not project:
            raise SystemExit("error: no Google Cloud project. Run it with `make xfront`, or set GOOGLE_CLOUD_PROJECT.")
        self.state = firestore.Client(project=project, database=database).collection("x_state").document("front")

    def publish(self, front: dict) -> None:
        self.state.set(front)
