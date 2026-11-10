// Record results and the price falls that same day: it already counted on them and on something more. What moves it is the gap between what arrives and what was expected
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, DIM, FG, Head, Hi, SELL, SOFT, Src, Stage, Svg, Tag, clamp, ease, prog, useIn } from "./look/libro";

// Invented, with no figures: last year's results, this year's, and what the price had counted on
const BASE = 560;
const PREV = { x: 40, w: 150, h: 200 }, REAL = { x: 240, w: 170, h: 320 }, HOPE = { x: 460, w: 170, h: 410 };

export default () => {
  const t = useSeconds();
  const shows = useSay("presentar"), results = useSay("resultados"), fall = useSay("caer"), counted = useSay("contaba"), more = useSay("algo más");
  const record = useIn("récord"), gap = useIn("distancia");
  const a = ease(prog(t, shows, 0.5)), b = ease(prog(t, results, 0.6)), down = ease(prog(t, fall, 0.5));
  const c = ease(prog(t, counted, 0.7)), m = ease(prog(t, more, 0.6));
  const hope = REAL.h * c + (HOPE.h - REAL.h) * m;
  const under = (x: number, lines: string[], color: string, show: number) => (
    <g opacity={show}>
      {lines.map((s, i) => <text key={i} className="mono" x={x} y={BASE + 34 + i * 25} textAnchor="middle" fontSize={18} fill={color} letterSpacing="0.12em">{s}</text>)}
    </g>
  );
  return (
    <Board lean={-0.5 * ease(prog(t, fall, 1))}>
      <Head><h1>Resultados<br />récord, y el<br />precio <Hi tone="sell" say="caer">cae</Hi></h1></Head>
      <Stage>
        <Svg>
          <line x1={16} x2={664} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.3 * a} strokeWidth={2} />
          <rect x={PREV.x} y={BASE - PREV.h * a} width={PREV.w} height={Math.max(PREV.h * a, 0.01)} rx={9} fill={DIM} opacity={0.4 * clamp(a * 2)} />
          {under(PREV.x + PREV.w / 2, ["EL AÑO", "ANTERIOR"], DIM, a)}
          <rect x={REAL.x} y={BASE - REAL.h * b} width={REAL.w} height={Math.max(REAL.h * b, 0.01)} rx={9} fill={FG} opacity={clamp(b * 2)} />
          {under(REAL.x + REAL.w / 2, ["EL RESULTADO"], SOFT, b)}
          <Tag x={REAL.x + REAL.w / 2} y={BASE - REAL.h - 38} w={164} h={48} size={20} show={record}>RÉCORD</Tag>
          <Tag x={430} y={46} w={452} h={58} size={21} tone="sell" show={down}>EL PRECIO CAE ESE MISMO DÍA</Tag>
          {/* What the price had counted on: the results, and something more */}
          {c > 0 && (
            <g>
              <line x1={REAL.x + REAL.w + 8} x2={HOPE.x + HOPE.w} y1={BASE - REAL.h} y2={BASE - REAL.h} stroke="#fff" strokeOpacity={0.45 * c} strokeWidth={2} strokeDasharray="3 8" strokeLinecap="round" />
              <rect x={HOPE.x} y={BASE - REAL.h - (HOPE.h - REAL.h) * m} width={HOPE.w} height={Math.max((HOPE.h - REAL.h) * m, 0.01)} fill={SELL} opacity={0.3 * gap} />
              <rect x={HOPE.x} y={BASE - hope} width={HOPE.w} height={Math.max(hope, 0.01)} rx={9} fill={ACC} fillOpacity={0.1} stroke={ACC} strokeWidth={2.5} strokeDasharray="5 8" strokeLinecap="round" />
              <text className="mono" x={HOPE.x + HOPE.w / 2 + 1} y={BASE - REAL.h - (HOPE.h - REAL.h) / 2 + 7} textAnchor="middle" fontSize={18} fill={ACC} letterSpacing="0.12em" opacity={m}>ALGO MÁS</text>
            </g>
          )}
          {under(HOPE.x + HOPE.w / 2, ["LO QUE EL PRECIO", "YA CONTABA"], ACC, c)}
          <g opacity={gap} fill="none" stroke={SELL} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d={`M ${HOPE.x + HOPE.w + 12} ${BASE - HOPE.h} H ${HOPE.x + HOPE.w + 24} V ${BASE - REAL.h} H ${HOPE.x + HOPE.w + 12}`} />
          </g>
          <Tag x={764} y={BASE - REAL.h - (HOPE.h - REAL.h) / 2} w={186} h={46} size={18} tone="sell" show={gap}>LA DISTANCIA</Tag>
        </Svg>
        <Card say="mueve" tone="key" style={{ left: 0, top: 650, width: 860 }}>
          Lo que mueve el precio es <b>la distancia</b> entre lo que llega y lo que se esperaba.
        </Card>
      </Stage>
      <Src>Ejemplo inventado, sin cifras.</Src>
    </Board>
  );
};
