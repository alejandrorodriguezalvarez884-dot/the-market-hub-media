// First way, debt. Made up (marked "Ejemplo"): a bakery borrows 100,000 € for an oven; a year's interest is 2,000 €
// at 2 % and 5,000 € at 5 %. Two blocks as high as the interest (1,000 € = 60 px), in front of the staircase.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Block, Card, Ej, Frame, Ground, Head, Hi, World, between, ease, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const dos = useSay("dos"), cinco = useSay("cinco");
  const cam = between({ rx: 66, rz: -14, x: 0, y: 520, z: -300, oy: 40 }, { rx: 63, rz: 6, x: 0, y: 520, z: -220, oy: 40 }, glide(prog(t, 0, 7)));
  const a = ease(prog(t, dos - 0.1, 0.8)), b = ease(prog(t, cinco - 0.1, 1.0));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Block x={-170} y={600} h={120 * a} tone="up" />
      <Bill x={-170} y={600} z={120 * a + 20} opacity={a}><span className="val">2.000 €</span></Bill>
      <Block x={170} y={600} h={300 * b} tone="now" />
      <Bill x={170} y={600} z={300 * b + 20} opacity={b}><span className="val y">5.000 €</span></Bill>
    </World>}>
      <Head kick="Vía 1 · la deuda"><h1 className="mid">Pedir prestado <Hi say="cinco">cuesta más</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 1110, width: 640, padding: "16px 24px" }}>
        <Ej />
        <span style={{ display: "block", fontSize: 30, marginBottom: 6 }}>Una panadería pide <b>100.000 €</b> para un horno</span>
        <div className="line"><span>Al 2 %, al año</span><b className="up">2.000 €</b></div>
        <div className="line"><span>Al 5 %, al año</span><b className="y">5.000 €</b></div>
      </Card>
    </Frame>
  );
};
