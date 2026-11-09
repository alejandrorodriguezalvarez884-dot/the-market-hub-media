---
name: daily-reel
description: Market Hub's reels on Instagram, in Spanish. The two daily ones - Wall Street's open ("open") and its close ("close") - made and published with nobody watching by two Claude cloud routines on weekdays (docs/reels.md); and the ones the user asks for on demand with a topic - a reflective reel ("haz un reel de reflexión sobre X") or a didactic one ("haz un reel didáctico sobre X"), each followed by its long YouTube video (skill long-video). Find the facts, write the script, draw the slides, speak it, make the film, check it and publish it when asked. See docs/reels.md.
---

# A daily reel

You are making one of the channel's two daily reels: **Wall Street's open or its close, told in
Spanish, as a reel on Instagram** (account `the_market_hub_app`). The user decided this on
2026-11-02: two reels every weekday, one at the open and one at the close, **made and published
without asking them**, in a format close to the reels of `@h.analistasoficial` but drawn here.
They replace the two daily carousels. Usually nobody is watching: a scheduled task started this
session, and the user reads your last message when they next look. So decide, do, and say what
you decided.

Everything in `CLAUDE.md` holds, above all: **describe and explain, never advise** (no buy, sell
or hold, no targets, no predictions of our own); **every figure comes from a source read in this
run**, with its time; **nothing made by others** on the slides (no photos, stock footage or faces: the
backgrounds are drawn by `theme/reel.js`), except **the logo of a company the reel names**
(the user, 2026-11-02), from `theme/logos/`. The reels have no presenter: a format of
its own, like the demo.

The argument is the moment: `open` or `close` (weekdays), `week` (Saturday evening: the week
that ended) or `ahead` (the night of Sunday to Monday, 01:00 in Spain: the futures, an hour after
they open, and the week to come). All four are the "market updates" line: dark look, Dani's voice,
60 to 100 seconds. Work from the root of `the-market-hub-media`.

## 1. Before anything

```bash
git status --short
git pull --ff-only
```

Other sessions work in this repo too: leave alone any file that is not yours.

