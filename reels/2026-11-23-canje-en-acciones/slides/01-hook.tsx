// Hook: CrowdStrike buys Zscaler with shares (8-K, 23-11-2026). At 18:06 of Spain, against Friday's close (Yahoo
// Finance): Zscaler 224.43 $ (+15.2 %, from 194.82), CrowdStrike 204.735 $ (−10.8 %, from 229.44); the Nasdaq 100
// +6.9 % (Market Hub). The two shares as towers, one growing and one shrinking, from frame 0.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Co, CX, Frame, Ground, Head, Hi, Src, Tower, World, ZX, between, ease, glide, mix, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 66, rz: -24, x: 0, y: 0, z: -420, oy: 50 }, { rx: 64, rz: -38, x: 0, y: 0, z: -400, oy: 50 }, glide(prog(t, 0, 8)));
  const p = ease(prog(t, 0.3, 2.2));
  const zs = mix(194.82, 224.43, p), cr = mix(229.44, 204.735, p);
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={zs} k="zs" top={<span className="pill g">Zscaler ▲</span>} />
      <Tower x={CX} usd={cr} k="crwd" top={<span className="pill r">CrowdStrike ▼</span>} />
    </World>}>
      <Head kick="Aprende · comprar con acciones"><h1 className="mid"><Co k="crwd" /> compra <Co k="zs" />. <Hi>Con acciones</Hi></h1></Head>
      <Card tone="up" style={{ left: 72, top: 1130, width: 300, padding: "14px 22px" }}>
        <span className="lab">Zscaler</span><span className="num sm">+15,2 %</span><small>224,43 $</small>
      </Card>
      <Card tone="down" style={{ left: 392, top: 1130, width: 300, padding: "14px 22px" }}>
        <span className="lab">CrowdStrike</span><span className="num sm">−10,8 %</span><small>204,74 $</small>
      </Card>
      <Card say="Nasdaq" tone="up" style={{ left: 712, top: 1130, width: 218, padding: "14px 18px" }}>
        <span className="lab">Nasdaq 100</span><span className="num sm" style={{ fontSize: 50 }}>+6,9 %</span><small>18:06 h</small>
      </Card>
      <Src>23 nov, 18:06 h de España, frente al cierre del viernes. Yahoo Finance; Nasdaq 100: Market Hub. La compra: CrowdStrike, 8-K del 23-11-2026.</Src>
    </Frame>
  );
};
