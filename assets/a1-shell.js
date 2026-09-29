/* ==========================================================================
   PPD-ICT · Master A-1 — Shell bersama (assets/a1-shell.js)
   Pemilik: Kimi/OpenCode (Ronde 2a §3). Autoriti: master-a1/DASHBOARD_A1_DIRECTION.md
   §2.1 + AGENT_PROMPTS_MASTER_A1_R2A.md kontrak A1Shell.

   Dikongsi Home / Dashboard / PTIS / Admin. Auto-init pada DOMContentLoaded,
   idempoten (dimuat dua kali = satu set pendengar). Tiada penciptaan DOM,
   tiada gaya sebaris — hanya kelas + atribut `hidden`/`aria-*` (CSS mengikut
   master-a1/assets/a1-components.css: .side.open, .scrim[hidden], body.lock).

   Kontrak:
     window.A1Shell = { open(), close(), setActive(key) }

   Markup dijangka (semua pilihan — selamat jika tiada, tiada ralat):
     aside.side#sidebar · button.menu-btn#menuBtn · div.scrim#sideBackdrop[hidden]
     (pilihan) button.side-close · pautan nav <a data-nav="home|ptis|overview|…">

   Tingkah laku:
   - Buka: #sidebar.open, scrim hidden=false, #menuBtn aria-expanded=true,
     body.lock, fokus pautan nav pertama.
   - Perangkap fokus: semasa terbuka, Tab/Shift+Tab berkitar dalam #sidebar.
   - Tutup: Escape, klik scrim, klik .side-close, klik pautan nav, atau
     resize > 900px. Fokus kembali ke #menuBtn KECUALI tutup kerana
     resize/navigasi (pautan nav).
   - setActive(key): kelas .on + aria-current="page" pada [data-nav=key]
     sahaja. Auto: hashchange → [data-nav=<hash>] jika ada; jika tidak,
     document.body.dataset.page (fallback data-lab-page).

   Menu tema (25 Sep, Claude — MOD_GELAP_A1 §3): hanya pada <html data-a1>
   dengan assets/a1-theme.js dimuat. #darkModeBtn membuka .theme-menu
   (Cerah · Gelap · Ikut peranti) — SATU-SATUNYA elemen yang dicipta shell.
   Escape/klik luar menutup, fokus kembali ke butang; ↑/↓ antara pilihan.
   Halaman ikut serta MESTI buang logik lama setDarkMode()/body.dark.
   ========================================================================== */
