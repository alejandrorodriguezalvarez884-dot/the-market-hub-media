// The biggest: 3 Jan 2001, +18.77 % (2,128.78 -> 2,528.38), with the index 54.8 % below its high;
// by 7 Oct 2002 it had closed at 804.64, 68.2 % lower (Yahoo Finance, ^NDX).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Src, World, between, byDate, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const after = useSay("después");
  const big = byDate("2001-01-03");
  const cam = between({ rx: 56, rz: 6, x: 0, y: -1150, z: -1900, oy: 300 }, { rx: 62, rz: 20, x: -300, y: -1644, z: -600, oy: 300 }, glide(prog(t, 0, 4)));
  return (
    <Frame world={<World cam={cam}><Map paint={(d) => (d.date === big.date ? "red" : d.date === "2026-11-23" ? "amber" : "dim")}>
      
    </Map></World>}>
      <Head kick="El mayor de todos"><h1>3 de enero de 2001: <Hi tone="down">+18,8 %</Hi></h1></Head>
      <Card say={after} tone="down" style={{ left: 72, top: 1090, width: 600 }}>
        <span className="lab">Después, hasta el 7 oct 2002</span>
        <span className="num mid">−68,2 %</span>
        <small>de 2.528 a 805 puntos</small>
      </Card>
      <Src>Nasdaq 100, cierres diarios: Yahoo Finance. Ese día estaba un 54,8 % por debajo de su máximo de marzo de 2000.</Src>
    </Frame>
  );
};
