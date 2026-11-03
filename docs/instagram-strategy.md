# Instagram: a qué hora y cuántos reels al día

Estudio y propuesta del 2026-11-03, para la cuenta `the_market_hub_app`. **Es una propuesta: no
cambia nada.** Las horas de las rutinas y la frecuencia las decide el usuario. Cambiar una tarea
programada necesita su permiso expreso.

Todas las horas son **de Madrid**. Desde el 2026-10-25 Madrid está en UTC+1, y desde el
2026-11-01 Wall Street abre a las 15:30 y cierra a las 22:00 de Madrid.

## En corto

1. **Seguir con los dos diarios** de lunes a viernes, a las **15:45 (apertura)** y a las **22:05
   (cierre)**. Su hora la marca el mercado. Además, las 22:05 caen en la tarde de Latinoamérica
   (15:05 en Ciudad de México).
2. **Como mucho un reel a demanda al día**, a las **19:30**, solo de martes a jueves. Uno por
   línea: martes **Aprende**, miércoles **Lee el gráfico**, jueves **A fondo**. A esa hora empieza
   la tarde en España y es mediodía en Latinoamérica (12:30 en Ciudad de México, 15:30 en Buenos
   Aires). No se publican a demanda por la mañana: entonces es de madrugada en América.
3. **Dejar al menos dos horas entre dos reels.** No consta que publicar varios seguidos reste
   alcance. Pero si salen juntos, no hay forma de saber qué hora funcionó.
4. **Pasar el repaso del sábado de las 10:00 a las 18:00.** A las 10:00 son las 03:00 en Ciudad de
   México. La noche del domingo (01:05) se queda: allí es domingo por la tarde. **Hecho el
   2026-11-03, por decisión del usuario**: la rutina corre ya a las 18:00, y la primera es el
   2026-11-07.
5. **Ningún reel de más de 180 segundos.** Por encima ya no entran en la pestaña Reels. Los diarios,
   entre 60 y 100 segundos. Los a demanda, 150 como mucho. **Hecho el 2026-11-03, por decisión del
   usuario**: `[reel] seconds = [60, 100]` y `asked_seconds = [40, 180]` en `channel.toml`.
   `make reelcheck` lo comprueba.
6. **Historias**: compartir cada reel en historias, como ahora, y nada más. **Carruseles**: ninguno
   por ahora. Se vuelve a mirar al llegar a 1.000 seguidores.
7. **Medir cada reel a las 24 horas y a las 72**, y revisar dos veces: el **2026-11-17** y el
   **2026-12-01**. Al llegar a 100 seguidores, Instagram empieza a decir a qué hora está conectada
   la audiencia y de qué país es; entonces se revisan las horas con esos datos.

En total, unos **12 o 13 reels a la semana**: 10 diarios, el del sábado, el de la noche del domingo
y hasta 3 a demanda. Es el tramo de "10 o más a la semana", el que más crece en el estudio de
Buffer, y es una carga que se puede sostener.

## Qué se publica hoy

| Línea | Cuándo (Madrid) | Frecuencia | Cómo |
|---|---|---|---|
| Apertura de Wall Street | 15:45, de lunes a viernes | 5 a la semana | Rutina en la nube |
| Cierre de Wall Street | 22:05, de lunes a viernes | 5 a la semana | Rutina en la nube |
| Repaso de la semana | Sábado, 10:00 | 1 | Rutina en la nube |
| Futuros y la semana que viene | Lunes, 01:05 | 1 | Rutina en la nube |
| Aprende (didáctico) | Cuando el usuario lo pide | Sin fija | A mano |
| A fondo (reflexión) | Cuando el usuario lo pide | Sin fija | A mano |
| Lee el gráfico | Cuando el usuario lo pide | Sin fija | A mano |
| Historias | Cada reel lo comparte el usuario desde la app | 1 por reel | A mano |
| Carruseles | Ninguno desde el 2026-11-02 (los sustituyeron los reels) | — | — |

Los posts de X (`autopost`, cinco al día) no entran aquí.

Las horas actuales en Latinoamérica:

| Madrid | Ciudad de México | Bogotá y Lima | Buenos Aires y Santiago |
|---|---|---|---|
| 15:45 | 08:45 | 09:45 | 11:45 |
| 19:30 (propuesta) | 12:30 | 13:30 | 15:30 |
| 22:05 | 15:05 | 16:05 | 18:05 |
| Sábado 10:00 | Sábado 03:00 | 04:00 | 06:00 |
| Sábado 18:00 (propuesta) | Sábado 11:00 | 12:00 | 14:00 |
| Lunes 01:05 | Domingo 18:05 | 19:05 | 21:05 |

