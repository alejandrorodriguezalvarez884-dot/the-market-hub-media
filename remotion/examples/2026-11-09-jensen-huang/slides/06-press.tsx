// The Times publishes, on 29 October and on 6 November; China denies it
import React from "react";
import { Reveal } from "@mh/kit";
import { Drawing, Hl, Note, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={6} marks={["press"]} step={[3, 4]}>
    <Slug>Esc. 5 — La redacción del Times — Octubre y noviembre</Slug>
    <div className="with"><Drawing kind="news" say="veintinueve" /><h1>Lo publica el Times</h1></div>
    <Reveal say="veintinueve" how="rise" className="date">
      <div className="d">29<small>octubre</small></div>
      <p className="hand small"><Hl say="veintinueve" mark="press">La directiva buscó acercarse a Huang para obtener información de la tecnología de Nvidia.</Hl><span className="src">New York Times, citado por Al Jazeera y Reuters</span></p>
    </Reveal>
    <Reveal say="seis" how="rise" className="date">
      <div className="d">6<small>noviembre</small></div>
      <p className="hand small"><Hl say="seis" mark="press">El Times publica el informe de inteligencia.</Hl><span className="src">CNBC, 8 nov</span></p>
    </Reveal>
    <Note small say="informe+0.2" mark="press" src="TechCrunch y Al Jazeera, 8 nov">La embajada china en Washington habla de «calumnias infundadas».</Note>
  </Sheet>
);
