// The kinds of scene without a take, for film.js: the opening's browser that fills with tabs, the
// logo, the title, the page that the AI's light reads, plain words, the rule and the close.
// Each element's entrance and exit are one animation (two on the same property would fight).

const TAB_COLOURS = ["#35c98f", "#ff6b57", "#e0b341", "#8c8b86", "#6ea8fe", "#c9c7c1"];
const MORE_TABS = ["10-Q", "Fed minutes", "Chart", "Earnings call", "Screener", "Analyst note", "Forum", "8-K", "Futures", "Sector ETF",
  "Transcript", "Yields", "Insider buys", "Options flow", "Guidance", "Crypto", "Calendar", "Comments", "Newsletter", "Podcast notes",
  "Short interest", "Dividends", "CPI", "Jobs report"];

// An entrance (and an exit, when `out` is given) as one set of keys.
function life(el, at, by, from, out, outBy = 0.22, to = "translateY(-40px)") {
  const keys = [[at, { opacity: 0, transform: from }, OUT], [at + by, { opacity: 1, transform: "none" }]];
  if (out != null) keys.push([out - outBy, { opacity: 1, transform: "none" }, IN], [out, { opacity: 0, transform: to }]);
  track(el, keys);
}

function makeKinds() {
  let browserMade = false;

  function browser() {
    if (browserMade) return;
    browserMade = true;
    const tabsScenes = scenes.filter((s) => s.kind === "tabs");
    const from = tabsScenes[0].at, to = tabsScenes.at(-1).end, stack = tabsScenes.find((s) => s.stack);
    // The shake and the fall go on a wrapper, the entrance on the browser itself.
    const shaker = make(document.body, "div");
    shaker.style.cssText = "position:absolute;inset:0;z-index:5";
    shown(shaker, from, to);
    const box = make(shaker, "div", "browser");
    track(box, [[from + 0.3, { opacity: 0, transform: "translateY(70px) scale(0.97)" }, OUT], [from + 1.4, { opacity: 1, transform: "none" }]]);
    const strip = make(box, "div", "strip", '<div class="dots"><i></i><i></i><i></i></div>');
    const lines = make(box, "div", "lines");
    [0.92, 0.7, 0.84, 0.55, 0.78, 0.62, 0.88, 0.5, 0.74, 0.66, 0.8].forEach((w) => (make(lines, "i").style.width = `${w * 100}%`));
    track(lines, [[stack.at, { opacity: 0.6 }], [stack.at + 0.3, { opacity: 0.15 }], [stack.end - 0.3, { opacity: 0.15 }], [stack.end, { opacity: 0.6 }]]);

    // When each tab opens: four named, one every two beats; then the rest, faster and faster.
    const opens = stack.stack.map((label, i) => [stack.at + 2 * BEAT * i, label]);
    const rushFrom = stack.end - 0.5, rushTo = to - 1.0;
    MORE_TABS.forEach((label, i) => opens.push([rushFrom + (rushTo - rushFrom) * Math.pow(i / (MORE_TABS.length - 1), 0.75), label]));
    const boxWidth = UPRIGHT ? 940 : 1400, left0 = 112, room = boxWidth - left0 - 16;
    const widthAt = (n) => Math.min(UPRIGHT ? 200 : 230, room / Math.max(1, n));
    opens.forEach(([t0, label], i) => {
      const tab = make(strip, "div", "tab", label);
      tab.style.setProperty("--fav", TAB_COLOURS[i % TAB_COLOURS.length]);
      const place = (n, y, on) => ({ opacity: 1, left: `${left0 + i * widthAt(n)}px`, width: `${widthAt(n)}px`, transform: `translateY(${y}px)`,
                                     backgroundColor: on ? "#101213" : "#191b1d", color: on ? "#f2f0ea" : "#c9c7c1" });
      const next = opens[i + 1]?.[0] ?? to + 1;
      const keys = [[t0 - 0.001, { ...place(i + 1, 46, true), opacity: 0 }], [t0, place(i + 1, 46, true), OUT], [t0 + 0.22, place(i + 1, 0, true)]];
      opens.slice(i + 1).forEach(([t1], k) => keys.push([t1 + 0.16, place(i + k + 2, 0, false)]));
      if (next < to) keys.splice(3, 0, [next, place(i + 1, 0, true)]);   // lit until the next one opens
      track(tab, keys);
    });

    // The named tabs say their word big, one after the other.
    opens.slice(0, stack.stack.length).forEach(([t0, label], i) => {
      const word = make(box, "div", "bigword", `${label}.`);
      const t1 = i + 1 < stack.stack.length ? opens[i + 1][0] : stack.end;
      track(word, [[t0, { opacity: 0, transform: "translateY(50px)" }, OUT], [t0 + 0.35, { opacity: 1, transform: "none" }],
                   [t1 - 0.12, { opacity: 1, transform: "none" }, IN], [t1, { opacity: 0, transform: "translateY(-40px)" }]]);
    });

    // Too much: it shakes, and comes down.
    const keys = [[from, { transform: "none", opacity: 1 }]];
    for (let t = to - 1.7, k = 0; t < to - 0.45; t += 1 / 30, k++) {
      const a = Math.min(1, (t - (to - 1.7)) / 0.9) * 8;
      keys.push([t, { transform: `translate(${(Math.sin(k * 2.7) * a).toFixed(2)}px, ${(Math.cos(k * 3.9) * a).toFixed(2)}px) rotate(${(Math.sin(k * 1.3) * a * 0.05).toFixed(3)}deg)`, opacity: 1 }]);
    }
    keys.push([to - 0.45, { transform: "none", opacity: 1 }, IN]);
    keys.push([to - 0.02, { transform: "translateY(560px) rotate(5deg) scale(0.9)", opacity: 0 }]);
    const holder = make(shaker, "div");
    holder.style.cssText = "position:absolute;inset:0";
    holder.appendChild(box);
    track(holder, keys);
  }

  const centerWords = (scene, s, top, size) => {
    scene.classList.add("center");
    const head = words(scene, s.lines, s.at + 0.3, s.end, { size, width: W - 160 });
    head.style.top = `${top}px`;
    return head;
  };

  return {
    tabs(scene, s) {
      browser();
      if (s.lines) centerWords(scene, s, UPRIGHT ? 360 : 96, UPRIGHT ? 130 : 112);
    },

    logo(scene, s) {
      centerWords(scene, s, UPRIGHT ? 420 : 150, UPRIGHT ? 120 : 112);
      const size = UPRIGHT ? 360 : 330;
      const m = mark(scene, W / 2 - size / 2, UPRIGHT ? 900 : 470, size, s.at + 1.0);
      track(m, [[s.end - 0.5, { transform: "none", opacity: 1 }, IN], [s.end, { transform: "translateY(-60px) scale(0.55)", opacity: 0 }]]);
    },

    title(scene, s) {
      scene.classList.add("title");
      const m = mark(scene, W / 2 - 70, UPRIGHT ? 520 : 200, 140, s.at + 0.05);
      track(m, [[s.end - 0.25, { opacity: 1 }], [s.end, { opacity: 0 }]]);
      const name = make(scene, "div", "name", "Market Hub");
      track(name, [[s.at + 0.1, { opacity: 0, transform: "translateY(40px) scale(0.96)", filter: "blur(0px)" }, OUT],
                   [s.at + 0.9, { opacity: 1, transform: "none", filter: "blur(0px)" }],
                   [s.end - 0.25, { opacity: 1, transform: "none", filter: "blur(0px)" }, IN], [s.end, { opacity: 0, transform: "none", filter: "blur(8px)" }]]);
      const live = make(scene, "div", "live", "<i>Now live.</i>");
      wipe(live.firstChild, s.at + 2 * BEAT, 0.35);
      track(live, [[s.end - 0.25, { opacity: 1 }], [s.end, { opacity: 0 }]]);
      const sub = make(scene, "div", "sub", "themarkethub.app · Free");
      sub.style.top = UPRIGHT ? "1100px" : "800px";
      life(sub, s.at + 4 * BEAT, 0.4, "translateY(20px)", s.end, 0.25, "none");
    },

    scan(scene, s) {
      const tag = make(scene, "div", "tag", "<b>02</b> / AI");
      life(tag, s.at + 0.1, 0.3, "none", s.end, 0.2, "none");
      words(scene, s.lines, s.at + 0.3, s.end);
      const doc = make(scene, "div", "doc");
      life(doc, s.at + 0.1, 0.6, "translateY(60px)", s.end, 0.22, "translateY(-80px)");
      const widths = [0.82, 0.64, 0.9, 0.48, 0.76, 0.86, 0.58, 0.8, 0.7, 0.88, 0.52, 0.74];
      const docW = UPRIGHT ? 940 : 960, inner = docW - 140;
      const sweepFrom = s.at + 1.0, sweepTo = s.at + 3.9;
      widths.forEach((w, k) => {
        const top = 60 + k * 42;
        const row = make(doc, "div", "row"); row.style.cssText = `top:${top}px;width:${w * inner}px`;
        const lit = make(doc, "div", "lit"); lit.style.cssText = `top:${top}px;width:${w * inner}px`;
        lit.style.background = k % 4 === 1 ? "#35c98f" : k % 5 === 3 ? "#ff6b57" : "#f2f0ea";
        // The light reaches the end of each row at that row's share of the sweep.
        const b = sweepFrom + (sweepTo - sweepFrom) * ((70 + w * inner) / docW);
        track(lit, [[sweepFrom + (sweepTo - sweepFrom) * (70 / docW), { transform: "scaleX(0)" }], [b, { transform: "scaleX(1)" }]]);
      });
      const beam = make(doc, "div", "beam");
      track(beam, [[sweepFrom, { left: "0px", opacity: 0 }], [sweepFrom + 0.2, { left: `${docW * 0.2 / (sweepTo - sweepFrom)}px`, opacity: 1 }],
                   [sweepTo - 0.2, { left: `${docW - docW * 0.2 / (sweepTo - sweepFrom)}px`, opacity: 1 }], [sweepTo, { left: `${docW}px`, opacity: 0 }]]);
    },

    words(scene, s) {
      centerWords(scene, s, UPRIGHT ? 700 : 360, UPRIGHT ? 104 : 120);
      const sub = make(scene, "div", "sub", "Entries close October 31");
      sub.style.top = UPRIGHT ? "1080px" : "700px";
      life(sub, s.at + 3 * BEAT, 0.4, "translateY(20px)", s.end, 0.2, "none");
    },

    rule(scene, s) {
      centerWords(scene, s, UPRIGHT ? 560 : 330, UPRIGHT ? 120 : 130);
      const line = make(scene, "div", "rulebig", "<i></i><u></u>");
      const span = UPRIGHT ? 900 : 1400;
      track(line, [[s.at, { transform: "scaleX(0)", opacity: 0 }, OUT], [s.at + 0.6, { transform: "scaleX(1)", opacity: 1 }],
                   [s.end - 0.2, { transform: "scaleX(1)", opacity: 1 }], [s.end, { transform: "scaleX(1)", opacity: 0 }]]);
      const [dot, ring] = line.children;
      track(dot, [[s.at + 0.4, { left: "0px" }, BOTH], [s.at + 2 * BEAT + 0.4, { left: `${span / 2}px` }]]);
      const pulse = (t) => [[t, { opacity: 0, transform: "scale(1)" }], [t + 0.01, { opacity: 0.9, transform: "scale(1)" }, OUT], [t + 1.0, { opacity: 0, transform: "scale(3)" }]];
      ring.style.left = `${span / 2}px`;
      track(ring, [[s.at, { opacity: 0, transform: "scale(1)" }], ...pulse(s.at + 4 * BEAT), ...pulse(s.at + 6 * BEAT)]);
    },

    close(scene, s) {
      scene.classList.add("close");
      mark(scene, W / 2 - 85, UPRIGHT ? 560 : 250, 170, s.at + 0.05);
      const name = make(scene, "div", "name", "Market Hub");
      track(name, [[s.at + 0.2, { opacity: 0, transform: "translateY(40px) scale(0.96)" }, OUT], [s.at + 0.9, { opacity: 1, transform: "none" }]]);
      const say = make(scene, "div", "say");
      ["Free.", "Live today."].forEach((text, k) => life(make(say, "span", "", text), s.at + 1.0 + 2 * BEAT * k, 0.4, "translateY(24px)"));
      const site = make(scene, "div", "site", "<i>themarkethub.app</i>");
      wipe(site.firstChild, s.at + 1.0 + 4 * BEAT, 0.35);
      life(make(scene, "div", "note", "No investment advice"), s.at + 1.0 + 6 * BEAT, 0.5, "none");
    },
  };
}
