// Why the target jumps: Zscaler rises from 194.82 $ (Friday) to 224.43 $ (18:06 today, Yahoo Finance), towards
// the level of the exchange (the ink plate).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Level, Offer, Tower, World, ZX, between, ease, glide, mix, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const eng = useSay("engancha");
  const cam = between({ rx: 62, rz: -44, x: 0, y: 0, z: -400, oy: 80 }, { rx: 60, rz: -60, x: -60, y: 0, z: -380, oy: 90 }, glide(prog(t, 0, 6)));
  const p = ease(prog(t, 0.2, 2));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={mix(194.82, 224.43, p)} k="zs" />
      <Offer price={229.44} />
      <Level usd={260.41} opacity={0.4 + 0.6 * ease(prog(t, eng - 0.2, 0.5))} />
    </World>}>
      <Head kick="La que se vende"><h1 className="mid">Su precio <Hi say="engancha">se engancha</Hi> al del comprador</h1></Head>
      <Card tone="up" style={{ left: 72, top: 1130, width: 520, padding: "14px 22px" }}>
        <div className="line"><span>Viernes</span><b>194,82 $</b></div>
        <div className="line"><span>Hoy, 18:06 h</span><b className="up">224,43 $</b></div>
      </Card>
    </Frame>
  );
};
