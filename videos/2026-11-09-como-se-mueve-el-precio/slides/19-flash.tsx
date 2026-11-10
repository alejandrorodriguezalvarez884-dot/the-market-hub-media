// A schematic of 6 May 2010: the market already down 4 %, a further 5 or 6 % in minutes, and back almost as fast
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Board, Card, DIM, FG, Head, Hi, Lead, Panel, SELL, Src, Stage, Svg, Tag, ease, glow, prog, trace, useIn } from "./look/libro";

// 0 % at y = 130 and 40 px for each point: a drawing of the shape, not of the data
const SLIDE: [number, number][] = [[60, 130], [110, 150], [150, 140], [200, 185], [240, 172], [290, 215], [330, 205], [380, 255], [420, 250], [470, 290]];
const PLUNGE: [number, number][] = [[470, 290], [490, 330], [500, 322], [525, 420], [535, 410], [560, 510]];
const BACK: [number, number][] = [[560, 510], [580, 455], [590, 465], [615, 380], [625, 388], [650, 310], [700, 318], [750, 300], [800, 306]];

export default () => {
  const t = useSeconds();
  const fell = useSay("caía"), four = useSay("cuatro"), drop = useSay("perdió"), more = useSay("otro"), back = useSay("recuperó");
  const frame = useIn("seis"), minutes = useIn("minutos");
  const a = prog(t, fell, 1.2), b = prog(t, drop, 0.7), c = prog(t, back, 0.9);
  const A = trace(SLIDE, a), B = trace(PLUNGE, b), C = trace(BACK, c);
  const tip = c > 0 ? C.tip : b > 0 ? B.tip : A.tip;
  const guide = ease(prog(t, four, 0.5)), gap = ease(prog(t, more, 0.5));
  const line = { fill: "none", strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round" } as const;
  return (
    <Board lean={ease(prog(t, back, 0.9)) - ease(prog(t, drop, 0.8))}>
      <Head>
        <h1><Hi say="seis">6 de mayo</Hi><br />de 2010</h1>
        <Lead say="minutos">La bolsa de Estados Unidos, en unos minutos.</Lead>
      </Head>
      <Stage>
        <Svg>
          <g opacity={frame}>
            <Panel h={620} />
            <text className="mono" x={36} y={54} fontSize={20} fill={DIM} letterSpacing="0.14em">ESQUEMA, NO A ESCALA</text>
            <line x1={60} x2={800} y1={130} y2={130} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" />
            <text className="mono" x={760} y={114} fontSize={22} fill={DIM}>0 %</text>
          </g>
          {/* the few minutes of the fall and the way back */}
          <g opacity={minutes}>
            <rect x={462} y={96} width={196} height={456} rx={14} fill="#fff" fillOpacity={0.05} />
            <text className="mono" x={560} y={588} textAnchor="middle" fontSize={20} fill={FG} letterSpacing="0.14em">UNOS MINUTOS</text>
          </g>
          <line x1={60} x2={60 + 740 * guide} y1={290} y2={290} stroke={SELL} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" opacity={guide > 0 ? 1 : 0} />
          {a > 0 && <polyline points={A.line} stroke={FG} {...line} style={glow("rgba(157,184,255,0.5)", 10)} />}
          {b > 0 && <polyline points={B.line} stroke={SELL} {...line} style={glow("rgba(255,107,97,0.6)", 12)} />}
          {c > 0 && <polyline points={C.line} stroke={BUY} {...line} style={glow("rgba(52,227,161,0.5)", 12)} />}
          {a > 0 && <circle cx={tip[0]} cy={tip[1]} r={10} fill={FG} style={glow("rgba(255,255,255,0.7)", 12)} />}
          <Tag x={250} y={330} w={270} h={50} size={20} tone="sell" show={guide}>YA CAÍA UN 4 %</Tag>
          {/* from the level it was at to the bottom of the plunge */}
          <g opacity={gap > 0 ? 1 : 0} stroke={SELL} strokeWidth={4} strokeLinecap="round">
            <line x1={420} x2={420} y1={298} y2={298 + 212 * gap} />
            <line x1={404} x2={436} y1={298} y2={298} />
            <line x1={404} x2={436} y1={298 + 212 * gap} y2={298 + 212 * gap} />
          </g>
          <Tag x={270} y={430} w={250} h={50} size={20} tone="sell" show={ease(prog(t, more + 0.3, 0.45))}>OTRO 5 A 6 %</Tag>
          <Tag x={730} y={470} w={200} h={50} size={20} tone="buy" show={ease(prog(t, back + 0.5, 0.45))}>Y DE VUELTA</Tag>
        </Svg>
        <Card say={back + 0.9} tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Cayó y volvió <b>en cuestión de minutos</b>.
        </Card>
      </Stage>
      <Src>Esquema, no a escala. SEC y CFTC, informe sobre el 6 de mayo de 2010.</Src>
    </Board>
  );
};
