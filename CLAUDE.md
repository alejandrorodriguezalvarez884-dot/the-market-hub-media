# Instrucciones para agentes

Este repo lleva el canal de YouTube de Market Hub (https://themarkethub.app): vídeos que explican
la bolsa y sus empresas, a partir de los temas o ideas que da el usuario. Lee primero
[docs/HANDOFF.md](docs/HANDOFF.md). Un vídeo se hace con tres skills, una por cada decisión que
toma el usuario, y cada una manda sobre su paso:

- [`analyze-idea`](.claude/skills/analyze-idea/SKILL.md): estudia una idea y escribe su brief.
- [`make-video`](.claude/skills/make-video/SKILL.md): del brief aprobado al vídeo montado.
- [`publish-video`](.claude/skills/publish-video/SKILL.md): lo sube a YouTube, tras confirmarlo.

Reglas que no se negocian:
- **Todo lo que piensa se hace en la sesión de Claude Code**, con la cuota del usuario: estudiar
  la idea, escribir el guion, dibujar las diapositivas. El código del repo no llama a ningún
  modelo ni a ninguna API de pago; solo hace lo que debe salir igual cada vez (comprobar, dibujar
  los fotogramas, montar, subir).
- **Explicar y opinar sí, aconsejar no.** Un vídeo puede defender una tesis o criticar una
  decisión de una empresa. No le dice a quien lo ve qué hacer con su dinero: nada de comprar,
  vender o mantener, precios objetivo, predicciones de precio ni carteras recomendadas.
  `make check` para los casos más claros; el resto es criterio de quien escribe.
- **Los hechos son de las fuentes.** Toda cifra, fecha y cita sale de una fuente que está en el
  brief con su dirección y que el vídeo lista en su descripción. No se inventan datos, citas ni
  fuentes, y no se escribe de memoria sobre lo que pasó: se comprueba.
- **Nada de material ajeno.** Ni textos copiados, ni imágenes, música o vídeo de terceros, ni
  logotipos, ni caras de personas reales. Cada diapositiva y cada miniatura se dibujan aquí, como
  código (HTML o SVG), y se convierten en imagen con el Chrome de esta máquina. No se usa ningún
  servicio ni modelo de generación de imágenes.
- **Publicar es decisión del usuario, vídeo a vídeo.** Solo se sube cuando lo pide para un vídeo
  concreto y tras ver qué se va a subir. Se sube como privado salvo que diga otra cosa en ese
  momento. Aprobar un brief o un guion no es aprobar la publicación.
- **No se gasta sin preguntar.** Ningún servicio de pago (voz, imágenes, música) se usa sin que
  el usuario lo haya decidido antes.
- **Nada de trading** ni conectores de broker, como en el resto del workspace.
- **Nada programado y nada en GitHub Actions.** Todo se lanza a mano, con una skill o desde el
  `Makefile`. Tampoco se programa la publicación en YouTube.
- **Claves solo en `.secrets/`, en `.env` o en el entorno.** Nunca en el repo, en logs ni en
  commits. Nunca se le pide al usuario una contraseña, un token o un código: `make auth` lo
  lanza él y se identifica en su navegador.
- **Un vídeo publicado no cambia de carpeta.** El slug (el nombre de la carpeta sin la fecha) no
  se toca. Una corrección se dice en la descripción del vídeo.

## La voz

**Sin decidir todavía** (ver "Decisiones pendientes" en `docs/HANDOFF.md`). La narración de cada
escena es un archivo de sonido, `videos/<vídeo>/voice/<escena>.wav` (o `.mp3`, `.m4a`); el montaje
usa los que haya y deja en silencio el resto, durante el tiempo que tardarían en decirse sus
palabras. Hasta que el usuario decida cómo se hace la voz, los vídeos se montan en silencio y, si
graba él, se le da el guion escena a escena con el nombre que debe llevar cada archivo.

## Convenciones

- Hablar con el usuario en español. Guiones y textos en pantalla, en el idioma del canal
  (`channel.toml`; hoy, inglés). Código y comentarios, en inglés.
- Python 3.12 con `uv`. `make test` para los tests; `make check` antes de publicar, siempre.
- Cada cambio en una regla de `make check` o en el montaje lleva su test en `tests/`.
- Al terminar una tarea relevante, actualizar "Dónde estamos" en `docs/HANDOFF.md`.
