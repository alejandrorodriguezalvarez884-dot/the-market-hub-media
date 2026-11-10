// This year the CPI started at 2.4 %, passed 4 % in May and was back at 3.7 % in September (annual rates)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog } from "./look/libro";

// CPI, all items, not seasonally adjusted: change against the same month a year before, January to September 2026 (data/fred-CPIAUCNS.csv, own sums)
const YOY = [2.39, 2.41, 3.26, 3.81, 4.25, 3.53, 3.36, 3.40, 3.74];
const MON = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT"];
const X = (i: number) => 70 + i * 82;
const Y = (v: number) => 470 - ((v - 1.5) / 3.5) * 360;

export default () => {
  const t = useSeconds();
  const start = useSay("empezó"), may = useSay("mayo"), sep = useSay("septiembre");
  const drawn = clamp(prog(t, start - 0.3, Math.max(1, sep - start + 0.5))) * (YOY.length - 1);
  const i = Math.min(YOY.length - 2, Math.floor(drawn)), f = drawn - i;
  const hx = X(i) + (X(i + 1) - X(i)) * f, hy = Y(YOY[i] + (YOY[i + 1] - YOY[i]) * f);
  const pts = YOY.slice(0, i + 1).map((v, k) => `${X(k)},${Y(v).toFixed(1)}`).concat(`${hx.toFixed(1)},${hy.toFixed(1)}`).join(" ");
  const pin = (k: number, at: number, above = true) => {
    const s = ease(prog(t, at, 0.4));
    return <Tag x={X(k)} y={Y(YOY[k]) + (above ? -44 : 48)} w={130} h={46} size={22} tone={k === 8 ? "key" : undefined} show={s}>{es(YOY[k], 1)} %</Tag>;
  };
  return (
    <Board>
      <Head><h1>El IPC en 2026:<br /><Hi say="mayo">sube y baja</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={580} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">IPC · CAMBIO EN UN AÑO</text>
          {[2, 3, 4].map((v) => (
            <g key={v}>
              <line x1={60} x2={830} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.08} strokeWidth={1.5} />
              <text className="mono" x={40} y={Y(v) + 7} textAnchor="middle" fontSize={19} fill={DIM}>{v}</text>
            </g>
          ))}
          <polyline points={pts} fill="none" stroke={ACC} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.6)", 12)} />
          <circle cx={hx} cy={hy} r={11} fill={FG} style={glow("rgba(255,255,255,0.8)", 12)} />
          {pin(0, start)}
          {pin(4, may)}
          {pin(8, sep)}
          <g opacity={ease(prog(t, sep + 0.6, 0.4))}>
            <circle cx={X(9)} cy={Y(3.74)} r={14} fill="none" stroke={DIM} strokeWidth={2.5} strokeDasharray="4 5" />
            <text x={X(9)} y={Y(3.74) + 9} textAnchor="middle" fontSize={24} fill={DIM}>?</text>
          </g>
          {MON.map((m, k) => <text key={m} className="mono" x={X(k)} y={548} textAnchor="middle" fontSize={18} fill={k === 9 ? DIM : FG} opacity={k === 9 ? 0.7 : 0.85}>{m}</text>)}
        </Svg>
        <Card say={sep + 0.6} style={{ left: 0, top: 606, width: 860, padding: "16px 26px" }}>
          <div className="line"><span>Octubre</span><b>sin dato anual</b></div>
          <div className="line"><span>El máximo reciente: junio de 2022</span><b>9,1 %</b></div>
        </Card>
      </Stage>
      <Src>IPC de EE. UU. sin desestacionalizar, cada mes contra el mismo mes de un año antes: BLS vía FRED, cálculo propio.</Src>
    </Board>
  );
};
