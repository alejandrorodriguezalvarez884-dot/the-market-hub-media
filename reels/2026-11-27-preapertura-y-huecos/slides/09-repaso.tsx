// Recap: the session, 15:30 to 22:00 in Spain; before and after it also trades; news with the exchange shut opens with a
// gap. The whole track again, all zones lit.
import React from "react";
import { useSeconds } from "@mh/kit";
import { Card, Frame, Ground, Head, Hi, Track, VRTX, World, Zones, between, glide, prog } from "./look/pista";

export default () => {
  const t = useSeconds();
  const cam = between({ rx: 62, rz: -50, x: 40, y: 0, z: -1080, oy: 100 }, { rx: 64, rz: -36, x: -40, y: 0, z: -1140, oy: 100 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Ground /><Zones lit={["ws", "wp", "gap", "fp", "fs"]} /><Track s={VRTX} /></World>}>
      <Head kick="Repaso"><h1 className="mid">Tres horarios y <Hi say="hueco">un hueco</Hi></h1></Head>
      <Card say="sesión" style={{ left: 72, top: 1080, width: 858, padding: "14px 24px" }}>
        <div className="line"><span>Sesión, en España</span><b className="y">15:30 a 22:00</b></div>
        <div className="line"><span>Preapertura y postcierre</span><b>también se cotiza</b></div>
        <div className="line"><span>Noticia con la bolsa cerrada</span><b className="down">abre con hueco</b></div>
      </Card>
    </Frame>
  );
};
