// ==========================================================================
// AcessaMais — script.js — compartilhado por todas as páginas
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.navlinks a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Painel de acessibilidade: abrir/fechar ---------- */
  const fab = document.getElementById('a11yFab');
  const panel = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yClose');
  if (fab && panel) {
    // Fundo escurecido (scrim): dá foco de modal ao painel, em vez de uma
    // caixa solta flutuando por cima do conteúdo.
    let scrim = document.getElementById('a11yScrim');
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.id = 'a11yScrim';
      scrim.className = 'a11y-scrim';
      document.body.appendChild(scrim);
    }

    function openA11yPanel() {
      panel.classList.add('open');
      scrim.classList.add('active');
      fab.setAttribute('aria-expanded', 'true');
      document.body.classList.add('modal-open');
      setTimeout(() => { const first = panel.querySelector('button, [href], input, select'); if (first) first.focus(); }, 30);
    }
    function closeA11yPanel() {
      panel.classList.remove('open');
      scrim.classList.remove('active');
      fab.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('modal-open');
      fab.focus();
    }

    fab.addEventListener('click', () => {
      if (panel.classList.contains('open')) closeA11yPanel(); else openA11yPanel();
    });
    scrim.addEventListener('click', closeA11yPanel);
    if (closeBtn) closeBtn.addEventListener('click', closeA11yPanel);
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeA11yPanel(); return; }
      if (e.key !== 'Tab') return;
      const focusables = panel.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Evita duas janelas de acessibilidade abertas ao mesmo tempo: se o
    // usuário abrir o widget oficial do governo (VLibras), fecha o nosso.
    document.addEventListener('click', (e) => {
      if (e.target.closest('[vw-access-button]') && panel.classList.contains('open')) {
        closeA11yPanel();
      }
    }, true);
  }

  const root = document.documentElement;

  /* ---------- Confirmação em duas etapas (usado pelo Modo de Acessibilidade Motora) ---------- */
  function withConfirm(btn, action) {
    let armed = false, timer;
    return function (e) {
      if (!root.classList.contains('motor-confirm')) { action(e); return; }
      if (!armed) {
        armed = true;
        btn.dataset.confirmOriginal = btn.dataset.confirmOriginal || btn.textContent;
        btn.textContent = 'Confirmar?';
        btn.classList.add('confirm-armed');
        timer = setTimeout(() => { armed = false; btn.textContent = btn.dataset.confirmOriginal; btn.classList.remove('confirm-armed'); }, 4000);
      } else {
        armed = false; clearTimeout(timer);
        btn.textContent = btn.dataset.confirmOriginal;
        btn.classList.remove('confirm-armed');
        action(e);
      }
    };
  }

  /* ---------- Toggles simples (alto contraste, dislexia, links, cliques, reduzir movimento) ---------- */
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      root.classList.toggle(btn.dataset.toggle);
      btn.classList.toggle('active');
    });
  });

  /* ---------- Modo epilepsia / fotossensibilidade ---------- */
  /* Aplica: sem animação/transição em nada, imagens dessaturadas e mais escuras,
     cores de acento neutralizadas, elementos puramente decorativos ocultos. */
  const epilepsyBtn = document.getElementById('epilepsyToggle');
  const epilepsyBanner = document.getElementById('epilepsyBannerText');
  if (epilepsyBtn) {
    epilepsyBtn.addEventListener('click', () => {
      const isActive = root.classList.toggle('epilepsy-safe');
      root.classList.toggle('epilepsy-active', isActive);
      epilepsyBtn.classList.toggle('active', isActive);
      if (isActive && epilepsyBanner) {
        epilepsyBanner.textContent = 'Modo epilepsia/fotossensibilidade ativo — animações, transições e cores fortes foram removidas de toda a página, inclusive das imagens.';
      }
      // Garante que nenhum modo de daltonismo fique competindo por cor ao mesmo tempo
      if (isActive) {
        window.speechSynthesis && null; // no-op, mantém isolado de outras rotinas
      }
    });
  }

  /* ---------- Paletas de daltonismo (7 tipos, mutuamente exclusivas) ---------- */
  const cbClasses = ['cb-protanopia','cb-protanomalia','cb-deuteranopia','cb-deuteranomalia','cb-tritanopia','cb-tritanomalia','cb-acromatopsia'];
  const cbBannerText = document.getElementById('cbBannerText');
  const cbRow = document.getElementById('cbRow');
  if (cbRow) {
    cbRow.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        cbClasses.forEach(c => root.classList.remove(c));
        cbRow.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        if (btn.dataset.cb !== 'none') {
          root.classList.add(btn.dataset.cb);
          root.classList.add('cb-active');
          if (cbBannerText) cbBannerText.textContent = 'Paleta ativa: ' + btn.textContent + ' — as cores do site foram adaptadas';
        } else {
          root.classList.remove('cb-active');
        }
        btn.classList.add('active');
      });
    });
  }

  /* ---------- Tamanho da fonte ---------- */
  let scale = 1;
  const fontInc = document.getElementById('fontInc');
  const fontDec = document.getElementById('fontDec');
  const fontReset = document.getElementById('fontReset');
  if (fontInc) fontInc.addEventListener('click', () => { scale = Math.min(1.5, scale + 0.1); root.style.setProperty('--font-scale', scale); });
  if (fontDec) fontDec.addEventListener('click', () => { scale = Math.max(0.85, scale - 0.1); root.style.setProperty('--font-scale', scale); });
  if (fontReset) fontReset.addEventListener('click', () => { scale = 1; root.style.setProperty('--font-scale', scale); });

  /* ---------- Restaurar tudo ---------- */
  const resetBtn = document.getElementById('a11yReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', withConfirm(resetBtn, () => {
      ['high-contrast','dyslexia-mode','reduce-motion','big-click','link-highlight','cb-active','epilepsy-safe','epilepsy-active', ...cbClasses].forEach(c => root.classList.remove(c));
      document.querySelectorAll('.a11y-row button').forEach(b => b.classList.remove('active'));
      if (cbRow) { const noneBtn = cbRow.querySelector('button[data-cb="none"]'); if (noneBtn) noneBtn.classList.add('active'); }
      scale = 1; root.style.setProperty('--font-scale', 1);
      try { localStorage.removeItem(PREF_KEY); } catch (e) {}

      // "Tudo" inclui o Modo de Acessibilidade Motora
      ['motor-targets','motor-spacing','motor-gestures','motor-confirm','motor-cursor','motor-focus','motor-time'].forEach(c => root.classList.remove(c));
      try { localStorage.removeItem('acessamais-motor-prefs'); } catch (e) {}
      document.querySelectorAll('[data-motor]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      const motorAllBtn = document.getElementById('motorAllBtn');
      if (motorAllBtn) { motorAllBtn.classList.remove('active'); motorAllBtn.textContent = 'Ativar todas as opções recomendadas'; }
    }));
  }

  /* ---------- Narrador: lê a página inteira em voz alta, seção por seção ---------- */
  const sections = Array.from(document.querySelectorAll('#main [data-narrate]'));
  const narratorBar = document.getElementById('narratorBar');
  const nbText = document.getElementById('nbText');
  const nbPlayPause = document.getElementById('nbPlayPause');
  const nbStop = document.getElementById('nbStop');
  let isPlaying = false;

  function clearHighlight(){ sections.forEach(s => s.classList.remove('reading-now')); }

  function speakSection(i){
    if (!sections.length) return;
    if (i >= sections.length){ stopNarration(); return; }
    const el = sections[i];
    clearHighlight();
    el.classList.add('reading-now');
    const behavior = root.classList.contains('epilepsy-safe') ? 'auto' : 'smooth';
    el.scrollIntoView({ behavior, block:'start' });
    if (nbText) nbText.textContent = el.dataset.narrate;
    if (narratorBar) narratorBar.classList.add('active');
    if (nbPlayPause){ nbPlayPause.textContent = '⏸'; nbPlayPause.setAttribute('aria-label','Pausar leitura'); }
    const text = el.dataset.narrate + '. ' + el.innerText;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 0.98;
    utter.onend = () => { if (isPlaying) speakSection(i + 1); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function startNarration(fromIndex){
    if (!('speechSynthesis' in window)) { alert('Seu navegador não suporta leitura por voz.'); return; }
    isPlaying = true;
    speakSection(fromIndex || 0);
  }
  function stopNarration(){
    isPlaying = false;
    window.speechSynthesis.cancel();
    if (narratorBar) narratorBar.classList.remove('active');
    clearHighlight();
  }
  function togglePause(){
    if (!isPlaying) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused){
      window.speechSynthesis.pause();
      if (nbPlayPause){ nbPlayPause.textContent = '▶'; nbPlayPause.setAttribute('aria-label','Retomar leitura'); }
    } else if (window.speechSynthesis.paused){
      window.speechSynthesis.resume();
      if (nbPlayPause){ nbPlayPause.textContent = '⏸'; nbPlayPause.setAttribute('aria-label','Pausar leitura'); }
    }
  }

  const heroListen = document.getElementById('heroListen');
  const a11yListen = document.getElementById('a11yListen');
  if (heroListen) heroListen.addEventListener('click', () => startNarration(0));
  if (a11yListen) a11yListen.addEventListener('click', () => {
    if (panel) panel.classList.remove('open');
    const scrim = document.getElementById('a11yScrim');
    if (scrim) scrim.classList.remove('active');
    document.body.classList.remove('modal-open');
    startNarration(0);
  });
  if (nbPlayPause) nbPlayPause.addEventListener('click', togglePause);
  if (nbStop) nbStop.addEventListener('click', stopNarration);

  /* ---------- Barra de progresso do narrador ---------- */
  const nbProgress = document.getElementById('nbProgress');
  function updateNarratorProgress(){
    if (!nbProgress || !sections.length) return;
    const idx = sections.findIndex(s => s.classList.contains('reading-now'));
    const pct = idx < 0 ? 0 : Math.round(((idx + 1) / sections.length) * 100);
    nbProgress.style.width = pct + '%';
  }
  const origSpeak = speakSection;
  speakSection = function(i){ origSpeak(i); updateNarratorProgress(); };
  const origStop = stopNarration;
  stopNarration = function(){ origStop(); if (nbProgress) nbProgress.style.width = '0%'; };

  /* ---------- Fallback JS p/ evitar sobreposição a11y-bar × narrator-bar (navegadores sem :has()) ---------- */
  if (narratorBar) {
    const obs = new MutationObserver(() => {
      document.body.classList.toggle('narrator-open', narratorBar.classList.contains('active'));
    });
    obs.observe(narratorBar, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Persistência das preferências de acessibilidade entre páginas ---------- */
  const PREF_KEY = 'acessamais-a11y-prefs';
  const persistedToggles = ['high-contrast','dyslexia-mode','reduce-motion','big-click','link-highlight'];

  function savePrefs(){
    const prefs = {
      toggles: persistedToggles.filter(c => root.classList.contains(c)),
      cb: cbClasses.find(c => root.classList.contains(c)) || 'none',
      fontScale: scale
    };
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function loadPrefs(){
    let prefs;
    try { prefs = JSON.parse(localStorage.getItem(PREF_KEY)); } catch (e) { prefs = null; }
    if (!prefs) return;

    (prefs.toggles || []).forEach(c => {
      root.classList.add(c);
      const btn = document.querySelector('[data-toggle="' + c + '"]');
      if (btn) btn.classList.add('active');
    });

    if (prefs.cb && prefs.cb !== 'none') {
      root.classList.add(prefs.cb, 'cb-active');
      const btn = cbRow && cbRow.querySelector('[data-cb="' + prefs.cb + '"]');
      if (btn) { btn.classList.add('active'); if (cbRow) cbRow.querySelectorAll('button').forEach(b => { if (b !== btn) b.classList.remove('active'); }); }
      if (cbBannerText && btn) cbBannerText.textContent = 'Paleta ativa: ' + btn.textContent + ' — as cores do site foram adaptadas';
    }

    if (typeof prefs.fontScale === 'number') {
      scale = prefs.fontScale;
      root.style.setProperty('--font-scale', scale);
    }
  }

  loadPrefs();
  document.querySelectorAll('[data-toggle]').forEach(btn => btn.addEventListener('click', savePrefs));
  if (cbRow) cbRow.querySelectorAll('button').forEach(btn => btn.addEventListener('click', savePrefs));
  if (fontInc) fontInc.addEventListener('click', savePrefs);
  if (fontDec) fontDec.addEventListener('click', savePrefs);
  if (fontReset) fontReset.addEventListener('click', savePrefs);

  /* ---------- Toasts ---------- */
  const toastWrap = document.getElementById('toastWrap');
  function showToast(message, type){
    if (!toastWrap) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = message;

    if (root.classList.contains('motor-time')) {
      // Tempo estendido: o toast só some quando a pessoa clicar nele
      const closeX = document.createElement('button');
      closeX.className = 'toast-close';
      closeX.setAttribute('aria-label', 'Fechar aviso');
      closeX.textContent = '\u2715';
      closeX.addEventListener('click', () => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); });
      el.appendChild(closeX);
      toastWrap.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      return;
    }

    toastWrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }
  window.acessaMaisToast = showToast;

  /* ---------- Voltar ao topo ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: root.classList.contains('reduce-motion') || root.classList.contains('epilepsy-safe') ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Animação de entrada ao rolar (scroll reveal) ---------- */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReduced && !root.classList.contains('reduce-motion') && !root.classList.contains('epilepsy-safe')) {
    const revealTargets = document.querySelectorAll('.cat-card, .team-card, .stack-card, .nav-card, .tl-item, .compare-col, .stat-box, .demo-box, .quote-block');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- Formulário de contato: validação e feedback reais ---------- */
  const contactForm = document.querySelector('.form-grid');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        const msg = field.parentElement.querySelector('.field-msg');
        const empty = !field.value.trim();
        const invalidEmail = field.type === 'email' && field.value.trim() && !/^\S+@\S+\.\S+$/.test(field.value.trim());
        if (empty || invalidEmail) {
          valid = false;
          field.classList.add('field-error');
          field.setAttribute('aria-invalid', 'true');
          if (msg) { msg.textContent = empty ? 'Este campo é obrigatório.' : 'Digite um e-mail válido.'; msg.classList.add('show'); }
        } else {
          field.classList.remove('field-error');
          field.removeAttribute('aria-invalid');
          if (msg) msg.classList.remove('show');
        }
      });

      if (!valid) {
        showToast('Confira os campos destacados antes de enviar.', 'error');
        const firstError = contactForm.querySelector('.field-error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const label = submitBtn && submitBtn.querySelector('.btn-label');

      if (root.classList.contains('motor-confirm')) {
        if (!contactForm.dataset.confirmArmed) {
          contactForm.dataset.confirmArmed = '1';
          if (label) { label.dataset.original = label.dataset.original || label.textContent; label.textContent = 'Confirmar envio?'; }
          showToast('Clique em "Enviar mensagem" de novo para confirmar.', undefined);
          setTimeout(() => {
            contactForm.dataset.confirmArmed = '';
            if (label && label.dataset.original) label.textContent = label.dataset.original;
          }, 5000);
          return;
        }
        contactForm.dataset.confirmArmed = '';
        if (label && label.dataset.original) label.textContent = label.dataset.original;
      }

      if (submitBtn) submitBtn.classList.add('loading');
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(() => {
        if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
        showToast('Mensagem enviada — este é um formulário de demonstração para a Feira Tecnológica, sem envio real.', 'success');
        contactForm.reset();
      }, 900);
    });

    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.classList.contains('field-error') && field.value.trim()) {
          field.classList.remove('field-error');
          field.removeAttribute('aria-invalid');
          const msg = field.parentElement.querySelector('.field-msg');
          if (msg) msg.classList.remove('show');
        }
      });
    });
  }

});

