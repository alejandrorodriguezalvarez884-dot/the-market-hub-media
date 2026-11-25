// What it is: the price of overnight money between banks. Today 3.75-4.00 % (FRED, 25-11-2026), after a rise on
// 17-09-2026 (the step before was 3.50-3.75 %). The camera climbs to the top of the staircase.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, END, Frame, Ground, Head, Hi, RZ, Src, Stairs, World, between, ease, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const hoy = useSay("hoy");
  const cam = between({ rx: 64, rz: -34, x: 80, y: 0, z: -560, oy: 60 }, { rx: 60, rz: -48, x: 420, y: 0, z: -260, oy: 30 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs />
      <Bill x={END - 60} y={0} z={RZ(4) + 24} opacity={ease(prog(t, hoy, 0.5))}><span className="pill" style={{ background: "#e08a00" }}>3,75 – 4,00 %</span></Bill>
    </World>}>
      <Head kick="Qué es"><h1 className="mid">El <Hi say="precio">precio del dinero</Hi> a un día</h1></Head>
      <Card style={{ left: 72, top: 1110, width: 620, padding: "16px 24px" }}>
        <span className="lab">Tipo de los fondos federales</span>
        <span style={{ display: "block", fontSize: 30 }}>Lo que se cobran los <b>bancos</b> de EE. UU. al prestarse dinero de un día para otro</span>
      </Card>
      <Card say={hoy} tone="amber" style={{ left: 712, top: 1110, width: 218, padding: "14px 18px" }}>
        <span className="lab">Hoy</span><span className="num sm" style={{ fontSize: 44 }}>3,75–4 %</span>
      </Card>
      <Src>Objetivo de la Reserva Federal, 25 nov. 2026: FRED. Cada escalón dura lo que duró el tipo.</Src>
    </Frame>
  );
};
