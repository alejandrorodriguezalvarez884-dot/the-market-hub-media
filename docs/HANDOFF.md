# Estado del proyecto y cómo continuar

Última actualización: 2026-10-06. Este documento basta para retomar el trabajo en otra sesión,
sin el historial de la conversación.

## Qué se pidió

El usuario quiere un repo que automatice la gestión de un canal de YouTube, desde la creación del
contenido hasta la publicación del vídeo (2026-10-06):

- especializado en bolsa;
- que analice los temas o ideas que él dé;
- hecho y ejecutado con su cuota de Claude Code, no con llamadas a una API de modelos;
- en el repo `alejandrorodriguezalvarez884-dot/the-market-hub-media`, submódulo del workspace
  `market-hub`;
- primero una base; los detalles se debaten después, pregunta a pregunta.

## Decisiones del usuario (2026-10-06)

- **Idioma: inglés.**
- **Dos tipos de pieza**: vídeo de 4 a 6 minutos, y Short (o reel) de 30 segundos a 1 minuto.
- **El Short es un recorte del vídeo largo**, no una pieza aparte.
- **Voz: Google Cloud Text-to-Speech**, masculina y con acento de EE. UU.: **Schedar**
  (`en-US-Chirp3-HD-Schedar`), a su ritmo natural (`rate = 1.0`). Se genera sola al hacer el
  vídeo, sin preguntar cada vez.
- **Sin música.**
- **Imagen animada**, no diapositivas fijas.
- **Un presentador que cuente las noticias.** Lo quería hiperrealista; al ver que eso exige un
  servicio de pago (HeyGen por API: 0,99 $/min con el motor Avatar III y 4,83 $/min con Avatar
  IV; D-ID: 35 $/mes por 45 minutos; precios de sus páginas el 2026-10-06) y que gratis solo
  quedaba probar modelos abiertos en GPU gratuita (Kaggle), eligió un **presentador dibujado
  aquí**, gratis y automático. El personaje actual **vale como base** y debe salir **siempre**:
  grande al abrir y al cerrar, y pequeño en una esquina en el resto de escenas.
- **Subtítulos incrustados solo en el Short**; el vídeo largo lleva su `.srt` aparte.
- **Un presentador mucho mejor y un formato para gente joven, sin ser niños** (segunda sesión del
  2026-10-06). El presentador "le gusta" como idea; pidió mejorarlo mucho.
- **Contenido variado, pero por temáticas**: cada temática, una lista de reproducción. La
  primera es **enseñar finanzas personales**. Después vendrán otras temáticas para otras listas.
- **Antes de hacer más vídeos, cerrar el formato** con un vídeo de presentación breve. "Una vez
  esté todo bien vamos con los siguientes vídeos."
- **Formato y presentador aprobados** tras ver el tráiler ("me gusta", 2026-10-06). **Money 101
  es el nombre definitivo** de la serie. **Público general**, no solo de EE. UU. Los doce temas
  propuestos valen como primera lista de reproducción, la de básicos.
- **Publicación: a mano primero** (YouTube Studio); la auditoría de la API se pide más adelante.

## Dónde estamos

