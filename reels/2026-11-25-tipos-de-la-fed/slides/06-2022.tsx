// 2022: the upper bound from 0.25 % to 4.50 % (FRED); the Nasdaq 100 −33.0 % and the Dow Jones −8.8 % from the close
// of 31-12-2021 to that of 30-12-2022 (Yahoo Finance). The steps of 2022 glow amber as they are raised.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, DX, Frame, Ground, Head, Hi, Num, RZ, Src, Stairs, World, between, ease, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const nas = useSay("nasdaq"), dow = useSay("dow");
  const cam = between({ rx: 62, rz: -18, x: -260, y: 0, z: -360, oy: 40 }, { rx: 60, rz: -36, x: -200, y: 0, z: -300, oy: 40 }, glide(prog(t, 0, 7)));
  const x22 = DX("2022-12-15") + 60;
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs lit={["2022-03-01", "2023-01-01"]} />
      <Bill x={DX("2021-06-01")} y={0} z={RZ(0.25) + 22}><span className="tag">0,25 %</span></Bill>
      <Bill x={x22} y={0} z={RZ(4.5) + 90} opacity={ease(prog(t, 1.2, 0.6))}><span className="val y">4,50 %</span></Bill>
    </World>}>
      <Head kick="2022"><h1 className="mid">De <Hi say="casi">casi cero</Hi> al 4,5 % en un año</h1></Head>
      <Card say={nas} tone="down" style={{ left: 72, top: 1110, width: 420, padding: "14px 22px" }}>
        <span className="lab">Nasdaq 100 · 2022</span><Num say={nas} to={-33.0} decimals={1} suffix=" %" className="num mid" />
      </Card>
      <Card say={dow} tone="down" style={{ left: 512, top: 1110, width: 418, padding: "14px 22px" }}>
        <span className="lab">Dow Jones · 2022</span><Num say={dow} to={-8.8} decimals={1} suffix=" %" className="num mid" />
      </Card>
      <Src>Techo del tipo de la Fed: FRED. Índices, cierre del 31-12-2021 al del 30-12-2022: Yahoo Finance.</Src>
    </Frame>
  );
};
