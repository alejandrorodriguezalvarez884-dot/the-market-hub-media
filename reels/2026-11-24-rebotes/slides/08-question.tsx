// The close: the camera pulls back over the map while the question is asked.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Sign, World, between, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 58, rz: -10, x: 0, y: -1150, z: -2000, oy: 300 }, { rx: 50, rz: -24, x: 0, y: -1150, z: -2300, oy: 360 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Map paint={(d) => (d.date === "2026-11-23" ? "amber" : d.rank <= 20 ? "red" : "dim")} line20={0.8} /></World>}>
      <Head kick="El salto del lunes"><h1>¿<Hi say="alivio" tone="up">Alivio</Hi>, o <Hi say="nervios" tone="down">nervios</Hi>?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1180, width: 560, padding: "18px 24px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
