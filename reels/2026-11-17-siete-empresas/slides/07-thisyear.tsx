// 2026 to date, 17 Nov: S&P 500 +7.24 % (18:09 Madrid), Equal Weight +12.70 % (17:54), Nvidia −17.4 %
// (154.10 $ at 18:09 against 186.50 $ on 31 Dec 2025). Yahoo Finance (data/).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Src, Towers, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const a = useSay("siete"), b = useSay("trece"), n = useSay("nvidia");
  const cam = between({ rx: 64, rz: -22, x: 0, y: 0, z: -40, oy: 230 }, { rx: 60, rz: -34, x: 0, y: 0, z: 20, oy: 240 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={34} w={130} d={130} gap={220} labelSize={22} valueSize={52} x0={60} items={[
        { label: "", value: 7.24, text: "+7,2 %", tone: "ice", at: a },
        { label: "", value: 12.7, text: "+12,7 %", tone: "up", at: b },
      ]} /></World>}>
      <Head kick="2026, hasta hoy"><h1>Este año, <Hi say="revés" tone="up">al revés</Hi></h1></Head>
      <Card say={n} tone="down" style={{ left: 72, top: 600, width: 480 }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="nvidia" h={40} /> Nvidia en 2026</span>
        <span className="num sm">−17,4 %</span>
      </Card>
      <Card say={a} style={{ left: 72, top: 760, width: 380, padding: "14px 22px" }}>
        <div className="line"><span>S&P 500</span><b className="ice">■</b></div>
        <div className="line"><span>A partes iguales</span><b className="up">■</b></div>
      </Card>
      <Src>Desde el cierre de 2025 hasta el 17 de noviembre de 2026: S&P 500 a las 18:09 de España, Equal Weight a las 17:54, Nvidia a las 18:09 (Yahoo Finance).</Src>
    </Frame>
  );
};
