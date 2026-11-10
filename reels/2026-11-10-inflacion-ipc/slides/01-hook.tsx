// Hook: US consumer prices rose 0.4 % in October 2026, more than expected (0.3 %), and inflation has more than one measure
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, Panel, Src, Stage, Svg, Tag, ease, es, glow, prog } from "./look/libro";

// CPI, all items, change on the month, seasonally adjusted, January to October 2026 (data/fred-CPIAUCSL.csv; BLS)
const MONTHS: [string, number][] = [["E", 0.2], ["F", 0.3], ["M", 0.9], ["A", 0.6], ["M", 0.5], ["J", -0.4], ["J", 0.1], ["A", 0.4], ["S", 0.6], ["OCT", 0.4]];
const ZERO = 290, K = 170, X = (i: number) => 70 + i * 78;

export default () => {
  const t = useSeconds();
  const ways = useSay("formas");
  return (
    <Board>
      <Head><h1>Precios en EE. UU.:<br /><Hi>+0,4 %</Hi> en octubre</h1></Head>
      <Stage>
        <Svg>
          <Panel h={440} />
          <text className="mono" x={28} y={46} fontSize={21} fill={FG} letterSpacing="0.14em">IPC · CAMBIO DE CADA MES · 2026</text>
          <line x1={40} x2={830} y1={ZERO} y2={ZERO} stroke="#fff" strokeOpacity={0.45} strokeWidth={2} />
          {MONTHS.map(([m, v], i) => {
            const grow = ease(prog(t, 0.05 + i * 0.06, 0.45));
            const h = Math.abs(v) * K * grow, last = i === MONTHS.length - 1;
            return (
              <g key={i}>
                <rect x={X(i) - 22} y={v >= 0 ? ZERO - h : ZERO} width={44} height={h} rx={6}
                  fill={last ? FG : ACC} opacity={last ? 1 : 0.45} style={last ? glow("rgba(255,255,255,0.7)", 14) : undefined} />
                <text x={X(i)} y={v >= 0 ? ZERO - h - 12 : ZERO + h + 30} textAnchor="middle" fontSize={23} fill={last ? FG : DIM} opacity={grow}>{es(v, 1)}</text>
                <text className="mono" x={X(i)} y={420} textAnchor="middle" fontSize={22} fill={last ? FG : DIM}>{m}</text>
              </g>
            );
          })}
        </Svg>
        <Card style={{ left: 0, top: 466, width: 418 }} tone="key">
          <span className="lab">Octubre, en el mes</span>
          <span className="num" style={{ fontSize: 96 }}>+0,4 %</span>
        </Card>
        <Card say="previsto" style={{ left: 442, top: 466, width: 418 }}>
          <span className="lab">Se esperaba</span>
          <span className="num" style={{ fontSize: 96, color: DIM }}>+0,3 %</span>
        </Card>
        <Svg>
          {["IPC", "SUBYACENTE", "PCE", "PPI"].map((name, i) => (
            <Tag key={name} x={[109, 343, 577, 751][i]} y={728} w={[150, 270, 150, 150][i]} h={58} size={24}
              tone={i === 0 ? "key" : undefined} show={ease(prog(t, ways + i * 0.15, 0.35))}>{name}</Tag>
          ))}
        </Svg>
      </Stage>
      <Src>IPC de EE. UU., cambio mensual desestacionalizado, enero a octubre de 2026. BLS (publicado el 10 nov 2026, 14:30 h de España), vía FRED. Lo esperado: consenso de Dow Jones (CNBC).</Src>
    </Board>
  );
};
