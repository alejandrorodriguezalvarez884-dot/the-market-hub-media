// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): AAPL, daily, 2025.
window.EPISODE = {
  from: "2025-05-01",       // the first candle on the chart
  to: "2025-08-29",         // the last, once all is told
  hi1: "2025-05-14",        // high 213.94, first touch of the ceiling
  low1: "2025-05-23",       // low 193.46, first trough
  low2: "2025-06-18",       // low 195.07 (+0.8 % over 193.46)
  hi2: "2025-07-07",        // high 216.23, the highest high from 13 May to 5 Aug (no close above 214.40 in those 58 sessions)
  hi3: "2025-07-24",        // high 215.69
  low3: "2025-08-01",       // low 201.50 (+3.3 % over 195.07); close 202.38, −2.5 % on the day
  ask: "2025-08-05",        // the last candle before the question: close 202.92
  jump: "2025-08-06",       // close 213.25 (+5.1 %), 108.5 M shares = 2.1 × the 20-session average (51.4 M)
  out: "2025-08-07",        // close 220.03, the first above the ceiling (+1.8 % over 216.23)
  end: "2025-08-13",        // close 233.33: +15.0 % over 202.92 (the day of the question), +6.0 % over 220.03
  line: 216.23,             // the ceiling: the highest high of the triangle
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Apple".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
