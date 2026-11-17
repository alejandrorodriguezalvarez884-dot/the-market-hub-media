// "La ciudad": the look of the A fondo reel on the S&P 500's concentration (2026-11-17), built on
// the machinery of "La nave" (reels/2026-11-11-neoclouds). The world is the index as a city: one
// building per company of the S&P 500 (503, from State Street's SPY holdings of 16 Nov 2026, in
// data/weights.json), each as tall as its weight in the index. A scene is
//
//   <Frame world={<World cam={...}><City tone={...} /></World>}>
//     <Head kick="El índice"><h1>Siete empresas <Hi say="tercio">un tercio</Hi></h1></Head>
//     <Card say="siete" tone="ice" style={{ left: 72, top: 1000, width: 560 }}>...</Card>
//     <Src>State Street, cartera del SPY.</Src>
//   </Frame>
//
// The world is drawn in CSS 3D: a camera (World) over a floor where things stand as boxes (Box):
// the buildings of the index (City), towers of figures (Towers), and labels that always face the
// camera (Bill, Over). Everything that moves is moved from the frame (useSeconds), never by CSS, so
// the same scene always gives the same film. Units in the world are pixels; +z is up, +y is
// towards the camera.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, useVideoConfig } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./ciudad.css";
import WEIGHTS from "../../data/weights.json";
import profile from "../../../../channel/instagram-profile.jpg";

export const BG = "#04060b", FG = "#f3f6fb", SOFT = "#c9d2df", DIM = "#8a96a8", ICE = "#7fe3ff", ICE2 = "#c7f4ff", AMBER = "#ffb547", UP = "#3ee6a0", DOWN = "#ff6a5e";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
/** From 0 to 1 between `at` and `at + takes`. */
export const prog = (t: number, at: number, takes: number) => clamp((t - at) / Math.max(takes, 1e-6));
/** Arrives fast and settles, with no bounce. */
export const ease = (p: number) => OUT(clamp(p));
/** Slow at both ends: for the camera. */
export const glide = (p: number) => INOUT(clamp(p));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const es = (n: number, decimals = 0) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: "always" as never }).replace("-", "−");
/** A number from 0 to 1 that is always the same for the same inputs. */
export const hash = (...n: number[]) => {
  let h = 2166136261;
  for (const v of n) { h ^= Math.floor(v * 1000) + 0x9e3779b9; h = Math.imul(h, 16777619); h ^= h >>> 13; }
  return ((h >>> 0) % 100000) / 100000;
};

// ---------------------------------------------------------------- the frame

/** The frame of every scene: the world behind, the haze that keeps the words readable, the grain,
 * the brand and a bar per scene. `haze` darkens the top (0 to 1) where the headline sits. */
