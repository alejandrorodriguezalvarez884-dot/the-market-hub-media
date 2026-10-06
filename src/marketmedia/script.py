"""A video's script: script.md in the video's folder, with a few lines of data on top.

    ---
    title: What a buyback really does to earnings per share
    description: Two or three sentences for the video's page on YouTube.
    tags: buybacks, earnings per share
    tickers: AAPL, MSFT
    sources:
      - What the link says | https://example.gov/release
      - The company's annual report | https://www.sec.gov/...
    ---

    ## 01-hook

    What is said while the picture of this scene is on screen. Plain text, in paragraphs.

    ## 02-title
    seconds: 3

A scene is a "## " heading with its name (two digits, a dash, a few words) and, under it, what is
said. Its picture is slides/<name>.html (or .svg). A scene where nothing is said gives its length
in a "seconds:" line.

``load`` reads one, and refuses it when it cannot be read as a script. ``problems`` says what
stops a script that can be read from being published.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

SCENE = re.compile(r"\d{2}-[a-z0-9][a-z0-9\-]{0,40}")
HEADING = re.compile(r"##\s+(\S.*?)\s*$")
# YouTube's own limits.
TITLE_MAX = 100
TAGS_MAX = 500
# A video argues and explains; it does not tell a viewer what to do with their money.
ADVICE = re.compile(
    r"\b(you should (buy|sell|hold)|we recommend|(buy|sell|hold) rating|strong buy|price target of|our (price )?target"
    r"|time to (buy|sell)|must[- ]own|top picks?|buy (it |them )?now|guaranteed returns?"
    r"|deber[ií]as (comprar|vender|mantener)|recomendamos (comprar|vender|mantener)|nuestro precio objetivo"
    r"|momento de (comprar|vender)|compra ya|rentabilidad garantizada)\b", re.I)
WORD = re.compile(r"[\w'’\-]+")


class Invalid(ValueError):
    """A script that cannot be read, with what is wrong with it."""


@dataclass(frozen=True)
class Scene:
    name: str
    narration: str               # what is said, paragraphs apart by a blank line
    seconds: float | None = None  # its length, given by hand when nothing is said

    @property
    def words(self) -> int:
        return len(WORD.findall(self.narration))


@dataclass(frozen=True)
class Script:
    title: str
    description: str
    tags: list[str]
    tickers: list[str]
    sources: list[tuple[str, str]]  # (what the link says, its address)
    scenes: list[Scene]

    @property
    def words(self) -> int:
        return sum(s.words for s in self.scenes)


def _head(text: str, name: str) -> tuple[dict, str]:
    """The data on top of the file and the text under it."""
    text = text.replace("\r\n", "\n")
    if not text.startswith("---\n"):
        raise Invalid(f"{name}: the file must start with its data between two lines of ---")
    top, sep, body = text[4:].partition("\n---\n")
    if not sep:
        raise Invalid(f"{name}: the data on top is not closed with ---")
    data: dict = {}
    key = None
    for n, line in enumerate(top.split("\n"), 2):
        if not line.strip():
            continue
        if line.startswith("  - "):
            if key is None or not isinstance(data.get(key), list):
                raise Invalid(f"{name}:{n}: a list item with no list above it")
            data[key].append(line[4:].strip())
        elif ":" in line and not line.startswith(" "):
            key, _, value = line.partition(":")
            key = key.strip()
            data[key] = value.strip() if value.strip() else []
        else:
            raise Invalid(f"{name}:{n}: not 'key: value' and not a list item")
    return data, body


def _list(value) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()] if isinstance(value, str) else []


def _text(value) -> str:
    return value if isinstance(value, str) else ""


def _scenes(body: str, name: str) -> list[Scene]:
    scenes: list[Scene] = []
    current: str | None = None
    seconds: float | None = None
    lines: list[str] = []

    def close() -> None:
        if current is not None:
            paragraphs = [" ".join(p.split()) for p in "\n".join(lines).split("\n\n")]
            scenes.append(Scene(current, "\n\n".join(p for p in paragraphs if p), seconds))

    for line in body.split("\n"):
        heading = HEADING.match(line)
        if heading:
            close()
            current, seconds, lines = heading.group(1), None, []
        elif current is None:
            if line.strip():
                raise Invalid(f"{name}: text before the first scene ('## 01-name')")
        elif line.startswith("seconds:") and not any(l.strip() for l in lines):
            try:
                seconds = float(line.partition(":")[2])
            except ValueError:
                raise Invalid(f"{name}: scene {current}: 'seconds:' is not a number") from None
        else:
            lines.append(line.rstrip())
    close()
    return scenes


def parse(text: str, name: str = "script.md") -> Script:
    data, body = _head(text, name)
    sources = []
    for item in data.get("sources") if isinstance(data.get("sources"), list) else []:
        label, _, address = item.rpartition("|")
        sources.append((label.strip(), address.strip()))
    return Script(
        title=_text(data.get("title")),
        description=_text(data.get("description")),
        tags=_list(data.get("tags")),
        tickers=[t.upper() for t in _list(data.get("tickers"))],
        sources=sources,
        scenes=_scenes(body, name),
    )


def load(path: Path) -> Script:
    return parse(path.read_text(encoding="utf-8"), path.name)


def problems(script: Script) -> list[str]:
    """What stops this script from being published. Empty when nothing does."""
    found: list[str] = []
    if not script.title:
        found.append("no title")
    elif len(script.title) > TITLE_MAX:
        found.append(f"the title has {len(script.title)} characters; YouTube takes {TITLE_MAX}")
    if not script.description:
        found.append("no description")
    for field, value in (("title", script.title), ("description", script.description)):
        if "<" in value or ">" in value:
            found.append(f"the {field} has < or >, which YouTube refuses")
    if len(",".join(script.tags)) > TAGS_MAX:
        found.append(f"the tags add up to more than {TAGS_MAX} characters")
    if len(script.sources) < 2:
        found.append("fewer than two sources: every figure, date and quotation needs one")
    for label, address in script.sources:
        if not label or not re.match(r"https?://\S+$", address):
            found.append(f"a source is not 'what the link says | https://...': {label or address!r}")

    if not script.scenes:
        found.append("no scenes")
    names = [s.name for s in script.scenes]
    for scene in script.scenes:
        if not SCENE.fullmatch(scene.name):
            found.append(f"scene {scene.name!r}: a name is two digits, a dash and a few words, like 01-hook")
        if names.count(scene.name) > 1 and names.index(scene.name) == script.scenes.index(scene):
            found.append(f"scene {scene.name}: the name is used more than once")
        if not scene.narration and not scene.seconds:
            found.append(f"scene {scene.name}: nothing is said and it has no 'seconds:'")
        if scene.seconds is not None and scene.seconds <= 0:
            found.append(f"scene {scene.name}: 'seconds:' must be more than zero")

    spoken = "\n".join([script.title, script.description, *(s.narration for s in script.scenes)])
    for match in ADVICE.finditer(spoken):
        found.append(f"reads as advice: {match.group(0)!r}")
    if "TODO" in spoken or any("TODO" in part for source in script.sources for part in source):
        found.append("the script still has TODO in it")
    return found
