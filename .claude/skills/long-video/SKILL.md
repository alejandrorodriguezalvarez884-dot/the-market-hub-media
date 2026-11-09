---
name: long-video
description: The long YouTube video, 10 to 12 minutes in Spanish, that goes with every reel the user asks for (reflexión, didáctico, Lee el gráfico, or a special one-off like the Jensen Huang case) - made by default in the same session, right after the reel, without the user asking for it - the deeper research, the script, the slides in the reel's look drawn wide, the thumbnail, the voice of the reel, the YouTube title and description - then shown to the user and uploaded to YouTube only after their explicit yes. Not for the daily reels (open, close, week, ahead). Use it after making any reel on demand, and when the user says "haz el vídeo largo de X", "rehaz el vídeo largo" or "sube el vídeo largo". The argument is the reel's folder in reels/.
---

# The long video of a reel

The user decided on 2026-11-09: *"automatizar la creación de videos largos de 10/12 mins a youtube
cada vez que te pida un reel que no sea de los automatizados"*. So **every reel the user asks for
has a long video on YouTube on the same subject**, and this skill makes it. It is part of making
the reel: the user does not ask for it, and you do not ask whether to make it. The reel says the
thing in 90 seconds; the long video tells the whole of it in 10 to 12 minutes.

What the user decided about it (2026-11-09, asked once):

- **In Spanish, with the reel's voice**: the same `voice:` as the reel (Julián for a reflective
  one, Rafa for a didactic one, Rafalupi for a chart one, Dani when the reel used the reels' own),
  on ElevenLabs v4. It costs about 10.000 to 13.000 characters a video, some seven reels, on the
  user's ElevenLabs account; they chose it knowing that.
- **The reel's look, drawn wide** (1920x1080): the same pieces (`theme/reel.css`) with
  `theme/long.css` on top, and the body of the reel's line. **No presenter**, no channel intro or
  outro, no Short: the reel is its short piece, already on Instagram.
- **Uploading is the user's decision, video by video, after they have seen it**: this skill
  prepares and checks the video, then asks; it uploads only after an explicit yes to that video.
  A "súbelo" said for the reel is the reel's, not the long video's.

**Never for the daily reels** (`open`, `close`, `week`, `ahead`): they are made by scheduled runs
with nobody watching, and stay as they are. `make longnew` and `make check` refuse a daily reel.
If the user says they do not want the long video for a reel ("sin vídeo largo"), skip it for that
reel and say so.

Everything in `CLAUDE.md` holds: describe and explain (a reflective one may argue a thesis, said as
an opinion), never advise or predict a price; every figure, date and quotation from a source with
its address; nothing made by others but the companies' logos from `theme/logos/`; nothing
scheduled. Work from the root of `the-market-hub-media`.

## 0. The order

1. The reel first, as its skill says (`daily-reel`, "A reel the user asks for"; `chart-reel`): it
   is short and it has its time (19:30). If the user said "súbelo", it goes up at its time,
   whatever the long video's state.
2. Then, in the same session, this skill. Commit the reel before starting it.
3. At the end, one report with both: the reel (up, or waiting for 19:30) and the long video
   (made, and the question of whether to upload it).

The reel's caption is not changed to point at the long video (it may be up before the video
exists). The long video's description names the reel's subject, not its address.

## 1. Start it from the reel

```bash
make longnew REEL=<the reel's folder>
```

It makes `videos/<the reel's folder name>/` from `templates/long/`: a `brief.md` to fill in, a
`script.md` with `kind: long`, `reel:`, the reel's `voice:`, its title and **all its sources**,
two slides and a thumbnail with the look of the reel's line (`light essay` and "A fondo" for a
reflective reel, `light` and "Aprende" for a didactic one, `light` and "Lee el gráfico" for a chart
one, dark and "Al día" for the reels' own voice).

## 2. Find out more

