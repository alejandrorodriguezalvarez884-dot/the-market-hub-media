"""Write the slides of reels/2026-11-03-ai-cheaper-than-classics/ (essay look) from the comparison table."""
import json
import sys
from pathlib import Path

reel = Path(sys.argv[1])
data = json.loads((reel / "data" / "comparison.json").read_text(encoding="utf-8"))
rows = {r["ticker"]: r for r in data["rows"]}
med = data["medians"]

LOGO = {"NVDA": ("nvidia", "Nvidia"), "MU": ("micron", "Micron"), "SNDK": ("sandisk", "Sandisk"),
        "000660.KS": ("skhynix", "SK Hynix"), "GOOGL": ("google", "Alphabet"), "META": ("meta", "Meta"),
        "WMT": ("walmart", "Walmart"), "KO": ("cocacola", "Coca-Cola"), "COST": ("costco", "Costco"),
        "PG": ("pg", "P&amp;G")}
AI = ["NVDA", "MU", "SNDK", "000660.KS", "GOOGL", "META"]
CLASSIC = ["WMT", "KO", "COST", "PG"]


def es(x, nd=1):
    """A number the Spanish way: 1.234,5"""
    from decimal import Decimal, ROUND_HALF_UP
    q = Decimal(str(x)).quantize(Decimal(1).scaleb(-nd), rounding=ROUND_HALF_UP)
    s = f"{q:,.{nd}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def logo(tk, cls=""):
    f, name = LOGO[tk]
    return f'<span class="logo{(" " + cls) if cls else ""}"><img src="../../../theme/logos/{f}.svg" alt="{name}"></span>'


HEAD = """<!doctype html>
<!-- {comment} -->
<html lang="es">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="../../../theme/reel.css">
<style>
  .pair {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%; }}
  .pair .card {{ gap: 14px; }}
  .pair h2 {{ font-size: 50px; }}
  .rows {{ display: flex; flex-direction: column; gap: 12px; width: 100%; }}
  .row {{ display: grid; grid-template-columns: 330px 1fr 140px; align-items: center; gap: 18px; }}
  .row .who {{ display: flex; align-items: center; gap: 14px; font-size: 32px; font-weight: 700; color: var(--ink-strong); white-space: nowrap; }}
  .row .who .logo {{ font-size: 40px; }}
  .row .track {{ height: 16px; background: rgba(18, 17, 16, 0.07); }}
  .row .track i {{ display: block; height: 100%; width: var(--w); background: var(--c, var(--amber)); transform-origin: left; animation: grow 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; animation-delay: var(--at); }}
  .row .v {{ font-family: var(--serif); font-size: 42px; font-weight: 600; text-align: right; color: var(--ink-strong); font-variant-numeric: tabular-nums; }}
  .row.tech {{ --c: #2c4a6b; }}
  .row.classic {{ --c: #8a5a14; }}
  @keyframes grow {{ from {{ transform: scaleX(0); }} to {{ transform: scaleX(1); }} }}
  .logos {{ display: flex; flex-wrap: wrap; gap: 26px 26px; align-items: center; font-size: 84px; padding: 10px 0; }}
  .src {{ font-family: var(--mono); font-size: 22px; letter-spacing: 0.06em; color: var(--muted); }}
  .medians {{ display: flex; gap: 18px 22px; flex-wrap: wrap; }}
  body.essay .sticker.techc {{ background: #2c4a6b; color: #fbf9f4; }}
  body.essay .sticker.classicc {{ background: #8a5a14; color: #fbf9f4; }}
  .card .label .logo {{ font-size: 52px; margin-right: 10px; }}
  {extra}
</style>
</head>
<body class="light essay" data-bg="{bg}">
<canvas class="bg"></canvas>
<header class="brand">The Market Hub · Reflexión</header>
<main class="reel{main}">
"""
TAIL = """</main>
<script src="../../../theme/reel.js"></script>
</body>
</html>
"""


