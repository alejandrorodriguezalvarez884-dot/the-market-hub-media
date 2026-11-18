// The example (made-up numbers): a pizzeria split into 100 shares, one column each, at 5 € a share: 500 €.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Grid, Head, Hi, World, between, glide, prog, ease } from "./look/torres";

export default () => {
  const t = useSeconds();
  const cien = useSay("cien");
  const cam = between({ rx: 52, rz: -10, x: 0, y: 0, z: -120, oy: -150 }, { rx: 62, rz: -30, x: 0, y: 0, z: 40, oy: -130 }, glide(prog(t, 0, 8)));
  const rise = ease(prog(t, cien - 0.2, 1.2));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Grid h={Math.max(28 * 5 * rise, 0.1)} />
    </World>}>
      <Head kick="La idea"><h1 className="mid">Una pizzería en <Hi say="cien">100 acciones</Hi></h1></Head>
      <Card say="cinco" style={{ left: 72, top: 1140, width: 560, padding: "16px 24px" }}>
        <Ej />
        <div className="line"><span>Acciones</span><b>100</b></div>
        <div className="line"><span>Precio</span><b>5 €</b></div>
        <div className="line"><span>Capitalización</span><b className="y">500 €</b></div>
      </Card>
    </Frame>
  );
};
