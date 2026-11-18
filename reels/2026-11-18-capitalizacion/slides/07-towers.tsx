// Three towers of today, floor = shares (SEC), height = price at 18:07 of Spain (Yahoo Finance), volume =
// capitalisation: Apple 14,532 M x 352.55 $ = 5.12 trillion; Microsoft 7,426 M x 503.43 $ = 3.74;
// Nvidia 24,100 M x 152.31 $ = 3.67. Microsoft has about a third of Nvidia's shares (0.31).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Logo, Src, Tower, World, between, glide, prog, ease, SIDE, HIGH } from "./look/torres";

const Top: React.FC<{ name: string; cap: string }> = ({ name, cap }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <Logo name={name} h={44} />
    <div className="val" style={{ fontSize: 40 }}>{cap}</div>
  </div>
);

export default () => {
  const t = useSeconds();
  const ms = useSay("Microsoft"), ap = useSay("Apple");
  const cam = between({ rx: 66, rz: -24, x: 40, y: 0, z: -720, oy: 50 }, { rx: 62, rz: -40, x: 40, y: 0, z: -680, oy: 50 }, glide(prog(t, 0, 12)));
  return (
    <Frame world={<World cam={cam}><Floor />
      <Tower x={-260} y={60} side={SIDE(24.1)} h={HIGH(152.31)} tone="amber" label="Nvidia" top={<Top name="nvidia" cap="3,67" />} />
      <Tower x={60} y={-40} side={SIDE(7.426)} h={HIGH(503.43)} grow={ease(prog(t, ms - 0.2, 1.4))} tone="ink" label="Microsoft" top={<Top name="microsoft" cap="3,74" />} />
      <Tower x={330} y={60} side={SIDE(14.532)} h={HIGH(352.55)} grow={ease(prog(t, ap - 0.2, 1.4))} label="Apple" top={<Top name="apple" cap="5,12" />} />
    </World>}>
      <Head kick="Hoy, en billones de dólares"><h1 className="mid">Cuenta la <Hi say="forma">forma</Hi>, no solo el precio</h1></Head>
      <Card say="Microsoft" style={{ left: 72, top: 1150, width: 640, padding: "12px 22px" }}>
        <div className="line"><span>Microsoft</span><b>7.426 M × 503 $</b></div>
        <div className="line"><span>Apple</span><b>14.532 M × 353 $</b></div>
        <div className="line"><span>Nvidia</span><b>24.100 M × 152 $</b></div>
      </Card>
      <Src>Acciones: SEC (Apple 23-10, Microsoft 22-10, Nvidia 21-8-2026). Precios: Yahoo Finance, 18 nov, 18:07 de España.</Src>
    </Frame>
  );
};
