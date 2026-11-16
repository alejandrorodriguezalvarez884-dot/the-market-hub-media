// What the "grade" is: earnings per share. A slab of a quarter's profit splits into one piece per share.
// No figures: a picture of the division.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { AMBER, AMBER2, Box, Card, Floor, Frame, Head, Hi, World, between, ease, glide, prog } from "./look/liston";

export default () => {
  const t = useSeconds();
  const split = useSay("repartido");
  const p = ease(prog(t, split, 1.6));
  const cam = between({ rx: 64, rz: 14, x: 0, y: 0, z: 0, oy: 260 }, { rx: 58, rz: -20, x: 0, y: 0, z: -40, oy: 260 }, glide(prog(t, 0, 9)));
  const N = 6, s = 70, gap = 10 + 46 * p;
  const pieces: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = (i - (N - 1) / 2) * (s + gap) - s / 2, y = (j - (N - 1) / 2) * (s + gap) - s / 2;
    const lift = p * 30 * ((i + j) % 2);
    pieces.push(<Box key={`${i}-${j}`} x={x} y={y} z={lift} w={s} d={s} h={60}
      faces={{ top: AMBER2, front: `linear-gradient(180deg, ${AMBER}, #c47800)`, side: "#a86500" }} />);
  }
  return (
    <Frame world={<World cam={cam}><Floor />{pieces}</World>}>
      <Head kick="La nota"><h1 className="mid">El <Hi say="BPA">beneficio por acción</Hi></h1></Head>
      <Card say="gana" tone="key" style={{ left: 72, top: 1190, width: 620, padding: "16px 26px" }}>
        <span className="lab">BPA</span>
        <span style={{ fontSize: 36 }}><b>Beneficio del trimestre</b> <span className="y">÷</span> <b>número de acciones</b></span>
      </Card>
    </Frame>
  );
};
