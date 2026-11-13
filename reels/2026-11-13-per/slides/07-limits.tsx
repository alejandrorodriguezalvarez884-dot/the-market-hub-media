// What the P/E does not say: it is built on profits already earned; the ones to come are not in it.
// A made-up pile: the years counted are solid, those still to come are only outlines.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Pile, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: 24, x: 60, y: 0, z: -40, oy: 220 }, { rx: 72, rz: -20, x: 60, y: 0, z: -10, oy: 220 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-20} y={-80} w={170} d={170} price={200} eps={10} scale={2.2} at={-20} years={6} ghost count={false} priceText="¿?" valueSize={46} />
    </World>}>
      <Head kick="Pero ojo"><h1 className="mid">Mira beneficios que <Hi say="pasaron">ya pasaron</Hi></h1></Head>
      <Card say="menos" style={{ left: 72, top: 1110, width: 500, padding: "16px 24px" }}>
        <Ej />
        <span style={{ display: "block" }}>Un PER bajo puede ser de una empresa que va a <b>ganar menos</b>.</span>
      </Card>
      <Card say="caro" tone="key" style={{ left: 72, top: 1330, width: 500, padding: "14px 24px" }}>
        <span>Solo, no dice si algo está <b className="y">caro o barato</b>.</span>
      </Card>
    </Frame>
  );
};
