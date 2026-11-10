// Chapter 2 opens: an auction, but with two queues, one on each side, where everybody bids at once
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Chapter, Pulse, Stage, Svg, Tag, Who, BUY, SELL, clamp, ease, prog } from "./look/libro";

// Where each buyer stands in an ordinary auction (a crowd in front of one seller), and in the queue
const CROWD: [number, number][] = [[250, 500], [430, 452], [610, 500], [340, 624], [520, 624]];
const QX = (i: number) => 110 + i * 160;

export default () => {
  const t = useSeconds();
  const first = useSay("subasta"), queues = useSay("dos colas"), all = useSay("todos");
  const inn = ease(prog(t, first, 0.6));
  const q = ease(prog(t, queues, 0.9));
  const mix = (a: number, b: number) => a + (b - a) * q;
  return (
    <Chapter n={2} title={<>La subasta</>}>
      <Stage>
        <Svg>
          <line x1={40} x2={820} y1={390} y2={390} stroke="#fff" strokeOpacity={0.3 * q} strokeWidth={2} strokeDasharray="3 10" strokeLinecap="round" />
          {[0, 1, 3, 4].map((i, k) => {
            const p = ease(prog(t, queues + 0.15 + k * 0.1, 0.5));
            return <Who key={i} x={QX(i) + (1 - p) * 60} y={250} r={46} side="sell" opacity={clamp(p * 1.6)} />;
          })}
          <Who x={430} y={mix(210, 250)} r={mix(64, 46)} side="sell" opacity={clamp(inn * 1.6)} />
          {CROWD.map(([x, y], i) => (
            <Who key={i} x={mix(x, QX(i))} y={mix(y, 530)} r={46} side="buy" opacity={clamp(ease(prog(t, first + 0.15 + i * 0.07, 0.5)) * 1.6)} />
          ))}
          <Tag x={430} y={130} w={330} h={52} size={21} tone="sell" show={q}>VENDEDORES</Tag>
          <Tag x={430} y={650} w={330} h={52} size={21} tone="buy" show={q}>COMPRADORES</Tag>
          {[0, 1, 2, 3, 4].map((i) => <Pulse key={`s${i}`} x={QX(i)} y={250} at={all + i * 0.07} size={70} color={SELL} />)}
          {[0, 1, 2, 3, 4].map((i) => <Pulse key={`b${i}`} x={QX(i)} y={530} at={all + 0.04 + i * 0.07} size={70} color={BUY} />)}
        </Svg>
      </Stage>
    </Chapter>
  );
};
