// The premium, at Friday's closes (Yahoo Finance, 20-11-2026): 1.135 × 229.44 = 260.41 $ for a Zscaler share
// that closed at 194.82 $: +33.7 %. The amber glass fills the difference on top of Zscaler.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, CX, Frame, Gap, Ground, Head, Hi, Level, Num, Offer, Src, Tower, World, ZX, between, ease, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const fz = useSay("ciento"), dif = useSay("diferencia,");
  const cam = between({ rx: 66, rz: -30, x: 0, y: 0, z: -400, oy: 0 }, { rx: 62, rz: -44, x: 0, y: 0, z: -360, oy: 10 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={194.82} k="zs" opacity={ease(prog(t, fz - 0.3, 0.5)) * 0.9 + 0.1} top={undefined} />
      <Offer price={229.44} />
      <Level usd={260.41} opacity={ease(prog(t, dif - 0.2, 0.5))} />
      <Gap from={194.82} to={260.41} grow={ease(prog(t, dif, 1.2))} />
    </World>}>
      <Head kick="El viernes, al cierre"><h1 className="mid">La <Hi say="prima">prima</Hi>: lo que se paga de más</h1></Head>
      <Card style={{ left: 72, top: 1090, width: 440, padding: "14px 22px", fontSize: 26 }}>
        <div className="line"><span style={{ fontSize: 26 }}>1,135 CrowdStrike</span><b>260,41 $</b></div>
        <div className="line"><span style={{ fontSize: 26 }}>1 Zscaler</span><b>194,82 $</b></div>
      </Card>
      <Card say={dif} tone="amber" style={{ left: 530, top: 1090, width: 360, padding: "14px 22px" }}>
        <span className="lab">Prima</span><Num say={dif} to={33.7} decimals={1} prefix="+" suffix=" %" className="num mid" />
      </Card>
      <Src>Cierres del 20 de noviembre: Yahoo Finance. Canje de 1,135: CrowdStrike, 8-K. Cálculo propio.</Src>
    </Frame>
  );
};
