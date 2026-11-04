"""Write the slides of reels/2026-11-04-midterms-data-centers/ (essay look).

The moves come from data/moves.json (Yahoo Finance, read on 2026-11-04 at 10:25 Madrid);
everything else is from the sources in script.md.

Usage: python make_slides.py <reel_dir>
"""
import json
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

reel = Path(sys.argv[1])
moves = json.loads((reel / "data" / "moves.json").read_text(encoding="utf-8"))["tickers"]


def es(x, nd=1, sign=False):
    """A number the Spanish way: 1.234,5 (with its sign when asked)."""
    q = Decimal(str(abs(x))).quantize(Decimal(1).scaleb(-nd), rounding=ROUND_HALF_UP)
    s = f"{q:,.{nd}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    if sign:
        s = ("+" if x >= 0 else "−") + s
    return s


def logo(name, alt, cls=""):
    return (f'<span class="logo{(" " + cls) if cls else ""}">'
            f'<img src="../../../theme/logos/{name}.svg" alt="{alt}"></span>')


FIRMS = {"CIFR": ("cipher", "Cipher", "saifer"), "IREN": ("iren", "IREN", "airen"),
         "CRWV": ("coreweave", "CoreWeave", "cor"), "NBIS": ("nebius", "Nebius", "nebius")}

HEAD = """<!doctype html>
<!-- {comment} -->
<html lang="es">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="../../../theme/reel.css">
<style>
  .src {{ font-family: var(--mono); font-size: 22px; letter-spacing: 0.06em; color: var(--muted); }}
  .card .label .logo {{ font-size: 48px; margin-right: 10px; }}
  .line .name .logo {{ font-size: 44px; }}
  .line .name .logo img {{ max-width: 230px; }}
  .quote {{ font-family: var(--serif); font-size: 54px; line-height: 1.12; font-weight: 600; color: var(--ink-strong); }}
  .who {{ font-family: var(--mono); font-size: 24px; letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; }}
  .card.paper .quote {{ color: #f3f0e9; }}
  .card.paper .who {{ color: #c9c3b6; }}
  .steps {{ display: flex; flex-direction: column; gap: 22px; width: 100%; }}
  .step {{ display: grid; grid-template-columns: 90px 1fr; gap: 24px; align-items: baseline; }}
  .step b {{ font-family: var(--serif); font-size: 72px; font-weight: 600; color: var(--amber); }}
  .step p {{ font-size: 40px; line-height: 1.18; color: var(--ink-strong); font-weight: 600; }}
  .step p small {{ display: block; font-size: 27px; color: var(--muted); font-weight: 500; margin-top: 4px; }}
  .tbl {{ display: grid; grid-template-columns: 1fr 210px 230px; gap: 18px 16px; align-items: center; width: 100%; }}
  .tbl .h {{ font-family: var(--mono); font-size: 22px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); text-align: right; }}
  .tbl .n {{ display: flex; align-items: center; gap: 14px; font-size: 38px; font-weight: 700; color: var(--ink-strong); }}
  .tbl .n .logo {{ font-size: 44px; }}
  .tbl .n .logo img {{ max-width: 230px; }}
  .tbl .v {{ white-space: nowrap; font-family: var(--serif); font-size: 44px; font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }}
  .tbl .rule {{ grid-column: 1 / -1; height: 1px; background: var(--card-line); }}
  .tbl .me .n, .tbl .me.v {{ }}
  .hot {{ outline: 3px solid var(--amber); outline-offset: 8px; }}
  .duo {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%; }}
  .duo .card h2 {{ font-size: 46px; }}
  .cal {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; width: 100%; }}
  .cal .card {{ padding: 26px 22px; gap: 12px; align-items: flex-start; }}
  .cal .card .logo {{ font-size: 44px; }}
  .cal .card .logo img {{ max-width: 220px; }}
  .cal .card h2 {{ font-size: 40px; white-space: nowrap; }}
  .cal .card .note {{ font-size: 26px; }}
  .states {{ font-size: 30px; font-weight: 500; color: var(--muted); line-height: 1.3; }}
  {extra}
</style>
</head>
<body class="light essay" data-bg="{bg}"{seed}>
<canvas class="bg"></canvas>
<header class="brand">The Market Hub · Reflexión</header>
<main class="reel{main}">
"""
FOOT = """</main>
<script src="../../../theme/reel.js"></script>
</body>
</html>
"""

