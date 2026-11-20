// Gap's full-year adjusted EPS guidance (SEC 8-K, 19-11-2026): before 2.35 to 2.45 $, now 2.29 to 2.34 $; the
// consensus read today at Nasdaq (Zacks), 2.39 $. Blocks to the middle of each range (2.40 and 2.315), 150 px a dollar.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bar, Block, Card, Frame, Head, Hi, Road, Src, Today, World, between, glide, prog, ease } from "./look/camino";

const K = 150;

export default () => {
  const t = useSeconds();
  const now = useSay("prevé"), bef = useSay("Antes"), cons = useSay("consenso");
  const cam = between({ rx: 74, rz: -6, x: 0, y: -300, z: -380, oy: 160 }, { rx: 72, rz: -14, x: 0, y: -300, z: -340, oy: 160 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Road />
      <Today y={-60} />
      <Block x={-130} y={-300} w={170} d={170} h={K * 2.40} grow={ease(prog(t, bef - 0.2, 1))} kind="ahead" label="Antes" opacity={0.6}
        top={<div className="val q" style={{ fontSize: 36 }}>2,35–2,45</div>} />
      <Block x={130} y={-300} w={170} d={170} h={K * 2.315} grow={ease(prog(t, now - 0.2, 1))} kind="ahead" label="Ahora"
        top={<div className="val y" style={{ fontSize: 36 }}>2,29–2,34</div>} />
      <Bar x={0} y={-300} w={500} h={K * 2.39} opacity={ease(prog(t, cons - 0.2, 0.6))} label="Consenso 2,39" />
    </World>}>
      <Head kick="Gap · el año"><h1 className="mid">La previsión del año, <Hi tone="down" say="Antes">a la baja</Hi></h1></Head>
      <Card say={now} style={{ left: 72, top: 1110, width: 620, padding: "12px 22px" }}>
        <span className="lab">Beneficio por acción, ejercicio a enero de 2027</span>
        <div className="line"><span>Ahora</span><b className="y">2,29–2,34 $</b></div>
        <Card say={bef} style={{ position: "relative", left: 0, top: 0, padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Antes</span><b>2,35–2,45 $</b></div>
        </Card>
        <Card say={cons} style={{ position: "relative", left: 0, top: 0, padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Consenso (Nasdaq, hoy)</span><b>2,39 $</b></div>
        </Card>
      </Card>
      <Src style={{ top: 1400 }}>Previsión ajustada: Gap, 8-K del 19-11-2026. Consenso: Nasdaq (Zacks), leído el 20-11-2026.</Src>
    </Frame>
  );
};
