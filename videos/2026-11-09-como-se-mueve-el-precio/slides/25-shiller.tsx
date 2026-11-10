// Shiller, 1981: a century of prices against the dividends paid afterwards. Prices had moved five to thirteen times more than those dividends justified
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, DIM, FG, Head, Hi, Lead, Panel, Src, Stage, Svg, clamp, ease, glow, prog, useIn } from "./look/libro";

const BASE = 628, U = 40; // the foot of the bars, and the height of "once"
const DIV = { x: 150, w: 210 }, PRICE = { x: 470, w: 210 };

export default () => {
  const t = useSeconds();
  const frame = useIn("siglo");
  const div = useSay("dividendos"), five = useSay("cinco"), thirteen = useSay("trece");
  const d = ease(prog(t, div, 0.6)), p5 = ease(prog(t, five, 0.7)), p13 = ease(prog(t, thirteen, 0.9));
  const low = 5 * U * p5, high = 8 * U * p13;
  const label = (x: number, y: number, a: string, b: string, show: number) => (
    <g opacity={show}>
      <text className="mono" x={x} y={y} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.12em">{a}</text>
      <text className="mono" x={x} y={y + 27} textAnchor="middle" fontSize={19} fill={DIM} letterSpacing="0.12em">{b}</text>
    </g>
  );
  return (
    <Board layout="flip">
      <Head>
        <h1>Los precios<br />se mueven<br /><Hi say="veces">de más</Hi></h1>
        <Lead say="Shiller">Robert Shiller, 1981: un siglo de precios frente a los dividendos que las empresas pagaron después.</Lead>
      </Head>
      <Stage>
        <Svg>
          <g opacity={frame}>
            <Panel h={760} />
            <text className="mono" x={36} y={54} fontSize={21} fill={DIM} letterSpacing="0.14em">CUÁNTO SE MOVIÓ CADA COSA</text>
            <line x1={36} x2={824} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} />
          </g>
          {/* What the dividends justified: once */}
          <rect x={DIV.x} y={BASE - U * d} width={DIV.w} height={Math.max(U * d, 0.01)} rx={8} fill={FG} opacity={0.9 * clamp(d * 2)} />
          <text x={DIV.x + DIV.w / 2} y={BASE - U - 22} textAnchor="middle" fontSize={64} fontWeight={700} fill={FG} letterSpacing="-0.02em" opacity={d}>×1</text>
          {label(DIV.x + DIV.w / 2, BASE + 40, "LO QUE JUSTIFICABAN", "LOS DIVIDENDOS", d)}
          {/* What prices did: five times, and up to thirteen */}
          {p13 > 0 && (
            <g>
              <rect x={PRICE.x} y={BASE - low - high} width={PRICE.w} height={Math.max(high, 0.01)} rx={8} fill={ACC} fillOpacity={0.22} stroke={ACC} strokeOpacity={0.9} strokeWidth={2} strokeDasharray="4 9" strokeLinecap="round" />
              <line x1={PRICE.x + PRICE.w + 14} x2={PRICE.x + PRICE.w + 40} y1={BASE - 13 * U} y2={BASE - 13 * U} stroke={ACC} strokeWidth={3} strokeLinecap="round" opacity={clamp((p13 - 0.8) * 5)} />
              <text x={PRICE.x + PRICE.w + 52} y={BASE - 13 * U + 22} fontSize={64} fontWeight={700} fill={ACC} letterSpacing="-0.02em" opacity={clamp((p13 - 0.6) * 2.5)}>×13</text>
            </g>
          )}
          {p5 > 0 && (
            <g>
              <rect x={PRICE.x} y={BASE - low} width={PRICE.w} height={Math.max(low, 0.01)} rx={8} fill={ACC} style={glow("rgba(157,184,255,0.45)", 16)} />
              <line x1={PRICE.x + PRICE.w + 14} x2={PRICE.x + PRICE.w + 40} y1={BASE - 5 * U} y2={BASE - 5 * U} stroke={FG} strokeWidth={3} strokeLinecap="round" opacity={clamp((p5 - 0.7) * 4)} />
              <text x={PRICE.x + PRICE.w + 52} y={BASE - 5 * U + 22} fontSize={64} fontWeight={700} fill={FG} letterSpacing="-0.02em" opacity={clamp((p5 - 0.5) * 2)}>×5</text>
            </g>
          )}
          {label(PRICE.x + PRICE.w / 2, BASE + 40, "LO QUE SE MOVIERON", "LOS PRECIOS", ease(prog(t, five - 0.2, 0.5)))}
        </Svg>
      </Stage>
      <Src>Robert Shiller, American Economic Review, 1981.</Src>
    </Board>
  );
};