slides = {}


def slide(name, comment, bg, body, main="", extra="", seed=None):
    s = f' data-seed="{seed}"' if seed else ""
    slides[name] = HEAD.format(comment=comment, bg=bg, seed=s, main=main, extra=extra) + body + FOOT


pre = {k: moves[k]["preMarketChangePercent"] for k in FIRMS}
tue = {k: moves[k]["regularMarketChangePercent"] for k in FIRMS}
order = ["CIFR", "IREN", "CRWV", "NBIS"]
WHEN = "Yahoo Finance · preapertura del 4-11-2026, 10:25 (Madrid)"

# 01: the hook, also the cover
rows = []
for k in order:
    f, alt, say = FIRMS[k]
    hot = " hot" if k == "NBIS" else ""
    cue = "menos" if k == "NBIS" else "todas"
    w = min(100, abs(pre[k]) / 9 * 100)
    rows.append(f'''  <div class="line fade{hot}" data-say="{cue}"><span class="name">{logo(f, alt)}</span><span class="fig r">▼ {es(pre[k])} %</span><div class="bar"><i class="r" style="--w:{w:.0f}%"></i></div></div>''')
slide("01-hook", "Hook: Democrats take Congress and the data-center builders fall, but Nebius much less", "grid", f'''<p class="kicker in">Midterms · una reflexión</p>
<h1 class="small in">Ganan los demócratas. <span class="y">Caen</span> los centros de datos</h1>
<div class="card in" data-say="caen">
{chr(10).join(rows)}
</div>
<span class="sticker small pop" data-say="menos">Todas menos una</span>
<p class="src fade" data-say="caen">{WHEN}</p>
''')

# 02: the result
slide("02-result", "The result: Democrats take the House and the Senate; Texas flips its Senate seat and governor", "city", '''<p class="kicker in">El resultado</p>
<h1 class="small in">El Congreso, <span class="y">para los demócratas</span></h1>
<div class="card in" data-say="camara">
  <div class="line"><span class="name">Cámara<small>Al menos 258 escaños; la mayoría, 218</small></span><span class="fig g">D</span></div>
  <div class="line fade" data-say="senado"><span class="name">Senado<small>Cambian de partido 7 escaños</small></span><span class="fig g">D</span></div>
  <p class="states fade" data-say="siete">Iowa · Kansas · Ohio · Maine · Carolina del Norte · Carolina del Sur · <b class="y">Texas</b></p>
</div>
<div class="card amber in" data-say="gina">
  <p class="label">Texas</p>
  <div class="line"><span class="name">Gina Hinojosa<small>Gobernadora: la primera demócrata desde 1990</small></span></div>
  <div class="line fade" data-say="primera"><span class="name">James Talarico<small>Senado: 55 % frente al 43 % de Paxton</small></span></div>
</div>
<p class="src fade" data-say="camara">Proyecciones de NBC News y ABC News · 4-11-2026</p>
''', seed="7")

# 03: Iran
slide("03-iran", "Iran: the war weighed on the vote, as Trump and Tehran say", "tape", '''<p class="kicker red in">Irán</p>
<h1 class="small in">La guerra, <span class="y">en las urnas</span></h1>
<div class="duo">
  <div class="card in" data-say="febrero"><p class="label">En guerra</p><h2>Desde febrero</h2></div>
  <div class="card in" data-say="ormuz"><p class="label">Ormuz</p><h2>Casi cerrado</h2></div>
</div>
<div class="card in" data-say="trump">
  <p class="quote">«Irán ha sido una parte»</p>
  <p class="who">Donald Trump, al Wall Street Journal</p>
</div>
<div class="card paper in" data-say="teheran">
  <p class="quote">«Los estadounidenses han dicho no a la guerra»</p>
  <p class="who">Mohammad Bagher Ghalibaf, presidente del Parlamento iraní</p>
</div>
<p class="src fade" data-say="teheran">CNBC y Al Arabiya · 2 y 4-11-2026</p>
''')

