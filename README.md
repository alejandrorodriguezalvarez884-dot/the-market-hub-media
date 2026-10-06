# The Market Hub: Media

The YouTube channel of [Market Hub](https://themarkethub.app): videos, in English, that explain
the stock market and the companies in it. Every subject becomes two films: a **video** of four
to six minutes and a **Short** of thirty seconds to a minute, cut from the video's own scenes.

Each one is studied, written, drawn, voiced and put together from here, by
[Claude Code](https://claude.com/claude-code) skills that the channel's owner starts by hand.
The repo holds no service and calls no language model: the writing and the drawing are done in a
Claude Code session, and the code here only does what must come out the same every time.

- [`videos/`](videos/): one folder per video, `YYYY-MM-DD-the-slug/`, with its brief, its script,
  the drawing of each scene and its thumbnail. The layout is at the top of
  [`src/marketmedia/videos.py`](src/marketmedia/videos.py).
- [`.claude/skills/`](.claude/skills/): the three skills, one per decision the owner makes.
- [`channel.toml`](channel.toml): what every video shares: the language, the size and the length
  of the video and of the Short, the voice.
- [`theme/`](theme/): the look and the movement every slide shares, wide and upright.
- [`templates/video/`](templates/video/): what a new video's folder starts as.
- [`CLAUDE.md`](CLAUDE.md): the rules a video keeps.

## Day to day

In Claude Code, from this folder or from the `market-hub` workspace:

```
/analyze-idea why do companies buy back their own shares
```

studies the idea in primary sources, says whether there is a video in it and writes its brief.
Once the brief is read and approved:

```
/make-video buy-back
```

writes the script, draws the slides and the thumbnail, gives it its voice and renders the two
films to `videos/<name>/build/`. And once they are watched:

```
/publish-video buy-back
```

writes what to paste into YouTube Studio, and records where the video ended up.

By hand:

```bash
make install                  # once
make new TITLE="..."          # a new video's folder, from the template
make status                   # every video and how far along it is
make check VIDEO=buy-back     # what stops it from being published
make voice VIDEO=buy-back     # speak the scenes that need it (DRY=1: only say what it would send)
make render VIDEO=buy-back    # the frames, the video, the Short and their captions
make kit VIDEO=buy-back       # what to paste into YouTube Studio
make published VIDEO=buy-back URL=https://www.youtube.com/watch?v=...
make test
```

## How a video is made

1. **Brief** (`brief.md`): the idea, the verdict, the angle in one sentence, every fact with the
   address it came from, the strongest objection, the outline, the scenes of the Short.
2. **Script** (`script.md`): the title, the description, the tags and the sources on top; then
   the scenes, each a `## 01-name` heading with what is said under it. A `short:` line names
   the scenes that make the Short.
3. **Slides** (`slides/01-name.html` or `.svg`): one drawing per scene, written as code, with
   nothing loaded from the network. A slide moves: its parts come in, its bars rise and its
   figures count up as the voice names them. `make frames` photographs each with the Chrome on
   this machine, frame by frame while it moves, at 1920x1080, and the scenes of the Short at
   1080x1920 as well.
   A thing comes in when the voice says its word (`data-say="inflation"`): when each word is
   said is worked out from the sound (`timing.py`).
   The channel's host is one of those drawings (`theme/presenter.js`): a presenter with a body
   and hands, whose mouth follows the voice of the scene and who waves, points and counts on
   his fingers when the slide tells him to.
   A video belongs to a series (`series:` in its script, `[series.*]` in `channel.toml`): a
   subject, a playlist and a colour on every slide.
4. **Narration** (`voice/01-name.wav`): one sound file per scene, spoken by Google Cloud
   Text-to-Speech. A scene with no file is held in silence for the time its words would take,
   so a film can be watched and timed before a word is spoken.
   Every video opens with the channel's intro and closes with its outro (`channel/intro.html`,
   `channel/outro.html`, `[intro]` and `[outro]` in `channel.toml`): the same two scenes in all
   of them, in the colour of the video's series. A Short and a trailer have neither.
5. **Films** (`build/video.mp4`, `build/short.mp4`): each frame held for as long as its
   narration lasts, joined with the ffmpeg that comes with the `imageio-ffmpeg` package. The
   video's captions are a file beside it (`captions.srt`); the Short's are drawn into the
   picture by the slide itself, a few words at a time, the one being said in the series' colour.
6. **Publishing**: `build/youtube.txt` has the title, the tags and a description that carries
   the chapters (`chapters:` in the script, timed from the film), the sources and a notice
   that it is not advice; and what to set by hand: the end screen over the outro, the playlist. `published.json` records where it is.

The build and the narration are not in git; everything else is.

## The voice

`make voice` uses the owner's own Google Cloud session and project. Once:

1. Enable the **Cloud Text-to-Speech API** in the project
   (`gcloud services enable texttospeech.googleapis.com`).
2. `gcloud auth application-default login`, if this machine has not done it yet.

The voice is in `channel.toml` (`[voice]`): a Chirp 3 HD voice, `en-US-Chirp3-HD-<name>`, and its
pace (`rate`). These
voices are free up to a million characters a month and paid by the character after that (Google's
pricing page, October 2026); a video is about five thousand. A scene is spoken again only when
its words or the voice change, and `make voice DRY=1` says what it would send without spending.

## Publishing

For now, by hand in YouTube Studio, from `make kit`. The reason: videos uploaded through an API
project that has not passed YouTube's compliance audit are locked as private.

After that audit (a form, free of charge), `make upload` uploads through the YouTube Data API
with an OAuth client of the owner's own Google Cloud project. It is free: an upload spends the
API's daily quota, not money. Once:

1. In the Google Cloud console, enable **YouTube Data API v3** in a project.
2. Set up the OAuth consent screen (External) and add the channel's Google account as a test
   user.
3. Create an OAuth client ID of type **Desktop app**, download its JSON and save it as
   `.secrets/client_secret.json` (the folder is not in git).
4. `make auth`: it opens the browser to sign in with the channel's account and keeps the token
   in `.secrets/youtube-token.json`. While the consent screen is in "Testing", the sign-in lasts
   seven days.

`MEDIA_BROWSER` chooses another browser channel than `chrome` for the frames; `YOUTUBE_CLIENT_SECRET`
and `YOUTUBE_TOKEN` move the two files.
