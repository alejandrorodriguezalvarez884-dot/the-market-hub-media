// The 10-year Treasury yield (Yahoo Finance, ^TNX): 4.163 % at the close of 31 Dec 2025, 5.072 % today
// at 17:51 Madrid; on 16 Sep 2026 it closed above 5 % for the first time since 19 Jul 2007. The water
// rises on the gauge from one to the other as the scene is told.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, Frame, Gauge, Head, Hi, Sea, Src, Water, World, between, ease, es, glide, lvl, mix, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const now = useSay("hoy"), sep = useSay("septiembre");
  const pct = mix(4.163, 5.072, ease(prog(t, now - 0.3, 1.6)));
  const cam = between({ rx: 72, rz: -30, x: -260, y: 0, z: 40, oy: 380 }, { rx: 76, rz: -22, x: -260, y: 0, z: 120, oy: 380 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={pct} /><Gauge x={-260} y={0} wet={pct} />
      <Bill x={-140} y={60} z={lvl(pct) + 10}><div className="val">{es(pct, 2)} %</div></Bill>
    </World>}>
      <Head kick="Bono de EE. UU. a 10 años"><h1>Mientras tanto, <Hi say="subido">sube el bono</Hi></h1></Head>
      <Card style={{ left: 72, top: 640, width: 400, padding: "16px 24px" }}>
        <div className="line"><span>31 dic 2025</span><b>4,16 %</b></div>
        <div className="line"><span>Hoy, 17:51</span><b className="ice">{t >= now ? "5,07 %" : "…"}</b></div>
      </Card>
      <Card say={sep} tone="ice" style={{ left: 72, top: 1060, width: 600 }}>
        <span className="lab">16 de septiembre de 2026</span>
        <span>Primer cierre por encima del <b>5 %</b> desde julio de 2007</span>
      </Card>
      <Src>Rendimiento del bono del Tesoro de EE. UU. a 10 años, cierres diarios (Yahoo Finance, ^TNX). La regla marca de 3 % a 6 %.</Src>
    </Frame>
  );
};
