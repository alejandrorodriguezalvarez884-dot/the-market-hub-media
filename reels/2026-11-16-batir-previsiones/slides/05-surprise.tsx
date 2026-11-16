// The surprise: the distance between the result and the bar. Nvidia's quarter to July 2026, reported on
// 26 August: consensus 2.09 $, EPS 2.22 $, +6.22 % (Nasdaq, with Zacks). The next day the share closed
// at 227.98 $ against 209.66 $: +8.7 % (Yahoo Finance).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Jump, Logo, Src, World, between, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const bar = useSay("esperaban"), won = useSay("Ganó"), next = useSay("siguiente");
  const cam = between({ rx: 70, rz: 6, x: 0, y: 0, z: 40, oy: 280 }, { rx: 64, rz: -18, x: 0, y: 0, z: 40, oy: 280 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Jump x={60} y={0} bar={2.09} eps={2.22} scale={170} barAt={bar - 0.3} at={won - 0.3} takes={1.3} barText="2,09 $" epsText="2,22 $" surprise="+6,2 %" label="Ago. 2026" w={260} />
    </World>}>
      <Head kick="La sorpresa"><h1 className="mid">La <Hi say="distancia">distancia</Hi> entre la nota y el listón</h1></Head>
      <Card say={won} style={{ left: 72, top: 1150, width: 580, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Cuentas del 26 de agosto</span>
        <div className="line"><span>Sorpresa</span><b className="up">+6,2 %</b></div>
        <Card say={next} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Acción, al día siguiente</span><b className="up">+8,7 %</b></div>
        </Card>
      </Card>
      <Src>Beneficio por acción ajustado del trimestre a julio de 2026 y su consenso: Nasdaq, con datos de Zacks. Cierres del 26 y el 27 de agosto de 2026: Yahoo Finance.</Src>
    </Frame>
  );
};
