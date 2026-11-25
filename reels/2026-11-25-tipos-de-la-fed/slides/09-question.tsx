// The question for the comments. The Fed's next decision: 8-9 December 2026 (FOMC calendar, federalreserve.gov).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Sign, Src, Stairs, World, between, glide, prog } from "./look/escalera";

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const cam = between({ rx: 62, rz: -14, x: 60, y: 0, z: -760, oy: 80 }, { rx: 60, rz: 4, x: 40, y: 0, z: -800, oy: 90 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Ground /><Stairs ghost={1} /></World>}>
      <Head kick="Te pregunto · la Fed decide el 9 de diciembre"><h1 className="mid">¿Quién depende más del <Hi say="barato">dinero barato</Hi>?</h1></Head>
      <Card say={read} style={{ left: 72, top: 1200, width: 540, padding: "14px 22px" }}>
        <Sign>Te leo en comentarios</Sign>
      </Card>
      <Src style={{ top: 1330 }}>Calendario de reuniones de 2026: Reserva Federal.</Src>
    </Frame>
  );
};
