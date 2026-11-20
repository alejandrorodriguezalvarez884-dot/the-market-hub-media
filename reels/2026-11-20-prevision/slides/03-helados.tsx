// The example (made-up numbers): an ice-cream shop whose summer profit doubled (10,000 € to 20,000 €) and who
// warns the winter will be weak: a small glass block beyond the line of today.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Block, Card, Ej, Frame, Head, Hi, Road, Today, World, between, glide, prog, ease } from "./look/camino";

export default () => {
  const t = useSeconds();
  const dbl = useSay("doble"), inv = useSay("invierno");
  const cam = between({ rx: 60, rz: -14, x: 0, y: 40, z: -260, oy: 40 }, { rx: 64, rz: -30, x: 0, y: -40, z: -200, oy: 40 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Road />
      <Block y={420} w={170} d={170} h={150} label="Verano pasado" />
      <Block y={150} w={170} d={170} h={300} grow={ease(prog(t, dbl - 0.3, 1.2))} kind="hot" label="Este verano" />
      <Today y={-60} />
      <Block y={-280} w={170} d={170} h={70} grow={ease(prog(t, inv - 0.2, 1.0))} kind="ahead" label="Invierno" />
    </World>}>
      <Head kick="La idea"><h1 className="mid">Una heladería que avisa del <Hi say="invierno">invierno</Hi></h1></Head>
      <Card say="verano" style={{ left: 72, top: 1120, width: 600, padding: "14px 24px" }}>
        <Ej />
        <div className="line"><span>Verano pasado</span><b>10.000 €</b></div>
        <div className="line"><span>Este verano</span><b className="up">20.000 €</b></div>
        <Card say={inv} style={{ position: "relative", left: 0, top: 0, padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Invierno</span><b className="y">«flojo»</b></div>
        </Card>
      </Card>
    </Frame>
  );
};
