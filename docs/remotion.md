# Los vídeos con Remotion

Desde el 2026-11-09 (el usuario: «usar remotion para los videos») las piezas nuevas se dibujan con
**Remotion** (https://www.remotion.dev): cada escena es un componente de React, y Remotion dibuja
cada fotograma en un Chrome de esta máquina y monta la película. Sustituye a dos cosas del montaje
de antes, `frames.py` (Chrome fotografiando una página HTML fotograma a fotograma) y
`render.film` (ffmpeg uniendo esas fotos con la voz). Todo lo demás sigue igual y en Python: el
guion y `make check`/`make reelcheck`, la voz (ElevenLabs y Google), cuándo se dice cada palabra
(`timing.py`), los subtítulos, la portada, publicar.

## Qué se hace con Remotion y qué no

| Pieza | Cómo se dibuja |
|---|---|
| **Reels a demanda** (reflexión, didácticos, especiales como el de Jensen Huang) | **Remotion**: `slides/<escena>.tsx` |
| **Vídeos largos de YouTube** de esos reels (skill `long-video`) | **Remotion**, en horizontal; la miniatura sigue siendo `thumbnail.html` |
| Reels programados de Aprende y A fondo (skill `scheduled-reel`, desde el 2026-11-12) | **Remotion**, cada uno en un mundo propio en CSS 3D como «La nave» del reel de CoreWeave (el usuario: «innovador, como el reel de CoreWeave»). En la nube funciona: el entorno trae Node 22 y la prueba del 2026-11-12 dibujó las escenas de los neoclouds en 30 s y su película entera (1:27, muda) en 9 min 30 s, con 4 núcleos; ahí, donde faltan Georgia, Bahnschrift y Consolas, dos escenas se descolocaron un poco (07 y 09), así que las fuentes de un mundo nuevo deben ser Inter, Noto Serif y JetBrains Mono |
| Reels diarios automáticos (apertura, cierre, semana, futuros) | **HTML, siempre** (decisión del usuario, abajo) |
| Lee el gráfico (`chart-reel`) | HTML, como antes: su gráfico de velas (`theme/chart.js`) aún no está en el kit |
| Vídeos del canal en inglés con presentador, Shorts recortados, historias y carruseles | HTML, como antes |

Una pieza se dibuja con Remotion cuando **todas** sus escenas son `.tsx`; si unas son `.tsx` y
otras `.html`, `make reelcheck` y `make check` lo rechazan. `make reel` y `make render` eligen
solos el motor según las diapositivas, así que las órdenes no cambian.

## La licencia

Remotion es **gratis para personas y empresas de hasta tres personas**, con uso comercial
(https://www.remotion.pro/license, leído el 2026-11-09). Market Hub entra ahí. Si alguna vez
fueran más de tres, haría falta la licencia de empresa (desde 25 $ al mes por puesto). **Todo se
renderiza en este ordenador**: nada de Remotion Lambda ni de otro servicio de pago, que no se usan
sin preguntar al usuario.

## Cómo está hecho

```
remotion/
  package.json, package-lock.json   Remotion 4.0.542, React 19 (versiones fijas)
  render.mjs                        lo que llama Python: empaqueta la pieza y la renderiza
  src/root.tsx, src/Film.tsx        la película: una escena tras otra, su voz, el fundido
  src/kit/                          el kit de Market Hub (abajo)
  examples/2026-11-09-jensen-huang  el reel de Huang rehecho con Remotion (el ejemplo que copiar)
  examples/kit, examples/kit-wide   las piezas del kit en los tres aspectos, en vertical y en horizontal
src/marketmedia/remotion.py         calcula la película y llama a render.mjs
```

1. Python calcula la película como antes (`render.plan`): las escenas en orden, cuánto dura cada
   una (su voz y el silencio de después), su archivo de voz y cuándo se dice cada palabra. Lo
   deja en `build/remotion/props.json`, y la voz en `build/remotion/public/`.
2. `render.mjs` escribe la entrada de la pieza (`build/remotion/entry.tsx`, que importa cada
   `slides/<escena>.tsx`), la empaqueta y renderiza `build/reel.mp4` (o `build/video.mp4`) en
   H.264 con AAC, y una imagen por escena tal como queda al acabar su voz
   (`build/short-frames/<escena>.png` o `build/frames/`), la que se mira y la portada del reel.
3. Python escribe los subtítulos (`.srt`) como antes.

El fundido entre escenas (`crossfade` de `channel.toml`) es el mismo que hacía ffmpeg: cada imagen
se mantiene lo que dura el fundido mientras la siguiente aparece encima, y la voz no se mueve.
La primera vez se descarga Chrome Headless Shell (unos 140 MB, gratis, a la caché de Remotion).

## Una escena

Cada escena es el componente por defecto de `slides/<escena>.tsx`:

```tsx
// What this slide shows, and where its figures come from
import React from "react";
import { Column, Count, Logo, Look, Mark, Reveal } from "@mh/kit";

export default () => (
  <Look look="dark" bg="tape" brand="The Market Hub · Apertura">
    <Column>
      <Reveal as="p" className="kicker">Lo que mueve hoy</Reveal>
      <h1>Nvidia <Mark say="cae">cae</Mark> antes de abrir</h1>
      <Reveal say="cinco" how="pop" tilt={-3} className="sticker">
        <Count to={5.5} decimals={1} prefix="▼ " suffix=" %" say="cinco" />
      </Reveal>
      <Reveal say="cliente" className="card"><Logo name="nvidia" /> ...</Reveal>
    </Column>
  </Look>
);
```

- Las pegatinas (`sticker`) van un poco inclinadas, como en los diarios (`tilt` hacia el otro
  lado); planas en una fila de respuestas (`answers`) y en el aspecto de ensayo.
- **Nada se mueve con CSS** (`@keyframes`, `transition`): Remotion fotografía cada fotograma
  por separado y una animación de CSS saldría distinta cada vez. Lo que se mueve lo mueven los
  componentes del kit a partir del número de fotograma.
- **`say`** es lo mismo que `data-say` en las páginas HTML: una palabra de la narración (sin
  importar tildes ni mayúsculas, basta el principio), varias para una frase, `#2` la segunda vez
  que se dice, `+0.3`/`-0.3` para moverla, o un número de segundos. Si la narración no la dice,
  `make reel` avisa: «waits for …, which its narration does not say».
- **Los logotipos**, solo de `theme/logos/` (`<Logo name="meta" />`, o `logoUrl("meta")` en un
  `<Img>`). Nada cargado de la red: `make reelcheck` lo rechaza.
- **Los datos** se leen en la sesión y se guardan en `data/` como siempre; una escena puede
  importar un JSON de ahí (`import closes from "../data/yahoo-NVDA.json"`) para dibujar un
  gráfico con `<Sparkline values={...} />`.
- Un aspecto propio de una pieza (como el storyboard de Huang) va en `slides/look/` (CSS con todo
  dentro de una clase, sin animaciones, y sus componentes), que no cuenta como escena.

## El kit (`remotion/src/kit/`, `@mh/kit`)

| Pieza | Para qué |
|---|---|
| `Look look="dark\|light\|essay" bg="tape\|candles\|grid\|city\|plain"` | El marco de cada escena: el aspecto, el fondo que se mueve (decoración, nunca datos), el velo y la línea de marca. **dark** es la paleta del portal (`global.css` de `market-hub-landing`); **light** el papel cálido de los didácticos; **essay** tinta y papel con titulares con serifa, para los de reflexión. En horizontal (vídeo largo) se coloca solo. |
| `Column` | La columna de la escena, dentro de lo que Instagram deja libre (250 a 1450 px desde arriba, lejos del borde derecho) o, en horizontal, toda la pantalla menos un margen. |
| Clases de `look.css` | `kicker` (`.red`, `.green`, `.sky`), `h1` (`.small`), `h2`, `lead`, `sticker` (`.green`, `.amber`, `.tag`, `.small`), `card` (`.up`, `.down`, `.amber`), `line` con `name`/`fig`, `big`, `clock`, `answers`, `note`, `label`, `cols` (`.left`, `.right`, `.three`) en horizontal, `chapter`; colores `.y` (de qué va la escena), `.g`/`.r` (solo lo que sube o baja), `.s`, `.dim`. |
| `Reveal say how="in\|pop\|fade\|rise\|left"` | Algo que entra cuando la voz lo dice. `tilt` para la inclinación de una pegatina. |
| `Count to decimals prefix suffix say` | Una cifra que cuenta hasta su valor, a la española (28,6). |
| `Mark say tone="amber\|ok\|press"` | Un rotulador que pasa por encima de unas palabras. |
| `Bar w say tone="g\|r"` | Una barra que crece. |
| `Type say takes` | Letras que se escriben como a máquina. |
| `Sparkline values after say labels` | Una línea de precios con datos reales, que se dibuja al decirse; `after`, lo que sigue (la preapertura), a trazos. |
| `Profile` | La foto de la cuenta con una línea al lado («Te leo en comentarios»), para cerrar un reel. |
| `Confirmed`, `Reported`, `Hypothesis`, `MarksKey` | **Las tres marcas** del reel de Huang: lo que confirma la empresa o la persona, subrayado en verde; lo que cuenta la prensa, en amarillo; una hipótesis, a lápiz, gris y a trazos. Cada una con su fuente debajo (`src`). Nunca se mezclan. |
| `useSay`, `useProgress`, `useSeconds`, `useDrawn`, `later` | Para dibujar algo propio que se mueva con la voz. |

## Órdenes

```bash
make remotion                                   # instala remotion/ (npm ci) y comprueba los tipos del kit y de cada .tsx
make film PIECE=reels/<carpeta> STILLS=1        # solo la imagen de cada escena, para mirarlas antes de la película
make film PIECE=reels/<carpeta>                 # la película (lo mismo que hace make reel con una pieza en .tsx)
make reel REEL=<carpeta>                        # como siempre: voz, y luego Remotion si sus diapositivas son .tsx
make render VIDEO=<carpeta>                     # como siempre: la miniatura (HTML) y la película con Remotion
```

`make film` también vale para los ejemplos (`PIECE=remotion/examples/2026-11-09-jensen-huang`;
su voz no está en git: se copia de `reels/2026-11-09-jensen-huang/voice/`, y sin ella cada escena
dura lo que tardaría en decirse, en silencio).

## La prueba: el reel de Jensen Huang, rehecho

El reel de Huang (publicado el 2026-11-09, dibujado en HTML) se rehízo con Remotion en
`remotion/examples/2026-11-09-jensen-huang/`, con su misma voz: **1:21,8 los dos, el mismo
volumen de voz (−32,7 dB de media), y las imágenes iguales** al comparar cada escena y fotogramas
a mitad de sus animaciones. En este Mac Remotion lo hizo en **55 s**; el montaje HTML, rehecho
ese mismo día para comprobar que sigue igual, en **2 min 22 s**. El archivo pesa más (unos 30 MB por 18 MB; `crf` 18), de sobra para
Instagram.

## Los reels programados, nunca

Los reels que salen solos (apertura, cierre, semana y futuros, hechos por las rutinas de la nube)
**se quedan con el montaje HTML** (el usuario, 2026-11-09: «para los vídeos programados no quiero
usar remotion», después de que se le preparara el cambio). `make reelcheck` rechaza un reel diario
con escenas `.tsx`, y el entorno de la nube no lleva Node. Si algún día se quisiera cambiar, en el
historial de git está lo que se preparó (commit `5436f43`: un interruptor en `channel.toml`, Node
en `scripts/cloud-setup.sh`, `make remotiontest` y el diario del 2026-11-09 rehecho con el kit).
