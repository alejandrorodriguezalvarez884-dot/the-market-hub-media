// Trading is spread over many venues all day, and twice it gathers: the open and the close. At 16:00 in New York the piled-up orders cross at once and one price comes out
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BG, Board, DIM, FG, FULL, Head, Hi, Pulse, type Side, Src, Stage, Svg, Tag, Who, clamp, ease, glow, prog } from "./look/libro";

const OPEN = 150, CLOSE = 1250, MID = 310, AXIS = 540, OUT = 1530;
const LANES = Array.from({ length: 7 }, (_, k) => 178 + k * 44);
// A venue's day: out of the opening auction, along its own lane, and into the closing one
const lane = (y: number) => `M ${OPEN} ${MID} C ${OPEN + 90} ${MID} ${OPEN + 90} ${y} ${OPEN + 180} ${y} H ${CLOSE - 180} C ${CLOSE - 90} ${y} ${CLOSE - 90} ${MID} ${CLOSE} ${MID}`;
// Deals scattered over the lanes and over the day
const DEALS = Array.from({ length: 42 }, (_, i) => ({ x: OPEN + 200 + ((i * 197) % 700), y: LANES[(i * 3) % 7], at: 0.4 + ((i * 0.618) % 1) * 1.5 }));
// The orders that wait for the close: buyers above it, sellers below
const QUEUE: { side: Side; y: number }[] = [
  ...[254, 210, 166, 122].map((y) => ({ side: "buy" as Side, y })),
  ...[366, 410, 454, 498].map((y) => ({ side: "sell" as Side, y })),
];
const hourX = (h: number) => OPEN + ((h - 9.5) / 6.5) * (CLOSE - OPEN);
const USERS = ["ÍNDICES", "FONDOS", "NOTICIAS"];

export default () => {
  const t = useSeconds();
  const spread = useSay("repartido"), gather = useSay("junta"), open = useSay("apertura"), close = useSay("cierre"), four = useSay("cuatro");
  const york = useSay("nueva york"), orders = useSay("órdenes"), cross = useSay("cruzan"), price = useSay("solo precio");
  const users = [useSay("índices"), useSay("fondos"), useSay("noticias")];
  const opened = ease(prog(t, open, 0.5)), closed = ease(prog(t, close, 0.5));
  const crossed = ease(prog(t, cross, 0.35));
  const out = ease(prog(t, price, 0.5));
  const node = (x: number, lit: number, big = 0) => (
    <g style={lit > 0 ? glow(`rgba(255,255,255,${(0.5 * lit).toFixed(3)})`, 18) : undefined}>
      <circle cx={x} cy={MID} r={26 + 8 * big} fill={BG} />
      <circle cx={x} cy={MID} r={26 + 8 * big} fill={FG} fillOpacity={0.1 + 0.9 * lit} stroke={FG} strokeWidth={3} />
    </g>
  );
  return (
    <Board layout="full">
      <Head><h1>Dos veces al día, todo se <Hi say="junta">junta</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          {LANES.map((y, k) => {
            const p = ease(prog(t, 0.1 + k * 0.05, 1.1));
            return <path key={y} d={lane(y)} pathLength={1} fill="none" stroke={FG} strokeOpacity={0.24} strokeWidth={2.5} strokeDasharray={`${p.toFixed(4)} 1`} />;
          })}
          {DEALS.map((d, i) => {
            const p = ease(prog(t, d.at, 0.35));
            return p > 0 ? <circle key={i} cx={d.x} cy={d.y} r={3 + 3 * p} fill={FG} opacity={0.7 * p} /> : null;
          })}
          <text className="mono" x={(OPEN + CLOSE) / 2} y={132} textAnchor="middle" fontSize={23} fill={DIM} letterSpacing="0.16em" opacity={ease(prog(t, spread, 0.5))}>EL MERCADO, REPARTIDO</text>
          <g opacity={ease(prog(t, 0.3, 0.6))}>
            <line x1={OPEN} x2={CLOSE} y1={AXIS} y2={AXIS} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} />
            {[10, 11, 12, 13, 14, 15].map((h) => <line key={h} x1={hourX(h)} x2={hourX(h)} y1={AXIS - 7} y2={AXIS + 7} stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />)}
            <line x1={OPEN} x2={OPEN} y1={AXIS - 14} y2={AXIS + 14} stroke={FG} strokeWidth={3} strokeLinecap="round" />
            <line x1={CLOSE} x2={CLOSE} y1={AXIS - 14} y2={AXIS + 14} stroke={FG} strokeWidth={3} strokeLinecap="round" />
          </g>
          <text className="mono" x={(OPEN + CLOSE) / 2} y={592} textAnchor="middle" fontSize={21} fill={DIM} letterSpacing="0.16em" opacity={ease(prog(t, york, 0.5))}>HORA DE NUEVA YORK</text>
          <text x={OPEN} y={600} textAnchor="middle" fontSize={44} fontWeight={700} fill={FG} letterSpacing="-0.02em" opacity={opened}>9:30</text>
          <Tag x={OPEN} y={650} w={210} h={44} size={20} show={opened}>APERTURA</Tag>
          <text x={CLOSE} y={600} textAnchor="middle" fontSize={44} fontWeight={700} fill={FG} letterSpacing="-0.02em" opacity={ease(prog(t, four, 0.5))}>16:00</text>
          <Tag x={CLOSE} y={650} w={170} h={44} size={20} show={closed}>CIERRE</Tag>
          {out > 0 && <line x1={CLOSE + 40} x2={CLOSE + 40 + (OUT - 190 - CLOSE - 40) * out} y1={MID} y2={MID} stroke={FG} strokeWidth={4} strokeLinecap="round" />}
          {USERS.map((name, i) => {
            const p = ease(prog(t, users[i], 0.5));
            const y = 440 + i * 76;
            return (
              <g key={name}>
                {p > 0 && <line x1={OUT} x2={OUT} y1={i === 0 ? 356 : y - 50} y2={(i === 0 ? 356 : y - 50) + (y - 26 - (i === 0 ? 356 : y - 50)) * p} stroke={FG} strokeOpacity={0.5} strokeWidth={2.5} strokeDasharray="2 8" strokeLinecap="round" />}
                <Tag x={OUT} y={y} w={260} h={52} size={22} show={p}>{name}</Tag>
              </g>
            );
          })}
          {node(OPEN, clamp(opened + (t >= gather && t < open ? 0.35 : 0)))}
          {node(CLOSE, clamp(Math.max(closed * 0.55, crossed) + (t >= gather && t < close ? 0.35 : 0)), crossed)}
          {QUEUE.map((q, j) => {
            const p = ease(prog(t, orders + j * 0.07, 0.5));
            if (p <= 0 || crossed >= 1) return null;
            return <Who key={j} side={q.side} r={18} solid x={CLOSE - (1 - p) * 130} y={q.y + (MID - q.y) * crossed} scale={1 - 0.6 * crossed} opacity={clamp(p * 1.6) * (1 - crossed)} />;
          })}
          <Pulse x={OPEN} y={MID} at={gather} size={70} />
          <Pulse x={CLOSE} y={MID} at={gather + 0.12} size={70} />
          <Pulse x={CLOSE} y={MID} at={cross + 0.2} size={110} />
          <Tag x={OUT} y={MID} w={360} h={84} size={30} tone="key" show={out}>UN SOLO PRECIO</Tag>
        </Svg>
      </Stage>
      <Src>Nasdaq y NYSE, subastas de apertura y cierre. Horas de Nueva York: la sesión abre a las 9:30 y cierra a las 16:00.</Src>
    </Board>
  );
};
