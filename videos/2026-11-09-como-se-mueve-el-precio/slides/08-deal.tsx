// Somebody is in a hurry: a buyer accepts the 101 the seller asks. A deal, and that deal becomes the price
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, Deal, Head, Hi, LANE, Machine, Order, Rusher, Src, Stage, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 97, hi: 103, top: 16, row: 86 };

export default () => {
  const t = useSeconds();
  const hurry = useSay("prisa"), deal = useSay("hay trato"), price = useSay("el precio");
  return (
    <Board layout="flip" lean={ease(prog(t, hurry, 1)) * 0.7}>
      <Head><h1>Alguien tiene <Hi tone="buy" say="prisa">prisa</Hi>:<br />hay trato</h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: -30, price: 101 }]} strip={price + 0.2} puck={price} note="EL PRECIO, TRATO A TRATO">
          <Order side="sell" price={102} />
          <Order side="sell" price={101} gone={deal} />
          <Order side="buy" price={99} />
          <Order side="buy" price={98} />
          <Rusher side="buy" price={101} at={deal} from={deal - 0.7} show={hurry} wait={[LANE.x, rowY(ROWS, 99)]} />
          <Deal price={101} at={deal} />
        </Machine>
        <Card say={price} tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Ese trato, entre dos, <b>pasa a ser el precio</b>.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. El último precio es el de la operación más reciente: Nasdaq, glosario, «Last sale».</Src>
    </Board>
  );
};
