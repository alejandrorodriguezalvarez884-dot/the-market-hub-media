// The price in two parts: what each one thinks the company is worth, and what they think the others will pay tomorrow. The second one changes much faster
import React from "react";
import { useSay, useScene, useSeconds } from "@mh/kit";
import { ACC, Board, DIM, FG, Head, Hi, SOFT, Src, Stage, Svg, Tag, ease, glow, prog, useIn } from "./look/libro";

const COL = { x: 60, w: 240 }, BASE = 730;
const CALM = 300, HOT = 190, SWING = 100; // the two parts, and how far the second one goes each way

export default () => {
  const scene = useScene();
  const t = useSeconds();
  const part = useSay("parte"), other = useSay("otra"), others = useSay("demás"), fast = useSay("cambia");
  const price = useIn("precio"), mine = useIn("cada uno"), theirs = useIn("cree#2"), tag = useIn("mucho");
  const calm = ease(prog(t, part, 0.7)), hot = ease(prog(t, other, 0.7)), range = ease(prog(t, fast, 0.5));
  // It moves a little as soon as it is there, more when the others are named, and a lot at the end; then it rests
  const still = 1 - ease(prog(t, scene.spoken - 1.15, 0.5));
  const slow = 0.6 * Math.sin(t * 6.1) + 0.4 * Math.sin(t * 9.7 + 1.3), quick = 0.6 * Math.sin(t * 15) + 0.4 * Math.sin(t * 23 + 1);
  const move = (10 * ease(prog(t, other + 0.7, 0.6)) + 26 * ease(prog(t, others, 0.6))) * slow + (SWING - 36) * range * quick;
  const h = Math.max(HOT * hot + move * still, 0), floor = BASE - CALM * calm, top = floor - h;
  const lines = (y: number, a: string, b: string, color: string, show: number) => (
    <g opacity={show}>
      <line x1={COL.x + COL.w + 10} x2={COL.x + COL.w + 30} y1={y} y2={y} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <text className="mono" x={346} y={y - 8} fontSize={22} fill={color} letterSpacing="0.12em">{a}</text>
      <text className="mono" x={346} y={y + 22} fontSize={22} fill={color} letterSpacing="0.12em">{b}</text>
    </g>
  );
  return (
    <Board layout="flip">
      <Head><h1>El precio,<br />en <Hi say="parte">dos partes</Hi></h1></Head>
      <Stage>
        <Svg>
          <line x1={24} x2={836} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.3 * calm} strokeWidth={2} />
          <rect x={COL.x} y={floor} width={COL.w} height={Math.max(CALM * calm, 0.01)} rx={10} fill={FG} fillOpacity={0.12} stroke={FG} strokeOpacity={0.6} strokeWidth={2} opacity={Math.min(calm * 2, 1)} />
          {h > 0.5 && <rect x={COL.x} y={top} width={COL.w} height={h} rx={10} fill={ACC} style={glow("rgba(157,184,255,0.4)", 18)} />}
          <line x1={COL.x - 22} x2={COL.x + COL.w + 22} y1={top} y2={top} stroke={FG} strokeWidth={3.5} strokeLinecap="round" opacity={price} />
          <Tag x={COL.x + COL.w / 2} y={top - 42} w={210} h={50} size={21} tone="key" show={price}>EL PRECIO</Tag>
          {lines(BASE - CALM / 2, "LO QUE CADA UNO CREE", "QUE VALE LA EMPRESA", SOFT, mine)}
          {lines(BASE - CALM - 34, "LO QUE CREE QUE LOS DEMÁS", "PAGARÁN MAÑANA", ACC, theirs)}
          {/* How far the second part goes, up and down */}
          <g opacity={range} stroke={DIM} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={COL.x + COL.w + 8} x2={366} y1={BASE - CALM - HOT - SWING} y2={BASE - CALM - HOT - SWING} strokeDasharray="3 9" />
            <line x1={COL.x + COL.w + 8} x2={366} y1={BASE - CALM - HOT + SWING} y2={BASE - CALM - HOT + SWING} strokeDasharray="3 9" />
            <path d={`M 336 ${BASE - CALM - HOT - SWING + 14} V ${BASE - CALM - HOT + SWING - 14} M 326 ${BASE - CALM - HOT - SWING + 26} L 336 ${BASE - CALM - HOT - SWING + 14} L 346 ${BASE - CALM - HOT - SWING + 26} M 326 ${BASE - CALM - HOT + SWING - 26} L 336 ${BASE - CALM - HOT + SWING - 14} L 346 ${BASE - CALM - HOT + SWING - 26}`} stroke={ACC} />
          </g>
          <Tag x={600} y={BASE - CALM - HOT} w={420} h={58} size={21} tone="key" show={tag}>CAMBIA MUCHO MÁS DEPRISA</Tag>
        </Svg>
      </Stage>
      <Src>Esquema, sin cifras. La idea es de Keynes, Teoría general, 1936, capítulo 12.</Src>
    </Board>
  );
};
