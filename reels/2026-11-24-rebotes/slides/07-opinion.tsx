// The reel's opinion, said as one, over the whole map turning slowly.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Src, World, between, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const idea = useSay("cambiaría");
  const cam = between({ rx: 60, rz: -36, x: 1000, y: -720, z: -320, oy: 60 }, { rx: 58, rz: -10, x: 0, y: -1150, z: -2000, oy: 300 }, glide(prog(t, 0, 14)));
  return (
    <Frame world={<World cam={cam}><Map paint={(d) => (d.date === "2026-11-23" ? "amber" : d.rank <= 20 ? "red" : "dim")} line20={0.8} /></World>}>
      <Head kick="Nuestra opinión"><h1>Un salto así <Hi say="miedo" tone="down">habla de miedo</Hi></h1></Head>
      <Card say="miedo" tone="key" style={{ left: 72, top: 590, width: 760 }}>
        <span className="lab">Lo que creemos</span>
        <span className="serif" style={{ fontSize: 40, lineHeight: 1.2, display: "block" }}>Los mejores días llegan en los peores meses, y <b>por sí solos no dicen cuál es el último</b>.</span>
      </Card>
      <Card say={idea} style={{ left: 72, top: 1110, width: 700 }}>
        <span className="lab">Qué nos haría cambiar de idea</span>
        <span>Semanas tranquilas, sin días de más del 5 %, ni arriba ni abajo.</span>
      </Card>
      <Src>Opinión de The Market Hub, no una recomendación. Datos: Yahoo Finance.</Src>
    </Frame>
  );
};
