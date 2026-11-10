// The Thursday of the fall against a normal month: 28,000 million shares in one day, with October averaging 17,000. More movement, more deals
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, DIM, FG, Head, Hi, Lead, Panel, Src, Stage, Svg, Tag, ease, es, glow, prog } from "./look/libro";

const DAILY = figures.cboe.daily as unknown as [string, number, number, number][];
const MEAN = figures.cboe.october_shares_bn;
const PEAK = DAILY.findIndex((d) => d[0] === "2026-11-05");
const NOV = DAILY.findIndex((d) => d[0] > "2026-10-31");
const TOP = DAILY[PEAK][1];
const X0 = 76, STEP = (836 - X0) / DAILY.length, BW = 19, BASE = 470, PX = 12.4;
const Y = (v: number) => BASE - v * PX;
const mid = (i: number) => X0 + i * STEP + BW / 2;

export default () => {
  const t = useSeconds();
  const thursday = useSay("jueves"), figure = useSay("veintiocho");
  const grown = ease(prog(t, thursday, 0.7));
  const named = ease(prog(t, figure, 0.5));
  const count = ease(prog(t, figure, 0.8));
  const line = ease(prog(t, 0.5, 0.8));
  return (
    <Board layout="flip">
      <Head>
        <h1>Más movimiento,<br /><Hi say="más tratos">más tratos</Hi></h1>
        <Lead say="cada venta">Cada venta con prisa encontró a <b>alguien que compraba</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <Panel h={530} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">ACCIONES AL DÍA · MILES DE MILLONES</text>
          {[10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={X0 - 6} x2={836} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.09} strokeWidth={1.5} />
              <text className="mono" x={X0 - 14} y={Y(v) + 7} textAnchor="end" fontSize={19} fill={DIM}>{v}</text>
            </g>
          ))}
          <text className="mono" x={X0 - 14} y={BASE + 7} textAnchor="end" fontSize={19} fill={DIM}>0</text>
          {DAILY.map(([day, v], i) => {
            const peak = i === PEAK;
            const g = peak ? grown : ease(prog(t, 0.15 + i * 0.03, 0.45));
            return <rect key={day} x={X0 + i * STEP} y={Y(v * g)} width={BW} height={Math.max(v * g * PX, 0.01)} rx={4} fill={peak ? ACC : FG} opacity={peak ? 1 : 0.3} style={peak && grown > 0 ? glow("rgba(157,184,255,0.55)", 16) : undefined} />;
          })}
          <line x1={X0 - 6} x2={836} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} />
          <line x1={X0 - 6} x2={X0 - 6 + (836 - X0 + 6) * line} y1={Y(MEAN)} y2={Y(MEAN)} stroke={FG} strokeOpacity={0.75} strokeWidth={2.5} strokeDasharray="4 9" strokeLinecap="round" />
          <Tag x={X0 + 124} y={Y(MEAN)} w={236} h={38} size={17} show={ease(prog(t, 1.0, 0.5))}>MEDIA DE OCTUBRE</Tag>
          <line x1={X0 + NOV * STEP - (STEP - BW) / 2} x2={X0 + NOV * STEP - (STEP - BW) / 2} y1={BASE + 8} y2={BASE + 44} stroke="#fff" strokeOpacity={0.25} strokeWidth={1.5} />
          <text className="mono" x={(mid(0) + mid(NOV - 1)) / 2} y={BASE + 36} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.14em">OCTUBRE</text>
          <text className="mono" x={(mid(NOV) + mid(DAILY.length - 1)) / 2} y={BASE + 36} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.14em">NOVIEMBRE</text>
          <text x={mid(PEAK)} y={Y(TOP) - 16} textAnchor="middle" fontSize={36} fontWeight={700} fill={ACC} letterSpacing="-0.02em" opacity={named}>{es(TOP, 1)}</text>
        </Svg>
        <Card say={0.4} style={{ left: 0, top: 552, width: 418 }}>
          <span className="lab">Media de octubre</span>
          <span className="num" style={{ fontSize: 84 }}>{es(MEAN * 1000)}</span>
          <small>millones de acciones al día</small>
        </Card>
        <Card say={figure} tone="key" style={{ left: 442, top: 552, width: 418 }}>
          <span className="lab">Jueves 5 de noviembre</span>
          <span className="num" style={{ fontSize: 84 }}>{es(Math.round(TOP * 1000 * count))}</span>
          <small>millones: {es(TOP / MEAN, 1)} veces esa media</small>
        </Card>
      </Stage>
      <Src>Cboe, volumen histórico del mercado de EE. UU.: acciones negociadas cada sesión, del 1 de octubre al 6 de noviembre de 2026.</Src>
    </Board>
  );
};
