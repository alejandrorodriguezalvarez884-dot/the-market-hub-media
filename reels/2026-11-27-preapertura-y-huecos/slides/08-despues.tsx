// After the gap: Vertex went down to 502.90 $ in today's session and at 18:06 of Spain was at 533.77 $, 5.4 % under
// Wednesday's close (564.12 $) (Yahoo Finance). Explained, never forecast.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Level, MID, SEGX, Src, Track, VRTX, World, Zones, ZoneTag, between, glide, prog } from "./look/pista";

const Z = (p: number) => (p - 480) * 3.4 + 16;
export default () => {
  const t = useSeconds();
    const cam = between({ rx: 60, rz: -40, x: MID("fs") - 60, y: 0, z: -520, oy: 140 }, { rx: 58, rz: -54, x: MID("fs"), y: 0, z: -480, oy: 140 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["fs"]} /><Track s={VRTX} hi={["fs"]} dim={0.3} />
      <Level s={VRTX} p={564.12} x0={SEGX.fp[0]} x1={SEGX.fs[1] + 20} />
      <ZoneTag x={SEGX.fp[1] - 160} z={Z(564.12) + 10}><span className="zt amb">Cierre del miércoles</span></ZoneTag>
    </World>}>
      <Head kick="Vertex · después"><h1 className="mid">Un hueco no dice <Hi say="viene">lo que viene</Hi></h1></Head>
      <Card say="tres" tone="down" style={{ left: 72, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">Mínimo de hoy</span><span className="num sm">502,90 $</span>
      </Card>
      <Card say="seis" style={{ left: 392, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">A las 18:06</span><span className="num sm">533,77 $</span>
      </Card>
      <Card say="seis" tone="down" style={{ left: 712, top: 1150, width: 218, padding: "14px 18px" }}>
        <span className="lab">Vs. el 25</span><span className="num sm" style={{ fontSize: 52 }}>−5,4 %</span>
      </Card>
      <Src style={{ top: 1360 }}>Yahoo Finance, 27 nov., hora de España. Línea: cierre del miércoles, 564,12 $.</Src>
    </Frame>
  );
};
