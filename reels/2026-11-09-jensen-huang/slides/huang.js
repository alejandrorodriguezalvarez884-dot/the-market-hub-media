// This reel's own frame (see huang.css). Loaded after theme/reel.js, which gives the cues
// (data-say -> --at, data-count) and the clock (window.slideAt). This file adds to each scene:
//
//   the room behind; on top, REC, the case and a timecode that runs on from scene to scene
//   (window.slideScene.start: where the scene falls in the film), with the film's progress
//
//   the three marks under it; the ones the scene uses are lit: <body data-marks="ok press maybe">
//
//   the case's dates at the foot; the scene's own lit: <body data-step="5"> (or "3,4"); the ones
//   before it, filled
//
//   <i class="icon" data-icon="building|chip|doc|news|mail|board|question|calendar|capitol">
//                                     a line drawing, made here
(() => {
  const html = (text) => { const t = document.createElement("template"); t.innerHTML = text.trim(); return t.content.firstChild; };
  const body = document.body;

  // --- The frame -------------------------------------------------------------------------------
  body.prepend(html(`<div class="room"><div class="ghost">NVDA</div><div class="grain"></div></div>`));
  body.append(html(`<header class="hud"><div class="row"><span class="rec"><i></i>REC</span><span class="what">Reconstrucción</span>
    <span class="case">· Caso Nvidia</span><span class="tc">00:00</span></div><div class="progress"><i></i></div></header>`));
  const marks = (body.dataset.marks || "").split(/\s+/);
  const legend = html(`<div class="legend"><span class="ok">Confirmado</span><span class="press">Según la prensa</span><span class="maybe">Hipótesis</span></div>`);
  for (const span of legend.children) if (marks.includes(span.className)) span.classList.add("on");
  body.append(legend);

  const STOPS = ["Antes", "Primavera<br>2026", "29 oct", "6 nov", "8 nov", "Hoy<br>9 nov", "17-18<br>nov"];
  const lit = (body.dataset.step || "").split(",").filter(Boolean).map(Number);   // 1-based
  const last = lit.length ? Math.max(...lit) : 0;
  const timeline = html(`<div class="timeline"><div class="rail"><i></i></div></div>`);
  STOPS.forEach((label, i) => {
    const n = i + 1;
    const stop = html(`<div class="stop">${label}</div>`);
    stop.style.left = `${20 + (i / (STOPS.length - 1)) * 920}px`;
    if (lit.includes(n)) stop.classList.add("now");
    else if (n < last) stop.classList.add("past");
    timeline.appendChild(stop);
  });
  timeline.querySelector(".rail i").style.setProperty("--fill", last ? `${((last - 1) / (STOPS.length - 1)) * 100}%` : "0%");
  body.append(timeline);

  // --- Icons -----------------------------------------------------------------------------------
  const ICONS = {
    building: `<path d="M22 108V40l34-14v82M56 108V30h42v78M10 108h108M66 44h8M84 44h8M66 60h8M84 60h8M66 76h8M84 76h8M32 54h12M32 70h12M32 86h12"/>`,
    chip: `<rect x="34" y="34" width="60" height="60" rx="6"/><rect x="50" y="50" width="28" height="28" rx="3"/><path d="M48 34V20M64 34V20M80 34V20M48 108V94M64 108V94M80 108V94M34 48H20M34 64H20M34 80H20M108 48H94M108 64H94M108 80H94"/>`,
    doc: `<path d="M30 14h48l20 20v80H30z"/><path d="M78 14v20h20M42 50h44M42 64h44M42 78h30M42 92h40"/>`,
    news: `<rect x="14" y="24" width="88" height="80" rx="4"/><path d="M102 40h12v56a8 8 0 0 1-16 0M26 38h64M26 54h28M26 68h28M26 82h28M64 54h26v28H64z"/>`,
    mail: `<rect x="14" y="30" width="100" height="68" rx="6"/><path d="M14 36l50 36 50-36"/>`,
    board: `<path d="M64 14l50 22H14z"/><path d="M24 42v48M46 42v48M82 42v48M104 42v48M14 96h100M8 110h112"/>`,
    question: `<circle cx="64" cy="64" r="48"/><path d="M48 50a16 16 0 1 1 24 14c-6 4-8 7-8 14M64 92v2"/>`,
    calendar: `<rect x="16" y="26" width="96" height="84" rx="6"/><path d="M16 50h96M42 16v18M86 16v18M36 70h12M58 70h12M80 70h12M36 90h12M58 90h12"/>`,
    capitol: `<path d="M64 10v12M40 54a24 24 0 0 1 48 0M30 54h68M36 54v40M50 54v40M64 54v40M78 54v40M92 54v40M22 100h84M14 112h100"/>`,
  };
  for (const el of document.querySelectorAll(".icon[data-icon]")) {
    el.innerHTML = `<svg viewBox="0 0 128 128">${ICONS[el.dataset.icon] || ""}</svg>`;
  }

  // --- The clock -------------------------------------------------------------------------------
  const tc = document.querySelector(".hud .tc");
  const bar = document.querySelector(".hud .progress i");
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
    const s = Math.floor(now);
    tc.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    bar.style.width = total ? `${Math.min(100, (now / total) * 100)}%` : "0";
  };
  window.slideSetup();
})();
