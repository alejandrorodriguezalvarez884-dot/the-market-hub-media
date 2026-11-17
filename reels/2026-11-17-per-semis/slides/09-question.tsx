// The recap over the whole wafer, every tower standing, and the question for the comments.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Key, Sign, Wafer, World, between, glide, prog } from "./look/oblea";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 60, rz: -30, x: 0, y: -60, z: -600, oy: 20 }, { rx: 66, rz: -16, x: 0, y: -60, z: -660, oy: 20 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} /><Chips built="all" valueSize={32} /></World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿Qué empresas <Hi say="comparamos">comparamos</Hi>?</h1></Head>
      <Card tone="key" style={{ left: 72, top: 1120, width: 600, padding: "14px 24px" }}>
        <span style={{ fontSize: 31 }}><b>Precio ÷ beneficio</b> = <span style={{ color: "#ffc85c" }}>los años que pagas</span></span>
      </Card>
      <Card say={read} style={{ left: 72, top: 1222, width: 600, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
