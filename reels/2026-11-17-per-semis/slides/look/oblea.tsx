// "La oblea": the look of the Aprende reel on the P/E and the forward P/E of the big chipmakers
// (2026-11-17). Its machinery (World and its camera, Box, Bill, Frame, Head, Card, Src, between/glide/
// prog, Sign) comes from "La pila" (reels/2026-11-13-per), itself from "La nave". Its own world: a
// silicon wafer lying on the warm paper of the Aprende line, one die per company with its logo, and on
// each die two towers at the same scale: glass for the P/E of the last twelve months, a stack of amber
// chip layers (one per year of profit) for the forward P/E. Everything moves from the frame.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./oblea.css";
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
    <AbsoluteFill className="ob">
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, warm].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="ob-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.10 0" /></filter>
        <rect width="100%" height="100%" filter="url(#ob-grain)" />
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


// ---------------------------------------------------------------- the wafer

/** A silicon wafer lying on the paper, centred on (cx, cy): a disc of cool sheen ruled into dies, with
 * its flat notch. Decoration: it says nothing numeric. */
export const Wafer: React.FC<{ cx?: number; cy?: number; r?: number; die?: number }> = ({ cx = 0, cy = 0, r = 860, die = 86 }) => {
  const film = useFilmSeconds();
  const turn = 20 + Math.sin(film * 0.22) * 26;
  return (
    <>
      <div className="face" style={{ left: cx - r - 26, top: cy - r - 26, width: 2 * r + 52, height: 2 * r + 52, borderRadius: "50%", background: "rgba(23,20,15,0.16)", filter: "blur(18px)" }} />
      <div className="face" style={{
        left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%",
        background: [
          "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0) 86%, rgba(255,255,255,0.55) 97%, rgba(23,20,15,0.25) 100%)",
          `repeating-linear-gradient(0deg, rgba(36,40,72,0.20) 0 2px, transparent 2px ${die}px)`,
          `repeating-linear-gradient(90deg, rgba(36,40,72,0.20) 0 2px, transparent 2px ${die}px)`,
          `conic-gradient(from ${turn.toFixed(2)}deg at 50% 50%, #c7cadf, #e7e0f0, #c2d6de, #ebe5d3, #cfc5e7, #d9e2e9, #c7cadf)`,
        ].join(", "),
      }} />
      <div className="face" style={{ left: cx - 70, top: cy + r - 22, width: 140, height: 24, background: "#efe7d7", transform: "translateZ(1px)" }} />
    </>
  );
};

// ---------------------------------------------------------------- a company's die and its two towers

export type Co = { key: string; name: string; logo?: string; x: number; y: number; pe: number | null; fwd: number };

export const PAD_W = 240, PAD_D = 120, TOWER = 66;
export const SCALE = 4; // px per year of profit, the same for every tower in the reel

// Close of 16 Nov 2026 (Yahoo Finance). P/E: price / diluted EPS of the last twelve months (Intel lost
// money: no P/E). Forward: price / mean analyst EPS estimate for the fiscal year mostly in 2027 (Yahoo
// Finance; ASML's in euros at 1.101 $). Own calculation; see data/sources.md.
export const COS: Co[] = [
  { key: "NVDA", name: "Nvidia", logo: "nvidia", x: -620, y: -300, pe: 19.7, fwd: 9.9 },
  { key: "AVGO", name: "Broadcom", logo: "broadcom", x: -280, y: -300, pe: 42.6, fwd: 17.2 },
  { key: "AMD", name: "AMD", logo: "amd", x: 60, y: -300, pe: 107.8, fwd: 28.6 },
  { key: "ASML", name: "ASML", logo: "asml", x: 400, y: -300, pe: 34.6, fwd: 22.6 },
  { key: "MU", name: "Micron", logo: "micron", x: -450, y: 110, pe: 9.7, fwd: 4.1 },
  { key: "TSM", name: "TSMC", logo: "tsmc", x: -110, y: 110, pe: 24.2, fwd: 16.0 },
  { key: "INTC", name: "Intel", logo: "intel", x: 230, y: 110, pe: null, fwd: 31.0 },
];
export const co = (key: string) => COS.find((c) => c.key === key)!;
/** The middle of a company's die, for the camera. */
export const mid = (key: string) => { const c = co(key); return { x: c.x + PAD_W / 2, y: c.y + PAD_D / 2 }; };

const GLASS = {
  top: "rgba(255,255,255,0.35)",
  front: `repeating-linear-gradient(0deg, rgba(23,20,15,0.30) 0 2px, transparent 2px ${10 * SCALE}px), linear-gradient(115deg, rgba(255,255,255,0.55), rgba(170,200,230,0.22) 45%, rgba(255,255,255,0.12))`,
  side: `repeating-linear-gradient(0deg, rgba(23,20,15,0.22) 0 2px, transparent 2px ${10 * SCALE}px), rgba(150,185,220,0.22)`,
};
const STACK = (dim: boolean) => ({
  top: dim ? "#ddd4c4" : AMBER2,
  front: `repeating-linear-gradient(0deg, rgba(90,50,0,0.35) 0 1px, transparent 1px ${SCALE}px), linear-gradient(180deg, ${dim ? "#cdbfa8" : AMBER}, ${dim ? "#bfb19a" : "#d07c00"})`,
  side: `repeating-linear-gradient(0deg, rgba(60,30,0,0.35) 0 1px, transparent 1px ${SCALE}px), ${dim ? "#b4aa98" : "#a96400"}`,
});

