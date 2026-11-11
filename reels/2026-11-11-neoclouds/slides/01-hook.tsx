// Hook: CoreWeave up 20.95 % at 16:33 in Spain on 11 November 2026, the day after its third-quarter
// results (Yahoo Finance, data/yahoo-CRWV.json); revenue $3,661M against $1,365M a year before (SEC).
// Readable without sound from frame 0: the headline, the move and the logo are there from the start.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Logo, Num, Src, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 56, rz: -24, x: 120, y: 260, z: 380, oy: 300 }, { rx: 63, rz: -38, x: 0, y: 0, z: -120, oy: 380 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Hall power={0.25 + prog(t, 0, 2.6)} rows={7} cols={13} /></World>}>
      <Head kick="Resultados · 10 de noviembre"><h1>Las fábricas de la IA <Hi say="alquila">se alquilan</Hi></h1></Head>
      <Card tone="up" style={{ left: 72, top: 760, width: 560 }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="coreweave" h={44} /> CoreWeave · hoy</span>
        <span className="num">+21,0 %</span>
        <small>11 nov, 16:33 h de España</small>
      </Card>
      <Card say="triple" tone="ice" style={{ left: 72, top: 1110, width: 620 }}>
        <span className="lab">Ingresos del trimestre</span>
        <span className="num mid">×2,7 <span style={{ fontSize: 40, color: "#c9d2df" }}>en un año</span></span>
      </Card>
      <Src>CoreWeave: cotización a las 16:33 de España frente al cierre del 10 de noviembre (Yahoo Finance); ingresos del 3.er trimestre de 2026, 3.661 M$ frente a 1.365 M$ (SEC).</Src>
    </Frame>
  );
};
