// The counter-cases: 24 Mar 2020 (+7.81 %; the day before, 7,006.92; lowest close after, 7,469.62
// the next day) and 9 Apr 2025 (+12.02 %; the day before, 17,090.40; lowest close after, 17,808.30
// on 21 Apr): the index never closed as low as the day before again (Yahoo Finance, ^NDX).
import React from "react";
import { useSay, useSeconds } from "@mh/kit";
import { Card, Frame, Head, Hi, Map, Src, World, between, byDate, glide, prog } from "./look/mapa";

export default () => {
  const t = useSeconds();
  const y20 = useSay("veinte"), y25 = useSay("veinticinco"), floor = useSay("suelo");
  const a = byDate("2020-03-24"), b = byDate("2025-04-09");
  const cam = between({ rx: 62, rz: 20, x: -300, y: -1644, z: -600, oy: 300 }, { rx: 62, rz: -24, x: 1000, y: -720, z: -250, oy: 60 }, glide(prog(t, 0, 4.5)));
  return (
    <Frame world={<World cam={cam}><Map paint={(d) => (d.date === a.date && t >= y20 ? "up" : d.date === b.date && t >= y25 ? "up" : d.date === "2026-11-23" ? "amber" : "dim")}>
      </Map></World>}>
      <Head kick="No siempre"><h1>Dos veces, <Hi say="suelo" tone="up">casi en el suelo</Hi></h1></Head>
      <Card say={y20} tone="up" style={{ left: 72, top: 1020, width: 820, padding: "16px 24px" }}>
        <div className="line"><span>24 mar 2020</span><b className="up">+7,81 %</b></div>
        {t >= y25 && <div className="line"><span>9 abr 2025</span><b className="up">+12,02 %</b></div>}
        {t >= floor && <div className="line"><span>Después, ¿otro cierre más bajo que la víspera?</span><b>No</b></div>}
      </Card>
      <Src>Nasdaq 100, cierres diarios: Yahoo Finance. 2020: víspera 7.006,92; cierre más bajo después, 7.469,62. 2025: víspera 17.090,40; cierre más bajo después, 17.808,30.</Src>
    </Frame>
  );
};
