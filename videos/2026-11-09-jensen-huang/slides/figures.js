// Stick figures for the long video of the Jensen Huang case, drawn here as lines, the way a
// storyboard sketches its actors. They are not anybody's likeness: no face, only a trait that tells
// who is who (the user, 2026-11-09: "con monigotes que simulan a Jensen y la amante y tal"), and
// every figure has its name written under it. Loaded after storyboard.js:
//
//   <div class="fig" data-who="huang" data-pose="talk" data-face="left" data-label="Huang"
//        data-sub="Nvidia" data-say="correo"></div>
//
//   data-who   huang (his black jacket), exec (the executive of Megaspeed, never named: a bob and
//              a badge), officer (a tie and a folder), reporter (a notebook), person (no trait),
//              staff (a lanyard), board (a jacket and a tie, smaller)
//   data-pose  stand, talk, wave, point, think, shrug, cross (arms crossed), read (a sheet in both
//              hands), phone, shake (a hand out to shake), sit (on a chair, hands forward), walk
//   data-face  left, to turn the figure round
//   class      sketch (a hypothesis: grey and dashed, as the reel's pencil), small, tiny, big, walk-in [from-right]
//
// The lines are drawn on from the moment the figure's word is said (--at, from theme/reel.js).
(() => {
  const S = [100, 96], HIP = [100, 182];
  const STAND_LEGS = [[[88, 236], [80, 288]], [[112, 236], [120, 288]]];
  const POSES = {
    //        left arm: elbow, hand      right arm: elbow, hand     legs (left, right): knee, foot
    stand:  { arms: [[[80, 140], [72, 184]], [[120, 140], [128, 184]]], legs: STAND_LEGS },
    talk:   { arms: [[[80, 140], [72, 184]], [[134, 124], [166, 104]]], legs: STAND_LEGS },
    wave:   { arms: [[[80, 140], [72, 184]], [[136, 70], [146, 30]]], legs: STAND_LEGS },
    point:  { arms: [[[80, 140], [72, 184]], [[142, 98], [186, 92]]], legs: STAND_LEGS },
    think:  { arms: [[[80, 140], [100, 150]], [[132, 132], [110, 84]]], legs: STAND_LEGS },
    shrug:  { arms: [[[66, 122], [52, 92]], [[134, 122], [148, 92]]], legs: STAND_LEGS },
    cross:  { arms: [[[76, 138], [122, 128]], [[124, 138], [80, 128]]], legs: STAND_LEGS },
    read:   { arms: [[[78, 140], [86, 120]], [[122, 140], [114, 120]]], legs: STAND_LEGS, hold: "sheet" },
    phone:  { arms: [[[80, 140], [72, 184]], [[134, 120], [118, 56]]], legs: STAND_LEGS, hold: "phone" },
    shake:  { arms: [[[80, 140], [72, 184]], [[132, 146], [170, 150]]], legs: STAND_LEGS },
    sit:    { arms: [[[118, 140], [156, 150]], [[124, 142], [162, 152]]], legs: [[[150, 184], [150, 244]], [[152, 186], [152, 246]]],
              seat: true },
    walk:   { arms: [[[86, 140], [104, 180]], [[116, 140], [94, 178]]], legs: [[[82, 234], [62, 288]], [[116, 232], [134, 286]]] },
  };
  const path = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L");
  const TRAITS = {
    huang: `<path class="jacket" d="M78 98 L122 98 L128 188 L72 188 Z"/><path class="lapel" d="M100 100 L92 132 M100 100 L108 132"/><path d="M76 34 Q100 12 124 34"/>`,
    exec: `<path d="M70 66 Q66 18 100 16 Q134 18 130 66"/><rect x="104" y="120" width="16" height="22" rx="2"/><path d="M100 98 L112 120"/>`,
    officer: `<path d="M100 98 L94 108 L100 150 L106 108 Z"/>`,
    reporter: `<path d="M74 34 Q100 18 126 34"/>`,
    staff: `<path d="M88 98 L100 128 L112 98"/><rect x="94" y="128" width="12" height="16" rx="2"/>`,
    board: `<path class="jacket" d="M80 98 L120 98 L124 186 L76 186 Z"/><path d="M100 98 L96 106 L100 140 L104 106 Z"/>`,
    person: ``,
  };
  const HOLD = {
    sheet: `<path d="M80 96 L120 96 L120 136 L80 136 Z"/><path d="M88 108 H112 M88 118 H112"/>`,
    phone: `<path d="M110 44 L124 44 L124 70 L110 70 Z"/>`,
  };
  for (const el of document.querySelectorAll(".fig[data-who]")) {
    const pose = POSES[el.dataset.pose] || POSES.stand;
    const seat = pose.seat ? `<path d="M60 186 H140 M68 186 V288 M132 186 V288 M60 120 V186"/>` : "";
    const lines = [
      `<circle cx="100" cy="48" r="28"/>`,
      `<path d="M100 76 L100 ${HIP[1]}"/>`,
      ...pose.arms.map(([elbow, hand]) => `<path d="${path([S, elbow, hand])}"/>`),
      ...pose.legs.map(([knee, foot]) => `<path d="${path([HIP, knee, foot])}"/>`),
      TRAITS[el.dataset.who] || "",
      pose.hold ? HOLD[pose.hold] : "",
      seat,
    ].join("");
    const turn = el.dataset.face === "left" ? ` transform="translate(200 0) scale(-1 1)"` : "";
    el.innerHTML = `<svg viewBox="0 -10 200 310"><g${turn}>${lines}</g></svg>` +
      (el.dataset.label ? `<div class="name">${el.dataset.label}${el.dataset.sub ? `<small>${el.dataset.sub}</small>` : ""}</div>` : "");
    el.querySelectorAll("svg g *").forEach((line, n) => {
      line.setAttribute("pathLength", "1");
      line.style.animationDelay = `calc(var(--at) + ${n * 0.07}s)`;
    });
  }

  // Props (class sketch for a hypothesis, up to float): <span class="prop" data-prop="laptop|table|desk|doc|chip|server|flag|money|envelope" data-label="..."></span>
  const PROPS = {
    laptop: [`<path d="M20 120 L140 120 L130 140 L30 140 Z"/><path d="M36 120 L44 60 L128 60 L120 120"/>`, 160, 150],
    table: [`<path d="M10 90 H190 M30 90 V150 M170 90 V150"/>`, 200, 150],
    doc: [`<path d="M30 14h60l24 24v100H30z"/><path d="M90 14v24h24"/><path d="M44 60h56M44 78h56M44 96h40M44 114h50"/>`, 140, 150],
    folder: [`<path d="M14 40 H60 L70 52 H130 V130 H14 Z"/><path d="M14 64 H130"/>`, 140, 140],
    chip: [`<rect x="40" y="40" width="70" height="70" rx="6"/><rect x="58" y="58" width="34" height="34" rx="3"/><path d="M56 40V24M75 40V24M94 40V24M56 126V110M75 126V110M94 126V110M40 56H24M40 75H24M40 94H24M126 56H110M126 75H110M126 94H110"/>`, 150, 150],
    server: [`<rect x="30" y="20" width="90" height="120" rx="6"/><path d="M30 50H120M30 80H120M30 110H120"/><path d="M44 35h8M44 65h8M44 95h8M44 125h8"/>`, 150, 150],
    box: [`<path d="M20 60 L80 30 L140 60 L80 90 Z"/><path d="M20 60 V120 L80 150 L140 120 V60 M80 90 V150"/>`, 160, 160],
    envelope: [`<rect x="14" y="40" width="120" height="80" rx="6"/><path d="M14 46 L74 90 L134 46"/>`, 150, 140],
    heart: [`<path d="M75 130 C20 90 20 40 50 34 C64 31 72 42 75 52 C78 42 86 31 100 34 C130 40 130 90 75 130 Z"/>`, 150, 150],
    eye: [`<path d="M14 80 Q80 20 146 80 Q80 140 14 80 Z"/><circle cx="80" cy="80" r="22"/>`, 160, 160],
    arrow: [`<path d="M10 80 H150 M120 50 L150 80 L120 110"/>`, 160, 160],
  };
  for (const el of document.querySelectorAll(".prop[data-prop]")) {
    const [lines, w, h] = PROPS[el.dataset.prop] || ["", 150, 150];
    const label = el.dataset.label ? `<text x="${w / 2}" y="${h + 14}" text-anchor="middle">${el.dataset.label}</text>` : "";
    el.style.setProperty("--w", `${el.dataset.w || w}px`);
    el.style.setProperty("--h", `${(el.dataset.w ? el.dataset.w * h / w : h) + (label ? 28 : 0)}px`);
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h + (label ? 28 : 0)}">${lines}${label}</svg>`;
    el.querySelectorAll("svg path, svg rect, svg circle").forEach((line, n) => {
      line.setAttribute("pathLength", "1");
      line.style.animationDelay = `calc(var(--at) + ${n * 0.08}s)`;
    });
  }
})();
