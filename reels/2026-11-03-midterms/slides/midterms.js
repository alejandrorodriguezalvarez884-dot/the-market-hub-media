// This reel's own drawings (see midterms.css). Loaded after theme/reel.js, which gives the cues
// (data-say -> --at, data-count) and the clock (window.slideAt); this file adds to each scene:
//
//   the shared frame: the studio behind, the bug on top with the film's progress, and the crawl
//   at the foot, which runs on from scene to scene (window.slideScene.start: where the scene falls)
//
//   <div class="boxes" data-say="...">          the 20 midterms since 1946, ticked one by one
//   <div class="chamber" data-seats="100" data-d="47" data-p="53" data-up-d="13" data-up-p="22">
//                                               a half circle of seats; data-n lights them neutral,
//                                               data-mid marks the majority
//   <div class="chart" data-show="paths mean now low" data-say-paths=".." data-say-mean="..">
//                                               the S&P 500 around the 20 midterms (data/path.js)
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  };
  const html = (text) => { const t = document.createElement("template"); t.innerHTML = text.trim(); return t.content.firstChild; };

  // --- The shared frame ------------------------------------------------------------------------
  document.body.prepend(html(`<div class="studio"><div class="stripes"></div><div class="ghost">2026</div></div>`));
  document.body.append(html(`<header class="hud"><div class="badge"><div class="flag"><i></i><i></i></div>MIDTERMS <span>2026</span></div>
    <div class="live"><span class="dot"></span>Hoy vota EE. UU. · 3 nov</div><div class="progress"><i></i></div></header>`));
  const NEWS = [
    "<b>S&amp;P 500</b> 7.541 ▼ 0,5 % · cierre del lunes 2",
    "<b>POLYMARKET</b> 14:53 h España · Cámara: demócratas 94,5 % · Senado: demócratas 77,5 %",
    "<b>EN JUEGO</b> 435 escaños de la Cámara · 35 del Senado · 36 gobernadores",
    "<b>OPCIONES</b> movimiento esperado del S&amp;P 500 para el miércoles: ±0,8 %",
    "<b>ENCUESTAS</b> demócratas +8,9 puntos (Silver Bulletin, 2 nov)",
  ].join("<em>/</em>") + "<em>/</em>";
  const ticker = html(`<div class="ticker"><div class="who">The Market Hub</div><div class="crawl"><p>${NEWS}${NEWS}${NEWS}</p></div></div>`);
  document.body.append(ticker);
  const crawl = ticker.querySelector("p");
  const bar = document.querySelector(".hud .progress i");
  const SPEED = 95;   // pixels a second

  // --- 20 boxes --------------------------------------------------------------------------------
  const YEARS = ["1946", "1950", "1954", "1958", "1962", "1966", "1970", "1974", "1978", "1982",
                 "1986", "1990", "1994", "1998", "2002", "2006", "2010", "2014", "2018", "2022"];
  for (const box of document.querySelectorAll(".boxes")) {
    const step = Number(box.dataset.step || 90);
    YEARS.forEach((y, i) => {
      const d = document.createElement("div");
      d.textContent = y;
      if (y === "1946") d.className = "weak";   // +0,07 %: up, but barely
      d.style.animationDelay = `calc(var(--at) + ${i * step}ms)`;
      box.appendChild(d);
    });
  }

  // --- A chamber -------------------------------------------------------------------------------
  for (const box of document.querySelectorAll(".chamber[data-seats]")) {
    const total = Number(box.dataset.seats);
    const dem = Number(box.dataset.d || 0), rep = Number(box.dataset.p || 0);
    const upD = Number(box.dataset.upD || 0), upP = Number(box.dataset.upP || 0);
    const big = total > 200;
    const rows = big ? 11 : 5;
    const W = 870, R = 425, r0 = big ? 185 : 175;
    const svg = make("svg", { viewBox: `0 0 ${W} ${R + 34}` });
    box.prepend(svg);
    const radii = [...Array(rows)].map((_, i) => r0 + (R - r0) * (i / (rows - 1)));
    const sum = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map((rr) => Math.round((total * rr) / sum));
    counts[rows - 1] += total - counts.reduce((a, b) => a + b, 0);
    const seats = [];
    radii.forEach((rr, i) => {
      for (let k = 0; k < counts[i]; k++) {
        const a = Math.PI - (Math.PI * (k + 0.5)) / counts[i];
        seats.push({ a, x: W / 2 + rr * Math.cos(a), y: R + 14 - rr * Math.sin(a) });
      }
    });
    seats.sort((p, q) => q.a - p.a);   // left to right
    const size = big ? 10.5 : 24;
    const spread = Number(box.dataset.for || 1500) / total;
    seats.forEach((s, i) => {
      let side = "n";
      if (dem || rep) side = i < dem ? "d" : i >= total - rep ? "p" : "n";
      const up = (side === "d" && i >= dem - upD) || (side === "p" && i < total - rep + upP);
      const c = make("circle", { cx: s.x.toFixed(1), cy: s.y.toFixed(1), r: up ? size - 2 : size, class: `seat ${side}${up ? " up" : ""}` }, svg);
      c.style.animationDelay = `calc(var(--at) + ${Math.round(i * spread)}ms)`;
    });
    if (box.dataset.mid) {
      const g = make("g", { class: "show" }, svg);
      if (box.dataset.sayMid) g.dataset.say = box.dataset.sayMid;
      make("line", { x1: W / 2, x2: W / 2, y1: R + 14 - R - 30, y2: R + 14 - r0 + 30, class: "mid-line" }, g);
      const t = make("text", { x: W / 2, y: R + 14 - r0 + 74, "text-anchor": "middle", class: "mid-text" }, g);
      t.textContent = box.dataset.mid;
    }
  }

  // --- The chart of the 20 midterms ------------------------------------------------------------
  const M = window.MIDTERMS;
  for (const box of document.querySelectorAll(".chart[data-show]")) {
    if (!M) break;
    const show = box.dataset.show.split(/\s+/);
    const W = 870, H = Number(box.dataset.height || 700), padB = 50;
    const ymin = Number(box.dataset.ymin || 74), ymax = Number(box.dataset.ymax || 145);
    const xmin = M.from, xmax = M.to;
    const X = (d) => ((d - xmin) / (xmax - xmin)) * W;
    const Y = (v) => (1 - (Math.min(ymax, Math.max(ymin, v)) - ymin) / (ymax - ymin)) * (H - padB);
    const line = (values) => values.map((v, i) => `${i ? "L" : "M"}${X(M.from + i * M.step).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    const svg = make("svg", { viewBox: `0 0 ${W} ${H}` });
    box.prepend(svg);
    make("line", { x1: 0, x2: W, y1: Y(100), y2: Y(100), class: "zero" }, svg);
    make("line", { x1: X(0), x2: X(0), y1: 0, y2: H - padB, class: "vote" }, svg);
    const label = (x, text, anchor) => { make("text", { x, y: H - 10, "text-anchor": anchor, class: "axis" }, svg).textContent = text; };
    label(0, "ENERO", "start");
    label(X(0), "VOTACIÓN", "middle");
    label(W, "+1 AÑO", "end");
    const group = (name) => { const g = make("g", {}, svg); if (box.dataset[name]) g.dataset.say = box.dataset[name]; return g; };
    if (show.includes("paths")) {
      const g = group("sayPaths");
      M.paths.forEach((p, i) => {
        make("path", { d: line(p), class: "one draw fast", pathLength: 1 }, g).style.animationDelay = `calc(var(--at) + ${i * 60}ms)`;
      });
    }
    if (show.includes("now")) make("path", { d: line(M.y2026), class: "now show" }, group("sayNow"));
    if (show.includes("mean")) make("path", { d: line(M.mean), class: "mean draw", pathLength: 1 }, group("sayMean"));
    if (show.includes("low")) {
      const lo = M.mean.reduce((b, v, i) => (i * M.step + M.from < 0 && v < M.mean[b] ? i : b), 0);
      const g = group("sayLow");
      g.setAttribute("class", "slam");
      g.style.transformOrigin = `${X(M.from + lo * M.step)}px ${Y(M.mean[lo])}px`;
      make("circle", { cx: X(M.from + lo * M.step), cy: Y(M.mean[lo]), r: 14, class: "low" }, g);
      make("text", { x: X(M.from + lo * M.step) - 20, y: Y(M.mean[lo]) - 80, "text-anchor": "end", class: "lowtext" }, g).textContent = "FONDO: UN MES ANTES";
    }
  }

  // --- The clock -------------------------------------------------------------------------------
  const setup = window.slideSetup, at = window.slideAt;
  let start = 0, total = 0;
  window.slideSetup = () => {
    setup();
    const scene = window.slideScene || {};
    start = Number(scene.start || 0);
    total = Number(scene.total || 0);
  };
  window.slideAt = (seconds) => {
    at(seconds);
    const now = start + seconds;
    const width = crawl.scrollWidth / 3;
    crawl.style.transform = `translateX(${-((now * SPEED) % width)}px)`;
    bar.style.width = total ? `${Math.min(100, (now / total) * 100)}%` : "0";
  };
  window.slideSetup();   // reel.js has already drawn the figures as they end, for a slide opened by hand
})();
