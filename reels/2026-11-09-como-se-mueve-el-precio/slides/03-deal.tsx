// A deal: one takes the other's price, and the price on the screen is that of the last deal
import React from "react";
import { useSay } from "@mh/kit";
import { BOOK, Board, Card, Deal, Head, Hi, Machine, Order, Rusher, Src, Stage, rowY } from "./look/libro";

const ROWS = { lo: 97, hi: 103, top: 16, row: 86 };

export default () => {
  const gives = useSay("acepta"), deal = useSay("trato"), screen = useSay("pantalla"), last = useSay("último");
  return (
    <Board>
      <Head><h1>El precio es el<br /><Hi say="último">último trato</Hi></h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: 0, price: 101 }, { t: deal, price: 101 }, { t: last, price: 100 }]} strip={screen} puck={deal} note="EL GRÁFICO">
          <Order side="sell" price={103} />
          <Order side="sell" price={102} />
          <Order side="sell" price={101} gone={deal} />
          <Order side="buy" price={99} walks={gives} />
          <Order side="buy" price={98} />
          <Order side="buy" price={97} />
          <Rusher side="buy" price={101} at={deal} from={gives} wait={[BOOK.x + 33, rowY(ROWS, 99)]} />
          <Deal price={101} at={deal} />
          {/* the auction goes on: new orders come in, and a seller in a hurry takes the 100 */}
          <Order side="sell" price={101} at={deal + 1.1} />
          <Order side="buy" price={100} at={deal + 1.4} gone={last} />
          <Rusher side="sell" price={100} at={last} show={last - 0.9} phase={0.3} />
          <Deal price={100} at={last} />
          <Order side="buy" price={99} at={last + 0.4} />
        </Machine>
        <Card say={screen} tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Lo que ves en pantalla: <b>el precio del último trato</b>.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. «Last sale», la operación más reciente con un valor: glosario de Nasdaq. Tipos de orden: Investor.gov (SEC).</Src>
    </Board>
  );
};
