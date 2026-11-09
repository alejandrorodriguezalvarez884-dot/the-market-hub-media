// The three indices at 15:47 in Spain, against Friday's close (Yahoo Finance, data/)
import React from "react";
import { Bar, Column, Count, Look, Reveal } from "@mh/kit";

const LINES = [
  { name: "Nasdaq 100", value: 2.24, w: 100, say: "nasdaq" },
  { name: "S&P 500", value: 1.5, w: 67, say: "quinientos" },
  { name: "Dow Jones", value: 1.3, w: 58, say: "dow" },
];

export default () => (
  <Look bg="tape" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker">A las 15:47 en España</Reveal>
      <Reveal as="h1" className="small">Todo <span className="y">sube</span></Reveal>
      <Reveal say="nasdaq" className="card">
        {LINES.map((l) => (
          <Reveal key={l.name} say={l.say} className="line">
            <span className="name">{l.name}</span>
            <Count className="fig g" to={l.value} decimals={2} prefix="▲ " suffix=" %" say={l.say} />
            <Bar w={l.w} tone="g" say={l.say} />
          </Reveal>
        ))}
        <p className="note">Frente al cierre del viernes · Yahoo Finance</p>
      </Reveal>
    </Column>
  </Look>
);
