// The two ways of being in the market have a name: the market order (now, at whatever price) and the limit order (this price or better, and wait)
import React from "react";
import { Board, Card, Head, Hi, Src, Stage, Who } from "./look/libro";

const Mark: React.FC<{ solid?: boolean }> = ({ solid }) => (
  <svg width={150} height={150} viewBox="-75 -75 150 150" style={{ position: "absolute", left: 34, top: 40 }}>
    <Who x={0} y={0} r={62} side="buy" solid={solid} />
  </svg>
);

export default () => (
  <Board>
    <Head><h1>Dos maneras<br />de <Hi>estar</Hi></h1></Head>
    <Stage>
      <Card say="mercado" tone="buy" style={{ left: 0, top: 40, width: 860, height: 330, padding: "38px 40px 0 220px" }}>
        <Mark solid />
        <span className="lab" style={{ fontSize: 25 }}>Orden a mercado · con prisa</span>
        <b style={{ display: "block", fontSize: 70, lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: 14 }}>«Lo quiero ya»</b>
        <span style={{ display: "block", fontSize: 38, marginTop: 14 }}>al precio que haya</span>
      </Card>
      <Card say="limitada" style={{ left: 0, top: 410, width: 860, height: 330, padding: "38px 40px 0 220px" }}>
        <Mark />
        <span className="lab" style={{ fontSize: 25 }}>Orden limitada · espera</span>
        <b style={{ display: "block", fontSize: 62, lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: 14 }}>«A este precio o mejor»</b>
        <span style={{ display: "block", fontSize: 38, marginTop: 14 }}>y espero lo que haga falta</span>
      </Card>
    </Stage>
    <Src>Una orden a mercado se ejecuta de inmediato y no garantiza el precio; una orden limitada fija un precio o mejor: Investor.gov (SEC), «Types of Orders».</Src>
  </Board>
);
