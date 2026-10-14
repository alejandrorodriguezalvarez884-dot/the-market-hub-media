# Market Hub en X, la película de presentación

Lo pidió el usuario el 2026-10-14, al estrenar la cuenta de X (`@the_market_hub_`): "un primer
tuit de presentación con un vídeo de presentación que cree mucho hype pero que no muestre aún
nada de la app".

**No es un vídeo del canal** (ni presentador, ni diapositivas, ni voz) y tampoco es el teaser de
Instagram (`2026-10-13-web-teaser`), que enseña la web. Este no enseña nada de la app: palabras
grandes sobre líneas inventadas, y el logo. 18 segundos, 1080 × 1080 (cuadrado, para el muro de
X), 30 fps. `build/film.mp4`; `build/cover.jpg` es su fotograma de cierre.

## Qué se ve

| | Escena | Palabras | Detrás |
|---|---|---|---|
| 0:00 | Apertura | Every second, the market **moves.** | una línea blanca que se dibuja, con su punto en la punta |
| 0:03 | Ruido | Prices. Headlines. **Hot takes.** | 24 líneas verdes, rojas y grises que corren |
| 0:05,5 | Pestañas | Ten tabs. **Zero clarity.** | las mismas, más altas, y el cuadro tiembla |
| 0:08 | La pregunta | What if it all fit **on one page?** | las líneas se juntan en una sola |
| 0:10,5 | Calma | No noise. No hype. **Just the market.** | una línea recta y su punto, que la recorre |
| 0:13 | Cierre | Market Hub. The whole market. On one page. Now on X. `themarkethub.app`. @the_market_hub_ · No investment advice | el logo |

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
- "No hype" en un vídeo de hype: el giro es a propósito; dice lo que la web promete (describir, no
  vender).
- El sonido no lo ha oído quien lo montó (comprobado con números): lo juzga él.
