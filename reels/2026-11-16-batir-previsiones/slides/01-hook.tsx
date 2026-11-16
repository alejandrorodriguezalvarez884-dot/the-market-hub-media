// Hook: tomorrow, 17 November 2026, Nvidia reports after the close; the consensus EPS for the quarter to
// October 2026 is 2.49 $ (Nasdaq, with Zacks; 14 analysts). Nvidia at 158.60 $, −2.6 %, at 18:07 in Spain
// (Yahoo Finance). The stand with its bar at 2.49 and no column yet. Readable without sound from frame 0.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Jump, Logo, Src, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 72, rz: -24, x: 0, y: 0, z: -60, oy: 260 }, { rx: 66, rz: -12, x: 0, y: 0, z: 40, oy: 250 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={60} y={0} bar={2.49} scale={150} barText="2,49 $" label="Mañana" w={260} />
    </World>}>
      <Head kick="Aprende · batir previsiones"><h1 className="mid">Nvidia y el <Hi>listón</Hi> de mañana: 2,49 $</h1></Head>
      <Card tone="down" style={{ left: 72, top: 1180, width: 420, padding: "16px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={40} /> Nvidia · hoy</span>
        <span className="num sm">−2,6 %</span>
        <small>16 nov, 18:07 h de España</small>
      </Card>
      <Src>Beneficio por acción que esperan 14 analistas para el trimestre a octubre de 2026: Nasdaq, con datos de Zacks. Nvidia: Yahoo Finance, 18:07 de España.</Src>
    </Frame>
  );
};
