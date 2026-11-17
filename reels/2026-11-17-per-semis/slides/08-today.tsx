// Tonight, 17 Nov 2026, after Wall Street's close, Nvidia reports (Yahoo Finance). Mean estimate for
// the quarter: 2.47 $ a share, 40 analysts (Yahoo Finance). Its new figures will move both of its P/Es.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Logo, Src, Wafer, World, between, glide, mid, prog } from "./look/oblea";

export default () => {
  const t = useSeconds();
  const m = mid("NVDA");
  const cam = between({ rx: 66, rz: -16, x: m.x + 60, y: m.y, z: 0, oy: 0 }, { rx: 62, rz: -30, x: m.x + 60, y: m.y, z: 90, oy: 0 }, glide(prog(t, 0, 6)));
  const others = ["AVGO", "AMD", "TSM", "ASML", "MU", "INTC"];
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} /><Chips built="all" dim={others} valueSize={50} /></World>}>
      <Head kick="Esta noche"><h1 className="mid">Nvidia <Hi say="presenta">presenta</Hi> resultados</h1></Head>
      <Card say="cifras" tone="key" style={{ left: 72, top: 1120, width: 600, padding: "14px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="nvidia" h={34} /> Hoy, tras el cierre</span>
        <span style={{ fontSize: 31 }}>Se esperan <b className="y" style={{ color: "#ffc85c" }}>2,47 $</b> por acción en el trimestre</span>
      </Card>
      <Src>Fecha de resultados y media de 40 analistas para el trimestre (Yahoo Finance, 17-11-2026).</Src>
    </Frame>
  );
};
