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
- **Publicación: a mano primero** (YouTube Studio); la auditoría de la API se pide más adelante.

## Dónde estamos

| Hecho | Pendiente |
|---|---|
| **La base** (2026-10-06): formato de vídeo (una carpeta en `videos/` con brief, guion, un dibujo por escena y miniatura), plantilla (`templates/video/`), estilo común de las diapositivas (`theme/slide.css`, el tema oscuro de Market Hub, en horizontal y en vertical) y `channel.toml` | **Ningún vídeo todavía.** El usuario aún no ha dado un tema |
| Código en `src/marketmedia/`: guion y sus reglas (`script.py`), carpeta de vídeo (`videos.py`), comprobación (`check.py`), fotogramas con el Chrome local (`frames.py`), voz (`voice.py`), montaje y subtítulos (`render.py`), publicación (`youtube.py`), línea de comandos (la boca del presentador (`mouth.py`), `__main__.py`). 51 tests en verde, sin red | |
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
  que dibuja un script). Deja `build/frames/<escena>/0000.jpg…` mientras algo se mueve y
  `build/frames/<escena>.png` con la diapositiva ya en reposo; el montaje reproduce los
  fotogramas y mantiene el último hasta que acaba la escena.
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

## Decisiones pendientes (a debatir con el usuario)

1. **Mejorar el presentador**, cuando toque: es una primera versión. La boca sigue el volumen de
   la voz, no las sílabas: basta para un dibujo, no para una cara realista.
2. **Transiciones entre escenas.** Dentro de la escena ya hay movimiento; entre escenas el
   corte es seco.
3. **Declarar el contenido sintético.** `synthetic_media = false` en `channel.toml`. YouTube pide
   declararlo cuando el contenido alterado o sintético parece real; con una voz sintética hay que
   revisarlo antes del primer vídeo.
4. **El resto de la gestión del canal**, que la base no cubre: listas de reproducción, responder
   comentarios, leer las estadísticas para decidir los siguientes temas.
5. **El aspecto**: el tema es el de la web, sobrio. Por decidir si el canal quiere una identidad
   propia (cabecera, cierre, miniaturas con un estilo reconocible).
6. **La auditoría de la API de YouTube**, para subir sin pasar por YouTube Studio: cuando haya
   varios vídeos publicados que enseñar.

## Siguientes pasos

1. La sesión del 2026-10-06 se cerró aquí, con la base completa y sin ningún vídeo hecho.
2. Dar una primera idea: `/analyze-idea <tema>`, leer el brief, y `/make-video`.
3. `/publish-video`: publicar a mano ese primer vídeo y su Short.
