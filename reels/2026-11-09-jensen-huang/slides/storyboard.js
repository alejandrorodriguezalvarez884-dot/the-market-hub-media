// This reel's own sheet (see storyboard.css). Loaded after theme/reel.js, which gives the cues
// (data-say -> --at, data-count) and the clock (window.slideAt). This file adds to each scene:
//
//   the paper; on top, STORYBOARD, the case and the sheet's number (<body data-sheet="3">), with
//   a pencil line for the film's progress (window.slideScene.start and .total)
//
//   the three marks under it; those the scene does not use are dimmed: <body data-marks="ok press maybe">
//
//   a strip of film at the foot with the case's dates; the scene's own lit: <body data-step="5">
//   (or "3,4"); the ones before it, filled
//
//   <span class="draw" data-draw="building|chip|doc|news|mail|board|question|calendar|capitol">
//                                     a line drawing made here, drawn on when its word is said
//
//   a hand-drawn wobble (#rough) for borders and drawings
(() => {
  const html = (text) => { const t = document.createElement("template"); t.innerHTML = text.trim(); return t.content.firstChild; };
  const body = document.body;

  // --- The wobble ------------------------------------------------------------------------------
  body.prepend(html(`<svg width="0" height="0" style="position:absolute"><filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="7"/>
    <feDisplacementMap in="SourceGraphic" scale="5"/></filter></svg>`));

  // --- The sheet -------------------------------------------------------------------------------
  body.prepend(html(`<div class="paper"></div>`));
  const sheet = String(body.dataset.sheet || "").padStart(2, "0");
  body.append(html(`<header class="sheet"><div class="row"><span>Storyboard</span><span class="case">El caso Jensen Huang</span>
    <span class="no">Hoja ${sheet} / 10</span></div><div class="line"><i></i></div></header>`));
  const marks = (body.dataset.marks || "").split(/\s+/).filter(Boolean);
  const key = html(`<div class="key"><span class="ok">Confirmado</span><span class="press">Según la prensa</span><span class="maybe">A lápiz: hipótesis</span></div>`);
  if (marks.length) for (const span of key.children) if (!marks.includes(span.className)) span.classList.add("dim");
  body.append(key);

  const DATES = ["Antes", "Primavera<br>2026", "29 oct", "6 nov", "8 nov", "Hoy<br>9 nov", "17-18<br>nov"];
  const lit = (body.dataset.step || "").split(",").filter(Boolean).map(Number);   // 1-based
  const last = lit.length ? Math.max(...lit) : 0;
  const film = html(`<div class="film"><div class="frames"></div></div>`);
  DATES.forEach((label, i) => {
    const f = html(`<div class="f">${label}</div>`);
    if (lit.includes(i + 1)) f.classList.add("now");
    else if (i + 1 < last) f.classList.add("past");
    film.firstChild.appendChild(f);
  });
  body.append(film);

  // --- Drawings --------------------------------------------------------------------------------
  const DRAWINGS = {
    building: `<path d="M22 108V40l34-14v82"/><path d="M56 108V30h42v78"/><path d="M8 108h112"/><path d="M66 44h8M84 44h8M66 60h8M84 60h8M66 76h8M84 76h8M32 54h12M32 70h12M32 86h12"/>`,
    chip: `<rect x="34" y="34" width="60" height="60" rx="6"/><rect x="50" y="50" width="28" height="28" rx="3"/><path d="M48 34V20M64 34V20M80 34V20M48 108V94M64 108V94M80 108V94M34 48H20M34 64H20M34 80H20M108 48H94M108 64H94M108 80H94"/>`,
    doc: `<path d="M30 14h48l20 20v80H30z"/><path d="M78 14v20h20"/><path d="M42 50h44M42 64h44M42 78h30M42 92h40"/>`,
    news: `<rect x="14" y="24" width="88" height="80" rx="4"/><path d="M102 40h12v56a8 8 0 0 1-16 0"/><path d="M26 38h64M26 54h28M26 68h28M26 82h28"/><path d="M64 54h26v28H64z"/>`,
    mail: `<rect x="14" y="30" width="100" height="68" rx="6"/><path d="M14 36l50 36 50-36"/>`,
    board: `<path d="M64 14l50 22H14z"/><path d="M24 42v48M46 42v48M82 42v48M104 42v48"/><path d="M14 96h100M8 110h112"/>`,
    question: `<circle cx="64" cy="64" r="48"/><path d="M48 50a16 16 0 1 1 24 14c-6 4-8 7-8 14M64 92v2"/>`,
    calendar: `<rect x="16" y="26" width="96" height="84" rx="6"/><path d="M16 50h96M42 16v18M86 16v18"/><path d="M36 70h12M58 70h12M80 70h12M36 90h12M58 90h12"/>`,
    capitol: `<path d="M64 10v12M40 54a24 24 0 0 1 48 0M30 54h68"/><path d="M36 54v40M50 54v40M64 54v40M78 54v40M92 54v40"/><path d="M22 100h84M14 112h100"/>`,
  };
  for (const el of document.querySelectorAll(".draw[data-draw]")) {
    el.innerHTML = `<svg viewBox="0 0 128 128">${DRAWINGS[el.dataset.draw] || ""}</svg>`;
    el.querySelectorAll("svg *").forEach((line, n) => {
      line.setAttribute("pathLength", "1");
      line.style.animationDelay = `calc(var(--at) + ${n * 0.12}s)`;
    });
  }
  for (const line of document.querySelectorAll("svg.spark path.line")) line.setAttribute("pathLength", "1");

  // --- The clock -------------------------------------------------------------------------------
  const bar = document.querySelector(".sheet .line i");
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
    bar.style.width = total ? `${Math.min(100, ((start + seconds) / total) * 100)}%` : "0";
  };
  window.slideSetup();
})();
