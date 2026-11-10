// Hook, readable with no sound from frame 0: US consumer prices rose 0.4 % in October 2026, out today; 0.3 % was expected
import React from "react";
import { Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, es, useIn } from "./look/ipc";

// CPI, all items, change on the month, seasonally adjusted, January to October 2026 (data/fred-CPIAUCSL.csv; BLS)
const MONTHS: [string, number][] = [["E", 0.2], ["F", 0.3], ["M", 0.9], ["A", 0.6], ["M", 0.5], ["J", -0.4], ["J", 0.1], ["A", 0.4], ["S", 0.6], ["O", 0.4]];
const ZERO = 140, K = 110, X = (i: number) => 44 + i * 78;

export default () => {
  const t = useSeconds();
  // Drawn from frame 0, so the hook (and the cover) reads with no sound
  const grow = (_i: number) => 1;
  return (
    <Look look="light" bg="candles" brand="The Market Hub · Aprende">
      <Column>
        <Reveal how="none" as="p" className="kicker">IPC de EE. UU. · hoy, 14:30</Reveal>
        <h1>Los precios, <span className="y">+0,4 %</span> en un mes</h1>
        <div className="card" style={{ gap: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p className="label">Octubre · en el mes</p>
              <p className="big mid">+0,4<small>%</small></p>
            </div>
            <Reveal say="previsto" style={{ textAlign: "right", paddingBottom: 14 }}>
              <p className="label">Se esperaba</p>
              <p style={{ fontSize: 64, fontWeight: 800, color: "var(--muted)" }}>+0,3 %</p>
            </Reveal>
          </div>
          <Drawing h={250}>
            <line x1={10} x2={778} y1={ZERO} y2={ZERO} stroke="var(--ink-strong)" strokeOpacity={0.25} strokeWidth={2} />
            {MONTHS.map(([m, v], i) => {
              const h = Math.abs(v) * K * grow(i), last = i === MONTHS.length - 1;
              return (
                <g key={i}>
                  <rect x={X(i) - 24} y={v >= 0 ? ZERO - h : ZERO} width={48} height={h} rx={6} fill={last ? "var(--amber)" : "var(--ink-strong)"} opacity={last ? 1 : 0.18} />
                  <text x={X(i)} y={v >= 0 ? ZERO - h - 10 : ZERO + h + 26} textAnchor="middle" fontSize={22} fontWeight={700} fill={last ? "var(--amber)" : "var(--muted)"} opacity={grow(i)}>{es(v)}</text>
                  <text x={X(i)} y={244} textAnchor="middle" fontSize={22} fontWeight={700} fill={last ? "var(--ink-strong)" : "var(--muted)"}>{m}</text>
                </g>
              );
            })}
          </Drawing>
          <p className="note">IPC, cambio de cada mes en 2026, desestacionalizado. BLS, vía FRED. Lo esperado: Dow Jones (CNBC).</p>
        </div>
        <Reveal say="formas" how="pop" tilt={-3} className="sticker tag">¿Cómo se mide?</Reveal>
      </Column>
    </Look>
  );
};