| Hecho | Pendiente |
|---|---|
| **Formato nuevo** (2026-10-06, segunda sesión). Presentador nuevo (`theme/presenter.js`): medio cuerpo con sudadera, manos, diez poses (`rest`, `wave`, `explain`, `open`, `point`, `one`, `two`, `three`, `thumb`, `shrug`), boca que se abre con el volumen y se cierra sobre los dientes en las eses (`mouth.sharpness`), cabeza y cejas que siguen el acento de la voz, parpadeo y miradas a la diapositiva. Estilo nuevo (`theme/slide.css`): titulares grandes, un color de serie (`--accent`), palabras marcadas, tarjetas, fondo con luces que se mueven; en las escenas que no son suyas el presentador es una cara en un círculo cuyo aro late con la voz. Sobre cada diapositiva el montaje pone la línea de progreso, el panel que cruza entre escenas y, en el Short, los subtítulos (los dibuja la página, ya no ffmpeg). **Cada cosa entra cuando la voz dice su palabra** (`data-say`, `timing.py`: los puntos del guion se casan con los silencios de la voz). Series en `channel.toml` (`series:`, `episode:` en el guion) y vídeos de presentación (`kind: trailer`). 62 tests en verde | El usuario lo vio y lo aprobó (2026-10-06). No dijo nada de la pronunciación ni de la sincronía, que quien lo montó no puede oír |
| **Primer vídeo: el tráiler de Money 101** (`videos/2026-10-06-money-101-trailer/`): 6 escenas, 45 segundos, vídeo y Short (las mismas seis escenas), con voz (676 caracteres enviados). `make check` en verde | Sin publicar. Es la pieza de prueba del formato; si la lista de temas cambia, cambia su escena `04-topics` |
| **Temas de Money 101 aprobados** (abajo, "La serie Money 101"), para público general | |
| **Intro y cierre comunes** (2026-10-06, pedidos por el usuario al ver el episodio 1): `channel/intro.html` (el nombre del canal, "Money, markets and companies, explained", y la serie y el episodio del vídeo; 3,8 s) y `channel/outro.html` (gracias, el hueco del vídeo siguiente y el del botón de suscribirse; 12 s, para la pantalla final de YouTube). Los pone el montaje en cada vídeo (`render.scenes`); el Short y los tráileres no los llevan. `[intro] after` permite poner la intro después del gancho en vez de al principio. Capítulos en la descripción (`chapters:` en el guion) y un `youtube.txt` más completo | Que el usuario los vea. La intro va al principio porque así la pidió; con `after = 2` iría tras el gancho |
| **Episodio 1, interés compuesto, hecho** (`videos/2026-10-06-compound-interest/`): 24 escenas más intro y cierre, vídeo de 4:34 y Short de 0:34 (escenas 01, 08 y 09), con voz (unos 5.000 caracteres enviados entre las dos pasadas). En dólares y al 8 % de ejemplo (decisiones del usuario); lo de Einstein quedó fuera. `make check` en verde y `make kit` hecho (`build/youtube.txt`). Las diapositivas con gráficos usan lo nuevo de `theme/slide.css`: `.chart`, `.bars`, `.hbars`, `.sum`, `.room` | **Publicarlo es cosa del usuario**, a mano en YouTube Studio; luego `make published`. No se ha escuchado. La voz dice el guion de corrido a unas 190 palabras por minuto: un vídeo de 4 minutos y medio pide unas 720 palabras |
| **La base** (2026-10-06): formato de vídeo (una carpeta en `videos/` con brief, guion, un dibujo por escena y miniatura), plantilla (`templates/video/`), estilo común de las diapositivas (`theme/slide.css`, el tema oscuro de Market Hub, en horizontal y en vertical) y `channel.toml` | Hecho el tráiler (arriba) |
| Código en `src/marketmedia/`: guion y sus reglas (`script.py`), carpeta de vídeo (`videos.py`), comprobación (`check.py`), fotogramas con el Chrome local (`frames.py`), voz (`voice.py`), montaje y subtítulos (`render.py`), publicación (`youtube.py`), la boca del presentador (`mouth.py`), cuándo se dice cada palabra (`timing.py`), línea de comandos (`__main__.py`). Tests sin red | |
| **Vídeo y Short** (2026-10-06): la línea `short:` del guion nombra las escenas del Short; `make render` saca `video.mp4` (1920x1080) y `short.mp4` (1080x1920). `make check` exige 4 a 6 minutos y 30 a 60 segundos. Probado con un vídeo de prueba de 9 escenas (4:26 y 0:53), luego borrado | Verlo con un vídeo de verdad, con gráficos: que una diapositiva con un gráfico se lea bien también en vertical |
| **Voz** (`make voice`): contra la API REST de Google Cloud Text-to-Speech. Solo vuelve a decir las escenas que cambian; `DRY=1` no gasta. **Probada contra Google el 2026-10-06**: API activada en el proyecto `arctic-robot-474306-g3`, cuatro muestras (Charon, Iapetus, Sadaltager, Schedar) y un vídeo de prueba de 3 escenas con voz. En total, unos 930 caracteres | Voz elegida: Schedar, ritmo 1.0. La voz habla a unas 200 palabras por minuto (medido en la prueba); `words_per_minute = 190` es la estimación para escenas sin voz |
| **Subtítulos del Short incrustados** con ffmpeg (`subtitles`), unas pocas palabras cada vez, en la banda que las diapositivas verticales dejan libre (el tercio inferior). Visto en dos fotogramas de la prueba | |
| **Escenas animadas** (2026-10-06): los elementos de una diapositiva entran, las barras suben, las líneas se dibujan y las cifras cuentan, en el momento que marca `--at` (clases `.in`, `.fade`, `.grow`, `.wide`, `.draw` de `theme/slide.css`; cifras con `theme/slide.js`). No se graba la pantalla: `frames.py` para las animaciones y las coloca en el instante de cada fotograma (30 por segundo), así sale igual siempre. Probado con un gráfico de prueba, en horizontal y en vertical | Ajustar los `--at` a la voz real se hace a ojo en la skill: no hay todavía marcas de tiempo por palabra |
| **Presentador dibujado** (2026-10-06): un busto en colores planos, dibujado en `theme/slide.js` (`<div class="presenter"></div>`), que parpadea y mueve la boca con la voz de la escena (`mouth.py` lee el volumen del audio fotograma a fotograma; cinco bocas). Abre y cierra el vídeo en la disposición `.stage` y puede ir pequeño en una esquina (`.corner`). Probado con voz real en horizontal y en vertical | El usuario lo vio y lo dio por bueno como base. La plantilla ya lo lleva en la esquina de `03-point`; falta verlo sobre un gráfico de verdad, que tiene que dejarle sitio |
| **Publicación a mano** (`make kit`, `make published`): el texto para pegar en YouTube Studio y el registro de la dirección | Probarlo con el primer vídeo |
| Subida por la API (`make auth`, `make upload`): escrita, con tests del cuerpo de la petición | Para después de la auditoría de YouTube. **Sin probar contra YouTube** |
| Tres skills: `analyze-idea`, `make-video`, `publish-video` | Probarlas en una sesión nueva, con la primera idea |

