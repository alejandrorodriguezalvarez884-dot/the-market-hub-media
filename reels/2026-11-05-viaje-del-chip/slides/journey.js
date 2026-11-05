// The journey's route at the top of a scene (journey.css): fills every <div class="route"> from
// <body data-stop="N">, N the stop this scene is at (1 to 6; 0 before setting off, 7 at the end);
// data-stay on the body for a second scene at the same stop.
// Loaded before theme/reel.js, so that a data-lit="cue|cue|..." on the route (one cue per stop)
// becomes data-say on each stop and lights it when the voice says it, as in the recap.
(() => {
  const STOPS = [
    ["Zeiss", "Alemania"], ["ASML", "P. Bajos"], ["TSMC", "Taiwán"],
    ["Nvidia·AMD", "California"], ["La nube", "El mundo"], ["Modelo", "Tu pantalla"],
  ];
  const at = Number(document.body.dataset.stop || 0);
  const x = (i) => ((i + 0.5) / STOPS.length) * 100;          // centre of stop i, in % of the route
  const w = (i) => ((Math.max(0, Math.min(i, STOPS.length - 1))) / (STOPS.length - 1)) * 100;   // the line, in % of the track
  for (const route of document.querySelectorAll(".route")) {
    const lit = (route.dataset.lit || "").split("|").filter(Boolean);
    const stay = "stay" in document.body.dataset;          // a second scene at the same stop: no ride
    const here = at - 1, from = stay ? Math.max(0, here) : Math.max(0, at - 2);
    route.style.setProperty("--from-x", `${x(from)}%`);
    route.style.setProperty("--to-x", `${x(Math.max(0, here))}%`);
    route.style.setProperty("--from-w", `${at >= 1 ? w(from) : 0}%`);
    route.style.setProperty("--to-w", `${at >= 1 ? w(here) : 0}%`);
    route.style.setProperty("--arrive", at >= 2 && !stay ? "1.7s" : "0.2s");
    let html = `<div class="track"><i></i></div>`;
    STOPS.forEach(([name, place], i) => {
      const kind = lit.length ? "lit" : i < here ? "past" : i === here ? "here" : "";
      const say = lit[i] ? ` data-say="${lit[i]}"` : "";
      html += `<div class="stop ${kind}"${say} style="left:${x(i) - 8.333}%"><span class="dot"><b></b></span>` +
              `<span class="name">${name}</span><span class="place">${place}</span></div>`;
    });
    if (at >= 1 && at <= STOPS.length && !lit.length) html += `<span class="traveller"></span>`;
    route.innerHTML = html;
  }
})();
