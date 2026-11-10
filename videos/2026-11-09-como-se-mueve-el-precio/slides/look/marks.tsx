// Two marks the last chapter needs beside the look's own: a casino chip and a share, as a sheet of paper
import React from "react";
import { FG, GLASS } from "./libro";

/** A casino chip, its middle at (x, y); what goes in its middle is the children. */
export const Chip: React.FC<{ x: number; y: number; r?: number; color?: string; opacity?: number; children?: React.ReactNode }> = ({ x, y, r = 140, color = FG, opacity = 1, children }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <g fill="none" stroke={color}>
      <circle r={r} fill={GLASS} strokeWidth={Math.max(3, r * 0.035)} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} x2={0} y1={-r * 0.97} y2={-r * 0.8} strokeWidth={r * 0.17} transform={`rotate(${i * 45})`} />)}
      <circle r={r * 0.68} strokeWidth={Math.max(2, r * 0.022)} strokeDasharray={`${(r * 0.03).toFixed(1)} ${(r * 0.09).toFixed(1)}`} strokeLinecap="round" />
    </g>
    {children}
  </g>
);

/** A share, as a sheet with a folded corner, its middle at (x, y). */
export const Paper: React.FC<{ x: number; y: number; w?: number; color?: string; opacity?: number }> = ({ x, y, w = 110, color = FG, opacity = 1 }) => {
  const h = w * 1.28, f = w * 0.26;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`} opacity={opacity} fill="none" stroke={color} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round">
      <path d={`M 0 0 H ${w - f} L ${w} ${f} V ${h} H 0 Z`} fill={color} fillOpacity={0.08} />
      <path d={`M ${w - f} 0 V ${f} H ${w}`} />
      <path d={`M ${w * 0.2} ${h * 0.46} H ${w * 0.8} M ${w * 0.2} ${h * 0.62} H ${w * 0.8} M ${w * 0.2} ${h * 0.78} H ${w * 0.56}`} />
    </g>
  );
};
