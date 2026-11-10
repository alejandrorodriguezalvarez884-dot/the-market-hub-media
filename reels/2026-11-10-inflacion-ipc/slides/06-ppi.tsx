// The PPI measures what producers charge, before it reaches the shop: more than 6 % a year in September
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

const STOPS: [string, number][] = [["PRODUCTOR", 130], ["TIENDA", 430], ["TU CESTA", 730]];

export default () => {
  const t = useSeconds();
  const makers = useSay("productores"), shop = useSay("tienda"), six = useSay("seis");
  const run = ease(prog(t, makers, Math.max(0.6, shop - makers + 0.4)));
  const box = 130 + 600 * run;
  return (
    <Board>
      <Head><h1>El <Hi>PPI</Hi>: los precios<br />antes de la tienda</h1></Head>
      <Stage>
        <Svg>
          <Panel h={380} />
          <line x1={130} x2={730} y1={190} y2={190} stroke="#fff" strokeOpacity={0.25} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
          <line x1={130} x2={box} y1={190} y2={190} stroke={ACC} strokeWidth={5} strokeLinecap="round" style={glow("rgba(157,184,255,0.6)", 10)} />
          {STOPS.map(([name, x], i) => {
            const lit = i === 0 ? 1 : run >= (x - 130) / 600 - 0.02 ? 1 : 0.35;
            return (
              <g key={name} opacity={lit}>
                <circle cx={x} cy={190} r={52} fill="#12151b" stroke={i === 0 ? FG : ACC} strokeWidth={3} />
                {i === 0 && <path d="M 102 214 L 102 178 L 120 190 L 120 178 L 138 190 L 138 166 L 158 166 L 158 214 Z" fill={FG} />}
                {i === 1 && <path d="M 400 172 L 408 158 L 452 158 L 460 172 Z M 406 172 L 406 214 L 454 214 L 454 172 M 422 214 L 422 192 L 438 192 L 438 214" fill="none" stroke={FG} strokeWidth={4} strokeLinejoin="round" />}
                {i === 2 && <path d="M 702 180 L 758 180 L 748 214 L 712 214 Z M 712 180 C 712 156 748 156 748 180" fill="none" stroke={FG} strokeWidth={4} strokeLinejoin="round" />}
                <text className="mono" x={x} y={290} textAnchor="middle" fontSize={21} fill={FG} letterSpacing="0.12em">{name}</text>
              </g>
            );
          })}
          <Tag x={130} y={90} w={130} h={50} size={24} tone="key" show={ease(prog(t, makers, 0.4))}>PPI</Tag>
          <Tag x={730} y={90} w={130} h={50} size={24} show={ease(prog(t, shop + 0.2, 0.4))}>IPC</Tag>
        </Svg>
        <Card say="seis" tone="key" style={{ left: 0, top: 410, width: 418 }}>
          <span className="lab">PPI, septiembre</span>
          <span className="num" style={{ fontSize: 88 }}>6,3 %</span>
          <small>en un año</small>
        </Card>
        <Card say="seis+0.5" style={{ left: 442, top: 410, width: 418 }}>
          <span className="lab">IPC, septiembre</span>
          <span className="num" style={{ fontSize: 88, color: DIM }}>3,7 %</span>
          <small>en un año</small>
        </Card>
      </Stage>
      <Src>PPI de demanda final y IPC, sin desestacionalizar, septiembre de 2026 contra septiembre de 2025: BLS vía FRED, cálculo propio.</Src>
    </Board>
  );
};
