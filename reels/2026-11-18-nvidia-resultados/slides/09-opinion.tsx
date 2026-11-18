// Our opinion: the doubt is no longer demand (revenue +103 %, an outlook above what was expected) but
// what the release does not show: who runs the company (an interim CEO, a search under way), China
// (none in the outlook) and how long the spending lasts.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Src, World, between, glide, prog } from "./look/nave";

const Doubt: React.FC<{ say: number; n: string; children: React.ReactNode; top: number }> = ({ say, n, children, top }) => (
  <Card say={say} tone="key" style={{ left: 72, top, width: 780, padding: "18px 26px" }}>
    <span className="serif" style={{ fontSize: 46, lineHeight: 1.1, display: "flex", gap: 22, alignItems: "baseline", color: "#121110" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 24, color: "#6b6760" }}>{n}</span>{children}
    </span>
  </Card>
);

export default () => {
  const t = useSeconds();
  const who = useSay("quién"), china = useSay("China"), long = useSay("cuánto");
  const cam = between({ rx: 70, rz: -50, x: -200, y: 300, z: 520, oy: 420 }, { rx: 60, rz: -20, x: 100, y: -100, z: 120, oy: 460 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><Hall power={1} rows={8} cols={14} /></World>}>
      <Head kick="Nuestra opinión"><h1>La duda ya no es la <Hi say="demanda">demanda</Hi></h1></Head>
      <Doubt say={who} n="01" top={640}>¿Quién manda?</Doubt>
      <Doubt say={china} n="02" top={790}>China</Doubt>
      <Doubt say={long} n="03" top={940}>¿Cuánto durará el gasto?</Doubt>
      <Src>Opinión de The Market Hub, no una recomendación.</Src>
    </Frame>
  );
};
