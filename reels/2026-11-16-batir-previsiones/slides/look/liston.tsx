// "El listón": the look of the Aprende reel on beating estimates (2026-11-16). Its machinery (World and
// its camera, Box, Bill, Frame, Head, Card, Src, between/glide/prog, Sign) comes from "La nave"
// (reels/2026-11-11-neoclouds) by way of "La pila" (reels/2026-11-13-per), on the warm paper of the
// Aprende line. Its own object is the Jump: a high-jump stand whose crossbar is the analysts'
// consensus, at its real height, and an amber column, the earnings per share, that rises between the
// posts and clears the bar (green) or stays under it (red). Everything moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./liston.css";
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
    <AbsoluteFill className="ls">
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, warm].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="ls-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.10 0" /></filter>
        <rect width="100%" height="100%" filter="url(#ls-grain)" />
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

// ---------------------------------------------------------------- the jump

/** A high-jump stand with its centre at (x, y): two posts and a crossbar at `bar * scale` px (the
 * consensus), and, from `at` seconds, an amber column rising to `eps * scale` px (the result). Over it,
 * the result and the surprise, green if it clears the bar, red if not. `band`: the lowest and highest
 * estimates, drawn as two faint bars. `eps` undefined: no column, a question mark. */
export const Jump: React.FC<{
  x: number; y: number; bar: number; eps?: number; scale: number; at?: number; takes?: number; w?: number;
  barText?: string; epsText?: string; surprise?: string; label?: string; band?: [number, number]; bandText?: [string, string]; barAt?: number; size?: number; ghost?: boolean;
}> = ({ x, y, bar, eps, scale, at = 0, takes = 1.4, w = 230, barText, epsText, surprise, label, band, bandText, barAt = -10, size = 46, ghost = false }) => {
  const t = useSeconds();
  const stand = ease(prog(t, barAt, 0.6));
  const H = bar * scale;
  const post = 18;
  const rise = eps === undefined ? 0 : ease(prog(t, at, takes));
  const E = (eps ?? 0) * scale * rise;
  const clear = eps !== undefined && eps >= bar;
  const done = rise >= 0.98;
  const col = 110;
  return (
    <>
      <div className="face" style={{ left: x - w / 2 - 30, top: y - 70, width: w + 60, height: 140, background: "rgba(23,20,15,0.08)", filter: "blur(12px)" }} />
      {/* mat */}
      <Box x={x - w / 2 - 10} y={y - 60} w={w + 20} d={120} h={10} faces={{ top: "#e3d8c3", front: "#cfc2a8", side: "#bfb299" }} />
      {/* the column (the result) */}
      {eps !== undefined && E > 0.5 && (
        <Box x={x - col / 2} y={y - col / 2} z={10} w={col} d={col} h={E}
          faces={{ top: clear && done ? "#7fe0b4" : AMBER2, front: `linear-gradient(180deg, ${clear && done ? UP : AMBER}, ${clear && done ? "#0e8a57" : "#c47800"})`, side: clear && done ? "#0b7449" : "#a86500" }} />
      )}
      {/* the band of estimates */}
      {band && band.map((b, i) => (
        <Box key={i} x={x - w / 2 + post} y={y - 3} z={b * scale} w={w - 2 * post} d={6} h={4} opacity={stand * 0.9}
          faces={{ top: "rgba(23,20,15,0.25)", front: "rgba(23,20,15,0.25)", side: "rgba(23,20,15,0.2)" }} />
      ))}
      {/* the posts and the bar (the consensus) */}
      <Box x={x - w / 2} y={y - post / 2} w={post} d={post} h={(H + 40) * stand} faces={{ top: "#3d382f", front: "#2a251e", side: "#17140f" }} />
      <Box x={x + w / 2 - post} y={y - post / 2} w={post} d={post} h={(H + 40) * stand} faces={{ top: "#3d382f", front: "#2a251e", side: "#17140f" }} />
      <Box x={x - w / 2 - 14} y={y - 6} z={H - 6} w={w + 28} d={12} h={12} opacity={stand}
        faces={{ top: ghost ? "rgba(23,20,15,0.3)" : "#fff", front: ghost ? "rgba(23,20,15,0.3)" : "repeating-linear-gradient(90deg, #17140f 0 28px, #fffdf8 28px 56px)", side: "#17140f" }} />
      {barText && <Bill x={x - w / 2 - 30 - barText.length * 7.5} y={y + 40} z={H} anchor="middle" opacity={stand}><div className="bar-tag">{barText}</div></Bill>}
      {band && bandText && band.map((b, i) => (
        <Bill key={i} x={x + w / 2 + 70} y={y + 40} z={b * scale} anchor="middle" opacity={stand}><div className="bar-tag soft">{bandText[i]}</div></Bill>
      ))}
      {eps === undefined && <Bill x={x} y={y} z={H + 60} opacity={stand}><div className="val q" style={{ fontSize: size * 1.6 }}>?</div></Bill>}
      {eps !== undefined && rise > 0.05 && epsText && (
        <Bill x={x} y={y} z={E + 30} opacity={clamp(rise * 2)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {surprise && done && <span className={`pill ${clear ? "g" : "r"}`}>{surprise}</span>}
            <div className={`val${done ? (clear ? " g" : " r") : " y"}`} style={{ fontSize: size }}>{epsText}</div>
          </div>
        </Bill>
      )}
      {label && <Bill x={x} y={y + 110} anchor="middle" opacity={stand}><div className="tag">{label}</div></Bill>}
    </>
  );
};

export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);