def slide(name, comment, bg, body, main="", extra=""):
    (reel / "slides" / f"{name}.html").write_text(
        HEAD.format(comment=comment, bg=bg, main=main, extra=extra) + body + TAIL, encoding="utf-8", newline="\n")


(reel / "slides").mkdir(exist_ok=True)
SRC = '<p class="src fade" data-say="{say}">Yahoo Finance · cierres del 2-11-2026 (SK Hynix, 3-11)</p>'

# 01 - the hook: Walmart against Nvidia
w, n = rows["WMT"], rows["NVDA"]
slide("01-hook", "Hook: Walmart grows 4% and trades at 41 times; Nvidia grows 68% and trades at 14", "grid", f"""<p class="kicker in">Una reflexión</p>
<h1 class="small in">¿Cuál de las dos <span class="y">asusta</span>?</h1>
<div class="pair">
  <div class="card in" data-say="uolmart">
    <p class="label">{logo("WMT")} Walmart</p>
    <p class="note">Ventas esperadas, próximo ejercicio</p>
    <h2 class="fade" data-say="cuatro">+{es(w["rev_growth_next_fy_pct"])} %</h2>
    <p class="note">Veces el beneficio esperado</p>
    <h2 class="fade" data-say="cuarenta">{es(w["pe_ntm"])}x</h2>
  </div>
  <div class="card amber in" data-say="envidia">
    <p class="label">{logo("NVDA")} Nvidia</p>
    <p class="note">Ventas esperadas, próximo ejercicio</p>
    <h2 class="fade g" data-say="sesenta">+{es(n["rev_growth_next_fy_pct"])} %</h2>
    <p class="note">Veces el beneficio esperado</p>
    <h2 class="fade" data-say="catorce">{es(n["pe_ntm"])}x</h2>
  </div>
</div>
{SRC.format(say="uolmart")}
""", extra=".pair h2 { font-size: 88px; white-space: nowrap; } .pair .card { padding: 40px 34px; gap: 20px; } .pair .note { font-size: 30px; }")

# 02 - the two teams
ai_logos = "\n    ".join(f'<span class="fade" data-say="seis">{logo(t)}</span>' for t in AI)
cl_logos = "\n    ".join(f'<span class="fade" data-say="cuatro">{logo(t)}</span>' for t in CLASSIC)
slide("02-teams", "Six big AI, chip and memory names against four classic defensives", "candles", f"""<p class="kicker in">Los equipos</p>
<h1 class="small in">Tecnológicas <span class="y">contra</span> clásicas</h1>
<div class="card amber in" data-say="seis">
  <p class="label">IA, chips y memoria</p>
  <div class="logos">
    {ai_logos}
  </div>
  <p class="note">Nvidia · Micron · Sandisk · SK Hynix · Alphabet · Meta</p>
</div>
<div class="card in" data-say="cuatro">
  <p class="label">Defensivas de toda la vida</p>
  <div class="logos">
    {cl_logos}
  </div>
  <p class="note">Walmart · Coca-Cola · Costco · Procter &amp; Gamble</p>
</div>
""")


def bars(key, tickers, top, fmt, say_for, signed=False):
    out = []
    for t in tickers:
        r = rows[t]
        v = r[key]
        cls = "tech" if t in AI else "classic"
        width = max(2, abs(v) / top * 100)
        text = (("+" if v > 0 else "−") if signed else "") + fmt(abs(v) if signed else v)
        out.append(f'  <div class="row {cls} fade" data-say="{say_for(t)}"><span class="who">{logo(t)} {LOGO[t][1]}</span>'
                   f'<span class="track"><i style="--w: {width:.0f}%"></i></span><span class="v">{text}</span></div>')
    return "\n".join(out)


