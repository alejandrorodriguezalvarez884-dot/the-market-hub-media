// What sets the price: an auction that never closes during the session (the machine, running), and the two questions the video answers
import React from "react";
import { useScene } from "@mh/kit";
import { Board, Card, Head, Hi, Machine, Order, Src, Stage, Tick } from "./look/libro";

export default () => {
  const { spoken } = useScene();
  // The last deal bounces between the best seller and the best buyer for as long as the scene is told
  const ticks: Tick[] = [{ t: -30, price: 101 }];
  for (let at = 1.5, k = 0; at < spoken - 1.2; at += k % 3 === 1 ? 1.9 : 1.3, k += 1) ticks.push({ t: at, price: k % 2 ? 101 : 99 });
  const text: React.CSSProperties = { fontSize: 42, lineHeight: 1.14, display: "block" };
  return (
    <Board layout="full">
      <Head><h1>Lo pone una <Hi say="subasta">subasta</Hi> que no cierra</h1></Head>
      <Stage>
        <div style={{ position: "absolute", left: 440, top: 0, width: 860, height: 690 }}>
          <Machine lo={97} hi={103} ticks={ticks} h={690} note="EL PRECIO, TRATO A TRATO">
            <Order side="sell" price={102} />
            <Order side="sell" price={101} />
            <Order side="buy" price={99} />
            <Order side="buy" price={98} />
          </Machine>
        </div>
        <Card say="por qué" style={{ left: 0, top: 196, width: 400, padding: "24px 28px" }}>
          <span className="lab">Pregunta 1</span>
          <span style={text}>¿Por qué se mueve <b>aunque no pase nada</b>?</span>
        </Card>
        <Card say="cuánto" style={{ left: 1340, top: 196, width: 400, padding: "24px 28px" }}>
          <span className="lab">Pregunta 2</span>
          <span style={text}>¿Cuánto movimiento <b>es normal</b>?</span>
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
