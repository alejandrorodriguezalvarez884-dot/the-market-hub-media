// This year the CPI started at 2.4 %, passed 4 % in May and was back at 3.7 % in September (annual rates)
import React from "react";
import { Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, Row, es } from "./look/ipc";

// CPI, all items, not seasonally adjusted: change against the same month a year before, January to September 2026 (data/fred-CPIAUCNS.csv, own sums)
const YOY = [2.39, 2.41, 3.26, 3.81, 4.25, 3.53, 3.36, 3.40, 3.74];
const MON = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O"];
const X = (i: number) => 60 + i * 78;
const Y = (v: number) => 330 - ((v - 2) / 2.5) * 270;

export default () => {
  const t = useSeconds();
  const start = useSay("empezó"), may = useSay("mayo"), sep = useSay("septiembre");
  const drawn = Math.min(1, Math.max(0, (t - start + 0.3) / Math.max(1, sep - start + 0.5))) * (YOY.length - 1);
  const i = Math.min(YOY.length - 2, Math.floor(drawn)), f = drawn - i;
  const hx = X(i) + (X(i + 1) - X(i)) * f, hy = Y(YOY[i] + (YOY[i + 1] - YOY[i]) * f);
  const pts = YOY.slice(0, i + 1).map((v, k) => `${X(k)},${Y(v).toFixed(1)}`).concat(`${hx.toFixed(1)},${hy.toFixed(1)}`).join(" ");
  const pin = (k: number, at: number, dy = -46) => {
    const p = Math.min(1, Math.max(0, (t - at) / 0.35));
    const key = k === 8;
    return (
      <g opacity={p} transform={`translate(${X(k)}, ${(Y(YOY[k]) + dy + (1 - p) * 10).toFixed(1)})`}>
        <rect x={-62} y={-24} width={124} height={46} rx={23} fill={key ? "var(--amber)" : "var(--ink-strong)"} />
        <text y={9} textAnchor="middle" fontSize={26} fontWeight={800} fill={key ? "#1a1205" : "var(--page)"}>{es(YOY[k])} %</text>
      </g>
    );
  };
  return (
    <Look look="light" bg="candles" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker">Últimamente · 2026</Reveal>
        <h1>El IPC, <span className="y">arriba y abajo</span></h1>
        <div className="card" style={{ gap: 14 }}>
          <p className="label">IPC · cambio en un año</p>
          <Drawing h={410}>
            {[2, 3, 4].map((v) => (
              <g key={v}>
                <line x1={36} x2={778} y1={Y(v)} y2={Y(v)} stroke="var(--ink-strong)" strokeOpacity={0.08} strokeWidth={2} />
                <text x={12} y={Y(v) + 8} fontSize={22} fontWeight={700} fill="var(--muted)">{v}</text>
              </g>
            ))}
            <polyline points={pts} fill="none" stroke="var(--ink-strong)" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={hx} cy={hy} r={12} fill="var(--amber)" />
            {pin(0, start)}
            {pin(4, may)}
            {pin(8, sep, -50)}
            <g opacity={Math.min(1, Math.max(0, (t - sep - 0.5) / 0.4))}>
              <circle cx={X(9)} cy={Y(3.74)} r={18} fill="none" stroke="var(--muted)" strokeWidth={3} strokeDasharray="5 5" />
              <text x={X(9)} y={Y(3.74) + 9} textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--muted)">?</text>
            </g>
            {MON.map((m, k) => <text key={k} x={X(k)} y={400} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--muted)">{m}</text>)}
          </Drawing>
          <Reveal say={sep + 0.5}><Row name="Octubre" small="hoy no hay dato anual" fig="?" tone="dim" /></Reveal>
          <Reveal say={sep + 0.9}><Row name="El máximo reciente" small="junio de 2022" fig="9,1 %" /></Reveal>
          <p className="note">IPC sin desestacionalizar, cada mes contra el mismo mes de un año antes: BLS vía FRED, cálculo propio.</p>
        </div>
      </Column>
    </Look>
  );
};
