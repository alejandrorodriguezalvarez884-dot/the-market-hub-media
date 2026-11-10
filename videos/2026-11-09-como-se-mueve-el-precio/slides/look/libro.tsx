// "El libro": the look of the reel on how a price is made, as components. A scene is
//
//   <Board lean={0.6}>
//     <Head><h1>El precio es el <Hi say="último">último trato</Hi></h1></Head>
//     <Stage>
//       <Machine lo={98} hi={104} ticks={[...]}> <Order .../> <Rusher .../> <Deal .../> </Machine>
//       <Card say="pantalla" tone="key" style={{ left: 0, top: 656, width: 860 }}>...</Card>
//     </Stage>
//     <Src>Ejemplo inventado...</Src>
//   </Board>
//
// The machine is the piece's one picture: a ladder of prices, the book of orders on its right
// (sellers above, buyers below), a white pill on the last deal and, on the left, the tape that runs
// under it and keeps its trail, which is the chart. Everything that moves is moved from the frame
// (useSeconds), never by CSS, so the same scene always gives the same film.
import React from "react";
import { AbsoluteFill, Easing, useVideoConfig } from "remotion";
import { useFilmSeconds, useSay, useScene, useSeconds } from "@mh/kit";
import "./libro.css";

export const BG = "#07080b", FG = "#f5f7fa", SOFT = "#d3d8e0", DIM = "#98a2b3", BUY = "#34e3a1", SELL = "#ff6b61", ACC = "#9db8ff", ACC2 = "#cdb8ff";
export const HAIR = "rgba(255,255,255,0.14)", GLASS = "rgba(255,255,255,0.055)";
export type Side = "buy" | "sell";
export const tone = (side: Side) => (side === "buy" ? BUY : SELL);

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN = Easing.bezier(0.6, 0, 0.9, 0.4);
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
/** From 0 to 1 between `at` and `at + takes`. */
export const prog = (t: number, at: number, takes: number) => clamp((t - at) / Math.max(takes, 1e-6));
/** Arrives fast and settles, with no bounce. */
export const ease = (p: number) => OUT(clamp(p));
export const es = (n: number, decimals = 0) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: "always" as never }).replace("-", "−");
/** A soft light around something drawn in an SVG. */
export const glow = (color: string, px = 14): React.CSSProperties => ({ filter: `drop-shadow(0 0 ${px}px ${color})` });

/** The chapters of the long video: the number of the scene that opens each, and its title. */
export const CHAPTERS: [number, string][] = [
  [1, "El jueves y el lunes"], [5, "La subasta"], [13, "La prisa"], [21, "Nadie sabe cuánto vale"], [29, "Dónde ocurre"], [34, "Cuánto es normal"], [43, "¿Un casino?"],
];

/** The frame of every scene: the ground lit by the two sides, the brand, and where we are (the
 * chapters as segments, each as long as its scenes). `lean` is who is in a hurry: 1, the buyers (the
 * green light from below grows); -1, the sellers. `layout`: the headline on the left and the drawing
 * on the right (the default), the other way round ("flip"), the drawing across the frame ("full"),
 * or the slide that opens a chapter ("chapter"). */
