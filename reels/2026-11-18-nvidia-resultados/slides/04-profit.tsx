// GAAP net income $65.3bn; GAAP gross margin 74.8 % (adjusted 74.9 %); diluted EPS $2.70 GAAP, $2.68
// adjusted (release of 17 November 2026). Analysts expected adjusted EPS of $2.48 (LSEG, via CNBC).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Gpu, Head, Hi, Num, Src, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const keep = useSay("quedan"), share = useSay("acción"), exp = useSay("esperados");
  const cam = between({ rx: 58, rz: -40, x: 0, y: 0, z: 120, oy: 380 }, { rx: 64, rz: -18, x: 0, y: 0, z: -60, oy: 420 }, glide(prog(t, 0, 11)));
  return (
    <Frame world={<World cam={cam}><Floor w={2400} d={2400} /><Gpu x={0} y={0} lift={40} heat={0.6 * glide(prog(t, 0, 4))} scale={1.15} /></World>}>
      <Head kick="Lo que gana · tercer trimestre"><h1><Hi say="sesenta">65.300 M$</Hi> de beneficio</h1></Head>
      <Card say={keep} tone="key" style={{ left: 72, top: 610, width: 640 }}>
        <span className="lab">Margen bruto</span>
        <span className="num mid">74,8 %</span>
        <small style={{ color: "#6b6760" }}>De cada 100 $ que vende, le quedan 74,8 tras fabricar</small>
      </Card>
      <Card say={share} tone="ice" style={{ left: 72, top: 1000, width: 400 }}>
        <span className="lab">Beneficio por acción</span>
        <Num to={2.68} decimals={2} suffix=" $" say={share} className="num sm" />
        <small>Ajustado · 2,70 $ sin ajustar</small>
      </Card>
      <Card say={exp} style={{ left: 500, top: 1000, width: 400 }}>
        <span className="lab">Esperaban</span>
        <span className="num sm">2,48 $</span>
        <small>Media de analistas (LSEG)</small>
      </Card>
      <Src>Nvidia, comunicado del 17 de noviembre de 2026 (beneficio neto y por acción según sus normas contables, GAAP, y ajustado). Lo esperado: LSEG, según CNBC.</Src>
    </Frame>
  );
};
