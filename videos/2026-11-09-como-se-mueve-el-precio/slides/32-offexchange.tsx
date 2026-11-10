// Half of it does not go through the exchanges: in October, 50 of every 100 shares changed hands off them, between dealers who report each trade afterwards
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, BG, Board, DIM, FG, FULL, Head, Hi, Panel, Pulse, SOFT, Src, Stage, Svg, Tag, clamp, ease, es, prog } from "./look/libro";

const OFF = figures.cboe.october_off_pct, ON = 100 - OFF;
const N = figures.cboe.exchanges;
const SPLIT = (FULL.w * ON) / 100;
const TOP = 56, H = 270;

export default () => {
  const t = useSeconds();
  const half = useSay("mitad"), fifty = useSay("cincuenta"), off = useSay("fuera"), dealers = useSay("intermediarios"), report = useSay("comunican"), after = useSay("después");
  const bar = ease(prog(t, half - 0.2, 0.7));
  const cut = ease(prog(t, half + 0.25, 0.5));
  const num = ease(prog(t, fifty, 0.8));
  const lit = ease(prog(t, off, 0.55));
  const two = ease(prog(t, dealers, 0.55));
  const arrow = ease(prog(t, report, 0.5));
  const told = ease(prog(t, after - 0.1, 0.5));
  const ink = lit > 0.5 ? BG : FG;
  return (
    <Board layout="full">
      <Head><h1>La <Hi say="mitad">mitad</Hi> ni siquiera pasa por las bolsas</h1></Head>
      <Stage>
        <Svg {...FULL}>
          <text className="mono" x={4} y={30} fontSize={23} fill={DIM} letterSpacing="0.16em" opacity={num}>DE CADA 100 ACCIONES NEGOCIADAS EN EE. UU. · OCTUBRE DE 2026</text>
          <g opacity={bar}>
            <rect x={0} y={TOP} width={FULL.w * bar} height={H} rx={44} fill={ACC} fillOpacity={0.1} stroke={ACC} strokeOpacity={0.7} strokeWidth={2.5} />
            {lit > 0 && <path d={`M ${SPLIT} ${TOP} H ${FULL.w - 44} a 44 44 0 0 1 44 44 V ${TOP + H - 44} a 44 44 0 0 1 -44 44 H ${SPLIT} Z`} fill={FG} opacity={lit} />}
            <line x1={SPLIT} x2={SPLIT} y1={TOP + H / 2 - (H / 2 + 26) * cut} y2={TOP + H / 2 + (H / 2 + 26) * cut} stroke={FG} strokeWidth={4} strokeLinecap="round" opacity={cut} />
          </g>
          <g opacity={clamp(num * 1.6)}>
            <text x={60} y={TOP + 196} fontSize={210} fontWeight={700} fill={FG} letterSpacing="-0.05em">{es(Math.round(ON * num))}</text>
            <text className="mono" x={SPLIT - 50} y={TOP + 120} textAnchor="end" fontSize={30} fill={ACC} letterSpacing="0.14em">EN LAS</text>
            <text className="mono" x={SPLIT - 50} y={TOP + 166} textAnchor="end" fontSize={30} fill={ACC} letterSpacing="0.14em">BOLSAS</text>
            <text x={SPLIT + 60} y={TOP + 196} fontSize={210} fontWeight={700} fill={ink} letterSpacing="-0.05em">{es(Math.round(OFF * num))}</text>
          </g>
          <g opacity={lit}>
            <text className="mono" x={FULL.w - 50} y={TOP + 120} textAnchor="end" fontSize={30} fill={BG} letterSpacing="0.14em">FUERA DE</text>
            <text className="mono" x={FULL.w - 50} y={TOP + 166} textAnchor="end" fontSize={30} fill={BG} letterSpacing="0.14em">LAS BOLSAS</text>
          </g>
          {Array.from({ length: N }, (_, i) => {
            const p = ease(prog(t, fifty + 0.3 + i * 0.03, 0.4));
            const x = 4 + (i % 9) * 94, y = 392 + Math.floor(i / 9) * 94;
            return (
              <g key={i} opacity={clamp(p * 1.6)} transform={`translate(0, ${((1 - p) * 14).toFixed(2)})`}>
                <rect x={x} y={y} width={70} height={70} rx={18} fill={ACC} fillOpacity={0.12} stroke={ACC} strokeOpacity={0.7} strokeWidth={2} />
                <text className="mono" x={x + 35} y={y + 43} textAnchor="middle" fontSize={22} fill={ACC}>{i + 1}</text>
              </g>
            );
          })}
          <text className="mono" x={4} y={620} fontSize={23} fill={DIM} letterSpacing="0.16em" opacity={ease(prog(t, fifty + 0.9, 0.5))}>LAS {N} BOLSAS</text>
          <g opacity={two}>
            <Panel x={SPLIT + 24} y={392} w={330} h={104} r={52} />
            <text className="mono" x={SPLIT + 189} y={452} textAnchor="middle" fontSize={24} fill={SOFT} letterSpacing="0.12em">INTERMEDIARIO</text>
            <Panel x={FULL.w - 330} y={392} w={330} h={104} r={52} />
            <text className="mono" x={FULL.w - 165} y={452} textAnchor="middle" fontSize={24} fill={SOFT} letterSpacing="0.12em">INTERMEDIARIO</text>
            <line x1={SPLIT + 362} x2={SPLIT + 362 + (FULL.w - 338 - SPLIT - 362) * two} y1={444} y2={444} stroke={FG} strokeWidth={4} strokeLinecap="round" />
          </g>
          <Pulse x={(SPLIT + 24 + FULL.w) / 2} y={444} at={dealers + 0.4} size={60} />
          <Tag x={(SPLIT + 24 + FULL.w) / 2} y={444} w={150} h={50} size={21} tone="key" show={ease(prog(t, dealers + 0.4, 0.4))}>TRATO</Tag>
          {arrow > 0 && (
            <g opacity={arrow}>
              <line x1={(SPLIT + 24 + FULL.w) / 2} x2={(SPLIT + 24 + FULL.w) / 2} y1={478} y2={478 + 70 * arrow} stroke={FG} strokeOpacity={0.6} strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" />
              <path d={`M ${(SPLIT + 24 + FULL.w) / 2 - 12} ${536 + 70 * (arrow - 1)} l 12 14 l 12 -14`} fill="none" stroke={FG} strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
          <Tag x={(SPLIT + 24 + FULL.w) / 2} y={600} w={640} h={68} size={25} show={told}>LA OPERACIÓN SE COMUNICA DESPUÉS</Tag>
        </Svg>
      </Stage>
      <Src>Cboe, volumen histórico del mercado de EE. UU., octubre de 2026: el {es(OFF, 1)} % de las acciones negociadas, fuera de las bolsas.</Src>
    </Board>
  );
};
