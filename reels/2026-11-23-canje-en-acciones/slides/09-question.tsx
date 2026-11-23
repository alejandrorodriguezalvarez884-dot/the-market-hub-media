// The question for the comments, over the scale.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gap, Ground, Head, Hi, Level, Offer, Sign, Tower, World, ZX, between, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 64, rz: -26, x: 0, y: 0, z: -480, oy: 110 }, { rx: 60, rz: -6, x: 0, y: 0, z: -540, oy: 100 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={224.43} k="zs" />
      <Offer price={204.735} />
      <Level usd={232.37} />
      <Gap from={224.43} to={232.37} />
    </World>}>
      <Head kick="Te pregunto"><h1 className="mid">¿Por qué pagar con <Hi say="acciones">acciones</Hi> y no con dinero?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1270, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
    </Frame>
  );
};
