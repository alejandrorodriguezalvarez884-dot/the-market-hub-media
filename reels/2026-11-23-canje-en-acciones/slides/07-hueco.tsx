// The gap at 18:06: Zscaler 224.43 $ against 232.37 $ of the exchange: 7.94 $, 3.5 %. Still pending (8-K):
// regulatory approvals and the vote of Zscaler's shareholders.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gap, Ground, Head, Hi, Level, Num, Offer, Src, Tower, World, ZX, between, ease, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const eight = useSay("ocho"), why = useSay("faltan");
  const cam = between({ rx: 64, rz: -36, x: 0, y: 0, z: -380, oy: 0 }, { rx: 58, rz: -58, x: -60, y: 0, z: -220, oy: 40 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={224.43} k="zs" />
      <Offer price={204.735} />
      <Level usd={232.37} />
      <Gap from={224.43} to={232.37} grow={ease(prog(t, eight - 0.2, 1))} label={<span className="pill" style={{ background: "#e08a00" }}>7,94 $</span>} />
    </World>}>
      <Head kick="El hueco"><h1 className="mid">Lo que falta mide <Hi say="duda,">la duda</Hi></h1></Head>
      <Card say={eight} tone="amber" style={{ left: 72, top: 1060, width: 380, padding: "14px 22px" }}>
        <span className="lab">Hueco · 18:06 h</span><Num say={eight} to={3.5} decimals={1} suffix=" %" className="num mid" />
        <small>224,43 $ frente a 232,37 $</small>
      </Card>
      <Card say={why} style={{ left: 480, top: 1060, width: 440, padding: "14px 22px" }}>
        <span className="lab">Falta</span>
        <span style={{ fontSize: 28 }}>Los <b>reguladores</b> y el <b>voto</b> de los accionistas de Zscaler</span>
      </Card>
      <Src>Precios: Yahoo Finance, 18:06 h de España. Condiciones: CrowdStrike, 8-K del 23-11-2026. Cálculo propio.</Src>
    </Frame>
  );
};
