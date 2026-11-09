// How she could have come close: as any customer does to its supplier (a hypothesis, in pencil)
import React from "react";
import { Reveal } from "@mh/kit";
import { Drawing, Note, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={4} marks={["maybe", "ok"]} step={[1]}>
    <Slug>Esc. 3 — Int. Una reunión — Lo que pudo pasar</Slug>
    <h1 className="mid">¿Cómo pudo acercarse?</h1>
    <Reveal say="como#2" how="rise" className="pencil">
      <span className="label">A lápiz · no confirmado</span>
      <div className="meet" style={{ marginTop: 12 }}>
        <div className="who"><Drawing kind="building" ink="pencil" say="como#2" />Cliente<small>Megaspeed, una directiva</small></div>
        <svg viewBox="0 0 120 40" style={{ width: 120, height: 40 }}><path d="M4 20 H116" style={{ fill: "none", stroke: "#9a958a", strokeWidth: 5, strokeDasharray: "10 9" }} /></svg>
        <div className="who"><Drawing kind="chip" ink="pencil" say="proveedor" />Proveedor<small>Nvidia, Jensen Huang</small></div>
      </div>
      <p className="hand small" style={{ marginTop: 12 }}>Reuniones como las de cualquier gran cliente con su proveedor.</p>
    </Reveal>
    <Note small say="contactos" mark="ok" src="Confirmado: Nvidia al New York Times, citada por TechCrunch">Nvidia: los contactos «no fueron inusuales», y no comparte información clasificada con sus clientes.</Note>
  </Sheet>
);
