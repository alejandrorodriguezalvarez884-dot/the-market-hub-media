// Chapter 7 opens with the objection: nobody knows what a company is worth and hurry moves the price, so is this a casino?
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Chapter, FG, Firm, Stage, Svg, Tag, Who, clamp, ease, glow, prog } from "./look/libro";
import { Chip } from "./look/marks";

export default () => {
  const t = useSeconds();
  const worth = useSay("vale"), hurry = useSay("prisa"), casino = useSay("casino");
  const w = ease(prog(t, worth, 0.55)), h = ease(prog(t, hurry, 0.5)), c = ease(prog(t, casino, 0.6));
  const beat = ((t * 1.7) % 1 + 1) % 1;
  return (
    <Chapter n={7} title={<>¿Un casino?</>}>
      <Stage>
        <Svg>
          <Tag x={215} y={150} w={410} h={54} size={20} show={w}>NADIE SABE CUÁNTO VALE</Tag>
          <Firm x={215} y={440} s={290} opacity={clamp(w * 1.6)} />
          <g opacity={clamp(h * 1.6)}>
            <circle cx={215} cy={556} r={40 + beat * 20} fill="none" stroke={BUY} strokeWidth={2.5} opacity={(1 - beat) * 0.7} />
            <g style={glow("rgba(52,227,161,0.6)", 14)}><Who x={215} y={556} r={36} side="buy" solid scale={0.6 + 0.4 * h} /></g>
          </g>
          <Tag x={215} y={654} w={410} h={54} size={20} tone="buy" show={h}>LA PRISA MUEVE EL PRECIO</Tag>
          <line x1={400} x2={400 + 100 * c} y1={400} y2={400} stroke="#fff" strokeOpacity={0.5} strokeWidth={3} strokeDasharray="2 11" strokeLinecap="round" />
          <g transform={`translate(650, 400) scale(${(0.86 + 0.14 * c).toFixed(4)}) rotate(${((1 - c) * -24).toFixed(2)})`} opacity={clamp(c * 1.6)}>
            <Chip x={0} y={0} r={150}>
              <text x={0} y={46} textAnchor="middle" fontSize={132} fontWeight={700} fill={FG}>?</text>
            </Chip>
          </g>
          <Tag x={650} y={654} w={300} h={60} size={26} tone="key" show={c}>¿UN CASINO?</Tag>
        </Svg>
      </Stage>
    </Chapter>
  );
};
