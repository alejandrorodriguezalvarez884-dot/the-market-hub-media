import pytest

from marketmedia import script as scripts

from .conftest import SCRIPT


def test_a_script_is_its_data_and_its_scenes():
    script = scripts.parse(SCRIPT)
    assert script.title == "What a buyback does to earnings per share"
    assert script.tags == ["buybacks", "earnings per share"]
    assert script.tickers == ["AAPL"]
    assert script.sources[0] == ("The annual report", "https://www.sec.gov/report")
    assert [s.name for s in script.scenes] == ["01-hook", "02-title", "03-point"]
    assert script.scenes[0].narration == "Profit did not grow. Earnings per share did. Here is how."
    assert script.scenes[1].narration == "" and script.scenes[1].seconds == 3
    assert script.words == 21
    assert scripts.problems(script) == []


def test_paragraphs_of_a_scene_stay_apart():
    script = scripts.parse(SCRIPT + "\n## 04-more\n\nOne line\nwrapped.\n\nAnother paragraph.\n")
    assert script.scenes[-1].narration == "One line wrapped.\n\nAnother paragraph."


def test_a_file_with_no_data_on_top_cannot_be_read():
    with pytest.raises(scripts.Invalid):
        scripts.parse("## 01-hook\n\nHello.\n")


def test_text_before_the_first_scene_cannot_be_read():
    with pytest.raises(scripts.Invalid):
        scripts.parse(SCRIPT.replace("## 01-hook", "Loose text.\n\n## 01-hook"))


@pytest.mark.parametrize("line", [
    "You should buy the shares before the next report.",
    "Our price target is higher than the market's.",
    "It is time to sell.",
    "Deberías comprar antes de los resultados.",
])
def test_advice_is_a_problem(line):
    script = scripts.parse(SCRIPT.replace("Here is how.", line))
    assert any("advice" in p for p in scripts.problems(script))


def test_describing_a_buyback_is_not_advice():
    script = scripts.parse(SCRIPT.replace("Here is how.", "The company chose to buy back shares and sell a division."))
    assert scripts.problems(script) == []


def test_what_youtube_would_refuse_is_a_problem():
    long_title = scripts.parse(SCRIPT.replace("title: What", "title: " + "What " * 30))
    assert any("title has" in p for p in scripts.problems(long_title))
    angle = scripts.parse(SCRIPT.replace("description: A company", "description: A <b>company</b>"))
    assert any("< or >" in p for p in scripts.problems(angle))


def test_one_source_is_not_enough():
    script = scripts.parse(SCRIPT.replace("  - The buyback announcement | https://example.com/release\n", ""))
    assert any("fewer than two sources" in p for p in scripts.problems(script))


def test_a_scene_needs_words_or_seconds_and_a_proper_name():
    script = scripts.parse(SCRIPT.replace("seconds: 3\n", "").replace("## 03-point", "## The point"))
    found = scripts.problems(script)
    assert any("02-title" in p and "nothing is said" in p for p in found)
    assert any("'The point'" in p for p in found)


def test_a_script_with_todo_is_not_finished():
    script = scripts.parse(SCRIPT.replace("Here is how.", "TODO the rest."))
    assert any("TODO" in p for p in scripts.problems(script))


def test_the_short_names_scenes_of_the_script():
    script = scripts.parse(SCRIPT)
    assert script.short == ["01-hook", "03-point"] and script.short_title == "Profit flat, earnings per share up"
    assert [s.name for s in script.cut(short=True)] == ["01-hook", "03-point"]
    missing = scripts.parse(SCRIPT.replace("short: 01-hook, 03-point", "short: 01-hook, 07-gone"))
    assert any("07-gone" in p for p in scripts.problems(missing))
    none = scripts.parse(SCRIPT.replace("short: 01-hook, 03-point\n", ""))
    assert any("no 'short:' line" in p for p in scripts.problems(none))
