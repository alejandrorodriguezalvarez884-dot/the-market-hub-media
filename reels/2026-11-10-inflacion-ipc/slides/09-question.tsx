// Recap of the four indices on screen, and the question for the comments: where do you feel prices rising most?
import React from "react";
import { Column, Look, Profile, Reveal } from "@mh/kit";

const FOUR: [string, string, string][] = [["IPC", "3,7 %", ""], ["Subyacente", "2,6 %", "g"], ["PCE", "3,6 %", "s"], ["PPI", "6,3 %", "y"]];

export default () => (
  <Look look="light" bg="plain" brand="The Market Hub · Aprende">
    <Column>
      <Reveal as="p" className="kicker" how="fade">Resumen · septiembre, en un año</Reveal>
      <Reveal how="fade" takes={0.4} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, width: "100%" }}>
        {FOUR.map(([name, fig, tone]) => (
          <div key={name} className="card" style={{ padding: "18px 16px", gap: 6, alignItems: "center" }}>
            <span className="label" style={{ fontSize: 20 }}>{name}</span>
            <b className={tone} style={{ fontSize: 46, fontWeight: 800, color: tone ? undefined : "var(--ink-strong)" }}>{fig}</b>
          </div>
        ))}
      </Reveal>
      <Reveal as="p" className="kicker" say={0.3}>¿Y tú?</Reveal>
      <h1 className="small">¿Dónde notas más <span className="y">la subida</span>?</h1>
      <div className="answers" style={{ flexWrap: "wrap", gap: 20 }}>
        <Reveal say="compra" how="pop" className="sticker tag">La compra</Reveal>
        <Reveal say="gasolina" how="pop" className="sticker amber">La gasolina</Reveal>
        <Reveal say="alquiler" how="pop" className="sticker green">El alquiler</Reveal>
      </div>
      <Reveal say="leo"><Profile>Te leo en comentarios</Profile></Reveal>
    </Column>
  </Look>
);
