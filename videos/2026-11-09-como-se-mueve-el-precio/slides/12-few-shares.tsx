// How few decide: all of Nvidia's shares, the ones that changed hands on Monday, and that sliver on the bar of all of them
import React from "react";
import { Img } from "remotion";
import { logoUrl, useSay, useSeconds } from "@mh/kit";
import figures from "../data/figures.json";
import { ACC, Board, Card, DIM, FG, GLASS, HAIR, Head, Hi, Src, Stage, Svg, Tag, clamp, ease, es, glow, prog } from "./look/libro";

const N = figures.nvda;
const BAR = { x: 0, y: 590, w: 860, h: 66 };
const CUT = (BAR.w * N.turnover_pct) / 100;

export default () => {
  const t = useSeconds();
  const name = useSay("Envidia"), all = useSay("veinticuatro"), moved = useSay("cuatrocientos"), less = useSay("menos");
  const logo = ease(prog(t, name, 0.5)), bar = ease(prog(t, all + 0.25, 0.7)), cut = ease(prog(t, moved + 0.25, 0.6)), tag = ease(prog(t, less, 0.5));
  return (
    <Board layout="flip">
      <Head><h1>Fíjate en<br />cuántos <Hi say="deciden">deciden</Hi></h1></Head>
      <Stage>
        <div style={{ position: "absolute", left: 4, top: 0, display: "flex", alignItems: "center", gap: 18, opacity: clamp(logo * 1.6), transform: `translateY(${((1 - logo) * 14).toFixed(2)}px)` }}>
          <Img src={logoUrl("nvidia")} alt="Nvidia" style={{ width: 62, height: 62 }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 26, letterSpacing: "0.16em", color: FG }}>NVIDIA</span>
        </div>
        <Svg>
          <g opacity={bar}>
            <text className="mono" x={0} y={BAR.y - 20} fontSize={20} fill={DIM} letterSpacing="0.14em">TODAS LAS ACCIONES DE NVIDIA</text>
            <rect x={BAR.x} y={BAR.y} width={BAR.w * bar} height={BAR.h} rx={14} fill={GLASS} stroke={HAIR} strokeWidth={1.5} />
          </g>
          <g opacity={cut} style={glow("rgba(157,184,255,0.8)", 14)}>
            <rect x={BAR.x} y={BAR.y - 8} width={CUT} height={BAR.h + 16} rx={5} fill={ACC} />
          </g>
          <line x1={CUT / 2} x2={CUT / 2} y1={BAR.y + BAR.h + 14} y2={BAR.y + BAR.h + 14 + 22 * tag} stroke={ACC} strokeWidth={2.5} strokeLinecap="round" opacity={tag} />
          <Tag x={190} y={726} w={380} h={60} size={25} tone="key" show={tag}>{es(N.turnover_pct, 2)} % DE TODAS</Tag>
        </Svg>
        <Card say={all} style={{ left: 0, top: 84, width: 860 }}>
          <span className="lab">Acciones de Nvidia en circulación</span>
          <span className="num mid">{es(N.shares / 1e6)} millones</span>
          <small>a 21 de agosto de 2026</small>
        </Card>
        <Card say={moved} style={{ left: 0, top: 322, width: 860 }}>
          <span className="lab">Cambiaron de manos el lunes 9 de noviembre</span>
          <span className="num mid">{es(N.volume / 1e6)} millones</span>
        </Card>
      </Stage>
      <Src>Acciones en circulación: Nvidia, informe trimestral presentado a la SEC el 26 de agosto de 2026 (EDGAR). Volumen del 9 de noviembre de 2026: Yahoo Finance. El porcentaje es una cuenta propia.</Src>
    </Board>
  );
};
