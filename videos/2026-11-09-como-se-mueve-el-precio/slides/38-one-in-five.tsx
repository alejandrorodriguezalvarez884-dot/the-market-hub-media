// One session in five: the index moved 1 % or more, up or down. Five days as tiles with one lit, and the counts behind it
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, BUY, Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, ease, es, prog } from "./look/libro";

const MOVES = figures.moves["1"];
const SESSIONS = figures.sessions, SHARE = figures.share_1pct;
const W = 156, H = 276, GAP = 20, LIT = 3;
// The quiet days: a short bar above or below the line, with no figure
const QUIET = [-20, 14, -9, 0, 17];

export default () => {
  const t = useSeconds();
  const one = useSay("una"), five = useSay("cinco"), pct = useSay("uno por"), up = useSay("arriba"), down = useSay("abajo");
  const lit = ease(prog(t, one, 0.5));
  const named = ease(prog(t, pct, 0.5));
  const rose = ease(prog(t, up - 0.1, 0.4)), fell = ease(prog(t, down - 0.4, 0.4));
  const count = ease(prog(t, five, 0.6));
  return (
    <Board layout="flip">
      <Head><h1><Hi say="una">Una</Hi> de<br />cada cinco</h1></Head>
      <Stage>
        <Svg>
          {QUIET.map((bar, i) => {
            const p = ease(prog(t, 0.1 + i * 0.07, 0.45));
            const x = i * (W + GAP), cx = x + W / 2, on = i === LIT ? lit : 0;
            return (
              <g key={i} opacity={p} transform={`translate(0, ${((1 - p) * 18).toFixed(2)})`}>
                <Panel x={x} w={W} h={H} r={24} />
                {on > 0 && <rect x={x} y={0} width={W} height={H} rx={24} fill={ACC} fillOpacity={0.16 * on} stroke={ACC} strokeWidth={2.5} strokeOpacity={on} />}
                {i !== LIT && <line x1={x + 30} x2={x + W - 30} y1={H / 2} y2={H / 2} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} />}
                {i !== LIT && <rect x={cx - 14} y={bar < 0 ? H / 2 : H / 2 - bar} width={28} height={Math.abs(bar)} rx={4} fill={FG} opacity={0.35} />}
                {i === LIT && (
                  <g>
                    <line x1={x + 30} x2={x + W - 30} y1={H / 2} y2={H / 2} stroke="#fff" strokeOpacity={0.3 * (1 - named)} strokeWidth={2} />
                    <text x={cx} y={H / 2 + 14} textAnchor="middle" fontSize={50} fontWeight={700} fill={FG} letterSpacing="-0.03em" opacity={named}>±1 %</text>
                    <text className="mono" x={cx} y={H / 2 + 48} textAnchor="middle" fontSize={19} fill={ACC} letterSpacing="0.16em" opacity={named}>O MÁS</text>
                    <path d={`M ${cx - 24} 78 L ${cx} 40 L ${cx + 24} 78 Z`} fill={BUY} opacity={rose} transform={`translate(0, ${((1 - rose) * 14).toFixed(2)})`} />
                    <path d={`M ${cx - 24} ${H - 62} L ${cx} ${H - 24} L ${cx + 24} ${H - 62} Z`} fill={SELL} opacity={fell} transform={`translate(0, ${((fell - 1) * 14).toFixed(2)})`} />
                  </g>
                )}
              </g>
            );
          })}
          <text className="mono" x={0} y={H + 28} fontSize={19} fill={DIM} letterSpacing="0.16em" opacity={ease(prog(t, 0.5, 0.5))}>CINCO SESIONES</text>
        </Svg>
        <Card say={five} tone="key" style={{ left: 0, top: 326, width: 860 }}>
          <span className="lab">Sesiones con ±1 % o más desde 1950</span>
          <span className="num" style={{ fontSize: 100 }}>{es(Math.round(MOVES.all * count))} <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.01em" }}>de {es(SESSIONS)}</span></span>
          <small>El {es(SHARE, 1)} % de todas las sesiones.</small>
        </Card>
        <Card say={up - 0.2} tone="buy" style={{ left: 0, top: 556, width: 418 }}>
          <span className="lab">Al alza</span>
          <span className="num" style={{ fontSize: 84 }}>{es(MOVES.up)}</span>
          <small>sesiones</small>
        </Card>
        <Card say={down - 0.5} tone="sell" style={{ left: 442, top: 556, width: 418 }}>
          <span className="lab">A la baja</span>
          <span className="num" style={{ fontSize: 84 }}>{es(MOVES.down)}</span>
          <small>sesiones</small>
        </Card>
      </Stage>
      <Src>Yahoo Finance, cierres diarios del {"S&P 500"} desde 1950; cuentas propias.</Src>
    </Board>
  );
};