- **Is there something to tell?** For `open` and `close`: read
  `https://themarkethub.app/api/public/overview`; if `intraday` is false at the open, or `as_of`
  is not today, or today is a NYSE holiday (https://www.nyse.com/markets/hours-calendars), make
  nothing and say so. For `week`: Wall Street traded at least one day this week. For `ahead`: the
  US index futures (ES=F, NQ=F, YM=F on Yahoo Finance) have traded since Sunday 18:00 New York;
  if they have not (a holiday), say so and make nothing.
- **Is it done already?** If `reels/<today>-<moment>/instagram.json` exists, it is up: stop.
  If the folder exists without it, a run before you stopped half way: take it up from where it is.
- **Times.** Spain (Madrid) and New York are six hours apart most of the year, five for a few
  weeks in March and in late October / early November, when the clocks change on different days.
  Work out the gap for today; never assume it.

```bash
make reelnew MOMENT=<open|close|week|ahead>
```

## 2. Find what happened

Read now, and only from sources; keep what you read in `data/` (the overview as JSON, at least):

```bash
curl -s https://themarkethub.app/api/public/overview -o reels/<folder>/data/overview.json
```

- The portal's figures: indices, sectors, commodities, rates, currencies, crypto and movers, with
  `as_of` (UTC; say the time in Spain on screen).
- The portal's news: `https://themarkethub.app/api/public/news` (GET only; never ask it to refresh).
- The web, with WebSearch (and a web-fetch agent for the pages): the day's live market coverage,
  the release or SEC filing of each company named, the agency of each economic figure.

**The open** (started at 15:45 in Spain, a quarter of an hour after the bell; the user's time): how the three indices are doing and against
what (Friday's or yesterday's close); what drives the day (one thing, explained: a figure, a
deal, a war, a central bank); one or two large movers and why; what comes later today or tomorrow
(results after the close, data, a vote), with the time in Spain and in New York.

**The close** (started a few minutes after 22:00 in Spain, the user's time): the closing figures
must be in. If the overview still says `intraday: true`, or its `as_of` is before the bell, wait
five minutes and read it again, for up to twenty minutes; then say which time the figures are from. how the indices closed and how the day went from the
open; the best and worst sector; the large movers of the day and why; results released after the
close, if out; what comes tomorrow, with its time.

**The week** (`week`, Saturday 18:00 in Spain): how the three indices did over the five days
(Friday's close against the previous Friday's: Yahoo Finance's daily history, kept in `data/`),
and the day that moved them most; the story of the week, told as a story (what drove it and how it
turned); the best and worst sectors and the large movers of the week, and why; the week's
results and data that mattered; and a closing look at what is coming next week, in a line.

**The week ahead** (`ahead`, 01:00 Monday in Spain, an hour after the futures open): where the
S&P 500, Nasdaq 100 and Dow futures trade against Friday's close, and anything that moved over the
weekend (a war, an election, a central bank, oil); then the week to come, day by day: the
economic data and central-bank meetings with their times in Spain, and the results that matter,
with the day and whether before the open or after the close. Name dates and times; never guess
what they will show.

**In earnings season, results come first** (the user, 2026-11-02): in every moment, look up who
reported (before the open, after the close, overnight) and who reports next, read the release or
the 8-K, and tell how the shares took it. A large company's results is a scene of its own; in
`week` and `ahead` the results of the week are a scene, or two.

Pick **seven to ten things**, one per scene. A rumour, a price target or someone's call on a
stock is not a fact for the reel. Politics only when it moved the market, and the move is the
point.

## 3. The script

`script.md` (see `templates/reel/script.md` and the last reel in `reels/`): `kind: reel`, a
title, a one-line description, a few tags and **every source**, each "what it is | address".
Then the scenes, `## 01-hook` to `## 09-question`, each with what is said.

- **A story, not a list** (the user, 2026-11-02, after the first reel: "inspírate más en el reel").
  One thread for the day, told with tension and turns: a hook that raises a question ("Hoy...
  rebota. ¿Se acabó el miedo?"), going back to explain it ("Para entenderlo, hay que volver al
  viernes"), a turn ("Pero hoy el protagonista es otro"), and a question before each answer
  ("¿Por qué?", "¿Y quién gana?", "¿Su secreto?"). Short sentences, an ellipsis where the voice
  should hold: that is what gives the voice its intonation. See `reels/2026-11-02-open/script.md`.
- **Spanish from Spain**, spoken, short sentences: a reel runs **60 to 100 seconds** (the owner, 2026-11-03; the reference ran
  1:37 to 1:43), about 170 to 250 words. Numbers as they are said ("un seis por ciento", "ciento quince mil millones"),
  rounded as a person would say them; the exact figure goes on the slide.
- **01-hook**: the day in one line, with the moment and the day ("Wall Street abre la semana en
  verde"). The first two seconds decide whether anyone stays.
- **The last scene** asks the viewer a question about what is coming, to answer in the comments,
  and says when the next reel is (the close at 22:00, or tomorrow's open). Asking what they think
  is fine; saying what we think the market will do is not.
- A full stop after each thing said: the slides bring things in on the words (`data-say`).

## 4. The slides

**Two ways of drawing, by line** (the user, 2026-11-09: "usar remotion para los videos";
`docs/remotion.md`). **A reel the user asks for** (reflexión, didáctico, a special one) is drawn
with **Remotion**: one React component per scene, `slides/<scene>.tsx`, with the kit `@mh/kit`
(`Look`, `Column`, `Reveal say=...`, `Count`, `Mark`, `Logo`, the three marks); copy
`remotion/examples/2026-11-09-jensen-huang/` and `remotion/examples/kit/`. The rules below (what
goes on a slide, where, the logos, nothing from the network) are the same; only the code differs:
`say="palabra"` instead of `data-say`, and nothing moves with CSS. **The daily reels** (open,
close, week, ahead) are drawn as `[reel] daily_drawing` in `channel.toml` says: **`html`** (today):
HTML pages, as follows; **`remotion`** (once Remotion has passed its test run in the cloud
routines, `docs/remotion.md`, last section): `.tsx` scenes, copying the last daily reel drawn
that way or `remotion/examples/2026-11-09-open/` (the open of 2026-11-09, the same pieces as the
HTML ones: `Look bg=...`, `kicker`, `h1`, `card` with `line`s, `Count`, `Bar`, stickers, `Logo`,
`Profile` to close). `make reelcheck` refuses a daily reel drawn the other way. If `make reel`
fails in Remotion itself (Node, `npm ci`, its Chrome), do not publish half a reel: report what
it said, as with any other failure.

One page per scene, `slides/<scene>.html`, upright at 1080 × 1920, with `theme/reel.css` and
`theme/reel.js` (read the comments at the top of both). Start from the slides of the last reel:
the same pieces in another order is the format. Each scene:

- `<body data-bg="...">` and a `<canvas class="bg">`: tape, candles, grid, city or plain (the
  question). Change the background from one scene to the next.
- `<header class="brand">The Market Hub · Apertura</header>` (or `Cierre`, `La semana`,
  `Próxima semana`).
- A `.kicker` on top (what part of the story this is: "Lo que mueve hoy", "El viernes", "Esta
  noche"), a large `h1` with a word or two in `.y` (amber), and below it one or two `.card`s or
  `.sticker`s that come in when the voice says their word (`data-say`, classes `.in`, `.pop`).
- `.g` / `.r` and `▲` / `▼` only for what went up or down. Figures in the Spanish way
  (28,6 %; 115.000), `data-count` for one that counts up. Every figure on screen says when it is
  from if it is not the time of the reel.
- **A company's logo whenever the scene names it**: `<span class="logo"><img src="../../../theme/logos/meta.svg" alt="Meta"></span>`
  in the headline or beside its name in a card (`.logo.big` for a scene about one company). The
  logos are in `theme/logos/` (`SOURCES.md` says where each comes from); one that is missing is
  added there the same way, from Simple Icons, or the name goes as text.
- No emojis, photos or anything loaded from the network. The account's own picture
  (`channel/instagram-profile.jpg`) may close the reel.
- Keep everything between 250 and 1450 px from the top and clear of the right edge: Instagram
  puts its own buttons and the caption over the rest.

## 5. The caption

`caption.txt` (see `templates/reel/caption.txt`): the title in capitals; a sentence that sums up;
one line per thing, starting with `▲`, `▼` or `·`, with its figure and its time; what comes next;
the closing question; `Fuentes:` and who they are; the notice exactly as `channel.toml` says it
(`[reel] disclaimer`); `themarkethub.app`; three to six hashtags in Spanish. No emojis.

## 5b. The thread on X

**Every reel goes to X too**, as a short thread with the film on its first post (the user,
2026-11-02), **in Spanish**, like the film. Write `x.txt`: two to four posts, apart by a line with
only `---`:

```text
Wall Street rebota tras su peor día desde junio. Y el petróleo se hunde: el barril de Texas cae más de un 6 % y baja de 100 dólares.
---
Lo que mueve hoy: según la CNBC, el líder supremo de Irán ha dado margen a su Gobierno para negociar la paz. Las aerolíneas suben; la energía, el sector que más cae.
---
Esta noche presenta Apple. Y mañana, elecciones de mitad de mandato en EE. UU.
```

The first post is the hook and goes with the video; the next ones carry the key figures, each with
its time. Same rules as the channel's posts on X: 280 characters as X counts them, **no link and
no domain** (X charges $0.20 for a post with one; themarkethub.app is a domain), no emoji, two
hashtags at most, no advice. `make reelcheck` checks it. `make reelpost` posts it after Instagram,
at about $0.015 a post; if X refuses, the reel stays up on Instagram, and `make reelx REEL=<folder>`
tries X again.

## 6. Make it, look at it, publish it

```bash
make reelcheck REEL=<folder>
make reel REEL=<folder>
```

`make reel` picks the way of drawing from the slides (all `.tsx`: Remotion; `.html`: the page
montage). With Remotion, `make film PIECE=reels/<folder> STILLS=1` draws only each scene's still, to
look at the slides before the film (and before paying for the voice: without it each scene lasts
what its words would take). `make reel` speaks what is not spoken yet (ElevenLabs, the voice Dani the user chose: about 1.600
characters a reel, paid by the character on the user's ElevenLabs account), draws every frame and makes `build/reel.mp4`. It says each scene's
length; the whole must be 60 to 100 seconds (`make reelcheck` says so too). If it prints that a
slide "waits for" a word its narration does not say, fix the `data-say`.

**Look at every scene** before publishing: read `build/short-frames/<scene>.png` (the slide as
its voice ends). Nothing cut or overflowing, nothing under the top 250 px or the bottom 470 px,
no empty half, the figures right. Fix and run `make reel` again until it is right. Then read the
script and the caption once more as a reader would: is every figure in a source of this run, and
does nothing read as telling anyone what to do with their money?

```bash
make reelcheck REEL=<folder>
make reelpost REEL=<folder>
```

**A reel the user asked for goes up at 19:30 Madrid time, Monday to Friday, and only one a day**
(the owner, 2026-11-06, after reading their numbers: `docs/instagram-strategy.md`). At 19:30 it
is evening in Spain and midday in Latin America, and it falls about three hours after the open's
reel (up between 16:00 and 16:50) and three before the close's (about 22:25). Before posting, look at `uploaded_utc` in the `instagram.json` of
every folder in `reels/`: if a reel went up less than **two hours** ago, or another reel the user
asked for already went up today, do not post. The reels of 2026-11-02 to 11-05 that went up within
an hour of another, or as the fourth of the day, reached 54 to 631 accounts; most others, over 1.000.
So when the user says "súbelo" and it is not 19:30 yet, leave it made, tell them it is ready and
goes at 19:30, and post it when they confirm at that time. An hour the user gives ("súbelo ya",
"a las 21:00") wins over this; say what the rule would have been. Asked on a Saturday or a
Sunday, it waits for Monday at 19:30 unless the user says otherwise. The daily reels keep their own times.

`make reelpost` publishes it once (the film goes through the bucket of `channel.toml` and leaves
it), writes `instagram.json` and tells the portal's Media page. If Instagram refuses (an expired
token, a limit), **do not try again**: leave the folder as it is and report what Instagram
answered. The token is the user's to renew (`README`, "Instagram"); never ask for it.

## 7. Keep it and report

```bash
git add reels/<folder>
git commit -m "Daily reel: <moment> of <date>, <what it was about>"
git push
```

`build/` and `voice/` stay out of git. Then report in a few lines, in Spanish: the reel's address
(or why it is not up), its length, what it told, and anything you decided or could not check.

## Never

- More than one reel per moment and day, or a reel on a day Wall Street is shut.
- A figure without its source, a prediction, a price target, or anything that reads as advice.
- Photos, footage, music or faces of others; anything loaded from the network (logos only from
  `theme/logos/`).
- Use the browser to publish, or reply to, like, follow or message anyone.

## A reel the user asks for, to think something through

The user also asks for reels one by one, "more reflective" (2026-11-02): a thesis about the
markets, argued with sources (for example, that the reaction to big tech's results is not how a
bubble behaves). They follow this skill with these differences:

- **It may come with a long video on YouTube, if the user says so** (the user, 2026-11-09:
  "Quiero que me preguntes para generar el video de youtube después del reel"). Every reel the user asks for, of any line or a special one-off: once the reel is made
  and committed (and up, if they said "súbelo"), ask in one short line whether to make its long
  video, and only on a yes make it in the same session with the skill `long-video`: 10 to 12
  minutes in Spanish, with this reel's voice and look drawn wide. Uploading it is a second yes.
  The daily reels (`open`, `close`, `week`, `ahead`) never have one, and nothing is asked.

- The folder is `reels/<date>-<a-few-words>/` (`make reelnew MOMENT=<a-few-words>`).
- **Drawn with Remotion**: `slides/<scene>.tsx` (step 4, `docs/remotion.md`).
- The script says `voice: reflexion` (Julián on ElevenLabs v3, as a calm, reflective teacher).
- The look is an essay: `<Look look="essay" bg="...">` in Remotion (as an HTML page it was `<body class="light essay" data-bg="...">`) (serif headlines, ink and
  paper, nothing tilted: "más serio y reflexivo", the user, 2026-11-02), unlike the didactic ones.
  Copy the slides of `reels/2026-11-02-not-a-bubble/`.
- It may defend an opinion, said as one ("no parece una burbuja"), with the facts that support it
  and what would contradict it; never advice, never a price prediction.
- **90 seconds at most** (the owner, 2026-11-06; `asked_seconds` in `channel.toml`,
  and `make reelcheck` says so): about 1.000 to 1.300 characters spoken, 8 to 10 scenes. On
  2026-11-02 to 11-05 the reflective and didactic reels ran 2:08 to 2:58, and people watched about
  30 s of them, as much as of a daily one of 90 s: 18 % of the reel against 30 %. Instagram shows
  further the reels people watch to the end. So one thesis and its best three facts, not the whole story; what does
  not fit goes to the caption.
- **The first two seconds hook without the sound**: a figure, a chart or a logo of today's market
  on screen from frame 0, with a headline of four to six words. Most accounts Instagram shows
  the reels to are not Spanish speakers (in November 2026, India, the UK and the US first), and
  they decide with their eyes.
- It is published when the user's request says so ("súbelo"), and only then, with `make reelpost`,
  at the time step 6 says (19:30, one a day).
  **No story through the API**: the user shares the reel to their story from the app, so that
  tapping it opens the reel (the API cannot), and keeps it in the highlight "A fondo". Tell them
  to do so in the report.

### A reel that asks the viewer to read a chart

"Lee el gráfico" (the user, 2026-11-03) has its own skill: `.claude/skills/chart-reel/SKILL.md`.
It shares this skill's making, checking and publishing (steps 5b to 7), with its own voice
(`voice: grafico`), its own slides (`theme/chart.js`) and its own rules.

### A reel that teaches a concept

The user also asks for **didactic reels**, one by one (2026-11-02): one stock-market concept
explained (the first: bond yields against stocks, `reels/2026-11-02-bond-yields-vs-stocks/`,
the example to copy). Same differences as above (their own folder, the light look), and:

- The script says `voice: didactico` (Rafa). Drawn with Remotion, `<Look look="light" ...>` (step 4).
- Teach first with something anyone can picture (a loan, a seesaw), drawn on the slide and
  marked "Ejemplo" when its numbers are made up; the real figures come after, with sources.
  One idea per scene, a question before each answer, and a recap before the closing question.
- **Always a nod to today's market**: read `https://themarkethub.app/api/public/overview` now
  (GET only), keep it in `data/`, and use its figures with their time in Spain. History from
  FRED (`https://fred.stlouisfed.org/graph/fredgraph.csv?id=<series>`, kept in `data/`) or a
  named source.
- Explain, do not argue a thesis: how something works and what it usually means, never what
  anyone should do or where a price goes.
- The brand line says `The Market Hub · Aprende`.
- Published as a reel (`make reelpost`), when the user asks for it. **Its story is the reel shared
  to stories from the app**, which can be tapped to open the reel (the user, 2026-11-02: "quiero
  que en la historia se pueda hacer click e ir al reel"). The API cannot do that (it publishes
  loose pictures and films as stories, with no shared post and no link sticker), so do not
  publish a story yourself: tell the user, in the report, to open the reel in the app, tap the
  paper plane, "Añadir a tu historia", and then add it to the highlight "Aprende" (proposed).
- **Check the cover once it is up.** On the first one, Instagram took frame 0 (no headline yet,
  a counting figure still at "0,00 %") instead of the frame `reelpost` asked for, and the API
  cannot change a published cover. Look at it (the reel's `thumbnail_url`, or the reel in the
  browser) and, if it is wrong, tell the user to change it in the app: the reel, "…", "Editar",
  "Editar portada", a frame where the headline and the figures are in.
