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
// horizontal"): the line through the two lows of `data`, counted in sessions, at any day.
window.neckOf = (data, low1, low2, day) => {
  const days = data.rows.map((r) => r[0]);
  const at = (d) => days.findIndex((x) => x >= d);
  const a = at(low1), b = at(low2);
  const low = (d) => data.rows[at(d)][3];
  return low(low1) + (low(low2) - low(low1)) * (at(day) - a) / (b - a);
};
window.neckAt = (day) => neckOf(CANDLES, EPISODE.low1, EPISODE.low2, day);
// A path mark for the neckline, from its first low to `day`.
window.neckline = (day, extra) => Object.assign({ type: "path", color: "sky", width: 6,
  points: [[EPISODE.low1, neckAt(EPISODE.low1)], [day, neckAt(day)]] }, extra);

// Two other head and shoulders tops, where it did come true (scene 09-worked), each the same way:
// its two shoulders, its head, the two lows of its neckline, the first close under the line, and
// the lowest point after it before any close above the head. From data/candles-qcom.js and
// data/candles-coin.js (Yahoo Finance); each chart ends a few weeks after that low, before any lower one.
window.CASES = {
  QCOM: { from: "2024-04-15", to: "2024-08-19",
          ls: "2024-05-28", head: "2024-06-18", rs: "2024-07-16",   // highs 217.43, 230.63, 211.09
          low1: "2024-05-31", low2: "2024-06-27",                    // lows 198.71, 193.84
          breakout: "2024-07-19", close: 186.21,                     // the line that day: 189.78
          bottom: "2024-08-05", low: 151.39 },                       // -18.7 % from that close, 11 sessions later
  COIN: { from: "2021-08-02", to: "2022-03-31",
          ls: "2021-09-03", head: "2021-11-09", rs: "2021-12-27",   // highs 280.61, 368.90, 281.99
          low1: "2021-10-04", low2: "2021-12-20",                    // lows 224.51, 231.77
          breakout: "2022-01-07", close: 232.33,                     // the line that day: 233.52
          bottom: "2022-03-15", low: 150.12 },                       // -35.4 % from that close, 45 sessions later
};
// The marks every small chart has: its neckline, and an arrow from the break to the low.
window.caseMarks = (symbol, extra) => {
  const c = CASES[symbol], data = MORE_CANDLES[symbol];
  const pct = Math.round((c.low / c.close - 1) * 100);
  return [
    { type: "path", color: "sky", width: 5, points: [[c.low1, neckOf(data, c.low1, c.low2, c.low1)], [c.to, neckOf(data, c.low1, c.low2, c.to)]], ...extra },
    { type: "move", from: [c.breakout, c.close], to: [c.bottom, c.low], color: "down", label: `${pct} %`.replace("-", "−"), dx: -24, for: 0.8, ...extra },
  ];
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Nvidia".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
