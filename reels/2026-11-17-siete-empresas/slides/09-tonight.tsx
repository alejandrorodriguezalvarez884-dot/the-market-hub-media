// Nvidia reports after today's close (24/7 Wall St., 17 Nov 2026); it weighs 5.90 % of the index.
import React from "react";
import { useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, Logo, Src, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 48, rz: -30, x: 0, y: 0, z: 260, oy: 600 }, { rx: 56, rz: -42, x: 0, y: 0, z: 120, oy: 560 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><City rest="dim" tone={(k) => (k === "NVDA" ? "amber" : undefined)} /></World>}>
      <Head kick="Esta noche"><h1>Presenta <Hi say="nvidia" tone="amber">Nvidia</Hi></h1></Head>
      <Card say="cierre" tone="amber" style={{ left: 72, top: 620, width: 560 }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="nvidia" h={40} /> Resultados</span>
        <span className="num sm">Tras el cierre</span>
        <small>de Wall Street, a las 22:00 de España</small>
        <small>Pesa el 5,90 % del S&P 500</small>
      </Card>
      <Src>Nvidia presenta hoy tras el cierre (24/7 Wall St., 17 de noviembre de 2026). Su peso: 5,90 % (State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.)</Src>
    </Frame>
  );
};
