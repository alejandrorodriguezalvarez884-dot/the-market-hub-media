// Nvidia: a year ago 186.86 $ (close of 13 Nov 2025) and 3.52 $ of diluted EPS in the four quarters to
// 27 Jul 2025: P/E 53.1. Today 160.53 $ (18:09 in Spain) and 7.91 $ to 26 Jul 2026: P/E 20.3 (SEC;
// Yahoo Finance; P/E, own calculation). Price −14.1 %, EPS ×2.25.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Pile, Src, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const before = useSay("ciento"), now = useSay("sesenta");
  const cam = between({ rx: 66, rz: -16, x: -60, y: 0, z: -40, oy: 230 }, { rx: 70, rz: -30, x: -60, y: 0, z: -90, oy: 230 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-330} y={-75} price={186.86} eps={3.52} scale={2.35} at={before} step={0.04} priceText="186,86 $" label="Nov. 2025" valueSize={46} />
      <Pile x={40} y={-75} price={160.53} eps={7.91} scale={2.35} at={now} step={0.09} priceText="160,53 $" label="Hoy" valueSize={46} />
    </World>}>
      <Head kick={<span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>Nvidia</span>}><h1 className="mid">Gana el <Hi say="ocho">doble</Hi> y cuesta menos</h1></Head>
      <Card say={before} style={{ left: 72, top: 1180, width: 560, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Beneficio por acción, 12 meses</span>
        <div className="line"><span>Nov. 2025</span><b>3,52 $ · PER 53</b></div>
        <Card say="ocho" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Hoy</span><b className="y">7,91 $ · PER 20</b></div>
        </Card>
      </Card>
      <Src>Precio: Yahoo Finance (cierre del 13-11-2025; hoy, 18:09 de España). Beneficio por acción diluido de los cuatro trimestres hasta el 27-7-2025 y el 26-7-2026 (SEC). PER: cálculo propio.</Src>
    </Frame>
  );
};
