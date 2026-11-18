// Nvidia's share price: daily closes from 3 August to 17 November 2026 (Yahoo Finance,
// data/nvda-closes.json); the high, $239.24 on 6 October; $155.46 on 17 November (−35.0 %). Before the
// open on 18 November, at 11:44 in Spain: $160.70, +3.4 % on Tuesday's close (data/premarket.json).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, DOWN, Floor, Frame, Head, Hi, ICE, Src, UP, World, between, ease, glide, prog } from "./look/nave";
import closes from "../data/nvda-closes.json";

const PRE = 160.7;
const W = 760, H = 360, LO = 140, HI = 250;

export default () => {
  const t = useSeconds();
  const up = useSay("sube"), oct = useSay("octubre");
  const cam = between({ rx: 66, rz: -20, x: 0, y: 0, z: -200, oy: 300 }, { rx: 62, rz: -30, x: 0, y: 0, z: -120, oy: 320 }, glide(prog(t, 0, 8)));
  const n = closes.length;
  const X = (i: number) => (i / n) * (W - 40);
  const Y = (c: number) => H - ((c - LO) / (HI - LO)) * H;
  const drawn = ease(prog(t, 0.1, 2.2));
  const shown = Math.max(2, Math.round(drawn * n));
  const pts = closes.slice(0, shown).map((r, i) => `${X(i).toFixed(1)},${Y(r.c).toFixed(1)}`).join(" ");
  const top = closes.reduce((a, r, i) => (r.c > closes[a].c ? i : a), 0);
  const mark = ease(prog(t, oct, 0.6)), dot = ease(prog(t, up, 0.6));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} /></World>}>
      <Head kick="Nvidia en bolsa"><h1>Rebote <Hi say="sube" tone="up">pequeño</Hi>, caída <Hi say="perdido" tone="down">grande</Hi></h1></Head>
      <Card style={{ left: 72, top: 640, width: 840, padding: "22px 28px 18px" }}>
        <span className="lab">Cierre diario · dólares por acción</span>
        <svg width={W} height={H + 30} viewBox={`0 -10 ${W} ${H + 30}`} style={{ display: "block", overflow: "visible" }}>
          {[150, 200, 250].map((v) => (
            <g key={v}>
              <line x1={0} x2={W} y1={Y(v)} y2={Y(v)} stroke="rgba(255,255,255,0.1)" />
              <text x={W} y={Y(v) - 6} textAnchor="end" fontSize={20} fill="#8a96a8">{v}</text>
            </g>
          ))}
          <polyline points={pts} fill="none" stroke={ICE} strokeWidth={4} strokeLinejoin="round" />
          {shown > top && (
            <g opacity={mark}>
              <circle cx={X(top)} cy={Y(closes[top].c)} r={8} fill={DOWN} />
              <text x={X(top) + 14} y={Y(closes[top].c) - 6} fontSize={24} fill="#ffc4bd">6 oct · 239,24</text>
            </g>
          )}
          <g opacity={dot}>
            <line x1={X(n - 1)} y1={Y(closes[n - 1].c)} x2={X(n)} y2={Y(PRE)} stroke={UP} strokeWidth={4} strokeDasharray="6 6" />
            <circle cx={X(n)} cy={Y(PRE)} r={8} fill={UP} />
          </g>
        </svg>
      </Card>
      <Card say={up} tone="up" style={{ left: 72, top: 1130, width: 400 }}>
        <span className="lab">Hoy, antes de abrir</span>
        <span className="num sm">▲ 3,4 %</span>
        <small>160,70 $ a las 11:44 de España</small>
      </Card>
      <Card say={oct} tone="down" style={{ left: 500, top: 1130, width: 412 }}>
        <span className="lab">Desde el 6 de octubre</span>
        <span className="num sm">▼ 35 %</span>
        <small>De 239,24 $ a 155,46 $</small>
      </Card>
      <Src>Yahoo Finance: cierres diarios del 3 de agosto al 17 de noviembre de 2026 y preapertura del 18 a las 11:44 de España, frente al cierre del 17.</Src>
    </Frame>
  );
};
