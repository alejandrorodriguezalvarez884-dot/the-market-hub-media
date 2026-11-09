// The three marks that keep apart what is known from what is said and what is only thought (the
// Jensen Huang reel's code, 2026-11-09): what a company or a person confirms is underlined in
// green; what the press reports is highlighted in yellow; a hypothesis is written in pencil, grey
// and dashed, and never in green or yellow. Each mark carries its source under it.
import React from "react";
import { Mark, Reveal } from "./motion";
import { later } from "./scene";

type Said = { say?: string | number; src?: React.ReactNode; className?: string; children: React.ReactNode };

/** Confirmed by the company or the person: their statement, filing or email. */
export const Confirmed: React.FC<Said> = ({ say, src, className = "", children }) => (
  <Reveal say={say} className={className}><Mark say={later(say, 0.05)} tone="ok">{children}</Mark>{src && <span className="src">{src}</span>}</Reveal>
);

/** Reported by the press, not confirmed. */
export const Reported: React.FC<Said> = ({ say, src, className = "", children }) => (
  <Reveal say={say} className={className}><Mark say={later(say, 0.05)} tone="press">{children}</Mark>{src && <span className="src">{src}</span>}</Reveal>
);

/** A hypothesis: not a fact, and drawn so it cannot be taken for one. */
export const Hypothesis: React.FC<Said & { label?: string }> = ({ say, src, label = "Hipótesis", className = "", children }) => (
  <Reveal say={say} how="fade" className={`maybe ${className}`}>
    <span className="label">{label}</span>
    <div>{children}</div>
    {src && <span className="src">{src}</span>}
  </Reveal>
);

/** The key to the three marks; those the scene does not use are dimmed. */
export const MarksKey: React.FC<{ use?: ("ok" | "press" | "maybe")[]; labels?: [string, string, string]; style?: React.CSSProperties }> = ({
  use = ["ok", "press", "maybe"], labels = ["Confirmado", "Según la prensa", "Hipótesis"], style,
}) => (
  <div className="key" style={style}>
    {(["ok", "press", "maybe"] as const).map((kind, i) => (
      <span key={kind} className={`${kind} ${kind === "maybe" ? "" : "hl"} ${use.includes(kind) ? "" : "off"}`} style={kind === "maybe" ? { padding: "0 12px" } : undefined}>{labels[i]}</span>
    ))}
  </div>
);
