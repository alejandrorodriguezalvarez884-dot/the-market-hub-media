// History, not a promise: two bars, the S&P 500 at the end of 1999 and, lower, at the end of 2009; ten years without advancing
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, BG, Board, Card, DIM, FG, Head, Hi, Lead, Panel, SELL, Src, Stage, Svg, Tag, ease, es, prog } from "./look/libro";

const ENDS = figures.year_end as Record<string, number>;
const THEN = ENDS["1999"], LATER = ENDS["2009"];
const CHANGE = (LATER / THEN - 1) * 100;
const FOOT = 560, K = 0.3, BW = 240, X_THEN = 110, X_LATER = 510;
const top = (close: number) => FOOT - close * K;

export default () => {
  const t = useSeconds();
  const later = useSay("dos mil nueve"), then = useSay("mil novecientos noventa");
  const gLater = ease(prog(t, later, 0.7)), gThen = ease(prog(t, then, 0.7));
  const level = ease(prog(t, then + 0.55, 0.5)), gap = ease(prog(t, then + 0.9, 0.5));
  return (
    <Board lean={-0.5 * gap}>
      <Head>
        <h1>Historia,<br />no <Hi say="promesa">promesa</Hi></h1>
        <Lead say="mil novecientos noventa">Del final de 1999 al final de 2009, <b>el índice no subió</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <Panel h={650} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CIERRE DEL AÑO, EN PUNTOS</text>
          <line x1={60} x2={800} y1={FOOT} y2={FOOT} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          {gThen > 0 && (
            <g>
              <rect x={X_THEN} y={FOOT - THEN * K * gThen} width={BW} height={THEN * K * gThen} rx={14} fill={FG} fillOpacity={0.14} stroke={FG} strokeOpacity={0.7} strokeWidth={2} />
              <g opacity={ease(prog(t, then + 0.35, 0.4))}>
                <text x={X_THEN + BW / 2} y={top(THEN) + 66} textAnchor="middle" fontSize={50} fontWeight={700} fill={FG} letterSpacing="-0.03em">{es(THEN, 2)}</text>
                <text className="mono" x={X_THEN + BW / 2} y={FOOT + 44} textAnchor="middle" fontSize={22} fill={DIM} letterSpacing="0.1em">FIN DE 1999</text>
              </g>
            </g>
          )}
          {gLater > 0 && (
            <g>
              <rect x={X_LATER} y={FOOT - LATER * K * gLater} width={BW} height={LATER * K * gLater} rx={14} fill={ACC} />
              <g opacity={ease(prog(t, later + 0.35, 0.4))}>
                <text x={X_LATER + BW / 2} y={top(LATER) + 66} textAnchor="middle" fontSize={50} fontWeight={700} fill={BG} letterSpacing="-0.03em">{es(LATER, 2)}</text>
                <text className="mono" x={X_LATER + BW / 2} y={FOOT + 44} textAnchor="middle" fontSize={22} fill={DIM} letterSpacing="0.1em">FIN DE 2009</text>
              </g>
            </g>
          )}
          <line x1={X_THEN + BW} x2={X_THEN + BW + (X_LATER + BW + 24 - X_THEN - BW) * level} y1={top(THEN)} y2={top(THEN)} stroke={FG} strokeWidth={2.5} strokeDasharray="10 9" strokeLinecap="round" opacity={level > 0 ? 1 : 0} />
          <g opacity={gap}>
            <line x1={X_LATER + BW + 24} x2={X_LATER + BW + 24} y1={top(THEN)} y2={top(THEN) + (top(LATER) - top(THEN)) * gap} stroke={SELL} strokeWidth={4} strokeLinecap="round" />
            <path d={`M ${X_LATER + BW + 12} ${top(LATER) - 14} L ${X_LATER + BW + 24} ${top(LATER)} L ${X_LATER + BW + 36} ${top(LATER) - 14}`} fill="none" stroke={SELL} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Tag x={X_LATER + BW / 2} y={(top(THEN) + top(LATER)) / 2} w={212} h={58} size={27} tone="sell" show={gap}>{es(CHANGE, 1)} %</Tag>
        </Svg>
        <Card say="diez" tone="key" style={{ left: 0, top: 672, width: 860, height: 108, display: "flex", alignItems: "center", fontSize: 46 }}>
          <span>Diez años <b>sin avanzar</b></span>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Sin dividendos.</Src>
    </Board>
  );
};
