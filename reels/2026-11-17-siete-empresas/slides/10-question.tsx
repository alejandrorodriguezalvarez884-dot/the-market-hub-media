// The close: the city levels out to equal parts while the question is asked.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, Sign, World, between, ease, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 60, rz: -30, x: 0, y: 0, z: 0, oy: 420 }, { rx: 52, rz: -48, x: 0, y: 0, z: -200, oy: 460 }, glide(prog(t, 0, 6)));
  return (
    <Frame world={<World cam={cam}><City equal={ease(prog(t, 0.6, 3))} /></World>}>
      <Head kick="Te pregunto"><h1>¿Comprar el índice sigue siendo <Hi say="repartir">repartir</Hi>?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1150, width: 560, padding: "18px 24px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
