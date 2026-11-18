// A word: in Spanish "un billón" is a million millions (10^12), what English calls a trillion; the
// English "billion" is "mil millones" (Wikipedia, «Billón»). The camera rises over the tower.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Tower, World, between, glide, prog, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 62, rz: -16, x: 0, y: 0, z: 220, oy: -60 }, { rx: 40, rz: 10, x: 0, y: 0, z: -160, oy: -200 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={0} y={0} side={SIDE(24.1)} h={HIGH(152.31)} tone="amber" />
    </World>}>
      <Head kick="La palabra"><h1 className="mid">Un <Hi say="billón">billón</Hi>: un millón de millones</h1></Head>
      <Card say="millón" tone="key" style={{ left: 72, top: 1090, width: 760, padding: "16px 26px" }}>
        <span className="num mid" style={{ fontSize: 66 }}>1.000.000.000.000</span>
      </Card>
      <Card say="trillion" style={{ left: 72, top: 1225, width: 760, padding: "12px 24px" }}>
        <div className="line"><span>billón (español)</span><b className="y">= trillion (inglés)</b></div>
        <div className="line"><span>mil millones</span><b>= billion (inglés)</b></div>
      </Card>
      <Src style={{ top: 1400 }}>Wikipedia en español, «Billón».</Src>
    </Frame>
  );
};
