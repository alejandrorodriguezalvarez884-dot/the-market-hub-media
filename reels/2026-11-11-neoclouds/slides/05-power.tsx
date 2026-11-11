// CoreWeave's power: more than 1.7 GW active and more than 4.6 GW contracted at 30 September 2026
// (8-K). The campus has 23 halls of 200 MW each, drawn here: 8.5 of them lit is 1.7 GW of 4.6.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Campus, Card, Frame, Head, Hi, Num, Src, World, between, ease, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const on = useSay("marcha"), deal = useSay("contratados");
  const cam = between({ rx: 54, rz: -22, x: 0, y: 160, z: -60, oy: 220 }, { rx: 60, rz: -34, x: 0, y: 0, z: -260, oy: 260 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Campus n={23} cols={6} lit={(1.7 / 4.6) * ease(prog(t, on - 0.4, 1.6))} build={ease(prog(t, 0.1, 1.2))} /></World>}>
      <Head kick="El límite"><h1>Ya no son los clientes: es la <Hi say="electricidad">luz</Hi></h1></Head>
      <Card say={on} tone="ice" style={{ left: 72, top: 1140, width: 380 }}>
        <span className="lab">En marcha</span>
        <Num to={1.7} decimals={1} suffix=" GW" say={on} className="num mid" />
      </Card>
      <Card say={deal} style={{ left: 480, top: 1140, width: 380 }}>
        <span className="lab">Contratados</span>
        <Num to={4.6} decimals={1} suffix=" GW" say={deal} className="num mid" />
      </Card>
      <Src>Más de 1,7 GW activos y más de 4,6 GW contratados a 30 de septiembre de 2026 (CoreWeave, 8-K). Cada nave del dibujo son 200 MW.</Src>
    </Frame>
  );
};
