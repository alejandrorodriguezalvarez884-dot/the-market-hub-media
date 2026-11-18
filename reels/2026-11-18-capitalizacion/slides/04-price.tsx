// The example goes on: someone pays 6 € for one share; that is now the price of all 100, and the
// pizzeria is "worth" 600 €. Nobody put 100 € in. One column lights up, then all rise together.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Ej, Floor, Frame, Grid, Head, Hi, Num, World, between, glide, prog, ease } from "./look/torres";

export default () => {
  const t = useSeconds();
  const one = useSay("sola"), all = useSay("cien");
  const cam = between({ rx: 62, rz: -30, x: 0, y: 0, z: 40, oy: -130 }, { rx: 68, rz: -48, x: 0, y: 0, z: 90, oy: -110 }, glide(prog(t, 0, 10)));
  const up = ease(prog(t, all, 1.2));
  const lit = t >= all ? 100 : t >= one ? 1 : 0;
  return (
    <Frame world={<World cam={cam}><Floor />
      <Grid h={28 * (5 + up)} lit={lit} />
    </World>}>
      <Head kick="La idea"><h1 className="mid">Una venta pone el <Hi say="precio">precio</Hi> de todas</h1></Head>
      <Card say="sola" style={{ left: 72, top: 1110, width: 560, padding: "16px 24px" }}>
        <Ej />
        <div className="line"><span>Una acción, a</span><b className="y">6 €</b></div>
        <div className="line"><span>Capitalización</span><b className="y"><Num to={600} from={500} say={all} className="" style={{ color: "inherit" }} /> €</b></div>
      </Card>
      <Card say="Nadie" tone="key" style={{ left: 660, top: 1150, width: 320, padding: "14px 20px" }}>
        <span style={{ fontSize: 28 }}><b>+100 €</b> sin que entre un euro en la pizzería</span>
      </Card>
    </Frame>
  );
};
