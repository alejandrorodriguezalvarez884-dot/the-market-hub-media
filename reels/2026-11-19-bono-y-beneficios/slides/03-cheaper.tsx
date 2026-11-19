// S&P 500 forward 12-month P/E: 22.0 on 31 Dec 2025 (FactSet, 6 Nov) and 18.3 on 13 Nov 2026, against
// a 10-year average of 19.1 (FactSet, 13 Nov). From 31 Dec to 5 Nov, price +7.4 %, forward EPS +33.6 %.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Sea, Src, Towers, World, between, glide, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const a = useSay("empezar"), b = useSay("viernes");
  const cam = between({ rx: 66, rz: -20, x: 0, y: 0, z: -260, oy: 470 }, { rx: 62, rz: -34, x: 0, y: 0, z: -200, oy: 470 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Sea />
      <Towers scale={17} w={130} d={130} gap={70} labelSize={18} valueSize={54} labelTop items={[
        { label: "31 dic 2025", value: 22.0, text: "22,0", tone: "ice", at: a },
        { label: "13 nov 2026", value: 18.3, text: "18,3", tone: "amber", at: b },
        { label: "Media 10 años", value: 19.1, text: "19,1", tone: "dim", at: b + 0.6 },
      ]} /></World>}>
      <Head kick="PER adelantado del S&P 500"><h1>La bolsa se ha <Hi say="abaratado" tone="amber">abaratado</Hi></h1></Head>
      <Card say={a} style={{ left: 72, top: 620, width: 560, padding: "16px 24px" }}>
        <span className="lab">31 dic 2025 → 5 nov 2026</span>
        <div className="line"><span>Beneficio esperado</span><b className="up">+33,6 %</b></div>
        <div className="line"><span>Precio</span><b className="ice">+7,4 %</b></div>
      </Card>
      <Src>Veces que se paga el beneficio esperado en los próximos 12 meses. FactSet, Earnings Insight del 6 y del 13 de noviembre de 2026.</Src>
    </Frame>
  );
};
