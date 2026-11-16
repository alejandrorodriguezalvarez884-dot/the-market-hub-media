// The picture anyone knows: an exam where everyone expects a 7 and you get an 8. Made-up numbers: Ejemplo.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Jump, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const seven = useSay("siete"), eight = useSay("ocho");
  const cam = between({ rx: 66, rz: -12, x: 0, y: 0, z: 40, oy: 250 }, { rx: 64, rz: 14, x: 0, y: 0, z: 0, oy: 250 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={40} y={0} bar={7} eps={8} scale={48} barAt={seven - 0.3} at={eight - 0.2} takes={1.1} barText="Se espera: 7" epsText="Nota: 8" surprise="+14 %" label="El examen" w={260} />
    </World>}>
      <Head kick="Imagina"><h1 className="mid">Sacar más de lo que se <Hi say="superado">esperaba</Hi></h1></Head>
      <Card say={seven} style={{ left: 72, top: 1180, width: 470, padding: "14px 24px" }}>
        <Ej />
        <div className="line"><span>Lo que se espera</span><b>7</b></div>
        <Card say={eight} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Tu nota</span><b className="up">8</b></div>
        </Card>
      </Card>
    </Frame>
  );
};
