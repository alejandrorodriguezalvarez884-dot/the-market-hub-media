// Today's nod: Nvidia presents its third-quarter results on Tuesday 17 November, call at 14:00 in
// California (23:00 in Spain) (Nvidia); today 160.53 $ (Yahoo Finance, 18:09 in Spain). A new quarter of
// profit will change the blocks of its pile: drawn as an outline, with no figure.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Pile, Src, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 70, rz: -30, x: 115, y: 0, z: 60, oy: 200 }, { rx: 66, rz: -10, x: 115, y: 0, z: 0, oy: 210 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={40} y={-75} price={160.53} eps={7.91} scale={2.35} at={-20} priceText="160,53 $" label="Nvidia, hoy" valueSize={46} />
    </World>}>
      <Head kick="El martes"><h1 className="mid">Nuevos beneficios, <Hi say="PER">nuevo PER</Hi></h1></Head>
      <Card tone="key" say="martes" style={{ left: 72, top: 1180, width: 520, padding: "16px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Resultados del trimestre</span>
        <span style={{ display: "block", fontSize: 36 }}><b>Martes 17</b> · <span className="y">23:00 h de España</span></span>
      </Card>
      <Src>Nvidia, convocatoria de su conferencia de resultados (17 de noviembre, 14:00 en California). Precio: Yahoo Finance, 13 de noviembre a las 18:09 de España.</Src>
    </Frame>
  );
};
