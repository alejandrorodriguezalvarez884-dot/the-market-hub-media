// The two queues written down: buyers leave what they would pay (99, 98), sellers what they ask (101, 102)
import React from "react";
import { useSay } from "@mh/kit";
import { Board, Card, Head, Hi, Machine, Order, Src, Stage } from "./look/libro";

export default () => {
  const b1 = useSay("noventa y nueve"), b2 = useSay("noventa y ocho"), s1 = useSay("ciento uno"), s2 = useSay("ciento dos");
  return (
    <Board>
      <Head><h1>Cada uno deja<br /><Hi say="escrito">escrito</Hi> su precio</h1></Head>
      <Stage>
        <Machine lo={97} hi={103} top={89} ticks={[{ t: -30, price: 100 }]} strip={false} puck={false}>
          <Order side="buy" price={99} at={b1} />
          <Order side="buy" price={98} at={b2} />
          <Order side="sell" price={101} at={s1} />
          <Order side="sell" price={102} at={s2} />
        </Machine>
        <Card say="vendedores" tone="sell" style={{ left: 0, top: 150, width: 300 }}>
          <span className="lab">Vendedores</span>Cuánto <b>piden</b>
        </Card>
        <Card say="compradores" tone="buy" style={{ left: 0, top: 494, width: 300 }}>
          <span className="lab">Compradores</span>Cuánto <b>pagarían</b>
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Lo más que paga un comprador y lo menos que pide un vendedor: Investor.gov (SEC), «Bid Price».</Src>
    </Board>
  );
};
