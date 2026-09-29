/* ==========================================================================
   PPD-ICT · Master A-1 — Sprite ikon bersama (assets/a1-icons.js)
   Pemilik: OpenCode (Ronde 1 §3). Autoriti visual: master-a1/home.html +
   master-a1/components.html.

   Menyuntik SATU <svg> sprite tersembunyi ke document.body, sekali sahaja
   (idempoten). Guna dalam markup:

       <svg class="i"><use href="#i-home"/></svg>

   Kontrak gaya (sama seperti master-a1/home.html):
   - setiap <symbol> viewBox="0 0 24 24", geometri garis sahaja;
   - TIADA atribut fill/stroke pada geometri — stroke/fill diurus oleh CSS
     (a1-tokens.css: svg.i{stroke:currentColor;fill:none;stroke-width:1.7;
     stroke-linecap:round;stroke-linejoin:round});
   - radius 0, tiada gradien, tiada elemen hiasan.

   Sumber path:
   - Verbatim sprite master: i-wifi i-printer i-laptop i-cog i-wrench i-qr
     i-install i-radar i-arrow.
   - SVG inline master (diberi ID): i-home i-form i-grid i-bar i-team i-alert
     i-log i-map i-report i-lock i-menu i-moon i-arrow-ne.
   - Dilukis baharu dalam gaya sama: i-chev i-sun i-search i-bell.
   - Claude 25 Sep: i-half (Ikut peranti, menu tema).
   - Verbatim master-a1/components.html baris 56–60 (tambahan R2a):
     i-x i-filter i-refresh i-download i-print.
   ========================================================================== */
(function () {
  'use strict';

  var SPRITE_ID = 'a1-icons';

  var SPRITE =
    /* --- Navigasi -------------------------------------------------------- */
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></symbol>' +
    '<symbol id="i-form" viewBox="0 0 24 24"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></symbol>' +
    '<symbol id="i-bar" viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></symbol>' +
    '<symbol id="i-team" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></symbol>' +
    '<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></symbol>' +
    '<symbol id="i-log" viewBox="0 0 24 24"><path d="M5 3h14v18H5z"/><path d="M9 8h6M9 12h6M9 16h3"/></symbol>' +
    '<symbol id="i-map" viewBox="0 0 24 24"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></symbol>' +
    '<symbol id="i-report" viewBox="0 0 24 24"><path d="M3 4h18v12H3z"/><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4"/></symbol>' +
    '<symbol id="i-qr" viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2v2h-2zM18 14h2v2h-2z"/></symbol>' +
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></symbol>' +
    /* --- Kategori aduan --------------------------------------------------- */
    '<symbol id="i-wifi" viewBox="0 0 24 24"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><path d="M12 19h.01"/></symbol>' +
    '<symbol id="i-printer" viewBox="0 0 24 24"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8"/><path d="M6 14h12v7H6z"/></symbol>' +
    '<symbol id="i-laptop" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="11"/><path d="M2 19h20"/></symbol>' +
    '<symbol id="i-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></symbol>' +
    '<symbol id="i-wrench" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></symbol>' +
    /* --- Pintasan ---------------------------------------------------------- */
    '<symbol id="i-install" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20"/><path d="M12 7v7M9 11l3 3 3-3M10 18h4"/></symbol>' +
    '<symbol id="i-radar" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1"/></symbol>' +
    /* --- Alat -------------------------------------------------------------- */
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>' +
    '<symbol id="i-arrow-ne" viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></symbol>' +
    '<symbol id="i-chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>' +
    '<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></symbol>' +
    '<symbol id="i-half" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M12 8h6.5M12 12h8.5M12 16h6.5"/></symbol>' +
    '<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2L6 6M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/></symbol>' +
    '<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 4 1 5 2 6H4c1-1 2-2 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></symbol>' +
    /* --- Alat R2a (verbatim master-a1/components.html baris 56–60) ---------- */
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>' +
    '<symbol id="i-filter" viewBox="0 0 24 24"><path d="M3 5h18M6 12h12M10 19h4"/></symbol>' +
    '<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 21v-5h-5"/></symbol>' +
    '<symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M4 20h16"/></symbol>' +
    '<symbol id="i-print" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 17H3V9h18v8h-3"/><path d="M6 14h12v7H6z"/></symbol>';

  function inject() {
    if (document.getElementById(SPRITE_ID)) return false; // idempoten
    if (!document.body) return false;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = SPRITE_ID;
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('style', 'position:absolute');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = SPRITE;
    document.body.appendChild(svg);
    return true;
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }

  window.A1Icons = { inject: inject, id: SPRITE_ID };
})();
