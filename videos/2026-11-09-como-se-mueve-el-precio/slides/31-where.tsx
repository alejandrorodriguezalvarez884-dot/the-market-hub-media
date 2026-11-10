// Chapter 5 opens: it does not happen in one building. Eighteen exchanges, and the same share trades on all of them at once
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, BG, Chapter, DIM, FG, Pulse, SELL, Src, Stage, Svg, Tag, clamp, ease, glow, prog } from "./look/libro";

const N = figures.cboe.exchanges;
const CX = 430, CY = 372, RX = 356, RY = 282;
// Where each exchange sits: on an oval around the middle, the first at the top
const SPOT = (i: number): [number, number] => {
  const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
  return [CX + Math.cos(a) * RX, CY + Math.sin(a) * RY];
};

export default () => {
  const t = useSeconds();
  const house = useSay("edificio"), many = useSay("dieciocho"), same = useSay("misma"), all = useSay("todas");
  const built = ease(prog(t, house - 0.15, 0.6));
  const struck = ease(prog(t, house + 0.45, 0.4));
  const gone = ease(prog(t, many - 0.1, 0.5));
  const count = Math.round(N * prog(t, many, 1.0));
  const counted = ease(prog(t, many, 0.4)) * (1 - ease(prog(t, same - 0.25, 0.35)));
  const share = ease(prog(t, same, 0.5));
  const lit = ease(prog(t, all, 0.5));
  return (
    <Chapter n={5} title={<>Dónde<br />ocurre</>}>
      <Stage>
        <Svg>
          <g opacity={built * (1 - gone)} transform={`translate(${CX}, ${CY + 96})`} fill="none" stroke={FG} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
            <path d="M -190 -210 L 0 -310 L 190 -210 Z" fill={FG} fillOpacity={0.06} />
            <path d="M -170 -210 H 170 M -200 0 H 200 M -176 -28 H 176" />
            {[-132, -66, 0, 66, 132].map((x) => <path key={x} d={`M ${x} -196 V -42`} strokeWidth={22} strokeOpacity={0.5} />)}
            {struck > 0 && <path d={`M -230 -330 L ${(-230 + 460 * struck).toFixed(1)} ${(-330 + 360 * struck).toFixed(1)}`} stroke={SELL} strokeWidth={9} />}
          </g>
          {Array.from({ length: N }, (_, i) => {
            const [x, y] = SPOT(i);
            const p = ease(prog(t, many + (i / N) * 0.95, 0.45));
            const link = ease(prog(t, same + 0.15 + (i / N) * 0.5, 0.5));
            return (
              <g key={i}>
                {link > 0 && <line x1={CX} y1={CY} x2={CX + (x - CX) * link} y2={CY + (y - CY) * link} stroke={ACC} strokeOpacity={0.3 + 0.35 * lit} strokeWidth={2} strokeDasharray="2 8" strokeLinecap="round" />}
                <g transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${(0.5 + 0.5 * p).toFixed(3)})`} opacity={clamp(p * 1.6)} style={lit > 0 ? glow(`rgba(157,184,255,${(0.6 * lit).toFixed(3)})`, 14) : undefined}>
                  <rect x={-30} y={-30} width={60} height={60} rx={16} fill={BG} />
                  <rect x={-30} y={-30} width={60} height={60} rx={16} fill={ACC} fillOpacity={0.12 + 0.5 * lit} stroke={ACC} strokeOpacity={0.75} strokeWidth={2} />
                  <text className="mono" x={0} y={8} textAnchor="middle" fontSize={22} fill={lit > 0.5 ? BG : ACC}>{i + 1}</text>
                </g>
                <Pulse x={x} y={y} at={all + 0.05} size={56} color={ACC} />
              </g>
            );
          })}
          <g opacity={counted}>
            <text x={CX} y={CY + 44} textAnchor="middle" fontSize={190} fontWeight={700} fill={FG} letterSpacing="-0.04em">{count}</text>
            <text className="mono" x={CX} y={CY + 96} textAnchor="middle" fontSize={25} fill={DIM} letterSpacing="0.16em">BOLSAS EN EE. UU.</text>
          </g>
          <Tag x={CX} y={CY} w={330} h={76} size={27} tone="key" show={share}>LA MISMA ACCIÓN</Tag>
          <Tag x={CX} y={744} w={520} h={56} size={23} show={lit}>{N} BOLSAS, A LA VEZ</Tag>
        </Svg>
      </Stage>
      <Src>Cboe, volumen histórico del mercado de EE. UU.: {N} bolsas, en noviembre de 2026.</Src>
    </Chapter>
  );
};
