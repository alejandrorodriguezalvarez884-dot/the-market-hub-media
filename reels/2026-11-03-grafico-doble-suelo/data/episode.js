// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): TSLA, daily.
window.EPISODE = {
  from: "2025-02-03",       // the first candle on the chart
  to: "2025-06-06",         // the last, once all is told
  ask: "2025-04-28",        // the last candle before the question
  low1: "2025-03-11",       // first bottom: low 217.02
  low2: "2025-04-07",       // second bottom: low 214.25
  rebound: "2025-03-27",    // the highest point between them: high 291.85
  line: 291.85,             // the "techo": that high (StockCharts: "the highest point between the troughs")
  floor: 214.25,            // the lower of the two lows: a close under it and the pattern fails
  breakout: "2025-04-29",   // first close above the line: 292.03
  top: "2025-05-27",        // highest close four weeks later: 362.89 (+24.3 %)
  drop: "2025-06-05",       // -14.3 % in a day: 332.05 to 284.70
};
// The chart's options shared by every scene: the same axis, the same prices hidden until "Tesla".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
