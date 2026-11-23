(function(){'use strict';
// Formati di pasta parametrici (polilinee 3D, raggio ~1). Nessuna dipendenza.
const TAU = Math.PI * 2;
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function nest(strands, turns, R, rho, seed) {
  const r = rng(seed), lines = [];
  for (let i = 0; i < strands; i++) {
    const u0 = r() * TAU, v0 = r() * TAU, k = turns + r() * 0.8, kv = 3.2 + r() * 2.4, rr = rho * (0.75 + r() * 0.5);
    const pts = [], n = 240;
    for (let j = 0; j <= n; j++) {
      const t = j / n, u = u0 + t * TAU * k, v = v0 + t * TAU * kv;
      const p = rr * (0.85 + 0.15 * Math.sin(t * TAU * 2 + i));
      const R2 = R * (0.92 + 0.08 * Math.sin(u * 3 + i));
      pts.push([(R2 + p * Math.cos(v)) * Math.cos(u), p * Math.sin(v) * 0.9, (R2 + p * Math.cos(v)) * Math.sin(u)]);
    }
    lines.push(pts);
  }
  return lines;
}
function tubeify(lines, w) {
  // affianca a ogni filo due linee parallele (effetto "spessore", per i bigoli)
  const out = [];
  for (const pts of lines) {
    const a = [], b = [];
    for (let j = 0; j < pts.length; j++) {
      const p = pts[j], q = pts[Math.min(j + 1, pts.length - 1)], o = pts[Math.max(j - 1, 0)];
      let tx = q[0] - o[0], ty = q[1] - o[1], tz = q[2] - o[2];
      // normale = tangente x radiale
      let nx = ty * p[2] - tz * p[1], ny = tz * p[0] - tx * p[2], nz = tx * p[1] - ty * p[0];
      const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      a.push([p[0] + nx * w, p[1] + ny * w, p[2] + nz * w]); b.push([p[0] - nx * w, p[1] - ny * w, p[2] - nz * w]);
    }
    out.push(a, pts, b);
  }
  return out;
}
function place(lines, ry, rz, dx, dy, dz) {
  const cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
  return lines.map(l => l.map(([x, y, z]) => { let x1 = x * cz - y * sz, y1 = x * sz + y * cz; let x2 = x1 * cy + z * sy, z2 = -x1 * sy + z * cy; return [x2 + dx, y1 + dy, z2 + dz]; }));
}
function trio(build) { const a = build(); return [...place(a, 0, 0.15, 0, 0, 0), ...place(a, 1.25, -0.35, 0.15, -0.55, 0.25), ...place(a, -0.9, 0.5, -0.2, 0.55, -0.3)]; }
const SHAPES = {
  spaghetti: { it: 'spaghetti', en: 'spaghetti', view: [1.0, -0.2], build: () => nest(18, 2.0, 0.62, 0.30, 7) },
  bigoli: { it: 'bigoli', en: 'bigoli', note: ({ it: 'il formato veneziano', en: 'the Venetian shape', de: 'das venezianische Format', fr: 'le format vénitien' })[document.documentElement.lang] || 'il formato veneziano', view: [1.0, -0.2], build: () => tubeify(nest(7, 1.6, 0.6, 0.30, 21), 0.035) },
  fusilli: { it: 'fusilli', en: 'fusilli', view: [0.25, -0.95], build() {
    const L = 2.3, turns = 2.6, lines = [], rs = [0.12, 0.3, 0.46, 0.56];
    for (let b = 0; b < 3; b++) {
      for (const r of rs) { const pts = []; for (let j = 0; j <= 220; j++) { const s = j / 220, taper = Math.min(1, Math.min(s, 1 - s) * 9), th = s * TAU * turns + b * TAU / 3; pts.push([r * taper * Math.cos(th), (s - 0.5) * L, r * taper * Math.sin(th)]); } lines.push(pts); }
      for (let k = 1; k < 28; k++) { const s = k / 28, taper = Math.min(1, Math.min(s, 1 - s) * 9), th = s * TAU * turns + b * TAU / 3; lines.push([[0.06 * Math.cos(th), (s - 0.5) * L, 0.06 * Math.sin(th)], [0.56 * taper * Math.cos(th), (s - 0.5) * L, 0.56 * taper * Math.sin(th)]]); }
    }
    return lines;
  } },
  farfalle: { it: 'farfalle', en: 'farfalle', view: [0.5, -0.3], flat: true, build() {
    const P = (u, v) => { const au = Math.abs(u), h = 0.16 + 0.6 * Math.pow(au, 0.85); let x = u * 1.15, y = v * h;
      let z = 0.22 * Math.cos(v * Math.PI * 0.5) * Math.pow(1 - au, 4) + 0.18 * u * u * v * v - 0.05 * u * u;
      if (au > 0.86) { const e = (au - 0.86) / 0.14; x += Math.sign(u) * 0.045 * e * Math.abs(Math.sin(v * 22)); } return [x, y, z]; };
    const lines = [];
    for (let i = 0; i <= 12; i++) { const v = -1 + 2 * i / 12, pts = []; for (let j = 0; j <= 80; j++) pts.push(P(-1 + 2 * j / 80, v)); lines.push(pts); }
    for (let i = 0; i <= 26; i++) { const u = -1 + 2 * i / 26, pts = []; for (let j = 0; j <= 40; j++) pts.push(P(u, -1 + 2 * j / 40)); lines.push(pts); }
    // nodo centrale
    for (let k = 0; k < 3; k++) { const pts = []; const x0 = (k - 1) * 0.05; for (let j = 0; j <= 40; j++) { const a = j / 40 * TAU; pts.push([x0 + 0.04 * Math.cos(a), 0.2 * Math.sin(a), 0.22 + 0.08 * Math.cos(a)]); } lines.push(pts); }
    return lines;
  } },
  penne: { it: 'penne', en: 'penne', view: [0.55, -0.25], build() { return trio(() => {
    const L = 1.9, r = 0.34, lines = [], N = 24;
    for (let i = 0; i < N; i++) { const f = i / N * TAU, c = Math.cos(f), pts = []; const x0 = -L / 2 + r * c * 1.2, x1 = L / 2 + r * c * 1.2;
      for (let j = 0; j <= 30; j++) { const x = x0 + (x1 - x0) * j / 30; pts.push([x, r * c, r * Math.sin(f)]); } lines.push(pts); }
    for (const e of [-1, 1]) { const pts = []; for (let j = 0; j <= 64; j++) { const f = j / 64 * TAU, c = Math.cos(f); pts.push([e * L / 2 + r * c * 1.2, r * c, r * Math.sin(f)]); } lines.push(pts); }
    for (const t of [-0.25, 0.25]) { const pts = []; for (let j = 0; j <= 64; j++) { const f = j / 64 * TAU; pts.push([t * L, r * Math.cos(f), r * Math.sin(f)]); } lines.push(pts); }
    return lines;
  }); } },
  rigatoni: { it: 'rigatoni', en: 'rigatoni', view: [0.55, -0.25], build() { return trio(() => {
    const L = 1.5, r = 0.36, lines = [], N = 26, bend = 0.1;
    const P = (s, f) => { const x = (s - 0.5) * L, y0 = bend * Math.cos((s - 0.5) * Math.PI); return [x, y0 + r * Math.cos(f), r * Math.sin(f)]; };
    for (let i = 0; i < N; i++) { const f = i / N * TAU, pts = []; for (let j = 0; j <= 30; j++) pts.push(P(j / 30, f)); lines.push(pts); }
    for (const s of [0, 1]) { for (const k of [1, 0.86]) { const pts = []; for (let j = 0; j <= 72; j++) { const p = P(s, j / 72 * TAU); pts.push([p[0], (p[1] - bend * Math.cos((s - 0.5) * Math.PI)) * k + bend * Math.cos((s - 0.5) * Math.PI), p[2] * k]); } lines.push(pts); } }
    return lines;
  }); } },
};
const FORMATI = Object.keys(SHAPES);
function getShape(name) {
  const S = SHAPES[name] || SHAPES.spaghetti;
  const lines = S.build();
  let m = 0; for (const l of lines) for (const p of l) m = Math.max(m, Math.hypot(p[0], p[1], p[2]));
  for (const l of lines) for (const p of l) { p[0] /= m; p[1] /= m; p[2] /= m; }
  return { name, label: S.it, note: S.note || '', view: S.view || [0.45, -0.28], flat: !!S.flat, lines };
}
// proiezione prospettica con rotazione yaw/pitch/roll
function project(lines, yaw, pitch, roll, scale, cx, cy, out) {
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll), D = 3.4;
  const res = out || [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]; const o = res[i] || (res[i] = new Float32Array(l.length * 3));
    for (let j = 0; j < l.length; j++) {
      let [x, y, z] = l[j];
      let x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
      let y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      let x2 = x1 * cr - y1 * sr, y2 = x1 * sr + y1 * cr;
      const k = D / (D + z2);
      o[j * 3] = cx + x2 * scale * k; o[j * 3 + 1] = cy + y2 * scale * k; o[j * 3 + 2] = z2;
    }
  }
  return res;
}
// Intro "Il formato del giorno": Canvas 2D leggero, fili d'oro su nero -> logo.

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
})();
