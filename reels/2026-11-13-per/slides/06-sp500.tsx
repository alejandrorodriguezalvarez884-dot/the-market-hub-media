// The S&P 500's P/E on trailing twelve months' reported earnings: 25.91 at the close of 12 Nov 2026;
// its historical mean, 16.24 (Multpl). Drawn as years of profit: one block per year.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Pile, Src, World, between, glide, prog } from "./look/pila";

export default () => {
  const t = useSeconds();
  const now = useSay("veintiséis"), mean = useSay("media");
  const cam = between({ rx: 68, rz: 20, x: -60, y: 0, z: -100, oy: 230 }, { rx: 70, rz: -6, x: -60, y: 0, z: -60, oy: 230 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Pile x={-330} y={-75} price={25.91} eps={1} scale={16} at={now - 0.6} step={0.07} label="S&P 500" valueSize={46} />
      <Pile x={40} y={-75} price={16.24} eps={1} scale={16} at={mean} step={0.07} label="Su media" dim valueSize={46} />
    </World>}>
      <Head kick="El S&P 500, en conjunto"><h1 className="mid">Casi <Hi say="veintiséis">26 años</Hi>; su media, 16</h1></Head>
      <Card say={mean} style={{ left: 72, top: 1190, width: 520, padding: "14px 24px" }}>
        <div className="line"><span>PER del S&P 500</span><b className="y">25,91</b></div>
        <div className="line"><span>Media histórica</span><b>16,24</b></div>
      </Card>
      <Src>PER del S&P 500 con los beneficios de los últimos doce meses, al cierre del 12 de noviembre de 2026, y su media histórica (Multpl).</Src>
    </Frame>
  );
};
