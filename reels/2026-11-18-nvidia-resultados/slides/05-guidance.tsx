// Outlook for the fourth quarter of fiscal 2027 (to late January 2027, a quarter with an extra week):
// revenue $130.0bn ±3 %, assuming no Data Center compute revenue from China (release of 17 November
// 2026). Analysts expected $125.1bn (LSEG, via CNBC). On the call, Colette Kress: NVIDIA is no longer
// shipping its licensed Hopper products to China; Q3 shipments were $2.4bn (CFO commentary).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const guide = useSay("ciento"), exp = useSay("previsto"), china = useSay("China");
  const cam = between({ rx: 64, rz: -20, x: 0, y: 0, z: -120, oy: 190 }, { rx: 58, rz: -32, x: 0, y: 0, z: -20, oy: 220 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={2.6} w={130} d={130} gap={80} valueSize={56} items={[
        { label: "Oct 26", value: 115.8, text: "115,8", tone: "dim", at: 0.1 },
        { label: "Esperado", value: 125.1, text: "125,1", tone: "dim", at: exp },
        { label: "Prevé", value: 130, text: "130", tone: "ice", at: guide },
      ]} /></World>}>
      <Head kick="Próximo trimestre · miles de M$"><h1 className="mid">Espera <Hi say="ciento">130.000 M$</Hi></h1></Head>
      <Card say={china} tone="amber" style={{ left: 72, top: 520, width: 560 }}>
        <span className="lab">China, en la previsión</span>
        <span className="num sm">0 $</span>
        <small style={{ color: "#ffe2b0" }}>Ya no le envía chips para centros de datos. En el trimestre: 2.400 M$.</small>
      </Card>
      <Src>Previsión de ingresos, ±3 %, para el trimestre que acaba en enero de 2027 (con una semana más). Nvidia, 17 de noviembre de 2026, y su conferencia de resultados. Lo esperado: LSEG, según CNBC.</Src>
    </Frame>
  );
};
