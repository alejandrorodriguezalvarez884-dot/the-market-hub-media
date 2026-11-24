// Monday's +6.86 % is the Nasdaq 100's 25th biggest one-day gain in 10,366 sessions since 1 Oct 1985;
// on Fri 20 Nov it had closed 19.8 % below its highest close (31,224.47, 6 Oct 2026). The other 24
// towers grow by rank as the camera pulls back (Yahoo Finance, data/rebotes.json).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, DayTag, Frame, Head, Hi, Map, Src, World, between, byDate, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const rank = useSay("veinticinco"), high = useSay("máximo");
  const mon = byDate("2026-11-23");
  const cam = between({ rx: 62, rz: -56, x: 1150, y: -450, z: 320, oy: 80 }, { rx: 58, rz: -10, x: 0, y: -1150, z: -2000, oy: 300 }, glide(prog(t, 0.2, 6)));
  return (
    <Frame world={<World cam={cam}><Map at={(d) => (d.date === mon.date ? undefined : rank + 0.6 + d.rank * 0.12)}><DayTag day={mon} tone="#ffe2b0">N.º 25</DayTag></Map></World>}>
      <Head kick="Desde 1985"><h1>Su <Hi say="veinticinco" tone="amber">mejor día n.º 25</Hi></h1></Head>
      <Card say={rank} style={{ left: 72, top: 590, width: 470 }}>
        <span className="lab">Puesto del lunes</span>
        <span className="num mid">25.º</span>
        <small>de 10.366 sesiones</small>
      </Card>
      <Card say={high} tone="down" style={{ left: 570, top: 590, width: 400 }}>
        <span className="lab">Viernes 20, al cierre</span>
        <span className="num mid">−19,8 %</span>
        <small>bajo su máximo del 6 de octubre</small>
      </Card>
      <Src>Cada torre, una de las 25 mayores subidas del Nasdaq 100 en un día: alta como la subida, a lo ancho por su año y al fondo según lo lejos que estaba el índice de su máximo. Yahoo Finance, desde el 1 de octubre de 1985; cálculo nuestro.</Src>
    </Frame>
  );
};
