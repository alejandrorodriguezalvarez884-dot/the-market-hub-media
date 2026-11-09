// How things come in when the voice gets to them. Every movement is worked out from the frame
// number, never played: the same scene always gives the same film. `say` is a cue (scene.tsx:
// a word of the narration, "word+0.3", "#2", or seconds).
import React from "react";
import { Easing } from "remotion";
import { useProgress, useSay, useSeconds } from "./scene";

const OUT = Easing.bezier(0.2, 0.8, 0.2, 1);       // the reels' "in"
const POP = Easing.bezier(0.3, 1.6, 0.5, 1);       // overshoots a little
const MARK = Easing.bezier(0.3, 0.8, 0.3, 1);
const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);    // CSS "ease"

export type How = "in" | "pop" | "fade" | "rise" | "left" | "none";

/** The style of something coming in, `p` from 0 (not yet) to 1 (in). */
export const entering = (how: How, p: number, tilt = 0): React.CSSProperties => {
  if (how === "none") return {};
  if (how === "fade") return { opacity: EASE(p) };
  if (how === "pop") {
    const e = POP(p);
    return { opacity: Math.min(1, p * 2.2), transform: `scale(${0.4 + 0.6 * e}) rotate(${tilt}deg)` };
  }
  const e = OUT(p);
  const far = how === "rise" ? 26 : 40;
  if (how === "left") return { opacity: e, transform: `translateX(${(1 - e) * -60}px) rotate(${tilt}deg)` };
  const turn = how === "rise" ? -1 * (1 - e) : 0;
  return { opacity: e, transform: `translateY(${(1 - e) * far}px) rotate(${turn + tilt}deg)` };
};

type RevealProps = {
  say?: string | number;
  how?: How;
  takes?: number;
  tilt?: number;                           // a sticker's turn, in degrees, kept once it is in
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Something that comes in when its cue is said: in (rises), pop, fade, rise (with a slight
 * turn, like a note pinned on), left (from the side). */
export const Reveal: React.FC<RevealProps> = ({ say, how = "in", takes, tilt = 0, as = "div", className, style, children }) => {
  const p = useProgress(say, takes ?? (how === "pop" ? 0.55 : 0.5));
  const Tag = as as React.ElementType;
  return <Tag className={className} style={{ ...style, ...entering(how, p, tilt) }}>{children}</Tag>;
};

/** A figure that counts up, written the Spanish way (28,6), from `from` to `to`. */
export const Count: React.FC<{
  to: number; from?: number; decimals?: number; prefix?: string; suffix?: string;
  say?: string | number; takes?: number; className?: string; style?: React.CSSProperties;
}> = ({ to, from = 0, decimals = 0, prefix = "", suffix = "", say, takes = 1.1, className, style }) => {
  const p = useProgress(say, takes);
  const value = from + (to - from) * (1 - Math.pow(1 - p, 3));
  const text = value.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: "always" as never });
  return <span className={className} style={style}>{prefix}{text}{suffix}</span>;
};

/** A highlighter run over words when their cue is said. `tone`: amber (what the scene is about),
 * or one of the three marks, ok (confirmed) and press (reported). */
export const Mark: React.FC<{ say?: string | number; tone?: "amber" | "ok" | "press"; takes?: number; className?: string; children: React.ReactNode }> = ({
  say, tone = "amber", takes = 0.45, className = "", children,
}) => {
  const p = MARK(useProgress(say, takes));
  if (tone === "amber") {
    return (
      <span className={`hl ${className}`} style={{
        backgroundImage: "linear-gradient(var(--amber), var(--amber))",
        backgroundSize: `${p * 100}% 84%`, color: p > 0.5 ? "var(--page)" : undefined,
      }}>{children}</span>
    );
  }
  return <span className={`hl ${tone} ${className}`} style={{ backgroundSize: `${p * 100}% 100%` }}>{children}</span>;
};

/** A bar that grows to `w` (0 to 100) when its cue is said. */
export const Bar: React.FC<{ w: number; say?: string | number; tone?: "g" | "r" | ""; takes?: number }> = ({ w, say, tone = "", takes = 0.9 }) => {
  const p = OUT(useProgress(say, takes));
  return <div className="bar"><i className={tone} style={{ width: `${w}%`, transform: `scaleX(${p})` }} /></div>;
};

/** Words typed one letter after another from their cue, over `takes` seconds. */
export const Type: React.FC<{ say?: string | number; takes?: number; children: string; className?: string }> = ({ say, takes = 0.8, children, className }) => {
  const p = useProgress(say, takes);
  const shown = Math.floor(children.length * p + 1e-6);
  return (
    <span className={className} style={{ position: "relative", whiteSpace: "pre-wrap" }}>
      <span>{children.slice(0, shown)}</span>
      <span style={{ visibility: "hidden" }}>{children.slice(shown)}</span>
    </span>
  );
};

/** How far a line drawing is drawn, from 0 to 1: for an SVG path with pathLength={1}, its
 * strokeDashoffset is 1 - this. The n-th line of a drawing starts `n * stagger` seconds later. */
export const useDrawn = (say: string | number | undefined, takes = 1.3, n = 0, stagger = 0.12): number => {
  const at = useSay(say) + n * stagger;
  const t = useSeconds();
  return Easing.bezier(0.4, 0, 0.2, 1)(Math.min(1, Math.max(0, (t - at) / takes)));
};

/** Something that shows only from its cue on (and, with `until`, until another). */
export const From: React.FC<{ say?: string | number; until?: string | number; children: React.ReactNode }> = ({ say, until, children }) => {
  const t = useSeconds();
  const at = useSay(say);
  const end = useSay(until ?? 1e9);
  return t >= at && t < end ? <>{children}</> : null;
};
