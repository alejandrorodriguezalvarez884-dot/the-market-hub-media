// Hook: S&P 500 Q3 2026 earnings growth +31.9 % (FactSet, 13 Nov) against the index at −1.5 % today at
// 18:08 Madrid (Yahoo Finance, data/yahoo-GSPC-today.json). Readable without sound from frame 0: the
// headline, the two figures and the world: the earnings yield as a tower (5.46 %, 1 / 18.3) in the
// water of the 10-year yield (5.15 %), both on 13 Nov.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, Frame, Gauge, Head, Hi, Island, Sea, Src, Water, World, between, glide, lvl, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const fall = useSay("cae");
  const cam = between({ rx: 68, rz: -24, x: -100, y: 0, z: -60, oy: 560 }, { rx: 72, rz: -40, x: -100, y: 0, z: 0, oy: 540 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={5.15} /><Island pct={5.46} wet={5.15} /><Gauge x={-420} y={60} wet={5.15} />
      <Bill x={0} y={0} z={lvl(5.46) + 30}><div className="tag" style={{ color: "#ffe2b0" }}>Bolsa</div></Bill>
      <Bill x={260} y={220} z={lvl(5.15) + 10}><div className="tag">Bono</div></Bill>
    </World>}>
      <Head kick="S&P 500 · jueves 19 de noviembre"><h1>Ganan más, y <Hi tone="down">la bolsa cae</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 640, width: 470 }}>
        <span className="lab">Beneficios, 3.er trimestre</span>
        <span className="num mid">+31,9 %</span>
        <small>frente a hace un año</small>
      </Card>
      <Card say={fall} tone="down" style={{ left: 572, top: 640, width: 400 }}>
        <span className="lab">S&P 500 hoy</span>
        <span className="num mid">−1,5 %</span>
        <small>a las 18:08 de España</small>
      </Card>
      <Src>Beneficios del S&P 500: FactSet, 13 de noviembre de 2026, con el 91 % de las empresas publicadas. Índice: Yahoo Finance. Al fondo, lo que rinde la bolsa en beneficios y el bono a 10 años, el 13 de noviembre.</Src>
    </Frame>
  );
};
