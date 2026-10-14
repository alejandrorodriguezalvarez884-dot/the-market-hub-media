// What happens when: the picture (film.html) and the sound (sound.js) both read it, so a cut and
// its hit cannot drift apart. Times are seconds; the pulse is 120 a minute, so half a second is a
// beat and every cut falls on one. The last line of a scene's words is the one that lands with
// the hit. `field` is what the lines behind the words do in that scene.
window.REEL = {
  total: 18,
  scenes: [
    { name: "open", at: 0, end: 3, lines: ["Every second,", "the market", "moves."], field: "thread", chord: [73.42, 3] },
    { name: "noise", at: 3, end: 5.5, lines: ["Prices.", "Headlines.", "Hot takes."], field: "storm", chord: [87.31, 4] },
    { name: "tabs", at: 5.5, end: 8, lines: ["Ten tabs.", "Zero clarity."], field: "storm", chord: [58.27, 4] },
    { name: "whatif", at: 8, end: 10.5, lines: ["What if", "it all fit", "on one page?"], field: "gather", chord: [65.41, 4] },
    { name: "calm", at: 10.5, end: 13, lines: ["No noise.", "No hype.", "Just the market."], field: "thread", chord: [73.42, 3] },
    { name: "close", at: 13, end: 18, chord: [73.42, 4] },
  ],
};
