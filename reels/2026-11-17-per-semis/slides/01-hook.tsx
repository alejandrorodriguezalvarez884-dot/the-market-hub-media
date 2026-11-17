// Hook: the seven chipmakers on the wafer, their two towers rising from frame 0. Moves of 16 Nov 2026
// at the close (Yahoo Finance): Micron −7.62 %, Nvidia −4.12 %; Nasdaq 100 −2.67 % (Market Hub).
// Readable without sound: headline, logos, towers and the day's falls are there from the start.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Chips, Frame, Head, Hi, Key, Logo, Src, Wafer, World, between, glide, prog } from "./look/oblea";

const CUES: Record<string, [number, number]> = {
  NVDA: [0.0, 0.25], AVGO: [0.15, 0.4], AMD: [0.3, 0.55], ASML: [0.45, 0.7], MU: [0.6, 0.85], TSM: [0.75, 1.0], INTC: [0.9, 1.15],
};

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 66, rz: -14, x: 0, y: -60, z: -560, oy: 50 }, { rx: 60, rz: -30, x: 0, y: -60, z: -470, oy: 50 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Wafer cx={0} cy={-60} /><Chips cues={CUES} values={false} /></World>}>
      <Head kick="Aprende · PER adelantado"><h1 className="mid">Siete chips, <Hi>dos PER</Hi></h1></Head>
      <Card tone="down" style={{ left: 72, top: 1120, width: 400, padding: "14px 22px" }}>
        <span className="lab">Ayer, al cierre</span>
        <div className="line"><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Logo name="micron" h={30} /> Micron</span><b className="down">−7,6 %</b></div>
        <div className="line"><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Logo name="nvidia" h={30} /> Nvidia</span><b className="down">−4,1 %</b></div>
        <div className="line"><span>Nasdaq 100</span><b className="down">−2,7 %</b></div>
      </Card>
      <Card say="pedisteis" tone="key" style={{ left: 500, top: 1120, width: 430, padding: "14px 22px" }}>
        <span className="lab">Lo pedisteis</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30 }}><Logo name="broadcom" h={34} /> <b>Broadcom</b></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, marginTop: 10 }}><Logo name="micron" h={34} /> <b>Micron</b></div>
      </Card>
      <Key style={{ position: "absolute", left: 72, top: 500 }} />
      <Src>Cierre del 16 de noviembre de 2026 (Yahoo Finance; Market Hub). Torres: PER y PER adelantado de cada empresa, a la misma escala.</Src>
    </Frame>
  );
};
