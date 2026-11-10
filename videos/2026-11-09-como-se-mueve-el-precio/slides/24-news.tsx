// A piece of news changes everybody's sums at once: the whole book moves up two rows and the price jumps. That explains part of the movement, only part
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, Deal, Head, Hi, Machine, Order, Pulse, Rusher, Src, Stage, clamp, ease, prog } from "./look/libro";

const ROWS = { lo: 98, hi: 104, top: 16, row: 86 };
const UP = 2; // how many euros everybody's price moves with the news

export default () => {
  const t = useSeconds();
  const news = useSay("noticia"), all = useSay("todos"), jump = useSay("salta");
  const flag = ease(prog(t, news, 0.5));
  const moved = ease(prog(t, all, 0.7));
  const label = (price: number) => `${moved < 0.5 ? price - UP : price} €`;
  return (
    <Board lean={0.8 * ease(prog(t, all, 1))}>
      <Head><h1>Una noticia,<br />y el precio<br /><Hi tone="buy" say="salta">salta</Hi></h1></Head>
      <Stage>
        <Machine {...ROWS} ticks={[{ t: -30, price: 100 }, { t: jump, price: 103 }]} note="EL PRECIO, TRATO A TRATO">
          <g transform={`translate(0, ${((1 - moved) * UP * ROWS.row).toFixed(2)})`}>
            <Order side="sell" price={104} label={label(104)} />
            <Order side="sell" price={103} label={label(103)} gone={jump} />
            <Order side="buy" price={101} label={label(101)} />
            <Order side="buy" price={100} label={label(100)} />
          </g>
          <Rusher side="buy" price={103} at={jump} from={jump - 0.55} show={all + 0.35} />
          <Deal price={103} at={jump} />
          <g opacity={clamp(flag * 1.6)} transform={`translate(0, ${((1 - flag) * -16).toFixed(2)})`}>
            <rect x={18} y={34} width={276} height={56} rx={28} fill="#0c0e13" stroke={ACC} strokeWidth={2} />
            <text className="mono" x={157} y={69} textAnchor="middle" fontSize={19} fill={ACC} letterSpacing="0.12em">LLEGA UNA NOTICIA</text>
          </g>
          <Pulse x={156} y={62} at={news} size={110} color={ACC} />
        </Machine>
        <Card say="parte" tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Eso explica <b>una parte</b> del movimiento. Solo una parte.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
