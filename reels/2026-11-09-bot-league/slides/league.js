// This reel's shared parts (see league.css). Loaded before robots.js and theme/reel.js:
//
//   the floor (dots and a glow), and on top the HUD: Bot League's mark (the drawing of
//   market-hub-bots/site/src/components/Mark.astro), its name, and one dot per scene with the
//   scene's own lit: <body data-level="3">
//
//   <span class="claude"></span>   the square with an asterisk the site puts on "Crea tu bot con
//                                  Claude" (the site uses the character ✳; drawn here as lines)
//   <svg class="tick"></svg>       filled with a check mark
(() => {
  const html = (text) => { const t = document.createElement("template"); t.innerHTML = text.trim(); return t.content.firstChild; };
  const body = document.body;
  const SCENES = 9;

  body.prepend(html(`<div class="floor"></div>`));
  const level = Number(body.dataset.level || 0);
  const dots = Array.from({ length: SCENES }, (_, i) => `<i class="${i + 1 === level ? "now" : i + 1 < level ? "done" : ""}"></i>`).join("");
  body.append(html(`<header class="hud">
    <span class="mark"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.5 2v16M3.5 2h4l3 3v1.5L7 10M7.5 10l4 4v.5L8 18H3.5M3.5 10h10"></path><circle cx="16.25" cy="10" r="2.5" fill="currentColor" stroke="none"></circle></svg></span>
    <span class="name"><b>Bot League</b><span>un juego de The Market Hub</span></span>
    <span class="levels">${dots}</span></header>`));

  const STAR = `<svg viewBox="0 0 24 24" fill="none" stroke="#0b0c0d" stroke-width="2.6" stroke-linecap="round">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>`;
  for (const el of document.querySelectorAll(".claude")) el.innerHTML = STAR;
  for (const el of document.querySelectorAll("svg.tick")) {
    el.setAttribute("viewBox", "0 0 24 24");
    el.innerHTML = `<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
})();
