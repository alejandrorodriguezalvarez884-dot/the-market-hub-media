# Market Hub, la película de lanzamiento

Lo pidió el usuario el 2026-10-15, el día que lanza la web: "un video para youtube, pero que no
vaya en la lista de reproducción de Money 101 … tiene que ser perfecto … que no parezca generado
con IA. Tiene que ayudar a crear hype y poner foco en la IA".

Sus decisiones (2026-10-15):
- **Sin voz.** Palabras grandes en pantalla y ritmo con el sonido, como un tráiler.
- **Foco en las herramientas de IA** de la web (lo que la IA hace dentro), sin decir que la web
  está hecha con IA.
- **De 2 a 3 minutos**, horizontal para YouTube, y un **corte vertical** (Short, reel y X).
- **Sonido hecho aquí**, sintetizado, sin música ajena.

**No es un vídeo del canal** (ni presentador, ni diapositivas, ni intro ni cierre del canal, ni
serie: no va en Money 101) y tampoco es la demo: no explica cómo se usa nada, enseña la web
funcionando. Lo que hace que no parezca generado: **todo lo que se ve de la web es la web de
verdad, grabada** (Chrome real, con su puntero y tecleando con pausas humanas), la IA escribiendo
de verdad en pantalla, la tipografía y los colores de la propia web (IBM Plex, `global.css`) y nada
de la estética genérica de "IA" (ni brillos violetas, ni chispas, ni robots).

## Guion visual (unos 2:25)

| | Parte | Palabras en pantalla | Qué se ve |
|---|---|---|---|
| 0:00 | Apertura | Every morning. | negro; una pestaña de navegador dibujada se abre |
| 0:03 | | Prices. Filings. Headlines. **Earnings.** | las pestañas se apilan, una por palabra (dibujadas, sin webs ni logos de nadie) |
| 0:08 | | Too much **to read.** | la pila tiembla y se viene abajo |
| 0:12 | El giro | So I built **one place.** | el logo de la web se dibuja: la barra, la línea, el punto |
| 0:17 | | The Market Hub. **Now live.** | |
| 0:22 | 1 · El mercado | The whole market. **Every company.** | grabación: Today (la regla), Markets, la ficha de una empresa, News; cortes rápidos dentro de una ventana que flota |
| 0:38 | 2 · La IA | And now, **AI that reads it for you.** | rótulo de parte |
| 0:42 | Fundamentals Lab | It reads the numbers. **And invents none.** | grabación: la ficha de una empresa, "Write the reading", el estado "Reading the numbers…" y la lectura que aparece; la cámara se acerca al titular y a "points to check" |
| 0:55 | Earnings Radar | It reads the results release. **The moment it's out.** | grabación: se teclea una empresa, Analyse, los pasos que van cayendo (EDGAR, el comunicado, la lectura) y "What stands out" |
| 1:08 | Playground | Ask in plain words. **Get the board.** | grabación: se teclea una petición ("Compare NVDA, AMD and AVGO this year") y el tablero se monta; una segunda ("add a table") |
| 1:22 | Peer Map | 1,500 companies. **Mapped by what they do.** | grabación: el mapa, un acercamiento a un grupo, una empresa y sus diez más parecidas |
| 1:32 | Options Lab | Options, **read in detail.** | grabación: una estrategia, su gráfico de pagos y sus griegas |
| 1:40 | 3 · My Hub | Your portfolio. **Read for you.** | grabación (cuenta de demostración, rotulada así): Overview con sus frases, la Watchlist y sus lecturas |
| 1:52 | La comunidad | Every month. **One leaderboard.** | grabación: la competición, su clasificación y el gráfico frente al S&P 500 |
| 2:00 | | November's competition **is open.** | |
| 2:04 | La regla | It explains. **You decide.** | la línea del logo, quieta |
| 2:09 | Cierre | The Market Hub · Free · Live today · `themarkethub.app` · No investment advice | el logo; se queda quieto los últimos segundos (sitio para la pantalla final de YouTube) |

