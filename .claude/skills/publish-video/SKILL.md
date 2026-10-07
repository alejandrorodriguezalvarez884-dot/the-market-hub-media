---
name: publish-video
description: Publish a finished video of The Market Hub's channel, and its Short, on YouTube - check them, then upload them through the API or write what to paste into YouTube Studio, and record where they ended up. Use when the user asks to publish a specific video, with something like "publica el vídeo de X", "prepara la subida" or "ya lo he subido, esta es la dirección". The argument is the video (its folder's name or a part of it) and, once it is published, its address.
---

# Publish a video

There are two ways, and the user says which: uploading through the API ("súbelo", `make
upload`), or by hand in YouTube Studio, for which this skill prepares everything to paste and
afterwards records where the video is. YouTube keeps private whatever an API project uploads
until the project passes its audit: while that is so, say it before uploading that way. Either
is done only when the user asks for it, for the video they name.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first.

## 1. See that it is ready

```bash
make status
make check VIDEO=<name>
```

- The check must pass. If it does not, say what it names and stop.
- The films must be newer than the script: if the script or a slide changed,
  `make render VIDEO=<name>` first.
- If `published.json` exists, it is already on YouTube: say where and stop.

## 2. Write what to paste

```bash
make kit VIDEO=<name>
```

It writes `videos/<name>/build/youtube.txt`: the title, the description (with the chapters,
the sources and the notice that it is not advice) and the tags of the video, when its end
screen starts, its playlist, and the title and the description of the Short. If it says some scenes have no voice yet, tell the user and ask whether that is
what they want to publish.

Tell the user, in Spanish, what is in `videos/<name>/build/` and what each file is for:

- `video.mp4`, with `thumbnail.jpg` and `captions.srt`;
- `short.mp4`, with `short.srt`;
- `youtube.txt`, to paste from.

And what to set by hand in YouTube Studio, in the order Studio asks for it: the title, the
description and the thumbnail; the playlist of its series (made there the first time); not made
for kids; the tags, the language and the category (Education) under "Show more"; the captions
file; the end screen over the outro, from the moment `youtube.txt` gives (a video on the frame
that says "Watch next", the subscribe element on the circle); and the Short's "related video",
once the video is public. YouTube's "altered or synthetic content" question is theirs to answer:
its help page says clearly unrealistic or animated content needs no disclosure, and the channel
is a drawn presenter with a synthetic narrator that imitates nobody
(https://support.google.com/youtube/answer/14328491). Then stop: uploading is theirs to do.

## 3. Record where it is

When the user comes back with the address of the video (and of the Short):

```bash
make published VIDEO=<name> URL=https://www.youtube.com/watch?v=... SHORT=https://www.youtube.com/shorts/...
```

It writes `published.json` in the video's folder. Commit it with a message that names the
video, and push. Update "Dónde estamos" in `docs/HANDOFF.md`.

Then put it on the portal's Media page, which is kept by hand (in the workspace, the
`market-hub-landing` repo; read its `CLAUDE.md` first): add the video and its Short to its
playlist in `site/src/lib/media.ts`, copy `build/thumbnail.jpg` to `site/public/media/` as the
video's cover and a frame of the Short (one of `build/short-frames/*.png`, as a 540x960 JPEG)
as the Short's, run `make check` there, commit and push. Deploying the portal is the user's to
ask for.

## Uploading through the API

When the user asks for the video to be uploaded, after step 1:

```bash
make upload VIDEO=<name> PRIVACY=<public|unlisted|private>   # the visibility the user said; leave PRIVACY out if they said none
```

It uploads the video (chapters, thumbnail, captions, its place in its series' playlist) and then
its Short, and writes `published.json`; one that stopped half way is taken up where it stopped.
Pass on what it prints: the two addresses, the visibility YouTube gave each (private, whatever
was asked, until the API project passes its audit: see the README), and anything it could not
set. The end screen and the Short's related video are still the user's to set in YouTube Studio
(`make kit` says from which second the end screen runs). Then commit `published.json` and put
the video on the portal's Media page, as in step 3.

If it fails for lack of the sign-in or of the OAuth client, say what it answered and stop: the
set-up is in the README and `make auth` is the user's to run (it opens their browser). Never
ask the user for a password, a token or a code.
