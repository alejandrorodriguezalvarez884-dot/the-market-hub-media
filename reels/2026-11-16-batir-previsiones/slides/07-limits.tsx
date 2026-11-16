// What moves the price is the distance, not the profit: a company can earn more than ever and fall if it
// earns less than expected. A picture with no numbers: a column taller than last year's that stays under
// a higher bar. Ejemplo.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Jump, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const more = useSay("nunca"), less = useSay("menos");
  const cam = between({ rx: 64, rz: -18, x: 0, y: 0, z: -120, oy: 300 }, { rx: 68, rz: 10, x: 0, y: 0, z: -80, oy: 300 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={-220} y={0} w={200} bar={4} eps={4.3} scale={60} barAt={-5} at={-5} epsText="Antes" label="Hace un año" size={36} />
      <Jump x={150} y={0} w={200} bar={7.5} eps={6.6} scale={60} barAt={-5} at={more - 0.3} takes={1.6} epsText="Récord" surprise="Por debajo" label="Hoy" size={36} />
    </World>}>
      <Head kick="Lo que mueve el precio"><h1 className="mid">Ganar más que nunca y <Hi say="caer" tone="down">caer</Hi></h1></Head>
      <Card say={less} style={{ left: 72, top: 1210, width: 520, padding: "14px 24px" }}>
        <Ej />
        <span style={{ display: "block", fontSize: 30 }}>El precio ya cuenta con el <b>listón</b>. Lo que lo mueve es la <b>distancia</b>.</span>
      </Card>
    </Frame>
  );
};
