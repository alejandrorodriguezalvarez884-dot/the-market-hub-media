// Keynes's newspaper contest, in our words: a hundred photos, the prize goes to whoever picks the six most voted, so you pick the ones you think the others will pick
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, FULL, HAIR, Head, Hi, Panel, Pulse, SOFT, Src, Stage, Svg, clamp, ease, glow, prog, useIn } from "./look/libro";

// The page of the paper: ten rows of ten photos. No one's face: a frame and a mark
const N = 10, PITCH = 60, SIZE = 52, GX = 34, GY = 78;
const TOP = [6, 22, 38, 54, 71, 87]; // the six most voted
const MINE = [13, 27, 40, 65, 69, 93]; // the six you like
const at = (i: number) => [GX + (i % N) * PITCH, GY + Math.floor(i / N) * PITCH] as const;

const Mark: React.FC<{ i: number; color: string; opacity: number }> = ({ i, color, opacity }) => {
  const [x, y] = at(i), r = 7 + ((i * 7) % 3), w = 14 + ((i * 5) % 4) * 1.5;
  return (
    <g transform={`translate(${x + SIZE / 2}, ${y + SIZE / 2})`} fill={color} opacity={opacity}>
      <circle cy={-7} r={r} />
      <path d={`M ${-w} 19 C ${-w} 4 ${w} 4 ${w} 19 Z`} />
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const paper = useIn("concurso"), keynes = useIn("Keynes"), year = useIn("mil"), wins = useIn("gana");
  const hundred = useSay("cien"), six = useSay("las seis"), like = useSay("gustan"), think = useSay("crees"), others = useSay("demás");
  const big = ease(prog(t, hundred, 0.5)), voted = ease(prog(t, six, 0.5));
  const mine = ease(prog(t, like, 0.4)) * (1 - 0.7 * ease(prog(t, think, 0.5)));
  return (
    <Board layout="full">
      <Head><h1>El concurso de periódico de <Hi say="Keynes">Keynes</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <g opacity={paper}>
            <Panel w={668} h={690} />
            <text className="mono" x={GX} y={48} fontSize={20} fill={SOFT} letterSpacing="0.14em">CONCURSO DE PERIÓDICO</text>
            <line x1={GX} x2={634} y1={62} y2={62} stroke={HAIR} strokeWidth={1.5} />
          </g>
          <text className="mono" x={634} y={48} textAnchor="end" fontSize={20} fill={DIM} letterSpacing="0.14em" opacity={big}>100 FOTOS</text>
          {Array.from({ length: N * N }, (_, i) => {
            const [x, y] = at(i), s = ease(prog(t, hundred + i * 0.008, 0.35));
            return (
              <g key={i} opacity={s}>
                <rect x={x} y={y} width={SIZE} height={SIZE} rx={9} fill="#fff" fillOpacity={0.055} stroke={HAIR} strokeWidth={1.5} />
                <Mark i={i} color={SOFT} opacity={0.42} />
              </g>
            );
          })}
          {MINE.map((i) => {
            const [x, y] = at(i);
            return <rect key={i} x={x - 4} y={y - 4} width={SIZE + 8} height={SIZE + 8} rx={12} fill="#fff" fillOpacity={0.1 * mine} stroke={FG} strokeOpacity={mine} strokeWidth={2.5} strokeDasharray="5 6" strokeLinecap="round" />;
          })}
          <g style={glow("rgba(157,184,255,0.5)", 12)}>
            {TOP.map((i, k) => {
              const [x, y] = at(i), p = ease(prog(t, six + k * 0.07, 0.4));
              return p > 0 ? (
                <g key={i} opacity={p}>
                  <rect x={x} y={y} width={SIZE} height={SIZE} rx={9} fill={ACC} />
                  <Mark i={i} color="#0c0e13" opacity={0.85} />
                </g>
              ) : null;
            })}
          </g>
          {TOP.map((i) => <Pulse key={i} x={at(i)[0] + SIZE / 2} y={at(i)[1] + SIZE / 2} at={others} size={54} color={ACC} />)}
          <text className="mono" x={724} y={60} fontSize={22} fill={DIM} letterSpacing="0.14em">
            <tspan fillOpacity={keynes}>LO CONTÓ KEYNES</tspan><tspan fillOpacity={year}> EN 1936</tspan>
          </text>
          <text x={718} y={220} fontSize={150} fontWeight={700} fill={FG} letterSpacing="-0.035em" opacity={clamp(big * 1.6)}>100 fotos</text>
          <text x={724} y={300} fontSize={44} fontWeight={600} letterSpacing="-0.01em">
            <tspan fill={SOFT} fillOpacity={wins}>Gana quien acierte </tspan><tspan fill={ACC} fillOpacity={voted}>las seis más votadas</tspan>
          </text>
        </Svg>
        <Card say="ganar" style={{ left: 724, top: 370, width: 1016, fontSize: 42 }}>
          No eliges las que te gustan <b>a ti</b>.
        </Card>
        <Card say="crees" tone="key" style={{ left: 724, top: 492, width: 1016, fontSize: 42 }}>
          Eliges las que crees que <b>elegirán los demás</b>.
        </Card>
      </Stage>
      <Src>John Maynard Keynes, Teoría general de la ocupación, el interés y el dinero, 1936, capítulo 12. Contado con nuestras palabras.</Src>
    </Board>
  );
};
