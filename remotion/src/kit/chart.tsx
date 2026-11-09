// A price line drawn from real data (Yahoo Finance, read into the folder's data/), drawn on when
// its cue is said. The figures are the data's; the drawing only scales them to the box.
import React from "react";
import { useDrawn } from "./motion";

export const Sparkline: React.FC<{
  values: number[];               // in order, oldest first
  after?: number[];               // what follows, drawn dashed and in another colour (premarket, today)
  say?: string | number;
  takes?: number;
  width?: number;
  height?: number;
  pad?: number;
  stroke?: string;
  afterStroke?: string;
  labels?: { left?: string; right?: string };
  className?: string;
  style?: React.CSSProperties;
}> = ({ values, after = [], say, takes = 1.4, width = 960, height = 240, pad = 14, stroke = "var(--ink-strong)", afterStroke = "var(--down)", labels, className, style }) => {
  const all = [...values, ...after];
  const low = Math.min(...all), high = Math.max(...all);
  const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(1, all.length - 1);
  const y = (v: number) => pad + ((high - v) / (high - low || 1)) * (height - pad * 2 - (labels ? 30 : 0));
  const path = (from: number, list: number[]) => list.map((v, k) => `${k ? "L" : "M"}${x(from + k).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const p = useDrawn(say, takes);
  const q = useDrawn(say, 0.5, 1, takes);
  const tail = after.length ? [values[values.length - 1], ...after] : [];
  return (
    <svg className={className} style={style} viewBox={`0 0 ${width} ${height}`} width="100%">
      <path d={path(0, values)} pathLength={1} fill="none" stroke={stroke} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray={1} strokeDashoffset={1 - p} />
      {tail.length > 0 && (
        <g opacity={q}>
          <path d={path(values.length - 1, tail)} fill="none" stroke={afterStroke} strokeWidth={5} strokeDasharray="10 10" />
          <circle cx={x(all.length - 1)} cy={y(all[all.length - 1])} r={13} fill="none" stroke={afterStroke} strokeWidth={5} />
        </g>
      )}
      {labels?.left && <text x={pad} y={height - 4} fontSize={26} fill="var(--muted)">{labels.left}</text>}
      {labels?.right && <text x={width - pad} y={height - 4} fontSize={26} fill="var(--muted)" textAnchor="end">{labels.right}</text>}
    </svg>
  );
};
