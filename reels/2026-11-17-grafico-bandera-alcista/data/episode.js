// The episode this reel shows, the same in every scene (skill chart-reel): the days on the chart,
// where it stops for the question, and the prices the marks point at. Every price is a candle's,
// from data/candles.js (Yahoo Finance): META, daily, 2023.
window.EPISODE = {
  from: "2023-04-03",       // the first candle on the chart
  to: "2023-06-23",         // the last, once all is told
  base: "2023-04-26",       // the close before the gap: 209.40 (results, after the bell)
  gap: "2023-04-27",        // opens 239.89 (+14.6 %), closes 238.56 (+13.9 %); volume 71.2 M against 18.2 M a day from 04-05 to 04-25
  top: "2023-05-02",        // the flagpole's top: high 244.92 (+17.0 % from 209.40)
  topPrice: 244.92,
  flag0: "2023-05-03",      // the flag: 05-03 to 05-16, ten sessions
  flagLow: "2023-05-05",    // its lowest: 229.85 (6.2 % under the top)
  ask: "2023-05-16",        // the last candle before the question: close 238.82
  out: "2023-05-17",        // the first close above the flag's upper line: 242.49 (the line: 239.89)
  high: "2023-05-18",       // the first close above the top: 246.85
  jun1: "2023-06-01",       // close 272.61 (+12.4 % from 05-17's close)
  end: "2023-06-23",        // close 288.73 (+19.1 % from 05-17's close)
  dip: "2023-06-07",        // close 263.60, −2.8 % in a day
};
// The flag's two parallel lines (StockCharts: "the price action needs to be contained within two
// parallel trend lines"): the upper through the highs of 05-03 (241.75) and 05-15 (240.26), the
// lower parallel to it through the low of 05-05 (229.85). Counted in sessions; every candle from
// 05-03 to 05-16 is inside them.
window.flagAt = (day, which) => {
  const days = CANDLES.rows.map((r) => r[0]);
  const k = days.indexOf(day) - days.indexOf("2023-05-03");
  const slope = (240.26 - 241.75) / 8;
  return (which === "low" ? 229.85 - 2 * slope : 241.75) + slope * k;
};
window.flagLine = (which, to, extra) => Object.assign({ type: "path", color: which === "low" ? "sky" : "amber", width: 6,
  points: [["2023-05-03", flagAt("2023-05-03", which)], [to, flagAt(to, which)]] }, extra);
// The chart's options shared by every scene: the same axis, the same prices hidden until "Meta".
window.chartOf = (extra) => Object.assign({ from: EPISODE.from, to: EPISODE.to }, extra);
