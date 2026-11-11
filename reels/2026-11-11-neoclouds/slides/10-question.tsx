// The close: a campus lighting up hall by hall, and the question for the comments.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Campus, Card, Frame, Head, Hi, Sign, World, between, ease, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 60, rz: -30, x: 0, y: 0, z: -260, oy: 260 }, { rx: 50, rz: -44, x: 0, y: 0, z: -520, oy: 330 }, glide(prog(t, 0, 6)));
  return (
    <Frame world={<World cam={cam}><Campus n={30} cols={6} lit={ease(prog(t, 0, 4.5))} /></World>}>
      <Head kick="Te pregunto"><h1>¿Serán las <Hi say="eléctricas">eléctricas</Hi> de la próxima década?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1150, width: 560, padding: "18px 24px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
