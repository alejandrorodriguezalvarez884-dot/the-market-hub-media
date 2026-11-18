// What it is not: money kept. From 6 October (239.24 $) to 17 November (155.46 $), Nvidia's share fell
// 83.78 $; with 24,100 million shares, about 2.02 trillion dollars of capitalisation (Yahoo Finance; SEC).
// The ghost of the October tower and the tower of today.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Box, Card, Floor, Frame, Head, Hi, Logo, Src, Tower, World, between, glide, prog, ease, mix, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const fall = useSay("perdido");
  const cam = between({ rx: 70, rz: -34, x: 0, y: 0, z: 40, oy: -70 }, { rx: 64, rz: -12, x: 0, y: 0, z: 80, oy: -80 }, glide(prog(t, 0, 11)));
  const p = ease(prog(t, fall - 0.2, 1.8));
  const s = SIDE(24.1);
  const hOct = HIGH(239.24), hNow = HIGH(155.46);
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={0} y={0} side={s} h={mix(hOct, hNow, p)} tone="amber" label="Nvidia" />
      <Box x={-s / 2} y={-s / 2} z={hOct} w={s} d={s} h={2} opacity={0.7 * p}
        faces={{ top: "rgba(214,64,47,0.18)", front: "rgba(214,64,47,0.6)", side: "rgba(214,64,47,0.6)" }} edge="0 0 0 2px rgba(214,64,47,0.55)" />
    </World>}>
      <Head kick="Lo que no es"><h1 className="mid">No es dinero <Hi say="guardado">guardado</Hi></h1></Head>
      <Card say="seis" style={{ left: 72, top: 1110, width: 600, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Precio de la acción</span>
        <div className="line"><span>6 de octubre</span><b>239,24 $</b></div>
        <div className="line"><span>17 de noviembre</span><b className="down">155,46 $</b></div>
        <Card say={fall} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Capitalización</span><b className="down">−2 billones $</b></div>
        </Card>
      </Card>
      <Src>Cierres: Yahoo Finance. Calculado con 24.100 millones de acciones (SEC, 21-8-2026): aproximado.</Src>
    </Frame>
  );
};
