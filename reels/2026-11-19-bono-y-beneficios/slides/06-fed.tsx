// Minutes of the FOMC meeting of 27-28 Oct 2026, released 18 Nov: "almost all participants" saw further
// increases in the target range as likely appropriate; range held at 3.75-4 %, vote 10 to 2 (Cook and
// Hammack for a quarter-point rise). The water stands at today's 10-year yield, 5.07 %.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gauge, Head, Hi, Island, Sea, Src, Water, World, between, glide, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const all = useSay("casi");
  const cam = between({ rx: 78, rz: -50, x: -100, y: 0, z: 0, oy: 620 }, { rx: 80, rz: -30, x: -100, y: 0, z: 60, oy: 640 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={5.072} /><Island pct={5.464} wet={5.072} /><Gauge x={-420} y={60} wet={5.072} /></World>}>
      <Head kick="Reserva Federal · actas del 18 de noviembre"><h1>Más tipos, <Hi say="probable">probables</Hi></h1></Head>
      <Card say={all} tone="key" style={{ left: 72, top: 640, width: 680 }}>
        <span className="lab">Lo que dicen las actas</span>
        <span className="serif" style={{ fontSize: 40, lineHeight: 1.2, display: "block" }}><b>Casi todos</b> ven probable volver a subir el tipo oficial.</span>
      </Card>
      <Card say={all} style={{ left: 72, top: 960, width: 560, padding: "16px 24px" }}>
        <div className="line"><span>Tipo oficial hoy</span><b>3,75–4 %</b></div>
        <div className="line"><span>Votos por subirlo ya</span><b>2 de 12</b></div>
      </Card>
      <Src>Reserva Federal, actas de la reunión del 27 y 28 de octubre de 2026, publicadas el 18 de noviembre. Al fondo, el bono a 10 años hoy (5,07 %).</Src>
    </Frame>
  );
};
