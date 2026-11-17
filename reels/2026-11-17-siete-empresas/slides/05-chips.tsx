// Nvidia 5.90 %, Broadcom 2.48 %, AMD 1.29 %: 9.67 % of the index (SPY holdings, 16 Nov 2026).
import React from "react";
import { useSeconds } from "@mh/kit";
import { City, CHIPS, Card, Frame, Head, Hi, Logo, Src, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 60, rz: -46, x: 0, y: 0, z: 160, oy: 460 }, { rx: 56, rz: -20, x: 0, y: 0, z: 240, oy: 480 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><City rest="dim" tone={(k) => (CHIPS.includes(k) ? "down" : undefined)} /></World>}>
      <Head kick="Los chips"><h1>Casi un <Hi say="diez" tone="down">10 %</Hi> del índice</h1></Head>
      <Card say="nvidia" style={{ left: 72, top: 640, width: 580 }}>
        <div className="line"><span style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={40} /> Nvidia</span><b>5,90 %</b></div>
        <div className="line"><span style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="broadcom" h={40} /> Broadcom</span><b>2,48 %</b></div>
        <div className="line"><span style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="amd" h={40} /> AMD</span><b>1,29 %</b></div>
        <div className="line"><span>Las tres</span><b className="down">9,67 %</b></div>
      </Card>
      <Src>State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.</Src>
    </Frame>
  );
};
