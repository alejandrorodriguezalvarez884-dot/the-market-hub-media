// TODO What this slide shows, and where its figures come from
// Drawn with Remotion (docs/remotion.md): the reel's look, drawn wide. Things come in when the
// voice says their cue (say="palabra"); what the scene is about in amber (className="y").
import React from "react";
import { Column, Look, Reveal } from "@mh/kit";

export default () => (
  <Look look="{{tone}}" bg="{{background}}" brand="The Market Hub · {{line}}">
    <Column>
      <Reveal as="p" className="kicker">TODO</Reveal>
      <div className="cols">
        <div>
          <Reveal as="h1">TODO <span className="y">TODO</span></Reveal>
        </div>
        <Reveal say="TODO" className="card">
          <p className="label">TODO</p>
        </Reveal>
      </div>
    </Column>
  </Look>
);
