// Chapter 3 opens: "more buyers than sellers" cannot be, because every share somebody buys, somebody else sells
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Card, Chapter, DIM, FG, GLASS, HAIR, Panel, SELL, Stage, Svg, Tag, Who, clamp, ease, prog } from "./look/libro";

const ROWS = [424, 516, 608];

export default () => {
  const t = useSeconds();
  const myth = useSay("más compradores"), no = useSay("no puede"), each = useSay("cada acción"), buys = useSay("compra"), sells = useSay("otro");
  const m = ease(prog(t, myth, 0.6));
  const x = ease(prog(t, no, 0.45));
  return (
    <Chapter n={3} title={<>La prisa</>}>
      <Stage>
        <Svg>
          {/* what one hears: more buyers than sellers, so it goes up */}
          <g opacity={m} transform={`translate(0, ${((1 - m) * 24).toFixed(2)})`}>
            <Panel y={20} h={230} />
            <text className="mono" x={36} y={70} fontSize={21} fill={DIM} letterSpacing="0.14em">LO QUE SE OYE</text>
            <g opacity={1 - 0.6 * x}>
              {[0, 1, 2, 3, 4].map((i) => <Who key={i} x={76 + i * 74} y={162} r={30} side="buy" opacity={clamp(ease(prog(t, myth + i * 0.06, 0.4)) * 1.6)} />)}
              <text x={470} y={190} textAnchor="middle" fontSize={84} fontWeight={700} fill={FG}>&gt;</text>
              {[0, 1].map((i) => <Who key={i} x={566 + i * 74} y={162} r={30} side="sell" />)}
              <Tag x={770} y={162} w={136} h={52} size={22} tone="buy">▲ SUBE</Tag>
            </g>
            <line x1={36} x2={36 + 788 * x} y1={162} y2={162} stroke={FG} strokeWidth={6} strokeLinecap="round" opacity={x > 0 ? 1 : 0} />
          </g>
          <Tag x={430} y={250} w={300} h={58} size={24} tone="key" show={x}>NO PUEDE SER</Tag>

          {/* every share that changes hands has one buyer and one seller */}
          <Tag x={150} y={340} w={190} h={46} size={19} tone="buy" show={ease(prog(t, buys, 0.45))}>LA COMPRA</Tag>
          <Tag x={710} y={340} w={190} h={46} size={19} tone="sell" show={ease(prog(t, sells, 0.45))}>LA VENDE</Tag>
          {ROWS.map((y, i) => {
            const chip = ease(prog(t, each + i * 0.12, 0.5));
            const b = ease(prog(t, buys + i * 0.1, 0.5)), s = ease(prog(t, sells + i * 0.1, 0.5));
            return (
              <g key={y}>
                <line x1={335} x2={335 - 151 * b} y1={y} y2={y} stroke={BUY} strokeWidth={3} strokeLinecap="round" opacity={b > 0 ? 0.7 : 0} />
                <line x1={525} x2={525 + 151 * s} y1={y} y2={y} stroke={SELL} strokeWidth={3} strokeLinecap="round" opacity={s > 0 ? 0.7 : 0} />
                <Who x={150} y={y} r={34} side="buy" opacity={clamp(b * 1.6)} scale={0.7 + 0.3 * b} />
                <Who x={710} y={y} r={34} side="sell" opacity={clamp(s * 1.6)} scale={0.7 + 0.3 * s} />
                <g opacity={clamp(chip * 1.6)} transform={`translate(0, ${((1 - chip) * 18).toFixed(2)})`}>
                  <rect x={335} y={y - 30} width={190} height={60} rx={16} fill="#0c0e13" />
                  <rect x={335} y={y - 30} width={190} height={60} rx={16} fill={GLASS} stroke={HAIR} strokeWidth={1.5} />
                  <text className="mono" x={430} y={y + 8} textAnchor="middle" fontSize={22} fill={FG} letterSpacing="0.12em">1 ACCIÓN</text>
                </g>
              </g>
            );
          })}
        </Svg>
        <Card say="siempre" tone="key" style={{ left: 0, top: 680, width: 860 }}>
          Siempre se compran <b>tantas como se venden</b>.
        </Card>
      </Stage>
    </Chapter>
  );
};
