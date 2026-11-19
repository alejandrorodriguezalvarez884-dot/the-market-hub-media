// The reel's opinion, said as one, over the tower standing just above the water (13 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gauge, Head, Hi, Island, Sea, Src, Water, World, between, glide, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const money = useSay("dinero"), idea = useSay("cambiaría");
  const cam = between({ rx: 64, rz: -70, x: -100, y: 0, z: -80, oy: 560 }, { rx: 68, rz: -20, x: -100, y: 0, z: -20, oy: 540 }, glide(prog(t, 0, 13)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={5.154} /><Island pct={5.464} wet={5.154} /><Gauge x={-420} y={60} wet={5.154} /></World>}>
      <Head kick="Nuestra opinión"><h1>Pesa el <Hi say="dinero">precio del dinero</Hi></h1></Head>
      <Card say={money} tone="key" style={{ left: 72, top: 600, width: 660 }}>
        <span className="lab">Lo que creemos</span>
        <span className="serif" style={{ fontSize: 40, lineHeight: 1.2, display: "block" }}>Las empresas ganan más, y <b>el bono se ha comido el abaratamiento</b>.</span>
      </Card>
      <Card say={idea} style={{ left: 72, top: 1000, width: 600 }}>
        <span className="lab">Qué nos haría cambiar de idea</span>
        <span>Que las previsiones de beneficios empezaran a bajar.</span>
      </Card>
      <Src>Opinión de The Market Hub, no una recomendación. Datos: FactSet, Yahoo Finance y Reserva Federal.</Src>
    </Frame>
  );
};
