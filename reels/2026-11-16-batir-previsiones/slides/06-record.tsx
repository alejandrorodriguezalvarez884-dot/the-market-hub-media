// Nvidia's last four quarters against the bar (Nasdaq, with Zacks): Oct 2025 1.24 vs 1.18 (+5.1 %),
// Jan 2026 1.57 vs 1.45 (+8.3 %), Apr 2026 1.87 vs 1.70 (+10 %), Jul 2026 2.22 vs 2.09 (+6.2 %).
// Four stands at the same scale; the columns rise one after another.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Floor, Frame, Head, Hi, Jump, Src, World, between, glide, prog } from "./look/liston";

const Q = [
  { l: "Oct. 2025", bar: 1.18, eps: 1.24, b: "1,18", e: "1,24", s: "+5,1 %" },
  { l: "Ene. 2026", bar: 1.45, eps: 1.57, b: "1,45", e: "1,57", s: "+8,3 %" },
  { l: "Abr. 2026", bar: 1.7, eps: 1.87, b: "1,70", e: "1,87", s: "+10 %" },
  { l: "Jul. 2026", bar: 2.09, eps: 2.22, b: "2,09", e: "2,22", s: "+6,2 %" },
];

export default () => {
  const t = useSeconds();
  const go = useSay("siempre");
  const cam = between({ rx: 70, rz: -8, x: -40, y: 0, z: -520, oy: 280 }, { rx: 66, rz: -22, x: 0, y: 0, z: -480, oy: 280 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor w={4000} d={3000} />
      {Q.map((q, i) => (
        <Jump key={i} x={-480 + i * 300} y={0} w={200} bar={q.bar} eps={q.eps} scale={150} barAt={-5} at={go - 0.6 + i * 0.35} takes={1.0}
          epsText={q.e} surprise={q.s} label={q.l} size={40} />
      ))}
    </World>}>
      <Head kick="Nvidia, cuatro trimestres"><h1 className="mid">Cuatro saltos, <Hi say="siempre" tone="up">cuatro por encima</Hi></h1></Head>
      <Src>Beneficio por acción ajustado frente al consenso, en dólares, por trimestre fiscal: Nasdaq, con datos de Zacks Investment Research.</Src>
    </Frame>
  );
};
