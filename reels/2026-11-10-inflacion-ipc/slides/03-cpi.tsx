// That basket, measured every month, is the CPI (IPC in Spanish): what it is and who publishes it
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

const MONTHS = ["NOV", "DIC", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT"];

export default () => {
  const t = useSeconds();
  const month = useSay("mes"), ipc = useSay("ipc"), cpi = useSay("cpi");
  return (
    <Board>
      <Head><h1>Esa cesta, cada mes:<br />el <Hi say="ipc">IPC</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={300} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">UNA MEDIDA CADA MES</text>
          {MONTHS.map((m, i) => {
            const x = 64 + i * 67, on = ease(prog(t, month - 0.4 + i * 0.09, 0.3));
            const last = i === MONTHS.length - 1;
            return (
              <g key={m + i}>
                <rect x={x - 26} y={110 - on * 10} width={52} height={70} rx={10} fill={last ? FG : ACC} fillOpacity={last ? on : 0.18 + 0.5 * on} stroke={ACC} strokeOpacity={0.6} strokeWidth={1.5}
                  style={last && on > 0.5 ? glow("rgba(255,255,255,0.6)", 12) : undefined} />
                <path d={`M ${x - 13} ${142 - on * 10} L ${x + 13} ${142 - on * 10} L ${x + 9} ${162 - on * 10} L ${x - 9} ${162 - on * 10} Z`} fill={last ? "#07080b" : FG} opacity={0.3 + 0.7 * on} />
                <text className="mono" x={x} y={226} textAnchor="middle" fontSize={18} fill={last ? FG : DIM}>{m}</text>
              </g>
            );
          })}
          <Tag x={430} y={268} w={420} h={46} size={19} show={ease(prog(t, month + 0.8, 0.4))}>DE NOV 2025 A OCT 2026</Tag>
        </Svg>
        <Card say="ipc" tone="key" style={{ left: 0, top: 326, width: 860 }}>
          <span className="lab">IPC · Índice de Precios al Consumo</span>
          <span className="num mid">El precio de la cesta</span>
        </Card>
        <Card say="cpi" style={{ left: 0, top: 518, width: 860 }}>
          <span className="lab">En inglés</span>
          <b style={{ fontSize: 56 }}>CPI</b> · Consumer Price Index
          <small>Lo publica cada mes la Oficina de Estadísticas Laborales de EE. UU. (BLS). El próximo, el 10 de diciembre a las 14:30 h de España.</small>
        </Card>
      </Stage>
      <Src>BLS, IPC de octubre de 2026 (10 nov 2026), con la fecha del siguiente.</Src>
    </Board>
  );
};
