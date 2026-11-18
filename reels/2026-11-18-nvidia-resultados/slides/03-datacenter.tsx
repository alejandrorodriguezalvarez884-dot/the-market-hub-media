// Data Center revenue $107.6bn (+110 % on a year; 92.9 % of $115.8bn), Edge Computing $8.2bn (release
// of 17 November 2026). By customer (CFO commentary): hyperscale $60.1bn (+71 %), AI clouds, industrial
// and enterprise $47.5bn (+195 %).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Num, Src, World, between, ease, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const dc = useSay("centros"), clouds = useSay("nubes");
  const cam = between({ rx: 62, rz: -22, x: 0, y: 300, z: 260, oy: 330 }, { rx: 58, rz: -34, x: 0, y: 0, z: 0, oy: 400 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Hall power={0.2 + 0.8 * ease(prog(t, dc - 0.3, 2))} rows={7} cols={13} /></World>}>
      <Head kick="De dónde sale"><h1>Casi todo, <Hi say="centros">centros de datos</Hi></h1></Head>
      <Card say={dc} tone="ice" style={{ left: 72, top: 640, width: 600 }}>
        <span className="lab">Centros de datos</span>
        <Num to={107600} say={dc} suffix=" M$" className="num mid" />
        <small>93 % de los ingresos · +110 % en un año</small>
      </Card>
      <Card say={clouds} style={{ left: 72, top: 970, width: 790 }}>
        <span className="lab">Quién se los compra</span>
        <div className="line"><span>Grandes nubes (hiperescala)</span><b className="ice">60.100 M$</b></div>
        <div className="line"><span>Nubes de IA, industria y empresas</span><b>47.500 M$</b></div>
        <div className="line"><span>Fuera de centros de datos</span><b>8.200 M$</b></div>
      </Card>
      <Src>Tercer trimestre de su ejercicio 2027. Nvidia, comunicado de resultados y comentario de la directora financiera, 17 de noviembre de 2026.</Src>
    </Frame>
  );
};
