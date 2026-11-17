// The idea first, with a made-up bakery: it earned 10,000 €, it is expected to earn 20,000 €, and it
// costs 200,000 €. P/E 20 (glass tower), forward P/E 10 (amber stack), at the reel's one scale.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Head, Hi, Key, Pair, Src, World, between, glide, prog } from "./look/oblea";

const BAKERY = { key: "EJ", name: "Panadería", x: -100, y: -65, pe: 20, fwd: 10 };

export default () => {
  const t = useSeconds();
  const pe = useSay("PER veinte"), fwd = useSay("Adelantado, diez");
  const cam = between({ rx: 64, rz: -18, x: 0, y: 0, z: 120, oy: -50 }, { rx: 66, rz: -30, x: 0, y: 0, z: 200, oy: -50 }, glide(prog(t, 0, 14)));
  return (
    <Frame world={<World cam={cam}><Floor /><Pair c={BAKERY} pe={pe} fwd={fwd} valueSize={52} /></World>}>
      <Head kick="Dos maneras de mirar"><h1 className="mid">Lo que ganó, o lo que <Hi say="adelantado">ganará</Hi></h1></Head>
      <Card say="panadería" style={{ left: 72, top: 1120, width: 600, padding: "14px 24px" }}>
        <Ej />
        <div className="line"><span>Precio</span><b>200.000 €</b></div>
        <div className="line"><span>Ganó el último año</span><b>10.000 €</b></div>
        <Card say="veinte mil" style={{ position: "relative", padding: 0, border: 0, boxShadow: "none", background: "transparent" }}>
          <div className="line" style={{ borderTop: "1px solid rgba(23,20,15,0.14)" }}><span>Se espera que gane</span><b className="y">20.000 €</b></div>
        </Card>
      </Card>
      <Key style={{ position: "absolute", left: 72, top: 575 }} />
      <Src>PER: precio entre el beneficio de los últimos doce meses. PER adelantado: precio entre el beneficio que se espera para el próximo año.</Src>
    </Frame>
  );
};
