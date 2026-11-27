// Made up (marked "Ejemplo"): a shop closes with a bike at 100 €; at night a fault is known; next morning nobody pays
// 100: the first price is another. Two blocks (100 € and 80 €, made-up) with empty floor between them.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Block, Card, Ej, Frame, Ground, Head, Hi, World, between, ease, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const night = useSay("noche"), morning = useSay("abrir");
  const cam = between({ rx: 66, rz: -16, x: 0, y: 900, z: -300, oy: 40 }, { rx: 63, rz: 4, x: 0, y: 900, z: -240, oy: 40 }, glide(prog(t, 0, 8)));
  const a = ease(prog(t, 0.2, 0.8)), n = ease(prog(t, night - 0.1, 0.6)), b = ease(prog(t, morning - 0.1, 0.9));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Block x={-230} y={900} h={300 * a} tone="stone" />
      <Bill x={-230} y={900} z={300 * a + 20} opacity={a}><span className="val">100 €</span></Bill>
      <Bill x={0} y={900} z={60} opacity={n}><span className="zt">Noche: un fallo</span></Bill>
      <Block x={230} y={900} h={240 * b} tone="now" />
      <Bill x={230} y={900} z={240 * b + 20} opacity={b}><span className="val y">80 €</span></Bill>
    </World>}>
      <Head kick="Antes de las cifras"><h1 className="mid">El primer precio <Hi say="otro">ya es otro</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 1110, width: 680, padding: "16px 24px" }}>
        <Ej />
        <div className="line"><span>La tienda cierra: una bici a</span><b>100 €</b></div>
        <div className="line"><span>De noche se sabe que falla</span><b className="down">!</b></div>
        <div className="line"><span>Al abrir, nadie paga 100</span><b className="y">80 €</b></div>
      </Card>
    </Frame>
  );
};
