// The recap and the question for the comments, over the piles of the reel.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Pile, Sign, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 66, rz: -20, x: -40, y: 0, z: -220, oy: 170 }, { rx: 60, rz: -36, x: -40, y: 0, z: -320, oy: 180 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-440} y={-75} w={130} d={130} price={200} eps={10} scale={2.2} at={-20} label="Panadería" valueSize={42} />
      <Pile x={-150} y={-75} w={130} d={130} price={186.86} eps={3.52} scale={2.35} at={-20} label="Nvidia 2025" valueSize={42} />
      <Pile x={140} y={-75} w={130} d={130} price={160.53} eps={7.91} scale={2.35} at={-20} label="Nvidia hoy" valueSize={42} />
    </World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿De qué empresa quieres saber su <Hi say="PER">PER</Hi>?</h1></Head>
      <Card tone="key" style={{ left: 72, top: 1170, width: 540, padding: "14px 24px" }}>
        <span style={{ fontSize: 32 }}><b>Precio ÷ beneficio</b> = <span className="y">los años que pagas</span></span>
      </Card>
      <Card say={read} style={{ left: 72, top: 1270, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
