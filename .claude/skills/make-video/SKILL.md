---
name: make-video
description: Make a video for The Market Hub's YouTube channel, and the Short cut from it, from a brief the user has approved - write the script, draw the slides and the thumbnail, check it, give it its voice and render both films, ready for the user to watch. It uploads them to YouTube only when the user asked for that in the same request ("haz el vídeo de X y súbelo"). Use when the user approves a brief or says something like "haz el vídeo", "escribe el guion", "monta el vídeo de X" or "rehaz las diapositivas". The argument is the video (its folder's name or a part of it) and, optionally, the step to start from - script, slides, voice or render.
---

# Make a video

You make one video of The Market Hub's YouTube channel, from its brief to two films the user can
watch: the video (horizontal, four to six minutes) and its Short (upright, thirty seconds to a
minute, cut from the video's own scenes). If, and only if, the user asked in this same request
for the video to be uploaded when it is done, the last step uploads both to YouTube. A trailer (`kind: trailer` in its script: a video
that presents the channel or a series) is made the same way, but runs thirty to ninety seconds,
states no figures and needs no sources. A demo (`kind: demo`: a walk through the site itself, for
the people who are going to try it) is made the same way too, with what is its own in "A demo",
at the end. Publishing is the user's decision, video by video:
without their word for this video, this skill stops at the films and uploads nothing.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first: its rules are
not negotiable. Then read the video's `brief.md`. If its verdict is not **make it**, or it still
has open questions the user has not answered, say so and stop.

The formats are described where they are read: the script at the top of
`src/marketmedia/script.py`, a drawing at the top of `src/marketmedia/frames.py`, the folder of
a video at the top of `src/marketmedia/videos.py`. `channel.toml` has the lengths and the pace.

## 1. Write the script

`script.md`: the data on top, then the scenes. Write for the ear, not for the page.

- **Series.** The data on top names the video's series (`series:`, one of `channel.toml`'s) and
  its number in it (`episode:`). The series gives every slide its colour and its name.
- **Teach the idea before the money.** The user wants the videos colourful and didactic, and not
  centred on money as such. So the idea is first shown with something anyone has seen, drawn
  and moving (compound growth was a lily pad doubling on a pond, a stack of blocks and a
  snowball), and with a question the viewer tries to answer before hearing the answer. The
  dollars come once the idea is understood, as its application, and take a part of the video,
  not all of it. One thing per scene, and a recap of three things at the end. The episode on
  compound interest (`videos/2026-10-06-compound-interest/`) is the example to follow.
- **Structure.** A hook in the first ten seconds (the fact or the question, not a greeting);
  a title card; three to five parts, each one idea; a close that says what the viewer now knows
  and what to watch next. One scene per picture: when what is on screen should change, a new
  scene starts. A scene runs 4 to 15 seconds; a picture held longer loses people.
- **The channel's intro and outro are not yours to write.** Every video opens with the same
  intro and closes with the same outro (`channel/`, `channel.toml`); the film adds them by
  itself. So the script starts at the hook and ends at its close, which hands over: what the
  viewer now knows and what the next episode is. It does not greet, name the channel, thank
  anyone or ask for a subscription: the intro and the outro do. They take about 16 seconds of
  the video's length.
- **Chapters.** `chapters:` on top lists the scenes where a part starts, each with a title of a
  few words (`- 08-decades | When the money arrives`): five to ten of them, none shorter than
  ten seconds. They go into the description with their times.
- **Length.** Four to six minutes: about 800 to 1,150 words at the voice's pace (some 200 a
  minute; `words_per_minute` in `channel.toml`). `make check` refuses a video outside it.
- **Voice.** A person who has read the documents and explains them to a friend in their twenties
  who is clever and not in finance: direct, a little dry, never talking down, and with no slang
  put on to sound young. Short sentences. A list is said as a list, each thing its own
  sentence: the voice stops at every full stop, and the slide brings each thing in on its stop. One figure per sentence, rounded the way one would say it
  aloud ("almost a third", "about 4 billion dollars"). No jargon left unexplained. Say the
  number and then what it means. The words are read by a synthetic voice exactly as written:
  write out what must be said ("percent", "dollars", "third quarter"), and avoid symbols,
  brackets and abbreviations a voice would stumble on.
