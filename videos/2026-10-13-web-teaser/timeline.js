// What happens when: the picture (reel.html) and the sound (sound.js) both read it, so a cut and
// its hit cannot drift apart. Times are seconds; the pulse is 120 a minute, so half a second is a
// beat and every cut falls on one.
//
// A scene with a `shot` shows that page of the site in a card, under its words. `scroll` is where
// the page is at each moment of the scene: [seconds into the scene, CSS pixels from the page's top].
// The last line of a scene's words is the one that lands with the hit.
window.REEL = {
  total: 25,
  scenes: [
    { name: "open", at: 0, end: 2.5, lines: ["The whole", "market.", "On one page."], chord: [73.42, 3] },
    { name: "today", at: 2.5, end: 5.5, tag: "Today", lines: ["Every move", "of the day.", "One scale."], shot: "today",
      scroll: [[0, 70], [0.9, 70], [2.1, 1050], [3.0, 1095]], chord: [73.42, 3] },
    { name: "markets", at: 5.5, end: 8, tag: "Markets", lines: ["Every market.", "One look."], shot: "markets",
      scroll: [[0, 120], [0.6, 120], [1.7, 780], [2.5, 815]], chord: [87.31, 4] },
    { name: "companies", at: 8, end: 10.5, tag: "Companies", lines: ["Any company.", "Every number."], shot: "quote",
      scroll: [[0, 90], [0.7, 90], [1.8, 470], [2.5, 500]], chord: [58.27, 4] },
    { name: "news", at: 10.5, end: 13, tag: "News", lines: ["The news.", "Already sorted."], shot: "news",
      scroll: [[0, 130], [0.5, 130], [1.6, 700], [2.5, 900]], chord: [65.41, 4] },
    { name: "opinion", at: 13, end: 15, tag: "Opinion", lines: ["What it means.", "Argued."], shot: "opinion",
      scroll: [[0, 300], [0.5, 300], [1.4, 895], [2.0, 930]], chord: [73.42, 3] },
    { name: "hub", at: 15, end: 18.5, tag: "My Hub · demo account", lines: ["Your portfolio.", "Only yours."], shot: "hub",
      scroll: [[0, 120], [1.3, 120], [2.5, 1650], [3.5, 1690]], chord: [58.27, 4] },
    { name: "tools", at: 18.5, end: 20.5, tag: "AI tools", lines: ["AI that reads", "the reports."], shot: "tools",
      scroll: [[0, 110], [0.6, 110], [1.5, 330], [2.0, 350]], chord: [65.41, 4] },
    { name: "close", at: 20.5, end: 25, chord: [73.42, 4] },
  ],
};
