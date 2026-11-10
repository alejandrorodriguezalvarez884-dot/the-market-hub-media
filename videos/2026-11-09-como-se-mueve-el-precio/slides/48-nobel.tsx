// A few days ahead it does look like one: a price line that opens into a fan of paths nobody can tell apart, and what the Nobel committee wrote in 2013
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, ease, glow, prog, trace } from "./look/libro";

// A made-up line, the same in every render
const PTS = Array.from({ length: 41 }, (_, i) => [40 + i * 12, 222 + 42 * Math.sin(i * 0.9) + 26 * Math.sin(i * 2.3 + 1) + 30 * Math.sin(i * 0.31 + 2)] as const);
const [NX, NY] = PTS[PTS.length - 1];
const FAN = [-122, -61, 0, 61, 122];

export default () => {
  const t = useSeconds();
  const next = useSay("próximos");
  const drawn = ease(prog(t, 0.1, 1.5)), fan = ease(prog(t, next, 0.9));
  const { line, tip } = trace(PTS, drawn);
  return (
    <Board>
      <Head><h1>A pocos días,<br /><Hi say="parece">se parece</Hi></h1></Head>
      <Stage>
        <Svg>
          <defs><clipPath id="nobel-fan"><rect x={NX} y={0} width={(830 - NX) * fan} height={440} /></clipPath></defs>
          <Panel h={440} />
          <text className="mono" x={30} y={46} fontSize={20} fill={DIM} letterSpacing="0.14em">EL PRECIO DE UNA ACCIÓN · ESQUEMA</text>
          <polyline points={line} fill="none" stroke={FG} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.55)", 10)} />
          <circle cx={tip[0]} cy={tip[1]} r={10} fill={FG} style={glow("rgba(255,255,255,0.8)", 12)} />
          <g opacity={fan}>
            <line x1={NX} x2={NX} y1={72} y2={376} stroke="#fff" strokeOpacity={0.25} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" />
            <text className="mono" x={NX - 14} y={410} textAnchor="end" fontSize={20} fill={DIM} letterSpacing="0.14em">HASTA AQUÍ</text>
            <text className="mono" x={NX + 14} y={410} fontSize={20} fill={ACC} letterSpacing="0.14em">DÍAS O SEMANAS</text>
          </g>
          <g clipPath="url(#nobel-fan)" fill="none" stroke={ACC} strokeWidth={3.5} strokeDasharray="2 10" strokeLinecap="round">
            {FAN.map((d) => <path key={d} d={`M ${NX} ${NY} Q ${NX + 130} ${NY + d * 0.15} 790 ${NY + d}`} />)}
          </g>
          {FAN.map((d, i) => (
            <text key={d} x={816} y={NY + d + 12} textAnchor="middle" fontSize={34} fontWeight={700} fill={ACC} opacity={ease(prog(t, next + 0.6 + i * 0.08, 0.4))}>?</text>
          ))}
        </Svg>
        <Card say="Nobel" style={{ left: 0, top: 472, width: 860, padding: "24px 30px" }}>
          <span className="lab">Comité del Nobel de Economía, 2013</span>
          <span style={{ fontSize: 40, lineHeight: 1.18, display: "block" }}>No hay forma de predecir el precio de las acciones en los próximos <b>días o semanas</b>.</span>
        </Card>
      </Stage>
      <Src>Real Academia Sueca de las Ciencias, nota de prensa del premio de Ciencias Económicas de 2013 (nobelprize.org). El dibujo es un esquema, no un valor real.</Src>
    </Board>
  );
};
