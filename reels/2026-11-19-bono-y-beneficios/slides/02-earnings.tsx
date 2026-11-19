// Q3 2026: third quarter in a row of S&P 500 earnings growth above 25 %; 84 % of companies beat the
// EPS estimate, against a 5-year average of 78 % (FactSet Earnings Insight, 13 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Sea, Src, Towers, World, between, glide, prog } from "./look/marea";

export default () => {
  const t = useSeconds();
  const beat = useSay("ochenta");
  const cam = between({ rx: 66, rz: -14, x: 0, y: 0, z: -200, oy: 540 }, { rx: 62, rz: -30, x: 0, y: 0, z: -140, oy: 550 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Sea />
      <Towers scale={5} w={150} d={150} gap={170} labelSize={20} valueSize={56} labelTop items={[
        { label: "Superan lo previsto", value: 84, text: "84 %", tone: "amber", at: beat },
        { label: "Media 5 años", value: 78, text: "78 %", tone: "dim", at: beat + 0.4 },
      ]} /></World>}>
      <Head kick="Beneficios del S&P 500"><h1>Tres trimestres <Hi tone="amber">por encima del 25 %</Hi></h1></Head>
      <Card tone="amber" style={{ left: 72, top: 620, width: 470 }}>
        <span className="lab">3.er trimestre de 2026</span>
        <span className="num mid">+31,9 %</span>
        <small>crecimiento del beneficio por acción</small>
      </Card>
      <Src>FactSet, Earnings Insight del 13 de noviembre de 2026: empresas del S&P 500 cuyo beneficio por acción supera lo que esperaban los analistas, con el 91 % publicadas.</Src>
    </Frame>
  );
};
