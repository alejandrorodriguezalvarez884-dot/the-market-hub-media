// The moving background behind a scene, drawn on a canvas from the film's time: tape (columns of
// figures running up), candles (a candlestick chart sliding by), grid (a glowing floor under a
// rising line), city (towers at night) or plain. The same drawings as theme/reel.js. It is
// decoration, never data: no figure on it is real, and it is kept dim. `seed` changes the drawing,
// so two scenes with the same background do not look the same.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useVideoConfig } from "remotion";
import { useSeconds } from "./scene";

export type Background = "tape" | "candles" | "grid" | "city" | "plain";
export type Tone = "dark" | "light" | "essay";

const clamp = (v: number, low = 0, high = 1) => Math.min(high, Math.max(low, v));
const seedOf = (text: string) => [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Layer = HTMLCanvasElement & { w: number; h: number };
// What is soft or glows is drawn once, small, and only drawn larger after: the enlargement is the
// blur (a blur filter costs seconds a frame on a machine with no graphics card).
const layer = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, scale = 1): Layer => {
  const c = document.createElement("canvas") as Layer;
  c.width = Math.ceil(w * scale);
  c.height = Math.ceil(h * scale);
  const g = c.getContext("2d")!;
  g.scale(scale, scale);
  draw(g);
  c.w = w;
  c.h = h;
  return c;
};

type Painter = (ctx: CanvasRenderingContext2D, t: number) => void;

