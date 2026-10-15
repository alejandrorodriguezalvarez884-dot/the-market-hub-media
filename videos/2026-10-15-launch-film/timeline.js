// What happens when: the picture (film.html) and the sound (sound.js) both read it, so a cut and its
// hit cannot drift apart. Times are seconds. The pulse is 96 a minute: a beat is 0.625 s, a bar of
// four is 2.5 s, and every cut falls on a beat.
//
// A scene with `shots` shows takes of the site (build/clips/<take>.mp4, from takes.py) in a window.
// Each shot is [seconds into the scene, the take, seconds into the take, how fast it plays]; a shot
// plays until the next one starts, so a later shot is a cut inside the window (the waits of the AI
// are cut out this way, never sped up: what is seen is what the page did).
// `cam` moves the window: [seconds into the scene, { x, y, s, ry }] where x and y are where its
// centre is (in pixels of the frame), s its size (1 is 1260 pixels wide) and ry its turn in degrees;
// `look` moves inside the window: [seconds into the scene, { fx, fy, z }], the point of the page
// (in the page's own pixels, 1280 by 720) put at the window's centre, and how close.
// `lines` are the words; the last one lands on the hit.
(() => {
const BEAT = 0.625, BAR = 4 * BEAT;
const at = (bars, beats = 0) => +(bars * BAR + beats * BEAT).toFixed(4);

// Where the window sits beside the words, and where it fills the frame.
const SIDE = { x: 1300, y: 565, s: 0.86, ry: -8 };
const FULL = { x: 960, y: 552, s: 1.42, ry: 0, full: true };
const PAGE = { fx: 640, fy: 360, z: 1 };

window.FILM = {
  beat: BEAT,
  scenes: [
    // --- The opening: the morning before Market Hub ----------------------------------------------
    { name: "morning", at: at(0), end: at(2), kind: "tabs", lines: ["Every", "morning."], chord: [73.42, 3], part: 0 },
    { name: "tabs", at: at(2), end: at(4), kind: "tabs", stack: ["Prices", "Filings", "Headlines", "Earnings"], chord: [87.31, 4], part: 0 },
    { name: "toomuch", at: at(4), end: at(5), kind: "tabs", lines: ["Too much", "to read."], chord: [58.27, 4], part: 0 },
    { name: "built", at: at(5), end: at(7), kind: "logo", lines: ["So I built", "one place."], chord: [65.41, 4], part: 0 },
    { name: "title", at: at(7), end: at(9), kind: "title", chord: [73.42, 4], part: 0 },

    // --- 01 The market ------------------------------------------------------------------------------
    { name: "today", at: at(9), end: at(11), tag: "01 / The market · Today", lines: ["The whole", "market."], chord: [73.42, 3], part: 1,
      shots: [[0, "today", 0.2, 1]], cam: [[0, SIDE]], look: [[0, PAGE], [5, { fx: 640, fy: 360, z: 1.04 }]] },
    { name: "quote", at: at(11), end: at(13), tag: "01 / The market · Companies", lines: ["Every", "company."], chord: [87.31, 4], part: 1,
      shots: [[0, "quote", 0.3, 1]], cam: [[0, SIDE]], look: [[0, PAGE]] },
    { name: "news", at: at(13), end: at(15), tag: "01 / The market · News", lines: ["Every", "headline."], chord: [58.27, 4], part: 1,
      shots: [[0, "news", 0.3, 1]], cam: [[0, SIDE]], look: [[0, PAGE]] },

    // --- 02 The AI -----------------------------------------------------------------------------------
    { name: "ai", at: at(15), end: at(17), kind: "scan", lines: ["And now, AI that", "reads it for you."], chord: [65.41, 4], part: 2 },
    { name: "fundamentals", at: at(17), end: at(22), tag: "02 / AI · Fundamentals Lab", lines: ["It reads", "the numbers.", "And invents none."],
      chord: [73.42, 3], part: 2,
      shots: [[0, "fundamentals", 11.6, 1], [3.75, "fundamentals", 26.75, 1]],
      cam: [[0, SIDE], [3.6, SIDE], [4.4, FULL], [12.5, FULL]],
      look: [[0, PAGE], [3.75, { fx: 760, fy: 360, z: 1 }], [4.4, { fx: 762, fy: 430, z: 1.24 }], [7.5, { fx: 762, fy: 430, z: 1.24 }],
             [12.5, { fx: 762, fy: 470, z: 1.24 }]] },
    { name: "radar", at: at(22), end: at(27), tag: "02 / AI · Earnings Radar", lines: ["It reads the", "results release.", "In seconds."],
      chord: [87.31, 4], part: 2,
      shots: [[0, "radar", 2.6, 1], [8.125, "radar", 10.0, 1]],
      cam: [[0, SIDE], [7.9, SIDE], [8.75, FULL], [12.5, FULL]],
      look: [[0, PAGE], [3.5, { fx: 640, fy: 330, z: 1 }], [5.0, { fx: 560, fy: 300, z: 1.18 }], [8.0, { fx: 560, fy: 300, z: 1.18 }],
             [8.125, { fx: 720, fy: 380, z: 1.0 }], [8.75, { fx: 762, fy: 430, z: 1.24 }], [12.5, { fx: 762, fy: 470, z: 1.24 }]] },
    { name: "playground", at: at(27), end: at(33), tag: "02 / AI · Playground", lines: ["Ask in", "plain words.", "Get the board."],
      chord: [58.27, 4], part: 2,
      shots: [[0, "playground", 3.0, 1], [6.25, "playground", 12.85, 1], [8.75, "playground", 15.0, 1], [12.5, "playground", 24.8, 1]],
      cam: [[0, SIDE], [8.6, SIDE], [9.4, FULL], [15, FULL]],
      look: [[0, PAGE], [9.4, { fx: 762, fy: 360, z: 1.24 }], [15, { fx: 762, fy: 400, z: 1.24 }]] },
    { name: "peers", at: at(33), end: at(37), tag: "02 / Peer Map", lines: ["1,500 companies.", "Mapped by", "what they do."],
      chord: [65.41, 4], part: 2,
      shots: [[0, "peers", 48.6, 1]],
      cam: [[0, SIDE], [5.6, SIDE], [6.4, FULL], [10, FULL]],
      look: [[0, PAGE], [5.0, { fx: 560, fy: 520, z: 1.0 }], [6.4, { fx: 762, fy: 500, z: 1.24 }], [10, { fx: 762, fy: 520, z: 1.28 }]] },
    { name: "options", at: at(37), end: at(40), tag: "02 / Options Lab", lines: ["Options,", "read in detail."],
      chord: [73.42, 3], part: 2,
      shots: [[0, "options", 16.3, 1]],
      cam: [[0, SIDE], [7.5, SIDE]],
      look: [[0, PAGE], [2.0, { fx: 640, fy: 420, z: 1.0 }], [7.5, { fx: 660, fy: 430, z: 1.08 }]] },

    // --- 03 My Hub -----------------------------------------------------------------------------------
    { name: "hub", at: at(40), end: at(43), tag: "03 / My Hub · demo account", lines: ["Your portfolio.", "Read for you."],
      chord: [87.31, 4], part: 3,
      shots: [[0, "hub", 11.4, 1]],
      cam: [[0, SIDE], [3.0, SIDE], [3.8, FULL], [7.5, FULL]],
      look: [[0, PAGE], [3.8, { fx: 762, fy: 330, z: 1.24 }], [7.5, { fx: 762, fy: 360, z: 1.24 }]] },
    { name: "watchlist", at: at(43), end: at(45), tag: "03 / My Hub · Watchlist", lines: ["Every stock", "you follow.", "Explained."],
      chord: [58.27, 4], part: 3,
      shots: [[0, "watchlist", 9.0, 1]],
      cam: [[0, SIDE]], look: [[0, PAGE], [5, { fx: 660, fy: 360, z: 1.05 }]] },
    { name: "share", at: at(45), end: at(47), tag: "03 / Community", lines: ["Share it.", "See where", "you stand."],
      chord: [65.41, 4], part: 3,
      shots: [[0, "community", 5.4, 1]],
      cam: [[0, SIDE]], look: [[0, PAGE]] },
    { name: "competition", at: at(47), end: at(50), tag: "03 / Community · Monthly competition", lines: ["Every month.", "One leaderboard."],
      chord: [73.42, 4], part: 3,
      shots: [[0, "community", 13.35, 0.34], [2.5, "community", 18.6, 1]],
      cam: [[0, SIDE]], look: [[0, { fx: 1010, fy: 275, z: 1.5 }], [2.49, { fx: 1010, fy: 275, z: 1.6 }], [2.5, PAGE], [7.5, { fx: 640, fy: 380, z: 1.04 }]] },
    { name: "november", at: at(50), end: at(52), kind: "words", lines: ["November's competition", "is open."], chord: [87.31, 4], part: 3 },

    // --- The rule and the close ----------------------------------------------------------------------
    { name: "rule", at: at(52), end: at(54), kind: "rule", lines: ["It explains.", "You decide."], chord: [58.27, 4], part: 4 },
    { name: "close", at: at(54), end: at(58), kind: "close", chord: [73.42, 4], part: 4 },
  ],
};
window.FILM.total = window.FILM.scenes.at(-1).end;

// The upright cut (1080 by 1920; Short, reel and X): the opening shortened, the three tools that are
// seen working, the competition and the close. The words sit at the top and the window below them,
// wider than the frame and moved in close on what is happening.
const UP = { x: 540, y: 1060, s: 0.84, ry: 0 };
window.FILM_V = {
  beat: BEAT,
  scenes: [
    { name: "morning", at: at(0), end: at(1), kind: "tabs", lines: ["Every", "morning."], chord: [73.42, 3], part: 0 },
    { name: "tabs", at: at(1), end: at(2), kind: "tabs", stack: ["Prices", "Headlines"], chord: [87.31, 4], part: 0 },
    { name: "toomuch", at: at(2), end: at(3), kind: "tabs", lines: ["Too much", "to read."], chord: [58.27, 4], part: 0 },
    { name: "built", at: at(3), end: at(4), kind: "logo", lines: ["So I built", "one place."], chord: [65.41, 4], part: 0 },
    { name: "title", at: at(4), end: at(5), kind: "title", chord: [73.42, 4], part: 0 },
    { name: "fundamentals", at: at(5), end: at(8), tag: "AI · Fundamentals Lab", lines: ["AI that reads", "the numbers.", "And invents none."],
      chord: [73.42, 3], part: 2,
      shots: [[0, "fundamentals", 12.0, 1], [2.5, "fundamentals", 26.75, 1]],
      cam: [[0, UP]], look: [[0, { fx: 546, fy: 383, z: 2.0 }], [2.49, { fx: 546, fy: 383, z: 2.1 }], [2.5, { fx: 643, fy: 436, z: 1.6 }],
                             [4.5, { fx: 643, fy: 436, z: 1.6 }], [7.5, { fx: 643, fy: 560, z: 1.6 }]] },
    { name: "radar", at: at(8), end: at(11), tag: "AI · Earnings Radar", lines: ["It reads the", "results release.", "In seconds."],
      chord: [87.31, 4], part: 2,
      shots: [[0, "radar", 5.4, 1], [4.375, "radar", 10.0, 1]],
      cam: [[0, UP]], look: [[0, { fx: 476, fy: 175, z: 2.0 }], [4.37, { fx: 476, fy: 175, z: 2.1 }], [4.375, { fx: 748, fy: 470, z: 1.28 }],
                             [7.5, { fx: 748, fy: 560, z: 1.3 }]] },
    { name: "playground", at: at(11), end: at(14), tag: "AI · Playground", lines: ["Ask in", "plain words.", "Get the board."],
      chord: [58.27, 4], part: 2,
      shots: [[0, "playground", 6.6, 1], [2.5, "playground", 12.85, 1], [5.0, "playground", 24.8, 1]],
      cam: [[0, UP]], look: [[0, { fx: 1000, fy: 640, z: 1.9 }], [2.49, { fx: 1000, fy: 640, z: 1.95 }], [2.5, { fx: 640, fy: 300, z: 1.45 }],
                             [4.99, { fx: 640, fy: 300, z: 1.5 }], [5.0, { fx: 640, fy: 420, z: 1.35 }], [7.5, { fx: 640, fy: 430, z: 1.4 }]] },
    { name: "competition", at: at(14), end: at(16), tag: "Community · Monthly competition", lines: ["Every month.", "One leaderboard."],
      chord: [73.42, 4], part: 3,
      shots: [[0, "community", 13.35, 0.34], [2.5, "community", 18.6, 1]],
      cam: [[0, UP]], look: [[0, { fx: 1015, fy: 290, z: 2.3 }], [2.49, { fx: 1015, fy: 290, z: 2.45 }], [2.5, { fx: 700, fy: 450, z: 1.4 }],
                             [5, { fx: 700, fy: 470, z: 1.45 }]] },
    { name: "close", at: at(16), end: at(19), kind: "close", chord: [73.42, 4], part: 4 },
  ],
};
window.FILM_V.total = window.FILM_V.scenes.at(-1).end;
})();
