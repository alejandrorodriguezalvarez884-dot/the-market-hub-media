// The board opens an investigation, and keeps Huang
import React from "react";
import { Drawing, Note, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={8} marks={["ok"]} step={[5]}>
    <Slug>Esc. 7 — Domingo 8 de noviembre — El consejo</Slug>
    <div className="with"><Drawing kind="board" ink="ok" say="consejo" /><h1>El consejo investiga</h1></div>
    <Note say="investigacion" mark="ok">Lo dirige un comité de consejeros independientes, con abogados de fuera.</Note>
    <Note say="motivos" mark="ok">«No tiene motivos para creer» que se comprometieran los secretos de Nvidia ni la seguridad nacional. Examinará toda la información.</Note>
    <Note say="secreto+0.3" mark="ok" src="Confirmado: comunicado del consejo de Nvidia, 8 nov (CNBC)">Huang sigue de consejero delegado. El consejo dice que confía en él.</Note>
  </Sheet>
);
