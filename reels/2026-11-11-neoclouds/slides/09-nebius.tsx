// Nebius reports its third quarter on Thursday 12 November 2026, before Wall Street opens, with its call
// at 8:00 New York, 14:00 in Spain (Nebius newsroom). Since the close of 2025, at 16:33 in Spain on
// 11 November: Nebius +84.2 %, CoreWeave −17.7 %, IREN −44.8 % (Yahoo Finance, data/).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Logo, Src, World, between, ease, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const year = useSay("ochenta"), tomorrow = useSay("mañana");
  const cam = between({ rx: 62, rz: -30, x: 0, y: 500, z: 300, oy: 330 }, { rx: 58, rz: -26, x: 0, y: 0, z: -40, oy: 370 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}>
      <Hall power={0.15} rows={6} cols={12} trays={false} />
    </World>}>
      <div style={{ position: "absolute", left: 72, top: 640, opacity: ease(prog(t, 0.2, 0.7)), transform: `translateY(${(1 - ease(prog(t, 0.2, 0.9))) * 30}px) scale(${0.94 + 0.06 * ease(prog(t, 0.2, 1.4))})`, transformOrigin: "left center",
        background: "#fff", borderRadius: 18, padding: "20px 30px", boxShadow: "0 0 90px rgba(199,244,255,0.45), 0 30px 80px rgba(0,0,0,0.6)" }}>
        <Logo name="nebius" h={110} style={{ padding: 0 }} />
      </div>
      <Head kick="Falta uno"><h1>El que mejor <Hi say="ejecuta">ejecuta</Hi>, para mí</h1></Head>
      <Card say={year} style={{ left: 72, top: 1000, width: 470 }}>
        <span className="lab">En bolsa, en 2026</span>
        <div className="line"><span>Nebius</span><b className="up">+84,2 %</b></div>
        <div className="line"><span>CoreWeave</span><b className="down">−17,7 %</b></div>
        <div className="line"><span>IREN</span><b className="down">−44,8 %</b></div>
      </Card>
      <Card say={tomorrow} tone="ice" style={{ left: 570, top: 1000, width: 340 }}>
        <span className="lab">Resultados</span>
        <span className="num sm">Jueves 12</span>
        <small>Antes de la apertura · conferencia a las 14:00 de España</small>
      </Card>
      <Src>Opinión de The Market Hub. Cotizaciones a las 16:33 de España del 11 de noviembre frente al cierre de 2025 (Yahoo Finance). Fecha de resultados: Nebius.</Src>
    </Frame>
  );
};
