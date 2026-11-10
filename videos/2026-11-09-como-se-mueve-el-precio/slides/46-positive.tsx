// 35 of the 46 years since 1980 ended up, as a grid of years; and 2020 drawn close by close: its fall of about 34 % in a month and its close 16 % up
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { BUY, Board, DIM, FG, Head, Hi, Lead, Panel, Pulse, SELL, SOFT, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog, trace } from "./look/libro";

// [year, largest fall inside the year, the year's result], in %
const YEARS = figures.years as [number, number, number][];
const CLOSES = figures.y2020 as number[], DATES = figures.y2020_dates as string[];
const PEAK = figures.y2020_peak as [string, number], LOW = figures.y2020_low as [string, number];
const Y20 = YEARS.find(([year]) => year === 2020)!;
const iPeak = DATES.indexOf(PEAK[0]), iLow = DATES.indexOf(LOW[0]), N = CLOSES.length - 1;
const BASE = CLOSES[N] / (1 + Y20[2] / 100); // where 2019 ended, from the year's result
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const short = (iso: string) => `${Number(iso.slice(8, 10))} ${MES[Number(iso.slice(5, 7)) - 1]}`;
const X = (i: number) => 40 + (i / N) * 776;
const Y = (close: number) => 334 + (3800 - close) * 0.25;
const PTS = CLOSES.map((close, i) => [X(i), Y(close)] as const);
const PER_ROW = Math.ceil(YEARS.length / 2), CELL = 30, GAP = 6;
const cell = (i: number) => ({ x: 19 + (i % PER_ROW) * (CELL + GAP), y: 64 + Math.floor(i / PER_ROW) * (CELL + GAP) });
const smooth = (p: number) => p * p * (3 - 2 * p);

export default () => {
  const t = useSeconds();
  const up = useSay("treinta y cinco"), y2020 = useSay("dos mil veinte"), fell = useSay("treinta y cuatro"), closed = useSay("cerró"), result = useSay("dieciséis");
  const lit = YEARS.map((_, i) => ease(prog(t, up + i * 0.03, 0.4)));
  const count = YEARS.filter(([, , r], i) => r > 0 && lit[i] > 0.5).length;
  const chart = ease(prog(t, y2020 - 0.1, 0.5));
  const down = smooth(prog(t, y2020 + 0.25, Math.max(0.6, fell - y2020 - 0.1)));
  const back = smooth(prog(t, closed - 0.3, Math.max(0.8, result - closed + 0.2)));
  const drawn = trace(PTS, (iLow * down + (N - iLow) * back) / N);
  const atPeak = ease(prog(t, y2020 + 0.25 + (iPeak / iLow) * Math.max(0.6, fell - y2020 - 0.1), 0.3));
  const atLow = ease(prog(t, fell, 0.5)), base = ease(prog(t, closed - 0.3, 0.5)), atEnd = ease(prog(t, result, 0.5));
  const c20 = cell(YEARS.indexOf(Y20));
  return (
    <Board layout="flip">
      <Head>
        <h1>Caer y acabar<br />en <Hi tone="buy" say="positivo">positivo</Hi></h1>
        <Lead say="dos mil veinte">En 2020 pasaron las dos cosas, <b>el mismo año</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <Panel h={216} />
          <text className="mono" x={22} y={42} fontSize={21} fill={FG} letterSpacing="0.14em">CÓMO ACABÓ CADA AÑO · {YEARS[0][0]} A {YEARS[YEARS.length - 1][0]}</text>
          {YEARS.map(([year, , r], i) => {
            const { x, y } = cell(i), p = lit[i];
            return (
              <g key={year}>
                <rect x={x} y={y} width={CELL} height={CELL} rx={8} fill="#fff" fillOpacity={0.07} />
                <rect x={x} y={y} width={CELL} height={CELL} rx={8} fill={r > 0 ? BUY : SELL} opacity={p * (r > 0 ? 0.95 : 0.6)} />
              </g>
            );
          })}
          <rect x={c20.x - 5} y={c20.y - 5} width={CELL + 10} height={CELL + 10} rx={12} fill="none" stroke={FG} strokeWidth={3} opacity={chart} />
          <Pulse x={c20.x + CELL / 2} y={c20.y + CELL / 2} at={y2020} size={54} />
          <g opacity={clamp(prog(t, up, 0.35))}>
            <text x={22} y={190} fontSize={54} fontWeight={700} fill={BUY} letterSpacing="-0.03em">{count} de {YEARS.length}</text>
            <text x={286} y={188} fontSize={31} fill={SOFT}>años acabaron en positivo</text>
          </g>

          <g opacity={chart} transform={`translate(0, ${((1 - chart) * 24).toFixed(2)})`}>
            <Panel y={240} h={540} />
            <text className="mono" x={22} y={284} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · 2020, CIERRE A CIERRE</text>
            <g opacity={base}>
              <line x1={40} x2={816} y1={Y(BASE)} y2={Y(BASE)} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
              <text className="mono" x={804} y={Y(BASE) + 28} textAnchor="end" fontSize={19} fill={DIM} letterSpacing="0.1em">DONDE ACABÓ 2019</text>
            </g>
            <polyline points={drawn.line} fill="none" stroke={FG} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
            {down > 0 && back < 1 && <circle cx={drawn.tip[0]} cy={drawn.tip[1]} r={6} fill={FG} style={glow("rgba(255,255,255,0.7)", 10)} />}
            <g opacity={atPeak}>
              <circle cx={PTS[iPeak][0]} cy={PTS[iPeak][1]} r={7} fill={FG} />
              <text className="mono" x={PTS[iPeak][0]} y={PTS[iPeak][1] - 20} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.1em">MÁXIMO</text>
            </g>
            <g opacity={atLow}>
              <circle cx={PTS[iLow][0]} cy={PTS[iLow][1]} r={8} fill={SELL} style={glow("rgba(255,107,97,0.7)", 12)} />
              <line x1={PTS[iLow][0] + 14} x2={300} y1={PTS[iLow][1] - 8} y2={672} stroke={SELL} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
              <text className="mono" x={300} y={736} fontSize={20} fill={DIM} letterSpacing="0.1em">{short(PEAK[0]).toUpperCase()} A {short(LOW[0]).toUpperCase()}</text>
            </g>
            <Tag x={402} y={676} w={204} h={58} size={27} tone="sell" show={atLow}>{es(figures.y2020_fall, 1)} %</Tag>
            <g opacity={atEnd}>
              <line x1={832} x2={832} y1={Y(BASE)} y2={PTS[N][1]} stroke={BUY} strokeWidth={4} strokeLinecap="round" />
              <circle cx={PTS[N][0]} cy={PTS[N][1]} r={8} fill={BUY} style={glow("rgba(52,227,161,0.7)", 12)} />
            </g>
            <Tag x={706} y={296} w={204} h={58} size={27} tone="buy" show={atEnd}>+{es(Y20[2], 1)} %</Tag>
            <text className="mono" x={40} y={762} fontSize={19} fill={DIM} letterSpacing="0.1em">ENE</text>
            <text className="mono" x={816} y={762} textAnchor="end" fontSize={19} fill={DIM} letterSpacing="0.1em">DIC</text>
          </g>
        </Svg>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Sin dividendos.</Src>
    </Board>
  );
};
