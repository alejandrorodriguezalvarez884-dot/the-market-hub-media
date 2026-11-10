// What inflation is: a basket of what you buy in a year, 100 euros today and 104 in a year is 4 % (a made-up example)
import React from "react";
import { Column, Count, Look, Reveal, useSay, useSeconds } from "@mh/kit";
import { Drawing, Row, useIn } from "./look/ipc";

// What goes into the basket, drawn as labels: [label, x, y, width]
const ITEMS: [string, number, number, number][] = [
  ["Pan", 214, 96, 112], ["Luz", 338, 96, 104], ["Gasolina", 454, 96, 168], ["Alquiler", 270, 30, 168], ["Móvil", 450, 30, 124],
];

export default () => {
  const t = useSeconds();
  const basket = useSay("cesta");
  const later = useIn("ciento", 0.9);
  return (
    <Look look="light" bg="city" brand="The Market Hub · Aprende">
      <Column>
        <Reveal as="p" className="kicker">¿Qué es la inflación?</Reveal>
        <h1>Una <span className="y">cesta</span> que cada año cuesta más</h1>
        <div className="card" style={{ gap: 16 }}>
          <p className="label">Ejemplo</p>
          <Drawing h={250}>
            {ITEMS.map(([label, x, y, w], i) => {
              const p = Math.min(1, Math.max(0, (t - basket - 0.1 - i * 0.12) / 0.4));
              return (
                <g key={label} transform={`translate(0, ${((1 - p) * -50).toFixed(1)})`} opacity={p}>
                  <rect x={x} y={y} width={w} height={56} rx={12} fill="var(--page)" stroke="var(--ink-strong)" strokeOpacity={0.25} strokeWidth={2} />
                  <text x={x + w / 2} y={y + 37} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--ink-strong)">{label}</text>
                </g>
              );
            })}
            <path d="M 170 150 L 618 150 L 580 246 L 208 246 Z" fill="var(--amber)" fillOpacity={0.14} stroke="var(--amber)" strokeWidth={5} strokeLinejoin="round" />
            <g transform="translate(394, 200)">
              <rect x={-96} y={-30} width={192} height={60} rx={30} fill="var(--ink-strong)" />
              <text y={11} textAnchor="middle" fontSize={34} fontWeight={800} fill="var(--page)">{Math.round(100 + 4 * later)} €</text>
            </g>
          </Drawing>
          <Reveal say="hoy"><Row name="Hoy" fig="100 €" /></Reveal>
          <Reveal say="ciento"><Row name="Dentro de un año" fig="104 €" tone="y" /></Reveal>
          <p className="note">Precios inventados, para el ejemplo.</p>
        </div>
        <Reveal say="cuatro#2" how="pop" tilt={-3} className="sticker amber">
          Inflación: <Count to={4} prefix="+" suffix=" %" say="cuatro#2" takes={0.6} />
        </Reveal>
      </Column>
    </Look>
  );
};
