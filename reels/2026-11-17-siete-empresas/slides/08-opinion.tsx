// The reel's opinion, said as one, over the city with the seven lit and the rest dimmed.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, SEVEN, Src, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const bet = useSay("apuesta"), idea = useSay("cambiaría");
  const cam = between({ rx: 50, rz: -60, x: 0, y: 0, z: 160, oy: 520 }, { rx: 58, rz: -14, x: 0, y: 0, z: 80, oy: 500 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><City rest="dim" tone={(k) => (SEVEN.includes(k) && t >= bet ? "ice" : undefined)} /></World>}>
      <Head kick="Nuestra opinión"><h1>Ya no es una <Hi say="foto">foto</Hi> de la bolsa</h1></Head>
      <Card say={bet} tone="key" style={{ left: 72, top: 640, width: 640 }}>
        <span className="lab">Lo que creemos</span>
        <span className="serif" style={{ fontSize: 40, lineHeight: 1.2, display: "block" }}>Un tercio del índice es <b>una apuesta por siete empresas</b>. Tres años sumó; este año resta.</span>
      </Card>
      <Card say={idea} style={{ left: 72, top: 960, width: 600 }}>
        <span className="lab">Qué nos haría cambiar de idea</span>
        <span>Que ese peso volviera a repartirse.</span>
      </Card>
      <Src>Opinión de The Market Hub, no una recomendación. Pesos: State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.</Src>
    </Frame>
  );
};
