// The guidance is measured against what the analysts expect: the consensus as a thin ink plate floating over
// the glass block of the future; the block grows under it, then over it (made-up heights, a sign only).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bar, Block, Card, Frame, Head, Hi, Road, Today, World, between, glide, prog, mix, ease } from "./look/camino";

export default () => {
  const t = useSeconds();
  const cons = useSay("consenso"), below = useSay("debajo"), above = useSay("encima");
  const cam = between({ rx: 62, rz: -34, x: 0, y: -240, z: -160, oy: 60 }, { rx: 60, rz: -20, x: 0, y: -300, z: -100, oy: 60 }, glide(prog(t, 0, 9)));
  const h = mix(mix(150, 190, ease(prog(t, 0, 1))), 330, ease(prog(t, above - 0.1, 1.0)));
  const low = mix(150, 190, ease(prog(t, 0, 1)));
  return (
    <Frame world={<World cam={cam}><Road />
      <Today y={-60} />
      <Block y={-300} w={180} d={180} h={t < above - 0.1 ? low : h} kind="ahead" label="Previsión" />
      <Bar y={-300} h={260} opacity={ease(prog(t, cons - 0.2, 0.6))} label="Consenso" />
    </World>}>
      <Head kick="La comparación"><h1 className="mid">Contra lo que espera el <Hi say="consenso">consenso</Hi></h1></Head>
      <Card say={below} tone="down" style={{ left: 72, top: 1130, width: 400, padding: "14px 22px" }}>
        <span className="lab">Por debajo</span><span style={{ fontSize: 32 }}><b>▼ suele caer</b></span>
      </Card>
      <Card say={above} tone="up" style={{ left: 500, top: 1130, width: 400, padding: "14px 22px" }}>
        <span className="lab">Por encima</span><span style={{ fontSize: 32 }}><b>▲ suele subir</b></span>
      </Card>
      <Card say="consenso" style={{ left: 72, top: 1290, width: 620, padding: "10px 22px" }}>
        <small style={{ marginTop: 0 }}>Consenso: la media de lo que calculan los analistas que siguen a la empresa.</small>
      </Card>
    </Frame>
  );
};
