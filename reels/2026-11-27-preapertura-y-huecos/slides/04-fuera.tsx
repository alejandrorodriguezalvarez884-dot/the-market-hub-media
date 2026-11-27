// Outside the session: pre-market from 4:00 and after-hours to 20:00, New York time (NYSE Arca, early and late
// trading sessions; NYSE hours and calendars). The glass blocks of the track are those hours.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, MID, Src, Track, VRTX, World, Zones, ZoneTag, between, ease, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const pre = useSay("preapertura"), post = useSay("postcierre");
  const cam = between({ rx: 62, rz: -14, x: MID("gap") + 60, y: 0, z: -980, oy: 120 }, { rx: 60, rz: -22, x: MID("gap") + 20, y: 0, z: -940, oy: 120 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["wp", "fp"]} /><Track s={VRTX} hi={["wp", "fp"]} dim={0.3} />
      <ZoneTag seg="fp" z={200} opacity={ease(prog(t, pre - 0.1, 0.5))}><span className="zt blue">Preapertura · desde las 4:00</span></ZoneTag>
      <ZoneTag seg="wp" z={200} opacity={ease(prog(t, post - 0.1, 0.5))}><span className="zt blue">Postcierre · hasta las 20:00</span></ZoneTag>
    </World>}>
      <Head kick="Fuera de hora"><h1 className="mid">Antes y después <Hi say="cotiza">también se cotiza</Hi></h1></Head>
      <Card say="preapertura" style={{ left: 72, top: 1150, width: 420, padding: "14px 22px" }}>
        <span className="lab">Preapertura</span><span className="num sm">4:00 a 9:30</span><small>en España, 10:00 a 15:30</small>
      </Card>
      <Card say="postcierre" style={{ left: 512, top: 1150, width: 418, padding: "14px 22px" }}>
        <span className="lab">Postcierre</span><span className="num sm">16:00 a 20:00</span><small>en España, 22:00 a 2:00</small>
      </Card>
      <Src>Hora de Nueva York. Sesión temprana y tardía de NYSE Arca: NYSE. Bloques de cristal: precio fuera de la sesión.</Src>
    </Frame>
  );
};
