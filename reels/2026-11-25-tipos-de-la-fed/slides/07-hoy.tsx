// Today: a 98 % chance of a 25-point hike in December, per CME Group (Yahoo Finance live, 25-11-2026); the tariffs
// weigh too. At 18:06 of Spain the Nasdaq 100 −3.2 % and the Dow Jones −0.7 % (Market Hub). A glass step after today.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, END, Frame, Ground, Head, Hi, RZ, Src, Stairs, World, between, ease, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const dic = useSay("diciembre"), nas = useSay("nasdaq");
  const g = ease(prog(t, dic - 0.4, 1.0));
  const cam = between({ rx: 62, rz: -44, x: 380, y: 0, z: -320, oy: 40 }, { rx: 60, rz: -30, x: 440, y: 0, z: -280, oy: 40 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs ghost={g} />
      <Bill x={END + 61} y={0} z={RZ(4.25) * g + 22} opacity={g}><span className="pill" style={{ background: "#e08a00" }}>¿Diciembre?</span></Bill>
    </World>}>
      <Head kick="Hoy"><h1 className="mid"><Hi say="noventa">98 %</Hi> a otra subida en diciembre</h1></Head>
      <Card say={nas} tone="down" style={{ left: 72, top: 1110, width: 420, padding: "14px 22px" }}>
        <span className="lab">Nasdaq 100 · 18:06 h</span><span className="num mid">−3,2 %</span>
      </Card>
      <Card say="dow" style={{ left: 512, top: 1110, width: 418, padding: "14px 22px" }}>
        <span className="lab">Dow Jones · 18:06 h</span><span className="num mid" style={{ color: "#d6402f" }}>−0,7 %</span>
      </Card>
      <Src>Probabilidad de una subida de 0,25 puntos el 9 de diciembre: CME Group, según Yahoo Finance, 25 nov. Índices: Market Hub (Yahoo Finance). También pesan los aranceles.</Src>
    </Frame>
  );
};
