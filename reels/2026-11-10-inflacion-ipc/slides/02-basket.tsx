// What inflation is: a basket of what you buy in a year, 100 euros today and 104 in a year, is 4 % inflation (a made-up example)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BG, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, es, glow, prog } from "./look/libro";

// The things in the basket, drawn as simple marks: [label, x, y, width, height]
const ITEMS: [string, number, number, number, number][] = [
  ["PAN", 236, 166, 120, 62], ["LUZ", 368, 166, 96, 62], ["GASOLINA", 476, 166, 150, 62], ["ALQUILER", 284, 92, 170, 62], ["MÓVIL", 466, 92, 120, 62],
];

export default () => {
  const t = useSeconds();
  const basket = useSay("cesta"), today = useSay("hoy"), later = useSay("ciento"), four = useSay("cuatro#2");
  const price = 100 + 4 * ease(prog(t, later, 0.9));
  return (
    <Board>
      <Head><h1>La inflación:<br />una <Hi say="cesta">cesta</Hi> más cara</h1></Head>
      <Stage>
        <Svg>
          <Panel h={420} />
          {ITEMS.map(([label, x, y, w, h], i) => {
            const drop = ease(prog(t, basket + 0.1 + i * 0.12, 0.45));
            return (
              <g key={label} transform={`translate(0, ${((1 - drop) * -60).toFixed(1)})`} opacity={drop}>
                <rect x={x} y={y} width={w} height={h} rx={14} fill={ACC} fillOpacity={0.16} stroke={ACC} strokeWidth={2} />
                <text className="mono" x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fontSize={18} fill={FG} letterSpacing="0.1em">{label}</text>
              </g>
            );
          })}
          <path d="M 200 236 L 660 236 L 620 380 L 240 380 Z" fill="#12151b" stroke={FG} strokeWidth={4} strokeLinejoin="round" />
          {[290, 350, 410, 470, 530, 590].map((x) => <line key={x} x1={x} x2={x - 8 + (x - 430) * 0.08} y1={252} y2={366} stroke="#fff" strokeOpacity={0.14} strokeWidth={3} />)}
          <Tag x={430} y={318} w={210} h={70} size={36} tone="key" show={ease(prog(t, today, 0.35))}>{es(price, 0)} €</Tag>
        </Svg>
        <Card say="hoy" style={{ left: 0, top: 444, width: 418 }}>
          <span className="lab">Hoy</span>
          <span className="num" style={{ fontSize: 84 }}>100 €</span>
        </Card>
        <Card say="ciento" style={{ left: 442, top: 444, width: 418 }}>
          <span className="lab">Dentro de un año</span>
          <span className="num" style={{ fontSize: 84 }}>104 €</span>
        </Card>
        <Card say={four} tone="key" style={{ left: 0, top: 620, width: 860 }}>
          <span className="lab">Inflación</span>
          <span className="num mid">+4 % en un año</span>
        </Card>
      </Stage>
      <Src>Ejemplo inventado: la cesta y sus precios en euros no son datos.</Src>
    </Board>
  );
};