# 03 - price: forward 12-month P/E, all ten, sorted
order = sorted(AI + CLASSIC, key=lambda t: rows[t]["pe_ntm"])
top = max(rows[t]["pe_ntm"] for t in order)
slide("03-price", "Price: forward 12-month P/E of the ten, and the median of each group", "tape", f"""<p class="kicker in">El precio</p>
<h1 class="small in">Veces el beneficio <span class="y">esperado</span></h1>
<div class="card in" data-say="precio">
  <p class="label">PER a 12 meses</p>
  <div class="rows">
{bars("pe_ntm", order, top, lambda v: es(v) + "x", lambda t: "nueve" if t in AI else "treinta")}
  </div>
</div>
<div class="medians">
  <span class="sticker small techc pop" data-say="nueve">Tecnológica típica: {es(med["ai"]["pe_ntm"])}x</span>
  <span class="sticker small classicc pop" data-say="treinta">Clásica típica: {es(med["classic"]["pe_ntm"])}x</span>
</div>
<p class="src fade" data-say="precio">Mediana de cada grupo · consenso de Yahoo Finance, 3-11-2026</p>
""", extra=".row .who { font-size: 30px; } .row .v { font-size: 38px; } .rows { gap: 8px; }")

# 04 - growth and margin, the two medians
ga, gc = med["ai"]["eps_growth_next_fy_pct"], med["classic"]["eps_growth_next_fy_pct"]
ma, mc = med["ai"]["op_margin_pct"], med["classic"]["op_margin_pct"]
slide("04-growth", "Growth and margins: the median expected EPS growth and operating margin of each group", "grid", f"""<p class="kicker in">El crecimiento</p>
<h1 class="small in">¿Crecen más <span class="y">las clásicas</span>?</h1>
<div class="card in" data-say="beneficio">
  <p class="label">Beneficio esperado, próximo ejercicio</p>
  <div class="line" data-say="veintidós"><span class="name">Tecnológica típica</span><span class="fig g" data-count="{ga}" data-decimals="1" data-prefix="+" data-suffix=" %" data-say="veintidós"></span><span class="bar"><i class="g" style="--w: 100%"></i></span></div>
  <div class="line fade" data-say="ocho"><span class="name">Clásica típica</span><span class="fig">+{es(gc)} %</span><span class="bar"><i style="--w: {gc / ga * 100:.0f}%"></i></span></div>
</div>
<div class="card in" data-say="cien dólares">
  <p class="label">Margen operativo · de cada 100 $ vendidos</p>
  <div class="line" data-say="setenta"><span class="name">Tecnológica típica</span><span class="fig" data-count="{ma}" data-decimals="1" data-suffix=" $" data-say="setenta"></span><span class="bar"><i class="g" style="--w: 100%"></i></span></div>
  <div class="line fade" data-say="quince"><span class="name">Clásica típica</span><span class="fig">{es(mc)} $</span><span class="bar"><i style="--w: {mc / ma * 100:.0f}%"></i></span></div>
</div>
<p class="src fade" data-say="beneficio">Medianas · consenso y últimos 12 meses, Yahoo Finance, 3-11-2026</p>
""")

# 05 - the punishment: distance from the one-year high
da, dc = med["ai"]["from_high_pct"], med["classic"]["from_high_pct"]
s, k = rows["SNDK"], rows["000660.KS"]
slide("05-punished", "The punishment: median distance from the one-year high; memory had multiplied before June", "candles", f"""<p class="kicker red in">El castigo</p>
<h1 class="small in">Desde su máximo <span class="y">del año</span></h1>
<div class="card down in" data-say="treinta">
  <p class="label">Tecnológica típica</p>
  <div class="big" style="color: var(--down)"><span data-count="{abs(da)}" data-decimals="1" data-prefix="−" data-say="treinta"></span><small>%</small></div>
</div>
<div class="card in" data-say="tres">
  <p class="label">Clásica típica</p>
  <h2>−{es(abs(dc))} %</h2>
</div>
<div class="medians">
  <span class="sticker small pop" data-say="mitad">{logo("SNDK")} Sandisk −{es(abs(s["from_high_pct"]))} %</span>
  <span class="sticker small pop" data-say="mitad">{logo("000660.KS")} SK Hynix −{es(abs(k["from_high_pct"]))} %</span>
</div>
<p class="src fade" data-say="junio">Desde sus máximos de junio de 2026</p>
<p class="src fade" data-say="mitad">En un año, aun así: Sandisk +{es(s["change_1y_pct"], 0)} % · SK Hynix +{es(k["change_1y_pct"], 0)} % · Yahoo Finance</p>
""", extra=".big { font-size: 150px; }")

