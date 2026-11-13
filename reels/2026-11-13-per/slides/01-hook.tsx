// Hook: Nvidia at 160.53 $ (−3.41 %) at 18:09 in Spain on 13 November 2026 (Yahoo Finance); a year
// before, 186.86 $ (close of 13 Nov 2025). Diluted EPS of the last four quarters published: 3.52 $ then,
// 7.91 $ now (SEC). P/E 53.1 and 20.3. Two glass towers at the price's scale fill with their years of
// profit. Readable without sound from frame 0: headline, logo and the move are there from the start.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Pile, Src, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 70, rz: -26, x: -60, y: 0, z: -120, oy: 230 }, { rx: 66, rz: -16, x: -60, y: 0, z: -40, oy: 230 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-330} y={-75} price={186.86} eps={3.52} scale={2.35} at={0} step={0.045} priceText="186,86 $" label="Nov. 2025" valueSize={46} />
      <Pile x={40} y={-75} price={160.53} eps={7.91} scale={2.35} at={0.4} step={0.11} priceText="160,53 $" label="Hoy" valueSize={46} />
    </World>}>
      <Head kick="Aprende · el PER"><h1 className="mid">Nvidia: de <Hi>53 años</Hi> de beneficios a 20</h1></Head>
      <Card tone="down" style={{ left: 72, top: 1170, width: 420, padding: "16px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={40} /> Nvidia · hoy</span>
        <span className="num sm">−3,4 %</span>
        <small>13 nov, 18:09 h de España</small>
      </Card>
      <Src>Nvidia (Yahoo Finance) a las 18:09 de España y cierre del 13 de noviembre de 2025; beneficio por acción diluido de los cuatro últimos trimestres publicados (SEC). PER: cálculo propio.</Src>
    </Frame>
  );
};
