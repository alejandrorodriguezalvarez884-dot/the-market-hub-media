// CoreWeave's revenue by quarter, $M: Q3 2025 1,365; Q4 2025 1,572 (the year, 5,131, less nine months,
// 3,559); Q1 2026 2,078; Q2 2026 2,575 (SEC XBRL, data/sec-crwv-revenue.json); Q3 2026 3,661 (8-K).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const now = useSay("tres"), ago = useSay("año");
  const cam = between({ rx: 66, rz: -16, x: 0, y: 0, z: -160, oy: 250 }, { rx: 60, rz: -28, x: 0, y: 0, z: -40, oy: 280 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={0.13} w={100} d={100} gap={56} items={[
        { label: "3T 25", value: 1365, text: "1.365", tone: "dim", at: 0.1 },
        { label: "4T 25", value: 1572, text: "1.572", tone: "dim", at: 0.3 },
        { label: "1T 26", value: 2078, text: "2.078", tone: "dim", at: 0.5 },
        { label: "2T 26", value: 2575, text: "2.575", tone: "dim", at: 0.7 },
        { label: "3T 26", value: 3661, text: "3.661", tone: "ice", at: now },
      ]} /></World>}>
      <Head kick="CoreWeave · ingresos por trimestre"><h1>Casi el <Hi say="tres">triple</Hi> en un año</h1></Head>
      <Card say={ago} tone="key" style={{ left: 72, top: 610, width: 470 }}>
        <span className="lab">Millones de dólares</span>
        <span className="serif" style={{ fontSize: 38, lineHeight: 1.15, display: "block", color: "#121110" }}><b>3.661</b> frente a <b>1.365</b></span>
      </Card>
      <Src>Ingresos trimestrales, en millones de dólares. CoreWeave (SEC): informes trimestrales y anual; el 4.º trimestre de 2025, como el año menos los nueve meses.</Src>
    </Frame>
  );
};
