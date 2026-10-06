// The presenter: the channel's host, drawn here. Nobody's face.
//
//   <div class="presenter" data-cues="0:wave nobody:explain decide:rest"></div>
//
// A slide loads this file before theme/slide.js, which mounts him and asks him to draw himself at
// the time of each frame. He is a rig, not a set of pictures: every frame is worked out from the
// time and from the voice of the scene, so the same scene always gives the same film.
//
// - His mouth follows the voice: how loud it is opens it, how sharp it is (an s, an f) closes it
//   on the teeth. His head and his brows follow the stress of the voice.
// - He blinks, breathes, and glances now and then at what the slide shows (data-look="left",
//   "right", "up" or "down"; left if not said).
// - data-cues says what he does with his hands and when: "when:pose", apart by spaces. "when" is
//   a number of seconds or a word of the narration (see theme/slide.js); the poses are POSES below.
(() => {
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => k * k * (3 - 2 * k);
  // A number between 0 and 1 that is always the same for the same n: chance without chance.
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const rad = (degrees) => degrees * Math.PI / 180;

  // An arm: [shoulder, elbow, hand, thumb, index, middle, ring, little].
  // shoulder: how far the upper arm swings out from hanging straight down, in degrees.
  // elbow: how far the forearm bends on from there (90 is level, 180 folds it up).
  // hand: how far the hand turns on from the forearm. thumb: 0 tucked, 1 out, 2 straight up from
  // a fist. The fingers: 0 curled, 1 straight.
  const DOWN = [8, 6, 0, 1, 1, 1, 1, 1];
  const POSES = {
    rest:    { right: DOWN, left: DOWN },
    explain: { right: [18, 100, 34, 1, 1, 1, 1, 1], left: [18, 100, 34, 1, 1, 1, 1, 1] },   // both palms open
    open:    { right: [18, 104, 36, 1, 1, 1, 1, 1], left: DOWN },                           // one palm open
    wave:    { right: [30, 140, 0, 1, 1, 1, 1, 1], left: DOWN },
    point:   { right: DOWN, left: [20, 96, 0, 0, 1, 0, 0, 0] },                             // at the slide, to his side
    one:     { right: [24, 150, 0, 0, 1, 0, 0, 0], left: DOWN },                            // a finger up: the first thing, or "listen"
    two:     { right: [24, 150, 0, 0, 1, 1, 0, 0], left: DOWN },
    three:   { right: [24, 150, 0, 0, 1, 1, 1, 0], left: DOWN },
    thumb:   { right: [22, 156, -90, 2, 0, 0, 0, 0], left: DOWN },
    shrug:   { right: [20, 122, 62, 1, 1, 1, 1, 1], left: [20, 122, 62, 1, 1, 1, 1, 1], shoulders: 1 },
  };
  const TURN = 0.42;   // seconds from one pose to the next

  const SKIN = "#e3ad87", SKIN_SHADE = "#c98d68", SKIN_LINE = "#b0744f";
  const HAIR = "#2b211c", HAIR_LIGHT = "#4b3a30";
  const CLOTH = "#ece7dc", CLOTH_SHADE = "#cdc6b6", CLOTH_LINE = "#b3ab99", TEE = "#16191c";

  let made = 0;
  const hand = () => `
      <g class="p-hand">
        <rect class="p-thumb" x="-7.5" width="15" rx="7.5" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="2"/>
        ${[0, 1, 2, 3].map((n) => `<rect class="p-finger" x="${-28 + n * 14.2}" width="13.4" rx="6.7" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="2"/>`).join("")}
        <rect x="-29" y="-52" width="58" height="58" rx="17" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="2"/>
        <path d="M-14 -30 Q0 -22 16 -30" stroke="${SKIN_SHADE}" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>`;
  const arm = (side) => `
    <g class="p-arm p-${side}"${side === "left" ? ' transform="translate(600 0) scale(-1 1)"' : ""}>
      <line class="p-upper" stroke="${CLOTH_LINE}" stroke-width="86" stroke-linecap="round"/>
      <line class="p-fore" stroke="${CLOTH_LINE}" stroke-width="76" stroke-linecap="round"/>
      ${hand()}
      <line class="p-upper" stroke="${CLOTH}" stroke-width="78" stroke-linecap="round"/>
      <line class="p-fore" stroke="${CLOTH}" stroke-width="68" stroke-linecap="round"/>
      <line class="p-cuff" stroke="${CLOTH_SHADE}" stroke-width="72" stroke-linecap="butt"/>
    </g>`;

  const draw = (id) => `
<svg viewBox="0 0 600 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <clipPath id="${id}-eye-l"><ellipse cx="256" cy="255" rx="21" ry="19"/></clipPath>
    <clipPath id="${id}-eye-r"><ellipse cx="344" cy="255" rx="21" ry="19"/></clipPath>
    <clipPath id="${id}-lid-l"><rect class="p-lid" x="228" y="230" width="56" height="0"/></clipPath>
    <clipPath id="${id}-lid-r"><rect class="p-lid" x="316" y="230" width="56" height="0"/></clipPath>
    <clipPath id="${id}-mouth"><path class="p-mouth-shape"/></clipPath>
    <clipPath id="${id}-face"><path d="M210 236 C210 146 390 146 390 236 L390 276 C390 332 348 380 300 380 C252 380 210 332 210 276 Z"/></clipPath>
  </defs>
  <g class="p-body">
    <!-- the hood, behind the neck -->
    <path d="M194 492 C204 452 226 416 254 402 L346 402 C374 416 396 452 406 492 C352 510 248 510 194 492 Z" fill="${CLOTH_SHADE}"/>
    <path d="M238 482 C242 452 252 430 268 418 L332 418 C348 430 358 452 362 482 Z" fill="${CLOTH_LINE}"/>
    <!-- the body -->
    <path class="p-torso" d="M92 720 C96 604 112 512 192 478 C230 462 258 452 270 444 L330 444 C342 452 370 462 408 478 C488 512 504 604 508 720 Z" fill="${CLOTH}"/>
    <path d="M408 478 C488 512 504 604 508 720 L452 720 C452 640 440 548 408 478 Z" fill="${CLOTH_SHADE}" opacity="0.6"/>
    <ellipse cx="300" cy="472" rx="56" ry="26" fill="${TEE}"/>
    <!-- the neck -->
    <path d="M262 340 L262 446 C278 470 322 470 338 446 L338 340 Z" fill="${SKIN_SHADE}"/>
    <path d="M262 380 C286 402 322 400 338 372 L338 392 C322 416 284 418 262 402 Z" fill="${SKIN_LINE}" opacity="0.55"/>
    <!-- the hood's rim, over the body, and its strings -->
    <path d="M206 474 C236 500 276 510 300 510 C324 510 364 500 394 474 C386 524 338 548 300 548 C262 548 214 524 206 474 Z" fill="${CLOTH}" stroke="${CLOTH_LINE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M270 538 C268 572 264 598 266 628" stroke="var(--accent, #c6f24e)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M330 538 C332 568 336 590 333 614" stroke="var(--accent, #c6f24e)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <rect x="261" y="626" width="10" height="16" rx="3" fill="${CLOTH_LINE}"/><rect x="328" y="612" width="10" height="16" rx="3" fill="${CLOTH_LINE}"/>
    <g class="p-head"><g transform="translate(300 420) scale(1.17) translate(-300 -404)">
      <ellipse cx="208" cy="266" rx="15" ry="25" fill="${SKIN}"/><ellipse cx="392" cy="266" rx="15" ry="25" fill="${SKIN_SHADE}"/>
      <path d="M204 262 C202 270 204 280 210 284" stroke="${SKIN_LINE}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- the hair behind, and short at the sides -->
      <path d="M203 250 C190 170 224 110 300 108 C376 110 410 170 397 250 L390 244 C390 190 360 160 300 160 C240 160 210 190 210 244 Z" fill="${HAIR}"/>
      <path d="M210 236 C210 146 390 146 390 236 L390 276 C390 332 348 380 300 380 C252 380 210 332 210 276 Z" fill="${SKIN}"/>
      <g clip-path="url(#${id}-face)">
        <path d="M398 190 L398 300 C392 348 350 392 300 392 C338 372 368 332 372 276 C376 240 380 210 398 190 Z" fill="${SKIN_SHADE}" opacity="0.5"/>
        <path d="M208 290 C216 350 258 386 300 386 C342 386 384 350 392 290 C380 336 344 360 300 360 C256 360 220 336 208 290 Z" fill="${HAIR}" opacity="0.08"/>
        <path d="M204 180 L204 250 C210 232 214 214 222 204 Z M396 180 L396 250 C390 232 386 214 378 204 Z" fill="${HAIR}" opacity="0.55"/>
      </g>
      <ellipse cx="238" cy="304" rx="17" ry="9" fill="#e9836f" opacity="0.28"/><ellipse cx="362" cy="304" rx="17" ry="9" fill="#e9836f" opacity="0.28"/>
      <!-- the hair on top: swept up and to one side -->
      <path d="M211 220 C200 178 204 134 230 108 C236 92 250 80 264 78 C263 88 267 95 273 99 C281 78 297 64 316 62 C313 74 317 85 323 91 C335 72 353 64 370 69 C365 79 367 89 373 95 C394 110 403 152 390 220 C385 196 371 180 351 176 C323 194 276 199 240 187 C226 193 216 204 211 220 Z" fill="${HAIR}"/>
      <path d="M246 164 C250 136 262 114 280 100" stroke="${HAIR_LIGHT}" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M286 166 C290 136 304 108 326 92" stroke="${HAIR_LIGHT}" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M330 160 C336 136 350 114 368 100" stroke="${HAIR_LIGHT}" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path class="p-brow p-brow-l" d="M229 225 Q254 209 282 220" stroke="${HAIR}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path class="p-brow p-brow-r" d="M318 220 Q346 209 371 225" stroke="${HAIR}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <g clip-path="url(#${id}-eye-l)">
        <ellipse cx="256" cy="255" rx="21" ry="19" fill="#ffffff"/>
        <g class="p-iris"><circle cx="256" cy="256" r="12.5" fill="#4a3324"/><circle cx="256" cy="256" r="6.2" fill="#17110d"/><circle cx="251.5" cy="251" r="3.6" fill="#ffffff"/></g>
      </g>
      <ellipse cx="256" cy="255" rx="23" ry="21" fill="${SKIN}" clip-path="url(#${id}-lid-l)"/>
      <g clip-path="url(#${id}-eye-r)">
        <ellipse cx="344" cy="255" rx="21" ry="19" fill="#ffffff"/>
        <g class="p-iris"><circle cx="344" cy="256" r="12.5" fill="#4a3324"/><circle cx="344" cy="256" r="6.2" fill="#17110d"/><circle cx="339.5" cy="251" r="3.6" fill="#ffffff"/></g>
      </g>
      <ellipse cx="344" cy="255" rx="23" ry="21" fill="${SKIN}" clip-path="url(#${id}-lid-r)"/>
      <path class="p-lash" d="M234 252 Q256 231 279 251" stroke="${HAIR}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path class="p-lash" d="M321 251 Q344 231 366 252" stroke="${HAIR}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M301 268 C296 288 291 298 297 304 C303 308 311 306 315 301" stroke="${SKIN_LINE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path class="p-mouth-shut" stroke="#8c463b" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      <g class="p-mouth-open">
        <path class="p-mouth-shape" fill="#571f26"/>
        <g clip-path="url(#${id}-mouth)">
          <ellipse class="p-tongue" cx="300" fill="#dc6f6b"/>
          <path class="p-teeth" fill="#ffffff"/>
        </g>
        <path class="p-mouth-shape" fill="none" stroke="#8c463b" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <path class="p-lip" stroke="${SKIN_LINE}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.45"/>
    </g></g>
    ${arm("left")}${arm("right")}
  </g>
</svg>`;

  // The voice of the scene, read at any moment: {fps, levels, sharp}.
  const voiceAt = (voice) => {
    const levels = (voice && voice.levels) || [];
    const sharp = (voice && voice.sharp) || [];
    const fps = (voice && voice.fps) || 30;
    const sums = [0];
    for (const v of levels) sums.push(sums[sums.length - 1] + v);
    const read = (list, seconds) => {
      const at = seconds * fps;
      const n = Math.floor(at);
      if (n < 0 || n >= list.length) return 0;
      return lerp(list[n], list[Math.min(n + 1, list.length - 1)], at - n);
    };
    return {
      level: (seconds) => read(levels, seconds),
      sharp: (seconds) => read(sharp, seconds),
      // The voice over a stretch of time around a moment: its stress, without its syllables.
      around: (seconds, reach) => {
        const from = clamp(Math.round((seconds - reach) * fps), 0, levels.length);
        const to = clamp(Math.round((seconds + reach) * fps), 0, levels.length);
        return to > from ? (sums[to] - sums[from]) / (to - from) : 0;
      },
    };
  };

  const mount = (el) => {
    const id = `presenter-${++made}`;
    el.innerHTML = draw(id);
    const $ = (q) => el.querySelector(q);
    const $$ = (q) => [...el.querySelectorAll(q)];
    const parts = {
      body: $(".p-body"), head: $(".p-head"), brows: $$(".p-brow"), irises: $$(".p-iris"), lids: $$(".p-lid"),
      lashes: $$(".p-lash"), shut: $(".p-mouth-shut"), open: $(".p-mouth-open"), shapes: $$(".p-mouth-shape"),
      teeth: $(".p-teeth"), tongue: $(".p-tongue"), lip: $(".p-lip"),
      arms: ["left", "right"].map((side) => {
        const g = $(`.p-${side}`);
        return { side, upper: [...g.querySelectorAll(".p-upper")], fore: [...g.querySelectorAll(".p-fore")],
                 cuff: g.querySelector(".p-cuff"), hand: g.querySelector(".p-hand"),
                 thumb: g.querySelector(".p-thumb"), fingers: [...g.querySelectorAll(".p-finger")] };
      }),
    };
    const look = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1], camera: [0, 0] }[el.dataset.look || "left"] || [-1, 0];
    let cues = [{ at: -10, pose: "rest" }];
    let voice = voiceAt(null);

    // What he does with his arms at a moment: the pose of the last cue, reached from the one before.
    const pose = (seconds) => {
      let n = 0;
      while (n + 1 < cues.length && cues[n + 1].at <= seconds) n++;
      const now = POSES[cues[n].pose] || POSES.rest;
      const before = POSES[(cues[n - 1] || cues[0]).pose] || POSES.rest;
      const k = ease(clamp((seconds - cues[n].at) / TURN));
      const mix = (a, b) => a.map((v, i) => lerp(v, b[i], k));
      return {
        left: mix(before.left, now.left), right: mix(before.right, now.right),
        shoulders: lerp(before.shoulders || 0, now.shoulders || 0, k),
        // How much of each pose that moves on its own is in the mix.
        waving: (cues[n].pose === "wave" ? k : 0) + ((cues[n - 1] || {}).pose === "wave" ? 1 - k : 0),
        talking: ["explain", "open", "shrug"].includes(cues[n].pose) ? k : 0,
      };
    };

    const limb = (part, vector, seconds, sway) => {
      const [shoulder, elbow, turn, thumb, ...fingers] = vector;
      const S = [428, 522], UPPER = 150, FORE = 128;
      const a = rad(shoulder + sway * 0.5), b = rad(shoulder + elbow + sway);
      const E = [S[0] + UPPER * Math.sin(a), S[1] + UPPER * Math.cos(a)];
      const W = [E[0] + FORE * Math.sin(b), E[1] + FORE * Math.cos(b)];
      for (const line of part.upper) { line.setAttribute("x1", S[0]); line.setAttribute("y1", S[1]); line.setAttribute("x2", E[0]); line.setAttribute("y2", E[1]); }
      for (const line of part.fore) { line.setAttribute("x1", E[0]); line.setAttribute("y1", E[1]); line.setAttribute("x2", W[0]); line.setAttribute("y2", W[1]); }
      const along = [Math.sin(b), Math.cos(b)];
      part.cuff.setAttribute("x1", W[0] - along[0] * 14); part.cuff.setAttribute("y1", W[1] - along[1] * 14);
      part.cuff.setAttribute("x2", W[0] + along[0] * 8); part.cuff.setAttribute("y2", W[1] + along[1] * 8);
      part.hand.setAttribute("transform", `translate(${W[0] + along[0] * 12} ${W[1] + along[1] * 12}) rotate(${180 - (shoulder + elbow + sway + turn)}) scale(1.24)`);
      const reach = [46, 53, 48, 37];
      part.fingers.forEach((finger, n) => {
        const long = lerp(15, reach[n], clamp(fingers[n]));
        finger.setAttribute("y", -46 - long); finger.setAttribute("height", long + 8);
        finger.setAttribute("transform", `rotate(${(n - 1.5) * 5 * clamp(fingers[n])} ${-21.3 + n * 14.2} -44)`);
      });
      // The thumb: tucked across the palm, out to the side, or straight up from a fist.
      const out = clamp(thumb), up = clamp(thumb - 1);
      const long = lerp(lerp(20, 40, out), 44, up), angle = lerp(lerp(-10, -42, out), -90, up);
      part.thumb.setAttribute("y", -long); part.thumb.setAttribute("height", long);
      part.thumb.setAttribute("transform", `translate(-21 -16) rotate(${angle})`);
    };

    const blink = (seconds) => {
      // A blink somewhere in each stretch of three seconds or so, and now and then two in a row.
      const SLOT = 3.3, n = Math.floor(seconds / SLOT);
      const shut = (start) => clamp(1 - Math.abs(seconds - start - 0.09) / 0.09);
      const start = n * SLOT + 0.3 + hash(n) * 2.2;
      return Math.max(shut(start), hash(n + 0.5) > 0.75 ? shut(start + 0.32) : 0);
    };
    const glance = (seconds) => {
      const SLOT = 4.7, n = Math.floor(seconds / SLOT);
      if (hash(n * 7.3 + 1) < 0.4) return 0;
      const start = n * SLOT + 0.8 + hash(n + 0.2) * 1.5, lasts = 0.9 + hash(n + 0.7) * 0.8;
      return ease(clamp((seconds - start) / 0.16)) * ease(clamp((start + lasts - seconds) / 0.16));
    };

    const at = (seconds) => {
      const t = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
      const loud = voice.level(t), stress = voice.around(t, 0.09), calm = voice.around(t, 0.5);
      const speaking = clamp(calm * 3);
      const beat = clamp((stress - calm) * 3.2, -0.4, 1);
      const p = pose(t);

      // The body breathes; the head follows the voice and looks where the eyes go.
      const g = glance(t);
      const breath = Math.sin(t * 1.5) * 2.2;
      parts.body.setAttribute("transform", `translate(0 ${breath - p.shoulders * 6}) rotate(${Math.sin(t * 0.6 + 1) * 0.5} 300 720)`);
      const tilt = Math.sin(t * 0.8 + 0.4) * 1.3 + speaking * Math.sin(t * 2.7 + 1) * 1.6 + g * look[0] * 2.2 + p.shoulders * 3;
      parts.head.setAttribute("transform", `translate(${g * look[0] * 3} ${-beat * 5 - breath * 0.4 + g * look[1] * 3 + p.shoulders * 4}) rotate(${tilt} 300 420)`);
      const lift = clamp(beat) * 7 + p.shoulders * 7;
      parts.brows.forEach((brow, n) => brow.setAttribute("transform", `translate(0 ${-lift}) rotate(${(n ? 1 : -1) * lift * 0.5} ${n ? 344 : 256} 218)`));
      const shut = blink(t);
      parts.lids.forEach((lid) => lid.setAttribute("height", 50 * shut));
      parts.lashes.forEach((lash) => lash.setAttribute("transform", `translate(0 ${shut * 17})`));
      parts.irises.forEach((iris) => iris.setAttribute("transform", `translate(${g * look[0] * 6.5} ${g * look[1] * 4.5})`));

      // The mouth: opened by how loud the voice is, pulled wide on the teeth by how sharp it is.
      const cx = 300, cy = 334;
      const wide = clamp(voice.sharp(t) * 1.4) * clamp(loud * 6);
      const open = clamp(Math.pow(clamp(loud * 1.15), 0.75) * (1 - wide * 0.65));
      const smile = 1 - speaking * 0.55;
      if (open < 0.06 && wide < 0.2) {
        const w = 27 + smile * 6;
        parts.shut.setAttribute("d", `M${cx - w} ${cy - 2 - smile * 4} Q${cx} ${cy + 8 + smile * 7} ${cx + w} ${cy - 2 - smile * 4}`);
        parts.shut.style.display = ""; parts.open.style.display = "none"; parts.lip.style.display = "none";
      } else {
        const w = 24 + wide * 9 - open * 5 + smile * 3, h = 5 + open * 27;
        const shape = `M${cx - w} ${cy - 1} Q${cx} ${cy - 8 - open * 3} ${cx + w} ${cy - 1} Q${cx} ${cy + h * 2} ${cx - w} ${cy - 1} Z`;
        for (const part of parts.shapes) part.setAttribute("d", shape);
        const teeth = cy + lerp(3 + open * 3, h, wide);
        parts.teeth.setAttribute("d", `M${cx - w} ${cy - 12} L${cx + w} ${cy - 12} L${cx + w} ${teeth} Q${cx} ${teeth + 3} ${cx - w} ${teeth} Z`);
        parts.tongue.setAttribute("cy", cy + h + 6); parts.tongue.setAttribute("rx", w * 0.62); parts.tongue.setAttribute("ry", h * 0.5);
        parts.tongue.style.display = open > 0.3 ? "" : "none";
        parts.lip.setAttribute("d", `M${cx - 11} ${cy + h + 9} Q${cx} ${cy + h + 13} ${cx + 11} ${cy + h + 9}`);
        parts.shut.style.display = "none"; parts.open.style.display = ""; parts.lip.style.display = "";
      }

      // The arms: the pose, plus what a hand does while it is held.
      const wag = p.waving * Math.sin(t * 9) * 13;
      const talk = p.talking * speaking;
      limb(parts.arms[1], p.right, t, wag + talk * (Math.sin(t * 3.1) * 5 + beat * 7));
      limb(parts.arms[0], p.left, t, talk * (Math.sin(t * 3.1 + 2.2) * 5 + beat * 5));
    };

    return {
      el, at,
      // The voice and the cues of the scene, once they are known. `when` turns a cue's moment
      // (seconds, or a word of the narration) into seconds.
      set: (sound, when) => {
        voice = voiceAt(sound);
        cues = [{ at: -10, pose: "rest" }];
        for (const cue of (el.dataset.cues || "").split(/\s+/).filter(Boolean)) {
          const cut = cue.lastIndexOf(":");
          if (cut > 0 && POSES[cue.slice(cut + 1)]) cues.push({ at: when(cue.slice(0, cut)), pose: cue.slice(cut + 1) });
        }
        cues.sort((a, b) => a.at - b.at);
      },
    };
  };

  window.Presenter = { mount, poses: Object.keys(POSES) };
})();
