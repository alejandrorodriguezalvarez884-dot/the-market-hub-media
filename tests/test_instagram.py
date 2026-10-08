import os
from dataclasses import replace

import pytest

from marketmedia import instagram
from marketmedia import script as scripts


class Api:
    """Instagram's API as a reel uses it: it writes down what it is asked, reads the film in a
    few asks, and can refuse a step."""

    def __init__(self, reads=("IN_PROGRESS", "FINISHED"), fails=()):
        self.asked, self.reads, self.fails = [], list(reads), set(fails)

    def __call__(self, method, path, key, **params):
        self.asked.append((method, path, params))
        name = path.rsplit("/", 1)[-1]
        if name in self.fails:
            raise RuntimeError(f"Instagram answered 400: no {name}")
        if name == "me":
            return {"user_id": "178", "username": "the_market_hub_app", "account_type": "MEDIA_CREATOR"}
        if name == "refresh_access_token":
            return {"access_token": "renewed", "expires_in": 5184000}
        if name == "media":
            return {"id": "container"}
        if name == "container":
            return {"status_code": self.reads.pop(0), "status": "the film has no sound"}
        if name == "media_publish":
            return {"id": "reel"}
        return {"permalink": "https://www.instagram.com/reel/Cabc123/", "shortcode": "Cabc123"}


class Bucket:
    """Where a film waits for Instagram to fetch it."""

    def __init__(self):
        self.parked, self.removed = [], 0

    def __call__(self, film, bucket):
        self.parked.append((film.name, bucket))
        return f"https://storage.example/{bucket}/x.mp4", self._remove

    def _remove(self):
        self.removed += 1


@pytest.fixture
def short(video):
    video.build.mkdir()
    video.film(short=True).write_bytes(b"x")
    return video


def _publish(short, api, bucket, **more):
    return instagram.publish(short.film(short=True), "words", "a-bucket", key="k", call=api, park=bucket,
                             wait=lambda seconds: None, **more)


def test_the_caption_carries_the_title_of_the_short_the_sources_and_the_notice(video, channel):
    text = instagram.caption(scripts.load(video.script), channel, "https://youtu.be/abc123XYZ_-")
    assert text.startswith("Profit flat, earnings per share up\n\nA company that buys its own shares")
    assert "The full video is on YouTube: https://youtu.be/abc123XYZ_-" in text
    assert "- The annual report: https://www.sec.gov/report" in text
    assert "not investment advice" in text
    assert text.endswith("#buybacks #earningspershare")


def test_a_caption_with_no_video_yet_names_the_channel(video, channel):
    assert "The full video is on YouTube: The Market Hub." in instagram.caption(scripts.load(video.script), channel)


def test_sources_that_do_not_fit_are_given_by_their_names(video, channel):
    script = scripts.load(video.script)
    long = replace(script, sources=[(f"Report {n}", "https://example.com/" + "a" * 200) for n in range(12)])
    text = instagram.caption(long, channel)
    assert len(text) <= instagram.CAPTION_MAX
    assert "Sources: Report 0; Report 1;" in text and "https://example.com/" not in text
    with pytest.raises(ValueError, match="shorten the description"):
        instagram.caption(replace(long, description="word " * 500), channel)


def test_a_reel_is_published_once_instagram_has_read_the_film(short):
    api, bucket = Api(), Bucket()
    record = _publish(short, api, bucket, cover_ms=4200)
    assert [path for _, path, _ in api.asked] == ["me", "178/media", "container", "container", "178/media_publish", "reel"]
    sent = api.asked[1][2]
    assert sent == {"media_type": "REELS", "video_url": "https://storage.example/a-bucket/x.mp4", "caption": "words",
                    "share_to_feed": True, "thumb_offset": 4200}
    assert api.asked[4][2] == {"creation_id": "container"}
    assert record["url"] == "https://www.instagram.com/reel/Cabc123/" and record["code"] == "Cabc123" and record["id"] == "reel"
    assert bucket.parked == [("short.mp4", "a-bucket")] and bucket.removed == 1


