# Market Hub, el teaser para Instagram

Lo pidió el usuario el 2026-10-13: "un vídeo de presentación de la web para Instagram… algo muy
genérico que genere hype".

**No es un vídeo del canal** (ni presentador, ni diapositivas, ni voz, ni pasa por `make check` o
`make render`) y tampoco es la demo: no explica cómo se usa nada. Es un reel vertical de 25
segundos (1080 × 1920, 30 fps) que enseña **la propia web, como la ve un móvil**, con cortes
rápidos sobre un pulso y unas pocas palabras grandes. `build/reel.mp4`; `build/cover.jpg` es su
carátula ("The whole market. On one page.").

## Qué se ve

| | Escena | Palabras | Página |
|---|---|---|---|
| 0:00 | Apertura | The whole market. **On one page.** | el logo y la regla de Today (izquierda baja, derecha sube) |
| 0:02,5 | 01 Today | Every move of the day. **One scale.** | `/today/`: el reloj y "The numbers are alive", y baja a la regla |
| 0:05,5 | 02 Markets | Every market. **One look.** | `/markets/`: índices y sectores |
| 0:08 | 03 Companies | Any company. **Every number.** | `/quote/?t=NVDA`: precio y gráfico |
| 0:10,5 | 04 News | The news. **Already sorted.** | `/news/`: los filtros y las noticias con su etiqueta |
| 0:13 | 05 Opinion | What it means. **Argued.** | `/opinion/`: las portadas |
| 0:15 | 06 My Hub · demo account | Your portfolio. **Only yours.** | Overview: las cuatro cifras y el gráfico frente al S&P 500 |
| 0:18,5 | 07 AI tools | AI that reads **the reports.** | `/tools/` |
| 0:20,5 | Cierre | Market Hub. All the information. All the power. In your hands. `themarkethub.app`. Free · No investment advice | el logo |

Arriba, la línea del logo cruza el encuadre y su punto avanza con la película. Lo que Instagram
pone encima de un reel (su cabecera y, abajo, el pie y los botones) queda libre: las palabras
están entre los 270 y los 1.500 píxeles.

## Cómo está hecho

- `reel.py shots` fotografía cada página entera a ancho de móvil (390 píxeles, a triple
  densidad) en `build/shots/`. **Lo público es la web desplegada**, cortando la petición que
  refresca las noticias (gasta el crédito del modelo) y el contador de visitas. **My Hub es un
  portal en este equipo** con el mismo código, precios reales, sin claves de modelos y la cuenta
  de demostración de la demo ("Sam Demo", `../2026-10-08-my-hub-demo/capture/seed.py`): la
  configuración `hub-demo` de `.claude/launch.json` del workspace (puerto 8088) y ese `seed.py`
  lanzado contra ella. Si el portal se acaba de arrancar y `seed.py` responde 429 al crear la
  séptima cuenta (el tope es de cinco por hora), se reinicia el portal y se lanza otra vez.
- `reel.html` es el montaje: mueve esas fotografías (la tarjeta entra, se inclina, la página
  baja) y pone las palabras. Qué pasa y cuándo está en `timeline.js`. **El movimiento no se
  graba, se calcula** fotograma a fotograma, como en los vídeos del canal (`marketmedia.frames`).
- `sound.js` es el sonido, **sintetizado entero** (sin grabaciones ni música de nadie) y leído
  de la misma `timeline.js`, así que un corte y su golpe no se separan: un pulso de cuerdas
  graves a 120, un tambor suave en cada tiempo, un acorde por escena, un golpe grave en cada
  corte, medio segundo de silencio bajo una subida antes del cierre, y el cierre en re mayor.
  Es grave y ancho, sin teclas ni campanas agudas, que es lo que el usuario pidió para la
  película de la portada (2026-10-07). Lleva una capa por encima de 250 Hz porque el altavoz de
  un móvil no reproduce lo que hay debajo.
- `reel.py sound` y `reel.py film` lo montan (medio minuto); `reel.py sheet 3.4 16.2` saca los
  fotogramas de esos segundos, para mirarlo sin montarlo.

## Decisiones tomadas al hacerlo (el usuario no las ha visto)

- **En inglés**, como la cuenta de Instagram, su bio y la interfaz de la web.
- **Sin voz**: palabras en pantalla y sonido. Un reel se ve muchas veces sin sonido.
- **La frase del cierre es la suya**, la de la película de la portada.
- **"Free"** lo dicen los términos de la web ("Market Hub is a free site").
- **My Hub lleva escrito "demo account"**: lo que se ve es una cartera inventada, con sus
  ganancias, y no debe leerse como un resultado.
- **Fuera el mapa del S&P 500** de Markets (es de TradingView y lleva los logotipos de las
  empresas) y fuera la tabla "Past returns" de la ficha (el +918 % a cinco años de NVIDIA en
  primer plano, en un vídeo de promoción, se lee como un reclamo). Lo que sí se ve y no es
  nuestro, como en la web: los gráficos de TradingView, con su marca y, en el de la ficha, el
  logotipo pequeño de la empresa.
- Nada dice comprar, vender ni cuánto se va a ganar.

## Lo que no se ha podido comprobar

**El sonido no lo ha oído quien lo montó.** Está comprobado con números: 25 s, estéreo, sin
saturar (pico 0,89), los golpes en los cortes, y unos 7 dB menos de energía por encima de 250 Hz
que en total. Si no convence, la imagen no depende de él: se cambia `sound.js`, o se sube el reel
desde el móvil con un audio de la biblioteca de Instagram.

## Publicado

El usuario lo pidió el 2026-10-13 ("súbelo a Instagram"): es un reel en la cuenta
`the_market_hub_app`, https://www.instagram.com/reel/DecgX7djfrr/ (`instagram.json`; no se llama `published.json` porque `make check` lo tomaría por un vídeo del canal sin guion), subido con
`marketmedia.instagram.publish` (como el primer post de la cuenta), con la carátula en el
fotograma de los 2,2 segundos y el pie de `caption.txt`. No está en YouTube ni en la página
Media del portal, que lista los Shorts del canal.
