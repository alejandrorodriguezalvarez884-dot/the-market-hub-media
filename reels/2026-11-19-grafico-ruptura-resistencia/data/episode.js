// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): ORCL, daily, 2024.
window.EPISODE = {
  from: "2024-06-13",       // the first candle on the chart
  to: "2024-10-15",         // the last, once all is told
  t1: "2024-06-18",         // first touch of the ceiling: high 145.06
  t2: "2024-07-05",         // high 145.79
  t3: "2024-07-15",         // the highest high under the ceiling: 146.59
  line: 146.59,             // the resistance: no close above it (nor above 145.03) from 06-13 to 09-09, 60 sessions
  drop: "2024-08-07",       // the lowest: low 125.75 (14.2 % under 146.59), close 125.90
  back: "2024-09-05",       // back at the ceiling: close 142.61
  ask: "2024-09-09",        // the last candle before the question: close 139.89 (4.6 % under the line)
  out: "2024-09-10",        // the break: opens 154.23, closes 155.89 (+11.4 %); volume 37.4 M against 6.0 M a day from 08-12 to 09-09
  sep16: "2024-09-16",      // close 170.33 (+21.8 % from 139.89)
  slip: "2024-09-13",       // opens 173.70, closes 162.03 (−6.7 % from the open)
  end: "2024-10-09",        // close 178.29 (+27.5 % from 139.89); from 09-10 to 10-15 the lowest low is 153.12, never back to the line
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Oracle".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
