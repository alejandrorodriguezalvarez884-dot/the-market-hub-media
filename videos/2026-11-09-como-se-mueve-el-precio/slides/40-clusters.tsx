// Strong days come together: every session of the autumn of 2008, with 13 October (+11.58 %) and, two days later, 15 October (−9.03 %)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { BUY, Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, ease, es, glow, prog } from "./look/libro";

const DAYS = figures.oct_2008 as unknown as [string, number][];
const UP = DAYS.findIndex((d) => d[0] === "2008-10-13"), DOWN = DAYS.findIndex((d) => d[0] === "2008-10-15");
const STRONG = DAYS.filter((d) => Math.abs(d[1]) >= 1).length;
const MONTHS: [string, number][] = [["SEP", 0], ["OCT", DAYS.findIndex((d) => d[0] >= "2008-10-01")], ["NOV", DAYS.findIndex((d) => d[0] >= "2008-11-01")]];
const X0 = 84, STEP = 13.8, BW = 9.6, ZERO = 350, PX = 18;
const mid = (i: number) => X0 + i * STEP + BW / 2;
const signed = (v: number) => `${v > 0 ? "+" : ""}${es(v, 2)} %`;

export default () => {
  const t = useSeconds();
  const day = useSay("trece"), rose = useSay("once"), after = useSay("dos días"), fell = useSay("nueve") - 0.4;
  const lit = [ease(prog(t, day, 0.5)), ease(prog(t, after, 0.5))];
  const up = ease(prog(t, rose, 0.5)), down = ease(prog(t, fell, 0.5));
  return (
    <Board layout="flip">
      <Head><h1 className="mid">Los días fuertes<br />vienen <Hi say="juntos">juntos</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={650} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">{"S&P 500"} · SESIÓN A SESIÓN, OTOÑO DE 2008</text>
          {[-10, -5, 5, 10].map((v) => (
            <g key={v}>
              <line x1={X0 - 6} x2={836} y1={ZERO - v * PX} y2={ZERO - v * PX} stroke="#fff" strokeOpacity={0.09} strokeWidth={1.5} />
              {Math.abs(v) === 10 && <text className="mono" x={X0 - 12} y={ZERO - v * PX + 6} textAnchor="end" fontSize={18} fill={DIM}>{v > 0 ? "+" : "−"}10 %</text>}
            </g>
          ))}
          {DAYS.map(([date, pct], i) => {
            const g = ease(prog(t, 0.15 + i * 0.02, 0.45));
            const on = i === UP ? lit[0] : i === DOWN ? lit[1] : 0;
            const size = Math.abs(pct) * PX * g;
            const strong = Math.abs(pct) >= 1;
            return (
              <rect key={date} x={X0 + i * STEP} y={pct > 0 ? ZERO - size : ZERO} width={BW} height={Math.max(size, 0.01)} rx={3}
                fill={strong ? (pct > 0 ? BUY : SELL) : DIM} opacity={0.45 + 0.55 * on}
                style={on > 0 ? glow(pct > 0 ? `rgba(52,227,161,${(0.6 * on).toFixed(3)})` : `rgba(255,107,97,${(0.6 * on).toFixed(3)})`, 14) : undefined} />
            );
          })}
          <line x1={X0 - 6} x2={836} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} />
          {MONTHS.map(([name, i]) => (
            <g key={name}>
              <line x1={X0 + i * STEP - 2.1} x2={X0 + i * STEP - 2.1} y1={596} y2={632} stroke="#fff" strokeOpacity={0.25} strokeWidth={1.5} />
              <text className="mono" x={X0 + i * STEP + 8} y={626} fontSize={19} fill={DIM} letterSpacing="0.14em">{name}</text>
            </g>
          ))}
          <text className="mono" x={mid(UP)} y={84} textAnchor="middle" fontSize={21} fill={FG} letterSpacing="0.14em" opacity={lit[0]}>13 OCT</text>
          <text x={mid(UP)} y={126} textAnchor="middle" fontSize={40} fontWeight={700} fill={BUY} letterSpacing="-0.02em" opacity={up}>{signed(DAYS[UP][1])}</text>
          <text x={mid(DOWN)} y={556} textAnchor="middle" fontSize={40} fontWeight={700} fill={SELL} letterSpacing="-0.02em" opacity={down}>{signed(DAYS[DOWN][1])}</text>
          <text className="mono" x={mid(DOWN)} y={586} textAnchor="middle" fontSize={21} fill={FG} letterSpacing="0.14em" opacity={lit[1]}>15 OCT</text>
        </Svg>
        <Card say="juntos" style={{ left: 0, top: 668, width: 860 }}>
          <b>{STRONG} de {DAYS.length}</b> sesiones con ±1 % o más
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del {"S&P 500"} desde 1950; cuentas propias. Sesiones del 15 de septiembre al 28 de noviembre de 2008.</Src>
    </Board>
  );
};
