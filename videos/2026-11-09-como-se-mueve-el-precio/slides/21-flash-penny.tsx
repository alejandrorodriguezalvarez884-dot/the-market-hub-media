// With nobody waiting on the other side: shares sold at one cent, others bought at 100,000 dollars, and over 20,000 trades cancelled afterwards
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BG, Board, Card, DIM, FG, FULL, GLASS, HAIR, Head, Hi, SELL, Side, Src, Stage, Svg, clamp, ease, es, prog, tone } from "./look/libro";

const COLS = 20, LINES = 3;

/** A price tag, as on a parcel: a point with its hole and string on the left, the figure inside. */
const PriceTag: React.FC<{ x: number; y: number; w: number; h: number; side: Side; label: string; figure: string; at: number; fig: number; phase: number }> = ({ x, y, w, h, side, label, figure, at, fig, phase }) => {
  const t = useSeconds();
  const c = tone(side);
  const p = ease(prog(t, at, 0.55)), f = ease(prog(t, fig, 0.45));
  if (p <= 0) return null;
  const hx = x + 92, hy = y + h / 2;
  const sway = Math.sin(t * 0.9 + phase) * 0.7 + (1 - p) * -5;
  return (
    <g opacity={clamp(p * 1.6)} transform={`translate(0, ${((1 - p) * 30).toFixed(2)}) rotate(${sway.toFixed(3)}, ${hx}, ${hy})`}>
      <path d={`M ${hx} ${hy} C ${x + 40} ${hy - 70} ${x + 60} ${y + 12} ${x + 8} ${y + 10}`} fill="none" stroke={DIM} strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${x + 100} ${y} H ${x + w - 28} Q ${x + w} ${y} ${x + w} ${y + 28} V ${y + h - 28} Q ${x + w} ${y + h} ${x + w - 28} ${y + h} H ${x + 100} L ${x} ${hy} Z`} fill="#0c0e13" />
      <path d={`M ${x + 100} ${y} H ${x + w - 28} Q ${x + w} ${y} ${x + w} ${y + 28} V ${y + h - 28} Q ${x + w} ${y + h} ${x + w - 28} ${y + h} H ${x + 100} L ${x} ${hy} Z`} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={18} fill={BG} stroke={c} strokeWidth={4} />
      <text className="mono" x={x + 170} y={y + 92} fontSize={26} fill={c} letterSpacing="0.14em">{label}</text>
      <g opacity={clamp(f * 1.6)} transform={`translate(${x + 170}, ${y + 262}) scale(${(0.9 + 0.1 * f).toFixed(4)})`}>
        <text x={0} y={0} fontSize={128} fontWeight={700} fill={FG} letterSpacing="-0.03em">{figure}</text>
      </g>
      <text className="mono" x={x + 170} y={y + 336} fontSize={24} fill={DIM} letterSpacing="0.14em" opacity={f}>POR UNA ACCIÓN</text>
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const sold = useSay("vendieron"), cent = useSay("centavo"), bought = useSay("compraron"), top = useSay("cien mil"), void_ = useSay("anularon");
  return (
    <Board layout="full">
      <Head><h1>Sin nadie al otro lado, <Hi say="centavo">cualquier precio</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <PriceTag x={40} y={20} w={720} h={400} side="sell" label="SE VENDIERON A" figure={`${es(0.01, 2)} $`} at={sold} fig={cent} phase={0} />
          <PriceTag x={840} y={20} w={880} h={400} side="buy" label="SE COMPRARON A" figure={`${es(100000)} $`} at={bought} fig={top} phase={1.7} />
        </Svg>
        <Card say="más de" style={{ left: 0, top: 470, width: 1740, height: 220, padding: "26px 36px" }}>
          <span className="lab">Operaciones anuladas después</span>
          <span className="num mid">Más de {es(20000)}</span>
          {/* slips of the trades, struck out one after another */}
          <svg width={940} height={156} viewBox="0 0 940 156" style={{ position: "absolute", left: 764, top: 32 }}>
            {Array.from({ length: COLS * LINES }, (_, i) => {
              const cx = (i % COLS) * 47, cy = Math.floor(i / COLS) * 52;
              const s = ease(prog(t, void_ + i * 0.012, 0.25));
              return (
                <g key={i}>
                  <rect x={cx + 1} y={cy + 1} width={38} height={46} rx={7} fill={GLASS} stroke={HAIR} strokeWidth={1.5} opacity={1 - 0.45 * s} />
                  <line x1={cx + 9} x2={cx + 31} y1={cy + 15} y2={cy + 15} stroke={DIM} strokeWidth={2} strokeLinecap="round" opacity={0.7 - 0.4 * s} />
                  <line x1={cx + 9} x2={cx + 24} y1={cy + 25} y2={cy + 25} stroke={DIM} strokeWidth={2} strokeLinecap="round" opacity={0.7 - 0.4 * s} />
                  {s > 0 && <line x1={cx + 4} y1={cy + 44} x2={cx + 4 + 32 * s} y2={cy + 44 - 40 * s} stroke={SELL} strokeWidth={4} strokeLinecap="round" />}
                </g>
              );
            })}
          </svg>
        </Card>
      </Stage>
      <Src>SEC y CFTC, informe sobre el 6 de mayo de 2010.</Src>
    </Board>
  );
};
