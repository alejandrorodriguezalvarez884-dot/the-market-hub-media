---
name: post-x
description: Write a post for Market Hub's account on X and, once the user says yes to its exact text, put it on X in Claude's built-in browser and record it so the portal's Media page shows it. Use when the user asks for content on X, with something like "haz un post de X sobre el mercado de hoy", "tuitea el vídeo nuevo", "saca un post del artículo de Sysco" or "publica en X". The argument is what the post is about: the market's day, a video, an opinion article, the app, or a topic the user gives.
---

# A post on X

Market Hub's account on X is in English and carries the same rules as the rest of the portal:
**describe and explain, never advise** (no buy, sell or hold, no price targets, no predictions,
no "opportunity" alerts), and **every figure comes from a source** that the post's file names.
No emojis, at most two hashtags, and links only to Market Hub and its own accounts. Nothing is
posted on a timer: a post is written when the user asks for it.

The user decided (2026-10-14) that posts go on X **through Claude's built-in browser**, where
they are signed in to the account, not through X's API (which is paid by the post). **Posting is
the user's decision, post by post**: the exact text is shown to them first, and the Post button
is pressed only after a clear yes to that text in chat. A request to "write and post" is not a yes
to a text they have not seen.

Work from the root of the `the-market-hub-media` repo. Read `CLAUDE.md` there first.

## 1. Gather the facts

Write from sources, not from memory. Look things up now, even if they seem known.

- **The market's day**: the portal's own figures, `https://themarkethub.app/api/public/overview`
  (indices, sectors, rates, commodities, currencies, movers; `as_of` says when, and `intraday`
  whether the session is still open). Say "closed" only if the session is over; otherwise say
  "so far today" or give the time. The link is `https://themarkethub.app/today/`.