- **Facts and opinion are told apart.** Every figure, date and quotation is in the brief with its
  address, and that address is in the script's `sources`. What you conclude is yours and sounds
  like yours ("I think", "my reading is").
- **Title and description** are for someone deciding whether to watch: the title says what the
  video answers, with no clickbait and no question it does not answer; the description is two
  or three sentences. The sources and the notice are added under it when it is published.

What a video never does:

- It never tells the viewer what to do with their money: no buy, sell or hold, no price targets,
  no "top picks", no portfolios. It may say a decision of a company was good or bad.
- It never predicts a price. It may say what would have to happen for a view to hold.
- It never states a figure, a date or a quotation that is not in its sources.
- It never reproduces someone else's text beyond a short quotation with its source.

## 2. Choose the Short

The Short is a cut of the video: a few of its scenes, in the order the `short:` line names them,
with the same words and the same voice, drawn again upright. It is not a trailer; someone who
sees only the Short must come away with one whole idea.

- Pick the scenes that stand on their own: usually the hook, the scene with the figure that
  carries the video, and one that says what it means. Thirty seconds to a minute (about 100 to
  190 words); `make check` refuses a Short outside it.
- Read the chosen scenes one after another, alone. If a sentence leans on a scene that is not in
  the cut ("as we saw", "that second figure"), reword it in the script so that it works in both
  films, or choose other scenes.
- `short_title:` is its title when the video's does not fit a single idea.

## 3. Draw the slides

One drawing per scene, `slides/<scene-name>.html` (or `.svg`), drawn by you as code. No image
service, no model on the network, no picture taken from anywhere.

- Link the shared style (`../../../theme/slide.css`) and read it first: it has the palette, the
  type and the layouts (`.top` with the series' `.chip`, `.slide`, `.kicker`, `.lead`,
  `.figure`, `.row`, `.card`, `.tiles`, `.steps`, `.foot`). What is particular to a slide goes
  in a `<style>` of its own. Nothing is loaded from the network; system fonts only. The
  trailer of Money 101 (`videos/2026-10-06-money-101-trailer/`) is the format to follow.
- **The look is colourful, for people in their twenties, not for children**: large, short
  headlines on deep, saturated backgrounds. Give each part of the video a tone, on the slide's
  body (`<body class="tone-ocean">`; `tone-plum`, `tone-forest`, `tone-ember`, or none for
  indigo), so the colour changes when the subject does; each tone has its own colour of
  emphasis (`--pop`: `.accent`, `.mark`, `.hl`, bars, lines). No emoji, no clip art, no
  exclamation marks.
