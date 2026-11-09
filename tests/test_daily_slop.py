"""The daily reels without their formula (the owner, 2026-11-09: "quiero que le quites algo de AI
slop, sin cambiar mucho el estilo"): make reelcheck refuses the stock moves of a daily reel
(reels.sounds_made), and lets the same reel told plainly through."""

from marketmedia import reels
from marketmedia import script as scripts

HEAD = """---
title: Wall Street rebota, Nvidia se hunde
description: La apertura del lunes.
kind: reel
sources:
  - Yahoo Finance | https://finance.yahoo.com/quote/%5ENDX/
  - Market Hub | https://themarkethub.app/api/public/overview
---
"""

BEFORE = HEAD + """
## 01-hook

Lunes. Wall Street abre en verde. Pero Nvidia... se hunde. ¿Por qué va a contracorriente?

## 02-week

Para entenderlo, hay que volver a la semana pasada. Y hoy... los compradores vuelven.

## 03-nvidia

Pero el protagonista va al revés. Nvidia cae un cinco y medio por ciento. ¿Por qué? Su consejo investiga a su jefe.

## 04-chips

¿Y quién gana? Sus rivales. Y no es poca cosa.

## 05-cpi

¿Y ahora? Mañana... llega la inflación. El dato de la semana.

## 06-question

Así que te pregunto: ¿un susto de un día... o el principio de algo más? Te leo en comentarios.
"""

AFTER = HEAD + """
## 01-hook

Lunes. Wall Street abre en verde. Nvidia, en cambio... cae más de un cinco por ciento: su consejo investiga a su jefe.

## 02-week

Es un rebote. La semana pasada el Nasdaq perdió más de un tres por ciento, y el jueves entró en corrección.

## 03-nvidia

Nvidia cae un cinco y medio por ciento. Su consejo investiga a Jensen Huang.

## 04-chips

Sus rivales suben. AMD, casi un ocho por ciento. Broadcom, un seis.

## 05-cpi

Mañana, a las dos y media en España, se publica la inflación de octubre en Estados Unidos.

## 06-question

¿Pesará más el rebote, o lo de Nvidia? Te leo en comentarios. A las diez, el cierre.
"""


def test_the_formula_is_refused():
    found = reels.sounds_made(scripts.parse(BEFORE))
    said = " ".join(found)
    for stock in ("¿Por qué?", "¿Y quién gana?", "¿Y ahora?", "Para entenderlo, hay que", "no es poca cosa",
                  "Así que te pregunto", "el protagonista va al revés", "El dato de la semana", "principio de algo más"):
        assert stock in said, stock
    assert any("ellipses" in f for f in found)
    assert any("questions before the last scene" in f for f in found)


def test_the_same_reel_told_plainly_passes():
    assert reels.sounds_made(scripts.parse(AFTER)) == []


def test_the_closing_scene_may_ask():
    """The question to the viewer is the reel's own: it does not count against the limit."""
    text = AFTER.replace("¿Pesará más el rebote, o lo de Nvidia?", "¿Rebote o susto? ¿Nvidia o la inflación? ¿Tú qué ves?")
    assert reels.sounds_made(scripts.parse(text)) == []


def test_only_the_daily_reels_are_held_to_it(tmp_path):
    """A reel the owner asks for is checked as before (its own rules are in the skill)."""
    for name, daily in (("2026-11-09-open", True), ("2026-11-09-tema-libre", False)):
        path = tmp_path / "reels" / name
        path.mkdir(parents=True)
        (path / "script.md").write_text(BEFORE, encoding="utf-8")
        reel = reels.Reel(path)
        assert reel.daily is daily
        from marketmedia import channel as channels
        from .conftest import REPO
        found = reels.problems(reel, channels.load(REPO / "channel.toml").for_reels())
        assert any("machine-made" in f for f in found) is daily
