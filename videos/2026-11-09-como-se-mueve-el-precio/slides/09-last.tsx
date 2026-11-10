// What the screen shows is the last deal: 101, and 99 if the next one is closed by a seller in a hurry. The company is the same
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { BUY, Board, DIM, FG, FULL, Firm, Head, Hi, Panel, SELL, Src, Stage, Svg, Tag, Who, clamp, ease, glow, prog } from "./look/libro";

export default () => {
  const t = useSeconds();
  const screen = useSay("pantalla"), next = useSay("vendedor"), takes = useSay("acepta"), says = useSay("dirá"), firm = useSay("empresa");
  const on = ease(prog(t, screen, 0.6));
  const turn = ease(prog(t, says, 0.35));
  const price = 101 - 2 * turn;
  const flash = t >= says ? 1 - prog(t, says, 0.7) : 0;
  const row = (y: number, side: "buy" | "sell", who: string, value: string, p: number) => (
    <g opacity={clamp(p * 1.6)} transform={`translate(${((1 - p) * 40).toFixed(2)}, 0)`}>
      <Panel x={1010} y={y} w={730} h={132} r={66} />
      <Who x={1076} y={y + 66} r={36} side={side} solid />
      <text className="mono" x={1136} y={y + 58} fontSize={22} fill={side === "buy" ? BUY : SELL} letterSpacing="0.12em">{who}</text>
      <text className="mono" x={1136} y={y + 92} fontSize={22} fill={DIM} letterSpacing="0.12em">CON PRISA</text>
      <text x={1700} y={y + 88} textAnchor="end" fontSize={64} fontWeight={700} fill={FG} letterSpacing="-0.02em">{value}</text>
    </g>
  );
  return (
    <Board layout="full" lean={-0.6 * ease(prog(t, next, 1))}>
      <Head><h1>La pantalla enseña el <Hi say="último">último trato</Hi></h1></Head>
      <Stage>
        <Svg {...FULL}>
          <g opacity={on} style={glow(`rgba(157,184,255,${(0.18 + flash * 0.4).toFixed(3)})`, 30)}>
            <rect x={0} y={20} width={930} height={520} rx={40} fill="#0b0d12" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
            <rect x={380} y={540} width={170} height={56} fill="#0b0d12" stroke="rgba(255,255,255,0.22)" strokeWidth={2} />
            <rect x={270} y={596} width={390} height={22} rx={11} fill="#12151b" stroke="rgba(255,255,255,0.22)" strokeWidth={2} />
            <text className="mono" x={64} y={112} fontSize={30} fill={DIM} letterSpacing="0.16em">ÚLTIMO PRECIO</text>
            <text x={60} y={368} fontSize={250} fontWeight={700} fill={FG} letterSpacing="-0.05em">{Math.round(price)} €</text>
            <text className="mono" x={64} y={470} fontSize={30} fill={turn > 0.5 ? SELL : DIM} letterSpacing="0.14em">{turn > 0.5 ? "▼ 2 € MENOS QUE EL TRATO ANTERIOR" : "EL TRATO MÁS RECIENTE"}</text>
          </g>
          <text className="mono" x={1010} y={52} fontSize={24} fill={DIM} letterSpacing="0.16em" opacity={on}>LOS TRATOS</text>
          {row(80, "buy", "COMPRADOR", "101 €", on)}
          {row(232, "sell", "VENDEDOR", "99 €", ease(prog(t, takes, 0.5)))}
          <g opacity={ease(prog(t, firm, 0.6))}>
            <Firm x={1110} y={620} s={170} />
            <Tag x={1470} y={560} w={420} h={64} size={25} show={ease(prog(t, firm, 0.6))}>LA EMPRESA: IGUAL</Tag>
          </g>
        </Svg>
      </Stage>
      <Src>Ejemplo inventado, en euros. El último precio es el de la operación más reciente hecha con un valor: Nasdaq, glosario, «Last sale».</Src>
    </Board>
  );
};
