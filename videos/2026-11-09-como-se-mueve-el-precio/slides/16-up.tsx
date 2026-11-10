// Each deal one step higher, with those who wait raising their bids behind: the price is up 2 euros and the company has sold nothing more
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BG, BUY, Board, Card, DIM, FG, FULL, Firm, Head, Hi, Panel, Src, Stage, Svg, Tag, Who, clamp, ease, glow, prog, trace } from "./look/libro";

const X0 = 70, STEP = 290, LEVEL = [520, 370, 220];
const STAIR: [number, number][] = [[X0, 520], [X0 + STEP, 520], [X0 + STEP, 370], [X0 + 2 * STEP, 370], [X0 + 2 * STEP, 220], [X0 + 3 * STEP, 220]];
const TAKES = 1.8;

export default () => {
  const t = useSeconds();
  const deal = useSay("trato"), wait = useSay("esperaban"), two = useSay("dos euros");
  const drawn = prog(t, deal, TAKES);
  const { line, tip } = trace(STAIR, drawn);
  const rise = ease(prog(t, two, 0.7));
  return (
    <Board layout="full" lean={0.7 * ease(prog(t, deal, 1.5))}>
      <Head><h1>Cada trato, un <Hi tone="buy" say="escalón">escalón más arriba</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <Panel w={1080} h={690} />
          <text className="mono" x={40} y={58} fontSize={22} fill={DIM} letterSpacing="0.14em" opacity={ease(prog(t, deal, 0.5))}>EL PRECIO, TRATO A TRATO</text>
          {drawn > 0 && <polyline points={line} fill="none" stroke={FG} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={glow("rgba(157,184,255,0.55)", 10)} />}
          {drawn > 0 && drawn < 1 && <circle cx={tip[0]} cy={tip[1]} r={10} fill={FG} style={glow("rgba(255,255,255,0.7)", 12)} />}
          {LEVEL.map((y, i) => {
            const cx = X0 + STEP * (i + 0.5);
            const p = ease(prog(t, deal + (TAKES * (2 * i + 0.5)) / 5, 0.4));
            const w = ease(prog(t, wait + i * 0.25, 0.5));
            return (
              <g key={i}>
                <g opacity={clamp(w * 1.6)} transform={`translate(0, ${((1 - w) * 40).toFixed(2)})`}>
                  <Who x={cx - 82} y={y + 86} r={24} side="buy" />
                  <text className="mono" x={cx - 46} y={y + 94} fontSize={22} fill={BUY} letterSpacing="0.12em">PAGA {100 + i} €</text>
                </g>
                <g opacity={clamp(p * 1.6)} transform={`translate(${cx}, ${y}) scale(${(0.8 + 0.2 * p).toFixed(4)})`}>
                  <text className="mono" x={0} y={-46} textAnchor="middle" fontSize={20} fill={DIM} letterSpacing="0.14em">TRATO</text>
                  <rect x={-80} y={-31} width={160} height={62} rx={31} fill={FG} />
                  <text x={0} y={14} textAnchor="middle" fontSize={40} fontWeight={700} fill={BG} letterSpacing="-0.02em">{101 + i} €</text>
                </g>
              </g>
            );
          })}
          {/* from the first deal to the last: two euros */}
          <g opacity={clamp(rise * 2)}>
            <line x1={X0 + STEP + 20} x2={1010} y1={520} y2={520} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" />
            <line x1={1010} x2={1010} y1={520} y2={520 - 300 * rise} stroke={BUY} strokeWidth={5} strokeLinecap="round" />
            <line x1={990} x2={1030} y1={520} y2={520} stroke={BUY} strokeWidth={5} strokeLinecap="round" />
            <line x1={990} x2={1030} y1={520 - 300 * rise} y2={520 - 300 * rise} stroke={BUY} strokeWidth={5} strokeLinecap="round" />
          </g>
          <Tag x={1010} y={370} w={116} h={54} size={25} tone="buy" show={ease(prog(t, two + 0.4, 0.4))}>+2 €</Tag>
        </Svg>
        <Card say="dos euros" tone="buy" style={{ left: 1130, top: 0, width: 610, height: 270, padding: "30px 36px" }}>
          <span className="lab">El precio</span>
          <span className="num">+2 €</span>
          <small style={{ fontSize: 27 }}>de 101 a 103 €, en tres tratos</small>
        </Card>
        <Card say="empresa" style={{ left: 1130, top: 300, width: 610, height: 390, padding: "30px 36px" }}>
          <span className="lab">La empresa</span>
          <svg width={240} height={200} viewBox="0 0 240 200" style={{ position: "absolute", left: 32, top: 130 }}><Firm x={120} y={190} s={210} /></svg>
          <span className="num" style={{ position: "absolute", left: 310, top: 136 }}>+0</span>
          <small style={{ position: "absolute", left: 314, top: 262, width: 270, fontSize: 27 }}>productos vendidos de más</small>
        </Card>
      </Stage>
      <Src>Ejemplo inventado, en euros.</Src>
    </Board>
  );
};