def test_a_film_instagram_cannot_read_is_not_published_and_leaves_the_bucket(short):
    api, bucket = Api(reads=["ERROR"]), Bucket()
    with pytest.raises(RuntimeError, match="the film has no sound"):
        _publish(short, api, bucket)
    assert "178/media_publish" not in [path for _, path, _ in api.asked] and bucket.removed == 1


def test_a_film_instagram_never_finishes_reading_is_not_published(short):
    api, bucket = Api(reads=["IN_PROGRESS"] * instagram.TRIES), Bucket()
    with pytest.raises(RuntimeError, match="nothing was published"):
        _publish(short, api, bucket)
    assert bucket.removed == 1


def test_a_reel_whose_address_cannot_be_read_is_still_remembered(short):
    record = _publish(short, Api(fails={"reel"}), Bucket())
    assert record["id"] == "reel" and record["url"] == "" and "no reel" in record["url_error"]


def test_nothing_is_sent_without_a_bucket(short):
    api = Api()
    with pytest.raises(ValueError, match="bucket"):
        instagram.publish(short.film(short=True), "words", "", key="k", call=api, park=Bucket())
    assert api.asked == []


def test_an_old_token_is_renewed_and_a_fresh_one_is_left_alone(tmp_path, monkeypatch):
    file = tmp_path / "instagram-token.txt"
    monkeypatch.setenv("INSTAGRAM_TOKEN", str(file))
    with pytest.raises(FileNotFoundError):
        instagram.token(Api())
    file.write_text("first\n", encoding="utf-8")
    api = Api()
    assert instagram.token(api) == "first" and api.asked == []
    old = file.stat().st_mtime - 8 * 86400
    os.utime(file, (old, old))
    assert instagram.token(api) == "renewed" and file.read_text(encoding="utf-8") == "renewed\n"
    assert api.asked[0][2]["grant_type"] == "ig_refresh_token"


def test_a_renewal_that_fails_keeps_the_token(tmp_path, monkeypatch):
    file = tmp_path / "instagram-token.txt"
    monkeypatch.setenv("INSTAGRAM_TOKEN", str(file))
    file.write_text("first", encoding="utf-8")
    old = file.stat().st_mtime - 30 * 86400
    os.utime(file, (old, old))
    assert instagram.token(Api(fails={"refresh_access_token"})) == "first"
    assert file.read_text(encoding="utf-8") == "first"


def test_the_command_publishes_the_short_once_and_keeps_what_youtube_has(short, channel, monkeypatch, capsys):
    from argparse import Namespace

    from marketmedia import __main__ as cli
    from marketmedia import youtube
    youtube.remember(short.published, {"url": "https://youtu.be/abc123XYZ_-", "by": "hand"})
    monkeypatch.setattr(cli.videos, "find", lambda name: short)
    monkeypatch.setattr(cli, "_unfit", lambda video, channel: False)
    sent = []

    def publish(film, words, bucket, cover_ms=0):
        sent.append((film.name, words, bucket, cover_ms))
        return {"id": "reel", "url": "https://www.instagram.com/reel/Cabc123/", "code": "Cabc123"}

    monkeypatch.setattr(cli.instagram, "publish", publish)
    args = Namespace(video="buyback", check=False, again=False)

    assert cli._instagram(args, replace(channel, instagram_bucket="a-bucket")) == 0
    film, words, bucket, cover_ms = sent[0]
    assert film == "short.mp4" and bucket == "a-bucket" and cover_ms > 0
    assert "https://youtu.be/abc123XYZ_-" in words
    record = short.record()
    assert record["url"] == "https://youtu.be/abc123XYZ_-" and record["instagram_url"].endswith("/reel/Cabc123/")

    assert cli._instagram(args, channel) == 1                   # it is up: nothing is sent again
    assert "already on Instagram" in capsys.readouterr().out and len(sent) == 1
