// Below the consensus and up anyway: Gap +12.3 % at 18:06 of Spain (Yahoo Finance); what Gap said (8-K): demand
// softened in October and early November with warmer weather, and trends improved as temperatures cooled.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bar, Bill, Block, Card, Frame, Head, Hi, Road, Src, Today, World, between, glide, prog, ease } from "./look/camino";

const K = 150;

export default () => {
  const t = useSeconds();
  const up = useSay("sube"), cold = useSay("frío"), alone = useSay("sola");
  const cam = between({ rx: 72, rz: -14, x: 0, y: -300, z: -340, oy: 160 }, { rx: 66, rz: -30, x: 0, y: -280, z: -320, oy: 160 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Road />
      <Today y={-60} />
      <Block x={-130} y={-300} w={170} d={170} h={K * 2.40} kind="ahead" label="Antes" opacity={0.6} />
      <Block x={130} y={-300} w={170} d={170} h={K * 2.315} kind="ahead" label="Ahora" />
      <Bar x={0} y={-300} w={500} h={K * 2.39} label="Consenso" />
      <Bill x={0} y={-300} z={K * 2.39 + 130} opacity={ease(prog(t, up - 0.1, 0.6))}><span className="pill g">Gap +12,3 %</span></Bill>
    </World>}>
      <Head kick="Gap · hoy"><h1 className="mid">Por debajo, y aun así <Hi tone="up" say="sube">sube</Hi></h1></Head>
      <Card say="octubre" style={{ left: 72, top: 1090, width: 660, padding: "14px 22px" }}>
        <span className="lab">Lo que cuenta Gap</span>
        <span style={{ fontSize: 28 }}>La demanda se suavizó en octubre y principios de noviembre, con un tiempo más cálido<Card say={cold} style={{ position: "relative", display: "inline", left: 0, top: 0, padding: 0, border: 0, boxShadow: "none", background: "transparent", fontSize: 28 }}>, y <b>mejora al bajar las temperaturas</b></Card>.</span>
      </Card>
      <Card say={alone} tone="key" style={{ left: 72, top: 1290, width: 560, padding: "12px 22px" }}>
        <span style={{ fontSize: 30 }}>La previsión pesa, <span className="y"><b>no decide sola</b></span></span>
      </Card>
      <Src style={{ top: 1410 }}>Gap, 8-K del 19-11-2026 (traducido). Precio: Yahoo Finance, 18:06 de España.</Src>
    </Frame>
  );
};
