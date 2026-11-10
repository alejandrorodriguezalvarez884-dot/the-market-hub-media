// Index 4 of 4: the PPI measures what producers charge, before it reaches the shop: 6.3 % a year in September
import React from "react";
import { Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, Row, useIn } from "./look/ipc";

const STOPS = [["Productor", 110], ["Tienda", 394], ["Tu cesta", 678]] as const;

export default () => {
  const run = useIn("productores", 1.6);
  const end = 110 + 568 * run;
  return (
    <Look look="light" bg="city" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker">Índice 4 de 4 · antes de la tienda</Reveal>
        <h1>El <span className="y">PPI</span>: lo que cobran los productores</h1>
        <div className="card" style={{ gap: 16 }}>
          <Drawing h={250}>
            <line x1={110} x2={678} y1={120} y2={120} stroke="var(--ink-strong)" strokeOpacity={0.18} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
            <line x1={110} x2={end} y1={120} y2={120} stroke="var(--amber)" strokeWidth={7} strokeLinecap="round" />
            {STOPS.map(([name, x], i) => {
              const lit = i === 0 || end >= x - 4;
              return (
                <g key={name} opacity={lit ? 1 : 0.4}>
                  <circle cx={x} cy={120} r={60} fill="var(--page)" stroke={i === 0 ? "var(--amber)" : "var(--ink-strong)"} strokeWidth={4} />
                  <g transform={`translate(${x}, 120)`} fill="none" stroke="var(--ink-strong)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
                    {i === 0 && <path d="M -30 26 L -30 -6 L -12 6 L -12 -6 L 6 6 L 6 -22 L 28 -22 L 28 26 Z" fill="var(--ink-strong)" />}
                    {i === 1 && <path d="M -32 -12 L -24 -28 L 24 -28 L 32 -12 Z M -26 -12 L -26 28 L 26 28 L 26 -12 M -8 28 L -8 6 L 8 6 L 8 28" />}
                    {i === 2 && <path d="M -28 -10 L 28 -10 L 20 26 L -20 26 Z M -16 -10 C -16 -36 16 -36 16 -10" />}
                  </g>
                  <text x={x} y={222} textAnchor="middle" fontSize={28} fontWeight={800} fill="var(--ink-strong)">{name}</text>
                </g>
              );
            })}
            <g opacity={run > 0 ? 1 : 0}>
              <rect x={60} y={14} width={100} height={40} rx={20} fill="var(--amber)" />
              <text x={110} y={42} textAnchor="middle" fontSize={24} fontWeight={800} fill="#1a1205" fontFamily="var(--mono)">PPI</text>
            </g>
            <g opacity={end >= 674 ? 1 : 0}>
              <rect x={628} y={14} width={100} height={40} rx={20} fill="var(--ink-strong)" />
              <text x={678} y={42} textAnchor="middle" fontSize={24} fontWeight={800} fill="var(--page)" fontFamily="var(--mono)">IPC</text>
            </g>
          </Drawing>
          <Reveal say="seis"><Row name="PPI" small="septiembre, en un año" fig="6,3 %" tone="y" /></Reveal>
          <Reveal say="seis+0.5"><Row name="IPC" small="septiembre, en un año" fig="3,7 %" tone="dim" /></Reveal>
          <p className="note">PPI de demanda final e IPC, sin desestacionalizar: BLS vía FRED, cálculo propio.</p>
        </div>
      </Column>
    </Look>
  );
};
