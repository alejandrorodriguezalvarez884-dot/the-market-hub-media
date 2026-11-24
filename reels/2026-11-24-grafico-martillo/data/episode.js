// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): AMZN, daily, 2025.
window.EPISODE = {
  from: "2025-01-15",       // the first candle on the chart
  to: "2025-03-14",         // the last, once all is told
  top: "2025-02-04",        // close 242.06, where the fall starts
  pre: "2025-02-24",        // close 212.71 (−12.1 % from 242.06)
  ask: "2025-02-25",        // the hammer, the last candle before the question: O 211.63 H 213.34 L 204.16 C 212.80; shadow 7.47 = 6.4 × body 1.17; volume 59.0 M (1.5 × 38.9 M)
  low: 204.16,              // the hammer's low (−4.0 % from 212.71)
  next: "2025-02-26",       // opens 214.94 (above the hammer's high 213.34), closes 214.35 (+0.7 %)
  feb27: "2025-02-27",      // close 208.74 (−2.6 %)
  under: "2025-03-04",      // close 203.80, under the hammer's low
  end: "2025-03-10",        // close 194.54 (−8.6 % from 212.80), low 190.85
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Amazon".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
