// Do the sums add up? CoreWeave, Q3 2026, $M (8-K reconciliation): adjusted EBITDA 2,256; depreciation
// and amortization 1,889; interest 846; net loss 709 (it also includes stock pay, 160, and taxes, 83).
// Equipment depreciated over six years (10-K).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const gain = useSay("gana"), chips = useSay("valor"), debt = useSay("deuda"), loss = useSay("pierde#2");
  const cam = between({ rx: 64, rz: -18, x: 0, y: 0, z: -140, oy: 230 }, { rx: 60, rz: -30, x: 0, y: 0, z: -60, oy: 250 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={0.17} w={110} d={110} gap={66} labelSize={20} valueSize={50} items={[
        { label: "Gana", value: 2256, text: "2.256", tone: "ice", at: gain },
        { label: "Chips", value: 1889, text: "−1.889", tone: "amber", at: chips },
        { label: "Deuda", value: 846, text: "−846", tone: "amber", at: debt },
        { label: "Resultado", value: 709, text: "−709", tone: "down", at: loss },
      ]} /></World>}>
      <Head kick="Tercer trimestre, millones de $"><h1>¿Les salen las <Hi say="cuentas">cuentas</Hi>?</h1></Head>
      <Card say={chips} tone="amber" style={{ left: 72, top: 600, width: 520 }}>
        <span className="lab">Cada chip, en sus cuentas</span>
        <span className="num sm">6 años de vida</span>
      </Card>
      <Src>Antes de amortizar: EBITDA ajustado. El resultado (pérdida neta) incluye además pagos en acciones (160 M$) e impuestos (83 M$). CoreWeave, 8-K del 10 de noviembre de 2026; 10-K de 2025.</Src>
    </Frame>
  );
};
