// Why it happened: a fund's sale of futures of about 4,100 million dollars met buy orders that were under 1 % of that morning's
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog, useIn } from "./look/libro";

const BASE = 700, FULL_H = 300, SLABS = 25;

export default () => {
  const t = useSeconds();
  const sale = useSay("venta"), orders = useSay("órdenes"), left = useSay("quedaron"), under = useSay("menos");
  const figure = useIn("cuatro mil");
  const box = ease(prog(t, orders, 0.5)), then = ease(prog(t, left, 0.5));
  return (
    <Board layout="flip" lean={-ease(prog(t, sale, 1.4))}>
      <Head><h1>Mucha <Hi tone="sell" say="venta">venta</Hi>,<br />poca <Hi tone="buy" say="órdenes">cola</Hi></h1></Head>
      <Stage>
        <Svg>
          <g opacity={box}>
            <Panel y={270} h={510} />
            <text className="mono" x={36} y={322} fontSize={21} fill={DIM} letterSpacing="0.14em">ÓRDENES DE COMPRA ESPERANDO</text>
          </g>
          {/* that morning: a full stack of buy orders */}
          {Array.from({ length: SLABS }, (_, i) => {
            const p = ease(prog(t, orders + 0.15 + i * 0.03, 0.35));
            return <rect key={i} x={90} y={BASE - (i + 1) * 12 + 2 - (1 - p) * 16} width={240} height={10} rx={3} fill={BUY} opacity={clamp(p * 1.6) * 0.85} />;
          })}
          {/* during the fall: the same box, and a sliver left at its foot */}
          <g opacity={then}>
            <text className="mono" x={210} y={746} textAnchor="middle" fontSize={20} fill={FG} letterSpacing="0.14em">ESA MAÑANA</text>
            <text className="mono" x={650} y={746} textAnchor="middle" fontSize={20} fill={FG} letterSpacing="0.14em">DURANTE LA CAÍDA</text>
            <g stroke={DIM} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1={370} x2={370 + 120 * then} y1={550} y2={550} />
              <path d={`M ${474 + 120 * (then - 1)} 536 L ${490 + 120 * (then - 1)} 550 L ${474 + 120 * (then - 1)} 564`} />
            </g>
            <rect x={530} y={BASE - FULL_H} width={240} height={FULL_H} rx={6} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
            <rect x={530} y={BASE - 2.5} width={240} height={2.5} fill={BUY} style={glow("rgba(52,227,161,0.9)", 10)} />
          </g>
          <line x1={650} x2={650} y1={668} y2={690} stroke={FG} strokeWidth={3} strokeLinecap="round" opacity={ease(prog(t, under + 0.2, 0.4))} />
          <Tag x={650} y={640} w={270} h={56} size={23} tone="key" show={ease(prog(t, under, 0.45))}>MENOS DEL 1 %</Tag>
        </Svg>
        <Card say="informe" style={{ left: 0, top: 0, width: 860, padding: "16px 26px" }}>
          <span className="lab" style={{ marginBottom: 0 }}>Informe oficial · SEC y CFTC</span>
        </Card>
        <Card say="fondo" tone="sell" style={{ left: 0, top: 84, width: 860, height: 166 }}>
          <span className="lab">Un fondo lanza una venta de futuros</span>
          <span className="num mid" style={{ opacity: figure }}>≈ {es(4100)} <span style={{ fontSize: 40, letterSpacing: 0 }}>millones de dólares</span></span>
        </Card>
      </Stage>
      <Src>SEC y CFTC, informe sobre el 6 de mayo de 2010. La cola es la del contrato de futuros donde se lanzó la venta.</Src>
    </Board>
  );
};
