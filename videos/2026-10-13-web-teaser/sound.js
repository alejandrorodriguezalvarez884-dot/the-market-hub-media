// The score of the teaser, synthesised: no recording and no music of anyone's. `window.play(rate)`
// plays it into memory (an OfflineAudioContext) and gives back the two channels, for reel.py.
//
// It is low and wide rather than bright, with enough above 250 Hz for a phone to play it: a pulse
// of low strings in eighths, a soft drum on every beat, a chord held under each scene, and a deep
// hit on every cut, which is where the picture changes (timeline.js). The bass climbs to the close
// (B flat, C, D) and the close is D major. Before the close everything stops for half a second,
// under a rise, so the last hit lands.
window.play = async (rate) => {
  const REEL = window.REEL, TOTAL = REEL.total, BEAT = 0.5;
  const ctx = new OfflineAudioContext(2, Math.ceil(TOTAL * rate), rate);
  const mix = ctx.createGain(), limit = ctx.createDynamicsCompressor(), fade = ctx.createGain();
  limit.threshold.value = -10; limit.knee.value = 8; limit.ratio.value = 10; limit.attack.value = 0.004; limit.release.value = 0.15;
  fade.gain.setValueAtTime(1, TOTAL - 1.1);
  fade.gain.linearRampToValueAtTime(0, TOTAL - 0.03);
  mix.connect(limit); limit.connect(fade); fade.connect(ctx.destination);

  // The same noise every time: a film made twice sounds the same.
  let seed = 20261013;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const noise = ctx.createBuffer(2, rate * 2, rate);
  for (let c = 0; c < 2; c++) { const data = noise.getChannelData(c); for (let i = 0; i < data.length; i++) data[i] = random(); }

  const voice = (type, freq, at, to, detune = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; o.detune.value = detune; o.start(at); o.stop(to); return o; };
  const level = (v = 0) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const filter = (type, freq, q = 0.7) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; };
  const pan = (where) => { const p = ctx.createStereoPanner(); p.pan.value = where; return p; };
  const hiss = (at, to) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(at, (at * 0.37) % 1.5); s.stop(to); return s; };
  const chain = (...nodes) => { nodes.reduce((a, b) => (a.connect(b), b)); return nodes.at(-1); };

  // A deep hit: a sine that falls, a thud of low noise on top of it and, because a phone's speaker
  // plays almost nothing under 200 Hz, a low saw that closes fast and a crack of air, which it does play.
  const hit = (at, size) => {
    const long = 0.9 + 0.9 * size, o = voice("sine", 78, at, at + long + 0.1), g = level();
    o.frequency.setValueAtTime(78, at); o.frequency.exponentialRampToValueAtTime(33, at + 0.45);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.75 * size, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + long);
    chain(o, g, mix);
    const thud = level();
    thud.gain.setValueAtTime(0.5 * size, at); thud.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    chain(hiss(at, at + 0.3), filter("lowpass", 260), thud, mix);
    const body = voice("sawtooth", 110, at, at + 0.6), shut = filter("lowpass", 1800, 1.2), bodies = level();
    body.frequency.setValueAtTime(110, at); body.frequency.exponentialRampToValueAtTime(55, at + 0.3);
    shut.frequency.setValueAtTime(1800, at); shut.frequency.exponentialRampToValueAtTime(240, at + 0.35);
    bodies.gain.setValueAtTime(0.0001, at); bodies.gain.exponentialRampToValueAtTime(0.5 * size, at + 0.006); bodies.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
    chain(body, shut, bodies, mix);
    const crack = level();
    crack.gain.setValueAtTime(0.22 * size, at); crack.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
    chain(hiss(at, at + 0.12), filter("bandpass", 1500, 0.8), crack, mix);
  };
  // The drum of every beat: softer, shorter.
  const drum = (at, v) => {
    const o = voice("sine", 170, at, at + 0.3), g = level();
    o.frequency.setValueAtTime(170, at); o.frequency.exponentialRampToValueAtTime(52, at + 0.12);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
    chain(o, g, mix);
    const tap = level();                                // what of it a phone plays
    tap.gain.setValueAtTime(0.35 * v, at); tap.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    chain(hiss(at, at + 0.07), filter("bandpass", 900, 1), tap, mix);
  };
  // A low string, bowed short: two saws a little apart, their octave and a sine under them, through a
  // filter that closes.
  const string = (at, freq, long, v, bright) => {
    const f = filter("lowpass", bright, 1.1), g = level();
    f.frequency.setValueAtTime(bright * 2.2, at); f.frequency.exponentialRampToValueAtTime(bright, at + 0.12);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + long);
    for (const cents of [-7, 7]) voice("sawtooth", freq, at, at + long + 0.05, cents).connect(f);
    chain(voice("sawtooth", freq * 2, at, at + long + 0.05, 4), level(0.6), f);
    const under = level(0.5); voice("sine", freq / 2, at, at + long + 0.05).connect(under); under.connect(g);
    chain(f, g, mix);
  };
  // A chord, held: it opens as it goes.
  const chord = (at, to, notes, v, from, upTo, tail = 0.35) => {
    const f = filter("lowpass", from, 0.6), g = level();
    f.frequency.setValueAtTime(from, at); f.frequency.exponentialRampToValueAtTime(upTo, to);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.18); g.gain.setValueAtTime(v, to); g.gain.exponentialRampToValueAtTime(0.0001, to + tail);
    notes.forEach((freq, n) => {
      for (const side of [-1, 1]) chain(voice("sawtooth", freq, at, to + tail + 0.05, side * (6 + n)), level(1 / notes.length), pan(side * 0.7), f);
    });
    chain(f, g, mix);
  };
  // Air that rises into a moment and stops there.
  const rush = (to, long, v, low, high) => {
    const at = to - long, f = filter("bandpass", low, 1.4), g = level();
    f.frequency.setValueAtTime(low, at); f.frequency.exponentialRampToValueAtTime(high, to);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, to - 0.01); g.gain.exponentialRampToValueAtTime(0.0001, to + 0.06);
    chain(hiss(at, to + 0.1), f, g, mix);
  };

  const semis = (n) => 2 ** (n / 12);
  const scenes = REEL.scenes, close = scenes.at(-1), hush = close.at - BEAT;   // the half second before the close
  scenes.forEach((s, n) => {
    const [root, third] = s.chord, build = n / (scenes.length - 1);            // 0 at the opening, 1 at the close
    const notes = [root * 2, root * 4, root * 4 * semis(third), root * 4 * semis(7), root * 8];
    if (s.name === "open") {
      hit(0, 0.55);
      drum(0.5, 0.45); drum(1.0, 0.5);
      hit(1.5, 1);                                     // "On one page."
      drum(2.0, 0.5);
      chord(0, s.end, notes, 0.2, 500, 1300);
      rush(s.end, 0.5, 0.12, 500, 2600);
      return;
    }
    if (s.name === "close") {
      hit(s.at, 1.35);
      chain(voice("sine", root / 2, s.at, TOTAL), level(0.3), mix);
      chord(s.at, TOTAL - 0.4, [root, root * semis(7), ...notes, root * 8 * semis(third)], 0.5, 700, 3200);
      [1, 1.5, 2].forEach((t) => drum(s.at + t, 0.42));   // the three lines
      hit(s.at + 2.5, 0.7);                               // the address
      return;
    }
    const end = Math.min(s.end, hush);
    hit(s.at, 0.8);
    chord(s.at, end, notes, 0.26 + 0.14 * build, 700 + 700 * build, 1300 + 1300 * build, s.end > hush ? 0.12 : 0.35);
    for (let t = s.at + BEAT; t < end - 0.01; t += BEAT) drum(t, 0.5 + 0.12 * build);
    for (let t = s.at, k = 0; t < end - 0.01; t += BEAT / 2, k++) {
      string(t, k % 4 === 2 ? root * 4 : root * 2, 0.22, (k % 2 ? 0.32 : 0.46) * (0.7 + 0.5 * build), 900 + 1000 * build);
    }
    // The line that lands: a higher string with it.
    string(s.at + BEAT * (s.lines.length - 1), root * 8, 0.5, 0.3, 1600);
    if (s.end <= hush) rush(s.end, 0.4, 0.1 + 0.05 * build, 500, 2800);
  });
  // The rise into the close: air, and a tone that climbs under it.
  rush(close.at, 1.5, 0.3, 300, 5200);
  const climb = voice("sawtooth", 73.42, close.at - 1.5, close.at), climbs = level();
  climb.frequency.setValueAtTime(73.42, close.at - 1.5); climb.frequency.exponentialRampToValueAtTime(146.83, close.at);
  climbs.gain.setValueAtTime(0.0001, close.at - 1.5); climbs.gain.exponentialRampToValueAtTime(0.16, close.at - 0.02); climbs.gain.exponentialRampToValueAtTime(0.0001, close.at + 0.03);
  chain(climb, filter("lowpass", 900), climbs, mix);

  const played = await ctx.startRendering();
  const pack = (data) => { const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength); let text = ""; for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768)); return btoa(text); };
  return { left: pack(played.getChannelData(0)), right: pack(played.getChannelData(1)) };
};
