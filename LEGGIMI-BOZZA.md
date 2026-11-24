# 6342 a le Tole · nuovo sito, bozza v6h (24/11/2026)

v5 = prima stesura (v1) + tutte le migliorie, rifatte in un solo passaggio.

Bozza statica, **non pubblicata** (le pagine hanno `noindex`). Per vederla bene serve un piccolo server locale:

    cd nuovo-sito-bozza && python3 -m http.server 8000   →   http://localhost:8000

Funziona anche aprendo `index.html` con un doppio clic (gli script sono classici, non moduli).
Parametri utili per le prove: `?formato=farfalle` (spaghetti, bigoli, fusilli, farfalle, penne, rigatoni), `?intro=1` (rivede l'intro), `?intro=0` (la salta), `?statico=1` (mostra la versione senza animazioni). I vecchi link `menu.html?lang=en` portano alla pagina inglese.

## Cosa c'è
- `index.html` è la home "Chiaroscuro". Si apre con l'intro "Il formato del giorno": Canvas 2D senza librerie, fili d'oro #c9a84c che si disegnano in circa 2 s e poi lasciano il posto al logo. Seguono cinque capitoli (Storia, Pasta, Cucina, Musica, Sala) con il cono di luce che si muove allo scroll, poi galleria, "Il tavolo è pronto", il collegamento alla carta, la griglia Instagram, le info e la mappa.
- `menu.html` mostra i due menù stampati, **Menù Pasta** (12 pagine) e **Menù Pizza** (6 pagine): schede in alto, pagine a tutta larghezza (leggibili al telefono) e PDF da scaricare. I testi sulle pagine sono quelli della carta (italiano e inglese).
- `assets/pdf/menu-6342-pasta-A4.pdf` e `assets/pdf/menu-6342-pizza-A4.pdf` sono i PDF ad alta risoluzione. Le anteprime WebP stanno in `assets/img/menu/pasta/` e `assets/img/menu/pizza/`.
- `assets/` contiene anche font Fraunces 6342 (woff2), immagini WebP in più misure, acquerelli e il video dello staff.

## Comportamento intro
- Il formato resta lo stesso per tutta la visita (sessionStorage) e alla visita dopo non si ripete (localStorage). L'intro completa si vede una volta per sessione.
- Il pulsante "salta", la rotellina, lo scroll touch e il tasto Esc la chiudono subito.
- Con prefers-reduced-motion o senza canvas si vede un SVG statico della stessa forma con il logo.
- Il DPR è limitato a 1,5 su telefono e 1,75 su desktop. Quando l'hero non è visibile o la scheda è nascosta, l'animazione si mette in pausa. A riposo gira a 15 fps su telefono e 25 su desktop.

## Punti aperti
Allergeni (ancora DA CONFERMARE), revisione delle traduzioni EN/DE/FR, dominio definitivo e widget TheFork.

## Novità v5
- **Lingue**: italiano nella radice, poi `en/`, `de/` e `fr/` con `index.html` e `menu.html` tradotti. In ogni pagina c'è il selettore IT · EN · DE · FR e ci sono i tag `hreflang`. Le schede e i pulsanti della pagina menù sono tradotti in IT/EN/DE/FR; le pagine della carta restano quelle stampate (italiano e inglese).
- **Leggibilità**: testo color crema sui fondi scuri, fondo quasi nero schiarito a #161310 e titoli e testi dei capitoli leggibili anche prima che si "accenda" la luce. Gli elementi che compaiono allo scroll partono già visibili e i grigi su carta sono più scuri (#4a453e / #3f3b35).
- **Foto**: tutte riesportate dagli originali (`sito-aggiornato/`) con +15% di esposizione e una curva a S per il contrasto. Nomi, misure e formati sono rimasti gli stessi.
- **Footer** di tutte le 8 pagine con indirizzo e "HR SRL • P.Iva IT04380810277" (EN VAT, DE USt-IdNr., FR TVA).
- **Orari**: aperti tutti i giorni. Lunedì 12:00–15:00 · 18:00–22:30; martedì–domenica 12:00–22:30 orario continuato. Anche nel JSON-LD (`openingHours`).
- **Instagram**: spaghetteria6342aletole è scritto senza @ e con il logo IG accanto, della stessa altezza del testo.

## Attenzione
`tools/genera_index.py` è il generatore della v1: se lo rilanci, **sovrascrive** `index.html` e perdi le migliorie. Le pagine si rigenerano con `python3 v5work/build_v6.py`.

## Novità v6 (22/11/2026)
- **Apertura con la spiga** (ripresa dalla bozza v2 del 19/11): la spiga cresce dal 6, tre chicchi cadono e fanno nascere 3, 4 e 2, poi il logo sfuma nell'hero. Sostituisce l'intro Canvas della pasta (la riga "oggi: <formato>" non c'è più). File: `assets/js/spiga-anim.js`, `assets/js/apertura.js`, `assets/css/apertura.css`; l'SVG è dentro `index.html` (sorgente `v5work/v6src/apertura-svg.part`).
- **Video "L'accoglienza è la nostra famiglia"** (`assets/video/accoglienza-staff.mp4`): muto, autoplay, loop, playsinline; si carica quando ci si avvicina e parte quando è in vista; se il browser blocca l'autoplay compaiono i controlli.
- **Musica**: tolta la foto della chitarra appesa al muro (sezione "Atmosfera"); resta solo la foto del musicista. Nella griglia Instagram la chitarra è sostituita dalla foto del musicista (griglia 3×3 piena).
- Le pagine si rigenerano con `python3 v5work/build_v6.py` (riesegue v5 + le modifiche v6 / v6b).

## Novità v6b (22/11/2026)
- **Video di apertura**: all'apertura della home parte subito, a schermo intero, il video della spiga (`assets/video/spiga-apertura.mp4`, 1080×1080, 9 s, muto, autoplay, playsinline). È il clip pulito di `spiga-anim` (logo che nasce, senza interfaccia). Il pulsante "salta" è visibile dal primo istante. A fine video, o su "salta" / rotellina / scroll / Esc↓PagGiù Spazio Invio, l'apertura sfuma nell'hero.
- Si vede **ogni volta** che si apre la home (niente più skip una volta per sessione). Con `prefers-reduced-motion` l'apertura parte lo stesso; si può sempre usare "salta". Solo `?intro=0` o `?statico=1` la saltano. Se il video non può partire, si usa l'animazione SVG come riserva.
- Funziona anche col doppio clic (`file://`) e da un server; script classici, senza moduli.

## Novità v6c (22/11/2026)
- **Due menù separati**, come quelli stampati: **Menù Pasta** e **Menù Pizza**. In home i due pulsanti aprono la pagina menù sulla scheda giusta (`menu.html#pasta` / `menu.html#pizza`).
- In `menu.html` le schede restano visibili in alto; le pagine si sfogliano in verticale (immagini grandi, leggibili al telefono) e ogni menù ha il suo **PDF da scaricare** (`assets/pdf/menu-6342-pasta-A4.pdf`, `assets/pdf/menu-6342-pizza-A4.pdf`).
- Tolti il vecchio menù interattivo ad acquerello, `menu.json` e `assets/pdf/menu-6342-acquerello.pdf`.
- Si rigenera con `python3 v5work/build_v6.py` (v5 + v6 / v6b + v6c). Non usare `tools/genera_index.py`. Pagine pensate anche per `file://`, con script classici.

## Novità v6d (22/11/2026)
- **Pizza-Man**, un giochino in stile labirinto: sei una pizza, i fantasmini sono chef arrabbiati e i punti sono chicchi di frumento (i chicchi d'oro stordiscono gli chef). Tutto disegnato sul canvas, senza file esterni. Funziona anche aprendo `gioco.html` con un doppio clic.
- In home il link **Gioco** sta accanto a Menù, e c'è un terzo pulsante nella sezione della carta. Dalla pagina menù si arriva al gioco dalla barra in alto.
- Punteggio, vite, livelli e record (salvato nel browser). Comandi: frecce o WASD al computer; al telefono scorri o usa i pulsanti a schermo. IT/EN/DE/FR.
- Si rigenera con `python3 v5work/build_v6.py` (v5 + v6 / v6b + v6c + v6d). Non usare `tools/genera_index.py`.

## Novità v6e (22/11/2026)
- **Pizza-Man, correzioni**: la pizza si muove solo a caselle e gira solo al centro esatto di una casella, quindi non attraversa più i muri e non esce dal labirinto; il tunnel laterale avvolge pulito da un lato all'altro.
- Gli chef escono dal recinto uno alla volta (0 / 0,8 / 2,4 / 4,2 s), passano dalla porta e poi inseguono; una volta fuori non rientrano più nel recinto, tranne quando sono stati mangiati (tornano come occhi e riescono).

## Novità v6f (22/11/2026)
- **Pizza-Man, labirinti che cambiano**: 7 labirinti disegnati a mano (originale, laguna, forno, rialto, tole, spiga, canale), tutti simmetrici, con tunnel, recinto degli chef nello stesso punto e 4 spighe d'oro. Il livello 1 è l'originale; dopo ogni livello superato ne esce uno a caso, mai uguale al precedente. All'inizio di ogni livello compare "Livello N!" (IT/EN/DE/FR).

## Novità v6g (23/11/2026)
- **Contatti**: numero di telefono aggiornato a +39 041 476 8410 (display 041 476 8410, tel:+390414768410) in home, menù, pulsante Chiama e JSON-LD.
- Aggiunta l'email del ristorante `info6342aletole@gmail.com` (mailto + campo email nel JSON-LD). Non si usa info@6342aletole.it.
- Icona Facebook accanto al link, nello stesso stile dell'icona Instagram (SVG inline, altezza del testo).
- Icona TheFork (forchetta in tratto) accanto a "Prenota su TheFork" e nella barra sticky di prenotazione.

## Novità v6h (24/11/2026)
- **Menù, logo in copertina**: il selettore `.menu-page img` (pensato per le pagine PDF) si applicava anche al logo dell'hero, perché il `<body>` ha già la classe `menu-page`. Il logo veniva stirato in verticale (aspect-ratio 1323/1871), allargato al 100% e messo su un rettangolo color crema che tagliava i colli dell'acquerello. Ora le regole valgono solo per `figure.menu-page`; il logo resta 220px, in proporzione, con sfondo trasparente.
- **Home, link Menù in alto a destra (telefono)**: la topbar non usa più `transform` (su Chrome Android il bersaglio del tap di un `position:fixed` in transizione può non coincidere con il pulsante visibile). Il pulsante Menù ha area di tocco da almeno 44px, non si schiaccia, e sta sopra gli altri elementi; l'icona Instagram non viene più compressa.
