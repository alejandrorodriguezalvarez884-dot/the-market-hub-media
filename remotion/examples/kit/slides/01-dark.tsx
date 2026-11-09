// The dark look (the portal's palette), the tape background, a sticker and a figure that counts
import React from "react";
import { Column, Count, Look, Mark, Reveal, Sparkline } from "@mh/kit";

export default () => (
  <Look look="dark" bg="tape" brand="The Market Hub · Ejemplo">
    <Column>
      <Reveal as="p" className="kicker">Aspecto oscuro · muestra</Reveal>
      <h1>Las cifras <Mark say="suben">suben</Mark>, <span className="r">bajan</span> y <span className="y">cuentan</span></h1>
      <Reveal say="bajan" how="pop" tilt={-3} className="sticker"><Count to={6.6} decimals={1} prefix="▼ " suffix=" %" say="bajan" /></Reveal>
      <Reveal say="cuentan" className="card">
        <span className="label">Cifras de muestra, no datos</span>
        <Sparkline values={[100, 103, 101, 106, 104, 109, 107, 112]} after={[105]} say="cuentan" labels={{ left: "muestra", right: "hoy" }} />
      </Reveal>
    </Column>
  </Look>
);
