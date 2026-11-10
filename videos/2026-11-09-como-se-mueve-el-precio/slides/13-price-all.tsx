// The few shares that changed hands price all the others: a hundred squares, fewer than two lit, and the last deal stamped on every one
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, DIM, FG, FULL, Head, Hi, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog, useIn } from "./look/libro";

const N = figures.nvda;
const DAYS = N.days as unknown as [string, number, number][];
const CLOSE = DAYS[DAYS.length - 1][1];
const COLS = 20, STEP = 86, SIDE = 72, X0 = 13, Y0 = 52;

export default () => {
  const t = useSeconds();
  const nobody = useIn("nadie"), last = useIn("último"), whole = useSay("ponen");
  const start = ease(prog(t, 0.15, 0.6));
  return (
    <Board layout="full">
      <Head><h1>Unos pocos ponen precio a la <Hi say="entera">empresa entera</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <text className="mono" x={X0} y={30} fontSize={20} fill={DIM} letterSpacing="0.14em">CADA CUADRO, UN 1 % DE LAS ACCIONES DE NVIDIA</text>
          {Array.from({ length: 100 }, (_, k) => {
            const col = k % COLS, row = Math.floor(k / COLS);
            const x = X0 + col * STEP, y = Y0 + row * STEP;
            const lit = clamp(N.turnover_pct - k) * start;
            const wash = ease(prog(t, whole + col * 0.035 + row * 0.05, 0.5));
            return (
              <g key={k}>
                <rect x={x} y={y} width={SIDE} height={SIDE} rx={12} fill={FG} fillOpacity={0.05 + 0.1 * wash} stroke="#fff" strokeOpacity={0.14 + 0.3 * wash} strokeWidth={1.5} />
                {lit > 0 && <rect x={x} y={y} width={SIDE * lit} height={SIDE} rx={lit > 0.95 ? 12 : 6} fill={ACC} style={glow("rgba(157,184,255,0.7)", 10)} />}
                {wash > 0 && lit < 1 && <text className="mono" x={x + SIDE / 2 + (lit > 0 ? 8 : 0)} y={y + SIDE / 2 + 6} textAnchor="middle" fontSize={lit > 0 ? 0 : 16} fill={FG} opacity={wash * 0.9}>{es(CLOSE, 2)}</text>}
              </g>
            );
          })}
          <text className="mono" x={X0} y={516} fontSize={22} fill={ACC} letterSpacing="0.12em" opacity={start}>CAMBIARON DE MANOS EL LUNES · {es(N.turnover_pct, 2)} %</text>
          <text className="mono" x={X0 + COLS * STEP - 14} y={516} textAnchor="end" fontSize={22} fill={FG} letterSpacing="0.12em" opacity={nobody}>LAS QUE NADIE VENDIÓ · {es(100 - N.turnover_pct, 2)} %</text>
          <Tag x={270} y={612} w={520} h={68} size={27} tone="key" show={last}>ÚLTIMO TRATO · {es(CLOSE, 2)} $</Tag>
        </Svg>
        <Card say="entera" tone="key" style={{ left: 620, top: 548, width: 1120, padding: "18px 28px" }}>
          <span className="lab">El precio de la empresa entera</span>
          <span style={{ fontSize: 38, display: "block", lineHeight: 1.15, whiteSpace: "nowrap" }}>{es(CLOSE, 2)} $ × {es(N.shares / 1e6)} millones = <b>{es((CLOSE * N.shares) / 1e12, 1)} billones de dólares</b></span>
        </Card>
      </Stage>
      <Src>Cierre y volumen de Nvidia del 9 de noviembre de 2026: Yahoo Finance. Acciones en circulación: informe presentado a la SEC el 26 de agosto de 2026. La multiplicación es una cuenta propia.</Src>
    </Board>
  );
};