## Cómo está hecho

- **Claude Code piensa, el código repite.** Estudiar la idea, escribir el guion y dibujar las
  diapositivas se hace en la sesión, con la cuota del usuario. El código no llama a ningún
  modelo de lenguaje: comprueba, dibuja los fotogramas, pone la voz y monta.
- **Tres pasos, tres decisiones del usuario.** El brief se aprueba antes de escribir el guion;
  las dos piezas se ven antes de publicarlas; publicar lo hace él.
- **Un vídeo es una carpeta de texto.** Guion en Markdown con sus datos arriba; cada escena es un
  `## 01-nombre` y su dibujo es `slides/01-nombre.html` (o `.svg`), sin nada cargado de la red.
  Lo que se genera (`build/`) y la voz (`voice/`) no están en git.
- **El Short no se escribe aparte.** Son escenas del vídeo, con sus mismas palabras y su misma
  voz. Lo único que cambia es el fotograma: el mismo dibujo se fotografía en 1080x1920, y el
  estilo común cambia los tamaños cuando la ventana es vertical (`@media (orientation: portrait)`).
  Por eso una diapositiva se dibuja con medidas relativas y debe leerse bien de las dos formas.
- **El movimiento no se graba, se calcula.** Chrome para todas las animaciones de la página y las
  pone en el instante de cada fotograma (`document.getAnimations()`, y `window.slideAt` para lo
  que dibuja un script). Antes, a la página se le dice cuál es su escena (`window.slideScene`:
  cuánto dura, cuándo se dice cada palabra, su voz fotograma a fotograma, en qué punto de la
  película cae, su serie). Como el presentador y la línea de progreso se mueven siempre, se
  fotografía la escena entera: `build/frames/<escena>/0000.jpg…`, y `build/frames/<escena>.png`
  es la diapositiva cuando acaba la voz, que es la que se mira. Unos 30 fotogramas por segundo
  de trabajo: el tráiler (45 s, dos formatos) tarda minuto y medio; un vídeo de 5 minutos con
  su Short, unos 6.
- **Cuándo se dice cada palabra** (`timing.py`). El servicio de voz no lo da. Los puntos y comas
  del guion se casan, en orden, con los silencios que se oyen en el audio, y entre dos de ellos
  las palabras se reparten el tiempo en que la voz suena. Por eso una lista se escribe con un
  punto tras cada cosa. Sin eso, en una lista dicha despacio el desfase pasaba de un segundo.
- **Una captura que falla se repite** (`frames._shot`): entre miles de fotogramas, Chrome deja
  alguna vez una petición sin contestar.
- **Tipos de letra del sistema.** En este Mac las diapositivas salen con San Francisco
  (`system-ui`); en otra máquina saldrían con la suya. Si el canal se monta en más de una
  máquina habrá que meter un tipo de letra libre en `theme/`.
