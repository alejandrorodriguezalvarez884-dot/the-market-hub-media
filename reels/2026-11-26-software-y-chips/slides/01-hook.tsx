// Hook: the chips fund (SOXX) lost 17.6 % from the close of 11 Nov to that of 25 Nov 2026 and is still
// +27.5 % in 2026; the software fund (IGV) is −10.1 % (Yahoo Finance, data/yahoo-*.json). Readable
// without sound from frame 0: the headline, the three figures and the avenue's last months.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Src, World, between, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const year = useSay("aun"), soft = useSay("software");
  const cam = between({ rx: 70, rz: -24, x: 600, y: 0, z: -1000, oy: 420 }, { rx: 70, rz: -34, x: 550, y: 0, z: -920, oy: 420 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Avenue /></World>}>
      <Head kick="Chips y software · 2026"><h1>Los chips caen <Hi tone="gold">y aún ganan</Hi></h1></Head>
      <Card tone="down" style={{ left: 72, top: 1040, width: 430 }}>
        <span className="lab">Chips, desde el 11 nov</span>
        <span className="num sm">−17,6 %</span>
      </Card>
      <Card tone="gold" say={year} style={{ left: 530, top: 1040, width: 400 }}>
        <span className="lab">Chips, en 2026</span>
        <span className="num sm">+27,5 %</span>
      </Card>
      <Card tone="violet" say={soft} style={{ left: 72, top: 1210, width: 430 }}>
        <span className="lab">Software, en 2026</span>
        <span className="num sm">−10,1 %</span>
      </Card>
      <Src style={{ top: 1385 }}>Fondos de iShares de chips (SOXX) y de software (IGV), cierres hasta el miércoles 25. Yahoo Finance.</Src>
    </Frame>
  );
};
