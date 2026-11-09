// The investigation, as Yahoo Finance and TipRanks report it; China denies it (Bloomberg)
import React from "react";
import { Column, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="grid" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker">La investigación</Reveal>
      <Reveal as="h1" say="relacion" className="small">Una relación <span className="y">bajo sospecha</span></Reveal>
      <Reveal say="espia" className="card">
        <p className="label">Una empresaria que, según la inteligencia de EE. UU., es una espía china</p>
        <p className="note">Yahoo Finance y TipRanks, 9 de noviembre</p>
      </Reveal>
      <Reveal say="niega" how="pop" className="sticker tag small">China lo niega: "difamaciones" (Bloomberg)</Reveal>
      <Reveal say="siete" how="pop" className="sticker amber">Nvidia: casi el 7 % del S&amp;P 500</Reveal>
    </Column>
  </Look>
);
