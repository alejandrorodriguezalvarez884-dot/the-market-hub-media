// Hook: Nvidia at 152.31 $ at 18:07 of Spain, −3.15 $ (−2.0 %) from the close of 17 November (155.46 $,
// Yahoo Finance); with its 24,100 million shares (SEC, 21 August 2026), about 76,000 million dollars less.
// The tower of Nvidia, its top sinking a little. Readable without sound from frame 0.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Src, Tower, World, between, glide, prog, mix, ease, SIDE, HIGH } from "./look/torres";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 70, rz: -30, x: 0, y: 0, z: 160, oy: -60 }, { rx: 64, rz: -18, x: 0, y: 0, z: 240, oy: -60 }, glide(prog(t, 0, 8)));
  const price = mix(155.46, 152.31, ease(prog(t, 0.6, 2.4)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={0} y={0} side={SIDE(24.1)} h={HIGH(price)} tone="amber" label="Nvidia" />
    </World>}>
      <Head kick="Aprende · la capitalización"><h1 className="mid">3 dólares menos, <Hi>76.000 millones</Hi> menos</h1></Head>
      <Card tone="down" style={{ left: 72, top: 1130, width: 440, padding: "16px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={40} /> Nvidia · hoy</span>
        <span className="num sm">−2,0 %</span>
        <small>152,31 $ · 18 nov, 18:07 h de España</small>
      </Card>
      <Src>Nvidia frente al cierre del 17 de noviembre (155,46 $): Yahoo Finance. Acciones: 24.100 millones (SEC, 21-8-2026).</Src>
    </Frame>
  );
};
