---
name: chart-reel
description: Market Hub's chart-reading reels on Instagram, in Spanish, "Lee el gráfico" - a real chart of a real stock or index with its name and dates hidden, a question to the viewer ("¿qué crees que pasó después?"), five seconds of countdown to think, and then the answer explained - the pattern, what happened in that case and why a pattern is not a promise. Use when the user asks for one ("haz un reel de Lee el gráfico", "un reel de un patrón: doble techo", "otro reel de gráfico con un hombro-cabeza-hombro"). Find a real episode in Yahoo Finance's candles, write the script, draw the slides with theme/chart.js, speak it with the line's voice, make the film, check it, and publish only when asked; then its long YouTube video (skill long-video). See docs/reels.md.
---

# A chart-reading reel: "Lee el gráfico"

The fourth line of reels on the account `the_market_hub_app` (the user, 2026-11-03), beside the
daily market updates, the reflective ones and the didactic ones (`docs/reels.md`). In the user's
words: *"vídeos con un patrón, preguntes a la persona que ve el reel qué haría y luego des la
solución explicando, tras haber dejado un poco de tiempo para pensar"*. **On demand only**: the
user names the pattern (or leaves it to you) and asks; nothing is scheduled. The first one, the
example to copy, is `reels/2026-11-03-grafico-doble-suelo/` (a double bottom of Tesla, 2025).

Everything in `CLAUDE.md` holds. Above all, for this line:

- **Read the chart, never trade it.** The question is about reading: "¿qué ves aquí?", "¿qué crees
  que pasó después?", "¿sigue cayendo o se da la vuelta?". **Never "¿comprarías o venderías?"**,
  "¿entras?", "¿qué harías con tu dinero?". The reference the user saved (`velasyvolumen`, "¿Compras
  o vendes? Tienes 5 segundos", a hammer candle, 75 s) asks in trading terms and ends with "se
  confirma si…" as a signal: this line takes its rhythm, not its tone (explained to the user and
  agreed, 2026-11-03).
- **What happened, in that case, and that it does not always happen.** The answer says what the
  price did after, with its dates and figures, and always says that a pattern is not a promise:
  where it would have failed, and anything that went against it. No signals, no "se confirma
  cuando… entonces…", no targets (not even the textbook "measured move"), no success rates
  unless a named source gives them, nothing about today's price of that stock.
- **Real candles only.** Every candle on screen is a real day of a real stock or index, read from
  Yahoo Finance into the reel's `data/` (`make candles`). No invented or "illustrative" charts. What
  is drawn on top (lines, rings, notes) only points at real candles.
- **Alternate.** Over the line, show cases where the pattern worked **and cases where it failed**
  (a false breakout, a double bottom that broke down). Do not pick only the textbook winners: say
  in the report which kind this one is, and look at the earlier ones
  (`ls reels | grep grafico`, their `data/episode.js`) before choosing.

## The format (approved by the user, 2026-11-03)

