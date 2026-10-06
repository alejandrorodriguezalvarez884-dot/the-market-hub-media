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
- **Voz: Google Cloud Text-to-Speech.**
- **Publicación: a mano primero** (YouTube Studio); la auditoría de la API se pide más adelante.

## Dónde estamos

| Hecho | Pendiente |
|---|---|
| **La base** (2026-10-06): formato de vídeo (una carpeta en `videos/` con brief, guion, un dibujo por escena y miniatura), plantilla (`templates/video/`), estilo común de las diapositivas (`theme/slide.css`, el tema oscuro de Market Hub, en horizontal y en vertical) y `channel.toml` | **Ningún vídeo todavía.** El usuario aún no ha dado un tema |
| Código en `src/marketmedia/`: guion y sus reglas (`script.py`), carpeta de vídeo (`videos.py`), comprobación (`check.py`), fotogramas con el Chrome local (`frames.py`), voz (`voice.py`), montaje y subtítulos (`render.py`), publicación (`youtube.py`), línea de comandos (`__main__.py`). 44 tests en verde, sin red | |
| **Vídeo y Short** (2026-10-06): la línea `short:` del guion nombra las escenas del Short; `make render` saca `video.mp4` (1920x1080) y `short.mp4` (1080x1920) con sus subtítulos. `make check` exige 4 a 6 minutos y 30 a 60 segundos. Probado con un vídeo de prueba de 9 escenas (4:26 y 0:53), luego borrado | Verlo con un vídeo de verdad, con gráficos: que una diapositiva con un gráfico se lea bien también en vertical |
| **Voz** (`make voice`): escrita contra la API REST de Google Cloud Text-to-Speech, con tests que sustituyen al servicio. Solo vuelve a decir las escenas que cambian; `DRY=1` no gasta | **Sin probar contra Google**: falta activar la API en el proyecto y elegir la voz (hoy `en-US-Chirp3-HD-Charon`, puesta sin oírla) |
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
- **El montaje no necesita la voz.** Una escena sin archivo en `voice/` se mantiene en silencio
  el tiempo que tardarían en decirse sus palabras (150 por minuto, en `channel.toml`). Con voz,
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

1. **Qué voz**, de las cerca de 30 Chirp 3 HD, y con qué acento (`en-US` o `en-GB`). Lo natural es oír
   unas muestras; para eso hay que activar antes la API en su proyecto.
2. **Cuándo se genera la voz**: dentro de `make-video` sin preguntar, o solo cuando él haya visto
   el montaje en silencio.
3. **Subtítulos incrustados en el Short** (muchos se ven sin sonido). Hoy van en un `.srt` aparte.
4. **Movimiento y música.** Hoy son diapositivas fijas, sin música.
5. **Declarar el contenido sintético.** `synthetic_media = false` en `channel.toml`. YouTube pide
   declararlo cuando el contenido alterado o sintético parece real; con una voz sintética hay que
   revisarlo antes del primer vídeo.
6. **El resto de la gestión del canal**, que la base no cubre: listas de reproducción, responder
   comentarios, leer las estadísticas para decidir los siguientes temas.
7. **El aspecto**: el tema es el de la web, sobrio. Por decidir si el canal quiere una identidad
   propia (cabecera, cierre, miniaturas con un estilo reconocible).
8. **La auditoría de la API de YouTube**, para subir sin pasar por YouTube Studio: cuando haya
   varios vídeos publicados que enseñar.

## Siguientes pasos

1. Activar Cloud Text-to-Speech en el proyecto del usuario (con su permiso) y elegir la voz.
2. Dar una primera idea: `/analyze-idea <tema>`, leer el brief, y `/make-video`.
3. `/publish-video`: publicar a mano ese primer vídeo y su Short.
