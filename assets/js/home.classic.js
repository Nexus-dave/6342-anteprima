(function(){'use strict';
// Home "Chiaroscuro": cono di luce guidato dallo scroll + rivelazioni + dettagli.
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const caps = [...document.querySelectorAll('.cap')].map(el => ({
  el, stage: el.querySelector('.cap-stage'), title: el.querySelector('.cap-title'), text: el.querySelector('.cap-text'),
  from: (el.dataset.from || '30,70').split(',').map(Number), to: (el.dataset.to || '55,45').split(',').map(Number),
  end: parseFloat(el.dataset.end || '1.25'), top: 0, h: 0, on: false,
}));
const topbar = document.querySelector('.topbar');
let vh = innerHeight, ticking = false;

function measure() { vh = innerHeight; for (const c of caps) { const r = c.el.getBoundingClientRect(); c.top = r.top + scrollY; c.h = c.el.offsetHeight; } }
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

function apply(c, p) {
  // p: 0 quando il capitolo entra, 1 quando esce dallo sticky
  const t = sm(p / 0.8);
  const x = lerp(c.from[0], c.to[0], t), y = lerp(c.from[1], c.to[1], t);
  const s = lerp(0.32, c.end, sm((p - 0.05) / 0.8));
  const st = c.stage.style;
  st.setProperty('--x', x.toFixed(2) + '%'); st.setProperty('--y', y.toFixed(2) + '%'); st.setProperty('--r', s.toFixed(3));
  st.setProperty('--lit', sm((p - 0.1) / 0.4).toFixed(3));
}
function frame() {
  ticking = false;
  const y = scrollY;
  for (const c of caps) {
    const span = Math.max(1, c.h - vh);
    const p = (y - c.top + vh * 0.35) / (span + vh * 0.35);
    if (p > -0.2 && p < 1.2) apply(c, Math.min(1, Math.max(0, p)));
  }
  if (topbar) topbar.classList.toggle('is-solid', y > vh * 0.6);
}
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

if (rm) { for (const c of caps) { const st = c.stage.style; st.setProperty('--lit', 1); st.setProperty('--x', c.to[0] + '%'); st.setProperty('--y', c.to[1] + '%'); st.setProperty('--r', c.end); } }
else { measure(); frame(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { measure(); frame(); }, { passive: true }); addEventListener('load', () => { measure(); frame(); }); }
if (rm && topbar) addEventListener('scroll', () => topbar.classList.toggle('is-solid', scrollY > innerHeight * 0.6), { passive: true });

// rivelazioni "dal buio" per gli elementi secondari
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-lit'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => rm ? el.classList.add('is-lit') : io.observe(el));

// galleria: la luce segue il puntatore (desktop)
document.querySelectorAll('.galleria figure').forEach(f => {
  f.addEventListener('pointermove', e => { const r = f.getBoundingClientRect(); f.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); f.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); });
});

// lightbox galleria
const dlg = document.getElementById('lightbox');
if (dlg && dlg.showModal) {
  const img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption');
  document.querySelectorAll('.galleria a[data-full]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); img.src = a.dataset.full; img.alt = a.querySelector('img').alt; cap.textContent = a.querySelector('img').alt; dlg.showModal();
  }));
  dlg.addEventListener('click', () => dlg.close());
}

// video accoglienza ("la nostra famiglia"): carica quando si avvicina, parte muto quando è in vista
const vid = document.querySelector('video[data-lazy]');
if (vid) {
  vid.muted = true; vid.defaultMuted = true; vid.setAttribute('muted', '');
  const load = () => { if (vid.dataset.loaded) return; vid.querySelectorAll('source').forEach(s => s.src = s.dataset.src); vid.load(); vid.dataset.loaded = 1; };
  const play = () => { if (rm) return; const p = vid.play(); if (p && p.catch) p.catch(() => { vid.controls = true; }); };
  let inView = false;
  vid.addEventListener('loadeddata', () => { if (inView) play(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) load(); }), { rootMargin: '600px 0px' }).observe(vid);
    new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; if (inView) { load(); play(); } else vid.pause(); }), { threshold: 0.2 }).observe(vid);
  } else { load(); inView = true; }
  if (rm) { load(); vid.controls = true; }
}

// mappa: si carica solo al clic (niente cookie/terze parti all'apertura)
const mapBtn = document.getElementById('carica-mappa');
if (mapBtn) mapBtn.addEventListener('click', () => {
  const box = mapBtn.closest('.mappa');
  box.innerHTML = '<iframe title="' + ({ it: 'Mappa', en: 'Map', de: 'Karte', fr: 'Carte' }[document.documentElement.lang] || 'Mappa') + ': Spaghetteria 6342 a le Tole" src="https://maps.google.com/maps?q=Spaghetteria%206342%20A%20Le%20Tole%2C%20Castello%206342%2C%20Venezia&z=17&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
});
})();
