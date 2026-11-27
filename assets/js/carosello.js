(function(){
  const root = document.querySelector('[data-carosello]');
  if (!root) return;
  const stage = root.querySelector('.carosello-stage');
  const dotsBox = root.querySelector('.carosello-dots');
  const countEl = root.querySelector('.carosello-count');
  const rm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (rm) root.classList.add('is-rm');
  const srcs = Array.from(document.querySelectorAll('.galleria a[data-full]')).map(a => {
    const im = a.querySelector('img');
    return {full: a.dataset.full, src: im.currentSrc || im.src, srcset: im.getAttribute('srcset') || '', alt: im.alt || ''};
  });
  if (!srcs.length) return;

  let i = 0, timer = null, locked = false, dragging = false, startX = 0;
  const HOLD = 5200;
  const FADE = 1150;

  function slideEl(item, cls){
    const d = document.createElement('div');
    d.className = 'carosello-slide' + (cls ? ' ' + cls : '');
    d.innerHTML = '<img alt=""><span class="velo" aria-hidden="true"></span>';
    const img = d.querySelector('img');
    img.alt = item.alt;
    if (item.srcset) img.srcset = item.srcset;
    img.sizes = '(max-width: 820px) 100vw, 70vw';
    img.src = item.full || item.src;
    img.decoding = 'async';
    img.draggable = false;
    return d;
  }

  srcs.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Foto ' + (n+1) + ' di ' + srcs.length);
    b.addEventListener('click', () => go(n, true));
    dotsBox.appendChild(b);
  });

  let current = slideEl(srcs[0], 'is-on');
  stage.appendChild(current);
  preload(1);

  function preload(n){
    const it = srcs[(n + srcs.length) % srcs.length];
    const im = new Image();
    if (it.srcset) im.srcset = it.srcset;
    im.src = it.full || it.src;
  }
  function markDots(){
    Array.from(dotsBox.children).forEach((b, n) => b.setAttribute('aria-current', n===i ? 'true' : 'false'));
    if (countEl) countEl.textContent = (i+1).toString().padStart(2,'0') + ' / ' + String(srcs.length).padStart(2,'0');
  }
  markDots();

  function go(n, byUser){
    n = (n + srcs.length) % srcs.length;
    if (n === i || locked) return;
    if (byUser) stop();
    locked = !rm;
    const prev = current;
    prev.classList.remove('is-on');
    prev.classList.add('is-leave');
    if (rm) {
      if (prev.parentNode) prev.remove();
      current = slideEl(srcs[n], 'is-on');
      stage.appendChild(current);
      i = n;
      markDots();
      preload(i+1);
      locked = false;
      return;
    }
    const next = slideEl(srcs[n], 'is-on');
    stage.appendChild(next);
    current = next;
    i = n;
    markDots();
    preload(i+1);
    setTimeout(() => { if (prev.parentNode) prev.remove(); locked = false; if (!byUser) arm(); }, FADE + 40);
  }

  function arm(){
    stop();
    if (rm) return;
    timer = setTimeout(() => go(i+1, false), HOLD);
  }
  function stop(){ if (timer){ clearTimeout(timer); timer = null; } }

  root.querySelector('.carosello-prev').addEventListener('click', () => go(i-1, true));
  root.querySelector('.carosello-next').addEventListener('click', () => go(i+1, true));

  stage.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; stop(); try{ stage.setPointerCapture(e.pointerId); }catch(_){} });
  stage.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? i+1 : i-1, true);
    else arm();
  });
  stage.addEventListener('pointercancel', () => { dragging = false; arm(); });

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i+1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i-1, true); }
  });
  root.tabIndex = 0;

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) arm(); else stop(); }), {threshold: 0.45});
    io.observe(root);
  } else arm();

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', arm);
})();
