// The market. Close of Tuesday 17 November 2026 (AP; Yahoo Finance): S&P 500 −1.0 % to 7,340.53, its
// lowest close since late July; Nasdaq −0.7 %; Dow Jones −1.6 % to 50,759.42. Before the open on 18
// November, at 11:44 in Spain, on Tuesday's close (Yahoo Finance, data/premarket.json): CoreWeave
// +5.6 %, TSMC +3.5 %, Micron +3.1 %, AMD +2.7 %; Nasdaq 100 futures +0.8 % and S&P 500 futures
// +0.5 % on their price at the stock market's close.
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Hall, Head, Hi, Logo, Src, World, between, ease, glide, prog } from "./look/nave";

// The wordmark logos carry the name; AMD's mark is too small to read, so its name goes as text beside it.
const Row: React.FC<{ logo: string; name?: string; fig: string }> = ({ logo, name, fig }) => (
  <div className="line"><span style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name={logo} h={40} style={{ padding: 6, borderRadius: 7 }} />{name}</span><b className="up">{fig}</b></div>
);

export default () => {
  const t = useSeconds();
  const tue = useSay("martes"), chips = useSay("chips"), fut = useSay("futuros");
  const cam = between({ rx: 60, rz: -30, x: 0, y: 200, z: 200, oy: 360 }, { rx: 56, rz: -18, x: 0, y: 0, z: 0, oy: 400 }, glide(prog(t, 0, 10)));
  return (
    <Frame world={<World cam={cam}><Hall power={0.15 + 0.75 * ease(prog(t, chips - 0.2, 1.8))} rows={7} cols={13} /></World>}>
      <Head kick="El mercado"><h1 className="mid">Martes en <Hi say="cayó" tone="down">rojo</Hi>; hoy, chips en <Hi say="suben" tone="up">verde</Hi></h1></Head>
      <Card say={tue} tone="down" style={{ left: 72, top: 650, width: 410 }}>
        <span className="lab">Cierre del martes 17</span>
        <div className="line"><span>S&amp;P 500</span><b className="down">−1,0 %</b></div>
        <div className="line"><span>Nasdaq</span><b className="down">−0,7 %</b></div>
        <div className="line"><span>Dow Jones</span><b className="down">−1,6 %</b></div>
      </Card>
      <Card say={chips} tone="up" style={{ left: 502, top: 650, width: 420 }}>
        <span className="lab">Hoy, antes de abrir</span>
        <Row logo="coreweave" fig="+5,6 %" />
        <Row logo="tsmc" fig="+3,5 %" />
        <Row logo="micron" fig="+3,1 %" />
        <Row logo="amd" name="AMD" fig="+2,7 %" />
      </Card>
      <Card say={fut} tone="ice" style={{ left: 72, top: 1110, width: 850 }}>
        <span className="lab">Futuros, a las 11:44 de España</span>
        <div className="line"><span>Nasdaq 100</span><b className="up">▲ 0,8 %</b></div>
        <div className="line"><span>S&amp;P 500</span><b className="up">▲ 0,5 %</b></div>
      </Card>
      <Src>Cierre del 17 de noviembre de 2026 (AP). Preapertura y futuros del 18 a las 11:44 de España, frente al cierre del 17 (Yahoo Finance).</Src>
    </Frame>
  );
};
