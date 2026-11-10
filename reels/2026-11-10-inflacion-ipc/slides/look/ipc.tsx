// Small pieces shared by the scenes of the inflation reel, in the light look of the Aprende reels.
import React from "react";
import { Easing } from "remotion";
import { useProgress } from "@mh/kit";

const OUT = Easing.bezier(0.2, 0.8, 0.2, 1);
/** Eased progress, 0 to 1, from a cue over `takes` seconds. */
export const useIn = (say: string | number | undefined, takes = 0.6) => OUT(useProgress(say, takes));

/** Written the Spanish way: 3,7 and a real minus sign. */
export const es = (n: number, decimals = 1) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace("-", "−");

/** A drawing inside a card: an SVG as wide as the card, in its own units. */
export const Drawing: React.FC<{ w?: number; h: number; children: React.ReactNode }> = ({ w = 788, h, children }) => (
  <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block", overflow: "visible", fontFamily: "var(--sans)" }}>{children}</svg>
);

/** One row of a card: what on the left (with a line under it), its figure on the right. */
export const Row: React.FC<{ name: React.ReactNode; small?: React.ReactNode; fig: React.ReactNode; tone?: "g" | "r" | "y" | "s" | "dim"; style?: React.CSSProperties }> = ({ name, small, fig, tone, style }) => (
  <div className="line" style={style}>
    <span className="name">{name}{small && <small>{small}</small>}</span>
    <span className={`fig${tone ? ` ${tone}` : ""}`}>{fig}</span>
  </div>
);
