// The average misleads: days of 1 % or more in each year since 1950. Three in all of 1964, 134 in 2008, more than half of that year's sessions
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, DIM, FG, FULL, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, es, glow, prog } from "./look/libro";

const YEARS = figures.by_year as unknown as [number, number, number][];
const MEAN = YEARS.reduce((sum, y) => sum + y[1], 0) / YEARS.length;
const CALM = YEARS.findIndex((y) => y[0] === 1964), WILD = YEARS.findIndex((y) => y[0] === 2008);
const X0 = 90, STEP = 20.9, BW = 14, BASE = 590, PX = 3.4;
const Y = (v: number) => BASE - v * PX;
const mid = (i: number) => X0 + i * STEP + BW / 2;

export default () => {
  const t = useSeconds();
  const mean = useSay("media"), calm = useSay("sesenta"), three = useSay("tres"), wild = useSay("dos mil ocho"), many = useSay("ciento"), half = useSay("mitad");
  const line = ease(prog(t, mean, 0.8));
  const lit = [ease(prog(t, calm, 0.5)), ease(prog(t, wild, 0.5))];
  const count = Math.round(YEARS[WILD][1] * ease(prog(t, many, 0.7)));
  return (
    <Board layout="full">
      <Head><h1>La <Hi say="media">media engaña</Hi>: cada año es distinto</h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Panel w={FULL.w} h={FULL.h} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">DÍAS CON ±1 % O MÁS, AÑO A AÑO · {"S&P 500"}</text>
          <g opacity={line}>
            <line x1={1296} x2={1352} y1={39} y2={39} stroke={ACC} strokeWidth={3} strokeDasharray="4 9" strokeLinecap="round" />
            <text className="mono" x={1712} y={46} textAnchor="end" fontSize={21} fill={ACC} letterSpacing="0.14em">MEDIA: {es(MEAN)} DÍAS AL AÑO</text>
          </g>
          <line x1={X0 - 14} x2={1712} y1={Y(100)} y2={Y(100)} stroke="#fff" strokeOpacity={0.09} strokeWidth={1.5} />
          <text className="mono" x={X0 - 22} y={Y(100) + 7} textAnchor="end" fontSize={19} fill={DIM}>100</text>
          <text className="mono" x={X0 - 22} y={BASE + 7} textAnchor="end" fontSize={19} fill={DIM}>0</text>
          {YEARS.map(([year, days], i) => {
            const g = ease(prog(t, 0.15 + i * 0.012, 0.45));
            const on = i === CALM ? lit[0] : i === WILD ? lit[1] : 0;
            return (
              <g key={year}>
                <rect x={X0 + i * STEP} y={Y(days * g)} width={BW} height={Math.max(days * g * PX, 0.01)} rx={3} fill={FG} opacity={0.3} />
                {on > 0 && <rect x={X0 + i * STEP} y={Y(days)} width={BW} height={days * PX} rx={3} fill={ACC} opacity={on} style={glow("rgba(157,184,255,0.6)", 14)} />}
                {(year % 10 === 0 || i === YEARS.length - 1) && <text className="mono" x={mid(i)} y={BASE + 36} textAnchor="middle" fontSize={19} fill={DIM}>{year}</text>}
              </g>
            );
          })}
          <line x1={X0 - 14} x2={1712} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} />
          <line x1={X0 - 14} x2={X0 - 14 + (1712 - X0 + 14) * line} y1={Y(MEAN)} y2={Y(MEAN)} stroke={ACC} strokeOpacity={0.9} strokeWidth={2.5} strokeDasharray="4 9" strokeLinecap="round" />
          {lit[0] > 0 && <line x1={mid(CALM)} x2={mid(CALM)} y1={Y(YEARS[CALM][1]) - 10} y2={Y(YEARS[CALM][1]) - 10 - (Y(YEARS[CALM][1]) - 10 - 284) * lit[0]} stroke={FG} strokeOpacity={0.7} strokeWidth={2.5} strokeDasharray="2 8" strokeLinecap="round" />}
          <Tag x={mid(CALM)} y={250} w={300} h={60} size={25} tone="key" show={lit[0]}>{t < three ? "1964" : `1964 · ${YEARS[CALM][1]} DÍAS`}</Tag>
          <Tag x={mid(WILD)} y={96} w={320} h={60} size={25} tone="key" show={lit[1]}>{t < many ? "2008" : `2008 · ${count} DÍAS`}</Tag>
          <Tag x={805} y={96} w={640} h={60} size={22} show={ease(prog(t, half, 0.5))}>{YEARS[WILD][1]} DE {YEARS[WILD][2]} SESIONES: MÁS DE LA MITAD</Tag>
        </Svg>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del {"S&P 500"} desde 1950; cuentas propias. El año 2026, hasta el 9 de noviembre.</Src>
    </Board>
  );
};
