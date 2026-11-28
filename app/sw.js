/* 6342 Venezia in tasca — service worker (scope: /6342-anteprima/app/) */
const V = 'v6342-pages-app-2026-11-28';
const SHELL = [
 "./",
 "index.html",
 "gioco.html",
 "manifest.webmanifest",
 "assets/css/app.css",
 "assets/css/base.css",
 "assets/css/gioco.css",
 "assets/fonts/fraunces-6342-soft-display.woff2",
 "assets/fonts/fraunces-6342-soft-italic.woff2",
 "assets/fonts/fraunces-6342-text-italic.woff2",
 "assets/fonts/fraunces-6342-text-medium.woff2",
 "assets/fonts/fraunces-6342-text.woff2",
 "assets/fonts/notoserif-cyr-light.woff2",
 "assets/fonts/notoserif-cyr-regular.woff2",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/favicon.ico",
 "assets/icons/favicon-16.png",
 "assets/icons/favicon-32.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon-maskable-512.png",
 "assets/img/art/accento-p05.webp",
 "assets/img/art/accento-p08.webp",
 "assets/img/art/accento-p11.webp",
 "assets/img/art/campo-schizzo.webp",
 "assets/img/art/carta-400.webp",
 "assets/img/art/hero-venezia-notte.webp",
 "assets/img/art/pennellata-1200.webp",
 "assets/img/art/terrazzo.webp",
 "assets/img/brand/logo-6342-oro-480.webp",
 "assets/img/brand/logo-6342-oro-720.webp",
 "assets/img/foto/cucina-hero-chef-1000.webp",
 "assets/img/foto/cucina-vetrina-1000.webp",
 "assets/img/foto/facciata-1000.webp",
 "assets/img/foto/g01-pizza-960.webp",
 "assets/img/foto/g02-scampi-960.webp",
 "assets/img/foto/g09-dolce-960.webp",
 "assets/img/foto/g12-spaghetti-pomodoro-960.webp",
 "assets/img/foto/g13-spaghetti-gamberi-960.webp",
 "assets/img/foto/g14-spaghetti-astice-960.webp",
 "assets/img/foto/g15-pizzaiolo-960.webp",
 "assets/img/foto/g16-sala-960.webp",
 "assets/img/foto/musica-live-1000.webp",
 "assets/img/foto/pasta-assortimento-1000.webp",
 "assets/img/foto/pasta-nero-640.webp",
 "assets/img/foto/pasta-spaghetti-1000.webp",
 "assets/js/app.js",
 "assets/js/gioco.js",
 "assets/js/i18n.js",
 "data/cda.json",
 "data/eventi.json",
 "data/maree.json",
 "data/menu.json",
 "data/numeri.json",
 "data/servizi.json",
 "data/venezia.json",
 "vendor/leaflet/images/layers.png",
 "vendor/leaflet/images/marker-icon.png",
 "vendor/leaflet/images/marker-shadow.png",
 "vendor/leaflet/leaflet.css",
 "vendor/leaflet/leaflet.js"
];
const TILES = 'v6342-tiles', TILE_MAX = 600;
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== TILES).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
async function trimTiles() { const c = await caches.open(TILES); const ks = await c.keys(); for (let i = 0; i < ks.length - TILE_MAX; i++) await c.delete(ks[i]); }
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.hostname.endsWith('tile.openstreetmap.org')) {
    e.respondWith(caches.open(TILES).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { c.put(e.request, r.clone()); trimTiles(); } return r; }))));
    return;
  }
  if (u.hostname === 'api.open-meteo.com') {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/data/')) {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); } return r; }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : undefined)));
});
