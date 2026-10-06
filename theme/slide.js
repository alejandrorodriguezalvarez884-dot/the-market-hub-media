// What a slide can do that plain CSS cannot. A slide loads this file last, before </body>:
//
//   <script src="../../../theme/slide.js"></script>
//
// The frames of a film are not recorded while this plays. The page is asked to draw itself at the
// time of each frame (window.slideAt), so the same script always gives the same film.
//
// 1. Figures that count up.
//
//      <span data-count="4.2" data-decimals="1" data-prefix="$" data-suffix=" bn" data-at="0.8" data-for="1.2"></span>
//
//    It goes from data-from (0 if not said) to data-count, starting data-at seconds into the scene
//    and taking data-for seconds (1.2 if not said).
//
// 2. The presenter: the channel's host, drawn here.
//
//      <div class="presenter"></div>
//
//    He blinks, and his mouth follows the voice of the scene: how loud it is at each frame is
//    handed to the page as window.slideVoice = {fps, levels: [0..1, ...]}. With no voice yet, he
//    waits with his mouth closed. theme/slide.css sizes and places him.
(() => {
  // --- Figures that count up -------------------------------------------------------------------
  const figures = [...document.querySelectorAll("[data-count]")].map((el) => ({
    el,
    from: Number(el.dataset.from || 0),
    to: Number(el.dataset.count),
    at: Number(el.dataset.at || 0),
    takes: Number(el.dataset.for || 1.2),
    decimals: Number(el.dataset.decimals || 0),
    prefix: el.dataset.prefix || "",
    suffix: el.dataset.suffix || "",
  }));
  const count = (seconds) => {
    for (const f of figures) {
      const part = Math.min(1, Math.max(0, (seconds - f.at) / f.takes));
      const eased = 1 - Math.pow(1 - part, 3);
      const value = f.from + (f.to - f.from) * eased;
      const text = value.toLocaleString("en-US", { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals });
      f.el.textContent = f.prefix + text + f.suffix;
    }
  };

  // --- The presenter ---------------------------------------------------------------------------
  // A bust in flat colours: nobody's face. Five mouths, from closed (m0) to wide open (m4).
  const HOST = `
<svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M30 440 C30 352 96 322 158 308 L242 308 C304 322 370 352 370 440 Z" fill="#1d2838"/>
  <path d="M158 308 L200 380 L242 308 Z" fill="#f2f0ea"/>
  <path d="M158 308 L200 380 L172 412 L132 316 Z" fill="#2a3a52"/>
  <path d="M242 308 L200 380 L228 412 L268 316 Z" fill="#2a3a52"/>
  <path d="M190 330 L210 330 L216 352 L208 420 L200 432 L192 420 L184 352 Z" fill="#7aa2f7"/>
  <path d="M190 330 L210 330 L214 348 L186 348 Z" fill="#5f86d8"/>
  <path d="M168 244 L168 310 Q200 338 232 310 L232 244 Z" fill="#c98f6b"/>
  <g class="head">
    <ellipse cx="116" cy="190" rx="13" ry="22" fill="#d39c77"/>
    <ellipse cx="284" cy="190" rx="13" ry="22" fill="#d39c77"/>
    <path d="M122 150 C122 84 278 84 278 150 L278 204 C278 262 238 294 200 294 C162 294 122 262 122 204 Z" fill="#e0ac86"/>
    <path d="M116 168 C102 88 160 52 208 56 C262 58 300 96 284 168 C280 138 266 116 244 110 C206 126 160 120 136 110 C124 124 120 144 116 168 Z" fill="#2b2622"/>
    <path d="M144 160 Q162 149 182 158" stroke="#2b2622" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M218 158 Q238 149 256 160" stroke="#2b2622" stroke-width="7" stroke-linecap="round" fill="none"/>
    <g class="eyes">
      <ellipse cx="164" cy="187" rx="11" ry="9" fill="#ffffff"/><circle cx="165" cy="187" r="6" fill="#2b2622"/><path d="M152 183 Q164 174 176 183" stroke="#2b2622" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="236" cy="187" rx="11" ry="9" fill="#ffffff"/><circle cx="235" cy="187" r="6" fill="#2b2622"/><path d="M224 183 Q236 174 248 183" stroke="#2b2622" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </g>
    <g class="lids">
      <path d="M152 187 Q164 194 176 187" stroke="#2b2622" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M224 187 Q236 194 248 187" stroke="#2b2622" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
    <path d="M200 196 Q192 222 199 228 Q205 231 211 226" stroke="#c98f6b" stroke-width="5" stroke-linecap="round" fill="none"/>
    <g class="mouth m0"><path d="M176 254 Q200 266 224 254" stroke="#8a4b3c" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <g class="mouth m1"><path d="M177 253 Q200 247 223 253 Q200 268 177 253 Z" fill="#6b2f2a"/></g>
    <g class="mouth m2"><path d="M176 250 Q200 243 224 250 Q200 277 176 250 Z" fill="#6b2f2a"/>
      <path d="M184 250 Q200 246 216 250 L213 255 Q200 252 187 255 Z" fill="#ffffff"/></g>
    <g class="mouth m3"><path d="M178 247 Q200 239 222 247 Q226 270 200 281 Q174 270 178 247 Z" fill="#6b2f2a"/>
      <path d="M184 248 Q200 243 216 248 L214 254 Q200 250 186 254 Z" fill="#ffffff"/>
      <path d="M188 271 Q200 264 212 271 Q200 280 188 271 Z" fill="#c9665c"/></g>
    <g class="mouth m4"><path d="M175 245 Q200 235 225 245 Q231 275 200 288 Q169 275 175 245 Z" fill="#6b2f2a"/>
      <path d="M182 246 Q200 240 218 246 L216 253 Q200 248 184 253 Z" fill="#ffffff"/>
      <path d="M186 276 Q200 267 214 276 Q200 287 186 276 Z" fill="#c9665c"/></g>
  </g>
</svg>`;
  const hosts = [...document.querySelectorAll(".presenter")];
  for (const el of hosts) el.innerHTML = HOST;

  const mouth = (seconds) => {
    const voice = window.slideVoice;
    if (!voice || !voice.levels) return 0;
    const level = voice.levels[Math.floor(seconds * voice.fps)] || 0;
    return level < 0.12 ? 0 : level < 0.3 ? 1 : level < 0.5 ? 2 : level < 0.75 ? 3 : 4;
  };
  // He blinks now and then: two rhythms that do not line up, so it does not look like a clock.
  const blink = (seconds) => (seconds % 3.9 > 3.75 || seconds % 7.3 > 7.18 ? 1 : 0);
  const face = (seconds) => {
    for (const el of hosts) {
      el.dataset.mouth = mouth(seconds);
      el.dataset.blink = blink(seconds);
    }
  };

  // --- What the film asks of the page ------------------------------------------------------------
  // How long the page moves on its own, apart from the presenter.
  window.slideSeconds = Math.max(Number(window.slideSeconds) || 0, ...figures.map((f) => f.at + f.takes));
  window.slideAt = (seconds) => { count(seconds); face(seconds); };
  // Once everything else is at rest, a frame is told from another only by the presenter's face:
  // frames with the same key are the same picture. No presenter, no key.
  if (hosts.length) window.slideKey = (seconds) => `m${mouth(seconds)}b${blink(seconds)}`;
  count(Infinity);  // opened in a browser, the slide shows its figures as they end
  face(0);
})();
