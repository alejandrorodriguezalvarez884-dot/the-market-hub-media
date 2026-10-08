// What a slide of a tour (kind: demo) does with a screen of the site. A slide loads this file
// after theme/slide.js, and links theme/tour.css, which shows how such a slide is laid out.
//
// 1. The camera. A screen fills its window; data-cam says which part of it the window shows, and
//    when:
//
//      <div class="shot" data-cam="0:50,50,1 four_figures:60,26,1.6 read-0.3:60,70,1.4"><img ...></div>
//
//    Each stop is "when:x,y,zoom". "when" is a word of the narration or seconds, as in data-say
//    ("_" between the words of a phrase). x and y are the point of the screen, in percent of it,
//    brought to the middle of the window; zoom is how many times larger than the window the
//    screen is drawn (1 shows it whole). The window never shows past an edge of the screen. The
//    move to a stop starts on its word and takes MOVE seconds.
//
// 2. A mark around a part of the screen, in percent of the screen:
//
//      <i class="spot" data-say="four_figures" data-off="read" style="--x:21; --y:19; --w:77; --h:14"></i>
//
//    It shows from data-say until data-off (to the end of the scene if not said).
//
// Like the rest of a slide, nothing here plays by itself: the page is drawn at the time of each
// frame (window.slideAt), so the same script always gives the same film.
(() => {
  const MOVE = 0.9, FADE = 0.25;
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const ease = (k) => k * k * (3 - 2 * k);
  const setup = window.slideSetup, drawAt = window.slideAt;
  let shots = [], spots = [];

  const stops = (text) => text.trim().split(/\s+/).map((stop) => {
    const cut = stop.lastIndexOf(":");
    const [x, y, zoom] = stop.slice(cut + 1).split(",").map(Number);
    return { at: window.slideWhen(stop.slice(0, cut)), x, y, zoom: zoom || 1 };
  }).sort((a, b) => a.at - b.at);

  // Where the screen is put so that (x, y) is in the middle of the window, without showing past an edge.
  const place = (el, x, y, zoom) => {
    const left = clamp(50 - x * zoom, 100 - 100 * zoom, 0);
    const top = clamp(50 - y * zoom, 100 - 100 * zoom, 0);
    el.style.transform = `translate(${left}%, ${top}%) scale(${zoom})`;
  };

  const draw = (seconds) => {
    for (const shot of shots) {
      let now = shot.stops[0];
      for (const next of shot.stops.slice(1)) {
        if (seconds < next.at) break;
        const k = ease(clamp((seconds - next.at) / MOVE));
        now = { x: now.x + (next.x - now.x) * k, y: now.y + (next.y - now.y) * k, zoom: now.zoom + (next.zoom - now.zoom) * k };
      }
      place(shot.el, now.x, now.y, now.zoom);
    }
    for (const spot of spots) {
      spot.el.style.opacity = clamp((seconds - spot.on) / FADE) * (1 - clamp((seconds - spot.off) / FADE));
    }
  };

  window.slideSetup = () => {
    setup();
    shots = [...document.querySelectorAll("[data-cam]")].map((el) => ({ el, stops: stops(el.dataset.cam) }));
    spots = [...document.querySelectorAll(".spot")].map((el) => ({
      el, on: window.slideWhen(el.dataset.say || "0"), off: el.dataset.off ? window.slideWhen(el.dataset.off) : Infinity,
    }));
  };
  window.slideAt = (seconds) => {
    drawAt(seconds);
    draw(seconds);
  };
  window.slideSetup();
  draw(1e6);   // opened in a browser, the slide shows its screen as the scene ends
})();
