(function () {
  'use strict';

  var eligible = window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)');
  var started = false;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function start() {
    if (!eligible.matches || started) return;
    started = true;
    var base = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.3/lib/';
    loadScript(base + 'L2Dwidget.0.min.js')
      .then(function () { return loadScript(base + 'L2Dwidget.min.js'); })
      .then(function () {
        if (!eligible.matches || !window.L2Dwidget) return;
        window.L2Dwidget.on('create-container', function (cat) {
          cat.setAttribute('role', 'button');
          cat.setAttribute('tabindex', '0');
          cat.setAttribute('aria-label', 'Wake the cat');
          function react() {
            cat.classList.remove('cat-react');
            void cat.offsetWidth;
            cat.classList.add('cat-react');
          }
          cat.addEventListener('click', react);
          cat.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              react();
            }
          });
          cat.addEventListener('animationend', function () { cat.classList.remove('cat-react'); });
        });
        window.L2Dwidget.init({
          model: { jsonPath: 'https://cdn.jsdelivr.net/gh/evrstr/live2d-widget-models/live2d_evrstr/blackcat/model.json', scale: 1.3 },
          display: { superSample: 1, width: 220, height: 260, position: 'right', hOffset: 0, vOffset: 0 },
          mobile: { show: false },
          react: { opacity: 1 },
          dialog: { enable: false }
        });
      })
      .catch(function () { /* The decoration is optional when the CDN is unavailable. */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  if (eligible.addEventListener) eligible.addEventListener('change', start);
})();
