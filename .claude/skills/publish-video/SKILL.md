---
name: publish-video
description: Publish a finished video of The Market Hub's channel on YouTube - check it, show the user exactly what will go up, and upload it once they confirm. Use only when the user asks to publish or upload a specific video, with something like "publica el vídeo de X" or "súbelo a YouTube". The argument is the video (its folder's name or a part of it) and, optionally, the privacy - private, unlisted or public.
---

# Publish a video

Uploading puts something on the user's channel under their name. It is done only when the user
asks for it, for the video they name, and after they have seen what will go up.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first.

## 1. See that it is ready

```bash
make status
make check VIDEO=<name>
```

- The check must pass. If it does not, say what it names and stop.
- The film must be newer than its script (`make upload` refuses otherwise): if the script or a
  slide changed, `make render VIDEO=<name>` first.
- If the film is still silent, or only some scenes have their voice, tell the user and ask
  whether that is what they want to publish.
- If `published.json` exists, it is already on YouTube: say where and stop.

## 2. Show the user what will go up, and wait

`make preview VIDEO=<name>` prints it: the title, the description as YouTube will show it (with
the sources and the notice), the tags, how long the film runs and how many scenes have their
voice. Give it to the user in Spanish, with the thumbnail (open `build/thumbnail.jpg`) and the
privacy it will have.

**The privacy is `private` unless the user says another, in this conversation, for this video.**
Then ask for a plain yes. An approval of the brief or of the script is not an approval to
publish, and neither is a yes given for another video.

## 3. Upload

```bash
make upload VIDEO=<name>                    # private
make upload VIDEO=<name> PRIVACY=unlisted   # only if the user said so
```

It writes `published.json` in the video's folder: the address, the privacy and whether the
thumbnail was set.

If it fails because nobody is signed in (`no OAuth client`, `not signed in to YouTube`), tell the
user what is missing (the README's "Publishing" section says how to set it up, and `make auth`
is theirs to run: it opens their browser) and stop. Do not look for another way in, and never
ask the user for a password, a token or a code.

## 4. Commit, and tell the user

Commit `published.json` with a message that names the video, and push. Update "Dónde estamos"
in `docs/HANDOFF.md`.

Tell the user, in Spanish: the address of the video, its privacy, whether the thumbnail was set,
and what is left for them to do in YouTube Studio (make it public, add it to a playlist, the
captions in `build/captions.srt` if they want them).
