/* ==========================================================================
   AcessaMais — motor.js
   Feira Tecnológica 2026 — ETEC Guariba

   Roda de forma síncrona, ANTES do DOMContentLoaded, para que as classes de
   preferência já estejam no <html> quando script.js e libras.js checarem
   coisas como "reduzir gestos" (tilt dos cards, arraste do painel de Libras).
   Por isso este arquivo precisa ser carregado ANTES de script.js e libras.js.
   ========================================================================== */

(function () {
  var root = document.documentElement;
  var KEY = 'acessamais-motor-prefs';
  var FLAGS = ['targets', 'spacing', 'gestures', 'confirm', 'cursor', 'focus', 'time'];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  var prefs = load();
  FLAGS.forEach(function (f) {
    if (prefs[f]) root.classList.add('motor-' + f);
  });

  // Exposto para o restante do site checar sem duplicar a leitura do localStorage
  window.MotorAccess = {
    isOn: function (flag) { return root.classList.contains('motor-' + flag); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-motor]');
    var allBtn = document.getElementById('motorAllBtn');

    function syncButtons() {
      buttons.forEach(function (b) {
        b.classList.toggle('active', root.classList.contains('motor-' + b.dataset.motor));
        b.setAttribute('aria-pressed', root.classList.contains('motor-' + b.dataset.motor) ? 'true' : 'false');
      });
      if (allBtn) {
        var allOn = FLAGS.every(function (f) { return root.classList.contains('motor-' + f); });
        allBtn.classList.toggle('active', allOn);
        allBtn.textContent = allOn ? 'Todas as opções recomendadas estão ativas' : 'Ativar todas as opções recomendadas';
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var flag = btn.dataset.motor;
        root.classList.toggle('motor-' + flag);
        prefs[flag] = root.classList.contains('motor-' + flag);
        save(prefs);
        syncButtons();
      });
    });

    if (allBtn) {
      allBtn.addEventListener('click', function () {
        var allOn = FLAGS.every(function (f) { return root.classList.contains('motor-' + f); });
        FLAGS.forEach(function (f) {
          root.classList.toggle('motor-' + f, !allOn);
          prefs[f] = !allOn;
        });
        save(prefs);
        syncButtons();
      });
    }

    syncButtons();
  });
})();
