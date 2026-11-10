// The recap: the machine once more (an auction that never stops, the price is the last deal) beside the three things under the figure
import React from "react";
import { useSay } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, Machine, Order, Rusher, Src, Stage, Tick } from "./look/libro";

export default () => {
  const last = useSay("último"), hurry = useSay("prisa");
  // The auction runs from before the scene; the deal the voice names is the one the buyer in a hurry makes
  const ticks: Tick[] = [{ t: -30, price: 99 }, { t: -4.6, price: 101 }, { t: -2.4, price: 99 }];
  for (let at = 1.2, k = 0; at < last - 0.6; at += 1.5, k += 1) ticks.push({ t: at, price: k % 2 ? 99 : 101 });
  if (ticks[ticks.length - 1].price === 101) ticks.push({ t: Math.max(last - 0.3, 0.1), price: 99 });
  ticks.push({ t: hurry, price: 101 });
  const text: React.CSSProperties = { fontSize: 41, lineHeight: 1.16, display: "block" };
  return (
    <Board layout="full" lean={0.4}>
      <Head><h1>Lo que hay debajo de <Hi say="cifra">esa cifra</Hi></h1></Head>
      <Stage>
        <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 690 }}>
          <Machine lo={97} hi={103} ticks={ticks} h={690} note="EL PRECIO, TRATO A TRATO">
            <Order side="sell" price={102} />
            <Order side="sell" price={101} />
            <Order side="buy" price={99} />
            <Order side="buy" price={98} />
            <Rusher side="buy" price={101} at={hurry} from={hurry - 0.7} show={last} />
            <Deal price={101} at={hurry} />
          </Machine>
        </div>
        <Card say="subasta" style={{ left: 930, top: 14, width: 810, padding: "22px 30px" }}>
          <span className="lab">Uno</span>
          <span style={text}><b>Una subasta</b> que no para</span>
        </Card>
        <Card say={last} tone="key" style={{ left: 930, top: 178, width: 810, padding: "22px 30px" }}>
          <span className="lab">Dos</span>
          <span style={text}>El precio es <b>el último trato</b>: uno que esperaba y uno con prisa</span>
        </Card>
        <Card say="millones" style={{ left: 930, top: 392, width: 810, padding: "22px 30px" }}>
          <span className="lab">Tres</span>
          <span style={text}><b>Millones de cuentas distintas</b> sobre un futuro que nadie conoce</span>
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
