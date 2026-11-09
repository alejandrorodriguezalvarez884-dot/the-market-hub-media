// Hook: Wall Street opens in green, Nvidia sinks (the daily reel of the open, as a pattern to copy)
import React from "react";
import { Column, Logo, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="grid" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker">Wall Street abre · lunes 9</Reveal>
      <Reveal as="h1" say="verde">Wall Street, en <span className="g">verde</span></Reveal>
      <Reveal say="hunde" how="pop" className="sticker"><Logo name="nvidia" /> Nvidia se hunde</Reveal>
      <Reveal say="contracorriente" how="pop" className="sticker tag">¿Por qué va a contracorriente?</Reveal>
    </Column>
  </Look>
);
