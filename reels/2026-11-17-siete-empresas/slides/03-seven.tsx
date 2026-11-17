// The seven: Apple 8.04 %, Microsoft 6.01 %, Nvidia 5.90 %, Amazon 3.95 %, Alphabet 4.69 % (A 2.60 +
// C 2.09), Meta 2.16 %, Tesla 1.67 %; together 32.42 % (SPY holdings, 16 Nov 2026).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { City, Card, Frame, Head, Hi, Logo, Num, Src, World, between, clamp, ease, glide, prog } from "./look/ciudad";

const NAMES: [string, string, string][] = [["AAPL", "apple", "apple"], ["MSFT", "microsoft", "microsoft"], ["NVDA", "nvidia", "nvidia"], ["AMZN", "amazon", "amazon"], ["GOOGL", "google", "alphabet"], ["META", "meta", "meta"], ["TSLA", "tesla", "tesla"]];

export default () => {
  const t = useSeconds();
  const at = NAMES.map(([, , w]) => useSay(w));
  const cam = between({ rx: 60, rz: -30, x: 0, y: 0, z: 120, oy: 470 }, { rx: 54, rz: -50, x: 0, y: 0, z: 240, oy: 480 }, glide(prog(t, 0, 8)));
  return (
    <Frame world={<World cam={cam}><City tone={(k) => { const i = NAMES.findIndex(([x]) => x === k); return i >= 0 && t >= at[i] ? "ice" : undefined; }} /></World>}>
      <Head kick="Las siete"><h1>Un <Hi say="treinta">tercio</Hi> del índice</h1></Head>
      <Card style={{ left: 72, top: 600, width: 620 }}>
        <span className="lab">Su peso en el S&P 500</span>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "6px 0 12px" }}>
          {NAMES.map(([k, logo], i) => <span key={k} style={{ opacity: clamp((t - at[i]) * 4) }}><Logo name={logo} h={58} /></span>)}
        </div>
        <Num to={32.4} decimals={1} suffix=" %" say="treinta" />
      </Card>
      <Src>State Street, cartera diaria del SPY (ETF del S&P 500) a 16 de noviembre de 2026; Alphabet suma sus dos clases de acciones.</Src>
    </Frame>
  );
};
