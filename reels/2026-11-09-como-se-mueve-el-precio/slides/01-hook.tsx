// Hook: the S&P 500 fell 4.36 % on Thursday and was 2.36 % up this Monday at 20:08. Who sets the price?
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BG, BUY, Board, Card, DIM, FG, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, Who, ease, glow, prog } from "./look/libro";

// The S&P 500's closes from 2 to 6 November 2026, and Monday 9 at 20:08 Spanish time (data/, Yahoo Finance)
const DAYS: [string, number][] = [["L 2", 7541.4], ["M 3", 7568.92], ["X 4", 7688.62], ["J 5", 7353.73], ["V 6", 7376.86], ["L 9", 7550.72]];
const X = (i: number) => 76 + i * 142;
const Y = (v: number) => 108 + ((7700 - v) / (7700 - 7340)) * 300;
const P = DAYS.map(([, v], i) => [X(i), Y(v)] as const);
const along = (u: number) => {
  const i = Math.min(P.length - 2, Math.floor(u)), f = u - i;
  return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f] as const;
};

export default () => {
  const t = useSeconds();
  const fell = useSay("cayó"), rose = useSay("lunes"), who = useSay("quién");
  const drop = prog(t, fell - 0.15, 0.4);
  const climb = ease(prog(t, rose, 1.1));
  const u = 2 + drop * drop + climb * 2;
  const [px, py] = along(u);
  const hit = t >= fell + 0.25 ? 1 - prog(t, fell + 0.25, 0.5) : 0;
  const leg = (a: number, b: number, color: string, soft: string) => (
    <line x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} stroke={color} strokeWidth={7} strokeLinecap="round" style={glow(soft, 12)} />
  );
  return (
    <Board lean={climb - drop * (1 - climb)}>
      <Head><h1 style={{ fontSize: 94 }}>¿Quién pone<br />el <Hi>precio</Hi>?</h1></Head>
      <Stage>
        <Svg>
          <Panel h={520} />
          <text x={30} y={62} fontSize={44} fill={FG} letterSpacing="-0.02em">S&amp;P 500</text>
          <text className="mono" x={30} y={96} fontSize={20} fill={DIM} letterSpacing="0.14em">2 A 9 NOV 2026</text>
          {DAYS.map(([day], i) => (
            <g key={day}>
              <line x1={X(i)} x2={X(i)} y1={120} y2={452} stroke="#fff" strokeOpacity={0.07} strokeWidth={1.5} />
              <text className="mono" x={X(i)} y={494} textAnchor="middle" fontSize={23} fill={i === 3 || i === 5 ? FG : DIM} letterSpacing="0.08em">{day}</text>
            </g>
          ))}
          <polyline points={P.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          {leg(2, 3, SELL, "rgba(255,107,97,0.6)")}
          {leg(4, 5, BUY, "rgba(52,227,161,0.6)")}
          {P.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={BG} stroke={FG} strokeWidth={3} />)}
          <circle cx={px} cy={py} r={16 + hit * 26} fill={FG} opacity={0.2} />
          <circle cx={px} cy={py} r={13} fill={FG} style={glow("rgba(255,255,255,0.8)", 14)} />
          {[0, 1, 2].map((i) => {
            const x = 62 + i * 124, y = 664;
            const ask = ease(prog(t, who + i * 0.12, 0.35));
            return (
              <g key={i}>
                <Who x={x} y={y} r={44} side={i === 1 ? "sell" : "buy"} />
                <Tag x={x + 40} y={y - 50} w={46} h={46} size={24} tone="key" show={ask}>?</Tag>
              </g>
            );
          })}
        </Svg>
        <Card bump="cayó+0.25" tone="sell" style={{ left: 36, top: 268, width: 330 }}>
          <span className="lab">Jueves 5 nov</span>
          <span className="num" style={{ fontSize: 78 }}>−4,36 %</span>
        </Card>
        <Card bump="lunes+0.9" tone="buy" style={{ left: 474, top: 22, width: 350 }}>
          <span className="lab">Lunes 9 · 20:08 h</span>
          <span className="num" style={{ fontSize: 78 }}>+2,36 %</span>
        </Card>
        <Card say="mismas" tone="key" style={{ left: 420, top: 596, width: 440, fontSize: 38 }}>
          <b>Mismas empresas.</b><br />Otro precio.
        </Card>
      </Stage>
      <Src>S&amp;P 500: cierres del 2 al 6 de noviembre de 2026 y dato de las 20:08 h de España del lunes 9, con la sesión abierta. Yahoo Finance.</Src>
    </Board>
  );
};
