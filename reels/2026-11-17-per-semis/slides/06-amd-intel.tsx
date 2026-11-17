// AMD: P/E 107.8 (diluted EPS of the last twelve months 4.68 $), forward 28.6 (17.64 $ expected for
// 2027). Intel lost money in the last twelve months (−2.35 $ a share): no P/E; forward 31.0 (1.79 $).
// Close of 16 Nov 2026 (Yahoo Finance); own calculation. The camera rises along AMD's tall tower.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Key, Logo, Src, Wafer, World, between, glide, prog } from "./look/oblea";

export default () => {
  const t = useSeconds();
  const amd = useSay("ciento"), amdF = useSay("veintinueve"), intc = useSay("no tiene"), intcF = useSay("treinta");
  const cam = between({ rx: 58, rz: -20, x: 280, y: -120, z: -380, oy: 110 }, { rx: 62, rz: -32, x: 300, y: -60, z: -360, oy: 100 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} />
      <Chips built={["NVDA", "AVGO", "TSM", "ASML", "MU"]} dim={["NVDA", "AVGO", "TSM", "ASML", "MU"]} cues={{ AMD: [amd, amdF], INTC: [intc, intcF] }} valueSize={46} />
    </World>}>
      <Head kick="El otro extremo"><h1 className="mid">AMD, <Hi say="ciento">108</Hi>. Intel, <Hi say="no tiene" tone="down">sin PER</Hi></h1></Head>
      <Card say="ciento" style={{ left: 72, top: 1120, width: 620, padding: "12px 24px" }}>
        <div className="line"><span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}><Logo name="amd" h={30} /> AMD</span><b>107,8 · <span style={{ color: "#e08a00" }}>28,6</span></b></div>
        <Card say="no tiene" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}><Logo name="intel" h={30} /> Intel · ganó −2,35 $</span><b><span className="down" style={{ color: "#d6402f" }}>—</span> · <span style={{ color: "#e08a00" }}>31,0</span></b></div>
        </Card>
      </Card>
      <Src>Cierre del 16-11-2026; beneficio por acción de los últimos doce meses y media de los analistas para 2027 (Yahoo Finance). Con pérdidas no hay PER. Cálculo propio.</Src>
    </Frame>
  );
};
