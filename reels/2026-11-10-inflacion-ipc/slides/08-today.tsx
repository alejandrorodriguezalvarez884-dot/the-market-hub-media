// October: 0.4 % on the month and core 0.3 %, a tenth more than expected; no annual rate, because October 2025 was never measured
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, ease, prog } from "./look/libro";

// The thirteen months a year-on-year rate for October 2026 needs; October 2025 is missing (BLS)
const STRIP = ["OCT 25", "NOV", "DIC", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT 26"];

export default () => {
  const t = useSeconds();
  const tenth = useSay("décima"), none = useSay("sin"), shut = useSay("cerrado");
  return (
    <Board lean={-0.25}>
      <Head><h1>Octubre:<br />más de lo <Hi say="esperado">esperado</Hi></h1></Head>
      <Stage>
        <Card style={{ left: 0, top: 0, width: 860, padding: "16px 26px" }}>
          <div className="line" style={{ fontSize: 26 }}><span>En el mes</span><span>Dato · <span style={{ opacity: 0.8 }}>esperado</span></span></div>
          <div className="line" style={{ fontSize: 40 }}><span style={{ color: FG }}>IPC</span><b>+0,4 % <span style={{ color: DIM, fontWeight: 500, opacity: ease(prog(t, tenth, 0.4)) }}>· +0,3 %</span></b></div>
          <div className="line" style={{ fontSize: 40 }}><span style={{ color: FG }}>Subyacente</span><b>+0,3 % <span style={{ color: DIM, fontWeight: 500, opacity: ease(prog(t, tenth, 0.4)) }}>· +0,2 %</span></b></div>
        </Card>
        <Svg>
          <Panel y={262} h={250} />
          <text className="mono" x={28} y={306} fontSize={21} fill={FG} letterSpacing="0.14em">PARA UN DATO ANUAL HACEN FALTA LOS DOS OCTUBRES</text>
          {STRIP.map((m, i) => {
            const x = 52 + i * 63.5, gone = i === 0, on = ease(prog(t, none + i * 0.05, 0.3));
            return (
              <g key={m} opacity={on}>
                <rect x={x - 26} y={340} width={52} height={78} rx={10} fill={gone ? "none" : "#9db8ff"} fillOpacity={gone ? 0 : i === 12 ? 0.9 : 0.3}
                  stroke={gone ? SELL : "#9db8ff"} strokeWidth={gone ? 3 : 1.5} strokeDasharray={gone ? "6 6" : undefined} />
                {gone && <path d="M 14 362 L 38 396 M 38 362 L 14 396" transform={`translate(${x - 26}, 0)`} stroke={SELL} strokeWidth={4} strokeLinecap="round" opacity={ease(prog(t, shut, 0.3))} />}
                <text className="mono" x={x} y={450} textAnchor="middle" fontSize={i === 0 || i === 12 ? 15 : 16} fill={gone ? SELL : DIM}>{m}</text>
              </g>
            );
          })}
          <Tag x={250} y={488} w={420} h={44} size={18} tone="sell" show={ease(prog(t, shut, 0.4))}>OCT 2025: GOBIERNO CERRADO</Tag>
        </Svg>
        <Card say="nadie" tone="key" style={{ left: 0, top: 540, width: 540 }}>
          <span className="lab">Octubre de 2025</span>
          <b style={{ fontSize: 46 }}>No se midieron los precios</b>
        </Card>
        <Card say="nadie+0.8" tone="sell" style={{ left: 562, top: 540, width: 298 }}>
          <span className="lab">S&amp;P 500, 16:35</span>
          <span className="num" style={{ fontSize: 60 }}>−0,37 %</span>
        </Card>
      </Stage>
      <Src>BLS, IPC de octubre de 2026 (10 nov). Esperado: consenso de Dow Jones (CNBC). S&amp;P 500 a las 16:35 h de España, con la sesión abierta: Market Hub (Yahoo Finance).</Src>
    </Board>
  );
};
