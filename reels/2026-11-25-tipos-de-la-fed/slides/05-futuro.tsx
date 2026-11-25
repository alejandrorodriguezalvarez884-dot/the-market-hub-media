// Third way, time. Made up (marked "Ejemplo"): 100 € that arrive in n years are worth 100/(1+r)^n today. Ten blocks,
// one per year, going away from the camera; their height follows r, from 2 % (year 10: 82.03 €) to 5 % (61.39 €).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Block, Card, Ej, Frame, Ground, Head, Hi, World, between, ease, es, glide, mix, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const dos = useSay("dos"), cinco = useSay("cinco"), sufren = useSay("sufren");
  const r = mix(0.02, 0.05, ease(prog(t, cinco - 0.1, 1.2)));
  const grow = ease(prog(t, 0.1, 1.4));
  const cam = between({ rx: 66, rz: -58, x: 0, y: 900, z: -340, oy: 40 }, { rx: 63, rz: -66, x: 40, y: 900, z: -300, oy: 40 }, glide(prog(t, 0, 9)));
  const v10 = 100 / Math.pow(1 + r, 10);
  return (
    <Frame world={<World cam={cam}><Ground cy={900} />
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1, v = 100 / Math.pow(1 + r, n);
        return <Block key={n} x={-540 + i * 120} y={900} w={86} d={86} h={3.2 * v * clamp01(grow * 10 - i * 0.6)} tone={n === 10 ? "now" : "stone"} />;
      })}
      <Bill x={540} y={900} z={3.2 * v10 + 22} opacity={ease(prog(t, dos, 0.5))}><span className="val y">{es(v10, 0)} €</span></Bill>
      <Bill x={-540} y={900} z={3.2 * 100 / (1 + r) + 22} opacity={grow}><span className="tag">Año 1</span></Bill>
    </World>}>
      <Head kick="Vía 3 · el tiempo"><h1 className="mid">El <Hi say="cinco">futuro</Hi> vale menos hoy</h1></Head>
      <Card tone="amber" style={{ left: 72, top: 1110, width: 520, padding: "16px 24px" }}>
        <Ej />
        <span style={{ display: "block", fontSize: 28, marginBottom: 6 }}><b>100 €</b> dentro de 10 años, hoy:</span>
        <div className="line"><span>Al 2 %</span><b>82 €</b></div>
        <div className="line"><span>Al 5 %</span><b className="y">61 €</b></div>
      </Card>
      <Card say={sufren} tone="key" style={{ left: 612, top: 1110, width: 318, padding: "16px 22px" }}>
        <span style={{ fontSize: 27 }}>Pesa más en quien <span className="y"><b>ganará lejos</b></span></span>
      </Card>
    </Frame>
  );
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