México no cambia de hora desde 2022, así que en verano (desde el 2026-03-29) hay que sumar una hora
más de diferencia con Madrid.

## Lo que dicen los datos propios

Los datos se leyeron de la API de Instagram el 2026-11-03 a las 11:47, solo leyendo: los 8 reels
de la cuenta y sus métricas de por vida, más el A fondo de hoy. La API solo da cifras acumuladas,
no cuánto llevaba cada reel a una edad fija.

| Publicado (Madrid) | Reel | Dura | Edad | Alcance | Vistas | Tiempo medio visto | Me gusta | Guardados | Compartidos |
|---|---|---|---|---|---|---|---|---|---|
| Mar 13/10 13:12 | Market Hub, in one minute (inglés) | 60 s | 21 d | 107 | 126 | 6,7 s (11 %) | 5 | 1 | 0 |
| Mar 13/10 20:58 | The whole market (inglés) | 25 s | 21 d | 24 | 25 | 6,8 s (27 %) | 3 | 1 | 0 |
| Jue 15/10 16:08 | Launch (inglés) | 48 s | 19 d | 33 | 41 | 6,2 s (13 %) | 3 | 0 | 0 |
| **Lun 02/11 17:59** | Apertura: Wall Street rebota | 101 s | 18 h | **1.597** | 1.889 | 18,0 s (18 %) | 31 | 8 | 9 |
| **Lun 02/11 18:54** | Aprende: bonos contra bolsa | 175 s | 17 h | **1.053** | 1.238 | 33,7 s (19 %) | 28 | 8 | 4 |
| Lun 02/11 19:19 | A fondo: ¿burbuja? | 128 s | 16 h | 170 | 194 | 9,0 s (7 %) | 4 | 0 | 0 |
| Lun 02/11 22:52 | Cierre: la subida se esfuma | 106 s | 13 h | 18 | 32 | 32,7 s (31 %) | 3 | 2 | 1 |
| Mar 03/11 10:20 | Lee el gráfico: doble suelo | 78 s | 1,5 h | 95 | 136 | 18,2 s (23 %) | 2 | 2 | 0 |
| Mar 03/11 11:45 | A fondo: la IA, más barata que las defensivas | 152 s | minutos | — | — | — | — | — | — |

Y de la cuenta:

- **Seguidores: 25.** La cuenta sigue a 1.
- **Casi todo el alcance viene de quien no sigue la cuenta.** Desde el 2026-11-02: 2.745 de 2.749
  cuentas alcanzadas (99,9 %) y 3.421 de 3.545 vistas. Los reels se reparten por recomendación, no
  entre los seguidores.
- **El alcance diario pasó de 0 a 2 cuentas (finales de octubre, carruseles en inglés) a 2.630 el
  primer día de reels en español.** El día siguiente, hasta las 11:47, fueron 148.
- **Carruseles**: en el mes del 2026-10-06 al 2026-11-02, los carruseles en inglés alcanzaron a 3
  cuentas en total, con 97 vistas. Los reels de ese mes alcanzaron a 2.847. Los carruseles ya no
  están en la cuenta, así que esas cifras pueden haberse quedado cortas.
- **Lo que la API no da todavía**:
  - A qué hora está conectada la audiencia (`online_followers`) y de qué país, ciudad y edad es
    (`follower_demographics`). Instagram no lo da por debajo de 100 seguidores; ahora devuelve una
    lista vacía.
  - Seguidores ganados por reel (`follows`): la API no lo da para reels.

**Qué se puede concluir, y qué no.** Hay **5 reels en español**, todos de las últimas 19 horas, y
llevan publicados entre 1,5 y 18 horas. **No se puede concluir nada sobre la hora.**

- Los dos que más llegaron (1.597 y 1.053) salieron entre las 18:00 y las 19:00 del primer día de
  la línea nueva.
- El de las 22:52 lleva 18 de alcance en 13 horas.
- Pero cada uno es de una línea distinta, se publicaron con edades distintas, y tres salieron en
  80 minutos.

Hay dos cosas que sí se ven, con muy pocos casos:

- **Lo que cuenta es cuánto se queda la gente, más que la hora.** El de la burbuja salió a la
  misma hora que los dos buenos, pero se vio de media 9 segundos (el 7 % del reel) y no despegó.
  El tiempo de visionado es la primera señal del algoritmo, según Mosseri.
- **Los dos que despegaron fueron también los que más se compartieron y se guardaron** (9 y 4
  compartidos, 8 guardados cada uno). Compartir es lo que más pesa para llegar a quien no sigue la
  cuenta.

