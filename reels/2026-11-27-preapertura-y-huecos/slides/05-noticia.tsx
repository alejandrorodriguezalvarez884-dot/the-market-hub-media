// Vertex gave its news on Wednesday 25 with the session closed: the FDA delays by up to three months, to 28 February
// 2027 at the latest, its decision on povetacicept for IgA nephropathy (Tech Times, 26-11-2026, citing Reuters). In the
// after-hours its price went down to 520.00 $ (Yahoo Finance, 5-minute bars, low after 16:00), from 564.12 $.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BX, Card, Frame, Ground, Head, Hi, Level, MID, SEGX, Src, Track, VRTX, World, Zones, ZoneTag, between, ease, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const low = useSay("quinientos");
  const p = ease(prog(t, low - 0.2, 0.6));
  const cam = between({ rx: 58, rz: -20, x: SEGX.ws[1] - 60, y: 0, z: -460, oy: 140 }, { rx: 60, rz: -30, x: SEGX.ws[1] + 40, y: 0, z: -420, oy: 140 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["wp"]} /><Track s={VRTX} hi={["ws", "wp"]} dim={0.2} />
      <Level s={VRTX} p={564.12} x0={SEGX.ws[1] - 46} x1={SEGX.wp[1]} opacity={p} />
      <ZoneTag x={BX("wp", 2)} z={(520 - 480) * 3.4 + 16} opacity={p}><span className="val r">520 $</span></ZoneTag>
      <ZoneTag x={BX("ws", 12)} z={(564 - 480) * 3.4 + 16}><span className="val">564,12 $</span></ZoneTag>
    </World>}>
      <Head kick="Vertex · miércoles 25"><h1 className="mid">La noticia llegó con la <Hi say="cerrada">sesión cerrada</Hi></h1></Head>
      <Card say="FDA" style={{ left: 72, top: 1130, width: 560, padding: "14px 22px" }}>
        <span className="lab">La FDA</span>
        <span style={{ display: "block", fontSize: 30 }}>retrasa hasta <b>tres meses</b> su decisión sobre un fármaco de Vertex para el riñón</span>
      </Card>
      <Card say="quinientos" tone="down" style={{ left: 652, top: 1130, width: 278, padding: "14px 20px" }}>
        <span className="lab">Postcierre</span><span className="num sm" style={{ fontSize: 54 }}>−7,8 %</span><small>mínimo, 520 $</small>
      </Card>
      <Src>Tech Times (con Reuters), 26 nov. Precio: Yahoo Finance, media hora a media hora; la altura empieza en 480 $.</Src>
    </Frame>
  );
};
