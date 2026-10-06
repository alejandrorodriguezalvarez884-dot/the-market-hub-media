from pathlib import Path

import pytest

from marketmedia import channel as channels
from marketmedia import videos

REPO = Path(__file__).resolve().parents[1]

SCRIPT = """---
title: What a buyback does to earnings per share
description: A company that buys its own shares divides the same profit among fewer of them.
tags: buybacks, earnings per share
tickers: aapl
sources:
  - The annual report | https://www.sec.gov/report
  - The buyback announcement | https://example.com/release
---

## 01-hook

Profit did not grow. Earnings per share did. Here is how.

## 02-title
seconds: 3

## 03-point

Fewer shares, same profit. Each share gets more of it.
"""


@pytest.fixture
def channel():
    return channels.load(REPO / "channel.toml")


@pytest.fixture
def video(tmp_path):
    """A whole video in a folder of its own: a script, its drawings and a thumbnail."""
    path = tmp_path / "videos" / "2026-10-06-what-a-buyback-does"
    (path / "slides").mkdir(parents=True)
    (path / "script.md").write_text(SCRIPT, encoding="utf-8")
    for name in ("01-hook", "02-title", "03-point"):
        (path / "slides" / f"{name}.html").write_text("<!doctype html><h1>A slide</h1>", encoding="utf-8")
    (path / "thumbnail.html").write_text("<!doctype html><h1>Thumb</h1>", encoding="utf-8")
    return videos.Video(path)
