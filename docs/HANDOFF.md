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
- primero una base; los detalles se debaten después.

## Dónde estamos

| Hecho | Pendiente |
|---|---|
| **La base** (2026-10-06): formato de vídeo (una carpeta en `videos/` con brief, guion, un dibujo por escena y miniatura), plantilla (`templates/video/`), estilo común de las diapositivas (`theme/slide.css`, el tema oscuro de Market Hub) y `channel.toml` | **Ningún vídeo todavía.** El usuario aún no ha dado un tema |
| Código en `src/marketmedia/`: guion y sus reglas (`script.py`), carpeta de vídeo y comprobación (`videos.py`), fotogramas con el Chrome local (`frames.py`), montaje y subtítulos (`render.py`), subida a YouTube (`youtube.py`), línea de comandos (`__main__.py`). 33 tests en verde, sin red | |
| El flujo de `make new` a `make render` se probó con un vídeo de prueba de 4 escenas (luego borrado): fotogramas a 1920x1080, miniatura a 1280x720, `video.mp4` (H.264 + AAC) y `captions.srt`, con una escena con sonido y el resto en silencio | Verlo con un vídeo de verdad: diapositivas con gráficos, 8 a 10 minutos |
| Subida a YouTube (`make auth`, `make upload`): escrita, con tests del cuerpo de la petición | **Sin probar contra YouTube**: falta el cliente OAuth del usuario (`.secrets/client_secret.json`, pasos en el README) |
| Tres skills: `analyze-idea`, `make-video`, `publish-video` | Probarlas en una sesión nueva, con la primera idea |
| | **La voz**: sin decidir (abajo) |

## Cómo está hecho

- **Claude Code piensa, el código repite.** Estudiar la idea, escribir el guion y dibujar las
  diapositivas se hace en la sesión, con la cuota del usuario. El código no llama a ningún
  modelo: comprueba, dibuja los fotogramas, monta y sube.
- **Tres pasos, tres decisiones del usuario.** El brief se aprueba antes de escribir el guion; el
  vídeo se ve antes de pedir que se publique; la publicación se confirma vídeo a vídeo.
- **Un vídeo es una carpeta de texto.** Guion en Markdown con sus datos arriba; cada escena es un
  `## 01-nombre` y su dibujo es `slides/01-nombre.html` (o `.svg`), sin nada cargado de la red.
  Lo que se genera (`build/`) y la voz (`voice/`) no están en git.
- **El montaje no necesita la voz.** Una escena sin archivo en `voice/` se mantiene en silencio
  el tiempo que tardarían en decirse sus palabras (150 por minuto, en `channel.toml`). Con la voz
  grabada, dura lo que dura la grabación. Así se puede ver y medir un vídeo antes de grabar.
- **Sin instalar nada aparte**: ffmpeg viene con el paquete `imageio-ffmpeg` y los fotogramas se
  sacan con el Chrome de la máquina (`playwright`, canal `chrome`).
- **`make check`** para lo evidente: frases de consejo (en inglés y en español), menos de dos
  fuentes, límites de YouTube (título, descripción, etiquetas), escenas sin dibujo, dibujos que
  cargan algo de la red, `TODO` sin rellenar. No sustituye a ver el vídeo.
- **Una subida empieza como privada** y lleva en la descripción las fuentes del guion y el aviso
  de que no es asesoramiento (`channel.toml`).

## Decisiones pendientes (a debatir con el usuario)

1. **La voz.** Opciones: que la grabe él; una voz sintética local y gratuita (por ejemplo Piper);
   o un servicio (Google Cloud Text-to-Speech, que tiene un tramo gratuito mensual, o uno de pago
   como ElevenLabs). El montaje ya admite cualquiera: basta con dejar un archivo por escena en
   `voice/`.
2. **El idioma del canal.** Hoy `language = "en"`, como la web. Decide los textos, la voz y el
   público.
3. **El formato.** Hoy solo vídeo horizontal (1920x1080) de diapositivas fijas. Por decidir:
   duración habitual, Shorts verticales, movimiento dentro de una escena (animaciones), música.
4. **Hacer públicos los vídeos.** Según la documentación de YouTube, lo que sube un proyecto de
   API sin auditar queda bloqueado como privado. Para publicar desde aquí hay que pedir esa
   auditoría (un formulario, gratis); mientras, se puede subir a mano el `video.mp4`.
5. **Declarar el contenido sintético.** `synthetic_media = false` en `channel.toml`. YouTube pide
   declararlo cuando el contenido alterado o sintético parece real; con una voz sintética hay que
   revisarlo.
6. **El resto de la gestión del canal**, que la base no cubre: subir los subtítulos, listas de
   reproducción, responder comentarios, leer las estadísticas para decidir los siguientes temas.
7. **El aspecto**: el tema es el de la web, sobrio. Por decidir si el canal quiere una identidad
   propia (cabecera, cierre, miniaturas con un estilo reconocible).

## Siguientes pasos

1. Debatir las decisiones de arriba, empezando por la voz y el idioma.
2. Dar una primera idea: `/analyze-idea <tema>`, leer el brief, y `/make-video`.
3. Crear el cliente OAuth y `make auth` (README, "Publishing"); probar `make upload` con ese
   primer vídeo, en privado.
