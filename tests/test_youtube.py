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
