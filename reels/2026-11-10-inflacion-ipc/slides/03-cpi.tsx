// Index 1 of 4: that basket, measured every month, is the CPI (IPC in Spanish), published by the BLS
import React from "react";
import { Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, Row } from "./look/ipc";

const MONTHS = ["NOV", "DIC", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT"];

export default () => {
  const t = useSeconds();
  const month = useSay("mes");
  return (
    <Look look="light" bg="grid" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker">Índice 1 de 4 · el más conocido</Reveal>
        <h1>El <span className="y">IPC</span>: la cesta, cada mes</h1>
        <div className="card" style={{ gap: 16 }}>
          <p className="label">Una medida cada mes</p>
          <Drawing h={150}>
            {MONTHS.map((m, i) => {
              const p = Math.min(1, Math.max(0, (t - month + 0.5 - i * 0.08) / 0.3)), last = i === MONTHS.length - 1;
              const x = 34 + i * 65;
              return (
                <g key={m + i} transform={`translate(${x}, ${(10 - p * 10).toFixed(1)})`}>
                  <rect x={-27} y={18} width={54} height={66} rx={10} fill={last ? "var(--amber)" : "var(--ink-strong)"} fillOpacity={(last ? 1 : 0.16) * (0.25 + 0.75 * p)} />
                  <path d="M -14 40 L 14 40 L 10 66 L -10 66 Z" fill={last ? "var(--page)" : "var(--ink-strong)"} opacity={0.25 + 0.75 * p} />
                  <text y={122} textAnchor="middle" fontSize={20} fontWeight={700} fill={last ? "var(--ink-strong)" : "var(--muted)"} fontFamily="var(--mono)">{m}</text>
                </g>
              );
            })}
          </Drawing>
          <Reveal say="ipc"><Row name="IPC" small="Índice de Precios al Consumo" fig="cada mes" tone="y" /></Reveal>
          <Reveal say="cpi"><Row name="En inglés, CPI" small="Consumer Price Index" fig="BLS" /></Reveal>
          <p className="note">Lo publica la Oficina de Estadísticas Laborales de EE. UU. (BLS). El próximo, el 10 de diciembre a las 14:30 de España.</p>
        </div>
      </Column>
    </Look>
  );
};
