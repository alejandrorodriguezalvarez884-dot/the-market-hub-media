// A real candlestick chart for the chart-reading reels, "Lee el gráfico" (skill chart-reel), and
// the countdown that goes with them. A slide loads, in this order:
//
//   <script src="../data/candles.js"></script>        the candles, read by `make candles` (Yahoo Finance)
//   <script src="../../../theme/reel.js"></script>
//   <script src="../../../theme/chart.js"></script>
//   <script>
//     reelChart("canvas.chart", {
//       from: "2025-01-21", to: "2025-06-06",          // the days on the x axis: the same in every scene
//       show: [{ to: "2025-04-28", at: 0, for: 2.5 },   // the candles drawn so far, step by step
//              { to: "2025-06-06", say: "después", for: 4 }],
//       axis: { say: "tesla" },                        // prices and months, only from then (hidden before)
//       marks: [
//         { type: "level", price: 288.14, say: "techo", label: "Techo del rebote" },
//         { type: "ring", day: "2025-03-11", where: "low", say: "primer", label: "Suelo 1" },
//       ],
//     });
//   </script>
//
// It is drawn again at the time of every frame, like everything else in a reel (theme/reel.js):
// nothing plays by itself, so the same slide always gives the same film. A cue is a word of the
// scene's narration (say: "techo"; the same rules as data-say in reel.js) or seconds (at: 1.5).
//
// The candles are real and only real: every one comes from data/candles.js. What is drawn on top
// (lines, rings, notes, zones, paths) only points at them. Before `axis` is said there are no
// prices or dates on the chart, so whoever watches reads the shape, not the name.
//
// Marks, each with say or at (when it comes in) and an optional color (amber, up, down, ink, sky):
//   level   a horizontal line at `price`, drawn left to right, with `label` at its right end;
//           `from`/`to` (days) to draw only part of it, `dash: true` for a dashed one.
//   ring    a circle round the candle of `day`, at its `where` ("low", "high", "close") or a `price`; `label` under or over it.
//   note    a tag with `text` at `day` and `price` (or at the candle's "low"/"high"), `side` above or below.
//   zone    a band from day `from` to day `to`, the whole height, faintly coloured; `label` on top.
//   path    a line through `points` ([day, price] pairs), drawn over `for` seconds: the shape, traced.
//   move    an arrow from `from` to `to` ([day, price] each) with `label` beside it: how far it went.
//   hide    from `say`/`at`, the marks named in `marks` (their `id`) fade out.
//
// The countdown: <div class="countdown" data-say="0" data-from="5"></div> counts 5, 4, 3, 2, 1, a
// number a second from its cue, with a ring that empties each second. theme/chart.css draws it.
(() => {
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const ease = (p) => 1 - Math.pow(1 - clamp(p), 3);
  const charts = [];
  const counters = [];
  const cue = (thing, fallback = 0) => {
    if (!thing) return fallback;
    if (thing.say !== undefined) return window.slideWhen ? window.slideWhen(thing.say) : 0;
    if (thing.at !== undefined && typeof thing.at === "number") return thing.at;
    return fallback;
  };
  const css = (name, fallback) => getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;
  const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const money = (v) => v.toLocaleString("es-ES", { minimumFractionDigits: v < 100 ? 2 : 0, maximumFractionDigits: v < 100 ? 2 : 0, useGrouping: "always" });

  window.reelChart = (selector, options) => {
    const canvas = typeof selector === "string" ? document.querySelector(selector) : selector;
    const data = options.data || window.CANDLES;
    if (!canvas || !data) throw new Error("reelChart: no canvas or no candles (data/candles.js)");
    const rows = data.rows.filter((r) => (!options.from || r[0] >= options.from) && (!options.to || r[0] <= options.to));
    if (!rows.length) throw new Error(`reelChart: no candles from ${options.from} to ${options.to}`);
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.round(box.width);
    canvas.height = Math.round(box.height);
    const chart = { canvas, options, rows, index: new Map(rows.map((r, n) => [r[0], n])) };
    charts.push(chart);
    setup(chart);
    draw(chart, 0);
    return chart;
  };

  const dayAt = (chart, day) => {
    if (chart.index.has(day)) return chart.index.get(day);
    const n = chart.rows.findIndex((r) => r[0] >= day);   // a day with no candle: the next one
    return n < 0 ? chart.rows.length - 1 : n;
  };

  const setup = (chart) => {
    const o = chart.options;
    let last = -1;
    chart.steps = (o.show || [{ to: chart.rows[chart.rows.length - 1][0] }]).map((s) => {
      const step = { from: last, to: dayAt(chart, s.to), at: cue(s, 0), takes: Number(s.for || 0) };
      last = step.to;
      return step;
    });
    chart.axisAt = o.axis ? cue(o.axis, 0) : Infinity;
    chart.marks = (o.marks || []).map((m) => ({ ...m, at: cue(m, 0) }));
    chart.hides = chart.marks.filter((m) => m.type === "hide");
  };

  // How many candles are drawn at a time: the last step begun, grown from where the one before ended.
  const shown = (chart, t) => {
    let count = 0;
    for (const s of chart.steps) {
      if (t < s.at) break;
      const p = s.takes > 0 ? ease((t - s.at) / s.takes) : 1;
      count = s.from + 1 + (s.to - s.from) * p;
    }
    return count;
  };

  const draw = (chart, t) => {
    const { canvas, rows, options: o } = chart;
    const g = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const colors = {
      up: css("--up", "#12925c"), down: css("--down", "#e0442f"), amber: css("--amber", "#c27c00"),
      ink: css("--ink-strong", "#15120d"), sky: css("--sky", "#2f7fd6"), muted: css("--muted", "#6f695d"),
      faint: css("--card-line", "rgba(21,18,13,0.1)"),
    };
    const font = css("--sans", "sans-serif");
    const axis = clamp((t - chart.axisAt) / 0.5);
    const volume = o.volume ? 0.16 : 0;
    // The room for the prices is kept in every scene, said or not: the candles never move when they come.
    const pad = { left: 8, right: o.room === false ? 8 : 118, top: 30, bottom: 64 };
    const plotH = H - pad.top - pad.bottom;
    const priceH = plotH * (1 - volume);
    const lows = rows.map((r) => r[3]), highs = rows.map((r) => r[2]);
    const lo = o.low ?? Math.min(...lows), hi = o.high ?? Math.max(...highs);
    const span = hi - lo, bottom = lo - span * 0.06, top = hi + span * 0.06;
    const slot = (W - pad.left - pad.right) / rows.length;
    const X = (n) => pad.left + slot * (n + 0.5);
    const Y = (price) => pad.top + (top - price) / (top - bottom) * priceH;
    chart.X = X; chart.Y = Y;
    canvas.plotRight = W - pad.right;   // tags stay off the prices
    g.clearRect(0, 0, W, H);

    // The grid: faint lines, always; the prices on them and the months under, once said.
    g.lineWidth = 2;
    const ticks = niceTicks(bottom, top, 5);
    for (const v of ticks) {
      g.strokeStyle = colors.faint; g.beginPath(); g.moveTo(pad.left, Y(v)); g.lineTo(W - pad.right, Y(v)); g.stroke();
      if (axis > 0) {
        g.globalAlpha = axis; g.fillStyle = colors.muted; g.font = `600 26px ${font}`; g.textAlign = "left"; g.textBaseline = "middle";
        g.fillText(money(v), W - pad.right + 14, Y(v)); g.globalAlpha = 1;
      }
    }
    if (axis > 0) {
      g.globalAlpha = axis; g.fillStyle = colors.muted; g.font = `600 26px ${font}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
      let month = "";
      rows.forEach((r, n) => {
        const m = r[0].slice(0, 7);
        if (m !== month) {
          if (month) {
            g.strokeStyle = colors.faint; g.beginPath(); g.moveTo(X(n) - slot / 2, pad.top); g.lineTo(X(n) - slot / 2, H - pad.bottom + 10); g.stroke();
          }
          month = m;
          const name = MONTHS[Number(m.slice(5)) - 1] + (n === 0 || m.endsWith("-01") ? ` ${m.slice(2, 4)}` : "");
          g.fillText(name, Math.min(W - pad.right - 40, X(n) + slot * 9), H - 20);
        }
      });
      g.globalAlpha = 1;
    }

    // Zones under the candles.
    for (const m of chart.marks.filter((m) => m.type === "zone")) {
      const a = alpha(chart, m, t);
      if (a <= 0) continue;
      const x0 = X(dayAt(chart, m.from)) - slot / 2, x1 = X(dayAt(chart, m.to)) + slot / 2;
      g.globalAlpha = a * 0.13; g.fillStyle = colors[m.color || "amber"]; g.fillRect(x0, pad.top - 10, x1 - x0, plotH + 10);
      g.globalAlpha = a;
      if (m.label) pill(g, m.label, (x0 + x1) / 2, pad.top + 4, colors[m.color || "amber"], "#fff", font, 26, "top");
      g.globalAlpha = 1;
    }

    // The candles: as many as the time allows, the last one coming in.
    const count = shown(chart, t);
    const whole = Math.floor(count);
    const body = Math.max(2, slot * 0.66);
    const maxVol = volume ? Math.max(...rows.map((r) => r[5])) : 1;
    for (let n = 0; n < Math.min(rows.length, Math.ceil(count)); n++) {
      const [, open, high, low, close, vol] = rows[n];
      g.globalAlpha = n < whole ? 1 : count - whole;
      const color = close >= open ? colors.up : colors.down;
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = Math.max(2, slot * 0.16);
      g.beginPath(); g.moveTo(X(n), Y(high)); g.lineTo(X(n), Y(low)); g.stroke();
      const y0 = Y(Math.max(open, close)), y1 = Y(Math.min(open, close));
      g.fillRect(X(n) - body / 2, y0, body, Math.max(2, y1 - y0));
      if (volume) {
        const vh = (vol / maxVol) * plotH * volume * 0.9;
        g.globalAlpha *= 0.45; g.fillRect(X(n) - body / 2, pad.top + plotH - vh, body, vh);
      }
    }
    g.globalAlpha = 1;

    // What points at them.
    for (const m of chart.marks) {
      const a = alpha(chart, m, t);
      if (a <= 0 || m.type === "zone" || m.type === "hide") continue;
      const color = colors[m.color || "amber"];
      const p = ease((t - m.at) / (m.for || 0.6));
      g.globalAlpha = a;
      if (m.type === "level") {
        const x0 = m.from ? X(dayAt(chart, m.from)) - slot / 2 : pad.left;
        const x1 = m.to ? X(dayAt(chart, m.to)) + slot / 2 : W - pad.right;
        g.strokeStyle = color; g.lineWidth = 5; g.setLineDash(m.dash ? [18, 12] : []);
        g.beginPath(); g.moveTo(x0, Y(m.price)); g.lineTo(x0 + (x1 - x0) * p, Y(m.price)); g.stroke(); g.setLineDash([]);
        if (m.label && p > 0.6) {
          g.globalAlpha = a * clamp((p - 0.6) / 0.4);
          pill(g, m.label, m.labelAt ? X(dayAt(chart, m.labelAt)) : x1 - 10, Y(m.price) - 12, color, "#fff", font, 28, m.labelAt ? "bottom" : "bottom-right");
        }
      } else if (m.type === "ring") {
        const n = dayAt(chart, m.day);
        const price = typeof m.price === "number" ? m.price : rows[n][{ low: 3, high: 2, close: 4 }[m.where || "low"]];
        const r = (m.r || 46) * (0.6 + 0.4 * p);
        g.strokeStyle = color; g.lineWidth = 6;
        g.beginPath(); g.arc(X(n), Y(price), r, 0, Math.PI * 2 * p); g.stroke();
        if (m.label && p > 0.5) {
          const below = (m.side || (m.where === "high" ? "above" : "below")) === "below";
          pill(g, m.label, X(n), Y(price) + (below ? r + 14 : -r - 14), color, "#fff", font, 28, below ? "top" : "bottom");
        }
      } else if (m.type === "note") {
        const n = dayAt(chart, m.day);
        const price = typeof m.price === "number" ? m.price : rows[n][{ low: 3, high: 2, close: 4 }[m.price || "close"]];
        g.globalAlpha = a * p;
        pill(g, m.text, X(n), Y(price) + (m.side === "below" ? 16 : -16), color, m.ink || "#fff", font, m.size || 30, m.side === "below" ? "top" : "bottom");
      } else if (m.type === "path" || m.type === "move") {
        const pts = (m.type === "path" ? m.points : [m.from, m.to]).map(([day, price]) => [X(dayAt(chart, day)), Y(price)]);
        const along = ease((t - m.at) / (m.for || 1));
        const lengths = pts.slice(1).map((q, k) => Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]));
        let left = along * lengths.reduce((s, l) => s + l, 0);
        g.strokeStyle = color; g.lineWidth = m.width || 7; g.lineJoin = "round"; g.lineCap = "round";
        g.setLineDash(m.dash ? [16, 12] : []);
        g.beginPath(); g.moveTo(...pts[0]);
        let end = pts[0];
        for (let k = 1; k < pts.length && left > 0; k++) {
          const step = Math.min(1, left / lengths[k - 1]);
          end = [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * step, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * step];
          g.lineTo(...end);
          left -= lengths[k - 1];
        }
        g.stroke(); g.setLineDash([]);
        if (m.type === "move" && along > 0.05) {
          const [a0, a1] = pts, angle = Math.atan2(end[1] - a0[1], end[0] - a0[0]);
          g.fillStyle = color; g.beginPath();
          g.moveTo(end[0] + Math.cos(angle) * 10, end[1] + Math.sin(angle) * 10);
          g.lineTo(end[0] + Math.cos(angle + 2.5) * 30, end[1] + Math.sin(angle + 2.5) * 30);
          g.lineTo(end[0] + Math.cos(angle - 2.5) * 30, end[1] + Math.sin(angle - 2.5) * 30);
          g.fill();
          if (m.label && along > 0.7) pill(g, m.label, (a0[0] + a1[0]) / 2 + (m.dx || -20), (a0[1] + a1[1]) / 2, color, "#fff", font, 34, "right");
        }
      }
      g.globalAlpha = 1;
    }
  };

  // How much a mark shows at time t: in from its cue, out if a "hide" names it.
  const alpha = (chart, m, t) => {
    if (t < m.at) return 0;
    let a = clamp((t - m.at) / 0.35);
    for (const h of chart.hides) if (m.id && (h.marks || []).includes(m.id) && t >= h.at) a *= 1 - clamp((t - h.at) / 0.4);
    return a;
  };

  // A tag of text on a coloured pill; `anchor` says which of its sides sits on (x, y).
  const pill = (g, text, x, y, color, ink, font, size, anchor) => {
    g.font = `800 ${size}px ${font}`;
    const w = g.measureText(text).width + size * 0.9, h = size * 1.45;
    let left = x - w / 2, topY = y - h / 2;
    if (anchor === "top") topY = y;
    if (anchor === "bottom") topY = y - h;
    if (anchor === "bottom-right") { left = x - w; topY = y - h; }
    if (anchor === "right") { left = x - w; }
    left = clamp(left, 4, (g.canvas.plotRight || g.canvas.width) - w - 4);
    g.fillStyle = color; roundRect(g, left, topY, w, h, h / 2.6); g.fill();
    g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, left + w / 2, topY + h / 2 + size * 0.04);
  };
  const roundRect = (g, x, y, w, h, r) => {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  };
  const niceTicks = (low, high, wanted) => {
    const raw = (high - low) / wanted, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw) || raw;
    const out = [];
    for (let v = Math.ceil(low / step) * step; v <= high; v += step) out.push(Number(v.toFixed(6)));
    return out;
  };

  // --- The countdown -----------------------------------------------------------------------------
  const R = 120, ROUND = 2 * Math.PI * R;
  const countdowns = () => {
    for (const el of document.querySelectorAll(".countdown")) {
      if (!el.querySelector("svg")) {
        el.innerHTML = `<svg viewBox="0 0 300 300"><circle class="track" cx="150" cy="150" r="${R}"/>`
          + `<circle class="left" cx="150" cy="150" r="${R}" stroke-dasharray="${ROUND}" transform="rotate(-90 150 150)"/></svg><b></b>`;
      }
      counters.push(el);
    }
  };
  const tick = (t) => {
    for (const el of counters) {
      const from = Number(el.dataset.from || 5);
      const at = el.dataset.say ? (window.slideWhen ? window.slideWhen(el.dataset.say) : 0) : 0;
      const run = Math.max(0, t - at);
      const n = Math.max(1, from - Math.floor(run));
      const part = run >= from ? 1 : run % 1;
      el.querySelector("b").textContent = String(n);
      el.querySelector(".left").style.strokeDashoffset = String(ROUND * part);
      const beat = run >= from ? 0 : 1 - clamp((run % 1) / 0.25);
      el.style.setProperty("--beat", beat.toFixed(3));
    }
  };

  // --- Joined to the reel's clock ----------------------------------------------------------------
  const setupBefore = window.slideSetup, atBefore = window.slideAt;
  window.slideSetup = () => {
    setupBefore?.();
    for (const chart of charts) setup(chart);
  };
  window.slideAt = (seconds) => {
    atBefore?.(seconds);
    for (const chart of charts) draw(chart, seconds);
    tick(seconds);
  };
  countdowns();
  window.addEventListener("load", () => { for (const chart of charts) draw(chart, 30); tick(0); });
})();