const painter = (kind: Background, tone: Tone, seedText: string, W: number, H: number, wide: boolean): Painter => {
  const LIGHT = tone !== "dark", ESSAY = tone === "essay";
  const rnd = random(seedOf(kind + seedText));
  let UP = LIGHT ? "18,146,92" : "53,201,143", DOWN = LIGHT ? "224,68,47" : "255,107,87";
  let AMBER = LIGHT ? "194,124,0" : "224,179,65", SKY = LIGHT ? "47,127,214" : "99,179,255";
  const PAPER = ESSAY ? ["#f3f0e9", "#ebe6db", "#f7f5f0"] : ["#f2ede3", "#e9e1d0", "#f6f2ea"];
  if (ESSAY) UP = DOWN = AMBER = SKY = "40,38,34";
  const put = (ctx: CanvasRenderingContext2D, c: Layer, x: number, y: number) => ctx.drawImage(c, x, y, c.w, c.h);

  if (kind === "tape") {
    const cols = Array.from({ length: wide ? 12 : 7 }, (_, i) => {
      const c = {
        x: 40 + i * 168 + rnd() * 30, speed: 18 + rnd() * 40, size: 34 + rnd() * 26,
        cells: Array.from({ length: 40 }, () => ({ v: (rnd() * 99).toFixed(rnd() < 0.5 ? 2 : 1), tint: rnd() })),
        step: 0, total: 0, strip: null as unknown as Layer,
      };
      c.step = c.size * 2.1;
      c.total = c.step * c.cells.length;
      c.strip = layer(200, c.total, (g) => {
        g.font = `600 ${c.size}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace`;
        c.cells.forEach((cell, n) => {
          const y = (((H - n * c.step) % c.total) + c.total) % c.total;
          g.fillStyle = cell.tint < 0.18 ? `rgba(${UP},0.17)` : cell.tint < 0.3 ? `rgba(${DOWN},0.16)` : `rgba(${SKY},0.1)`;
          for (const shift of [-c.total, 0, c.total]) g.fillText(cell.v, 8, y + shift);
        });
      }, 0.35);
      return c;
    });
    const walk: number[] = [];
    let y = 0.5;
    for (let i = 0; i < 80; i++) { y = clamp(y + (rnd() - 0.48) * 0.08, 0.15, 0.85); walk.push(y); }
    return (ctx, t) => {
      ctx.fillStyle = LIGHT ? PAPER[0] : "#06101c";
      ctx.fillRect(0, 0, W, H);
      for (const c of cols) {
        const o = -((t * c.speed) % c.total);
        for (let top = o; top < H; top += c.total) put(ctx, c.strip, c.x - 8, top);
      }
      ctx.strokeStyle = `rgba(${SKY},0.4)`; ctx.lineWidth = 5; ctx.beginPath();
      const step = W / (walk.length - 12);
      walk.forEach((v, i) => { const x = i * step - (t * 22) % step; if (i) ctx.lineTo(x, v * H); else ctx.moveTo(x, v * H); });
      ctx.stroke();
    };
  }
  if (kind === "candles") {
    const n = 90, gap = 34;
    const bars: { open: number; close: number; high: number; low: number }[] = [];
    let close = 0.55;
    for (let i = 0; i < n; i++) {
      const open = close; close = clamp(open + (rnd() - 0.49) * 0.06, 0.12, 0.88);
      bars.push({ open, close, high: Math.min(open, close) - rnd() * 0.03, low: Math.max(open, close) + rnd() * 0.03 });
    }
    const strip = layer(n * gap, H, (g) => {
      for (let i = 0; i < n; i++) {
        const b = bars[i], x = i * gap, color = b.close < b.open ? UP : DOWN;
        g.strokeStyle = `rgba(${color},0.5)`; g.lineWidth = 3;
        g.beginPath(); g.moveTo(x + 11, b.high * H); g.lineTo(x + 11, b.low * H); g.stroke();
        g.fillStyle = `rgba(${color},0.42)`;
        g.fillRect(x, Math.min(b.open, b.close) * H, 22, Math.max(6, Math.abs(b.open - b.close) * H));
      }
      g.strokeStyle = `rgba(${AMBER},0.5)`; g.lineWidth = 4; g.beginPath();
      for (let i = 0; i <= n; i++) {
        let sum = 0; for (let k = 0; k < 6; k++) sum += bars[(i - k + n * 2) % n].close;
        const x = i * gap + 11, yy = (sum / 6) * H; if (i) g.lineTo(x, yy); else g.moveTo(x, yy);
      }
      g.stroke();
    }, 0.5);
    return (ctx, t) => {
      ctx.fillStyle = LIGHT ? PAPER[0] : "#07090b"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = LIGHT ? "rgba(21,18,13,0.06)" : "rgba(255,255,255,0.05)"; ctx.lineWidth = 2;
      for (let yy = 100; yy < H; yy += 160) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      const x = -((t * 26) % (n * gap));
      put(ctx, strip, x, 0);
      put(ctx, strip, x + n * gap, 0);
    };
  }
  if (kind === "grid") {
    const pts: number[] = [];
    let v = 0.3;
    for (let i = 0; i < 60; i++) { v = clamp(v + (rnd() - 0.42) * 0.05, 0.05, 0.95); pts.push(v); }
    const horizon = H * 0.58;
    const line = (g: CanvasRenderingContext2D, width: number, alpha: number) => {
      g.strokeStyle = `rgba(${AMBER},${alpha})`; g.lineWidth = width; g.lineJoin = "round"; g.beginPath();
      pts.forEach((p, i) => { const x = 60 + i * ((W - 120) / pts.length), yy = horizon - p * horizon * 0.55; if (i) g.lineTo(x, yy); else g.moveTo(x, yy); });
      g.stroke();
    };
    const glow = layer(W, H, (g) => { line(g, 40, 0.35); line(g, 18, 0.5); }, 0.12);
    const sharp = layer(W, H, (g) => line(g, 6, 0.75));
    return (ctx, t) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (LIGHT) { g.addColorStop(0, PAPER[2]); g.addColorStop(0.55, PAPER[1]); g.addColorStop(1, PAPER[0]); }
      else { g.addColorStop(0, "#03060d"); g.addColorStop(0.55, "#071528"); g.addColorStop(1, "#02040a"); }
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = `rgba(${SKY},0.22)`; ctx.lineWidth = 2;
      for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 30, horizon); ctx.lineTo(W / 2 + i * 260, H); ctx.stroke(); }
      const run = (t * 0.35) % 1;
      for (let k = 0; k < 14; k++) {
        const p = (k + run) / 14, yy = horizon + Math.pow(p, 2.2) * (H - horizon);
        ctx.globalAlpha = p; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const shown = clamp(0.35 + t / 12, 0, 1) * pts.length;
      const cut = Math.min(W, 60 + shown * ((W - 120) / pts.length) + 30);
      if (cut > 0) {
        ctx.drawImage(glow, 0, 0, (cut * glow.width) / W, glow.height, 0, 0, cut, H);
        ctx.drawImage(sharp, 0, 0, cut, H, 0, 0, cut, H);
      }
    };
  }
  if (kind === "city") {
    const towers: { x: number; w: number; h: number; lit: number }[] = [];
    const stars: { x: number; y: number; r: number; p: number }[] = [];
    let x = -20;
    while (x < W) { const w = 70 + rnd() * 120; towers.push({ x, w, h: (380 + rnd() * 760) * (wide ? 0.55 : 1), lit: rnd() }); x += w + 6; }
    for (let i = 0; i < 120; i++) stars.push({ x: rnd() * W, y: rnd() * H * 0.45, r: rnd() * 2 + 0.5, p: rnd() * 6 });
    return (ctx, t) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (LIGHT) { g.addColorStop(0, "#f7f3ec"); g.addColorStop(0.6, "#ebe2cf"); g.addColorStop(1, "#e4dac5"); }
      else { g.addColorStop(0, "#050914"); g.addColorStop(0.6, "#0b1730"); g.addColorStop(1, "#05070c"); }
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (!LIGHT) for (const s of stars) { ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(t * 1.3 + s.p)})`; ctx.fillRect(s.x, s.y, s.r, s.r); }
      const base = H * 0.86, drift = Math.sin(t * 0.15) * 12;
      for (const tw of towers) {
        ctx.fillStyle = LIGHT ? "rgba(120,100,70,0.16)" : "#03050a"; ctx.fillRect(tw.x + drift, base - tw.h, tw.w, tw.h + 200);
        const r = random(Math.floor(tw.x * 1000));
        for (let wy = base - tw.h + 30; wy < base; wy += 34) for (let wx = tw.x + 14; wx < tw.x + tw.w - 14; wx += 26) {
          if (r() < 0.32 * (0.5 + tw.lit)) { ctx.fillStyle = `rgba(${AMBER},${0.25 + r() * 0.35})`; ctx.fillRect(wx + drift, wy, 10, 14); }
        }
      }
    };
  }
  return () => {};
};

/** The background of a scene, slowly pushed in. Its time is the scene's own. */
export const Backdrop: React.FC<{ kind: Background; tone: Tone; seed: string }> = ({ kind, tone, seed }) => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  const W = width + 80, H = height + 80;
  const ref = useRef<HTMLCanvasElement>(null);
  const paint = useMemo(() => (kind === "plain" ? null : painter(kind, tone, seed, W, H, wide)), [kind, tone, seed, W, H, wide]);
  const t = useSeconds();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx && paint) paint(ctx, t);
  }, [paint, t]);
  if (!paint) return null;
  const push = 1 + 0.09 * Math.min(1, t / (tone === "essay" ? 30 : 14));
  return (
    <canvas ref={ref} className="bg" width={W} height={H}
      style={{ left: -40, top: -40, width: W, height: H, transform: `scale(${push})`, opacity: tone === "essay" ? 0.7 : 1 }} />
  );
};
