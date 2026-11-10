// The question for the comments: where do you feel prices rising most, the shopping, petrol or the rent?
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { ACC, Board, Card, FG, Head, Hi, Src, Stage, Svg, Tag, ease, glow, prog } from "./look/libro";

const ICON: Record<string, React.ReactNode> = {
  compra: <path d="M 40 52 L 120 52 L 110 112 L 50 112 Z M 56 52 C 56 22 104 22 104 52" fill="none" stroke={FG} strokeWidth={6} strokeLinejoin="round" />,
  gasolina: <g fill="none" stroke={FG} strokeWidth={6} strokeLinejoin="round"><rect x={46} y={30} width={50} height={84} rx={8} /><rect x={56} y={42} width={30} height={22} rx={3} /><path d="M 96 54 L 112 66 L 112 100 C 112 108 120 108 120 100 L 120 60" /></g>,
  alquiler: <path d="M 34 76 L 80 34 L 126 76 M 46 66 L 46 116 L 114 116 L 114 66 M 70 116 L 70 88 L 90 88 L 90 116" fill="none" stroke={FG} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />,
};

export default () => {
  const t = useSeconds();
  const read = useSay("leo");
  const arrow = ease(prog(t, read, 0.4));
  return (
    <Board>
      <Head><h1 className="big">¿Y <Hi>tú</Hi>?</h1></Head>
      <Stage style={{ top: 500 }}>
        <Card say={0.1} style={{ left: 0, top: 16, width: 860, fontSize: 44, lineHeight: 1.1, color: FG }}>
          ¿Dónde notas más <b>la subida</b>?
        </Card>
        {(["compra", "gasolina", "alquiler"] as const).map((k, i) => (
          <Card key={k} say={k} style={{ left: i * 292, top: 150, width: 276, height: 330, padding: 0, textAlign: "center" }}>
            <svg width={160} height={150} viewBox="0 0 160 150" style={{ marginTop: 34 }}>{ICON[k]}</svg>
            <span className="lab" style={{ fontSize: 26, color: FG, marginTop: 8 }}>{"ABC"[i]}</span>
            <b style={{ fontSize: 38 }}>{k[0].toUpperCase() + k.slice(1)}</b>
          </Card>
        ))}
        <Svg>
          <Tag x={430} y={566} w={520} h={72} size={27} tone="key" show={arrow}>TE LEO EN COMENTARIOS</Tag>
          <g transform={`translate(430, ${(644 + Math.sin(t * 6) * 7).toFixed(2)})`} opacity={arrow}>
            <path d="M -18 -10 L 0 10 L 18 -10" fill="none" stroke={FG} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </Svg>
      </Stage>
      <Src>Contenido informativo de The Market Hub. No es una recomendación de inversión.</Src>
    </Board>
  );
};
