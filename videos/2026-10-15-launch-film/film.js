
const UPRIGHT = new URLSearchParams(location.search).has("v");
if (UPRIGHT) document.documentElement.classList.add("v");
const FILM = UPRIGHT ? window.FILM_V : window.FILM;
const TOTAL = FILM.total, BEAT = FILM.beat, W = UPRIGHT ? 1080 : 1920, H = UPRIGHT ? 1920 : 1080;
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)", IN = "cubic-bezier(0.7, 0, 0.84, 0)", BOTH = "cubic-bezier(0.45, 0, 0.15, 1)", SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const MARK = '<path pathLength="1" d="M10 6v20"/><path pathLength="1" d="M10 16h10"/><circle cx="22.5" cy="16" r="3.75"/>';
const URLS = {
  today: ["themarkethub.app", "/today/"], quote: ["themarkethub.app", "/quote/?t=NVDA"], news: ["themarkethub.app", "/news/"],
  fundamentals: ["fundamentals.themarkethub.app", "/stock/?t=MSFT"], radar: ["radar.themarkethub.app", "/analyze/?ticker=NVDA"],
  playground: ["playground.themarkethub.app", "/"], peers: ["peers.themarkethub.app", "/"], options: ["options.themarkethub.app", "/strategy/?t=NVDA"],
  hub: ["themarkethub.app", "/dashboard/"], watchlist: ["themarkethub.app", "/watchlist/"], community: ["themarkethub.app", "/community/"],
};
const CLIP_SECONDS = window.CLIP_SECONDS || {};

