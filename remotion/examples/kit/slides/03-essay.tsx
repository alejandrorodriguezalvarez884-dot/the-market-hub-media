// The essay look and the three marks: confirmed, reported by the press, a hypothesis
import React from "react";
import { Column, Confirmed, Hypothesis, Look, MarksKey, Reported, Reveal } from "@mh/kit";

export default () => (
  <Look look="essay" bg="grid" brand="The Market Hub · A fondo">
    <Column>
      <Reveal as="p" className="kicker">Ensayo · las tres marcas</Reveal>
      <MarksKey />
      <h1 className="small">Lo que se sabe, lo que se <span className="y">cuenta</span> y lo que se piensa</h1>
      <Confirmed say="confirmado" src="La empresa, en su comunicado (muestra)">Lo que confirma la empresa.</Confirmed>
      <Reported say="prensa" src="Un periódico, citado (muestra)">Lo que publica la prensa.</Reported>
      <Hypothesis say="hipotesis" src="Una lectura, no un hecho">Lo que pudo pasar.</Hypothesis>
    </Column>
  </Look>
);