# 04: power
slide("04-power", "Does Congress take power from Trump? Some: a binding war powers resolution, but the veto", "grid", '''<p class="kicker in">¿Menos poder?</p>
<h1 class="small in">Menos manos libres, <span class="y">no atadas</span></h1>
<div class="card in" data-say="enero">
  <div class="steps">
    <div class="step"><b>1</b><p>Una ley que obligue a parar la guerra<small>El nuevo Congreso entra el 3 de enero de 2027</small></p></div>
    <div class="step fade" data-say="vetarla"><b>2</b><p>Trump puede vetarla</p></div>
    <div class="step fade" data-say="tercios"><b>3</b><p>Levantar el veto pide <span class="y">dos tercios</span> de las dos cámaras</p></div>
  </div>
</div>
<span class="sticker small pop" data-say="atadas">Algo de poder, no todo</span>
<p class="src fade" data-say="enero">CNBC · 4-11-2026</p>
''', seed="3")

# 05: oil
brent = moves["BZ=F"]["regularMarketPrice"]
wti = moves["CL=F"]["regularMarketPrice"]
slide("05-oil", "For the market, the key is oil", "candles", f'''<p class="kicker in">Para el mercado</p>
<h1 class="small in">La clave, <span class="y">el barril</span></h1>
<div class="card amber in" data-say="brent">
  <p class="label">Brent, el barril de referencia en Europa</p>
  <p class="big mid">{es(brent, 1)} $</p>
  <p class="note">Texas (WTI): {es(wti, 1)} $ · Yahoo Finance, 4-11-2026, 10:15 (Madrid)</p>
</div>
<div class="card in" data-say="paz">
  <h2>Más presión hacia la paz, <span class="y">un barril más barato</span>?</h2>
</div>
<span class="sticker small tag pop" data-say="momento">De momento, solo un «si»</span>
''')

# 06: data centers
slide("06-datacenters", "Data centers: a third of Democratic candidates backed a moratorium, 3% of Republicans", "tape", '''<p class="kicker in">Los centros de datos</p>
<h1 class="small in">La luz, <span class="y">en campaña</span></h1>
<div class="card in" data-say="tres">
  <p class="label">Candidatos que apoyaban una moratoria</p>
  <div class="line"><span class="name">Demócratas</span><span class="fig">32,4 %</span><div class="bar"><i style="--w:100%"></i></div></div>
  <div class="line fade" data-say="republicanos"><span class="name">Republicanos</span><span class="fig">3,4 %</span><div class="bar"><i style="--w:10.5%"></i></div></div>
  <p class="note">De los que tenían postura · Data Center Watch, 2-11-2026</p>
</div>
''', seed="11")

# 07: Texas
slide("07-texas", "Texas: over a quarter of US data-center power, and a governor who promised a moratorium", "city", '''<p class="kicker in">Texas</p>
<h1 class="small in">Una cuarta parte, <span class="y">allí</span></h1>
<div class="card amber in" data-say="wells">
  <p class="big mid">≈ 27 %</p>
  <p class="note">De los gigavatios de centros de datos de EE. UU. · Wells Fargo, en CNBC</p>
</div>
<div class="card paper in" data-say="hinojosa">
  <p class="who">Gina Hinojosa, gobernadora electa, promete</p>
  <p class="quote">Una moratoria de centros de datos y el fin de <span class="y">sus ayudas</span></p>
</div>
<p class="src fade" data-say="hinojosa">CNBC, 4-11-2026 · campaña de Hinojosa, 23-7-2026</p>
''', seed="5")

# 08: the reaction
cells = ['<span></span><span class="h">Martes</span><span class="h">Preapertura</span>']
for k in order:
    f, alt, say = FIRMS[k]
    hot = " hot" if k == "NBIS" else ""
    cells.append(f'<div class="n fade" data-say="{say}">{logo(f, alt)}</div>'
                 f'<span class="v g fade" data-say="subido">▲ {es(tue[k])} %</span>'
                 f'<span class="v r fade{hot}" data-say="{say}">▼ {es(pre[k])} %</span>')
slide("08-reaction", "The reaction: up on Tuesday, given back overnight; Nebius least", "candles", f'''<p class="kicker red in">La reacción</p>
<h1 class="small in">Suben el martes. <span class="y">De noche, lo devuelven</span></h1>
<div class="card in" data-say="martes">
  <div class="tbl">
  {(chr(10) + '  <div class="rule"></div>' + chr(10) + '  ').join(cells)}
  </div>
</div>
<p class="src fade" data-say="martes">Yahoo Finance · cierre del 3-11 y preapertura del 4-11, 10:25 (Madrid). De noche, según TipRanks: CoreWeave −7 %, IREN −8 %, Nebius −4,5 %</p>
''', seed="9")

