// The Fed watches the PCE price index; its goal is 2 %; in September it was 3.6 % (3.1 % without food and energy)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BUY, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, es, glow, prog } from "./look/libro";

const X = (v: number) => 50 + (v / 5) * 760; // 0 to 5 %

export default () => {
  const t = useSeconds();
  const goal = useSay("objetivo"), now = useSay("tres");
  const g = ease(prog(t, goal, 0.5));
  const v = 2 + 1.6 * ease(prog(t, now, 0.9));
  const at = g > 0 ? (t < now ? 2 : v) : 0;
  return (
    <Board>
      <Head><h1>La Fed mira<br />el <Hi>PCE</Hi></h1></Head>
      <Stage>
        <Card style={{ left: 0, top: 0, width: 860 }}>
          <span className="lab">PCE · Personal Consumption Expenditures</span>
          Los precios de <b>todo lo que gastan los hogares</b>. Es el índice con el que la Reserva Federal fija su objetivo.
        </Card>
        <Svg>
          <Panel y={210} h={290} />
          <text className="mono" x={28} y={256} fontSize={21} fill={FG} letterSpacing="0.14em">PCE · EN UN AÑO</text>
          <rect x={X(0)} y={370} width={X(5) - X(0)} height={22} rx={11} fill="#fff" fillOpacity={0.08} />
          <rect x={X(0)} y={370} width={Math.max(0, X(at) - X(0))} height={22} rx={11} fill={ACC} style={glow("rgba(157,184,255,0.5)", 10)} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <text key={k} className="mono" x={X(k)} y={440} textAnchor="middle" fontSize={21} fill={DIM}>{k} %</text>
          ))}
          <g opacity={g}>
            <line x1={X(2)} x2={X(2)} y1={318} y2={410} stroke={BUY} strokeWidth={4} strokeDasharray="8 6" />
            <Tag x={X(2)} y={300} w={250} h={46} size={19} tone="buy">OBJETIVO: 2 %</Tag>
          </g>
          {t >= now && <Tag x={X(v)} y={470} w={170} h={50} size={24} tone="key">{es(v, 1)} %</Tag>}
        </Svg>
        <Card say="tres" tone="key" style={{ left: 0, top: 528, width: 418 }}>
          <span className="lab">PCE, septiembre</span>
          <span className="num" style={{ fontSize: 88 }}>3,6 %</span>
        </Card>
        <Card say="tres+0.6" style={{ left: 442, top: 528, width: 418 }}>
          <span className="lab">Sin comida ni energía</span>
          <span className="num" style={{ fontSize: 88 }}>3,1 %</span>
        </Card>
      </Stage>
      <Src>Objetivo: inflación del 2 % a largo plazo medida con el PCE (Reserva Federal). PCE, septiembre de 2026 contra septiembre de 2025: BEA vía FRED, cálculo propio.</Src>
    </Board>
  );
};
