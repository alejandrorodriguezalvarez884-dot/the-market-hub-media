// The closing question for the comments: which surprised you more, half the shares trading off the exchanges or fewer than 2 % pricing them all
import React from "react";
import { useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, GLASS, HAIR, Head, Hi, Src, Stage, Svg, Tag, es, useIn } from "./look/libro";

const OFF = figures.cboe.october_off_pct, MOVED = figures.nvda.turnover_pct;
const text: React.CSSProperties = { fontSize: 44, lineHeight: 1.14, display: "block" };
const key: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 19, letterSpacing: "0.12em", display: "flex", justifyContent: "space-between", marginTop: 10, opacity: 0.75 };

// A bar of all the shares with a share of it lit
const Part: React.FC<{ pct: number }> = ({ pct }) => (
  <div style={{ position: "relative", height: 26, marginTop: 22, borderRadius: 9, background: GLASS, border: `1.5px solid ${HAIR}` }}>
    <div style={{ position: "absolute", left: 0, top: -4, bottom: -4, width: `${pct}%`, minWidth: 8, borderRadius: 6, background: ACC, boxShadow: "0 0 16px rgba(157,184,255,0.7)" }} />
  </div>
);

export default () => {
  useSeconds();
  const ask = useIn("comentarios");
  return (
    <Board>
      <Head><h1>¿Qué te ha<br />sorprendido<br /><Hi say="más">más</Hi>?</h1></Head>
      <Stage>
        <Card say="mitad" style={{ left: 0, top: 0, width: 860, padding: "26px 32px" }}>
          <span className="lab">Opción A</span>
          <span style={text}>La mitad de las acciones se negocia <b>fuera de las bolsas</b></span>
          <Part pct={OFF} />
          <span style={key}><span>FUERA DE LAS BOLSAS · {es(OFF, 0)} %</span><span>EN LAS BOLSAS</span></span>
        </Card>
        <Card say="menos" style={{ left: 0, top: 330, width: 860, padding: "26px 32px" }}>
          <span className="lab">Opción B</span>
          <span style={text}>Menos del 2 % <b>pone precio a todas</b></span>
          <Part pct={MOVED} />
          <span style={key}><span>CAMBIARON DE MANOS · {es(MOVED, 2)} %</span><span>NADIE LAS VENDIÓ</span></span>
        </Card>
        <Svg>
          <Tag x={430} y={724} w={540} h={64} size={25} tone="key" show={ask}>TE LEO EN LOS COMENTARIOS</Tag>
        </Svg>
      </Stage>
      <Src>La mitad: acciones negociadas fuera de las bolsas en EE. UU. en octubre de 2026, Cboe. Menos del 2 %: Nvidia el 9 de noviembre de 2026, Yahoo Finance y SEC.</Src>
    </Board>
  );
};
