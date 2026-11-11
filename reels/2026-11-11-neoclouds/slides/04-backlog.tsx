// CoreWeave's revenue backlog, about $132.5bn at 30 September 2026, against its 2026 revenue guidance
// of $13.0bn to $13.3bn (midpoint 13.15): about ten times (8-K of 10 November 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const signed = useSay("firmados"), year = useSay("veces");
  const up = glide(prog(t, signed, 2.4));
  const cam = between({ rx: 64, rz: -30, x: 0, y: 0, z: 0, oy: 300 }, { rx: 54, rz: -36, x: 0, y: 0, z: -380, oy: 420 }, up);
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={0.0056} w={160} d={160} gap={170} valueSize={60} items={[
        { label: "Ingresos 2026", value: 13150, text: "13.150", tone: "dim", at: 0.2 },
        { label: "Firmado", value: 132500, text: "132.500", tone: "ice", at: signed },
      ]} /></World>}>
      <Head kick="Lo que ya tiene firmado"><h1>Diez veces lo que <Hi say="ingresar">ingresa</Hi> en un año</h1></Head>
      <Card say={year} tone="key" style={{ left: 72, top: 620, width: 400 }}>
        <span className="lab">Cartera / ingresos previstos</span>
        <span className="num mid" style={{ color: "#121110" }}>×10</span>
      </Card>
      <Src>Millones de dólares. Cartera de contratos a 30 de septiembre de 2026 (unos 132.500 M$) y punto medio de su previsión de ingresos para 2026 (13.000 a 13.300 M$). CoreWeave, 8-K del 10 de noviembre.</Src>
    </Frame>
  );
};
