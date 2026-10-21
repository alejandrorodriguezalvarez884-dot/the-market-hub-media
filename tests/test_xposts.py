import json
from datetime import datetime, timezone

import pytest

from marketmedia import xposts

NOW = datetime(2026, 10, 14, 21, 5, tzinfo=timezone.utc)
SOURCES = "---\nsources:\n  - Market Hub, today's market | https://themarkethub.app/api/public/overview\n---\n"


def write(folder, name, text, head=SOURCES):
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{name}.md"
    path.write_text(head + text + "\n", encoding="utf-8")
    return xposts.load(path)


def test_a_post_is_its_text_and_its_sources(tmp_path):
    post = write(tmp_path, "2026-10-14-the-day", "The S&P 500 closed 0.8% higher.\n\nhttps://themarkethub.app/today/")
    assert post.text == "The S&P 500 closed 0.8% higher.\n\nhttps://themarkethub.app/today/"
    assert post.sources == ["Market Hub, today's market | https://themarkethub.app/api/public/overview"]
    assert post.url == "" and xposts.problems(post) == []


def test_a_link_counts_as_x_counts_it_and_a_long_post_is_stopped(tmp_path):
    assert xposts.length("See https://themarkethub.app/today/ and more") == len("See  and more") + 23
    assert xposts.length("ab中") == 4  # a CJK character counts twice
    post = write(tmp_path, "2026-10-14-long", "word " * 60)
    assert any("X takes 280" in p for p in xposts.problems(post))


@pytest.mark.parametrize("text, problem", [
    ("You should buy the dip.", "reads as advice"),
    ("Read it at https://example.com/story", "links outside Market Hub"),
    ("#stocks #markets #investing", "hashtags"),
    ("Markets up \U0001F680", "emoji"),
])
def test_what_stops_a_post(tmp_path, text, problem):
    post = write(tmp_path, "2026-10-14-bad", text)
    assert any(problem in p for p in xposts.problems(post))


def test_figures_need_their_sources_and_words_do_not(tmp_path):
    bare = write(tmp_path, "2026-10-14-bare", "Ten of eleven sectors rose: 0.8% on the day.", head="---\n---\n")
    assert xposts.problems(bare) == ["it has figures and no sources"]
    words = write(tmp_path, "2026-10-14-words", "A new episode: what debt costs.\n\nhttps://youtu.be/nApfz535ZbM", head="---\n---\n")
    assert xposts.problems(words) == []


def test_a_header_with_an_unknown_field_is_refused(tmp_path):
    (tmp_path / "2026-10-14-odd.md").write_text("---\ntitle: no\n---\nText\n", encoding="utf-8")
    with pytest.raises(xposts.Invalid):
        xposts.load(tmp_path / "2026-10-14-odd.md")


def test_where_a_post_went_is_written_into_it_and_read_back(tmp_path):
    post = write(tmp_path, "2026-10-14-the-day", "The S&P 500 closed 0.8% higher.")
    xposts.posted(post, "https://twitter.com/TheMarketHub/status/1845000000000000001?s=20", "themarkethub", now=lambda: NOW)
    again = xposts.load(post.path)
    assert again.url == "https://x.com/TheMarketHub/status/1845000000000000001"
    assert again.posted_utc == "2026-10-14T21:05:00+00:00" and again.id == "1845000000000000001"
    assert again.sources == post.sources and again.text == post.text


def test_a_post_of_another_account_or_no_post_is_refused(tmp_path):
    post = write(tmp_path, "2026-10-14-the-day", "Words.")
    with pytest.raises(xposts.Invalid, match="not of @themarkethub"):
        xposts.posted(post, "https://x.com/someone/status/1845000000000000001", "themarkethub")
    with pytest.raises(xposts.Invalid, match="not the address"):
        xposts.posted(post, "https://x.com/themarkethub", "themarkethub")
    assert xposts.load(post.path).url == ""


