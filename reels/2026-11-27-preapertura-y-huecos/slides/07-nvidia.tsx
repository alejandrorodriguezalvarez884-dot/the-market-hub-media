// Nvidia, the same track: Wednesday's close 149.30 $; today's pre-market up to 156.98 $ (+5.1 %), opened at 151.94 $
// (+1.8 %), at 18:06 of Spain 148.47 $ (−0.6 %) (Yahoo Finance, 5-minute and daily bars).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BX, Card, Frame, Ground, Head, Hi, Logo, MID, NVDA, Src, Track, World, Zones, ZoneTag, between, ease, glide, prog } from "./look/pista";

const Z = (p: number) => (p - 136) * 20 + 16;
export default () => {
  const t = useSeconds();
  const five = useSay("cinco"), open = useSay("Abrió"), six = useSay("seis");
  const cam = between({ rx: 62, rz: -6, x: MID("fp") + 120, y: 0, z: -700, oy: 140 }, { rx: 62, rz: -14, x: MID("fp") + 200, y: 0, z: -700, oy: 140 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["fp", "fs"]} /><Track s={NVDA} hi={["fp", "fs"]} dim={0.25} />
      <ZoneTag x={BX("fp", 0)} z={Z(156.98)} opacity={ease(prog(t, five - 0.1, 0.5))}><span className="val g">+5,1 %</span></ZoneTag>
      <ZoneTag x={BX("fs", 0)} z={Z(152.5)} opacity={ease(prog(t, open - 0.1, 0.5))}><span className="val g">+1,8 %</span></ZoneTag>
      <ZoneTag x={BX("fs", 5)} z={Z(150.5)} opacity={ease(prog(t, six - 0.1, 0.5))}><span className="val r">−0,6 %</span></ZoneTag>
    </World>}>
      <Head kick={<>Nvidia · hoy</>}><h1 className="mid">La preapertura <Hi say="Abrió">no fija el precio</Hi></h1></Head>
      <Card style={{ left: 72, top: 1110, width: 858, padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}><Logo name="nvidia" h={52} /><span className="lab" style={{ margin: 0 }}>frente al cierre del miércoles, 149,30 $</span></div>
        <div className="line"><span>Máximo de la preapertura</span><b className="up">156,98 $ · +5,1 %</b></div>
        <div className="line"><span>Apertura</span><b className="up">151,94 $ · +1,8 %</b></div>
        <div className="line"><span>A las 18:06 de España</span><b className="down">148,47 $ · −0,6 %</b></div>
      </Card>
      <Src style={{ top: 1400 }}>Yahoo Finance. Bloque por media hora; la altura empieza en 136 $.</Src>
    </Frame>
  );
};
