// Good news: buyers in a hurry take the cheapest asks one after another, and each deal is higher
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, LANE, Machine, Order, Rusher, Src, Stage, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 98, hi: 104, top: 16, row: 86 };

export default () => {
  const t = useSeconds();
  const enter = useSay("entran"), a = useSay("llevan"), b = useSay("queda"), c = useSay("arriba"), up = useSay("sube");
  return (
    <Board lean={ease(prog(t, enter, 1.2))}>
      <Head><h1>Prisa por <Hi tone="buy" say="compradores">comprar</Hi>:<br />el precio sube</h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: -30, price: 100 }, { t: a, price: 101 }, { t: b, price: 102 }, { t: c, price: 103 }]} note="EL GRÁFICO">
          <Order side="sell" price={104} />
          <Order side="sell" price={103} gone={c} />
          <Order side="sell" price={102} gone={b} />
          <Order side="sell" price={101} gone={a} />
          <Order side="buy" price={99} />
          <Order side="buy" price={98} />
          <Rusher side="buy" price={101} at={a} show={enter} wait={[LANE.x, rowY(ROWS, 100)]} phase={0.1} />
          <Rusher side="buy" price={102} at={b} show={enter + 0.15} wait={[LANE.x, rowY(ROWS, 99)]} phase={0.5} />
          <Rusher side="buy" price={103} at={c} show={enter + 0.3} wait={[LANE.x, rowY(ROWS, 98)]} phase={0.8} />
          <Deal price={101} at={a} />
          <Deal price={102} at={b} />
          <Deal price={103} at={c} />
          {/* those who wait follow the price up */}
          <Order side="buy" price={100} at={a + 0.6} />
          <Order side="buy" price={101} at={b + 0.6} />
          <Order side="buy" price={102} at={c + 0.6} />
        </Machine>
        <Card say="buena" tone="buy" style={{ left: 20, top: 36, width: 272, padding: "16px 22px" }}>
          <span className="lab" style={{ marginBottom: 0 }}>Buena noticia</span>
        </Card>
        <Card say={up} tone="buy" style={{ left: 0, top: 656, width: 860 }}>
          <b>▲ Sube.</b> Quien tiene prisa paga lo que le piden.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Una orden a mercado se ejecuta de inmediato, sin garantía de precio: Investor.gov (SEC).</Src>
    </Board>
  );
};
