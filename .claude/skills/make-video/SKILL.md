---
name: make-video
description: Make a video for The Market Hub's YouTube channel, and the Short cut from it, from a brief the user has approved - write the script, draw the slides and the thumbnail, check it, give it its voice and render both films, ready for the user to watch. It never publishes. Use when the user approves a brief or says something like "haz el vídeo", "escribe el guion", "monta el vídeo de X" or "rehaz las diapositivas". The argument is the video (its folder's name or a part of it) and, optionally, the step to start from - script, slides, voice or render.
---

# Make a video

You make one video of The Market Hub's YouTube channel, from its brief to two films the user can
watch: the video (horizontal, four to six minutes) and its Short (upright, thirty seconds to a
minute, cut from the video's own scenes). Publishing them is another skill (`publish-video`) and
another decision: this one never publishes anything.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first: its rules are
not negotiable. Then read the video's `brief.md`. If its verdict is not **make it**, or it still
has open questions the user has not answered, say so and stop.

The formats are described where they are read: the script at the top of
`src/marketmedia/script.py`, a drawing at the top of `src/marketmedia/frames.py`, the folder of
a video at the top of `src/marketmedia/videos.py`. `channel.toml` has the lengths and the pace.

## 1. Write the script

`script.md`: the data on top, then the scenes. Write for the ear, not for the page.

- **Structure.** A hook in the first fifteen seconds (the fact or the question, not a greeting);
  a title card; three to five parts, each one idea; a close that says what the viewer now knows
  and what to watch next. One scene per picture: when what is on screen should change, a new
  scene starts. A scene runs 8 to 25 seconds; a picture held longer loses people.
- **Length.** Four to six minutes: about 800 to 1,150 words at the voice's pace (some 200 a
  minute; `words_per_minute` in `channel.toml`). `make check` refuses a video outside it.
- **Voice.** A person who has read the documents and explains them to a friend who is clever and
  not in finance. Short sentences. One figure per sentence, rounded the way one would say it
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
  type and a few layouts (`.slide`, `.kicker`, `.figure`, `.row`, `.foot`). What is particular to
  a slide goes in a `<style>` of its own. Nothing is loaded from the network; system fonts only.
- **One idea per slide, and few words**: twelve at most outside a chart. The narration carries
  the sentence; the slide carries the figure, the comparison or the drawing.
- **A slide moves.** Nothing is on screen before the voice gets to it: the title comes in, then
  each bar rises, the line is drawn, the figure counts up, in the order the narration names
  them. Use the classes of the shared style (`.in`, `.fade`, `.grow`, `.wide`, `.draw`) with
  `style="--at: 2.5s"` for when each starts, counted from the start of the scene, and
  `theme/slide.js` for a figure that counts up (`data-count`). Read the narration aloud to place
  the times: at the voice's pace, ten words are about three seconds. Movement explains; it does
  not decorate: nothing loops, bounces or spins, and everything has come to rest well before
  the scene ends. How a drawing can move is at the top of `src/marketmedia/frames.py`.
- **Charts are drawn as inline SVG from the figures in the brief**, with their axis, their unit
  and their date. Colours that name a series come from `--series-1..4`. Green and red only for
  a figure that went up or down, never as a verdict, and no arrows that point where a price
  "will go".
- **Every slide with a figure says where it comes from**, in the foot (`.source`).
- **A slide of the Short is photographed twice**: 1920x1080 for the video and 1080x1920 for the
  Short. Size things with `vw`, `vh` and `%`, never with fixed pixels, and use
  `@media (orientation: portrait)` (as the shared style does) to stack what sits side by side
  and to enlarge a chart. Keep the top tenth and the bottom third of the upright frame clear
  (the shared style's padding does): the Short's captions are drawn there, a few words at a
  time, above what YouTube draws over a Short.
- **The presenter hosts the video.** He is the channel's drawn host (`theme/slide.js` draws him
  into `<div class="presenter"></div>`; his mouth follows the scene's voice and he blinks). He
  opens and closes every video in a scene of his own (the `.stage` layout of the template's
  `01-hook` and `04-close`: the words on the left, he on the right) and he is in the first
  scene of the Short. In every other scene that has words he stands small in the corner
  (`<div class="presenter corner"></div>`, as in the template's `03-point`): the user wants him
  on screen all the time. The drawing leaves him that corner free: the bottom right of the wide
  frame and, upright, the right side just above the captions' band. Every slide with him loads
  `theme/slide.js`. Never redraw him inside a slide and never replace him with a picture of a
  person.
- No real logos, no faces of real people, no brand's look. A company is told by its name in
  plain type and by what it does.
- Start each file, after the doctype, with a comment that says what the slide shows.

Then the thumbnail, `thumbnail.html`: three to five words that can be read at the size of a
stamp, and one strong shape. It does not promise what the video does not give.

## 4. Check, render, look

```bash
make check VIDEO=<name>      # fix what it names
make render VIDEO=<name>     # draws the frames, then makes the video, the Short and their captions
```

**Look at every frame you made**: `build/frames/*.png`, `build/short-frames/*.png` and
`build/thumbnail.jpg`. Text that is cut or runs off the frame, a chart whose labels overlap, an
upright slide with everything crammed in a corner or reaching into the captions' band, a slide
that says something the narration does not: fix the drawing and render again. Two passes is normal. Those pictures are each slide
at rest; to see one half way through its movement, open a few of
`build/frames/<scene>/*.jpg` (one picture per frame, thirty a second). Then read the timings
`make render` printed: a scene far outside 8 to 25 seconds wants splitting or joining, and one
that moves for longer than it lasts has its movement cut.

## 5. Give it its voice

The narration is spoken by Google Cloud Text-to-Speech, a scene at a time, into `voice/`. The
user has decided it is made here, without asking each time. It is paid by the character past a
monthly free allowance, so do it when the script is settled and the frames are right, not
before.

Once each scene has its voice it lasts what the voice lasts, which is rarely what was assumed:
listen to where the voice names each thing (or work it out from the scene's length and its
words) and move the `--at` of each element to match.

```bash
make voice VIDEO=<name> DRY=1    # how many scenes and characters it would send; spends nothing
make voice VIDEO=<name>          # speaks the scenes that are new or whose words changed
make render VIDEO=<name>         # again: each scene now lasts what its voice lasts
```

If `make voice` fails for lack of credentials or because the service is not enabled, say what it
answered and stop: do not look for another way in. After the second render, run `make check`
again: the real voice may run faster or slower than the estimate and take the video or the Short
outside its length. If it does, trim or add words and repeat (only the changed scenes are spoken
again). The second render also redraws the presenter's scenes: his mouth follows the voice
that now exists.

## 6. Commit, and tell the user

Commit the script, the slides and the thumbnail (the build and the voice are not in git) with a
message that names the video, and push. Update "Dónde estamos" in `docs/HANDOFF.md`.

Tell the user, in Spanish and briefly: where the two films are (`videos/<name>/build/video.mp4`
and `short.mp4`), how long each runs, how many characters were sent to the voice service, the
title and the description they would be published with, and anything you were not sure of. Then
stop. Publishing is theirs to ask for.
