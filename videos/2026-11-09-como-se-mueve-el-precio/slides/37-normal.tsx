// Chapter 6 opens: how much movement is normal. Every close of the S&P 500 since 1950 as a mark, one column per year: more than 19,000 sessions
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Card, Chapter, DIM, FG, Src, Stage, Svg, ease, es, prog } from "./look/libro";

const YEARS = figures.by_year as unknown as [number, number, number][];
const SESSIONS = figures.sessions;
const STEP = 860 / YEARS.length, ROW = 2.1, BASE = 584;

export default () => {
  const t = useSeconds();
  const from = useSay("cierres"), since = useSay("mil novecientos"), total = useSay("diecinueve");
  const span = Math.max(total + 0.2 - from - 0.4, 0.5);
  const count = ease(prog(t, total, 0.7));
  return (
    <Chapter n={6} title={<>Cuánto es<br />normal</>}>
      <Stage>
        <Svg>
          <text className="mono" x={0} y={24} fontSize={21} fill={DIM} letterSpacing="0.14em" opacity={ease(prog(t, from, 0.5))}>CADA MARCA ES UN CIERRE · UNA COLUMNA POR AÑO</text>
          {YEARS.map(([year, , days], i) => {
            const at = from + (i / YEARS.length) * span;
            const g = ease(prog(t, at, 0.4));
            if (g <= 0) return null;
            const fresh = 1 - prog(t, at + 0.15, 0.5);
            const x = i * STEP + STEP / 2;
            return <line key={year} x1={x} x2={x} y1={BASE} y2={BASE - days * ROW * g} stroke={fresh > 0 ? ACC : FG} strokeOpacity={0.5 + 0.5 * fresh} strokeWidth={8} strokeDasharray="1.3 0.8" />;
          })}
          <text className="mono" x={0} y={616} fontSize={23} fill={FG} letterSpacing="0.1em" opacity={ease(prog(t, since, 0.5))}>{YEARS[0][0]}</text>
          <text className="mono" x={860} y={616} textAnchor="end" fontSize={23} fill={FG} letterSpacing="0.1em" opacity={ease(prog(t, from + span, 0.5))}>{YEARS[YEARS.length - 1][0]}</text>
        </Svg>
        <Card say={total} tone="key" style={{ left: 0, top: 632, width: 860 }}>
          <span className="lab">Cierres del {"S&P 500"} desde 1950</span>
          <span className="num" style={{ fontSize: 84 }}>{es(Math.round(SESSIONS * count))} <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.01em" }}>sesiones</span></span>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del {"S&P 500"} desde 1950; cuentas propias.</Src>
    </Chapter>
  );
};
