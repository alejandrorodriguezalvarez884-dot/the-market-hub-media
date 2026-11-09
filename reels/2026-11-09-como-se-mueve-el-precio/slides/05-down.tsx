// Bad news: now the hurry is the sellers', who take what they are offered, and the price falls
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, LANE, Machine, Order, Rusher, Src, Stage, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 98, hi: 104, top: 16, row: 86 };

export default () => {
  const t = useSeconds();
  const enter = useSay("prisa"), a = useSay("aceptan"), b = useSay("ofrecen"), c = useSay("baja");
  return (
    <Board lean={-ease(prog(t, enter, 1.2))}>
      <Head><h1>Prisa por <Hi tone="sell" say="vendedores">vender</Hi>:<br />el precio baja</h1></Head>
      <Stage>
        <Machine {...ROWS} note="EL GRÁFICO"
          ticks={[{ t: -30, price: 100 }, { t: -5.4, price: 101 }, { t: -3.9, price: 102 }, { t: -2.2, price: 103 }, { t: a, price: 102 }, { t: b, price: 101 }, { t: c, price: 100 }]}>
          <Order side="sell" price={104} />
          <Order side="buy" price={102} gone={a} />
          <Order side="buy" price={101} gone={b} />
          <Order side="buy" price={100} gone={c} />
          <Order side="buy" price={99} />
          <Order side="buy" price={98} />
          <Rusher side="sell" price={102} at={a} show={enter} wait={[LANE.x, rowY(ROWS, 104)]} phase={0.1} />
          <Rusher side="sell" price={101} at={b} show={enter + 0.15} wait={[LANE.x, rowY(ROWS, 103)]} phase={0.5} />
          <Rusher side="sell" price={100} at={c} show={enter + 0.3} wait={[LANE.x, rowY(ROWS, 102)]} phase={0.8} />
          <Deal price={102} at={a} />
          <Deal price={101} at={b} />
          <Deal price={100} at={c} />
          {/* those who wait follow the price down */}
          <Order side="sell" price={103} at={a + 0.6} />
          <Order side="sell" price={102} at={b + 0.6} />
          <Order side="sell" price={101} at={c + 0.2} />
        </Machine>
        <Card say="mala" tone="sell" style={{ left: 20, top: 476, width: 272, padding: "16px 22px" }}>
          <span className="lab" style={{ marginBottom: 0 }}>Mala noticia</span>
        </Card>
        <Card say={c} tone="sell" style={{ left: 0, top: 656, width: 860 }}>
          <b>▼ Baja.</b> Quien tiene prisa acepta lo que le ofrecen.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Una orden a mercado se ejecuta de inmediato, sin garantía de precio: Investor.gov (SEC).</Src>
    </Board>
  );
};
