// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): MSFT, daily, 2026.
window.EPISODE = {
  from: "2026-04-01",       // the first candle on the chart
  to: "2026-06-30",         // the last, once all is told
  run: "2026-04-17",        // the climb from about 370 to the ceiling
  hi1: "2026-04-22",        // high 433.70: the ceiling (no close above it from 22 Apr to 28 May, 26 sessions)
  hi2: "2026-04-28",        // high 429.92
  low1: "2026-04-30",       // low 398.01, the lowest of the range
  hi3: "2026-05-07",        // high 427.98
  hi4: "2026-05-15",        // high 428.17
  hi5: "2026-05-19",        // high 432.70
  jump: "2026-05-29",       // close 450.24: +5.4 %, +3.8 % over the ceiling; 79.7 M shares = 2.3 × the 20-session average (34.5 M)
  ask: "2026-06-01",        // the last candle before the question: close 460.52 (+6.2 % over the ceiling)
  fall: "2026-06-02",       // close 441.31
  back: "2026-06-03",       // close 427.34: back under the ceiling
  end: "2026-06-25",        // close 352.83: −23.4 % from 460.52, −18.6 % from the ceiling
  line: 433.70,             // the ceiling: the highest high from 22 Apr to 28 May
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Microsoft".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
