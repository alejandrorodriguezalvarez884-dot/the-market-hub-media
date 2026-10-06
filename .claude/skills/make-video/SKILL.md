---
name: make-video
description: Make a video for The Market Hub's YouTube channel from a brief the user has approved - write the script, draw the slides and the thumbnail, check it and render the film, ready for the user to watch. It never uploads. Use when the user approves a brief or says something like "haz el vídeo", "escribe el guion", "monta el vídeo de X" or "rehaz las diapositivas". The argument is the video (its folder's name or a part of it) and, optionally, the step to start from - script, slides or render.
---

# Make a video

You make one video of The Market Hub's YouTube channel, from its brief to a film the user can
watch. Publishing it is another skill (`publish-video`) and another decision: this one never
uploads anything.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first: its rules are
not negotiable. Then read the video's `brief.md`. If its verdict is not **make it**, or it still
has open questions the user has not answered, say so and stop.

The formats are described where they are read: the script at the top of
`src/marketmedia/script.py`, a drawing at the top of `src/marketmedia/frames.py`, the folder of
a video at the top of `src/marketmedia/videos.py`.

## 1. Write the script

`script.md`: the data on top, then the scenes. Write for the ear, not for the page.

- **Structure.** A hook in the first fifteen seconds (the fact or the question, not a greeting);
  a title card; three to five parts, each one idea; a close that says what the viewer now knows
  and what to watch next. One scene per picture: when what is on screen should change, a new
  scene starts. A scene runs 8 to 25 seconds; a picture held longer loses people.
- **Length.** What the brief says. At the channel's pace (`channel.toml`, 150 words a minute) an
  eight-minute video is about 1,200 words.
- **Voice.** A person who has read the documents and explains them to a friend who is clever and
  not in finance. Short sentences. One figure per sentence, rounded the way one would say it
  aloud ("almost a third", "about 4 billion dollars"). No jargon left unexplained. Say the
  number and then what it means.
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

## 2. Draw the slides

One drawing per scene, `slides/<scene-name>.html` (or `.svg`), drawn by you as code. No image
service, no model on the network, no picture taken from anywhere.

- Link the shared style (`../../../theme/slide.css`) and read it first: it has the palette, the
  type and a few layouts (`.slide`, `.kicker`, `.figure`, `.row`, `.foot`). What is particular to
  a slide goes in a `<style>` of its own. Nothing is loaded from the network; system fonts only.
- **One idea per slide, and few words**: twelve at most outside a chart. The narration carries
  the sentence; the slide carries the figure, the comparison or the drawing.
- **Charts are drawn as inline SVG from the figures in the brief**, with their axis, their unit
  and their date. Colours that name a series come from `--series-1..4`. Green and red only for
  a figure that went up or down, never as a verdict, and no arrows that point where a price
  "will go".
- **Every slide with a figure says where it comes from**, in the foot (`.source`).
- No real logos, no faces of real people, no brand's look. A company is told by its name in
  plain type and by what it does.
- Start each file, after the doctype, with a comment that says what the slide shows.

Then the thumbnail, `thumbnail.html`: three to five words that can be read at the size of a
stamp, and one strong shape. It does not promise what the video does not give.

## 3. Check, render, look

```bash
make check VIDEO=<name>      # fix what it names
make render VIDEO=<name>     # draws the frames, then makes build/video.mp4 and build/captions.srt
```

**Look at every frame you made** (open `build/frames/*.png` and `build/thumbnail.jpg`). Text that
is cut or runs off the frame, a chart whose labels overlap, a slide that says something the
narration does not: fix the drawing and render again. Two passes is normal. Then read the
timings `make render` printed: a scene far outside 8 to 25 seconds wants splitting or joining.

## 4. The narration

A scene's narration is a sound file, `voice/<scene-name>.wav` (or `.mp3`, `.m4a`); the film uses
the ones that are there and holds the other scenes in silence for the time their words would
take. How the narration is made is said in `CLAUDE.md` ("La voz"). If it says the voice is
recorded by the user, give them the script scene by scene and the name each file must have, and
render again once the files are in `voice/`.

## 5. Commit, and tell the user

Commit the script, the slides and the thumbnail (the build and the voice are not in git) with a
message that names the video, and push. Update "Dónde estamos" in `docs/HANDOFF.md`.

Tell the user, in Spanish and briefly: where the film is (`videos/<name>/build/video.mp4`), how
long it runs, whether it has its voice or is still silent, the title and the description it
would be published with, and anything you were not sure of. Then stop. Publishing is theirs to
ask for.
