// Cuts a part out of a photograph of a tool and fits it in its frame.
// <div class="shot" data-src="..png" data-crop="x,y,w,h"> takes the rectangle (in the page's CSS
// pixels: the photographs are of a 1440-wide page at twice the pixels) and scales it to fill the
// stage as far as it fits, or, in a stack, to data-box="left,top,width" in the stage.
(function () {
  const PAGE = 1440;
  for (const shot of document.querySelectorAll(".shot")) {
    const [x, y, w, h] = shot.dataset.crop.split(",").map(Number);
    let scale;
    if (shot.dataset.box) {
      const [left, top, width] = shot.dataset.box.split(",").map(Number);
      scale = width / w;
      Object.assign(shot.style, { left: left + "px", top: top + "px" });
    } else {
      const stage = shot.parentElement;
      const most = Number(shot.dataset.most || 1.6);
      scale = Math.min(stage.clientWidth / w, stage.clientHeight / h, most);
    }
    shot.style.width = w * scale + "px";
    shot.style.height = h * scale + "px";
    const img = document.createElement("img");
    img.src = shot.dataset.src;
    Object.assign(img.style, { width: PAGE * scale + "px", left: -x * scale + "px", top: -y * scale + "px" });
    shot.append(img);
  }
})();
