// The P/E: the price of a share divided by its profit per share in a year. The bakery's tower, full.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Pile, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 72, rz: -14, x: 60, y: 0, z: -20, oy: 210 }, { rx: 62, rz: 18, x: 60, y: 0, z: -80, oy: 230 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-20} y={-80} w={170} d={170} price={200} eps={10} scale={2.2} at={-20} priceText="Precio" valueSize={46} />
    </World>}>
      <Head kick="Eso es el PER"><h1 className="mid">Cuántos <Hi say="años">años</Hi> de beneficio pagas</h1></Head>
      <Card say="precio" tone="key" style={{ left: 72, top: 1100, width: 470 }}>
        <span className="lab">PER</span>
        <span style={{ display: "block", fontSize: 38, lineHeight: 1.2 }}><b>Precio</b> de la acción</span>
        <span style={{ display: "block", fontSize: 38, lineHeight: 1.2, margin: "6px 0" }} className="y">÷</span>
        <span style={{ display: "block", fontSize: 38, lineHeight: 1.2 }}><b>Beneficio por acción</b> en un año</span>
      </Card>
    </Frame>
  );
};
