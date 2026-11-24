// "El mapa": the look of the A fondo reel on the Nasdaq 100's biggest up-days (2026-11-24), on the
// machinery of "La nave" (2026-11-11) and "La marea" (2026-11-19). The world is a night map in CSS 3D:
// each of the index's 25 biggest one-day gains since 1985 (Yahoo Finance, ^NDX, data/rebotes.json)
// stands as a tower as tall as the gain, placed across by its year and into the distance by how far
// below its highest close the index stood the day before. Near the front edge is the high; the
// deeper, the further below it. Everything that moves is moved from the frame, never by CSS.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, useVideoConfig } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./mapa.css";
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
  const cold = `radial-gradient(70% 40% at ${50 + Math.sin(film * 0.3) * 6}% 72%, rgba(255,106,94,0.07), transparent 70%)`;
  return (
    <AbsoluteFill className={`mp${width > height ? " wide" : ""}`}>
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, cold].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="mp-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
        <rect width="100%" height="100%" filter="url(#mp-grain)" />
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

type Faces = { top?: string; front?: string; side?: string; sideL?: string; back?: string };
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
      <div className="face" style={{ ...base, left: x, top: y, width: h, height: d, background: faces.sideL ?? faces.side, transformOrigin: "0% 50%", transform: `translateZ(${f(z)}px) rotateY(-90deg)` }} />
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

/** The account's picture with a line beside it, to close the reel. */
export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);

// ---------------------------------------------------------------- the map

export type Day = { rank: number; date: string; gain: number; below: number };
/** The Nasdaq 100's 25 biggest one-day gains, 1 Oct 1985 to 23 Nov 2026 (Yahoo Finance, ^NDX): the
 * gain in %, and how far below its highest close so far the index closed the day before, in %. */
export const DAYS: Day[] = [
  { rank: 1, date: "2001-01-03", gain: 18.77, below: -54.8 },
  { rank: 2, date: "2008-10-13", gain: 12.58, below: -73.0 },
  { rank: 3, date: "2025-04-09", gain: 12.02, below: -22.9 },
  { rank: 4, date: "2000-12-05", gain: 11.68, below: -45.7 },
  { rank: 5, date: "2008-10-28", gain: 10.92, below: -75.1 },
  { rank: 6, date: "2001-04-05", gain: 10.82, below: -70.9 },
  { rank: 7, date: "2002-05-08", gain: 10.62, below: -75.4 },
  { rank: 8, date: "1987-10-21", gain: 10.29, below: -32.7 },
  { rank: 9, date: "2000-05-30", gain: 10.08, below: -34.1 },
  { rank: 10, date: "2020-03-13", gain: 10.07, below: -25.3 },
  { rank: 11, date: "2000-04-17", gain: 10.02, below: -31.8 },
  { rank: 12, date: "2001-04-18", gain: 9.53, below: -64.5 },
  { rank: 13, date: "2000-12-22", gain: 9.5, below: -52.7 },
  { rank: 14, date: "1987-10-29", gain: 9.47, below: -38.6 },
  { rank: 15, date: "2000-10-13", gain: 9.1, below: -36.1 },
  { rank: 16, date: "2000-10-19", gain: 8.4, below: -33.3 },
  { rank: 17, date: "2000-04-25", gain: 7.99, below: -28.7 },
  { rank: 18, date: "2001-04-10", gain: 7.88, below: -68.5 },
  { rank: 19, date: "2020-03-24", gain: 7.81, below: -27.9 },
  { rank: 20, date: "2001-10-03", gain: 7.77, below: -75.4 },
  { rank: 21, date: "2022-11-10", gain: 7.49, below: -34.8 },
  { rank: 22, date: "2020-04-06", gain: 7.35, below: -22.5 },
  { rank: 23, date: "2000-11-14", gain: 7.15, below: -39.7 },
  { rank: 24, date: "1997-10-28", gain: 7.03, below: -14.8 },
  { rank: 25, date: "2026-11-23", gain: 6.86, below: -19.8 },
];
/** Across: years (60 px a year, 2006 in the middle). Into the distance: % below the high (30 px a
 * point, the high at y = 0, deeper is further). Up: the day's gain (40 px a point). */
export const YX = 60, DY = 30, GZ = 40;
export const yearOf = (date: string) => { const [y, m, d] = date.split("-").map(Number); return y + (m - 1) / 12 + d / 365; };
export const px = (date: string) => (yearOf(date) - 2006) * YX;
export const py = (below: number) => below * DY;
export const pos = (day: Day) => ({ x: px(day.date), y: py(day.below), h: day.gain * GZ });
export const byDate = (date: string) => DAYS.find((d) => d.date === date)!;

/** The ground: from the high (front edge) to 80 % below it, from 1985 to 2027; a line every 10 %,
 * the 20 % one in red; the band between the high and 20 % below it a little lighter. */
