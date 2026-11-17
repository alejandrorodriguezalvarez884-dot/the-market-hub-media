// Broadcom (P/E 42.6, forward 17.2), TSMC (24.2, 16.0) and ASML (34.6, 22.6) at the close of 16 Nov
// 2026 (Yahoo Finance; forward: mean estimate for the fiscal year mostly in 2027; ASML's in euros at
// 1.101 $; own calculation). The camera glides from Broadcom along the wafer.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Key, Logo, Src, Wafer, World, between, glide, prog } from "./look/oblea";

const Row: React.FC<{ logo: string; name: string; pe: string; fwd: string; say: string }> = ({ logo, name, pe, fwd, say }) => (
  <Card say={say} style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
    <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}><Logo name={logo} h={30} /> {name}</span>
      <b>{pe} · <span className="y" style={{ color: "#e08a00" }}>{fwd}</span></b>
    </div>
  </Card>
);

export default () => {
  const t = useSeconds();
  const avgo = useSay("Broadcom"), avgoF = useSay("diecisiete"), tsm = useSay("TSMC"), tsmF = useSay("dieciséis"), asml = useSay("ASML"), asmlF = useSay("veintitrés");
  const cam = between({ rx: 62, rz: -24, x: -60, y: -150, z: -330, oy: 30 }, { rx: 64, rz: -34, x: 230, y: -120, z: -330, oy: 30 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} />
      <Chips built={["NVDA"]} dim={["NVDA"]} cues={{ AVGO: [avgo, avgoF], TSM: [tsm, tsmF], ASML: [asml, asmlF] }} valueSize={44} />
    </World>}>
      <Head kick="PER · adelantado"><h1 className="mid">Todas <Hi say="diecisiete">bajan</Hi> al mirar adelante</h1></Head>
      <Card style={{ left: 72, top: 1120, width: 620, padding: "12px 24px" }}>
        <Row logo="broadcom" name="Broadcom" pe="42,6" fwd="17,2" say="Broadcom" />
        <Row logo="tsmc" name="TSMC" pe="24,2" fwd="16,0" say="TSMC" />
        <Row logo="asml" name="ASML" pe="34,6" fwd="22,6" say="ASML" />
      </Card>
      <Key style={{ position: "absolute", left: 72, top: 575 }} />
      <Src>Cierre del 16-11-2026 (Yahoo Finance). Adelantado: media de los analistas para el año fiscal que cae sobre todo en 2027; ASML, en euros pasados a dólares. Cálculo propio.</Src>
    </Frame>
  );
};
