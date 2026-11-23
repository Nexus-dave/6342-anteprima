/* 6342 · Pizza-Man — script classico, funziona anche da file:// */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'it').slice(0, 2);
  var TXT = {
    it: {
      play: 'Gioca', pause: 'Pausa', resume: 'Riprendi', again: 'Riprova',
      ready: 'Pronti!', over: 'Fine partita', level: 'Livello',
      sound: 'Suono', score: 'Punteggio',
      up: 'Su', down: 'Giù', left: 'Sinistra', right: 'Destra'
    },
    en: {
      play: 'Play', pause: 'Pause', resume: 'Resume', again: 'Try again',
      ready: 'Ready!', over: 'Game over', level: 'Level',
      sound: 'Sound', score: 'Score',
      up: 'Up', down: 'Down', left: 'Left', right: 'Right'
    },
    de: {
      play: 'Spielen', pause: 'Pause', resume: 'Weiter', again: 'Nochmal',
      ready: 'Fertig!', over: 'Spiel vorbei', level: 'Level',
      sound: 'Ton', score: 'Punkte',
      up: 'Hoch', down: 'Runter', left: 'Links', right: 'Rechts'
    },
    fr: {
      play: 'Jouer', pause: 'Pause', resume: 'Reprendre', again: 'Réessayer',
      ready: 'Prêts !', over: 'Partie terminée', level: 'Niveau',
      sound: 'Son', score: 'Score',
      up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite'
    }
  };
  var T = TXT[LANG] || TXT.it;

  /* v6f: labirinti (stessa griglia, recinto, porta e partenza); dal livello 2 uno a caso, mai uguale al precedente */
  var MAZES = [
    /* originale */
    [
      '###################',
      '#........#........#',
      '#o##.###.#.###.##o#',
      '#.................#',
      '#.##.#.#####.#.##.#',
      '#....#...#...#....#',
      '####.###.#.###.####',
      '####.#.......#.####',
      '####.#.## ##.#.####',
      '    ...##-##...    ',
      '####.#.#GGG#.#.####',
      '####.#.#####.#.####',
      '####.#.......#.####',
      '#........#........#',
      '#.##.###.#.###.##.#',
      '#o.#...........#.o#',
      '##.#.#.#####.#.#.##',
      '#....#...#...#....#',
      '#.######.#.######.#',
      '#........P........#',
      '###################'
    ],
    /* laguna */
    [
      '###################',
      '#...#....#....#...#',
      '#o#.#.##.#.##.#.#o#',
      '#.................#',
      '#.#.##.#####.##.#.#',
      '#.#..#...#...#..#.#',
      '#.##.###.#.###.##.#',
      '#....#.......#....#',
      '####.#.## ##.#.####',
      '    ...##-##...    ',
      '####.#.#GGG#.#.####',
      '####.#.#####.#.####',
      '#....#.......#....#',
      '#.##...#.#.#...##.#',
      '#o.#.#.#...#.#.#.o#',
      '##.#.#.#.#.#.#.#.##',
      '#....#...#...#....#',
      '#.##.#.#.#.#.#.##.#',
      '#.##...#.#.#...##.#',
      '#........P........#',
      '###################'
    ],
    /* forno */
    [
      '###################',
      '#.................#',
      '#.##.####.####.##.#',
      '#o#.............#o#',
      '#.#.#.###.###.#.#.#',
      '#...#...#.#...#...#',
      '###.###.#.#.###.###',
      '###.#.........#.###',
      '###.#.### ###.#.###',
      '    ..###-###..    ',
      '###.#.##GGG##.#.###',
      '###.#.#######.#.###',
      '###.#.........#.###',
      '#.......#.#.......#',
      '#.###.#.#.#.#.###.#',
      '#o..#.#.....#.#..o#',
      '###.#.###.###.#.###',
      '#.....#.....#.....#',
      '#.###.#.#.#.#.###.#',
      '#........P........#',
      '###################'
    ],
    /* rialto */
    [
      '###################',
      '#....#...#...#....#',
      '#o##.#.#.#.#.#.##o#',
      '#......#...#......#',
      '#.##.#.#.#.#.#.##.#',
      '#....#...#...#....#',
      '####.###.#.###.####',
      '####.#.......#.####',
      '####.#.## ##.#.####',
      '    ...##-##...    ',
      '####.#.#GGG#.#.####',
      '####...#####...####',
      '#....#.......#....#',
      '#.##.#.##.##.#.##.#',
      '#o.#...........#.o#',
      '##.#.#.#####.#.#.##',
      '#....#...#...#....#',
      '#.##.###.#.###.##.#',
      '#.#......#......#.#',
      '#.....#..P..#.....#',
      '###################'
    ],
    /* tole */
    [
      '###################',
      '#.................#',
      '#o##.###.#.###.##o#',
      '#.##.###.#.###.##.#',
      '#.................#',
      '###.#.##.#.##.#.###',
      '###.#....#....#.###',
      '###.#.##...##.#.###',
      '###.#.### ###.#.###',
      '    ...##-##...    ',
      '#.#.#..#GGG#..#.#.#',
      '#.#...#######...#.#',
      '#.#.#.........#.#.#',
      '#...#.##...##.#...#',
      '#o#.....#.#.....#o#',
      '#.#.###.#.#.###.#.#',
      '#.......#.#.......#',
      '#.#####.#.#.#####.#',
      '#...#...#.#...#...#',
      '#........P........#',
      '###################'
    ],
    /* spiga */
    [
      '###################',
      '#...#....#....#...#',
      '#o#.#.##.#.##.#.#o#',
      '#.#.............#.#',
      '#.#.#.##.#.##.#.#.#',
      '#...#..#.#.#..#...#',
      '##.###.#.#.#.###.##',
      '##.....#...#.....##',
      '##.#.#.## ##.#.#.##',
      '    .#.##-##.#.    ',
      '##.#.#.#GGG#.#.#.##',
      '##...#.#####.#...##',
      '####.#.......#.####',
      '#....#.#.#.#.#....#',
      '#o##...#...#...##o#',
      '#..#.#.#.#.#.#.#..#',
      '##.#.#...#...#.#.##',
      '#..#.###.#.###.#..#',
      '#.##.....#.....##.#',
      '#....###.P.###....#',
      '###################'
    ],
    /* canale */
    [
      '###################',
      '#.................#',
      '#.###.###.###.###.#',
      '#o#.............#o#',
      '#.#.#.#.###.#.#.#.#',
      '#...#.#..#..#.#...#',
      '###.#.##.#.##.#.###',
      '###.............###',
      '###.#.### ###.#.###',
      '    ...##-##...    ',
      '###.#..#GGG#..#.###',
      '###.#.#######.#.###',
      '#.....#.....#.....#',
      '#.###.#.#.#.#.###.#',
      '#o..#...#.#...#..o#',
      '###.#.#.#.#.#.#.###',
      '#...#.#.....#.#...#',
      '#.###.###.###.###.#',
      '#.................#',
      '#........P........#',
      '###################'
    ]
  ];
  var MAZE_NAMES = ["originale", "laguna", "forno", "rialto", "tole", "spiga", "canale"];
  var mazeIdx = 0;
  var MAP = MAZES[0];
  var ROWS = MAP.length, COLS = MAP[0].length;
  var HS_KEY = '6342-pizzaman-hiscore';

  var DIRS = {
    left:  { dx: -1, dy: 0, ang: Math.PI },
    right: { dx: 1, dy: 0, ang: 0 },
    up:    { dx: 0, dy: -1, ang: -Math.PI / 2 },
    down:  { dx: 0, dy: 1, ang: Math.PI / 2 }
  };
  var DIR_ORDER = ['up', 'left', 'down', 'right'];
  var OPP = { left: 'right', right: 'left', up: 'down', down: 'up' };

  var CHEF_COLORS = [
    { body: '#c4452a', apron: '#8f2414', name: 'rosso' },
    { body: '#d48a3a', apron: '#9a5a18', name: 'ambra' },
    { body: '#3a8f8a', apron: '#1f5c58', name: 'laguna' },
    { body: '#6b8f3a', apron: '#3d5c1c', name: 'basilico' }
  ];
  var SCATTER = [
    { x: COLS - 2, y: 1 },
    { x: 1, y: 1 },
    { x: COLS - 2, y: ROWS - 2 },
    { x: 1, y: ROWS - 2 }
  ];

  var canvas = document.getElementById('g-canvas');
  var overlay = document.getElementById('g-overlay');
  var titleCard = document.getElementById('g-title-card');
  var msgCard = document.getElementById('g-msg-card');
  var msgEl = document.getElementById('g-msg');
  var msgBtn = document.getElementById('btn-msg');
  var btnPlay = document.getElementById('btn-play');
  var btnPause = document.getElementById('btn-pause');
  var btnMute = document.getElementById('btn-mute');
  var elScore = document.getElementById('sc-score');
  var elHi = document.getElementById('sc-hi');
  var elLv = document.getElementById('sc-lv');
  var elLives = document.getElementById('sc-lives');
  var pad = document.getElementById('g-pad');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var state = 'title';
  var score = 0, hi = 0, lives = 3, level = 1, combo = 0;
  var pelletsLeft = 0, pelletTotal = 0;
  var grid, pizza, chefs, cell = 24, dpr = 1;
  var mouth = 0, tWorld = 0, modeT = 0, frightT = 0;
  var chaseMode = false;
  var want = 'left';
  var lastTs = 0, raf = 0;
  var ac = null, muted = false, eatFlip = false;
  var flash = 0, popups = [];
  var door = { x: 9, y: 9 };
  var house = { x: 9, y: 10 };
  var startP = { x: 9, y: 19 };
  var startC = [
    { x: 9, y: 8, dir: 'left', delay: 0 },
    { x: 9, y: 10, dir: 'up', delay: 0.8 },
    { x: 8, y: 10, dir: 'up', delay: 2.4 },
    { x: 10, y: 10, dir: 'up', delay: 4.2 }
  ];

  try { hi = parseInt(localStorage.getItem(HS_KEY) || '0', 10) || 0; } catch (e) { hi = 0; }
  if (elHi) elHi.textContent = String(hi);

  function tile(x, y) {
    var c = ((Math.round(x) % COLS) + COLS) % COLS;
    var r = Math.round(y);
    if (r < 0 || r >= ROWS) return '#';
    return grid[r][c];
  }
  function inHouse(c, r) {
    return r >= 9 && r <= 10 && c >= 8 && c <= 10;
  }
  function passable(c, r, who) {
    if (r < 0 || r >= ROWS) return false;
    var tunnel = (MAP[r][0] === ' ' || MAP[r][COLS - 1] === ' ');
    if (c < 0 || c >= COLS) return tunnel;
    var ch = grid[r][c];
    if (ch === '#') return false;
    if (who !== 'chefIn') {
      /* pizza e chef fuori: porta e recinto sono muri */
      if (ch === '-' || ch === 'G' || inHouse(c, r)) return false;
    }
    return true;
  }
  function wrapC(c) {
    return ((c % COLS) + COLS) % COLS;
  }
  function dist2(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function pickMaze(lv) {
    if (lv <= 1) mazeIdx = 0;
    else {
      var n = mazeIdx;
      while (n === mazeIdx) n = Math.floor(Math.random() * MAZES.length);
      mazeIdx = n;
    }
    MAP = MAZES[mazeIdx];
  }

  function parseGrid() {
    grid = MAP.map(function (row) { return row.split(''); });
    pelletsLeft = 0;
    var r, c, ch;
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        ch = grid[r][c];
        if (ch === 'P' || ch === 'G') grid[r][c] = ' ';
        if (ch === '.' || ch === 'o') pelletsLeft++;
      }
    }
    pelletTotal = pelletsLeft;
  }

  function makePizza() {
    return { x: startP.x, y: startP.y, dir: 'left', dx: -1, dy: 0, moving: true };
  }
  function makeChefs() {
    return startC.map(function (s, i) {
      return {
        x: s.x, y: s.y, dir: s.dir, dx: DIRS[s.dir].dx, dy: DIRS[s.dir].dy,
        color: CHEF_COLORS[i], scatter: SCATTER[i],
        kind: i, state: 'house', delay: Math.max(0, s.delay - (level - 1) * 0.35),
        flash: 0
      };
    });
  }

  function pizzaSpeed() { return Math.min(8.4, 6.15 + (level - 1) * 0.28); }
  function chefSpeed(ch) {
    if (ch.state === 'eyes') return 11;
    if (ch.state === 'fright') return 3.15;
    return Math.min(7.6, 5.25 + (level - 1) * 0.22);
  }
  function frightDur() { return Math.max(2.2, 7.2 - (level - 1) * 0.65); }

  function resetActors(keepScore) {
    pizza = makePizza();
    chefs = makeChefs();
    want = 'left';
    mouth = 0;
    modeT = 0;
    chaseMode = false;
    frightT = 0;
    combo = 0;
    if (!keepScore) popups = [];
  }

  function hud() {
    if (elScore) elScore.textContent = String(score);
    if (elHi) elHi.textContent = String(hi);
    if (elLv) elLv.textContent = String(level);
    if (elLives) {
      elLives.innerHTML = '';
      var i, d;
      for (i = 0; i < lives; i++) {
        d = document.createElement('i');
        d.setAttribute('aria-hidden', 'true');
        elLives.appendChild(d);
      }
    }
    if (btnPause) btnPause.textContent = state === 'pause' ? T.resume : T.pause;
  }

  function saveHi() {
    if (score > hi) {
      hi = score;
      try { localStorage.setItem(HS_KEY, String(hi)); } catch (e) {}
    }
    hud();
  }

  /* ---- audio ---- */
  function ensureAudio() {
    if (ac || muted) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    if (ac.state === 'suspended' && ac.resume) ac.resume();
  }
  function beep(freq, dur, type, vol, slide) {
    if (muted || !ac) return;
    try {
      var o = ac.createOscillator();
      var g = ac.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, ac.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, ac.currentTime + dur);
      g.gain.setValueAtTime((vol || 0.05), ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + dur);
    } catch (e) {}
  }
  function sfx(kind) {
    if (kind === 'eat') {
      eatFlip = !eatFlip;
      beep(eatFlip ? 520 : 420, 0.045, 'square', 0.035);
    } else if (kind === 'power') {
      beep(180, 0.18, 'triangle', 0.08, 420);
    } else if (kind === 'chef') {
      beep(420, 0.22, 'square', 0.07, 880);
    } else if (kind === 'die') {
      beep(360, 0.55, 'sawtooth', 0.07, 90);
    } else if (kind === 'start') {
      beep(392, 0.12, 'triangle', 0.06);
      setTimeout(function () { beep(523, 0.12, 'triangle', 0.06); }, 110);
      setTimeout(function () { beep(659, 0.18, 'triangle', 0.06); }, 220);
    } else if (kind === 'win') {
      beep(523, 0.12, 'triangle', 0.06, 784);
    } else if (kind === 'extra') {
      beep(660, 0.25, 'triangle', 0.07, 990);
    }
  }

  /* ---- movement ---- */
  function nearCenter(e, eps) {
    return Math.abs(e.x - Math.round(e.x)) < (eps || 0.08) &&
           Math.abs(e.y - Math.round(e.y)) < (eps || 0.08);
  }
  function snap(e) {
    e.x = Math.round(e.x);
    e.y = Math.round(e.y);
    if (e.x < -0.5) e.x += COLS;
    if (e.x >= COLS - 0.5 && e.x < COLS + 1.5 && e.dx > 0) { /* wrap later */ }
    if (e.x < 0) e.x += COLS;
    if (e.x >= COLS) e.x -= COLS;
  }
  function canGo(e, dir, who) {
    if (who === 'chef') who = (e.state === 'leave' || e.state === 'eyes' || e.state === 'house') ? 'chefIn' : 'chefOut';
    var d = DIRS[dir];
    var c = Math.round(e.x) + d.dx;
    var r = Math.round(e.y) + d.dy;
    if (c < 0 || c >= COLS) {
      var rr = Math.round(e.y);
      return rr >= 0 && rr < ROWS && (MAP[rr][0] === ' ' || MAP[rr][COLS - 1] === ' ');
    }
    return passable(c, r, who);
  }
  function setDir(e, dir) {
    var d = DIRS[dir];
    e.dir = dir; e.dx = d.dx; e.dy = d.dy;
  }
  /* v6e: movimento a caselle. Si gira solo al centro esatto di una casella,
     mai dentro un muro; il tunnel avvolge in [-0.5, COLS-0.5). */
  function wrapX(e) {
    if (e.x < -0.5) e.x += COLS;
    else if (e.x >= COLS - 0.5) e.x -= COLS;
  }
  function advance(e, speed, dt, who) {
    /* blocca l'asse perpendicolare al moto */
    if (e.dx !== 0) e.y = Math.round(e.y);
    else if (e.dy !== 0) e.x = Math.round(e.x);
    /* inversione: sempre permessa, resta sullo stesso asse */
    if (who === 'pizza' && want && want === OPP[e.dir]) { setDir(e, want); e.moving = true; }
    var remain = speed * dt, guard = 0;
    while (remain > 1e-6 && guard++ < 12) {
      var cx = Math.round(e.x), cy = Math.round(e.y);
      var at = Math.abs(e.x - cx) < 1e-3 && Math.abs(e.y - cy) < 1e-3;
      if (at) {
        e.x = cx; e.y = cy;
        if (who === 'pizza') {
          e.safeX = cx; e.safeY = cy;
          if (want && canGo(e, want, who)) setDir(e, want);
          if (!canGo(e, e.dir, who)) { e.moving = false; return; }
        } else {
          if (chefAtCenter(e, cx, cy)) return;
          pickChefDir(e, !canGo(e, e.dir, 'chef'));
          if (!canGo(e, e.dir, 'chef')) return;
        }
      }
      var horiz = e.dx !== 0;
      var pos = horiz ? e.x : e.y, d = horiz ? e.dx : e.dy;
      if (!d) return;
      var next = at ? pos + d : (d > 0 ? Math.ceil(pos) : Math.floor(pos));
      var move = Math.min(remain, Math.abs(next - pos));
      pos += d * move;
      remain -= move;
      if (horiz) e.x = pos; else e.y = pos;
      if (Math.abs(pos - next) < 1e-6) { if (horiz) e.x = next; else e.y = next; }
      wrapX(e);
    }
    if (who === 'pizza') {
      e.moving = true;
      /* rete di sicurezza: la pizza non deve mai stare su un muro */
      if (!passable(wrapC(Math.round(e.x)), Math.round(e.y), 'pizza') && e.safeX !== undefined) {
        e.x = e.safeX; e.y = e.safeY; e.moving = false;
      }
    }
  }

  /* chef al centro di una casella: uscita dal recinto e rientro degli occhi */
  function chefAtCenter(g, cx, cy) {
    if (g.state === 'leave' && cx === door.x && cy === door.y - 1) {
      g.state = frightT > 0 ? 'fright' : 'out';
      g.leaveT = 0;
      setDir(g, 'up');
      return false;
    }
    if (g.state === 'eyes' && cx === house.x && cy === house.y) {
      g.state = 'house';
      g.delay = 0.6;
      g.hx = house.x;
      g.eyesT = 0;
      return true;
    }
    return false;
  }

  function intersections(e) {
    var n = 0, k;
    for (k = 0; k < DIR_ORDER.length; k++) {
      if (DIR_ORDER[k] === OPP[e.dir]) continue;
      if (canGo(e, DIR_ORDER[k], 'chef')) n++;
    }
    return n;
  }

  function targetOf(ch) {
    if (ch.state === 'eyes') return { x: house.x, y: house.y };
    if (ch.state === 'leave') return { x: door.x, y: door.y - 1 };
    if (ch.state === 'fright') return null;
    if (!chaseMode) return ch.scatter;
    var px = pizza.x, py = pizza.y, pdx = pizza.dx, pdy = pizza.dy;
    if (ch.kind === 0) return { x: px, y: py };
    if (ch.kind === 1) return { x: px + pdx * 4, y: py + pdy * 4 };
    if (ch.kind === 2) {
      var ax = px + pdx * 2, ay = py + pdy * 2;
      var rx = chefs[0].x, ry = chefs[0].y;
      return { x: ax + (ax - rx), y: ay + (ay - ry) };
    }
    var d = Math.abs(px - ch.x) + Math.abs(py - ch.y);
    if (d < 8) return ch.scatter;
    return { x: px, y: py };
  }

  function pickChefDir(ch, force) {
    if (!nearCenter(ch, 0.12) && !force) return;
    if (ch.state === 'house') {
      if (canGo(ch, 'up', 'chef')) setDir(ch, 'up');
      return;
    }
    var opts = [];
    var i, dir, d;
    for (i = 0; i < DIR_ORDER.length; i++) {
      dir = DIR_ORDER[i];
      if (dir === OPP[ch.dir]) continue; /* v6e: mai indietro, salvo vicolo cieco */
      if (canGo(ch, dir, 'chef')) opts.push(dir);
    }
    if (!opts.length) {
      if (canGo(ch, OPP[ch.dir], 'chef')) setDir(ch, OPP[ch.dir]);
      return;
    }
    if (ch.state === 'fright') {
      setDir(ch, opts[Math.floor(Math.random() * opts.length)]);
      return;
    }
    if (!force && intersections(ch) <= 1 && canGo(ch, ch.dir, 'chef') && opts.indexOf(ch.dir) >= 0) {
      return;
    }
    var tgt = targetOf(ch);
    if (!tgt) {
      setDir(ch, opts[0]);
      return;
    }
    var best = opts[0], bestD = 1e9;
    for (i = 0; i < opts.length; i++) {
      d = DIRS[opts[i]];
      var nx = Math.round(ch.x) + d.dx, ny = Math.round(ch.y) + d.dy;
      var dd = (nx - tgt.x) * (nx - tgt.x) + (ny - tgt.y) * (ny - tgt.y);
      if (dd < bestD) { bestD = dd; best = opts[i]; }
    }
    setDir(ch, best);
  }

  function eatAtPizza() {
    var c = Math.round(pizza.x), r = Math.round(pizza.y);
    if (r < 0 || r >= ROWS) return;
    c = wrapC(c);
    var ch = grid[r][c];
    if (ch === '.' || ch === 'o') {
      grid[r][c] = ' ';
      pelletsLeft--;
      if (ch === '.') {
        addScore(10);
        sfx('eat');
      } else {
        addScore(50);
        sfx('power');
        frightT = frightDur();
        combo = 0;
        chefs.forEach(function (g) {
          if (g.state === 'eyes' || g.state === 'house' || g.state === 'leave') return;
          g.state = 'fright';
          setDir(g, OPP[g.dir] || g.dir);
        });
      }
      if (pelletsLeft <= 0) levelClear();
    }
  }

  var extraAt = 10000, extraGiven = false;
  function addScore(n) {
    score += n;
    if (!extraGiven && score >= extraAt) {
      extraGiven = true;
      lives++;
      sfx('extra');
    }
    saveHi();
    hud();
  }

  function collide() {
    var i, g, d;
    for (i = 0; i < chefs.length; i++) {
      g = chefs[i];
      if (g.state === 'eyes' || g.state === 'house' || g.state === 'leave') continue;
      var ddx = Math.abs(pizza.x - g.x); if (ddx > COLS / 2) ddx = COLS - ddx;
      var ddy = pizza.y - g.y;
      d = ddx * ddx + ddy * ddy;
      if (d < 0.42) {
        if (g.state === 'fright') {
          combo++;
          var pts = 200 * Math.pow(2, combo - 1);
          addScore(pts);
          popups.push({ x: g.x, y: g.y, t: 0.8, text: String(pts) });
          g.state = 'eyes';
          g.eyesT = 0;
          g.x = Math.round(g.x); g.y = Math.round(g.y); wrapX(g);
          sfx('chef');
        } else {
          die();
          return;
        }
      }
    }
  }

  function die() {
    state = 'dead';
    sfx('die');
    flash = 0.9;
    lives--;
    hud();
    setTimeout(function () {
      if (lives <= 0) {
        lives = 0;
        hud();
        gameOver();
      } else {
        resetActors(true);
        ready();
      }
    }, 900);
  }

  function levelClear() {
    state = 'win';
    sfx('win');
    flash = 0.8;
    setTimeout(function () {
      level++;
      pickMaze(level);
      parseGrid();
      resetActors(true);
      extraGiven = extraGiven; /* keep */
      hud();
      ready();
    }, 900);
  }

  function gameOver() {
    state = 'over';
    saveHi();
    document.body.classList.remove('is-playing');
    showMsg(T.over, T.again, function () { newGame(); });
  }

  function ready() {
    state = 'ready';
    hud();
    showMsg(level > 1 ? T.level + ' ' + level + '!' : T.ready, null, null);
    setTimeout(function () {
      if (state !== 'ready') return;
      hideOverlay();
      state = 'play';
      document.body.classList.add('is-playing');
    }, 1600);
  }

  function newGame() {
    ensureAudio();
    sfx('start');
    score = 0; lives = 3; level = 1; extraGiven = false;
    pickMaze(1);
    parseGrid();
    resetActors(false);
    hud();
    hideOverlay();
    document.body.classList.add('is-playing');
    ready();
    if (!raf) { lastTs = 0; raf = requestAnimationFrame(loop); }
  }

  function togglePause() {
    if (state === 'play') {
      state = 'pause';
      document.body.classList.remove('is-playing');
      showMsg(T.pause, T.resume, function () { togglePause(); });
      hud();
    } else if (state === 'pause') {
      hideOverlay();
      state = 'play';
      document.body.classList.add('is-playing');
      hud();
    }
  }

  function showMsg(text, btn, fn) {
    if (titleCard) titleCard.hidden = true;
    if (msgCard) msgCard.hidden = false;
    if (msgEl) msgEl.textContent = text;
    if (msgBtn) {
      if (btn) {
        msgBtn.hidden = false;
        msgBtn.textContent = btn;
        msgBtn.onclick = fn || null;
      } else {
        msgBtn.hidden = true;
        msgBtn.onclick = null;
      }
    }
    overlay.hidden = false;
  }
  function hideOverlay() {
    overlay.hidden = true;
    if (titleCard) titleCard.hidden = true;
    if (msgCard) msgCard.hidden = true;
  }

  /* ---- update / modes ---- */
  var WAVE = [7, 20, 7, 20, 5, 20, 5, 1e9];
  function updateModes(dt) {
    if (frightT > 0) {
      frightT -= dt;
      if (frightT <= 0) {
        frightT = 0;
        chefs.forEach(function (g) {
          if (g.state === 'fright') {
            g.state = 'out';
            setDir(g, OPP[g.dir] || g.dir);
          }
        });
      }
      return;
    }
    modeT += dt;
    var acc = 0, i, nextChase;
    for (i = 0; i < WAVE.length; i++) {
      acc += WAVE[i];
      if (modeT < acc) {
        nextChase = (i % 2) === 1;
        if (nextChase !== chaseMode) {
          chaseMode = nextChase;
          chefs.forEach(function (g) {
            if (g.state === 'out') setDir(g, OPP[g.dir] || g.dir);
          });
        }
        return;
      }
    }
  }

  function updateChefs(dt) {
    chefs.forEach(function (g) {
      if (g.hx === undefined) g.hx = startC[g.kind].x;
      if (g.state === 'house') {
        g.delay -= dt;
        /* dondola nel recinto */
        g.y = house.y + Math.sin(tWorld * 3 + g.kind) * 0.12;
        g.x = g.hx;
        if (g.delay <= 0 && dt > 0) {
          g.state = 'leave';
          g.leaveT = 0;
          g.x = g.hx;
          g.y = house.y;
          /* verso la porta: prima al centro, poi su */
          if (g.x < door.x) setDir(g, 'right');
          else if (g.x > door.x) setDir(g, 'left');
          else setDir(g, 'up');
        }
        return;
      }
      if (g.state === 'leave') {
        g.leaveT = (g.leaveT || 0) + dt;
        if (g.leaveT > 5) { /* rete di sicurezza */
          g.x = door.x; g.y = door.y - 1; chefAtCenter(g, g.x, g.y);
          return;
        }
      }
      if (g.state === 'eyes') {
        g.eyesT = (g.eyesT || 0) + dt;
        if (g.eyesT > 12) { /* rete di sicurezza */
          g.x = house.x; g.y = house.y; chefAtCenter(g, house.x, house.y);
          return;
        }
      }
      advance(g, chefSpeed(g), dt, 'chef');
    });
  }

  function update(dt) {
    tWorld += dt;
    popups = popups.filter(function (p) { p.t -= dt; return p.t > 0; });
    if (flash > 0) flash -= dt;
    if (state === 'play') {
      updateModes(dt);
      advance(pizza, pizzaSpeed(), dt, 'pizza');
      if (pizza.moving) mouth += dt * 10;
      eatAtPizza();
      updateChefs(dt);
      collide();
    } else if (state === 'ready' || state === 'pause' || state === 'dead' || state === 'win') {
      if (state === 'ready') updateChefs(0); /* keep drawn */
      mouth += dt * 4;
    } else {
      mouth += dt * 3;
    }
  }

  /* ---- draw ---- */
  function resize() {
    var stage = canvas.parentElement;
    var availW = stage.clientWidth || 320;
    var availH = stage.clientHeight || 320;
    cell = Math.max(10, Math.floor(Math.min(availW / COLS, availH / ROWS) * 100) / 100);
    dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    var w = Math.round(COLS * cell);
    var h = Math.round(ROWS * cell);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function isWall(c, r) {
    if (r < 0 || r >= ROWS) return true;
    if (c < 0 || c >= COLS) {
      return !(MAP[r][0] === ' ' || MAP[r][COLS - 1] === ' ');
    }
    return MAP[r][c] === '#';
  }

  function drawMaze() {
    var w = COLS * cell, h = ROWS * cell;
    ctx.fillStyle = '#100e0c';
    ctx.fillRect(0, 0, w, h);
    var r, c, x, y, s = cell;
    /* path floor */
    ctx.fillStyle = '#1a1511';
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        if (!isWall(c, r)) {
          ctx.fillRect(c * s, r * s, s, s);
        }
      }
    }
    /* gold outlines */
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = Math.max(1.6, s * 0.1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        if (!isWall(c, r)) continue;
        x = c * s; y = r * s;
        if (!isWall(c, r - 1)) { ctx.moveTo(x + 1, y + 1); ctx.lineTo(x + s - 1, y + 1); }
        if (!isWall(c, r + 1)) { ctx.moveTo(x + 1, y + s - 1); ctx.lineTo(x + s - 1, y + s - 1); }
        if (!isWall(c - 1, r)) { ctx.moveTo(x + 1, y + 1); ctx.lineTo(x + 1, y + s - 1); }
        if (!isWall(c + 1, r)) { ctx.moveTo(x + s - 1, y + 1); ctx.lineTo(x + s - 1, y + s - 1); }
      }
    }
    ctx.stroke();
    /* door */
    ctx.strokeStyle = '#e6cd86';
    ctx.lineWidth = Math.max(1.4, s * 0.08);
    ctx.beginPath();
    ctx.moveTo((door.x - 0.45) * s, (door.y + 0.15) * s);
    ctx.lineTo((door.x + 1.45) * s, (door.y + 0.15) * s);
    ctx.stroke();
    /* brand */
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#e6cd86';
    ctx.font = 'italic ' + Math.round(s * 0.7) + 'px "F6342 Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('6342', (COLS / 2) * s, (house.y + 1.15) * s);
    ctx.restore();
  }

  function drawGrain(c, r, power) {
    var s = cell;
    var x = (c + 0.5) * s, y = (r + 0.5) * s;
    ctx.save();
    ctx.translate(x, y);
    if (power) {
      var pulse = 1 + 0.12 * Math.sin(tWorld * 6);
      ctx.scale(pulse, pulse);
      drawSpiga(s * 0.42);
    } else {
      ctx.rotate(-0.5);
      var gx = s * 0.13, gy = s * 0.09;
      ctx.fillStyle = '#e6cd86';
      ctx.beginPath();
      ctx.ellipse(0, 0, gx, gy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,50,16,.45)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-gx * 0.6, 0);
      ctx.lineTo(gx * 0.7, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpiga(sz) {
    var i, a, ox, oy;
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = Math.max(1, sz * 0.12);
    ctx.beginPath();
    ctx.moveTo(0, sz * 0.7);
    ctx.lineTo(0, -sz * 0.55);
    ctx.stroke();
    ctx.fillStyle = '#e8c45a';
    for (i = 0; i < 5; i++) {
      oy = -sz * 0.5 + i * sz * 0.2;
      a = (i % 2 ? 1 : -1);
      ox = a * sz * 0.22;
      ctx.beginPath();
      ctx.ellipse(ox, oy, sz * 0.16, sz * 0.1, a * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, oy - sz * 0.02, sz * 0.14, sz * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.62, sz * 0.12, sz * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPizzaAt(px, py, dir, bite, scale) {
    var s = cell * (scale || 1);
    var R = s * 0.46;
    var ang = (DIRS[dir] || DIRS.left).ang;
    var open = 0.12 + 0.55 * Math.abs(Math.sin(bite));
    if (state === 'dead') {
      open = Math.min(Math.PI - 0.05, 0.3 + (0.9 - Math.max(0, flash)) * 3);
    }
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, open, Math.PI * 2 - open, false);
    ctx.closePath();
    ctx.fillStyle = '#e8c070';
    ctx.fill();
    ctx.lineWidth = Math.max(1.4, R * 0.16);
    ctx.strokeStyle = '#c48a38';
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.78, 0, Math.PI * 2);
    ctx.fillStyle = '#c43c28';
    ctx.fill();
    var i, spots = [
      [-0.22, -0.18, 0.14], [0.18, -0.12, 0.12], [0.02, 0.22, 0.13],
      [-0.2, 0.16, 0.1], [0.22, 0.14, 0.09]
    ];
    ctx.fillStyle = '#f3efe2';
    for (i = 0; i < spots.length; i++) {
      ctx.beginPath();
      ctx.ellipse(spots[i][0] * R, spots[i][1] * R, spots[i][2] * R, spots[i][2] * R * 0.8, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#a3261a';
    ctx.beginPath(); ctx.arc(-0.08 * R, -0.28 * R, R * 0.11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0.2 * R, 0.06 * R, R * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a6b2a';
    ctx.beginPath();
    ctx.ellipse(0.08 * R, 0.28 * R, R * 0.1, R * 0.05, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function drawChefAt(g) {
    var s = cell;
    var px = (g.x + 0.5) * s, py = (g.y + 0.5) * s;
    var R = s * 0.48;
    var fright = g.state === 'fright';
    var eyes = g.state === 'eyes';
    var blink = fright && frightT < 2 && Math.floor(tWorld * 8) % 2 === 0;
    ctx.save();
    ctx.translate(px, py);
    if (!eyes) {
      var body = fright ? (blink ? '#f4ecdc' : '#3d6a96') : g.color.body;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, -R * 0.05, R * 0.72, Math.PI, 0);
      ctx.lineTo(R * 0.72, R * 0.7);
      var w = 4, i, ww = (R * 1.44) / w;
      for (i = w; i >= 0; i--) {
        var xx = R * 0.72 - i * ww;
        var yy = R * 0.7 + ((i % 2 === 0) ? R * 0.16 : -R * 0.06);
        ctx.lineTo(xx, yy);
      }
      ctx.closePath();
      ctx.fill();
      if (!fright) {
        ctx.fillStyle = g.color.apron;
        ctx.beginPath();
        ctx.moveTo(-R * 0.4, R * 0.05);
        ctx.lineTo(R * 0.4, R * 0.05);
        ctx.lineTo(R * 0.32, R * 0.62);
        ctx.lineTo(-R * 0.32, R * 0.62);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, R * 0.1);
        ctx.lineTo(0, R * 0.58);
        ctx.stroke();
      }
      /* toque */
      ctx.fillStyle = '#f6f3ea';
      ctx.strokeStyle = 'rgba(20,16,10,.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-R * 0.42, -R * 1.22, R * 0.84, R * 0.38, R * 0.12) :
        (ctx.rect(-R * 0.42, -R * 1.22, R * 0.84, R * 0.38));
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -R * 1.28, R * 0.46, R * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#efe8d6';
      ctx.fillRect(-R * 0.46, -R * 0.92, R * 0.92, R * 0.16);
      /* face */
      ctx.fillStyle = fright ? (blink ? '#3d6a96' : '#d8e6f0') : '#f0c9a8';
      ctx.beginPath();
      ctx.ellipse(0, -R * 0.18, R * 0.42, R * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    /* eyes */
    var lookX = (g.dx || 0) * R * 0.1;
    var lookY = (g.dy || 0) * R * 0.1;
    var ew = eyes ? R * 0.16 : R * 0.14;
    var eh = eyes ? R * 0.2 : R * 0.18;
    function eye(ox) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(ox + (eyes ? lookX * 0.5 : 0), -R * 0.22, ew, eh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fright && !eyes ? '#1c3a68' : '#1a120c';
      ctx.beginPath();
      ctx.arc(ox + lookX, -R * 0.22 + lookY, R * (eyes ? 0.07 : 0.07), 0, Math.PI * 2);
      ctx.fill();
    }
    eye(-R * 0.18);
    eye(R * 0.18);
    if (!eyes) {
      if (fright) {
        ctx.strokeStyle = blink ? '#c43c28' : '#1c3a68';
        ctx.lineWidth = Math.max(1.2, R * 0.08);
        ctx.beginPath();
        ctx.moveTo(-R * 0.2, R * 0.12);
        ctx.quadraticCurveTo(-R * 0.1, R * 0.02, 0, R * 0.12);
        ctx.quadraticCurveTo(R * 0.1, R * 0.22, R * 0.2, R * 0.12);
        ctx.stroke();
      } else {
        /* angry brows */
        ctx.strokeStyle = '#2a1a12';
        ctx.lineWidth = Math.max(1.3, R * 0.1);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-R * 0.34, -R * 0.42);
        ctx.lineTo(-R * 0.06, -R * 0.32);
        ctx.moveTo(R * 0.34, -R * 0.42);
        ctx.lineTo(R * 0.06, -R * 0.32);
        ctx.stroke();
        /* mouth grimace */
        ctx.beginPath();
        ctx.moveTo(-R * 0.14, R * 0.08);
        ctx.lineTo(R * 0.14, R * 0.08);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawEntityWrapped(drawFn, x, y) {
    drawFn((x + 0.5) * cell, (y + 0.5) * cell);
    if (x < 0.6) drawFn((x + COLS + 0.5) * cell, (y + 0.5) * cell);
    if (x > COLS - 1.6) drawFn((x - COLS + 0.5) * cell, (y + 0.5) * cell);
  }

  function draw() {
    if (!grid) return;
    drawMaze();
    var r, c, ch;
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        ch = grid[r][c];
        if (ch === '.' || ch === 'o') drawGrain(c, r, ch === 'o');
      }
    }
    chefs.forEach(function (g) {
      drawEntityWrapped(function (px, py) {
        var copy = g;
        /* drawChefAt uses g.x/g.y; temporarily? use translate already inside. */
        var ox = g.x, oy = g.y;
        g.x = px / cell - 0.5;
        g.y = py / cell - 0.5;
        drawChefAt(g);
        g.x = ox; g.y = oy;
      }, g.x, g.y);
    });
    if (state !== 'over') {
      var bite = (pizza.moving || state === 'title' || state === 'ready') ? mouth : 0.15;
      drawEntityWrapped(function (px, py) {
        drawPizzaAt(px, py, pizza.dir, bite, 1);
      }, pizza.x, pizza.y);
    }
    popups.forEach(function (p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.t / 0.8);
      ctx.fillStyle = '#e6cd86';
      ctx.font = '600 ' + Math.round(cell * 0.55) + 'px ' + 'ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, (p.x + 0.5) * cell, (p.y + 0.2 - (0.8 - p.t)) * cell);
      ctx.restore();
    });
    if (flash > 0 && (state === 'dead' || state === 'win')) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.35, flash);
      ctx.fillStyle = state === 'win' ? '#e6cd86' : '#000';
      ctx.fillRect(0, 0, COLS * cell, ROWS * cell);
      ctx.restore();
    }
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0;
    lastTs = ts;
    update(dt);
    draw();
  }

  /* ---- input ---- */
  function wish(dir) {
    if (!DIRS[dir]) return;
    want = dir; /* v6e: la svolta avviene solo al centro della prossima casella */
  }

  var keys = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    a: 'left', d: 'right', w: 'up', s: 'down',
    A: 'left', D: 'right', W: 'up', S: 'down'
  };
  window.addEventListener('keydown', function (e) {
    var dir = keys[e.key];
    if (dir) {
      e.preventDefault();
      wish(dir);
      return;
    }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      e.preventDefault();
      if (state === 'play' || state === 'pause') togglePause();
    }
    if (e.key === ' ' || e.key === 'Enter') {
      if (state === 'title') { e.preventDefault(); newGame(); }
      else if (state === 'over') { e.preventDefault(); newGame(); }
      else if (state === 'pause') { e.preventDefault(); togglePause(); }
      else e.preventDefault();
    }
    if (e.key === 'm' || e.key === 'M') { e.preventDefault(); toggleMute(); }
  }, { passive: false });

  var swipeX = 0, swipeY = 0, swiping = false;
  function onStart(ev) {
    var t = ev.touches ? ev.touches[0] : ev;
    swipeX = t.clientX; swipeY = t.clientY; swiping = true;
  }
  function onEnd(ev) {
    if (!swiping) return;
    swiping = false;
    var t = (ev.changedTouches && ev.changedTouches[0]) || ev;
    var dx = t.clientX - swipeX, dy = t.clientY - swipeY;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) wish(dx > 0 ? 'right' : 'left');
    else wish(dy > 0 ? 'down' : 'up');
  }
  canvas.addEventListener('touchstart', onStart, { passive: true });
  canvas.addEventListener('touchend', onEnd, { passive: true });
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, { passive: false });

  if (pad) {
    pad.querySelectorAll('[data-dir]').forEach(function (btn) {
      var hold = null;
      function press(ev) {
        ev.preventDefault();
        wish(btn.getAttribute('data-dir'));
        btn.classList.add('is-hold');
      }
      function rel() { btn.classList.remove('is-hold'); }
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', rel);
      btn.addEventListener('pointerleave', rel);
      btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
  }

  function toggleMute() {
    muted = !muted;
    if (btnMute) {
      btnMute.setAttribute('aria-pressed', muted ? 'true' : 'false');
      btnMute.textContent = muted ? '♪×' : '♪';
    }
    if (!muted) ensureAudio();
  }

  if (btnPlay) btnPlay.addEventListener('click', function () { newGame(); });
  if (btnPause) btnPause.addEventListener('click', function () {
    if (state === 'title') return;
    if (state === 'over') { newGame(); return; }
    togglePause();
  });
  if (btnMute) btnMute.addEventListener('click', toggleMute);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state === 'play') togglePause();
  });
  window.addEventListener('resize', function () { resize(); draw(); });

  /* boot: draw a still title scene */
  parseGrid();
  resetActors(false);
  pizza.moving = true;
  hud();
  resize();
  /* place chefs already out so the title screen looks alive */
  chefs.forEach(function (g, i) {
    if (i === 0) { g.state = 'out'; }
  });
  lastTs = 0;
  raf = requestAnimationFrame(loop);

  window.__gioco = {
    start: function () { newGame(); },
    setDir: wish,
    isWall: function (c, r) { return !passable(wrapC(c), r, 'pizza'); },
    cols: COLS, rows: ROWS,
    getState: function () {
      return {
        mode: state,
        score: score,
        lives: lives,
        level: level,
        maze: MAZE_NAMES[mazeIdx],
        pelletsLeft: pelletsLeft,
        pelletsTotal: pelletTotal,
        pizza: pizza ? { x: pizza.x, y: pizza.y, dir: pizza.dir, dx: pizza.dx, dy: pizza.dy } : null,
        chefs: (chefs || []).map(function (g) {
          return { x: g.x, y: g.y, dir: g.dir, dx: g.dx, dy: g.dy, state: g.state };
        })
      };
    }
  };
})();
