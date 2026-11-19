// The close: the Fed meets on 8 and 9 Dec 2026 (federalreserve.gov calendar); the camera pulls back
// over the sea while the question is asked.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gauge, Head, Hi, Island, Sea, Sign, Water, World, between, glide, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 68, rz: -20, x: -100, y: 0, z: 0, oy: 360 }, { rx: 60, rz: -46, x: -100, y: 0, z: -300, oy: 380 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={5.072} /><Island pct={5.464} wet={5.072} /><Gauge x={-420} y={60} wet={5.072} /></World>}>
      <Head kick="La Fed decide el 9 de diciembre"><h1>¿Pesarán más los beneficios o <Hi say="tipos">los tipos</Hi>?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1180, width: 560, padding: "18px 24px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