export const Board: React.FC<{ lean?: number; layout?: "flip" | "full" | "chapter"; children: React.ReactNode }> = ({ lean = 0, layout, children }) => {
  const film = useFilmSeconds();
  const t = useSeconds();
  const scene = useScene();
  const { width, height } = useVideoConfig();
  const sway = Math.sin(film * 0.35) * 9;
  const buy = 0.2 + 0.24 * clamp(lean), sell = 0.2 + 0.24 * clamp(-lean);
  const light = [
    `radial-gradient(95% 36% at ${50 + sway}% 106%, rgba(52,227,161,${buy.toFixed(3)}), transparent 72%)`,
    `radial-gradient(95% 36% at ${50 - sway}% -6%, rgba(255,107,97,${sell.toFixed(3)}), transparent 72%)`,
    "radial-gradient(46% 30% at 104% 46%, rgba(157,184,255,0.1), transparent 70%)",
  ].join(", ");
  const n = scene.index + 1;
  const at = n + clamp(t / Math.max(scene.seconds, 0.1));
  const chapter = CHAPTERS.reduce((last, c, i) => (c[0] <= n ? i : last), 0);
  return (
    <AbsoluteFill className={`lb${width > height ? " wide" : ""}${layout ? ` ${layout}` : ""}`}>
      <div className="light" style={{ background: light }} />
      <div className="rim" />
      <svg className="grain" width="100%" height="100%">
        <filter id="lb-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.1 0" /></filter>
        <rect width="100%" height="100%" filter="url(#lb-grain)" />
      </svg>
      <header className="hud">
        <div className="row">
          <span>The Market Hub · <b>Aprende</b></span>
          <span><b>{chapter + 1}</b> / {CHAPTERS.length} · <b>{CHAPTERS[chapter][1]}</b></span>
        </div>
        <div className="bars">
          {CHAPTERS.map(([first], i) => {
            const next = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1][0] : scene.count + 1;
            return <i key={i} style={{ flex: next - first }}><span style={{ transform: `scaleX(${clamp((at - first) / (next - first))})` }} /></i>;
          })}
        </div>
      </header>
      {children}
    </AbsoluteFill>
  );
};

export const Head: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <div className="head" style={style}>{children}</div>;
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <div className="stage" style={style}>{children}</div>;
export const Src: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="src">{children}</p>;
export const Svg: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = 860, h = 780 }) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{children}</svg>;
/** The size of the drawing across the frame (layout "full"). */
export const FULL = { w: 1740, h: 690 };
export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="kicker">{children}</p>;
/** A sentence under the headline that comes in when its cue is said. */
export const Lead: React.FC<{ say?: string | number; children: React.ReactNode }> = ({ say, children }) => {
  const at = useSay(say);
  const t = useSeconds();
  const p = say === undefined ? 1 : ease(prog(t, at, 0.55));
  return <p className="lead" style={{ opacity: clamp(p * 1.6), transform: `translateY(${((1 - p) * 22).toFixed(2)}px)` }}>{children}</p>;
};
/** The slide that opens a chapter: its number, its title and, beside it, the chapter's own drawing. */
export const Chapter: React.FC<{ n: number; title: React.ReactNode; lean?: number; children?: React.ReactNode }> = ({ n, title, lean, children }) => (
  <Board layout="chapter" lean={lean}>
    <Head><Kicker>Capítulo {n} de {CHAPTERS.length}</Kicker><h1>{title}</h1></Head>
    {children}
  </Board>
);

const LIT: Record<string, [string, string]> = { acc: [ACC, ACC2], buy: [BUY, "#b9ffe0"], sell: [SELL, "#ffc2b8"] };
/** The words of the headline that carry it: colour sweeps over them when their cue is said (with
 * no cue, they are lit from the first frame). */
export const Hi: React.FC<{ say?: string | number; tone?: "buy" | "sell"; children: React.ReactNode }> = ({ say, tone: c, children }) => {
  const at = useSay(say);
  const t = useSeconds();
  const p = say === undefined ? 1 : ease(prog(t, at - 0.05, 0.55));
  const [a, b] = LIT[c ?? "acc"];
  const edge = (p * 100).toFixed(1);
  return <span className="hi" style={{ backgroundImage: `linear-gradient(90deg, ${a} 0%, ${b} ${edge}%, ${FG} ${edge}%)` }}>{children}</span>;
};

/** A panel over the stage that rises into place when its cue is said (with no cue, it is there
 * from the first frame). Give it left/top (and width) in `style`; `bump` is a cue at which it lights up. */
