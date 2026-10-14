# Market Hub en X, la película de presentación

Lo pidió el usuario el 2026-10-14, al estrenar la cuenta de X (`@the_market_hub_`): "un primer
tuit de presentación con un vídeo de presentación que cree mucho hype pero que no muestre aún
nada de la app".

**No es un vídeo del canal** (ni presentador, ni diapositivas, ni voz) y tampoco es el teaser de
Instagram (`2026-10-13-web-teaser`), que enseña la web. Este no enseña nada de la app: palabras
grandes sobre líneas inventadas, y el logo. **Va de la IA que lee el mercado y lo explica**: lo
pidió así el usuario al ver la primera versión ("quiero que el video sea más enfocado en tema de IA
que te ayuda a interpretar el mercado"), que contaba "todo en una página". 20,5 segundos,
1080 × 1080 (cuadrado, para el muro de X), 30 fps. `build/film.mp4`; `build/cover.jpg` es su
fotograma de cierre.

## Qué se ve

| | Escena | Palabras | Detrás |
|---|---|---|---|
| 0:00 | Apertura | The market speaks in **numbers.** | una línea blanca que se dibuja, con su punto en la punta |
| 0:03 | Ruido | Prices. Filings. **Headlines.** | 24 líneas verdes, rojas y grises que corren |
| 0:05,5 | Demasiado | Too much **to read.** | las mismas, más altas, y el cuadro tiembla |
| 0:08 | La IA | Now AI reads it **for you.** | un haz de luz cruza las líneas y deja detrás una sola, recta |
| 0:10,5 | Explicar | What moved. Why it matters. **In plain words.** | una línea recta y su punto, que la recorre |
| 0:13 | Decidir | It explains. **You decide.** | el punto se para en medio y late: la decisión es de quien mira |
| 0:15,5 | Cierre | Market Hub. The market, read by AI. Explained. Not advised. Now on X. `themarkethub.app`. @the_market_hub_ · No investment advice | el logo |

Arriba, la línea del logo cruza el encuadre y su punto avanza con la película, como en el teaser.

## Cómo está hecho

Como el teaser, sin sus fotografías: `timeline.js` dice qué pasa cuándo (a 120 pulsos por minuto,
cada corte en un pulso); `film.html` lo dibuja; `sound.js` es la banda del teaser, sintetizada
aquí y tocada sobre estos tiempos. `python film.py sound`, `film`, `sheet` y `cover`.

Las líneas son paseos aleatorios con semilla fija: no son el precio de nada y no llevan cifras,
así que no hay fuentes que citar.

## El post

`x/2026-10-14-hello-x.md`. El vídeo lo adjunta el usuario en el editor de X: el navegador de Claude
no sube archivos.

## Decisiones tomadas sin él

- Cuadrado y no vertical ni apaisado: es lo que más ocupa en el muro de X en un móvil sin recortarse.
- "It explains. You decide." y "Explained. Not advised.": la IA describe y explica, nunca aconseja
  (la regla de todo el portal), y el vídeo lo dice en vez de esconderlo.
- El sonido no lo ha oído quien lo montó (comprobado con números): lo juzga él.
