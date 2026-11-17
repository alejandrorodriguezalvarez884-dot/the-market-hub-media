// Hook: on Monday 16 Nov 2026 the S&P 500 fell 1.92 % and the S&P 500 Equal Weight 1.02 % (Yahoo
// Finance, closes of 13 and 16 Nov; data/yahoo-GSPC.json, yahoo-SPXEW.json). Readable without sound
// from frame 0: the headline, the fall and the city of the index with its seven giants lit.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, SEVEN, Src, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const eq = useSay("iguales");
  const cam = between({ rx: 56, rz: -28, x: 120, y: 160, z: 420, oy: 380 }, { rx: 60, rz: -40, x: 0, y: 0, z: 120, oy: 420 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><City tone={(k) => (SEVEN.includes(k) ? "ice" : undefined)} /></World>}>
      <Head kick="S&P 500 · lunes 16 de noviembre"><h1>Siete empresas pesan <Hi>un tercio</Hi></h1></Head>
      <Card tone="down" style={{ left: 72, top: 700, width: 520 }}>
        <span className="lab">S&P 500</span>
        <span className="num">−1,9 %</span>
      </Card>
      <Card say={eq} style={{ left: 72, top: 960, width: 520 }}>
        <span className="lab">A partes iguales</span>
        <span className="num mid">−1,0 %</span>
        <small>S&P 500 Equal Weight</small>
      </Card>
      <Src>Cierre del lunes 16 frente al viernes 13 de noviembre de 2026 (Yahoo Finance). El edificio de cada empresa es tan alto como su peso en el índice (cartera del SPY, State Street, 16 de noviembre).</Src>
    </Frame>
  );
};
