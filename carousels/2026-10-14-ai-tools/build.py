"""Writes the slides of the six carousels that present Market Hub's tools on Instagram: one that
presents them all, inside My Hub, and one for each tool. Each carousel is a folder of pages drawn
for 1080x1350 (1.html, 2.html, ...) beside its caption.txt, which `make carousel` photographs and
publishes.

    uv run python carousels/2026-10-14-ai-tools/build.py        (from the-market-hub-media)

The pictures are cut from the photographs capture.py takes (build/shots/); a crop is
"x,y,w,h" in the CSS pixels of the 1440-wide page. The words on the slides are few on purpose: the
detail is in each caption.
"""

from __future__ import annotations

from html import escape
from pathlib import Path

HERE = Path(__file__).resolve().parent

MARK = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
        '<path d="M4 2v16M4 10h8"/><circle cx="14.5" cy="10" r="2.75" fill="currentColor" stroke="none"/></svg>')

# name, colour, one line
TOOLS = [
    ("Fundamentals Lab", "#4f8cff", "Claude reads any US company's numbers"),
    ("Earnings Radar", "#f5b03a", "AI reads every results release"),
    ("Peer Map", "#35c98f", "1,500 companies, mapped by what they do"),
    ("PlayGround", "#a78bfa", "Ask in plain English. Get live charts."),
    ("Options Lab", "#ff6b8a", "Every call and put, read in full"),
]


def shot(src: str, crop: str, cls: str = "", box: str = "", most: float = 1.6) -> str:
    extra = f' data-box="{box}"' if box else ""
    return f'<div class="shot {cls}" data-src="../build/shots/{src}.png" data-crop="{crop}" data-most="{most}"{extra}></div>'


def page(accent: tuple[str, str], pill: str, number: int, total: int, body: str, foot: str) -> str:
    return f"""<!doctype html>
<meta charset="utf-8">
<link rel="stylesheet" href="../theme.css">
<style>:root {{ --accent: {accent[0]}; --accent-2: {accent[1]}; }}</style>
<body>
  <div class="glow"></div><div class="grid"></div>
  <header>
    <div class="brand">{MARK}<span>Market Hub</span></div>
    <div class="pill"><i></i>{escape(pill)} &middot; {number}/{total}</div>
  </header>
  {body}
  {foot}
  <script src="../theme.js"></script>
</body>
"""


def words(kicker: str, title: str, sub: str = "", big: bool = False) -> str:
    out = f'<p class="kicker">{escape(kicker)}</p>\n  <h1{" class=big" if big else ""}>{title}</h1>'
    if sub:
        out += f'\n  <p class="sub">{escape(sub)}</p>'
    return out


SWIPE = '<footer><span><b>themarkethub.app</b></span><span class="swipe">Swipe <span>&rarr;</span></span></footer>'
SITE = '<footer><span><b>themarkethub.app</b></span><span>Inside My Hub</span></footer>'


def tool_list(highlight: str | None = None) -> str:
    rows = []
    for name, colour, line in TOOLS:
        dim = ";opacity:0.4" if highlight and name != highlight else ""
        rows.append(f'<div class="tool" style="--c:{colour}{dim}"><i></i><b>{escape(name)}</b><span>{escape(line)}</span></div>')
    return '<div class="tools">' + "".join(rows) + "</div>"


def closing(accent: tuple[str, str], pill: str, n: int, title: str, highlight: str | None) -> str:
    body = (words("Now live in My Hub", title)
            + tool_list(highlight).replace('class="tools"', 'class="tools compact"')
            + '<div class="cta" style="margin-top:36px"><span class="button">Open themarkethub.app &rarr;</span>'
              '<span class="small">Sign in, then My Hub &rsaquo; Tools. Describes, never advises.</span></div>')
    return page(accent, pill, n, n, body, "")


def tool_post(accent: tuple[str, str], pill: str, kicker: str, slides: list[tuple[str, str, str]], end_title: str) -> list[str]:
    """A tool's carousel: a cover, one slide for each thing it does, and the closing slide."""
    total = len(slides) + 1
    out = []
    for i, (title, sub, picture) in enumerate(slides, start=1):
        body = words(kicker, title, sub, big=i == 1) + f'\n  <div class="stage">{picture}</div>'
        out.append(page(accent, pill, i, total, body, SWIPE if i == 1 else SITE))
    out.append(closing(accent, pill, total, end_title, pill))
    return out


POSTS: dict[str, list[str]] = {}

# --- 1. The tools, all of them, in My Hub ---------------------------------------------------------
INTRO = ("#35c98f", "#a78bfa")
POSTS["01-ai-tools-in-my-hub"] = [
    page(INTRO, "New in My Hub", 1, 4,
         words("Introducing", "Market research, <em>supercharged by AI.</em>", big=True)
         + '\n  <div class="stage stack">'
         + shot("peers-map", "272,245,1139,720", "tilt", "10,0,620")
         + shot("options-strategy", "272,780,1136,438", "tilt", "345,150,590")
         + shot("fund-overview", "270,333,1138,540", "tilt", "40,300,560")
         + "</div>", SWIPE),
    page(INTRO, "New in My Hub", 2, 4,
         words("The lineup", "Five tools. <em>One login.</em>") + tool_list(), SITE),
    page(INTRO, "New in My Hub", 3, 4,
         words("All in one place", "Right inside <em>My Hub.</em>", "Your portfolio, your watchlist and every tool, a click apart.")
         + '\n  <div class="stage">' + shot("fund-overview", "0,0,1440,900", "tilt") + "</div>", SITE),
    closing(INTRO, "New in My Hub", 4, "Go try them. <em>Now.</em>", None),
]

