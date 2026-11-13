// A made-up example: a bakery that earns 10,000 € a year, bought for 200,000 €: twenty years of profit.
// The glass tower is the price; each amber block, one year of profit, at the same scale.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Pile, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const fill = useSay("doscientos");
  const cam = between({ rx: 68, rz: -34, x: 60, y: 0, z: -60, oy: 200 }, { rx: 72, rz: -14, x: 60, y: 0, z: -20, oy: 210 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-20} y={-80} w={170} d={170} price={200} eps={10} scale={2.2} at={fill + 0.3} step={0.13} priceText="200.000 €" label="La panadería" valueSize={46} />
    </World>}>
      <Head kick="Imagina"><h1 className="mid">Pagar <Hi say="veinte">20 años</Hi> de beneficios</h1></Head>
      <Card style={{ left: 72, top: 1140, width: 430 }}>
        <Ej />
        <div className="line"><span>Gana al año</span><b>10.000 €</b></div>
        <Card say={fill} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Pagas</span><b>200.000 €</b></div>
        </Card>
        <Card say="veinte" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Años</span><b className="y">20</b></div>
        </Card>
      </Card>
    </Frame>
  );
};
