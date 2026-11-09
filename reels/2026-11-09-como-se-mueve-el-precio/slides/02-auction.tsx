// The auction that never ends: buyers below say what they would pay, sellers above what they ask
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BOOK, Board, Card, Head, Hi, Machine, Order, Src, Stage, Tag, ease, prog, rowY } from "./look/libro";

const ROWS = { lo: 97, hi: 103, top: 16, row: 86 };

export default () => {
  const t = useSeconds();
  const below = useSay("abajo"), pays = useSay("pagaría"), above = useSay("arriba"), asks = useSay("pide");
  const gap = ease(prog(t, asks - 0.25, 0.4));
  return (
    <Board>
      <Head><h1>Una <Hi say="subasta">subasta</Hi><br />que no acaba nunca</h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: 0, price: 100 }]} strip={false} puck={false}>
          {[101, 102, 103].map((p, i) => <Order key={p} side="sell" price={p} at={0.5 + i * 0.16} tagAt={asks - 1.0 + i * 0.2} />)}
          {[99, 98, 97].map((p, i) => <Order key={p} side="buy" price={p} at={0.3 + i * 0.16} tagAt={pays - 0.5 + i * 0.2} />)}
          <Tag x={BOOK.x + 187} y={rowY(ROWS, 100)} w={374} h={52} size={19} show={gap}>NADIE CEDE: NO HAY TRATO</Tag>
        </Machine>
        <Card say={above} tone="sell" style={{ left: 0, top: 26, width: 304 }}>
          <span className="lab">Arriba</span>
          <b>Vendedores</b>
          <small>Cada uno dice cuánto pide</small>
        </Card>
        <Card say={0.2} style={{ left: 0, top: 244, width: 304 }}>
          <span className="lab">Ejemplo</span>
          <b>Una acción cualquiera</b>
        </Card>
        <Card say={below} tone="buy" style={{ left: 0, top: 438, width: 304 }}>
          <span className="lab">Abajo</span>
          <b>Compradores</b>
          <small>Cada uno dice cuánto pagaría</small>
        </Card>
        <Card say={asks - 0.05} tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Nadie acepta el precio del otro: <b>no pasa nada</b>.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. Precio de compra (bid) y de venta (ask): Investor.gov, glosario de la SEC.</Src>
    </Board>
  );
};
