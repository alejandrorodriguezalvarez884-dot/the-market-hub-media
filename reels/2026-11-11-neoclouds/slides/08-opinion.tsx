// Our opinion: the sums can add up. They lose money because they build faster than they depreciate;
// the risk is the debt (CoreWeave, about $46.9bn at 30 September 2026: my sum of the four debt lines of
// the 8-K's balance sheet, without leases, against $35.1bn at 30 June).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Src, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const fast = useSay("eléctrica"), debt = useSay("deuda"), without = useSay("sin");
  const cam = between({ rx: 70, rz: -50, x: -200, y: 300, z: 520, oy: 420 }, { rx: 60, rz: -20, x: 100, y: -100, z: 120, oy: 460 }, glide(prog(t, 0, 13)));
  const hot = 0.6 * glide(prog(t, debt, 1)) * (1 - glide(prog(t, without, 1.2)));
  return (
    <Frame world={<World cam={cam}><Hall power={1} rows={8} cols={14} hot={hot} /></World>}>
      <Head kick="Nuestra opinión"><h1>Creo que <Hi say="salen">sí salen</Hi></h1></Head>
      <Card say={fast} tone="key" style={{ left: 72, top: 600, width: 760 }}>
        <span className="serif" style={{ fontSize: 50, lineHeight: 1.1, display: "block", color: "#121110" }}>Una eléctrica, <i>a velocidad de startup.</i></span>
      </Card>
      <Card say={debt} gone={without} tone="down" style={{ left: 72, top: 1110, width: 600 }}>
        <span className="lab">El riesgo: la deuda de CoreWeave</span>
        <span className="num mid">46.900 M$</span>
        <small>Tres meses antes: 35.100 M$</small>
      </Card>
      <Card say={without} tone="ice" style={{ left: 72, top: 1110, width: 700 }}>
        <span className="lab">Sin estas naves</span>
        <span style={{ fontSize: 40, lineHeight: 1.15, display: "block", color: "#f3f6fb" }}>la IA no tiene dónde funcionar</span>
      </Card>
      <Src>Opinión de The Market Hub, no una recomendación. Deuda a 30 de septiembre y a 30 de junio de 2026, suma propia de sus cuatro líneas de deuda, sin arrendamientos (CoreWeave, SEC).</Src>
    </Frame>
  );
};
