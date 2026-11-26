// Five software companies in 2026, close of 25 Nov against the close of 2025 (Yahoo Finance): Salesforce
// −25.6 %, Adobe −33.5 %, ServiceNow −39.8 %, HubSpot −47.6 %, Intuit −59.0 %. Each tower sinks from the
// wire frame at 100 when its name is said.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Frame, Head, Hi, Plaza, PX, Src, World, between, glide, prog } from "./look/avenida";

export default () => {
  const t = useSeconds();
  const cues = [useSay("Salesforce"), useSay("Adobe"), useSay("ServiceNow"), useSay("HubSpot"), useSay("Intuit")];
  const cam = between({ rx: 74, rz: -6, x: PX, y: 0, z: -1150, oy: 400 }, { rx: 72, rz: 4, x: PX, y: 0, z: -1050, oy: 400 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><Plaza at={(k) => cues[k]} /></World>}>
      <Head kick="Cinco grandes del software" tone="violet"><h1>Los nombres <Hi say="caen" tone="down">caen más</Hi></h1></Head>
      <Src>En 2026, del cierre de 2025 al del 25 de noviembre; la línea discontinua es el 100. Yahoo Finance; cálculo nuestro.</Src>
    </Frame>
  );
};
