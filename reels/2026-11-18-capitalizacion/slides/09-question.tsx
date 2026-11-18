// The recap and the question for the comments, over the three towers of the reel.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Sign, Tower, World, between, glide, prog, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 62, rz: -40, x: 40, y: 0, z: -680, oy: -20 }, { rx: 56, rz: -60, x: 40, y: 0, z: -740, oy: -30 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={-260} y={60} side={SIDE(24.1)} h={HIGH(152.31)} tone="amber" label="Nvidia" />
      <Tower x={60} y={-40} side={SIDE(7.426)} h={HIGH(503.43)} tone="ink" label="Microsoft" />
      <Tower x={330} y={60} side={SIDE(14.532)} h={HIGH(352.55)} label="Apple" />
    </World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿De qué empresa quieres ver su <Hi say="torre">torre</Hi>?</h1></Head>
      <Card tone="key" style={{ left: 72, top: 1150, width: 640, padding: "14px 24px" }}>
        <span style={{ fontSize: 30 }}><b>Altura</b> (precio) × <b>planta</b> (acciones) = <span className="y">capitalización</span></span>
      </Card>
      <Card say={read} style={{ left: 72, top: 1280, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
