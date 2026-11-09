// Oil down: West Texas crude at 15:37 (Yahoo Finance, CL=F); Trump on Iran (TipRanks)
import React from "react";
import { Column, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="tape" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker sky">Mientras tanto</Reveal>
      <Reveal as="h1" say="petroleo" className="small">El petróleo <span className="y">baja</span></Reveal>
      <Reveal say="texas" className="card down">
        <Reveal say="texas" className="line"><span className="name">Barril de Texas (WTI)<small>A las 15:37 en España</small></span><span className="fig r">▼ 3,5 %</span></Reveal>
        <Reveal say="ochenta" className="line"><span className="name">Precio</span><span className="fig">87,64 $</span></Reveal>
        <p className="note">Futuro más cercano (CL=F) · Yahoo Finance</p>
      </Reveal>
      <Reveal say="trump" how="pop" className="sticker tag small">Trump: ¿más ataques a Irán? "Muy improbable"</Reveal>
    </Column>
  </Look>
);
