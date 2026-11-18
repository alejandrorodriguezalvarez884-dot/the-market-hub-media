// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): MU, daily, 2025.
window.EPISODE = {
  from: "2025-04-07",       // the first candle on the chart: low 61.54, the bottom before the rise
  to: "2025-10-10",         // the last, once all is told
  low0: "2025-04-07",       // low 61.54
  top1: "2025-06-26",       // the first peak: high 129.85 (+111.0 % from 61.54)
  top1Price: 129.85,
  trough: "2025-08-01",     // the lowest point between the peaks: low 103.38 (−20.4 % from 129.85): the support
  support: 103.38,
  top2: "2025-08-13",       // the second peak: high 128.60 (1.0 % under the first), 33 sessions later
  top2Price: 128.60,
  ask: "2025-08-21",        // the last candle before the question: close 115.79 (−10.0 % from 128.60; 12.0 % above the support)
  askClose: 115.79,
  over: "2025-09-05",       // the first close above the first peak: 131.37; it never closed under 115.79 in between
  overClose: 131.37,
  peak: "2025-10-08",       // close 196.54 (+49.6 % from 131.37)
  peakClose: 196.54,
  drop: "2025-10-10",       // close 181.60, −5.6 % from 10-09's 192.33
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Micron".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
// The two tops traced as an M: peak, trough, peak.
window.mPath = (extra) => Object.assign({ type: "path", color: "amber", width: 6,
  points: [[EPISODE.top1, EPISODE.top1Price], [EPISODE.trough, EPISODE.support], [EPISODE.top2, EPISODE.top2Price]] }, extra);
