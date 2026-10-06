# The Market Hub: Media

The YouTube channel of [Market Hub](https://themarkethub.app): videos that explain the stock
market and the companies in it. Each video is studied, written, drawn, put together and published
from here, by [Claude Code](https://claude.com/claude-code) skills that the channel's owner starts
by hand. The repo holds no service and calls no model: the writing and the drawing are done in a
Claude Code session, and the code here only does what must come out the same every time.

- [`videos/`](videos/): one folder per video, `YYYY-MM-DD-the-slug/`, with its brief, its script,
  the drawing of each scene and its thumbnail. The layout is at the top of
  [`src/marketmedia/videos.py`](src/marketmedia/videos.py).
- [`.claude/skills/`](.claude/skills/): the three skills, one per decision the owner makes.
- [`channel.toml`](channel.toml): what every video shares: the language, the size of the frame,
  the pace of the narration, how an upload starts.
- [`theme/slide.css`](theme/slide.css): the look every slide shares.
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

writes the script, draws the slides and the thumbnail, checks them and renders the film to
`videos/<name>/build/video.mp4`. And once the film is watched:

```
/publish-video buy-back
```

shows what would go up, waits for a yes, and uploads it to YouTube as a private video.

By hand:

```bash
make install                  # once
make new TITLE="..."          # a new video's folder, from the template
make status                   # every video and how far along it is
make check VIDEO=buy-back     # what stops it from being published
make render VIDEO=buy-back    # the frames, the film and its captions
make preview VIDEO=buy-back   # what would go up: title, description, tags, length
make upload VIDEO=buy-back    # publish it (private)
make test
```

## How a video is made

1. **Brief** (`brief.md`): the idea, the verdict, the angle in one sentence, every fact with the
   address it came from, the strongest objection, the outline.
2. **Script** (`script.md`): the title, the description, the tags and the sources on top; then
   the scenes, each a `## 01-name` heading with what is said under it.
3. **Slides** (`slides/01-name.html` or `.svg`): one drawing per scene, written as code, with
   nothing loaded from the network. `make frames` turns each into a 1920x1080 frame with the
   Chrome on this machine.
4. **Narration** (`voice/01-name.wav`, `.mp3` or `.m4a`): one sound file per scene. A scene
   with no file is held in silence for the time its words would take, so a film can be watched
   and timed before a word is recorded.
5. **Film** (`build/video.mp4`, `build/captions.srt`): each frame held for as long as its
   narration lasts, joined with the ffmpeg that comes with the `imageio-ffmpeg` package.
6. **Upload**: the film, its thumbnail, and a description that carries the sources and a notice
   that it is not advice. `published.json` records where it is.

The build and the narration are not in git; everything else is.

## Publishing

Uploading uses the YouTube Data API with an OAuth client of the owner's own Google Cloud
project. It is free: an upload spends the API's daily quota, not money. Once:

1. In the Google Cloud console, enable **YouTube Data API v3** in a project.
2. Set up the OAuth consent screen (External) and add the channel's Google account as a test
   user.
3. Create an OAuth client ID of type **Desktop app**, download its JSON and save it as
   `.secrets/client_secret.json` (the folder is not in git).
4. `make auth`: it opens the browser to sign in with the channel's account and keeps the token
   in `.secrets/youtube-token.json`.

Two things to know, from Google's and YouTube's documentation:

- Videos uploaded through an API project that has not passed YouTube's compliance audit are
  locked as private. To make them public, the project has to be audited (a form, free of charge).
- While the consent screen is in "Testing", the sign-in lasts seven days: run `make auth` again
  when it expires.

`MEDIA_BROWSER` chooses another browser channel than `chrome` for the frames; `YOUTUBE_CLIENT_SECRET`
and `YOUTUBE_TOKEN` move the two files.
