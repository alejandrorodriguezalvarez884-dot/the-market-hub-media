// Cutler, Poterba and Summers, 1988: many of the days of biggest moves had no major news behind them, and economic news explained at most a third of what the market moved
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BUY, Board, DIM, FG, HAIR, Head, Hi, Lead, Panel, SELL, SOFT, Src, Stage, Svg, clamp, ease, glow, prog, useIn } from "./look/libro";

// A sketch, not data: seven big days, up or down, and whether a major piece of news was behind each
const DAYS = [{ v: 78, news: false }, { v: -84, news: true }, { v: 56, news: false }, { v: -70, news: false }, { v: 84, news: true }, { v: -60, news: false }, { v: 66, news: true }];
const ZERO = 170, SLOT = 300;
const X = (i: number) => 76 + i * 118;
const RING = { x: 170, y: 572, r: 118, w: 46 };
const TURN = 2 * Math.PI * RING.r;

export default () => {
  const t = useSeconds();
  const frame = useIn("buscaron");
  const days = useSay("días"), many = useSay("muchos"), none = useSay("ninguna"), third = useSay("tercio");
  const econ = useIn("económicas"), most = useIn("como mucho"), part = ease(prog(t, third, 0.8)), rest = ease(prog(t, third + 0.3, 0.5));
  return (
    <Board>
      <Head>
        <h1>Días grandes<br /><Hi say="ninguna">sin noticia</Hi></h1>
        <Lead say="tres">Cutler, Poterba y Summers, 1988: buscaron la noticia detrás de cada gran movimiento.</Lead>
      </Head>
      <Stage>
        <Svg>
          <g opacity={frame}>
            <Panel h={340} />
            <line x1={36} x2={824} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.28} strokeWidth={2} />
          </g>
          <text className="mono" x={36} y={50} fontSize={21} fill={DIM} letterSpacing="0.14em" opacity={ease(prog(t, days, 0.5))}>LOS DÍAS DE MÁS MOVIMIENTO</text>
          {DAYS.map((d, i) => {
            const g = ease(prog(t, days + i * 0.08, 0.5)), size = Math.abs(d.v) * g;
            const slot = ease(prog(t, days + 0.35 + i * 0.08, 0.4));
            const said = ease(prog(t, (d.news ? many : none) + i * 0.05, 0.4));
            const c = d.news ? SOFT : ACC;
            return (
              <g key={i}>
                <rect x={X(i) - 28} y={d.v > 0 ? ZERO - size : ZERO} width={56} height={Math.max(size, 0.01)} rx={7} fill={d.v > 0 ? BUY : SELL} opacity={0.9 * clamp(g * 2)} />
                <line x1={X(i)} x2={X(i)} y1={(d.v > 0 ? ZERO : ZERO - d.v) + 10} y2={SLOT - 23} stroke="#fff" strokeOpacity={0.3 * slot} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
                <rect x={X(i) - 54} y={SLOT - 17} width={108} height={34} rx={17} fill="none" stroke={HAIR} strokeWidth={1.5} strokeDasharray="3 6" opacity={slot * (1 - said)} />
                <g opacity={said}>
                  <rect x={X(i) - 54} y={SLOT - 17} width={108} height={34} rx={17} fill={d.news ? "#12151b" : ACC} fillOpacity={d.news ? 1 : 0.12} stroke={d.news ? HAIR : ACC} strokeWidth={1.5} strokeDasharray={d.news ? undefined : "4 5"} />
                  <text className="mono" x={X(i) + 1} y={SLOT + 5.5} textAnchor="middle" fontSize={15} fill={c} letterSpacing="0.1em">{d.news ? "NOTICIA" : "NINGUNA"}</text>
                </g>
              </g>
            );
          })}
          {/* How much of the market's movement the economic news explained */}
          <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="#fff" strokeOpacity={0.12 * econ} strokeWidth={RING.w} />
          {part > 0 && (
            <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={ACC} strokeWidth={RING.w} strokeDasharray={`${((TURN / 3) * part).toFixed(1)} ${TURN.toFixed(1)}`}
              transform={`rotate(-90 ${RING.x} ${RING.y})`} style={glow("rgba(157,184,255,0.45)", 16)} />
          )}
          <text x={RING.x} y={RING.y + 27} textAnchor="middle" fontSize={78} fontWeight={700} fill={FG} letterSpacing="-0.03em" opacity={clamp((part - 0.4) * 2.5)}>1/3</text>
          <text className="mono" x={362} y={470} fontSize={19} fill={DIM} letterSpacing="0.12em" opacity={econ}>LAS NOTICIAS ECONÓMICAS EXPLICABAN</text>
          <text x={358} y={548} fontSize={58} fontWeight={600} fill={SOFT} letterSpacing="-0.02em" opacity={most}>como mucho,</text>
          <text x={356} y={652} fontSize={100} fontWeight={700} fill={ACC} letterSpacing="-0.03em" opacity={clamp(part * 2)}>un tercio</text>
          <text className="mono" x={362} y={706} fontSize={19} fill={DIM} letterSpacing="0.12em" opacity={rest}>DE LO QUE SE MOVÍA LA BOLSA</text>
        </Svg>
      </Stage>
      <Src>Cutler, Poterba y Summers, «What Moves Stock Prices?», NBER, 1988. Las barras son un esquema.</Src>
    </Board>
  );
};
