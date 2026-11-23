// The exchange ratio (CrowdStrike 8-K, 23-11-2026): 1.135 CrowdStrike shares for each Zscaler share, an all-stock
// deal that values Zscaler at about 43.9 billion dollars. The exchange stands up: one red block and a slice.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Co, CX, Frame, Ground, Head, Hi, Offer, Src, Tower, World, ZX, between, ease, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const one = useSay("Por"), sl = useSay("cinco");
  const cam = between({ rx: 64, rz: -38, x: 0, y: 0, z: -340, oy: 30 }, { rx: 62, rz: -14, x: 60, y: 0, z: -320, oy: 30 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={224.43} k="zs" />
      <Offer price={204.735} slice={ease(prog(t, sl - 0.2, 0.9))} opacity={ease(prog(t, one, 0.6))} />
    </World>}>
      <Head kick="La ecuación de canje"><h1 className="mid">Paga con sus <Hi say="acciones.">propias acciones</Hi></h1></Head>
      <Card say="cinco" tone="key" style={{ left: 72, top: 1110, width: 850, padding: "16px 24px" }}>
        <span className="lab">Por cada acción</span>
        <span style={{ fontSize: 36 }}><b>1</b> de Zscaler <span className="y"><b>→ 1,135</b></span> de CrowdStrike</span>
      </Card>
      <Card say="canje." style={{ left: 72, top: 1262, width: 700, padding: "12px 22px" }}>
        <span style={{ fontSize: 28 }}>Solo acciones · valora <Co k="zs" /> en <b>≈ 43.900 M$</b></span>
      </Card>
      <Src>CrowdStrike, 8-K del 23-11-2026 (anexo 99.1).</Src>
    </Frame>
  );
};