/* ============================================================
   SISTEMA DE MOTION — roda fora do DOMContentLoaded pra pegar
   o load o mais cedo possível (loader de abertura)
   ============================================================ */
(function () {
  const root = document.documentElement;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const forceIntro = new URLSearchParams(window.location.search).get('intro') === 'force';

  function storedReduceMotion() {
    try {
      const prefs = JSON.parse(localStorage.getItem('acessamais-a11y-prefs'));
      return !!(prefs && prefs.toggles && (prefs.toggles.includes('reduce-motion') || prefs.toggles.includes('epilepsy-safe')));
    } catch (e) { return false; }
  }

  function motionOff() {
    if (forceIntro) return false;
    return prefersReduced || storedReduceMotion() || root.classList.contains('reduce-motion') || root.classList.contains('epilepsy-safe');
  }

  /* ---------- Loader de abertura — sequência "Sussurro" ---------- */
  const introLoader = document.getElementById('introLoader');
  if (introLoader) {
    let seen = false;
    try { seen = sessionStorage.getItem('acessamais-intro-seen-v2') === '1'; } catch (e) {}
    if (forceIntro) seen = false;

    if (!(seen || motionOff())) {
      introLoader.classList.add('active');
      try { sessionStorage.setItem('acessamais-intro-seen-v2', '1'); } catch (e) {}

      // Versão leve para dispositivos com pouca memória (Device Memory API) — degrada com elegância
      const isLight = 'deviceMemory' in navigator && navigator.deviceMemory <= 4;
      if (isLight) introLoader.classList.add('light');

      const inclusion = document.getElementById('introInclusion');
      const mark = document.getElementById('introMark');
      const markText = document.getElementById('introMarkText');
      const tagline = document.getElementById('introTagline');
      const skipBtn = document.getElementById('introSkip');

      // Quebra "AcessaMais" em letras para revelar progressivamente (só na versão completa)
      if (!isLight && markText) {
        const chars = markText.textContent.split('');
        markText.innerHTML = chars.map(c => '<span class="letter">' + (c === ' ' ? '&nbsp;' : c) + '</span>').join('');
      }

      function finishIntro() {
        introLoader.classList.add('reveal-site');
        setTimeout(() => introLoader.classList.add('done'), 750);
      }

      if (skipBtn) skipBtn.addEventListener('click', finishIntro);
      if (skipBtn) setTimeout(() => skipBtn.focus(), 50);

      if (isLight) {
        // Sequência leve: símbolo → nome → slogan, sem desenho progressivo, rápida e direta
        setTimeout(() => inclusion && inclusion.classList.add('show', 'draw'), 60);
        setTimeout(() => { inclusion && inclusion.classList.add('fade-out'); mark && mark.classList.add('show'); }, 500);
        setTimeout(() => tagline && tagline.classList.add('show'), 750);
        setTimeout(finishIntro, 1300);
      } else {
        // Sequência completa: SÍMBOLO DE INCLUSÃO (desenho progressivo) → ACESSAMAIS → SLOGAN → transição
        setTimeout(() => inclusion && inclusion.classList.add('show'), 80);
        setTimeout(() => inclusion && inclusion.classList.add('draw'), 200);
        setTimeout(() => inclusion && inclusion.classList.add('fade-out'), 1250);
        setTimeout(() => mark && mark.classList.add('show'), 1300);
        if (markText) {
          markText.querySelectorAll('.letter').forEach((el, i) => {
            setTimeout(() => el.classList.add('show'), 1400 + i * 45);
          });
        }
        setTimeout(() => tagline && tagline.classList.add('show'), 2100);
        setTimeout(finishIntro, 2750);
      }
    }
  }

  /* ---------- Barra de progresso de leitura ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    function updateProgress() {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      scrollProgress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- Transição suave entre páginas internas ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    let url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (!url.pathname.endsWith('.html')) return;

    e.preventDefault();
    if (motionOff()) { window.location.href = href; return; }
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 150);
  });

  /* ---------- Stagger + tilt 3D — aplicados após o DOM carregar ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-grid, .cat-grid, .team-grid, .stack-grid, .compare-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.setProperty('--stagger', Math.min(i * 70, 350) + 'ms');
      });
    });

    if (window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !motionOff() && !root.classList.contains('motor-gestures')) {
      document.querySelectorAll('.cat-card, .team-card, .stack-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--rx', (px * 6).toFixed(2) + 'deg');
          card.style.setProperty('--ry', (py * -6).toFixed(2) + 'deg');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    }
  });
})();
