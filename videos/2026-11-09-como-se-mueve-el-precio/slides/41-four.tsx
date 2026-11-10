// Every one-day fall of 4 % or more in the S&P 500 since 1950, on a timeline: 57 of them, less than one a year; Thursday's and the two before it are picked out
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, DIM, FG, FULL, Head, Hi, Panel, SELL, Src, Stage, Svg, clamp, ease, es, glow, prog } from "./look/libro";

const FALLS = figures.falls4 as [string, number][];
const LAST = FALLS[FALLS.length - 1], BEFORE = FALLS.slice(-3, -1);
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const day = (iso: string) => `${Number(iso.slice(8, 10))} ${MES[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const year = (iso: string) => Number(iso.slice(0, 4)) + (Number(iso.slice(5, 7)) - 1) / 12 + Number(iso.slice(8, 10)) / 365;
const FROM = 1950, TO = Number(LAST[0].slice(0, 4)) + 1;
const X = (y: number) => 96 + ((y - FROM) / (TO - FROM)) * 1580;
const ZERO = 92, K = 15.5;
const Y = (pct: number) => ZERO - pct * K;

export default () => {
  const t = useSeconds();
  const thursday = useSay("jueves"), sweep = useSay("cuatro por ciento"), count = useSay("cincuenta y siete"), before = useSay("anteriores");
  const span = Math.max(0.8, count - sweep - 0.1);
  const others = FALLS.length - 1;
  const seen = FALLS.map((_, i) => (i === others ? ease(prog(t, thursday, 0.5)) : ease(prog(t, sweep + (i / others) * span, 0.35))));
  const shown = seen.filter((p) => p > 0.5).length;
  const picked = ease(prog(t, before, 0.5));
  const xLast = X(year(LAST[0])), xBefore = X(year(BEFORE[0][0]));
  const deepest = Math.min(...BEFORE.map(([, pct]) => pct));
  return (
    <Board layout="full" lean={-0.4 * seen[others]}>
      <Head><h1>Caídas de un 4 % o más <Hi tone="sell" say="en un día">en un solo día</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Panel w={FULL.w} h={448} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CADA DÍA QUE CAYÓ UN 4 % O MÁS, DE {FROM} A {TO - 1}</text>
          <text className="mono" x={FULL.w - 28} y={46} textAnchor="end" fontSize={24} fill={FG} letterSpacing="0.14em" opacity={clamp(prog(t, sweep, 0.3))}>{shown} DÍAS</text>
          <line x1={96} x2={FULL.w - 44} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          <text className="mono" x={84} y={ZERO + 7} textAnchor="end" fontSize={20} fill={DIM}>0</text>
          {[-4, -10, -20].map((pct) => (
            <g key={pct}>
              <line x1={96} x2={FULL.w - 44} y1={Y(pct)} y2={Y(pct)} stroke="#fff" strokeOpacity={pct === -4 ? 0.3 : 0.1} strokeWidth={1.5} strokeDasharray={pct === -4 ? "3 9" : undefined} strokeLinecap="round" />
              <text className="mono" x={84} y={Y(pct) + 7} textAnchor="end" fontSize={20} fill={DIM}>{es(pct)} %</text>
            </g>
          ))}
          {Array.from({ length: Math.floor((TO - FROM) / 10) + 1 }, (_, i) => FROM + i * 10).map((y) => (
            <text key={y} className="mono" x={X(y)} y={432} textAnchor="middle" fontSize={20} fill={DIM} letterSpacing="0.06em">{y}</text>
          ))}
          {FALLS.map(([date, pct], i) => {
            const p = seen[i];
            if (p <= 0) return null;
            const x = X(year(date)), y = ZERO - pct * K * p;
            const last = i === others, lit = !last && i >= others - BEFORE.length && picked > 0.5;
            const c = lit ? ACC : SELL;
            return (
              <g key={date} opacity={last || lit ? 1 : 0.55} style={last || lit ? glow(last ? "rgba(255,107,97,0.7)" : "rgba(157,184,255,0.7)", 10) : undefined}>
                <line x1={x} x2={x} y1={ZERO + 2} y2={y} stroke={c} strokeWidth={last || lit ? 4 : 2.5} strokeLinecap="round" />
                <circle cx={x} cy={y} r={last || lit ? 6.5 : 4.5} fill={c} />
              </g>
            );
          })}
          <g opacity={picked}>
            <line x1={xBefore} x2={xBefore} y1={Y(deepest) + 14} y2={318} stroke={ACC} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
            <text className="mono" x={xBefore - 14} y={326} textAnchor="end" fontSize={22} fill={ACC} letterSpacing="0.1em">
              {BEFORE.map(([date]) => day(date).toUpperCase()).join(" Y ")}
            </text>
          </g>
          <g opacity={seen[others]}>
            <line x1={xLast} x2={xLast} y1={Y(LAST[1]) + 14} y2={368} stroke={SELL} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
            <text className="mono" x={xLast - 14} y={376} textAnchor="end" fontSize={22} fill={SELL} letterSpacing="0.1em">{day(LAST[0]).toUpperCase()} · {es(LAST[1], 2)} %</text>
          </g>
        </Svg>
        <Card say="cincuenta y siete" tone="key" style={{ left: 0, top: 474, width: 520, height: 204 }}>
          <span className="lab">Desde {FROM}</span>
          <span className="num" style={{ fontSize: 100 }}>{FALLS.length}</span>
          <small>sesiones con una caída del 4 % o más</small>
        </Card>
        <Card say="menos de una" style={{ left: 548, top: 474, width: 520, height: 204 }}>
          <span className="lab">En {TO - FROM} años</span>
          <b style={{ display: "block", fontSize: 58, lineHeight: 1.06, letterSpacing: "-0.02em", marginTop: 14 }}>Menos de<br />una al año</b>
        </Card>
        <Card say="anteriores" style={{ left: 1096, top: 474, width: 644, height: 204 }}>
          <span className="lab">Las dos anteriores</span>
          {BEFORE.map(([date, pct]) => (
            <div key={date} className="line" style={{ fontSize: 38, padding: "12px 0" }}><span>{day(date)}</span><b>{es(pct, 2)} %</b></div>
          ))}
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias.</Src>
    </Board>
  );
};
