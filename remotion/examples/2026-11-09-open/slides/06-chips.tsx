// Its rivals up: AMD, Broadcom and the chip index at 15:47 (Yahoo Finance)
import React from "react";
import { Column, Logo, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="candles" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker green">¿Y quién gana?</Reveal>
      <Reveal as="h1" say="rivales" className="small">Sus <span className="y">rivales</span></Reveal>
      <Reveal say="amd" className="card up">
        <Reveal say="amd" className="line"><span className="name"><Logo name="amd" /> AMD</span><span className="fig g">▲ 7,9 %</span></Reveal>
        <Reveal say="broadcom" className="line"><span className="name"><Logo name="broadcom" /> Broadcom</span><span className="fig g">▲ 6,2 %</span></Reveal>
        <Reveal say="indice" className="line"><span className="name">Semiconductores (SOX)</span><span className="fig g">▲ 3,5 %</span></Reveal>
        <p className="note">A las 15:47 en España · Yahoo Finance</p>
      </Reveal>
    </Column>
  </Look>
);
