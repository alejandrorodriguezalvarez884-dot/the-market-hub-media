// The question. Today's session was short: 9:30 to 13:00 in New York, 19:00 in Spain (Yahoo Finance, trading periods
// of 27-11-2026; NYSE calendar).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, MID, Sign, Src, Track, VRTX, World, Zones, between, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 60, rz: -30, x: MID("fp"), y: 0, z: -820, oy: 110 }, { rx: 60, rz: -18, x: MID("fp") + 80, y: 0, z: -860, oy: 110 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["fp"]} /><Track s={VRTX} hi={["fp"]} dim={0.35} /></World>}>
      <Head kick="Te pregunto · hoy cerró a las 19:00"><h1 className="mid">¿Miras la <Hi say="preapertura">preapertura</Hi> antes de que abra?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1200, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
      <Src style={{ top: 1330 }}>Sesión corta por el Black Friday, de 9:30 a 13:00 en Nueva York: Yahoo Finance.</Src>
    </Frame>
  );
};
