// The intelligence memo, as the New York Times reported it
import React from "react";
import { Drawing, Note, PenNote, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={5} marks={["press"]} step={[2]}>
    <Slug>Esc. 4 — Washington — Primavera de 2026</Slug>
    <div className="with"><Drawing kind="doc" say="informe" /><h1>Un informe de inteligencia</h1></div>
    <p className="fallnote">El papel es un dibujo hecho aquí: el informe no se ha publicado.</p>
    <Note say="reclut" mark="press">El Ministerio de Seguridad del Estado chino la reclutó para espiar a Huang.</Note>
    <Note say="relacion-0.6" mark="press" src="New York Times, citado por CNBC y TechCrunch, 7 y 8 nov">Y habla de una relación sentimental entre los dos.</Note>
    <PenNote say="relacion">Sin confirmar</PenNote>
  </Sheet>
);
