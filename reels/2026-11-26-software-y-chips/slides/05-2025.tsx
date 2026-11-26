// 2025 alone (Yahoo Finance): SOXX +39.8 %, IGV +5.6 %; Salesforce −20.8 %, Adobe −21.3 %, ServiceNow −27.7 %.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Over, Src, World, between, ease, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const names = useSay("Salesforce"), chips = useSay("chips");
  const cam = between({ rx: 70, rz: -20, x: -700, y: 0, z: -600, oy: 400 }, { rx: 68, rz: -32, x: -650, y: 0, z: -520, oy: 400 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Avenue upto={12} />
      <Over i={11} row="chips" opacity={ease(prog(t, chips, 0.6))}>+39,8 %<small>2025</small></Over></World>}>
      <Head kick="El año pasado"><h1>No empezó <Hi tone="amber">en 2026</Hi></h1></Head>
      <Card say={names} tone="violet" style={{ left: 72, top: 1020, width: 600 }}>
        <span className="lab">En 2025</span>
        <div className="line"><span>Salesforce</span><b className="down">−20,8 %</b></div>
        <div className="line"><span>Adobe</span><b className="down">−21,3 %</b></div>
        <div className="line"><span>ServiceNow</span><b className="down">−27,7 %</b></div>
      </Card>
      <Src>Del cierre de 2024 al de 2025. Fondo de chips SOXX; en violeta, el de software IGV (+5,6 %). Yahoo Finance.</Src>
    </Frame>
  );
};
