// Good news: the buyers who waited stop waiting and take the asks one after another, 101, 102, 103
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, LANE, Machine, Order, Rusher, Src, Stage, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 97, hi: 104, top: 10, row: 76 };

export default () => {
  const t = useSeconds();
  const stop = useSay("dejan"), a = useSay("ciento uno"), b = useSay("ciento dos"), c = useSay("ciento tres");
  return (
    <Board lean={ease(prog(t, stop, 1.2))}>
      <Head><h1>Cambia quién<br />tiene <Hi tone="buy" say="prisa">prisa</Hi></h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: -30, price: 100 }, { t: a, price: 101 }, { t: b, price: 102 }, { t: c, price: 103 }]} note="EL PRECIO, TRATO A TRATO">
          <Order side="sell" price={104} />
          <Order side="sell" price={103} gone={c} />
          <Order side="sell" price={102} gone={b} />
          <Order side="sell" price={101} gone={a} />
          <Order side="buy" price={99} walks={stop} />
          <Order side="buy" price={98} walks={stop + 0.15} />
          <Order side="buy" price={97} walks={stop + 0.3} />
          <Rusher side="buy" price={101} at={a} show={stop} wait={[LANE.x, rowY(ROWS, 99)]} phase={0.1} />
          <Rusher side="buy" price={102} at={b} show={stop + 0.15} wait={[LANE.x, rowY(ROWS, 98)]} phase={0.5} />
          <Rusher side="buy" price={103} at={c} show={stop + 0.3} wait={[LANE.x, rowY(ROWS, 97)]} phase={0.8} />
          <Deal price={101} at={a} />
          <Deal price={102} at={b} />
          <Deal price={103} at={c} />
        </Machine>
        <Card say="buena" tone="buy" style={{ left: 20, top: 30, width: 272, padding: "16px 22px" }}>
          <span className="lab" style={{ marginBottom: 0 }}>Buena noticia</span>
        </Card>
        <Card say={c + 0.5} tone="buy" style={{ left: 0, top: 656, width: 860 }}>
          Quien tiene prisa <b>paga lo que le piden</b>.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Una orden a mercado se ejecuta de inmediato, sin garantía de precio: Investor.gov (SEC), «Types of Orders».</Src>
    </Board>
  );
};
