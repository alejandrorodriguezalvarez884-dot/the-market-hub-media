// The price is paid for the profits to come: the camera travels past the line of today to the weak winter,
// and a made-up price tag of the shop goes down when "menos" is said.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Block, Card, Frame, Head, Hi, Road, Today, World, between, glide, prog, mix, ease } from "./look/camino";

export default () => {
  const t = useSeconds();
  const less = useSay("menos"), vd = useSay("vendrán");
  const cam = between({ rx: 64, rz: -30, x: 0, y: -40, z: -200, oy: 40 }, { rx: 62, rz: -62, x: 0, y: -80, z: -160, oy: 40 }, glide(prog(t, 0, 7)));
  const p = ease(prog(t, less - 0.1, 1.2));
  return (
    <Frame world={<World cam={cam}><Road />
      <Block y={420} w={170} d={170} h={150} />
      <Block y={150} w={170} d={170} h={300} kind="hot" label="Ayer" />
      <Today y={-60} />
      <Block y={-280} w={170} d={170} h={70} kind="ahead" label="Invierno" />
      <Bill x={0} y={-280} z={190} opacity={ease(prog(t, vd - 0.1, 0.6))}>{p > 0.5 ? <span className="pill r">Precio ▼</span> : <div className="bar-tag">El precio mira aquí</div>}</Bill>
    </World>}>
      <Head kick="El precio"><h1 className="mid">Se paga lo que <Hi say="vendrán">vendrá</Hi>, no lo de ayer</h1></Head>
      <Card say="menos" tone="key" style={{ left: 72, top: 1130, width: 620, padding: "16px 24px" }}>
        <span className="lab">Ejemplo · la heladería</span>
        <span style={{ fontSize: 30 }}>Verano récord, invierno flojo: se paga <span className="y"><b>menos</b></span> por ella</span>
      </Card>
    </Frame>
  );
};
