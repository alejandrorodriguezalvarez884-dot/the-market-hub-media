// Food and energy swing a lot; without them, core inflation: 2.6 % a year in September against 3.7 % for the whole CPI
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

const W = 520; // the width of a 5 % bar

export default () => {
  const t = useSeconds();
  const swing = useSay("suben"), core = useSay("subyacente"), all = useSay("frente");
  const out = ease(prog(t, core - 0.2, 0.6));
  const wob = (k: number) => Math.sin(t * 5 + k * 2) * 26 * prog(t, swing - 0.2, 0.3) * (1 - out);
  const bar = (v: number, at: number) => (v / 5) * W * ease(prog(t, at, 0.7));
  return (
    <Board lean={-0.3}>
      <Head><h1 className="mid">Sin comida ni energía:<br />la <Hi say="subyacente">subyacente</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={300} />
          {[["COMIDA", 150], ["ENERGÍA", 360]].map(([label, x], k) => (
            <g key={label as string} transform={`translate(0, ${wob(k).toFixed(1)})`} opacity={1 - out * 0.7}>
              <rect x={(x as number) - 90} y={90} width={180} height={110} rx={16} fill={SELL} fillOpacity={0.16} stroke={SELL} strokeWidth={2} />
              <text className="mono" x={x as number} y={152} textAnchor="middle" fontSize={22} fill={FG} letterSpacing="0.12em">{label}</text>
              <line x1={(x as number) - 100} x2={(x as number) - 100 + 200 * out} y1={145} y2={145} stroke={SELL} strokeWidth={5} strokeLinecap="round" />
            </g>
          ))}
          <rect x={530} y={90} width={290} height={110} rx={16} fill={ACC} fillOpacity={0.16 + 0.3 * out} stroke={ACC} strokeWidth={2} />
          <text className="mono" x={675} y={140} textAnchor="middle" fontSize={22} fill={FG} letterSpacing="0.12em">EL RESTO</text>
          <text className="mono" x={675} y={172} textAnchor="middle" fontSize={18} fill={DIM} letterSpacing="0.1em">ROPA, CASA, COCHE…</text>
          <Tag x={250} y={256} w={430} h={50} size={20} tone="sell" show={ease(prog(t, swing + 0.3, 0.4)) * (1 - out)}>GASOLINA: +37,4 % EN UN AÑO</Tag>
          <Tag x={675} y={256} w={290} h={50} size={20} tone="key" show={out}>= SUBYACENTE</Tag>
        </Svg>
        <Card say={core + 0.6} style={{ left: 0, top: 330, width: 860, padding: "24px 28px" }}>
          <span className="lab">En un año, septiembre de 2026</span>
          {[["Subyacente", 2.6, core + 0.9, ACC, "2,6 %"], ["IPC entero", 3.7, all, FG, "3,7 %"]].map(([name, v, at, c, txt]) => (
            <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
              <span style={{ width: 210, fontSize: 32, color: FG }}>{name}</span>
              <div style={{ height: 44, width: bar(v as number, at as number), background: c as string, borderRadius: 10, boxShadow: `0 0 18px ${c === FG ? "rgba(255,255,255,0.4)" : "rgba(157,184,255,0.5)"}` }} />
              <b style={{ fontSize: 44, opacity: ease(prog(t, (at as number) + 0.3, 0.3)) }}>{txt}</b>
            </div>
          ))}
        </Card>
      </Stage>
      <Src>IPC y IPC sin comida ni energía, sin desestacionalizar, septiembre de 2026 contra septiembre de 2025: FRED (BLS), cálculo propio. Gasolina, octubre de 2026 contra octubre de 2025: BLS.</Src>
    </Board>
  );
};
