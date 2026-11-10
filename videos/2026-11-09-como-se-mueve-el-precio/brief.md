# Quién pone el precio en la bolsa, y por qué no se está quieto

La versión larga, para YouTube, del reel `reels/2026-11-09-como-se-mueve-el-precio/` (skill `long-video`). El reel dijo una
cosa en 90 segundos; este vídeo cuenta el tema entero en 10 a 12 minutos, en español, con la voz y
el aspecto del reel.

## Lo que pidió el usuario

El reel (2026-11-09): «Quiero que hagas un vídeo sobre cómo funcionan los precios de la bolsa y el
por qué de las oscilaciones. Para instagram un reel y para Youtube. Quiero que hagas un estilo
completamente nuevo y que sea muy adictivo e innovador y sea muy didactico e ilustrativo». Pidió
después «otro aspecto mucho más pro» y validó el que salió, «El libro». El vídeo largo: «Sí, hazlo».

## La pregunta del vídeo

Quién pone el precio de una acción, por qué ese precio se mueve aunque no pase nada en la empresa
y cuánto movimiento es normal.

## Qué añade al reel

El reel enseñó la subasta: dos colas, la horquilla, el último trato. El vídeo cuenta lo que no cupo:

- Las dos órdenes (a mercado y limitada) y cuántas acciones deciden el precio de todas: en Nvidia,
  el lunes 9, menos del 2 % de las que existen.
- Por qué «más compradores que vendedores» no puede ser, y qué pasa cuando la cola de órdenes se
  queda vacía: el 6 de mayo de 2010, con el informe de la SEC y la CFTC.
- Por qué nadie sabe cuánto vale una empresa: Shiller (1981), Cutler, Poterba y Summers (1988), el
  concurso de Keynes (1936) y por qué unos resultados récord pueden acabar en caída.
- Dónde ocurre: dieciocho bolsas, la mitad del volumen fuera de ellas, y las subastas de apertura y
  de cierre.
- Cuánto es normal, con todos los cierres del S&P 500 desde 1950: una sesión de cada cinco se
  mueve un 1 % o más, los días fuertes vienen juntos, 57 caídas del 4 % o más, los frenos de
  después de 1987 y la caída media de cada año.
- La objeción del casino y lo que responde la nota del Nobel de 2013.

## Las decisiones

- **El aspecto es el del reel, «El libro», en horizontal** (`slides/look/`): la misma máquina del
  precio (la cinta, la regla, las órdenes) vuelve en siete escenas; el resto dibuja la cosa de la
  que se habla (cuadrícula de acciones, colas, gráficos con las cifras de `data/figures.json`).
- **El ejemplo de los euros es inventado y lo dice** en cada escena en que sale.
- **Keynes y la nota del Nobel se cuentan con palabras propias**, no se citan.
- **Nvidia sale solo como ejemplo de cuántas acciones cambian de manos**; su caída del lunes es de
  otro vídeo y aquí no se comenta.
- «Hoy» se cambió por «el lunes» al pasar de las doce de la noche del 9: el vídeo se verá otro día.
- La escena del 6 de mayo de 2010 es un esquema y lo dice: no hay serie de minutos en las fuentes.

## Los hechos nuevos

Cada uno está, con su dirección, en `sources` del guion; lo leído y las cuentas, en `data/`
(`figures.json` sale de los archivos de Yahoo, Cboe y la SEC que hay al lado; `sources.md` dice qué
se tomó de cada documento).

- 19.335 sesiones del S&P 500 desde el 3 de enero de 1950; 4.035 con un movimiento del 1 % o más (20,9 %) | https://finance.yahoo.com/quote/%5EGSPC/history/
- 3 días así en 1964 y 134 en 2008; +11,58 % el 13 de octubre de 2008 y -9,03 % el 15 | https://finance.yahoo.com/quote/%5EGSPC/history/
- 57 caídas del 4 % o más; la peor, -20,47 % el 19 de octubre de 1987 | https://finance.yahoo.com/quote/%5EGSPC/history/
- Caída media de cada año desde su máximo, 1980 a 2025: 14,1 %; 35 de 46 años en positivo; 2020: -33,9 % y +16,3 % en el año | https://finance.yahoo.com/quote/%5EGSPC/history/
- Nvidia: 24.100 millones de acciones a 21 de agosto de 2026 | https://data.sec.gov/api/xbrl/companyconcept/CIK0001045810/dei/EntityCommonStockSharesOutstanding.json
- Nvidia: unos 457 millones de acciones negociadas el 9 de noviembre de 2026, el 1,90 % | https://finance.yahoo.com/quote/NVDA/
- Octubre de 2026 en EE. UU.: 17.310 millones de acciones y 124,3 millones de operaciones al día, el 50,0 % fuera de las bolsas; 18 bolsas | https://www.cboe.com/us/equities/market_statistics/historical_market_volume/
- 6 de mayo de 2010: la venta de 75.000 contratos E-Mini, la profundidad de compra y las operaciones anuladas | https://www.sec.gov/news/studies/2010/marketevents-report.pdf
- Shiller: la volatilidad de los precios, de cinco a trece veces la que justifican los dividendos | https://www.aeaweb.org/aer/top20/71.3.421-436.pdf
- Cutler, Poterba y Summers: las noticias explican como mucho un tercio de la varianza | https://www.nber.org/papers/w2538
- Frenos del mercado: 7 %, 13 % y 20 % | https://www.investor.gov/introduction-investing/investing-basics/glossary/stock-market-circuit-breakers
- Nobel de Economía de 2013: imprevisible a días o semanas, previsible a tres o cinco años | https://www.nobelprize.org/prizes/economic-sciences/2013/press-release/

## La mejor objeción

Que si nadie sabe cuánto vale una empresa y el precio lo mueve quien tiene prisa, la bolsa es un
casino. El vídeo la da por razonable a pocos días (la nota del Nobel de 2013 dice que el precio no
se puede predecir a días o semanas) y cuenta lo que la separa de una ficha: detrás hay una empresa
que vende y gana dinero. Y añade su propio contrapeso: de 1950 a hoy es historia y no una promesa,
con la década de 1999 a 2009 en que el índice no avanzó.

## Los capítulos

1. El jueves y el lunes: la caída del 4,36 %, la subida del 2,35 %, las mismas quinientas empresas,
   y las dos preguntas del vídeo.
2. La subasta: las dos colas, la horquilla, el trato, el último precio, las dos órdenes y los pocos
   que ponen precio a todos (Nvidia).
3. La prisa: por qué no hay «más compradores que vendedores», el precio escalón a escalón, la cola
   vacía y el 6 de mayo de 2010.
4. Nadie sabe cuánto vale: los beneficios que no existen todavía, las noticias, Shiller, los días
   sin noticia, el concurso de Keynes y las expectativas.
5. Dónde ocurre: dieciocho bolsas, la mitad fuera, el volumen de un día y la subasta de cierre.
6. Cuánto es normal: una de cada cinco sesiones, años tranquilos y años revueltos, las caídas del
   4 %, 1987, los frenos y la caída de cada año.
7. ¿Un casino?: la objeción, el Nobel de 2013, la empresa detrás de la acción, 1950 a hoy, la
   década perdida, el lunes otra vez, el repaso y la pregunta.
