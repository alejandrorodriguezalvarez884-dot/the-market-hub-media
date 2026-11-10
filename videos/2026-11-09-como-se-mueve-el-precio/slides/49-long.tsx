// What sets a share apart from a chip: behind the share there is a company that sells and earns; behind the chip, nothing
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Board, Card, DIM, FG, Firm, Head, Hi, Src, Stage, Svg, Tag, clamp, useIn } from "./look/libro";
import { Chip, Paper } from "./look/marks";

const Link: React.FC<{ x: number; show: number }> = ({ x, show }) => (
  <line x1={x} x2={x} y1={432} y2={432 + 44 * show} stroke="#fff" strokeOpacity={0.5 * show} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
);

export default () => {
  const t = useSeconds();
  const share = useIn("acción"), firm = useIn("empresa"), earns = useIn("gana"), chip = useIn("ficha"), nothing = useIn("nada");
  void t;
  return (
    <Board layout="flip" lean={0.5 * earns}>
      <Head><h1 className="mid">Detrás de una<br />acción hay una<br /><Hi say="empresa">empresa</Hi></h1></Head>
      <Stage>
        <Card say="tres" style={{ left: 0, top: 0, width: 860, padding: "22px 30px" }}>
          <span className="lab">La misma nota, 2013</span>
          <span style={{ fontSize: 40, lineHeight: 1.18, display: "block" }}>El rumbo general a <b>tres o cinco años</b> sí se puede prever.</span>
        </Card>
        <Svg>
          <line x1={430} x2={430} y1={216} y2={756} stroke="#fff" strokeOpacity={0.1 * chip} strokeWidth={1.5} />
          <g opacity={clamp(share * 1.6)} transform={`translate(0, ${((1 - share) * 14).toFixed(2)})`}><Paper x={215} y={286} w={104} /></g>
          <Tag x={215} y={398} w={350} h={50} size={19} show={share}>DETRÁS DE UNA ACCIÓN</Tag>
          <Link x={215} show={firm} />
          <Firm x={215} y={672} s={236} opacity={clamp(firm * 1.6)} />
          <Tag x={215} y={728} w={350} h={52} size={20} tone="buy" show={earns}>VENDE Y GANA DINERO</Tag>

          <g opacity={clamp(chip * 1.6)} transform={`translate(0, ${((1 - chip) * 14).toFixed(2)})`}>
            <Chip x={645} y={286} r={68}><text x={0} y={18} textAnchor="middle" fontSize={52} fontWeight={700} fill={FG}>?</text></Chip>
          </g>
          <Tag x={645} y={398} w={350} h={50} size={19} show={chip}>DETRÁS DE UNA FICHA</Tag>
          <Link x={645} show={nothing} />
          <g opacity={nothing}>
            <rect x={527} y={500} width={236} height={172} rx={24} fill="none" stroke={DIM} strokeWidth={2.5} strokeDasharray="4 12" strokeLinecap="round" />
            <text x={645} y={604} textAnchor="middle" fontSize={54} fill={DIM} letterSpacing="-0.02em">nada</text>
          </g>
        </Svg>
      </Stage>
      <Src>Real Academia Sueca de las Ciencias, nota de prensa del premio de Ciencias Económicas de 2013 (nobelprize.org).</Src>
    </Board>
  );
};