export const Frame: React.FC<{ world?: React.ReactNode; haze?: number; low?: number; children?: React.ReactNode }> = ({ world, haze = 0.85, low = 0.94, children }) => {
  const t = useSeconds();
  const scene = useScene();
  const { width, height } = useVideoConfig();
  const film = useFilmSeconds();
  const top = `linear-gradient(180deg, rgba(4,6,11,${haze}) 0%, rgba(4,6,11,${(haze * 0.85).toFixed(3)}) 24%, rgba(4,6,11,${(haze * 0.25).toFixed(3)}) 44%, rgba(4,6,11,0) 56%)`;
  const bottom = `linear-gradient(0deg, rgba(4,6,11,${low}) 0%, rgba(4,6,11,${low}) 18%, rgba(4,6,11,${(low * 0.6).toFixed(3)}) 26%, rgba(4,6,11,0) 37%)`;
  const cold = `radial-gradient(70% 40% at ${50 + Math.sin(film * 0.3) * 6}% 72%, rgba(255,181,71,0.08), transparent 70%)`;
  return (
    <AbsoluteFill className={`cd${width > height ? " wide" : ""}`}>
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, cold].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="cd-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
        <rect width="100%" height="100%" filter="url(#cd-grain)" />
      </svg>
      <div className="over">
        <header className="hud">
          <div className="row">
            <span>The Market Hub · <b>A fondo</b></span>
            <span><b>{String(scene.index + 1).padStart(2, "0")}</b> / {String(scene.count).padStart(2, "0")}</span>
          </div>
          <div className="bars">
            {Array.from({ length: scene.count }, (_, i) => (
              <i key={i}><span style={{ transform: `scaleX(${i < scene.index ? 1 : i === scene.index ? clamp(t / Math.max(scene.seconds, 0.1)) : 0})` }} /></i>
            ))}
          </div>
        </header>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** The headline block, with a kicker over it (what the scene is about). */
export const Head: React.FC<{ kick?: React.ReactNode; tone?: "amber" | "up"; style?: React.CSSProperties; children: React.ReactNode }> = ({ kick, tone, style, children }) => {
  const t = useSeconds();
  const p = ease(prog(t, 0, 0.6));
  return (
    <div className="head" style={style}>
      {kick && <p className={`kick${tone ? ` ${tone}` : ""}`} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{kick}</p>}
      {children}
    </div>
  );
};

const LIT: Record<string, [string, string]> = { ice: [ICE, ICE2], amber: [AMBER, "#ffe2b0"], up: [UP, "#c4ffe6"], down: [DOWN, "#ffc4bd"] };
/** The words of the headline that carry it: colour sweeps over them when their cue is said (with
 * no cue, they are lit from the first frame). */
export const Hi: React.FC<{ say?: string | number; tone?: "ice" | "amber" | "up" | "down"; children: React.ReactNode }> = ({ say, tone = "ice", children }) => {
  const at = useSay(say);
  const t = useSeconds();
  const p = say === undefined ? 1 : ease(prog(t, at - 0.05, 0.6));
  const [a, b] = LIT[tone];
  const edge = (p * 100).toFixed(1);
  return <span className="hi" style={{ backgroundImage: `linear-gradient(90deg, ${a} 0%, ${b} ${edge}%, ${FG} ${edge}%)` }}>{children}</span>;
};

/** A panel that rises into place when its cue is said (with no cue, it is there from the first
 * frame); `gone`, a cue at which it leaves. Give it left/top (and width) in `style`. */
export const Card: React.FC<{ say?: string | number; gone?: string | number; tone?: "key" | "ice" | "amber" | "up" | "down"; className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  say, gone, tone, className = "", style, children,
}) => {
  const t = useSeconds();
  const at = useSay(say), out = useSay(gone);
  const p = say === undefined ? 1 : ease(prog(t, at, 0.55));
  const q = gone === undefined ? 0 : ease(prog(t, out, 0.4));
  if (p <= 0 || q >= 1) return null;
  return (
    <div className={`card${tone ? ` ${tone}` : ""} ${className}`}
      style={{ ...style, opacity: clamp(p * 1.8) * (1 - q), transform: `translateY(${((1 - p) * 34 - q * 20).toFixed(2)}px) scale(${(0.96 + 0.04 * p).toFixed(4)})` }}>
      {children}
    </div>
  );
};

/** A figure that counts up to `to` when its cue is said, written the Spanish way. */
export const Num: React.FC<{ to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; say?: string | number; takes?: number; className?: string; style?: React.CSSProperties }> = ({
  to, from = 0, decimals = 0, prefix = "", suffix = "", say, takes = 1.2, className = "num", style,
}) => {
  const t = useSeconds();
  const at = useSay(say);
  const p = ease(prog(t, at, takes));
  return <span className={className} style={style}>{prefix}{es(mix(from, to, p), decimals)}{suffix}</span>;
};

export const Logo: React.FC<{ name: string; h?: number; style?: React.CSSProperties }> = ({ name, h = 64, style }) => (
  <span className="logo" style={{ height: h, ...style }}><Img src={logoUrl(name)} alt={name} /></span>
);

