// The compositions of a piece. render.mjs writes an entry for each piece (in its build/) that
// imports its scenes and registers makeRoot(scenes); the props come from Python.
import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { Film, FilmProps, Scenes } from "./Film";

const empty: FilmProps = { width: 1080, height: 1920, fps: 30, crossfade: 0, voiceFade: 0.06, total: 1, scenes: [] };

const metadata: CalculateMetadataFunction<FilmProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round(props.total * props.fps)),
  fps: props.fps,
  width: props.width,
  height: props.height,
});

/** The root of a piece, for registerRoot: its one composition, "Film", drawn with its scenes. */
export const makeRoot = (drawings: Scenes): React.FC => {
  const Bound: React.FC<FilmProps> = (props) => <Film {...props} drawings={drawings} />;
  return () => (
    <Composition id="Film" component={Bound} defaultProps={empty} calculateMetadata={metadata}
      durationInFrames={1} fps={30} width={1080} height={1920} />
  );
};
