// Price return by year, S&P 500 against S&P 500 Equal Weight (Yahoo Finance, last close of each year):
// 2023 +24.2 / +11.6; 2024 +23.3 / +10.9; 2025 +16.4 / +9.3 (data/yahoo-*-5y.json).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Floor, Frame, Head, Hi, Src, Towers, World, between, glide, prog } from "./look/ciudad";

export default () => {
  const t = useSeconds();
  const a = useSay("tres"), b = useSay("sacaron");
  const cam = between({ rx: 66, rz: -16, x: 0, y: 0, z: -220, oy: 200 }, { rx: 62, rz: -28, x: 0, y: 0, z: -150, oy: 210 }, glide(prog(t, 0, 9)));
  return (
    <Frame world={<World cam={cam}><Floor w={2600} d={2600} />
      <Towers scale={16} w={90} d={90} gap={34} labelSize={20} valueSize={40} items={[
        { label: "2023", value: 24.2, text: "+24,2", tone: "ice", at: a },
        { label: "", value: 11.6, text: "+11,6", tone: "dim", at: b },
        { label: "2024", value: 23.3, text: "+23,3", tone: "ice", at: a + 0.3 },
        { label: "", value: 10.9, text: "+10,9", tone: "dim", at: b + 0.3 },
        { label: "2025", value: 16.4, text: "+16,4", tone: "ice", at: a + 0.6 },
        { label: "", value: 9.3, text: "+9,3", tone: "dim", at: b + 0.6 },
      ]} /></World>}>
      <Head kick="2023, 2024, 2025 · % en el año"><h1>Tres años <Hi say="tiraron">tirando</Hi></h1></Head>
      <Card say={a} style={{ left: 600, top: 590, width: 380, padding: "14px 22px" }}>
        <div className="line"><span>S&P 500</span><b className="ice">■</b></div>
        <div className="line"><span>A partes iguales</span><b style={{ color: "#5d6a7e" }}>■</b></div>
      </Card>
      <Src>Variación del precio en cada año natural: S&P 500 y S&P 500 Equal Weight (Yahoo Finance). Diferencia: 12,7, 12,4 y 7,1 puntos.</Src>
    </Frame>
  );
};
