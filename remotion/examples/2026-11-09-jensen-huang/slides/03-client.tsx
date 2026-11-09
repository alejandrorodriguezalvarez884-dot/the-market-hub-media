// Megaspeed, Nvidia's biggest customer in Southeast Asia
import React from "react";
import { Drawing, Note, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={3} marks={["press", "ok"]} step={[1]}>
    <Slug>Esc. 2 — Ext. Singapur — Antes</Slug>
    <div className="with"><Drawing kind="building" say="megaspeed" /><h1>Un gran cliente</h1></div>
    <Note say="mayor" mark="press" src="TechCrunch, 8 nov, citando al New York Times"><b>Megaspeed</b>, una empresa de la nube de Singapur, es el mayor comprador de chips de Nvidia en el sudeste asiático.</Note>
    <Note say="washington" mark="press" src="CNBC, 8 nov">Estados Unidos sospecha que ayuda a China a esquivar las restricciones a la venta de chips.</Note>
    <Note small say="restricciones+0.4" mark="ok" src="CNBC, 8 nov">Nvidia: eso ya se investigó, según sus portavoces.</Note>
  </Sheet>
);
