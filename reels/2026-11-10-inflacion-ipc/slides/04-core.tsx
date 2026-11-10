// Index 2 of 4: food and energy swing a lot; without them, core inflation, 2.6 % a year in September against 3.7 % for the whole CPI
import React from "react";
import { Bar, Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Row, useIn } from "./look/ipc";

export default () => {
  const t = useSeconds();
  const swing = useSay("suben");
  const out = useIn("sin", 0.5);
  const chip = (label: string, k: number) => {
    const wob = Math.sin((t - swing) * 6 + k * 2) * 10 * Math.min(1, Math.max(0, (t - swing) / 0.3)) * (1 - out);
    return (
      <span key={label} style={{ position: "relative", display: "inline-block", padding: "12px 26px", borderRadius: 16, fontSize: 44, fontWeight: 800,
        background: "var(--page)", border: "2px solid rgba(21,18,13,0.15)", color: "var(--ink-strong)", transform: `translateY(${wob.toFixed(1)}px)`, opacity: 1 - out * 0.55 }}>
        {label}
        <i style={{ position: "absolute", left: 14, right: 14, top: "52%", height: 6, borderRadius: 3, background: "var(--down)", transformOrigin: "left", transform: `scaleX(${out})` }} />
      </span>
    );
  };
  return (
    <Look look="light" bg="tape" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker green">Índice 2 de 4 · la de fondo</Reveal>
        <h1>La <span className="y">subyacente</span></h1>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {chip("Comida", 0)}{chip("Energía", 1)}
          <Reveal say="subyacente" how="fade" style={{ fontSize: 44, fontWeight: 800, color: "var(--muted)" }}>= fuera</Reveal>
        </div>
        <Reveal say="subyacente" className="card" style={{ gap: 18 }}>
          <p className="label">En un año · septiembre de 2026</p>
          <Row name="Subyacente" small="sin comida ni energía" fig="2,6 %" tone="y" />
          <Bar w={52} say="dos" />
          <Reveal say="frente"><Row name="IPC entero" fig="3,7 %" /></Reveal>
          <Bar w={74} say="frente" />
          <p className="note">IPC sin desestacionalizar: BLS vía FRED, cálculo propio.</p>
        </Reveal>
        <Reveal say="suben+0.4" how="pop" tilt={3} className="sticker amber small">Gasolina: +37,4 % en un año</Reveal>
      </Column>
    </Look>
  );
};
