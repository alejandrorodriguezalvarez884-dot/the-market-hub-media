---
name: daily-reel
description: The channel's two daily reels on Instagram, in Spanish - Wall Street's open ("open") and its close ("close"). Find what happened, write the script, draw the slides, speak it, make the film, check it and publish it, with nobody watching. It is what the scheduled tasks "market-hub-reel-open" and "market-hub-reel-close" run on weekdays; use it by hand when the user asks for the day's reel ("haz el reel de la apertura", "lanza el reel del cierre").
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
run**, with its time; **nothing made by others** on the slides (no logos, photos, stock footage or
faces: the backgrounds are drawn by `theme/reel.js`). The reels have no presenter: a format of
its own, like the demo.

The argument is the moment: `open` or `close`. Work from the root of `the-market-hub-media`.

## 1. Before anything

```bash
git status --short
git pull --ff-only
```

Other sessions work in this repo too: leave alone any file that is not yours.

- **Is Wall Street open today?** Read `https://themarkethub.app/api/public/overview`: if
  `intraday` is false at the open, or `as_of` is not today, or today is a NYSE holiday
  (https://www.nyse.com/markets/hours-calendars), make nothing and say so.
- **Is it done already?** If `reels/<today>-<moment>/instagram.json` exists, it is up: stop.
  If the folder exists without it, a run before you stopped half way: take it up from where it is.
- **Times.** Spain (Madrid) and New York are six hours apart most of the year, five for a few
  weeks in March and in late October / early November, when the clocks change on different days.
  Work out the gap for today; never assume it.

```bash
make reelnew MOMENT=<open|close>
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
- **Spanish from Spain**, spoken, short sentences: a reel runs **40 to 120 seconds**, like the reference's
  1:37 to 1:43 (about 200 to 280 words). Numbers as they are said ("un seis por ciento", "ciento quince mil millones"),
  rounded as a person would say them; the exact figure goes on the slide.
- **01-hook**: the day in one line, with the moment and the day ("Wall Street abre la semana en
  verde"). The first two seconds decide whether anyone stays.
- **The last scene** asks the viewer a question about what is coming, to answer in the comments,
  and says when the next reel is (the close at 22:00, or tomorrow's open). Asking what they think
  is fine; saying what we think the market will do is not.
- A full stop after each thing said: the slides bring things in on the words (`data-say`).

## 4. The slides

One page per scene, `slides/<scene>.html`, upright at 1080 × 1920, with `theme/reel.css` and
`theme/reel.js` (read the comments at the top of both). Start from the slides of the last reel:
the same pieces in another order is the format. Each scene:

- `<body data-bg="...">` and a `<canvas class="bg">`: tape, candles, grid, city or plain (the
  question). Change the background from one scene to the next.
- `<header class="brand">The Market Hub · Apertura</header>` (or `Cierre`).
- A `.kicker` on top (what part of the story this is: "Lo que mueve hoy", "El viernes", "Esta
  noche"), a large `h1` with a word or two in `.y` (amber), and below it one or two `.card`s or
  `.sticker`s that come in when the voice says their word (`data-say`, classes `.in`, `.pop`).
- `.g` / `.r` and `▲` / `▼` only for what went up or down. Figures in the Spanish way
  (28,6 %; 115.000), `data-count` for one that counts up. Every figure on screen says when it is
  from if it is not the time of the reel.
- No logos, emojis, photos or anything loaded from the network. The account's own picture
  (`channel/instagram-profile.jpg`) may close the reel.
- Keep everything between 250 and 1450 px from the top and clear of the right edge: Instagram
  puts its own buttons and the caption over the rest.

## 5. The caption

`caption.txt` (see `templates/reel/caption.txt`): the title in capitals; a sentence that sums up;
one line per thing, starting with `▲`, `▼` or `·`, with its figure and its time; what comes next;
the closing question; `Fuentes:` and who they are; the notice exactly as `channel.toml` says it
(`[reel] disclaimer`); `themarkethub.app`; three to six hashtags in Spanish. No emojis.

## 6. Make it, look at it, publish it

```bash
make reelcheck REEL=<folder>
make reel REEL=<folder>
```

`make reel` speaks what is not spoken yet (ElevenLabs, the voice Dani the user chose: about 1.600
characters a reel, paid by the character on the user's ElevenLabs account), draws every frame and makes `build/reel.mp4`. It says each scene's
length; the whole must be 40 to 120 seconds (`make reelcheck` says so too). If it prints that a
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
- Logos, photos, footage, music or faces of others; anything loaded from the network.
- Use the browser to publish, or reply to, like, follow or message anyone.
