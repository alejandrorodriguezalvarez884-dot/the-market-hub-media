// Hook: Gap 21.11 $ at 18:06 of Spain, +12.3 % from the close of 19 November (18.79 $, Yahoo Finance), the day
// after cutting its full-year guidance (SEC 8-K); the Nasdaq 100 −3.69 % at 18:07 (Market Hub). The road: the
// quarter just reported as an amber block, and the year ahead as a glass block that shrinks a little.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Block, Card, Frame, Head, Hi, Road, Src, Today, World, between, glide, prog, mix, ease, EPS } from "./look/camino";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 64, rz: -40, x: 0, y: -200, z: -160, oy: 40 }, { rx: 62, rz: -48, x: 0, y: -220, z: -100, oy: 40 }, glide(prog(t, 0, 8)));
  const cut = ease(prog(t, 1.2, 1.6));
  return (
    <Frame world={<World cam={cam}><Road />
      <Block y={60} h={EPS(0.82)} kind="hot" label="El trimestre" />
      <Today y={-120} />
      <Block y={-460} h={mix(EPS(0.62), EPS(0.55), cut)} kind="ahead" label="Lo que viene" />
    </World>}>
      <Head kick="Aprende · la previsión"><h1 className="mid">Rebaja su previsión y <Hi tone="up">sube un 12 %</Hi></h1></Head>
      <Card tone="up" style={{ left: 72, top: 1110, width: 430, padding: "16px 24px" }}>
        <span className="lab">Gap · hoy</span>
        <span className="num sm">+12,3 %</span>
        <small>21,11 $ · 20 nov, 18:06 h de España</small>
      </Card>
      <Card tone="down" style={{ left: 530, top: 1110, width: 380, padding: "16px 24px" }}>
        <span className="lab">Nasdaq 100</span>
        <span className="num sm">−3,7 %</span>
        <small>18:07 h de España</small>
      </Card>
      <Src>Gap frente al cierre del 19 de noviembre (18,79 $): Yahoo Finance. Nasdaq 100: Market Hub (Yahoo Finance). Previsión: Gap, 8-K del 19-11-2026.</Src>
    </Frame>
  );
};
