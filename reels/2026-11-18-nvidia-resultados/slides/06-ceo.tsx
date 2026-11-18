// What the figures do not show. 8 November 2026: the board opens an independent investigation into
// Jensen Huang (CNBC). 11 November: the board accepts his resignation as president, CEO and director,
// effective at once; Colette Kress, CFO, becomes interim CEO and keeps her role as CFO (8-K). The
// release of 17 November speaks of the search for a new chief executive.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Src, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const quit = useSay("dimitió"), board = useSay("consejo"), now = useSay("dirige");
  const cam = between({ rx: 66, rz: -46, x: -100, y: 200, z: 380, oy: 420 }, { rx: 60, rz: -26, x: 60, y: -60, z: 160, oy: 440 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><Hall power={0.5 - 0.38 * glide(prog(t, quit, 2.5))} rows={8} cols={14} /></World>}>
      <Head kick="Lo que no sale en las cifras" tone="amber"><h1>Una <Hi say="dimitió" tone="amber">silla vacía</Hi></h1></Head>
      <Card say={quit} tone="amber" style={{ left: 72, top: 600, width: 780 }}>
        <span className="lab">11 de noviembre</span>
        <span style={{ fontSize: 40, lineHeight: 1.15, display: "block", color: "#f3f6fb" }}>Jensen Huang dimite como consejero delegado</span>
      </Card>
      <Card say={board} style={{ left: 72, top: 820, width: 780 }}>
        <span className="lab">Desde el 8 de noviembre</span>
        <span style={{ fontSize: 34, lineHeight: 1.2, display: "block" }}>Un comité independiente del consejo le investiga</span>
      </Card>
      <Card say={now} tone="key" style={{ left: 72, top: 1030, width: 780 }}>
        <span className="lab">En funciones</span>
        <span className="serif" style={{ fontSize: 46, lineHeight: 1.1, display: "block", color: "#121110" }}><b>Colette Kress</b></span>
        <small style={{ color: "#6b6760" }}>Directora financiera y consejera delegada interina, mientras se busca un sustituto</small>
      </Card>
      <Src>Nvidia, 8-K del 11 de noviembre de 2026 y comunicado de resultados del 17; CNBC, 8 de noviembre de 2026.</Src>
    </Frame>
  );
};
