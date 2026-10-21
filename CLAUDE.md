# Instrucciones para agentes

Este repo lleva el canal de YouTube de Market Hub (https://themarkethub.app): vídeos que explican
la bolsa y sus empresas, a partir de los temas o ideas que da el usuario. Lee primero
[docs/HANDOFF.md](docs/HANDOFF.md). Un vídeo se hace con tres skills, una por cada decisión que
toma el usuario, y cada una manda sobre su paso:

- [`analyze-idea`](.claude/skills/analyze-idea/SKILL.md): estudia una idea y escribe su brief.
- [`make-video`](.claude/skills/make-video/SKILL.md): del brief aprobado al vídeo y su Short,
  montados y con voz; y subidos a YouTube y a Instagram si el usuario lo pidió en esa misma
  petición.
- [`publish-video`](.claude/skills/publish-video/SKILL.md): publica un vídeo ya montado: lo sube
  por la API o deja todo listo para subirlo a mano en YouTube Studio, apunta dónde quedó y
  publica su Short como reel en Instagram.

Y aparte de los vídeos, [`post-x`](.claude/skills/post-x/SKILL.md): escribe un post para la cuenta
de X de Market Hub (en inglés; el día del mercado, un vídeo, un artículo de opinión, la app) en
`x/`, lo comprueba (`make xcheck`) y lo pone en X **por la API de X** (`make xpost`), que lo apunta
y deja los últimos en la página Media del portal. La API se paga por post: $0,015, o **$0,20 con
enlace**; los que pide el usuario pueden llevar enlace (decisión suya, 2026-10-21; hasta entonces
se ponían a mano en el navegador de Claude, que queda para cuando la API no se pueda usar).
**Cada post que pide el usuario se publica solo tras un sí a su texto exacto**, en el chat; pedir
"haz un post" no es ese sí. **Después de cada post que pide en X se le pregunta si quiere un
post relacionado en Instagram** (decisión suya, 2026-10-18): si dice que sí, se dibuja (carrusel
o story), se le enseña con su pie y se publica solo tras su sí a eso (paso 6 de `post-x`).

Y [`autopost`](.claude/skills/autopost/SKILL.md): **los posts que el canal hace solo** (decisión
del usuario, 2026-10-21). Dos tareas programadas de la app de Claude, de lunes a viernes, buscan
lo nuevo del mercado y publican sin preguntar: **cinco posts al día en X, sin enlace** (`auto: yes`
en su cabecera; `make xcheck` para el que lleva un enlace o un dominio, y el código no hace más de
cinco al día) y **dos carruseles al día en Instagram**. Es lo único que se publica sin un sí al
texto exacto; las demás reglas valen igual (describir, no aconsejar; toda cifra con su fuente).
Nunca usan el navegador para X.

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
- **El presentador es un dibujo hecho aquí** (`theme/presenter.js`): medio cuerpo, con manos, que
  mueve la boca con la voz y gesticula (saluda, explica, señala, cuenta con los dedos). No es la
  cara de nadie. Sale en todas las escenas: grande en las suyas (abrir, cerrar y las que
  presenta él) y como una cara en un círculo, en la esquina, en las demás. El usuario quería un avatar hiperrealista y lo descartó por el coste
  (2026-10-06): no se sustituye por un avatar realista, por un servicio de avatares ni por vídeo
  de una persona real sin que él lo decida.
- **Publicar es decisión del usuario, vídeo a vídeo, y la da al pedirlo.** Desde el 2026-10-07
  quiere que un vídeo se suba a YouTube al terminar de hacerlo *cuando él lo pida*: "haz el
  vídeo de X y súbelo" vale para ese vídeo y para nada más. Sin esas palabras no se sube nada:
  aprobar un brief o un guion, o pedir solo el vídeo, no es pedir la publicación. Se sube con
  `make upload` (la API de YouTube; `make auth` la deja lista, una vez, y lo lanza él), con la
  visibilidad que él diga y, si no dice ninguna, en público (`[youtube] privacy` en
  `channel.toml`; decisión suya, 2026-10-07). Mientras YouTube no haya
  auditado el proyecto de la API, lo que se sube por ella queda en privado, y se le dice. A mano
  sigue pudiéndose: `make kit` deja el texto que pegar en YouTube Studio y `make published`
  apunta la dirección. **Instagram** (cuenta `the_market_hub_app`, desde el 2026-10-08) va igual:
  el Short se publica como reel con `make instagram`, solo cuando él lo pida para ese vídeo.
  **"Súbelo" vale para los dos** (decisión suya, 2026-10-13): pedir que un vídeo se suba es pedir
  YouTube y, después, el reel en Instagram; si nombra solo uno ("súbelo a YouTube"), va solo ese.
  El reel sale cuando el vídeo ya está en público en YouTube, porque su pie lleva esa dirección:
  si YouTube lo dejó en privado, el reel espera y se le dice. Un
  story (`make story`, una imagen dibujada aquí en `stories/`) se publica igual: solo el que él pida. El
  token de Instagram lo genera y lo guarda él en `.secrets/`; no se le pide en el chat.
- **No se gasta sin preguntar.** Los servicios de pago decididos son la voz (abajo) y la API de
  X para publicar (arriba: los posts que pide el usuario y los cinco diarios sin enlace). Cualquier
  otro (imágenes, música, otra voz) no se usa sin que el usuario lo decida antes.
- **Nada de trading** ni conectores de broker, como en el resto del workspace.
- **Nada programado y nada en GitHub Actions.** Todo se lanza a mano, con una skill o desde el
  `Makefile`. Tampoco se programa la publicación en YouTube. La única excepción es `autopost`
  (arriba), que el usuario pidió el 2026-10-21: tareas programadas de la app de Claude, no un
  servicio ni un cron en la nube.
- **Claves solo en `.secrets/`, en `.env`, en el entorno o en Secret Manager.** Nunca en el repo,
  en logs ni en commits. Las de la API de X están también en Secret Manager
  (`market-hub-x-api-keys`, proyecto `arctic-robot-474306-g3`): en otro equipo, `make xkeys` las
  deja en `.secrets/x-api.json` (README, "X"). Nunca se le pide al usuario una contraseña, un token o un código: `make auth` lo
  lanza él y se identifica en su navegador.
- **Un vídeo publicado no cambia de carpeta.** El slug (el nombre de la carpeta sin la fecha) no
  se toca. Una corrección se dice en la descripción del vídeo.

## El formato y las series

El canal se dirige a **gente joven, no a niños**, y a un **público general**, no solo de EE. UU.
(decisiones del usuario, 2026-10-06): titulares
grandes y cortos, escenas breves, cada cosa en pantalla cuando la voz la nombra, y un tono
directo que no trata al espectador de tonto. Nada de emojis, de jerga forzada ni de prisa sin
motivo.

**Colorido y didáctico, y sin poner el foco en el dinero como tal** (el usuario, al ver el
primer episodio en negro, con un solo color y contado todo en dólares, 2026-10-06):

- *Colorido*: fondos de color saturado que cambian con cada parte del vídeo (los tonos de
  `theme/slide.css`: `tone-ocean`, `tone-plum`, `tone-forest`, `tone-ember`, y el índigo si no se
  dice nada) y una paleta viva para lo que se dibuja. No se vuelve al negro con un solo color.
- *Didáctico*: la idea se enseña primero con algo que se ve y que cualquiera conoce (un
  nenúfar que se duplica en un estanque, una pila de bloques, una bola de nieve), dibujado y
  en movimiento; una pregunta que el espectador intenta contestar antes de oír la respuesta;
  una cosa por escena; y un repaso al final.
- *El dinero es la aplicación, no el hilo*: las cifras en dólares llegan cuando la idea ya se ha
  entendido, y ocupan una parte del vídeo, no todo. Un vídeo que es una ristra de cantidades
  no es el formato.

El contenido va **por temáticas**: cada serie (`[series.*]` en `channel.toml`) es un tema, una
lista de reproducción de YouTube y un color en todas las diapositivas de sus vídeos. Un guion
dice su serie con `series:` y su número con `episode:`. La primera es **Money 101**, de enseñar
finanzas personales. En una serie de enseñar la regla de no aconsejar pesa todavía más: se
explica cómo funciona algo (el interés compuesto, la inflación, una deuda) y qué cambia según
lo que se haga, no qué debe hacer quien lo ve.

**Todos los vídeos abren y cierran igual** (decisión del usuario, 2026-10-06): una intro y un
cierre comunes al canal, dibujados una vez en `channel/intro.html` y `channel/outro.html` y
dichos una vez (`[intro]` y `[outro]` en `channel.toml`; su voz, en `channel/voice/`, sí está en
git para que suene igual en todos). El montaje los pone solo, al principio y al final de cada
vídeo; el Short y los tráileres no los llevan. Toman el color y el nombre de la serie del
vídeo. El cierre dura lo que pide la pantalla final de YouTube y deja sitio para el vídeo
siguiente y el botón de suscribirse. Un guion no escribe su propia intro ni su despedida, y un
cambio en la intro o el cierre cambia todos los vídeos que se monten después.

`kind: trailer` es un vídeo que presenta el canal o una serie: dura lo que dice `[trailer]` y,
al no llevar cifras, no necesita fuentes.

## Una demo de la app no es un vídeo del canal

Una demo de Market Hub (para enseñar el producto o guiar a quien lo va a probar) **no usa este
formato**: ni presentador, ni diapositivas, ni inglés. Es una **grabación de pantalla de la propia
app, narrada en español**, como alguien que comparte su pantalla, sin cortes: primero lo público
y después My Hub. Lo decidió el usuario el 2026-10-08, al rechazar una primera demo hecha con
diapositivas y el presentador ("no quiero que salga el monigote… que solo se vea la app").

La que hay está en `videos/2026-10-08-my-hub-demo/` y es el ejemplo a seguir: `guion.md` (lo que
dice la voz, tramo a tramo), `record.py` (lo que hace la pantalla en cada tramo: un Chrome de
verdad con su puntero, grabado por tomas que se unen donde cambia la página) y `capture/seed.py`
(las cuentas de demostración). Lo público se graba de la web desplegada; lo que pide sesión, de un
portal en este equipo con el mismo código, **una cuenta de demostración (nunca la de una persona)
y sin claves de modelos**, para no gastar. No pasa por `make check` ni por `make render`, y no se
sube al canal: la comparte el usuario a mano.

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