export const Src: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <p className="src" style={style}>{children}</p>;

// ---------------------------------------------------------------- the world

export type Cam = { rx: number; rz: number; x: number; y: number; z?: number; oy?: number };
const CamContext = createContext<Cam>({ rx: 60, rz: -30, x: 0, y: 0 });
export const useCam = () => useContext(CamContext);
/** A camera between two framings, `p` from 0 to 1. */
export const between = (a: Cam, b: Cam, p: number): Cam => ({
  rx: mix(a.rx, b.rx, p), rz: mix(a.rz, b.rz, p), x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), z: mix(a.z ?? 0, b.z ?? 0, p), oy: mix(a.oy ?? 0, b.oy ?? 0, p),
});

/** The camera: looks at (x, y) on the floor from `rx` degrees above (90 is straight down... and 0
 * is level), turned `rz` degrees; `z` brings it closer, `oy` moves the point looked at down the screen. */
export const World: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <CamContext.Provider value={cam}>
    <div className="cam" style={{ transform: `translate3d(0px, ${(cam.oy ?? 0).toFixed(2)}px, ${(cam.z ?? 0).toFixed(2)}px) rotateX(${cam.rx.toFixed(3)}deg) rotateZ(${cam.rz.toFixed(3)}deg) translate3d(${(-cam.x).toFixed(2)}px, ${(-cam.y).toFixed(2)}px, 0px)` }}>
      {children}
    </div>
  </CamContext.Provider>
);

type Faces = { top?: string; front?: string; side?: string; back?: string };
/** A box standing on the floor: its corner at (x, y), raised `z`, `w` along x, `d` along y, `h`
 * tall. `faces` are CSS backgrounds; `front` and `top` may hold drawings (children). */
export const Box: React.FC<{
  x: number; y: number; z?: number; w: number; d: number; h: number; faces: Faces;
  front?: React.ReactNode; top?: React.ReactNode; glow?: string; opacity?: number; back?: boolean;
}> = ({ x, y, z = 0, w, d, h, faces, front, top, glow, opacity = 1, back = false }) => {
  if (h <= 0.01 || opacity <= 0) return null;
  const f = (n: number) => n.toFixed(2);
  const base: React.CSSProperties = { opacity };
  return (
    <>
      <div className="face" style={{ ...base, left: x, top: y, width: w, height: d, background: faces.top, transform: `translateZ(${f(z + h)}px)` }}>{top}</div>
      <div className="face" style={{ ...base, left: x, top: y + d - h, width: w, height: h, background: faces.front, transformOrigin: "50% 100%", transform: `translateZ(${f(z)}px) rotateX(-90deg)`, boxShadow: glow }}>{front}</div>
      <div className="face" style={{ ...base, left: x + w - h, top: y, width: h, height: d, background: faces.side, transformOrigin: "100% 50%", transform: `translateZ(${f(z)}px) rotateY(90deg)` }} />
      <div className="face" style={{ ...base, left: x, top: y, width: h, height: d, background: faces.side, transformOrigin: "0% 50%", transform: `translateZ(${f(z)}px) rotateY(-90deg)` }} />
      {back && <div className="face" style={{ ...base, left: x, top: y, width: w, height: h, background: faces.back ?? faces.side, transformOrigin: "50% 0%", transform: `translateZ(${f(z)}px) rotateX(90deg)` }} />}
    </>
  );
};