export const Ground: React.FC<{ line20?: number; years?: boolean }> = ({ line20 = 0.6, years = true }) => {
  const x0 = px("1985-01-01") - 120, x1 = px("2027-06-01") + 60, y0 = py(-82), y1 = 160;
  const lines = [10, 20, 30, 40, 50, 60, 70, 80];
  return (
    <>
      <div className="face" style={{
        left: x0, top: y0, width: x1 - x0, height: y1 - y0,
        background: [
          `linear-gradient(0deg, rgba(150,190,255,0.08) 0px, rgba(150,190,255,0.08) ${160 + 20 * DY}px, transparent ${160 + 20 * DY}px)`,
          `repeating-linear-gradient(90deg, rgba(150,200,255,0.07) 0 1.5px, transparent 1.5px ${YX * 5}px)`,
          `linear-gradient(0deg, #0c1422 0%, #0a0f1a 30%, #12080b 100%)`,
        ].join(", "),
        boxShadow: "inset 0 0 0 2px rgba(150,200,255,0.12)",
      }} />
      <div className="face" style={{ left: x0, top: -2, width: x1 - x0, height: 4, background: "#c7f4ff", boxShadow: "0 0 24px #7fe3ff" }} />
      {lines.map((p) => (
        <div key={p} className="face" style={{ left: x0, top: py(-p) - (p === 20 ? 3 : 1), width: x1 - x0, height: p === 20 ? 6 : 2,
          background: p === 20 ? `rgba(255,106,94,${line20})` : "rgba(150,200,255,0.16)", boxShadow: p === 20 ? `0 0 30px rgba(255,106,94,${line20 * 0.8})` : undefined }} />
      ))}
      {lines.map((p) => (
        <Bill key={`l${p}`} x={x0 + 70} y={py(-p)} z={6} anchor="middle">
          <div className="gmark" style={{ color: p === 20 ? "#ffb0a8" : undefined }}>−{p} %</div>
        </Bill>
      ))}
      <Bill x={x0 + 120} y={20} z={6} anchor="middle"><div className="gmark" style={{ color: "#c7f4ff" }}>Máximo</div></Bill>
      {years && [1990, 2000, 2010, 2020].map((y) => (
        <Bill key={y} x={px(`${y}-01-01`)} y={110} z={4} anchor="middle"><div className="gmark year">{y}</div></Bill>
      ))}
    </>
  );
};

const PAINT: Record<string, [string, string, string]> = {
  dim: ["#7d8aa0", "#3a4558", "#252d3a"], red: ["#ffc2bb", "#e0574b", "#9c3329"], amber: ["#ffe2b0", "#f0a03a", "#a86a1b"],
  up: ["#c4ffe6", "#2fc488", "#1d7e56"], ice: ["#e4fbff", "#5cc6e4", "#2d7d96"],
};
/** One day as a tower: it grows from `at` (seconds into the scene), in its paint. */
export const Rebound: React.FC<{ day: Day; paint?: keyof typeof PAINT; at?: number; w?: number }> = ({ day, paint = "dim", at = -9, w = 40 }) => {
  const t = useSeconds();
  const p = ease(prog(t, at, 1.0));
  const { x, y, h } = pos(day);
  const [top, front, side] = PAINT[paint];
  const lit = paint !== "dim";
  return (
    <Box x={x - w / 2} y={y - w / 2} w={w} d={w} h={Math.max(0.01, h * p)}
      glow={lit ? `0 0 40px ${front}66` : undefined}
      faces={{ top, front: `linear-gradient(180deg, ${front}, ${side})`, side: `linear-gradient(180deg, ${side}, #06080d)` }} />
  );
};

/** A label over a day's tower. */
export const DayTag: React.FC<{ day: Day; opacity?: number; tone?: string; children: React.ReactNode }> = ({ day, opacity = 1, tone = "#ffffff", children }) => {
  const { x, y, h } = pos(day);
  return <Bill x={x} y={y} z={h + 16} opacity={opacity}><div className="dtag" style={{ color: tone }}>{children}</div></Bill>;
};

/** The whole map: the ground and the 25 towers; `paint` says how each is drawn (by date), `at`
 * when each grows (by date; the ones not given are already there). */
export const Map: React.FC<{ paint?: (d: Day) => keyof typeof PAINT; at?: (d: Day) => number | undefined; line20?: number; only?: (d: Day) => boolean; children?: React.ReactNode }> = ({ paint, at, line20, only, children }) => (
  <>
    <Ground line20={line20} />
    {DAYS.filter((d) => (only ? only(d) : true)).sort((a, b) => a.below - b.below).map((d) => (
      <Rebound key={d.date} day={d} paint={paint ? paint(d) : d.date === "2026-11-23" ? "amber" : "dim"} at={at?.(d)} />
    ))}
    {children}
  </>
);
