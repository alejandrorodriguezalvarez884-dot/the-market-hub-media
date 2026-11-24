// Nvidia: 125.53 $ on Fri 20 Nov, 165.05 $ on Mon 23 (+31.5 %), 151.58 $ today at 18:06 Madrid (-8.2 %)
// (Yahoo Finance, data/yahoo-NVDA-*.json); the board reinstated Jensen Huang as CEO (Yahoo Finance
// live updates, 24 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Logo, Map, Src, World, between, byDate, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const up = useSay("treinta"), down = useSay("ocho");
  const mon = byDate("2026-11-23");
  const cam = between({ rx: 66, rz: -40, x: 1150, y: -450, z: 380, oy: 80 }, { rx: 62, rz: -56, x: 1150, y: -450, z: 320, oy: 80 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Map only={(d) => d.date === mon.date}></Map></World>}>
      <Head kick="Lo que lo empujó"><h1><Logo name="nvidia" h={78} style={{ marginRight: 18 }} /><Hi tone="up">Nvidia</Hi>, un 31 % en un día</h1></Head>
      <Card say={up} tone="up" style={{ left: 72, top: 1150, width: 420 }}>
        <span className="lab">Lunes 23</span>
        <span className="num mid">+31,5 %</span>
        <small>de 125,53 $ a 165,05 $</small>
      </Card>
      <Card say={down} tone="down" style={{ left: 520, top: 1150, width: 400 }}>
        <span className="lab">Hoy, a las 18:06</span>
        <span className="num mid">−8,2 %</span>
        <small>151,58 $</small>
      </Card>
      <Src>El consejo de Nvidia devolvió a Jensen Huang el puesto de consejero delegado (Yahoo Finance, 24 de noviembre). Cotizaciones: Yahoo Finance.</Src>
    </Frame>
  );
};
