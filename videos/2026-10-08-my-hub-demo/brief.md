# My Hub, the tour

**Verdict: make it.** Asked for by the owner on 2026-10-08: a demo video, in English, to share with
a group of people who are going to test the deployed site. It explains everything My Hub does
today, tells them what to try, and asks for twelve testers for the phone app.

It is not an episode of a series and it is not for the channel's playlists: it is sent by hand to
the testers. So it is a `kind: demo` (no intro or outro of the channel, no Short, no sources), and
nothing here uploads it anywhere.

## What it covers

My Hub as it is deployed on 2026-10-08 (`market-hub-landing` at `a87baf9`), in the order of its menu:

1. Getting in: sign-in with Google or with an email and a password (ten characters at least; there
   is no "forgot my password"), then Portfolio (positions with shares and an optional average
   cost; the watchlist).
2. Overview: the four figures, the portfolio read back in sentences, the holdings against the
   indices by period (today's holdings held through the period, not the real past return: trades
   are not recorded), the positions.
3. Analysis: by sector, country, volatility and size; next to four indices; how it moves and how
   its weight is spread; today, position by position; every position in a table that sorts.
4. Watchlist: the wall of charts and its controls; the chips, and looking at any other stock;
   Readings (one sentence and nine gauges per stock); Map, and the reading that opens from it.
5. Community: sharing (off until turned on; what others see and what nobody sees), the board,
   and the monthly competition (3 to 10 single stocks, 5 % to 50 % each, entries for November open
   until October 31).
6. The tools: Fundamentals, Earnings, Peers and Playground, a scene each.
7. Account and data.

Then what to test (five things), what to report, and the favour: the phone app.

## The phone app and its testers

- The app is `market-hub-mobile` (Expo): My Hub for Android and iPhone, in development.
- Google Play asks a personal developer account made after 2023-11-13 for **12 testers opted in
  to a closed test for 14 days in a row** before the app can go to production
  (`market-hub-mobile/store/google-play/LISTING.md`, step 7).
- What a tester has to send: their name, whether the phone is an Android or an iPhone, and the
  email of the Google account on that phone (the one of the Play Store): a closed test invites
  people by that email. For an iPhone, the email of the Apple account, which is what TestFlight
  invites. **The owner did not say which details to ask for ("la que sea"): these are the
  agent's choice.** He also did not say how he wants to be reached: the video says "send me a
  message", which works because he sends the video himself.

## Where the pictures come from

Every screen is a photograph of the site itself, taken on this machine from the same code that is
deployed, with a demo account and real prices (Yahoo Finance, close of 2026-10-07):

- `capture/seed.py` makes the demo account ("Sam Demo", ten positions and six followed stocks) and
  six more that share a portfolio and have an entry for November, so the board is not empty. The
  video says they are demo accounts and that the real board is almost empty.
- `capture/shoot.py` takes the screenshots into `slides/shots/`. The top of each file says how.
- The portal runs with no key of a model (`hub-demo-windows` in the workspace's
  `.claude/launch.json`), so nothing was paid for: the sentences of Overview and of the readings
  are the ones the code writes. The deployed site shows the model's where it answers.
- Earnings Radar reads a release with a paid model, so no company was opened in it: its scene
  shows the home page and the market trends. Playground ran with its stand-in composer
  (`PLAYGROUND_SCRIPTED=1`), not the model.
- The phone's screens are the app's browser view (`make web` in `market-hub-mobile`), signed in as
  the same demo account.

On the screens there are things that are not ours, as on the site: Google's sign-in button and
the attribution mark of TradingView's chart library. The channel's rule against other people's
logos is about what a video draws; here they are part of the page being shown.

## Decisions taken while making it (the owner was not asked)

- First person ("I am building…", "send me a message"): the video is the owner's own message to
  people he sends it to, said by the channel's voice and its drawn presenter.
- The look is the channel's (its tones, its presenter in the corner), one tone per part.
- About six minutes. It tells; it never advises (one scene says so of the readings).
