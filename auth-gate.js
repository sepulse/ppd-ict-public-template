/* auth-gate.js — ADR-004 P4: log masuk staf (vanilla, dikongsi ptis.html + landing_page_dossier.html).
 * Tiada framework. Overlay wajib hanya apabila suis PTIS pelayan ON; log masuk pilihan semasa OFF.
 * Guna endpoint admin sedia ada (/api/admin/adminlogin, adminchecksession,
 * adminchangeownpassword) — sama kod laluan untuk SUPER_ADMIN & staf PEGAWAI. */
(function () {
  'use strict';

  var TOKEN_KEY = 'ppdkStaffToken';
  var SESSION_KEY = 'ppdkStaffSession';
  var cachedCurrentPassword = '';
  var onReadyCallback = null;
  var overlayEl = null;
  var GATE_KEY = 'ppdkPtisStaffGate';
  var gateEnabled = readStoredGate();
  var optionalPage = false;
  var sessionVerified = false;
  var policyPromise = Promise.resolve();

  function readStoredGate() {
    try { return localStorage.getItem(GATE_KEY) === 'true'; } catch (_) { return false; }
  }
  function requiresLogin() { return gateEnabled && !optionalPage; }
  function loadGatePolicy() {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 3000) : null;
    return fetch('/api/public/version', { cache: 'no-store', signal: controller ? controller.signal : undefined })
      .then(function (response) {
        if (!response.ok) throw new Error('Policy unavailable');
        return response.json();
      }).then(function (data) {
        if (typeof data.ptisStaffGate !== 'boolean') throw new Error('Invalid policy');
        gateEnabled = data.ptisStaffGate;
        try { localStorage.setItem(GATE_KEY, String(gateEnabled)); } catch (_) {}
      }).catch(function () { gateEnabled = readStoredGate(); })
      .finally(function () { if (timer) clearTimeout(timer); });
  }
  function updateLoginLink() {
    var link = document.getElementById('authGateLoginLink');
    var signedIn = sessionVerified && Boolean(getToken());
    if (link) link.hidden = signedIn;
    var logoutLink = document.getElementById('authGateLogoutLink');
    if (logoutLink) {
      logoutLink.hidden = !signedIn;
      if (document.body) document.body.classList.add('a-has-logout');
    }
  }
  function unauthenticated() {
    sessionVerified = false;
    if (requiresLogin()) showLoginMode();
    else {
      hideOverlay();
      if (onReadyCallback) onReadyCallback(null);
    }
    updateLoginLink();
  }
  function closeOptionalLogin() {
    if (requiresLogin()) return;
    if (getSession() && getSession().mustChangePassword) clearAuth();
    cachedCurrentPassword = '';
    hideOverlay();
    var link = document.getElementById('authGateLoginLink');
    if (link && !link.hidden) link.focus();
  }

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token || ''); } catch (e) {}
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function setSession(session) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session || null)); } catch (e) {}
  }
  function clearAuth() {
    cachedCurrentPassword = '';
    sessionVerified = false;
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById('authGateStyles')) return;
    var style = document.createElement('style');
    style.id = 'authGateStyles';
    style.textContent =
      '#authGateOverlay{position:fixed;inset:0;z-index:99999;background:rgba(8,10,14,.94);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Plus Jakarta Sans",system-ui,sans-serif;}' +
      '#authGateOverlay.ag-hidden{display:none;}' +
      '#authGateCard{width:100%;max-width:380px;background:#12151b;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px 24px;box-shadow:0 20px 60px rgba(0,0,0,.5);color:#e8eaed;}' +
      '#authGateCard h2{margin:0 0 6px;font-size:18px;font-weight:700;}' +
      '#authGateCard p.ag-sub{margin:0 0 20px;font-size:12.5px;color:#8b95a5;line-height:1.5;}' +
      '.ag-field{margin-bottom:14px;}' +
      '.ag-field.ag-hidden{display:none;}' +
      '.ag-field label{display:block;font-size:11.5px;font-weight:600;color:#8b95a5;margin-bottom:6px;}' +
      '.ag-field input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#e8eaed;font-size:14px;}' +
      '.ag-field input:focus{outline:none;border-color:#3b82f6;}' +
      '#authGateError{display:none;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);color:#fca5a5;font-size:12px;padding:8px 10px;border-radius:8px;margin-bottom:14px;line-height:1.4;}' +
      '#authGateSubmit{width:100%;padding:11px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-weight:700;font-size:13.5px;cursor:pointer;}' +
      '#authGateSubmit:disabled{opacity:.6;cursor:default;}' +
      '#authGateSubmit:hover:not(:disabled){background:#2563eb;}' +
      '.ag-logout-bar{position:fixed;top:10px;right:10px;z-index:9998;font-size:11.5px;}' +
      '.ag-logout-bar.ag-hidden{display:none;}' +
      '.ag-logout-bar button{background:rgba(0,0,0,.55);color:#e8eaed;border:1px solid rgba(255,255,255,.16);border-radius:20px;padding:6px 12px;cursor:pointer;font-size:11px;}' +
      '.ag-close{display:block;margin:14px auto 0;background:transparent;border:1px solid currentColor;color:inherit;padding:8px 12px;font:inherit;cursor:pointer;}.ag-close[hidden]{display:none;}' +
      '.ag-hint{margin-top:14px;font-size:11px;color:#5b6472;text-align:center;}' +
      'html[data-a1] #authGateCard::before{content:none;display:none}' +
      'html[data-a1] #authGateCard .ag-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px}' +
      'html[data-a1] #authGateCard .ag-top .mono{color:var(--muted);line-height:1.4}' +
      'html[data-a1] #authGateCard .lnk{display:inline-flex;align-items:center;gap:4px;min-height:44px;margin:0;color:var(--ink);font:500 13px/1.4 var(--sans);white-space:nowrap;text-decoration:underline;text-underline-offset:3px}' +
      'html[data-a1] #authGateCard .ag-close,html[data-a1] #authGateCard .ag-home{display:flex;align-items:center;justify-content:center;width:100%;height:44px;margin:12px 0 0;padding:0 10px;border:1px solid var(--ink);border-radius:0;background:var(--card);color:var(--ink);font:600 14px/1.2 var(--sans);text-decoration:none}' +
      'html[data-a1] #authGateCard .ag-close[hidden],html[data-a1] #authGateCard .ag-home[hidden]{display:none}' +
      'html[data-a1] #authGateCard .lnk:focus-visible,html[data-a1] #authGateCard .ag-close:focus-visible,html[data-a1] #authGateCard .ag-home:focus-visible{outline:2px solid var(--ink);outline-offset:3px}';
    document.head.appendChild(style);
  }

  function buildOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'authGateOverlay';
    overlayEl.className = 'ag-hidden';
    var homeArrow = document.getElementById('i-back') ? '<svg class="i" aria-hidden="true"><use href="#i-back"/></svg>' : '<span aria-hidden="true">←</span>';
    overlayEl.innerHTML =
      '<div id="authGateCard" role="dialog" aria-modal="true" aria-labelledby="authGateTitle">' +
        '<div class="ag-top"><span class="mono">PPD-ICT · STAF JTK/PPTM</span><a class="lnk" id="authGateHome" href="/">' + homeArrow + '<span>Laman utama</span></a></div>' +
        '<h2 id="authGateTitle">Log Masuk Staf</h2>' +
        '<p class="ag-sub" id="authGateSub">Akses terhad kepada staf JTK/PPTM PPD Contoh dalam senarai dibenarkan.</p>' +
        '<div id="authGateError"></div>' +
        '<div class="ag-field" id="authGateEmailField"><label>E-mel</label><input id="authGateEmail" type="email" autocomplete="username" placeholder="nama@moe.gov.my"></div>' +
        '<div class="ag-field" id="authGatePasswordField"><label>Kata Laluan</label><input id="authGatePassword" type="password" autocomplete="current-password"></div>' +
        '<div class="ag-field ag-hidden" id="authGateCurrentPassField"><label>Kata Laluan Semasa</label><input id="authGateCurrentPassword" type="password" autocomplete="current-password"></div>' +
        '<div class="ag-field ag-hidden" id="authGateNewPassField"><label>Kata Laluan Baharu</label><input id="authGateNewPassword" type="password" autocomplete="new-password" placeholder="Sekurang-kurangnya 10 aksara"></div>' +
        '<button id="authGateSubmit">Log Masuk</button>' +
        '<button class="ag-close btn btn-line" id="authGateClose" type="button" hidden>Tutup</button>' +
        '<a class="ag-home btn btn-line" id="authGateReturn" href="/" hidden>Kembali ke laman utama</a>' +
        '<p class="ag-hint">Lupa kata laluan? Hubungi Penyelaras JTK atau Super Admin.</p>' +
      '</div>';
    document.body.appendChild(overlayEl);

    var logoutBar = document.createElement('div');
    logoutBar.className = 'ag-logout-bar ag-hidden';
    logoutBar.id = 'authGateLogoutBar';
    logoutBar.innerHTML = '<button id="authGateLogoutBtn" type="button">Log Keluar</button>';
    document.body.appendChild(logoutBar);

    document.getElementById('authGateClose').addEventListener('click', closeOptionalLogin);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlayEl.classList.contains('ag-hidden')) closeOptionalLogin();
    });
    document.getElementById('authGateSubmit').addEventListener('click', onSubmit);
    ['authGatePassword', 'authGateCurrentPassword', 'authGateNewPassword'].forEach(function (id) {
      document.getElementById(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') onSubmit(); });
    });
    document.getElementById('authGateLogoutBtn').addEventListener('click', function () {
      clearAuth();
      window.location.reload();
    });
    return overlayEl;
  }

  function showError(message) {
    var el = document.getElementById('authGateError');
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
  }

  function showLoginMode() {
    buildOverlay();
    document.getElementById('authGateTitle').textContent = 'Log Masuk Staf';
    document.getElementById('authGateSub').textContent = 'Akses terhad kepada staf JTK/PPTM PPD Contoh dalam senarai dibenarkan.';
    document.getElementById('authGateEmailField').classList.remove('ag-hidden');
    document.getElementById('authGatePasswordField').classList.remove('ag-hidden');
    document.getElementById('authGateCurrentPassField').classList.add('ag-hidden');
    document.getElementById('authGateNewPassField').classList.add('ag-hidden');
    document.getElementById('authGateSubmit').textContent = 'Log Masuk';
    showError('');
    document.getElementById('authGateClose').hidden = requiresLogin();
    document.getElementById('authGateReturn').hidden = !requiresLogin();
    overlayEl.classList.remove('ag-hidden');
    document.getElementById('authGateLogoutBar').classList.add('ag-hidden');
    document.getElementById('authGateEmail').focus();
  }

  function showChangePasswordMode(knowsCurrentPassword) {
    buildOverlay();
    document.getElementById('authGateTitle').textContent = 'Wajib Tukar Kata Laluan';
    document.getElementById('authGateSub').textContent = 'Kata laluan sementara mesti ditukar sebelum meneruskan.';
    document.getElementById('authGateEmailField').classList.add('ag-hidden');
    document.getElementById('authGatePasswordField').classList.add('ag-hidden');
    document.getElementById('authGateCurrentPassField').classList.toggle('ag-hidden', Boolean(knowsCurrentPassword));
    document.getElementById('authGateNewPassField').classList.remove('ag-hidden');
    document.getElementById('authGateSubmit').textContent = 'Tukar Kata Laluan';
    showError('');
    document.getElementById('authGateClose').hidden = requiresLogin();
    document.getElementById('authGateReturn').hidden = !requiresLogin();
    overlayEl.classList.remove('ag-hidden');
    document.getElementById('authGateLogoutBar').classList.add('ag-hidden');
  }

  function hideOverlay() {
    if (overlayEl) overlayEl.classList.add('ag-hidden');
    var bar = document.getElementById('authGateLogoutBar');
    if (bar) bar.classList.toggle('ag-hidden', !sessionVerified || !getToken());
    updateLoginLink();
  }

  function setSubmitBusy(busy, label) {
    var btn = document.getElementById('authGateSubmit');
    btn.disabled = busy;
    if (label) btn.textContent = label;
  }

  function callAdminApi(action, args) {
    return fetch('/api/admin/' + action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ args: args })
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { httpStatus: res.status, data: data };
      });
    });
  }

  function onSubmit() {
    var mode = document.getElementById('authGateNewPassField').classList.contains('ag-hidden') ? 'login' : 'changepassword';
    if (mode === 'login') {
      var email = document.getElementById('authGateEmail').value.trim();
      var password = document.getElementById('authGatePassword').value;
      if (!email || !password) { showError('Sila lengkapkan e-mel dan kata laluan.'); return; }
      showError('');
      setSubmitBusy(true, 'Log masuk…');
      callAdminApi('adminlogin', [email, password]).then(function (r) {
        setSubmitBusy(false, 'Log Masuk');
        if (!r.data || !r.data.ok) { showError((r.data && r.data.error) || 'Ralat log masuk.'); return; }
        setToken(r.data.token);
        setSession(r.data.session);
        sessionVerified = !r.data.mustChangePassword;
        if (r.data.mustChangePassword) {
          cachedCurrentPassword = password;
          showChangePasswordMode(true);
          return;
        }
        cachedCurrentPassword = '';
        hideOverlay();
        if (onReadyCallback) onReadyCallback(r.data.session);
      }).catch(function () {
        setSubmitBusy(false, 'Log Masuk');
        showError('Ralat sambungan. Sila cuba semula.');
      });
      return;
    }

    // mode === 'changepassword'
    var currentField = document.getElementById('authGateCurrentPassField');
    var currentPass = currentField.classList.contains('ag-hidden') ? cachedCurrentPassword : document.getElementById('authGateCurrentPassword').value;
    var newPass = document.getElementById('authGateNewPassword').value;
    if (!currentPass) { showError('Sila masukkan kata laluan semasa.'); return; }
    if (!newPass || newPass.length < 10) { showError('Kata laluan baharu mesti sekurang-kurangnya 10 aksara.'); return; }
    showError('');
    setSubmitBusy(true, 'Menukar…');
    var passwordChanged = false;
    callAdminApi('adminchangeownpassword', [getToken(), currentPass, newPass]).then(function (r) {
      if (!r.data || !r.data.ok) {
        setSubmitBusy(false, 'Tukar Kata Laluan');
        showError((r.data && r.data.error) || 'Ralat menukar kata laluan.');
        return;
      }
      passwordChanged = true;
      cachedCurrentPassword = '';
      var session = getSession();
      var email = (session && session.email) || document.getElementById('authGateEmail').value.trim();
      setSubmitBusy(true, 'Log masuk semula…');
      // Worker invalidates the previous pwdAt token when the password changes.
      return callAdminApi('adminlogin', [email, newPass.trim()]).then(function (login) {
        if (!login.data || !login.data.ok || login.data.mustChangePassword || !login.data.token) throw new Error('Fresh session unavailable');
        setToken(login.data.token);
        setSession(login.data.session);
        sessionVerified = true;
        setSubmitBusy(false, 'Tukar Kata Laluan');
        hideOverlay();
        if (onReadyCallback) onReadyCallback(login.data.session);
      });
    }).catch(function () {
      setSubmitBusy(false, 'Tukar Kata Laluan');
      if (passwordChanged) {
        clearAuth();
        showLoginMode();
        showError('Kata laluan telah ditukar. Sila log masuk dengan kata laluan baharu.');
      } else showError('Ralat sambungan. Sila cuba semula.');
    });
  }

  /* Semak sesi sedia ada (token dalam localStorage) terus dengan server. */
  function verifyExistingSession() {
    var token = getToken();
    if (!token) { unauthenticated(); return Promise.resolve(); }
    return callAdminApi('adminchecksession', [token]).then(function (r) {
      if (r.data && r.data.ok) {
        if (r.data.renewedToken) {
          setToken(r.data.renewedToken);
        }
        setSession(r.data.session);
        sessionVerified = true;
        hideOverlay();
        if (onReadyCallback) onReadyCallback(r.data.session);
        return;
      }
      if (r.data && r.data.code === 'MUST_CHANGE_PASSWORD') {
        sessionVerified = false;
        if (requiresLogin()) showChangePasswordMode(false);
        else { hideOverlay(); updateLoginLink(); }
        return;
      }
      clearAuth();
      unauthenticated();
    }).catch(function () {
      // Ralat rangkaian sementara — kekalkan token/sesi luar talian sedia ada.
      sessionVerified = Boolean(getSession()) && !getSession().mustChangePassword;
      if (sessionVerified) {
        hideOverlay();
        if (onReadyCallback) onReadyCallback(getSession());
      } else unauthenticated();
    });
  }

  /* Panggilan API untuk halaman induk (ptis.html, dsb): sisip Authorization
   * Bearer automatik, dan pulihkan overlay bila server pulangkan 401/403. */
  function fetchWithAuth(url, options) {
    options = options || {};
    var headers = Object.assign({}, options.headers || {});
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, Object.assign({}, options, { headers: headers })).then(function (res) {
      try {
        var renewedHeader = res.headers && typeof res.headers.get === 'function' ? res.headers.get('X-Renewed-Token') : null;
        if (renewedHeader) {
          setToken(renewedHeader);
        }
      } catch (_) {}
      if (res.status === 401 || res.status === 403) {
        return policyPromise.then(function () { return res.clone().json().catch(function () { return {}; }); }).then(function (data) {
          if (data && data.code === 'MUST_CHANGE_PASSWORD') {
            showChangePasswordMode(false);
          } else if (res.status === 401) {
            clearAuth();
            unauthenticated();
          }
          return res;
        });
      }
      return res;
    });
  }

  injectStyles();

  window.AuthGate = {
    init: function (callback, options) {
      onReadyCallback = callback || null;
      optionalPage = Boolean(options && options.optional);
      injectStyles();
      buildOverlay();
      var link = document.getElementById('authGateLoginLink');
      if (link && !link.dataset.authBound) {
        link.dataset.authBound = '1';
        link.addEventListener('click', function (event) {
          event.preventDefault();
          if (getSession() && getSession().mustChangePassword) showChangePasswordMode(false);
          else showLoginMode();
        });
      }
      var logoutLink = document.getElementById('authGateLogoutLink');
      if (logoutLink && !logoutLink.dataset.authBound) {
        logoutLink.dataset.authBound = '1';
        logoutLink.addEventListener('click', function (event) {
          event.preventDefault();
          window.AuthGate.logout();
        });
      }
      policyPromise = loadGatePolicy();
      return policyPromise.then(verifyExistingSession);
    },
    getToken: getToken,
    getSession: getSession,
    fetchWithAuth: fetchWithAuth,
    logout: function () {
      clearAuth();
      window.location.reload();
    }
  };
})();