Para decidir horas hacen falta unos seis reels por hora probada, medidos a la misma edad. Eso
da la revisión del 2026-12-01.

## Lo que dicen las fuentes de fuera

**La hora.**

- Ningún estudio grande separa España o Latinoamérica. Todos miden en la hora local de la cuenta o
  de su audiencia.
  - Buffer (septiembre de 2026; 9,6 millones de posts de 2024-2025): lo mejor es el miércoles y el
    jueves; para reels, de 18:00 a 23:00. Lo peor, el viernes y el sábado y de 01:00 a 05:00.
  - Sprout Social (marzo de 2026): de martes a jueves, de 12:00 a 19:00. Para los servicios
    financieros, de martes a jueves; el fin de semana es lo peor.
  - Metricool (2024 y 2025; cientos de miles de cuentas): **el pico es a las 20:00**, y la mejor
    franja de 19:00 a 21:00.
  - Hootsuite (julio de 2026): el sábado, a las 11:00 y hacia las 17:00.
  - Later (abril de 2026, con datos de 2024) pone los reels a medianoche. Es el único estudio que
    lo dice, y no se sigue.
- **Para una audiencia de España y de América, una publicación puede caer en las dos puntas**
  (SchedPilot, octubre de 2026; un blog sin muestra, así que es un indicio débil). Las 21:30 de
  Madrid son las 14:30 de Ciudad de México, pero las 17:30 de Buenos Aires, una hora muerta. Las
  19:30 son un término medio: comienzo de la tarde en España, mediodía en México y Colombia, y
  media tarde en Argentina.

**La frecuencia.**

- Buffer (agosto de 2025; 2,1 millones de posts de 102.000 cuentas): publicar más se asocia con
  más seguidores y **más alcance por post**, no menos. Frente a 1-2 posts a la semana:
  - de 3 a 5 a la semana: un 12 % más de alcance por post;
  - de 6 a 9: un 18 % más;
  - 10 o más: un 24 % más.
- Metricool y HypeAuditor (octubre de 2025) ven lo mismo: más de 10 posts a la semana va con el
  mayor crecimiento.
- Mosseri (diciembre de 2024): no hay una frecuencia correcta. Publicar más ayuda al alcance, y lo
  que importa es un ritmo que se pueda sostener.
- **No hay datos ni ninguna declaración de Meta de que varios reels el mismo día se resten
  alcance.** El único caso conocido fue un fallo con muchas historias en un día, que Instagram
  reconoció y arregló (septiembre de 2025).

**Qué hace que un reel llegue lejos.** El tiempo visto, los me gusta por cuenta alcanzada y, sobre
todo para llegar a quien no sigue la cuenta, los envíos por cuenta alcanzada (Mosseri, enero de
2025, en resúmenes de terceros). Pierden visibilidad los reels con marca de agua, los
reaprovechados y los que son casi solo texto, y también las cuentas que repiten contenido ajeno
(Instagram; Social Media Today, abril de 2026). Todo lo de esta cuenta es propio.

**La duración** (Socialinsider; 9,77 millones de reels de enero a junio de 2026).

- La mediana de vistas es mejor entre 45 y 60 segundos (10.374), con un 0,35 % de interacción.
- Se mantiene alta hasta los 180 segundos: de 8.000 a 9.800 vistas.
- **Pasados los 180 segundos cae a la mitad (4.428)**, porque esos reels no entran en la pestaña
  Reels.
- Metricool (junio de 2026): el tiempo medio visto por reel es de 8,5 segundos, y la mayoría de
  las vistas llegan en los tres primeros días. La cuenta ya está por encima: de 9 a 34 segundos.

**Carruseles e historias.**

- Los reels son el formato que más alcance da: 1,36 veces el de un carrusel y 2,25 veces el de una
  imagen (Buffer, marzo de 2026).
- Los carruseles dan más interacción por cuenta alcanzada (6,9 % frente a 3,3 %) y muchos más
  guardados (Metricool, 2026). Pero se reparten sobre todo entre los seguidores, y aquí hay 25.
- Las historias solo las ven los seguidores: en estos días alcanzaron a 13 cuentas.

**Trial reels** (reels de prueba que solo se enseñan a quien no sigue la cuenta). Servirían para
probar horas o ganchos, pero piden **1.000 seguidores** (Social Media Today, julio de 2025). Según
documentación de terceros, la API de publicación los acepta (`trial_params`). Se miran al llegar a
esa cifra.

## La propuesta, con su porqué