Upright, **50 to 80 seconds** (published at 19:30, one asked reel a day: `daily-reel`, step 6), the light look of the on-demand reels with a plain paper
background (`<body class="light chart-reel" data-bg="plain">`), the brand line `The Market Hub ·
Lee el gráfico`, the voice of the line: **Rafalupi** (`voice: grafico`, `[reel.voices.grafico]` in
`channel.toml`; the user asked for "una voz que enganche mucho y que sea didáctica… una nueva" and
picked it by ear from five samples), on ElevenLabs' `eleven_v4`, like every reel (the user,
2026-11-03; the first reel was made on `eleven_multilingual_v2`). **How it speaks** (the user, 2026-11-03, after the first cut):
fast inside a sentence, with a breath between two ("que hable rápido en la misma frase pero que dé
un poco más de pausa entre frases"), so each scene is said **in one go**, with its own
intonation, and the code makes each pause at a sentence's end at least `sentence_pause` seconds
long (0.55, in `[reel.voices.grafico]`; `voice.paused`). Where each sentence ends comes from
ElevenLabs itself: the voice is asked for with its times for each character (`voice.eleven_timed`,
the "with-timestamps" call, same price), so the pause goes exactly between the last letter of one
sentence and the first of the next, at the quietest moment there. Commas and ellipses stay as
the voice said them. The voice as it came and its times are kept in `voice/raw/` (`.wav` and
`.json`), so another length of pause costs nothing: change `sentence_pause`, delete the scenes'
files in `voice/` (not `voice/raw/`) and run `make reel` again; it says "nothing paid".
**Do not place the pause by guessing** where a sentence ends from the words' lengths or by
matching the voice's silences: this voice barely stops between sentences, the guess drifted by
over a second in a long scene, and the pause landed twice inside a word ("f…ue", the owner,
2026-11-03). **Tried and dropped** (2026-11-03): each sentence said on its own and joined
with a set silence (`sentence_gap`, still used by the reflective voice): first it cut each
sentence while it still rang ("cortes muy bruscos"), and with fades the pauses still sounded odd
("pausas muy raras entre frases"), as each sentence was said as if it were the last. Listen to
the pauses of every new reel. And **the hook is slower** while it puts the question ("al principio quiero que vaya más
despacio exponiendo la pregunta"): `speed: 0.85` under `## 01-hook`. The scenes, in this order:

| Scene | About | What it does |
|---|---|---|
| `01-hook` | 8–10 s | The chart draws itself as the voice tells its shape ("Cae… rebota… y vuelve a caer"), **name and dates hidden** (`.secret`), and stops on the last candle before the answer. Ends with "¿Qué crees que pasó después? Tienes cinco segundos." It is also the cover: nothing in it gives the answer away. |
| `02-countdown` | 5 s | `seconds: 5` and `sound: tick`, nothing said: the countdown (`.countdown`) over the chart, a clock ticking once a second (made by ffmpeg, `render.TICK`), and two readings as stickers ("¿Sigue cayendo?" / "¿Se da la vuelta?"): questions, not verdicts. |
| `03-name` | 7–9 s | "¿Lo tienes?" and the pattern's name, marked on the chart (rings, the shape traced). |
| `04-rules` | 10–14 s | What makes it, as ticks (`.checks`), each shown on the chart as it is said: from the definition in the source (below), with this episode's figures. |
| `05-line` | 6–8 s | The key level or condition, and where the chart stood at the question. |
| `06-reveal` | 8–12 s | The candles that came after, drawn in; what happened, with dates and the size of the move. |
| `07-who` | 3–5 s | The name and the dates come in (`.reveal` with the logo from `theme/logos/`), and the prices and months on the chart (`axis`). |
| `08-caveat` | 8–12 s | "Un patrón no es una promesa": where it would have failed, and anything that went against it after. |
| `09-question` | 3–5 s | "¿Qué habías respondido tú? Te leo en comentarios." |

About 180 to 220 words in all. Spanish from Spain, short spoken sentences, an ellipsis where the
voice should hold; numbers as they are said, the exact figure on screen.

## 1. The pattern and the episode

**The pattern**: the user's, or one not done yet. The catalogue, each with the page that defines
it (read it now; its rules are what the reel calls "lo que se mira", and it is a source):

| Pattern | Definition (source) |
|---|---|
| Doble suelo / doble techo | StockCharts ChartSchool, "Double Bottom Reversal" / "Double Top Reversal" |
| Hombro-cabeza-hombro (y el invertido) | ChartSchool, "Head and Shoulders Top" / "Head and Shoulders Bottom" |
| Martillo, estrella fugaz, envolventes | ChartSchool, "Candlestick Bullish Reversal Patterns" / "…Bearish…" |
| Bandera, banderín | ChartSchool, "Flag, Pennant" |
| Triángulos | ChartSchool, "Ascending Triangle", "Descending Triangle", "Symmetrical Triangle" |
| Soporte y resistencia, ruptura y falsa ruptura | ChartSchool, "Support and Resistance" |
| Divergencias del RSI | ChartSchool, "Relative Strength Index (RSI)" |
| Cruce de medias (dorado / de la muerte) | ChartSchool, "Moving Averages - Simple and Exponential" |
| Huecos (gaps) | ChartSchool, "Gaps and Gap Analysis" |

(ChartSchool: https://chartschool.stockcharts.com/table-of-contents/ ; check each address before
putting it in the script.)

**The episode**: a real one, on daily candles of a large, well-known US stock or index (the S&P
500 and Nasdaq 100 components, `^GSPC`, `^NDX`, `^DJI`), from the last few years, clear enough to
see on a phone. Find it from the data, not from memory: in the scratchpad, read a few years of
daily candles for a few dozen names (`https://query1.finance.yahoo.com/v8/finance/chart/<SYMBOL>?range=6y&interval=1d`)
and scan them with the source's rules written as code (for the double bottom: two swing lows
within 3 %, 15 to 70 sessions apart, a peak at least 10 % above them, a fall of 20 % or more
before, and whether the price later closed above the peak). Draw the best candidates small, side
by side, and look at them; pick one that reads at a glance. Keep the scratch scan out of the
repo.

Then:

```bash
make reelnew MOMENT=grafico-<pattern-in-a-few-words>          # reels/<today>-grafico-<…>/
make candles REEL=<folder> SYMBOL=TSLA FROM=2024-12-02 TO=2025-07-15
```

`make candles` keeps Yahoo's answer (`data/candles.json`) and the candles the slides read
(`data/candles.js`, `window.CANDLES`). Read from a couple of months before what the chart shows
to a month after (the fall before, the context for the figures). Prices are adjusted for splits,
not dividends: say "precio ajustado por splits" if a split falls in the window.

Work out every figure from `data/candles.js`, in code, and write down in `data/episode.js` the
days and prices the slides use (`window.EPISODE`: the chart's first and last day, the last candle
before the question, the pattern's points, the key level) and a `chartOf()` with the options all
scenes share. Copy the one of the first reel.

**Where the chart stops for the question** decides whether the question is fair: on a day when the
pattern can be seen but its outcome cannot (for a double bottom, after the second bottom and
before the close above the peak). Never stop on the day that already answers it.

## 2. The script

`script.md` with `kind: reel`, `voice: grafico`, `tickers:`, and **at least two sources**: Yahoo
Finance (the candles, with the figures used and the day they were read) and the page that defines
the pattern. Then the scenes as in the table above: `01-hook` with `speed: 0.85` under its heading (slower while
it puts the question; every other scene at the voice's own speed), and `02-countdown` with only:

```text
## 02-countdown
seconds: 5
sound: tick
```

`make reelcheck` refuses a reel with fewer than two sources, a `sound:` that is not `tick`, or a
`sound:` on a scene where something is said.

## 3. The slides: theme/chart.js

Each scene is `slides/<scene>.html` with `theme/reel.css` and `theme/chart.css`, and these
scripts at the end, in this order (the test checks it):

```html
<script src="../data/candles.js"></script>
<script src="../data/episode.js"></script>
<script src="../../../theme/reel.js"></script>
<script src="../../../theme/chart.js"></script>
<script>
reelChart("canvas.chart", chartOf({
  show: [{ to: EPISODE.ask }, { to: "2025-05-29", say: "siguiente", for: 4.5 }],
  axis: { say: "tesla" },
  marks: [{ type: "level", price: EPISODE.line, at: 0, label: "Techo" }],
}));
</script>
```

The comments at the top of `theme/chart.js` say every option. In short:

- `show`: steps of candles drawn, each `to` a day, from a cue (`say` a word of the narration, or
  `at` seconds) over `for` seconds; the first step without a cue is what shows from the start.
- `axis`: when prices and months come in. **Only from the reveal of the name** (`07-who` on);
  before it the chart has no prices and no dates, and `.secret` says so.
- `marks`: `level` (a horizontal line with a label), `ring` (round a candle's low or high), `note`
  (a tag at a day and price), `zone` (a band of days), `path` (a shape traced through points),
  `move` (an arrow with the size of a move), `hide` (fades others out by their `id`). Colours:
  `amber` (the default), `up`, `down`, `ink`, `sky`; `up`/`down` only for what went up or down.
- `.countdown` (`data-say="0" data-from="5"`) counts down over the chart; `.choices` holds the two
  readings; `.checks` the rules; `.reveal` the name with its logo; `.source` under the chart says
  where the candles come from ("Velas diarias reales · Yahoo Finance"; with the name from `07-who`).
- Keep every slide on the same `from`/`to` (`chartOf`): the candles must not move between scenes.

Everything between 250 and 1450 px from the top and clear of the right edge, as in every reel.

## 4. Caption and thread

`caption.txt` as in the other reels (`daily-reel`, step 5): the title in capitals, a line that
sums up, one line per point with its figure and date (`▲`, `▼`, `·`), "Un patrón no es una
promesa…", the closing question, `Fuentes:`, the notice of `channel.toml`, `themarkethub.app`,
three to six hashtags (`#analisistecnico` and the pattern's). `x.txt`: two or three posts, the
first is the question (the video answers it), no link, no domain.

## 5. Make it and look at it

```bash
make reelcheck REEL=<folder>
make reel REEL=<folder>        # about 1.100 characters of ElevenLabs, ~8 min to draw
```

Look at **every** `build/short-frames/<scene>.png`, and at a few frames of `build/frames/<scene>/`
in `01-hook` (the chart drawing itself), `02-countdown` (5, 3, 1) and `06-reveal` (the candles
coming in): nothing cut, nothing over a candle that matters, labels readable, no price or date
before `07-who`. Then read the script and the caption once more as a viewer would: does anything
read as a signal, a target or advice? Fix and run `make reel` again until it is right.

## 6. Publish, only when asked

Like the other on-demand reels: **only when the user's request says so** ("súbelo"), and then
`make reelpost REEL=<folder>`. Without it, leave it made and show it (the path of
`build/reel.mp4`). The cover is `01-hook` as its voice ends: the chart at the question, without
the answer. Tell the user, in the report, to share it to stories from the app ("Añadir a tu
historia") and keep it in the highlight **"Lee el gráfico"** (proposed; the API cannot do either).
Check the cover once it is up (see `daily-reel`, the end).

```bash
git add reels/<folder>
git commit -m "Chart reel: <pattern>, <symbol> <dates>"
git push
```

`build/` and `voice/` stay out of git.

## 7. Its long video on YouTube

Once this reel is made and committed, ask the user in one short line whether to make its long
video on YouTube, 10 to 12 minutes in Spanish (the user, 2026-11-09: "Quiero que me preguntes para generar el video de youtube después del reel"). Only on a yes, the
skill `long-video` (`make longnew REEL=<folder>`): the pattern at length, this case and two or
three more real ones, one where it failed. Uploading it is a second yes.

## Never

- "¿Comprarías o venderías?", or any question about what to do with money.
- A made-up or "illustrative" chart, or a figure that is not from the candles in `data/`.
- Prices, dates or the name on screen before `07-who` (the question would not be fair).
- A target, a "measured move", a success rate without a named source, or anything about where
  that stock goes next.
- Only the cases where the pattern worked.
