// What is not known: did he know, and did anything reach China
import React from "react";
import { Reveal } from "@mh/kit";
import { Drawing, PenNote, Pencil, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={9} marks={["maybe", "press"]} step={[6]}>
    <Slug>Esc. 8 — Hoy — Lo que no se sabe</Slug>
    <div className="with"><Drawing kind="question" ink="pencil" small say="sabia" /><h1 className="mid">Lo que no se sabe</h1></div>
    <Reveal as="p" say="sabia" how="rise" className="ask">¿Lo sabía?</Reveal>
    <div className="pair">
      <Pencil small say="principio" label="Hipótesis A">No lo sabía.<span className="src">Al principio, los funcionarios lo creían así (TechCrunch)</span></Pencil>
      <Pencil small say="dudan" label="Hipótesis B">Lo sabía.<span className="src">Según el NYT (29 oct), algunos funcionarios dudan de que no lo supiera</span></Pencil>
    </div>
    <Reveal as="p" say="llego" how="rise" className="ask">¿Llegó algo a China?</Reveal>
    <Pencil small say="probado" label="Sin respuesta">Nadie lo ha probado.</Pencil>
    <PenNote say="probado">Nadie ha sido acusado</PenNote>
  </Sheet>
);