| Día | 15:45 | 18:00 | 19:30 | 22:05 | 01:05 |
|---|---|---|---|---|---|
| Lunes | Apertura | | | Cierre | Futuros y la semana (ya está) |
| Martes | Apertura | | **Aprende** (si lo hay) | Cierre | |
| Miércoles | Apertura | | **Lee el gráfico** (si lo hay) | Cierre | |
| Jueves | Apertura | | **A fondo** (si lo hay) | Cierre | |
| Viernes | Apertura | | | Cierre | |
| Sábado | | **Repaso de la semana** (ahora a las 10:00) | | | |
| Domingo | | | | | |

**Los diarios no se mueven.** Lo que cuentan caduca: la apertura tiene que salir con la apertura.

- Las 15:45 son la sobremesa en España y la mañana en México: no es la mejor hora de ninguno de
  los dos.
- Las 22:05 son tarde para España y buena hora para América.
- No se proponen otras horas porque cambiarían el contenido (una "primera hora de Wall Street" a
  las 17:00 ya es otro reel). Si el usuario lo quisiera, se probaría una sola cosa, unas semanas, y
  se mediría igual.

**Los reels a demanda, a las 19:30 y entre semana.** No caducan, así que pueden ir a la mejor hora:

- Es el comienzo de la franja de Metricool (19:00-21:00) para España y el mediodía de México y
  Colombia.
- Martes, miércoles y jueves son los mejores días en Buffer y Sprout, también para los servicios
  financieros.
- Quedan a 3 h 45 min del reel de la apertura y a 2 h 35 min del cierre.
- **Uno al día como mucho.** Si el usuario pide dos el mismo día, el segundo pasa al día siguiente
  a las 19:30.
- Si se piden por la mañana, se dejan montados y se publican a las 19:30. Eso es sacarlos a mano a
  esa hora, sin programar nada.

**El repaso del sábado, a las 18:00.** El sábado es el día más flojo en casi todos los estudios, y
las 10:00 son de noche en toda Latinoamérica. A las 18:00 es la tarde en España y las 11:00 en
México, cerca de la punta del sábado de Hootsuite. Era la única propuesta que **cambiaba una
rutina** (`trig_01YM4JwMLEvqA7Fp8dkMPcz9`). El usuario la aprobó el 2026-11-03: el cron ha pasado
de `CRON_TZ=Europe/Madrid 2 10 * * 6` a `CRON_TZ=Europe/Madrid 0 18 * * 6`.

**El domingo, sin nada nuevo.** Los futuros salen a la 01:05 del lunes, que es la tarde del domingo
en América.

**La duración.**

- Los diarios, entre 60 y 100 segundos. Hasta ahora duraban entre 101 y 106, con el tope en 120
  (cambiado el 2026-11-03).
- Los a demanda, 150 como mucho. El de bonos duraba 174, a 6 segundos del límite de la pestaña
  Reels.
- Lo que más falla no es lo largo sino **los primeros segundos**: el de la burbuja perdió a casi
  todos enseguida.

**Historias y carruseles.**

- Cada reel se sigue compartiendo en historias desde la app, como ahora: es poco trabajo y lleva a
  los seguidores al reel.
- No se añaden historias aparte ni carruseles diarios. Con 25 seguidores no llegan a nadie más, y
  en octubre 22 carruseles alcanzaron a 3 cuentas.
- Al llegar a 1.000 seguidores, se puede probar **un carrusel a la semana** de los que se guardan
  (un concepto o un patrón en diapositivas), el jueves a las 19:30 en vez del A fondo.

## Cómo saber si funciona

**Qué medir de cada reel, a las 24 horas y a las 72**:

- alcance y vistas;
- la parte del alcance que viene de quien no sigue la cuenta;
- el tiempo medio visto, en segundos y en porcentaje de lo que dura;
- compartidos y guardados por cada 1.000 cuentas alcanzadas.

**Y de la cuenta, cada lunes**: seguidores (`followers_count`) y alcance de la semana.

Como la API solo da cifras acumuladas, alguien tiene que leerlas a esas edades. Hay dos formas:

- **un comando de solo lectura**, por ejemplo `make igstats`, que guarde una foto de las métricas de
  cada reel en un archivo y que se lance a mano, o desde el mantenimiento diario si el usuario lo
  añade como una tarea más;
- o **mirarlas en la app** ("Ver estadísticas" de cada reel).

Ninguna de las dos está hecha: es un paso siguiente si el usuario lo quiere.

**Cuándo revisarlo:**

