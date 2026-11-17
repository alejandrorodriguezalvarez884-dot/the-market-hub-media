// Micron, the lowest on both: P/E 9.7, forward 4.1 (close of 16 Nov 2026, Yahoo Finance; forward:
// mean estimate for its fiscal year to August 2027, 176.50 $; own calculation). Memory runs in cycles:
// its diluted EPS by fiscal year (SEC, 10-K): 2023 −5.34 $, 2024 0.70, 2025 7.59, 2026 74.33.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Logo, Src, Wafer, World, between, ease, glide, mid, prog } from "./look/oblea";

const EPS: [string, number][] = [["2023", -5.34], ["2024", 0.7], ["2025", 7.59], ["2026", 74.33]];

export default () => {
  const t = useSeconds();
  const pe = useSay("diez"), fwd = useSay("cuatro"), cyc = useSay("ciclos");
  const m = mid("MU");
  const cam = between({ rx: 64, rz: -22, x: m.x + 40, y: m.y - 40, z: -40, oy: -30 }, { rx: 60, rz: -34, x: m.x + 60, y: m.y - 40, z: 60, oy: -30 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} />
      <Chips built={["NVDA", "AVGO", "TSM", "ASML"]} dim={["NVDA", "AVGO", "TSM", "ASML"]} cues={{ MU: [pe, fwd] }} valueSize={50} />
    </World>}>
      <Head kick={<span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>Micron</span>}><h1 className="mid">La más <Hi say="baja">baja</Hi>, en los dos</h1></Head>
      <Card say={cyc} style={{ left: 72, top: 1100, width: 620, padding: "12px 24px" }}>
        <span className="lab" style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="micron" h={30} /> Beneficio por acción, por año fiscal</span>
        <div className="bars2">
          {EPS.map(([y, v], i) => {
            const p = ease(prog(t, cyc + 0.2 + i * 0.25, 0.6));
            const h = Math.max(4, (Math.abs(v) / 74.33) * 120) * p;
            return (
              <div className="b" key={y}>
                <em className={v < 0 ? "down" : ""} style={{ opacity: p, color: v < 0 ? "#d6402f" : undefined }}>{v.toLocaleString("es-ES", { minimumFractionDigits: 2 }).replace("-", "−")} $</em>
                <i style={{ height: h, background: v < 0 ? "#d6402f" : "#e08a00" }} />
                <small>{y}</small>
              </div>
            );
          })}
        </div>
      </Card>
      <Src>PER 9,7 y adelantado 4,1: cierre del 16-11-2026 y media de los analistas para su año a agosto de 2027 (Yahoo Finance); cálculo propio. Beneficio por acción diluido (SEC).</Src>
    </Frame>
  );
};