export const Card: React.FC<{ say?: string | number; bump?: string | number; tone?: "key" | "buy" | "sell"; className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  say, bump, tone: c, className = "", style, children,
}) => {
  const t = useSeconds();
  const at = useSay(say), thump = useSay(bump);
  const p = say === undefined ? 1 : ease(prog(t, at, 0.55));
  const b = bump === undefined || t < thump ? 0 : 1 - ease(prog(t, thump, 0.7));
  return (
    <div className={`card${c ? ` ${c}` : ""} ${className}`}
      style={{ ...style, opacity: clamp(p * 1.8), transform: `translateY(${((1 - p) * 30).toFixed(2)}px) scale(${(0.97 + 0.03 * p + 0.07 * b).toFixed(4)})`, filter: b > 0.01 ? `brightness(${(1 + 0.45 * b).toFixed(3)})` : undefined }}>
      {children}
    </div>
  );
};

/** Someone in the market, as a mark: a buyer is a green circle, a seller a red square. Outlined,
 * they wait; `solid`, they are in a hurry. (x, y) is its middle, in the stage's own units. */
export const Who: React.FC<{ x: number; y: number; r?: number; side: Side; solid?: boolean; scale?: number; opacity?: number }> = ({ x, y, r = 22, side, solid = false, scale = 1, opacity = 1 }) => {
  const c = tone(side);
  const shape = { fill: c, fillOpacity: solid ? 1 : 0.16, stroke: c, strokeWidth: solid ? 0 : 2 };
  const ink = solid ? BG : c;
  return (
    <g transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)}) scale(${scale.toFixed(4)})`} opacity={opacity}>
      {side === "buy" ? <circle r={r} {...shape} /> : <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.36} {...shape} />}
      <circle cy={-r * 0.22} r={r * 0.25} fill={ink} />
      <path d={`M ${-r * 0.5} ${r * 0.56} C ${-r * 0.5} ${r * 0.1} ${r * 0.5} ${r * 0.1} ${r * 0.5} ${r * 0.56} Z`} fill={ink} />
    </g>
  );
};

/** A label in a pill, its middle at (x, y); `show` (0 to 1) brings it in. */
export const Tag: React.FC<{ x: number; y: number; w?: number; h?: number; tone?: "key" | "buy" | "sell"; size?: number; show?: number; children: React.ReactNode }> = ({
  x, y, w = 176, h = 48, tone: c, size = 20, show = 1, children,
}) => {
  if (show <= 0) return null;
  const fill = c === "key" ? FG : c ? tone(c) : "#12151b";
  const ink = c === "key" ? BG : c ? tone(c) : SOFT;
  return (
    <g transform={`translate(${x.toFixed(2)}, ${(y + (1 - show) * 14).toFixed(2)})`} opacity={show}>
      {c && c !== "key" && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#0c0e13" />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={c && c !== "key" ? 0.16 : 1} stroke={c === "key" ? "none" : c ? tone(c) : HAIR} strokeWidth={1.5} />
      <text className="mono" x={size * 0.06} y={size * 0.35} textAnchor="middle" fontSize={size} fill={ink} letterSpacing="0.12em">{children}</text>
    </g>
  );
};

/** Two rings that open from (x, y) at second `at` of the scene and are gone a moment later. */
export const Pulse: React.FC<{ x: number; y: number; at: number; size?: number; color?: string }> = ({ x, y, at, size = 70, color = FG }) => {
  const t = useSeconds();
  if (t < at || t > at + 0.9) return null;
  return (
    <g>
      {[0, 0.16].map((late) => {
        const p = prog(t, at + late, 0.7), e = ease(p);
        return p > 0 && p < 1 ? <circle key={late} cx={x} cy={y} r={size * (0.25 + 0.75 * e)} fill="none" stroke={color} strokeWidth={3.5 * (1 - e) + 0.6} opacity={1 - p} /> : null;
      })}
    </g>
  );
};

/** A panel of glass drawn inside an SVG. */
export const Panel: React.FC<{ x?: number; y?: number; w?: number; h: number; r?: number }> = ({ x = 0, y = 0, w = 860, h, r = 28 }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={GLASS} stroke={HAIR} strokeWidth={1.5} />
);

/** A company, as a mark: a works with a saw roof and a chimney. (x, y) is the middle of its foot;
 * `s` its width. */
export const Firm: React.FC<{ x: number; y: number; s?: number; color?: string; opacity?: number }> = ({ x, y, s = 200, color = FG, opacity = 1 }) => {
  const u = s / 200;
  return (
    <g transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)}) scale(${u.toFixed(4)})`} opacity={opacity} fill="none" stroke={color} strokeWidth={5 / Math.max(u, 0.5)} strokeLinejoin="round" strokeLinecap="round">
      <path d="M -100 0 V -78 L -50 -112 V -78 L 0 -112 V -78 L 50 -112 V -78 H 100 V 0 Z" fill={color} fillOpacity={0.08} />
      <path d="M 62 -78 V -150 H 88 V -78" />
      <path d="M -70 0 V -40 H -40 V 0 M -12 -52 H 14 M 40 -52 H 66 M -12 -26 H 14 M 40 -26 H 66" />
    </g>
  );
};

