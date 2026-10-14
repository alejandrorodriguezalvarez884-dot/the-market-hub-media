// What happens when: the picture (film.html) and the sound (sound.js) both read it, so a cut and
// its hit cannot drift apart. Times are seconds; the pulse is 120 a minute, so half a second is a
// beat and every cut falls on one. The last line of a scene's words is the one that lands with
// the hit. `field` is what the lines behind the words do in that scene. The bass climbs to the
// close: B flat, C, D.
window.REEL = {
  total: 20.5,
  scenes: [
    { name: "open", at: 0, end: 3, lines: ["The market", "speaks in", "numbers."], field: "thread", chord: [73.42, 3] },
    { name: "noise", at: 3, end: 5.5, lines: ["Prices.", "Filings.", "Headlines."], field: "storm", chord: [87.31, 4] },
    { name: "tabs", at: 5.5, end: 8, lines: ["Too much", "to read."], field: "storm", chord: [58.27, 4] },
    { name: "ai", at: 8, end: 10.5, lines: ["Now AI", "reads it", "for you."], field: "gather", chord: [65.41, 4] },
    { name: "explain", at: 10.5, end: 13, lines: ["What moved.", "Why it matters.", "In plain words."], field: "thread", chord: [58.27, 4] },
    { name: "decide", at: 13, end: 15.5, lines: ["It explains.", "You decide."], field: "thread", chord: [65.41, 4] },
    { name: "close", at: 15.5, end: 20.5, chord: [73.42, 4] },
  ],
};
