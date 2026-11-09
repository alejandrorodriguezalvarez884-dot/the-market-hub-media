// What a scene knows about itself: how long it lasts, when each word of its narration is said and
// where it falls in its film. Python works it out (src/marketmedia/remotion.py, from timing.py and
// the voice files) and hands it over as the film's props; Film.tsx puts each scene's part here.
import React, { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type Word = { word: string; at: number; end: number };

export type SceneInfo = {
  name: string;
  index: number;      // 0-based, in its film
  count: number;      // how many scenes the film has
  start: number;      // seconds into the film where it starts
  seconds: number;    // how long it is held (its narration and the silence after it)
  spoken: number;     // how long its narration lasts
  total: number;      // the whole film, in seconds
  words: Word[];      // when each word is said, from the start of the scene
};

const Scene = createContext<SceneInfo | null>(null);
export const SceneProvider = Scene.Provider;

export const useScene = (): SceneInfo => {
  const scene = useContext(Scene);
  if (!scene) throw new Error("a scene's component is drawn outside its film (Film.tsx)");
  return scene;
};

/** Seconds from the start of this scene. */
export const useSeconds = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Seconds into the whole film. */
export const useFilmSeconds = (): number => useScene().start + useSeconds();

const plain = (word: string) =>
  word.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Cues the narration never says: render.mjs reads these lines from the browser and reports them.
const told = new Set<string>();
const missing = (scene: string, cue: string) => {
  const key = `${scene}|${cue}`;
  if (told.has(key)) return;
  told.add(key);
  console.warn(`mh-missing ${scene} ${JSON.stringify(cue)}`);
};

/** When a cue is said, in seconds from the start of the scene, as theme/reel.js reads data-say:
 * a word of the narration ("petróleo"; accents and capitals do not matter, and the start of a word
 * is enough), several words a phrase, "#2" the second time it is said, "+0.3" or "-0.3" moves it,
 * and a plain number is seconds from the start. A cue the narration does not say is at 0, and
 * `make reel` warns about it. */
export const when = (scene: SceneInfo, cue: string | number | undefined): number => {
  if (cue === undefined || cue === "") return 0;
  const text = String(cue).trim();
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  const words = scene.words;
  if (!words.length) return 0;
  const [, phrase, nth, shift] = text.match(/^(.*?)(?:#(\d+))?([+-]\d+(?:\.\d+)?)?$/) || [];
  const wanted = (phrase || "").split(/[\s_]+/).map(plain).filter(Boolean);
  if (!wanted.length) return Math.max(0, Number(shift || 0));
  let left = Number(nth || 1);
  for (let n = 0; n + wanted.length <= words.length; n++) {
    if (wanted.every((w, k) => plain(words[n + k].word).startsWith(w)) && --left === 0) {
      return Math.max(0, words[n].at + Number(shift || 0));
    }
  }
  missing(scene.name, text);
  return 0;
};

/** A cue moved `seconds` later: "word" -> "word+0.05", "word+0.4" -> "word+0.45", 2 -> 2.05. */
export const later = (cue: string | number | undefined, seconds: number): string | number => {
  if (cue === undefined || cue === "") return seconds;
  const text = String(cue).trim();
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text) + seconds;
  const [, phrase, nth, shift] = text.match(/^(.*?)(#\d+)?([+-]\d+(?:\.\d+)?)?$/) || [];
  const moved = Math.round((Number(shift || 0) + seconds) * 1000) / 1000;
  return `${phrase}${nth || ""}${moved >= 0 ? "+" : ""}${moved}`;
};

/** When a cue of this scene is said, in seconds from its start. */
export const useSay = (cue: string | number | undefined): number => when(useScene(), cue);

/** The progress of something that starts at `cue` and takes `takes` seconds, from 0 to 1. */
export const useProgress = (cue: string | number | undefined, takes: number): number => {
  const at = useSay(cue);
  const t = useSeconds();
  return Math.min(1, Math.max(0, (t - at) / Math.max(takes, 1e-6)));
};

export const SceneFrame: React.FC<{ scene: SceneInfo; children: React.ReactNode }> = ({ scene, children }) => (
  <Scene.Provider value={scene}>{children}</Scene.Provider>
);
