// Monday's rebound on the week's line of closes, and under it the same companies on Wednesday, Thursday and today: only the price differs
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { BUY, Board, DIM, FG, Firm, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog, trace, useIn } from "./look/libro";

const WEEK = figures.week as unknown as [string, number][];
const PCT = figures.week_pct as unknown as [string, number][];
const LETTER = ["D", "L", "M", "X", "J", "V", "S"];
const day = (date: string) => `${LETTER[new Date(`${date}T12:00:00Z`).getUTCDay()]} ${Number(date.slice(8))}`;
const X = (i: number) => 86 + i * 138;
const Y = (v: number) => 104 + ((7740 - v) / 440) * 236;
const PTS = WEEK.map(([, v], i) => [X(i), Y(v)] as const);
const pct = (v: number) => `${v > 0 ? "+" : ""}${es(v, 2)} %`;
const LAST = WEEK.length - 1;
// The three days the voice names, and where each stands in the week
const SAME: [string, number, string][] = [["MIÉRCOLES", 2, "miércoles"], ["JUEVES", 3, "jueves"], ["LUNES", LAST, "lunes#2"]];

export default () => {
  const t = useSeconds();
  const up = useSay("dos"), same = useSay("mismas");
  const cues = [useSay(SAME[0][2]), useSay(SAME[1][2]), useSay(SAME[2][2])];
  const drawn = ease(prog(t, 0.1, 1.5));
  const { line, tip } = trace(PTS, drawn);
  const mon = ease(prog(t, up, 0.5));
  const firms = useIn(same);
  return (
    <Board lean={0.7 * mon}>
      <Head><h1>Y el lunes<br />sube un <Hi tone="buy" say="dos">{es(PCT[LAST][1], 2)} %</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={430} />
          <text className="mono" x={30} y={46} fontSize={20} fill={DIM} letterSpacing="0.14em">S&P 500 · CIERRE DE CADA DÍA, DEL 2 AL 9 DE NOVIEMBRE</text>
          {WEEK.map(([date], i) => (
            <g key={date}>
              <line x1={X(i)} x2={X(i)} y1={84} y2={364} stroke="#fff" strokeOpacity={0.06} strokeWidth={1.5} />
              <text className="mono" x={X(i)} y={402} textAnchor="middle" fontSize={21} fill={i === LAST ? FG : DIM} letterSpacing="0.1em">{day(date)}</text>
            </g>
          ))}
          <polyline points={line} fill="none" stroke={FG} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.55)", 10)} />
          {PTS.map(([x, y], i) => (drawn * LAST >= i ? <circle key={i} cx={x} cy={y} r={7} fill={FG} /> : null))}
          <circle cx={tip[0]} cy={tip[1]} r={11} fill={FG} style={glow("rgba(255,255,255,0.8)", 12)} />
          <text className="mono" x={X(3)} y={Y(WEEK[3][1]) + 40} textAnchor="middle" fontSize={22} fill={SELL} letterSpacing="0.06em" opacity={clamp(drawn * LAST - 3)}>{pct(PCT[3][1])}</text>
          <Tag x={X(LAST) - 40} y={Y(WEEK[LAST][1]) - 44} w={190} h={50} size={23} tone="buy" show={mon}>{pct(PCT[LAST][1])}</Tag>

          <Tag x={430} y={478} w={470} h={52} size={21} show={firms}>LAS MISMAS 500 EMPRESAS</Tag>
          {SAME.map(([name, i], k) => {
            const x = 150 + k * 280;
            const there = ease(prog(t, same + 0.1 + k * 0.1, 0.5)), said = ease(prog(t, cues[k], 0.45));
            return (
              <g key={name}>
                <Firm x={x} y={648} s={150} opacity={clamp(there * 1.6) * (0.5 + 0.5 * said)} />
                <g opacity={said} transform={`translate(0, ${((1 - said) * 12).toFixed(2)})`}>
                  <text className="mono" x={x} y={692} textAnchor="middle" fontSize={21} fill={DIM} letterSpacing="0.14em">{name}</text>
                  <text x={x} y={744} textAnchor="middle" fontSize={44} fontWeight={700} fill={k === 1 ? SELL : k === 2 ? BUY : FG} letterSpacing="-0.02em">{es(WEEK[i][1], 2)}</text>
                </g>
              </g>
            );
          })}
        </Svg>
      </Stage>
      <Src>Yahoo Finance, cierres del S&P 500 (^GSPC) del 2 al 9 de noviembre de 2026; las variaciones son una cuenta propia.</Src>
    </Board>
  );
};
