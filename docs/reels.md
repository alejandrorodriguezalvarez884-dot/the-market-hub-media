# Los reels de Instagram

Desde el 2026-11-02 la cuenta de Instagram `the_market_hub_app` está reenfocada en **reels en
español**, en tres líneas, y desde el 2026-11-03 en cuatro (la de **Lee el gráfico**). Este documento basta para seguir en otro ordenador: qué hay, qué es
automático, qué se pide a mano y cómo dejarlo todo listo.

## Las tres líneas

| Línea | Cuándo | Voz (ElevenLabs) | Aspecto | Destacada |
|---|---|---|---|---|
| **Market updates**: apertura y cierre de Wall Street, de lunes a viernes; el repaso de la semana, el sábado a las 18:00 (antes a las 10:00; el usuario, 2026-11-03); y los futuros y la semana que viene, la noche del domingo al lunes a la 01:05 (los futuros abren a medianoche de España) | **Automáticos, en la nube**, de lunes a viernes: apertura a las 15:45 y cierre a las 22:05 (hora de Madrid), con el ordenador apagado | Dani (`[reel]` en `channel.toml`) | Oscuro: `<body data-bg="...">` | "Al día" (propuesta) |
| **Reflexión**: una tesis sobre los mercados, con fuentes | **A demanda**: cuando el usuario da el tema y lo pide | Julián, "profesor sereno" (`[reel.voices.reflexion]`) | Ensayo: `<body class="light essay">` | "A fondo" |
| **Didácticos**: un concepto de bolsa, con un guiño al mercado de hoy | **A demanda**: cuando el usuario da el tema y lo pide | Rafa (`[reel.voices.didactico]`) | Claro y colorido: `<body class="light">` | "Aprende" |
| **Lee el gráfico**: un gráfico real con el valor y las fechas tapados, "¿qué crees que pasó después?", cinco segundos de cuenta atrás con tic, y la respuesta: el patrón, qué pasó en ese caso y que un patrón no es una promesa | **A demanda**: cuando el usuario pide un patrón (o deja elegirlo) | Rafalupi (`[reel.voices.grafico]`), elegida por el usuario de oído el 2026-11-03 | Papel liso, gráfico de velas: `<body class="light chart-reel" data-bg="plain">` | "Lee el gráfico" (propuesta) |

En época de resultados, los resultados van primero en los cuatro (el usuario, 2026-11-02).

**Cómo se dibujan** (desde el 2026-11-09; el usuario: «usar remotion para los videos»): los
reels a demanda de reflexión, didácticos y especiales, y los vídeos largos, con **Remotion**
(escenas en React, `slides/<escena>.tsx`, con el kit de `remotion/src/kit/`); los diarios y Lee el
gráfico, todavía como páginas HTML. Qué cambia, el kit y lo que falta para pasar los diarios de la
nube: [docs/remotion.md](remotion.md). Las órdenes no cambian: `make reel` elige solo.

**Todas las voces hablan con el modelo `eleven_v4` de ElevenLabs** desde el 2026-11-03 (el usuario:
"para estos reels y para todos uses el modelo de v4"): el `model` de `[reel]` y de cada
`[reel.voices.*]` en `channel.toml`.

Ejemplos que copiar: `reels/2026-11-02-open/` (diario), `reels/2026-11-02-not-a-bubble/`
(reflexión), `reels/2026-11-02-bond-yields-vs-stocks/` (didáctico) y
`reels/2026-11-03-grafico-doble-suelo/` (Lee el gráfico). Cómo se hace cada uno, paso a paso, está
en la skill [`daily-reel`](../.claude/skills/daily-reel/SKILL.md), salvo Lee el gráfico, que tiene
la suya: [`chart-reel`](../.claude/skills/chart-reel/SKILL.md).

