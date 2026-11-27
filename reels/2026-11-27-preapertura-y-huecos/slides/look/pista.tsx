// "La pista": the look of the Aprende reel on pre-market, after-hours and gaps (2026-11-27). Its machinery (World and
// its camera, Box, Bill, Frame, Head, Card, Src, between/glide/prog, Sign) comes from "La nave"
// (reels/2026-11-11-neoclouds) by way of "La escalera" (reels/2026-11-25-tipos-de-la-fed), on the warm paper of the
// Aprende line. Its own world: a track on the floor that is the trading clock from Wednesday 25 to Friday 27 November,
// in zones (session, after-hours, closed, pre-market), and on it a block every half hour as tall as the stock's real
// price then (Yahoo Finance, 5-minute bars, the last close of each half hour; heights start at a base, written in each
// scene's source line). Session blocks are solid, extended-hours blocks are glass, the closed night and holiday is
// empty floor: the gap is the drop between the two sessions. Everything moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./pista.css";
import profile from "../../../../channel/instagram-profile.jpg";

export const INK = "#17140f", AMBER = "#e08a00", AMBER2 = "#ffc85c", UP = "#13a067", DOWN = "#d6402f";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const prog = (t: number, at: number, takes: number) => clamp((t - at) / Math.max(takes, 1e-6));
export const ease = (p: number) => OUT(clamp(p));
export const glide = (p: number) => INOUT(clamp(p));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const es = (n: number, decimals = 0) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: "always" as never }).replace("-", "−");

// ---------------------------------------------------------------- the frame

export const Frame: React.FC<{ world?: React.ReactNode; haze?: number; children?: React.ReactNode }> = ({ world, haze = 0.9, children }) => {
  const t = useSeconds();
  const scene = useScene();
  const film = useFilmSeconds();
  const top = `linear-gradient(180deg, rgba(243,237,225,${haze}) 0%, rgba(243,237,225,${(haze * 0.85).toFixed(3)}) 22%, rgba(243,237,225,0) 40%)`;
  const bottom = `linear-gradient(0deg, rgba(243,237,225,0.96) 0%, rgba(243,237,225,0.96) 20%, rgba(243,237,225,0) 30%)`;
  const warm = `radial-gradient(60% 40% at ${50 + Math.sin(film * 0.3) * 6}% 60%, rgba(255,200,92,0.14), transparent 70%)`;
  return (
    <AbsoluteFill className="cm">
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, warm].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="cm-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.10 0" /></filter>
        <rect width="100%" height="100%" filter="url(#cm-grain)" />
      </svg>
      <div className="over">
        <header className="hud">
          <div className="row">
            <span>The Market Hub · <b>Aprende</b></span>
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

export const Head: React.FC<{ kick?: React.ReactNode; style?: React.CSSProperties; children: React.ReactNode }> = ({ kick, style, children }) => {
  const t = useSeconds();
  const p = ease(prog(t, 0, 0.5));
  return (
    <div className="head" style={style}>
      {kick && <p className="kick" style={{ opacity: clamp(0.4 + p), transform: `translateY(${(1 - p) * 10}px)` }}>{kick}</p>}
      {children}
    </div>
  );
};

const LIT: Record<string, [string, string]> = { amber: [AMBER, "#f2a92c"], up: [UP, "#3cc58b"], down: [DOWN, "#ef6a55"] };
/** The words of the headline that carry it: amber sweeps over them when their cue is said (with no cue, lit from frame 0). */
export const Hi: React.FC<{ say?: string | number; tone?: "amber" | "up" | "down"; children: React.ReactNode }> = ({ say, tone = "amber", children }) => {
  const at = useSay(say);
  const t = useSeconds();
  const p = say === undefined ? 1 : ease(prog(t, at - 0.05, 0.6));
  const [a, b] = LIT[tone];
  const edge = (p * 100).toFixed(1);
  return <span className="hi" style={{ backgroundImage: `linear-gradient(90deg, ${a} 0%, ${b} ${edge}%, ${INK} ${edge}%)` }}>{children}</span>;
};

export const Card: React.FC<{ say?: string | number; gone?: string | number; tone?: "key" | "amber" | "up" | "down"; className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
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

export const Num: React.FC<{ to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; say?: string | number; takes?: number; className?: string; style?: React.CSSProperties }> = ({
  to, from = 0, decimals = 0, prefix = "", suffix = "", say, takes = 1.2, className = "num", style,
}) => {
  const t = useSeconds();
  const at = useSay(say);
  const p = say === undefined ? 1 : ease(prog(t, at, takes));
  return <span className={className} style={style}>{prefix}{es(mix(from, to, p), decimals)}{suffix}</span>;
};

export const Logo: React.FC<{ name: string; h?: number; style?: React.CSSProperties }> = ({ name, h = 64, style }) => (
  <span className="logo" style={{ height: h, ...style }}><Img src={logoUrl(name)} alt={name} /></span>
);

export const Src: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <p className="src" style={style}>{children}</p>;
export const Ej: React.FC = () => <span className="ej">Ejemplo</span>;

// ---------------------------------------------------------------- the world

export type Cam = { rx: number; rz: number; x: number; y: number; z?: number; oy?: number };
const CamContext = createContext<Cam>({ rx: 60, rz: -30, x: 0, y: 0 });
export const useCam = () => useContext(CamContext);
export const between = (a: Cam, b: Cam, p: number): Cam => ({
  rx: mix(a.rx, b.rx, p), rz: mix(a.rz, b.rz, p), x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), z: mix(a.z ?? 0, b.z ?? 0, p), oy: mix(a.oy ?? 0, b.oy ?? 0, p),
});

export const World: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <CamContext.Provider value={cam}>
    <div className="cam" style={{ transform: `translate3d(0px, ${(cam.oy ?? 0).toFixed(2)}px, ${(cam.z ?? 0).toFixed(2)}px) rotateX(${cam.rx.toFixed(3)}deg) rotateZ(${cam.rz.toFixed(3)}deg) translate3d(${(-cam.x).toFixed(2)}px, ${(-cam.y).toFixed(2)}px, 0px)` }}>
      {children}
    </div>
  </CamContext.Provider>
);

