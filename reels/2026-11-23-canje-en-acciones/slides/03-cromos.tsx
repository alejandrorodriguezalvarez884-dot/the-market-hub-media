// The example anyone can picture: a swap of trading cards, one of yours for one of mine and a little piece.
// Made up: marked "Ejemplo".
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Cromo, Ej, Frame, Ground, Head, Hi, World, between, ease, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const mine = useSay("mío"), bit = useSay("trocito"), dep = useSay("valga");
  const cam = between({ rx: 70, rz: -8, x: 0, y: 0, z: -10, oy: 100 }, { rx: 66, rz: 8, x: 20, y: 0, z: 50, oy: 100 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Cromo x={-200} k="zs" grow={ease(prog(t, 0.2, 0.7))}>Tuyo</Cromo>
      <Cromo x={120} k="crwd" grow={ease(prog(t, mine - 0.2, 0.7))}>Mío</Cromo>
      <Cromo x={260} w={60} h={110} k="slice" grow={ease(prog(t, bit - 0.2, 0.7))}>+</Cromo>
    </World>}>
      <Head kick="Un cambio de cromos"><h1 className="mid">Tu cromo vale lo que <Hi say="valga">valga el mío</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 1110, width: 640, padding: "16px 24px" }}>
        <Ej />
        <span style={{ display: "block", fontSize: 30 }}>Por cada cromo tuyo: <b>uno mío</b> y <b>un trocito más</b></span>
      </Card>
      <Card say={dep} tone="key" style={{ left: 72, top: 1290, width: 560, padding: "12px 22px" }}>
        <span style={{ fontSize: 28 }}>Si el mío <span className="y"><b>sube o baja</b></span>, el tuyo también</span>
      </Card>
    </Frame>
  );
};
