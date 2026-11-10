// Those earnings do not exist yet: each one does the sums and gets a different number. That is why there is a deal: the buyer at 100 thinks it is worth more, the seller less
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BUY, Board, DIM, FG, FULL, Head, Hi, SELL, SOFT, Src, Stage, Svg, Tag, Who, clamp, ease, prog } from "./look/libro";

// What each of six people thinks a share is worth, in euros (invented), and who ends up dealing at 100
const GUESS = [86, 91, 97, 104, 110, 115];
const X = (i: number) => 170 + i * 280;
const BUYER = 4, SELLER = 1;
// Earnings that have not happened: bars with no filling
const GHOST = [34, 48, 42, 60, 54, 72, 66, 84];

// Someone who has not taken a side yet
const Person: React.FC<{ x: number; y: number; r: number; opacity: number }> = ({ x, y, r, opacity }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <circle r={r} fill={FG} fillOpacity={0.07} stroke={SOFT} strokeOpacity={0.6} strokeWidth={2} />
    <circle cy={-r * 0.22} r={r * 0.25} fill={SOFT} />
    <path d={`M ${-r * 0.5} ${r * 0.56} C ${-r * 0.5} ${r * 0.1} ${r * 0.5} ${r * 0.1} ${r * 0.5} ${r * 0.56} Z`} fill={SOFT} />
  </g>
);

export default () => {
  const t = useSeconds();
  const yet = useSay("beneficios"), each = useSay("cada uno"), num = useSay("número"), deal = useSay("trato"), buys = useSay("compra"), sells = useSay("vende");
  const g = ease(prog(t, yet, 0.6)), d = ease(prog(t, deal, 0.6)), b = ease(prog(t, buys, 0.5)), s = ease(prog(t, sells, 0.5));
  const caption = ease(prog(t, num, 0.5));
  return (
    <Board layout="full">
      <Head><h1>A cada uno le sale un <Hi say="número">número distinto</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <g opacity={g}>
            <rect x={0} y={0} width={FULL.w} height={112} rx={30} fill={ACC} fillOpacity={0.04} stroke={ACC} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 12" strokeLinecap="round" />
            <text className="mono" x={44} y={66} fontSize={27} fill={ACC} letterSpacing="0.14em">LOS BENEFICIOS QUE VIENEN: TODAVÍA NO EXISTEN</text>
            {GHOST.map((h, i) => (
              <rect key={i} x={1250 + i * 56} y={98 - h} width={36} height={h} rx={6} fill="none" stroke={ACC} strokeOpacity={0.65} strokeWidth={2} strokeDasharray="3 7" strokeLinecap="round" />
            ))}
          </g>
          <text className="mono" x={4} y={152} fontSize={22} fill={DIM} letterSpacing="0.14em" opacity={caption}>LA CUENTA DE CADA UNO: CUÁNTO CREE QUE VALE LA ACCIÓN</text>
          <line x1={870} x2={870} y1={176} y2={500} stroke={FG} strokeOpacity={0.5 * d} strokeWidth={2.5} strokeDasharray="3 10" strokeLinecap="round" />
          {GUESS.map((v, i) => {
            const p = ease(prog(t, each + i * 0.09, 0.5)), n = ease(prog(t, num + i * 0.12, 0.5));
            const took = i === BUYER ? b : i === SELLER ? s : 0;
            const c = i === BUYER ? BUY : i === SELLER ? SELL : "#fff";
            return (
              <g key={i}>
                <g opacity={clamp(n * 1.6)} transform={`translate(0, ${((1 - n) * 16).toFixed(2)})`}>
                  <rect x={X(i) - 110} y={174} width={220} height={122} rx={34} fill={c} fillOpacity={0.055 + 0.1 * took} stroke={c} strokeOpacity={0.14 + 0.66 * took} strokeWidth={2} />
                  <text x={X(i)} y={259} textAnchor="middle" fontSize={68} fontWeight={700} fill={FG} letterSpacing="-0.03em">{v} €</text>
                  <line x1={X(i)} x2={X(i)} y1={306} y2={340} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
                </g>
                <Person x={X(i)} y={402} r={50} opacity={clamp(p * 1.6) * (1 - took)} />
                {took > 0 && <Who x={X(i)} y={402} r={50} side={i === BUYER ? "buy" : "sell"} solid opacity={took} scale={0.9 + 0.1 * took} />}
              </g>
            );
          })}
          <path d={`M ${X(BUYER)} 462 C ${X(BUYER)} 540, 1150 540, 1026 540`} fill="none" stroke={BUY} strokeWidth={3} strokeLinecap="round" opacity={b} />
          <path d={`M ${X(SELLER)} 462 C ${X(SELLER)} 540, 590 540, 714 540`} fill="none" stroke={SELL} strokeWidth={3} strokeLinecap="round" opacity={s} />
          <Tag x={870} y={540} w={300} h={62} size={27} tone="key" show={d}>TRATO · 100 €</Tag>
          <Tag x={X(BUYER)} y={640} w={560} h={58} size={21} tone="buy" show={b}>COMPRA A 100: CREE QUE VALE MÁS</Tag>
          <Tag x={X(SELLER)} y={640} w={560} h={58} size={21} tone="sell" show={s}>VENDE A 100: CREE QUE VALE MENOS</Tag>
        </Svg>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
