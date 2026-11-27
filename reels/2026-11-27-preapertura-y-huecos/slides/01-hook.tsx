// Hook: Vertex opened today at 517.37 $, 8.3 % under Wednesday's close of 564.12 $ (Yahoo Finance, daily bars). The
// whole track from frame 0: Wednesday's session, its after-hours, the closed night and holiday, today's pre-market and
// session; the gap is the drop between the two sessions (Wednesday's session low 550.56 $, today's high 534.37 $ at 18:06).
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Level, MID, SEGX, Src, Track, VRTX, World, Zones, ZoneTag, between, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -38, x: -40, y: 0, z: -1100, oy: 80 }, { rx: 62, rz: -46, x: 60, y: 0, z: -1020, oy: 80 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["gap"]} /><Track s={VRTX} hi={["ws", "fs"]} dim={0.5} />
      <Level s={VRTX} p={564.12} x0={SEGX.ws[1] - 46} x1={SEGX.fs[0] + 46} />
      <ZoneTag seg="gap" z={20}><span className="gapnum">−8,3 %</span></ZoneTag>
      <ZoneTag x={MID("ws")} z={330}><span className="zt soft">Miércoles</span></ZoneTag>
      <ZoneTag x={MID("fs")} z={200}><span className="zt soft">Hoy</span></ZoneTag>
    </World>}>
      <Head kick="Aprende · el hueco"><h1>Vertex abrió con un <Hi tone="down">hueco</Hi> del 8 %</h1></Head>
      <Card style={{ left: 72, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">Cierre miércoles</span><span className="num sm">564,12 $</span>
      </Card>
      <Card tone="down" style={{ left: 392, top: 1150, width: 300, padding: "14px 22px" }}>
        <span className="lab">Apertura hoy</span><span className="num sm">517,37 $</span>
      </Card>
      <Card tone="down" style={{ left: 712, top: 1150, width: 218, padding: "14px 18px" }}>
        <span className="lab">Salto</span><span className="num sm" style={{ fontSize: 52 }}>−8,3 %</span>
      </Card>
      <Src>Vertex (VRTX), un bloque por media hora; la altura empieza en 480 $. Yahoo Finance, 27 nov., 18:06 h de España.</Src>
    </Frame>
  );
};
