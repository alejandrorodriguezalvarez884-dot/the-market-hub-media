# Instrucciones para agentes

Este repo lleva el canal de YouTube de Market Hub (https://themarkethub.app): vídeos que explican
la bolsa y sus empresas, a partir de los temas o ideas que da el usuario. Lee primero
[docs/HANDOFF.md](docs/HANDOFF.md). Un vídeo se hace con tres skills, una por cada decisión que
toma el usuario, y cada una manda sobre su paso:

- [`analyze-idea`](.claude/skills/analyze-idea/SKILL.md): estudia una idea y escribe su brief.
- [`make-video`](.claude/skills/make-video/SKILL.md): del brief aprobado al vídeo y su Short,
  montados y con voz.
- [`publish-video`](.claude/skills/publish-video/SKILL.md): deja todo listo para publicarlo a
  mano en YouTube Studio y apunta dónde quedó.

Cada tema da **dos piezas**: un vídeo horizontal de 4 a 6 minutos y un Short vertical de 30
segundos a 1 minuto, que es un recorte del vídeo (algunas de sus escenas, con las mismas palabras
y la misma voz, dibujadas de nuevo en vertical). El canal es **en inglés**.

Reglas que no se negocian:
- **Todo lo que piensa se hace en la sesión de Claude Code**, con la cuota del usuario: estudiar
  la idea, escribir el guion, dibujar las diapositivas. El código del repo no llama a ningún
  modelo de lenguaje; solo hace lo que debe salir igual cada vez (comprobar, dibujar los
  fotogramas, poner la voz, montar).
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
- **El presentador es un dibujo hecho aquí** (`theme/slide.js`), que mueve la boca con la voz. No
  es la cara de nadie. Sale en todas las escenas: grande al abrir y al cerrar, pequeño en una
  esquina en las demás. El usuario quería un avatar hiperrealista y lo descartó por el coste
  (2026-10-06): no se sustituye por un avatar realista, por un servicio de avatares ni por vídeo
  de una persona real sin que él lo decida.
- **Publicar es decisión del usuario, vídeo a vídeo.** Hoy publica él a mano, en YouTube Studio:
  `make kit` le deja el texto que pegar y `make published` apunta la dirección. Aprobar un brief
  o un guion no es aprobar la publicación. La subida por la API (`make auth`, `make upload`) es
  para cuando YouTube audite el proyecto, y solo si él la pide.
- **No se gasta sin preguntar.** El único servicio de pago decidido es la voz (abajo). Cualquier
  otro (imágenes, música, otra voz) no se usa sin que el usuario lo decida antes.
- **Nada de trading** ni conectores de broker, como en el resto del workspace.
- **Nada programado y nada en GitHub Actions.** Todo se lanza a mano, con una skill o desde el
  `Makefile`. Tampoco se programa la publicación en YouTube.
- **Claves solo en `.secrets/`, en `.env` o en el entorno.** Nunca en el repo, en logs ni en
  commits. Nunca se le pide al usuario una contraseña, un token o un código: `make auth` lo
  lanza él y se identifica en su navegador.
- **Un vídeo publicado no cambia de carpeta.** El slug (el nombre de la carpeta sin la fecha) no
  se toca. Una corrección se dice en la descripción del vídeo.

## La voz

La narración la dice **Google Cloud Text-to-Speech** (decisión del usuario, 2026-10-06), con una
voz Chirp 3 HD (`[voice]` en `channel.toml`), la sesión de `gcloud` del usuario y su proyecto.
`make voice` genera un archivo por escena en `videos/<vídeo>/voice/` y solo vuelve a decir las
escenas cuyas palabras, o la voz, han cambiado. Se genera dentro de `make-video`, sin preguntar
cada vez (decisión del usuario). Se cobra por carácter pasado un tramo gratuito
mensual (1 millón de caracteres al mes en estas voces, según la página de precios de Google el
2026-10-06; un vídeo son unos 5.000): por eso la voz se genera con el guion ya cerrado, y
`make voice DRY=1` dice antes cuántos caracteres mandaría. No se cambia a una voz o a un servicio
más caro sin preguntar. Un archivo que el usuario deje a mano en `voice/` se respeta. Sin voz, el
montaje deja la escena en silencio el tiempo que tardarían en decirse sus palabras.

## Convenciones

- Hablar con el usuario en español. Guiones y textos en pantalla, en el idioma del canal
  (`channel.toml`; hoy, inglés). Código y comentarios, en inglés.
- Python 3.12 con `uv`. `make test` para los tests; `make check` antes de publicar, siempre.
- Cada cambio en una regla de `make check` o en el montaje lleva su test en `tests/`.
- Al terminar una tarea relevante, actualizar "Dónde estamos" en `docs/HANDOFF.md`.
