// Huang's email to staff, Sunday 8 November
import React from "react";
import { Reveal } from "@mh/kit";
import { Drawing, Note, Sheet, Slug, Typed } from "./look/storyboard";

export default () => (
  <Sheet n={7} marks={["ok"]} step={[5]}>
    <Slug>Esc. 6 — Domingo 8 de noviembre — El correo</Slug>
    <div className="with"><Drawing kind="mail" ink="ok" say="domingo" /><h1>El correo del domingo</h1></div>
    <Reveal say="escribe" how="rise" className="letter">
      <span className="pin" />
      <div className="meta">De: Jensen Huang · Para: la plantilla de Nvidia · Traducción propia</div>
      <Typed say="plantilla" takes={0.7}>«Fui infiel a mi mujer.»</Typed><br />
      <Typed say="mujer" takes={0.8}>«No hay excusa para lo que hice.»</Typed>
    </Reveal>
    <div className="pair">
      <Note small say="mujer+0.2" mark="ok">No la nombra.</Note>
      <Note small say="mujer+0.4" mark="ok">Sobre la seguridad nacional: el consejo abre una investigación.</Note>
    </div>
    <Reveal as="p" say="mujer+0.7" how="fade" className="fallnote">Confirmado: el correo, completo, en la CNBC (8 nov).</Reveal>
  </Sheet>
);
