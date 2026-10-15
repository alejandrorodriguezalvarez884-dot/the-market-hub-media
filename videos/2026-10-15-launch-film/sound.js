// The score of the launch film, synthesised: no recording and no music of anyone's. `window.play(rate)`
// plays it into memory (an OfflineAudioContext) and gives back the two channels, for film.py.
//
// It is low, wide and solemn rather than bright (what the owner chose for the landing page's film:
// "más grave y solemne, que motive y suene a progreso", nothing high and tinkling), with enough
// above 250 Hz for a phone to play it. Everything is placed on the times of timeline.js:
//   - the opening is a held low chord and a soft pulse, a muted click for every tab that opens, the
//     clicks crowding and a rise as the tabs pile up, then half a second of nothing;
//   - "So I built one place" opens the harmony; the title lands on a deep hit;
//   - from the first take, low strings in eighths, a soft drum on the beat, a hit on every cut and
//     air before it; the bass walks D, F, B flat, C with the scenes; when a window fills the frame,
//     a lower, longer hit;
//   - the parts grow: the AI part fuller than the market, My Hub warmest; the rule strips back to a
//     pulse; the close is a D major chord, held and let go.
window.play = async (rate) => {
  const FILM = new URLSearchParams(location.search).has("v") ? window.FILM_V : window.FILM;
  const TOTAL = FILM.total, BEAT = FILM.beat, scenes = FILM.scenes;
  const ctx = new OfflineAudioContext(2, Math.ceil(TOTAL * rate), rate);
  const mix = ctx.createGain(), limit = ctx.createDynamicsCompressor(), fade = ctx.createGain();
  limit.threshold.value = -9; limit.knee.value = 10; limit.ratio.value = 3.5; limit.attack.value = 0.005; limit.release.value = 0.2;
  fade.gain.setValueAtTime(0, 0); fade.gain.linearRampToValueAtTime(1, 0.4);
  fade.gain.setValueAtTime(1, TOTAL - 2.5); fade.gain.linearRampToValueAtTime(0, TOTAL - 0.05);
  mix.connect(limit); limit.connect(fade); fade.connect(ctx.destination);

  // A room: a short, dark reverb made of decaying noise, so nothing sounds dry and synthetic.
  const room = ctx.createConvolver();
  {
    const len = Math.floor(rate * 2.6), ir = ctx.createBuffer(2, len, rate);
    let s = 99173;
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = (s / 2147483648 - 1) * Math.pow(1 - i / len, 3.2); }
    }
    room.buffer = ir;
  }
  const wet = ctx.createGain(); wet.gain.value = 0.22;
  const roomIn = ctx.createBiquadFilter(); roomIn.type = "lowpass"; roomIn.frequency.value = 3200;
  roomIn.connect(room); room.connect(wet); wet.connect(mix);
  const send = (node, amount) => { const g = ctx.createGain(); g.gain.value = amount; node.connect(g); g.connect(roomIn); };

  // The same noise every time: a film made twice sounds the same.
  let seed = 20261015;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const noise = ctx.createBuffer(2, rate * 2, rate);
  for (let c = 0; c < 2; c++) { const data = noise.getChannelData(c); for (let i = 0; i < data.length; i++) data[i] = random(); }

  const voice = (type, freq, at, to, detune = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; o.detune.value = detune; o.start(at); o.stop(to); return o; };
  const level = (v = 0) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const filter = (type, freq, q = 0.7) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; };
  const pan = (where) => { const p = ctx.createStereoPanner(); p.pan.value = where; return p; };
  const hiss = (at, to) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(at, (at * 0.37) % 1.5); s.stop(to); return s; };
  const chain = (...nodes) => { nodes.reduce((a, b) => (a.connect(b), b)); return nodes.at(-1); };
  const semis = (n) => 2 ** (n / 12);

  // A deep hit: a falling sine, a thud of low noise and, for a phone's speaker, a low saw that shuts fast.
  const hit = (at, size, long = 1) => {
    const len = (0.9 + 0.9 * size) * long, o = voice("sine", 76, at, at + len + 0.1), g = level();
    o.frequency.setValueAtTime(76, at); o.frequency.exponentialRampToValueAtTime(31, at + 0.5 * long);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.8 * size, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    chain(o, g, mix);
    const thud = level();
    thud.gain.setValueAtTime(0.45 * size, at); thud.gain.exponentialRampToValueAtTime(0.0001, at + 0.25);
    chain(hiss(at, at + 0.3), filter("lowpass", 240), thud, mix);
    const body = voice("sawtooth", 104, at, at + 0.7), shut = filter("lowpass", 1500, 1.1), bodies = level();
    body.frequency.setValueAtTime(104, at); body.frequency.exponentialRampToValueAtTime(52, at + 0.35);
    shut.frequency.setValueAtTime(1500, at); shut.frequency.exponentialRampToValueAtTime(200, at + 0.4);
    bodies.gain.setValueAtTime(0.0001, at); bodies.gain.exponentialRampToValueAtTime(0.42 * size, at + 0.006); bodies.gain.exponentialRampToValueAtTime(0.0001, at + 0.6);
    chain(body, shut, bodies, mix);
    send(bodies, 0.8);
  };
  // The drum of the beat: soft, short, a tap a phone can play.
  const drum = (at, v) => {
    const o = voice("sine", 150, at, at + 0.3), g = level();
    o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(48, at + 0.13);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
    chain(o, g, mix);
    const tap = level();
    tap.gain.setValueAtTime(0.3 * v, at); tap.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    chain(hiss(at, at + 0.07), filter("bandpass", 800, 1), tap, mix);
  };
  // A muted click: a tab opening.
  const click = (at, v) => {
    const g = level();
    g.gain.setValueAtTime(v, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.035);
    chain(hiss(at, at + 0.05), filter("bandpass", 1300, 2.2), g, pan(random() * 0.6), mix);
    const o = voice("sine", 520, at, at + 0.06), og = level();
    og.gain.setValueAtTime(0.25 * v, at); og.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    chain(o, og, mix);
  };
  // A low string, bowed short.
  const string = (at, freq, long, v, bright) => {
    const f = filter("lowpass", bright, 1.0), g = level();
    f.frequency.setValueAtTime(bright * 2, at); f.frequency.exponentialRampToValueAtTime(bright, at + 0.12);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.014); g.gain.exponentialRampToValueAtTime(0.0001, at + long);
    for (const cents of [-6, 6]) voice("sawtooth", freq, at, at + long + 0.05, cents).connect(f);
    const under = level(0.5); voice("sine", freq / 2, at, at + long + 0.05).connect(under); under.connect(g);
    chain(f, g, mix);
    send(g, 0.25);
  };
  // A chord, held: it opens as it goes.
  const chord = (at, to, notes, v, from, upTo, tail = 0.5) => {
    const f = filter("lowpass", from, 0.6), g = level();
    f.frequency.setValueAtTime(from, at); f.frequency.exponentialRampToValueAtTime(upTo, Math.max(at + 0.1, to));
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.25); g.gain.setValueAtTime(v, to); g.gain.exponentialRampToValueAtTime(0.0001, to + tail);
    notes.forEach((freq, n) => {
      for (const side of [-1, 1]) chain(voice("sawtooth", freq, at, to + tail + 0.05, side * (5 + n)), level(1 / notes.length), pan(side * 0.65), f);
    });
    chain(f, g, mix);
    send(g, 0.7);
  };
  // Air that rises into a moment and stops there.
  const rush = (to, long, v, low, high) => {
    const at = to - long, f = filter("bandpass", low, 1.3), g = level();
    f.frequency.setValueAtTime(low, at); f.frequency.exponentialRampToValueAtTime(high, to);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, to - 0.01); g.gain.exponentialRampToValueAtTime(0.0001, to + 0.06);
    chain(hiss(at, to + 0.1), f, g, mix);
  };
  // Air that falls away from a moment.
  const fall = (at, long, v, high, low) => {
    const f = filter("bandpass", high, 1.2), g = level();
    f.frequency.setValueAtTime(high, at); f.frequency.exponentialRampToValueAtTime(low, at + long);
    g.gain.setValueAtTime(v, at); g.gain.exponentialRampToValueAtTime(0.0001, at + long);
    chain(hiss(at, at + long + 0.05), f, g, mix);
  };
  const tones = (root, third, high = false) => [root * 2, root * 4, root * 4 * semis(third), root * 4 * semis(7), ...(high ? [root * 8] : [])];

  // --- The opening: tabs pile up ------------------------------------------------------------------
  const tabsScenes = scenes.filter((s) => s.kind === "tabs");
  if (tabsScenes.length) {
    const from = tabsScenes[0].at, to = tabsScenes.at(-1).end, stack = tabsScenes.find((s) => s.stack);
    chord(from, to - 0.5, [73.42, 110, 146.83, 174.61], 0.09, 240, 650, 0.2);
    chain(voice("sine", 36.71, from, to - 0.5), level(0.12), mix);
    for (let t = from + BEAT * 2; t < to - 0.6; t += BEAT * 2) drum(t, 0.22);          // a slow heartbeat
    if (stack) {
      const opens = stack.stack.map((_, i) => stack.at + 2 * BEAT * i);
      const rushFrom = stack.end - 0.5, rushTo = to - 1.0, more = 24;
      for (let i = 0; i < more; i++) opens.push(rushFrom + (rushTo - rushFrom) * Math.pow(i / (more - 1), 0.75));
      opens.forEach((t, i) => click(t, i < stack.stack.length ? 0.5 : 0.28 + 0.2 * (i / opens.length)));
      stack.stack.forEach((_, i) => string(stack.at + 2 * BEAT * i, [73.42, 87.31, 58.27, 65.41][i % 4] * 2, 0.9, 0.22, 700));
      // The tension: a tone that climbs and air that rises while the tabs crowd in.
      const climb = voice("sawtooth", 55, rushFrom, to - 0.45), cg = level();
      climb.frequency.setValueAtTime(55, rushFrom); climb.frequency.exponentialRampToValueAtTime(110, to - 0.45);
      cg.gain.setValueAtTime(0.0001, rushFrom); cg.gain.exponentialRampToValueAtTime(0.12, to - 0.5); cg.gain.exponentialRampToValueAtTime(0.0001, to - 0.42);
      chain(climb, filter("lowpass", 700), cg, mix);
      rush(to - 0.45, 2.2, 0.22, 300, 3800);
      fall(to - 0.45, 0.5, 0.18, 1800, 120);                                           // it comes down
    }
  }

  // --- Each scene ----------------------------------------------------------------------------------
  const first = scenes.findIndex((s) => s.shots), rule = scenes.find((s) => s.kind === "rule"), close = scenes.find((s) => s.kind === "close");
  scenes.forEach((s, n) => {
    const [root, third] = s.chord;
    if (s.kind === "tabs") return;

    if (s.kind === "logo") {
      chord(s.at + 0.05, s.end, tones(root, third), 0.24, 400, 1400, 0.6);
      chain(voice("sine", root, s.at, s.end + 0.4), level(0.22), mix);
      hit(s.at + 1.0, 0.45, 1.4);                                                       // the mark draws
      rush(s.end, 1.6, 0.16, 300, 3000);
      return;
    }
    if (s.kind === "title") {
      hit(s.at, 1.3, 1.5);
      chord(s.at, s.end, [root, ...tones(root, 4, true)], 0.34, 700, 2400, 0.5);
      chain(voice("sine", root / 2, s.at, s.end + 0.3), level(0.3), mix);
      hit(s.at + 2 * BEAT, 0.6);                                                        // "Now live."
      for (let t = s.at + BEAT; t < s.end - 0.01; t += BEAT) drum(t, 0.36);
      rush(s.end, 0.8, 0.14, 500, 3200);
      return;
    }
    if (s.kind === "scan") {
      hit(s.at, 0.9);
      chord(s.at, s.end, tones(root, third), 0.26, 300, 2200, 0.4);
      chain(voice("sine", root, s.at, s.end + 0.2), level(0.26), mix);
      rush(s.at + 3.9, 2.9, 0.16, 250, 2400);                                           // the light reads the page
      for (let t = s.at + BEAT; t < s.end - 0.01; t += BEAT) drum(t, 0.4);
      rush(s.end, 0.6, 0.14, 500, 3000);
      return;
    }
    if (s.kind === "rule") {
      hit(s.at, 0.8, 1.3);
      chord(s.at, s.end, tones(root, third), 0.22, 400, 900, 0.6);
      chain(voice("sine", root, s.at, s.end + 0.4), level(0.24), mix);
      [4, 6].forEach((b) => hit(s.at + b * BEAT, 0.35));                              // the dot, waiting
      for (let t = s.at + 2 * BEAT; t < s.end - 0.01; t += 2 * BEAT) drum(t, 0.3);
      rush(s.end, 1.2, 0.2, 300, 4200);
      return;
    }
    if (s.kind === "close") {
      hit(s.at, 1.4, 1.8);
      chain(voice("sine", root / 2, s.at, TOTAL), level(0.32), mix);
      chain(voice("sine", root, s.at, TOTAL), level(0.2), mix);
      chord(s.at, TOTAL - 1.0, [root, root * semis(7), ...tones(root, 4, true), root * 8 * semis(4)], 0.44, 800, 2600, 1.0);
      [1, 2].forEach((k) => drum(s.at + 1.0 + 2 * BEAT * (k - 1), 0.34));
      hit(s.at + 1.0 + 4 * BEAT, 0.55);                                                 // the address
      return;
    }

    // A scene with a take, or plain words: the groove, growing with the parts.
    const part = s.part ?? 1, grow = Math.min(1, Math.max(0, (n - first) / (scenes.indexOf(rule) - first)));
    const end = s.end, bright = 700 + 700 * grow + (part === 3 ? 200 : 0);
    hit(s.at, 0.75 + 0.15 * grow);
    chord(s.at, end, tones(root, third, part >= 2), 0.2 + 0.1 * grow, bright, bright * 1.9, 0.3);
    chain(voice("sine", root, s.at, end + 0.05), level(0.22 + 0.06 * grow), mix);       // the bass
    for (let t = s.at + BEAT; t < end - 0.01; t += BEAT) drum(t, 0.38 + 0.12 * grow);
    for (let t = s.at, k = 0; t < end - 0.01; t += BEAT / 2, k++) {
      string(t, k % 4 === 2 ? root * 4 : root * 2, 0.22, (k % 2 ? 0.26 : 0.38) * (0.75 + 0.45 * grow), 800 + 900 * grow);
    }
    // The line that lands, and the window that fills the frame.
    if (s.lines) string(s.at + 0.35 + BEAT * (s.lines.length - 1), root * 4 * semis(7), 0.8, 0.2, 1300);
    const full = s.cam?.find(([, c]) => c.full);
    if (full) { rush(s.at + full[0] + 0.3, 0.9, 0.16, 400, 2600); hit(s.at + full[0] + 0.35, 0.6, 1.3); }
    rush(end, 0.45, 0.08 + 0.06 * grow, 500, 2800);
  });

  const played = await ctx.startRendering();
  const pack = (data) => { const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength); let text = ""; for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768)); return btoa(text); };
  return { left: pack(played.getChannelData(0)), right: pack(played.getChannelData(1)) };
};
