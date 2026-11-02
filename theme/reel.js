// What a daily reel's slide can do that plain CSS cannot. A slide loads this file last, before
// </body>:
//
//   <script src="../../../theme/reel.js"></script>
//
// As with the channel's videos (theme/slide.js), the film is not recorded while this plays: the
// page is told what its scene is (window.slideScene, from frames.py) and asked to draw itself at
// the time of each frame (window.slideAt), so the same slide always gives the same film.
//
// 1. Things that come in when the voice gets to them: data-say names a word of the scene's
//    narration ("petróleo"; accents and capitals do not matter), several words a phrase, "#2" the
//    second time it is said, "+0.3" or "-0.3" moves it, a plain number is seconds from the start.
//    The element's movement (.in, .pop, .fade, .hl, a .bar's <i>) starts then.
//
// 2. Figures that count up, written the Spanish way (28,6):
//      <span data-count="6.6" data-decimals="1" data-prefix="▼ " data-suffix=" %" data-say="seis"></span>
//
// 3. The background, drawn here on <canvas class="bg">, chosen by <body data-bg="...">:
//    tape (columns of figures running up), candles (a candlestick chart sliding by), grid (a
//    glowing floor under a rising line), city (towers at night) or plain. data-seed on the body
//    changes the drawing, so two scenes with the same background do not look the same. What it
//    draws is decoration, never data: no figure on it is real, and it is kept dim and blurred.
(() => {
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const root = document.documentElement;
  let scene = {};

  // --- When a word is said -----------------------------------------------------------------------
  const plain = (word) => word.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  window.slideMissing = [];
  const when = (cue) => {
    const text = String(cue).trim();
    if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
    const words = scene.words || [];
    if (!words.length) return 0;
    const [, phrase, nth, shift] = text.match(/^(.*?)(?:#(\d+))?([+-]\d+(?:\.\d+)?)?$/);
    const wanted = phrase.split(/[\s_]+/).map(plain).filter(Boolean);
    let left = Number(nth || 1);
    for (let n = 0; n + wanted.length <= words.length; n++) {
      if (wanted.every((w, k) => plain(words[n + k].word).startsWith(w)) && --left === 0) {
        return Math.max(0, words[n].at + Number(shift || 0));
      }
    }
    window.slideMissing.push(text);
    return 0;
  };

  // --- Figures that count up ---------------------------------------------------------------------
  let figures = [];
  const count = (seconds) => {
    for (const f of figures) {
      const part = clamp((seconds - f.at) / f.takes);
      const value = f.from + (f.to - f.from) * (1 - Math.pow(1 - part, 3));
      f.el.textContent = f.prefix + value.toLocaleString("es-ES", { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals, useGrouping: "always" }) + f.suffix;
    }
  };

  // --- The background ----------------------------------------------------------------------------
  const canvas = document.querySelector("canvas.bg");
  const kind = document.body.dataset.bg || "tape";
  const LIGHT = document.body.classList.contains("light");   // the lighter look: paper, darker strokes
  const ESSAY = document.body.classList.contains("essay");   // the essay look: the same drawings, in ink only
  const seedOf = (text) => [...text].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0), 2166136261);
  const random = (seed) => () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const seed = seedOf(kind + (document.body.dataset.seed || location.pathname.split("/").pop()));
  let paint = () => {};
  if (canvas) {
    canvas.width = 1160;
    canvas.height = 2000;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const rnd = random(seed);
    let UP = LIGHT ? "18,146,92" : "53,201,143", DOWN = LIGHT ? "224,68,47" : "255,107,87";
    let AMBER = LIGHT ? "194,124,0" : "242,193,78", SKY = LIGHT ? "47,127,214" : "99,179,255";
    const PAPER = ESSAY ? ["#f3f0e9", "#ebe6db", "#f7f5f0"] : LIGHT ? ["#f2ede3", "#e9e1d0", "#f6f2ea"] : null;
    if (ESSAY) { UP = DOWN = AMBER = SKY = "40,38,34"; }

    if (kind === "tape") {
      const cols = Array.from({ length: 7 }, (_, i) => ({
        x: 40 + i * 168 + rnd() * 30, speed: 18 + rnd() * 40, size: 34 + rnd() * 26,
        cells: Array.from({ length: 40 }, () => ({ v: (rnd() * 99).toFixed(rnd() < 0.5 ? 2 : 1), tint: rnd() })),
      }));
      const walk = new Array(80).fill(0);
      let y = 0.5;
      for (let i = 0; i < walk.length; i++) { y = clamp(y + (rnd() - 0.48) * 0.08, 0.15, 0.85); walk[i] = y; }
      paint = (t) => {
        ctx.fillStyle = LIGHT ? PAPER[0] : "#06101c"; ctx.fillRect(0, 0, W, H);
        ctx.filter = "blur(3px)";
        for (const c of cols) {
          ctx.font = `600 ${c.size}px ui-monospace, Menlo, monospace`;
          const step = c.size * 2.1, total = step * c.cells.length;
          c.cells.forEach((cell, n) => {
            const y2 = (((H - n * step - t * c.speed) % total) + total) % total;
            ctx.fillStyle = cell.tint < 0.18 ? `rgba(${UP},0.17)` : cell.tint < 0.3 ? `rgba(${DOWN},0.16)` : `rgba(${SKY},0.1)`;
            ctx.fillText(cell.v, c.x, y2);
          });
        }
        ctx.filter = "blur(0.6px)";
        ctx.strokeStyle = `rgba(${SKY},0.45)`; ctx.lineWidth = 5; ctx.beginPath();
        walk.forEach((v, i) => { const x = i * (W / (walk.length - 12)) - (t * 22) % (W / (walk.length - 12)); i ? ctx.lineTo(x, v * H) : ctx.moveTo(x, v * H); });
        ctx.stroke();
        ctx.filter = "none";
      };
    } else if (kind === "candles") {
      const n = 90, bars = [];
      let close = 0.55;
      for (let i = 0; i < n; i++) {
        const open = close; close = clamp(open + (rnd() - 0.49) * 0.06, 0.12, 0.88);
        bars.push({ open, close, high: Math.min(open, close) - rnd() * 0.03, low: Math.max(open, close) + rnd() * 0.03 });
      }
      paint = (t) => {
        ctx.fillStyle = LIGHT ? PAPER[0] : "#07090b"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = LIGHT ? "rgba(21,18,13,0.06)" : "rgba(255,255,255,0.05)"; ctx.lineWidth = 2;
        for (let y = 100; y < H; y += 160) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        const gap = 34, off = (t * 26) % gap, start = Math.floor(t * 26 / gap);
        ctx.filter = "blur(1px)";
        for (let i = 0; i < 40; i++) {
          const b = bars[(start + i) % n], x = i * gap - off, up = b.close < b.open;
          const color = up ? UP : DOWN;
          ctx.strokeStyle = `rgba(${color},0.5)`; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x + 11, b.high * H); ctx.lineTo(x + 11, b.low * H); ctx.stroke();
          ctx.fillStyle = `rgba(${color},0.42)`;
          ctx.fillRect(x, Math.min(b.open, b.close) * H, 22, Math.max(6, Math.abs(b.open - b.close) * H));
        }
        ctx.strokeStyle = `rgba(${AMBER},0.5)`; ctx.lineWidth = 4; ctx.beginPath();
        for (let i = 0; i < 40; i++) {
          let s = 0; for (let k = 0; k < 6; k++) s += bars[(start + i - k + n * 2) % n].close;
          const x = i * gap - off + 11, y = (s / 6) * H; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke(); ctx.filter = "none";
      };
    } else if (kind === "grid") {
      const pts = [];
      let v = 0.3;
      for (let i = 0; i < 60; i++) { v = clamp(v + (rnd() - 0.42) * 0.05, 0.05, 0.95); pts.push(v); }
      paint = (t) => {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        if (LIGHT) { g.addColorStop(0, PAPER[2]); g.addColorStop(0.55, PAPER[1]); g.addColorStop(1, PAPER[0]); }
        else { g.addColorStop(0, "#03060d"); g.addColorStop(0.55, "#071528"); g.addColorStop(1, "#02040a"); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const horizon = H * 0.58;
        ctx.strokeStyle = `rgba(${SKY},0.22)`; ctx.lineWidth = 2;
        for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 30, horizon); ctx.lineTo(W / 2 + i * 260, H); ctx.stroke(); }
        const run = (t * 0.35) % 1;
        for (let k = 0; k < 14; k++) {
          const p = (k + run) / 14, y = horizon + Math.pow(p, 2.2) * (H - horizon);
          ctx.globalAlpha = p; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const shown = clamp(0.35 + t / 12, 0, 1) * pts.length;
        ctx.shadowColor = `rgba(${AMBER},0.9)`; ctx.shadowBlur = 30;
        ctx.strokeStyle = `rgba(${AMBER},0.75)`; ctx.lineWidth = 6; ctx.beginPath();
        for (let i = 0; i < shown; i++) { const x = 60 + i * ((W - 120) / pts.length), y = horizon - pts[i] * horizon * 0.55; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke(); ctx.shadowBlur = 0;
      };
    } else if (kind === "city") {
      const towers = [], stars = [];
      let x = -20;
      while (x < W) { const w = 70 + rnd() * 120; towers.push({ x, w, h: 380 + rnd() * 760, lit: rnd() }); x += w + 6; }
      for (let i = 0; i < 120; i++) stars.push({ x: rnd() * W, y: rnd() * H * 0.45, r: rnd() * 2 + 0.5, p: rnd() * 6 });
      paint = (t) => {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        if (LIGHT) { g.addColorStop(0, "#f7f3ec"); g.addColorStop(0.6, "#ebe2cf"); g.addColorStop(1, "#e4dac5"); }
        else { g.addColorStop(0, "#050914"); g.addColorStop(0.6, "#0b1730"); g.addColorStop(1, "#05070c"); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        if (!LIGHT) for (const s of stars) { ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(t * 1.3 + s.p)})`; ctx.fillRect(s.x, s.y, s.r, s.r); }
        const base = H * 0.86, drift = Math.sin(t * 0.15) * 12;
        for (const tw of towers) {
          ctx.fillStyle = LIGHT ? "rgba(120,100,70,0.16)" : "#03050a"; ctx.fillRect(tw.x + drift, base - tw.h, tw.w, tw.h + 200);
          const r = random(Math.floor(tw.x * 1000));
          for (let wy = base - tw.h + 30; wy < base; wy += 34) for (let wx = tw.x + 14; wx < tw.x + tw.w - 14; wx += 26) {
            if (r() < 0.32 * (0.5 + tw.lit)) { ctx.fillStyle = `rgba(${AMBER},${0.25 + r() * 0.35})`; ctx.fillRect(wx + drift, wy, 10, 14); }
          }
        }
      };
    }
  }

  // --- The scene, once it is known ---------------------------------------------------------------
  window.slideSetup = () => {
    scene = window.slideScene || {};
    window.slideMissing = [];
    for (const el of document.querySelectorAll("[data-say]:not([data-count])")) {
      const at = `${when(el.dataset.say)}s`;
      el.style.setProperty("--at", at);
      for (const bar of el.querySelectorAll(".bar i")) bar.style.setProperty("--at", at);
    }
    figures = [...document.querySelectorAll("[data-count]")].map((el) => ({
      el,
      from: Number(el.dataset.from || 0),
      to: Number(el.dataset.count),
      at: el.dataset.say ? when(el.dataset.say) : Number(el.dataset.at || 0),
      takes: Number(el.dataset.for || 1.1),
      decimals: Number(el.dataset.decimals || 0),
      prefix: el.dataset.prefix || "",
      suffix: el.dataset.suffix || "",
    }));
    window.slideSeconds = Math.max(0, ...figures.map((f) => f.at + f.takes));
  };

  // --- What the film asks of the page ------------------------------------------------------------
  window.slideAt = (seconds) => {
    count(seconds);
    paint(seconds);
  };
  window.slideSetup();
  count(Infinity);   // opened in a browser, the slide shows its figures as they end
  paint(3);
})();
