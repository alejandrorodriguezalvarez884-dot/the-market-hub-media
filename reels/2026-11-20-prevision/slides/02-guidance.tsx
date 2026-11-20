// What guidance is: the road of quarters. Behind the line of today, the quarters already reported (solid);
// ahead, the ones the company forecasts (amber glass), which rise when "previsión" is said. Gap's reported
// adjusted EPS (Nasdaq/Zacks): 0.45, 0.38, 0.52, 0.82; the glass blocks are only a sign of the future.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Block, Card, Frame, Head, Hi, Road, Today, World, between, glide, prog, ease } from "./look/camino";

export default () => {
  const t = useSeconds();
  const pv = useSay("previsión"), mx = useSay("meses");
  const cam = between({ rx: 64, rz: -30, x: 0, y: 120, z: -520, oy: 60 }, { rx: 62, rz: -22, x: 0, y: -160, z: -420, oy: 60 }, glide(prog(t, 0, 9)));
  const g = (i: number) => ease(prog(t, pv - 0.1 + i * 0.25, 1.0));
  return (
    <Frame world={<World cam={cam}><Road />
      <Block y={640} h={160} label="Hace un año" />
      <Block y={420} h={140} />
      <Block y={200} h={190} />
      <Block y={-20} h={290} label="El último" />
      <Today y={-190} />
      <Block y={-380} h={230} kind="ahead" grow={g(0)} />
      <Block y={-600} h={250} kind="ahead" grow={g(1)} />
      <Block y={-820} h={270} kind="ahead" grow={g(2)} label="Lo que prevé" />
    </World>}>
      <Head kick="La palabra"><h1 className="mid">La <Hi say="previsión">previsión</Hi>: lo que la empresa espera</h1></Head>
      <Card say={mx} style={{ left: 72, top: 1130, width: 640, padding: "14px 24px" }}>
        <div className="line"><span>Ventas</span><b className="y">próximos meses</b></div>
        <div className="line"><span>Beneficio por acción</span><b className="y">próximos meses</b></div>
      </Card>
      <Card say="guidance" tone="key" style={{ left: 72, top: 1300, width: 420, padding: "12px 22px" }}>
        <span style={{ fontSize: 30 }}>En inglés, <span className="y"><b>guidance</b></span></span>
      </Card>
    </Frame>
  );
};
