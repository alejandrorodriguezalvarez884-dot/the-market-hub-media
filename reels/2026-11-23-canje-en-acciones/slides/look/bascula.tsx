// "La báscula": the look of the Aprende reel on a takeover paid in shares (2026-11-23). Its machinery (World and
// its camera, Box, Bill, Frame, Head, Card, Src, between/glide/prog, Sign) comes from "La nave" (reels/2026-11-11-neoclouds)
// by way of "El camino" (reels/2026-11-20-prevision), on the warm paper of the Aprende line. Its own world: a
// share is a tower as high as its price. Zscaler stands on one side; on the other, what the exchange ratio gives
// for it (one CrowdStrike share and a slice of 0.135 more); between them, the gap in amber glass. Everything
// moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./bascula.css";
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

/** A company's name in its colour (no logo of CrowdStrike or Zscaler in theme/logos: written as text). */
export const Co: React.FC<{ k: "crwd" | "zs"; children?: React.ReactNode }> = ({ k, children }) => (
  <span className={`co ${k}`}>{children ?? (k === "crwd" ? "CrowdStrike" : "Zscaler")}</span>
);

// ---------------------------------------------------------------- the scale

/** Dollars to height: 1 $ = 1.9 px. */
export const PX = (usd: number) => 1.9 * usd;
export const ZX = -190, CX = 190; // where Zscaler and the exchange stand
const SKIN = {
  zs: { top: "#6f9df0", front: "linear-gradient(180deg, #2f74ea, #1a54b8)", side: "#153f8c" },
  crwd: { top: "#f0706f", front: "linear-gradient(180deg, #e4312f, #b5161c)", side: "#86101a" },
  slice: { top: "#ffd0cc", front: "linear-gradient(180deg, #f6a19c, #e66b66)", side: "#b94a48" },
  gap: { top: "rgba(255,200,92,0.50)", front: "linear-gradient(180deg, rgba(255,200,92,0.62), rgba(224,138,0,0.38))", side: "rgba(196,120,0,0.42)" },
};

const Shadow: React.FC<{ x: number; y: number; w: number; d: number; opacity?: number }> = ({ x, y, w, d, opacity = 1 }) => (
  <div className="face" style={{ left: x - w / 2 - 22, top: y - d / 2 - 22, width: w + 44, height: d + 44, background: "rgba(23,20,15,0.12)", filter: "blur(14px)", opacity }} />
);

/** A share as a tower: `usd` high (in dollars), in its company's colour, with an optional label on top. */
export const Tower: React.FC<{ x: number; y?: number; w?: number; d?: number; usd: number; k: "zs" | "crwd"; z?: number; top?: React.ReactNode; opacity?: number }> = ({
  x, y = 0, w = 190, d = 190, usd, k, z = 0, top, opacity = 1,
}) => {
  const H = Math.max(PX(usd), 0.02);
  return (
    <>
      {z === 0 && <Shadow x={x} y={y} w={w} d={d} opacity={opacity} />}
      <Box x={x - w / 2} y={y - d / 2} z={z} w={w} d={d} h={H} faces={SKIN[k]} opacity={opacity} />
      {top && <Bill x={x} y={y} z={z + H + 18} opacity={opacity}>{top}</Bill>}
    </>
  );
};

/** What the exchange gives for one Zscaler share: one CrowdStrike share (`price` high) and 0.135 more on top,
 * the slice grown by `slice` (0 to 1). */
export const Offer: React.FC<{ x?: number; y?: number; price: number; slice?: number; opacity?: number; top?: React.ReactNode }> = ({
  x = CX, y = 0, price, slice = 1, opacity = 1, top,
}) => {
  const base = PX(price), extra = PX(price * 0.135) * clamp(slice);
  return (
    <>
      <Shadow x={x} y={y} w={190} d={190} opacity={opacity} />
      <Box x={x - 95} y={y - 95} w={190} d={190} h={base} faces={SKIN.crwd} opacity={opacity} />
      <Box x={x - 95} y={y - 95} z={base} w={190} d={190} h={extra} faces={SKIN.slice} opacity={opacity * clamp(slice * 3)} />
      {top && <Bill x={x} y={y} z={base + extra + 18} opacity={opacity}>{top}</Bill>}
    </>
  );
};

/** The gap: amber glass from `from` to `to` dollars, standing on the tower at x. */
export const Gap: React.FC<{ x?: number; y?: number; from: number; to: number; grow?: number; label?: React.ReactNode }> = ({ x = ZX, y = 0, from, to, grow = 1, label }) => {
  const h = PX(to - from) * clamp(grow);
  return (
    <>
      <Box x={x - 95} y={y - 95} z={PX(from)} w={190} d={190} h={h} faces={SKIN.gap} edge={`inset 0 0 0 3px ${AMBER}`} />
      {label && <Bill x={x - 200} y={y} z={PX(from) + h / 2} anchor="middle" opacity={clamp(grow * 2)}>{label}</Bill>}
    </>
  );
};

/** The level of the exchange: a thin ink plate at `usd` dollars, reaching from the exchange over Zscaler. */
export const Level: React.FC<{ usd: number; opacity?: number }> = ({ usd, opacity = 1 }) => (
  <Box x={ZX - 115} y={-110} z={PX(usd)} w={CX - ZX + 230} d={220} h={4} opacity={opacity * 0.85} faces={{ top: "rgba(23,20,15,0.14)", front: INK, side: INK }} />
);

/** A trading card standing on the floor (the example of 03-cromos). */
export const Cromo: React.FC<{ x: number; y?: number; w?: number; h?: number; k: "zs" | "crwd" | "slice"; grow?: number; children?: React.ReactNode }> = ({
  x, y = 0, w = 170, h = 240, k, grow = 1, children,
}) => (
  <Box x={x - w / 2} y={y - 12} w={w} d={24} h={h * clamp(grow)} faces={SKIN[k]} front={<div className="cromo">{children}</div>} />
);

export const Ground: React.FC = () => <Floor cx={0} cy={0} w={2600} d={2600} />;