// ---- Charts ----

/** 0 to 1 from the moment a cue is said (a number: that second of the scene). */
export const useIn = (say: string | number | undefined, takes = 0.55): number => {
  const at = useSay(say);
  const t = useSeconds();
  return say === undefined ? 1 : ease(prog(t, at, takes));
};
/** A line through `pts` drawn up to `p` (0 to 1): its points and where its tip is. */
export const trace = (pts: (readonly [number, number])[], p: number) => {
  const u = clamp(p) * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(u)), f = u - i;
  const tip = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f] as const;
  const line = pts.slice(0, i + 1).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).concat(`${tip[0].toFixed(1)},${tip[1].toFixed(1)}`).join(" ");
  return { line, tip, i };
};
/** Bars from the zero line of a box (x, y, w, h showing lo to hi), growing one after another
 * from second `at` over `takes`. `color` and `dim` say how each is drawn. */
export const Bars: React.FC<{
  x: number; y: number; w: number; h: number; values: number[]; lo: number; hi: number; at?: number; takes?: number; gap?: number;
  color?: (v: number, i: number) => string; dim?: (v: number, i: number) => number; r?: number;
}> = ({ x, y, w, h, values, lo, hi, at = 0.1, takes = 1.6, gap = 0.28, color = (v) => (v < 0 ? SELL : BUY), dim = () => 1, r = 3 }) => {
  const t = useSeconds();
  const step = w / values.length, bw = Math.max(1.5, step * (1 - gap));
  const Y = (v: number) => y + ((hi - v) / (hi - lo)) * h;
  const zero = Y(clamp(0, lo, hi));
  return (
    <g>
      {values.map((v, i) => {
        const g = ease(prog(t, at + (i / values.length) * takes, 0.45));
        const top = Math.min(zero, Y(v * g)), size = Math.abs(Y(v * g) - zero);
        return <rect key={i} x={x + i * step + (step - bw) / 2} y={top} width={bw} height={Math.max(size, 0.01)} rx={Math.min(r, bw / 2)} fill={color(v, i)} opacity={dim(v, i)} />;
      })}
    </g>
  );
};

// ---- The machine ----

/** A deal: at second `t` of the scene (negative: before it began), at `price`. */
export type Tick = { t: number; price: number };
export type Rows = { lo: number; hi: number; top: number; row: number };
export const STRIP = { x: 0, w: 312 }, RULER = { x: 332, w: 132 }, BOOK = { x: 486, w: 268 }, LANE = { x: 812 };
export const rowY = (m: Rows, price: number) => m.top + (m.hi - price + 0.5) * m.row;

/** The price as the pill shows it at second `t`: it slides to each new deal in a fifth of a second. */
export const priceAt = (ticks: Tick[], t: number, slide = 0.22): number => {
  let price = ticks[0].price;
  for (const k of ticks.slice(1)) {
    if (t < k.t) break;
    price += (k.price - price) * OUT(clamp((t - k.t) / slide));
  }
  return price;
};
export const lastTick = (ticks: Tick[], t: number): Tick => ticks.reduce((last, k) => (k.t <= t ? k : last), ticks[0]);

const Machinery = React.createContext<Rows>({ lo: 98, hi: 104, top: 16, row: 86 });
export const useRows = () => React.useContext(Machinery);

