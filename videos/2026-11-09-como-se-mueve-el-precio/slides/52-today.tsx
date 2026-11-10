// Back to Monday: the week's closes of the S&P 500 as a small board, Monday's close large, above Friday's and still below Wednesday's
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { BUY, Board, Card, DIM, FG, Head, Hi, Lead, Panel, SELL, SOFT, Src, Stage, Svg, Tag, ease, es, glow, prog, trace } from "./look/libro";

const WEEK = figures.week as [string, number][];
const PCT = figures.week_pct as [string, number][];
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], DIA_LARGO = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const dom = (iso: string) => Number(iso.slice(8, 10));
const TODAY = WEEK.length - 1, BEFORE = TODAY - 1;
// The highest close of the week before today's (Wednesday's)
const HIGH = WEEK.slice(0, TODAY).reduce((best, d, i, all) => (d[1] > all[best][1] ? i : best), 0);
const X = (i: number) => 70 + i * 116;
const Y = (close: number) => 356 + (7720 - close) * 0.82;
const PTS = WEEK.map(([, close], i) => [X(i), Y(close)] as const);
const BRACKET = 694, TAGS = 778;
const READ = figures.read.sp500_market_time_madrid;

export default () => {
  const t = useSeconds();
  const monday = useSay("lunes"), friday = useSay("viernes"), wednesday = useSay("debajo");
  const drawn = trace(PTS, ease(prog(t, monday + 0.1, 1.1)));
  const here = ease(prog(t, monday + 1.0, 0.5));
  const vsFriday = ease(prog(t, friday, 0.5)), vsHigh = ease(prog(t, wednesday, 0.45));
  const yToday = PTS[TODAY][1], yBefore = PTS[BEFORE][1], yHigh = PTS[HIGH][1];
  const [date, close] = WEEK[TODAY];
  return (
    <Board layout="flip">
      <Head>
        <h1>Vuelve al<br /><Hi say="lunes">lunes</Hi></h1>
        <Lead say="cerrado">El cierre del S&amp;P 500, <b>dentro de su semana</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <Panel y={246} h={534} />
          <text className="mono" x={22} y={290} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CIERRES DE LA SEMANA</text>
          {WEEK.map(([d], i) => (
            <text key={d} className="mono" x={X(i)} y={748} textAnchor="middle" fontSize={20} fill={i === TODAY ? FG : DIM} letterSpacing="0.08em">
              {DIA[weekday(d)].toUpperCase()} {dom(d)}
            </text>
          ))}
          <g opacity={vsFriday}>
            <line x1={X(BEFORE)} x2={BRACKET} y1={yBefore} y2={yBefore} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
            <line x1={X(TODAY)} x2={BRACKET} y1={yToday} y2={yToday} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
            <line x1={BRACKET} x2={BRACKET} y1={yBefore} y2={yBefore + (yToday + 5 - yBefore) * vsFriday} stroke={BUY} strokeWidth={4} strokeLinecap="round" />
            <text className="mono" x={X(BEFORE)} y={yBefore + 42} textAnchor="middle" fontSize={22} fill={SOFT}>{es(WEEK[BEFORE][1], 2)}</text>
          </g>
          <g opacity={vsHigh}>
            <line x1={X(HIGH)} x2={BRACKET} y1={yHigh} y2={yHigh} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
            <line x1={BRACKET} x2={BRACKET} y1={yHigh} y2={yHigh + (yToday - 5 - yHigh) * vsHigh} stroke={SELL} strokeWidth={4} strokeLinecap="round" />
            <text className="mono" x={X(HIGH)} y={yHigh - 24} textAnchor="middle" fontSize={22} fill={SOFT}>{es(WEEK[HIGH][1], 2)}</text>
          </g>
          <polyline points={drawn.line} fill="none" stroke={FG} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
          {PTS.map(([x, y], i) => (i <= drawn.i && i !== TODAY ? <circle key={i} cx={x} cy={y} r={7} fill={i === BEFORE && vsFriday > 0 ? BUY : i === HIGH && vsHigh > 0 ? SELL : FG} /> : null))}
          <circle cx={PTS[TODAY][0]} cy={yToday} r={11 * here} fill={FG} style={glow("rgba(255,255,255,0.8)", 16)} />
          <Tag x={TAGS} y={(yBefore + yToday) / 2} w={150} h={52} size={22} tone="buy" show={ease(prog(t, friday + 0.25, 0.5))}>+{es(PCT[TODAY][1], 2)} %</Tag>
          <Tag x={TAGS} y={(yHigh + yToday) / 2} w={150} h={52} size={22} tone="sell" show={ease(prog(t, wednesday + 0.15, 0.45))}>{es((close / WEEK[HIGH][1] - 1) * 100, 2)} %</Tag>
        </Svg>
        <Card say="cerrado" tone="key" style={{ left: 0, top: 0, width: 860, height: 222 }}>
          <span className="lab">S&amp;P 500 · cierre del {DIA_LARGO[weekday(date)]} {dom(date)} {MES[Number(date.slice(5, 7)) - 1]}</span>
          <span className="num" style={{ fontSize: 132 }}>{es(close, 2)}</span>
        </Card>
      </Stage>
      <Src>
        Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Dato del {dom(READ.slice(0, 10))} {MES[Number(READ.slice(5, 7)) - 1]} {READ.slice(0, 4)} a las {READ.slice(11, 16)} (hora de Madrid), con la sesión cerrada.
      </Src>
    </Board>
  );
};
