# ¿Son más baratas las de IA que las clásicas? (reel A fondo)

Reel de reflexión ("A fondo"), en español, voz `reflexion`, aspecto de ensayo. Carpeta
`reels/2026-11-03-ai-cheaper-than-classics/`.

## La idea

El usuario (2026-11-03): comparar algunas de las empresas de IA, semis y centros de datos más
importantes y castigadas (Nvidia, Micron, Sandisk, SK Hynix, Google, Meta) con empresas más
clásicas (Walmart, Coca-Cola, Eli Lilly…), defender que las primeras son objetivamente más baratas
si se tiene en cuenta su crecimiento y sus números, reflexionar sobre por qué el mercado las ve
así y valorar si puede ser una oportunidad.

## Las clásicas, y por qué estas

Walmart (WMT), Coca-Cola (KO), Costco (COST) y Procter & Gamble (PG): las grandes "defensivas" de
EE. UU. (consumo básico y distribución), las que se compran por estabilidad y que todo el mundo
conoce. Son el contraste natural para una tesis sobre cuánto se paga por la tranquilidad.

Eli Lilly se estudió (su BPA crecería un 41 % y cotiza a un PER a doce meses de 29,8: PEG de 0,72)
y **el usuario la quitó** (2026-11-03): no es una defensiva sino una farmacéutica en pleno
crecimiento, y mezclaba dos tesis. Sus datos no se guardan en `data/`.

## Cómo se mide (para comparar empresas con años fiscales distintos)

Todo de Yahoo Finance (yfinance, la misma fuente que el resto de Market Hub), leído el
2026-11-03; lo leído está en `data/yahoo-*.json` y el cálculo en `data/comparison.json`.

- **PER a doce meses**: el último cierre entre el beneficio por acción (BPA) que esperan los
  analistas para los próximos doce meses, ponderando el ejercicio en curso por los meses que le
  quedan y el siguiente por el resto (como hace FactSet con el S&P 500). Hace falta porque los
  ejercicios no coinciden: Nvidia y Walmart cierran en enero, Micron y Costco a finales de agosto,
  Sandisk y P&G en junio y julio, el resto en diciembre.
- **Crecimiento esperado**: el del BPA medio de consenso del ejercicio siguiente frente al actual
  (Yahoo, `earnings_estimate`). **PEG** = PER a doce meses entre ese crecimiento en %.
- **Rentabilidad del flujo de caja libre**: el flujo de caja libre de los cuatro últimos
  trimestres publicados entre la capitalización. En SK Hynix, Yahoo aún no tiene el tercer
  trimestre de 2026: llega hasta junio.
- **Caída desde máximos**: último cierre frente al cierre más alto del último año. SK Hynix cotiza
  en Seúl, en wones: todo lo suyo se compara en wones con wones (ratios y porcentajes), nunca con
  dólares.

## Los números (Yahoo Finance, cierres del 2026-11-02; SK Hynix, del 2026-11-03 en Seúl)

| Empresa | Precio (día) | Desde máx. 1 año | 1 año | PER 12 m | BPA esperado, este ejercicio / próximo | Ventas, este / próximo | PEG (próximo) | Margen operativo | Margen neto | Rent. FCF (4 trim.) | EV/EBITDA | Caja neta / capitalización |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| NVDA | 202,06 USD (2026-11-02) | -15,5 % (máx. 2026-10-06) | -2,3 % | 14,2 | 95,2 % / 70,9 % | 90,6 % / 68,2 % | 0,20 | 66,2 % | 63,7 % | 2,6 % | 24,1 | 0,5 % |
| MU | 833,59 USD (2026-11-02) | -31,3 % (máx. 2026-06-25) | 255,2 % | 4,6 | 133,7 % / 17,7 % | 106,8 % / 16,2 % | 0,26 | 80,7 % | 63,8 % | 6,2 % | 8,3 | 4,1 % |
| SNDK | 1.075,08 USD (2026-11-02) | -54,0 % (máx. 2026-06-25) | 419,3 % | 4,3 | 221,4 % / 26,1 % | 144,8 % / 22,3 % | 0,17 | 79,6 % | 67,0 % | 7,5 % | 7,0 | 3,3 % |
| 000660.KS | 1.398.000 KRW (2026-11-03) | -52,1 % (máx. 2026-06-22) | 125,5 % | 2,8 | 494,8 % / 47,4 % | 274,6 % / 58,8 % | 0,06 | 79,7 % | 70,3 % | 9,2 % | 4,5 | 10,0 % |
| GOOGL | 278,99 USD (2026-11-02) | -30,7 % (máx. 2026-05-13) | -1,7 % | 17,9 | 82,3 % / -24,9 % | 24,0 % / 27,0 % | – | 31,8 % | 50,0 % | 0,6 % | 18,0 | 3,3 % |
| META | 606,73 USD (2026-11-02) | -22,0 % (máx. 2026-09-24) | -4,9 % | 18,3 | 24,0 % / 16,5 % | 27,8 % / 21,6 % | 1,11 | 35,4 % | 31,1 % | 1,9 % | 13,6 | -2,1 % |
| WMT | 127,69 USD (2026-11-02) | -4,9 % (máx. 2026-05-19) | 25,7 % | 40,6 | 9,3 % / 11,8 % | 6,6 % / 4,3 % | 3,45 | 3,5 % | 3,0 % | 1,3 % | 24,6 | -6,3 % |
| KO | 95,83 USD (2026-11-02) | 0,0 % (máx. 2026-11-02) | 41,0 % | 27,4 | 11,3 % / 5,6 % | 5,0 % / -3,1 % | 4,89 | 33,4 % | 28,7 % | 3,5 % | 25,2 | -6,3 % |
| COST | 1.040,55 USD (2026-11-02) | -4,9 % (máx. 2026-05-19) | 12,1 % | 44,9 | 9,9 % / 9,9 % | 8,7 % / 7,4 % | 4,51 | 3,8 % | 3,0 % | 2,0 % | 31,7 | 2,4 % |
| PG | 163,56 USD (2026-11-02) | -2,2 % (máx. 2026-02-27) | 10,5 % | 23,0 | 1,3 % / 6,0 % | 3,1 % / 3,1 % | 3,84 | 26,9 % | 18,2 % | 4,0 % | 16,1 | -6,2 % |