def test_the_portal_gets_the_latest_posts_on_x_newest_first(tmp_path):
    for n in range(14):
        post = write(tmp_path, f"2026-10-{n + 1:02d}-day", f"Day {n + 1}.")
        if n != 5:  # one is still a draft
            xposts.posted(post, f"https://x.com/themarkethub/status/18450000000000000{n:02d}", now=lambda n=n: NOW.replace(day=n + 1))
    front = xposts.front(xposts.every(tmp_path), "themarkethub", now=lambda: NOW)
    assert [p["text"] for p in front["posts"]][:3] == ["Day 14.", "Day 13.", "Day 12."]
    assert len(front["posts"]) == xposts.LATEST and "Day 6." not in [p["text"] for p in front["posts"]]
    assert front["handle"] == "themarkethub" and front["read_utc"] == "2026-10-14T21:05:00+00:00"
    assert set(front["posts"][0]) == {"id", "url", "text", "posted_utc"}

    portal = tmp_path / "portal"
    xposts.Folder(portal).publish(front)
    assert json.loads((portal / "front.json").read_text(encoding="utf-8")) == front


def test_a_post_is_found_by_a_part_of_its_name(tmp_path):
    write(tmp_path, "2026-10-14-the-day", "Words.")
    write(tmp_path, "2026-10-14-debt-episode", "Words.")
    assert xposts.find("debt", tmp_path).name == "2026-10-14-debt-episode"
    with pytest.raises(LookupError):
        xposts.find("2026-10-14", tmp_path)


AUTO = SOURCES.replace("---\n", "---\nauto: yes\n", 1)


def test_an_automatic_post_is_read_and_written_back_as_one(tmp_path):
    post = write(tmp_path, "2026-10-14-auto", "The S&P 500 closed 0.8% higher.", head=AUTO)
    assert post.auto and xposts.problems(post) == []
    xposts.save(post)
    assert xposts.load(post.path).auto


@pytest.mark.parametrize("text", [
    "The S&P 500 closed 0.8% higher.\n\nhttps://themarkethub.app/today/",
    "Every move on themarkethub.app",
    "More at x.com/the_market_hub_",
])
def test_an_automatic_post_carries_no_link(tmp_path, text):
    post = write(tmp_path, "2026-10-14-auto", text, head=AUTO)
    assert any("carries no link" in p for p in xposts.problems(post))


def test_figures_and_abbreviations_are_not_links(tmp_path):
    post = write(tmp_path, "2026-10-14-auto", "U.S. revenue $14.6B, up 3.5%; e.g. Inc. at 9 a.m.", head=AUTO)
    assert xposts.problems(post) == []


def test_a_post_is_sent_once_and_written_down(tmp_path):
    post = write(tmp_path, "2026-10-14-the-day", "The S&P 500 closed 0.8% higher.\n\nhttps://themarkethub.app/today/")
    sent = []
    xposts.send(post, "the_market_hub_", lambda text: sent.append(text) or "2112790350125469806", [], now=lambda: NOW)
    again = xposts.load(post.path)
    assert sent == [post.text]
    assert again.url == "https://x.com/the_market_hub_/status/2112790350125469806"
    with pytest.raises(xposts.Invalid, match="already on X"):
        xposts.send(again, "the_market_hub_", lambda text: sent.append(text) or "1", [again], now=lambda: NOW)
    assert len(sent) == 1


def test_a_post_with_a_problem_is_not_sent(tmp_path):
    post = write(tmp_path, "2026-10-14-auto", "See themarkethub.app", head=AUTO)
    with pytest.raises(xposts.Invalid, match="cannot go on X"):
        xposts.send(post, "the_market_hub_", lambda text: pytest.fail("sent"), [], now=lambda: NOW)


def test_the_channel_makes_at_most_five_posts_a_day_on_its_own(tmp_path):
    made = []
    for n in range(xposts.AUTO_PER_DAY):
        post = write(tmp_path, f"2026-10-14-auto-{n}", f"Post {n}.", head=AUTO)
        made.append(xposts.send(post, "the_market_hub_", lambda text, n=n: str(100000 + n), made, now=lambda: NOW))
    extra = write(tmp_path, "2026-10-14-auto-extra", "One more.", head=AUTO)
    with pytest.raises(xposts.Invalid, match="at most|its most"):
        xposts.send(extra, "the_market_hub_", lambda text: pytest.fail("sent"), made, now=lambda: NOW)
    asked = write(tmp_path, "2026-10-14-asked", "One the owner asked for.")
    assert xposts.send(asked, "the_market_hub_", lambda text: "200000", made, now=lambda: NOW).url
