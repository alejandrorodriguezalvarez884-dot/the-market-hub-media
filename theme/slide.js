// What a slide can do that plain CSS cannot. A slide loads this file last, before </body>, and
// theme/presenter.js before it when the presenter is on it:
//
//   <script src="../../../theme/presenter.js"></script>
//   <script src="../../../theme/slide.js"></script>
//
// The frames of a film are not recorded while this plays. The page is told what its scene is
// (window.slideScene, from frames.py: how long it lasts, when each word of its narration is said,
// its voice, its series), and is then asked to draw itself at the time of each frame
// (window.slideAt), so the same script always gives the same film. Opened in a browser with no
// scene, a slide shows itself as it ends.
//
// 1. Things that come in when the voice gets to them.
//
//      <li class="in" data-say="inflation">Inflation</li>
//
//    data-say names a word of the scene's narration: the element's movement (.in, .pop, .hl...
//    of theme/slide.css) starts when that word is said. Several words find a phrase
//    ("plain english"); "#2" takes the second time it is said ("money#2"); "+0.3" or "-0.3" moves
//    it by that many seconds; a plain number is seconds from the start of the scene.
//
// 2. Figures that count up.
//
//      <span data-count="4.2" data-decimals="1" data-prefix="$" data-suffix=" bn" data-say="billion" data-for="1.2"></span>
//
//    From data-from (0 if not said) to data-count, starting at data-say (or data-at seconds) and
//    taking data-for seconds (1.2 if not said).
//
// 3. The series: an element with data-series is given the series' name and the episode's number,
//    and --accent becomes the series' colour.
//
// 4. The presenter (theme/presenter.js), in every <div class="presenter"></div>.
//
// 5. Over every slide of a film: how far into the film it is, the panel that crosses the frame
//    from one scene to the next and, in the Short, the captions.
(() => {
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const root = document.documentElement;
  const still = document.body.classList.contains("thumbnail");
  let scene = {};

  // --- When a word is said -----------------------------------------------------------------------
  const plain = (word) => word.toLowerCase().replace(/[^a-z0-9]/g, "");
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
    window.slideMissing.push(text);   // frames.py says so: a slide waiting for a word nobody says
    return 0;
  };
  window.slideWhen = when;   // for what a slide adds of its own (theme/tour.js)

  // --- Figures that count up ---------------------------------------------------------------------
  let figures = [];
  const count = (seconds) => {
    for (const f of figures) {
      const part = clamp((seconds - f.at) / f.takes);
      const value = f.from + (f.to - f.from) * (1 - Math.pow(1 - part, 3));
      const text = value.toLocaleString("en-US", { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals });
      f.el.textContent = f.prefix + text + f.suffix;
    }
  };

  // --- The presenter -----------------------------------------------------------------------------
  const hosts = window.Presenter ? [...document.querySelectorAll(".presenter")].map(window.Presenter.mount) : [];

  // --- Over the slide: progress, the panel between scenes, the Short's captions ------------------
  const over = (name) => {
    const el = document.createElement("div");
    el.className = name;
    document.body.appendChild(el);
    return el;
  };
  const progress = still ? null : over("progress");
  const wipe = still ? null : over("wipe");
  const captions = still ? null : over("captions");
  let lines = [];
  const OUT = 0.2, IN = 0.3;   // seconds the panel takes to cover a scene, and to uncover the next
  const chrome = (seconds) => {
    if (!progress || !scene.seconds) return;
    const t = clamp(seconds, 0, scene.seconds);
    progress.style.transform = `scaleX(${scene.total ? clamp((scene.start + t) / scene.total) : 0})`;
    let x = -102;
    if (!scene.first && t < IN) x = 102 * Math.pow(t / IN, 2);
    else if (!scene.last && t > scene.seconds - OUT) x = -102 * (1 - Math.pow(1 - (scene.seconds - t) / OUT, 2));
    wipe.style.transform = `translateX(${x}%)`;
    for (const line of lines) {
      const on = t >= line.at && t < line.end;
      line.el.classList.toggle("on", on);
      if (!on) continue;
      line.el.style.transform = `scale(${0.9 + 0.1 * (1 - Math.pow(1 - clamp((t - line.at) / 0.12), 3))})`;
      line.words.forEach((word, n) => word.el.classList.toggle("now", t >= word.at && (n + 1 === line.words.length || t < line.words[n + 1].at)));
    }
  };

  // --- The scene, once it is known ---------------------------------------------------------------
  window.slideSetup = () => {
    scene = window.slideScene || {};
    window.slideMissing = [];
    if (scene.series && scene.series.accent) root.style.setProperty("--accent", scene.series.accent);
    if (scene.series && scene.series.name) {
      const label = scene.series.name + (scene.episode ? ` · EP ${String(scene.episode).padStart(2, "0")}` : "");
      for (const el of document.querySelectorAll("[data-series]")) el.textContent = label;
    }
    for (const el of document.querySelectorAll("[data-say]:not([data-count])")) el.style.setProperty("--at", `${when(el.dataset.say)}s`);
    figures = [...document.querySelectorAll("[data-count]")].map((el) => ({
      el,
      from: Number(el.dataset.from || 0),
      to: Number(el.dataset.count),
      at: el.dataset.say ? when(el.dataset.say) : Number(el.dataset.at || 0),
      takes: Number(el.dataset.for || 1.2),
      decimals: Number(el.dataset.decimals || 0),
      prefix: el.dataset.prefix || "",
      suffix: el.dataset.suffix || "",
    }));
    for (const host of hosts) host.set(scene.voice, when);
    if (captions) {
      captions.textContent = "";
      lines = (scene.captions || []).map((line) => {
        const el = document.createElement("div");
        el.className = "caption";
        const words = line.words.map((word, n) => {
          const span = document.createElement("span");
          span.textContent = word.word;
          el.append(n ? " " : "", span);
          return { el: span, at: word.at };
        });
        captions.appendChild(el);
        return { el, at: line.at, end: line.end, words };
      });
    }
    // How long the page moves on its own, apart from what lasts the whole scene.
    window.slideSeconds = Math.max(0, ...figures.map((f) => f.at + f.takes));
  };

  // --- What the film asks of the page ------------------------------------------------------------
  window.slideAt = (seconds) => {
    count(seconds);
    chrome(seconds);
    const levels = (scene.voice && scene.voice.levels) || [];
    root.style.setProperty("--voice", levels[Math.floor(seconds * ((scene.voice && scene.voice.fps) || 30))] || 0);
    for (const host of hosts) host.at(seconds);
  };
  window.slideSetup();
  count(Infinity);   // opened in a browser, the slide shows its figures as they end
  for (const host of hosts) host.at(0);
})();