type Faces = { top?: string; front?: string; side?: string };
export const Box: React.FC<{
  x: number; y: number; z?: number; w: number; d: number; h: number; faces: Faces;
  front?: React.ReactNode; top?: React.ReactNode; edge?: string; opacity?: number;
}> = ({ x, y, z = 0, w, d, h, faces, front, top, edge, opacity = 1 }) => {
  if (h <= 0.01 || opacity <= 0) return null;
  const f = (n: number) => n.toFixed(2);
  const base: React.CSSProperties = { opacity, boxShadow: edge };
  return (
    <>
      <div className="face" style={{ ...base, left: x, top: y, width: w, height: d, background: faces.top, transform: `translateZ(${f(z + h)}px)` }}>{top}</div>
      <div className="face" style={{ ...base, left: x, top: y + d - h, width: w, height: h, background: faces.front, transformOrigin: "50% 100%", transform: `translateZ(${f(z)}px) rotateX(-90deg)` }}>{front}</div>
      <div className="face" style={{ ...base, left: x + w - h, top: y, width: h, height: d, background: faces.side, transformOrigin: "100% 50%", transform: `translateZ(${f(z)}px) rotateY(90deg)` }} />
      <div className="face" style={{ ...base, left: x, top: y, width: h, height: d, background: faces.side, transformOrigin: "0% 50%", transform: `translateZ(${f(z)}px) rotateY(-90deg)` }} />
    </>
  );
};

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

/** The floor: warm paper with a fine grid of ink, centred on (cx, cy). */
export const Floor: React.FC<{ cx?: number; cy?: number; w?: number; d?: number; step?: number }> = ({ cx = 0, cy = 0, w = 3000, d = 3000, step = 60 }) => (
  <div className="face" style={{
    left: cx - w / 2, top: cy - d / 2, width: w, height: d,
    background: [
      "radial-gradient(50% 50% at 50% 50%, rgba(243,237,225,0) 40%, #f3ede1 78%)",
      `repeating-linear-gradient(0deg, rgba(23,20,15,0.08) 0 1.5px, transparent 1.5px ${step}px)`,
      `repeating-linear-gradient(90deg, rgba(23,20,15,0.08) 0 1.5px, transparent 1.5px ${step}px)`,
      "#efe7d7",
    ].join(", "),
  }} />
);


export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);


// ---------------------------------------------------------------- the track

