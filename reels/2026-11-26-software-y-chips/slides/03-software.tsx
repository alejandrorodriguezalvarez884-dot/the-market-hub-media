// The software fund (IGV): 94.9 at the close of 25 Nov 2026 with the end of 2024 at 100; −10.1 % in 2026
// (Yahoo Finance, data/monthly.json). The violet row grows; the chips stay, in grey.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Over, Src, World, between, ease, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const below = useSay("debajo"), year = useSay("pierde");
  const cam = between({ rx: 66, rz: -6, x: 0, y: 60, z: -900, oy: 300 }, { rx: 64, rz: 8, x: 200, y: 60, z: -700, oy: 300 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Avenue dimChips chips={0.35} upto={23} />
      <Over i={22} row="soft" opacity={ease(prog(t, below, 0.6))}>94,9<small>nov 2026</small></Over></World>}>
      <Head kick="IGV · fondo de software" tone="violet"><h1>Por debajo <Hi say="debajo" tone="violet">de enero de 2025</Hi></h1></Head>
      <Card say={year} tone="violet" style={{ left: 72, top: 1150, width: 480 }}>
        <span className="lab">Software, en 2026</span>
        <span className="num sm">−10,1 %</span>
      </Card>
      <Src>Cierre de cada mes, con el de 2024 en 100; el cristal marca el 100. iShares Expanded Tech-Software Sector ETF. Yahoo Finance.</Src>
    </Frame>
  );
};