/** The ladder of prices with the pill of the last deal, and the tape with its trail. `strip` and
 * `puck` are the seconds at which each comes in (false: never); `speed`, how fast the tape runs. */
export const Machine: React.FC<{
  lo: number; hi: number; top?: number; row?: number; ticks: Tick[]; strip?: number | false; puck?: number | false;
  speed?: number; unit?: string; h?: number; note?: string; children?: React.ReactNode;
}> = ({ lo, hi, top = 16, row = 86, ticks, strip = 0, puck = 0, speed = 46, unit = " €", h = 780, note, children }) => {
  const t = useSeconds();
  const m: Rows = { lo, hi, top, row };
  const prices = Array.from({ length: hi - lo + 1 }, (_, i) => hi - i);
  const bottom = top + prices.length * row;
  const now = priceAt(ticks, t);
  const last = lastTick(ticks, t);
  const y = rowY(m, now);
  const hit = last.t > 0 ? 1 - ease(prog(t, last.t, 0.6)) : 0;
  const stripIn = strip === false ? 0 : ease(prog(t, strip, 0.6));
  const puckIn = puck === false ? 0 : ease(prog(t, puck, 0.45));
  const head = STRIP.x + STRIP.w - 28;
  const since = typeof strip === "number" ? Math.max(strip, typeof puck === "number" ? puck : 0) : 0;
  const trail: string[] = [];
  for (let x = head; x >= STRIP.x + 4; x -= 3) {
    const at = t - (head - x) / speed;
    if (at < since && since > 0) break;
    trail.push(`${x.toFixed(1)},${rowY(m, priceAt(ticks, at)).toFixed(1)}`);
  }
  const tail = trail.length ? Number(trail[trail.length - 1].split(",")[0]) : head;
  const pillH = row * 0.74;
  return (
    <Machinery.Provider value={m}>
      <svg width={860} height={h} viewBox={`0 0 860 ${h}`}>
        <defs>
          <linearGradient id="lb-trail" gradientUnits="userSpaceOnUse" x1={STRIP.x} x2={head} y1={0} y2={0}>
            <stop offset="0" stopColor={FG} stopOpacity={0} /><stop offset="0.4" stopColor={FG} stopOpacity={0.9} /><stop offset="1" stopColor={FG} />
          </linearGradient>
          <linearGradient id="lb-under" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={top} y2={bottom}>
            <stop offset="0" stopColor={ACC} stopOpacity={0.2} /><stop offset="1" stopColor={ACC} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lb-fade" gradientUnits="userSpaceOnUse" x1={STRIP.x} x2={head} y1={0} y2={0}>
            <stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset="0.5" stopColor="#fff" />
          </linearGradient>
          <mask id="lb-mask"><rect x={STRIP.x} y={top} width={STRIP.w} height={bottom - top} fill="url(#lb-fade)" /></mask>
          <clipPath id="lb-strip"><rect x={STRIP.x} y={top} width={STRIP.w} height={bottom - top} rx={28} /></clipPath>
        </defs>
        {strip !== false && (
          <g opacity={stripIn} transform={`translate(${((1 - stripIn) * -30).toFixed(2)}, 0)`}>
            <Panel x={STRIP.x} y={top} w={STRIP.w} h={bottom - top} />
            <g clipPath="url(#lb-strip)">
              {prices.map((p) => <line key={p} x1={STRIP.x} x2={STRIP.x + STRIP.w} y1={rowY(m, p)} y2={rowY(m, p)} stroke="#fff" strokeOpacity={0.06} strokeWidth={1.5} />)}
              {Array.from({ length: 6 }, (_, i) => {
                const x = head - ((t * speed + i * 52) % (STRIP.w - 4));
                return <line key={i} x1={x} x2={x} y1={top} y2={bottom} stroke="#fff" strokeOpacity={0.05} strokeWidth={1.5} />;
              })}
              {trail.length > 1 && <polygon points={`${trail.join(" ")} ${tail},${bottom} ${head},${bottom}`} fill="url(#lb-under)" mask="url(#lb-mask)" />}
              {trail.length > 1 && <polyline points={trail.join(" ")} fill="none" stroke="url(#lb-trail)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.55)", 10)} />}
            </g>
            {note && <text className="mono" x={STRIP.x + 24} y={bottom - 22} fontSize={16} fill={DIM} letterSpacing="0.08em">{note}</text>}
            {puckIn > 0 && <line x1={head + 14} x2={RULER.x - 2} y1={y} y2={y} stroke="#fff" strokeOpacity={0.4 * puckIn} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />}
            {puckIn > 0 && <circle cx={head} cy={y} r={10 + hit * 18} fill={FG} opacity={0.22 * puckIn} />}
            {puckIn > 0 && <circle cx={head} cy={y} r={9} fill={FG} opacity={puckIn} style={glow("rgba(255,255,255,0.7)", 12)} />}
          </g>
        )}
        <Panel x={RULER.x} y={top} w={RULER.w} h={bottom - top} />
        {prices.slice(1).map((p) => <line key={p} x1={RULER.x + RULER.w + 8} x2={860} y1={rowY(m, p) - row / 2} y2={rowY(m, p) - row / 2} stroke="#fff" strokeOpacity={0.055} strokeWidth={1.5} />)}
        {prices.map((p) => (
          <text key={p} x={RULER.x + RULER.w / 2} y={rowY(m, p) + 13} textAnchor="middle" fontSize={38} fill={DIM} opacity={0.75}>{p}</text>
        ))}
        {puck !== false && puckIn > 0 && (
          <g transform={`translate(${RULER.x + RULER.w / 2}, ${y.toFixed(2)}) scale(${(puckIn * (1 + hit * 0.1)).toFixed(4)})`} opacity={clamp(puckIn * 2)}
            style={glow(`rgba(255,255,255,${(0.3 + hit * 0.45).toFixed(3)})`, 16 + hit * 26)}>
            <rect x={-RULER.w / 2 - 14} y={-pillH / 2} width={RULER.w + 28} height={pillH} rx={pillH / 2} fill={FG} />
            <text x={0} y={16} textAnchor="middle" fontSize={46} fontWeight={700} fill={BG} letterSpacing="-0.02em">{last.price}{unit}</text>
          </g>
        )}
        {children}
      </svg>
    </Machinery.Provider>
  );
};

