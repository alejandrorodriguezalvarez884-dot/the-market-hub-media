// The Jensen Huang reel's sheet, drawn with Remotion: what reels/2026-11-09-jensen-huang/slides/
// storyboard.js added to each HTML page, as components. A scene is
//
//   <Sheet n={3} marks={["press", "ok"]} step={[1]}> ...the panel... </Sheet>
//
// and inside the panel: <Slug>, <h1>, <Note say mark="ok|press">, <Pencil say>, <PenNote say>,
// <Drawing kind say ink="ok|pencil">, <Letter>, ... Everything that comes in does so when the
// voice says its cue (@mh/kit: useSay), and moves from the frame, never from CSS.
import React from "react";
import { Easing } from "remotion";
import { later, Reveal, Type, useDrawn, useFilmSeconds, useProgress, useScene, useSeconds } from "@mh/kit";
import "./storyboard.css";

const CASE = "El caso Jensen Huang";
const SHEETS = 10;
const DATES = ["Antes", "Primavera\n2026", "29 oct", "6 nov", "8 nov", "Hoy\n9 nov", "17-18\nnov"];
type MarkKind = "ok" | "press" | "maybe";

/** The hand-drawn wobble, for borders and drawings (filter: url(#rough)). */
const Rough = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} seed={7} />
      <feDisplacementMap in="SourceGraphic" scale={5} />
    </filter>
  </svg>
);

export const Sheet: React.FC<{ n: number; marks?: MarkKind[]; step?: number[]; children: React.ReactNode }> = ({ n, marks = [], step = [], children }) => {
  const t = useSeconds();
  const { total } = useScene();
  const film = useFilmSeconds();
  const drift = ((t % 40) / 40) * 60;   // the drafting grid drifts 60 px every 40 s
  const last = step.length ? Math.max(...step) : 0;
  return (
    <div className="sb">
      <Rough />
      <div className="paper"><div className="grid" style={{ transform: `translate(${drift}px, ${drift}px)` }} /></div>
      <main className="stage">{children}</main>
      <header className="sheet">
        <div className="row"><span>Storyboard</span><span className="case">{CASE}</span><span className="no">Hoja {String(n).padStart(2, "0")} / {SHEETS}</span></div>
        <div className="line"><i style={{ width: `${total ? Math.min(100, (film / total) * 100) : 0}%` }} /></div>
      </header>
      <div className="key">
        {([["ok", "Confirmado"], ["press", "Según la prensa"], ["maybe", "A lápiz: hipótesis"]] as const).map(([kind, label]) => (
          <span key={kind} className={`${kind}${marks.length && !marks.includes(kind) ? " dim" : ""}`}>{label}</span>
        ))}
      </div>
      <div className="film"><div className="frames">
        {DATES.map((label, i) => (
          <div key={label} className={`f${step.includes(i + 1) ? " now" : i + 1 < last ? " past" : ""}`} style={{ whiteSpace: "pre-line" }}>{label}</div>
        ))}
      </div></div>
    </div>
  );
};

export const Slug: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="slug">{children}</p>;

/** A highlighter stroke: green for confirmed, yellow for the press. Run on as its cue is said. */
export const Hl: React.FC<{ say?: string | number; mark: "ok" | "press"; children: React.ReactNode }> = ({ say, mark, children }) => {
  const p = Easing.bezier(0.4, 0, 0.2, 1)(useProgress(later(say, 0.05), 0.45));
  return <span className={`hl ${mark}`} style={{ backgroundSize: `${p * 100}% 100%` }}>{children}</span>;
};

/** A handwritten note with its mark, and its source under it. */
export const Note: React.FC<{ say?: string | number; mark?: "ok" | "press"; small?: boolean; src?: string; children: React.ReactNode }> = ({ say, mark, small, src, children }) => (
  <Reveal as="p" say={say} how="rise" className={`hand${small ? " small" : ""}`}>
    {mark ? <Hl say={say} mark={mark}>{children}</Hl> : children}
    {src && <span className="src">{src}</span>}
  </Reveal>
);

