// A made-up example: the same price, 200; a profit of 4 a year fills it in 50 years, a profit of 8 in 25.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Pile, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const slow = useSay("cincuenta"), fast = useSay("duplican");
  const cam = between({ rx: 70, rz: -24, x: -40, y: 0, z: -110, oy: 220 }, { rx: 68, rz: -10, x: -40, y: 0, z: -60, oy: 220 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-330} y={-75} price={200} eps={4} scale={2.2} at={slow} step={0.05} label="Beneficio igual" valueSize={46} />
      <Pile x={60} y={-75} price={200} eps={8} scale={2.2} at={fast + 0.2} step={0.08} label="Beneficio ×2" valueSize={46} />
    </World>}>
      <Head kick="¿Por qué pagar tanto?"><h1 className="mid">Porque se espera que <Hi say="crezcan">crezca</Hi></h1></Head>
      <Card say="mitad" style={{ left: 72, top: 1230, width: 520, padding: "16px 24px" }}>
        <Ej />
        <span style={{ display: "block" }}>El mismo precio se paga en <b>la mitad de años</b>.</span>
      </Card>
    </Frame>
  );
};
