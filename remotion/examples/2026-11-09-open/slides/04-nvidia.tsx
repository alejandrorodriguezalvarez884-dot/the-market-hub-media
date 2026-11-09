// Nvidia down 5.5 % at the open: its board investigates its CEO (Yahoo Finance)
import React from "react";
import { Column, Count, Logo, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="city" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker red">Pero el protagonista va al revés</Reveal>
      <Reveal as="h1" className="small"><Logo name="nvidia" big /> Nvidia <Count className="r" to={5.5} decimals={2} prefix="▼ " suffix=" %" say="cae" /></Reveal>
      <Reveal say="consejo" className="card down">
        <p className="label">¿Por qué?</p>
        <div className="line"><span className="name">Su consejo investiga a su jefe<small>Jensen Huang, consejero delegado</small></span></div>
        <p className="note">Acción: 176,37 $ a las 15:47 · Yahoo Finance</p>
      </Reveal>
    </Column>
  </Look>
);
