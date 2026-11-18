// "La nave": the look of the reel on the neoclouds, as components. A scene is
//
//   <Frame world={<World cam={...}><Hall power={...} /></World>}>
//     <Head kick="CoreWeave"><h1>La fábrica se <Hi say="alquila">alquila</Hi></h1></Head>
//     <Card say="tres mil" tone="ice" style={{ left: 72, top: 1000, width: 560 }}>...</Card>
//     <Src>CoreWeave, resultados del tercer trimestre de 2026 (SEC).</Src>
//   </Frame>
//
// The world is drawn in CSS 3D: a camera (World) over a floor where things stand as boxes (Box):
// racks in rows (Hall), a GPU module (Gpu), towers of figures (Towers), and labels that always face
// the camera (Bill). Everything that moves is moved from the frame (useSeconds), never by CSS, so
// the same scene always gives the same film. Units in the world are pixels; +z is up, +y is
// towards the camera.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, useVideoConfig } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./nave.css";
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
  const cold = `radial-gradient(70% 40% at ${50 + Math.sin(film * 0.3) * 6}% 72%, rgba(127,227,255,0.10), transparent 70%)`;
  return (
    <AbsoluteFill className={`nv${width > height ? " wide" : ""}`}>
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, cold].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="nv-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
        <rect width="100%" height="100%" filter="url(#nv-grain)" />
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

// ---------------------------------------------------------------- a rack and the hall

export const RACK = { w: 60, d: 110, h: 210 };

/** The front of a rack of GPU servers: eight trays, each with a strip of light and its LEDs.
 * `on` from 0 (dark) to 1 (running); `seed` makes each rack blink its own way. */
