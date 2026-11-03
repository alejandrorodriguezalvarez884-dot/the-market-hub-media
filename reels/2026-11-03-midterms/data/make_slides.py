"""Write this reel's slides (slides/*.html): one page per scene, all in the broadcast look of
slides/midterms.css. Every figure here comes from data/ (Yahoo, Polymarket) or a source in
script.md."""
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
HEAD = """<!doctype html>
<!-- {what} -->
<html lang="es">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="midterms.css">
</head>
<body>
"""
FOOT = """{extra}<script src="../../../theme/reel.js"></script>
<script src="midterms.js"></script>
</body>
</html>
"""

SLIDES = {
"01-hook": ("Hook: 20 of 20 midterms since 1946, the S&P 500 was higher a year later", "", """
<main class="stage">
<div class="special"><span class="sp">Especial</span><b>Midterms <i>elections</i></b><span class="flagline"></span></div>
<div class="big mid slam" data-say="veinte"><span class="g">20</span><span class="m"> de </span>20</div>
<p class="title mid rise" data-say="elecciones">Elecciones de <span class="y">mitad de mandato</span></p>
<div class="boxes tight" data-say="cuarenta"></div>
<p class="note show" data-say="bolsa">S&amp;P 500 más alto 12 meses después de votar en las 20 midterms desde 1946 (en 1946, solo un 0,07 %). Cálculo con Yahoo Finance.</p>
<p class="title small rise" data-say="hoy">Hoy se vota <span class="y">otra vez</span></p>
</main>
"""),
"02-house": ("The House: 435 seats, a narrow Republican majority, Democrats need 3", "", """
<main class="stage">
<p class="tag wipe" data-say="0">Cámara de Representantes</p>
<p class="title rise" data-say="camara"><span class="y">435</span> escaños</p>
<div class="chamber narrow" data-seats="435" data-say="cuatrocientos" data-mid="218 = MAYORÍA" data-say-mid="controlan"></div>
<div class="panel split rise" data-say="controlan"><h3>Antes de votar</h3>
<p class="line1">Mayoría <span class="p">republicana</span> estrecha</p>
<p class="line1 show" data-say="bastan">A los <span class="d">demócratas</span> les bastan <span class="y">3</span></p></div>
<p class="note">Fox News y CBS News, 3 de noviembre de 2026.</p>
</main>
"""),
"03-senate": ("The Senate: 35 seats up, 53 Republicans and 47 Democrats, Democrats need 4", "", """
<main class="stage">
<p class="tag wipe p" data-say="0">Senado</p>
<p class="title rise" data-say="treinta"><span class="y">35</span> de 100 escaños</p>
<div class="chamber narrow" data-seats="100" data-d="47" data-p="53" data-up-d="13" data-up-p="22" data-say="republicanos"></div>
<div class="legend rise" data-say="cincuenta"><div><b class="d">47</b><span>Demócratas*</span></div><div class="right"><b class="p">53</b><span>Republicanos</span></div></div>
<div class="panel d rise" data-say="necesitan"><p class="title small">A los <span class="d">demócratas</span> les faltan <span class="y">4</span></p>
<p class="note">Con borde dorado, los 35 que se votan: 22 republicanos y 13 demócratas. *Incluye 2 independientes. 270toWin y Fox News.</p></div>
</main>
"""),
"04-odds": ("What is expected: polls and Polymarket", "", """
<main class="stage">
<p class="tag wipe" data-say="0">Lo que se espera</p>
<div class="panel d rise" data-say="encuestas"><h3>Encuestas · voto al Congreso</h3>
<p class="big small"><span class="d">D +8,9</span> <span class="m">puntos</span></p>
<p class="note">Media de Silver Bulletin, 2 de noviembre.</p></div>
<div class="panel split rise" data-say="polymarket"><h3>Polymarket · hoy, 14:53 (España)</h3>
<div class="odds"><div class="names"><span>Cámara · demócratas</span><span>republicanos</span></div>
<div class="track"><i class="d" style="width:94.5%" data-say="noventa"></i><i class="p" style="width:5.5%" data-say="noventa"></i></div>
<div class="figs show" data-say="noventa"><span class="d">94,5 %</span><span class="p">5,5 %</span></div></div>
<div class="odds"><div class="names"><span>Senado · demócratas</span><span>republicanos</span></div>
<div class="track"><i class="d" style="width:77.5%" data-say="setenta"></i><i class="p" style="width:22.5%" data-say="setenta"></i></div>
<div class="figs show" data-say="setenta"><span class="d">77,5 %</span><span class="p">22,5 %</span></div></div>
</div>
</main>
"""),
"05-priced": ("What the stock market prices: a 0.8% move expected for Wednesday", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">Lo que descuenta la bolsa</p>
<p class="title rise" data-say="opciones">Mañana, <span class="y">±0,8 %</span></p>
<div class="bars">
<div class="b hot" data-say="cero"><span>El miércoles</span><div style="--w:60%"><i class="y"></i><em class="y">±0,8 %</em></div></div>
<div class="b" data-say="normal"><span>Un día normal</span><div style="--w:45%"><i class="dim"></i><em>±0,6 %</em></div></div>
</div>
<p class="note">Movimiento que descuentan las opciones del S&amp;P 500, arriba o abajo; un día normal es la media del último mes. ORATS, en Reuters, 3 de noviembre.</p>
</main>
"""),
"06-year": ("The midterm year: an 18% average fall within the year; 2026, 9.1%", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">Lo que dice la historia</p>
<p class="title mid rise" data-say="midterms">El año de midterms <span class="y">da sustos</span></p>
<div class="bars">
<div class="b" data-say="dieciocho"><span>Caída media en el año</span><div style="--w:72%"><i class="r"></i><em class="r">−18 %</em></div></div>
<div class="b hot" data-say="nueve"><span>2026, peor caída</span><div style="--w:36%"><i class="r"></i><em class="r">−9,1 %</em></div></div>
<div class="b hot" data-say="sube"><span>2026, en el año</span><div style="--w:41%"><i class="g"></i><em class="g">+10,2 %</em></div></div>
</div>
<p class="note">S&amp;P 500. Caída del máximo al mínimo dentro de cada año de midterms, 1946-2022 (CFRA da el mismo 18 %). 2026: del 27 de enero al 30 de marzo; en el año, hasta el cierre del 2 de noviembre. Yahoo Finance.</p>
</main>
"""),
"07-smile": ("The 20 midterms on one chart: down to a low a month before the vote, then up", '<script src="../data/path.js"></script>\n', """
<main class="stage">
<p class="tag wipe" data-say="0">S&amp;P 500 · 20 midterms desde 1946</p>
<p class="title mid rise" data-say="dibujo">Primero baja… <span class="y">luego sube</span></p>
<div class="chart" data-show="paths now mean low" data-say-paths="juntas" data-say-now="dibujo" data-say-mean="dibujo" data-say-low="fondo" data-height="640"></div>
<p class="note show" data-say="dibujo">Cada línea, una midterm (100 = el cierre antes de votar). En dorado, la media. Punteado, 2026 hasta ayer. Yahoo Finance.</p>
</main>
"""),
"08-after": ("After the vote: higher 18, 19 and 20 times of 20 at 3, 6 and 12 months", "", """
<main class="stage">
<p class="tag wipe" data-say="0">Después de votar · S&amp;P 500</p>
<p class="title rise" data-say="tres">Al año, <span class="g">20 de 20</span></p>
<div class="panel rise" data-say="tres"><div class="legend"><div><span>3 meses después</span><b class="g">+7,8 %</b></div><div class="right"><span>En positivo</span><b>18/20</b></div></div></div>
<div class="panel rise" data-say="seis"><div class="legend"><div><span>6 meses después</span><b class="g">+13,6 %</b></div><div class="right"><span>En positivo</span><b>19/20</b></div></div></div>
<div class="panel rise" data-say="ano"><div class="legend"><div><span>1 año después</span><b class="g">+14,7 %</b></div><div class="right"><span>En positivo</span><b class="y">20/20</b></div></div></div>
<p class="note">Subida media de las 20 midterms desde 1946, desde el cierre antes de votar. Solo precio, sin dividendos. Yahoo Finance.</p>
</main>
"""),
"09-cycle": ("The presidential cycle: year 2 the weakest, year 3 the best", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">El ciclo del mandato · desde 1949</p>
<p class="title mid rise" data-say="segundo">El 2.º año, <span class="y">el más flojo</span></p>
<div class="bars">
<div class="b" data-say="ciclo"><span>Año 1</span><div style="--w:30%"><i class="dim"></i><em>+8,5 %</em></div></div>
<div class="b hot" data-say="segundo"><span>Año 2 · midterms</span><div style="--w:16%"><i class="y"></i><em class="y">+4,6 %</em></div></div>
<div class="b hot" data-say="tercero"><span>Año 3</span><div style="--w:60%"><i class="g"></i><em class="g">+17,2 %</em></div></div>
<div class="b" data-say="tercero+0.5"><span>Año 4</span><div style="--w:28%"><i class="dim"></i><em>+8,1 %</em></div></div>
</div>
<p class="note">S&amp;P 500, media de cada año natural del mandato, 1949-2025 (19 o 20 años de cada uno). Solo precio. Yahoo Finance. 2026 es el año 2 del mandato actual; 2027, el 3.</p>
</main>
"""),
"10-split": ("Divided government: 9.9% a year against 8% with one party (Carson)", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">¿Y si el poder se reparte?</p>
<p class="title rise" data-say="repartido">Gobierno <span class="d">divi</span><span class="p">dido</span></p>
<div class="bars">
<div class="b hot" data-say="dividido"><span>Gobierno dividido</span><div style="--w:50%"><i class="y"></i><em class="y">+9,9 %</em></div></div>
<div class="b" data-say="partido"><span>Un solo partido</span><div style="--w:40%"><i class="dim"></i><em>+8,0 %</em></div></div>
</div>
<p class="note">S&amp;P 500, rentabilidad media anual de 1951 a 2023. Carson Investment Research, en CNBC (7 de noviembre de 2024).</p>
</main>
"""),
"11-caution": ("Only 20 cases: 2002 was still down 7% three months later; the past is no promise", "", """
<main class="stage center">
<p class="title slam" data-say="ojo">Solo <span class="y">20</span> casos</p>
<div class="panel p rise" data-say="dos"><h3>2002 · 3 meses después de votar</h3><p class="big small r">−7,1 %</p></div>
<div class="panel rise" data-say="promesa"><p class="title mid">Lo que pasó <span class="y">no es una promesa</span></p></div>
<p class="note">S&amp;P 500 desde el cierre antes de votar. Yahoo Finance.</p>
</main>
"""),
"12-jpmorgan": ("JPMorgan's most likely scenario: Democrats take both chambers, -0.25% to +0.5%", "", """
<main class="stage">
<p class="tag wipe" data-say="0">Según JPMorgan · 4 escenarios</p>
<p class="title mid rise" data-say="probable">Lo más probable: <span class="d">demócratas</span> en las dos</p>
<div class="scen top rise" data-say="ganan"><div class="who"><i class="d">CÁM</i><i class="d">SEN</i></div>
<div class="what">Demócratas, Cámara y Senado<small>66 % de probabilidad</small></div>
<div class="fig show" data-say="bajar">−0,25 a +0,5 %<small>S&amp;P 500</small></div></div>
<div class="panel rise" data-say="miedo"><h3>El riesgo que ve</h3><p class="title small">Que se regule la <span class="y">IA</span></p>
<p class="note">Aunque cree que un veto de Trump lo frenaría.</p></div>
<p class="note">Mesa de trading de JPMorgan, en CNBC (2 nov) e investingLive (3 nov). Probabilidades de los mercados de predicción de Bloomberg, 1 nov. No dan un plazo.</p>
</main>
"""),
"13-scenarios": ("JPMorgan's four scenarios and the S&P 500's move in each", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">Según JPMorgan · S&amp;P 500 en cada caso</p>
<div class="scen top"><div class="who"><i class="d">CÁM</i><i class="d">SEN</i></div>
<div class="what">Demócratas, las dos<small>66 %</small></div><div class="fig">−0,25 a +0,5 %</div></div>
<div class="scen rise" data-say="camara"><div class="who"><i class="d">CÁM</i><i class="p">SEN</i></div>
<div class="what">Demócratas la Cámara, republicanos el Senado<small>26 %</small></div><div class="fig g">+0,5 a +1 %</div></div>
<div class="scen rise" data-say="mantienen"><div class="who"><i class="p">CÁM</i><i class="p">SEN</i></div>
<div class="what">Republicanos, las dos<small>7 %</small></div><div class="fig g">+1 a +1,25 %</div></div>
<div class="scen rise" data-say="veinticinco+0.6"><div class="who"><i class="p">CÁM</i><i class="d">SEN</i></div>
<div class="what">Republicanos la Cámara, demócratas el Senado<small>1 %</small></div><div class="fig g">+0,25 a +0,75 %</div></div>
<p class="note">Con los republicanos en las dos, JPMorgan prevé más déficit y tipos a largo plazo más altos. Mesa de trading de JPMorgan, en CNBC (2 nov) e investingLive (3 nov).</p>
</main>
"""),
"14-question": ("The question: who wins, or the calendar?", "", """
<main class="stage center">
<p class="tag wipe" data-say="0">Esta noche se cuentan los votos</p>
<p class="title rise" data-say="pesara">¿Qué pesará más en la bolsa?</p>
<div class="versus rise" data-say="gana"><div class="a">Quién gana</div><em>o</em><div class="b">El calendario</div></div>
<p class="title small rise" data-say="comentarios">Te leo en <span class="y">comentarios</span></p>
<div class="mark rise" data-say="comentarios"><img src="../../../channel/instagram-profile.jpg" alt=""><span>@the_market_hub_app</span></div>
</main>
"""),
}

for name, (what, extra, body) in SLIDES.items():
    page = HEAD.format(what=what) + body.strip() + "\n" + FOOT.format(extra=extra)
    (HERE / "slides" / f"{name}.html").write_text(page, encoding="utf-8", newline="\n")
print(len(SLIDES), "slides")
