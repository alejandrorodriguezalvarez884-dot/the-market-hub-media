// With no news it does not stand still either: nobody knows what a company is worth, each does their sum
import React from "react";
import { Img } from "remotion";
import { logoUrl, useSay, useScene, useSeconds } from "@mh/kit";
import { DIM, FG, Board, Card, Head, Hi, Panel, Src, Stage, Svg, Tag, Who, clamp, ease, es, glow, prog } from "./look/libro";

// Nvidia minute by minute on 9 November 2026, 15:30 to 20:08 Spanish time, one close in three (data/, Yahoo Finance)
const NVDA = [171.80, 174.49, 174.42, 174.60, 175.33, 176.05, 177.23, 178.63, 177.84, 177.28, 177.82, 178.11, 178.35, 178.55, 179.45, 178.81, 178.66, 178.84, 178.23, 178.95, 179.43, 179.65, 178.85, 178.17, 178.36, 179.13, 178.51, 179.55, 179.02, 179.61, 179.09, 178.44, 176.64, 176.92, 176.21, 175.38, 176.30, 176.26, 176.00, 175.62, 175.01, 174.93, 174.62, 174.81, 175.28, 175.69, 176.68, 176.88, 176.73, 176.40, 176.23, 177.05, 177.03, 177.43, 177.62, 177.51, 177.41, 177.62, 177.45, 177.68, 177.92, 178.24, 178.03, 178.04, 177.89, 177.70, 177.71, 177.48, 177.21, 177.39, 177.00, 176.86, 176.69, 176.64, 176.61, 176.84, 176.56, 176.14, 176.32, 176.26, 175.91, 176.06, 176.27, 176.27, 176.74, 177.01, 177.16, 176.99, 176.95, 176.97, 176.77, 176.83, 176.57, 176.51];
const X = (i: number) => 34 + (i / (NVDA.length - 1)) * 690;
const Y = (v: number) => 384 + ((180.4 - v) / (180.4 - 171.2)) * 226;
const GUESS = [[100, 97, 103, 99, 104, 98], [102, 105, 99, 101, 96, 103], [98, 101, 95, 100, 97, 102], [104, 100, 102, 98, 103, 99]];

export default () => {
  const t = useSeconds();
  const { spoken } = useScene();
  const nobody = useSay("nadie");
  const drawn = clamp(prog(t, 0.1, Math.max(2, spoken - 0.7))) * (NVDA.length - 1);
  const i = Math.min(NVDA.length - 2, Math.floor(drawn)), f = drawn - i;
  const hx = X(i) + (X(i + 1) - X(i)) * f, hv = NVDA[i] + (NVDA[i + 1] - NVDA[i]) * f, hy = Y(hv);
  const line = NVDA.slice(0, i + 1).map((v, k) => `${X(k).toFixed(1)},${Y(v).toFixed(1)}`).concat(`${hx.toFixed(1)},${hy.toFixed(1)}`).join(" ");
  return (
    <Board>
      <Head><h1>Sin noticias,<br /><Hi say="tampoco">tampoco para</Hi></h1></Head>
      <Stage>
        <Svg>
          {[0, 1, 2, 3].map((k) => {
            const x = 110 + k * 213, every = 0.85, clock = Math.max(0, t - nobody - k * 0.18);
            const step = Math.floor(clock / every), fresh = 1 - clamp((clock % every) / 0.25);
            const bubble = ease(prog(t, nobody + k * 0.18, 0.35));
            return (
              <g key={k}>
                <Who x={x} y={204} r={42} side={k % 2 ? "sell" : "buy"} />
                <line x1={x} x2={x} y1={126} y2={154} stroke="#fff" strokeOpacity={0.3 * bubble} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
                <Tag x={x} y={92} w={168} h={60} size={27} tone={fresh > 0.5 ? "key" : undefined} show={bubble * (1 - fresh * 0.25)}>¿{GUESS[k][step % 6]} €?</Tag>
              </g>
            );
          })}
          <Panel y={290} h={340} />
          <text x={86} y={345} fontSize={34} fill={FG} letterSpacing="-0.01em">Nvidia</text>
          <text className="mono" x={830} y={342} textAnchor="end" fontSize={19} fill={DIM} letterSpacing="0.12em">9 NOV, MINUTO A MINUTO · 15:30 A 20:08 H</text>
          {[172, 174, 176, 178, 180].map((v) => <line key={v} x1={30} x2={830} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.07} strokeWidth={1.5} />)}
          <polyline points={line} fill="none" stroke={FG} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.6)", 10)} />
          <circle cx={hx} cy={hy} r={11} fill={FG} style={glow("rgba(255,255,255,0.8)", 12)} />
          <Tag x={Math.min(hx + 14, 752)} y={hy < 440 ? hy + 46 : hy - 46} w={156} h={46} size={22} tone="key">{es(hv, 2)} $</Tag>
        </Svg>
        <Img src={logoUrl("nvidia")} alt="Nvidia" style={{ position: "absolute", left: 28, top: 310, width: 44, height: 44 }} />
        <Card say="cambia" tone="key" style={{ left: 0, top: 656, width: 860 }}>
          Su precio cambió en <b>274 de 278 minutos</b>.
        </Card>
      </Stage>
      <Src>Los euros son un ejemplo inventado. Nvidia (NVDA), cierre de cada minuto del 9 nov 2026 hasta las 20:08 h de España: Yahoo Finance.</Src>
    </Board>
  );
};
