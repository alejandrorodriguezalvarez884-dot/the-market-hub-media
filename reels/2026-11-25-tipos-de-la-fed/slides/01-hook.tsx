// Hook: the PCE index of October up 3.8 % in a year (BEA, 25-11-2026) and the Nasdaq 100 −3.2 % at 18:06 of Spain
// (Market Hub). Behind both, the Fed's rate: the staircase of its upper bound since 2021 (FRED), from frame 0.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Src, Stairs, World, between, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -22, x: 0, y: 0, z: -720, oy: 60 }, { rx: 62, rz: -34, x: 80, y: 0, z: -660, oy: 60 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs /></World>}>
      <Head kick="Aprende · los tipos de la Fed"><h1>Por qué los <Hi>tipos</Hi> mueven la bolsa</h1></Head>
      <Card tone="down" style={{ left: 72, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">Inflación PCE</span><span className="num sm" style={{ color: "#d6402f" }}>3,8 %</span><small>octubre, en un año</small>
      </Card>
      <Card tone="down" style={{ left: 392, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">Nasdaq 100</span><span className="num sm">−3,2 %</span><small>hoy, 18:06 h</small>
      </Card>
      <Card say="Fed" tone="amber" style={{ left: 712, top: 1150, width: 218, padding: "14px 18px" }}>
        <span className="lab">Fed</span><span className="num sm" style={{ fontSize: 50 }}>4,00 %</span><small>techo hoy</small>
      </Card>
      <Src>25 nov. PCE: BEA. Nasdaq 100: Market Hub (Yahoo Finance), 18:06 h de España. Escalera: techo del tipo de la Fed desde 2021, FRED.</Src>
    </Frame>
  );
};
