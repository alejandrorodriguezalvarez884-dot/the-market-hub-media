// Every year it falls 14 % on average from its high, and 35 of the last 46 years ended up
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, ease, prog } from "./look/libro";

// The S&P 500 each year from 1980 to 2025: [largest fall inside the year, from a closing high to a
// closing low; the year's result], in %, prices without dividends (data/, Yahoo Finance, own sums)
const YEARS: [number, number][] = [
  [-17.1, 25.8], [-18.4, -9.7], [-16.6, 14.8], [-6.9, 17.3], [-12.7, 1.4], [-7.7, 26.3], [-9.4, 14.6], [-33.5, 2.0], [-7.6, 12.4], [-7.6, 27.3],
  [-19.9, -6.6], [-5.6, 26.3], [-6.2, 4.5], [-5.0, 7.1], [-8.9, -1.5], [-2.5, 34.1], [-7.6, 20.3], [-10.8, 31.0], [-19.3, 26.7], [-12.1, 19.5],
  [-17.2, -10.1], [-29.7, -13.0], [-33.8, -23.4], [-14.1, 26.4], [-8.2, 9.0], [-7.2, 3.0], [-7.7, 13.6], [-10.1, 3.5], [-48.0, -38.5], [-27.6, 23.5],
  [-16.0, 12.8], [-19.4, -0.0], [-9.9, 13.4], [-5.8, 29.6], [-7.4, 11.4], [-12.4, -0.7], [-9.3, 9.5], [-2.8, 19.4], [-19.8, -6.2], [-6.8, 28.9],
  [-33.9, 16.3], [-5.2, 26.9], [-25.4, -19.4], [-10.3, 24.2], [-8.5, 23.3], [-18.9, 16.4],
];
const ZERO = 268, K = 4.1, X = (i: number) => 74 + i * 16.8;

export default () => {
  const t = useSeconds();
  const falls = useSay("cae"), mean = useSay("catorce"), ups = useSay("treinta");
  const line = ease(prog(t, mean - 0.2, 0.6));
  const counted = Math.round(35 * ease(prog(t, ups, 1.0)));
  return (
    <Board>
      <Head><h1 className="mid">Caer por el camino<br />también es <Hi say="aun">normal</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={520} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CADA AÑO, 1980 A 2025</text>
          <rect x={28} y={66} width={12} height={20} rx={3} fill={BUY} />
          <text x={50} y={84} fontSize={23} fontWeight={500} fill={DIM}>cómo acabó el año</text>
          <circle cx={292} cy={76} r={7} fill={SELL} />
          <text x={308} y={84} fontSize={23} fontWeight={500} fill={DIM}>su mayor caída por el camino</text>
          <line x1={66} x2={838} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          <text x={58} y={ZERO + 8} textAnchor="end" fontSize={23} fill={DIM}>0</text>
          {YEARS.map(([fall, result], i) => {
            const grow = ease(prog(t, 0.15 + i * 0.022, 0.45));
            const tone = prog(t, ups + i * 0.02, 0.3);
            const h = Math.abs(result) * K * grow;
            const drop = ease(prog(t, falls + i * 0.02, 0.5));
            const y = ZERO - fall * K * drop;
            return (
              <g key={i}>
                <rect x={X(i)} y={result >= 0 ? ZERO - h : ZERO} width={11} height={h} rx={3}
                  fill={tone > 0.5 ? (result > 0 ? BUY : SELL) : FG} opacity={tone > 0.5 ? 1 : 0.32} />
                {drop > 0 && <line x1={X(i) + 5.5} x2={X(i) + 5.5} y1={ZERO + 2} y2={y} stroke={SELL} strokeWidth={2} opacity={0.4} />}
                {drop > 0 && <circle cx={X(i) + 5.5} cy={y} r={5.5} fill={SELL} />}
              </g>
            );
          })}
          <line x1={66} x2={66 + 772 * line} y1={ZERO + 14.1 * K} y2={ZERO + 14.1 * K} stroke={FG} strokeWidth={2.5} strokeDasharray="10 8" />
          <text x={60} y={ZERO + 14.1 * K + 8} textAnchor="end" fontSize={21} fill={FG} opacity={line}>−14,1</text>
          {[1980, 1990, 2000, 2010, 2020].map((year) => (
            <text key={year} className="mono" x={X(year - 1980) + 5.5} y={496} textAnchor="middle" fontSize={21} fill={DIM} letterSpacing="0.06em">{year}</text>
          ))}
        </Svg>
        <Card say={mean} tone="sell" style={{ left: 0, top: 556, width: 418 }}>
          <span className="lab">Caída media en el año</span>
          <span className="num" style={{ fontSize: 84 }}>−14,1 %</span>
        </Card>
        <Card say={ups} tone="buy" style={{ left: 442, top: 556, width: 418 }}>
          <span className="lab">Años en positivo</span>
          <span className="num" style={{ fontSize: 84 }}>{counted} de 46</span>
        </Card>
      </Stage>
      <Src>S&amp;P 500, 1980-2025, sin dividendos: mayor caída entre cierres de cada año. Yahoo Finance, cálculo propio. Lo pasado no dice lo que vendrá.</Src>
    </Board>
  );
};
