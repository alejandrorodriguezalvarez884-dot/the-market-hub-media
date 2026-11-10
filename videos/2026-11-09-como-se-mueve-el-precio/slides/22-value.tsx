// Chapter 4 opens: why someone pays 100 and not 50. A share is a slice of a company, and whoever buys it pays for what that company will earn
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Card, Chapter, DIM, FG, Pulse, Stage, Svg, Tag, clamp, ease, prog } from "./look/libro";

// The works of look/libro.tsx (Firm), drawn here so that it can be cut into slices
const WORKS = "M -100 0 V -78 L -50 -112 V -78 L 0 -112 V -78 L 50 -112 V -78 H 100 V 0 Z";
const U = 2.3, X = 430, Y = 530; // 460 wide, the middle of its foot at (430, 530)
const CUTS = [-75, -50, -25, 0, 25, 50, 75];
const SLICE = 25; // the slice that is one share: from 25 to 50

export default () => {
  const t = useSeconds();
  const hundred = useSay("cien"), fifty = useSay("cincuenta"), share = useSay("acción"), slice = useSay("trozo");
  const a = ease(prog(t, hundred, 0.5)), b = ease(prog(t, fifty, 0.5));
  const firm = ease(prog(t, share, 0.7)), cut = ease(prog(t, slice - 0.3, 0.6)), lit = ease(prog(t, slice, 0.5));
  return (
    <Chapter n={4} title={<>Nadie sabe<br />cuánto vale</>}>
      <Stage>
        <Svg>
          <g opacity={clamp(a * 1.6)} transform={`translate(0, ${((1 - a) * 18).toFixed(2)})`}>
            <text className="mono" x={40} y={36} fontSize={22} fill={DIM} letterSpacing="0.14em">ALGUIEN PAGA</text>
            <text x={36} y={132} fontSize={100} fontWeight={700} fill={FG} letterSpacing="-0.03em">100 €</text>
          </g>
          <g opacity={clamp(b * 1.6)} transform={`translate(0, ${((1 - b) * 18).toFixed(2)})`}>
            <text className="mono" x={344} y={36} fontSize={22} fill={DIM} letterSpacing="0.14em">Y NO</text>
            <text x={340} y={132} fontSize={100} fontWeight={700} fill={DIM} letterSpacing="-0.03em">50 €</text>
            <text x={832} y={126} textAnchor="end" fontSize={50} fontWeight={700} fill={ACC} letterSpacing="-0.01em">¿por qué?</text>
          </g>
          <g transform={`translate(${X}, ${(Y + (1 - firm) * 22).toFixed(2)}) scale(${U})`}>
            <clipPath id="v22-works"><path d={WORKS} /></clipPath>
            <g opacity={firm} fill="none" stroke={FG} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
              <path d={WORKS} fill={FG} fillOpacity={0.08} />
              <path d="M 62 -78 V -150 H 88 V -78" />
            </g>
            <g clipPath="url(#v22-works)">
              <rect x={SLICE} y={-112} width={25} height={112} fill={ACC} opacity={0.92 * lit} />
              {CUTS.map((x) => (
                <line key={x} x1={x} x2={x} y1={0} y2={-112 * cut} stroke={FG} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 3.5" />
              ))}
            </g>
          </g>
          <Pulse x={X + (SLICE + 12.5) * U} y={Y - 45 * U} at={slice} size={90} color={ACC} />
          <line x1={X + (SLICE + 12.5) * U} x2={X + (SLICE + 12.5) * U} y1={Y + 8} y2={Y + 26} stroke={ACC} strokeWidth={3} strokeLinecap="round" opacity={lit} />
          <Tag x={X + (SLICE + 12.5) * U} y={Y + 54} w={320} h={54} size={21} show={lit}>1 ACCIÓN = 1 TROZO</Tag>
        </Svg>
        <Card say="compra" tone="key" style={{ left: 0, top: 644, width: 860 }}>
          Quien la compra paga por lo que la empresa <b>vaya a ganar</b>.
        </Card>
      </Stage>
    </Chapter>
  );
};
