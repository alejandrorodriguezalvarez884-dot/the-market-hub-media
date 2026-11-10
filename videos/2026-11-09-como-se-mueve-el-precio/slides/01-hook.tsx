// The hook: every session's change of the S&P 500 since March 2025 as bars. Thursday's fall stands out, the worst since April 2025
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { Bars, Board, Card, DIM, FG, FULL, Head, Hi, Panel, SELL, Src, Stage, Svg, ease, es, prog } from "./look/libro";

const DAYS = figures.since_2025_03 as unknown as [string, number][];
const BOX = { x: 40, y: 64, w: 1660, h: 552 }, LO = -6.5, HI = 10;
const find = (date: string) => DAYS.findIndex(([d]) => d === date);
const THU = find("2026-11-05"), APR = [find("2025-04-03"), find("2025-04-04")], UP = find("2025-04-09");
const X = (i: number) => BOX.x + ((i + 0.5) * BOX.w) / DAYS.length;
const Y = (v: number) => BOX.y + ((HI - v) / (HI - LO)) * BOX.h;
const pct = (v: number) => `${v > 0 ? "+" : ""}${es(v, 2)} %`;

export default () => {
  const t = useSeconds();
  const four = useSay("cuatro"), april = useSay("abril");
  const thu = ease(prog(t, four, 0.5)), apr = ease(prog(t, april, 0.5));
  const lit = (i: number) => (i === THU ? thu : APR.includes(i) ? apr : 0);
  return (
    <Board layout="full" lean={-0.8 * thu}>
      <Head><h1>El jueves, el S&P 500 perdió un <Hi tone="sell" say="cuatro">{es(-DAYS[THU][1], 2)} %</Hi> en un día</h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Panel w={FULL.w} h={FULL.h} />
          <text className="mono" x={40} y={46} fontSize={21} fill={DIM} letterSpacing="0.14em">S&P 500 · LO QUE SE MOVIÓ CADA SESIÓN, EN % · DE MARZO DE 2025 AL 9 DE NOVIEMBRE DE 2026</text>
          <line x1={BOX.x} x2={BOX.x + BOX.w} y1={Y(0)} y2={Y(0)} stroke="#fff" strokeOpacity={0.3} strokeWidth={1.5} />
          {[-4, 4, 8].map((v) => (
            <g key={v}>
              <line x1={BOX.x} x2={BOX.x + BOX.w} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.07} strokeWidth={1.5} strokeDasharray="3 9" />
              <text className="mono" x={BOX.x + BOX.w} y={Y(v) - 8} textAnchor="end" fontSize={18} fill={DIM} opacity={0.7}>{v > 0 ? "+" : "−"}{Math.abs(v)} %</text>
            </g>
          ))}
          <Bars {...BOX} values={DAYS.map(([, v]) => v)} lo={LO} hi={HI} at={0.1} takes={1.3} gap={0.3} r={1.5} dim={(_, i) => 0.34 + 0.66 * lit(i)} />
          <g opacity={thu}>
            <line x1={X(THU)} x2={X(THU)} y1={Y(DAYS[THU][1]) + 10} y2={596} stroke={SELL} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
            <line x1={1642} x2={X(THU)} y1={596} y2={596} stroke={SELL} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
          </g>
          <g opacity={apr}>
            <line x1={X(APR[1])} x2={X(APR[1])} y1={Y(DAYS[APR[1]][1]) + 8} y2={632} stroke={SELL} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
            <line x1={X(APR[1])} x2={236} y1={632} y2={632} stroke={SELL} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
            <text className="mono" x={X(UP) + 14} y={Y(DAYS[UP][1]) + 22} fontSize={19} fill={DIM} letterSpacing="0.1em">9 ABR 2025 · {pct(DAYS[UP][1])}</text>
          </g>
          <circle cx={X(THU)} cy={Y(DAYS[THU][1]) + 2} r={7 * thu} fill={FG} />
        </Svg>
        <Card say={four} tone="sell" style={{ left: 1200, top: 508, width: 440, padding: "16px 26px" }}>
          <span className="lab">Jueves 5 de noviembre</span>
          <span className="num mid">{pct(DAYS[THU][1])}</span>
        </Card>
        <Card say={april} style={{ left: 240, top: 540, width: 590, padding: "16px 26px" }}>
          <span className="lab">Su peor día desde el 3 y el 4 de abril de 2025</span>
          <b style={{ fontSize: 54, letterSpacing: "-0.03em", lineHeight: 1 }}>{pct(DAYS[APR[0]][1])} y {pct(DAYS[APR[1]][1])}</b>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&P 500 (^GSPC) hasta el 9 de noviembre de 2026; la variación de cada día es una cuenta propia.</Src>
    </Board>
  );
};
