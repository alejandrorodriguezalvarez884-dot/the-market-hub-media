// The two warnings: estimates change, and they are usually of adjusted profit, without some costs the
// P/E of the last twelve months does subtract. AMD: 4.68 $ of diluted (accounting) EPS in the last
// twelve months; about 6.68 $ adjusted for the same months (data/sources.md), so part of its gap
// between 107.8 and 28.6 comes from that.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Logo, Src, Wafer, World, between, glide, mid, prog } from "./look/oblea";

export default () => {
  const t = useSeconds();
  const adj = useSay("ajustado");
  const m = mid("AMD");
  const cam = between({ rx: 60, rz: -30, x: m.x, y: m.y, z: -330, oy: 190 }, { rx: 64, rz: -18, x: m.x, y: m.y, z: -300, oy: 190 }, glide(prog(t, 0, 9)));
  const others = ["NVDA", "AVGO", "TSM", "ASML", "MU", "INTC"];
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} /><Chips built="all" dim={others} valueSize={44} /></World>}>
      <Head kick="Un aviso"><h1 className="mid">Las previsiones <Hi say="cambian">cambian</Hi></h1></Head>
      <Card say="cambian" style={{ left: 72, top: 1100, width: 640, padding: "12px 24px" }}>
        <div className="line"><span>PER de 12 meses</span><b>beneficio contable</b></div>
        <Card say={adj} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>PER adelantado</span><b className="y">beneficio ajustado</b></div>
        </Card>
        <Card say="AMD" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}><Logo name="amd" h={30} /> 12 meses</span><b>4,68 $ contable</b></div>
        </Card>
      </Card>
      <Src>Las estimaciones de los analistas suelen excluir gastos como la amortización de compras de empresas. AMD: beneficio por acción diluido de los últimos doce meses (Yahoo Finance).</Src>
    </Frame>
  );
};
