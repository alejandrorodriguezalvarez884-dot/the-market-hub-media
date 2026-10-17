# La auditoría de la API de YouTube: borrador de respuestas

Preparado el 2026-10-07. El formulario es
https://support.google.com/youtube/contact/yt_api_form ("YouTube API Services: Audit and Quota
Extension Form"). Mientras el proyecto de Google Cloud no lo pase, YouTube deja en privado todo
lo que `make upload` sube. No está enviado: lo envía el usuario, o quien él diga, con su cuenta
de Google, cuando haya leído lo que se declara en su nombre.

Las respuestas van en inglés, como el formulario. `[TÚ]` es lo que solo sabe el usuario.

## Lo que falta antes de poder enviarlo

Al día el 2026-10-17. Hecho: `make auth` (con la cuenta del canal, `the.market.hub.app@gmail.com`,
añadida ese día como usuaria de prueba del cliente OAuth: sin eso Google bloqueaba el acceso);
la lista Money 101 en `channel.toml`; la política de privacidad y las condiciones del portal,
que ya hablan de la herramienta desde el 2026-10-13 (`market-hub-landing` 3031c32); y las
capturas de `docs/youtube-audit/` (abajo, "Las pruebas").

1. **Los datos personales** del usuario: nombre legal, dirección postal, país y el correo de
   contacto. Van a Google.
2. **El nombre de la app en la pantalla de consentimiento** es "maket-hub", con una errata
   (Google Cloud Console, Google Auth Platform, Branding, App name). Debe coincidir con el
   "API Client Name" de abajo, "Market Hub Media". Lo guarda el usuario. Después, `make auth`
   otra vez, para capturar la pantalla de consentimiento (no se hizo: se aceptó antes) y
   repetir `oauth-revocation.jpg`, que enseña el nombre viejo.
3. **Una subida de prueba** con `make upload`, para capturar la terminal con su salida: la
   primera que se haga (el episodio 7) vale, y quedará en privado hasta la auditoría.
4. **Enviar el formulario**, que es del usuario: lo que se declara va en su nombre.

## Sección 1. Request type

- Select the reason for your request: **Complete a compliance audit to request for additional
  quota.** (No hay una opción de "solo auditoría"; la otra es para quien ya fue auditado. La
  cuota que se pide más abajo es la de por defecto.)

## Sección 2. Organization and contact information

- Are you applying: **As an individual user**
- Your Full Legal Name: `[TÚ]`
- Your Organization's Legal Name: **self**
- Parent Company Name: **self**
- Your Organization's Primary Website: **https://themarkethub.app**
- Country / Street Address / City / State/Province / Postal Code: `[TÚ]`
- Category: **Education and E-Learning**
- Organization Size / Type: **Independent Developer/Sole Proprietor**
- Primary Contact, Name and Email: `[TÚ]`
- Primary Technical Contact and Primary Business Contact: **Same as Primary Contact**

## Sección 3. Business model and Google contacts

- Describe your organization's work as it relates to YouTube:

  > The Market Hub (https://themarkethub.app) is a free website about the stock market and
  > personal finance. It has one YouTube channel of its own, with short educational videos (the
  > series "Money 101": compound interest, inflation, debt). I am the only person behind the
  > website and the channel. I write and render each video on my own computer, and I use the
  > YouTube Data API for one thing only: to upload my own finished videos, with their thumbnail,
  > captions and playlist, to my own channel, instead of doing it by hand in YouTube Studio. The
  > API client is a command-line tool that only I run. It has no other users, it does not read
  > or store any YouTube data about other channels, videos or viewers, and it shows no YouTube
  > content to anyone.

- Who is your target audience? **Internal Users**
- How does your API Client monetize or generate revenue? **Free service (we do not charge
  users)**
- Do you currently have a designated Google Partner Manager or YouTube Partner Manager? **No, I
  do not have a Google representative**
- How did you first learn about the YouTube Data API? **Google Developer Documentation**
- Content Owner ID(s), Google Ads Customer ID(s): en blanco.

## Sección 4. API client overview and access information

- API Client Name: **Market Hub Media**
- Does this API Client name contain the word "YouTube"? **No**
- Primary Access URL: **https://themarkethub.app/media/** (la página del portal que enseña el
  canal; la herramienta en sí no tiene web)
