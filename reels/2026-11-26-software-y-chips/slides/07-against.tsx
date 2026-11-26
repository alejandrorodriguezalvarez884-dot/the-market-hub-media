// Against the thesis: from the close of 11 Nov to that of 25 Nov 2026, IGV −7.1 % and SOXX −17.6 % (Yahoo Finance).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Src, World, between, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const soft = useSay("software"), chips = useSay("chips"), idea = useSay("cambiaría");
  const cam = between({ rx: 68, rz: 20, x: 850, y: 0, z: -300, oy: 360 }, { rx: 68, rz: 30, x: 850, y: 0, z: -220, oy: 360 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Avenue from={18} /></World>}>
      <Head kick="Un dato en contra"><h1>En esta caída, <Hi say="software" tone="violet">aguanta más</Hi></h1></Head>
      <Card say={soft} tone="violet" style={{ left: 72, top: 900, width: 400 }}>
        <span className="lab">Software</span>
        <span className="num sm">−7,1 %</span>
      </Card>
      <Card say={chips} tone="gold" style={{ left: 500, top: 900, width: 400 }}>
        <span className="lab">Chips</span>
        <span className="num sm">−17,6 %</span>
      </Card>
      <Card say={idea} style={{ left: 72, top: 1130, width: 760 }}>
        <span className="lab">Qué nos haría cambiar de idea</span>
        <span>Que el software aguante mejor que los chips durante meses, no semanas.</span>
      </Card>
      <Src>Del cierre del 11 de noviembre al del 25. Fondos IGV y SOXX de iShares. Yahoo Finance.</Src>
    </Frame>
  );
};
