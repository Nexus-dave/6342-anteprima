// Intro "Il formato del giorno": Canvas 2D leggero, fili d'oro su nero -> logo.
import { FORMATI, getShape, project } from './pasta-shapes.js';

const html = document.documentElement;
const hero = document.getElementById('hero');
const canvas = document.getElementById('pasta-canvas');
const art = hero && hero.querySelector('.hero-art');
const capEl = document.getElementById('formato-oggi');
const skipBtn = document.getElementById('salta');
const GOLD = '#c9a84c', GOLD_HI = '#ecd28a';
const DRAW = 2000, RESOLVE = 1150;

function store(kind, k, v) { try { const s = kind === 'l' ? localStorage : sessionStorage; if (v === undefined) return s.getItem(k); s.setItem(k, v); } catch (e) { return null; } }
function pick() {
  const q = new URLSearchParams(location.search).get('formato');
  if (q && FORMATI.includes(q)) return q;
  const sess = store('s', '6342-formato');
  if (sess && FORMATI.includes(sess)) return sess;              // stesso formato per tutta la visita
  const last = store('l', '6342-formato-ultimo');
  const pool = FORMATI.filter(f => f !== last);                  // mai lo stesso della visita precedente
  const f = pool[Math.floor(Math.random() * pool.length)];
  store('s', '6342-formato', f); store('l', '6342-formato-ultimo', f);
  return f;
}
const shape = getShape(pick());
if (capEl) { capEl.querySelector('em').textContent = shape.label; const n = capEl.querySelector('.nota'); if (n) n.textContent = shape.note ? ' · ' + shape.note : ''; }
hero && hero.setAttribute('data-formato', shape.name);

function staticSVG() {
  // fallback: stessa forma, proiettata una volta in un SVG statico
  const pr = project(shape.lines, 0.7, shape.view[0], shape.view[1], 360, 500, 500);
  let d = '';
  pr.forEach(a => { d += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1); for (let j = 3; j < a.length; j += 6) d += 'L' + a[j].toFixed(1) + ' ' + a[j + 1].toFixed(1); });
  const svg = `<svg class="pasta-svg" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="${GOLD}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  art.insertAdjacentHTML('beforeend', svg);
  if (canvas) canvas.remove();
  html.dataset.intro = 'static';
}

const ctx = canvas && canvas.getContext && canvas.getContext('2d');
if (!hero || !art) { /* niente hero */ }
else if (html.dataset.intro === 'static' || !ctx) staticSVG();
else run();

function run() {
  let W = 0, H = 0, dpr = 1, raf = 0, visible = true, last = 0;
  const N = shape.lines.length, order = shape.lines.map((_, i) => i);
  // ordine di disegno casuale ma stabile
  for (let i = N - 1; i > 0; i--) { const j = (i * 7919) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  const rank = new Array(N); order.forEach((li, r) => rank[li] = r);
  const buf = [];
  let mode = html.dataset.intro; // play | done
  let t0 = performance.now();
  if (mode !== 'play') t0 -= DRAW + RESOLVE;
  const yaw0 = shape.flat ? (Math.random() - 0.5) * 0.8 : Math.random() * Math.PI * 2; // forme piatte: sempre di fronte

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 1.75); // DPR limitato
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3);
  const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;

  function draw(now) {
    const t = now - t0;
    let P = 1, alpha = 1, scl = 1;
    if (t < DRAW) P = ease(t / DRAW);
    else {
      const k = ease((t - DRAW) / RESOLVE);
      alpha = 1 - 0.72 * k; scl = 1 - 0.18 * k;
      if (mode === 'play') { mode = 'resolve'; html.dataset.intro = 'resolve'; }
      if (k >= 1 && mode !== 'done') { mode = 'done'; html.dataset.intro = 'done'; store('s', '6342-intro', '1'); }
    }
    const small = W < 700;
    const R = Math.min(W, H) * (small ? 0.42 : 0.36) * scl;
    const yaw = shape.flat ? yaw0 + 0.45 * Math.sin(t * 0.0003) : yaw0 + t * 0.00018, pitch = shape.view[0] + 0.1 * Math.sin(t * 0.00035), roll = shape.view[1] + 0.05 * Math.sin(t * 0.00023);
    const pr = project(shape.lines, yaw, pitch, roll, R, W / 2, H * (small ? 0.44 : 0.47), buf);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const passes = (mode === 'done' && small) ? [[1.25, 0.95, GOLD]] : [[3.2, 0.09, GOLD_HI], [1.05, 0.95, GOLD]];
    for (const [lw, pa, col] of passes) {
      ctx.lineWidth = lw; ctx.strokeStyle = col;
      for (let i = 0; i < N; i++) {
        const a = pr[i], len = a.length / 3;
        const s = rank[i] / N * 0.45, loc = clamp((P - s) / 0.55);
        const n = Math.floor(loc * (len - 1)); if (n < 1) continue;
        for (let c = 0; c < n; c += 14) {
          const e = Math.min(c + 14, n);
          const z = (a[c * 3 + 2] + a[e * 3 + 2]) * 0.5;
          ctx.globalAlpha = alpha * pa * (0.3 + 0.7 * clamp((1 - z) / 2));
          ctx.beginPath(); ctx.moveTo(a[c * 3], a[c * 3 + 1]);
          for (let j = c + 1; j <= e; j++) ctx.lineTo(a[j * 3], a[j * 3 + 1]);
          ctx.stroke();
        }
        if (loc < 1 && t < DRAW) { // punta della penna
          ctx.globalAlpha = 0.9; ctx.fillStyle = GOLD_HI; ctx.beginPath(); ctx.arc(a[n * 3], a[n * 3 + 1], 1.6, 0, 6.283); ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    raf = 0;
    if (!visible) return;
    const idle = mode === 'done';
    if (!idle || now - last > (W < 700 ? 66 : 40)) { last = now; draw(now); } // a riposo: 15 fps su telefono, 25 su desktop
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function skip() { if (mode === 'play' || mode === 'resolve') { t0 = performance.now() - DRAW - RESOLVE; draw(performance.now()); } }

  resize();
  addEventListener('resize', () => { resize(); draw(performance.now()); }, { passive: true });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  skipBtn && skipBtn.addEventListener('click', skip);
  if (mode === 'play') {
    const onUser = e => { if (e.type === 'keydown' && !['Escape', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) return; skip(); off(); };
    const off = () => { removeEventListener('wheel', onUser); removeEventListener('touchmove', onUser); removeEventListener('keydown', onUser); };
    addEventListener('wheel', onUser, { passive: true }); addEventListener('touchmove', onUser, { passive: true }); addEventListener('keydown', onUser);
  }
  window.__intro6342 = { shape: shape.name, skip, get mode() { return mode; } };
  start();
}