**Corte vertical (unos 50 s)**: la apertura acortada, las tres herramientas que más se ven trabajar
(Fundamentals Lab, Earnings Radar, Playground), la competición y el cierre, dibujados de nuevo en
1080 × 1920, con el mismo sonido recortado.

## Cómo se hace

Dos piezas: `build/film.mp4` (2:25, 1920 × 1080, 30 fps) y `build/upright-film.mp4` (47,5 s,
1080 × 1920: la apertura acortada, Fundamentals Lab, Earnings Radar, Playground, la competición y el
cierre). `build/cover.jpg` es la miniatura (el título). `youtube.md` lleva título, descripción con
capítulos y etiquetas.

- **Tomas** (`takes.py`): el grabador de la demo del 2026-10-08 (`../2026-10-08-my-hub-demo/record.py`,
  importado), un Chrome de verdad con su puntero, grabado por su screencast **a 2560 × 1440** (el
  doble de la ventana de 1280 × 720) para poder acercar la cámara, y tecleando a un ritmo humano
  desigual. Una toma por parte (`today`, `quote`, `news`, `fundamentals`, `radar`, `playground`,
  `peers`, `options`, `hub`, `watchlist`, `community`), convertida en `build/clips/<toma>.mp4` (30 fps,
  todo fotogramas clave para que el montaje busque al fotograma) con sus marcas en `<toma>.json`.
  Lo público es la web desplegada (refresco de noticias y analítica cortados). Lo que pide sesión, los
  servicios en este equipo con las configuraciones `film-*-windows` del workspace (las de demo, pero
  con la clave real, leída al arrancar de Secret Manager con `gcloud secrets versions access`, y
  topes locales bajos: Fundamentals 0,30 $ al día, Radar 0,05 $) y `peers-demo-windows`; cuenta de
  demostración de `seed.py`, nunca la de una persona. `sheet.sh` saca hojas de fotogramas de un clip.
- **Montaje** (`film.html`, `film.js`, `kinds.js`, `timeline.js`): cada movimiento es una animación de
  la página y cada toma un `<video>` que se pone en su instante (`window.seekTo`); `film.py film` lo
  fotografía con tres Chrome a la vez. Las esperas de la IA se **cortan**, nunca se aceleran: lo que se
  ve es lo que hizo la página. Única excepción: la cuenta atrás de noviembre, que en la toma solo se
  ve 0,9 s, va a un tercio de velocidad. Cuando la ventana llena el cuadro, el encuadre corta justo en
  el borde del menú lateral y la última frase pasa a ser un rótulo abajo.
- **Sonido** (`sound.js`): grave, ancho y solemne, con una sala hecha de ruido que se apaga: apertura
  íntima (unos −22 dB) con un clic apagado por pestaña, medio segundo de silencio antes de "So I
  built", golpe en el título, banda de cuerdas graves y tambor suave desde la primera toma que crece
  por partes, un golpe más hondo cuando la ventana llena el cuadro, la regla casi desnuda y el cierre
  en re mayor. Medido, no oído: pico 0,89, silencio de verdad en 12,05–12,45 s.

## Lo que costó

Las llamadas de IA se hicieron de verdad, con las claves del usuario y su permiso (hasta 1 $): la
lectura de Fundamentals Lab, **0,032 $** (apuntado por el servicio); la del Earnings Radar (dos
comunicados de NVDA, menos de 0,01 $); seis peticiones al Playground (dos tomas: la primera se cortó
antes de la tabla); las frases de My Hub y las lecturas de la Watchlist de la cuenta de demo
(céntimos). Muy por debajo del dólar.

## Decisiones tomadas sin él

- Palabras en inglés (el canal y la web lo son) y primera persona en la apertura ("So I built one
  place"), como en el post de LinkedIn.
- Microsoft para la lectura de Fundamentals y Nvidia para el Radar y Options Lab: empresas que todo
  el mundo conoce. Un cóndor de hierro a 29 días para la estrategia.
- AVGO sale en el Playground con "+0.0 %" en el año: es lo que daba el proveedor ese día, no se tocó.
- Las direcciones de la barra de la ventana son las de producción (`fundamentals.themarkethub.app`…),
  aunque lo privado se grabó en local con el mismo código.
