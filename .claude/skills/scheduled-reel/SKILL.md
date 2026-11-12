---
name: scheduled-reel
description: Market Hub's scheduled reels on Instagram beyond the market updates, made and published with nobody watching by Claude cloud routines (the owner, 2026-11-12) - "aprende" (a stock-market concept, Monday, Wednesday and Friday at 19:30), "grafico" (Lee el gráfico, technical analysis, Tuesday to Thursday at 13:00) and "reflexion" (A fondo, a thesis on the week's market question, Tuesday and Thursday at 19:30). Pick a topic not done before from docs/temas.md, make the reel with the line's own skill, publish it in its window and write it down. See docs/reels.md.
---

# A scheduled reel: Aprende, Lee el gráfico or A fondo

The owner, 2026-11-12: *"Quiero automatizar un reel de aprende los lunes, miércoles y viernes. Ve
buscando temas sin repetir. Y quiero automatizar también un reel de análisis técnico martes,
miércoles y jueves. Y uno de reflexión martes y jueves. Elige tú los horarios y todo. El estilo
quiero que sea innovador, como el reel de CoreWeave que hicimos. Para los reels de análisis
técnico hazlos como hasta ahora."*

So three lines that used to be made only on demand are now also made **and published without
asking**, by Claude cloud routines (`docs/reels.md`, "La automatización"). Usually nobody is
watching: decide, do, and say what you decided. Everything in `CLAUDE.md` holds, above all:
**explain (and, in A fondo, argue) but never advise**; **every figure from a source read in this
run**, with its time; **nothing made by others** on the slides except company logos from
`theme/logos/`; no emojis.

The argument is the line:

| Argument | Line | Days | Goes up (Madrid) | How it is made | Voice |
|---|---|---|---|---|---|
| `aprende` | Aprende: one stock-market concept, with a nod to today's market | Mon, Wed, Fri | **19:30**, at the latest 20:20 | `daily-reel`, "A reel that teaches a concept", **in a look of its own (below)**, Remotion | Rafa, `voice: didactico` |
| `grafico` | Lee el gráfico: a real chart, the question, five seconds, the answer | Tue, Wed, Thu | **13:00**, at the latest 13:45 | skill `chart-reel`, **as it is** (HTML, `theme/chart.js`) | Rafalupi, `voice: grafico` |
| `reflexion` | A fondo: a thesis on the market question of the week | Tue, Thu | **19:30**, at the latest 20:20 | `daily-reel`, "A reel the user asks for, to think something through", **in a look of its own (below)**, Remotion | Julián, `voice: reflexion` |

Why these hours: the market updates go up at about 16:00 (open) and 22:25 (close), and two reels
less than two hours apart reached far fewer people (`docs/instagram-strategy.md`). 19:30 is the
evening in Spain and midday in Latin America; 13:00 is lunchtime in Spain and the afternoon in
India and the UK, where most of the accounts the reels reach are, and a chart reads without words.
On Tuesday to Thursday there are two of these a day, at 13:00 and 19:30, each more than two hours
from any other reel.

Work from the root of `the-market-hub-media`.

## 1. Before anything

```bash
git status --short
git pull --ff-only
uv sync
```

- **Today is a weekday it is due** (table above, in Madrid time). If not, make nothing and say so.
- **Is it done already?** A folder `reels/<today>-*` whose `script.md` says this line's `voice:`
  and has `instagram.json` is up: stop. One without `instagram.json` is a run that stopped half
  way: take it up where it is. A reel of this line the owner asked for by hand today counts as
  done too.