/** An order that waits in the book: a pill on its row with who it is and what it asks or pays. It
 * comes in at `at` and is taken at `gone`, both in seconds of the scene; `tagAt` is when its
 * price is read out, and `walks` the second at which it leaves its row to take someone else's
 * price (a Rusher takes over from there). */
export const Order: React.FC<{ side: Side; price: number; at?: number; gone?: number; walks?: number; tagAt?: number; label?: string }> = ({ side, price, at = 0, gone, walks, tagAt, label }) => {
  const m = useRows();
  const t = useSeconds();
  if (at > 0 && t < at) return null;
  const c = tone(side);
  const y = rowY(m, price);
  const inn = at > 0 ? ease(prog(t, at, 0.5)) : 1;
  const out = gone !== undefined ? ease(prog(t, gone + 0.12, 0.4)) : walks !== undefined ? ease(prog(t, walks, 0.3)) : 0;
  if (out >= 1) return null;
  const flash = gone !== undefined && t >= gone ? 1 - prog(t, gone, 0.4) : 0;
  const tag = tagAt === undefined ? 1 : ease(prog(t, tagAt, 0.45));
  const h = m.row * 0.76;
  return (
    <g opacity={clamp(inn * 1.6) * (1 - out)} transform={`translate(${((1 - inn) * 40).toFixed(2)}, ${y.toFixed(2)}) scale(1, ${(1 - out * 0.35).toFixed(4)})`}>
      <rect x={BOOK.x} y={-h / 2} width={BOOK.w} height={h} rx={h / 2} fill="#0c0e13" fillOpacity={0.7} />
      <rect x={BOOK.x} y={-h / 2} width={BOOK.w} height={h} rx={h / 2} fill={flash > 0 ? FG : c} fillOpacity={0.12 + flash * 0.6} stroke={flash > 0 ? FG : c} strokeOpacity={0.6 + flash * 0.4} strokeWidth={2} />
      <Who x={BOOK.x + h / 2} y={0} r={h * 0.33} side={side} />
      <g opacity={tag} transform={`translate(${((1 - tag) * 12).toFixed(2)}, 0)`}>
        <text className="mono" x={BOOK.x + h + 2} y={7} fontSize={19} fill={c} letterSpacing="0.12em">{side === "buy" ? "PAGA" : "PIDE"}</text>
        <text x={BOOK.x + BOOK.w - 24} y={13} textAnchor="end" fontSize={38} fill={FG} letterSpacing="-0.02em">{label ?? `${price} €`}</text>
      </g>
    </g>
  );
};

