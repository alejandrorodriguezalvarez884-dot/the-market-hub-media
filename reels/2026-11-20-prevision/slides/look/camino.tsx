// "El camino": the look of the Aprende reel on guidance (2026-11-20). Its machinery (World and its camera,
// Box, Bill, Frame, Head, Card, Src, between/glide/prog, Sign) comes from "La nave" (reels/2026-11-11-neoclouds)
// by way of "Las torres" (reels/2026-11-18-capitalizacion), on the warm paper of the Aprende line. Its own
// world is a road the camera travels along: behind, the quarters already reported as solid blocks of profit
// (their height, the earnings per share); a line on the road marks today; ahead, the quarters to come as
// amber glass blocks (the company's own guidance), and a thin ink plate floating at the height the analysts
// expect (the consensus). Everything moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./camino.css";
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

// ---------------------------------------------------------------- the road

export const ROAD_W = 560;
/** The road: a paper strip along the y axis, from y0 (near) to y1 (far), with a dashed centre line. */
export const Road: React.FC<{ y0?: number; y1?: number; w?: number }> = ({ y0 = 1400, y1 = -2600, w = ROAD_W }) => (
  <>
    <div className="face" style={{ left: -w / 2, top: y1, width: w, height: y0 - y1, background: "linear-gradient(90deg, #e2d6bf 0 6px, #f7f1e5 6px calc(100% - 6px), #e2d6bf calc(100% - 6px))" }} />
    <div className="face" style={{ left: -3, top: y1, width: 6, height: y0 - y1, background: "repeating-linear-gradient(180deg, rgba(23,20,15,0.35) 0 40px, transparent 40px 90px)" }} />
  </>
);

/** The line of today across the road at y, with its label standing on it. */
export const Today: React.FC<{ y: number; label?: React.ReactNode; opacity?: number; side?: "left" | "right" }> = ({ y, label = "Hoy", opacity = 1, side = "right" }) => (
  <>
    <div className="face" style={{ left: -ROAD_W / 2 - 80, top: y - 4, width: ROAD_W + 160, height: 8, background: INK, opacity }} />
    <Bill x={side === "right" ? ROAD_W / 2 + 70 : -ROAD_W / 2 - 70} y={y} opacity={opacity}><div className="bar-tag">{label}</div></Bill>
  </>
);

/** A quarter (or a season) on the road, centred on (x, y): a solid paper block if it is past, an amber
 * glass block if it is a forecast; `h` px high, grown by `grow`. */
export const Block: React.FC<{ x?: number; y: number; w?: number; d?: number; h: number; grow?: number; kind?: "past" | "hot" | "ahead"; label?: React.ReactNode; top?: React.ReactNode; opacity?: number }> = ({
  x = 0, y, w = 150, d = 150, h, grow = 1, kind = "past", label, top, opacity = 1,
}) => {
  const H = Math.max(h * clamp(grow), 0.02);
  const faces = kind === "ahead"
    ? { top: "rgba(255,200,92,0.45)", front: "linear-gradient(180deg, rgba(255,200,92,0.55), rgba(224,138,0,0.30))", side: "rgba(196,120,0,0.35)" }
    : kind === "hot"
      ? { top: "#ffd98a", front: `linear-gradient(180deg, ${AMBER2}, ${AMBER})`, side: "#b56e00" }
      : { top: "#fffdf8", front: "linear-gradient(180deg, #f1e7d4, #d8c8a8)", side: "#c4b28d" };
  return (
    <>
      <div className="face" style={{ left: x - w / 2 - 20, top: y - d / 2 - 20, width: w + 40, height: d + 40, background: "rgba(23,20,15,0.10)", filter: "blur(12px)", opacity: opacity * (kind === "ahead" ? 0.4 : 1) }} />
      <Box x={x - w / 2} y={y - d / 2} w={w} d={d} h={H} opacity={opacity} faces={faces}
        edge={kind === "ahead" ? `inset 0 0 0 3px ${AMBER}` : undefined} />
      {(top || label) && (
        <Bill x={x} y={y} z={H + 18} opacity={opacity * clamp(grow * 1.5)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {top}
            {label && <div className="tag">{label}</div>}
          </div>
        </Bill>
      )}
    </>
  );
};

/** What the analysts expect: a thin ink plate floating at height `h` over the block at (x, y). */
export const Bar: React.FC<{ x?: number; y: number; w?: number; d?: number; h: number; opacity?: number; label?: React.ReactNode }> = ({ x = 0, y, w = 210, d = 190, h, opacity = 1, label }) => (
  <>
    <Box x={x - w / 2} y={y - d / 2} z={h} w={w} d={d} h={5} opacity={opacity * 0.9} faces={{ top: "rgba(23,20,15,0.42)", front: INK, side: INK }} />
    {label && <Bill x={x + w / 2 + 20} y={y + d / 2} z={h + 8} anchor="middle" opacity={opacity}><div className="bar-tag" style={{ transform: "translateX(50%)" }}>{label}</div></Bill>}
  </>
);

export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);

/** Earnings per share to height: 1 dollar of a quarter = 380 px. */
export const EPS = (usd: number) => 380 * usd;
