// A day in figures: about 17,000 million shares, 124 million trades, more than 5,000 every second (each dot of the field is one trade of that second)
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { BG, Board, Card, Head, Hi, Src, Stage, ease, es, prog } from "./look/libro";

const SHARES = figures.cboe.october_shares_bn * 1000, TRADES = figures.cboe.october_trades_m, SECOND = figures.cboe.october_trades_per_second;
const COLS = 80, CELL = 5;
// One small square per trade of an average second, row after row
const FIELD = Array.from({ length: SECOND }, (_, i) => `M${((i % COLS) * CELL).toFixed(1)} ${(Math.floor(i / COLS) * CELL).toFixed(1)}h3.4v3.4h-3.4z`);
const ROWS = Math.ceil(SECOND / COLS);
const unit: React.CSSProperties = { fontSize: 50, letterSpacing: "-0.01em", fontWeight: 600 };

export default () => {
  const t = useSeconds();
  const shares = useSay("diecisiete"), trades = useSay("ciento"), second = useSay("cinco mil");
  const a = ease(prog(t, shares, 0.9)), b = ease(prog(t, trades, 0.9)), c = ease(prog(t, second, 1.1));
  const shown = Math.round(SECOND * prog(t, second + 0.1, 1.2));
  return (
    <Board>
      <Head><h1>Lo que se mueve<br />en un <Hi say="día">día</Hi></h1></Head>
      <Stage>
        <Card say={shares} style={{ left: 0, top: 0, width: 860, height: 186 }}>
          <span className="lab">Acciones al día · media de octubre</span>
          <span className="num" style={{ fontSize: 112 }}>{es(Math.round(SHARES * a))} <span style={unit}>millones</span></span>
        </Card>
        <Card say={trades} style={{ left: 0, top: 208, width: 860, height: 186 }}>
          <span className="lab">Operaciones al día</span>
          <span className="num" style={{ fontSize: 112 }}>{es(TRADES * b, 1)} <span style={unit}>millones</span></span>
        </Card>
        <Card say={second} tone="key" style={{ left: 0, top: 416, width: 860, height: 364 }}>
          <span className="lab">Operaciones cada segundo</span>
          <span className="num" style={{ fontSize: 112 }}>{es(Math.round(SECOND * c))}</span>
          <small style={{ width: 380, fontSize: 26, marginTop: 14 }}>Cada punto es una operación de un segundo cualquiera de la sesión.</small>
          <svg width={COLS * CELL} height={ROWS * CELL} viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} style={{ position: "absolute", right: 26, top: 14 }}>
            <path d={FIELD.slice(0, shown).join("")} fill={BG} opacity={0.82} />
          </svg>
        </Card>
      </Stage>
      <Src>Cboe, volumen histórico del mercado de EE. UU.: media diaria de octubre de 2026. Por segundo: las operaciones de un día entre los 23.400 segundos de una sesión.</Src>
    </Board>
  );
};
