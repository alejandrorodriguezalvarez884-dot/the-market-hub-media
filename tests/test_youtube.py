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