const make = (parent, tag, cls, html) => { const el = document.createElement(tag); if (cls) el.className = cls; if (html != null) el.innerHTML = html; parent.appendChild(el); return el; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// One animation as long as the film: `keys` are [seconds, the styles then, how it eases to the next].
const track = (el, keys) => {
  keys = [...keys].sort((a, b) => a[0] - b[0]);
  const frames = keys.map(([t, styles, easing]) => ({ ...styles, offset: clamp(t / TOTAL, 0, 1), easing: easing ?? "linear" }));
  if (frames[0].offset > 0) frames.unshift({ ...frames[0], offset: 0, easing: "linear" });
  if (frames.at(-1).offset < 1) frames.push({ ...frames.at(-1), offset: 1 });
  for (let i = 1; i < frames.length; i++) if (frames[i].offset < frames[i - 1].offset) frames[i].offset = frames[i - 1].offset;
  el.animate(frames, { duration: TOTAL * 1000, fill: "both" });
};
const shown = (el, from, to) => track(el, [[0, { opacity: 0 }], [from - 0.0005, { opacity: 0 }], [from, { opacity: 1 }], [to - 0.0005, { opacity: 1 }], [to, { opacity: 0 }]]);
const rise = (el, at, by = 0.42) => track(el, [[at, { transform: "translateY(115%)" }, OUT], [at + by, { transform: "translateY(0)" }]]);
const wipe = (el, at, by = 0.3) => track(el, [[at, { clipPath: "inset(0 100% 0 0)" }, OUT], [at + by, { clipPath: "inset(0 0% 0 0)" }]]);
const fadeIn = (el, at, by = 0.4, from = "translateY(24px)") => track(el, [[at, { opacity: 0, transform: from }, OUT], [at + by, { opacity: 1, transform: "none" }]]);

const mark = (parent, x, y, size, at) => {
  const box = make(parent, "div", "mark", `<svg width="${size}" height="${size}" viewBox="4 2 26 28">${MARK}</svg>`);
  box.style.cssText = `left:${x}px;top:${y}px`;
  const [bar, line] = box.querySelectorAll("path"), dot = box.querySelector("circle");
  track(bar, [[at, { strokeDashoffset: 1 }, OUT], [at + 0.45, { strokeDashoffset: 0 }]]);
  track(line, [[at + 0.25, { strokeDashoffset: 1 }, OUT], [at + 0.8, { strokeDashoffset: 0 }]]);
  track(dot, [[at + 0.6, { transform: "scale(0)" }, SPRING], [at + 1.0, { transform: "scale(1)" }]]);
  return box;
};

// The words of a scene: a line a beat, the last one with the hit, inverted.
const words = (parent, lines, at, end, opts = {}) => {
  const head = make(parent, "div", "head");
  if (opts.size) head.style.fontSize = `${opts.size}px`;
  const step = opts.step ?? BEAT;
  lines.forEach((text, n) => {
    const last = n === lines.length - 1 && !opts.plain;
    const line = make(head, "span", last ? "l pop" : "l"), inner = make(line, "i", "", text);
    (last ? wipe : rise)(inner, at + step * n);
  });
  const room = opts.width ?? parseFloat(getComputedStyle(head).width);
  const widest = Math.max(...[...head.children].map((line) => line.getBoundingClientRect().width));
  if (widest > room) head.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(head).fontSize) * room / widest)}px`;
  if (opts.leave !== false) track(head, [[end - 0.2, { opacity: 1, transform: "translateY(0)" }, IN], [end, { opacity: 0, transform: "translateY(-40px)" }]]);
  return head;
};

// --- The window and its takes ------------------------------------------------------------------------

const videos = [];
const BASE = 1260, VIEW_H = 709, PX = BASE / 1280;     // the window's width, and the page's pixels in it

function win(scene, s) {
  const take = s.shots[0][1];
  const box = make(scene, "div", "win");
  const [host, path] = URLS[take] || ["themarkethub.app", "/"];
  make(box, "div", "bar", `<div class="dots"><i></i><i></i><i></i></div><div class="url"><svg width="12" height="14" viewBox="0 0 12 14"><rect x="1" y="6" width="10" height="7.5" rx="1.5" fill="#8c8b86"/><path d="M3.5 6V4.2a2.5 2.5 0 0 1 5 0V6" fill="none" stroke="#8c8b86" stroke-width="1.6"/></svg><b>${host}</b>${path}</div>`);
  const view = make(box, "div", "view");
  const video = make(view, "video");
  video.muted = true; video.preload = "auto"; video.playsInline = true;
  video.src = `build/clips/${take}.mp4`;
  videos.push({ video, scene: s });

  // Where the window is: from below on the cut, then as `cam` says, and up and away at the end.
  const pose = (c, extra = "") => {
    const scale = c.s * (UPRIGHT ? 1 : 1);
    return { transform: `translate(${c.x - BASE / 2}px, ${c.y - 749 / 2}px) ${extra} rotateY(${c.ry ?? 0}deg) rotateX(${c.rx ?? 0}deg) scale(${scale})` };
  };
  const cams = s.cam.map(([t, c]) => [s.at + t, c]);
  const first = cams[0][1], last = cams.at(-1)[1];
  const keys = [[s.at, pose({ ...first, y: first.y + 900, ry: (first.ry ?? 0) - 14, rx: 16 }), OUT], [s.at + 0.6, pose(first), BOTH]];
  cams.slice(1).forEach(([t, c], i) => keys.push([Math.max(t, s.at + 0.61 + i * 0.001), pose(c), BOTH]));
  keys.push([s.end - 0.2, pose(cams.at(-1)[0] > s.end - 0.2 ? last : last), IN]);
  keys.push([s.end, pose({ ...last, y: last.y - 1000, rx: -10 })]);
  track(box, keys);

  // Inside the window: the page's point at the centre, and how close.
  const look = (l) => {
    const z = l.z, tx = clamp(BASE / 2 - l.fx * PX * z, BASE - BASE * z, 0), ty = clamp(VIEW_H / 2 - l.fy * PX * z, VIEW_H - VIEW_H * z, 0);
    return { transform: `translate(${tx}px, ${ty}px) scale(${z})` };
  };
  track(video, s.look.map(([t, l]) => [s.at + t, look(l), BOTH]));

  // The words beside it; when the window fills the frame, the last line goes under it, as a caption.
  const full = s.cam.find(([, c]) => c.full);
  const lines = full ? s.lines.slice(0, -1) : s.lines;
  if (lines.length) words(scene, lines, s.at + 0.35, full ? s.at + full[0] + 0.1 : s.end, { plain: !!full });
  if (full) {
    const cap = make(box, "div", "caption");
    cap.style.transform = `scale(${1 / full[1].s})`; cap.style.transformOrigin = "0 100%";
    cap.style.width = `${100 * full[1].s}%`;
    const at = s.at + full[0] + 0.35;
    track(cap, [[at - 0.3, { opacity: 0 }], [at, { opacity: 1 }]]);
    words(cap, [s.lines.at(-1)], at, s.end, { width: BASE * full[1].s - 200 });
  }
  return box;
}

// Where a take is at a moment of the film.
function takeTime(s, t) {
  const u = clamp(t - s.at, 0, s.end - s.at);
  let shot = s.shots[0];
  for (const sh of s.shots) if (sh[0] <= u + 1e-6) shot = sh;
  const [start, , from, rate] = shot;
  return from + (u - start) * rate;
}

// --- The scenes ------------------------------------------------------------------------------------------

const scenes = FILM.scenes;
const KINDS = makeKinds();
scenes.forEach((s, n) => {
  const scene = make(document.body, "div", `scene s-${s.name}`);
  shown(scene, s.at, s.end);
  if (s.shots) {
    const tag = make(scene, "div", "tag", s.tag.replace(/^(\d\d)/, "<b>$1</b>"));
    const full = s.cam.find(([, c]) => c.full), gone = full ? s.at + full[0] : s.end - 0.2;
    track(tag, [[s.at, { opacity: 0 }, OUT], [s.at + 0.3, { opacity: 1 }], [gone, { opacity: 1 }, IN], [gone + 0.25, { opacity: 0 }]]);
    win(scene, s);
    return;
  }
  const build = KINDS[s.kind];
  if (build) build(scene, s);
});

// The line of zero and its dot, from the first take to the close.
const firstTake = scenes.find((s) => s.shots), closing = scenes.find((s) => s.kind === "rule") || scenes.find((s) => s.kind === "close");
const rule = make(document.body, "div", "rule", "<i></i>");
// It steps aside while a window fills the frame, and comes back with the next scene.
const ruleKeys = [[firstTake.at - 0.3, { opacity: 0, transform: "scaleX(0)" }, OUT], [firstTake.at + 0.5, { opacity: 1, transform: "scaleX(1)" }]];
scenes.filter((s) => s.cam?.some(([, c]) => c.full)).forEach((s) => {
  const at = s.at + s.cam.find(([, c]) => c.full)[0];
  ruleKeys.push([at, { opacity: 1, transform: "scaleX(1)" }], [at + 0.3, { opacity: 0, transform: "scaleX(1)" }],
                [s.end, { opacity: 0, transform: "scaleX(1)" }], [s.end + 0.3, { opacity: 1, transform: "scaleX(1)" }]);
});
ruleKeys.push([closing.at - 0.2, { opacity: 1, transform: "scaleX(1)" }, IN], [closing.at, { opacity: 0, transform: "scaleX(1)" }]);
track(rule, ruleKeys);
const ruleWidth = UPRIGHT ? 952 : 1728;
track(rule.firstChild, [[firstTake.at, { transform: "translateX(0)" }], [closing.at, { transform: `translateX(${ruleWidth - 16}px)` }]]);

// --- Putting the film at a moment ----------------------------------------------------------------------

window.filmReady = (async () => {
  await document.fonts.ready;
  await Promise.all(videos.map(({ video }) => new Promise((done, fail) => {
    if (video.readyState >= 2) return done();
    video.addEventListener("loadeddata", done, { once: true });
    video.addEventListener("error", () => fail(new Error(`cannot load ${video.src}`)), { once: true });
  })));
  for (const a of document.getAnimations()) a.pause();
  return TOTAL;
})();

window.seekTo = async (t) => {
  for (const a of document.getAnimations()) a.currentTime = t * 1000;
  const waits = [];
  for (const { video, scene } of videos) {
    if (t < scene.at - 0.7 || t > scene.end + 0.05) continue;
    const want = Math.max(0, Math.min(takeTime(scene, t), video.duration - 0.02));
    if (Math.abs(video.currentTime - want) < 0.0005) continue;
    waits.push(new Promise((done) => { video.addEventListener("seeked", done, { once: true }); video.currentTime = want; }));
  }
  await Promise.all(waits);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
};
