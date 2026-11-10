// The worst session since 1950: 19 October 1987, when the S&P 500 lost more than 20 % in a day, among that month's daily moves
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { Board, Card, DIM, FG, Head, Hi, Lead, Panel, SELL, Src, Stage, Svg, ease, es, glow, prog } from "./look/libro";

const DAYS = figures.oct_1987 as [string, number][];
const WORST = DAYS.reduce((worst, d) => (d[1] < worst[1] ? d : worst));
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const short = (iso: string) => `${Number(iso.slice(8, 10))} ${MES[Number(iso.slice(5, 7)) - 1]}`;
const day = (iso: string) => `${short(iso)} ${iso.slice(0, 4)}`;
const BOX = { x: 84, y: 84, w: 748, h: 328 }, HI = 10, LO = -22;
const STEP = BOX.w / DAYS.length, BW = STEP * 0.7;
const Y = (v: number) => BOX.y + ((HI - v) / (HI - LO)) * BOX.h;

export default () => {
  const t = useSeconds();
  const the19 = useSay("diecinueve"), month = useSay("octubre");
  const named = ease(prog(t, month, 0.5));
  return (
    <Board lean={-0.8 * ease(prog(t, the19, 0.8))}>
      <Head>
        <h1>La peor sesión<br />desde <Hi tone="sell">1950</Hi></h1>
        <Lead say="diecinueve">El <b>{day(WORST[0]).replace(" oct ", " de octubre de ")}</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <Panel h={470} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CADA SESIÓN DE AQUEL MES, EN %</text>
          {[0, -10, -20].map((v) => (
            <g key={v}>
              <line x1={BOX.x - 8} x2={BOX.x + BOX.w} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={v === 0 ? 0.45 : 0.12} strokeWidth={v === 0 ? 2 : 1.5} strokeLinecap="round" />
              <text className="mono" x={BOX.x - 18} y={Y(v) + 7} textAnchor="end" fontSize={20} fill={DIM}>{es(v)}</text>
            </g>
          ))}
          {DAYS.map(([date, pct], i) => {
            const worst = date === WORST[0];
            const g = worst ? ease(prog(t, the19, 0.7)) : ease(prog(t, 0.15 + i * 0.035, 0.45));
            const y = Y(pct * g), top = Math.min(Y(0), y);
            return (
              <rect key={date} x={BOX.x + i * STEP + (STEP - BW) / 2} y={top} width={BW} height={Math.max(Math.abs(y - Y(0)), 0.01)} rx={4}
                fill={worst ? SELL : FG} opacity={worst ? 1 : 0.26} style={worst && g > 0 ? glow("rgba(255,107,97,0.55)", 16) : undefined} />
            );
          })}
          <text className="mono" x={BOX.x} y={448} fontSize={20} fill={DIM} letterSpacing="0.08em" opacity={named}>{short(DAYS[0][0]).toUpperCase()}</text>
          <text className="mono" x={BOX.x + BOX.w} y={448} textAnchor="end" fontSize={20} fill={DIM} letterSpacing="0.08em" opacity={named}>{short(DAYS[DAYS.length - 1][0]).toUpperCase()}</text>
          <text className="mono" x={BOX.x + (DAYS.indexOf(WORST) + 0.5) * STEP} y={448} textAnchor="middle" fontSize={22} fill={SELL} letterSpacing="0.1em" opacity={ease(prog(t, the19 + 0.3, 0.5))}>
            {short(WORST[0]).toUpperCase()}
          </text>
        </Svg>
        <Card say="veinte" tone="sell" style={{ left: 0, top: 500, width: 860 }}>
          <span className="lab">S&amp;P 500 · {day(WORST[0])}</span>
          <span className="num" style={{ fontSize: 150 }}>{es(WORST[1], 2)} %</span>
          <small style={{ fontSize: 28 }}>en una sola sesión</small>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Federal Reserve History, «Stock Market Crash of 1987».</Src>
    </Board>
  );
};
