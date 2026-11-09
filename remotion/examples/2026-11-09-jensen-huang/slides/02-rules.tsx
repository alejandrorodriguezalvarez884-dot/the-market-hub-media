// The key: green is confirmed, yellow is the press, pencil is a hypothesis
import React from "react";
import { Note, PenNote, Pencil, Sheet, Slug } from "./look/storyboard";

export default () => (
  <Sheet n={2}>
    <Slug>Antes de rodar — La clave</Slug>
    <h1>Lo que pudo pasar</h1>
    <Note say="verde" mark="ok">Subrayado en verde: lo que confirman Nvidia o Huang.</Note>
    <Note say="amarillo" mark="press">En amarillo: lo que publican el New York Times, la CNBC y otros.</Note>
    <Pencil say="lapiz" label="A lápiz">Lo que pudo pasar. Hipótesis.</Pencil>
    <PenNote say="hechos">No son hechos</PenNote>
  </Sheet>
);
