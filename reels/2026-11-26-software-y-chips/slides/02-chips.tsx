// The chips fund (SOXX): at the end of June 2026, 297.4 with the end of 2024 at 100; −41.4 % from its
// highest close (22 Jun 2026) to 25 Nov (Yahoo Finance, data/monthly.json). The gold row grows month by month.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Avenue, Card, Frame, Head, Hi, Over, Src, World, between, ease, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const june = useSay("junio"), since = useSay("perdido");
  const cam = between({ rx: 72, rz: -18, x: -200, y: 0, z: -1600, oy: 560 }, { rx: 70, rz: -30, x: 300, y: 0, z: -1450, oy: 560 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Avenue soft={0} upto={23 * prog(t, 0, Math.max(0.5, june))} />
      <Over i={17} row="chips" opacity={ease(prog(t, june, 0.6))}>297<small>jun 2026</small></Over></World>}>
      <Head kick="SOXX · fondo de chips" tone="gold"><h1>Casi <Hi say="triplicado" tone="gold">el triple</Hi>, y después</h1></Head>
      <Card say={since} tone="down" style={{ left: 72, top: 1150, width: 560 }}>
        <span className="lab">Desde su máximo del 22 de junio</span>
        <span className="num sm">−41,4 %</span>
      </Card>
      <Src>Cierre de cada mes, con el de 2024 en 100 (noviembre: el del 25). iShares Semiconductor ETF. Yahoo Finance.</Src>
    </Frame>
  );
};