/** One company on its die: the pad with its logo, the glass tower of its P/E and the amber stack of
 * its forward P/E, each rising when its cue comes (seconds; -20 = already standing; undefined = not
 * yet). `dim` greys it, to put the eye elsewhere. */
export const Pair: React.FC<{ c: Co; pe?: number; fwd?: number; dim?: boolean; values?: boolean; tag?: boolean; valueSize?: number }> = ({
  c, pe, fwd, dim = false, values = true, tag = true, valueSize = 40,
}) => {
  const t = useSeconds();
  const gp = pe === undefined ? 0 : ease(prog(t, pe, 0.9));
  const fp = fwd === undefined ? 0 : ease(prog(t, fwd, 0.9));
  const gx = c.x + 22, fx = c.x + PAD_W - 22 - TOWER, ty = c.y + (PAD_D - TOWER) / 2;
  const pad = 8;
  const gh = (c.pe ?? 0) * SCALE * gp, fh = c.fwd * SCALE * fp;
  const o = dim ? 0.5 : 1;
  return (
    <>
      <div className="face" style={{ left: c.x - 10, top: c.y - 10, width: PAD_W + 20, height: PAD_D + 20, background: "rgba(23,20,15,0.12)", filter: "blur(8px)" }} />
      <Box x={c.x} y={c.y} w={PAD_W} d={PAD_D} h={pad} edge="inset 0 0 0 2px rgba(23,20,15,0.35)"
        faces={{ top: dim ? "#e7e2d6" : "#fbf8f1", front: "#8f8778", side: "#a59d8e" }}
        top={<div className="padlines" />} />
      {c.pe !== null && gh > 0.5 && (
        <Box x={gx} y={ty} z={pad} w={TOWER} d={TOWER} h={gh} edge="inset 0 0 0 2.5px rgba(23,20,15,0.55)" opacity={o} faces={GLASS} />
      )}
      {c.pe === null && !dim && pe !== undefined && gp > 0 && (
        <Bill x={gx + TOWER / 2 - 20} y={ty + TOWER / 2} z={pad + 40} opacity={clamp(gp * 2) * o}><div className="val down" style={{ fontSize: valueSize * 0.62 }}>sin PER</div></Bill>
      )}
      {fh > 0.5 && <Box x={fx} y={ty} z={pad} w={TOWER} d={TOWER} h={fh} edge="inset 0 0 0 1.5px rgba(90,50,0,0.45)" faces={STACK(dim)} />}
      {values && !dim && c.pe !== null && gp > 0 && (
        <Bill x={gx + TOWER / 2 - 16} y={ty + TOWER / 2} z={pad + gh + 10} opacity={clamp(gp * 2) * o}><div className="val" style={{ fontSize: valueSize }}>{es((c.pe ?? 0) * gp, 1)}</div></Bill>
      )}
      {values && !dim && fp > 0 && (
        <Bill x={fx + TOWER / 2 + 16} y={ty + TOWER / 2} z={pad + fh + 10} opacity={clamp(fp * 2) * o}><div className="val y" style={{ fontSize: valueSize }}>{es(c.fwd * fp, 1)}</div></Bill>
      )}
      {tag && <Bill x={c.x + PAD_W / 2} y={c.y + PAD_D + 46} anchor="middle" opacity={o}><div className="tag">{c.logo && <Img src={logoUrl(c.logo)} alt="" />}{c.name}</div></Bill>}
    </>
  );
};

/** Every company on the wafer. `cues`: when each one's towers rise ([P/E, forward] in seconds);
 * `built`: those already standing; `dim`: those greyed. Companies with neither stay as bare dies. */
export const Chips: React.FC<{ cues?: Record<string, [number, number]>; built?: string[] | "all"; dim?: string[]; values?: boolean; valueSize?: number }> = ({
  cues = {}, built = [], dim = [], values = true, valueSize,
}) => (
  <>
    {COS.map((c) => {
      const cue = cues[c.key] ?? ((built === "all" || built.includes(c.key)) ? [-20, -20] : undefined);
      return <Pair key={c.key} c={c} pe={cue?.[0]} fwd={cue?.[1]} dim={dim.includes(c.key)} values={values} valueSize={valueSize} />;
    })}
  </>
);

/** What the two towers are, as a card's line. */
export const Key: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div className="legend" style={style}>
    <span><i className="sw glass" /> PER · 12 meses</span>
    <span><i className="sw amber" /> PER adelantado</span>
  </div>
);

export const Sign: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="sign" style={style}><Img src={profile} alt="" /><span>{children}</span></div>
);
