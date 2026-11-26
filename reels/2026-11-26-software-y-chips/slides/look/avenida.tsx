// "La avenida": the look of the A fondo reel on software against chips (2026-11-26), on the machinery
// of "La nave" (2026-11-11) and "El mapa" (2026-11-24). The world is a night avenue in CSS 3D: one
// month per block from January 2025 to November 2026, with two rows of towers facing each other, the
// chips (iShares Semiconductor ETF, SOXX) in gold and the software (iShares Expanded Tech-Software
// Sector ETF, IGV) in violet, each tower as tall as the fund's last close of that month with the end of
// 2024 at 100 (Yahoo Finance, data/monthly.json). A sheet of glass stands at 100. Further down the
// street, five software companies as towers, their 2026 change against a wire frame at 100.
// Everything that moves is moved from the frame, never by CSS.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, useVideoConfig } from "remotion";
import { logoUrl, useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./avenida.css";
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
  const cold = `radial-gradient(70% 40% at ${50 + Math.sin(film * 0.3) * 6}% 72%, rgba(180,120,255,0.08), transparent 70%)`;
  return (
    <AbsoluteFill className={`mp${width > height ? " wide" : ""}`}>
      <div className="world">{world}</div>
      <div className="haze" style={{ background: [top, bottom, cold].join(", ") }} />
      <svg className="grain" width="100%" height="100%">
        <filter id="av-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(film * 12) % 50} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
        <rect width="100%" height="100%" filter="url(#av-grain)" />
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
export const Head: React.FC<{ kick?: React.ReactNode; tone?: "amber" | "up" | "gold" | "violet"; style?: React.CSSProperties; children: React.ReactNode }> = ({ kick, tone, style, children }) => {
  const t = useSeconds();
  const p = ease(prog(t, 0, 0.6));
  return (
    <div className="head" style={style}>
      {kick && <p className={`kick${tone ? ` ${tone}` : ""}`} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{kick}</p>}
      {children}
    </div>
  );
};

const LIT: Record<string, [string, string]> = { ice: [ICE, ICE2], amber: [AMBER, "#ffe2b0"], up: [UP, "#c4ffe6"], down: [DOWN, "#ffc4bd"], gold: ["#f0b53a", "#fff0c2"], violet: ["#9a6cff", "#eadcff"] };
/** The words of the headline that carry it: colour sweeps over them when their cue is said (with
 * no cue, they are lit from the first frame). */
export const Hi: React.FC<{ say?: string | number; tone?: "ice" | "amber" | "up" | "down" | "gold" | "violet"; children: React.ReactNode }> = ({ say, tone = "ice", children }) => {
  const at = useSay(say);
  const t = useSeconds();
  const p = say === undefined ? 1 : ease(prog(t, at - 0.05, 0.6));
  const [a, b] = LIT[tone];
  const edge = (p * 100).toFixed(1);
  return <span className="hi" style={{ backgroundImage: `linear-gradient(90deg, ${a} 0%, ${b} ${edge}%, ${FG} ${edge}%)` }}>{children}</span>;
};

/** A panel that rises into place when its cue is said (with no cue, it is there from the first
 * frame); `gone`, a cue at which it leaves. Give it left/top (and width) in `style`. */
export const Card: React.FC<{ say?: string | number; gone?: string | number; tone?: "key" | "ice" | "amber" | "up" | "down" | "gold" | "violet"; className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
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

// ---------------------------------------------------------------- the avenue

export const GOLD = ["#fff0c2", "#f0b53a", "#9a6a14"] as const;
export const VIOLET = ["#eadcff", "#9a6cff", "#4f2f9c"] as const;
const GREY = ["#7d8aa0", "#3a4558", "#252d3a"] as const;

export const MONTHS = ["2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08","2026-09","2026-10","2026-11"];
/** Last close of each month, end of 2024 = 100 (November 2026: the close of the 25th). Yahoo Finance. */
export const CHIPS = [101.2,96.8,87.3,85.3,95.1,110.8,111.4,113.8,125.8,142.3,137.7,139.8,160.7,163.5,152.5,214.1,264.1,297.4,234.3,237.2,263.9,218.8,178.2];
export const SOFTW = [102.8,97.4,88.9,96.0,103.5,109.4,111.5,108.0,114.9,115.4,104.0,105.6,90.2,81.5,80.0,83.8,101.5,90.5,94.5,109.8,106.4,104.2,94.9];
/** Along the avenue: 100 px a month, 2026-01 at x = 0. Up: 4 px a point. Chips on the far side, software near. */
export const MX = 100, VZ = 4, YC = -130, YS = 70, TW = 64;
export const mx = (i: number) => (i - 12) * MX;

/** The street: the ground, the month marks and the sheet of glass at 100. */
export const Street: React.FC<{ glass?: number }> = ({ glass = 1 }) => {
  const x0 = mx(0) - 220, x1 = mx(22) + 220;
  return (
    <>
      <div className="face" style={{ left: x0, top: -420, width: x1 - x0, height: 760,
        background: ["repeating-linear-gradient(90deg, rgba(200,180,255,0.08) 0 1.5px, transparent 1.5px 100px)",
          "linear-gradient(0deg, #0c0a18 0%, #0a0f1a 50%, #120d06 100%)"].join(", "),
        boxShadow: "inset 0 0 0 2px rgba(200,180,255,0.12)" }} />
      <div className="face" style={{ left: x0, top: -22, width: x1 - x0, height: 4, background: "rgba(255,255,255,0.25)" }} />
      <div className="face" style={{ left: mx(12) - 50, top: -420, width: 3, height: 760, background: "rgba(255,255,255,0.35)" }} />
      {glass > 0 && (
        <div className="face" style={{ left: x0, top: -20 - 100 * VZ, width: x1 - x0, height: 100 * VZ, opacity: glass, transformOrigin: "50% 100%",
          transform: "rotateX(-90deg)",
          background: "linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.10))", borderTop: "4px solid rgba(255,255,255,0.55)" }} />
      )}
      {[["2025-01", 0], ["2026-01", 12], ["2026-11", 22]].map(([l, i]) => (
        <Bill key={l as string} x={mx(i as number)} y={260} z={4} anchor="middle"><div className="gmark">{l === "2025-01" ? "ene 2025" : l === "2026-01" ? "ene 2026" : "nov 2026"}</div></Bill>
      ))}
    </>
  );
};

/** The two rows of towers. `upto`: how many months stand (may be fractional, for the growth);
 * `chips`/`soft`: their opacity; `grey`: paint a row grey. */
export const Avenue: React.FC<{ upto?: number; chips?: number; soft?: number; glass?: number; dimChips?: boolean; dimSoft?: boolean; from?: number }> = ({ upto = 23, chips = 1, soft = 1, glass = 1, dimChips, dimSoft, from = 0 }) => (
  <>
    <Street glass={glass} />
    {MONTHS.map((m, i) => {
      if (i < from) return null;
      const g = clamp(upto - i);
      if (g <= 0) return null;
      return (
        <React.Fragment key={m}>
          {chips > 0 && <Box x={mx(i) - TW / 2} y={YC - TW / 2} w={TW} d={TW} h={Math.max(0.01, CHIPS[i] * VZ * ease(g))} opacity={chips}
            faces={{ top: (dimChips ? GREY : GOLD)[0], front: `linear-gradient(180deg, ${(dimChips ? GREY : GOLD)[1]}, ${(dimChips ? GREY : GOLD)[2]})`, side: `linear-gradient(180deg, ${(dimChips ? GREY : GOLD)[2]}, #06080d)` }} />}
          {soft > 0 && <Box x={mx(i) - TW / 2} y={YS - TW / 2} w={TW} d={TW} h={Math.max(0.01, SOFTW[i] * VZ * ease(g))} opacity={soft}
            faces={{ top: (dimSoft ? GREY : VIOLET)[0], front: `linear-gradient(180deg, ${(dimSoft ? GREY : VIOLET)[1]}, ${(dimSoft ? GREY : VIOLET)[2]})`, side: `linear-gradient(180deg, ${(dimSoft ? GREY : VIOLET)[2]}, #06080d)` }} />}
        </React.Fragment>
      );
    })}
  </>
);

/** A label over the tower of month `i` in a row. */
export const Over: React.FC<{ i: number; row: "chips" | "soft"; opacity?: number; children: React.ReactNode }> = ({ i, row, opacity = 1, children }) => (
  <Bill x={mx(i)} y={row === "chips" ? YC : YS} z={(row === "chips" ? CHIPS[i] : SOFTW[i]) * VZ + 20} opacity={opacity}>
    <div className={`dtag ${row}`}>{children}</div>
  </Bill>
);

/** Five software companies, their 2026 change (close of 25 Nov 2026 against the close of 2025; Yahoo Finance). */
export const NAMES = [
  { name: "Salesforce", v: 74.4, ch: -25.6 },
  { name: "Adobe", v: 66.5, ch: -33.5 },
  { name: "ServiceNow", v: 60.2, ch: -39.8 },
  { name: "HubSpot", v: 52.4, ch: -47.6 },
  { name: "Intuit", v: 41.0, ch: -59.0 },
];
/** Where the five stand: a plaza past the end of the avenue. */
export const PX = mx(22) + 700, NZ = 9, NW = 120;
export const nx = (k: number) => PX + (k - 2) * 270;
export const Plaza: React.FC<{ at?: (k: number) => number; labels?: number }> = ({ at = () => -9, labels = 1 }) => {
  const t = useSeconds();
  return (
    <>
      <div className="face" style={{ left: PX - 800, top: -300, width: 1600, height: 600, background: "radial-gradient(60% 60% at 50% 50%, #151026, #06060c 100%)", boxShadow: "inset 0 0 0 2px rgba(200,180,255,0.14)" }} />
      {NAMES.map((n, k) => {
        const g = ease(prog(t, at(k), 1.1));
        const h = mix(100, n.v, g) * NZ;
        return (
          <React.Fragment key={n.name}>
            <div className="face" style={{ left: nx(k) - NW / 2 - 6, top: NW / 2 + 6 - 100 * NZ, width: NW + 12, height: 100 * NZ, transformOrigin: "50% 100%",
              transform: "rotateX(-90deg)", border: "3px dashed rgba(255,255,255,0.45)" }} />
            <Box x={nx(k) - NW / 2} y={-NW / 2} w={NW} d={NW} h={h}
              faces={{ top: VIOLET[0], front: `linear-gradient(180deg, ${VIOLET[1]}, ${VIOLET[2]})`, side: `linear-gradient(180deg, ${VIOLET[2]}, #06080d)` }} />
            <Bill x={nx(k)} y={0} z={h + 24} opacity={labels * g}><div className="dtag soft">{es(n.ch, 1)} %</div></Bill>
            <Bill x={nx(k)} y={NW / 2 + 70} z={2} anchor="middle" opacity={labels}><div className="gmark">{n.name}</div></Bill>
          </React.Fragment>
        );
      })}
    </>
  );
};
