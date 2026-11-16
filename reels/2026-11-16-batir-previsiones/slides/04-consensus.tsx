// The bar: the consensus, the average of the analysts' estimates. For Nvidia's quarter to October 2026:
// 2.49 $, 14 estimates, from 2.34 to 2.70 (Nasdaq, with Zacks). The two faint bars are the lowest and
// highest estimates.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Jump, Logo, Src, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const range = useSay("treinta");
  const cam = between({ rx: 66, rz: -20, x: 0, y: 0, z: -40, oy: 280 }, { rx: 70, rz: 6, x: 0, y: 0, z: 80, oy: 300 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={0} y={0} bar={2.49} scale={150} barAt={-5} barText="2,49 $" w={260}
        band={t >= range ? [2.34, 2.70] : undefined} bandText={["2,34", "2,70"]} />
    </World>}>
      <Head kick="El listón"><h1 className="mid">El <Hi say="consenso">consenso</Hi>: la media de los analistas</h1></Head>
      <Card say="Nvidia" style={{ left: 72, top: 1110, width: 560, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Trimestre a octubre de 2026</span>
        <div className="line"><span>Cálculos</span><b>14</b></div>
        <div className="line"><span>Media</span><b className="y">2,49 $</b></div>
        <Card say={range} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Más baja y más alta</span><b>2,34 y 2,70 $</b></div>
        </Card>
      </Card>
      <Src>Previsiones de beneficio por acción ajustado: Nasdaq, con datos de Zacks Investment Research, leído el 16-11-2026.</Src>
    </Frame>
  );
};
