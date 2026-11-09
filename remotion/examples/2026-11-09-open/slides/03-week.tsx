// Last week: the indices down, the Nasdaq in correction on Thursday (TipRanks)
import React from "react";
import { Column, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="candles" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker red">La semana pasada</Reveal>
      <Reveal as="h1" say="semana" className="small">Una semana <span className="y">dura</span></Reveal>
      <Reveal say="perdio" className="card down">
        <div className="line"><span className="name">Nasdaq Composite</span><span className="fig r">▼ 3,4 %</span></div>
        <div className="line"><span className="name">S&amp;P 500</span><span className="fig r">▼ 2,7 %</span></div>
        <div className="line"><span className="name">Dow Jones</span><span className="fig r">▼ 0,9 %</span></div>
        <p className="note">Del 2 al 6 de noviembre · TipRanks</p>
      </Reveal>
      <Reveal say="correccion" how="pop" className="sticker small">Jueves 5: el Nasdaq, en corrección</Reveal>
      <Reveal say="vuelven" how="pop" className="sticker green">Hoy, los compradores vuelven</Reveal>
    </Column>
  </Look>
);