Márgenes, EV/EBITDA, deuda y caja: los de Yahoo (`info`), de los últimos doce meses.

## La valoración conjunta (medianas de cada grupo, `data/comparison.json`)

| | Seis tecnológicas | Cuatro defensivas |
|---|---|---|
| PER a 12 meses | 9,4 | 34,0 |
| Crecimiento esperado del BPA, próximo ejercicio | +21,9 % | +8,0 % |
| PEG | 0,20 | 4,17 |
| Crecimiento de ventas, próximo ejercicio | +24,7 % | +3,7 % |
| Margen operativo (12 meses) | 72,9 % | 15,4 % |
| Rentabilidad del flujo de caja libre | 4,4 % | 2,8 % |
| Desde el máximo de un año | −31,0 % | −3,6 % |
| En un año | +61,9 % | +18,9 % |

La mediana se usa para que un caso extremo (los 2,8 de SK Hynix, o el −25 % de Alphabet, inflado
por sus revalorizaciones) no mueva el resultado del grupo. En el reel se dice "la típica".

## La tesis (la del usuario, 2026-11-03)

"El mercado parece muy exigente con el sector de la IA, y eso se respalda cuando lo comparas con
las defensivas." Un reel de reflexión que se moja, con Julián a ratos algo irónico (tres frases
marcadas con `[con un punto de ironía]`, que ElevenLabs v3 lee como indicación de tono).

**Lo que la respalda:** con cualquier medida de las de arriba salvo la del último año, las
tecnológicas crecen más, ganan más por cada dólar vendido y cotizan a menos veces su beneficio;
aun así están un 31 % por debajo de su máximo, y las defensivas, en máximos (Coca-Cola, el más alto
del año el 2 de noviembre, +41 % en un año). En octubre Coca-Cola, Visa y Mastercard marcaron
récords "mientras los inversores salen de los chips" (Dow Jones, 17-10-2026).

**Lo que el reel cuenta aunque no la respalde** (para que la tesis sea honesta):

1. **La memoria está en un pico de ciclo**: margen bruto del 86,8 % en Micron (trimestre hasta el
   3-9-2026) y del 85,0 % en Sandisk (hasta el 2-10-2026); margen operativo del 80 % en SK Hynix
   (3.er trimestre de 2026; exactamente 79,7 %). En 2023 Micron vendió un 49,5 % menos y perdió
   5.830 M$; SK Hynix perdió 7,73 billones de wones en el negocio. Su PER de 3 a 5 es el típico
   de una cíclica en lo alto.
2. **La memoria venía de multiplicarse**: en un año Sandisk sube un 419 %, Micron un 255 % y SK
   Hynix un 126 %, aunque desde junio pierdan un 54 %, un 31 % y un 52 %.
3. **El gasto**: Amazon, Alphabet, Meta, Microsoft y SpaceX invertirán entre 803.000 y 828.000 M$
   en 2026 (Business Insider, 30-10-2026). Tres clientes directos fueron el 16 %, el 15 % y el 13 %
   de las ventas de Nvidia en el primer semestre de su ejercicio 2027 (10-Q). La deuda a largo
   plazo de Alphabet pasó de 46.500 M$ a 125.100 M$ entre diciembre y septiembre (10-Q del tercer
   trimestre).
