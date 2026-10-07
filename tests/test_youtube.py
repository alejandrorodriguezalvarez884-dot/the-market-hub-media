import pytest

from marketmedia import script as scripts
from marketmedia import youtube


def test_the_description_carries_the_sources_and_the_notice(video, channel):
    text = youtube.description(scripts.load(video.script), channel)
    assert text.startswith("A company that buys its own shares")
    assert "Sources:\n- The annual report: https://www.sec.gov/report\n- The buyback announcement: https://example.com/release" in text
    assert "not investment advice" in text
    assert text.endswith(channel.site)


def test_an_upload_starts_private(video, channel):
    body = youtube.body(scripts.load(video.script), channel)
    assert body["status"]["privacyStatus"] == "private"
    assert body["status"]["selfDeclaredMadeForKids"] is False
    assert body["snippet"]["title"] == "What a buyback does to earnings per share"
    assert body["snippet"]["tags"] == ["buybacks", "earnings per share"]
    assert body["snippet"]["categoryId"] == "27"


def test_the_privacy_can_be_said_for_one_upload(video, channel):
    assert youtube.body(scripts.load(video.script), channel, "unlisted")["status"]["privacyStatus"] == "unlisted"


def test_the_kit_is_what_to_paste_for_the_video_and_its_short(video, channel):
    text = youtube.kit(scripts.load(video.script), channel)
    video_part, short_part = text.split("=== SHORT: short.mp4 ===")
    assert "Title:\nWhat a buyback does to earnings per share" in video_part
    assert "Tags:\nbuybacks, earnings per share" in video_part
    assert "Title:\nProfit flat, earnings per share up" in short_part
    assert "not investment advice" in video_part and "not investment advice" in short_part


def test_a_video_published_by_hand_is_remembered_by_its_address():
    record = youtube.by_hand("https://www.youtube.com/watch?v=abc123XYZ_-", "https://youtube.com/shorts/abc123XYZ_-")
    assert record["by"] == "hand" and record["short_url"].endswith("/shorts/abc123XYZ_-")
    with pytest.raises(ValueError):
        youtube.by_hand("https://example.com/watch?v=abc123XYZ_-")


class Api:
    """YouTube's API as an upload uses it: it writes down what it is asked, and can fail a step."""

    def __init__(self, fails=(), keeps=None):
        self.asked, self.fails, self.keeps = [], set(fails), keeps

    def _request(self, name, kwargs):
        api = self

        class Request:
            def next_chunk(self):
                return None, self.execute()

            def execute(self):
                if name in api.fails:
                    raise RuntimeError("quota")
                api.asked.append((name, kwargs))
                privacy = api.keeps or kwargs.get("body", {}).get("status", {}).get("privacyStatus")
                return {"id": f"id{len(api.asked):09d}", "status": {"privacyStatus": privacy}}

        return Request()

    def __getattr__(self, name):
        return lambda: type("Calls", (), {"insert": lambda _, **k: self._request(name, k), "set": lambda _, **k: self._request(name, k)})()


@pytest.fixture
def films(video):
    video.build.mkdir()
    for name in ("video.mp4", "short.mp4", "thumbnail.jpg", "captions.srt"):
        (video.build / name).write_bytes(b"x")
    return video


def test_the_video_goes_up_with_its_thumbnail_its_captions_and_its_playlist(films, channel):
    api = Api()
    record = youtube.upload(api, films.film(), scripts.load(films.script), channel, privacy="public", chapters="0:00 Start",
                            thumbnail=films.thumbnail, captions=films.captions(), playlist="PLabcdefghijklmnop")
    assert [name for name, _ in api.asked] == ["videos", "thumbnails", "captions", "playlistItems"]
    sent = api.asked[0][1]["body"]
    assert sent["status"]["privacyStatus"] == "public" and "Chapters:\n0:00 Start" in sent["snippet"]["description"]
    assert api.asked[2][1]["body"]["snippet"] == {"videoId": record["id"], "language": "en", "name": ""}
    assert api.asked[3][1]["body"]["snippet"]["playlistId"] == "PLabcdefghijklmnop"
    assert record["url"] == f"https://www.youtube.com/watch?v={record['id']}"
    assert record["thumbnail"] and record["captions"] and record["playlist"] and record["privacy"] == "public"


def test_the_short_goes_up_alone_with_its_own_title(films, channel):
    api = Api()
    record = youtube.upload(api, films.film(short=True), scripts.load(films.script), channel, short=True, chapters="0:00 Start")
    assert [name for name, _ in api.asked] == ["videos"]
    snippet = api.asked[0][1]["body"]["snippet"]
    assert snippet["title"] == "Profit flat, earnings per share up" and "Chapters" not in snippet["description"]
    assert record["url"] == f"https://www.youtube.com/shorts/{record['id']}"


def test_a_step_that_fails_does_not_lose_the_film(films, channel):
    record = youtube.upload(Api(fails={"captions"}), films.film(), scripts.load(films.script), channel,
                            thumbnail=films.thumbnail, captions=films.captions())
    assert record["url"] and record["thumbnail"] is True
    assert record["captions"] is False and record["captions_error"] == "RuntimeError: quota"


def test_the_record_says_what_youtube_kept_when_it_is_not_what_was_asked(films, channel):
    record = youtube.upload(Api(keeps="private"), films.film(), scripts.load(films.script), channel, privacy="public")
    assert record["asked"] == "public" and record["privacy"] == "private"


def test_a_playlist_is_known_by_its_address_or_its_id():
    assert youtube.playlist_id("https://www.youtube.com/playlist?list=PLabc-DEF_123456") == "PLabc-DEF_123456"
    assert youtube.playlist_id("https://www.youtube.com/watch?v=abc123XYZ_-&list=PLabc-DEF_123456&index=2") == "PLabc-DEF_123456"
    assert youtube.playlist_id("PLabc-DEF_123456") == "PLabc-DEF_123456"
    assert youtube.playlist_id("") == "" and youtube.playlist_id("https://www.youtube.com/@themarkethub") == ""


def test_the_command_uploads_both_films_and_takes_up_an_upload_that_stopped(films, channel, monkeypatch, capsys):
    from argparse import Namespace

    from marketmedia import __main__ as cli
    monkeypatch.setattr(cli.videos, "find", lambda name: films)
    monkeypatch.setattr(cli, "_unfit", lambda video, channel: False)
    monkeypatch.setattr(cli.render, "plan", lambda *a, **k: [])
    api = Api()
    monkeypatch.setattr(cli.youtube, "service", lambda: api)
    args = Namespace(video="buyback", privacy="public", again=False)

    assert cli._upload(args, channel) == 0
    record = films.record()
    assert record["by"] == "api" and "/watch?v=" in record["url"] and "/shorts/" in record["short_url"]
    assert [name for name, _ in api.asked].count("videos") == 2

    assert cli._upload(args, channel) == 1                      # both are up: nothing is sent again
    assert "already on YouTube" in capsys.readouterr().out

    del record["short_url"], record["short"]                    # the Short never made it
    youtube.remember(films.published, record)
    assert cli._upload(args, channel) == 0
    assert films.record()["url"] == record["url"] and "/shorts/" in films.record()["short_url"]
    assert [name for name, _ in api.asked].count("videos") == 3
