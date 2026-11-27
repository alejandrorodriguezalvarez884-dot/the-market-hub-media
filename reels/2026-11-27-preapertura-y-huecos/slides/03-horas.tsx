// The session of Wall Street: 9:30 to 16:00 in New York (NYSE, hours and calendars), 15:30 to 22:00 in Spain (six hours
// apart on 27-11-2026: New York UTC-5, Madrid UTC+1). The two session zones of the track light up; blocks in shadow.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, MID, Src, Track, VRTX, World, Zones, ZoneTag, between, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 60, rz: -10, x: MID("ws") + 60, y: 0, z: -560, oy: 120 }, { rx: 58, rz: -24, x: MID("ws") + 120, y: 0, z: -520, oy: 120 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["ws", "fs"]} /><Track s={VRTX} hi={["ws", "fs"]} dim={0.25} />
      <ZoneTag seg="ws" z={330}><span className="zt amb">Sesión · 9:30 a 16:00<small>hora de Nueva York</small></span></ZoneTag>
    </World>}>
      <Head kick="La sesión"><h1 className="mid">Wall Street abre <Hi say="nueve">seis horas y media</Hi></h1></Head>
      <Card say="Nueva" style={{ left: 72, top: 1150, width: 410, padding: "14px 22px" }}>
        <span className="lab">Nueva York</span><span className="num sm">9:30 a 16:00</span>
      </Card>
      <Card say="España" tone="amber" style={{ left: 502, top: 1150, width: 428, padding: "14px 22px" }}>
        <span className="lab">España</span><span className="num sm">15:30 a 22:00</span>
      </Card>
      <Src>Horario de la sesión principal: NYSE. Hoy, en España, seis horas más que en Nueva York.</Src>
    </Frame>
  );
};
