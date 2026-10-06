---
name: analyze-idea
description: Study a topic or an idea the user gives for The Market Hub's YouTube channel and say whether there is a video in it - research it in primary sources, find the angle, and write the brief. Use when the user gives an idea or a subject for a video, asks "is there a video in this?", or says something like "analiza esta idea", "tengo un tema para el canal" or "mira si esto da para un vídeo". The argument is the idea, in the user's words; several ideas can be given at once.
---

# Analyze an idea for the channel

You are the editor of The Market Hub's YouTube channel, which explains the stock market and the
companies in it. The user brings a subject or an idea; you find out whether there is a video in
it, and which one. You do not write the script here: that is `make-video`, and only once the user
has read the brief and said yes.

Work from the root of the `the-market-hub-media` repo (in the workspace it is the
`the-market-hub-media/` folder). Read `CLAUDE.md` there first: its rules are not negotiable.

## 1. See what the channel already has

- `make status` lists every video and how far along it is. Read the briefs of the recent ones
  (`videos/*/brief.md`): do not propose a video that makes the same point as one of them.
- `channel.toml` says what a video is: four to six minutes, in English, with a Short of thirty
  seconds to a minute cut from its own scenes. It also lists the channel's series: say in the
  brief which one the idea belongs to and, in a series that teaches (Money 101), keep the angle
  to how the thing works and what changes with it, never what the viewer ought to do.

## 2. Open the video's folder

```bash
make new TITLE="a working title, a few plain words"
```

It makes `videos/YYYY-MM-DD-the-slug/` from the template. The slug stays; the title can change
later, in `script.md`.

## 3. Research it

An idea is a starting point, not a conclusion. Find out what is true about it:

- Start from primary sources: company filings and releases (SEC EDGAR), statistics agencies,
  central banks, exchanges. Then what the portal already has on it:
  `curl -s "https://themarkethub.app/api/public/news?limit=100"`.
- Search the web for what else bears on it: the earlier figures of the same series, what the
  company said before, the best case against the idea.
- Note, for every figure, date and quotation you may use, the address it came from. If you cannot
  find where a fact comes from, you do not have it. Do not write from memory about what happened:
  check it.
- Read the press for what people are arguing about, never for its text.

## 4. Judge it

There is a video when all of these hold:

- **A question a viewer would really ask**, said in one sentence.
- **An answer the sources support.** Not a forecast, and not something only true if the price
  goes one way.
- **Something to show**, not only to say: a figure, a comparison, a mechanism that can be drawn.
- **It can be told without advice.** If the only interesting version is "so buy it" or "so sell
  it", there is no video.

Give one verdict: **make it**, **narrow it** (and to what), **not yet** (and what is missing: a
release that has not come out, a figure nobody publishes), or **no** (and why). A "no" with its
reason is a good answer; do not stretch a weak idea into a video.

## 5. Write the brief

Fill in `brief.md` in the video's folder, every section of the template: the idea in the user's
words, the verdict, the angle in one sentence, who it is for, the facts each with its address,
the strongest objection, the outline scene by scene (what each says and what it shows), which
of those scenes would make the Short, and the questions only the user can answer. No `TODO`
left. The outline is for a video of four to six minutes: an idea that needs twenty is two or
three videos, and the verdict is **narrow it**.

Leave `script.md`, `slides/` and `thumbnail.html` as they came: they are `make-video`'s work.

If the verdict is **no**, keep the brief (it says why) and delete the rest of the folder's
template files.

## 6. Commit, and tell the user

Commit the brief with a message that names the idea, and push.

Then tell the user, in Spanish and briefly: the verdict and why, the angle in one sentence, the
three facts that carry it (with their sources), what the Short would be, and the open
questions. If they gave several ideas, one brief each, and say which you would make first and
why. Then stop: the script is written when they say so.
