// Whole years: the S&P 500's largest fall inside each year, from its high to its low, 1980 to 2025, and their mean (about 14 %)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { Board, Card, DIM, FG, FULL, Head, Hi, Panel, SELL, Src, Stage, Svg, ease, es, prog } from "./look/libro";

// [year, largest fall inside the year from a closing high to a closing low, the year's result], in %
const YEARS = figures.years as [number, number, number][];
const MEAN = figures.years_mean_fall;
const ZERO = 96, K = 10, STEP = 35.2, BW = 22;
const X = (i: number) => 104 + i * STEP;
const Y = (pct: number) => ZERO - pct * K;

export default () => {
  const t = useSeconds();
  const years = useSay("años"), mean = useSay("media");
  const line = ease(prog(t, mean, 0.7));
  return (
    <Board layout="full">
      <Head><h1>La mayor caída <Hi tone="sell" say="cada año">dentro de cada año</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Panel w={FULL.w} h={660} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">
            S&amp;P 500 · LA MAYOR CAÍDA DE CADA AÑO, DE SU MÁXIMO A SU MÍNIMO, EN % · {YEARS[0][0]} A {YEARS[YEARS.length - 1][0]}
          </text>
          <line x1={96} x2={FULL.w - 22} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          <text className="mono" x={84} y={ZERO + 7} textAnchor="end" fontSize={20} fill={DIM}>0</text>
          {[-20, -40].map((pct) => (
            <g key={pct}>
              <line x1={96} x2={FULL.w - 22} y1={Y(pct)} y2={Y(pct)} stroke="#fff" strokeOpacity={0.1} strokeWidth={1.5} />
              <text className="mono" x={84} y={Y(pct) + 7} textAnchor="end" fontSize={20} fill={DIM}>{es(pct)}</text>
            </g>
          ))}
          {YEARS.map(([year, fall], i) => {
            const g = ease(prog(t, years + i * 0.03, 0.5));
            return (
              <g key={year}>
                <rect x={X(i)} y={ZERO + 1} width={BW} height={Math.max(-fall * K * g, 0.01)} rx={5} fill={SELL} opacity={0.82} />
                {year % 5 === 0 && <text className="mono" x={X(i) + BW / 2} y={630} textAnchor="middle" fontSize={20} fill={DIM} letterSpacing="0.06em">{year}</text>}
              </g>
            );
          })}
          <line x1={96} x2={96 + (FULL.w - 118) * line} y1={Y(MEAN)} y2={Y(MEAN)} stroke={FG} strokeWidth={3} strokeDasharray="12 9" strokeLinecap="round" />
          <line x1={590} x2={590} y1={Y(MEAN) + 6} y2={330} stroke={FG} strokeOpacity={0.6 * ease(prog(t, mean + 0.5, 0.4))} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
        </Svg>
        <Card say="catorce" tone="key" style={{ left: 392, top: 330, width: 396 }}>
          <span className="lab">Media de los {YEARS.length} años</span>
          <span className="num" style={{ fontSize: 92 }}>{es(MEAN, 1)} %</span>
          <small>de su máximo a su mínimo del año</small>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Sin dividendos.</Src>
    </Board>
  );
};