# 06 - a demanding market; Coca-Cola up 41% in a year
ko = rows["KO"]
slide("06-demanding", "A demanding market: tech has to prove it every quarter; Coca-Cola, up 41% in a year", "city", f"""<p class="kicker in">Un mercado exigente</p>
<h1 class="small in">A unas les pide <span class="y">un examen</span> cada trimestre</h1>
<div class="card amber in" data-say="coca">
  <p class="label">{logo("KO")} Coca-Cola · en un año</p>
  <div class="big"><span data-count="{ko["change_1y_pct"]}" data-decimals="1" data-prefix="+" data-say="cuarenta"></span><small>%</small></div>
  <p class="note">Cierre del 2-11-2026, el más alto del último año · Yahoo Finance</p>
</div>
<div class="card in" data-say="seguir">
  <div class="line"><span class="name">PER a 12 meses</span><span class="fig">{es(ko["pe_ntm"])}x</span></div>
  <div class="line"><span class="name">Beneficio esperado<small>Próximo ejercicio</small></span><span class="fig">+{es(ko["eps_growth_next_fy_pct"])} %</span></div>
</div>
<span class="sticker tag pop" data-say="refrescos">Vendiendo refrescos</span>
""", extra=".big { font-size: 150px; }")

# 07 - the memory cycle
slide("07-cycle", "Reason one: memory margins at a peak; in 2023 Micron's sales halved and it lost $5.8bn", "tape", f"""<p class="kicker red in">Sus motivos · 1</p>
<h1 class="small in">La memoria, <span class="y">en un pico</span></h1>
<div class="card amber in" data-say="ochenta">
  <p class="label">Margen del último trimestre</p>
  <div class="line"><span class="name">{logo("MU")} Micron<small>Bruto · hasta el 3-9-2026</small></span><span class="fig">86,8 %</span></div>
  <div class="line"><span class="name">{logo("SNDK")} Sandisk<small>Bruto · hasta el 2-10-2026</small></span><span class="fig">85,0 %</span></div>
  <div class="line"><span class="name">{logo("000660.KS")} SK Hynix<small>Operativo · 3.er trimestre de 2026</small></span><span class="fig">80 %</span></div>
</div>
<div class="card down in" data-say="veintitrés">
  <p class="label">El último bajón · {logo("MU")} Micron, ejercicio 2023</p>
  <div class="line" data-say="mitad"><span class="name">Ventas</span><span class="fig r">−49,5 %</span></div>
  <div class="line fade" data-say="perdió"><span class="name">Resultado</span><span class="fig r">−5.830 M$</span></div>
</div>
""")

# 08 - the spending
slide("08-spending", "Reason two: the spending, Nvidia's customer concentration and Alphabet's debt", "grid", f"""<p class="kicker red in">Sus motivos · 2</p>
<h1 class="small in">El <span class="y">gasto</span></h1>
<div class="card amber in" data-say="ochocientos">
  <p class="label">Inversión prevista en 2026</p>
  <h2>803.000–828.000 M$</h2>
  <p class="note">Amazon, Alphabet, Meta, Microsoft y SpaceX · Business Insider, 30-10-2026</p>
</div>
<div class="card in" data-say="clientes">
  <div class="line"><span class="name">{logo("NVDA")} Nvidia<small>Sus 3 mayores clientes, 1.er semestre</small></span><span class="fig">44 %</span></div>
  <div class="line fade" data-say="deuda"><span class="name">{logo("GOOGL")} Alphabet<small>Deuda a largo plazo, M$</small></span><span class="fig r">46.500 → 125.100</span></div>
</div>
""", extra=".line .fig { font-size: 50px; } .card.amber h2 { font-size: 66px; white-space: nowrap; } .card { padding: 38px 36px; }")