- **El montaje no necesita la voz.** Una escena sin archivo en `voice/` se mantiene en silencio
  el tiempo que tardarían en decirse sus palabras (190 por minuto, en `channel.toml`). Con voz,
  dura lo que dura el archivo. Así se ve y se mide un vídeo antes de gastar un carácter.
- **La voz** usa la sesión de `gcloud` del usuario (credenciales por defecto de la aplicación) y
  su proyecto. `voice/made.json` guarda de qué palabras y con qué voz se hizo cada archivo.
  Coste: voces Chirp 3 HD, gratis hasta 1 millón de caracteres al mes y 30 dólares por millón
  después (página de precios de Google, 2026-10-06); un vídeo son unos 5.000 caracteres.
- **Sin instalar nada aparte**: ffmpeg viene con el paquete `imageio-ffmpeg` y los fotogramas se
  sacan con el Chrome de la máquina (`playwright`, canal `chrome`).
- **`make check`** para lo evidente: frases de consejo (en inglés y en español), menos de dos
  fuentes, límites de YouTube (título, descripción, etiquetas), duración del vídeo y del Short,
  escenas sin dibujo, dibujos que cargan algo de la red, `TODO` sin rellenar. No sustituye a ver
  el vídeo.
- **La descripción** de cada pieza lleva las fuentes del guion y el aviso de que no es
  asesoramiento (`channel.toml`).

## La serie Money 101 (aprobada el 2026-10-06)

Enseñar finanzas personales, una idea por vídeo, para público general: la lista de básicos.
Color lima (`#c6f24e`). Temas, en este orden: (1) interés compuesto; (2) inflación; (3) qué cuesta de verdad
una deuda (TAE, pago mínimo de una tarjeta); (4) adónde va una nómina (bruto y neto); (5) un
presupuesto como reparto, no como dieta; (6) el colchón de emergencia y para qué sirve; (7)
ahorrar frente a invertir: riesgo y plazo; (8) qué es un fondo indexado; (9) diversificar; (10)
lo que se llevan las comisiones en treinta años; (11) cómo funciona una hipoteca: fijo y
variable; (12) impuestos sobre lo que se gana invirtiendo. Al ser para público general, las
fuentes son internacionales cuando las hay (OCDE, bancos centrales) y los temas que cambian de un
país a otro (nómina, hipoteca, impuestos) se cuentan por su mecanismo, no por la norma de un
país. Lo que hay que vigilar en cada brief: que "enseñar" no se vuelva "aconsejar".

## Decisiones pendientes (a debatir con el usuario)

1. **El presentador** está aprobado. Sin decidir: si tiene nombre y lo dice.
2. **El formato** está aprobado. Sigue sin música (decisión anterior) y sin efectos de sonido.
3. **Declarar el contenido sintético.** `synthetic_media = false` en `channel.toml`. La ayuda de
   YouTube (https://support.google.com/youtube/answer/14328491, vista el 2026-10-06) dice que no
   hace falta declarar lo claramente irreal o animado; el canal es un presentador dibujado con
   una voz sintética que no imita a nadie. La casilla la marca el usuario al subir.
4. **El resto de la gestión del canal**, que la base no cubre: listas de reproducción, responder
   comentarios, leer las estadísticas para decidir los siguientes temas.
5. **El aspecto**: el tema es el de la web, sobrio. Por decidir si el canal quiere una identidad
   propia (cabecera, cierre, miniaturas con un estilo reconocible).
6. **La auditoría de la API de YouTube**, para subir sin pasar por YouTube Studio: cuando haya
   varios vídeos publicados que enseñar.

## Siguientes pasos

1. El usuario sube el episodio 1 a mano (`videos/2026-10-06-compound-interest/build/youtube.txt`
   dice qué pegar y qué marcar) y da su dirección: `make published VIDEO=compound URL=... SHORT=...`.
2. Los siguientes temas, uno a uno: `/analyze-idea`, brief, `/make-video`. El siguiente es la
   inflación (el episodio 1 la anuncia al cerrar). Las preguntas pequeñas de edición (un inciso,
   qué escenas hacen el Short) las decide quien hace el vídeo: el usuario no quiere que se le
   pregunten.
3. `/publish-video` del tráiler y de cada episodio: publicar a mano, cuando él lo pida.
4. En el Mac del usuario el push va por SSH (su clave ya está en GitHub): cada repo del workspace
   tiene `url."git@github.com:".pushInsteadOf "https://github.com/"` en su configuración local.