# 09: the map
slide("09-map", "The difference is the map: Texas", "grid", f'''<p class="kicker in">La diferencia</p>
<h1 class="small in">El mapa: <span class="y">Texas</span></h1>
<div class="card in" data-say="saifer">
  <div class="line"><span class="name">{logo("cipher", "Cipher")}<small>Todo lo contratado: 700 MW</small></span><span class="fig r">Texas</span></div>
  <div class="line fade" data-say="airen"><span class="name">{logo("iren", "IREN")}<small>2.750 de 5.610 MW previstos</small></span><span class="fig r">49 %</span></div>
  <div class="line fade" data-say="cor"><span class="name">{logo("coreweave", "CoreWeave")}<small>Helios, Denton, Austin, Pecos…</small></span><span class="fig r">Varios</span></div>
  <div class="line fade hot" data-say="nebius"><span class="name">{logo("nebius", "Nebius")}<small class="fade" data-say="misuri">Misuri, Pensilvania, Alabama, Nueva Jersey… y Europa</small></span><span class="fig g">Ninguno</span></div>
</div>
<p class="src fade" data-say="saifer">SEC: Cipher (2-11-2026), IREN (10-K 2026), Nebius (2.º trimestre 2026); Galaxy y Core Scientific</p>
''', seed="13")

# 10: my reading
nv = moves["NVDA"]["preMarketChangePercent"]
slide("10-reading", "My reading: the market did not vote against AI, it voted against a map", "candles", f'''<p class="kicker in">Mi lectura</p>
<h1 class="small in">No ha votado contra la IA. <span class="y">Ha votado contra un mapa</span></h1>
<div class="card in" data-say="envidia">
  <div class="line"><span class="name">{logo("nvidia", "Nvidia")} Nvidia<small>Preapertura, 10:25 (Madrid)</small></span><span class="fig g">▲ {es(nv)} %</span></div>
</div>
<div class="card paper in" data-say="castiga">
  <p class="quote">Castiga construir donde la política puede <span class="y">cambiar las reglas</span></p>
</div>
''', main=" center", seed="21")

# 11: caveats
slide("11-caveats", "The caveats: one night, Abbott had already paused, and Nebius is in court in Alabama", "plain", f'''<p class="kicker red in">Los matices</p>
<h1 class="small in">Antes de <span class="y">sacar conclusiones</span></h1>
<div class="card in" data-say="noche">
  <div class="steps">
    <div class="step"><b>1</b><p>Es una sola noche<small>Y la preapertura mueve poco volumen</small></p></div>
    <div class="step fade" data-say="abbott"><b>2</b><p>Abbott ya había frenado las aprobaciones<small>Hasta una auditoría del operador de la red, ERCOT · KFOX14, 31-8-2026</small></p></div>
    <div class="step fade" data-say="nebius"><b>3</b><p>{logo("nebius", "Nebius")} tampoco está a salvo<small>Su proyecto de Birmingham (Alabama) afronta varias demandas · WBHM, 3-9-2026</small></p></div>
  </div>
</div>
''')

# 12: question
cal = []
for k, day, note, say in [("IREN", "Jueves 5", "Tras el cierre", "airen"),
                          ("CRWV", "Martes 10", "Tras el cierre", "cor"),
                          ("NBIS", "Jueves 12", "Antes de la apertura", "nebius")]:
    f, alt, _ = FIRMS[k]
    cal.append(f'<div class="card in" data-say="{say}">{logo(f, alt)}<h2>{day}</h2><p class="note">{note}</p></div>')
slide("12-question", "What comes, and the question", "plain", f'''<p class="kicker in">Sus resultados</p>
<div class="cal">
  {(chr(10) + '  ').join(cal)}
</div>
<h1 class="small in" data-say="crees">¿Los <span class="y">frena</span>, o los <span class="y">cambia de sitio</span>?</h1>
<div class="answers">
  <span class="sticker pop" data-say="frenara">Los frena</span>
  <em class="fade" data-say="o_solo">o</em>
  <span class="sticker green pop" data-say="cambiara">Los mueve</span>
</div>
<div class="mark in" data-say="comentarios"><img src="../../../channel/instagram-profile.jpg" alt=""><span>Te leo en comentarios</span></div>
''', main=" center")

out = reel / "slides"
out.mkdir(exist_ok=True)
for name, html in slides.items():
    (out / f"{name}.html").write_text(html, encoding="utf-8")
print("wrote", len(slides), "slides")
