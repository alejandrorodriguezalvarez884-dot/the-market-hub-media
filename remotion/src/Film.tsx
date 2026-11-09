// A film: one scene after another, each the default export of its slides/<scene>.tsx, for as long
// as Python says (its narration and the silence after it), with its voice under it. Where the
// film dissolves (a reel's crossfade), each picture but the last is held `crossfade` seconds
// longer while the next fades in over it, so the voice keeps its time: the same film the ffmpeg
// montage (render.py, dissolve) made.
import React from "react";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneInfo, SceneProvider } from "./kit/scene";

export type FilmScene = SceneInfo & {
  voice: string | null;   // the narration's file in the public folder (the piece's voice/), or none yet
  sound: string | null;   // a sound made here (the countdown's tick), in the public folder
};

export type FilmProps = {
  width: number;
  height: number;
  fps: number;
  crossfade: number;      // seconds; 0 is a cut
  voiceFade: number;      // seconds a voice sinks to silence at its very end, where scenes dissolve
  total: number;          // seconds
  scenes: FilmScene[];
};

export type Scenes = Record<string, React.ComponentType>;

const frames = (seconds: number, fps: number) => Math.round(seconds * fps);

export const Film: React.FC<FilmProps & { drawings: Scenes }> = ({ scenes, crossfade, voiceFade, drawings }) => {
  const { fps } = useVideoConfig();
  const fade = frames(crossfade, fps);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {scenes.map((scene, i) => {
        const Drawing = drawings[scene.name];
        const from = frames(scene.start, fps);
        const held = frames(scene.start + scene.seconds, fps) - from + (i < scenes.length - 1 ? fade : 0);
        return (
          <Sequence key={scene.name} from={from} durationInFrames={held} name={scene.name}>
            <SceneProvider value={scene}>
              <Dissolve frames={i > 0 ? fade : 0}>{Drawing ? <Drawing /> : <Missing name={scene.name} />}</Dissolve>
            </SceneProvider>
          </Sequence>
        );
      })}
      {scenes.map((scene) => {
        const file = scene.voice || scene.sound;
        if (!file) return null;
        const from = frames(scene.start, fps);
        const end = scene.voice ? scene.spoken : scene.seconds;
        return (
          <Sequence key={`${scene.name}-sound`} from={from} durationInFrames={Math.max(1, frames(scene.seconds, fps))} name={`${scene.name} (sound)`}>
            <Html5Audio src={staticFile(file)} volume={(f) =>
              crossfade > 0 && scene.voice ? interpolate(f / fps, [end - voiceFade, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Dissolve: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames: n, children }) => {
  return n > 0 ? <FadeIn n={n}>{children}</FadeIn> : <>{children}</>;
};

const FadeIn: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(frame, [0, n], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

const Missing: React.FC<{ name: string }> = ({ name }) => {
  throw new Error(`no drawing for scene ${name} (slides/${name}.tsx)`);
};
