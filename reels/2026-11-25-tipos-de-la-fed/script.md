---
title: Por qué los tipos de la Fed mueven la bolsa
description: Qué es el tipo de interés de la Reserva Federal y por las tres vías por las que mueve la bolsa (la deuda, el bono y el valor del futuro), con una panadería y, después, con 2022 y con el 25 de noviembre de 2026, día de la inflación PCE.
kind: reel
voice: didactico
tags: fed, tipos de interés, reserva federal, inflación, pce, nasdaq, bonos, aprende
sources:
  - Reserva Federal (FRED, Banco de la Reserva Federal de St. Louis), límites superior e inferior del objetivo del tipo de los fondos federales, serie diaria leída el 25 de noviembre de 2026 (hoy, del 3,75 % al 4,00 %; subió del 3,50-3,75 % el 17 de septiembre de 2026; en 2022, del 0,00-0,25 % al 4,25-4,50 %) (data/fred-DFEDTARU.csv, data/fred-DFEDTARL.csv) | https://fred.stlouisfed.org/series/DFEDTARU
  - Reserva Federal, calendario de reuniones del FOMC de 2026 (la próxima, el 8 y el 9 de diciembre) | https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
  - Bureau of Economic Analysis, ingresos y gastos personales de octubre de 2026, 25 de noviembre (índice de precios PCE, +3,8 % en un año; sin alimentos ni energía, +3,3 %) (data/bea-pce.txt) | https://www.bea.gov/news/2026/personal-income-and-outlays-october-2026
  - Yahoo Finance, el mercado en directo del 25 de noviembre de 2026 (la PCE subyacente, 3,3 % frente al 3,2 % esperado; un 98 % de probabilidad de una subida de 25 puntos básicos en diciembre según CME Group; los aranceles propuestos del 20 %) (data/yahoo-live.txt) | https://finance.yahoo.com/markets/live/stock-market-today-wednesday-november-25-dow-sp-500-nasdaq-pce-inflation-data-091428237.html
  - Market Hub, el mercado de hoy (Yahoo Finance), a las 18:06 de España del 25 de noviembre de 2026, con la sesión abierta (Nasdaq 100 −3,2 %, S&P 500 −1,9 %, Dow Jones −0,7 %; el bono a 10 años de EE. UU., 4,91 %) (data/overview.json) | https://themarkethub.app/api/public/overview
  - Yahoo Finance, Nasdaq 100, S&P 500 y Dow Jones, cierres del 31 de diciembre de 2021 y del 30 de diciembre de 2022 (Nasdaq 100 −33,0 %, S&P 500 −19,4 %, Dow Jones −8,8 %), y hoy a las 18:07 de España (data/yahoo-*.json) | https://finance.yahoo.com/quote/%5ENDX/history/
---

## 01-hook
speed: 1.1

La inflación sube al tres coma ocho y el Nasdaq cae más de un tres. Detrás está el tipo de la Fed.

## 02-que
speed: 1.1

Es el precio del dinero a un día entre bancos. Hoy, entre el tres coma setenta y cinco y el cuatro por ciento.

## 03-deuda
speed: 1.1

Primera vía, la deuda. Una panadería pide cien mil euros. Al dos por ciento paga dos mil al año. Al cinco, cinco mil.

## 04-bono
speed: 1.1

Segunda vía, el bono. Si el de diez años paga casi un cinco por ciento, a la bolsa se le exige más.

## 05-futuro
speed: 1.1

Tercera vía, el tiempo. Cien euros dentro de diez años valen hoy ochenta y dos al dos por ciento, y sesenta y uno al cinco. Sufren más las que ganarán lejos, como muchas tecnológicas.

## 06-2022
speed: 1.1

En dos mil veintidós, la Fed subió de casi cero al cuatro y medio. El Nasdaq cien cayó un treinta y tres por ciento. El Dow, un nueve.

## 07-hoy
speed: 1.1

Hoy el mercado da un noventa y ocho por ciento a otra subida en diciembre. Pesan también los aranceles. El Nasdaq cae un tres; el Dow, menos de uno.

## 08-repaso
speed: 1.1

Repaso: tipos más altos encarecen la deuda, dan más al bono y restan valor al futuro.

## 09-question
speed: 1.1

¿Qué empresa que conoces depende más del dinero barato? Te leo en comentarios.
