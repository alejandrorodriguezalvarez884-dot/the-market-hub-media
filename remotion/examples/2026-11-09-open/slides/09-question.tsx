// The question for the comments, and when the next reel is
import React from "react";
import { Column, Look, Profile, Reveal } from "@mh/kit";

export default () => (
  <Look bg="plain" brand="The Market Hub · Apertura">
    <Column center>
      <Reveal as="p" className="kicker">¿Y tú qué crees?</Reveal>
      <Reveal as="h1" className="small">Esta semana, ¿qué pesa <span className="y">más</span>?</Reveal>
      <div className="answers"><Reveal say="rebote" how="pop" className="sticker green">¿El rebote?</Reveal></div>
      <div className="answers">
        <Reveal as="em" say="nvidia" how="fade">o</Reveal>
        <Reveal say="nvidia" how="pop" className="sticker">¿Nvidia?</Reveal>
      </div>
      <Reveal say="comentarios"><Profile>Te leo en comentarios</Profile></Reveal>
      <Reveal say="diez" how="pop" className="sticker amber small">A las 22:00, el cierre</Reveal>
    </Column>
  </Look>
);
