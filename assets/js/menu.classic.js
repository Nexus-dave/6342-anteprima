(function () {
  'use strict';
  var root = document.getElementById('menu-root');
  if (!root) return;
  function current() {
    var id = (location.hash || '').replace('#', '');
    return id === 'pizza' ? 'pizza' : 'pasta';
  }
  function show(id) {
    document.documentElement.setAttribute('data-menu', id);
    root.setAttribute('data-menu', id);
    ['pasta', 'pizza'].forEach(function (k) {
      var tab = document.getElementById('tab-' + k);
      if (tab) tab.setAttribute('aria-current', k === id ? 'true' : 'false');
    });
  }
  function offsetTop(el) {
    var y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }
  function pinToolbar() {
    var bar = root.querySelector('.menu-toolbar');
    var header = document.querySelector('.mtop');
    if (!bar || !window.scrollTo) return;
    var top = header ? header.offsetHeight : 60;
    var y = offsetTop(bar) - top;
    window.scrollTo(0, y < 0 ? 0 : y);
  }
  window.addEventListener('hashchange', function () { show(current()); pinToolbar(); });
  show(current());
  if (location.hash === '#pasta' || location.hash === '#pizza') {
    pinToolbar();
    if (window.requestAnimationFrame) requestAnimationFrame(pinToolbar);
    window.addEventListener('load', pinToolbar);
    setTimeout(pinToolbar, 100);
    setTimeout(pinToolbar, 400);
  }
})();
