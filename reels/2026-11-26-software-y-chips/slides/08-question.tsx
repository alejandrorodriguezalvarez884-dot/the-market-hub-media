// The close: the camera pulls back over the avenue while the question is asked.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Sign, World, between, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 62, rz: -16, x: 0, y: 0, z: -1200, oy: 380 }, { rx: 56, rz: -26, x: 0, y: 0, z: -1600, oy: 440 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Avenue /></World>}>
      <Head kick="El software"><h1>¿<Hi say="víctima" tone="violet">Víctima</Hi> de la IA, o <Hi say="racha" tone="amber">mala racha</Hi>?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1180, width: 560, padding: "18px 24px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
