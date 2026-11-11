// What a neocloud is, in three beats: the chip (a GPU module turning), the hall it goes into (the
// camera pulls back and the racks light up), and the rent by the hour (a card).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Gpu, Hall, Head, Hi, World, between, clamp, ease, glide, prog } from "./look/nave";

export default () => {
  const t = useSeconds();
  const chips = useSay("chips"), naves = useSay("naves"), rent = useSay("alquila");
  const pull = glide(prog(t, naves - 0.3, 2.2));
  // The chip, close and turning, then gone into the hall.
  const gpuCam = { rx: 52 + 6 * glide(prog(t, 0, 4)), rz: -18 - 30 * glide(prog(t, 0, 5)), x: 0, y: 0, z: 700 - 220 * glide(prog(t, chips, 2)), oy: 200 };
  const hallCam = between({ rx: 70, rz: -40, x: 0, y: 400, z: 700, oy: 360 }, { rx: 60, rz: -30, x: 0, y: 0, z: -150, oy: 440 }, pull);
  const showGpu = 1 - ease(prog(t, naves - 0.3, 0.6));
  const world = showGpu > 0.02
    ? <div style={{ opacity: showGpu }}><World cam={gpuCam}><Gpu lift={30 + Math.sin(t * 1.3) * 8} heat={clamp(prog(t, chips, 1.5)) * 0.5} /></World></div>
    : null;
  return (
    <Frame world={<>
      <div style={{ opacity: 1 - showGpu }}><World cam={hallCam}><Hall power={prog(t, naves, 2.2)} rows={6} cols={12} /></World></div>
      {world}
    </>}>
      <Head kick="Qué es un neocloud"><h1 className="mid">Chips, <Hi say="naves">naves</Hi> y <Hi say="alquila">alquiler</Hi> por horas</h1></Head>
      <Card say="alquila" tone="key" style={{ left: 72, top: 1080, width: 700 }}>
        <span className="lab">El negocio</span>
        <span className="serif" style={{ fontSize: 44, lineHeight: 1.12, display: "block", color: "#121110" }}>Compra la potencia de cálculo y la <b>alquila</b> a quien entrena IA.</span>
      </Card>
    </Frame>
  );
};
