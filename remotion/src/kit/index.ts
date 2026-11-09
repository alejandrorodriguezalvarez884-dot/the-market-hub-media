// Market Hub's kit for films drawn with Remotion. A scene is a React component, the default export
// of slides/<scene>.tsx in a reel's or a video's folder:
//
//   import { Look, Column, Reveal, Count, Mark, Logo, Confirmed } from "@mh/kit";
//   export default () => (
//     <Look look="dark" bg="tape">
//       <Column>
//         <Reveal as="p" className="kicker">Apertura · lunes 2</Reveal>
//         <h1>El petróleo <span className="y">se hunde</span></h1>
//         <Reveal say="seis" how="pop" tilt={-3} className="sticker"><Count to={6.6} decimals={1} prefix="▼ " suffix=" %" say="seis" /></Reveal>
//       </Column>
//     </Look>
//   );
//
// docs/remotion.md tells the rest.
export { useScene, useSay, useSeconds, useFilmSeconds, useProgress, when, later } from "./scene";
export type { SceneInfo, Word } from "./scene";
export { Reveal, Count, Mark, Bar, Type, From, useDrawn, entering } from "./motion";
export type { How } from "./motion";
export { Backdrop } from "./backdrop";
export type { Background, Tone } from "./backdrop";
export { Look, Column } from "./look";
export { Logo, logoUrl } from "./logo";
export { Confirmed, Reported, Hypothesis, MarksKey } from "./marks";
export { Sparkline } from "./chart";