/** Something flat that always faces the camera, its foot at (x, y, z): a label, a figure, a logo. */
export const Bill: React.FC<{ x: number; y: number; z?: number; anchor?: "foot" | "middle"; opacity?: number; scale?: number; children: React.ReactNode }> = ({
  x, y, z = 0, anchor = "foot", opacity = 1, scale = 1, children,
}) => {
  const cam = useCam();
  if (opacity <= 0) return null;
  return (
    <div className="face" style={{ left: 0, top: 0, opacity, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateZ(${(-cam.rz).toFixed(3)}deg) rotateX(${(-cam.rx).toFixed(3)}deg) scale(${scale}) translate(-50%, ${anchor === "foot" ? "-100%" : "-50%"})` }}>
      {children}
    </div>
  );
};

/** The floor: a dark plane with a fine grid, centred on (cx, cy). */
export const Floor: React.FC<{ cx?: number; cy?: number; w: number; d: number; step?: number; glow?: string; children?: React.ReactNode }> = ({ cx = 0, cy = 0, w, d, step = 60, glow, children }) => (
  <div className="face" style={{
    left: cx - w / 2, top: cy - d / 2, width: w, height: d,
    background: [
      glow ?? "radial-gradient(50% 50% at 50% 50%, rgba(127,227,255,0.07), transparent 75%)",
      `repeating-linear-gradient(0deg, rgba(150,200,255,0.10) 0 1.5px, transparent 1.5px ${step}px)`,
      `repeating-linear-gradient(90deg, rgba(150,200,255,0.10) 0 1.5px, transparent 1.5px ${step}px)`,
      "radial-gradient(60% 60% at 50% 50%, #0b1220, #04060b 100%)",
    ].join(", "),
  }}>{children}</div>
);

// ---------------------------------------------------------------- towers of figures

export type Tower = { label: string; value: number; text: string; tone?: "ice" | "amber" | "up" | "down" | "dim"; at?: number };
const TONES: Record<string, [string, string, string]> = {
  ice: ["#c7f4ff", "#53b8d6", "#2d7d96"], amber: ["#ffd79a", "#d68f2b", "#9a6116"], up: ["#b8ffe2", "#2fb87f", "#1d7e56"],
  down: ["#ffc2bb", "#d4473c", "#962c24"], dim: ["#5d6a7e", "#2b3443", "#1d2430"],
};
/** Figures as towers on the floor, side by side along x: each grows when its time (`at`, seconds)
 * comes, with its figure on top and its label at its foot. `scale` is pixels per unit of value. */
export const Towers: React.FC<{ items: Tower[]; scale: number; x0?: number; w?: number; d?: number; gap?: number; labelSize?: number; valueSize?: number }> = ({
  items, scale, w = 120, d = 120, gap = 70, labelSize = 22, valueSize = 52, x0 = 0,
}) => {
  const t = useSeconds();
  const total = items.length * w + (items.length - 1) * gap;
  return (
    <>
      {items.map((it, i) => {
        const x = x0 - total / 2 + i * (w + gap);
        const p = ease(prog(t, it.at ?? 0, 1.1));
        const h = Math.max(0.01, it.value * scale * p);
        const [top, front, side] = TONES[it.tone ?? "ice"];
        const lit = it.tone !== "dim";
        return (
          <React.Fragment key={i}>
            <Box x={x} y={-d / 2} w={w} d={d} h={h}
              glow={lit ? `0 0 50px ${front}55` : undefined}
              faces={{ top, front: `linear-gradient(180deg, ${front}, ${front}cc 70%, ${side})`, side: `linear-gradient(180deg, ${side}aa, #070a10)` }}
              front={<div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 14px)" }} />} />
            <Bill x={x + w / 2} y={0} z={h + 18} opacity={p}>
              <div className="val" style={{ fontSize: valueSize }}>{it.text}</div>
            </Bill>
            <Bill x={x + w / 2} y={d / 2 + 70} z={0} anchor="middle" opacity={clamp(p * 3)}>
              <div className="tag" style={{ fontSize: labelSize, color: lit ? ICE2 : DIM }}>{it.label}</div>
            </Bill>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- the city of the index

/** The weights, biggest first: [ticker, % of the index]. Alphabet's two classes are one company. */
export const W: [string, number][] = WEIGHTS as [string, number][];
export const AVG = 100 / W.length;
export const SEVEN = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"];
export const CHIPS = ["NVDA", "AVGO", "AMD"];
/** The 240 smallest: together they weigh what Apple does (8,10 % against 8,04 %). */
export const SMALL = new Set(W.slice(W.length - 240).map(([k]) => k));

const COLS = 23, CELL = 66, BW = 50;
/** Where each company stands: the biggest in the middle, the rest in rings around them. */
const SPOTS: [number, number][] = (() => {
  const rows = Math.ceil(W.length / COLS);
  const cells: [number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < COLS; c++) cells.push([c, r]);
  const cx = (COLS - 1) / 2, cy = (rows - 1) / 2;
  cells.sort((a, b) => Math.hypot(a[0] - cx, (a[1] - cy) * 1.05) - Math.hypot(b[0] - cx, (b[1] - cy) * 1.05) || a[1] - b[1] || a[0] - b[0]);
  return W.map((_, i) => [(cells[i][0] - cx) * CELL - BW / 2, (cells[i][1] - cy) * CELL - BW / 2]);
})();
export const spot = (ticker: string) => { const i = W.findIndex(([k]) => k === ticker); return { x: SPOTS[i][0] + BW / 2, y: SPOTS[i][1] + BW / 2, w: W[i][1] }; };

const SHADE: Record<string, [string, string, string]> = {
  base: ["#2a3446", "#18202d", "#0f141d"], ice: ["#c7f4ff", "#3f9fbd", "#21627a"], amber: ["#ffe2b0", "#d68f2b", "#8f5a14"],
  down: ["#ffc2bb", "#c9463b", "#7d2a23"], dim: ["#1c2230", "#121722", "#0b0f16"],
};

/** The city: each company a building as tall as its weight (`scale` px per point of weight).
 * `equal` (0 to 1) brings every building to the same height, the index with its companies in equal
 * parts; `grow` (0 to 1) raises the city from the floor; `tone` paints a company (or `rest` the
 * others). */
export const City: React.FC<{ scale?: number; equal?: number; grow?: number; tone?: (ticker: string) => keyof typeof SHADE | undefined; rest?: keyof typeof SHADE }> = ({
  scale = 105, equal = 0, grow = 1, tone, rest = "base",
}) => {
  const t = useFilmSeconds();
  return (
    <>
      <Floor w={2600} d={2600} step={CELL} glow="radial-gradient(45% 45% at 50% 50%, rgba(255,181,71,0.07), transparent 75%)" />
      {W.map(([k, w], i) => {
        const [x, y] = SPOTS[i];
        const h = Math.max(2, mix(w, AVG, equal) * scale * grow);
        const sh = tone?.(k) ?? rest;
        const [top, front, side] = SHADE[sh];
        const tall = h > 60;
        const lit = sh === "ice" || sh === "amber" || sh === "down";
        const win = tall ? `repeating-linear-gradient(0deg, rgba(255,225,170,${(0.10 + 0.08 * hash(i, Math.floor(t * 0.7))).toFixed(3)}) 0 3px, transparent 3px 14px)` : undefined;
        return (
          <Box key={k} x={x} y={y} w={BW} d={BW} h={h}
            glow={lit ? `0 0 40px ${front}66` : undefined}
            faces={{ top, front: win ? `${win}, linear-gradient(180deg, ${front}, ${side})` : front, side: `linear-gradient(180deg, ${side}, #070a10)` }} />
        );
      })}
    </>
  );
};

/** A label floating over a company's building: its figure and, if given, its logo. */
export const Over: React.FC<{ ticker: string; scale?: number; equal?: number; opacity?: number; children: React.ReactNode }> = ({ ticker, scale = 105, equal = 0, opacity = 1, children }) => {
  const s = spot(ticker);
  return <Bill x={s.x} y={s.y} z={mix(s.w, AVG, equal) * scale + 22} opacity={opacity}>{children}</Bill>;
};

/** The account's picture with a line beside it, to close the reel. */
export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);