- **Draw the thing itself.** A drawing is an inline SVG (`class="art"`) in the bright colours
  of the shared style (`--sky`, `--sun`, `--pink`, `--mint`, `--coral`, `--violet`, `--snow`),
  with its parts coming in on the voice (`.pop` with `data-say`) or moving along a path of its
  own (keyframes in the slide's `<style>`, started by `data-say` through `--at`). A row of
  numbers is the last resort, not the first.
- **One idea per slide, and few words**: twelve at most outside a chart. The narration carries
  the sentence; the slide carries the figure, the comparison or the drawing.
- **A slide moves, and on the voice.** Nothing is on screen before the voice gets to it. Give
  each thing the word it comes in on, `data-say="inflation"`, with one of the movements of the
  shared style (`.in`, `.fade`, `.pop`, `.grow`, `.wide`, `.draw`, and `.hl` for a word that
  gets marked): it starts when that word is said. `data-say` takes a phrase ("plain english"),
  the second time a word is said ("three#2"), a shift in seconds ("school-0.2") or plain
  seconds ("2.5"); the top of `theme/slide.js` has all of it, and a figure that counts up
  (`data-count`). When each word is said is worked out from the voice's sound
  (`src/marketmedia/timing.py`), so nothing has to be placed by ear. `make frames` says when a
  slide waits for a word its narration does not have. Movement explains; it does not decorate:
  nothing loops or spins, and everything has come to rest before the scene ends.
- Over every slide the film draws, by itself, the line at the top that says how far into the
  film it is, the panel that crosses the frame between two scenes and, in the Short, the
  captions. Do not draw them.
- **Charts are drawn as inline SVG from the figures in the brief**, with their axis, their unit
  and their date. Colours that name a series come from `--series-1..4`. Green and red only for
  a figure that went up or down, never as a verdict, and no arrows that point where a price
  "will go".
- **Every slide with a figure says where it comes from**, in the foot (`.source`).
- **A slide of the Short is photographed twice**: 1920x1080 for the video and 1080x1920 for the
  Short. Size things with `vw`, `vh` and `%`, never with fixed pixels, and use
  `@media (orientation: portrait)` (as the shared style does) to stack what sits side by side
  and to enlarge a chart. Upright, the slide lives in the top two thirds: the captions are
  drawn just under it, a few words at a time, and YouTube draws its own things over the bottom
  fifth. In a scene of the presenter's the words take the top quarter, the captions the middle
  and he the lower half. A slide that fits wide very often does not fit upright: look.
- **The presenter hosts the video.** He is the channel's drawn host (`theme/presenter.js` draws
  him into `<div class="presenter"></div>`): half a body, with hands; his mouth follows the
  scene's voice, he blinks, and he glances at the slide. He opens and closes every video in a
  scene of his own (the `.stage` layout of the template's `01-hook` and `04-close`: the words
  on the left, he on the right), takes any other scene that is him talking to the viewer
  rather than a figure or a chart, and is in the first scene of the Short. In every other scene
  that has words he is a face in a ring in the corner (`<div class="presenter corner"></div>`,
  as in the template's `03-point`): the user wants him on screen all the time. The drawing
  leaves him that corner free: the bottom right of the wide frame and, upright, the top right.
- **In his own scenes he uses his hands**, and the slide says how: `data-cues="0:wave
  how:explain three#2:three"`, each a moment (a word of the narration, as in `data-say`, with
  `_` for a phrase, or seconds) and a pose. The poses are at the top of `theme/presenter.js`:
  `rest`, `wave`, `explain` (both palms), `open` (one palm), `point` (at the words beside him),
  `one`, `two`, `three`, `thumb`, `shrug`. A gesture goes with what is said: he counts what is
  counted, points at what has just come in, and rests in between. Every slide with him loads
  `theme/presenter.js` and then `theme/slide.js`. Never redraw him inside a slide and never
  replace him with a picture of a person.
- No real logos, no faces of real people, no brand's look. A company is told by its name in
  plain type and by what it does.
- Start each file, after the doctype, with a comment that says what the slide shows.

Then the thumbnail, `thumbnail.html`: three to five words that can be read at the size of a
stamp, one of them marked, and the presenter (a pose from before the picture is taken:
`data-cues="-2:wave"`). It does not promise what the video does not give.

## 4. Check, render, look

```bash
make check VIDEO=<name>      # fix what it names
make render VIDEO=<name>     # draws the frames, then makes the video, the Short and their captions
```

**Look at every frame you made**: `build/frames/*.png`, `build/short-frames/*.png` and
`build/thumbnail.jpg`. Text that is cut or runs off the frame, a chart whose labels overlap, an
upright slide with everything crammed in a corner or reaching into the captions' band, a slide
that says something the narration does not: fix the drawing and render again. Two passes is normal. Those pictures are each slide
as its voice ends; to see one half way through, open a few of
`build/frames/<scene>/*.jpg` (one picture per frame, thirty a second, for the whole scene).
Then read the timings `make render` printed: a scene far outside 4 to 15 seconds wants
splitting or joining.

## 5. Give it its voice

The narration is spoken by Google Cloud Text-to-Speech, a scene at a time, into `voice/`. The
user has decided it is made here, without asking each time. It is paid by the character past a
monthly free allowance, so do it when the script is settled and the frames are right, not
before.

Once each scene has its voice it lasts what the voice lasts, which is rarely what was assumed.
What comes in on a word (`data-say`, the presenter's cues) follows the voice by itself; only
what was placed in plain seconds has to be moved by hand.

```bash
make voice VIDEO=<name> DRY=1    # how many scenes and characters it would send; spends nothing
make voice VIDEO=<name>          # speaks the scenes that are new or whose words changed
make render VIDEO=<name>         # again: each scene now lasts what its voice lasts
```

If `make voice` fails for lack of credentials or because the service is not enabled, say what it
answered and stop: do not look for another way in. After the second render, run `make check`
again: the real voice may run faster or slower than the estimate and take the video or the Short
outside its length. If it does, trim or add words and repeat (only the changed scenes are spoken
again). The second render redraws every scene: the presenter's mouth, the captions and the
moment each thing comes in all follow the voice that now exists. Look at the frames again.

## 6. Upload it, if the user asked for that

Only when the request that started this video said to upload it ("y súbelo", "súbelo a YouTube
cuando esté"). A request for the video alone, an approved brief, or an upload asked for another
video are not that: skip this step.

Before uploading, the last `make check` must pass, the frames must have been looked at after
the render with the voice, and nothing may be left that you were not sure of in the facts: if
something is, do not upload; say what, and let the user decide.

```bash
make upload VIDEO=<name> PRIVACY=<public|unlisted|private>   # the visibility the user said; leave PRIVACY out if they said none
```

It uploads the video (with its chapters, thumbnail, captions and its place in the playlist of
its series) and then its Short, and writes `published.json`. Read what it prints and pass it on:

- If it says YouTube kept a film private though another visibility was asked for, the API
  project has not passed YouTube's audit: say so plainly, and that until then the way to have it
  public is by hand (`publish-video`).
- If it fails for lack of the sign-in (`make auth`) or of the OAuth client, say what it answered
  and stop: `make auth` is the user's to run, and never ask them for a password, a token or a
  code. The films stay ready; `make upload` can be run later.
- A thumbnail, captions or a playlist it could not set: say which, with its reason.

What the API cannot set is the user's to do in YouTube Studio: the end screen over the outro
(`make kit` says from which second) and the Short's related video. Then, as `publish-video`
says, commit `published.json` and put the video on the portal's Media page.

## 7. Commit, and tell the user

Commit the script, the slides and the thumbnail (the build and the voice are not in git) with a
message that names the video, and push. Update "Dónde estamos" in `docs/HANDOFF.md`.

Tell the user, in Spanish and briefly: where the two films are (`videos/<name>/build/video.mp4`
and `short.mp4`), how long each runs, how many characters were sent to the voice service, the
title and the description they were, or would be, published with, anything you were not sure
of and, if it was uploaded, the two addresses and the visibility YouTube gave each. Then stop.
If it was not uploaded, publishing is theirs to ask for.

## A demo

`kind: demo` is a tour of the site for the people who are going to try it
(`videos/2026-10-08-my-hub-demo/` is the one to follow). What differs:

- **Its pictures are the site's own screens**, photographed, not drawn: `slides/shots/*.jpg`. They
  are taken by the video's `capture/` (`seed.py` makes demo accounts on a portal running on this
  machine, `shoot.py` photographs it at twice the size of its window), from the code that is
  deployed, with real prices and **no key of a model in the environment**: nothing is paid for,
  and what a paid model would write is not shown as if it had. Never photograph a real person's
  account. The brief says where every picture comes from and what was left out.
- **A slide shows a screen in a window and moves in on what the voice names**: `theme/tour.css`
  has the layout (the window, the notes beside it, a "Try it" box) and `theme/tour.js` the camera
  (`data-cam`) and the marks (`.spot`), both placed in percent of the screen and timed by words
  of the narration. Check every mark over its screen before rendering: a mark a little off reads
  as a mistake of the site.
- It has no intro, no outro, no Short (unless it names one) and no sources; `[demo]` in
  `channel.toml` has its length. It says what the site does and what to try; like every video, it
  never advises.
- It is the owner's to share by hand. It is not uploaded to the channel unless he asks for that.
- Drawing every frame of a screen is slow (a scene of fifteen seconds takes a minute or two):
  give it its voice first, look at a few frames of each scene, and render once.
