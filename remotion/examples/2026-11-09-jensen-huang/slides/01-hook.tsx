// Hook: Nvidia down before the open, the first trading day since Huang's email
import React from "react";
import { Img } from "remotion";
import { logoUrl } from "@mh/kit";
import { Note, Sheet, Slug } from "./look/storyboard";

// Nvidia's closes from 1 October to Friday 6 November, and the premarket at 13:40 (data/, Yahoo Finance)
const SPARK = "M10.0 53.4 L40.7 45.1 L71.5 31.7 L102.2 30.8 L133.0 35.6 L163.7 54.4 L194.4 57.6 L225.2 65.6 L255.9 59.7 L286.7 79.2 L317.4 90.1 L348.1 98.5 L378.9 90.5 L409.6 92.2 L440.4 77.4 L471.1 103.7 L501.9 107.1 L532.6 93.5 L563.3 88.2 L594.1 95.1 L624.8 99.8 L655.6 124.1 L686.3 131.1 L717.0 118.6 L747.8 136.3 L778.5 186.2 L809.3 172.6";

export default () => (
  <Sheet n={1} marks={["ok", "press"]} step={[6]}>
    <Slug>Esc. 1 — Hoy — Antes de la apertura</Slug>
    <h1 className="mid">El caso Jensen Huang</h1>
    <div className="with">
      <span className="tape"><Img src={logoUrl("nvidia")} alt="Nvidia" /></span>
      <div className="fall">−5,5 %</div>
    </div>
    <p className="fallnote">NVDA 176,30 $ a las 13:40 h de España, antes de abrir, frente al cierre del viernes (186,64 $). Yahoo Finance.</p>
    <svg className="spark" viewBox="0 0 960 240">
      <path className="line" d={SPARK} />
      <path className="pre" d="M809.3 172.6 L840.0 200.5" />
      <circle className="dot" cx="840" cy="200.5" r="13" />
      <text x="10" y="236">1 oct: 230,86 $</text>
      <text x="950" y="214" textAnchor="end">hoy</text>
    </svg>
    <div className="pair">
      <Note small say="infidelidad" mark="ok" src="Confirmado: su correo, 8 nov">Confiesa una infidelidad</Note>
      <Note small say="presunta" mark="press" src="Según la prensa">Con una presunta espía china</Note>
    </div>
  </Sheet>
);
