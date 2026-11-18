// The definition: capitalisation = the price of one share x the number of shares. On the tower: the
// height is the price, the floor is the shares.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Tower, World, between, glide, prog, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -18, x: 0, y: 0, z: 240, oy: -60 }, { rx: 58, rz: 20, x: 0, y: 0, z: 180, oy: -80 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={0} y={0} side={SIDE(24.1)} h={HIGH(152.31)} tone="amber" label="Nvidia" />
    </World>}>
      <Head kick="La cuenta"><h1 className="mid">La <Hi say="capitalización">capitalización</Hi></h1></Head>
      <Card tone="key" say="precio" style={{ left: 72, top: 1120, width: 700, padding: "18px 26px" }}>
        <span className="lab">Capitalización</span>
        <span style={{ fontSize: 44, fontWeight: 800, color: "#fff" }}><span className="y">precio</span> de una acción</span>
        <Card say="número" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent", color: "#e9e2d4" }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#fff" }}>× <span className="y">número</span> de acciones</span>
        </Card>
      </Card>
      <Card say="número" style={{ left: 600, top: 960, width: 330, padding: "10px 18px" }}>
        <small style={{ marginTop: 0 }}>En la torre: la <b>altura</b> es el precio; la <b>planta</b>, las acciones.</small>
      </Card>
    </Frame>
  );
};
