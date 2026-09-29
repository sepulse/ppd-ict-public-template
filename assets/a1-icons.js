/* White-label rounded line icon sprite.
   ID dikekalkan untuk compatibility, tetapi geometri visual sengaja berbeza daripada sistem asal. */
(function () {
  'use strict';
  var SPRITE_ID = 'generic-icons';
  var SPRITE =
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/></symbol>' +
    '<symbol id="i-form" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h7"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></symbol>' +
    '<symbol id="i-bar" viewBox="0 0 24 24"><path d="M4 20h16M6 17v-5M12 17V7M18 17v-8"/></symbol>' +
    '<symbol id="i-team" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.5-4 2.4-6 5.5-6s5 2 5.5 6M16 5.5a3 3 0 0 1 0 5.5M17 14c2.2.5 3.4 2.2 3.7 5"/></symbol>' +
    '<symbol id="i-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/></symbol>' +
    '<symbol id="i-log" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/></symbol>' +
    '<symbol id="i-map" viewBox="0 0 24 24"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></symbol>' +
    '<symbol id="i-report" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 15v-3M12 15V8M16 15v-5"/></symbol>' +
    '<symbol id="i-qr" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/></symbol>' +
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></symbol>' +
    '<symbol id="i-wifi" viewBox="0 0 24 24"><path d="M4 9a12 12 0 0 1 16 0M7 12.5a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r=".5"/></symbol>' +
    '<symbol id="i-printer" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="6" rx="1"/><rect x="6" y="15" width="12" height="6" rx="1"/><path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/></symbol>' +
    '<symbol id="i-laptop" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20"/></symbol>' +
    '<symbol id="i-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></symbol>' +
    '<symbol id="i-wrench" viewBox="0 0 24 24"><path d="M14 6a5 5 0 0 0-6.5 6.5L3 17l4 4 4.5-4.5A5 5 0 0 0 18 10l-3 3-4-4z"/></symbol>' +
    '<symbol id="i-install" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 7v7M9 11l3 3 3-3M10 18h4"/></symbol>' +
    '<symbol id="i-radar" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l5-5"/><circle cx="12" cy="12" r="1"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></symbol>' +
    '<symbol id="i-arrow-ne" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></symbol>' +
    '<symbol id="i-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>' +
    '<symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>' +
    '<symbol id="i-prev" viewBox="0 0 24 24"><path d="m14 6-6 6 6 6"/></symbol>' +
    '<symbol id="i-next" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6"/></symbol>' +
    '<symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5M10 7l-5 5 5 5"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M5 7h14M5 12h10M5 17h14"/></symbol>' +
    '<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 15.2A8 8 0 1 1 8.8 4 6.5 6.5 0 0 0 20 15.2z"/></symbol>' +
    '<symbol id="i-half" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z"/></symbol>' +
    '<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></symbol>' +
    '<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6zM10 19h4"/></symbol>' +
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></symbol>' +
    '<symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>' +
    '<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5M6.5 8a7 7 0 0 1 11.8-1M17.5 16a7 7 0 0 1-11.8 1"/></symbol>' +
    '<symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v10M8 11l4 4 4-4M5 20h14"/></symbol>' +
    '<symbol id="i-print" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="6" rx="1"/><rect x="6" y="15" width="12" height="6" rx="1"/><path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/></symbol>' +
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="m9 7 8 5-8 5z"/></symbol>' +
    '<symbol id="i-pause" viewBox="0 0 24 24"><path d="M9 7v10M15 7v10"/></symbol>' +
    '<symbol id="i-loc" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></symbol>' +
    '<symbol id="i-nav" viewBox="0 0 24 24"><path d="m4 4 16 7-7 3-3 7z"/></symbol>' +
    '<symbol id="i-pclose" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M16 9l-3 3 3 3"/></symbol>' +
    '<symbol id="i-popen" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M13 9l3 3-3 3"/></symbol>' +
    '<symbol id="i-rail" viewBox="0 0 24 24"><path d="m10 7-5 5 5 5M18 7l-5 5 5 5"/></symbol>' +
    '<symbol id="i-fs" viewBox="0 0 24 24"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></symbol>' +
    '<symbol id="i-cam" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 6 1.5-2h5L16 6"/><circle cx="12" cy="13" r="3.5"/></symbol>' +
    '<symbol id="i-img" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 4"/></symbol>' +
    '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>' +
    '<symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4zM18.5 15l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z"/></symbol>' +
    '<symbol id="i-eye" viewBox="0 0 24 24"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/></symbol>' +
    '<symbol id="i-save" viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/></symbol>' +
    '<symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></symbol>' +
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v12H9l-5 4z"/></symbol>' +
    '<symbol id="i-edit" viewBox="0 0 24 24"><path d="M5 19h4L19 9l-4-4L5 15zM13 7l4 4"/></symbol>' +
    '<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></symbol>' +
    '<symbol id="i-send" viewBox="0 0 24 24"><path d="M21 4 10 15M21 4l-7 17-4-6-6-4z"/></symbol>';

  function inject() {
    if (document.getElementById(SPRITE_ID)) return false;
    if (!document.body) return false;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = SPRITE_ID;
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = SPRITE;
    document.body.appendChild(svg);
    return true;
  }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);
  window.A1Icons = { inject: inject, id: SPRITE_ID };
})();
