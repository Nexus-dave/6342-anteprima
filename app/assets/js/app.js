/* 6342 a le Tole · Venezia in tasca — prototipo PWA (nessuna dipendenza, Leaflet solo per la mappa) */
(function () {
'use strict';
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var REST = { ll: [45.43875, 12.34244], tel: '+390414768410', name: 'Spaghetteria 6342 a le Tole' };

/* ---------- testi interfaccia ---------- */
var T = {
 it: { heroKicker:'Venezia in tasca', heroTitle1:'La Venezia', heroTitle2:'che vive oggi', heroSub:'Mostre, concerti e feste aggiornati, la mappa dei servizi e i numeri utili. Offerti da noi, dalla Barbaria de le Tole.',
  ctaEvents:'Cosa fare oggi', ctaMap:'Mappa', todayTitle:'Oggi a Venezia', seeAll:'Tutti', ourHouse:'La nostra casa', book:'Prenota', call:'Chiama', directions:'Portami lì', menu:'Menù',
  weekTitle:'In evidenza', storiesKicker:'Storie della Barbaria', storiesTitle:'Perché la nostra calle si chiama «de le Tole»?', read:'Leggi', numbers:'Numeri utili', numbersSub:'Emergenze, gondole, taxi acqueo',
  gameSub:'Il nostro giochino', prototype:'Prototipo · non pubblicato', eventsKicker:'Agenda culturale', eventsTitle:'Eventi a Venezia', fToday:'Oggi', fWeek:'Questa settimana', fMonth:'Prossimi 30 giorni', fAll:'Tutti',
  cAll:'Tutto', cMostra:'Mostre', cMusica:'Musica', cDanza:'Danza', cFesta:'Feste e tradizioni', eventsNote:'Date e orari dalle pagine ufficiali di musei, teatri e Comune. Verifica sempre sul link prima di andare.',
  mapTitle:'Mappa dei servizi', mapOffline:'Mappa non disponibile offline: ecco la lista dei servizi vicini.', menuKicker:'Pasta fresca fatta in casa', menuTitle:'Il Menù',
  venKicker:'Castello · Barbaria de le Tole', venTitle:'Storie del nostro sestiere', illustration:'Illustrazione ad acquerello', nearArt:'Arte a due passi', numKicker:'Sempre a portata di mano',
  numNote:'Ogni numero viene da una fonte ufficiale (tocca «fonte»). In caso di pericolo chiama il 112.', tOggi:'Oggi', tEventi:'Eventi', tMappa:'Mappa', tMenu:'Menù', tVenezia:'Venezia',
  updated:'Aggiornato il', nothingToday:'Oggi nessun evento in calendario: ecco i prossimi.', none:'Nessun evento con questi filtri.', inCorso:'In corso', today:'Oggi', tonight:'Stasera', tomorrow:'Domani',
  inDays:'Tra {n} giorni', lastDays:'Ultimi giorni', until:'fino al {d}', from:'dal {d}', untilApprox:'fino a {d}', free:'Ingresso libero', official:'Sito ufficiale', addCal:'Calendario', share:'Condividi', source:'Fonte',
  openNow:'Aperto ora', closedNow:'Chiuso ora', opensAt:'apre alle {t}', closesAt:'chiude alle {t}', hoursMon:'Lunedì 12–15 · 18–22:30', hoursRest:'Mar–Dom 12–22:30 orario continuato', liveMusic:'Musica dal vivo ogni sera',
  near:'a {m} m in linea d\'aria', go:'Portami lì', callShort:'Chiama', list:'Lista', map:'Mappa', locating:'Cerco la tua posizione…', noGeo:'Posizione non disponibile', copied:'Link copiato',
  cover:'Coperto', extras:'Aggiunte sulla pizza', allergensT:'Allergeni', draftTr:'traduzione in revisione', installed:'Aggiungi alla schermata Home', install:'Installa l\'app', thisWeek:'Questa settimana', later:'Più avanti', sold:'',
  cat:{ristorante:'Il 6342', vaporetto:'Vaporetto', gondola:'Gondole', taxi:'Taxi acqueo', farmacia:'Farmacie', ospedale:'Ospedale', atm:'Bancomat', wc:'WC pubblici', info:'Info turistiche', arte:'Arte vicina', eventi:'Eventi'} },
 en: { heroKicker:'Venice in your pocket', heroTitle1:'The Venice', heroTitle2:'alive today', heroSub:'Up-to-date exhibitions, concerts and festivals, a map of services and useful numbers. Brought to you by us, from Barbaria de le Tole.',
  ctaEvents:'What\'s on today', ctaMap:'Map', todayTitle:'Today in Venice', seeAll:'All', ourHouse:'Our home', book:'Book', call:'Call', directions:'Take me', menu:'Menu',
  weekTitle:'Highlights', storiesKicker:'Tales of the Barbaria', storiesTitle:'Why is our street called “de le Tole”?', read:'Read', numbers:'Useful numbers', numbersSub:'Emergencies, gondolas, water taxi',
  gameSub:'Our little game', prototype:'Prototype · not published', eventsKicker:'Cultural agenda', eventsTitle:'Events in Venice', fToday:'Today', fWeek:'This week', fMonth:'Next 30 days', fAll:'All',
  cAll:'All', cMostra:'Exhibitions', cMusica:'Music', cDanza:'Dance', cFesta:'Festivals & traditions', eventsNote:'Dates and times from the official pages of museums, theatres and the City. Always check the link before you go.',
  mapTitle:'Map of services', mapOffline:'Map unavailable offline: here is the list of nearby services.', menuKicker:'Homemade fresh pasta', menuTitle:'The Menu',
  venKicker:'Castello · Barbaria de le Tole', venTitle:'Tales of our sestiere', illustration:'Watercolour illustration', nearArt:'Art round the corner', numKicker:'Always at hand',
  numNote:'Every number comes from an official source (tap “source”). In danger, call 112.', tOggi:'Today', tEventi:'Events', tMappa:'Map', tMenu:'Menu', tVenezia:'Venice',
  updated:'Updated', nothingToday:'Nothing scheduled today: here is what\'s next.', none:'No events with these filters.', inCorso:'On now', today:'Today', tonight:'Tonight', tomorrow:'Tomorrow',
  inDays:'In {n} days', lastDays:'Last days', until:'until {d}', from:'from {d}', untilApprox:'until {d}', free:'Free entry', official:'Official site', addCal:'Calendar', share:'Share', source:'Source',
  openNow:'Open now', closedNow:'Closed now', opensAt:'opens at {t}', closesAt:'closes at {t}', hoursMon:'Monday 12–3pm · 6–10:30pm', hoursRest:'Tue–Sun 12–10:30pm non-stop', liveMusic:'Live music every night',
  near:'{m} m as the crow flies', go:'Take me', callShort:'Call', list:'List', map:'Map', locating:'Finding your position…', noGeo:'Location unavailable', copied:'Link copied',
  cover:'Cover charge', extras:'Extra toppings', allergensT:'Allergens', draftTr:'translation under review', install:'Install the app', thisWeek:'This week', later:'Later on',
  cat:{ristorante:'6342', vaporetto:'Waterbus', gondola:'Gondolas', taxi:'Water taxi', farmacia:'Pharmacies', ospedale:'Hospital', atm:'ATMs', wc:'Public toilets', info:'Tourist info', arte:'Art nearby', eventi:'Events'} },
 de: { heroKicker:'Venedig in der Tasche', heroTitle1:'Das Venedig', heroTitle2:'von heute', heroSub:'Aktuelle Ausstellungen, Konzerte und Feste, eine Karte mit Services und nützliche Nummern. Von uns, aus der Barbaria de le Tole.',
  ctaEvents:'Was ist heute los', ctaMap:'Karte', todayTitle:'Heute in Venedig', seeAll:'Alle', ourHouse:'Unser Haus', book:'Reservieren', call:'Anrufen', directions:'Hinführen', menu:'Speisekarte',
  weekTitle:'Highlights', storiesKicker:'Geschichten der Barbaria', storiesTitle:'Warum heißt unsere Gasse „de le Tole“?', read:'Lesen', numbers:'Nützliche Nummern', numbersSub:'Notfälle, Gondeln, Wassertaxi',
  gameSub:'Unser kleines Spiel', prototype:'Prototyp · nicht veröffentlicht', eventsKicker:'Kulturkalender', eventsTitle:'Veranstaltungen', fToday:'Heute', fWeek:'Diese Woche', fMonth:'Nächste 30 Tage', fAll:'Alle',
  cAll:'Alles', cMostra:'Ausstellungen', cMusica:'Musik', cDanza:'Tanz', cFesta:'Feste & Traditionen', eventsNote:'Daten und Zeiten von den offiziellen Seiten. Bitte vor dem Besuch prüfen.',
  mapTitle:'Karte', mapOffline:'Karte offline nicht verfügbar: hier die Liste in der Nähe.', menuKicker:'Hausgemachte frische Pasta', menuTitle:'Speisekarte',
  venKicker:'Castello · Barbaria de le Tole', venTitle:'Geschichten aus unserem Viertel', illustration:'Aquarell-Illustration', nearArt:'Kunst um die Ecke', numKicker:'Immer zur Hand',
  numNote:'Jede Nummer stammt aus einer offiziellen Quelle. Im Notfall 112 wählen.', tOggi:'Heute', tEventi:'Events', tMappa:'Karte', tMenu:'Karte', tVenezia:'Venedig',
  updated:'Aktualisiert am', nothingToday:'Heute nichts im Kalender: das kommt als Nächstes.', none:'Keine Veranstaltungen mit diesen Filtern.', inCorso:'Läuft', today:'Heute', tonight:'Heute Abend', tomorrow:'Morgen',
  inDays:'In {n} Tagen', lastDays:'Letzte Tage', until:'bis {d}', from:'ab {d}', untilApprox:'bis {d}', free:'Eintritt frei', official:'Offizielle Seite', addCal:'Kalender', share:'Teilen', source:'Quelle',
  openNow:'Jetzt geöffnet', closedNow:'Jetzt geschlossen', opensAt:'öffnet um {t}', closesAt:'schließt um {t}', hoursMon:'Montag 12–15 · 18–22:30', hoursRest:'Di–So 12–22:30 durchgehend', liveMusic:'Jeden Abend Livemusik',
  near:'{m} m Luftlinie', go:'Hinführen', callShort:'Anrufen', list:'Liste', map:'Karte', locating:'Standort wird gesucht…', noGeo:'Standort nicht verfügbar', copied:'Link kopiert',
  cover:'Gedeck', extras:'Extra-Beläge', allergensT:'Allergene', draftTr:'Übersetzung in Prüfung', install:'App installieren', thisWeek:'Diese Woche', later:'Später',
  cat:{ristorante:'6342', vaporetto:'Vaporetto', gondola:'Gondeln', taxi:'Wassertaxi', farmacia:'Apotheken', ospedale:'Krankenhaus', atm:'Geldautomaten', wc:'Toiletten', info:'Touristinfo', arte:'Kunst', eventi:'Events'} },
 fr: { heroKicker:'Venise dans la poche', heroTitle1:'La Venise', heroTitle2:'qui vit aujourd\'hui', heroSub:'Expositions, concerts et fêtes à jour, la carte des services et les numéros utiles. Offerts par nous, depuis la Barbaria de le Tole.',
  ctaEvents:'À faire aujourd\'hui', ctaMap:'Carte', todayTitle:'Aujourd\'hui à Venise', seeAll:'Tout', ourHouse:'Notre maison', book:'Réserver', call:'Appeler', directions:'M\'y emmener', menu:'Menu',
  weekTitle:'À la une', storiesKicker:'Histoires de la Barbaria', storiesTitle:'Pourquoi notre rue s\'appelle-t-elle « de le Tole » ?', read:'Lire', numbers:'Numéros utiles', numbersSub:'Urgences, gondoles, bateau-taxi',
  gameSub:'Notre petit jeu', prototype:'Prototype · non publié', eventsKicker:'Agenda culturel', eventsTitle:'Événements à Venise', fToday:'Aujourd\'hui', fWeek:'Cette semaine', fMonth:'30 prochains jours', fAll:'Tout',
  cAll:'Tout', cMostra:'Expositions', cMusica:'Musique', cDanza:'Danse', cFesta:'Fêtes & traditions', eventsNote:'Dates et horaires issus des pages officielles. Vérifiez toujours le lien avant de partir.',
  mapTitle:'Carte des services', mapOffline:'Carte indisponible hors ligne : voici la liste des services proches.', menuKicker:'Pâtes fraîches maison', menuTitle:'Le Menu',
  venKicker:'Castello · Barbaria de le Tole', venTitle:'Histoires de notre quartier', illustration:'Illustration à l\'aquarelle', nearArt:'L\'art à deux pas', numKicker:'Toujours sous la main',
  numNote:'Chaque numéro provient d\'une source officielle. En cas de danger, appelez le 112.', tOggi:'Auj.', tEventi:'Agenda', tMappa:'Carte', tMenu:'Menu', tVenezia:'Venise',
  updated:'Mis à jour le', nothingToday:'Rien au programme aujourd\'hui : voici la suite.', none:'Aucun événement avec ces filtres.', inCorso:'En cours', today:'Aujourd\'hui', tonight:'Ce soir', tomorrow:'Demain',
  inDays:'Dans {n} jours', lastDays:'Derniers jours', until:'jusqu\'au {d}', from:'à partir du {d}', untilApprox:'jusqu\'à {d}', free:'Entrée libre', official:'Site officiel', addCal:'Calendrier', share:'Partager', source:'Source',
  openNow:'Ouvert', closedNow:'Fermé', opensAt:'ouvre à {t}', closesAt:'ferme à {t}', hoursMon:'Lundi 12h–15h · 18h–22h30', hoursRest:'Mar–Dim 12h–22h30 non-stop', liveMusic:'Musique live tous les soirs',
  near:'à {m} m à vol d\'oiseau', go:'M\'y emmener', callShort:'Appeler', list:'Liste', map:'Carte', locating:'Recherche de votre position…', noGeo:'Position indisponible', copied:'Lien copié',
  cover:'Couvert', extras:'Suppléments', allergensT:'Allergènes', draftTr:'traduction en relecture', install:'Installer l\'app', thisWeek:'Cette semaine', later:'Plus tard',
  cat:{ristorante:'6342', vaporetto:'Vaporetto', gondola:'Gondoles', taxi:'Bateau-taxi', farmacia:'Pharmacies', ospedale:'Hôpital', atm:'Distributeurs', wc:'Toilettes', info:'Infos touristiques', arte:'Art à proximité', eventi:'Événements'} }
};
if (window.I18N_EXTRA) Object.keys(window.I18N_EXTRA).forEach(function (l) { T[l] = Object.assign(T[l] || {}, window.I18N_EXTRA[l]); });
var LANGS = ['it', 'en', 'de', 'fr', 'es', 'ru', 'ja', 'zh', 'ko'];
var LANG_NAMES = { it: 'Italiano', en: 'English', de: 'Deutsch', fr: 'Français', es: 'Español', ru: 'Русский', ja: '日本語', zh: '简体中文', ko: '한국어' };
var REVIEW = { de: 1, fr: 1, es: 1, ru: 1, ja: 1, zh: 1, ko: 1 };
var lang = (function () { var q = new URLSearchParams(location.search).get('lang'); if (LANGS.indexOf(q) >= 0) return q;
  try { var s = localStorage.getItem('6342-lang'); if (LANGS.indexOf(s) >= 0) return s; } catch (e) {}
  var n = (navigator.language || 'it').slice(0, 2); return LANGS.indexOf(n) >= 0 ? n : 'en'; })();
function t(k, v) { var s = (T[lang] && T[lang][k]) != null ? T[lang][k] : T.it[k]; if (v) Object.keys(v).forEach(function (x) { s = s.replace('{' + x + '}', v[x]); }); return s; }
function L(o) { if (!o) return ''; if (typeof o === 'string') return o; return o[lang] || o.en || o.it || ''; }
var LOCALE = { it: 'it-IT', en: 'en-GB', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', ru: 'ru-RU', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR' };

/* ---------- date (Europe/Rome = ora del telefono del turista a Venezia) ---------- */
var qd = new URLSearchParams(location.search).get('oggi');
var NOW = qd ? new Date(qd + 'T' + (new URLSearchParams(location.search).get('ora') || '12:00') + ':00') : new Date();
function day(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
var TODAY = day(ymd(NOW));
function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function diffDays(a, b) { return Math.round((day(ymd(b)) - day(ymd(a))) / 864e5); }
function fmt(d, o) { return d.toLocaleDateString(LOCALE[lang], o); }
function fmtShort(d) { return fmt(d, { day: 'numeric', month: 'short' }); }
function fmtTime(dt) { return dt.toLocaleTimeString(LOCALE[lang], { hour: '2-digit', minute: '2-digit' }); }

/* ---------- dati ---------- */
var D = {};
function load(name) { return fetch('data/' + name + '.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(name); return r.json(); }).then(function (j) { D[name] = j; return j; }); }

/* ---------- eventi: logica ---------- */
function evStart(e) { return e.start ? day(e.start) : null; }
function evEnd(e) { return day(e.end || e.start); }
function isActiveOn(e, d) { var s = evStart(e), en = evEnd(e); return (!s || s <= d) && en >= d; }
function times(e) { return (e.times || []).map(function (x) { return new Date(x); }); }
function nextTime(e) { var ts = times(e).filter(function (x) { return x >= addDays(NOW, -0.08); }); return ts[0] || null; }
function hasShowOn(e, d) { var ts = times(e); if (!ts.length) return null; for (var i = 0; i < ts.length; i++) if (ymd(ts[i]) === ymd(d)) return ts[i]; return false; }
function effDate(e) { var s = evStart(e); if (e.times) { var n = nextTime(e); if (n) return day(ymd(n)); } return !s || s < TODAY ? TODAY : s; }
function notEnded(e) { return evEnd(e) >= TODAY; }
function overlaps(e, a, b) { var s = evStart(e) || new Date(2000, 0, 1), en = evEnd(e); if (e.times) return times(e).some(function (x) { var dx = day(ymd(x)); return dx >= a && dx <= b; }); return s <= b && en >= a; }
function status(e) {
  var s = evStart(e), en = evEnd(e), show = hasShowOn(e, TODAY);
  if (show) return { cls: 'live', txt: (show.getHours() >= 18 ? t('tonight') : t('today')) + ' ' + fmtTime(show) };
  if (show === null && isActiveOn(e, TODAY)) { var left = diffDays(TODAY, en); if (left <= 7 && left >= 0) return { cls: 'live', txt: t('lastDays') }; return { cls: 'live', txt: t('inCorso') }; }
  var nd = effDate(e), n = diffDays(TODAY, nd);
  if (n === 1) return { cls: '', txt: t('tomorrow') };
  if (n > 1) return { cls: '', txt: t('inDays', { n: n }) };
  return { cls: '', txt: t('inCorso') };
}
function whenLine(e) {
  var s = evStart(e), en = evEnd(e);
  if (e.times && e.times.length) { var ts = times(e); return ts.map(function (x) { return fmt(x, { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + fmtTime(x); }).slice(0, 2).join(' · ') + (ts.length > 2 ? ' · +' + (ts.length - 2) : ''); }
  if (!s || s <= TODAY) return e.end_approx ? t('untilApprox', { d: fmt(en, { month: 'long', year: 'numeric' }) }) : t('until', { d: fmt(en, { day: 'numeric', month: 'long', year: en.getFullYear() !== TODAY.getFullYear() ? 'numeric' : undefined }) });
  if (s.getTime() === en.getTime()) return fmt(s, { weekday: 'long', day: 'numeric', month: 'long' });
  return fmtShort(s) + ' – ' + fmt(en, { day: 'numeric', month: 'short', year: en.getFullYear() !== s.getFullYear() ? 'numeric' : undefined });
}
var GLYPH = { mostra: 'i-eventi', musica: 'i-clock', danza: 'i-oggi', festa: 'i-gondola' };
var GLYPH_SVG = {
 mostra: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="13" rx="1"/><path d="m4 14 4.5-4 3.5 3 3-2.5L20 15M9 20h6M12 17v3"/></svg>',
 musica: '<svg viewBox="0 0 24 24"><path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
 danza: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="M13 7.5 11 13l3.5 3 1.5 5M11 13l-3.5 2.5L5 14M12.2 9.5l4.3 1 2.5-3"/></svg>',
 festa: '<svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="3.5"/></svg>'
};
function card(e) {
  var st = status(e), nd = effDate(e);
  var d = (!e.times && isActiveOn(e, TODAY)) ? evEnd(e) : nd;
  var lbl = (!e.times && isActiveOn(e, TODAY)) ? '<span class="m">' + esc(fmt(d, { month: 'short' })) + '<br>' + d.getFullYear() + '</span>' : '<span class="m">' + esc(fmt(d, { weekday: 'short' })) + '<br>' + esc(fmt(d, { month: 'short' })) + '</span>';
  return '<button type="button" class="ev-card" data-cat="' + e.cat + '" data-ev="' + e.id + '">' +
    '<div class="ev-band"><span class="ev-badge ' + st.cls + '">' + esc(st.txt) + '</span><span class="ev-glyph">' + GLYPH_SVG[e.cat] + '</span>' +
    '<span class="ev-date">' + ((!e.times && isActiveOn(e, TODAY)) ? '<span class="pre">' + esc(t('until', { d: '' }).trim()) + '</span>' : '') + '<span class="d">' + d.getDate() + '</span>' + lbl + '</span></div>' +
    '<div class="ev-body"><span class="ev-title">' + esc(e.title) + '</span>' +
    '<span class="ev-meta"><svg><use href="#i-pin"/></svg>' + esc(e.venue) + '</span>' +
    '<span class="ev-when">' + esc(whenLine(e)) + '</span>' + (e.free ? '<span class="ev-free">' + esc(t('free')) + '</span>' : '') + '</div></button>';
}

/* ---------- OGGI ---------- */
function renderHome() {
  $('#hero-date').textContent = fmt(NOW, { weekday: 'long', day: 'numeric', month: 'long' });
  var ev = D.eventi.eventi.filter(notEnded);
  var today = ev.filter(function (e) { return e.times ? hasShowOn(e, TODAY) : isActiveOn(e, TODAY); });
  today.sort(function (a, b) { var A = hasShowOn(a, TODAY), B = hasShowOn(b, TODAY); if (A && !B) return -1; if (B && !A) return 1; if (a.highlight && !b.highlight) return -1; if (b.highlight && !a.highlight) return 1; return evEnd(a) - evEnd(b); });
  var rail = $('#rail-today');
  if (!today.length) { var nx = ev.slice().sort(function (a, b) { return effDate(a) - effDate(b); }).slice(0, 6); rail.innerHTML = '<p class="empty" style="flex:0 0 100%">' + esc(t('nothingToday')) + '</p>' + nx.map(card).join(''); }
  else rail.innerHTML = today.slice(0, 8).map(card).join('');
  var hl = ev.filter(function (e) { return e.highlight && !(e.times ? hasShowOn(e, TODAY) : false); }).sort(function (a, b) { return effDate(a) - effDate(b); }).slice(0, 4);
  $('#stack-highlights').innerHTML = hl.map(card).join('');
  $('#stack-highlights').classList.add('ev-list'); $('#stack-highlights').style.padding = '0';
  renderOpen();
}
function renderOpen() {
  var d = NOW.getDay(), m = NOW.getHours() * 60 + NOW.getMinutes();
  var slots = d === 1 ? [[720, 900], [1080, 1350]] : [[720, 1350]];
  var open = slots.some(function (s) { return m >= s[0] && m < s[1]; });
  var hm = function (x) { return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
  var txt;
  if (open) { var cur = slots.filter(function (s) { return m >= s[0] && m < s[1]; })[0]; txt = t('openNow') + ' · ' + t('closesAt', { t: hm(cur[1]) }); }
  else { var nx = slots.filter(function (s) { return m < s[0]; })[0]; txt = t('closedNow') + (nx ? ' · ' + t('opensAt', { t: hm(nx[0]) }) : ''); }
  $('#open-status').innerHTML = '<span class="dot' + (open ? '' : ' closed') + '"></span>' + esc(txt) + ' · ' + esc(t('liveMusic'));
}

/* ---------- EVENTI ---------- */
var evWhen = 'settimana', evCat = 'all';
function renderEvents() {
  $('#ev-updated').innerHTML = '<svg><use href="#i-clock"/></svg>' + esc(t('updated')) + ' ' + esc(fmt(day(D.eventi.aggiornato), { day: 'numeric', month: 'long', year: 'numeric' }));
  $$('#ev-when .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.when === evWhen); });
  $$('#ev-cat .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === evCat); });
  var a = TODAY, b = evWhen === 'oggi' ? TODAY : evWhen === 'settimana' ? addDays(TODAY, 6) : evWhen === 'mese' ? addDays(TODAY, 30) : addDays(TODAY, 3650);
  var list = D.eventi.eventi.filter(function (e) { return notEnded(e) && (evCat === 'all' || e.cat === evCat) && overlaps(e, a, b); });
  list.sort(function (x, y) { var dx = effDate(x) - effDate(y); if (dx) return dx; var tx = nextTime(x), ty = nextTime(y); if (tx && ty) return tx - ty; if (tx) return -1; if (ty) return 1; return evEnd(x) - evEnd(y); });
  var html = '', lastG = '';
  list.forEach(function (e) {
    var ed = effDate(e), g = ed.getTime() === TODAY.getTime() ? t('today') : diffDays(TODAY, ed) < 7 ? fmt(ed, { weekday: 'long', day: 'numeric' }) : fmt(ed, { month: 'long', year: 'numeric' });
    if (g !== lastG) { html += '<p class="month-sep">' + esc(g.charAt(0).toUpperCase() + g.slice(1)) + '</p>'; lastG = g; }
    html += card(e);
  });
  $('#ev-list').innerHTML = html || '<p class="empty">' + esc(t('none')) + '</p>';
  stagger($('#ev-list'));
}
function stagger(root) { $$('.ev-card', root).forEach(function (c, i) { c.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: Math.min(i, 10) * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }); }); }

/* ---------- scheda evento ---------- */
function mapsUrl(ll, q) { return ll ? 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=' + ll[0] + ',' + ll[1] : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q + ', Venezia'); }
function openEvent(id) {
  var e = D.eventi.eventi.filter(function (x) { return x.id === id; })[0]; if (!e) return;
  var ts = times(e);
  var html = '<div class="sheet-hero ev-card" data-cat="' + e.cat + '" style="border:0;border-radius:0;box-shadow:none"><div class="ev-band"><span class="ev-badge ' + status(e).cls + '">' + esc(status(e).txt) + '</span><span class="ev-glyph">' + GLYPH_SVG[e.cat] + '</span></div></div>' +
    '<p class="eyebrow">' + esc(t('c' + e.cat.charAt(0).toUpperCase() + e.cat.slice(1))) + '</p><h2 id="sheet-title">' + esc(e.title) + '</h2>' +
    '<p class="venue"><svg><use href="#i-pin"/></svg>' + esc(e.venue) + ' · ' + esc(e.area) + '</p>' +
    (e.times ? '' : '<p class="venue"><svg><use href="#i-cal"/></svg>' + esc(whenLine(e)) + '</p>') +
    (ts.length ? '<div class="times">' + ts.map(function (x) { return '<span>' + esc(fmt(x, { weekday: 'short', day: 'numeric', month: 'short' })) + ' · ' + esc(fmtTime(x)) + '</span>'; }).join('') + '</div>' : '') +
    '<p class="note">' + esc(L(e.note)) + '</p>' + (e.free ? '<p class="ev-free">' + esc(t('free')) + '</p>' : '') +
    '<div class="actions"><a class="btn btn-oro full" href="' + esc(e.url) + '" target="_blank" rel="noopener"><svg><use href="#i-link"/></svg>' + esc(t('official')) + '</a>' +
    '<a class="btn btn-ghost" href="' + esc(mapsUrl(e.ll, e.venue)) + '" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>' + esc(t('go')) + '</a>' +
    '<button class="btn btn-ghost" type="button" data-ics="' + e.id + '"><svg><use href="#i-cal"/></svg>' + esc(t('addCal')) + '</button>' +
    '<button class="btn btn-ghost full" type="button" data-share="' + e.id + '"><svg><use href="#i-share"/></svg>' + esc(t('share')) + '</button></div>' +
    '<p class="src">' + esc(t('source')) + ': <a href="' + esc(e.source) + '" target="_blank" rel="noopener">' + esc(e.source.replace(/^https?:\/\//, '').slice(0, 80)) + '</a></p>';
  sheet(html);
  $('.sheet-body .ev-band').style.height = '140px';
  $('.sheet-body .ev-card .ev-band').parentElement.style.display = 'block';
}
function ics(e) {
  var p = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); };
  var pd = function (d) { return ymd(d).replace(/-/g, ''); };
  var ts = times(e), nt = ts.filter(function (x) { return x >= NOW; })[0];
  var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//6342 a le Tole//Venezia in tasca//IT', 'BEGIN:VEVENT', 'UID:' + e.id + '@6342aletole', 'DTSTAMP:' + p(new Date())];
  if (nt) { lines.push('DTSTART:' + p(nt), 'DTEND:' + p(new Date(nt.getTime() + 2 * 36e5))); }
  else { var s = evStart(e) && evStart(e) > TODAY ? evStart(e) : TODAY; lines.push('DTSTART;VALUE=DATE:' + pd(s), 'DTEND;VALUE=DATE:' + pd(addDays(s, 1))); }
  lines.push('SUMMARY:' + e.title.replace(/[,;]/g, ' '), 'LOCATION:' + (e.venue + ', ' + e.area + ', Venezia').replace(/[,;]/g, ' '), 'DESCRIPTION:' + (L(e.note) + ' ' + e.url).replace(/[,;\n]/g, ' '), 'URL:' + e.url, 'END:VEVENT', 'END:VCALENDAR');
  var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' }), a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = e.id + '.ics'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function share(e) {
  var data = { title: e.title, text: e.title + ' · ' + e.venue + ' · ' + whenLine(e), url: e.url };
  if (navigator.share) navigator.share(data).catch(function () {});
  else if (navigator.clipboard) navigator.clipboard.writeText(data.text + ' ' + data.url).then(function () { toast(t('copied')); });
}
var lastFocus = null;
function sheet(html) {
  lastFocus = document.activeElement;
  $('#sheet-body').innerHTML = html; var s = $('#sheet'), b = $('#sheet-backdrop');
  s.hidden = false; b.hidden = false; s.scrollTop = 0;
  requestAnimationFrame(function () { s.classList.add('show'); b.classList.add('show'); });
  if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
  setTimeout(function () { $('#sheet-close').focus({ preventScroll: true }); }, 50);
}
function closeSheet() { var s = $('#sheet'), b = $('#sheet-backdrop'); s.classList.remove('show'); b.classList.remove('show'); setTimeout(function () { s.hidden = true; b.hidden = true; }, 400); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
(function swipe() { var y0 = null, s = $('#sheet'); s.addEventListener('touchstart', function (e) { if (s.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
  s.addEventListener('touchmove', function (e) { if (y0 == null) return; var dy = e.touches[0].clientY - y0; if (dy > 0) s.style.transform = 'translate(-50%,' + dy + 'px)'; }, { passive: true });
  s.addEventListener('touchend', function (e) { if (y0 == null) return; var dy = e.changedTouches[0].clientY - y0; s.style.transform = ''; y0 = null; if (dy > 110) closeSheet(); }); })();

/* ---------- MAPPA ---------- */
var CAT = { ristorante: ['#e8d08c', 'i-fork'], eventi: ['#d98a9a', 'i-eventi'], vaporetto: ['#7fb0c4', 'i-boat'], gondola: ['#e3c27a', 'i-gondola'], taxi: ['#a5c9a0', 'i-boat'],
  farmacia: ['#8fd19e', 'i-cross'], ospedale: ['#e2786a', 'i-cross'], atm: ['#c8b8e8', 'i-euro'], wc: ['#b9b2a3', 'i-wc'], info: ['#f0a868', 'i-info'], arte: ['#d6b06a', 'i-eventi'] };
var mapCats = { ristorante: 1, eventi: 1, vaporetto: 1, gondola: 1, farmacia: 1, ospedale: 1 };
var map = null, layers = {}, tileErrors = 0, tileOk = 0, listMode = false, userMarker = null;
function mapPoints() {
  var pts = [{ cat: 'ristorante', name: REST.name, ll: REST.ll, m: 0, note: { it: 'Castello 6342 · Barbaria de le Tole', en: 'Castello 6342 · Barbaria de le Tole' }, tel: REST.tel }];
  D.servizi.punti.forEach(function (p) { pts.push(p); });
  D.eventi.eventi.filter(function (e) { return e.ll && notEnded(e); }).forEach(function (e) { pts.push({ cat: 'eventi', name: e.title, ll: e.ll, m: dist(REST.ll, e.ll), note: { it: e.venue + ' · ' + whenLine(e), en: e.venue + ' · ' + whenLine(e) }, ev: e.id }); });
  return pts;
}
function dist(a, b) { var k = Math.PI / 180, x = (b[1] - a[1]) * k * Math.cos((a[0] + b[0]) / 2 * k), y = (b[0] - a[0]) * k; return Math.round(6371000 * Math.hypot(x, y)); }
function renderMapChips() {
  var pts = mapPoints(), cnt = {}; pts.forEach(function (p) { cnt[p.cat] = (cnt[p.cat] || 0) + 1; });
  $('#map-cats').innerHTML = Object.keys(CAT).filter(function (c) { return cnt[c]; }).map(function (c) {
    return '<button class="chip small" data-mcat="' + c + '" aria-pressed="' + !!mapCats[c] + '"><span class="sw" style="background:' + CAT[c][0] + '"></span>' + esc(t('cat')[c]) + ' <span class="count">' + cnt[c] + '</span></button>'; }).join('');
}
function popupHtml(p) {
  var m = p.cat === 'ristorante' ? '' : '<div class="pm">' + esc(t('near', { m: p.m })) + '</div>';
  return '<strong>' + esc(p.name) + '</strong>' + esc(L(p.note)) + m + '<div class="pa"><a href="' + esc(mapsUrl(p.ll)) + '" target="_blank" rel="noopener">' + esc(t('go')) + '</a>' +
    (p.tel ? '<a class="alt" href="tel:' + esc(p.tel) + '">' + esc(t('callShort')) + '</a>' : '') + (p.ev ? '<a class="alt" href="#eventi" data-ev-open="' + p.ev + '">Info</a>' : '') + '</div>';
}
function icon(p) {
  var c = CAT[p.cat];
  if (p.cat === 'ristorante') return L_.divIcon({ className: 'pin-wrap', html: '<div class="pin big"><img src="assets/img/brand/logo-6342-oro-480.webp" alt=""></div>', iconSize: [50, 50], iconAnchor: [4, 50], popupAnchor: [20, -46] });
  return L_.divIcon({ className: 'pin-wrap', html: '<div class="pin" style="--c:' + c[0] + '"><svg><use href="#' + c[1] + '"/></svg></div>', iconSize: [34, 34], iconAnchor: [3, 34], popupAnchor: [14, -30] });
}
var L_ = null;
function initMap() {
  renderMapChips();
  if (map) { setTimeout(function () { map.invalidateSize(); }, 60); return; }
  L_ = window.L;
  if (!L_ || !navigator.onLine) { showList(true); return; }
  map = L_.map('map', { zoomControl: false, attributionControl: true, tap: true }).setView(REST.ll, 16);
  var tl = L_.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  tl.on('tileerror', function () { tileErrors++; if (tileErrors > 6 && tileOk === 0) showList(true); });
  tl.on('tileload', function () { tileOk++; });
  mapPoints().forEach(function (p) {
    var mk = L_.marker(p.ll, { icon: icon(p), zIndexOffset: p.cat === 'ristorante' ? 1000 : 0, title: p.name }).bindPopup(popupHtml(p), { maxWidth: 260 });
    (layers[p.cat] = layers[p.cat] || L_.layerGroup()).addLayer(mk);
  });
  syncLayers();
  setTimeout(function () { map.invalidateSize(); }, 80);
}
function syncLayers() { if (!map) return; Object.keys(layers).forEach(function (c) { if (mapCats[c]) layers[c].addTo(map); else map.removeLayer(layers[c]); }); }
function renderMapList() {
  var pts = mapPoints().filter(function (p) { return mapCats[p.cat]; }).sort(function (a, b) { return a.m - b.m; });
  $('#map-list').innerHTML = pts.map(function (p) { var c = CAT[p.cat];
    return '<div class="pl"><span class="ico" style="--c:' + c[0] + '"><svg><use href="#' + c[1] + '"/></svg></span><span class="t"><strong>' + esc(p.name) + '</strong><span>' + esc(L(p.note)) + (p.m ? ' · ' + esc(t('near', { m: p.m })) : '') + '</span></span>' +
      (p.tel ? '<a class="go" href="tel:' + esc(p.tel) + '"><svg><use href="#i-tel"/></svg></a>' : '') + '<a class="go" href="' + esc(mapsUrl(p.ll)) + '" target="_blank" rel="noopener">' + esc(t('go')) + '</a></div>'; }).join('') +
    '<p class="fine" style="padding:16px 0">' + esc(D.servizi.attribuzione) + ' · ' + esc(t('updated')) + ' ' + esc(D.servizi.aggiornato) + '</p>';
}
function showList(offline) { listMode = true; $('#map-list').hidden = false; $('#btn-maplist').setAttribute('aria-pressed', 'true'); if (offline) $('#map-offline').hidden = false; renderMapList(); }
function hideList() { listMode = false; $('#map-list').hidden = true; $('#btn-maplist').setAttribute('aria-pressed', 'false'); }

/* ---------- MENU ---------- */
var menuTab = 'pasta';
function renderMenu() {
  var M = D.menu;
  $('#menu-tabs').innerHTML = M.menus.map(function (g) { return '<button type="button" data-mtab="' + g.id + '" aria-pressed="' + (g.id === menuTab) + '">' + esc(g.id === 'pasta' ? 'Spaghetteria' : g.name) + '</button>'; }).join('');
  var g = M.menus.filter(function (x) { return x.id === menuTab; })[0];
  $('#menu-nav').innerHTML = g.sections.map(function (s) { return '<a href="#m-' + s.id + '" data-jump="m-' + s.id + '">' + esc(L(s.title)) + '</a>'; }).join('');
  var draft = REVIEW[lang] ? '<span class="draft">' + esc(t('draftTr')) + '</span>' : '';
  var html = g.sections.map(function (s) {
    return '<section class="msec" id="m-' + s.id + '"><h2>' + esc(L(s.title)) + '</h2>' + s.items.map(function (i) {
      if (i.sub) return '<p class="msub">' + esc(L(i.sub)) + '</p>';
      var ds = i.desc || {}; var d = lang === 'it' ? ds.it : (ds[lang] || ds.en || '');
      if (lang !== 'it' && d && d.toLowerCase() === i.name.toLowerCase()) d = '';
      return '<div class="dish"><span class="n">' + esc(i.name) + (i.vol ? '<span class="v">' + esc(i.vol) + '</span>' : '') + (i.allergens.length ? '<sup>' + i.allergens.join(' ') + '</sup>' : '') + '</span><span class="p">' + esc(i.price) + '</span>' + (d ? '<span class="d">' + esc(d) + '</span>' : '') + '</div>';
    }).join('') + '</section>';
  }).join('');
  html += '<p class="menu-note">' + (menuTab !== 'bar' ? esc(L(M.coperto)) + ' ' + esc(M.coperto.price) : '') + (menuTab === 'pizza' ? ' · ' + esc(L(M.aggiunte)) + ' ' + esc(M.aggiunte.price) : '') + draft + '</p>';
  html += '<details class="allergens"><summary>' + esc(t('allergensT')) + '</summary><ol>' + M.allergeni.map(function (a) { return '<li>' + esc(a[lang] || a.en) + '</li>'; }).join('') + '</ol><p class="menu-note">' + M.note_allergeni.map(function (n) { return esc(lang === 'it' ? n.it : n.en); }).join('<br>') + '</p></details>';
  $('#menu-body').innerHTML = html;
}

/* ---------- VENEZIA + NUMERI ---------- */
var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
function renderVenezia() {
  $('#stories').innerHTML = D.venezia.storie.map(function (s, i) {
    return '<article class="story reveal" data-n="' + ROMAN[i] + '"><p class="eyebrow">' + esc(L(s.kicker)) + '</p><h3>' + esc(L(s.titolo)) + '</h3><p class="txt">' + esc(L(s.testo)) + '</p>' +
      '<p class="src">' + esc(t('source')) + ': <a href="' + esc(s.fonte) + '" target="_blank" rel="noopener">' + esc(s.fonte_nome) + '</a></p></article>'; }).join('');
  $('#near').innerHTML = D.venezia.vicini.map(function (v) {
    return '<a class="reveal" href="' + esc(v.url) + '" target="_blank" rel="noopener"><svg><use href="#i-eventi"/></svg><span><strong>' + esc(v.nome) + '</strong><span>' + esc(L(v.nota)) + (v.ll ? ' · ' + esc(t('near', { m: dist(REST.ll, v.ll) })) : '') + '</span></span></a>'; }).join('');
}
function renderNumeri() {
  var cda = cdaCardHtml();
  var ICON = { emergenza: 'i-sos', farmacie: 'i-cross', trasporti: 'i-boat', gondole: 'i-gondola', citta: 'i-oggi' };
  $('#numeri-list').innerHTML = cda + D.numeri.gruppi.map(function (g) {
    return '<section class="ngroup reveal"><h2><svg><use href="#' + ICON[g.id] + '"/></svg>' + esc(L(g.titolo)) + '</h2>' + (g.intro ? '<p class="intro">' + esc(L(g.intro)) + '</p>' : '') +
      g.voci.map(function (v) {
        var btn = v.tel ? '<a class="call' + (g.id === 'emergenza' && v.tel.length <= 3 ? ' sos' : '') + '" href="tel:' + esc(v.tel.replace(/\s/g, '')) + '"><svg><use href="#i-tel"/></svg>' + esc(v.tel) + '</a>' : '<a class="call link" href="' + esc(v.url) + '" target="_blank" rel="noopener"><svg><use href="#i-link"/></svg>Web</a>';
        return '<div class="nrow"><span class="t"><strong>' + esc(L(v.nome)) + '</strong>' + (v.nota ? '<span>' + esc(L(v.nota)) + '</span>' : '') + (v.tel2 ? '<span>cell. <a href="tel:' + esc(v.tel2.replace(/\s/g, '')) + '">' + esc(v.tel2) + '</a></span>' : '') +
          '<span class="src"><a href="' + esc(v.fonte) + '" target="_blank" rel="noopener">' + esc(t('source').toLowerCase()) + '</a></span></span>' + btn + '</div>'; }).join('') + '</section>'; }).join('');
}

/* ---------- contributo di accesso ---------- */
function cdaState() {
  var c = D.cda, ds = c.date.map(day), td = ymd(TODAY);
  var next = ds.filter(function (d) { return d > TODAY; })[0] || null;
  return { today: c.date.indexOf(td) >= 0, next: next, soon: next && diffDays(TODAY, next) <= 7 };
}
function cdaInfoUrl() { return D.cda.info[lang] || D.cda.info.en; }
function renderCda() {
  var b = $('#cda-banner'); if (!D.cda) { b.hidden = true; return; }
  var st = cdaState(), h = D.cda.orario, title, sub, cls = '';
  if (st.today) { title = t('cdaToday'); sub = t('cdaHours', { a: h[0], b: h[1] }); }
  else if (st.soon) { title = t('cdaSoon', { d: fmt(st.next, { weekday: 'long', day: 'numeric', month: 'long' }) }); sub = t('cdaHours', { a: h[0], b: h[1] }); }
  else { title = t('cdaOff'); sub = st.next ? t('cdaNext', { d: fmt(st.next, { day: 'numeric', month: 'long', year: 'numeric' }) }) : t('cdaInfo'); cls = 'off'; }
  b.className = 'cda-banner reveal in ' + cls; b.hidden = false;
  b.innerHTML = '<svg><use href="#i-ticket"/></svg><div><strong>' + esc(title) + '</strong><span>' + esc(sub) + '</span></div><svg class="arr"><use href="#i-arrow"/></svg>';
}
function cdaCardHtml() {
  if (!D.cda) return '';
  var c = D.cda, x = c.testi, st = cdaState(), months = {};
  c.date.forEach(function (s) { var d = day(s), k = fmt(d, { month: 'short' }); (months[k] = months[k] || []).push(d.getDate()); });
  var state = st.today ? t('cdaToday') + ' · ' + t('cdaHours', { a: c.orario[0], b: c.orario[1] }) : L(x.stato);
  return '<section class="cda-card" id="cda-card"><h2><svg><use href="#i-ticket"/></svg>' + esc(t('cdaTitle')) + '</h2>' +
    '<p class="state">' + esc(state) + '</p><p>' + esc(L(x.date)) + '</p><p>' + esc(L(x.tariffe)) + '</p><p>' + esc(L(x.chi)) + '</p><p>' + esc(L(x.esenti)) + '</p><p>' + esc(L(x.modalita)) + '</p>' +
    '<p class="eyebrow" style="margin-top:14px">' + esc(t('cdaDates')) + ' · ' + esc(c.orario[0] + '–' + c.orario[1]) + '</p><div class="cal">' +
    Object.keys(months).map(function (k) { return '<span><b>' + esc(k) + '</b>' + months[k].join(' · ') + '</span>'; }).join('') + '</div>' +
    '<div class="acts"><a class="btn btn-oro" href="' + esc(c.pagamento) + '" target="_blank" rel="noopener"><svg><use href="#i-ticket"/></svg>' + esc(t('cdaPay')) + '</a>' +
    '<a class="btn btn-ghost" href="' + esc(cdaInfoUrl()) + '" target="_blank" rel="noopener"><svg><use href="#i-link"/></svg>' + esc(t('cdaInfo')) + '</a></div>' +
    '<p class="src">' + esc(t('source')) + ': <a href="' + esc(c.fonti[0]) + '" target="_blank" rel="noopener">cda.ve.it</a> · <a href="' + esc(c.fonti[3]) + '" target="_blank" rel="noopener">live.comune.venezia.it</a> · ' + esc(t('updated')) + ' ' + esc(fmt(day(c.aggiornato), { day: 'numeric', month: 'short', year: 'numeric' })) + '</p></section>';
}

/* ---------- meteo (Open-Meteo) e marea (Centro Maree) ---------- */
var WX_URL = 'https://api.open-meteo.com/v1/forecast?latitude=45.4388&longitude=12.3424&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FRome&forecast_days=5';
var WXI = {
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',
  partly: '<svg viewBox="0 0 24 24"><path d="M8 3v1.6M3.2 8H4.8M4.6 4.6l1.1 1.1M11.4 4.6l-1.1 1.1"/><path d="M5.6 10.6A3.6 3.6 0 0 1 11.7 7"/><path d="M8 20h9.5a3.8 3.8 0 0 0 .4-7.6 5.2 5.2 0 0 0-10-.4A3.9 3.9 0 0 0 8 20z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M6.5 19h11a4.2 4.2 0 0 0 .4-8.4 6 6 0 0 0-11.5-1A4.8 4.8 0 0 0 6.5 19z"/></svg>',
  fog: '<svg viewBox="0 0 24 24"><path d="M6.5 13.5h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.9A4.4 4.4 0 0 0 6.5 13.5zM3 17h18M5 20.5h14"/></svg>',
  drizzle: '<svg viewBox="0 0 24 24"><path d="M6.5 14h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.9A4.4 4.4 0 0 0 6.5 14zM8 17.5v.5M12 18.5v.5M16 17.5v.5M10 21v.5M14 21v.5"/></svg>',
  rain: '<svg viewBox="0 0 24 24"><path d="M6.5 14h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.9A4.4 4.4 0 0 0 6.5 14zM8.5 16.5l-1.5 4M12.5 16.5l-1.5 4M16.5 16.5l-1.5 4"/></svg>',
  snow: '<svg viewBox="0 0 24 24"><path d="M6.5 13h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.9A4.4 4.4 0 0 0 6.5 13zM8 17h.01M12 16h.01M16 17h.01M10 20.5h.01M14 20.5h.01"/></svg>',
  storm: '<svg viewBox="0 0 24 24"><path d="M6.5 13.5h11a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.9A4.4 4.4 0 0 0 6.5 13.5zM12.5 14l-2.5 4h3.5l-2 4"/></svg>'
};
function wxKind(c) { return c === 0 ? 'clear' : c === 1 ? 'mostly' : c === 2 ? 'partly' : c === 3 ? 'cloudy' : c === 45 || c === 48 ? 'fog' : c >= 51 && c <= 57 ? 'drizzle' : (c >= 61 && c <= 67) || (c >= 80 && c <= 82) ? 'rain' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow' : c >= 95 ? 'storm' : 'cloudy'; }
function wxIcon(c, isDay) { var k = wxKind(c); return k === 'clear' ? (isDay === 0 ? WXI.moon : WXI.sun) : k === 'mostly' || k === 'partly' ? WXI.partly : k === 'cloudy' ? WXI.cloud : WXI[k]; }
var wxData = null, wxSaved = null, wxFetching = false;
try { var _w = JSON.parse(localStorage.getItem('6342-wx') || 'null'); if (_w && _w.d) { wxData = _w.d; wxSaved = _w.t; } } catch (e) {}
function fetchWx() {
  if (wxFetching || !navigator.onLine) return; if (wxSaved && Date.now() - wxSaved < 20 * 60e3) return;
  wxFetching = true;
  fetch(WX_URL).then(function (r) { if (!r.ok) throw new Error('wx ' + r.status); return r.json(); }).then(function (j) {
    wxData = j; wxSaved = Date.now(); try { localStorage.setItem('6342-wx', JSON.stringify({ t: wxSaved, d: j })); } catch (e) {}
    renderWx();
  }).catch(function (e) { console.info('meteo non aggiornato', e.message); }).then(function () { wxFetching = false; });
}
function tideHtml() {
  var m = D.maree, link = 'https://www.comune.venezia.it/it/content/centro-previsioni-e-segnalazioni-maree';
  var head = '<div class="tide-h"><svg><use href="#i-wave"/></svg><strong>' + esc(t('tideTitle')) + '</strong>';
  var age = m && m.aggiornato ? NOW - new Date(m.aggiornato) : Infinity;
  if (!m || !m.estremali || age > 18 * 36e5 || age < -36e5) return '<div class="tide">' + head + '</div><a class="tl" href="' + link + '" target="_blank" rel="noopener">' + esc(t('tideOnlyLink')) + ' <svg><use href="#i-link"/></svg></a></div>';
  var next = m.estremali.filter(function (x) { return new Date(x.t) >= new Date(NOW.getTime() - 30 * 6e4); }).slice(0, 5);
  if (m.livello) head += '<span class="now">' + esc(t('tideNow', { c: m.livello.cm })) + '</span>';
  return '<div class="tide">' + head + '</div><div class="tide-row">' + next.map(function (x) { var d = new Date(x.t);
      var dl = ymd(d) === ymd(TODAY) ? '' : fmt(d, { weekday: 'short' }) + ' ';
      return '<span class="' + (x.tipo === 'max' ? 'hi' : '') + '">' + (x.tipo === 'max' ? '▲ ' : '▼ ') + esc(dl + fmtTime(d)) + ' <b>' + (x.cm > 0 ? '+' : '') + x.cm + ' cm</b></span>'; }).join('') + '</div>' +
    '<div class="wx-foot"><span>' + esc(t('tideForecast', { t: fmtTime(new Date(m.emessa)) })) + '</span><a href="' + link + '" target="_blank" rel="noopener">' + esc(t('tideLink')) + '</a></div></div>';
}
function renderWx() {
  var el = $('#wx'); if (!el) return;
  var w = wxData, html;
  if (!w || !w.current) html = (navigator.onLine ? '<div class="wx-skel"></div>' : '<p class="wx-d">' + esc(t('wxNone')) + '</p>');
  else {
    var c = w.current, dd = w.daily, kind = wxKind(c.weather_code);
    html = '<div class="wx-now"><span class="wx-ico">' + wxIcon(c.weather_code, c.is_day) + '</span><span class="wx-t">' + Math.round(c.temperature_2m) + '°</span>' +
      '<span class="wx-d"><strong>' + esc(t('wxTitle')) + ' · ' + esc(t('wx')[kind]) + '</strong>' + esc(t('wxFeels', { t: Math.round(c.apparent_temperature) })) + ' · ' + esc(t('wxWind', { v: Math.round(c.wind_speed_10m) })) + '</span></div><div class="wx-days">';
    var start = dd.time.indexOf(ymd(TODAY)); if (start < 0) start = 0;
    for (var i = start + 1; i < Math.min(dd.time.length, start + 5); i++) {
      var d = day(dd.time[i]);
      html += '<div class="wx-day"><span>' + esc(fmt(d, { weekday: 'short' })) + '</span>' + wxIcon(dd.weather_code[i], 1) + '<span><b>' + Math.round(dd.temperature_2m_max[i]) + '°</b> ' + Math.round(dd.temperature_2m_min[i]) + '°</span>' +
        (dd.precipitation_probability_max[i] != null ? '<span class="p">' + esc(t('wxRain', { p: dd.precipitation_probability_max[i] })) + '</span>' : '') + '</div>';
    }
    var sv = wxSaved ? new Date(wxSaved) : null;
    html += '</div><div class="wx-foot"><span>' + (sv ? esc(t('wxUpdated', { t: fmtTime(sv) })) + (navigator.onLine ? '' : ' · ' + esc(t('wxOffline'))) : '') + '</span><a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a></div>';
  }
  el.innerHTML = html + (D.eventi ? tideHtml() : '');
  fetchWx();
}

/* ---------- selettore lingua ---------- */
function openLang() {
  sheet('<p class="eyebrow">' + esc(t('langTitle')) + ' · Language</p><h2 id="sheet-title">' + esc(LANG_NAMES[lang]) + '</h2><div class="lang-list">' + LANGS.map(function (l) {
    return '<button type="button" data-lang="' + l + '" lang="' + l + '" aria-pressed="' + (l === lang) + '"><span class="code">' + l.toUpperCase() + '</span>' + esc(LANG_NAMES[l]) + (REVIEW[l] ? '<span class="rev">' + esc((T[l] && T[l].review) || '') + '</span>' : '') + '</button>'; }).join('') + '</div>');
}

/* ---------- i18n statico ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
  $('#lang-cur').textContent = lang.toUpperCase();
}
function setLang(l) { lang = l; try { localStorage.setItem('6342-lang', l); } catch (e) {} applyLang(); renderAll(); if (map) { map.remove(); map = null; layers = {}; if (current === 'mappa') initMap(); } else if (current === 'mappa') initMap(); setTitle(); }

/* ---------- router ---------- */
var current = null, TITLES = { oggi: 'heroKicker', eventi: 'eventsTitle', mappa: 'mapTitle', menu: 'menuTitle', venezia: 'venTitle', numeri: 'numbers' };
var TABOF = { oggi: 'oggi', eventi: 'eventi', mappa: 'mappa', menu: 'menu', venezia: 'venezia', numeri: 'venezia' };
function setTitle() { if (current) $('#topbar-title').textContent = t(TITLES[current]); }
function route() {
  var h = (location.hash || '#oggi').slice(1).split('/')[0];
  if (!TITLES[h]) h = 'oggi';
  if (h === current) return;
  var prev = current ? $('#v-' + current) : null, next = $('#v-' + h);
  if (prev) { prev.classList.remove('active'); }
  next.classList.add('active'); current = h; window.scrollTo(0, 0);
  var tab = TABOF[h]; $$('.tabbar a').forEach(function (a, i) { var on = a.dataset.tab === tab; a.setAttribute('aria-current', on ? 'page' : 'false'); if (on) $('.tab-ink').style.transform = 'translateX(' + (i * 100) + '%)'; });
  setTitle(); onScroll();
  if (h === 'mappa') initMap();
  if (h === 'eventi') stagger($('#ev-list'));
  observe();
}
function onScroll() { var solid = current !== 'oggi' && current !== 'menu' && current !== 'venezia' ? true : window.scrollY > 120; $('#topbar').classList.toggle('solid', solid); }
var io = null;
function observe() { if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(function (e) { e.classList.add('in'); }); return; }
  io = io || new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  $$('.view.active .reveal:not(.in)').forEach(function (e) { io.observe(e); }); }

function toast(m) { var el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2200); }

function renderAll() { renderCda(); renderWx(); renderHome(); renderEvents(); renderMenu(); renderVenezia(); renderNumeri(); if (current === 'mappa' && listMode) renderMapList(); observe(); }

/* ---------- eventi UI ---------- */
document.addEventListener('click', function (e) {
  var c;
  if ((c = e.target.closest('[data-ev]'))) { openEvent(c.dataset.ev); return; }
  if ((c = e.target.closest('[data-ev-open]'))) { e.preventDefault(); openEvent(c.dataset.evOpen); return; }
  if ((c = e.target.closest('[data-when]'))) { evWhen = c.dataset.when; renderEvents(); return; }
  if ((c = e.target.closest('[data-cat]')) && c.classList.contains('chip')) { evCat = c.dataset.cat; renderEvents(); return; }
  if ((c = e.target.closest('[data-mcat]'))) { var k = c.dataset.mcat; mapCats[k] = !mapCats[k]; c.setAttribute('aria-pressed', !!mapCats[k]); syncLayers(); if (listMode) renderMapList(); return; }
  if ((c = e.target.closest('[data-mtab]'))) { menuTab = c.dataset.mtab; renderMenu(); return; }
  if ((c = e.target.closest('[data-jump]'))) { e.preventDefault(); var el = document.getElementById(c.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if ((c = e.target.closest('[data-lang]'))) { closeSheet(); setLang(c.dataset.lang); return; }
  if (e.target.closest('#lang-btn')) { openLang(); return; }
  if (e.target.closest('[data-jump-cda]')) { setTimeout(function () { var el = $('#cda-card'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 450); }
  if ((c = e.target.closest('[data-ics]'))) { ics(D.eventi.eventi.filter(function (x) { return x.id === c.dataset.ics; })[0]); return; }
  if ((c = e.target.closest('[data-share]'))) { share(D.eventi.eventi.filter(function (x) { return x.id === c.dataset.share; })[0]); return; }
  if (e.target.closest('[data-open-game]')) { openGame(); return; }
});
$('#sheet-close').addEventListener('click', closeSheet); $('#sheet-backdrop').addEventListener('click', closeSheet);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!$('#sheet').hidden) closeSheet(); if (!$('#game-layer').hidden) closeGame(); } });
$('#btn-maplist').addEventListener('click', function () { if (listMode) { hideList(); if (map) map.invalidateSize(); } else showList(false); });
$('#btn-locate').addEventListener('click', function () {
  if (!navigator.geolocation || !map) { toast(t('noGeo')); return; }
  toast(t('locating'));
  navigator.geolocation.getCurrentPosition(function (p) { var ll = [p.coords.latitude, p.coords.longitude];
    if (userMarker) userMarker.setLatLng(ll); else userMarker = L_.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#5f8ea3', fillOpacity: 1 }).addTo(map);
    map.flyTo(ll, 16, { duration: .8 }); }, function () { toast(t('noGeo')); }, { enableHighAccuracy: true, timeout: 8000 });
});
function openGame() { var g = $('#game-layer'), f = $('#game-frame'); f.src = 'gioco.html?lang=' + lang; g.hidden = false; }
function closeGame() { $('#game-layer').hidden = true; $('#game-frame').src = 'about:blank'; }
$('#game-close').addEventListener('click', closeGame);
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('hashchange', route);
window.addEventListener('online', function () { $('#map-offline').hidden = true; renderWx(); });
window.addEventListener('offline', function () { renderWx(); });

/* ---------- avvio ---------- */
applyLang();
Promise.all(['eventi', 'servizi', 'menu', 'numeri', 'venezia', 'cda'].map(load).concat([load('maree').catch(function () { D.maree = null; })])).then(function () { renderAll(); route(); document.body.classList.add('ready'); })
 .catch(function (err) { console.warn('dati non caricati', err); route(); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function () { navigator.serviceWorker.register('/6342-anteprima/app/sw.js', { scope: '/6342-anteprima/app/' }).then(function (r) { window.__swReg = r; }).catch(function (e) { console.warn('SW', e); }); });
}
var deferred = null;
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e;
  var b = document.createElement('button'); b.className = 'btn btn-ghost'; b.style.margin = '14px auto 0'; b.style.display = 'flex'; b.innerHTML = '<svg><use href="#i-share"/></svg>' + esc(t('install'));
  b.addEventListener('click', function () { deferred.prompt(); deferred.userChoice.finally(function () { b.remove(); }); }); $('.foot').prepend(b); });
})();
