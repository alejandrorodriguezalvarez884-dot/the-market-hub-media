// Thursday 26, Thanksgiving: the exchange shut (NYSE calendar). Today the session opened at 517.37 $ (Yahoo Finance,
// daily bar). The drop from Wednesday's close (564.12 $) is the gap: −8.3 %. The camera flies over the closed floor.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BX, Card, Frame, Ground, Head, Hi, Level, MID, SEGX, Src, Track, VRTX, World, Zones, ZoneTag, between, ease, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const jump = useSay("salto");
  const p = ease(prog(t, jump - 0.2, 0.7));
  const cam = between({ rx: 60, rz: -30, x: MID("gap"), y: 0, z: -700, oy: 120 }, { rx: 62, rz: -40, x: MID("gap") + 200, y: 0, z: -760, oy: 120 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["gap"]} /><Track s={VRTX} hi={["ws", "fs"]} dim={0.35} />
      <Level s={VRTX} p={564.12} x0={SEGX.ws[1] - 46} x1={SEGX.fs[0] + 46} opacity={p} />
      <ZoneTag seg="gap" z={30}><span className="zt soft">Jueves: cerrado</span></ZoneTag>
      <ZoneTag x={MID("fp")} z={(548 - 480) * 3.4} opacity={p}><span className="gapnum">−8,3 %</span></ZoneTag>
    </World>}>
      <Head kick="Viernes 27 · la apertura"><h1 className="mid">Ese salto <Hi say="hueco" tone="down">es el hueco</Hi></h1></Head>
      <Card style={{ left: 72, top: 1150, width: 380, padding: "14px 22px" }}>
        <span className="lab">Jueves 26</span><span style={{ display: "block", fontSize: 30 }}><b>Acción de Gracias</b>: bolsa cerrada</span>
      </Card>
      <Card say="diecisiete" tone="down" style={{ left: 472, top: 1150, width: 458, padding: "14px 22px" }}>
        <span className="lab">Apertura de hoy</span><span className="num sm">517,37 $</span><small>el miércoles cerró a 564,12 $</small>
      </Card>
      <Src>Calendario: NYSE. Precios: Yahoo Finance. Bloque por media hora; la altura empieza en 480 $.</Src>
    </Frame>
  );
};