- **2026-11-17**, a las dos semanas, con unos 25 reels. ¿Se publica al ritmo propuesto? ¿Algún reel
  se sale mucho de la media? A los a demanda de las 19:30, ¿les va mejor o peor que a los de la
  mañana del 2026-11-03?
- **2026-12-01**, a las cuatro semanas, con unos 50 reels y 6 o más por hora probada. Una hora se da
  por mejor solo si **su mediana de alcance a las 24 horas duplica la de otra**, con 6 reels o más
  en cada una. Una diferencia menor con tan pocos reels es ruido, y así se dirá.
- **Al pasar de 100 seguidores**: leer `online_followers` (a qué hora está conectada la audiencia) y
  `follower_demographics` (de qué país es). Si la mayoría está en España, las 19:30 pueden pasar a
  las 20:00 o las 20:30. Si está en México, a las 21:00.
- **Al pasar de 1.000**: probar horas y ganchos con trial reels.

## Fuentes

Instagram y Meta:

- Instagram, "Instagram Ranking Explained" (2023): https://about.instagram.com/blog/announcements/instagram-ranking-explained
- Instagram Creators, consejos para mejorar el alcance (tope de tres minutos para recomendar un reel): https://creators.instagram.com/blog/tips-for-improving-your-reach
- Mosseri sobre la frecuencia (RouteNote, 2024-12-06): https://routenote.com/blog/how-often-you-should-post-on-instagram/
- Penalización a los reels reaprovechados (Social Media Today, 2026-04-30): https://www.socialmediatoday.com/news/instagram-expands-originality-reach-penalties/819016/
- Trial reels, desde 1.000 seguidores (Social Media Today, 2025-07-13): https://www.socialmediatoday.com/news/instagram-expands-access-trial-reels/752895/
- El fallo de las historias y su arreglo (Engadget, 2025-09-12): https://www.engadget.com/social-media/instagram-fixed-an-issue-that-caused-posting-multiple-stories-to-tank-your-reach-184714482.html
- Trial reels en la API, `trial_params` (documentación de terceros, sin comprobar en la de Meta): https://www.ayrshare.com/apis/post/social-networks/instagram

Hora y frecuencia:

- Buffer, mejor hora para publicar (2026-09-23): https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram
- Buffer, cada cuánto publicar (2025-08-13): https://buffer.com/resources/how-often-to-post-on-instagram/
- Buffer, formatos (2026-03-19): https://buffer.com/resources/data-best-content-format-social-media/
- Sprout Social, mejor hora para publicar en Instagram (2026-03-31): https://sproutsocial.com/best-times-to-post/instagram-media
- Hootsuite, mejor hora para publicar en Instagram (2026-07-14): https://blog.hootsuite.com/best-time-to-post-on-instagram/
- Later, mejor hora para publicar (2026-04-21, con datos de 2024): https://later.com/blog/best-time-to-post-on-Instagram/

Metricool:

- Estudio de Instagram de 2024 (PR Newswire, 2024-09-09): https://prnewswire.com/news-releases/metricool-unveils-2024-instagram-benchmark-report-stories-reels-and-carousels-drive-brands-marketing-campaigns-302242081.html
- Metricool y HypeAuditor, "Instagram Content Playbook" (2025-10-14): https://metricool.com/press-release-instagram-content-playbook/
- Estudio de Instagram de 2026 (2026-06-16): https://metricool.com/press-release-instagram-study-2026/ y https://metricool.com/es/estudio-instagram/
- Estudio de redes de 2026: https://metricool.com/press-release-2026-social-media-study/
- Mejores horas en Instagram (2026-03-24, sin muestra): https://metricool.com/es/mejores-horas-instagram/
- Estudio de 2023 (ReasonWhy, 2023-09-13): https://www.reasonwhy.es/actualidad/lunes-jueves-8-tarde-mejor-momento-publicar-instagram-metricool

Duración y formatos:

- Socialinsider, duración ideal de un reel (2026-07-14, actualizado el 2026-10-20): https://socialinsider.io/blog/instagram-reels-length/
- Socialinsider, referencias de Instagram (2026): https://www.socialinsider.io/blog/instagram-benchmarks/

España y Latinoamérica:

- SchedPilot, mejor hora para publicar en Instagram en 2026 (2026-10-02; blog sin muestra, indicio débil): https://schedpilot.com/mejor-hora-para-publicar-en-instagram/

Los datos propios se leyeron de la API de Instagram (`graph.instagram.com/v25.0`: `me/media`,
`<media>/insights`, `me/insights`) con el token de la cuenta, solo leyendo, el 2026-11-03.
