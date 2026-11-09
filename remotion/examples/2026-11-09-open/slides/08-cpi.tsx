// Tomorrow: October's CPI in the US (BLS calendar)
import React from "react";
import { Column, Look, Reveal } from "@mh/kit";

export default () => (
  <Look bg="city" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker">¿Y ahora?</Reveal>
      <Reveal as="h1" say="inflacion" className="small">Mañana, la <span className="y">inflación</span></Reveal>
      <Reveal say="manana" className="card amber">
        <p className="label">IPC de octubre en EE. UU.</p>
        <div className="line"><span className="name">Martes 10</span><span className="fig">14:30 en España</span></div>
        <div className="line"><span className="name">En Nueva York</span><span className="fig">8:30</span></div>
        <p className="note">Oficina de Estadísticas Laborales de EE. UU.</p>
      </Reveal>
      <Reveal say="semana" how="pop" className="sticker amber small">El dato de la semana</Reveal>
    </Column>
  </Look>
);
