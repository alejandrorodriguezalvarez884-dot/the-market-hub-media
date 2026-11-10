// The S&P 500 month by month since January 1950 on a logarithmic scale: from under 17 points to Monday's close above 7,500
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, DIM, FG, FULL, Head, Hi, Panel, Src, Stage, Svg, ease, es, glow, prog, trace } from "./look/libro";

const FIRST = figures.first as [string, number], LAST = figures.last as [string, number];
const MONTHS = figures.monthly as [string, number][];
// The first day's close, then the close of each month (the last one is Monday's)
const CLOSES = [FIRST[1], ...MONTHS.map(([, close]) => close)];
const N = CLOSES.length - 1;
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const day = (iso: string) => `${Number(iso.slice(8, 10))} ${MES[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const LO = Math.log10(16), HI = Math.log10(8000);
const X = (i: number) => 96 + (i / N) * 1554;
const Y = (v: number) => 610 - ((Math.log10(v) - LO) / (HI - LO)) * 516;
const PTS = CLOSES.map((v, i) => [X(i), Y(v)] as const);
const Y0 = Number(FIRST[0].slice(0, 4)), Y1 = Number(LAST[0].slice(0, 4));
const smooth = (p: number) => p * p * (3 - 2 * p);

export default () => {
  const t = useSeconds();
  const january = useSay("enero"), seventeen = useSay("diecisiete"), above = useSay("encima");
  const start = ease(prog(t, january, 0.5));
  const p = smooth(prog(t, seventeen + 0.4, Math.max(1.2, above - seventeen - 0.5)));
  const drawn = trace(PTS, p);
  const there = ease(prog(t, above, 0.5));
  const decades = Array.from({ length: Math.floor((Y1 - Y0) / 10) + 1 }, (_, i) => Y0 + i * 10);
  return (
    <Board layout="full">
      <Head><h1>El S&amp;P 500 desde <Hi say="mil novecientos cincuenta">enero de {Y0}</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <defs>
            <linearGradient id="since-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={ACC} stopOpacity={0.3} /><stop offset="1" stopColor={ACC} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Panel w={FULL.w} h={FULL.h} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · CIERRE DE CADA MES, {Y0} A {Y1} · ESCALA LOGARÍTMICA</text>
          <line x1={96} x2={FULL.w - 40} y1={610} y2={610} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          {[100, 1000].map((v) => (
            <g key={v}>
              <line x1={96} x2={FULL.w - 40} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.1} strokeWidth={1.5} />
              <text className="mono" x={84} y={Y(v) + 7} textAnchor="end" fontSize={20} fill={DIM}>{es(v)}</text>
            </g>
          ))}
          {decades.map((year) => (
            <text key={year} className="mono" x={X(Math.min(N, (year - Y0) * 12 + 1))} y={650} textAnchor="middle" fontSize={20} fill={DIM} letterSpacing="0.06em">{year}</text>
          ))}
          {p > 0 && <polygon points={`${PTS[0][0]},610 ${drawn.line} ${drawn.tip[0].toFixed(1)},610`} fill="url(#since-area)" />}
          {p > 0 && <polyline points={drawn.line} fill="none" stroke={FG} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />}
          <line x1={PTS[0][0] + 8} x2={150} y1={PTS[0][1] - 14} y2={318} stroke={FG} strokeOpacity={0.6 * ease(prog(t, seventeen, 0.5))} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
          <circle cx={PTS[0][0]} cy={PTS[0][1]} r={8 * start} fill={FG} style={glow("rgba(255,255,255,0.6)", 12)} />
          {p > 0 && <circle cx={drawn.tip[0]} cy={drawn.tip[1]} r={8} fill={p < 1 ? FG : ACC} style={glow(p < 1 ? "rgba(255,255,255,0.7)" : "rgba(157,184,255,0.8)", 14)} />}
          <line x1={PTS[N][0]} x2={PTS[N][0]} y1={PTS[N][1] + 14} y2={372} stroke={ACC} strokeOpacity={0.8 * there} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
        </Svg>
        <Card say="diecisiete" style={{ left: 120, top: 106, width: 380 }}>
          <span className="lab">{day(FIRST[0])}</span>
          <span className="num" style={{ fontSize: 104 }}>{es(FIRST[1], 2)}</span>
          <small>puntos</small>
        </Card>
        <Card say="encima" tone="key" style={{ left: 1212, top: 372, width: 468 }}>
          <span className="lab">{day(LAST[0])}</span>
          <span className="num" style={{ fontSize: 104 }}>{es(LAST[1], 2)}</span>
          <small>puntos, al cierre</small>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del S&amp;P 500 desde 1950; cuentas propias. Sin dividendos.</Src>
    </Board>
  );
};
