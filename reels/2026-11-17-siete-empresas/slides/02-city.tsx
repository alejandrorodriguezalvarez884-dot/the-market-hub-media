// The index weighs each company by its market value: the city rises from equal heights to the real
// ones (503 companies; data/weights.json from State Street's SPY holdings of 16 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, Src, World, between, ease, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const real = useSay("pesa");
  const cam = between({ rx: 66, rz: -20, x: 0, y: 0, z: -200, oy: 400 }, { rx: 58, rz: -34, x: 0, y: 0, z: 40, oy: 420 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><City equal={1 - ease(prog(t, real, 2.2))} /></World>}>
      <Head kick="Cómo se reparte"><h1>No reparte por <Hi say="igual">igual</Hi></h1></Head>
      <Card say="muchísimo" style={{ left: 72, top: 640, width: 640 }}>
        <span className="lab">503 empresas</span>
        <span style={{ fontSize: 40, lineHeight: 1.2, color: "#f3f6fb", display: "block" }}>Cada una pesa lo que vale en bolsa</span>
      </Card>
      <Src>State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.</Src>
    </Frame>
  );
};
