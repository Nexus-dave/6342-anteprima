# 6342 a le Tole · Venezia in tasca — prototipo PWA

Prototipo da far rivedere a Davide ed Elena. **Non è pubblicato da nessuna parte.**

## Provarlo
```
cd app-6342 && python3 -m http.server 8763
```
Poi apri http://localhost:8763/ con Chrome; per vederlo come su un telefono usa DevTools in modalità mobile. Il service worker funziona solo su http(s), non aprendo il file con file://.
Per vedere l'app in un'altra data aggiungi `?oggi=2026-12-16&ora=19:00` all'indirizzo; per forzare la lingua aggiungi `?lang=en|de|fr|it`.

## Struttura
- `index.html`: la shell con le schede Oggi · Eventi · Mappa · Menù · Venezia, più le pagine Numeri utili e il gioco Pizza-Man.
- `assets/js/app.js`: router, testi in 4 lingue, filtri degli eventi, scheda evento (con .ics e condivisione), mappa Leaflet con lista di riserva offline, menù.
- `assets/css/app.css`: stile (nero e oro, terrazzo, acquerello).
- `sw.js`: tiene in cache la shell e le immagini. I dati vengono letti prima dalla rete; le tile OSM restano in cache (massimo 600).
- `data/*.json`: eventi, servizi della mappa, numeri, menù, storie. Ogni file ha il campo `aggiornato`.
- `assets/js/i18n.js`: testi in ES/RU/JA/ZH/KO e nuove chiavi; viene generato da `tools/applica_traduzioni.py` partendo da `tools/i18n/`. Esegui `applica_traduzioni.py` dopo ogni `genera_menu.py`.
- `data/cda.json`: contributo di accesso (date 2027, testi in 9 lingue). `data/maree.json`: previsione maree, aggiornata da `tools/aggiorna_maree.py` (in produzione ogni 1–3 ore).
- `tools/`: generatori dei dati (`genera_menu.py`, `genera_servizi.py`, `eventi_seed.py`), `controlla_eventi.py`, `aggiorna_eventi.md` e i dati grezzi OSM in `tools/osm/`.
- `FONTI.md`: la fonte di ogni evento, numero, punto della mappa e storia.
- `screenshots-review/`: screenshot a 412 px di larghezza.

## Da decidere prima di pubblicare
- Rilettura da madrelingua di DE/FR/ES/RU/JA/ZH/KO (menù, storie, interfaccia), oggi segnate «traduzione in revisione».
- Una routine lato server per `data/maree.json`, perché il Comune non abilita il CORS.
- Aggiornare `data/cda.json` quando il Comune pubblica le modalità 2027 (entro il 31/12/2026).
- Dominio: GitHub Pages oppure un dominio del ristorante.
- Fornitore delle tile della mappa in produzione.
- Store: TWA per il Play Store (Bubblewrap/PWABuilder, 25 $ una tantum); per l'App Store serve un wrapper (99 $ l'anno).
