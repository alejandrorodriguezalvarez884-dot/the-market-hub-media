import shutil
from dataclasses import replace

import pytest

from marketmedia import script as scripts
from marketmedia import check, videos

from .conftest import REPO


def test_a_whole_video_has_no_problems(video, channel):
    assert check.problems(video, channel) == []
    assert video.slug == "what-a-buyback-does"
    assert video.stage() == "script"


def test_a_scene_with_no_drawing_is_a_problem(video, channel):
    (video.path / "slides" / "03-point.html").unlink()
    assert check.problems(video, channel) == ["scene 03-point: no drawing in slides/"]


def test_a_drawing_with_no_scene_is_a_problem(video, channel):
    (video.path / "slides" / "09-extra.svg").write_text("<svg/>", encoding="utf-8")
    assert check.problems(video, channel) == ["slides/09-extra.svg belongs to no scene"]


@pytest.mark.parametrize("markup", [
    '<img src="https://example.com/logo.png">',
    '<link rel="stylesheet" href="//fonts.example.com/css">',
    "<style>body { background: url(https://example.com/a.png) }</style>",
    "<style>@import 'other.css';</style>",
])
def test_a_drawing_takes_nothing_from_the_network(video, channel, markup):
    (video.path / "slides" / "01-hook.html").write_text(f"<!doctype html>{markup}", encoding="utf-8")
    assert check.problems(video, channel) == ["slides/01-hook.html loads something from the network"]


def test_the_shared_style_is_not_the_network(video, channel):
    (video.path / "slides" / "01-hook.html").write_text(
        '<!doctype html><link rel="stylesheet" href="../../../theme/slide.css">', encoding="utf-8")
    assert check.problems(video, channel) == []


def test_no_thumbnail_is_a_problem(video, channel):
    (video.path / "thumbnail.html").unlink()
    assert check.problems(video, channel) == ["no thumbnail.html (or .svg)"]


def test_a_video_and_its_short_run_what_the_channel_says(video, channel):
    # The video of the tests runs 10 seconds and its Short 7: far from 4 to 6 minutes and 30 to 60 seconds.
    found = check.problems(video, replace(channel, minutes=(4, 6), short_seconds=(30, 60)))
    assert found == ["the video runs 0:10; the channel's videos run 4:00 to 6:00",
                     "the Short runs 0:07; a Short runs 0:30 to 1:00"]


def test_a_new_video_is_the_template_with_its_title(tmp_path, channel):
    shutil.copytree(REPO / "templates", tmp_path / "templates")
    video = videos.new("Why margins matter: a first look!", root=tmp_path, today="2026-10-06")
    assert video.name == "2026-10-06-why-margins-matter-a-first-look"
    assert "title: Why margins matter: a first look!" in video.script.read_text(encoding="utf-8")
    assert video.stage() == "brief"
    # Nothing of the template can be published as it comes, and nothing else is wrong with it.
    found = check.problems(video, channel)
    assert found and all("TODO" in p for p in found)
    with pytest.raises(ValueError):
        videos.new("Why margins matter: a first look!", root=tmp_path, today="2026-10-07")


def test_a_video_is_found_by_a_part_of_its_name(video):
    root = video.path.parents[1]
    assert videos.find("buyback", root).name == video.name
    with pytest.raises(LookupError):
        videos.find("dividends", root)


def test_a_trailer_is_short_and_needs_no_sources(video, channel):
    text = video.script.read_text(encoding="utf-8")
    top, body = text.split("sources:")[0], text.split("---", 2)[2]
    video.script.write_text(top + "kind: trailer\nseries: money-101\n---" + body, encoding="utf-8")
    assert check.problems(video, replace(channel, trailer_seconds=(5, 90))) == []
    assert check.problems(video, replace(channel, trailer_seconds=(30, 90))) == ["the trailer runs 0:10; a trailer runs 0:30 to 1:30"]


def test_a_series_must_be_one_of_the_channels(video, channel):
    text = video.script.read_text(encoding="utf-8")
    video.script.write_text(text.replace("tickers: aapl", "tickers: aapl\nseries: no-such-series\nepisode: 2"), encoding="utf-8")
    assert scripts.load(video.script).episode == 2
    assert any("no-such-series" in problem for problem in check.problems(video, channel))
