// The recap and the question for the comments, over the stands of the reel.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Jump, Sign, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 66, rz: -22, x: 0, y: 0, z: -200, oy: 290 }, { rx: 60, rz: -36, x: 0, y: 0, z: -300, oy: 290 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={-200} y={0} w={200} bar={2.09} eps={2.22} scale={150} barAt={-5} at={-5} epsText="2,22 $" surprise="+6,2 %" label="Ago. 2026" size={38} />
      <Jump x={170} y={0} w={220} bar={2.49} scale={150} barAt={-5} barText="2,49 $" label="Mañana" size={38} />
    </World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿De qué empresa quieres ver su <Hi say="listón">listón</Hi>?</h1></Head>
      <Card tone="key" style={{ left: 72, top: 1150, width: 620, padding: "14px 24px" }}>
        <span style={{ fontSize: 30 }}><b>Nota</b> (BPA) · <b>listón</b> (consenso) · <span className="y">la distancia</span> (sorpresa)</span>
      </Card>
      <Card say={read} style={{ left: 72, top: 1270, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
