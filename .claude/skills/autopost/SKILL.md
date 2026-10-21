---
name: autopost
description: The channel's posts made on its own, with nobody watching - find what is new in the markets since the last run, write one post for X without a link and put it there through the API, and, when the run says "ig", also draw and publish one Instagram carousel. It is what the scheduled tasks "market-hub-autopost" and "market-hub-autopost-ig" run on weekdays; use it by hand only when the user asks to run it ("lanza el autopost").
---

# A post made on its own

You are running one of the channel's automatic posts. Nobody is watching: a scheduled task of the
Claude desktop app started this session, and the user reads your last message when they next
look. There is nobody to ask, so decide, do, and say what you decided.

The user decided this on 2026-10-21: **five posts a day on X and two carousels a day on Instagram,
made and published without asking them**, and the posts on X made this way **carry no link**,
because X's API charges $0.015 for a post and $0.20 for one with a link. It is the one place in
this repo where something is published without a yes to its exact text; everything else in
`CLAUDE.md` holds as in any session, above all: **describe and explain, never advise**, and
**every figure comes from a source looked up now**.

The argument says what this run does:

- `x`: one post on X.
- `x ig`: one post on X and one carousel on Instagram, about the same thing or another.

Work from the root of the `the-market-hub-media` repo. Read its `CLAUDE.md` first, then
`.claude/skills/post-x/SKILL.md` for how a post reads (steps 1 and 2) and how a carousel is drawn
(step 6). This skill only says what changes when nobody is watching.

## 1. Before anything

```bash
git status --short
git pull --ff-only
```

Other sessions work in this repo too. Leave alone any file that is not yours: never stash, reset,
check out or commit it. If `git pull` cannot fast-forward, go on without it and say so.

If there are no X API keys (no `.secrets/x-api.json` and no `X_API_KEY` in the environment), the
post on X cannot go out: skip it, write nothing for X, and say so in the report. Do not look for
the keys anywhere else.

Look at what went out today, so as not to say it again:

- `x/<today>-*.md`: the posts already made today, and how many have `auto: yes` and a `url:`.
  If five do, the channel has made all its posts for the day: post nothing on X (the code refuses
  a sixth anyway).
- `carousels/<today>-*/`: the carousels already published today. If two are, publish no more.

## 2. Find what is new

Read now, and only from sources:

- The portal's figures: `https://themarkethub.app/api/public/overview` (indices, sectors, rates,
  commodities, currencies, movers; `as_of` and `intraday` say when and whether the session is
  open).
- The portal's news: `https://themarkethub.app/api/public/news` (a GET only: never ask it to
  refresh, which costs the user's API key).
- The web, with WebSearch: the day's market news, companies' results and their releases (the
  release itself, or the SEC filing, is the source to cite), economic data from the agency that
  publishes it.

Pick **one thing**, new since the last run and not said today, that the account's readers would
want to know: a market move and what drove it, a large company's results, an economic release, a
sector or a currency doing something unusual. Roughly by the run's time (Madrid):

| Run | What there usually is |
|---|---|
| 09:30 | Asia's close, Europe's open, US futures, overnight results |
| 13:00 | Europe at midday, US premarket, the morning's data |
| 16:00 | The US open and the first half hour |
| 19:00 | The US session at midday, company news |
| 22:30 | The US close, results released after it |

A rumour, a forecast, a price target or someone's call on a stock is not a fact to post. Nor is
politics, unless it moved the markets and the move is the post. If nothing new and sourced can be
said, post nothing and say why: a run that posts nothing is better than a post that repeats or
guesses.

## 3. The post on X

Write `x/<YYYY-MM-DD>-<slug>.md` as `post-x` says, with `auto: yes` in its header:

```markdown
---
sources:
  - Market Hub, today's market (Yahoo Finance) | https://themarkethub.app/api/public/overview
auto: yes
---
The S&P 500 closed 0.8% higher. Ten of its eleven sectors rose; energy was the one that fell.
```

- **No link and nothing X would turn into one**: no address, no `themarkethub.app`, no
  `sec.gov`, no domain of any kind. The sources go in the header, not in the text.
- One idea, plainly said, in the portal's voice; a number as the source gives it, rounded the way
  the portal rounds it, with what it is and when ("so far today" while the session is open).
- No emojis, at most two hashtags (usually none).

```bash
make xcheck POST=<slug>
```

It must say `ready`. Then read it once more as a reader would: is every figure in a source you
read in this run, and does nothing read as telling anyone what to do with their money? If in
doubt, cut it.

```bash
make xpost POST=<slug>
```

It puts the post on X through the API, once, writes the address into the file and tells the
portal's Media page. If it fails (no keys, no credits, X refuses), **do not try again and do not
use the browser**: putting posts on X through the browser with nobody watching is never done.
Leave the file as it is and report what X answered.

## 4. The carousel on Instagram (only with `ig`)

As in step 6 of `post-x`: two to four slides at 1080 × 1350 in `carousels/<YYYY-MM-DD>-<slug>/`,
drawn here as HTML in the portal's look (copy `theme.css` from the latest carousel and add what
this one needs), few words on the slides and the detail in `caption.txt`, which ends with the
sources and the line that nothing here is investment advice. Instagram does not charge, and an
address is not a link there: the caption may name `themarkethub.app`.

```bash
make carousel CAROUSEL=carousels/<YYYY-MM-DD>-<slug> DRAW=1
```

Look at every picture (read the JPEGs): nothing cut, nothing overflowing, no empty half of a slide.
Fix and draw again until it is right, then publish:

```bash
make carousel CAROUSEL=carousels/<YYYY-MM-DD>-<slug>
```

If it fails, do not try again; report what Instagram answered.

## 5. Keep it

Commit only the files this run made (the post's file, the carousel's folder) and push:

```bash
git add x/<file>.md carousels/<folder>
git commit -m "Autopost: <what it was about>"
git push
```

## Never

- Post more than one post on X, or one carousel, in a run.
- Put a link, or a domain, in a post on X made this way.
- Use the browser for X, or reply to, like, repost, follow or message anyone.
- Delete a post, or try again a post that failed.
- Publish a video, a reel, a story or an opinion article: those are the user's, one by one.
- Spend on anything but `make xpost` (one post, without a link) and the free Instagram API.
- Touch a broker connector.

If a tool asks for a permission and nobody answers, that step did not happen: say so in the
report, with the command, so the user can allow it for the next run.

## The report

Your last message, in Spanish, short:

```
**Autopost · <fecha> <hora>**

**X** — publicado: <la dirección> · "<primera línea>" (<n> de 5 hoy)  /  no publicado: <por qué>
**Instagram** — publicado: <la dirección> · <tema>  /  no tocaba  /  no publicado: <por qué>
**Fuentes** — <las que usaste>
**Atención** (solo si algo falló o pide una decisión)
```
