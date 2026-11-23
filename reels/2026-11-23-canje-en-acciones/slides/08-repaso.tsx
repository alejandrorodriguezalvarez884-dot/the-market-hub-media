// Recap over the whole scale: the exchange, the premium (Friday) and the gap (today).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gap, Ground, Head, Hi, Level, Offer, Tower, World, ZX, between, glide, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const a = useSay("canje"), b = useSay("prima"), c = useSay("hueco");
  const cam = between({ rx: 62, rz: -50, x: 0, y: 0, z: -440, oy: -10 }, { rx: 64, rz: -26, x: 0, y: 0, z: -480, oy: -10 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={224.43} k="zs" />
      <Offer price={204.735} />
      <Level usd={232.37} />
      <Gap from={224.43} to={232.37} />
    </World>}>
      <Head kick="Repaso"><h1 className="mid">Comprar <Hi>con acciones</Hi></h1></Head>
      <Card say={a} tone="key" style={{ left: 72, top: 1020, width: 300, padding: "14px 22px" }}>
        <span className="lab">Canje fijo</span><span className="num sm y">1,135</span>
      </Card>
      <Card say={b} tone="amber" style={{ left: 392, top: 1020, width: 260, padding: "14px 22px" }}>
        <span className="lab">Prima</span><span className="num sm">+34 %</span><small>el viernes</small>
      </Card>
      <Card say={c} style={{ left: 672, top: 1020, width: 250, padding: "14px 22px" }}>
        <span className="lab">Hueco</span><span className="num sm">3,5 %</span><small>hoy, 18:06 h</small>
      </Card>
    </Frame>
  );
};
