// The light look: a card with lines and bars, and a company's logo
import React from "react";
import { Bar, Column, Count, Logo, Look, Reveal } from "@mh/kit";

export default () => (
  <Look look="light" bg="grid" brand="The Market Hub · Aprende">
    <Column>
      <Reveal as="p" className="kicker">Aspecto claro · muestra</Reveal>
      <h1 className="small">Una <span className="y">tarjeta</span>, una barra y un logotipo</h1>
      <Reveal say="tarjeta" className="card">
        <div className="line"><span className="name"><Logo name="nvidia" /> Nvidia<small>muestra</small></span><span className="fig g"><Count to={12.4} decimals={1} suffix=" %" say="barra" /></span><Bar w={72} tone="g" say="barra" /></div>
        <div className="line"><span className="name"><Logo name="apple" /> Apple<small>muestra</small></span><span className="fig r"><Count to={-3.1} decimals={1} suffix=" %" say="logotipo" /></span><Bar w={24} tone="r" say="logotipo" /></div>
      </Reveal>
    </Column>
  </Look>
);
