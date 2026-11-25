// "La escalera": the look of the Aprende reel on the Fed's rate (2026-11-25). Its machinery (World and its camera,
// Box, Bill, Frame, Head, Card, Src, between/glide/prog, Sign) comes from "La nave" (reels/2026-11-11-neoclouds) by way
// of "La báscula" (reels/2026-11-23-canje-en-acciones), on the warm paper of the Aprende line. Its own world: the
// upper bound of the Fed's target rate since 2021 as a staircase of real steps (FRED, DFEDTARU), each step as long as
// the rate lasted and as high as it was; beside it, the bakery's yearly interest, the 10-year bond as a pillar and ten
// future years as blocks that shrink with the rate. Everything moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./escalera.css";
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


// ---------------------------------------------------------------- the staircase

/** The upper bound of the Fed's target rate, each change from FRED (DFEDTARU), 2021-01-01 to 2026-11-25. */
export const STEPS: [string, number][] = [
  ["2021-01-01", 0.25], ["2022-03-17", 0.5], ["2022-05-05", 1.0], ["2022-06-16", 1.75], ["2022-07-28", 2.5],
  ["2022-09-22", 3.25], ["2022-11-03", 4.0], ["2022-12-15", 4.5], ["2023-02-02", 4.75], ["2023-03-23", 5.0],
  ["2023-05-04", 5.25], ["2023-07-27", 5.5], ["2024-09-19", 5.0], ["2024-11-08", 4.75], ["2024-12-19", 4.5],
  ["2025-09-18", 4.25], ["2025-10-30", 4.0], ["2025-12-11", 3.75], ["2026-09-17", 4.0],
];
const DAY = 86400000, T0 = Date.parse("2021-01-01"), T1 = Date.parse("2026-11-26");
/** A date to x on the floor: the six years run from -660 to +660. */
export const DX = (d: string) => -660 + (1320 * (Date.parse(d) - T0)) / (T1 - T0);
/** A rate in % to height: 1 % = 64 px. */
export const RZ = (pct: number) => 64 * pct;
export const END = DX("2026-11-26");

const STONE = { top: "#d9d0bf", front: "linear-gradient(180deg, #4a443a, #2c2821)", side: "#221f1a" };
const GLOW = { top: "#ffd58a", front: "linear-gradient(180deg, #f2a92c, #c97a00)", side: "#9c5f00" };
const NOW = { top: "#ffe1a8", front: "linear-gradient(180deg, #e08a00, #b56d00)", side: "#8a5300" };
const GHOST = { top: "rgba(255,200,92,0.40)", front: "linear-gradient(180deg, rgba(255,200,92,0.50), rgba(224,138,0,0.28))", side: "rgba(196,120,0,0.32)" };

/** The staircase. `grow` (0 to 1) raises the steps from left to right; steps from `lit[0]` to before `lit[1]` glow
 * amber; the last one (today) is amber too when `now`; `ghost` (0 to 1) grows a glass step of +0.25 after today. */
export const Stairs: React.FC<{ grow?: number; lit?: [string, string]; now?: boolean; ghost?: number; dim?: number }> = ({ grow = 1, lit, now = true, ghost = 0, dim = 1 }) => (
  <>
    <div className="face" style={{ left: -690, top: -150, width: END + 760, height: 300, background: "rgba(23,20,15,0.10)", filter: "blur(16px)" }} />
    {STEPS.map(([d, r], i) => {
      const x0 = DX(d), x1 = i + 1 < STEPS.length ? DX(STEPS[i + 1][0]) : END;
      const k = clamp(grow * STEPS.length * 1.15 - i);
      const isLit = lit && d >= lit[0] && d < lit[1];
      const isNow = now && i === STEPS.length - 1;
      return <Box key={d} x={x0} y={-100} w={x1 - x0 + 0.5} d={200} h={RZ(r) * ease(k)} faces={isNow ? NOW : isLit ? GLOW : STONE} opacity={dim} />;
    })}
    {ghost > 0 && <Box x={END + 6} y={-100} w={110} d={200} h={RZ(4.25) * ease(ghost)} faces={GHOST} edge={`inset 0 0 0 3px ${AMBER}`} />}
  </>
);

/** A plain block standing on the floor, centred on (x, y). */
export const Block: React.FC<{ x: number; y?: number; w?: number; d?: number; h: number; tone?: "stone" | "lit" | "now" | "up"; opacity?: number; front?: React.ReactNode }> = ({
  x, y = 0, w = 160, d = 160, h, tone = "lit", opacity = 1, front,
}) => {
  const faces = tone === "stone" ? STONE : tone === "now" ? NOW : tone === "up" ? { top: "#9fe0c2", front: "linear-gradient(180deg, #23b277, #12804f)", side: "#0d5f3b" } : GLOW;
  return (
    <>
      <div className="face" style={{ left: x - w / 2 - 20, top: y - d / 2 - 20, width: w + 40, height: d + 40, background: "rgba(23,20,15,0.12)", filter: "blur(12px)", opacity: opacity * clamp(h / 30) }} />
      <Box x={x - w / 2} y={y - d / 2} w={w} d={d} h={h} faces={faces} opacity={opacity} front={front} />
    </>
  );
};

export const Ground: React.FC<{ cx?: number; cy?: number }> = ({ cx = 0, cy = 0 }) => <Floor cx={cx} cy={cy} w={3400} d={3000} />;
