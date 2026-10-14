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
2. Type the text exactly as it is in the file (line breaks included) and look at the preview:
   it must be the text the user approved, with the link card if it has a link.
3. Press Post only now, once. If X shows a warning or asks for anything (a verification, a
   confirmation, a new setting), stop and tell the user.
4. Open the account's profile, find the new post and copy its address
   (`https://x.com/<handle>/status/<number>`).

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