export type Seg = "ws" | "wp" | "gap" | "fp" | "fs";
const SLOT = 46, BAR = 36, GAPW = 380;
const COUNTS: Record<Exclude<Seg, "gap">, number> = { ws: 13, wp: 6, fp: 11, fs: 6 };
/** Left edge of each segment on the floor; the track runs from -1018 to +1018. */
const X0 = -((13 + 6 + 11 + 6) * SLOT + GAPW) / 2;
export const SEGX: Record<Seg, [number, number]> = (() => {
  let x = X0;
  const out = {} as Record<Seg, [number, number]>;
  for (const s of ["ws", "wp", "gap", "fp", "fs"] as Seg[]) {
    const w = s === "gap" ? GAPW : COUNTS[s as Exclude<Seg, "gap">] * SLOT;
    out[s] = [x, x + w];
    x += w;
  }
  return out;
})();
export const MID = (s: Seg) => (SEGX[s][0] + SEGX[s][1]) / 2;

export type Series = { ws: number[]; wp: number[]; fp: number[]; fs: number[]; base: number; k: number };

/** Vertex (VRTX), Yahoo Finance 5-minute bars, the last close of each half hour, New York time: Wednesday 25 9:30-15:30
 * (session), 16:00-18:30 (after-hours), Friday 27 4:00-9:00 (pre-market), 9:30-12:00 (session, read at 12:06). */
export const VRTX: Series = {
  ws: [552.08, 554.02, 554.68, 554.88, 556.6, 560.75, 563.67, 567.27, 569.49, 567.67, 566.5, 565.56, 563.95],
  wp: [528.61, 523.0, 520.5, 520.5, 521.3, 523.2],
  fp: [526.0, 523.0, 523.0, 523.0, 522.77, 523.0, 522.62, 520.97, 519.34, 517.52, 518.0],
  fs: [511.3, 523.45, 529.39, 529.56, 532.09, 533.77],
  base: 480, k: 3.4,
};
/** Nvidia (NVDA), the same half hours. */
export const NVDA: Series = {
  ws: [145.62, 143.28, 142.48, 142.11, 142.14, 143.77, 145.65, 147.46, 147.85, 148.08, 147.84, 148.18, 149.29],
  wp: [149.43, 148.52, 148.84, 149.92, 149.65, 150.52],
  fp: [156.43, 154.8, 155.45, 155.73, 154.77, 152.9, 152.7, 153.87, 152.85, 152.94, 151.9],
  fs: [146.33, 146.97, 147.45, 148.77, 148.86, 148.47],
  base: 136, k: 20,
};
export const H = (s: Series, p: number) => (p - s.base) * s.k;

const SOLID = { top: "#d9d0bf", front: "linear-gradient(180deg, #4a443a, #2c2821)", side: "#221f1a" };
const AMB = { top: "#ffd58a", front: "linear-gradient(180deg, #f2a92c, #c97a00)", side: "#9c5f00" };
const GLASS = { top: "rgba(120,160,215,0.55)", front: "linear-gradient(180deg, rgba(110,150,205,0.62), rgba(70,110,170,0.40))", side: "rgba(60,95,150,0.45)" };
const GLASS_LIT = { top: "rgba(120,170,235,0.85)", front: "linear-gradient(180deg, rgba(70,130,215,0.92), rgba(40,90,170,0.80))", side: "rgba(30,70,140,0.85)" };

const ZONE: Record<Seg, string> = {
  ws: "rgba(224,138,0,0.16)", fs: "rgba(224,138,0,0.16)",
  wp: "rgba(70,120,190,0.14)", fp: "rgba(70,120,190,0.14)",
  gap: "repeating-linear-gradient(45deg, rgba(23,20,15,0.10) 0 10px, transparent 10px 22px)",
};
const ZONE_LIT: Record<Seg, string> = {
  ws: "rgba(224,138,0,0.42)", fs: "rgba(224,138,0,0.42)",
  wp: "rgba(70,120,190,0.36)", fp: "rgba(70,120,190,0.36)",
  gap: "repeating-linear-gradient(45deg, rgba(214,64,47,0.28) 0 10px, transparent 10px 22px)",
};

