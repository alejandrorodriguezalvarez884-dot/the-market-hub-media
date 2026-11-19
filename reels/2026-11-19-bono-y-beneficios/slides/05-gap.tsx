// What the market earns on its price (1 / forward P/E, FactSet): 4.55 % on 31 Dec 2025 (P/E 22.0) and
// 5.46 % on 13 Nov 2026 (P/E 18.3). The 10-year yield on the same days: 4.16 % and 5.15 % (Yahoo
// Finance). The gap: 0.38 points and 0.31 points. Our calculation, said as such.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bill, Card, Frame, Gauge, Head, Hi, Island, Sea, Src, Water, World, between, ease, es, glide, lvl, mix, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const jan = useSay("empezar"), nov = useSay("viernes");
  const p = ease(prog(t, nov - 0.2, 1.6));
  const ey = mix(4.545, 5.464, p), bond = mix(4.163, 5.154, p);
  const cam = between({ rx: 72, rz: -36, x: -120, y: 0, z: -20, oy: 560 }, { rx: 76, rz: -26, x: -120, y: 0, z: 40, oy: 560 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Sea /><Water pct={bond} /><Island pct={ey} wet={bond} /><Gauge x={-420} y={60} wet={bond} />
      <Bill x={0} y={0} z={lvl(ey) + 24}><div className="val" style={{ fontSize: 46 }}>{es(ey, 2)} %</div></Bill>
      <Bill x={300} y={300} z={lvl(bond) + 10}><div className="val" style={{ fontSize: 40, color: "#c7f4ff" }}>{es(bond, 2)} %</div></Bill>
    </World>}>
      <Head kick="Beneficio entre precio, frente al bono"><h1>La distancia <Hi say="tres">no crece</Hi></h1></Head>
      <Card say={jan} style={{ left: 72, top: 600, width: 420, padding: "16px 24px" }}>
        <span className="lab">31 dic 2025</span>
        <div className="line"><span>Bolsa</span><b>4,55 %</b></div>
        <div className="line"><span>Bono</span><b className="ice">4,16 %</b></div>
        <div className="line"><span>Diferencia</span><b>0,38</b></div>
      </Card>
      <Card say={nov} tone="amber" style={{ left: 532, top: 600, width: 420, padding: "16px 24px" }}>
        <span className="lab">13 nov 2026</span>
        <div className="line"><span>Bolsa</span><b>5,46 %</b></div>
        <div className="line"><span>Bono</span><b className="ice">5,15 %</b></div>
        <div className="line"><span>Diferencia</span><b>0,31</b></div>
      </Card>
      <Src>Bolsa: 1 entre el PER adelantado del S&P 500 (FactSet: 22,0 y 18,3). Bono: EE. UU. a 10 años, cierre del mismo día (Yahoo Finance). Diferencia en puntos: cálculo de The Market Hub.</Src>
    </Frame>
  );
};
