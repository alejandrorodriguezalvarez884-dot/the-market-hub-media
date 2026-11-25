// Recap: the three ways, over the whole staircase.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Stairs, World, between, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -30, x: 60, y: 0, z: -640, oy: 80 }, { rx: 62, rz: -14, x: 0, y: 0, z: -600, oy: 80 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs /></World>}>
      <Head kick="Repaso"><h1 className="mid">Tipos más altos: <Hi>tres vías</Hi></h1></Head>
      <Card say="deuda" style={{ left: 72, top: 1090, width: 280, padding: "14px 20px" }}>
        <span className="lab">1 · Deuda</span><span style={{ fontSize: 28 }}>más <b>cara</b></span>
      </Card>
      <Card say="bono" style={{ left: 366, top: 1090, width: 280, padding: "14px 20px" }}>
        <span className="lab">2 · Bono</span><span style={{ fontSize: 28 }}>paga <b>más</b></span>
      </Card>
      <Card say="futuro" tone="key" style={{ left: 660, top: 1090, width: 270, padding: "14px 20px" }}>
        <span className="lab">3 · Futuro</span><span style={{ fontSize: 28 }}>vale <b className="y">menos</b></span>
      </Card>
    </Frame>
  );
};
