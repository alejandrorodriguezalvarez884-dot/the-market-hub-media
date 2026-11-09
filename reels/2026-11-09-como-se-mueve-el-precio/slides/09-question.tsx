// The question for the comments: when the market falls, do you watch the price or switch the screen off?
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { DIM, FG, SELL, Board, Card, Head, Hi, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const arrow = ease(prog(t, read, 0.4));
  const fall = Array.from({ length: 16 }, (_, i) => [50 + i * 20, 50 + i * 9 + Math.sin(i * 1.7 + t * 4) * 9] as const);
  const [fx, fy] = fall[15];
  const option: React.CSSProperties = { top: 150, width: 418, height: 400, padding: 0, textAlign: "center" };
  return (
    <Board>
      <Head><h1 className="big">¿Y <Hi>tú</Hi>?</h1></Head>
      <Stage style={{ top: 500 }}>
        <Card say={0.1} style={{ left: 0, top: 16, width: 860, fontSize: 44, lineHeight: 1.1, color: FG }}>
          Cuando la bolsa <b>cae</b>, ¿qué haces?
        </Card>
        <Card say="miras" style={{ ...option, left: 0 }}>
          <svg width={416} height={250} viewBox="0 0 416 250">
            {[70, 120, 170, 220].map((y) => <line key={y} x1={30} x2={386} y1={y} y2={y} stroke="#fff" strokeOpacity={0.07} strokeWidth={1.5} />)}
            <polyline points={fall.map((p) => p.join(",")).join(" ")} fill="none" stroke={SELL} strokeWidth={5.5} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(255,107,97,0.6)", 10)} />
            <circle cx={fx} cy={fy} r={11} fill={FG} style={glow("rgba(255,255,255,0.8)", 12)} />
          </svg>
          <span className="lab" style={{ fontSize: 28, color: FG }}>A</span>
          <b style={{ fontSize: 40 }}>Miro el precio</b>
        </Card>
        <Card say="apagas" style={{ ...option, left: 442 }}>
          <svg width={416} height={250} viewBox="0 0 416 250">
            <rect x={98} y={48} width={220} height={140} rx={18} fill="rgba(0,0,0,0.5)" stroke={DIM} strokeWidth={3} />
            <line x1={168} x2={248} y1={214} y2={214} stroke={DIM} strokeWidth={5} strokeLinecap="round" />
            <path d="M 194 104 A 24 24 0 1 0 222 104" fill="none" stroke={DIM} strokeWidth={5} strokeLinecap="round" />
            <line x1={208} x2={208} y1={92} y2={120} stroke={DIM} strokeWidth={5} strokeLinecap="round" />
          </svg>
          <span className="lab" style={{ fontSize: 28, color: FG }}>B</span>
          <b style={{ fontSize: 40 }}>Apago la pantalla</b>
        </Card>
        <Svg>
          <Tag x={430} y={636} w={520} h={72} size={27} tone="key" show={arrow}>TE LEO EN COMENTARIOS</Tag>
          <g transform={`translate(430, ${(714 + Math.sin(t * 6) * 7).toFixed(2)})`} opacity={arrow}>
            <path d="M -18 -10 L 0 10 L 18 -10" fill="none" stroke={FG} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </Svg>
      </Stage>
      <Src>Contenido informativo de The Market Hub. No es una recomendación de inversión.</Src>
    </Board>
  );
};
