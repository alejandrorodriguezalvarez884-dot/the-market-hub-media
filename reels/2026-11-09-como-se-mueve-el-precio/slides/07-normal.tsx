// Moving is the normal thing: since 1950 the S&P 500 has moved 1 % or more one day in five
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, DIM, FG, Board, Card, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

// The S&P 500's daily change, in %, in its last 30 sessions: 28 September to 6 November 2026 (data/, Yahoo Finance)
const DAYS = [-0.77, -0.17, -0.25, 0.19, 0.73, 0.66, 0.58, -0.22, -0.47, 0.59, -0.06, -0.02, -1.11, 0.33, -1.09, 0.41, 0.28, 0.58, -1.21, -0.52, 0.70, 0.60, 0.28, -0.30, -1.82, -0.51, 0.36, 1.58, -4.36, 0.31];
const ZERO = 172, K = 38;
const BIG = DAYS.map((d, i) => (Math.abs(d) >= 1 ? i : -1)).filter((i) => i >= 0);

export default () => {
  const t = useSeconds();
  const one = useSay("uno por"), five = useSay("uno de");
  const band = ease(prog(t, one - 0.3, 0.5));
  return (
    <Board>
      <Head><h1>Moverse es<br /><Hi say="normal">lo normal</Hi></h1></Head>
      <Stage>
        <Svg>
          <Panel h={384} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">S&amp;P 500 · ÚLTIMAS 30 SESIONES</text>
          <text className="mono" x={28} y={76} fontSize={19} fill={DIM} letterSpacing="0.12em">CAMBIO DE CADA DÍA · 28 SEP A 6 NOV 2026</text>
          <rect x={20} y={ZERO - K} width={820} height={K * 2} fill={FG} opacity={0.07 * band} />
          <line x1={20} x2={840} y1={ZERO - K} y2={ZERO - K} stroke={FG} strokeOpacity={0.35 * band} strokeWidth={1.5} strokeDasharray="4 7" />
          <line x1={20} x2={840} y1={ZERO + K} y2={ZERO + K} stroke={FG} strokeOpacity={0.35 * band} strokeWidth={1.5} strokeDasharray="4 7" />
          <text x={836} y={ZERO - K - 10} textAnchor="end" fontSize={22} fill={FG} opacity={band}>+1 %</text>
          <text x={836} y={ZERO + K + 28} textAnchor="end" fontSize={22} fill={FG} opacity={band}>−1 %</text>
          <line x1={20} x2={840} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          {DAYS.map((d, i) => {
            const grow = ease(prog(t, 0.15 + i * 0.035, 0.45));
            const h = Math.abs(d) * K * grow, x = 30 + i * 25;
            const big = BIG.indexOf(i);
            const lit = big < 0 ? 0 : ease(prog(t, one + big * 0.13, 0.35));
            return (
              <rect key={i} x={x} y={d >= 0 ? ZERO - h : ZERO} width={18} height={h} rx={4}
                fill={lit > 0.5 ? ACC : FG} opacity={lit > 0.5 ? 1 : big < 0 ? 0.3 : 0.6} style={lit > 0.5 ? glow("rgba(157,184,255,0.6)", 10) : undefined} />
            );
          })}
          <text className="mono" x={722} y={ZERO + 4.36 * K - 6} textAnchor="end" fontSize={20} fill={FG} letterSpacing="0.1em" opacity={ease(prog(t, 1.4, 0.4))}>5 NOV: −4,36 %</text>
          <Tag x={234} y={338} w={412} h={48} size={19} show={ease(prog(t, one + 0.9, 0.4))}>6 DE 30 SESIONES: ±1 % O MÁS</Tag>
        </Svg>
        <Card say={five} tone="key" style={{ left: 0, top: 408, width: 860 }}>
          <span className="lab">S&amp;P 500, desde 1950</span>
          <span className="num mid">1 de cada 5 días</span>
          <small>se movió un 1 % o más, arriba o abajo</small>
          <div style={{ position: "absolute", right: 26, top: 20, display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const inn = ease(prog(t, five + 0.15 + i * 0.08, 0.3));
              const on = i === 3 ? ease(prog(t, five + 0.7, 0.35)) : 0;
              return <i key={i} style={{ width: 30, height: 30, borderRadius: 8, opacity: inn, background: on > 0.5 ? "#07080b" : "rgba(7,8,11,0.16)", transform: `scale(${(0.6 + 0.4 * inn + on * 0.12).toFixed(3)})` }} />;
            })}
          </div>
        </Card>
        <Card say={five + 0.5} style={{ left: 0, top: 622, width: 860, padding: "12px 26px" }}>
          <div className="line"><span>Sesiones desde 1950</span><b>19.334</b></div>
          <div className="line"><span>Con un 1 % o más</span><b>4.034 · 20,9 %</b></div>
        </Card>
      </Stage>
      <Src>S&amp;P 500, cierres diarios del 3 de enero de 1950 al 6 de noviembre de 2026. Yahoo Finance, cálculo propio.</Src>
    </Board>
  );
};
