// What comes next, and the question for the comments
import React from "react";
import { Reveal } from "@mh/kit";
import { Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={10} step={[7]}>
    <Slug>Esc. 9 — Próximamente</Slug>
    <div className="cal">
      <Reveal say="diecisiete" how="rise" className="day"><span>noviembre</span><b>17</b><p>Nvidia presenta los resultados de su tercer trimestre.<span className="src">TechCrunch</span></p></Reveal>
      <Reveal say="dieciocho" how="rise" className="day"><span>noviembre</span><b>18</b><p>Tres jefes de comisión de la Cámara le piden explicaciones a puerta cerrada. Nvidia no dice si irá.<span className="src">CNBC</span></p></Reveal>
    </div>
    <Reveal as="p" say="cuanto" how="rise" className="question">¿Cuánto pesa un jefe en una empresa así?</Reveal>
    <Reveal as="p" say="leo" how="fade" className="comment">Te leo en comentarios.</Reveal>
  </Sheet>
);
