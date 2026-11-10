// Bad news: the hurry changes sides. Sellers take what the buyers pay, 99, 98, and the price steps down
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, LANE, Machine, Order, Rusher, Src, Stage, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 96, hi: 102, top: 16, row: 86 };

export default () => {
  const t = useSeconds();
  const sellers = useSay("vendedores"), a = useSay("noventa y nueve"), b = useSay("noventa y ocho");
  return (
    <Board layout="flip" lean={-ease(prog(t, sellers, 1.2))}>
      <Head><h1>La <Hi tone="sell" say="prisa">prisa</Hi><br />cambia de lado</h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: -30, price: 100 }, { t: a, price: 99 }, { t: b, price: 98 }]} note="EL PRECIO, TRATO A TRATO">
          <Order side="sell" price={102} />
          <Order side="sell" price={101} />
          <Order side="buy" price={99} gone={a} />
          <Order side="buy" price={98} gone={b} />
          <Order side="buy" price={97} />
          <Order side="buy" price={96} />
          <Rusher side="sell" price={99} at={a} show={sellers} wait={[LANE.x, rowY(ROWS, 102)]} phase={0.1} />
          <Rusher side="sell" price={98} at={b} show={sellers + 0.15} wait={[LANE.x, rowY(ROWS, 101)]} phase={0.6} />
          <Deal price={99} at={a} />
          <Deal price={98} at={b} />
          {/* those who wait follow the price down */}
          <Order side="sell" price={100} at={a + 0.6} />
          <Order side="sell" price={99} at={b + 0.6} />
        </Machine>
        <Card say="mala" tone="sell" style={{ left: 20, top: 500, width: 250, padding: "16px 22px" }}>
          <span className="lab" style={{ marginBottom: 0 }}>Mala noticia</span>
        </Card>
        <Card say="baja" tone="sell" style={{ left: 0, top: 656, width: 860 }}>
          <b>▼ Baja.</b> Quien tiene prisa acepta lo que le pagan.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Una orden a mercado se ejecuta de inmediato, sin garantía de precio: Investor.gov (SEC), «Types of Orders».</Src>
    </Board>
  );
};