4. **El tiempo y el valor terminal**: lo que vale una acción depende de beneficios lejanos, y los
   de Coca-Cola se imaginan mejor que los de la memoria. Esa tranquilidad se paga.

**Lo que se sabe y no entra en el reel, por tiempo:**

- En caja, Alphabet (0,6 %) y Meta (1,9 %) no son más baratas que Coca-Cola (3,5 %) o P&G
  (4,0 %): el gasto se come su flujo de caja (Alphabet, −9.065 M$ en el tercer trimestre). La
  mediana del grupo (4,4 %) la sube la memoria.
- El beneficio operativo de Meta del tercer trimestre cayó un 37 % por un cargo legal de 9.890 M$
  (el acuerdo con 52 fiscales generales); sin él habría sido de 22.880 M$, frente a 20.535 M$
  (8-K del 21-10-2026).
- El beneficio de 2026 de Alphabet está inflado por revalorizaciones de sus participaciones
  (36.900 M$ en el primer trimestre y 99.000 M$ en el segundo; Anthropic y SpaceX, según
  Fortune): por eso su PER se toma a doce meses vista, sobre 2027.
- Por qué cae la memoria desde junio (CNBC, 7-7, 13-10, 15-10 y 30-10-2026; Yahoo Finance,
  28-7-2026): expectativas altísimas, el pico del ciclo (TrendForce, 30-9-2026: la subida de
  precios de DRAM se modera), la competencia china (CXMT), la capacidad nueva hacia 2028-2029 y
  las dudas sobre el gasto en IA y su financiación. Los resultados siguen superando previsiones.

## La voz

Julián dice los nombres de las empresas como en inglés (el usuario, 2026-11-03: "Maicron, no
Micron"): en la narración del guion se escriben como suenan (Máicron, Uólmart, Envidia, Es Kei
Jáinix, Sándisk, Álfabet), y en pantalla, el pie y X van bien escritos. Coca-Cola se queda como se
dice en España. Dicha con v3, la voz terminaba cada escena a pleno volumen, cortando la última
sílaba, y se oía como un corte al cambiar de diapositiva. Se probó a pedirla frase a frase y quedó
en una versión intermedia; la final es con ElevenLabs v4 (el usuario, 2026-11-03), que dice cada
escena de un tirón y la acaba entera. Además, en los reels, cada diapositiva se funde en la
siguiente (`[reel] crossfade`) y cada voz baja a cero en sus últimas centésimas.

## ¿Oportunidad? (debate, sin recomendar)

A favor: crecen más, ganan más y cuestan menos. En contra: si el ciclo de la memoria gira o el
gasto se frena, esos beneficios se encogen y lo barato deja de serlo. La pregunta que lo decide:
cuánto duran estos beneficios. Ni compra ni venta ni precios objetivo.

## Fuentes que se leyeron y no salen en el guion

- Meta, resultados del tercer trimestre de 2026 (8-K) | https://www.sec.gov/Archives/edgar/data/1326801/000162828026066700/meta-09302026xexhibit991.htm
- Alphabet, resultados del primer, segundo y tercer trimestre de 2026 (8-K) | https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm
- Fortune, 22-7-2026: las ganancias de Alphabet por Anthropic y SpaceX | https://www.fortune.com/2026/07/22/anthropic-spacex-investments-google-earnings-biggest-ever-profit-quarter/
- SK Hynix, resultados de 2023 (PR Newswire) | https://technode.global/prnasia/sk-hynix-reports-financial-results-for-2023-4q23/
- TrendForce, 30-9-2026: precios de la DRAM y la NAND del cuarto trimestre | https://www.trendforce.com/presscenter/news/20260930-13258.html
- CNBC, 13-10-2026: la memoria cae por CXMT | https://www.cnbc.com/2026/10/13/sk-hynix-softbank-samsung-electronics-shares-tech-stocks-fall.html
- Yahoo Finance, 28-7-2026: Micron y SK Hynix caen | https://finance.yahoo.com/markets/article/micron-sk-hynix-stocks-sink-as-ai-chip-sell-off-deepens-125622548.html
- Eli Lilly, resultados del tercer trimestre de 2026 (8-K) | https://www.sec.gov/Archives/edgar/data/0000059478/000005947826000104/q326lillysalesandearningsp.htm

## Cómo se repite

`data/fetch_fundamentals.py` (lee Yahoo con yfinance; se lanzó desde `fundamentals-lab`, que lo
tiene instalado), `data/compare.py` (la tabla y las medianas) y `data/make_slides.py` (escribe
las diapositivas con las cifras de `data/comparison.json`). Se lanzan con la carpeta del reel
como argumento.