/** Someone in a hurry: a solid mark that waits in the lane on the right (at `wait`), with a ring
 * that beats, and at `at` has run to the order at `price` and taken it. */
export const Rusher: React.FC<{ side: Side; price: number; at: number; from?: number; show?: number; phase?: number; wait?: [number, number] }> = ({
  side, price, at, from, show = 0, phase = 0, wait,
}) => {
  const m = useRows();
  const t = useSeconds();
  if (t < show) return null;
  const out = prog(t, at + 0.04, 0.3);
  if (out >= 1) return null;
  const c = tone(side);
  const r = m.row * 0.3;
  const start = from ?? at - 0.5;
  const [wx, wy] = wait ?? [LANE.x, side === "buy" ? m.top + (m.hi - m.lo + 1) * m.row - r : m.top + r];
  const tx = BOOK.x + BOOK.w + r + 6, ty = rowY(m, price);
  const pos = (when: number) => {
    const p = IN(prog(when, start, at - start));
    return [wx + (tx - wx) * p, wy + (ty - wy) * p] as const;
  };
  const [x, y] = pos(t), [bx, by] = pos(t - 0.1);
  const inn = show > 0 ? ease(prog(t, show, 0.45)) : 1;
  const beat = ((t * 1.7 + phase) % 1 + 1) % 1;
  return (
    <g opacity={clamp(inn * 1.6) * (1 - out)}>
      {t < start && <circle cx={x} cy={y} r={r + 3 + beat * 16} fill="none" stroke={c} strokeWidth={2.5} opacity={(1 - beat) * 0.7} />}
      {t >= start && t < at && <line x1={bx} y1={by} x2={x} y2={y} stroke={c} strokeWidth={r * 1.3} strokeLinecap="round" opacity={0.3} />}
      <g style={glow(side === "buy" ? "rgba(52,227,161,0.6)" : "rgba(255,107,97,0.6)", 14)}>
        <Who x={x} y={y} r={r} side={side} solid scale={(0.6 + 0.4 * inn) * (1 - out * 0.5)} />
      </g>
    </g>
  );
};

/** A deal on a row of the book: the row lights up, two rings open and a white label names it. */
export const Deal: React.FC<{ price: number; at: number; label?: string }> = ({ price, at, label }) => {
  const m = useRows();
  const t = useSeconds();
  if (t < at) return null;
  const y = rowY(m, price);
  const lit = 1 - prog(t, at, 0.6);
  const show = ease(prog(t, at + 0.04, 0.3)) * (1 - prog(t, at + 0.95, 0.3));
  return (
    <g>
      {lit > 0 && <rect x={RULER.x + RULER.w + 8} y={y - m.row / 2 + 3} width={860 - RULER.x - RULER.w - 8} height={m.row - 6} rx={18} fill={FG} opacity={lit * 0.16} />}
      <Pulse x={BOOK.x + BOOK.w - 10} y={y} at={at} size={84} />
      <Tag x={BOOK.x + BOOK.w / 2} y={y} w={244} h={50} size={21} tone="key" show={show}>{label ?? `TRATO · ${price} €`}</Tag>
    </g>
  );
};
