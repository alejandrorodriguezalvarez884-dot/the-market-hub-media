// Second way, the bond: the US 10-year yield at 4.91 % at 18:06 of Spain (Market Hub, 25-11-2026), as a pillar beside
// today's step of the staircase (4.00 %), on the same scale.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Block, Card, END, Frame, Ground, Head, Hi, Num, RZ, Src, Stairs, World, between, ease, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const diez = useSay("diez");
  const g = ease(prog(t, diez - 0.2, 1.2));
  const cam = between({ rx: 62, rz: -40, x: 420, y: 120, z: -300, oy: 40 }, { rx: 60, rz: -58, x: 520, y: 140, z: -240, oy: 40 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs />
      <Bill x={END - 60} y={0} z={RZ(4) + 22}><span className="tag">Fed 4,00 %</span></Bill>
      <Block x={END + 130} y={240} w={150} d={150} h={RZ(4.91) * g} tone="up" />
      <Bill x={END + 130} y={240} z={RZ(4.91) * g + 22} opacity={g}><span className="val g">4,91 %</span></Bill>
    </World>}>
      <Head kick="Vía 2 · el bono"><h1 className="mid">El <Hi say="bono">bono</Hi> compite con la bolsa</h1></Head>
      <Card say={diez} tone="up" style={{ left: 72, top: 1110, width: 420, padding: "14px 22px" }}>
        <span className="lab">Bono de EE. UU. a 10 años</span><Num say={diez} to={4.91} decimals={2} suffix=" %" className="num mid" />
      </Card>
      <Card say="exige" tone="key" style={{ left: 512, top: 1110, width: 418, padding: "16px 22px" }}>
        <span style={{ fontSize: 28 }}>A la bolsa se le <span className="y"><b>exige más</b></span> para que compense</span>
      </Card>
      <Src>Rentabilidad del bono a 10 años, 25 nov., 18:06 h de España: Market Hub (Yahoo Finance).</Src>
    </Frame>
  );
};