- **Wall Street shut today** (a NYSE holiday, https://www.nyse.com/markets/hours-calendars): still
  make it; the nod to the market uses the last session, said as such ("el viernes", "ayer").
- **Times**: work out the gap between Madrid and New York today; never assume it.

## 2. The topic, from `docs/temas.md`

Read `docs/temas.md` and the folders it lists. Its rules decide:

- **aprende**: the first concept of "Por hacer" unless today's market makes another one timely
  (a Fed day, a big set of results, a split, a jobs report): **the concept that ties into today's
  news wins**. Never a concept already in "Hechos".
- **grafico**: alternate a pattern that worked and one that failed; not the pattern of the last
  two nor the stock of the last five. Find the episode from the data, as `chart-reel` says.
- **reflexion**: the question the market is asking this week, read from this week's news and
  figures, and a thesis of your own on it, argued with its three best facts and with what would
  prove it wrong. Not the same thesis nor the same companies as one in the last four weeks; if the
  week gives no clear question, the first unused one of the list.

Write the choice in one line at the top of `data/sources.md` with why (for example "Aprende: el
PER, porque hoy presenta Nvidia y se habla de lo que se paga por ella").

## 3. Make it

`make reelnew MOMENT=<a-few-words>` (for `grafico`, `grafico-<pattern>`), then follow the line's
own instructions step by step: for `grafico` the skill `.claude/skills/chart-reel/SKILL.md`; for
`aprende` and `reflexion` the skill `.claude/skills/daily-reel/SKILL.md`, its steps 2 to 5b and its
section for that line. Their rules all hold: **90 seconds at most** (`make reelcheck`), **the first
two seconds read without sound** (a figure, a chart or a logo of today from frame 0, a headline of
four to six words), no stock phrases ("AI slop": `daily-reel` step 3, `long-video` step 3b), the
caption and the thread on X. The owner is not asked anything: the "súbelo" of those skills is
given by this schedule.

### The look of Aprende and A fondo: one of its own, like the CoreWeave reel

The owner wants these two lines **"innovador, como el reel de CoreWeave"**:
`reels/2026-11-11-neoclouds/` (A fondo, 2026-11-11), drawn in a look made for that reel alone,
"La nave" (`slides/look/nave.tsx` and `nave.css`): a data hall at night in **CSS 3D**, with a
**camera that moves** from scene to scene over a world where things stand (rows of racks whose
lights come on in a wave, a GPU module that turns, towers of figures standing on the floor),
cards and figures over it that come in with the voice, a source line in each scene. Read those
two files and three of its scenes before drawing anything. So each of these reels:

- **Gets a world of its own, drawn for its topic**, in `slides/look/<name>.tsx` and `.css` (one
  short word, as "nave"): the concept or the thesis made into a place or a machine the camera
  moves through. For example, for the P/E, a row of years stacked as blocks of profit until they
  reach the price; for the yield curve, a road of bonds that rises with time and bends; for
  buybacks, a cake whose slices get bigger as the company eats some. Not the same world as the
  last reel of the line (look at its `slides/look/`), and not "La nave" again unless the topic is
  data centres.
- **Starts from `nave.tsx`**: copy its machinery (`World` and its camera, `Box`, `Bill`, `Frame`,
  `Head`, `Card`, `Src`, `between`/`glide`/`prog`, the account picture to close) and replace the
  objects with the topic's own. Everything that moves is moved from the frame (`useSeconds`,
  `useSay`), never by CSS animations or transitions. What is drawn on a face of a box stays flat
  (`transform-style: flat`), or Chrome opens holes in it (the lesson of "La nave").
- **Keeps its line recognisable**: **Aprende** keeps the warm light paper of its earlier reels,
  amber for the word that matters, the black kicker tag, white cards, the brand line `The Market
  Hub · Aprende`, an "Ejemplo" mark on made-up numbers, and teaches with something anyone can
  picture before the real figures. **A fondo** may be dark like "La nave" or light like an essay;
  serif headlines, the brand line `The Market Hub · A fondo`, and the reel's opinion said as one.
- **Fonts that exist here and in the cloud**: put Inter, Noto Serif and JetBrains Mono in each font
  stack (the cloud has those; Georgia, Bahnschrift or Consolas are only on some computers).
- **Draws data, never decoration posing as data**: a tower, a bar or a line on screen has its real
  figure from `data/`; what is only decoration (a skyline, lights) says nothing numeric.

Before paying for the voice, `make film PIECE=reels/<folder> STILLS=1` and **look at every still**
(`build/short-frames/<scene>.png`): nothing cut, nothing under the top 250 px or the bottom 470 px,
nothing over the right edge, no holes in the 3D, the figures right, the hook clear without sound.
Fix and draw again until it is right. Then `make reel` (the voice, about 1.000 to 1.300
characters of ElevenLabs, and the film; run it in the background with a long timeout and wait for
it: in the cloud the film takes about ten minutes, against one on the Mac) and look at the stills
again. Budget for two films at most: stills are cheap, films are not.

## 4. Publish it in its window

```bash
make reelcheck REEL=<folder>
```

- **Not before its hour** (13:00 for `grafico`, 19:30 for the others, Madrid). If it is ready
  earlier, wait: `sleep` in steps of at most nine minutes until the hour.
- **Two hours from any other reel**: look at `uploaded_utc` in the `instagram.json` of every folder
  in `reels/`; if one went up less than two hours ago, wait until two hours have passed.
- **Not after the window's end** (13:45 or 20:20): later it would fall too close to the next
  market update. If the window has passed, do not publish: commit the folder as it is, push, and
  say in the report that it is made and waiting (the owner can post it with `make reelpost`).

```bash
make reelpost REEL=<folder>
```

If Instagram refuses (an expired token, a limit), **do not try again**: commit the folder, push,
and report what it answered. Never print or ask for tokens or keys.

## 5. Write it down, keep it, report

Add its row to "Hechos" in `docs/temas.md` (date, the concept / pattern, stock and dates, whether
it worked / thesis and companies, the folder) and, for Aprende, take the concept out of "Por
hacer". Then:

```bash
git add reels/<folder> docs/temas.md
git commit -m "Scheduled reel (<line>): <what it was about>"
git push origin HEAD:main
```

Only those files: other sessions work in this repo too. `build/` and `voice/` stay out of git.

Report in a few lines, in Spanish: the reel's address (or why it is not up), its length, the topic
and why it was chosen, the look it got (for Aprende and A fondo, the world in a few words), and
anything decided or left unchecked. Remind the owner to share it to their story from the app
("Añadir a tu historia") and keep it in its highlight ("Aprende", "Lee el gráfico" or "A fondo"),
and to check the cover (the API cannot change it). These reels get **no long YouTube video on
their own** (nobody is there to say yes); say that the owner can ask for it.

## Never

- More than one reel of a line on a day, or a reel of these lines at the weekend.
- A topic already in "Hechos" of `docs/temas.md`, unless there is something new and the row says it.
- A figure without its source, a prediction, a price target, anything that reads as advice; for
  Lee el gráfico, "¿comprarías o venderías?", signals or success rates.
- Photos, footage, music or faces of others; anything loaded from the network.
- Publishing outside the window, or within two hours of another reel.
- Using a connector, the browser to publish, or replying to, liking or following anyone.
