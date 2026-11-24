// Hook: the Nasdaq 100 closed +6.86 % on Mon 23 Nov 2026 (25,028.98 -> 26,746.10) and at 18:06 Madrid
// today stands at 26,111.28, -2.4 % (Yahoo Finance, data/yahoo-NDX-*.json). Readable without sound
// from frame 0: the headline, the figure and Monday's tower on the map.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Src, World, between, byDate, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const today = useSay("pierde");
  const mon = byDate("2026-11-23");
  const cam = between({ rx: 64, rz: -26, x: 1150, y: -450, z: 300, oy: 80 }, { rx: 66, rz: -40, x: 1150, y: -450, z: 380, oy: 80 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Map only={(d) => d.date === mon.date}></Map></World>}>
      <Head kick="Nasdaq 100 · lunes 23 de noviembre"><h1>El Nasdaq salta <Hi tone="amber">casi un 7 %</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 1170, width: 420 }}>
        <span className="lab">Lunes 23, al cierre</span>
        <span className="num mid">+6,86 %</span>
      </Card>
      <Card say={today} tone="down" style={{ left: 520, top: 1170, width: 400 }}>
        <span className="lab">Hoy, a las 18:06</span>
        <span className="num mid">−2,4 %</span>
      </Card>
      <Src>Nasdaq 100, cierres y cotización de hoy en hora de España: Yahoo Finance.</Src>
    </Frame>
  );
};
