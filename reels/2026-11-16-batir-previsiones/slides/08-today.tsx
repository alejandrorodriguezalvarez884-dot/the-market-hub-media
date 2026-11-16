// Today: Nvidia −2.6 % (158.60 $ against 162.85 $) and the Philadelphia semiconductor index −3.8 % at
// 18:07 in Spain (Yahoo Finance). Tomorrow's bar, 2.49 $, against 1.24 $ in the same quarter a year ago
// (Nasdaq, with Zacks): about double. Last year's column beside tomorrow's empty stand.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Jump, Logo, Src, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const dbl = useSay("doble");
  const cam = between({ rx: 68, rz: 10, x: 0, y: 0, z: -80, oy: 300 }, { rx: 66, rz: -22, x: 0, y: 0, z: -40, oy: 290 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={-200} y={0} w={200} bar={1.18} eps={1.24} scale={150} barAt={dbl - 1.2} at={dbl - 1.0} takes={0.6} epsText="1,24 $" label="Oct. 2025" size={40} barText="1,18" />
      <Jump x={170} y={0} w={220} bar={2.49} scale={150} barAt={-5} barText="2,49 $" label="Mañana" size={40} />
    </World>}>
      <Head kick="Hoy"><h1 className="mid">Mañana, un listón el <Hi say="doble">doble</Hi> de alto</h1></Head>
      <Card tone="down" style={{ left: 72, top: 1180, width: 480, padding: "14px 24px" }}>
        <span className="lab">16 nov · 18:07 h de España</span>
        <div className="line"><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Logo name="nvidia" h={30} /> Nvidia</span><b className="down">−2,6 %</b></div>
        <div className="line"><span>Chips (SOX)</span><b className="down">−3,8 %</b></div>
      </Card>
      <Src>Yahoo Finance, frente al cierre del viernes. Beneficio por acción ajustado del trimestre a octubre de 2025 y consenso del de 2026: Nasdaq, con datos de Zacks.</Src>
    </Frame>
  );
};
