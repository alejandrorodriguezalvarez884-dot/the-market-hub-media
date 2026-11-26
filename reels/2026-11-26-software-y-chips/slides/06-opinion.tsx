// The reel's opinion, said as one, over the whole avenue.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Src, World, between, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -40, x: 0, y: 0, z: -1300, oy: 380 }, { rx: 62, rz: -16, x: 0, y: 0, z: -1200, oy: 380 }, glide(prog(t, 0, 14)));
  return (
    <Frame world={<World cam={cam}><Avenue /></World>}>
      <Head kick="Nuestra opinión"><h1>De ganador <Hi say="víctima" tone="violet">a víctima</Hi></h1></Head>
      <Card say="víctima" tone="key" style={{ left: 72, top: 1010, width: 800 }}>
        <span className="lab">Lo que creemos</span>
        <span className="serif" style={{ fontSize: 38, lineHeight: 1.22, display: "block" }}>La bolsa paga a quien fabrica la herramienta de la IA, y <b>castiga a quien podría ser sustituido por ella</b>.</span>
      </Card>
      <Src>Opinión de The Market Hub, no una recomendación. Datos: Yahoo Finance.</Src>
    </Frame>
  );
};
