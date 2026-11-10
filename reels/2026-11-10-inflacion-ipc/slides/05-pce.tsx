// Index 3 of 4: the Fed watches the PCE price index; its goal is 2 %; in September it was 3.6 % (3.1 % without food and energy)
import React from "react";
import { Column, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, Row, es, useIn } from "./look/ipc";

const X = (v: number) => 30 + (v / 5) * 728; // 0 to 5 %

export default () => {
  const goal = useIn("objetivo", 0.5);
  const now = useIn("tres", 1.0);
  const v = 2 + 1.6 * now;
  const at = goal > 0 ? v * Math.max(goal, 0) : 0;
  return (
    <Look look="light" bg="grid" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker sky">Índice 3 de 4 · el que mira la Fed</Reveal>
        <h1>El <span className="y">PCE</span></h1>
        <p style={{ fontSize: 44, lineHeight: 1.2, fontWeight: 600, color: "var(--ink-strong)" }}>Los precios de todo lo que <span className="s">gastan los hogares</span>.</p>
        <div className="card" style={{ gap: 14 }}>
          <p className="label">PCE · en un año</p>
          <Drawing h={190}>
            <rect x={X(0)} y={90} width={X(5) - X(0)} height={26} rx={13} fill="var(--ink-strong)" opacity={0.08} />
            <rect x={X(0)} y={90} width={Math.max(0, X(at) - X(0))} height={26} rx={13} fill="var(--sky)" />
            {[0, 1, 2, 3, 4, 5].map((k) => <text key={k} x={X(k)} y={156} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--muted)" fontFamily="var(--mono)">{k} %</text>)}
            <g opacity={goal}>
              <line x1={X(2)} x2={X(2)} y1={50} y2={128} stroke="var(--up)" strokeWidth={5} strokeDasharray="9 7" />
              <rect x={X(2) - 110} y={8} width={220} height={44} rx={22} fill="var(--up)" />
              <text x={X(2)} y={39} textAnchor="middle" fontSize={24} fontWeight={800} fill="#04130c">Objetivo: 2 %</text>
            </g>
            {now > 0 && <g>
              <circle cx={X(v)} cy={103} r={20} fill="var(--ink-strong)" />
              <text x={X(v)} y={186} textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--ink-strong)">{es(v)} %</text>
            </g>}
          </Drawing>
          <Reveal say="tres"><Row name="PCE" small="septiembre de 2026" fig="3,6 %" tone="s" /></Reveal>
          <Reveal say="tres+0.6"><Row name="Sin comida ni energía" fig="3,1 %" /></Reveal>
          <p className="note">El objetivo del 2 % se mide con el PCE (Reserva Federal). Datos de la BEA vía FRED, cálculo propio.</p>
        </div>
      </Column>
    </Look>
  );
};
