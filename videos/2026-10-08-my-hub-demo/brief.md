# Market Hub, el recorrido (demo)

Lo pidió el usuario el 2026-10-08: un vídeo demo para compartir que explique toda la
funcionalidad de la versión desplegada, con el foco en My Hub, y que guíe a un grupo de personas
a probarla.

**No es un vídeo del canal.** La primera versión se hizo con el formato del canal (en inglés, el
presentador dibujado, capturas dentro de diapositivas) y el usuario la rechazó entera ese mismo
día. Lo que pidió entonces, y lo que es esta demo:

- **en español**;
- **sin el presentador**, y **solo la app en pantalla**;
- **primero lo público y luego My Hub**;
- **como una persona compartiendo pantalla, sin cortes y enseñándolo todo**.

Después dijo que **la app de móvil no hace falta de momento**: la demo no la enseña ni pide
testers para ella (se llegó a grabar esa toma; se quitó).

## Qué enseña, en orden (9 minutos y medio)

1. **Lo público** (la web desplegada, https://themarkethub.app): la portada, Today, Markets, la
   ficha de una empresa desde el buscador, News y un artículo, Opinion y un artículo con sus
   comentarios, y Media.
2. **Entrar** (Google, o email y contraseña de diez caracteres; no hay recuperación de contraseña)
   y **Portfolio**: se añade una posición y una acción a la watchlist, y se guarda.
3. **Overview**: las cuatro cifras, la cartera en frases, el gráfico frente a los índices (lo que
   se tiene hoy mantenido durante el periodo, no la rentabilidad real: no se guardan operaciones)
   y las posiciones.
4. **Analysis**: las cuatro agrupaciones, frente a los índices, cómo se mueve y cómo reparte el
   peso, hoy posición por posición, y la tabla que se ordena.
5. **Watchlist**: el muro de gráficos y sus controles, las fichas, mirar otra acción, Readings, y
   Map con la lectura que se abre desde la tabla.
6. **Community**: compartir la cartera (se hace en pantalla), el tablero, y la competición
   mensual: se monta y se envía una cartera para noviembre.
7. **Las herramientas**: Fundamentals (una empresa, sus pestañas y la comparación), Earnings,
   Peers y Playground.
8. **Account and data**, y lo que se le pide a quien lo ve: probarlo todo y contar lo que falle,
   lo que vaya lento, lo que no cuadre y lo que no se entienda.

## Cómo está hecho

- `guion.md` es lo que dice la voz, por tramos. La voz es la del canal en español
  (`es-ES-Chirp3-HD-Schedar`, Google Cloud Text-to-Speech, dentro de su tramo gratuito).
- `record.py` es lo que hace la pantalla en cada tramo: maneja un Chrome de verdad (1280 × 720,
  grabado a 1920 × 1080) con un puntero que se mueve, pulsa, escribe y hace scroll. Cada tramo se
  dice primero, y la pantalla se acompasa a lo que dura.
- **Diez tomas, unidas donde cambia la página**: una toma acaba con el puntero pulsando un enlace
  y la siguiente empieza con esa página abriéndose, así que se ve como una sola sesión. Son varias
  porque cada herramienta es un servicio aparte y este equipo deja arrancar dos a la vez, y para
  poder repetir solo la parte que salga mal.
- **Lo público es la web desplegada.** Se corta la petición que refresca las noticias, que gasta
  el crédito del modelo, y el contador de visitas.
- **Lo que pide sesión es un portal en este equipo** con el mismo código que el desplegado
  (`market-hub-landing` en `a87baf9`), precios reales de Yahoo, y la cuenta de demostración de
  `capture/seed.py` ("Sam Demo") con otras seis que comparten cartera, para que el tablero no
  salga vacío; la voz dice que son de demostración y que el real está casi vacío. Las
  configuraciones `*-demo-windows` de `.claude/launch.json` del workspace lo arrancan.

## Lo que el vídeo no enseña como es en producción

Se grabó **sin claves de modelos**, para no gastar:

- Las frases de Overview y de las lecturas de Watchlist son las que escribe el código; en
  producción, donde el modelo contesta, salen las suyas.
- **Earnings no lee ningún comunicado** (lo hace un modelo de pago): se escribe la empresa, se
  señala el botón y se pasa a Market trends.
- **Playground** va con su compositor de pega (`PLAYGROUND_SCRIPTED=1`): por eso lo que se le
  escribe lleva los tickers en mayúsculas.
- En Fundamentals se señala el botón de la lectura con IA, sin pulsarlo.

En pantalla hay cosas que no son nuestras, como en la web: el botón de Google, los logotipos de
empresas del mapa de TradingView y, en Media, las carátulas de los vídeos del canal (con el
presentador).

## Decisiones tomadas al hacerlo (el usuario no las ha visto)

- La interfaz se queda en inglés: lo que pidió en español es la demo, o sea la voz.
- Habla en primera persona ("te lo enseño", "cuéntame qué has encontrado") y no da una dirección
  de contacto: lo envía él.
- Dura 9:37. Quien lo montó no puede oírlo: cómo pronuncia la voz española los nombres en inglés
  (Overview, Watchlist, Playground…) lo juzga el usuario.
