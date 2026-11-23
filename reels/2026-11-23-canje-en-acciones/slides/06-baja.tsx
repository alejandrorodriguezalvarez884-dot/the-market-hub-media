// The buyer: CrowdStrike from 229.44 $ to 204.735 $ (18:06, Yahoo Finance), and with it what the exchange gives,
// from 260.41 $ to 232.37 $ (1.135 × the price; own calculation). Paying in shares means issuing new ones.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Level, Offer, Src, Tower, World, ZX, between, ease, glide, mix, prog } from "./look/bascula";

export default () => {
  const t = useSeconds();
  const hoy = useSay("hoy,"), more = useSay("nuevas,");
  const cam = between({ rx: 62, rz: -20, x: 80, y: 0, z: -340, oy: 10 }, { rx: 64, rz: -36, x: 0, y: 0, z: -380, oy: 10 }, glide(prog(t, 0, 10)));
  const p = ease(prog(t, hoy - 0.2, 1.8));
  const px = mix(229.44, 204.735, p);
  return (
    <Frame world={<World cam={cam}><Ground />
      <Tower x={ZX} usd={224.43} k="zs" />
      <Offer price={px} />
      <Level usd={px * 1.135} />
    </World>}>
      <Head kick="El que compra"><h1 className="mid"><Hi tone="down">Cae</Hi>, y el canje vale menos</h1></Head>
      <Card say={more} style={{ left: 72, top: 1070, width: 600, padding: "12px 22px" }}>
        <span style={{ fontSize: 28 }}>Paga con <b>acciones nuevas</b>: la empresa tendrá <b>más dueños</b></span>
      </Card>
      <Card say={hoy} tone="key" style={{ left: 72, top: 1200, width: 600, padding: "12px 22px" }}>
        <div className="line"><span>Canje, viernes</span><b>260,41 $</b></div>
        <div className="line"><span>Canje, hoy 18:06 h</span><b className="y">232,37 $</b></div>
      </Card>
      <Src>CrowdStrike: 229,44 $ el viernes, 204,74 $ hoy (Yahoo Finance). × 1,135: cálculo propio.</Src>
    </Frame>
  );
};
