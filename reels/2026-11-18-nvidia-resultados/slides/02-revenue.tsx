// Nvidia's revenue by quarter, $bn (quarters ending late Oct 2025, Jan, Apr, Jul and Oct 2026):
// 57.01, 68.13 (the year, 215.94, less nine months, 147.81), 81.61, 96.22 (SEC XBRL,
// data/sec-nvda-revenue.json) and 115.8 (release of 17 November 2026). Analysts expected $109.1bn
// (LSEG, via CNBC, 17 November 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const ago = useSay("cincuenta"), now = useSay("ahora");
  const cam = between({ rx: 66, rz: -16, x: 0, y: 0, z: -160, oy: 180 }, { rx: 60, rz: -28, x: 0, y: 0, z: -40, oy: 210 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={4.1} w={100} d={100} gap={56} items={[
        { label: "Oct 25", value: 57.0, text: "57,0", tone: "dim", at: ago },
        { label: "Ene 26", value: 68.1, text: "68,1", tone: "dim", at: ago + 0.3 },
        { label: "Abr 26", value: 81.6, text: "81,6", tone: "dim", at: ago + 0.6 },
        { label: "Jul 26", value: 96.2, text: "96,2", tone: "dim", at: ago + 0.9 },
        { label: "Oct 26", value: 115.8, text: "115,8", tone: "ice", at: now },
      ]} /></World>}>
      <Head kick="Ingresos por trimestre · miles de M$"><h1>Por encima de lo <Hi say="esperaban">esperado</Hi></h1></Head>
      <Card say="analistas" tone="key" style={{ left: 72, top: 610, width: 520 }}>
        <span className="lab">Esperaban los analistas</span>
        <span className="serif" style={{ fontSize: 44, lineHeight: 1.15, display: "block", color: "#121110" }}><b>109.100 M$</b></span>
      </Card>
      <Src>Trimestres de Nvidia que acaban a finales de cada mes indicado. SEC (informes trimestrales y anual) y comunicado del 17 de noviembre de 2026. Lo esperado: media de analistas de LSEG, según CNBC.</Src>
    </Frame>
  );
};
