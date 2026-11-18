// Hook: Nvidia's revenue in its third quarter of fiscal 2027 (27 July to 25 October 2026), $115.8bn,
// +103 % on a year before; the first report since Jensen Huang resigned on 11 November (release of
// 17 November 2026; 8-K of 11 November). Readable without sound from frame 0: logo, headline, figure.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Gpu, Head, Hi, Logo, Src, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 52, rz: -20, x: 0, y: 120, z: 260, oy: 330 }, { rx: 60, rz: -36, x: 0, y: 0, z: 60, oy: 420 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor w={2400} d={2400} /><Gpu x={0} y={0} lift={20 + 30 * glide(prog(t, 0, 6))} heat={0.25} scale={1.25} /></World>}>
      <Head kick="Resultados · 17 de noviembre"><h1>Nvidia ingresa <Hi>115.800 M$</Hi> en tres meses</h1></Head>
      <Card tone="ice" style={{ left: 72, top: 760, width: 640 }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="nvidia" h={44} /> Ingresos del trimestre</span>
        <span className="num mid">115.800 M$</span>
        <small>Del 27 de julio al 25 de octubre de 2026</small>
      </Card>
      <Card say="doble" tone="up" style={{ left: 72, top: 1090, width: 380 }}>
        <span className="lab">En un año</span>
        <span className="num sm">+103 %</span>
      </Card>
      <Card say="Huang" tone="amber" style={{ left: 480, top: 1090, width: 440 }}>
        <span className="lab">El primero sin</span>
        <span style={{ fontSize: 46, lineHeight: 1.1, display: "block", color: "#ffe2b0" }}>Jensen Huang</span>
      </Card>
      <Src>Nvidia, resultados del tercer trimestre de su ejercicio 2027 (17 de noviembre de 2026). Huang dimitió el 11 de noviembre (Nvidia, 8-K).</Src>
    </Frame>
  );
};
