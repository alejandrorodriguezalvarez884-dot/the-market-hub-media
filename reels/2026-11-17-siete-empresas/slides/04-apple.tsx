// Apple 8.04 % of the index; the 240 smallest companies together 8.10 % (SPY holdings, 16 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, Logo, SMALL, Src, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const small = useSay("doscientas");
  const cam = between({ rx: 52, rz: -36, x: 0, y: 0, z: 160, oy: 560 }, { rx: 66, rz: -24, x: 0, y: 0, z: -260, oy: 470 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><City rest="dim" tone={(k) => (k === "AAPL" ? "amber" : SMALL.has(k) && t >= small ? "amber" : undefined)} /></World>}>
      <Head kick="Una contra 240"><h1>Apple pesa como <Hi say="doscientas" tone="amber">240 juntas</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 690, width: 560 }}>
        <div className="line"><span style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="apple" h={44} /> Apple</span><b>8,04 %</b></div>
      </Card>
      <Card say={small} tone="amber" style={{ left: 72, top: 830, width: 560 }}>
        <div className="line"><span>Las 240 más pequeñas</span><b>8,10 %</b></div>
      </Card>
      <Src>State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.</Src>
    </Frame>
  );
};
