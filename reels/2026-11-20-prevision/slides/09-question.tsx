// The recap and the question for the comments, over the whole road: what happened behind the line of today,
// what is coming ahead of it.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Block, Card, Frame, Head, Hi, Road, Sign, Today, World, between, glide, prog, EPS } from "./look/camino";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 62, rz: -28, x: 0, y: 120, z: -560, oy: 40 }, { rx: 58, rz: -48, x: 0, y: 0, z: -620, oy: 30 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Road />
      <Block y={640} h={EPS(0.45)} />
      <Block y={420} h={EPS(0.38)} />
      <Block y={200} h={EPS(0.52)} />
      <Block y={-20} h={EPS(0.82)} kind="hot" label="Lo que pasó" />
      <Today y={-190} side="left" />
      <Block y={-400} h={240} kind="ahead" label="Lo que viene" />
    </World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿De qué empresa quieres ver su <Hi say="previsión">previsión?</Hi></h1></Head>
      <Card tone="key" style={{ left: 72, top: 1130, width: 640, padding: "14px 24px" }}>
        <span style={{ fontSize: 30 }}><b>Resultados</b>: lo que pasó. <span className="y"><b>Previsión</b></span>: lo que viene.</span>
      </Card>
      <Card say={read} style={{ left: 72, top: 1270, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
