// The Nasdaq 100's 20 biggest one-day gains all came with the index between 22.9 % and 75.4 % below
// its highest close (Yahoo Finance, data/rebotes.json): they light up red, all beyond the -20 % line.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Src, World, between, ease, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const twenty = useSay("veinte"), all = useSay("todos");
  const lit = ease(prog(t, all, 0.8));
  const cam = between({ rx: 58, rz: -10, x: 0, y: -1150, z: -2000, oy: 300 }, { rx: 56, rz: 6, x: 0, y: -1150, z: -1900, oy: 300 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Map line20={0.4 + 0.6 * lit} paint={(d) => (d.date === "2026-11-23" ? "amber" : d.rank <= 20 && t >= twenty ? "red" : "dim")} /></World>}>
      <Head kick="Los 20 mayores"><h1>Todos, <Hi say="todos" tone="down">en plena caída</Hi></h1></Head>
      <Card say={all} tone="down" style={{ left: 72, top: 590, width: 760 }}>
        <span className="lab">Las 20 mayores subidas en un día</span>
        <span>Con el índice entre un <b>22,9 %</b> y un <b>75,4 %</b> por debajo de su máximo</span>
      </Card>
      <Src>En rojo, las 20 mayores subidas del Nasdaq 100 en un día desde 1985, todas más allá de la línea del −20 %. En ámbar, el lunes. Yahoo Finance; cálculo nuestro.</Src>
    </Frame>
  );
};
