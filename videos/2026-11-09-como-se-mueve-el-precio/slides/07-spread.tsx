// The gap between the buyer who pays most (99) and the seller who asks least (101): the spread. Nobody crosses, no deal
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BUY, Board, Card, DIM, FG, FULL, Head, Hi, SELL, Src, Stage, Svg, Tag, Who, useIn } from "./look/libro";

const Band: React.FC<{ y: number; side: "buy" | "sell"; label: string; price: string; show: number }> = ({ y, side, label, price, show }) => {
  const c = side === "buy" ? BUY : SELL;
  return (
    <g opacity={0.25 + 0.75 * show}>
      <rect x={0} y={y} width={FULL.w} height={170} rx={85} fill={c} fillOpacity={0.05 + 0.09 * show} stroke={c} strokeOpacity={0.3 + 0.5 * show} strokeWidth={2} />
      <Who x={92} y={y + 85} r={50} side={side} />
      <text className="mono" x={184} y={y + 96} fontSize={30} fill={c} letterSpacing="0.14em">{label}</text>
      <text x={FULL.w - 64} y={y + 124} textAnchor="end" fontSize={112} fontWeight={700} fill={FG} letterSpacing="-0.03em">{price}</text>
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const buyer = useIn("comprador"), seller = useIn("vendedor"), gap = useIn("hueco"), name = useIn("horquilla");
  const beat = 0.5 + 0.5 * Math.sin(t * 3.2);
  return (
    <Board layout="full">
      <Head><h1>Entre los dos queda un hueco: la <Hi say="horquilla">horquilla</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Band y={10} side="sell" label="EL VENDEDOR QUE MENOS PIDE" price="101 €" show={seller} />
          <Band y={510} side="buy" label="EL COMPRADOR QUE MÁS PAGA" price="99 €" show={buyer} />
          <g opacity={gap}>
            <rect x={40} y={204} width={FULL.w - 80} height={282} rx={36} fill={ACC} fillOpacity={0.05 + 0.03 * beat} stroke={ACC} strokeOpacity={0.7} strokeWidth={2.5} strokeDasharray="4 12" strokeLinecap="round" />
            <line x1={1560} x2={1560} y1={226} y2={464} stroke={ACC} strokeWidth={4} strokeLinecap="round" />
            <line x1={1540} x2={1580} y1={226} y2={226} stroke={ACC} strokeWidth={4} strokeLinecap="round" />
            <line x1={1540} x2={1580} y1={464} y2={464} stroke={ACC} strokeWidth={4} strokeLinecap="round" />
            <text x={1530} y={368} textAnchor="end" fontSize={72} fontWeight={700} fill={ACC} letterSpacing="-0.02em">2 €</text>
            <text className="mono" x={184} y={330} fontSize={30} fill={DIM} letterSpacing="0.14em" opacity={1 - name}>EL HUECO</text>
          </g>
          <Tag x={372} y={300} w={380} h={74} size={34} tone="key" show={name}>HORQUILLA</Tag>
        </Svg>
        <Card say="trato" style={{ left: 184, top: 370, width: 960, padding: "14px 26px" }}>
          Nadie lo cruza: <b>no hay trato</b> y el precio no cambia.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros. La diferencia entre el bid y el ask es el «spread», la horquilla: Investor.gov (SEC), «Bid Price».</Src>
    </Board>
  );
};
