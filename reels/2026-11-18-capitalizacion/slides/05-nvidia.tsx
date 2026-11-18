// The real thing: Nvidia, 24,100 million shares (SEC, 21 August 2026) at 152.31 $ (Yahoo Finance, 18:07
// of Spain): 3.67 trillion dollars ("billones"). The tower grows from the floor up.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Num, Src, Tower, World, between, glide, prog, ease, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const at = useSay("ciento");
  const cam = between({ rx: 74, rz: -40, x: 0, y: 0, z: 120, oy: -60 }, { rx: 62, rz: -16, x: 0, y: 0, z: 220, oy: -60 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={0} y={0} side={SIDE(24.1)} h={HIGH(152.31)} grow={ease(prog(t, at - 0.3, 1.6))} tone="amber" label="24.100 M acciones" />
    </World>}>
      <Head kick={<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>Nvidia</span>}><h1 className="mid"><Logo name="nvidia" h={64} /> <Hi say="billones">3,7 billones</Hi> de dólares</h1></Head>
      <Card say="veinticuatro" style={{ left: 72, top: 1110, width: 600, padding: "16px 24px" }}>
        <div className="line"><span>Acciones</span><b>24.100 M</b></div>
        <Card say={at} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>× precio, 18:07 h</span><b>152,31 $</b></div>
        </Card>
        <Card say="billones" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>= capitalización</span><b className="y"><Num to={3.67} decimals={2} say="son" className="" style={{ color: "inherit" }} takes={0.6} /> bill. $</b></div>
        </Card>
      </Card>
      <Src>Acciones: SEC, 10-Q a 21 de agosto de 2026. Precio: Yahoo Finance, 18 de noviembre, 18:07 de España.</Src>
    </Frame>
  );
};
