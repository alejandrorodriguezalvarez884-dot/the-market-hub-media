// Figures that count up. A slide loads this file (<script src="../../../theme/slide.js"></script>)
// and marks a figure:
//
//   <span data-count="4.2" data-decimals="1" data-prefix="$" data-suffix=" bn" data-at="0.8" data-for="1.2"></span>
//
// It goes from data-from (0 if not said) to data-count, starting data-at seconds into the scene
// and taking data-for seconds (1.2 if not said). The frames are not filmed while this plays: the
// page is asked to draw itself at the time of each frame (window.slideAt), so the same script
// always gives the same film.
(() => {
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
  const draw = (seconds) => {
    for (const f of figures) {
      const part = Math.min(1, Math.max(0, (seconds - f.at) / f.takes));
      const eased = 1 - Math.pow(1 - part, 3);
      const value = f.from + (f.to - f.from) * eased;
      const text = value.toLocaleString("en-US", { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals });
      f.el.textContent = f.prefix + text + f.suffix;
    }
  };
  window.slideSeconds = Math.max(Number(window.slideSeconds) || 0, ...figures.map((f) => f.at + f.takes));
  window.slideAt = draw;
  draw(Infinity);  // opened in a browser, the slide shows its figures as they end
})();
