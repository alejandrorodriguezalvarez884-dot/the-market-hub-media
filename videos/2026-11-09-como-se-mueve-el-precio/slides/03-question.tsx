// The only thing that changed is the price, and nobody you would expect decides it: not a company, not a committee, not the exchange
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BG, Board, DIM, FG, Firm, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, clamp, ease, glow, prog } from "./look/libro";

const Row: React.FC<{ y: number; at: number; label: string; w: number; children: React.ReactNode }> = ({ y, at, label, w, children }) => {
  const t = useSeconds();
  const p = ease(prog(t, at, 0.5)), no = ease(prog(t, at + 0.6, 0.45));
  return (
    <g opacity={clamp(p * 1.6)} transform={`translate(${((1 - p) * -40).toFixed(2)}, 0)`}>
      <g opacity={1 - 0.5 * no}>
        <Panel y={y} h={150} r={40} />
        <g fill="none" stroke={FG} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">{children}</g>
        <text x={204} y={y + 94} fontSize={56} fill={FG} letterSpacing="-0.02em">{label}</text>
      </g>
      {no > 0 && <line x1={196} x2={196 + (w + 16) * no} y1={y + 77} y2={y + 77} stroke={SELL} strokeWidth={6} strokeLinecap="round" />}
      <Tag x={706} y={y + 75} w={250} h={56} size={21} tone="sell" show={no}>NO LO DECIDE</Tag>
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const price = useSay("precio"), firm = useSay("empresa"), board = useSay("comité"), market = useSay("bolsa");
  const p = ease(prog(t, price, 0.55));
  return (
    <Board layout="flip">
      <Head><h1>¿Quién decide<br />el <Hi say="precio">precio</Hi>?</h1></Head>
      <Stage>
        <Svg>
          <text className="mono" x={430} y={44} textAnchor="middle" fontSize={22} fill={DIM} letterSpacing="0.16em" opacity={p}>LO ÚNICO QUE HA CAMBIADO</text>
          <g transform={`translate(430, 132) scale(${(0.9 + 0.1 * p).toFixed(4)})`} opacity={clamp(p * 1.8)} style={glow("rgba(255,255,255,0.35)", 22)}>
            <rect x={-250} y={-58} width={500} height={116} rx={58} fill={FG} />
            <text x={0} y={22} textAnchor="middle" fontSize={64} fontWeight={700} fill={BG} letterSpacing="-0.03em">el precio</text>
          </g>
          <Row y={240} at={firm} label="Una empresa" w={318}>
            <Firm x={104} y={y0(240)} s={116} />
          </Row>
          <Row y={420} at={board} label="Un comité" w={262}>
            {[60, 104, 148].map((x) => (
              <g key={x}>
                <circle cx={x} cy={420 + 56} r={15} />
                <path d={`M ${x - 22} ${420 + 114} C ${x - 22} ${420 + 82} ${x + 22} ${420 + 82} ${x + 22} ${420 + 114}`} />
              </g>
            ))}
          </Row>
          <Row y={600} at={market} label="La bolsa" w={226}>
            <path d={`M 50 ${600 + 62} L 104 ${600 + 30} L 158 ${600 + 62} Z`} />
            {[68, 92, 116, 140].map((x) => <line key={x} x1={x} x2={x} y1={600 + 74} y2={600 + 108} />)}
            <line x1={50} x2={158} y1={600 + 120} y2={600 + 120} />
          </Row>
        </Svg>
      </Stage>
      <Src>El precio de una acción es el de su operación más reciente: Nasdaq, glosario, «Last sale».</Src>
    </Board>
  );
};

// The foot of the company's mark inside its row
function y0(row: number) {
  return row + 118;
}
