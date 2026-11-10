// The same big sale against two queues of buy orders: the full one barely moves the price, the thin one lets it sink
import React from "react";
import { useSay, useScene, useSeconds } from "@mh/kit";
import { BG, BUY, Board, DIM, FG, FULL, Head, Hi, Panel, SELL, Src, Stage, Svg, Who, clamp, ease, glow, prog } from "./look/libro";

const TOP = 110, ROW = 80, LEVELS = 6, SALE = 10;

/** A queue of buy orders, `depth` at each price from 100 € down, and a sale of ten that eats into it. */
const Book: React.FC<{ x: number; depth: number; title: string; verdict: string; show: number; lit: number; named: number; sale: number; takes: number; strong?: boolean }> = ({
  x, depth, title, verdict, show, lit, named, sale, takes, strong = false,
}) => {
  const t = useSeconds();
  const hit = (k: number) => sale + 0.35 + (k / SALE) * takes;
  const steps = Math.floor((SALE - 1) / depth);
  let drop = 0;
  for (let l = 1; l <= steps; l++) drop += ease(prog(t, hit(l * depth), 0.3));
  const y = TOP + ROW / 2 + drop * ROW;
  const frame = ease(prog(t, show, 0.5)), light = 0.4 + 0.6 * ease(prog(t, lit, 0.5));
  const seller = ease(prog(t, sale, 0.45)), done = ease(prog(t, hit(SALE) + 0.05, 0.4));
  if (frame <= 0) return null;
  return (
    <g opacity={frame * light}>
      <Panel x={x} w={840} h={690} />
      <text className="mono" x={x + 40} y={64} fontSize={24} fill={FG} letterSpacing="0.14em" opacity={ease(prog(t, named, 0.45))}>{title}</text>
      <g opacity={clamp(seller * 1.6)} transform={`translate(0, ${((seller - 1) * 24).toFixed(2)})`}>
        <Who x={x + 600} y={56} r={26} side="sell" solid />
        <text className="mono" x={x + 640} y={65} fontSize={24} fill={SELL} letterSpacing="0.12em">VENDE 10</text>
      </g>
      {Array.from({ length: LEVELS }, (_, l) => (
        <g key={l}>
          <text className="mono" x={x + 40} y={TOP + l * ROW + 49} fontSize={26} fill={DIM}>{100 - l} €</text>
          {Array.from({ length: depth }, (_, j) => {
            const k = l * depth + j;
            const p = ease(prog(t, show + 0.1 + l * 0.07 + j * 0.02, 0.4));
            const e = k < SALE ? prog(t, hit(k), 0.35) : 0;
            return (
              <g key={j} opacity={clamp(p * 1.6)}>
                <rect x={x + 170 + j * 50} y={TOP + l * ROW + 16} width={42} height={48} rx={10} fill={BUY} fillOpacity={0.16 * (1 - e)} stroke={BUY} strokeWidth={2} strokeOpacity={1 - 0.82 * e} />
                {e > 0 && e < 1 && <rect x={x + 170 + j * 50} y={TOP + l * ROW + 16} width={42} height={48} rx={10} fill={SELL} opacity={1 - e} />}
              </g>
            );
          })}
        </g>
      ))}
      {/* the last price, which follows the sale down the queue */}
      {drop > 0 && <line x1={x + 700} x2={x + 700} y1={TOP + ROW / 2} y2={y} stroke={SELL} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />}
      <g transform={`translate(${x + 700}, ${y.toFixed(2)})`}>
        <text className="mono" x={0} y={-42} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.14em">PRECIO</text>
        <rect x={-80} y={-30} width={160} height={60} rx={30} fill={FG} style={strong && drop > 0.5 ? glow("rgba(255,107,97,0.6)", 16) : undefined} />
        <text x={0} y={13} textAnchor="middle" fontSize={38} fontWeight={700} fill={BG} letterSpacing="-0.02em">{100 - Math.round(drop)} €</text>
      </g>
      <g opacity={done} transform={`translate(0, ${((1 - done) * 14).toFixed(2)})`}>
        <text x={x + 40} y={668} fontSize={84} fontWeight={700} fill={strong ? SELL : FG} letterSpacing="-0.03em">−{steps} €</text>
        <text className="mono" x={x + 250} y={660} fontSize={22} fill={strong ? SELL : DIM} letterSpacing="0.14em">{verdict}</text>
      </g>
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const end = useScene().spoken;
  const show = useSay("órdenes"), full = useSay("llena"), first = useSay("venta grande"), thin = useSay("medio");
  const second = Math.min(useSay("misma"), end - 1.9);
  return (
    <Board layout="full" lean={-0.8 * ease(prog(t, second, 1.2))}>
      <Head><h1>Cuánto baja depende de <Hi say="órdenes">la cola</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Book x={0} depth={8} title="COLA LLENA" verdict="EL PRECIO APENAS SE MUEVE" show={show} lit={show} named={full} sale={first} takes={0.9} />
          <Book x={900} depth={2} title="COLA MEDIO VACÍA" verdict="LA MISMA VENTA LO HUNDE" show={show} lit={thin} named={thin} sale={second} takes={0.7} strong />
        </Svg>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