const RackFront: React.FC<{ on: number; seed: number; t: number; w: number; h: number; hot?: number }> = ({ on, seed, t, w, h, hot = 0 }) => {
  const trays = 8, pad = 5, th = (h - pad * 2) / trays;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={0} width={w} height={h} fill="#070a10" />
      <rect x={1.5} y={1.5} width={w - 3} height={h - 3} fill="none" stroke="#1b2433" strokeWidth={3} />
      {Array.from({ length: trays }, (_, i) => {
        const y = pad + i * th;
        const flick = hash(seed, i, Math.floor(t * 6 + seed * 3)) > 0.82 ? 0.55 : 1;
        const lit = on * flick;
        const strip = hot > 0 ? `rgb(${Math.round(127 + 128 * hot)}, ${Math.round(227 - 60 * hot)}, ${Math.round(255 - 180 * hot)})` : ICE;
        return (
          <g key={i}>
            <rect x={5} y={y + 1.5} width={w - 10} height={th - 3} fill="#0d121b" stroke="#1d2635" strokeWidth={1} />
            {Array.from({ length: 6 }, (_, k) => <rect key={k} x={8 + k * ((w - 16) / 6)} y={y + 4} width={(w - 16) / 6 - 2.5} height={th - 12} fill="#0a0e15" />)}
            <rect x={8} y={y + th - 7} width={w - 16} height={2.4} fill={strip} opacity={0.12 + 0.88 * lit} />
            {[0, 1, 2].map((k) => {
              const blink = hash(seed * 7 + i, k, Math.floor(t * (3 + k * 2) + seed)) > 0.45 ? 1 : 0.15;
              return <circle key={k} cx={w - 9 - k * 6} cy={y + 6} r={1.6} fill={k === 2 && hash(seed, i, k) > 0.7 ? AMBER : UP} opacity={on * blink} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

/** One rack standing at (x, y). */
export const Rack: React.FC<{ x: number; y: number; on: number; seed: number; hot?: number; scale?: number }> = ({ x, y, on, seed, hot = 0, scale = 1 }) => {
  const t = useFilmSeconds();
  const w = RACK.w * scale, d = RACK.d * scale, h = RACK.h * scale;
  const glow = on > 0.05 ? `0 0 ${Math.round(18 * on)}px rgba(127,227,255,${(0.35 * on).toFixed(3)})` : undefined;
  return (
    <Box x={x} y={y} w={w} d={d} h={h} glow={glow}
      faces={{ top: "linear-gradient(135deg, #1a2231, #121925)", side: "linear-gradient(180deg, #0c111a, #080b11)", front: "#070a10" }}
      top={<div style={{ position: "absolute", inset: 6, border: "1px solid rgba(160,200,255,0.12)", background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 7px)" }} />}
      front={<RackFront on={on} seed={seed} t={t} w={w} h={h} hot={hot} />} />
  );
};

/** A data hall: `rows` rows of `cols` racks, fronts towards the camera, cold aisles between rows
 * lit from the floor, cable trays overhead with data running along them. `power` (0 to 1) is how
 * far the lights have come on, in a wave from the front-left corner; `hot` warms the light. */
export const Hall: React.FC<{ rows?: number; cols?: number; power?: number; hot?: number; trays?: boolean; floor?: number }> = ({
  rows = 6, cols = 12, power = 1, hot = 0, trays = true, floor = 2600,
}) => {
  const t = useFilmSeconds();
  const gap = 4, aisle = 150;
  const W = cols * (RACK.w + gap), rowD = RACK.d + aisle;
  const x0 = -W / 2, y0 = -(rows * rowD) / 2;
  const far = Math.hypot(cols, rows * 1.4);
  return (
    <>
      <Floor w={floor} d={floor} />
      {Array.from({ length: rows }, (_, r) => {
        const y = y0 + r * rowD;
        const lit = clamp(power * 1.4 - (r / rows) * 0.4);
        return (
          <React.Fragment key={r}>
            <div className="face" style={{ left: x0 - 30, top: y + RACK.d + 12, width: W + 60, height: aisle - 24,
              background: `linear-gradient(180deg, rgba(127,227,255,${(0.16 * lit).toFixed(3)}), rgba(127,227,255,${(0.05 * lit).toFixed(3)}))`,
              boxShadow: `0 0 60px rgba(127,227,255,${(0.18 * lit).toFixed(3)})` }} />
            {Array.from({ length: cols }, (_, c) => {
              const wave = Math.hypot(c, (rows - 1 - r) * 1.4) / far;
              const on = ease(clamp((power * 1.25 - wave) * 5));
              return <Rack key={c} x={x0 + c * (RACK.w + gap)} y={y} on={on} seed={r * 31 + c * 7 + 1} hot={hot} />;
            })}
            {trays && (
              <>
                <Box x={x0 - 20} y={y + 40} z={RACK.h + 70} w={W + 40} d={26} h={10}
                  faces={{ top: "#141c2a", side: "#0b1018", front: "#101724" }} />
                {Array.from({ length: 3 }, (_, k) => {
                  const u = (t * 0.32 + hash(r, k)) % 1;
                  return (
                    <div key={k} className="face" style={{ left: x0 - 20 + u * (W + 40) - 60, top: y + 46, width: 120, height: 14,
                      background: `linear-gradient(90deg, transparent, rgba(199,244,255,${(0.95 * lit).toFixed(3)}), transparent)`,
                      transform: `translateZ(${RACK.h + 81}px)`, boxShadow: `0 0 18px rgba(127,227,255,${(0.8 * lit).toFixed(3)})` }} />
                  );
                })}
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- a GPU module

/** An accelerator module seen from above and turned: the board, the die in the middle with its
 * light sweeping across, the memory stacks on both sides, the small parts and the connectors.
 * Drawn here; it is no particular product. Its middle is at (x, y); `lift` raises it off the floor. */
export const Gpu: React.FC<{ x?: number; y?: number; lift?: number; heat?: number; scale?: number; opacity?: number }> = ({ x = 0, y = 0, lift = 0, heat = 0, scale = 1, opacity = 1 }) => {
  const t = useFilmSeconds();
  const W = 440 * scale, D = 600 * scale;
  const L = x - W / 2, T = y - D / 2;
  const s = scale;
  const sweep = ((t * 0.45) % 1.6) - 0.3;
  const pcb = (
    <svg width={W} height={D} viewBox="0 0 440 600" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0f1d1a" /><stop offset="1" stopColor="#081210" /></linearGradient>
      </defs>
      <rect width={440} height={600} rx={10} fill="url(#pcb)" />
      {Array.from({ length: 26 }, (_, i) => {
        const yy = 30 + i * 21;
        const run = 40 + hash(i, 3) * 120;
        return <path key={i} d={`M 18 ${yy} H ${run} l 14 14 H ${run + 70}`} stroke="#1f4a3e" strokeWidth={1.6} fill="none" opacity={0.7} />;
      })}
      {Array.from({ length: 26 }, (_, i) => {
        const yy = 40 + i * 21;
        const run = 300 - hash(i, 9) * 120;
        return <path key={`r${i}`} d={`M 422 ${yy} H ${run} l -14 -12 H ${run - 60}`} stroke="#1f4a3e" strokeWidth={1.6} fill="none" opacity={0.7} />;
      })}
      {Array.from({ length: 64 }, (_, i) => {
        const px = 30 + (i % 16) * 25, py = i < 32 ? 18 + Math.floor(i / 16) * 16 : 548 + Math.floor((i - 32) / 16) * 16;
        return <rect key={`c${i}`} x={px} y={py} width={12} height={7} rx={1} fill={i % 5 === 0 ? "#b98a4a" : "#2b3440"} />;
      })}
      <rect x={14} y={92} width={10} height={416} rx={3} fill="#c9a24e" opacity={0.85} />
      <rect x={416} y={92} width={10} height={416} rx={3} fill="#c9a24e" opacity={0.85} />
      <rect x={60} y={120} width={320} height={360} rx={6} fill="none" stroke="#2c3e3a" strokeWidth={2} />
    </svg>
  );
  const dieTop = `linear-gradient(115deg, #2a2f36 0%, #3c434d ${(sweep * 100 - 14).toFixed(1)}%, #e8f4ff ${(sweep * 100).toFixed(1)}%, #3c434d ${(sweep * 100 + 14).toFixed(1)}%, #22272e 100%)`;
  const warm = heat > 0 ? `0 0 ${Math.round(80 * heat)}px rgba(255,140,60,${(0.7 * heat).toFixed(3)})` : `0 0 40px rgba(127,227,255,0.25)`;
  return (
    <>
      <Box x={L} y={T} z={lift} w={W} d={D} h={8 * s} opacity={opacity}
        faces={{ top: "#0b1715", side: "#06100d", front: "#081310" }} top={pcb} />
      {/* the die */}
      <Box x={x - 95 * s} y={y - 110 * s} z={lift + 8 * s} w={190 * s} d={220 * s} h={12 * s} opacity={opacity} glow={warm}
        faces={{ top: dieTop, side: "#15191f", front: "#1b2027" }}
        top={<div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ width: "62%", height: "70%", border: `1px solid rgba(255,255,255,0.14)`, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 9px)" }} />
        </div>} />
      {/* the memory stacks, three on each side */}
      {[-1, 1].flatMap((side) => [0, 1, 2].map((k) => (
        <Box key={`${side}${k}`} x={x + side * 112 * s - (side < 0 ? 62 * s : 0)} y={y - 108 * s + k * 74 * s} z={lift + 8 * s} w={62 * s} d={66 * s} h={16 * s} opacity={opacity}
          faces={{ top: "linear-gradient(135deg, #2b3038, #171b21)", side: "#101317", front: "#14181e" }}
          top={<div style={{ position: "absolute", inset: 5 * s, borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />} />
      )))}
    </>
  );
};

// ---------------------------------------------------------------- towers of figures

export type Tower = { label: string; value: number; text: string; tone?: "ice" | "amber" | "up" | "down" | "dim"; at?: number };
const TONES: Record<string, [string, string, string]> = {
  ice: ["#c7f4ff", "#53b8d6", "#2d7d96"], amber: ["#ffd79a", "#d68f2b", "#9a6116"], up: ["#b8ffe2", "#2fb87f", "#1d7e56"],
  down: ["#ffc2bb", "#d4473c", "#962c24"], dim: ["#5d6a7e", "#2b3443", "#1d2430"],
};
/** Figures as towers on the floor, side by side along x: each grows when its time (`at`, seconds)
 * comes, with its figure on top and its label at its foot. `scale` is pixels per unit of value. */
export const Towers: React.FC<{ items: Tower[]; scale: number; w?: number; d?: number; gap?: number; labelSize?: number; valueSize?: number }> = ({
  items, scale, w = 120, d = 120, gap = 70, labelSize = 22, valueSize = 52,
}) => {
  const t = useSeconds();
  const total = items.length * w + (items.length - 1) * gap;
  return (
    <>
      {items.map((it, i) => {
        const x = -total / 2 + i * (w + gap);
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

/** A line of light along the floor from (x1, y1) to (x2, y2), drawn up to `p`. */
export const Beam: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; z?: number; width?: number }> = ({ x1, y1, x2, y2, p = 1, color = ICE, z = 1, width = 6 }) => {
  if (p <= 0) return null;
  const len = Math.hypot(x2 - x1, y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  return <div className="face" style={{ left: x1, top: y1 - width / 2, width: len, height: width, background: color, transformOrigin: "0% 50%",
    transform: `translateZ(${z}px) rotateZ(${ang}rad)`, boxShadow: `0 0 24px ${color}` }} />;
};

// ---------------------------------------------------------------- a campus of halls

/** A campus seen from afar: `n` halls in a grid. The first `lit` (a fraction, 0 to 1, may fall
 * inside a hall) are running, lit from inside; the rest are drawn as frames still being built. */
export const Campus: React.FC<{ n?: number; cols?: number; lit: number; build?: number }> = ({ n = 24, cols = 6, lit, build = 1 }) => {
  const t = useFilmSeconds();
  const W = 220, D = 150, H = 70, gx = 60, gy = 90;
  const rows = Math.ceil(n / cols);
  const x0 = -(cols * (W + gx) - gx) / 2, y0 = -(rows * (D + gy) - gy) / 2;
  return (
    <>
      <Floor w={3400} d={3400} step={80} />
      {Array.from({ length: n }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = x0 + c * (W + gx), y = y0 + r * (D + gy);
        const on = clamp(lit * n - (n - 1 - i));
        const shown = clamp(build * n * 1.2 - (n - 1 - i));
        if (on > 0) {
          const flick = 0.85 + 0.15 * hash(i, Math.floor(t * 4));
          const win = `repeating-linear-gradient(90deg, rgba(127,227,255,${(0.75 * on * flick).toFixed(3)}) 0 10px, transparent 10px 24px)`;
          return (
            <Box key={i} x={x} y={y} w={W} d={D} h={H} glow={`0 0 ${Math.round(40 * on)}px rgba(127,227,255,${(0.35 * on).toFixed(3)})`}
              faces={{ top: `linear-gradient(135deg, rgba(127,227,255,${(0.35 * on).toFixed(3)}), #1d2a3c 60%)`, side: "#0d1520", front: "#0b121c" }}
              front={<div style={{ position: "absolute", left: 10, right: 10, top: 14, bottom: 14, background: win }} />}
              top={<div style={{ position: "absolute", inset: 14, background: `repeating-linear-gradient(0deg, rgba(199,244,255,${(0.18 * on).toFixed(3)}) 0 3px, transparent 3px 18px)` }} />} />
          );
        }
        const frame = `inset 0 0 0 2px rgba(150,190,240,${(0.35 * shown).toFixed(3)})`;
        return (
          <React.Fragment key={i}>
            <div className="face" style={{ left: x, top: y, width: W, height: D, boxShadow: frame, opacity: shown,
              background: "repeating-linear-gradient(45deg, rgba(150,190,240,0.06) 0 2px, transparent 2px 16px)" }} />
            <div className="face" style={{ left: x, top: y + D - H, width: W, height: H, boxShadow: frame, opacity: shown * 0.8, transformOrigin: "50% 100%", transform: "rotateX(-90deg)" }} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** The account's picture with a line beside it, to close the reel. */
export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);