/** The zones of the clock on the floor, at depth y (centre) and d (depth). `lit` lights some of them. */
export const Zones: React.FC<{ y?: number; d?: number; lit?: Seg[]; opacity?: number }> = ({ y = 0, d = 190, lit = [], opacity = 1 }) => (
  <>
    {(Object.keys(SEGX) as Seg[]).map((s) => (
      <div key={s} className="face" style={{ left: SEGX[s][0] + 2, top: y - d / 2, width: SEGX[s][1] - SEGX[s][0] - 4, height: d, opacity,
        background: lit.includes(s) ? ZONE_LIT[s] : ZONE[s], boxShadow: lit.includes(s) ? "inset 0 0 0 3px rgba(23,20,15,0.55)" : "inset 0 0 0 1.5px rgba(23,20,15,0.18)" }} />
    ))}
  </>
);

/** The blocks of a stock on the track. `grow` (0-1) raises them from left to right; `hi` makes some segments stand out
 * (the others fade to `dim`). */
export const Track: React.FC<{ s: Series; y?: number; grow?: number; hi?: Seg[]; dim?: number }> = ({ s, y = 0, grow = 1, hi, dim = 0.35 }) => {
  const all: [Seg, number, number][] = [];
  for (const seg of ["ws", "wp", "fp", "fs"] as const) s[seg].forEach((p, i) => all.push([seg, i, p]));
  return (
    <>
      <div className="face" style={{ left: X0 - 20, top: y - 80, width: -2 * X0 + 40, height: 160, background: "rgba(23,20,15,0.08)", filter: "blur(14px)" }} />
      {all.map(([seg, i, p], n) => {
        const k = ease(clamp(grow * all.length * 1.12 - n));
        const glass = seg === "wp" || seg === "fp";
        const on = !hi || hi.includes(seg);
        const faces = glass ? (on && hi ? GLASS_LIT : GLASS) : on && hi ? AMB : SOLID;
        return <Box key={`${seg}${i}`} x={SEGX[seg][0] + i * SLOT + (SLOT - BAR) / 2} y={y - BAR / 2} w={BAR} d={BAR} h={H(s, p) * k} faces={faces} opacity={on ? 1 : dim} />;
      })}
    </>
  );
};

/** A label standing on the track at segment `seg` (or at x). */
export const ZoneTag: React.FC<{ seg?: Seg; x?: number; y?: number; z?: number; opacity?: number; children: React.ReactNode }> = ({ seg, x, y = 0, z = 0, opacity = 1, children }) => (
  <Bill x={x ?? MID(seg ?? "gap")} y={y} z={z} opacity={opacity}>{children}</Bill>
);

/** The x of the i-th block of a segment (its centre). */
export const BX = (seg: Exclude<Seg, "gap">, i: number) => SEGX[seg][0] + i * SLOT + SLOT / 2;

/** A thin glowing plate at a price's height, from x0 to x1: the level the gap jumps from. */
export const Level: React.FC<{ s: Series; p: number; x0: number; x1: number; y?: number; opacity?: number; tone?: "amber" | "down" }> = ({ s, p, x0, x1, y = 0, opacity = 1, tone = "amber" }) => (
  <div className="face" style={{ left: x0, top: y - 30, width: Math.max(0, x1 - x0), height: 60, opacity,
    transform: `translateZ(${H(s, p).toFixed(2)}px)`,
    background: tone === "amber" ? "repeating-linear-gradient(90deg, rgba(224,138,0,0.85) 0 18px, transparent 18px 30px)" : "repeating-linear-gradient(90deg, rgba(214,64,47,0.85) 0 18px, transparent 18px 30px)" }} />
);

export const Ground: React.FC<{ cx?: number; cy?: number }> = ({ cx = 0, cy = 0 }) => <Floor cx={cx} cy={cy} w={3800} d={3200} />;

const STONE_B = SOLID, NOW_B = { top: "#ffe1a8", front: "linear-gradient(180deg, #e08a00, #b56d00)", side: "#8a5300" };
/** A plain block standing on the floor, centred on (x, y), for the made-up example. */
export const Block: React.FC<{ x: number; y?: number; w?: number; d?: number; h: number; tone?: "stone" | "now"; opacity?: number }> = ({
  x, y = 0, w = 160, d = 160, h, tone = "now", opacity = 1,
}) => (
  <>
    <div className="face" style={{ left: x - w / 2 - 20, top: y - d / 2 - 20, width: w + 40, height: d + 40, background: "rgba(23,20,15,0.12)", filter: "blur(12px)", opacity: opacity * clamp(h / 30) }} />
    <Box x={x - w / 2} y={y - d / 2} w={w} d={d} h={h} faces={tone === "stone" ? STONE_B : NOW_B} opacity={opacity} />
  </>
);
