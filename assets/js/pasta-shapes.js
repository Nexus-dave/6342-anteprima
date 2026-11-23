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
  bigoli: { it: 'bigoli', en: 'bigoli', note: 'il formato veneziano', view: [1.0, -0.2], build: () => tubeify(nest(7, 1.6, 0.6, 0.30, 21), 0.035) },
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
export const FORMATI = Object.keys(SHAPES);
export function getShape(name) {
  const S = SHAPES[name] || SHAPES.spaghetti;
  const lines = S.build();
  let m = 0; for (const l of lines) for (const p of l) m = Math.max(m, Math.hypot(p[0], p[1], p[2]));
  for (const l of lines) for (const p of l) { p[0] /= m; p[1] /= m; p[2] /= m; }
  return { name, label: S.it, note: S.note || '', view: S.view || [0.45, -0.28], flat: !!S.flat, lines };
}
// proiezione prospettica con rotazione yaw/pitch/roll
export function project(lines, yaw, pitch, roll, scale, cx, cy, out) {
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