/** A hypothesis, in pencil in a dashed frame. */
export const Pencil: React.FC<{ say?: string | number; label: string; small?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({ say, label, small, style, children }) => (
  <Reveal say={say} how="rise" className={`pencil hand${small ? " small" : ""}`} style={style}>
    <span className="label">{label}</span><br />{children}
  </Reveal>
);

/** The director's note, in red pen, slanted, circled. */
export const PenNote: React.FC<{ say?: string | number; children: React.ReactNode }> = ({ say, children }) => {
  const p = useProgress(later(say, 0.1), 0.45);
  const e = Easing.bezier(0.2, 0.9, 0.3, 1.2)(p);
  return <span className="pen-note free" style={{ opacity: Math.min(1, e), transform: `rotate(-6deg) scale(${1.6 - 0.6 * e})` }}>{children}</span>;
};

const DRAWINGS: Record<string, string[]> = {
  building: ["M22 108V40l34-14v82", "M56 108V30h42v78", "M8 108h112", "M66 44h8M84 44h8M66 60h8M84 60h8M66 76h8M84 76h8M32 54h12M32 70h12M32 86h12"],
  chip: ["M40 34h48a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6z", "M53 50h22a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H53a3 3 0 0 1-3-3V53a3 3 0 0 1 3-3z", "M48 34V20M64 34V20M80 34V20M48 108V94M64 108V94M80 108V94M34 48H20M34 64H20M34 80H20M108 48H94M108 64H94M108 80H94"],
  doc: ["M30 14h48l20 20v80H30z", "M78 14v20h20", "M42 50h44M42 64h44M42 78h30M42 92h40"],
  news: ["M18 24h80a4 4 0 0 1 4 4v72a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V28a4 4 0 0 1 4-4z", "M102 40h12v56a8 8 0 0 1-16 0", "M26 38h64M26 54h28M26 68h28M26 82h28", "M64 54h26v28H64z"],
  mail: ["M20 30h88a6 6 0 0 1 6 6v56a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z", "M14 36l50 36 50-36"],
  board: ["M64 14l50 22H14z", "M24 42v48M46 42v48M82 42v48M104 42v48", "M14 96h100M8 110h112"],
  question: ["M64 16a48 48 0 1 1 0 96a48 48 0 1 1 0-96z", "M48 50a16 16 0 1 1 24 14c-6 4-8 7-8 14M64 92v2"],
  calendar: ["M22 26h84a6 6 0 0 1 6 6v72a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6z", "M16 50h96M42 16v18M86 16v18", "M36 70h12M58 70h12M80 70h12M36 90h12M58 90h12"],
  capitol: ["M64 10v12M40 54a24 24 0 0 1 48 0M30 54h68", "M36 54v40M50 54v40M64 54v40M78 54v40M92 54v40", "M22 100h84M14 112h100"],
};

const Line: React.FC<{ d: string; n: number; say?: string | number; pencil: boolean }> = ({ d, n, say, pencil }) => {
  const drawn = useDrawn(say, 1.3, n);
  const faded = useProgress(say, 0.8);
  return pencil
    ? <path d={d} pathLength={1} style={{ opacity: Easing.bezier(0.25, 0.1, 0.25, 1)(faded) }} />
    : <path d={d} pathLength={1} style={{ strokeDashoffset: 1 - drawn }} />;
};

/** A line drawing made here, drawn on when its cue is said: in ink, green ink (confirmed) or pencil. */
export const Drawing: React.FC<{ kind: keyof typeof DRAWINGS; say?: string | number; ink?: "ok" | "pencil"; small?: boolean }> = ({ kind, say, ink, small }) => (
  <span className={`draw${small ? " small" : ""}${ink === "ok" ? " ok-ink" : ink === "pencil" ? " pencil-ink" : ""}`}>
    <svg viewBox="0 0 128 128">{DRAWINGS[kind].map((d, n) => <Line key={n} d={d} n={n} say={say} pencil={ink === "pencil"} />)}</svg>
  </span>
);

/** Words typed out, as on a typewriter, from their cue. */
export const Typed: React.FC<{ say?: string | number; takes?: number; children: string }> = ({ say, takes = 0.8, children }) => (
  <Type say={say} takes={takes}>{children}</Type>
);
