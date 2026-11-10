// The brakes put in after 1987: a gauge of the day's fall in the S&P 500 that stops the whole market at 7 % and 13 % (15 minutes each) and ends the session at 20 %
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, BG, Board, DIM, FG, HAIR, Head, Hi, Lead, Panel, Pulse, SELL, Src, Stage, Svg, clamp, ease, glow, prog } from "./look/libro";

const TOP = 62, K = 32, COL = { x: 96, w: 104 };
const Y = (fall: number) => TOP + fall * K;
const MID = COL.x + COL.w / 2;
const smooth = (p: number) => p * p * (3 - 2 * p);

const Row: React.FC<{ fall: number; hit: number; told: number; title: string; note: string; end?: boolean }> = ({ fall, hit, told, title, note, end }) => {
  const t = useSeconds();
  const p = ease(prog(t, hit, 0.5)), q = ease(prog(t, told, 0.5));
  const y = Y(fall);
  if (p <= 0) return null;
  return (
    <g opacity={clamp(p * 1.6)}>
      <line x1={COL.x + COL.w + 4} x2={246} y1={y} y2={y} stroke={end ? SELL : FG} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
      <g transform={`translate(${((1 - p) * 36).toFixed(2)}, 0)`}>
        <Panel x={250} y={y - 62} w={610} h={124} r={32} />
        {end && <rect x={250} y={y - 62} width={610} height={124} rx={32} fill={SELL} fillOpacity={0.12 * q} stroke={SELL} strokeOpacity={0.7 * q} strokeWidth={2} />}
        <text x={280} y={y + 21} fontSize={58} fontWeight={700} fill={FG} letterSpacing="-0.03em">−{fall} %</text>
        <g opacity={q} transform={`translate(${((1 - q) * 14).toFixed(2)}, 0)`}>
          {end
            ? <rect x={460} y={y - 18} width={36} height={36} rx={7} fill={SELL} />
            : <g fill={ACC}><rect x={462} y={y - 20} width={12} height={40} rx={4} /><rect x={484} y={y - 20} width={12} height={40} rx={4} /></g>}
          <text x={522} y={y + 2} fontSize={35} fill={FG} letterSpacing="-0.01em">{title}</text>
          <text className="mono" x={522} y={y + 34} fontSize={18} fill={end ? SELL : DIM} letterSpacing="0.12em">{note}</text>
        </g>
      </g>
    </g>
  );
};

export default () => {
  const t = useSeconds();
  const falls1 = useSay("cae"), at7 = useSay("siete"), stop1 = useSay("para");
  const falls2 = useSay("cae#2"), at13 = useSay("trece"), stop2 = useSay("otros");
  const falls3 = useSay("cae#3"), at20 = useSay("veinte"), stop3 = useSay("sesión") - 0.3;
  const fall = 7 * smooth(prog(t, falls1, Math.max(0.4, at7 - falls1))) + 6 * smooth(prog(t, falls2, Math.max(0.4, at13 - falls2)))
    + 7 * smooth(prog(t, falls3, Math.max(0.4, at20 - falls3)));
  const gauge = ease(prog(t, falls1 - 0.5, 0.5));
  const y = Y(fall);
  const hit = [at7, at13, at20].reduce((most, at) => (t >= at ? Math.max(most, 1 - ease(prog(t, at, 0.6))) : most), 0);
  return (
    <Board layout="flip" lean={-0.9 * clamp(fall / 20)}>
      <Head>
        <h1>Desde entonces<br />hay <Hi say="frenos">frenos</Hi></h1>
        <Lead say="hoy">Si el S&amp;P 500 cae demasiado en un día, <b>todo el mercado se para</b>.</Lead>
      </Head>
      <Stage>
        <Svg>
          <defs>
            <linearGradient id="br-fill" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={TOP} y2={Y(20)}>
              <stop offset="0" stopColor={SELL} stopOpacity={0.12} /><stop offset="1" stopColor={SELL} stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <g opacity={gauge}>
            <text className="mono" x={0} y={26} fontSize={20} fill={DIM} letterSpacing="0.14em">CAÍDA DEL S&amp;P 500 EN EL DÍA</text>
            <rect x={COL.x} y={TOP - 14} width={COL.w} height={Y(20) - TOP + 28} rx={30} fill="rgba(255,255,255,0.055)" stroke={HAIR} strokeWidth={1.5} />
            <text className="mono" x={COL.x - 16} y={TOP + 7} textAnchor="end" fontSize={20} fill={DIM}>0 %</text>
            {Array.from({ length: 21 }, (_, i) => (
              <line key={i} x1={COL.x + COL.w - (i % 5 === 0 ? 30 : 16)} x2={COL.x + COL.w - 8} y1={Y(i)} y2={Y(i)} stroke="#fff" strokeOpacity={i % 5 === 0 ? 0.35 : 0.16} strokeWidth={1.5} />
            ))}
            <rect x={COL.x + 10} y={TOP} width={COL.w - 20} height={Math.max(y - TOP, 0.01)} rx={8} fill="url(#br-fill)" />
            <g transform={`translate(${MID}, ${y.toFixed(2)}) scale(${(1 + hit * 0.1).toFixed(4)})`} style={glow(`rgba(255,255,255,${(0.3 + hit * 0.45).toFixed(3)})`, 14 + hit * 22)}>
              <rect x={-COL.w / 2 - 16} y={-27} width={COL.w + 32} height={54} rx={27} fill={FG} />
              <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight={700} fill={BG} letterSpacing="-0.02em">{fall < 0.5 ? "0 %" : `−${Math.round(fall)} %`}</text>
            </g>
          </g>
          <Pulse x={MID} y={Y(7)} at={at7} size={90} color={SELL} />
          <Pulse x={MID} y={Y(13)} at={at13} size={90} color={SELL} />
          <Pulse x={MID} y={Y(20)} at={at20} size={90} color={SELL} />
          <Row fall={7} hit={at7} told={stop1} title="15 minutos" note="SE PARA EL MERCADO ENTERO" />
          <Row fall={13} hit={at13} told={stop2} title="Otros 15 minutos" note="SE PARA OTRA VEZ" />
          <Row fall={20} hit={at20} told={stop3} title="Fin de la sesión" note="NO SE REABRE ESE DÍA" end />
        </Svg>
      </Stage>
      <Src>Investor.gov (SEC), «Stock Market Circuit Breakers». Niveles 1 y 2, antes de las 15:25 de Nueva York.</Src>
    </Board>
  );
};