- **A video**: its `videos/<name>/published.json` (the YouTube address, and the Short's) and its
  `script.md` (title, description, sources). Only a video that is public on YouTube.
- **An opinion article**: its Markdown in `../market-hub-opinion/articles/` (title, dek,
  sources). The link is `https://themarkethub.app/opinion/article/?slug=<file name without .md>`.
- **The app or a tool**: its own page on the portal; describe what it does, not how it is made.
- **A company or a topic**: the sources that say it (a filing, a release, the portal's own
  page for the stock at `https://themarkethub.app/quote/?t=<TICKER>`).

## 2. Write it

Make a file `x/<YYYY-MM-DD>-<slug>.md` (today's date, a short slug in lowercase and hyphens):

```markdown
---
sources:
  - Market Hub, today's market (Yahoo Finance) | https://themarkethub.app/api/public/overview
---
The S&P 500 ended 0.8% higher. Ten of its eleven sectors rose; energy was the one that fell.

Every move on one ruler: https://themarkethub.app/today/
```

The body is exactly what goes on X. How it reads:

- One idea, said plainly, in the portal's voice: short sentences, a direct tone that does not
  treat the reader as a fool, no hype ("huge", "insane", "don't miss"), no jargon for its own
  sake.
- Lead with the fact, then where to see more: one link, at the end, to the portal page, the
  video or the article. X counts any link as 23 characters.
- A number is written as the source gives it, rounded the way the portal rounds it (one
  decimal for a percentage), with what it is and when.
- Not "we think the market will…", "watch this stock", "time to…". An article's argument can be
  told as the article's ("Our piece argues…"), never as advice to the reader.

Then:

```bash
make xcheck POST=<slug or name>
```

It must say `ready`. It catches the length, the clearest advice, outside links, emojis, too many
hashtags and figures without a source. The rest is judgement: read the post once more as a
reader would.

## 3. Show it and wait

Show the user the exact text in a quote block, with its length from `make xcheck` and the
sources it rests on, and ask whether to post it. Change it as they say and check it again. Do
nothing on X until they say yes to that text.

## 4. Put it on X

Read the `built-in-browser` skill first. In Claude's built-in browser:

1. Open `https://x.com/compose/post`. If X asks to sign in, stop and ask the user to sign in
   in the pane themselves; never type a password or a code. Check that the account shown is
   `@<handle>` of `[x] handle` in `channel.toml`.
2. Click in the post box and, **before typing anything**, check that the cursor is in it:
   `document.activeElement` must be the box (`data-testid="tweetTextarea_0"`, or `_1`, `_2`… in
   a thread) and editable. The editor sometimes opens as a whole page and sometimes as a dialog
   over the timeline, and a click aimed at one misses the other. Keys typed outside the box are
   X's keyboard shortcuts (`l` likes, `t` and Enter repost, `r` replies), and on 2026-10-15 a
   post's text typed on the timeline liked and reposted someone else's post. Check again before
   each later `type` (after the link, after ctrl+Home). If something was typed outside the box,
   stop and look at the account's likes, reposts, replies and bookmarks, and tell the user what
   changed.
3. Type the text exactly as it is in the file (line breaks included) and look at the preview:
   it must be the text the user approved, with the link card if it has a link. A screenshot
   taken right after typing can show the box before the text appears; read the box's text, or
   take another one, before deciding something went wrong.
4. Press Post only now, once. If X shows a warning or asks for anything (a verification, a
   confirmation, a new setting), stop and tell the user.
5. Open the account's profile, find the new post and copy its address
   (`https://x.com/<handle>/status/<number>`).

### A thread

A thread is one file per post, numbered in order: `x/<date>-<slug>-1.md`, `-2.md` and so on,
each with its own sources and each checked on its own. Show the user the whole thread and get the
yes to all of it. In the editor, after typing the first post, the "Add post" button opens the
next box (`tweetTextarea_1`, `_2`…) with the cursor in it; check that every box holds its file's
text exactly and that no empty box is left, and the button then reads "Post all". The addresses of
the posts after the first show on the profile's Replies tab (`https://x.com/<handle>/with_replies`),
not on the first post's page; past the fourth, open the fourth post's own page and scroll down, and
the rest of the thread loads under it. Record each with its own `make xposted`.

In a long thread there can be two "Add post" buttons at once: the one under an earlier post
inserts the new box in the middle of the thread. Take a fresh screenshot and press the (+) of the
box you just typed in (scroll down first if it is below the screen), then check that the cursor
is in the new last box (`tweetTextarea_<n>`) before typing. Open the editor at
`https://x.com/compose/post` as a whole page; if it opens as a dialog over the timeline and the
pane changes size, a click can close it.

On 2026-10-16, after several posts in a row, the editor at `https://x.com/compose/post` started
writing every `type` twice, and Backspace then left text on screen that X counted as gone. If the
box's text is ever doubled, discard, open `https://x.com/home` and click into the post box at the
top of the timeline instead; type the last line first, then ctrl+Home and the rest, as with a link.

To change text already in a box, delete it with Backspace: selecting all (ctrl+a) does nothing in
X's editor from the built-in browser. If a box goes wrong, close the editor and choose Discard
(nothing has been posted), then start again.

A long link typed after the text lands in place of the post's first line (seen with an opinion
article's address, 2026-10-14). Type the link first, in the empty box, then press ctrl+Home and
type the text before it, ending with its blank line. Then look at the box, not only its text:
X's `innerText` shows extra line breaks that are not there.

## 5. Record it

```bash
make xposted POST=<slug or name> URL=https://x.com/<handle>/status/<number>
```

It writes the address and the time into the post's file and leaves the account's latest posts
where the portal's Media page reads them (`x_state/front` in the portal's Firestore; with
`TO=<folder>`, a portal on this machine). If the portal could not be told, `make xfront` does it
later. Commit the post's file in this repo and push it.

Tell the user where the post is and that it will show on https://themarkethub.app/media/ within
a minute.

## Never

- Post without a yes to the exact text, or post twice.
- Reply to, like, repost, follow or message anyone, or change the account's settings or profile,
  unless the user asks for that very thing.
- Delete a post: if one is wrong, tell the user; deleting it is theirs to do.
- Use X's API, or any paid service, without the user deciding it first.