(function () {
  'use strict';

  var BREAKPOINT = 900;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function qs(sel) {
    try { return document.querySelector(sel); } catch (e) { return null; }
  }
  function sidebar() { return qs('#sidebar'); }
  function menuBtn() { return qs('#menuBtn'); }
  function scrim() { return qs('#sideBackdrop'); }
  function isOpen() {
    var s = sidebar();
    return !!(s && s.classList.contains('open'));
  }

  function focusables() {
    var s = sidebar();
    if (!s) return [];
    var nodes = s.querySelectorAll(FOCUSABLE);
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('aria-hidden') === 'true') continue;
      if (el.getClientRects().length === 0) continue; // tidak kelihatan
      out.push(el);
    }
    return out;
  }

  /* --- Buka / tutup ------------------------------------------------------- */

  function open() {
    var s = sidebar();
    if (!s || s.classList.contains('open')) return;
    s.classList.add('open');
    var sc = scrim();
    if (sc) sc.hidden = false;
    var mb = menuBtn();
    if (mb) mb.setAttribute('aria-expanded', 'true');
    if (document.body) document.body.classList.add('lock');
    var first = s.querySelector('nav a') || focusables()[0];
    if (first && typeof first.focus === 'function') first.focus();
  }

  function closeInternal(restoreFocus) {
    var s = sidebar();
    if (!s || !s.classList.contains('open')) return;
    s.classList.remove('open');
    var sc = scrim();
    if (sc) sc.hidden = true;
    var mb = menuBtn();
    if (mb) mb.setAttribute('aria-expanded', 'false');
    if (document.body) document.body.classList.remove('lock');
    if (restoreFocus && mb && typeof mb.focus === 'function') mb.focus();
  }

  function close() { closeInternal(true); }

  /* --- Pendengar ---------------------------------------------------------- */

  function onMenuClick() {
    if (isOpen()) closeInternal(true); else open();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      if (isOpen()) closeInternal(true);
      return;
    }
    if (e.key !== 'Tab' || !isOpen()) return;
    // Perangkap fokus — kitar semula dalam #sidebar sahaja.
    var items = focusables();
    if (!items.length) { e.preventDefault(); return; }
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    var s = sidebar();
    var inside = !!(s && s.contains(active));
    if (e.shiftKey) {
      if (!inside || active === first) { e.preventDefault(); last.focus(); }
    } else if (!inside || active === last) {
      e.preventDefault(); first.focus();
    }
  }

  function onSidebarClick(e) {
    if (!isOpen()) return;
    var t = e.target;
    var a = t && typeof t.closest === 'function' ? t.closest('a') : null;
    var s = sidebar();
    if (a && s && s.contains(a)) closeInternal(false); // navigasi — tiada pulih fokus
  }

  function onResize() {
    if (isOpen() && window.innerWidth > BREAKPOINT) closeInternal(false);
  }

  /* --- Nav aktif ---------------------------------------------------------- */

  function setActive(key) {
    if (typeof key !== 'string' || !key) return;
    var links;
    try { links = document.querySelectorAll('[data-nav]'); } catch (e) { return; }
    for (var i = 0; i < links.length; i++) {
      var el = links[i];
      if (el.getAttribute('data-nav') === key) {
        el.classList.add('on');
        el.setAttribute('aria-current', 'page');
      } else {
        el.classList.remove('on');
        el.removeAttribute('aria-current');
      }
    }
  }

  function autoActive() {
    var hash = '';
    try { hash = (window.location.hash || '').replace(/^#/, ''); } catch (e) { /* abaikan */ }
    if (hash) {
      var match = null;
      var safe = window.CSS && typeof window.CSS.escape === 'function' ? window.CSS.escape(hash) : hash;
      try { match = document.querySelector('[data-nav="' + safe + '"]'); } catch (e) { match = null; }
      if (match) { setActive(hash); return; }
    }
    var body = document.body;
    var page = body && body.dataset ? (body.dataset.page || '') : '';
    if (page) setActive(page);
  }


  /* --- Menu tema (hanya <html data-a1>) ----------------------------------- */

  var THEME_OPTS = [
    { mode: 'light', label: 'Cerah', icon: 'i-sun' },
    { mode: 'dark', label: 'Gelap', icon: 'i-moon' },
    { mode: 'auto', label: 'Ikut peranti', icon: 'i-half' }
  ];
  var themeMenu = null;

  function themeOn() { return !!(window.A1Theme && window.A1Theme.active); }
  function themeBtn() { return qs('#darkModeBtn'); }
  function themeLabel(m) {
    for (var i = 0; i < THEME_OPTS.length; i++) if (THEME_OPTS[i].mode === m) return THEME_OPTS[i];
    return THEME_OPTS[2];
  }

  function syncThemeBtn() {
    var b = themeBtn();
    if (!b) return;
    var o = themeLabel(window.A1Theme.get());
    b.setAttribute('aria-label', 'Mod paparan: ' + o.label);
    b.setAttribute('title', 'Mod paparan: ' + o.label);
    b.innerHTML = '<svg class="i" aria-hidden="true"><use href="#' + o.icon + '"/></svg>';
    if (themeMenu) {
      var items = themeMenu.querySelectorAll('button');
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('aria-checked', String(items[i].getAttribute('data-mode') === window.A1Theme.get()));
      }
    }
  }

  function buildThemeMenu() {
    var m = document.createElement('div');
    m.className = 'theme-menu';
    m.id = 'themeMenu';
    m.setAttribute('role', 'menu');
    m.setAttribute('aria-label', 'Mod paparan');
    m.hidden = true;
    var html = '<span class="mono" aria-hidden="true">Mod paparan</span>';
    for (var i = 0; i < THEME_OPTS.length; i++) {
      var o = THEME_OPTS[i];
      html += '<button type="button" role="menuitemradio" data-mode="' + o.mode + '" aria-checked="false">' +
        '<svg class="i" aria-hidden="true"><use href="#' + o.icon + '"/></svg>' + o.label + '</button>';
    }
    m.innerHTML = html;
    m.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('button[data-mode]') : null;
      if (!t) return;
      window.A1Theme.set(t.getAttribute('data-mode'));
      closeThemeMenu(true);
    });
    m.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      var items = m.querySelectorAll('button');
      var idx = Array.prototype.indexOf.call(items, document.activeElement);
      if (e.key === 'Home') idx = 0;
      else if (e.key === 'End') idx = items.length - 1;
      else idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[idx].focus();
    });
    document.body.appendChild(m);
    return m;
  }

  function themeMenuOpen() { return !!(themeMenu && !themeMenu.hidden); }

  function openThemeMenu() {
    var b = themeBtn();
    if (!b) return;
    if (!themeMenu) themeMenu = buildThemeMenu();
    syncThemeBtn();
    var r = b.getBoundingClientRect();
    themeMenu.style.setProperty('--tm-top', Math.round(r.bottom + 6) + 'px');
    themeMenu.style.setProperty('--tm-right', Math.max(8, Math.round(document.documentElement.clientWidth - r.right)) + 'px');
    themeMenu.hidden = false;
    b.setAttribute('aria-expanded', 'true');
    var cur = themeMenu.querySelector('button[aria-checked="true"]') || themeMenu.querySelector('button');
    if (cur) cur.focus();
  }

  function closeThemeMenu(restoreFocus) {
    if (!themeMenuOpen()) return;
    themeMenu.hidden = true;
    var b = themeBtn();
    if (b) {
      b.setAttribute('aria-expanded', 'false');
      if (restoreFocus) b.focus();
    }
  }

  function initTheme() {
    var b = themeBtn();
    if (!themeOn() || !b) return;
    b.setAttribute('aria-haspopup', 'menu');
    b.setAttribute('aria-controls', 'themeMenu');
    b.setAttribute('aria-expanded', 'false');
    b.removeAttribute('aria-pressed');
    b.hidden = false;
    b.addEventListener('click', function () {
      if (themeMenuOpen()) closeThemeMenu(true); else openThemeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && themeMenuOpen()) { e.stopPropagation(); closeThemeMenu(true); }
    }, true);
    document.addEventListener('click', function (e) {
      if (!themeMenuOpen()) return;
      if (themeMenu.contains(e.target) || b.contains(e.target)) return;
      closeThemeMenu(false);
    });
    window.addEventListener('resize', function () { closeThemeMenu(false); });
    window.addEventListener('a1:theme', syncThemeBtn);
    syncThemeBtn();
  }

  /* --- Init idempoten ------------------------------------------------------ */

  function init() {
    if (window.__A1ShellInit) return;
    window.__A1ShellInit = true;
    var mb = menuBtn();
    if (mb) mb.addEventListener('click', onMenuClick);
    var sc = scrim();
    if (sc) sc.addEventListener('click', function () { closeInternal(true); });
    var s = sidebar();
    if (s) s.addEventListener('click', onSidebarClick);
    var sideClose = qs('.side-close');
    if (sideClose) sideClose.addEventListener('click', function () { closeInternal(true); });
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    window.addEventListener('hashchange', autoActive);
    autoActive();
    initTheme();
  }

  window.A1Shell = { open: open, close: close, setActive: setActive };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
