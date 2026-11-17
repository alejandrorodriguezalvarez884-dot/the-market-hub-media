// Nvidia at the close of 16 Nov 2026: 156.14 $; diluted EPS of the last twelve months 7.91 $, P/E 19.7;
// mean estimate for its fiscal year to January 2028, 15.84 $ (52 analysts), forward P/E 9.9 (Yahoo
// Finance; own calculation).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Key, Logo, Src, Wafer, World, between, glide, mid, prog } from "./look/oblea";

export default () => {
  const t = useSeconds();
  const pe = useSay("veinte"), fwd = useSay("Adelantado");
  const m = mid("NVDA");
  const cam = between({ rx: 62, rz: -30, x: m.x + 80, y: m.y, z: -120, oy: 10 }, { rx: 66, rz: -20, x: m.x + 60, y: m.y, z: 40, oy: 10 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} /><Chips cues={{ NVDA: [pe, fwd] }} valueSize={50} /></World>}>
      <Head kick={<span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>Nvidia</span>}><h1 className="mid">De 20 años a <Hi say="Adelantado">menos de 10</Hi></h1></Head>
      <Card say="veinte" style={{ left: 72, top: 1120, width: 660, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Nvidia · 156,14 $</span>
        <div className="line"><span>Ganó (12 meses)</span><b>7,91 $ · PER 19,7</b></div>
        <Card say="Adelantado" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Se espera (a ene. 2028)</span><b className="y">15,84 $ · 9,9</b></div>
        </Card>
      </Card>
      <Key style={{ position: "absolute", left: 72, top: 575 }} />
      <Src>Precio al cierre del 16-11-2026, beneficio por acción de los últimos doce meses y media de 52 analistas (Yahoo Finance). PER: cálculo propio.</Src>
    </Frame>
  );
};