- Privacy Policy URL: **https://themarkethub.app/privacy/**
- Terms of Service URL: **https://themarkethub.app/terms/**
- Is your API Client publicly accessible? **No**
- Demo Account Username / Password / Login URL: en blanco.
- Special Instructions for Access:

  > There is no account to log in to. The API client is a command-line tool (Python) that runs
  > only on my own computer and uploads my own videos to my own channel. It has no web
  > interface and no users other than me. The screenshots attached show the OAuth consent
  > screen, the command that uploads a video and its output.

- Casilla obligatoria ("I understand and agree that by providing demo account credentials,
  Google is not bound by any terms of service..."): hay que marcarla aunque no se den
  credenciales. Es una aceptación en nombre del usuario.

## Sección 5. Use cases and quota

- How many project numbers are you adding? **1**
- Google Cloud Project Number: **818229650855** (proyecto `arctic-robot-474306-g3`)
- Use Case Category: **Video Uploading & Account Management** e **Internal Company Tool**
- Does this API Client require users to sign in with their Google Account (OAuth 2.0)? **Yes**
  (el único usuario soy yo, con la cuenta del canal)
- Derived Metrics and Data Storage: no se pide; la herramienta no lee ni guarda estadísticas.
- Expected API Usage Volume: **Fewer than 1,000 requests per day**
- Endpoints: **youtube.videos.insert**, **youtube.thumbnails.set**, **youtube.captions.insert**,
  **youtube.playlistItems.insert**
- What is the total quota you are requesting? **No change / Default quota (10k quota points)**
- youtube.videos.insert, Total Per Day Quota y Detailed Justification (son obligatorios aunque
  no se pida más): la cuota por defecto, y

  > At most four uploads a day: a video and its Short, and occasionally a corrected version of
  > one of them. Normally two uploads on the days a video is published, and none on most days.
  > The default quota is enough; this request is for the compliance audit, so that the videos I
  > upload to my own channel are not restricted to private.

- youtube.search.list: no se usa.

## Las pruebas que hay que adjuntar (imagen o PDF)

En `docs/youtube-audit/`, sacadas el 2026-10-17 de la web desplegada:

| Lo que pide | Archivo |
|---|---|
| Privacy Policy Screenshots, "showing YouTube sections, Google Privacy Policy link, deletion policies" | `privacy-policy.png` (la página entera) |
| Homepage Screenshot, "showing where Privacy Policy link is located" | `homepage-privacy-link.png` (el pie, con Privacy y Terms) |
| Terms of Service Documentation | `terms.pdf` (y `terms.png`) |
| Conditional evidence: OAuth revocation | `oauth-revocation.jpg` (myaccount.google.com, la app con sus permisos y "Delete all"); repetirla tras el cambio de nombre |
| Conditional evidence: OAuth consent screen | Falta: al repetir `make auth` tras el cambio de nombre |
| Conditional evidence: Upload interface | Falta: la terminal de la primera `make upload` |

## Hecho: el apartado de la política de privacidad del portal (desplegado el 2026-10-13, con este texto)

> **The YouTube channel.** The Market Hub's videos are uploaded to our own YouTube channel with
> a tool of ours that uses YouTube API Services. Only the channel's owner uses it, signed in
> with the channel's own Google account; it does not ask you to sign in and does not read,
> collect or store any information about you, about viewers or about anyone else's channel.
> What it sends to YouTube is our own videos, with their titles, descriptions, thumbnails and
> captions. The owner can take the tool's access away at any time on Google's security
> settings page (https://myaccount.google.com/permissions), and the sign-in it keeps on the
> owner's computer is deleted with it. YouTube's own terms and Google's privacy policy apply to
> what you watch there: https://www.youtube.com/t/terms and https://policies.google.com/privacy.

## Hecho: condiciones de uso (https://themarkethub.app/terms/, desplegada el 2026-10-13)

Lo mínimo que la política de desarrolladores de YouTube pide a un cliente de su API: decir que
usa YouTube API Services, que quien lo usa acepta las condiciones de YouTube
(https://www.youtube.com/t/terms), enlazar la política de privacidad de Google y dar un
contacto. Más lo propio del portal: que nada de lo que publica es asesoramiento de inversión.
Está escrita y desplegada con todo eso (apartados "Nothing here is advice" y "YouTube").

## Lo que no se sabe

- El formulario no dice cuánto tarda la revisión. Suele haber correos de ida y vuelta.
- Está pensado para aplicaciones con usuarios. Una herramienta de una sola persona para su
  propio canal no tiene garantizado el aprobado; si lo deniegan, la subida a mano sigue igual.