The reel's sources and its `data/` are the starting point, not the whole of it. Open them again
(do not trust what the reel's script says about them) and go further, the way `analyze-idea`
does: primary sources first (SEC EDGAR, the companies, statistics agencies, central banks,
exchanges, FRED, Yahoo Finance for prices), then what else bears on it, and the best case
against. A long video has room for what the reel left out:

- **The context and the history**: how we got here, the earlier figures of the same series, the
  precedent the subject is compared with (and whether the comparison holds).
- **How it works**: the mechanism, taught with something anyone pictures, as the didactic reels do.
- **The figures that did not fit**, each with its date and address.
- **The strongest objection**, and what the sources say about it.
- **What is not known yet**: the next release, the open question. Never a forecast of our own.

Keep what you read in the long video's `data/` (the reel's stays in the reel's), and write every
new figure, date and quotation with its address in `brief.md` ("Los hechos nuevos") and in the
script's `sources`. Fill in every section of `brief.md`: it is the plan, and what a later session
reads to take the video up.

By line:

- **Reflexión**: the thesis, its three best facts at length, the facts that go against it and why
  the view still holds (or where it would stop holding), said as an opinion ("mi lectura es…").
- **Didáctico**: the concept from zero, with an everyday picture first and its numbers marked
  "Ejemplo"; then the real figures; how it has behaved in the past; what it usually means and when
  it has not; and today's market, read now (`/api/public/overview`), with its time.
- **Lee el gráfico**: what the pattern is and how it is read; the reel's case told at length; two
  or three more real episodes from Yahoo Finance's candles (`make candles REEL=<the reel>
  SYMBOL=... FROM=... TO=... ALSO=1`, which keeps them in the reel's `data/`), at least one where
  the pattern failed; and why a pattern is not a promise. Never a signal, a target or a success
  rate without a named source. Check that `theme/chart.js` fills the wide frame: look at the frames.
- **A special one-off** (like `reels/2026-11-09-jensen-huang/`): its own angle, kept; a
  reconstruction keeps apart what is confirmed, what is reported and what is only a hypothesis,
  as its reel did, and says which is which out loud. Its long video, `videos/2026-11-09-jensen-huang/`, is the
  example to copy: the reel's storyboard drawn wide (`slides/wide.css`, `slides/storyboard.js`)
  and **stick figures** for the people of the story (`slides/figures.js`, the user's request:
  "con monigotes que simulan a Jensen y la amante y tal"): lines only, no face, one trait each
  (his black jacket; her bob and badge) and the name written under every figure; a hypothesis
  drawn in grey dashes (`class="fig sketch"`). Someone not charged with anything is not named,
  and a relationship is two figures and what the source says, nothing more.

## 3. The script

`script.md`, the data on top and then the scenes, like a reel's but long:

- **Length: 10 to 12 minutes**, at the pace of its voice: `words_per_minute` of the voice in
  `channel.toml` (Julián 163, Rafa 146, the reels' own 175), plus a pause after each scene. With
  Julián that is about **1.650 to 1.950 words**; the first long video (the Huang case) had 1.650
  and ran 10:09 once spoken, so aim for the middle, not the edge. `make check` measures it, with the voice once it is made,
  and refuses a long video outside 10:00 to 12:00. Do not pad to reach ten minutes: if the
  subject runs short, find more of it (step 2), never more words for the same thing.
- **Structure**: a hook in the first fifteen seconds (the reel's own hook usually works: the fact
  or the question, never a greeting); then **five to eight chapters** of one to three minutes, each
  one idea; and a close that says what the viewer now knows and asks the question for the
  comments. No "suscríbete", no thanks, no channel intro.
- **Chapters**: `chapters:` on top, each `- <scene> | <título>`, the first at `01-hook`, five at
  least (`make check`): YouTube cuts the video by them and they go in the description.
- **Scenes**: one per picture, **6 to 20 seconds** each, so 45 to 70 scenes. When what is on
  screen should change, a new scene starts.
- **For the ear**, like the reels: short sentences, one figure per sentence, said the way one says
  it ("casi un tercio", "unos cuatro mil millones"); names written the way the voice must say them
  (the reels write Nvidia as "Envidia" and Walmart as "Uólmart"); a scene that needs another pace
  says `speed:` under its heading. No symbols or abbreviations the voice would stumble on.
- **Title** (100 characters at most) says what the video answers, with no clickbait; the
  **description** is two or three sentences; **tags** a few. The chapters, the sources and the
  notice (`[long] disclaimer` in `channel.toml`) are added under the description by the code. The
  whole description must stay under YouTube's 5.000 characters: keep in `sources` only those the
  video uses, with short labels (`make check` says when it is too long; a reel's 23 sources did
  not fit).

## 3b. Nothing that sounds or looks machine-made

The user, 2026-11-09: *"quiero que le quites todo el AI slop posible"*. A long video is ten
minutes of one voice: every stock phrase is heard, and a viewer who hears two of them stops
trusting the rest. Write it as a person who has read the documents and is telling a friend.

In the script, never (`make check` refuses the plainest of these in a long video, `SLOP` in
`src/marketmedia/script.py`; the rest is yours to catch on reading it aloud):

- **Stock openings and closings**: "en un mundo donde…", "en la era de…", "hoy vamos a ver…",
  "bienvenidos", "en definitiva", "en resumen", "y hasta aquí…". Start on the fact; end on what
  the viewer now knows and the question.
- **The "no es solo X, es Y" turn**, and its cousins ("no se trata de… se trata de…"). Say Y.
- **A question of one or two words answered by the next sentence**: "¿El resultado? Subió."
  "¿La clave? El petróleo." Say the sentence. A real question to the viewer is fine, once in a
  while, when they can try to answer it.
- **Filler and inflated words**: "cabe destacar", "es importante señalar", "sin lugar a dudas",
  "revolucionario", "sin precedentes" (unless a source says it, and then say whose word it is),
  "un antes y un después", "tormenta perfecta", "navegar la incertidumbre", "el panorama actual",
  "fascinante", "apasionante".
- **Teasers**: "la respuesta te sorprenderá", "pero eso no es todo", "y aquí viene lo
  interesante", "spoiler". If it is interesting, the fact shows it.
- **Lists of three for rhythm**, three adjectives in a row, and every paragraph ending on a
  punchline. Vary the length of the sentences; let some end flat.
- **Saying what was just said**, or announcing what comes next ("ahora veremos…"). A chapter
  title on screen does that.
- **The long dash** (—): the voice does not say it. Use a full stop.
- The same word for the same thing all through: if it is "el gasto en centros de datos", it does
  not become "la inversión en infraestructura" and "el capex" two scenes later.

Every sentence should carry a fact, a reason or a step of the argument. Read the whole script
aloud, or with `make voice` and the render, once before showing it: a sentence you would not say
to a friend goes.

On screen:

- **Draw the thing itself**: a chart from the figures in the sources, a timeline, a map, a
  balance. A row of identical cards with a big number each is the last resort, not the layout of
  every slide; no two consecutive slides with the same layout.
- **No decoration that means nothing**: no icons beside every line, no glows, no gradients added
  on top of the line's look, no fake dashboards or interfaces, no stock symbols (light bulbs,
  rockets, brains, handshakes, arrows to the sky). The background of `theme/reel.js` is the only
  decoration, and it is dim on purpose.
- **Words on a slide are not the narration**: a headline of a few words and the figure; the voice
  says the rest. No slide with a paragraph.
- **The thumbnail and the title say what the video answers**, in plain words: no "INCREÍBLE", no
  question the video does not answer, no shocked face, no arrow, no all-caps sentence.

## 4. The slides

One drawing per scene, `slides/<scene>.html`, drawn as code; `slides/01-hook.html` from the
template is the pattern: `theme/reel.css`, then `theme/long.css`, the body of the reel's line,
`<canvas class="bg">`, the brand line, `<main class="reel">`, and `theme/reel.js` last. Copy the
reel's slides as a starting point for the pieces (cards, stickers, logos, `data-say`,
`data-count`), but **draw them again for a wide screen**: what is stacked in the reel goes side by
side here (`.cols`, `.cols.left`, `.cols.right`, `.cols.three`), headlines are shorter, and the
frame has to be filled across, not down. A reel with a look of its own (the storyboard of
`reels/2026-11-09-jensen-huang/`) keeps it: link its style from `../../../reels/<reel>/slides/` and
adapt it to the wide frame in a `<style>` of the slide.

- Nothing on screen before the voice names it (`data-say`, as in the reels); everything at rest
  before the scene ends.
- One idea per slide and few words; every slide with a figure says its source (`.note` or the
  card's label).
- A chapter may open with a slide of its own (`<p class="chapter">Capítulo 2 de 6</p>` and its title).
- Logos only from `theme/logos/`; no photos, no faces, nothing from the network.
- **The thumbnail**, `thumbnail.html`, 1280x720: the same look with `class="... thumb"`, three to
  five words read at the size of a stamp, one of them in colour, and a figure or a logo if it
  helps. It promises nothing the video does not give.

## 5. Check, render, look

```bash
make check VIDEO=<name>
make render VIDEO=<name>     # frames and film; without voice, each scene held for its words at the reels' pace
```

A long video is some 20.000 frames: `make render` takes about half an hour. Run it in the
background and look at the frames as they come. **Look at every scene**: `build/frames/*.png`
(each slide as its voice ends) and `build/thumbnail.jpg`. Text cut or off the frame, an empty
half, a card that overlaps, a slide that says what the narration does not: fix and render again
(only the changed slides are drawn again).

## 6. Its voice

```bash
make voice VIDEO=<name> DRY=1    # how many scenes and characters it would send to ElevenLabs; spends nothing
make voice VIDEO=<name>          # speaks the scenes that are new or whose words changed
make render VIDEO=<name>         # again: each scene now lasts what its voice lasts
make check VIDEO=<name>          # again: the real voice may take it outside 10 to 12 minutes
```

The voice is part of making it (the user's decision of 2026-11-09): do it once the script is
settled and the frames are right, not before. If the real voice takes it outside 10:00 to 12:00,
trim or add words and repeat: only the changed scenes are spoken again. If `make voice` fails for
the key or the account's quota, say what it answered and stop: the key is the user's
(`make elevenkey`), and never ask for it in the chat. Look at the frames again after the second
render.

## 7. Show it, and ask

Commit the long video (`brief.md`, `script.md`, `slides/`, `thumbnail.html`, `data/`; `build/`
and `voice/` stay out of git) and push, then tell the user, in Spanish and briefly: where the film
is (`videos/<name>/build/video.mp4`) and how long it runs, the title, the description, the
chapters, how many characters went to ElevenLabs, anything you were not sure of; and **ask one
question: whether to upload it to YouTube**. Then stop.

Upload only after an explicit yes to this video ("sí, súbelo", "súbelo a YouTube"). Then follow
`publish-video`, without the Short and without the reel on Instagram (the reel is already its
own post):

- `make upload VIDEO=<name>` (public unless the user said another visibility): since 2026-11-09
  the API uploads in public (the Huang case went up that way). If it fails for the sign-in
  (`invalid_grant`), `make auth` is the user's to run, ticking every box Google shows; while the
  Google app is in "Testing" the sign-in lasts seven days (`docs/youtube-audit.md`). Make sure
  the description fits: `make check` measures it as it goes up, chapters included, in bytes.
- If YouTube ever keeps it private again, or the API cannot be used, it goes by hand:
  `make kit VIDEO=<name>`, then drive YouTube Studio in the browser to the upload screen, fill in
  everything from `build/youtube.txt` (title, description with chapters and sources, thumbnail,
  captions `captions.srt` in Spanish, not made for kids, category Education, language Spanish),
  and leave the user only choosing `video.mp4` and pressing publish. Then
  `make published VIDEO=<name> URL=<its address>`, commit and push.

Then, as `publish-video` says, the video on the portal's Media page.

## Never

- A long video for a daily reel, or one scheduled, or started by a scheduled run.
- An upload without the user's explicit yes to this video; a Short or an Instagram post of it.
- A presenter, a face, a photo, or anything loaded from the network.
- A figure without its source, a prediction, a target, or anything that reads as advice.
- A stock phrase, a teaser or a decoration that says nothing (step 3b).
