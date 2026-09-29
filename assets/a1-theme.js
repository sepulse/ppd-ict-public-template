/* ==========================================================================
   PPD-ICT · Master A-1 — Enjin tema (assets/a1-theme.js)
   Pemilik: Claude (ambil alih Sol-1, 25 Sep). Autoriti: master-a1/MOD_GELAP_A1.md §3.

   Muat SEGERAK dalam <head> SEBELUM <link> CSS pertama (elak kilatan):
       <html lang="ms" data-a1>
       <script src="assets/a1-theme.js"></script>

   Hanya bertindak jika <html data-a1>. Halaman tanpa data-a1 kekal cerah.
   Storan tunggal `theme_mode` = light | dark | auto (lalai auto = ikut peranti).
   Migrasi sekali dari jtk_dashboard_theme / ppdk_theme / theme → theme_mode.

   Kontrak:
     window.A1Theme = { get(), set(mode), resolved() }
     Acara `a1:theme` pada window, detail = { mode, resolved }.
   ========================================================================== */
(function () {
  'use strict';
  if (window.A1Theme) return; // idempoten

  var KEY = 'theme_mode';
  var LEGACY = ['jtk_dashboard_theme', 'ppdk_theme', 'theme'];
  var META = { light: '#0A2B2F', dark: '#101615' };
  var root = document.documentElement;
  var active = root.hasAttribute('data-a1');
  var mq = null;
  try { mq = window.matchMedia('(prefers-color-scheme: dark)'); } catch (e) { mq = null; }

  function valid(m) { return m === 'light' || m === 'dark' || m === 'auto'; }

  function read() {
    var m = null;
    try { m = localStorage.getItem(KEY); } catch (e) { return 'auto'; }
    if (valid(m)) return m;
    // Migrasi sekali: nilai lama dark/light (atau "true"/"1") → theme_mode.
    var found = null;
    for (var i = 0; i < LEGACY.length; i++) {
      var v = null;
      try { v = localStorage.getItem(LEGACY[i]); } catch (e) { v = null; }
      if (v == null) continue;
      if (found == null) {
        if (v === 'dark' || v === 'true' || v === '1') found = 'dark';
        else if (v === 'light' || v === 'false' || v === '0') found = 'light';
      }
      try { localStorage.removeItem(LEGACY[i]); } catch (e) { /* abaikan */ }
    }
    m = found || 'auto';
    if (found) { try { localStorage.setItem(KEY, m); } catch (e) { /* abaikan */ } }
    return m;
  }

  var mode = active ? read() : 'light';

  function resolved() {
    if (!active) return 'light';
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    return mq && mq.matches ? 'dark' : 'light';
  }

  function setMeta(r) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m && document.head) {
      m = document.createElement('meta');
      m.setAttribute('name', 'theme-color');
      document.head.appendChild(m);
    }
    if (m) m.setAttribute('content', META[r]);
  }

  function apply(fire) {
    var r = resolved();
    if (r === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    setMeta(r);
    if (fire) {
      var ev;
      try { ev = new CustomEvent('a1:theme', { detail: { mode: mode, resolved: r } }); }
      catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('a1:theme', false, false, { mode: mode, resolved: r }); }
      window.dispatchEvent(ev);
    }
  }

  function set(m) {
    if (!active || !valid(m)) return;
    mode = m;
    try { localStorage.setItem(KEY, m); } catch (e) { /* abaikan */ }
    apply(true);
  }

  if (active) {
    apply(false);
    // <meta> mungkin belum diparse bila skrip ini jalan di awal <head>.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setMeta(resolved()); });
    if (mq) {
      var onChange = function () { if (mode === 'auto') apply(true); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
    // Tab lain menukar tema → ikut.
    window.addEventListener('storage', function (e) {
      if (e.key === KEY && valid(e.newValue) && e.newValue !== mode) { mode = e.newValue; apply(true); }
    });
  }

  window.A1Theme = {
    get: function () { return mode; },
    set: set,
    resolved: resolved,
    active: active
  };
})();
