// Gap's last four quarters (adjusted EPS against consensus, Nasdaq/Zacks): to Jan 2026 0.45/0.45, to Apr
// 0.38/0.39, to Jul 0.52/0.50, to Oct 0.82/0.76. Height = EPS (380 px a dollar); the ink plate is the consensus.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Bar, Block, Card, Frame, Head, Hi, Road, Src, Today, World, between, glide, prog, ease, EPS } from "./look/camino";

const Q: [string, number, number, number][] = [["Ene", 0.45, 0.45, 640], ["Abr", 0.38, 0.39, 420], ["Jul", 0.52, 0.50, 200], ["Oct", 0.82, 0.76, -20]];

export default () => {
  const t = useSeconds();
  const g = useSay("ganó"), e = useSay("esperaban");
  const cam = between({ rx: 62, rz: -36, x: 0, y: 260, z: -560, oy: 90 }, { rx: 60, rz: -28, x: 0, y: 160, z: -440, oy: 90 }, glide(prog(t, 0, 7)));
  return (
    <Frame world={<World cam={cam}><Road />
      {Q.map(([m, eps, c, y], i) => (
        <React.Fragment key={m}>
          <Block y={y} h={EPS(eps)} kind={i === 3 ? "hot" : "past"} grow={i === 3 ? ease(prog(t, g - 0.2, 1.2)) : 1}
            top={<div className="val" style={{ fontSize: 40 }}>{eps.toFixed(2).replace(".", ",")}</div>} label={m} />
          <Bar y={y} h={EPS(c)} w={190} d={175} opacity={i === 3 ? ease(prog(t, e - 0.2, 0.6)) : 0.45} />
        </React.Fragment>
      ))}
      <Today y={-190} side="left" />
    </World>}>
      <Head kick="Gap · el trimestre"><h1 className="mid">Gana <Hi say="ochenta">0,82 $</Hi> por acción</h1></Head>
      <Card say={e} style={{ left: 72, top: 1130, width: 560, padding: "12px 22px" }}>
        <div className="line"><span>Gap, trimestre a octubre</span><b className="up">0,82 $</b></div>
        <div className="line"><span>Consenso</span><b>0,76 $</b></div>
      </Card>
      <Src>Beneficio por acción ajustado y consenso, trimestres a enero, abril, julio y octubre de 2026: Nasdaq (Zacks); 0,82 $: Gap, 8-K del 19-11-2026.</Src>
    </Frame>
  );
};
