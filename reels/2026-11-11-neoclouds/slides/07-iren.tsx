// IREN, first quarter of its fiscal 2027 (to 30 September 2026; 8-K of 5 November 2026): revenue $228M,
// $200M from its AI cloud and $28M from bitcoin mining (88 %); backlog $20.3bn. Its contract with
// Microsoft: about $9.7bn over five years (IREN, 3 November 2025).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Gpu, Head, Hi, Logo, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const nine = useSay("nueve"), signed = useSay("firmados");
  const cam = between({ rx: 60, rz: -14, x: 0, y: -150, z: -40, oy: 250 }, { rx: 58, rz: -34, x: 0, y: -150, z: 40, oy: 290 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Gpu x={-40} y={-520} scale={0.85} lift={30 + Math.sin(t * 1.2) * 8} />
      <Towers scale={1.5} w={140} d={140} gap={130} items={[
        { label: "Bitcoin", value: 28, text: "28", tone: "dim", at: 0.2 },
        { label: "Nube de IA", value: 200, text: "200", tone: "ice", at: nine },
      ]} /></World>}>
      <Head kick={<span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}><Logo name="iren" h={40} /> IREN · resultados del 5 nov</span>}>
        <h1>Del bitcoin a la <Hi say="nube">IA</Hi></h1>
      </Head>
      <Card say={nine} tone="ice" style={{ left: 72, top: 590, width: 420 }}>
        <span className="lab">Ventas de nube de IA</span>
        <span className="num mid">88 %</span>
        <small>200 de 228 M$ en el trimestre</small>
      </Card>
      <Card say={signed} tone="key" style={{ left: 520, top: 590, width: 390 }}>
        <span className="lab">Firmado</span>
        <span className="num sm" style={{ color: "#121110" }}>20.300 M$</span>
        <small style={{ color: "#5d5a54" }}>9.700 con Microsoft, a cinco años</small>
      </Card>
      <Src>Millones de dólares, trimestre de julio a septiembre de 2026. IREN, 8-K del 5 de noviembre de 2026; contrato con Microsoft anunciado el 3 de noviembre de 2025 (IREN).</Src>
    </Frame>
  );
};
