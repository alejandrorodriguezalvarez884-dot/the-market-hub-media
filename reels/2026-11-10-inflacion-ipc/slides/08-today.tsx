// Today: October's CPI rose 0.4 % and core 0.3 %, a tenth above what was expected; no annual rate, since October 2025 was never measured
import React from "react";
import { Column, Look, Reveal, useSeconds, useSay } from "@mh/kit";
import { Drawing, Row } from "./look/ipc";

// The months an annual rate for October 2026 needs: October 2025 is missing (BLS)
const STRIP = ["OCT\n25", "N", "D", "E", "F", "M", "A", "M", "J", "J", "A", "S", "OCT\n26"];

export default () => {
  const t = useSeconds();
  const none = useSay("sin"), shut = useSay("cerrado");
  const cross = Math.min(1, Math.max(0, (t - shut) / 0.35));
  return (
    <Look look="light" bg="tape" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker green">Hoy · 16:35 en España</Reveal>
        <h1>Octubre: <span className="y">una décima más</span></h1>
        <div className="card" style={{ gap: 16 }}>
          <p className="label">En el mes · dato y lo esperado</p>
          <Row name="IPC" small={<>se esperaba +0,3 %</>} fig="+0,4 %" tone="y" />
          <Reveal say="subyacente"><Row name="Subyacente" small={<>se esperaba +0,2 %</>} fig="+0,3 %" tone="y" /></Reveal>
          <Reveal say="sin+0.3"><Row name="S&P 500" small="16:35, sesión abierta" fig="▼ 0,37 %" tone="r" /></Reveal>
          <p className="note">BLS, 10 nov 2026. Lo esperado: Dow Jones (CNBC). S&amp;P 500: Market Hub (Yahoo Finance).</p>
        </div>
        <Reveal say="sin" className="card" style={{ gap: 10, padding: "22px 30px" }}>
          <p className="label">Un dato anual compara los dos octubres</p>
          <Drawing h={110}>
            {STRIP.map((m, i) => {
              const x = 30 + i * 60.6, gone = i === 0, end = i === 12;
              const p = Math.min(1, Math.max(0, (t - none - i * 0.04) / 0.25));
              return (
                <g key={i} opacity={p}>
                  <rect x={x - 25} y={6} width={50} height={56} rx={9} fill={gone ? "none" : end ? "var(--amber)" : "var(--ink-strong)"} fillOpacity={gone ? 0 : end ? 1 : 0.14}
                    stroke={gone ? "var(--down)" : "none"} strokeWidth={3} strokeDasharray="6 5" />
                  {gone && <path d={`M ${x - 12} 22 L ${x + 12} 46 M ${x + 12} 22 L ${x - 12} 46`} stroke="var(--down)" strokeWidth={5} strokeLinecap="round" opacity={cross} />}
                  <text x={x} y={92} textAnchor="middle" fontSize={i === 0 || end ? 17 : 20} fontWeight={700} fill={gone ? "var(--down)" : "var(--muted)"} fontFamily="var(--mono)">{m.replace("\n", " ")}</text>
                </g>
              );
            })}
          </Drawing>
        </Reveal>
        <Reveal say="cerrado" how="pop" tilt={-3} className="sticker tag small">Octubre de 2025: sin datos</Reveal>
      </Column>
    </Look>
  );
};
