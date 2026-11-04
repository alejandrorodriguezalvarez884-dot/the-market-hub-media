// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): NVDA, daily, adjusted for splits (10:1 on 2024-06-10).
window.EPISODE = {
  from: "2023-06-01",       // the first candle on the chart
  to: "2023-11-24",         // the last, once all is told
  ask: "2023-10-19",        // the last candle before the question: close 42.10, neckline at 41.48
  rise: "2023-06-07",       // the low before the rise: 37.36 (to the left shoulder's 48.09: +28.7 %)
  ls: "2023-07-14",         // left shoulder: high 48.09
  head: "2023-08-24",       // head: high 50.27
  rs: "2023-10-12",         // right shoulder: high 47.61 (1.0 % under the left one)
  low1: "2023-08-14",       // first low of the neckline: 40.31
  low2: "2023-09-21",       // second low of the neckline: 40.98
  headPrice: 50.266,
  breakout: "2023-10-20",   // first close under the neckline: 41.39 (the line: 41.50)
  bottom: "2023-10-31",     // the lowest after it: low 39.23
  above: "2023-11-20",      // first close above the head: 50.41 (+21.8 % from 2023-10-20's close)
};
// The neckline (StockCharts: "connecting low points 1 and 2"; it "can slope up, down, or be
// horizontal"): the line through the two lows, counted in sessions, at any day on the chart.
window.neckAt = (day) => {
  const days = CANDLES.rows.map((r) => r[0]);
  const at = (d) => days.findIndex((x) => x >= d);
  const a = at(EPISODE.low1), b = at(EPISODE.low2);
  const low = (d) => CANDLES.rows[at(d)][3];
  return low(EPISODE.low1) + (low(EPISODE.low2) - low(EPISODE.low1)) * (at(day) - a) / (b - a);
};
// A path mark for the neckline, from its first low to `day`.
window.neckline = (day, extra) => Object.assign({ type: "path", color: "sky", width: 6,
  points: [[EPISODE.low1, neckAt(EPISODE.low1)], [day, neckAt(day)]] }, extra);
// The chart's options shared by every scene: the same axis, the same prices hidden until "Nvidia".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