# --- 2. Fundamentals Lab --------------------------------------------------------------------------
POSTS["02-fundamentals-lab"] = tool_post(("#4f8cff", "#35c98f"), "Fundamentals Lab", "Fundamentals Lab", [
    ("Any company. <em>Decoded.</em>", "Every US-listed stock, its numbers in one place.",
     shot("fund-overview", "270,100,1138,773", "tilt")),
    ("Claude reads <em>the numbers.</em>", "An AI reading of what the figures show.",
     shot("fund-overview", "270,333,560,540")),
    ("Then, now <em>and next.</em>", "Multiples through time and the analysts' consensus.",
     shot("fund-valuation", "272,680,1136,420")),
    ("Rivals, <em>side by side.</em>", "Up to five companies, row by row.",
     shot("fund-compare", "270,1020,970,410")),
], "Open it <em>on any stock.</em>")

# --- 3. Earnings Radar ----------------------------------------------------------------------------
POSTS["03-earnings-radar"] = tool_post(("#f5b03a", "#ff6b8a"), "Earnings Radar", "Earnings Radar", [
    ("Results, <em>read in seconds.</em>", "AI reads a company's results release the moment you ask.",
     shot("radar-home", "120,90,1200,330", "tilt")),
    ("Tone, guidance, <em>in one read.</em>", "Every release scored on the same questions.",
     shot("radar-nvda", "130,1235,660,325")),
    ("Every quarter <em>since 2021.</em>", "See how the story changed, release by release.",
     shot("radar-nvda", "130,494,1178,351")),
    ("The whole <em>market's mood.</em>", "2,238 releases from 99 large companies.",
     shot("radar-home", "130,880,590,95")),
], "Read the <em>next results.</em>")

# --- 4. Peer Map ----------------------------------------------------------------------------------
POSTS["04-peer-map"] = tool_post(("#35c98f", "#4f8cff"), "Peer Map", "Peer Map", [
    ("Who's <em>really</em> like who?", "AI read the annual reports of 1,500 companies and drew the map.",
     shot("peers-map", "272,245,1139,720", "tilt")),
    ("Neighbours by <em>what they do.</em>", "Not by the label they're filed under.",
     shot("peers-map", "274,470,520,330")),
    ("The closest matches. <em>Ranked.</em>", "",
     shot("peers-map", "1055,500,356,598", most=1.5)),
    ("Every dot. <em>Every move.</em>", "Coloured by the price: day, week, month, YTD, 1Y.",
     shot("peers-map", "1019,245,392,230")),
], "Find any company's <em>neighbours.</em>")

# --- 5. PlayGround --------------------------------------------------------------------------------
POSTS["05-playground"] = tool_post(("#a78bfa", "#4f8cff"), "PlayGround", "PlayGround", [
    ("Just ask. <em>Get the chart.</em>", "A market board you build by chatting with AI.",
     shot("playground", "270,0,1170,1000", "tilt")),
    ("Talk to it <em>like a person.</em>", "", shot("playground", "1062,189,378,320", most=2.2)),
    ("Compare <em>anything.</em>", "", shot("playground", "270,126,760,470")),
    ("Live charts. <em>Real data.</em>", "Candles, averages, tables. Arranged your way.",
     shot("playground", "270,598,760,790")),
], "Build <em>your board.</em>")

# --- 6. Options Lab -------------------------------------------------------------------------------
POSTS["06-options-lab"] = tool_post(("#ff6b8a", "#f5b03a"), "Options Lab", "Options Lab", [
    ("Options. <em>Finally readable.</em>", "Every call and put of a US stock, with the math done for you.",
     shot("options-chain", "270,792,560,325", "tilt")),
    ("The whole chain <em>at a glance.</em>", "IV, expected move, skew, open interest.",
     shot("options-chain", "270,549,560,207")),
    ("Build it. <em>See it.</em>", "Strategies of up to 8 legs, drawn as you build.",
     shot("options-strategy", "272,780,1136,438")),
    ("Every number <em>that matters.</em>", "Breakevens, max profit and loss, greeks.",
     shot("options-strategy", "272,1272,828,360")),
], "Read your <em>next option.</em>")


def main() -> None:
    for name, slides in POSTS.items():
        folder = HERE / name
        folder.mkdir(exist_ok=True)
        for old in folder.glob("*.html"):
            old.unlink()
        for i, html in enumerate(slides, start=1):
            (folder / f"{i}.html").write_text(html, encoding="utf-8", newline="\n")
        print(f"  {name}: {len(slides)} slides")


if __name__ == "__main__":
    main()