# 09 - time and the price of calm
slide("09-time", "Reason three: value lies in far-off profits; Coca-Cola in 2040 is easy to picture, memory in 2030 is not", "city", f"""<p class="kicker red in">Sus motivos · 3</p>
<h1 class="small in">La tranquilidad <span class="y">se paga</span></h1>
<div class="card amber in" data-say="vale">
  <p class="label">Lo que vale una acción</p>
  <h2>Depende de beneficios de dentro de muchos años</h2>
</div>
<div class="pair">
  <div class="card in" data-say="coca">
    <p class="label">{logo("KO")} En 2040</p>
    <h2>Te la imaginas</h2>
  </div>
  <div class="card down in" data-say="memoria">
    <p class="label">La memoria en 2030</p>
    <h2>Nadie lo sabe</h2>
  </div>
</div>
<div class="card paper in" data-say="cara">
  <p class="label">Veces el beneficio esperado</p>
  <h2>Clásica típica: <span class="y">{es(med["classic"]["pe_ntm"])}x</span><br>Tecnológica típica: {es(med["ai"]["pe_ntm"])}x</h2>
</div>
""")

# 10 - the verdict
slide("10-verdict", "The verdict: tech is asked for perfection, defensives are forgiven almost everything", "candles", f"""<p class="kicker in">Mi lectura</p>
<div class="pair">
  <div class="card amber in" data-say="exige">
    <p class="label">A las tecnológicas</p>
    <h2>Se les exige la perfección</h2>
  </div>
  <div class="card in" data-say="perdona">
    <p class="label">A las defensivas</p>
    <h2>Se les perdona casi todo</h2>
  </div>
</div>
<div class="card paper in" data-say="apuesta">
  <h2>{es(med["classic"]["pe_ntm"], 0)} veces el beneficio por crecer un {es(med["classic"]["eps_growth_next_fy_pct"], 0)} % también es <span class="y">una apuesta</span></h2>
</div>
<span class="sticker small pop" data-say="tranquila">Solo que parece más tranquila</span>
""", main=" center")

# 11 - the debate
slide("11-debate", "Is it an opportunity? For and against, and the question that decides it", "tape", """<p class="kicker in">¿Una oportunidad?</p>
<div class="pair">
  <div class="card up in" data-say="favor">
    <p class="label">A favor</p>
    <p class="lead fade" data-say="crecen">Crecen más</p>
    <p class="lead fade" data-say="ganan">Ganan más</p>
    <p class="lead fade" data-say="cuestan">Cuestan menos</p>
  </div>
  <div class="card down in" data-say="contra">
    <p class="label">En contra</p>
    <p class="lead fade" data-say="ciclo">El ciclo puede girar</p>
    <p class="lead fade" data-say="frena">El gasto, frenarse</p>
    <p class="lead fade" data-say="barato">Lo barato, dejar de serlo</p>
  </div>
</div>
<span class="sticker tag pop" data-say="duran">¿Cuánto duran estos beneficios?</span>
""", main=" center", extra=".pair p.lead { font-size: 46px; } .pair .card { padding: 40px 34px; gap: 22px; } body.essay .sticker.tag { font-size: 44px; }")

# 12 - the closing question
slide("12-question", "The closing question; Nvidia reports on 17 November", "plain", f"""<p class="kicker in">¿Y tú qué ves?</p>
<div class="answers">
  <span class="sticker pop" data-say="exigente">Exigente</span>
  <em class="fade" data-say="o">o</em>
  <span class="sticker green pop" data-say="prudente">Prudente</span>
</div>
<div class="card in" data-say="ves">
  <p class="label">{logo("NVDA")} Próximo examen</p>
  <h2>Nvidia presenta resultados el 17 de noviembre</h2>
</div>
<div class="mark in" data-say="comentarios"><img src="../../../channel/instagram-profile.jpg" alt=""><span>Te leo en comentarios</span></div>
""", main=" center")
print("ok")