**Lee el gráfico** (el usuario, 2026-11-03: "vídeos con un patrón, preguntes a la persona que ve
el reel qué haría y luego des la solución explicando, tras haber dejado un poco de tiempo para
pensar"). Se inspira en el ritmo de un reel que el usuario guardó en Instagram (`velasyvolumen`:
"¿Compras o vendes? Tienes 5 segundos", un martillo, 75 s), pero no en su tono: aquí la pregunta
es de lectura del gráfico ("¿qué crees que pasó después?"), nunca "¿compras o vendes?"; el gráfico
es siempre un episodio real (velas diarias de Yahoo Finance, `make candles`), no un esquema; y la
respuesta cuenta lo que pasó en ese caso y dónde habría fallado, sin señales, objetivos ni
porcentajes de acierto. Se alternan casos en que el patrón se cumplió y casos en que falló. El
gráfico lo dibuja `theme/chart.js` (con `theme/chart.css`); la cuenta atrás es una escena sin voz
con `seconds: 5` y `sound: tick` (un tic hecho con ffmpeg, no una grabación). La voz habla rápido
dentro de cada frase y hace más pausa entre frases: cada escena se dice de un tirón y el código
alarga cada pausa de fin de frase hasta `sentence_pause` (0,55 s), sin tocar comas ni puntos
suspensivos. Dónde acaba cada frase lo dice ElevenLabs: la voz se pide con el instante de cada
letra (la llamada "with-timestamps", al mismo precio), y la pausa va justo entre la última letra
de una frase y la primera de la siguiente; adivinarlo metió la pausa dos veces dentro de una
palabra ("f…ue"). La voz tal como llega y esos tiempos se guardan en `voice/raw/`, y cambiar la
pausa no vuelve a gastar. Decir cada frase aparte y unirlas sonaba raro y se descartó. El gancho va más despacio (`speed: 0.85` en `01-hook`): lo pidió el
usuario al ver el primero ("que hable rápido en la misma frase pero que dé un poco más de pausa
entre frases… al principio quiero que vaya más despacio exponiendo la pregunta"). Las historias de
presentación de cada línea, las primeras de cada destacada, están en `stories/2026-11-02-intro-*`.

## También en X

**Cada reel se publica también en X** (decisión del usuario, 2026-11-02), en la cuenta
@the_market_hub_: un hilo corto **en español**, con el vídeo en el primer post (`x.txt` en la
carpeta del reel; la skill dice cómo se escribe). `make reelpost` lo pone después de Instagram;
`make reelx` lo reintenta. El vídeo se sube a X por partes (`xapi.upload_video`, probado el
2026-11-02). Cuesta unos 0,015 $ por post en X (2 a 4 por reel); el precio de la subida del vídeo
no lo publica X. Sin enlaces, para no pagar 0,20 $ por post. Las claves de X: en el Mac,
`.secrets/x-api.json` (`make xkeys`); en la nube, `X_API_KEYS_SECRET`, que lee el secreto
`market-hub-x-api-keys` con la cuenta de servicio.

## Cómo pedir uno a demanda

Basta con decirlo en una sesión de Claude Code abierta en el workspace, con el tema:

- "Haz un reel de reflexión sobre <tema> y súbelo".
- "Haz un reel didáctico sobre <concepto> y súbelo".
- "Haz un reel de Lee el gráfico con un <patrón>" (o sin patrón: Claude elige uno que no esté
  hecho), con "y súbelo" si se publica. Lo hace la skill `chart-reel`.

Claude sigue la skill `daily-reel` (su última parte): busca las fuentes, escribe el guion, dibuja
las diapositivas, pone la voz, monta, revisa cada fotograma y, si la petición dice "súbelo", lo
publica con `make reelpost`. Sin "súbelo" lo deja montado y lo enseña. Después pregunta si se hace su
vídeo largo de YouTube (abajo, "El vídeo largo de cada reel a demanda"); solo con un sí lo hace, y
después pregunta aparte si se sube.

**Las reglas de los reels a demanda** (el usuario, 2026-11-06, tras ver sus números en
`docs/instagram-strategy.md`): duran **90 segundos como mucho** (`make reelcheck` lo comprueba);
empiezan con algo del mercado de hoy que se entiende **sin sonido**; y salen **a las 19:30 de
Madrid, de lunes a viernes, uno al día como mucho y a dos horas o más de cualquier otro reel**.
"Súbelo" pedido antes de esa hora deja el reel montado para las 19:30; una hora que diga el usuario
manda. Los diarios no se piden: los
hacen las tareas programadas (abajo). Uno de reflexión puede defender una opinión; ninguno
aconseja ni predice precios.

## El vídeo largo de cada reel a demanda, en YouTube

Desde el 2026-11-09 (el usuario: "automatizar la creación de videos largos de 10/12 mins a youtube
cada vez que te pida un reel que no sea de los automatizados"; y ese mismo día: "Quiero que me preguntes para generar el video de youtube después del reel"),
**después de cada reel que pide el usuario se le pregunta, en una línea, si se hace su vídeo
largo en YouTube** sobre el mismo tema; solo con su sí se hace, en la misma sesión, con la skill
[`long-video`](../.claude/skills/long-video/SKILL.md). Subirlo es otro sí aparte. **Los diarios no
lo tienen** (apertura, cierre, semana y futuros): siguen como están y no se pregunta nada.

| | El reel | Su vídeo largo |
|---|---|---|
| Dónde | Instagram (y X) | YouTube |
| Duración | 90 s como mucho | **10 a 12 minutos**, en cinco a ocho capítulos |
| Idioma y voz | Español, la voz de su línea | La misma: español, la misma `voice:` (ElevenLabs v4) |
| Aspecto | Vertical | El mismo, en horizontal: `theme/reel.css` + `theme/long.css`, sin presentador |
| Carpeta | `reels/<fecha>-<palabras>/` | `videos/<fecha>-<palabras>/` (el mismo nombre), `kind: long`, `reel: <carpeta del reel>` |
| Se publica | Con "súbelo", a las 19:30 | **Solo tras un sí explícito a ese vídeo**, cuando el usuario lo ha visto |

Cómo va: el reel primero (con su hora); la pregunta; con el sí, `make longnew REEL=<carpeta>`, que empieza el
vídeo con el título, la voz, el aspecto y todas las fuentes del reel; más investigación (el
contexto, cómo funciona, las cifras que no cupieron, la mejor objeción); el guion de unas 1.800 a
2.050 palabras; una diapositiva por escena dibujada en horizontal; `make check` y `make render`
(sin voz, para mirarlo antes de pagar); la voz (`make voice`, unos 10.000 a 13.000 caracteres de
ElevenLabs); otra vez `make render` y `make check`; y la pregunta al usuario: "¿lo subo a
YouTube?". Con su sí, `make upload` lo sube en público por la API (así salió el primero, el caso
Jensen Huang, el 2026-11-09: https://www.youtube.com/watch?v=oLFyoiVBUi8), y se añade a la lista
«A fondo» de la página Media del portal. Si el permiso de YouTube ha caducado, `make auth` lo
renueva el usuario (`docs/youtube-audit.md`); a mano en YouTube Studio queda como alternativa.

Sin "AI slop" (el usuario, 2026-11-09): ni frases hechas, ni preguntas de dos palabras que se
contestan solas, ni relleno, ni diapositivas repetidas o con adornos; `make check` rechaza las
muletillas más claras y la skill (paso 3b) dice el resto.

Lo eligió el usuario el 2026-11-09: en español con la voz del reel (no en inglés como los vídeos
del canal ni con la voz de Google) y con el aspecto del reel (no el del canal con presentador).

## Lo que hace siempre el usuario, en la app

- **Compartir cada reel en historias** (el avión de papel del reel, "Añadir a tu historia"), para
  que al tocar la historia se vaya al reel, y guardarla en su destacada. La API de Instagram no
  puede compartir un reel en historias ni crear destacadas, y la web tampoco tiene esa opción. No
  se publican historias por la API para los reels (se probó a trocear el reel y a anunciarlo con
  una imagen, y el usuario lo descartó).
- **Borrar** un post o una historia: la API no puede, y borrar es siempre decisión suya.
- **Renovar el token de Instagram** si caduca (abajo).

## La automatización de los diarios

**Desde el 2026-11-02 por la noche corren en la nube**, como dos rutinas de Claude
(https://claude.ai/code/routines), en el entorno "Market Hub reels" (sección siguiente):

| Rutina | Cron | Id |
|---|---|---|
| Market Hub · reel de la apertura de Wall Street | `CRON_TZ=Europe/Madrid 45 15 * * 1-5` | `trig_01HJz9NnNtepWjiiTcUFoC8o` |
| Market Hub · reel del cierre de Wall Street | `CRON_TZ=Europe/Madrid 5 22 * * 1-5` | `trig_01MgSgfpR5a8YPi6FHN7h7gv` |
| Market Hub · reel de la semana (sábado, `week`) | `CRON_TZ=Europe/Madrid 0 18 * * 6` | `trig_01YM4JwMLEvqA7Fp8dkMPcz9` |
| Market Hub · reel de la semana que viene (noche del domingo, `ahead`) | `CRON_TZ=Europe/Madrid 5 1 * * 1` | `trig_016A6VKPeVAbJV1sjtqweDTU` |

Corren aunque el ordenador esté apagado; cada una tarda unos 15 minutos (el montaje, unos 8). Su
texto es el de las tareas del Mac (abajo) con lo propio de la nube (`git pull`, `uv sync`, el
montaje en segundo plano, publicar en `main`). Cómo ha ido una se ve en su página, o con
`RemoteTrigger` (`list_runs`, `get_run_log`). No llevan conectores. Probadas el 2026-11-02 (dos
rutinas de prueba de una vez: todo bien; el montaje de un reel de 1:41, 7 min 53 s).

**Antes** eran dos tareas programadas de la **app de Claude en el Mac del usuario**, que siguen ahí
**en pausa** (no se activan a la vez que las rutinas: saldría cada reel dos veces):

| Tarea | Cron (hora local) | Empieza de verdad | Argumento |
|---|---|---|---|
| `market-hub-reel-open` | `37 15 * * 1-5` | 15:45 (la app añade unos 8 minutos) | `open` |
| `market-hub-reel-close` | `0 22 * * 1-5` | hacia las 22:08 | `close` |

Cada una tarda unos 10 minutos en hacer y publicar su reel. **Solo corren con la app de Claude
abierta y el Mac despierto**; si la app está cerrada a esa hora, la tarea corre al abrirla. Las
tareas del Mac no viajan: en otro ordenador hay que crearlas de nuevo con estos textos, y **solo un
ordenador debe tenerlas activas** (dos publicarían el mismo reel dos veces). Si una tarea se para a
pedir permiso, se pulsa "Run now" una vez en su página de la app y se aprueba lo que pida, o se le
pone un modo de permisos.

El texto de cada tarea (cambiando `open` por `close`, y "OPEN" por "CLOSE", en la segunda; y la
carpeta por la del repo en ese ordenador):

```text
Make and publish today's reel of Wall Street's OPEN for Market Hub's Instagram account, in Spanish, with nobody watching.

Work in the repo <path>/TheMarketHub/the-market-hub-media. Read its CLAUDE.md first, then follow the skill .claude/skills/daily-reel/SKILL.md with the argument "open", step by step: check Wall Street is open today and that today's open reel is not already up, find what happened from sources read now, write the script, slides and caption, run `make reel`, look at every frame, `make reelcheck`, `make reelpost`, commit and push only the reel's folder.

The user decided on 2026-11-02 that these reels are published without asking them. Describe, never advise; every figure from a source read in this run; nothing made by others on the slides except company logos from theme/logos/. If Instagram refuses (for example an expired token), do not retry: leave the folder and say what Instagram answered. Never ask for or handle tokens or passwords.

End with a short report in Spanish: the reel's address (or why it is not up), how long it runs, what it told, and anything decided or left unchecked.
```

Las tareas `market-hub-autopost` (posts en X) siguen en el Windows del usuario y ya no hacen
carruseles en Instagram (`autopost` con `ig` hace solo el post de X).

## En la nube, con el ordenador apagado

Las tareas del Mac solo corren con el Mac encendido y la app abierta. Para que los diarios no
dependan de eso (el usuario, 2026-11-02: "si está este ordenador apagado no se crean? necesito que
se haga automáticamente"), corren como **rutinas en la nube de Claude** (claude.ai/code/routines):
una sesión de Claude Code en los servidores de Anthropic, con su propia copia de este repo, a la
hora de Madrid, que sigue la misma skill y publica igual. Gastan del uso de Claude del usuario.
Solo un sitio a la vez: con las rutinas activas, las tareas del Mac se desactivan.

Lo que una sesión en la nube no tiene, y cómo lo suple el repo (`src/marketmedia/cloud.py`):

| En el Mac | En la nube |
|---|---|
| La sesión de `gcloud` | `GOOGLE_SERVICE_ACCOUNT_JSON`: la clave de la cuenta de servicio `market-hub-reels`, que solo puede escribir en el bucket de los reels y en Firestore, y leer y renovar el token |
| `.secrets/instagram-token.txt` | `INSTAGRAM_TOKEN_SECRET`: el token vive en Secret Manager (`market-hub-instagram-token`) y la nube lo renueva allí, porque su disco no dura |
| `.secrets/elevenlabs-key.txt` | Un secreto de red del entorno para `api.elevenlabs.io` (cabecera `xi-api-key`) y `ELEVENLABS_KEY_BY_PROXY=1` |
| Chrome y San Francisco | `MEDIA_BROWSER=chromium` y las tipografías Inter, JetBrains Mono y Noto Serif (`scripts/cloud-setup.sh`) |

**Puesta en marcha, una vez**:

1. El usuario, en su ordenador, desde `the-market-hub-media/`: `scripts/cloud-google-setup.sh`
   (crea la cuenta de servicio, sus permisos y el secreto del token, y deja la clave copiada).
   Si la clave se pierde o hay que cambiarla: `scripts/cloud-google-key.sh` (borra las anteriores y copia una nueva).
2. En claude.ai/code, un entorno nuevo, "Market Hub reels": acceso a la red **Full** (los reels
   leen el portal, SEC, Yahoo, ElevenLabs, Instagram y Google); como script de preparación, el
   contenido de `scripts/cloud-setup.sh`; y estas variables (las claves las pega el usuario):

   La clave de ElevenLabs va como **secreto de red** (el proxy la añade a cada petición a
   `api.elevenlabs.io`, en la cabecera `xi-api-key`, sin que la sesión la vea), no como variable.

   ```text
   ELEVENLABS_KEY_BY_PROXY=1
   X_API_KEYS_SECRET=projects/arctic-robot-474306-g3/secrets/market-hub-x-api-keys
   GOOGLE_SERVICE_ACCOUNT_JSON=<lo que deja copiado el paso 1>
   INSTAGRAM_TOKEN_SECRET=projects/arctic-robot-474306-g3/secrets/market-hub-instagram-token
   GOOGLE_CLOUD_PROJECT=arctic-robot-474306-g3
   MEDIA_BROWSER=chromium
   ```

3. Dos rutinas sobre el repo `alejandrorodriguezalvarez884-dot/the-market-hub-media`, en ese
   entorno, con `CRON_TZ=Europe/Madrid 45 15 * * 1-5` (apertura) y `CRON_TZ=Europe/Madrid 5 22 * * 1-5`
   (cierre), y el mismo texto que las tareas del Mac (arriba) más: "Run `uv sync` first. Commit
   and push to `main`, not to a claude/ branch." Se prueba una con "Run now" y, si publica, se
   desactivan las tareas del Mac.
   **Sin conectores**: al crear una rutina por la API se le añaden todos los conectores de
   claude.ai del usuario, el del bróker (IBKR) incluido, que el workspace prohíbe usar. Se quitan
   (`clear_mcp_connections`) y se comprueba que la rutina no tenga ninguno.

Si el token de Instagram se genera de nuevo algún día, se guarda también en el secreto:
`gcloud secrets versions add market-hub-instagram-token --project=arctic-robot-474306-g3 --data-file=.secrets/instagram-token.txt`.

## En otro ordenador

Desde la raíz del workspace (`scripts/sync.sh` deja cada submódulo en la punta de `main`), y luego
dentro de `the-market-hub-media/`:

1. `make install` (Python 3.12 con `uv`; Chrome instalado: dibuja los fotogramas) y `make remotion`
   (Node.js 18 o más; instala Remotion en `remotion/`, y la primera película descarga su Chrome).
2. `gcloud auth login` y `gcloud auth application-default login` con la cuenta del usuario, y
   `gcloud config set project arctic-robot-474306-g3` (el bucket de los reels y la voz de Google).
3. **La voz de los reels**: `make elevenkey` trae la clave de ElevenLabs de Secret Manager
   (`ELEVENLABS_API_KEY` del proyecto `llamazo-prod`, la cuenta del usuario) a
   `.secrets/elevenlabs-key.txt`.
4. **Instagram**: el token no está en Secret Manager (se renueva solo en el disco y una copia se
   quedaría vieja). O se copia `.secrets/instagram-token.txt` del otro ordenador, o se genera uno
   nuevo: en https://developers.facebook.com/apps/, la app "Market Hub Publisher", caso de uso de
   Instagram, "API setup with Instagram login", "Generate access tokens", el segundo "Generate
   token" (el de `the_market_hub_app`; el primero es de `wyncall.ai`). Lo genera y lo guarda el
   usuario: `pbpaste > .secrets/instagram-token.txt`. `make instagram CHECK=1` dice de qué cuenta es.
5. **X** (los posts): `make xkeys`.
6. `make test`, y crear las dos tareas programadas (arriba) si este ordenador va a ser el que las
   corre, y desactivarlas en el otro.

## Coste

- **ElevenLabs** (la voz de los tres): unos 1.600 a 1.900 caracteres por reel, de la cuenta del
  usuario. Dos diarios al día son unos 70.000 caracteres al mes, más los que se pidan.
- **Instagram**: gratis. El vídeo pasa unos minutos por el bucket
  `arctic-robot-474306-g3-market-hub-reels` y se borra.
- **El vídeo largo de cada reel a demanda**: unos 10.000 a 13.000 caracteres de ElevenLabs por
  vídeo (unos siete reels). YouTube, gratis.
- **Claude**: cada reel lo piensa una sesión de Claude Code, con la cuota del usuario.

## Comandos

```bash
make reelnew MOMENT=open                 # o close, o unas-palabras para uno a demanda
make reelcheck REEL=<carpeta>            # lo que impide publicarlo
make reel REEL=<carpeta> [DRY=1]         # voz, fotogramas y build/reel.mp4
make reelpost REEL=<carpeta> [AGAIN=1]   # publicarlo (AGAIN=1: otra vez, si el usuario borró el primero)
make longnew REEL=<carpeta>              # el vídeo largo de un reel a demanda, en videos/<carpeta>/
make check VIDEO=<carpeta>               # lo que impide publicarlo (10 a 12 minutos, capítulos, su reel)
make voice VIDEO=<carpeta> [DRY=1]       # su voz, la del reel (DRY=1: cuántos caracteres, sin gastar)
make render VIDEO=<carpeta>              # fotogramas y build/video.mp4
make kit VIDEO=<carpeta>                 # el texto para YouTube Studio, solo tras el sí del usuario
make story STORY=stories/<carpeta>/story.html [DRAW=1]   # una historia suelta (imagen), solo si el usuario la pide
make elevenkey                           # la clave de ElevenLabs, en un ordenador nuevo
make film PIECE=reels/<carpeta> STILLS=1   # con Remotion: solo la imagen de cada escena, para mirarlas antes
make remotion                            # instalar Remotion en un ordenador nuevo (npm ci en remotion/; necesita Node)
make candles REEL=<carpeta> SYMBOL=TSLA FROM=2024-12-02 TO=2025-07-15   # las velas de un reel de Lee el gráfico (Yahoo Finance)
```
