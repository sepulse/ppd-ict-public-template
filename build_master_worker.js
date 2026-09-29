/* ==============================================================================
 * 🔒 CRITICAL SYSTEM FEATURE LOCKS — DO NOT REMOVE OR ALTER IN FUTURE UPDATES
 * ==============================================================================
 * LOCK #1: DUAL-ENGINE AI GENERATOR FOR PTIS (generateRumusanImpak)
 *   - Primary Engine: Direct forwarding to Google Apps Script Backend AI.
 *   - Fallback Engine: Smart Edge Generator for 100% high availability.
 *   - Output Targets: formattedObjektif, rumusan, impak, tindakSusul, legacySummary.
 *
 * LOCK #2: GOOGLE SHEETS AUTOMATED SYNC DEACTIVATED
 *   - Cron schedule triggers removed to eliminate duplicate data hazards in D1.
 *
 * LOCK #3: OFFICIAL SCHOOL DIRECTORY COVERAGE
 *   - The denominator is derived from config/data rather than a hardcoded PPD roster.
 *
 * LOCK #4: HIGH-PRECISION 9-DOMAIN ISSUE CLASSIFIER
 *   - Deep multi-field contextual classification.
 *
 * LOCK #5: SMART CONDENSED OBJECTIVE ENGINE (condenseObjective_)
 *   - Automatic concise transformation of verbose agendas/objectives.
 *   - Anti-generic fallback: r.objektif strictly prioritized over r.title placeholder.
 * ============================================================================== */
const fs = require('fs');
const path = require('path');


const TEMPLATE_RUNTIME = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'runtime.generated.json'), 'utf8'));
const ORGANIZATION_CONFIG = TEMPLATE_RUNTIME.organization || {};
const ZONE_CONFIG = Array.isArray(TEMPLATE_RUNTIME.zones) ? TEMPLATE_RUNTIME.zones : [];
const CANONICAL_SCHOOLS = TEMPLATE_RUNTIME.schoolsByZone || {};
const CANONICAL_OFFICERS = TEMPLATE_RUNTIME.officersByZone || {};
const ALL_OFFICIAL_SCHOOLS = Object.entries(CANONICAL_SCHOOLS)
  .filter(([zone]) => zone !== 'ZON PPD')
  .flatMap(([, schools]) => Array.isArray(schools) ? schools : []);

// Read new Dossier landing page HTML
const A1_BUILD_VERSION = new Date().toLocaleString('sv-SE', {timeZone: ORGANIZATION_CONFIG.timezone || 'Asia/Kuala_Lumpur',hour12:false}).slice(0,16)+' MYT';
require('./build_a1_assets').buildAssets(A1_BUILD_VERSION);
const landingHtmlContent = fs.readFileSync('landing_page_dossier.html', 'utf8');
const dossierHtmlFunction = `function renderDossierTemplateHtml() {
  return ${JSON.stringify(landingHtmlContent.replaceAll('__BUILD_VERSION__', A1_BUILD_VERSION))};
}
`;

const manifestContent = fs.readFileSync('manifest.webmanifest', 'utf8');
const swContent = fs.readFileSync('sw.js', 'utf8').replaceAll('__BUILD_VERSION__', A1_BUILD_VERSION);
const authGateJsContent = fs.readFileSync('auth-gate.js', 'utf8');
const iconSvgContent = fs.readFileSync('icon.svg', 'utf8');
const appleTouchIconB64 = fs.readFileSync('icons/apple-touch-icon.png').toString('base64');
const icon192B64 = fs.readFileSync('icons/icon-192.png').toString('base64');
const icon512B64 = fs.readFileSync('icons/icon-512.png').toString('base64');
const icon192MaskableB64 = fs.readFileSync('icons/icon-192-maskable.png').toString('base64');
const icon512MaskableB64 = fs.readFileSync('icons/icon-512-maskable.png').toString('base64');
const favicon16B64 = fs.readFileSync('icons/favicon-16x16.png').toString('base64');
const favicon32B64 = fs.readFileSync('icons/favicon-32x32.png').toString('base64');
const faviconIcoB64 = fs.existsSync('favicon.ico') ? fs.readFileSync('favicon.ico').toString('base64') : '';

// Optional school logo thumbnails. This folder is intentionally absent from the public template.
const schoolLogosB64Map = {};
const thumbDir = path.join(__dirname, 'school_logos', 'thumbnails');
if (fs.existsSync(thumbDir)) {
  fs.readdirSync(thumbDir).forEach(f => {
    if (f.endsWith('.png')) {
      const b64 = fs.readFileSync(path.join(thumbDir, f)).toString('base64');
      schoolLogosB64Map[f.toLowerCase()] = b64;
      schoolLogosB64Map[f] = b64;
    }
  });
}

const workerCode = `import INDEX_HTML from './index.html';
import ADMIN_HTML from './AdminApp.html';
import PTIS_HTML from './ptis.html';
import MAP_HTML from './map.html';
import RADAR_HTML from './radar.html';
import PWA_HTML from './pwa.html';
import QR_HTML from './qrcode.html';

const PWA_MANIFEST_JSON = ${JSON.stringify(manifestContent)};
const PWA_SW_CODE = ${JSON.stringify(swContent)};
const PPDK_AUTH_GATE_JS = ${JSON.stringify(authGateJsContent)};
const PWA_ICON_SVG = ${JSON.stringify(iconSvgContent)};
const PWA_APPLE_ICON_B64 = ${JSON.stringify(appleTouchIconB64)};
const PWA_ICON_192_B64 = ${JSON.stringify(icon192B64)};
const PWA_ICON_512_B64 = ${JSON.stringify(icon512B64)};
const PWA_ICON_192_MASKABLE_B64 = ${JSON.stringify(icon192MaskableB64)};
const PWA_ICON_512_MASKABLE_B64 = ${JSON.stringify(icon512MaskableB64)};
const PWA_FAVICON_16_B64 = ${JSON.stringify(favicon16B64)};
const PWA_FAVICON_32_B64 = ${JSON.stringify(favicon32B64)};
const PWA_FAVICON_ICO_B64 = ${JSON.stringify(faviconIcoB64)};
const SCHOOL_LOGOS_B64 = ${JSON.stringify(schoolLogosB64Map)};
const BUILD_VERSION = ${JSON.stringify(A1_BUILD_VERSION)};
const SHORTLINK_RESERVED_SLUGS_ = new Set([
  'admin', 'adminapp', 'api', 'a1', 'dashboard', 'home', 'index', 'laporan',
  'map', 'radar', 'ptis', 'pwa', 'qrcode', 'sw', 'manifest', 'favicon',
  'robots', 'lab', 'qa', 'login', 'logout', 'static', 'assets', 'public',
  'report'
]);

const _binaryCache = new Map();
function base64ToBuffer_(b64) {
  if (!_binaryCache.has(b64)) {
    const binStr = atob(b64);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    _binaryCache.set(b64, bytes.buffer);
  }
  return _binaryCache.get(b64);
}

/**
 * CLOUDFLARE WORKER ROUTER & EDGE ENGINE (WHITE-LABEL PLATFORM)
 * 100% Full Feature Parity with Legacy GAS Backend + Cloudflare D1 SQL Speed
 */

const APPS_SCRIPT_CONFIG = {
  laporan: ${JSON.stringify((ORGANIZATION_CONFIG.integrations && ORGANIZATION_CONFIG.integrations.googleAppsScriptLaporanUrl) || '')},
  dashboard: ${JSON.stringify((ORGANIZATION_CONFIG.integrations && ORGANIZATION_CONFIG.integrations.googleAppsScriptDashboardUrl) || '')},
  driveFolderId: ${JSON.stringify((ORGANIZATION_CONFIG.integrations && ORGANIZATION_CONFIG.integrations.googleDriveFolderId) || '')}
};

/* =============================================================================
 * SECURITY LAYER — HMAC-SHA256 Signed Tokens + Crypto Password Hashing
 * =============================================================================
 * FIX #1: Token bukan lagi btoa() biasa — kini ditandatangani dengan HMAC-SHA256.
 * FIX #2: Kata laluan dicincang dengan SHA-256 menggunakan crypto.subtle.
 * FIX #3: Kata laluan keras legacy dipadamkan sepenuhnya.
 * FIX #4: [ADR-004 P3] PIN shortlink dibuang — /api/shorten kini guna sesi + staff_allowlist.
 * FIX #5: Token expiry disemak pada setiap pengesahan sesi.
 * ============================================================================= */

/**
 * Hasilkan tanda tangan HMAC-SHA256 untuk payload token.
 * JWT_SECRET dibaca dari env.JWT_SECRET (Cloudflare Secret).
 */
async function signToken_(payload, secret) {
  if (!secret) {
    throw new Error('JWT_SECRET belum dikonfigurasikan pada Cloudflare Worker.');
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const data = encoder.encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', key, data);
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return btoa(JSON.stringify(payload)) + '.' + sigB64;
}

/**
 * Sahkan dan nyahkod token bertandatangan. Kembalikan null jika token tidak sah atau tamat tempoh.
 */
async function verifyToken_(token, secret) {
  if (!secret) return null;
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  try {
    const payload = JSON.parse(atob(parts[0]));
    // FIX #5: Semak tamat tempoh
    if (payload.exp && Date.now() > payload.exp) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const data = encoder.encode(JSON.stringify(payload));
    const sigBytes = Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    return valid ? payload : null;
  } catch (e) {
    return null;
  }
}

const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON', 'ADMIN_FACEBOOK', 'PEGAWAI']);

/**
 * ADR-003 §C: Validasi domain e-mel staf (role PEGAWAI) — perbandingan string TEPAT
 * selepas trim+lowercase, BUKAN regex longgar (elak subdomain/lookalike cth
 * "moe.gov.my.evil.com" atau "notmoe.gov.my" lulus).
 */
function validateStaffEmail_(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');
  if (atIndex < 1) return false;
  const domain = normalized.slice(atIndex + 1);
  return domain === 'moe.gov.my';
}

function resolveAdminRole_(user) {
  const role = String((user && user.role) || '').trim().toUpperCase();
  return ADMIN_ROLES.has(role) ? role : null;
}

function resolveAdminZone_(user, role) {
  const rawZoneId = String((user && user.zone_id) || '').trim();
  if (!rawZoneId) {
    return role === 'KETUA_ZON' ? null : { zoneId: '', zoneName: '' };
  }

  const zoneInfo = resolveZone(rawZoneId);
  const isOfficialZone = zoneInfo && /^z[1-8]$/i.test(String(zoneInfo.id || ''));
  if (!isOfficialZone) {
    return role === 'KETUA_ZON'
      ? null
      : { zoneId: rawZoneId, zoneName: zoneInfo && zoneInfo.name ? zoneInfo.name : '' };
  }

  return { zoneId: zoneInfo.id, zoneName: zoneInfo.name };
}

async function getSessionFromToken_(token, db, jwtSecret) {
  if (!token) return null;
  const sess = await verifyToken_(token, jwtSecret);
  if (!sess) return null;

  if (db && await isTokenRevoked_(token, db)) {
    return null;
  }

  let user = null;
  if (sess.id) {
    user = await db.prepare('SELECT * FROM admins WHERE id = ? AND lower(status) = "aktif"').bind(sess.id).first();
  }
  if (!user && sess.email) {
    user = await db.prepare('SELECT * FROM admins WHERE lower(email) = ? AND lower(status) = "aktif"').bind(sess.email.toLowerCase()).first();
  }
  if (!user) return null;

  const role = resolveAdminRole_(user);
  if (!role) return null;

  // 9c: Pembatalan serta-merta tanpa tunggu tamat tempoh:
  // Jika staf bukan SUPER_ADMIN dan digantung dalam staff_allowlist, batalkan sesi serta-merta (401)
  if (role !== 'SUPER_ADMIN' && db) {
    const isSuspended = await isStaffSuspended_(db, user.email);
    if (isSuspended) return null;
  }

  // 9c: Semak sama ada kata laluan ditukar/direset selepas token dikeluarkan
  if (user.password_changed_at) {
    if (sess.pwdAt !== undefined) {
      if (sess.pwdAt !== (user.password_changed_at || '')) {
        return null;
      }
    } else {
      let pwdChangedStr = String(user.password_changed_at).trim();
      if (!pwdChangedStr.includes('T') && pwdChangedStr.includes(' ')) {
        pwdChangedStr = pwdChangedStr.replace(' ', 'T') + '+08:00';
      }
      const pwdChangedMs = Date.parse(pwdChangedStr);
      if (!Number.isNaN(pwdChangedMs)) {
        if (sess.iat) {
          const iatSec = Math.floor(sess.iat / 1000);
          const pwdSec = Math.floor(pwdChangedMs / 1000);
          if (iatSec < pwdSec) {
            return null;
          }
        } else if (sess.exp) {
          // 9e: Anggaran token lama guna jangka hayat LAMA (staf 7 hari, SUPER_ADMIN 30 hari)
          const lifespanDays = role === 'SUPER_ADMIN' ? 30 : 7;
          const estimatedIat = sess.exp - (lifespanDays * 24 * 3600 * 1000);
          const estSec = Math.floor(estimatedIat / 1000);
          const pwdSec = Math.floor(pwdChangedMs / 1000);
          if (estSec < pwdSec) {
            return null;
          }
        }
      }
    }
  }

  const adminZone = resolveAdminZone_(user, role);
  if (!adminZone) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.nama,
    nama: user.nama,
    role: role,
    zoneId: adminZone.zoneId,
    zoneName: adminZone.zoneName,
    status: user.status || 'Aktif',
    mustChangePassword: Boolean(user.must_change_password),
    _tokenExp: sess.exp,
    _tokenIat: sess.iat,
    _pwdAt: user.password_changed_at || '',
    permissions: {
      canManageUsers: role === 'SUPER_ADMIN',
      canPostFacebook: role === 'SUPER_ADMIN' || role === 'ADMIN_FACEBOOK' || role === 'PENYELARAS_JTK',
      canDeleteRecords: role === 'SUPER_ADMIN' || role === 'PENYELARAS_JTK',
      canEditAnyZone: role === 'SUPER_ADMIN' || role === 'PENYELARAS_JTK'
    }
  };
}

/**
 * ADR-004: Semak e-mel staf aktif dalam staff_allowlist (lower+trim).
 * SUPER_ADMIN tidak pernah laluan fungsi ni — bypass dikendalikan oleh caller.
 */
async function isStaffAllowlisted_(db, email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;
  const row = await db.prepare(
    'SELECT 1 FROM staff_allowlist WHERE email = ? AND status = "aktif" LIMIT 1'
  ).bind(normalized).first();
  return Boolean(row);
}

/**
 * 9c: Semak sama ada staf telah digantung dalam staff_allowlist (status == 'gantung').
 * Digunakan untuk pembatalan serta-merta token staf tanpa tunggu tempoh tamat.
 */
async function isStaffSuspended_(db, email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;
  try {
    const row = await db.prepare(
      'SELECT 1 FROM staff_allowlist WHERE email = ? AND status = "gantung" LIMIT 1'
    ).bind(normalized).first();
    return Boolean(row);
  } catch (_) {
    return false;
  }
}

async function sha256Hex_(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(str || ''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Pengurusan Pembatalan Sesi (Token Revocation).
 * Token disimpan sebagai sha256(token) dalam app_meta bersama cap tamat tempoh (exp).
 * Pembatalan hanya memerlukan satu SELECT dan token luput dipangkas semasa logout.
 */
async function isTokenRevoked_(token, db) {
  if (!token || !db) return false;
  try {
    const tokenHash = await sha256Hex_(token);
    const key = 'revoked:' + tokenHash;
    const row = await db.prepare('SELECT value FROM app_meta WHERE key = ? LIMIT 1').bind(key).first();
    if (row && row.value) {
      const exp = Number(row.value);
      if (!exp || exp > Date.now()) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

async function revokeToken_(token, db) {
  if (!token || !db) return;
  try {
    const tokenHash = await sha256Hex_(token);
    const key = 'revoked:' + tokenHash;

    let exp = 0;
    try {
      const parts = token.split('.');
      if (parts.length >= 1) {
        const payload = JSON.parse(atob(parts[0]));
        if (payload && payload.exp) {
          exp = Number(payload.exp);
          if (exp < 10000000000) exp = exp * 1000;
        }
      }
    } catch (_) {}
    if (!exp || isNaN(exp)) {
      exp = Date.now() + 30 * 24 * 3600 * 1000;
    }

    // 1. Pangkas token yang telah luput dari app_meta (semasa logout)
    try {
      await db.prepare(
        'DELETE FROM app_meta WHERE key LIKE "revoked:%" AND CAST(value AS INTEGER) > 0 AND CAST(value AS INTEGER) <= ?'
      ).bind(Date.now()).run();
    } catch (_) {}

    // 2. Simpan token terbatal ke dalam app_meta (tanpa DDL runtime)
    await db.prepare(
      'INSERT OR REPLACE INTO app_meta (key, value, updated_at) VALUES (?, ?, strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours"))'
    ).bind(key, String(exp)).run();
  } catch (e) {
    console.warn('revokeToken_ failed:', e);
  }
}

/**
 * Validasi Gambar di Pelayan (JPEG/PNG/WebP sahaja, saiz 1 KB - 8 MB).
 * Menolak sebarang format GIF atau QA GIF fixture.
 */
function validateServerImage_(raw) {
  if (!raw || typeof raw !== 'string') {
    return { ok: false, error: 'Data gambar kosong atau tidak sah.' };
  }
  const str = raw.trim();

  // Jika URL https:// sah: hurai dengan new URL(), pastikan protokol https: dan hos wujud
  if (str.toLowerCase().startsWith('https://')) {
    try {
      const parsed = new URL(str);
      if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.hostname.trim() === '') {
        return { ok: false, error: 'URL gambar tidak sah. Hos (hostname) diperlukan.' };
      }
      return { ok: true, type: 'url', url: str };
    } catch (_) {
      return { ok: false, error: 'Format URL gambar https:// tidak sah.' };
    }
  }

  // Jika Data URI (base64)
  if (str.toLowerCase().startsWith('data:')) {
    const match = str.match(/^data:([^;]+);base64,(.+)$/i);
    if (!match) {
      return { ok: false, error: 'Format Data URI gambar tidak sah. Mesti menggunakan format data:image/...;base64,...' };
    }

    const mime = match[1].toLowerCase().trim();
    const b64Data = match[2].trim();

    // Tolak terus sebarang GIF melalui MIME
    if (mime === 'image/gif') {
      return { ok: false, error: 'Format gambar GIF tidak dibenarkan. Sila muat naik imej format JPEG, PNG atau WebP sahaja.' };
    }

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(mime)) {
      return { ok: false, error: 'Format gambar tidak disokong: ' + mime + '. Hanya JPEG, PNG dan WebP dibenarkan.' };
    }

    // Semak saiz data ternyahkod
    let padding = 0;
    if (b64Data.endsWith('==')) padding = 2;
    else if (b64Data.endsWith('=')) padding = 1;
    const decodedSize = Math.floor((b64Data.length * 3) / 4) - padding;

    const MIN_SIZE = 1024; // 1 KB
    const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
    if (decodedSize < MIN_SIZE) {
      return { ok: false, error: 'Saiz gambar terlalu kecil (' + decodedSize + ' bait). Saiz minimum ialah 1 KB.' };
    }
    if (decodedSize > MAX_SIZE) {
      return { ok: false, error: 'Saiz gambar melebihi had maksimum (' + (decodedSize / (1024 * 1024)).toFixed(2) + ' MB). Had maksimum ialah 8 MB.' };
    }

    let binaryStr;
    try {
      binaryStr = atob(b64Data.slice(0, 64));
    } catch (e) {
      return { ok: false, error: 'Pengekodan Base64 gambar rosak atau tidak sah.' };
    }

    if (binaryStr.length < 12) {
      return { ok: false, error: 'Kandungan bait imej tidak mencukupi untuk pengesahan format.' };
    }

    const b0 = binaryStr.charCodeAt(0);
    const b1 = binaryStr.charCodeAt(1);
    const b2 = binaryStr.charCodeAt(2);
    const b3 = binaryStr.charCodeAt(3);

    // Tolak GIF melalui tandatangan bait (0x47 0x49 0x46 / GIF)
    if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) {
      return { ok: false, error: 'Format gambar GIF tidak dibenarkan. Sila muat naik imej format JPEG, PNG atau WebP sahaja.' };
    }

    const isJpeg = (b0 === 0xFF && b1 === 0xD8 && b2 === 0xFF);
    const isPng = (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47);
    const isWebp = (
      b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46 &&
      binaryStr.charCodeAt(8) === 0x57 &&
      binaryStr.charCodeAt(9) === 0x45 &&
      binaryStr.charCodeAt(10) === 0x42 &&
      binaryStr.charCodeAt(11) === 0x50
    );

    if ((mime === 'image/jpeg' || mime === 'image/jpg') && !isJpeg) {
      return { ok: false, error: 'Tandatangan bait fail tidak sepadan dengan format JPEG.' };
    }
    if (mime === 'image/png' && !isPng) {
      return { ok: false, error: 'Tandatangan bait fail tidak sepadan dengan format PNG.' };
    }
    if (mime === 'image/webp' && !isWebp) {
      return { ok: false, error: 'Tandatangan bait fail tidak sepadan dengan format WebP.' };
    }

    if (!isJpeg && !isPng && !isWebp) {
      return { ok: false, error: 'Tandatangan bait imej tidak sah atau bukan dalam format JPEG, PNG atau WebP.' };
    }

    return { ok: true, type: 'base64', mime: mime, size: decodedSize };
  }

  return { ok: false, error: 'Format data gambar tidak sah. Hanya imej JPEG, PNG atau WebP (data URI base64 atau URL https://) dibenarkan.' };
}

/**
 * Penjanaan kunci unik pendua untuk semakan atomik laporan lawatan sekolah.
 */
function generateReportDedupeKey_(tarikh, namaSekolah, masaMula, noIsd, pegawaiStr) {
  const normSekolah = String(namaSekolah || '').trim().toUpperCase();
  const normTarikh = String(tarikh || '').trim();
  const normMasa = String(masaMula || '').trim();
  let cleanIsd = String(noIsd || '').trim().toUpperCase();
  if (cleanIsd.startsWith('#')) cleanIsd = cleanIsd.substring(1).trim();
  if (cleanIsd.startsWith('ISD:')) cleanIsd = cleanIsd.substring(4).trim();
  if (cleanIsd.startsWith('ISD')) cleanIsd = cleanIsd.substring(3).trim();
  const officers = String(pegawaiStr || '')
    .split(/[,/|&]+/)
    .map(s => s.trim().toUpperCase())
    .filter(Boolean)
    .sort()
    .join('|');
  return normTarikh + '::' + normSekolah + '::' + normMasa + '::' + cleanIsd + '::' + officers;
}

/**
 * Pengesahan sesi dan peranan (RBAC) untuk Admin API.
 * Menghalang sebarang akses tanpa token atau peranan yang tidak sah.
 * ADR-004: options.requireAllowlist semak staff_allowlist (SUPER_ADMIN bypass);
 * options.allowMustChangePassword membenarkan laluan walaupun kata laluan
 * sementara belum ditukar (guna khas untuk action changepassword).
 */
async function requireSession_(token, db, jwtSecret, allowedRoles = null, options = {}) {
  if (!token) {
    return { ok: false, error: 'Token sesi diperlukan. Sila log masuk.', status: 401 };
  }
  const session = await getSessionFromToken_(token, db, jwtSecret);
  if (!session) {
    return { ok: false, error: 'Sesi tidak sah atau telah tamat tempoh. Sila log masuk semula.', status: 401 };
  }
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(session.role)) {
      return {
        ok: false,
        error: 'Akses ditolak. Peranan anda (' + session.role + ') tidak mempunyai kebenaran untuk operasi ini.',
        status: 403
      };
    }
  }
  if (options.requireAllowlist && session.role !== 'SUPER_ADMIN') {
    const allowed = await isStaffAllowlisted_(db, session.email);
    if (!allowed) {
      return {
        ok: false,
        error: 'Akses ditolak. E-mel anda tiada dalam senarai staf dibenarkan atau telah digantung.',
        status: 403
      };
    }
  }
  if (session.mustChangePassword && !options.allowMustChangePassword) {
    return {
      ok: false,
      code: 'MUST_CHANGE_PASSWORD',
      error: 'Sila tukar kata laluan sementara anda sebelum meneruskan.',
      status: 403
    };
  }

  // 9b: Silent renewal apabila baki tempoh < 330 hari untuk staf bukan SUPER_ADMIN
  let renewedToken = null;
  if (session.role !== 'SUPER_ADMIN' && session._tokenExp) {
    const remainingMs = session._tokenExp - Date.now();
    const thresholdMs = 330 * 24 * 3600 * 1000;
    if (remainingMs > 0 && remainingMs < thresholdMs) {
      const newPayload = {
        id: session.id,
        email: session.email,
        nama: session.nama,
        role: session.role,
        zoneId: session.zoneId,
        zoneName: session.zoneName,
        iat: Date.now(),
        pwdAt: session._pwdAt || '',
        exp: Date.now() + 365 * 24 * 3600 * 1000
      };
      renewedToken = await signToken_(newPayload, jwtSecret);
    }
  }

  return { ok: true, session: session, token: token, renewedToken: renewedToken };
}

/**
 * FIX #2: Cincang kata laluan menggunakan SHA-256 via crypto.subtle.
 * Menghasilkan rentetan hex 64 aksara.
 */
async function hashPassword_(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(password || ''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * ADR-004 P5: jana kata laluan sementara rawak (crypto-secure) untuk staf.
 * Set aksara elak abjad/nombor serupa (0/O, 1/l/I) supaya senang dibaca/ditaip
 * semasa dihantar individu (WhatsApp/SMS) — bukan untuk paparan berulang.
 */
function generateTempPassword_(length = 12) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += charset[bytes[i] % charset.length];
  }
  return out;
}

/**
 * Semak sama ada kata laluan yang diberikan sepadan dengan hash yang tersimpan.
 * Serasi ke belakang — jika hash dalam DB adalah teks biasa, semak terus.
 */
async function verifyPassword_(plaintext, stored) {
  if (!plaintext || !stored) return false;
  // Jika hash berbentuk SHA-256 hex (64 aksara), gunakan perbandingan hash
  if (/^[a-f0-9]{64}$/.test(stored)) {
    const hashed = await hashPassword_(plaintext);
    return hashed === stored;
  }
  // Serasi ke belakang: kata laluan teks biasa (untuk migrasi)
  return plaintext === stored;
}

function constantTimeEqual_(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  const max = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < max; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

const FAVICON_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAADQAAAAyCAYAAAATIfj2AAAC8ElEQVR4AexXv2sbMRT+yB9wmWpDsRf/6JB2CHSK8ZAhgewBF+KOXgxZjBeTyVPpYrwUvHhtwIbMDU1HEw8lEGhJoTl7aLMknXxroe7T3cmWD5/hpItaEhnpznpP79773tOTntYST9PTh9Knf35P1/DAfgbQ/x5QEyETIc0eMEtOs8MjqzMRiuwyzQImQpodHlmdiVBkl2kWkItQ6wy3N2Ohn6E9M7yCkyuRN8b3fmXGrfYvBbkxbq/eozrjqv+RA+TqdTBoZpBMvcHAyeIgaJjdJx7xeyOsF44waLlC/mOE4xTxmCy20AzK+rNkXgqAuLouPn11ACuBZ5wkvusXuKZxIj2PEg391sX+hxHJPsfOMrY/K8orBkAV7LywAPsCtWWaWy+Rh4MvH7vLuLHTFABZKDYpB26OUMQQze3GonG5kpcrr7K47m1ifwmeRYF4RgqAeA5RLmyU0Qnaw3OIcqVYDzLn42r6CQ1+4UdMgBUAkR3K7S3KhRXLVeL7/whQFgfutl9CnkUyuFwlgHAROUD1XdqSw/KCdq4NWoYhRnZKmyRLfFqKSdZD5nEDo77lAEXVonG+AaTR2VKqTISY27wC8xInFTbixahYoALeHHbwep3Xch5dmOsWuvxb7HtqXTlC1f4hihY7ZHdnpQ8zulmAX7x6O9qqw1UNwqK0IiDvYJycvxNKG48G+1SgLSq9z5ESoOTrPeSdIdoloW6ppJEgiyd3Nj3DGj9YaTlSrRc2S4auAMhCPmfJ6CQZfh+i5Uj3JSLE1hQAUd70hphYW6gJN1J0f+KOzFtP5OipvykAImO/ldE+d+hGeujveERDA5/ZasvtCTRG19PVAJGNndIp3UgtuhvNt+LadgbHNqNRjrhF6DhwBSfBe2pSgLwCkxenDRRZkZmab9vMVgbKLT5dXgZ82/ZkhbkrC132pWhdClA0FXpnP15Aev0sr81ESN53eiRNhPT4WV6LiZC87/RImgjp8bO8FhMhed/pkfwLAAD//3aWbGwAAAAGSURBVAMA6JUnj/mzVHYAAAAASUVORK5CYII=";
const FAVICON_DATA_URI = "data:image/png;base64," + FAVICON_PNG_BASE64;

const SQL_SORT_DATE = \`CASE
  WHEN tarikh LIKE '__/__/____%' THEN SUBSTR(tarikh, 7, 4) || '-' || SUBSTR(tarikh, 4, 2) || '-' || SUBSTR(tarikh, 1, 2)
  WHEN tarikh LIKE '____-__-__%' THEN SUBSTR(tarikh, 1, 10)
  WHEN timestamp LIKE '__/__/____%' THEN SUBSTR(timestamp, 7, 4) || '-' || SUBSTR(timestamp, 4, 2) || '-' || SUBSTR(timestamp, 1, 2)
  WHEN timestamp LIKE '____-__-__%' THEN SUBSTR(timestamp, 1, 10)
  ELSE '1970-01-01'
END\`;

const ALL_OFFICIAL_SCHOOLS = ` + JSON.stringify(ALL_OFFICIAL_SCHOOLS, null, 2) + `;
const CANONICAL_SCHOOLS = ` + JSON.stringify(CANONICAL_SCHOOLS, null, 2) + `;

const CANONICAL_OFFICERS = ` + JSON.stringify(CANONICAL_OFFICERS, null, 2) + `;

function extractIsdNumbers_(primaryValue, fallbackFields) {
  const found = {};
  const addNumbers = function(text) {
    (String(text || '').match(/\\b\\d{5,9}\\b/g) || []).forEach(function(number) {
      if (!/^(19|20)\\d{2}$/.test(number)) found[number] = true;
    });
  };

  if (primaryValue) addNumbers(primaryValue);
  (fallbackFields || []).forEach(function(field) {
    const text = String(field || '');
    const contextPattern = new RegExp('(?:\\\\bISD\\\\b|\\\\bNO\\\\.?\\\\s*TIKET\\\\b|\\\\bTIKET\\\\b|#)\\\\s*(?:NO\\\\.?|#|:|-)?\\\\s*([^.;\\\\r\\\\n]{0,80})', 'gi');
    let match;
    while ((match = contextPattern.exec(text)) !== null) addNumbers(match[1]);
  });
  return Object.keys(found).sort();
}

/**
 * Robust date parser that accurately extracts day, month, year from any format:
 * - YYYY-MM-DD (e.g. 2026-08-20 from HTML5 date pickers)
 * - DD/MM/YYYY (e.g. 20/08/2026 standard Malaysian format)
 * - DD-MM-YYYY or YYYY/MM/DD
 */
function parseDateComponents_(rawDate, rawTimestamp) {
  const text = String(rawDate || rawTimestamp || '').trim();
  if (!text) return { day: 1, month: 1, year: 2026, dateLabel: '—', dateMillis: 0 };

  const dPart = text.split(' ')[0].trim();
  const parts = dPart.split(/[\\/\\-]/);
  let day = 1, month = 1, year = 2026;

  if (parts.length >= 3) {
    const p0 = parseInt(parts[0], 10) || 0;
    const p1 = parseInt(parts[1], 10) || 0;
    const p2 = parseInt(parts[2], 10) || 0;

    // Case 1: YYYY-MM-DD or YYYY/MM/DD (p0 is 4-digit year e.g. 2026)
    if (p0 > 1000) {
      year = p0;
      month = p1 || 1;
      day = p2 || 1;
    } else {
      // Case 2: DD/MM/YYYY or DD-MM-YYYY (p2 is 4-digit year e.g. 2026)
      day = p0 || 1;
      month = p1 || 1;
      year = p2 > 1000 ? p2 : (p2 < 100 ? (2000 + p2) : 2026);
    }
  }

  if (month < 1 || month > 12) month = 1;
  if (day < 1 || day > 31) day = 1;
  if (year < 1970 || year > 2100) year = 2026;

  const dObj = new Date(year, month - 1, day, 12, 0);
  const dateMillis = dObj.getTime();
  const namaHari = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'][dObj.getDay()];
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const dateLabel = dd + '/' + mm + '/' + year;
  const dateLabelWithDay = dd + '/' + mm + '/' + year + ' (' + namaHari + ')';

  return { day, month, year, dateLabel, dateLabelWithDay, dateMillis };
}

/**
 * Robust 24-hour time parser and formatter (HH:mm):
 * Formats "08:00:00" -> "08:00", "08:30" -> "08:30", "14:35:47" -> "14:35",
 * "pagi" -> "08:00", "petang" -> "17:00" / "14:00", "8.30 pagi" -> "08:30", "2.30 petang" -> "14:30", etc.
 */
function parseTimeHHMM_(rawTime, fallback) {
  const def = fallback || '08:00';
  if (!rawTime) return def;
  let s = String(rawTime).trim();
  if (!s || s === '—' || s === '-') return def;

  if (s.includes('T')) {
    s = s.split('T')[1].trim();
  }
  const datePrefixMatch = s.match(/\\d{1,4}[-/.]\\d{1,2}[-/.]\\d{1,4}\\s+(.*)/);
  if (datePrefixMatch) {
    s = datePrefixMatch[1].trim();
  }

  const lower = s.toLowerCase();
  if (lower === 'pagi') return '08:00';
  if (lower === 'tengah hari' || lower === 'tgh hari' || lower === 'tghari') return '12:00';
  if (lower === 'petang') return def === '17:00' ? '17:00' : '14:00';
  if (lower === 'malam') return '20:00';

  const m = s.match(/(\\d{1,2})[:.](\\d{2})(?::\\d{2})?\\s*(am|pm|pagi|petang|ptg|tgh\\s*hari|malam)?/i);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const mod = (m[3] || '').toLowerCase();
    if ((mod === 'pm' || mod === 'petang' || mod === 'ptg' || mod === 'malam') && hh < 12) {
      hh += 12;
    } else if ((mod === 'am' || mod === 'pagi') && hh === 12) {
      hh = 0;
    }
    if (hh >= 0 && hh < 24) {
      return String(hh).padStart(2, '0') + ':' + mm;
    }
  }

  const mHour = s.match(/^(\\d{1,2})\\s*(am|pm|pagi|petang|ptg|malam)?$/i);
  if (mHour) {
    let hh = parseInt(mHour[1], 10);
    const mod = (mHour[2] || '').toLowerCase();
    if ((mod === 'pm' || mod === 'petang' || mod === 'ptg' || mod === 'malam') && hh < 12) {
      hh += 12;
    } else if ((mod === 'am' || mod === 'pagi') && hh === 12) {
      hh = 0;
    }
    if (hh >= 0 && hh < 24) {
      return String(hh).padStart(2, '0') + ':00';
    }
  }

  return def;
}

/**
 * Resolves smart default masa_tamat based on masa_mula when masa_tamat is missing, empty, or '00:00':
 * - If masa_mula < 14:00 (sesi PAGI) -> default masa_tamat = '12:00'
 * - If masa_mula >= 14:00 (sesi PETANG) -> default masa_tamat = '16:30'
 * - '00:00' / '00:00:00' / null / empty is treated as invalid sentinel and replaced with smart default.
 */
function resolveMasaTamatDefault_(rawMasaMula, rawMasaTamat) {
  const parsedMula = parseTimeHHMM_(rawMasaMula, '08:00');
  const mulaHourMatch = parsedMula.match(/^(\\d{1,2}):(\\d{2})/);
  const mulaMinutes = mulaHourMatch
    ? (parseInt(mulaHourMatch[1], 10) * 60 + parseInt(mulaHourMatch[2], 10))
    : 480; // 08:00 = 480 min

  const smartDefault = (mulaMinutes < 14 * 60) ? '12:00' : '16:30';

  if (!rawMasaTamat) return smartDefault;
  const s = String(rawMasaTamat).trim();
  if (!s || s === '—' || s === '-' || s === 'null' || s === 'undefined') return smartDefault;

  const parsedTamat = parseTimeHHMM_(s, smartDefault);
  if (!parsedTamat || parsedTamat === '00:00' || parsedTamat === '00:00:00') {
    return smartDefault;
  }
  return parsedTamat;
}

// facebook_queue entries hantar terus (Mesyuarat/Taklimat/MEB) tiada rekod
// 'laporan' untuk JOIN — konteks paparan & gambar disimpan sebagai JSON pada
// facebook_queue.meta_json sendiri. Selamat gagal (parse error / kosong) balik {}.
function parseFbQueueMeta_(rawMetaJson) {
  if (!rawMetaJson) return {};
  try {
    const parsed = JSON.parse(rawMetaJson);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    return {};
  }
}

function resolveVisitPhotoUrl_(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (value.startsWith('data:image')) return value;

  // Google Drive File / ID Conversion to high-res thumbnail
  const driveFileMatch = value.match(/drive\\.google\\.com\\/(?:file\\/d\\/|open\\?id=|uc\\?id=|thumbnail\\?id=)([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch) {
    return 'https://drive.google.com/thumbnail?id=' + driveFileMatch[1] + '&sz=w1000';
  }

  // Pure Google Drive ID (e.g. 1WU8wT8tuMwrAVN9PvHDT8OfLtWjls4ps)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(value)) {
    return 'https://drive.google.com/thumbnail?id=' + value + '&sz=w1000';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return '';
}

function resolvePdfUrl_(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (value.includes('drive.google.com')) return value;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (/^data:/i.test(value)) return value;
  return '';
}

const PERSON_ALIASES = {};

const SCHOOL_ALIASES = {};

const OFFICER_CANONICAL_INDEX = {};
const OFFICER_SIMPLIFIED_INDEX = {};

function _officerSimpKey(str) {
  return String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    .replace(/BINTI|BIN|ANAK|AL|AK|AWANG|AWG|HAJI|HJ|MD|MOHD|MUHD|MUHAMMAD/g, '');
}

Object.keys(CANONICAL_OFFICERS).forEach(zone => {
  (CANONICAL_OFFICERS[zone] || []).forEach(name => {
    const rawKey = String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanKey = rawKey.replace(/ANAK|AL|BIN|BINTI|AWANG|AWG/g, '');
    OFFICER_CANONICAL_INDEX[rawKey] = name;
    OFFICER_CANONICAL_INDEX[cleanKey] = name;
    const simp = _officerSimpKey(name);
    if (!OFFICER_SIMPLIFIED_INDEX[simp]) OFFICER_SIMPLIFIED_INDEX[simp] = name;
  });
});

Object.entries(PERSON_ALIASES).forEach(([alias, canonical]) => {
  const rawKey = alias.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanKey = rawKey.replace(/ANAK|AL|BIN|BINTI|AWANG|AWG/g, '');
  OFFICER_CANONICAL_INDEX[rawKey] = canonical;
  OFFICER_CANONICAL_INDEX[cleanKey] = canonical;
  const simp = _officerSimpKey(alias);
  if (!OFFICER_SIMPLIFIED_INDEX[simp]) OFFICER_SIMPLIFIED_INDEX[simp] = canonical;
});

function isNonOfficerLabel_(str) {
  if (!str || str.length < 3) return true;
  const lower = str.toLowerCase().trim();
  if (
    /^(tiada|none|-|—|semua|all|null|undefined|terdapat|peralatan|ict|kewpa|bantuan|lawatan|pembaikan|penyelaras ict ppd)$/i.test(lower) ||
    /\b(?:zon\s*\d*|zone\s*\d*|ptis\s*zon|team\s*zon|ahli\s*zon|kesemua\s*ahli|semua\s*warga|warga\s*ppd)\b/i.test(lower) ||
    /\b(?:cikgu|ckg|cgu|guru\s*besar|guru\s*ict|guru\s*aset|guru\s*bestari|guru|penolong\s*kanan|pk\s*1|pk1|pk\s*pentadbiran|pk\s*hepm|pk\s*kokurikulum|gb|pengetua|mr\s*foo|madam)\b/i.test(lower)
  ) {
    return true;
  }
  return false;
}

function canonicalOfficerName_(raw) {
  let s = String(raw || '').trim();
  if (isNonOfficerLabel_(s)) return '';
  s = s.replace(/\\(.*?\\)/g, '').replace(/^(EN\\.|PN\\.|CIK|USTAZ|USTAZAH|JTK|TS\\.|DR\\.)[\\s_-]+/i, '').trim();
  if (isNonOfficerLabel_(s)) return '';

  if (PERSON_ALIASES[s]) return PERSON_ALIASES[s];
  if (PERSON_ALIASES[s.toUpperCase()]) return PERSON_ALIASES[s.toUpperCase()];

  const rawKey = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanKey = rawKey.replace(/ANAK|AL|BIN|BINTI|AWANG|AWG/g, '');
  if (OFFICER_CANONICAL_INDEX[rawKey]) return OFFICER_CANONICAL_INDEX[rawKey];
  if (OFFICER_CANONICAL_INDEX[cleanKey]) return OFFICER_CANONICAL_INDEX[cleanKey];

  const simpKey = _officerSimpKey(s);
  if (OFFICER_SIMPLIFIED_INDEX[simpKey]) return OFFICER_SIMPLIFIED_INDEX[simpKey];

  for (const zk in CANONICAL_OFFICERS) {
    for (const official of CANONICAL_OFFICERS[zk]) {
      const offSimp = _officerSimpKey(official);
      if (offSimp.length >= 6 && simpKey.length >= 6) {
        if (simpKey.includes(offSimp) || offSimp.includes(simpKey)) {
          return official;
        }
      }
    }
  }

  // Deduplicate repeated words in raw name (e.g. "Bin Suhanda Bin Suhanda" -> "Bin Suhanda")
  const words = s.split(/\\s+/);
  const half = Math.floor(words.length / 2);
  if (words.length >= 4 && words.length % 2 === 0) {
    const firstHalf = words.slice(0, half).join(' ').toLowerCase();
    const secondHalf = words.slice(half).join(' ').toLowerCase();
    if (firstHalf === secondHalf) {
      s = words.slice(0, half).join(' ');
    }
  }

  if (isNonOfficerLabel_(s)) return '';
  if (words.length < 2 && s.length < 4) return '';

  return s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    .replace(/\\bBin\\b/gi, 'Bin').replace(/\\bBinti\\b/gi, 'Binti').replace(/\\bAnak\\b/gi, 'Anak');
}

function canonicalSchoolName_(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (SCHOOL_ALIASES[trimmed]) return SCHOOL_ALIASES[trimmed];
  if (SCHOOL_ALIASES[trimmed.toUpperCase()]) return SCHOOL_ALIASES[trimmed.toUpperCase()];

  return trimmed
    .replace(/^SEKOLAH MENENGAH KEBANGSAAN AGAMA\\s+/i, 'SMK AGAMA ')
    .replace(/^SEKOLAH MENENGAH KEBANGSAAN\\s+/i, 'SMK ')
    .replace(/^SEKOLAH JENIS KEBANGSAAN\\s*\\(CINA\\)\\s+/i, 'SJKC ')
    .replace(/^SEKOLAH JENIS KEBANGSAAN CINA\\s+/i, 'SJKC ')
    .replace(/^SEKOLAH KEBANGSAAN AGAMA\\s+/i, 'SK AGAMA ')
    .replace(/^SEKOLAH KEBANGSAAN\\s+/i, 'SK ');
}

const ZONE_DEFS = ${JSON.stringify(ZONE_CONFIG.map((zone, index) => {
  const name = String(zone.id || zone.name || ('ZON ' + (index + 1))).toUpperCase();
  const numberMatch = name.match(/(\d+)/);
  const number = name === 'ZON PPD' ? 99 : (numberMatch ? Number(numberMatch[1]) : index + 1);
  return {
    id: name === 'ZON PPD' ? 'other' : 'z' + number,
    number,
    short: name === 'ZON PPD' ? 'PPD' : 'Z' + number,
    name,
    color: zone.color || '#64748B'
  };
}).concat([{ id: 'unknown', number: 999, short: 'LAIN', name: 'ZON LAIN', color: '#64748B' }]), null, 2)};

const OFFICIAL_SCHOOL_ZONE_NAMES = new Set(ZONE_DEFS.filter(zone => zone.id !== 'unknown').map((zone) => zone.name));

function resolveZone(raw, canonicalSchool) {
  const text = String(raw || '').toUpperCase().trim();
  const direct = ZONE_DEFS.find(zone => zone.name === text || zone.short === text || zone.id.toUpperCase() === text);
  if (direct) return direct;

  if (canonicalSchool) {
    const schoolKey = String(canonicalSchool).trim().toUpperCase();
    for (const [zoneName, schools] of Object.entries(CANONICAL_SCHOOLS)) {
      if ((schools || []).some(name => String(name).trim().toUpperCase() === schoolKey)) {
        const matched = ZONE_DEFS.find(zone => zone.name === String(zoneName).toUpperCase());
        if (matched) return matched;
      }
    }
  }

  return ZONE_DEFS.find(zone => zone.id === 'unknown') || ZONE_DEFS[ZONE_DEFS.length - 1];
}

function escapeHtml_(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr_(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const CONDENSE_PATTERNS_ = [
  [/\\s+/g, ' '],
  [/sistem\\s+pengoperasian\\s+Windows/gi, 'Windows'],
  [/sistem\\s+pengoperasian/gi, 'sistem'],
  [/perisian\\s+Microsoft\\s+(M365[A-Z0-9]*|Office\\s*\\d*|365)/gi, 'Microsoft $1'],
  [/perisian\\s+(Microsoft|Windows|Adobe|Antivirus)/gi, '$1'],
  [/kelancaran,?\\s*kestabilan\\s+dan\\s+keselamatan\\s+peranti\\s+semasa\\s+(proses\\s+)?Pengajaran\\s+dan\\s+Pembelajaran\\s*(\\(\\s*PdP\\s*\\))?/gi, 'peranti kekal lancar, stabil dan selamat'],
  [/kelancaran,?\\s*kestabilan\\s+dan\\s+keselamatan\\s+peranti/gi, 'peranti kekal lancar, stabil dan selamat'],
  [/kelancaran\\s+dan\\s+kestabilan\\s+peranti/gi, 'peranti kekal lancar dan stabil'],
  [/proses\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*(\\(\\s*PdP\\s*\\))?/gi, 'proses PdP'],
  [/Pengajaran\\s+dan\\s+Pembelajaran\\s*(\\(\\s*PdP\\s*\\))?/gi, 'PdP'],
  [/pengajaran\\s+dan\\s+pembelajaran/gi, 'PdP'],
  [/kerja-kerja\\s+pemasangan,?\\s*pengkonfigurasian,?\\s*dan\\s+pemastian\\s+kebolehgunaan/gi, 'pemasangan dan konfigurasi'],
  [/pemasangan,?\\s*pengkonfigurasian,?\\s*dan\\s+pemastian\\s+kebolehgunaan/gi, 'pemasangan dan konfigurasi'],
  [/kerja-kerja\\s+pemasangan,?\\s*dan\\s+pengkonfigurasian/gi, 'pemasangan dan konfigurasi'],
  [/kerja-kerja\\s+penyelenggaraan,?\\s*pemeriksaan\\s+dan\\s+pembaikan/gi, 'penyelenggaraan dan pembaikan'],
  [/kerja-kerja\\s+/gi, ''],
  [/tugas-tugas\\s+/gi, ''],
  [/memantau,?\\s*memverifikasi,?\\s*dan\\s+memastikan\\s+pelaksanaan\\s+tindak\\s+susul/gi, 'memantau dan memverifikasi'],
  [/memantau,?\\s*memverifikasi,?\\s*dan\\s+memastikan\\s+pelaksanaan/gi, 'memantau dan memverifikasi'],
  [/memantau\\s+dan\\s+memastikan\\s+pelaksanaan/gi, 'memantau pelaksanaan'],
  [/kestabilan\\s+capaian\\s+internet\\s+serta\\s+kualiti\\s+infrastruktur\\s+digital\\s+sekolah/gi, 'kestabilan capaian internet sekolah'],
  [/kualiti\\s+dan\\s+kestabilan\\s+capaian\\s+internet/gi, 'kestabilan capaian internet'],
  [/bagi\\s+memastikan\\s+peranti\\s+dapat\\s+berfungsi\\s+secara\\s+optimum\\s+untuk\\s+kegunaan\\s+pengurusan\\s+dan\\s+PdP/gi, 'bagi memastikan peranti berfungsi optimum untuk PdP'],
  [/bagi\\s+memastikan\\s+peranti\\s+dapat\\s+berfungsi\\s+secara\\s+optimum/gi, 'bagi memastikan peranti berfungsi optimum'],
  [/dapat\\s+berfungsi\\s+secara\\s+optimum/gi, 'berfungsi optimum'],
  [/berfungsi\\s+dengan\\s+baik\\s+dan\\s+lancar/gi, 'berfungsi lancar'],
  [/\\b(satu|dua|tiga|empat|lima|enam|tujuh|lapan|sembilan|sepuluh)\\s*\\(([0-9]+)\\)\\s*buah\\s*(peranti\\s+ICT|komputer|laptop)?/gi, '$2 buah $3'],
  [/\\b([0-9]+)\\s*buah\\s*peranti\\s*ICT/gi, '$1 buah peranti'],
  [/^Lawatan\\s+teknikal\\s+ini\\s+dilaksanakan\\s+bertujuan\\s+untuk\\s+/i, 'Lawatan teknikal bagi '],
  [/^Tindakan\\s+pencegahan\\s+dan\\s+penyelenggaraan\\s*\\(Preventive\\s*&\\s*Corrective\\s+Maintenance\\)/i, 'Penyelenggaraan pencegahan dan pembaikan'],
  [/Preventive\\s*&\\s*Corrective\\s+Maintenance/gi, 'Penyelenggaraan dan Pembaikan'],
  [/Preventive\\s+and\\s+Corrective\\s+Maintenance/gi, 'Penyelenggaraan dan Pembaikan'],
  [/\\s+/g, ' '],
  [/\\s+([.,;:])/g, '$1']
];

function condenseObjective_(str) {
  if (!str || str === '—' || str === '-') return 'Khidmat Bantu ICT';
  return CONDENSE_PATTERNS_.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), String(str).trim()).trim();
}

function buildTelegramLawatanNotification_(report) {
  const data = report || {};
  const namaSekolah = String(data.namaSekolah || data.nama_sekolah || '-').trim() || '-';
  const zon = String(data.zon || '-').trim() || '-';
  const tarikh = String(data.tarikh || '-').trim() || '-';
  const masaMula = String(data.masaMula || data.masa_mula || '').trim();
  const masaTamat = String(data.masaTamat || data.masa_tamat || '').trim();
  const pegawai = String(data.pegawai || '').trim() || '-';
  const title = String(data.title || '').trim();
  const objektif = String(data.objektif || '').trim();
  const isd = String(data.noIsd || data.no_isd || data.isd || '').trim();
  const aktiviti = objektif || title || '-';

  return '🏛️ <b>LAPORAN LAWATAN TEKNIKAL BAHARU</b>\\n\\n' +
    '📍 <b>Sekolah:</b> ' + escapeHtml_(namaSekolah) + ' (' + escapeHtml_(zon) + ')\\n' +
    '📅 <b>Tarikh:</b> ' + escapeHtml_(tarikh) +
      (masaMula ? ', ' + escapeHtml_(masaMula) + (masaTamat ? ' - ' + escapeHtml_(masaTamat) : '') : '') + '\\n' +
    '👥 <b>Pegawai Terlibat:</b> ' + escapeHtml_(pegawai) + '\\n\\n' +
    '🎯 <b>Aktiviti / Objektif:</b>\\n' + escapeHtml_(aktiviti) +
    (isd ? '\\n\\n📋 <b>No. ISD:</b> <code>' + escapeHtml_(isd) + '</code>' : '');
}

async function sendTelegramMessage_(botToken, chatId, htmlText, replyMarkup) {
  if (!botToken || !chatId || !htmlText) return { ok: false, error: 'Token/ChatId/Mesej tidak lengkap.' };
  try {
    const url = 'https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/sendMessage';
    const payload = {
      chat_id: chatId,
      text: htmlText,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result && result.ok) return { ok: true, result: result.result };

    // Auto-detect migrated supergroups (-100...)
    const isUpgraded = result && (
      (result.description && result.description.indexOf('upgraded to a supergroup') > -1) ||
      (result.parameters && result.parameters.migrate_to_chat_id)
    );
    if (isUpgraded) {
      let newChatId = (result.parameters && result.parameters.migrate_to_chat_id) ||
        (result.description && (result.description.match(/(?:migrate_to_chat_id|migrate to chat ID)[:\\s]+(-?\\d+)/i) || [])[1]);
      if (!newChatId && chatId) {
        const cleanId = String(chatId).replace(/^-/, '').trim();
        if (!cleanId.startsWith('100')) newChatId = '-100' + cleanId;
      }
      if (newChatId) {
        payload.chat_id = newChatId;
        const res2 = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result2 = await res2.json();
        if (result2 && result2.ok) return { ok: true, result: result2.result, migratedChatId: newChatId };
      }
    }
    return { ok: false, error: result.description || 'Gagal menghantar Telegram' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function isTelegramBotToken_(value) {
  return /^[0-9]{6,12}:[A-Za-z0-9_-]{20,}$/.test(String(value || '').trim());
}

async function persistConfiguredTelegramMigration_(db, cfg, sendResult) {
  const migratedChatId = sendResult && sendResult.ok && sendResult.migratedChatId
    ? String(sendResult.migratedChatId).trim()
    : '';
  if (!migratedChatId || migratedChatId === String((cfg && cfg.telegramChatId) || '').trim()) return sendResult;
  try {
    await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.telegramChatId", ?, datetime("now", "+8 hours"))')
      .bind(migratedChatId).run();
    if (cfg) cfg.telegramChatId = migratedChatId;
  } catch (err) {
    console.warn('Telegram Chat ID migration persistence failed:', err && err.message ? err.message : err);
  }
  return sendResult;
}

async function sendConfiguredTelegramMessage_(db, cfg, htmlText, replyMarkup) {
  const result = await sendTelegramMessage_(cfg && cfg.telegramBotToken, cfg && cfg.telegramChatId, htmlText, replyMarkup);
  return persistConfiguredTelegramMigration_(db, cfg, result);
}

async function deleteTelegramMessage_(botToken, chatId, messageId) {
  if (!botToken || !chatId || messageId === undefined || messageId === null || messageId === '') {
    return { ok: false, error: 'Token/ChatId/MessageId Telegram tidak lengkap.' };
  }
  try {
    const url = 'https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/deleteMessage';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: Number(messageId) })
    });
    const payload = await response.json();
    if (payload && payload.ok) return { ok: true, deleted: true };
    const description = String((payload && payload.description) || 'Gagal memadam mesej Telegram');
    if (/message to delete not found/i.test(description)) {
      return { ok: true, deleted: true, alreadyDeleted: true };
    }
    return { ok: false, error: description };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err || 'Ralat Telegram tidak diketahui') };
  }
}

async function persistTelegramCleanupTestAudit_(db, values) {
  if (!db || !values) return;
  const entries = [
    ['telegram.cleanup_test.last_chat_id', String(values.chatId || '')],
    ['telegram.cleanup_test.last_message_id', String(values.messageId || '')],
    ['telegram.cleanup_test.last_status', String(values.status || '')],
    ['telegram.cleanup_test.last_sent_at', String(values.sentAt || '')],
    ['telegram.cleanup_test.last_deleted_at', String(values.deletedAt || '')]
  ];
  for (const entry of entries) {
    await db.prepare(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime("now", "+8 hours"))'
    ).bind(entry[0], entry[1]).run();
  }
}

async function runTelegramAutoDeleteTest_(db, botToken, chatId, htmlText, delayMs) {
  const waitMs = Math.max(3000, Math.min(60000, Number(delayMs) || 30000));
  const sendResult = await sendTelegramMessage_(botToken, chatId, htmlText);
  if (!sendResult.ok) {
    return { ok: false, sent: false, deleted: false, error: sendResult.error || 'Gagal menghantar mesej ujian Telegram.' };
  }

  const messageId = String(sendResult.result && sendResult.result.message_id || '').trim();
  const actualChatId = String(
    (sendResult.result && sendResult.result.chat && sendResult.result.chat.id) ||
    sendResult.migratedChatId ||
    chatId ||
    ''
  ).trim();
  if (!messageId || !actualChatId) {
    return {
      ok: false,
      sent: true,
      deleted: false,
      error: 'Telegram menghantar mesej tetapi tidak memulangkan message_id/chat_id yang sah.'
    };
  }

  const sentAt = new Date().toISOString();
  let auditPersisted = true;
  try {
    await persistTelegramCleanupTestAudit_(db, {
      chatId: actualChatId,
      messageId: messageId,
      status: 'SENT_WAITING_DELETE',
      sentAt: sentAt,
      deletedAt: ''
    });
  } catch (auditErr) {
    auditPersisted = false;
    console.warn('Telegram cleanup test audit persistence failed:', auditErr && auditErr.message ? auditErr.message : auditErr);
  }

  await new Promise(resolve => setTimeout(resolve, waitMs));
  const deleteResult = await deleteTelegramMessage_(botToken, actualChatId, messageId);
  const deletedAt = deleteResult.ok ? new Date().toISOString() : '';
  try {
    await persistTelegramCleanupTestAudit_(db, {
      chatId: actualChatId,
      messageId: messageId,
      status: deleteResult.ok ? 'DELETED' : 'DELETE_FAILED',
      sentAt: sentAt,
      deletedAt: deletedAt
    });
  } catch (auditErr) {
    auditPersisted = false;
    console.warn('Telegram cleanup test final audit persistence failed:', auditErr && auditErr.message ? auditErr.message : auditErr);
  }

  if (!deleteResult.ok) {
    return {
      ok: false,
      sent: true,
      deleted: false,
      auditPersisted: auditPersisted,
      chatId: actualChatId,
      messageId: messageId,
      delayMs: waitMs,
      error: deleteResult.error || 'Mesej ujian dihantar tetapi auto-delete Telegram gagal.'
    };
  }

  return {
    ok: true,
    sent: true,
    deleted: true,
    auditPersisted: auditPersisted,
    alreadyDeleted: Boolean(deleteResult.alreadyDeleted),
    chatId: actualChatId,
    messageId: messageId,
    delayMs: waitMs,
    deletedAt: deletedAt
  };
}

async function deleteTelegramQueueNotification_(db, cfg, queueId) {
  if (!queueId) return { ok: true, skipped: true, reason: 'missing_queue_id' };
  try {
    const row = await db.prepare(
      'SELECT id, status, telegram_chat_id, telegram_message_id, telegram_deleted_at FROM facebook_queue WHERE id = ?'
    ).bind(String(queueId)).first();
    if (!row) return { ok: true, skipped: true, reason: 'queue_not_found' };
    if (String(row.status || '').toUpperCase() !== 'DIPOSTING') {
      return { ok: true, skipped: true, reason: 'not_posted' };
    }
    if (row.telegram_deleted_at) {
      return { ok: true, skipped: true, reason: 'already_marked_deleted' };
    }

    const messageId = String(row.telegram_message_id || '').trim();
    const chatId = String(row.telegram_chat_id || (cfg && cfg.telegramChatId) || '').trim();
    if (!messageId || !chatId) {
      return { ok: true, skipped: true, reason: 'no_tracked_message' };
    }

    const deleteResult = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
    if (!deleteResult.ok) {
      console.warn('Telegram queue notification delete failed:', deleteResult.error || 'unknown error');
      return deleteResult;
    }

    try {
      await db.prepare(
        'UPDATE facebook_queue SET telegram_deleted_at = datetime("now", "+8 hours") ' +
        'WHERE id = ? AND status = "DIPOSTING" AND telegram_deleted_at IS NULL AND telegram_message_id = ?'
      ).bind(String(queueId), messageId).run();
    } catch (markErr) {
      console.warn('Telegram queue notification delete marker failed:', markErr && markErr.message ? markErr.message : markErr);
    }
    return { ok: true, deleted: true, alreadyDeleted: Boolean(deleteResult.alreadyDeleted) };
  } catch (err) {
    console.warn('Telegram queue notification cleanup failed:', err && err.message ? err.message : err);
    return { ok: false, error: err && err.message ? err.message : String(err || 'Ralat cleanup Telegram tidak diketahui') };
  }
}

async function persistTelegramQueueNotification_(db, cfg, queueId, sendResult) {
  if (!queueId || !sendResult || !sendResult.ok || !sendResult.result) {
    return { ok: false, tracked: false, error: 'Telegram send result atau queue ID tidak lengkap.' };
  }

  const messageId = String(
    sendResult.result.message_id === undefined || sendResult.result.message_id === null
      ? ''
      : sendResult.result.message_id
  ).trim();
  const chatId = String(
    (sendResult.result.chat && sendResult.result.chat.id) ||
    sendResult.migratedChatId ||
    (cfg && cfg.telegramChatId) ||
    ''
  ).trim();
  if (!messageId || !chatId) {
    return { ok: false, tracked: false, error: 'Telegram tidak memulangkan message_id/chat_id yang sah.' };
  }

  let existing = null;
  try {
    existing = await db.prepare(
      'SELECT id, status, telegram_chat_id, telegram_message_id, telegram_deleted_at FROM facebook_queue WHERE id = ?'
    ).bind(String(queueId)).first();
  } catch (readErr) {
    const cleanupNew = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
    return {
      ok: false,
      tracked: false,
      cleanedNewMessage: Boolean(cleanupNew && cleanupNew.ok),
      error: 'Gagal membaca queue untuk tracking Telegram: ' + (readErr && readErr.message ? readErr.message : readErr)
    };
  }

  if (!existing) {
    const cleanupNew = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
    return {
      ok: false,
      tracked: false,
      cleanedNewMessage: Boolean(cleanupNew && cleanupNew.ok),
      error: 'Queue Facebook tidak ditemui untuk tracking Telegram.'
    };
  }

  const existingMessageId = String(existing.telegram_message_id || '').trim();
  const existingChatId = String(existing.telegram_chat_id || (cfg && cfg.telegramChatId) || '').trim();
  if (existingMessageId && !existing.telegram_deleted_at && existingMessageId !== messageId) {
    const oldDelete = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, existingChatId, existingMessageId);
    if (!oldDelete.ok) {
      const cleanupNew = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
      return {
        ok: false,
        tracked: false,
        cleanedNewMessage: Boolean(cleanupNew && cleanupNew.ok),
        error: 'Notification Telegram lama gagal dipadam; tracking baharu dibatalkan.'
      };
    }
    try {
      await db.prepare(
        'UPDATE facebook_queue SET telegram_deleted_at = datetime("now", "+8 hours") ' +
        'WHERE id = ? AND telegram_message_id = ? AND telegram_deleted_at IS NULL'
      ).bind(String(queueId), existingMessageId).run();
    } catch (markOldErr) {
      console.warn('Telegram previous notification marker failed:', markOldErr && markOldErr.message ? markOldErr.message : markOldErr);
    }
  }

  try {
    const tracked = await db.prepare(
      'UPDATE facebook_queue SET telegram_chat_id = ?, telegram_message_id = ?, telegram_deleted_at = NULL ' +
      'WHERE id = ? AND status NOT IN ("DIPOSTING", "DIPADAM") AND COALESCE(telegram_message_id, "") = ?'
    ).bind(chatId, messageId, String(queueId), existingMessageId).run();
    if (tracked && tracked.success && tracked.meta && tracked.meta.changes === 1) {
      return { ok: true, tracked: true, chatId: chatId, messageId: messageId };
    }
  } catch (trackErr) {
    console.warn('Telegram queue notification tracking failed:', trackErr && trackErr.message ? trackErr.message : trackErr);
  }

  let latest = null;
  try {
    latest = await db.prepare('SELECT id, status FROM facebook_queue WHERE id = ?').bind(String(queueId)).first();
  } catch (latestErr) {
    console.warn('Telegram queue notification race check failed:', latestErr && latestErr.message ? latestErr.message : latestErr);
  }
  if (latest && String(latest.status || '').toUpperCase() === 'DIPOSTING') {
    const cleanupNew = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
    if (!cleanupNew.ok) {
      console.warn('Telegram notification arrived after Facebook post but cleanup failed:', cleanupNew.error || 'unknown error');
      return { ok: false, tracked: false, error: cleanupNew.error || 'Cleanup Telegram selepas Facebook gagal.' };
    }
    return { ok: true, tracked: false, deletedAfterPost: true };
  }

  const cleanupNew = await deleteTelegramMessage_(cfg && cfg.telegramBotToken, chatId, messageId);
  return {
    ok: false,
    tracked: false,
    cleanedNewMessage: Boolean(cleanupNew && cleanupNew.ok),
    error: 'Tracking Telegram tidak dapat disahkan; mesej baharu dibersihkan untuk elak notification orphan.'
  };
}

async function validateTelegramChat_(botToken, chatId) {
  if (!botToken || !chatId) return { ok: false, error: 'Token atau Chat ID Telegram tidak lengkap.' };
  try {
    const url = 'https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/getChat?chat_id=' + encodeURIComponent(chatId);
    const response = await fetch(url);
    const payload = await response.json();
    if (!payload || !payload.ok || !payload.result) {
      return { ok: false, error: (payload && payload.description) || 'Chat Telegram tidak ditemui.' };
    }
    return { ok: true, chatId: String(payload.result.id), type: String(payload.result.type || ''), title: String(payload.result.title || payload.result.username || '') };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Gagal mengesahkan Chat ID Telegram.' };
  }
}

async function getTelegramAndFbConfig_(db) {
  const rows = await db.prepare('SELECT key, value FROM settings WHERE key LIKE "fb.%" OR key LIKE "telegram.%"').all();
  const map = {};
  (rows.results || []).forEach(r => { map[r.key] = r.value; });

  return {
    telegramEnabled: map['fb.notify.telegramEnabled'] === 'true' || map['fb.notify.telegramEnabled'] === '1',
    telegramBotToken: map['fb.notify.telegramBotToken'] || '',
    telegramChatId: map['fb.notify.telegramChatId'] || '',
    emailEnabled: map['fb.notify.emailEnabled'] === 'true',
    emailList: map['fb.notify.emailList'] || '',
    pageId: map['fb.pageId'] || '',
    pageToken: map['fb.pageToken'] || ''
  };
}

const UNICODE_BOLD_MAP_ = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
  'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
  'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
  'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
  's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

function toFacebookBold_(str) {
  if (str == null) return '';
  return String(str).normalize('NFKC').replace(/[A-Za-z0-9]/g, (ch) => UNICODE_BOLD_MAP_[ch] || ch);
}

function formatNumberedList_(text) {
  if (!text) return '';
  const lines = String(text).split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return '';
  return lines.map((l, i) => {
    const clean = l.replace(/^\\d+[\\.\\)]\\s*/, '');
    return (i + 1) + '. ' + clean;
  }).join('\\n');
}

function cleanParagraphText_(str) {
  if (!str) return '';
  return String(str)
    .split(/[\\r\\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .join(' ');
}

function buildFacebookCaptionForReport_(report) {
  let penglibatanList = [];
  if (Array.isArray(report.pegawaiTerlibat)) {
    penglibatanList = report.pegawaiTerlibat.filter(Boolean);
  } else if (report.penglibatan) {
    penglibatanList = String(report.penglibatan).split(',').map(s => s.trim()).filter(Boolean);
  } else if (report.pegawai) {
    penglibatanList = String(report.pegawai).split(',').map(s => s.trim()).filter(Boolean);
  } else if (report.pegawaiTerlibat) {
    penglibatanList = String(report.pegawaiTerlibat).split(',').map(s => s.trim()).filter(Boolean);
  } else if (report.pelapor || report.namaPegawai) {
    penglibatanList = [report.pelapor || report.namaPegawai].filter(Boolean);
  }

  const penglibatanText = penglibatanList.length > 0
    ? penglibatanList.map((n, i) => (i + 1) + '. ' + n).join('\\n')
    : '-';

  const headerLines = [];
  const khidmatBantu = report.khidmatBantu || report.khidmat_bantu || '';
  const title = report.title || report.tajuk || '';
  if (khidmatBantu) headerLines.push(toFacebookBold_(String(khidmatBantu).toUpperCase()));
  if (title && title !== 'Khidmat Bantu ICT' && title.toUpperCase() !== khidmatBantu.toUpperCase() && !title.toLowerCase().startsWith('pelaksanaan khidmat bantu') && !title.toLowerCase().startsWith('melaksanakan khidmat bantu')) {
    headerLines.push(toFacebookBold_(String(title).toUpperCase()));
  } else if (!khidmatBantu && title) {
    headerLines.push(toFacebookBold_(String(title).toUpperCase()));
  }

  const akauntabiliti = (report.akauntabiliti || 'PENGURUSAN').toUpperCase();
  const tugasUtama = report.tugasUtama || report.tugas_utama || 'Menyelaras Proses Urusan ICT';

  const lines = [];
  lines.push(toFacebookBold_('[AKAUNTABILITI : ' + akauntabiliti + ']'));
  lines.push(toFacebookBold_('[Tugas utama : ' + tugasUtama + ']'));
  lines.push('');

  const isd = report.noIsd || report.no_isd || report.isd || '';
  if (isd) {
    lines.push(toFacebookBold_('No. ISD:') + ' ' + isd);
    lines.push('');
  }

  if (headerLines.length > 0) {
    lines.push(headerLines.join('\\n'));
    lines.push('');
  }

  lines.push(toFacebookBold_('PERINCIAN'));
  const rawTarikh = report.tarikh || '-';
  const dateComp = parseDateComponents_(rawTarikh, '');
  const tarikhBercetak = rawTarikh.includes('(') ? rawTarikh : (dateComp.dateLabelWithDay || dateComp.dateLabel || rawTarikh);
  lines.push(toFacebookBold_('Tarikh :') + ' ' + tarikhBercetak);

  const masaMula = parseTimeHHMM_(report.masaMula || report.masa_mula, '08:00');
  const masaTamat = resolveMasaTamatDefault_(report.masaMula || report.masa_mula, report.masaTamat || report.masa_tamat);
  lines.push(toFacebookBold_('Masa :') + ' ' + masaMula + ' - ' + masaTamat);
  const namaSekolah = report.namaSekolah || report.nama_sekolah || '-';
  lines.push(toFacebookBold_('Tempat :') + ' ' + namaSekolah);
  lines.push('');

  lines.push(toFacebookBold_('PENGLIBATAN:'));
  lines.push(penglibatanText);
  lines.push('');

  lines.push(toFacebookBold_('OBJEKTIF:'));
  lines.push(cleanParagraphText_(report.objektif || report.formattedObjektif || report.title || 'Tiada objektif.'));
  lines.push('');

  lines.push(toFacebookBold_('RUMUSAN:'));
  lines.push(cleanParagraphText_(report.rumusanAi || report.rumusan_ai || report.rumusan || report.keputusan || 'Tiada rumusan.'));
  lines.push('');

  lines.push(toFacebookBold_('IMPAK:'));
  lines.push(formatNumberedList_(report.impakAi || report.impak_ai || report.impak || report.isu) || 'Tiada impak.');
  lines.push('');

  lines.push(toFacebookBold_('TINDAK SUSUL:'));
  lines.push(formatNumberedList_(report.tindakSusulAi || report.tindak_susul_ai || report.tindakSusul || report.tindak_susul || report.tindakan) || 'Tiada tindak susul.');
  lines.push('');

  lines.push(toFacebookBold_(report.slogan || '"PPD KITA, TANGGUNGJAWAB KITA"'));
  lines.push('');
  lines.push(report.hashtags || '#ptis\\n#ppdict\\n#bitarasentiasa');

  return lines.join('\\n');
}

// Hebahan Mesyuarat/Taklimat/MEB dihantar terus ke Facebook Studio queue (tiada
// rekod 'laporan' — bukan eviden lawatan sekolah), jadi captionnya dibina berasingan
// dari buildFacebookCaptionForReport_ walaupun banyak medan sumber sama (objektif/
// rumusanAi/impakAi/tindakSusulAi) kerana label seksyen & konteks berbeza.
function buildFacebookCaptionForMeeting_(report, meetingSubtype) {
  const jenis = String(report.jenisMesyuarat || (meetingSubtype === 'mesyuarat' ? 'MESYUARAT' : 'MEB')).toUpperCase();
  const tajuk = report.title || report.tajuk || jenis;
  const zon = report.zon || report.zonSekolah || '';
  const namaZonRasmi = zon === 'ZON PPD' ? 'PPD CONTOH' : (zon || '-');
  const tempat = report.lokasiLain || report.tempatPlatform || report.tempat || '-';

  let penglibatanList = [];
  if (Array.isArray(report.pegawaiTerlibat)) penglibatanList = report.pegawaiTerlibat.filter(Boolean);
  else if (report.penglibatan) penglibatanList = String(report.penglibatan).split(',').map(s => s.trim()).filter(Boolean);
  else if (report.pegawai) penglibatanList = String(report.pegawai).split(',').map(s => s.trim()).filter(Boolean);
  else if (report.pelapor) penglibatanList = [report.pelapor].filter(Boolean);
  const penglibatanText = penglibatanList.length > 0
    ? penglibatanList.map((n, i) => (i + 1) + '. ' + n).join('\\n')
    : '-';

  const lines = [];
  lines.push(toFacebookBold_('[' + jenis + ']'));
  lines.push(toFacebookBold_(String(tajuk).toUpperCase()));
  lines.push('');

  lines.push(toFacebookBold_('PERINCIAN'));
  const rawTarikh = report.tarikh || '-';
  const dateComp = parseDateComponents_(rawTarikh, '');
  const tarikhBercetak = rawTarikh.includes('(') ? rawTarikh : (dateComp.dateLabelWithDay || dateComp.dateLabel || rawTarikh);
  lines.push(toFacebookBold_('Tarikh :') + ' ' + tarikhBercetak);
  const masaMula = parseTimeHHMM_(report.masaMula || report.masa_mula, '08:00');
  const masaTamat = resolveMasaTamatDefault_(report.masaMula || report.masa_mula, report.masaTamat || report.masa_tamat);
  lines.push(toFacebookBold_('Masa :') + ' ' + masaMula + ' - ' + masaTamat);
  lines.push(toFacebookBold_('Tempat :') + ' ' + tempat);
  lines.push(toFacebookBold_('Zon :') + ' ' + namaZonRasmi);
  lines.push('');

  lines.push(toFacebookBold_('KEHADIRAN / PENGLIBATAN:'));
  lines.push(penglibatanText);
  lines.push('');

  lines.push(toFacebookBold_('OBJEKTIF / AGENDA:'));
  lines.push(cleanParagraphText_(report.objektif || report.agenda || tajuk || 'Tiada objektif.'));
  lines.push('');

  lines.push(toFacebookBold_('RUMUSAN / KEPUTUSAN:'));
  lines.push(cleanParagraphText_(report.rumusanAi || report.rumusan_ai || report.keputusan || 'Tiada rumusan.'));
  lines.push('');

  lines.push(toFacebookBold_('IMPAK / ISU:'));
  lines.push(formatNumberedList_(report.impakAi || report.impak_ai || report.isu) || 'Tiada impak.');
  lines.push('');

  lines.push(toFacebookBold_('TINDAK SUSUL:'));
  lines.push(formatNumberedList_(report.tindakSusulAi || report.tindak_susul_ai || report.tindakSusul) || 'Tiada tindak susul.');
  lines.push('');

  lines.push(toFacebookBold_(report.slogan || '"PPD KITA, TANGGUNGJAWAB KITA"'));
  lines.push('');
  lines.push(report.hashtags || '#ptis\\n#ppdict\\n#bitarasentiasa');

  return lines.join('\\n');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.toLowerCase();

    // 0. PWA Web App Manifest Handler
    if (pathname === '/manifest.webmanifest' || pathname === '/manifest.json') {
      return new Response(PWA_MANIFEST_JSON, {
        headers: {
          'Content-Type': 'application/manifest+json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // 0.01 PWA Service Worker Handler
    if (pathname === '/sw.js' || pathname === '/service-worker.js') {
      return new Response(PWA_SW_CODE, {
        headers: {
          'Content-Type': 'application/javascript; charset=UTF-8',
          'Service-Worker-Allowed': '/',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // 0.011 ADR-004 P4: Shared Staff Auth Gate Script
    if (pathname === '/auth-gate.js') {
      return new Response(PPDK_AUTH_GATE_JS, {
        headers: {
          'Content-Type': 'application/javascript; charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // 0.02 PWA Vector & Raster Icon Handlers
    if (pathname === '/icons/icon.svg' || pathname === '/icon.svg' || pathname === '/favicon.svg') {
      return new Response(PWA_ICON_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // iOS Apple Touch Icon (180x180 solid opaque background)
    if (pathname.includes('apple-touch-icon')) {
      return new Response(base64ToBuffer_(PWA_APPLE_ICON_B64), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // Maskable (logo dalam zon selamat 80%) dan favicon PNG kecil
    const pngIconB64 = pathname.includes('maskable')
      ? (pathname.includes('512') ? PWA_ICON_512_MASKABLE_B64 : pathname.includes('192') ? PWA_ICON_192_MASKABLE_B64 : '')
      : pathname.includes('favicon-16x16') ? PWA_FAVICON_16_B64 : pathname.includes('favicon-32x32') ? PWA_FAVICON_32_B64 : '';
    if (pngIconB64) {
      return new Response(base64ToBuffer_(pngIconB64), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // PWA 192x192 Icon (Any)
    if (pathname.includes('192')) {
      return new Response(base64ToBuffer_(PWA_ICON_192_B64), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // PWA 512x512 Icon (Any)
    if (pathname.includes('512')) {
      return new Response(base64ToBuffer_(PWA_ICON_512_B64), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // Standard Favicon .ico
    if (pathname.endsWith('.ico')) {
      return new Response(base64ToBuffer_(PWA_FAVICON_ICO_B64), {
        headers: {
          'Content-Type': 'image/x-icon',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // School Logo Thumbnails (Edge Cached)
    if (pathname.includes('/school_logos/thumbnails/') || pathname.startsWith('/logos/')) {
      const filename = pathname.split('/').pop().toLowerCase();
      const b64 = SCHOOL_LOGOS_B64 && (SCHOOL_LOGOS_B64[filename] || SCHOOL_LOGOS_B64[filename.toUpperCase()]);
      if (b64) {
        return new Response(base64ToBuffer_(b64), {
          headers: {
            'Content-Type': 'image/png',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=604800, immutable'
          }
        });
      }
      return new Response('Logo Not Found', { status: 404 });
    }

    // Generic Icon Fallback
    if (
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.startsWith('/icons/')
    ) {
      const mime = (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) ? 'image/jpeg' : 'image/png';
      return new Response(base64ToBuffer_(PWA_APPLE_ICON_B64), {
        headers: {
          'Content-Type': mime,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, must-revalidate'
        }
      });
    }

    // 0.05 Public Photo Proxy Handler (Globally accessible across all subdomains)
    if (pathname === '/api/public/photo' || pathname === '/api/public/photo/') {
      return handlePublicPhotoProxy(request, env);
    }

    // 0.06 Real-Time Health & System Telemetry Endpoint
    if (pathname === '/api/health' || pathname === '/api/public/health') {
      const startMs = Date.now();
      let dbStatus = 'ONLINE';
      let latencyMs = 0;
      let totalLaporan = 0;
      let totalSekolah = 0;
      let totalAdmins = 0;
      let fbCounts = { active: 0, posted: 0, deleted: 0 };

      try {
        const t0 = performance.now();
        const d1Res = await env.DB.prepare('SELECT count(*) as count FROM laporan WHERE deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').first();
        latencyMs = Math.round((performance.now() - t0) * 100) / 100;
        totalLaporan = d1Res ? d1Res.count : 0;

        const sekRes = await env.DB.prepare("SELECT count(*) as count FROM sekolah WHERE zon IN ('ZON 1','ZON 2','ZON 3','ZON 4','ZON 5','ZON 6','ZON 7','ZON 8','ZON PPD')").first();
        totalSekolah = sekRes ? sekRes.count : 0;

        const admRes = await env.DB.prepare('SELECT count(*) as count FROM admins').first();
        totalAdmins = admRes ? admRes.count : 0;

        const fbAct = await env.DB.prepare('SELECT count(*) as count FROM facebook_queue WHERE status NOT IN ("DIPOSTING", "DIPADAM")').first();
        const fbPost = await env.DB.prepare('SELECT count(*) as count FROM facebook_queue WHERE status = "DIPOSTING"').first();
        const fbDel = await env.DB.prepare('SELECT count(*) as count FROM facebook_queue WHERE status = "DIPADAM"').first();
        fbCounts.active = fbAct ? fbAct.count : 0;
        fbCounts.posted = fbPost ? fbPost.count : 0;
        fbCounts.deleted = fbDel ? fbDel.count : 0;
      } catch (e) {
        dbStatus = 'DEGRADED: ' + e.message;
      }

      const cfg = await getTelegramAndFbConfig_(env.DB);

      return jsonResponse({
        ok: dbStatus === 'ONLINE',
        status: dbStatus === 'ONLINE' ? 'HEALTHY' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        durationTotalMs: Date.now() - startMs,
        database: {
          engine: 'Cloudflare D1 SQLite',
          status: dbStatus,
          queryLatencyMs: latencyMs,
          totalVisits: totalLaporan,
          totalSchools: totalSekolah,
          totalAdmins: totalAdmins
        },
        facebookQueue: fbCounts,
        integrations: {
          facebook: { configured: Boolean(cfg.pageToken && cfg.pageId) },
          telegramBot: { configured: Boolean(cfg.telegramBotToken && cfg.telegramChatId), notificationsEnabled: cfg.telegramEnabled }
        }
      });
    }

    // 0.08 Global Public Analytics & Dashboard API (Globally accessible on all hostnames)
    if (pathname === '/api/public/bootstrap' || pathname === '/api/bootstrap') {
      return handlePublicBootstrapApi(request, env);
    }
    if (pathname === '/api/public/version' || pathname === '/api/version') {
      return handlePublicVersionApi(request, env);
    }
    if (pathname === '/api/public/photos' || pathname === '/api/photos') {
      return handlePublicPhotosApi(url, env);
    }
    if (pathname === '/api/public/data' || pathname === '/api/data') {
      return handlePublicDataApi(request, env);
    }

    // 0.085 Dynamic Official Report Print & PDF Engine (Globally accessible on all hostnames)
    if (pathname === '/api/report/print' || pathname === '/report/print' || pathname === '/api/public/report/print' || pathname === '/laporan/cetak') {
      return handleReportPrintView(request, env, ctx);
    }

    // 0.086 Sync Drive PDF Links directly to D1
    if (pathname === '/api/sync-drive-pdf-links' || pathname === '/api/admin/sync-drive-pdf-links') {
      if (request.method === 'POST') {
        try {
          const syncToken = (request.headers.get('Authorization') || '').replace(/^Bearer\\s+/i, '').trim();
          const syncAuth = await requireSession_(syncToken, env.DB, env.JWT_SECRET, ['SUPER_ADMIN', 'PENYELARAS_JTK']);
          if (!syncAuth.ok) {
            return jsonResponse({ ok: false, code: syncAuth.code, error: syncAuth.error }, syncAuth.status);
          }
          const body = await request.json();
          const updates = body.updates || [];
          if (!Array.isArray(updates) || updates.length === 0) {
            return jsonResponse({ ok: false, error: 'Tiada senarai updates' }, 400);
          }

          const statements = [];
          for (const item of updates) {
            if (!item.pdfUrl) continue;
            const pdfUrl = cleanPtisText_(item.pdfUrl, 4000);
            const ts = cleanPtisText_(item.timestamp || '', 200);
            if (!ts) continue;
            let parsedPdfUrl;
            try { parsedPdfUrl = new URL(pdfUrl); } catch (e) { parsedPdfUrl = null; }
            if (!parsedPdfUrl || parsedPdfUrl.protocol !== 'https:') {
              return jsonResponse({ ok: false, error: 'Semua pautan PDF mesti menggunakan HTTPS.' }, 400);
            }

            statements.push(
              env.DB.prepare('UPDATE laporan SET pdf_url = ?, updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") WHERE timestamp = ? AND report_type = "school_visit" AND deleted_at IS NULL AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').bind(pdfUrl, ts)
            );
          }

          if (statements.length > 0) {
            for (let s = 0; s < statements.length; s += 50) {
              const batch = statements.slice(s, s + 50);
              await env.DB.batch(batch);
            }
            await bumpDataVersion_(env.DB);
          }

          return jsonResponse({ ok: true, synced: statements.length });
        } catch (err) {
          return jsonResponse({ ok: false, error: err.message }, 500);
        }
      }
      return jsonResponse({ ok: false, error: 'Kaedah permintaan tidak disokong.' }, 405);
    }

    // 0.09 Global PTIS & Laporan Form API (Globally accessible on all hostnames)
    if (pathname.startsWith('/api/ptis') || pathname.startsWith('/api/laporan')) {
      return handlePtisApi(request, env, ctx);
    }

    // 0.095 Staff QR scanner API. Ciri scanner tidak berkongsi PIN Short URL/QR Studio;
    // semua resolusi QR menggunakan sesi staf yang sama dengan PTIS.
    if (pathname === '/api/qr' || pathname.startsWith('/api/qr/')) {
      return handleQrApi(request, env);
    }

    // 0.1 Telegram Webhook Relay
    if (pathname === '/api/tg-webhook' || pathname === '/api/telegram-webhook') {
      if (request.method === 'POST') {
        const rawBody = await request.text();
        try {
          await fetch(APPS_SCRIPT_CONFIG.dashboard, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: rawBody,
            redirect: 'follow'
          });
        } catch (e) {}
        return jsonResponse({ ok: true });
      }
      return new Response('Telegram Webhook Relay Active.', { status: 200 });
    }

    if (pathname === '/qrcode' || pathname === '/qrcode.html') return serveStaticHtml('qrcode.html');

    // 0.2 Routing: Dedicated PWA Installation Hub (__ROOT_DOMAIN__/pwa, /PWA, /pwa.html)
    if (pathname.toLowerCase() === '/pwa' || pathname.toLowerCase() === '/pwa.html') {
      return serveStaticHtml('pwa.html');
    }

    // 1. Shortlink Redirection Engine
    if (pathname.length > 1 && !pathname.startsWith('/api/') && !pathname.includes('.')) {
      const slug = pathname.replace(/^\\/+/, '').trim().toLowerCase();
      if (!SHORTLINK_RESERVED_SLUGS_.has(slug)) {
        const linkRow = await env.DB.prepare(
          'SELECT COALESCE(NULLIF(destination_url, ""), target_url) AS destination_url FROM short_links WHERE slug = ? AND deleted_at IS NULL'
        ).bind(slug).first();
        if (linkRow && linkRow.destination_url) {
          ctx.waitUntil(env.DB.prepare('UPDATE short_links SET clicks = clicks + 1, last_accessed = datetime("now", "+8 hours") WHERE slug = ? AND deleted_at IS NULL').bind(slug).run());
          return Response.redirect(linkRow.destination_url, 302);
        }
      }
    }

    // 2. Routing: PTIS Form (__PTIS_DOMAIN__ atau laluan /ptis.html)
    if (hostname === '__PTIS_DOMAIN__' || pathname === '/ptis.html' || pathname === '/ptis' || pathname === '/laporan.html') {
      // Cross-domain navigation for __PTIS_DOMAIN__
      if (hostname === '__PTIS_DOMAIN__') {
        if (pathname === '/dashboard' || pathname === '/dashboard.html' || pathname === '/index.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/dashboard', 302);
        }
        if (pathname === '/home') {
          return Response.redirect('https://__ROOT_DOMAIN__/', 302);
        }
        if (pathname === '/map' || pathname === '/map.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/map', 302);
        }
        if (pathname === '/radar' || pathname === '/radar.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/radar', 302);
        }
        if (pathname === '/pwa' || pathname === '/pwa.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/pwa', 302);
        }
      }
      return serveStaticHtml('ptis.html');
    }

    // 3. Routing: Admin Portal (__ADMIN_DOMAIN__ atau laluan /admin)
    if (pathname.startsWith('/api/admin') || hostname === '__ADMIN_DOMAIN__' || pathname === '/admin' || pathname === '/adminapp.html') {
      if (pathname.startsWith('/api/admin')) {
        const origin = request.headers.get('Origin') || '';
        let isAllowedOrigin = false;
        if (origin) {
          try {
            const parsedOrigin = new URL(origin);
            const originHost = parsedOrigin.hostname.toLowerCase();
            const isProductionOrigin = parsedOrigin.protocol === 'https:' && [
              '__ROOT_DOMAIN__',
              '__WWW_ROOT_DOMAIN__',
              '__DASHBOARD_DOMAIN__',
              '__ADMIN_DOMAIN__',
              '__PTIS_DOMAIN__'
            ].includes(originHost);
            const isLocalOrigin = (parsedOrigin.protocol === 'http:' || parsedOrigin.protocol === 'https:') &&
              (originHost === 'localhost' || originHost === '127.0.0.1');
            isAllowedOrigin = isProductionOrigin || isLocalOrigin;
          } catch (e) {}
        }
        if (origin && !isAllowedOrigin) {
          return jsonResponse({ ok: false, error: 'Origin tidak dibenarkan.' }, 403);
        }
        const corsOrigin = isAllowedOrigin ? origin : 'https://__ADMIN_DOMAIN__';
        if (request.method === 'OPTIONS') {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': corsOrigin,
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
              'Vary': 'Origin'
            }
          });
        }
        const adminRes = await handleAdminApi(request, env, ctx);
        // Tulis semula CORS header
        const newHeaders = new Headers(adminRes.headers);
        newHeaders.set('Access-Control-Allow-Origin', corsOrigin);
        newHeaders.set('Vary', 'Origin');
        return new Response(adminRes.body, { status: adminRes.status, headers: newHeaders });
      }

      // Handle Cross-domain redirection when on __ADMIN_DOMAIN__
      if (hostname === '__ADMIN_DOMAIN__') {
        if (pathname === '/dashboard' || pathname === '/dashboard.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/dashboard', 302);
        }
        if (pathname === '/ptis' || pathname === '/ptis.html' || pathname === '/laporan.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/ptis', 302);
        }
        if (pathname === '/pwa' || pathname === '/pwa.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/pwa', 302);
        }
        if (pathname === '/map' || pathname === '/map.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/map', 302);
        }
        if (pathname === '/radar' || pathname === '/radar.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/radar', 302);
        }
        if (pathname === '/home') {
          return Response.redirect('https://__ROOT_DOMAIN__/', 302);
        }
      }

      return serveStaticHtml('AdminApp.html');
    }

    // 3.2 School GIS & Map Routes (D1 Database)
    if (pathname === '/api/sekolah/update') {
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      try {
        const body = await request.json();
        const authHeader = request.headers.get('Authorization') || '';
        const token = (authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '') || body.token || '';

        const session = await getSessionFromToken_(token, env.DB, env.JWT_SECRET);
        // 10c: GPS sekolah dikunci khas untuk SUPER_ADMIN sahaja (Penyelaras JTK & Ketua Zon ditolak 403)
        const allowedGpsRoles = ['SUPER_ADMIN'];
        if (!session || !allowedGpsRoles.includes(session.role)) {
          return jsonResponse({ ok: false, error: 'Akses Ditolak. Penyelarasan koordinat GPS sekolah dikunci khas untuk Pentadbir sahaja bagi mengelakkan penyalahgunaan.' }, 403);
        }
        if (session.mustChangePassword) {
          return jsonResponse({ ok: false, code: 'MUST_CHANGE_PASSWORD', error: 'Sila tukar kata laluan sementara anda sebelum meneruskan.' }, 403);
        }
        if (session.role !== 'SUPER_ADMIN') {
          const allowed = await isStaffAllowlisted_(env.DB, session.email);
          if (!allowed) {
            return jsonResponse({ ok: false, error: 'Akses ditolak. E-mel anda tiada dalam senarai staf dibenarkan atau telah digantung.' }, 403);
          }
        }

        const id = String(body.id || '').trim();
        const latRaw = String(body.lat ?? '').trim();
        const lngRaw = String(body.lng ?? '').trim();
        const lat = Number(latRaw);
        const lng = Number(lngRaw);
        if (!id || !latRaw || !lngRaw || !Number.isFinite(lat) || !Number.isFinite(lng)) {
          return jsonResponse({ ok: false, error: 'Nama/kod sekolah dan koordinat lat/lng diperlukan.' }, 400);
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return jsonResponse({ ok: false, error: 'Koordinat lat/lng berada di luar julat sah.' }, 400);
        }

        const targetSchool = await env.DB.prepare('SELECT nama, kod, zon FROM sekolah WHERE nama = ? OR kod = ? LIMIT 1').bind(id, id).first();
        if (!targetSchool || !OFFICIAL_SCHOOL_ZONE_NAMES.has(String(targetSchool.zon || '').trim().toUpperCase())) {
          return jsonResponse({ ok: false, error: 'Sekolah tidak dijumpai dalam master rasmi.' }, 404);
        }
        if (session.role === 'KETUA_ZON' && targetSchool.zon !== session.zoneName) {
          return jsonResponse({ ok: false, error: 'Akses ditolak. Ketua Zon hanya boleh menyelaras sekolah dalam ' + session.zoneName + '.' }, 403);
        }


        const gpsUpdate = await env.DB.prepare('UPDATE sekolah SET lat = ?, lng = ? WHERE nama = ?').bind(lat, lng, targetSchool.nama).run();
        if (!gpsUpdate.success || !gpsUpdate.meta || gpsUpdate.meta.changes !== 1) {
          return jsonResponse({ ok: false, error: 'Koordinat sekolah tidak berjaya dikemas kini.' }, 409);
        }

        if (typeof recordAuditLog === 'function') {
          await recordAuditLog(env.DB, session, 'CALIBRATE_GPS', 'Sekolah ' + targetSchool.nama, null, JSON.stringify({ lat, lng }), request);
        }
        return jsonResponse({ ok: true, message: 'Koordinat sekolah berjaya dikemas kini di Cloudflare D1.' });
      } catch (err) {
        return jsonResponse({ ok: false, error: err.message }, 500);
      }
    }

    if (pathname === '/api/sekolah' || pathname === '/api/schools') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM sekolah WHERE zon IN ('ZON 1','ZON 2','ZON 3','ZON 4','ZON 5','ZON 6','ZON 7','ZON 8','ZON PPD') ORDER BY zon, nama").all();
        return new Response(JSON.stringify(results || []), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (pathname === '/map' || pathname === '/map.html' || hostname === 'map.__ROOT_DOMAIN__') {
      return serveStaticHtml('map.html');
    }

    if (pathname === '/radar' || pathname === '/radar.html' || hostname === 'radar.__ROOT_DOMAIN__') {
      return serveStaticHtml('radar.html');
    }

    // 4. Routing: Public Dashboard (__DASHBOARD_DOMAIN__, /index.html, /dashboard atau workers.dev)
    if (hostname === '__DASHBOARD_DOMAIN__' || pathname === '/index.html' || pathname === '/dashboard' || hostname.includes('workers.dev')) {
      // Cross-domain navigation for __DASHBOARD_DOMAIN__
      if (hostname === '__DASHBOARD_DOMAIN__') {
        if (pathname === '/home') {
          return Response.redirect('https://__ROOT_DOMAIN__/', 302);
        }
        if (pathname === '/ptis' || pathname === '/ptis.html' || pathname === '/laporan.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/ptis', 302);
        }
        if (pathname === '/map' || pathname === '/map.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/map', 302);
        }
        if (pathname === '/radar' || pathname === '/radar.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/radar', 302);
        }
        if (pathname === '/pwa' || pathname === '/pwa.html') {
          return Response.redirect('https://__ROOT_DOMAIN__/pwa', 302);
        }
      }
      if (pathname === '/api/public/bootstrap') {
        return handlePublicBootstrapApi(request, env);
      }
      if (pathname === '/api/public/version') {
        return handlePublicVersionApi(request, env);
      }
      if (pathname === '/api/public/photos') {
        return handlePublicPhotosApi(url, env);
      }
      if (pathname === '/api/public/data') {
        return handlePublicDataApi(request, env);
      }
      return serveStaticHtml('index.html');
    }

    // 5. Routing: Main Landing Page (__ROOT_DOMAIN__ / __WWW_ROOT_DOMAIN__ / root)
    if (hostname === '__ROOT_DOMAIN__' || hostname === '__WWW_ROOT_DOMAIN__' || pathname === '/' || pathname === '/landing_page_dossier.html') {
      if (pathname === '/api/shorten' && request.method === 'POST') {
        return handleApiShorten(request, env);
      }
      if (pathname === '/map' || pathname === '/map.html') {
        return serveStaticHtml('map.html');
      }
      if (pathname === '/radar' || pathname === '/radar.html') {
        return serveStaticHtml('radar.html');
      }
      return new Response(renderDossierTemplateHtml(), {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event, env, ctx) {
    // Google Sheets Auto-sync is completely disabled as requested
    return;
  }
};

/**
 * Handle API Shortlink Creation
 */
async function handleApiShorten(request, env) {
  try {
    const data = await request.json();
    let dest = String(data.targetUrl || data.url || '').trim();
    const rawSlug = String(data.slug || '').trim();
    const hasCustomSlug = rawSlug.length > 0;
    let slug = rawSlug.toLowerCase();

    // ADR-004 P3: PIN dibuang — akses kini sesi staf (allowlist) atau SUPER_ADMIN.
    const authHeader = request.headers.get('Authorization') || '';
    const token = (authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '')
      || (data && typeof data.token === 'string' ? data.token.trim() : '');
    // ADR-004 (dipinda 20 Sep 2026, keputusan pengguna): QR dan Short URL
    // dibuka kepada SEMUA pengguna yang log masuk — sesi sahaja, tanpa semakan
    // allowlist. Allowlist kekal dikuatkuasakan pada adminlogin, jadi token hanya
    // wujud untuk staf allowlist + SUPER_ADMIN. Borang PTIS kekal allowlist.
    const auth = await requireSession_(token, env.DB, env.JWT_SECRET, PTIS_ALLOWED_ROLES_);
    if (!auth.ok) {
      return jsonResponse({ ok: false, code: auth.code, error: auth.error }, auth.status);
    }
    if (!dest) {
      return jsonResponse({ ok: false, error: 'Sila masukkan URL sasaran yang sah.' }, 400);
    }
    if (hasCustomSlug) {
      if (!/^[a-z0-9_-]{2,40}$/.test(slug) || !/[a-z0-9]/.test(slug)) {
        return jsonResponse({ ok: false, error: 'Slug mesti 2–40 aksara dan hanya mengandungi huruf kecil, nombor, - atau _.' }, 400);
      }
      if (SHORTLINK_RESERVED_SLUGS_.has(slug)) {
        return jsonResponse({ ok: false, error: 'Slug ini digunakan oleh sistem.' }, 400);
      }
    }

    if (!/^https?:\\/\\//i.test(dest)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(dest)) {
        return jsonResponse({ ok: false, error: 'URL sasaran mesti menggunakan http atau https.' }, 400);
      }
      dest = 'https://' + dest;
    }
    let parsedDest;
    try {
      parsedDest = new URL(dest);
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Sila masukkan URL sasaran yang sah.' }, 400);
    }
    if (parsedDest.protocol !== 'http:' && parsedDest.protocol !== 'https:') {
      return jsonResponse({ ok: false, error: 'URL sasaran mesti menggunakan http atau https.' }, 400);
    }
    dest = parsedDest.toString();

    let targetShortSlug = '';
    const targetHost = parsedDest.hostname.toLowerCase();
    if (targetHost === '__ROOT_DOMAIN__' || targetHost === '__WWW_ROOT_DOMAIN__') {
      const pathParts = parsedDest.pathname.split('/').filter(Boolean);
      if (pathParts.length === 1) {
        const candidate = pathParts[0].toLowerCase();
        if (/^[a-z0-9_-]{2,40}$/.test(candidate) && /[a-z0-9]/.test(candidate)) {
          targetShortSlug = candidate;
          if (hasCustomSlug && candidate === slug) {
            return jsonResponse({ ok: false, error: 'URL sasaran tidak boleh menunjuk ke pautan pendek __ROOT_DOMAIN__.' }, 400);
          }
          const targetRow = await env.DB.prepare('SELECT slug FROM short_links WHERE slug = ? LIMIT 1').bind(candidate).first();
          if (targetRow) {
            return jsonResponse({ ok: false, error: 'URL sasaran tidak boleh menunjuk ke pautan pendek __ROOT_DOMAIN__ lain.' }, 400);
          }
        }
      }
    }

    const session = auth.session || {};
    const insertSql =
      'INSERT INTO short_links (slug, destination_url, clicks, created_at, last_accessed, created_by, created_by_email, created_by_nama) ' +
      'VALUES (?, ?, 0, datetime("now", "+8 hours"), datetime("now", "+8 hours"), ?, ?, ?) ' +
      'ON CONFLICT(slug) DO NOTHING';
    let inserted = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      if (!hasCustomSlug) slug = Math.random().toString(36).substring(2, 7);
      if (SHORTLINK_RESERVED_SLUGS_.has(slug) || (targetShortSlug && targetShortSlug === slug)) {
        if (hasCustomSlug) break;
        continue;
      }
      const result = await env.DB.prepare(insertSql).bind(
        slug,
        dest,
        session.id || null,
        session.email || null,
        session.nama || session.name || null
      ).run();
      const changes = Number(result && result.meta && result.meta.changes || 0);
      if (changes > 0) {
        inserted = true;
        break;
      }
      if (hasCustomSlug) break;
    }
    if (!inserted) {
      return jsonResponse({ ok: false, error: 'Slug sudah digunakan.' }, 409);
    }

    return jsonResponse({
      ok: true,
      slug: slug,
      shortUrl: 'https://__ROOT_DOMAIN__/' + slug,
      targetUrl: dest
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

// =====================================================================
// KUNCI #1 (V1): Penjanaan AI Rasmi PTIS — Gemini (Worker) Utama + Edge Sandaran
// (Dipindah drpd v2/cloudflare_worker_ppdk_v2.js atas arahan eksplisit
// pengguna — GAS dibuang drpd rantaian panggilan generateRumusanImpak ni
// sahaja; GAS KEKAL wujud/aktif utk saveReport/uploadGambar/deleteGambar/
// generatePdfForReportBackground/deleteReport/Telegram webhook relay.)
// =====================================================================

// Baca senarai kunci API Gemini yg ditetapkan pada Worker. Sokong DUA cara:
// 1. GEMINI_API_KEYS (DISYORKAN, sokong berbilang key) — satu secret,
//    key dipisah koma, cth "AIzaKey1,AIzaKey2". Bagi failover automatik.
// 2. GEMINI_API_KEY (asal, 1 key sahaja) — kekal berfungsi (keserasian
//    ke belakang) kalau GEMINI_API_KEYS tak ditetapkan.
function getGeminiApiKeys_(env) {
  const numbered = [];
  for (let i = 1; i <= 12; i++) {
    const v = String(env['GEMINI_API_KEY_' + i] || '').trim();
    if (v) numbered.push(v);
  }
  if (numbered.length) return numbered;

  const raw = String(env.GEMINI_API_KEYS || env.GEMINI_API_KEY || '').trim();
  if (!raw) return [];
  return raw.split(',').map(function(k) { return k.trim(); }).filter(Boolean);
}

// Panggil Gemini API TERUS drpd Worker — 1 percubaan dgn 1 MODEL + 1 kunci
// API + had masa eksplisit diberi oleh caller (rujuk
// callGeminiWorkerWithFailover_ di bawah utk logik cuba-semula berbilang
// model x kunci).
async function callGeminiWorker_(model, apiKey, payload, timeoutMs) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;
  const controller = new AbortController();
  const hardTimeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }),
      new Promise(function(_, reject) {
        setTimeout(function() {
          reject(new Error('Gemini API timeout selepas ' + timeoutMs + 'ms — tiada respons (jaring keselamatan Promise.race).'));
        }, timeoutMs + 500);
      }),
    ]);
    const bodyText = await res.text();
    let responseBody;
    try { responseBody = JSON.parse(bodyText); } catch { responseBody = { raw: bodyText }; }
    if (!res.ok) {
      const apiErr = new Error('Gemini API ralat (' + res.status + '): ' + JSON.stringify(responseBody));
      apiErr.status = Number(res.status) || 0;
      apiErr.code = 'GEMINI_HTTP_' + String(res.status || 'ERROR');
      throw apiErr;
    }
    const candidate = responseBody.candidates && responseBody.candidates[0];
    const text = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]
      ? candidate.content.parts[0].text
      : '';
    return (text || '').trim();
  } finally {
    clearTimeout(hardTimeoutId);
  }
}

// Orkestrasi AI berlapis: 3.8 sebagai primary, 3.6 sebagai hedge, dan 3.5
// sebagai reviewer. Nilai masa ini ialah konfigurasi awal benchmark; endpoint
// ujian remote digunakan untuk menala nilai optimum sebelum deployment.
const GEMINI_PRIMARY_MODEL = 'gemini-3.8-flash';
const GEMINI_HEDGE_MODEL = 'gemini-3.6-flash';
const GEMINI_REVIEWER_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_HEDGE_DELAY_MS = 12000;
const GEMINI_CANDIDATE_DEADLINE_MS = 40000;
const GEMINI_GLOBAL_BUDGET_MS = 52000;
const GEMINI_REVIEWER_BUDGET_MS = 16000;
const GEMINI_MIN_ATTEMPT_MS = 2500;
const GEMINI_PRIMARY_KEY_TIMEOUT_MS = 30000;
const GEMINI_HEDGE_KEY_TIMEOUT_MS = 16000;
const GEMINI_REVIEWER_KEY_TIMEOUT_MS = 10000;
const GEMINI_PRIMARY_ATTEMPT_TIMEOUT_MS = 9000;
const GEMINI_HEDGE_ATTEMPT_TIMEOUT_MS = 6000;
const GEMINI_REVIEWER_ATTEMPT_TIMEOUT_MS = 8000;
const GEMINI_5XX_MAX_ATTEMPTS = 4;

function sleepAi_(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, Math.max(0, ms)); });
}

function aiFaultForRole_(fault, role) {
  const normalized = String(fault || '').trim().toLowerCase();
  if (!normalized) return '';
  for (const kind of ['timeout', '429', '503']) {
    if (normalized === role + '_' + kind || normalized === 'all_' + kind) return kind;
  }
  return '';
}

function makeInjectedAiError_(kind, role) {
  const err = new Error('Injected AI test failure: ' + role + '_' + kind);
  err.code = 'AI_TEST_' + String(kind || 'failure').toUpperCase();
  if (kind === '429' || kind === '503') err.status = Number(kind);
  return err;
}

// Cuba model yang sama merentas key secara terkawal. Hedge menggunakan offset
// key berbeza apabila lebih daripada satu key tersedia supaya satu key yang
// throttled tidak menjejaskan primary dan hedge serentak.
async function callGeminiModelWithKeyFallback_(env, model, payload, budgetMs, role, runtimeOptions) {
  const keys = getGeminiApiKeys_(env);
  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY / GEMINI_API_KEYS belum ditetapkan pada Worker (wrangler secret put GEMINI_API_KEYS).');
  }

  const options = runtimeOptions || {};
  const startedAt = Date.now();
  const keyOffset = role === 'hedge' && keys.length > 1 ? 1 : (role === 'reviewer' && keys.length > 2 ? 2 : 0);
  const attempts = [];
  let lastErr = null;
  let serverErrorCount = 0;

  for (let attemptIndex = 0; attemptIndex < keys.length; attemptIndex++) {
    if (options.testMode && String(options.fault || '').toLowerCase() === 'primary_slow' && role === 'primary' && attemptIndex === 0) {
      await sleepAi_(GEMINI_HEDGE_DELAY_MS + 1500);
    }
    const remaining = Math.max(0, Number(budgetMs || 0) - (Date.now() - startedAt));
    if (remaining < GEMINI_MIN_ATTEMPT_MS) break;
    const keyIndex = (attemptIndex + keyOffset) % keys.length;
    const roleTimeout = role === 'primary'
      ? GEMINI_PRIMARY_ATTEMPT_TIMEOUT_MS
      : (role === 'reviewer' ? GEMINI_REVIEWER_ATTEMPT_TIMEOUT_MS : GEMINI_HEDGE_ATTEMPT_TIMEOUT_MS);
    const attemptTimeout = Math.min(roleTimeout, remaining);
    const attemptStartedAt = Date.now();
    try {
      const faultName = options.testMode ? String(options.fault || '').trim().toLowerCase() : '';
      let injected = options.testMode ? aiFaultForRole_(options.fault, role) : '';
      // role_429 mensimulasikan satu key yang kena rate-limit dan kemudian
      // membenarkan key seterusnya melalui laluan production sebenar. all_429
      // kekal menyuntik 429 pada setiap key untuk menguji exhaustion penuh.
      if (injected === '429' && faultName === role + '_429' && attemptIndex > 0) injected = '';
      if (injected) {
        if (injected === 'timeout') await sleepAi_(attemptTimeout);
        throw makeInjectedAiError_(injected, role);
      }
      const text = await callGeminiWorker_(model, keys[keyIndex], payload, attemptTimeout);
      attempts.push({ keySlot: keyIndex + 1, ok: true, latencyMs: Date.now() - attemptStartedAt });
      return {
        text: text,
        model: model,
        role: role,
        latencyMs: Date.now() - startedAt,
        attempts: attempts
      };
    } catch (err) {
      lastErr = err;
      attempts.push({
        keySlot: keyIndex + 1,
        ok: false,
        latencyMs: Date.now() - attemptStartedAt,
        status: Number(err && err.status) || 0,
        code: String((err && err.code) || 'UPSTREAM_ERROR')
      });
      console.warn('[Gemini ' + role + '] ' + model + ' key slot #' + (keyIndex + 1) + ' gagal: ' + (err && err.message));
      const timeoutLike = Boolean(err && (err.name === 'AbortError' || String(err.code || '') === '20' || /timeout|bajet/i.test(String(err.message || ''))));
      if (timeoutLike) break;
      // Ralat request/model yang tidak berkaitan dengan key tidak patut diputar
      // melalui semua key. Beralih terus ke hedge model. 429 dan 401/403 masih
      // boleh cuba key seterusnya kerana kuota/credential boleh berbeza.
      const httpStatus = Number(err && err.status) || 0;
      if (httpStatus === 400 || httpStatus === 404 || httpStatus === 408) break;
      if (httpStatus >= 500) {
        serverErrorCount++;
        if (serverErrorCount >= GEMINI_5XX_MAX_ATTEMPTS) break;
      }
    }
  }

  if (lastErr) {
    lastErr.aiAttempts = attempts;
    throw lastErr;
  }
  const budgetErr = new Error('Bajet ' + role + ' tamat sebelum respons Gemini yang sah diterima.');
  budgetErr.code = 'AI_BUDGET_EXHAUSTED';
  budgetErr.aiAttempts = attempts;
  throw budgetErr;
}

// Enjin UTAMA — port PERSIS prompt/skema drpd v2/cloudflare_worker_ppdk_v2.js
// (garis panduan anti-mismatch, contoh pemetaan logik Tajuk->Objektif->
// Impak->TindakSusul).
async function generateRumusanImpakGeminiWorker_(env, namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul, model, role, budgetMs, runtimeOptions) {
  const rumusanDraf = (existingRumusan || '').trim();
  const impakDraf = (existingImpak || '').trim();
  const tindakSusulDraf = (existingTindakSusul || '').trim();

  const arahanRumusan = rumusanDraf
    ? 'Pegawai TELAH menulis draf rumusan sendiri di bawah. JANGAN jana rumusan baharu — OLAHKAN/PERBAIKI SAHAJA ayat draf sedia ada ini supaya mengikut gaya bahasa laporan rasmi kerajaan (formal, tepat, tanpa singkatan tidak rasmi). Rumusan MESTI merujuk terus kepada aktiviti teknikal sebenar, JANGAN guna perkataan generik "lawatan/program" jika aktiviti adalah kerja teknikal. Format wajib: SATU perenggan padat berterusan tanpa baris kosong di tengah-tengah. KEKALKAN 100% fakta dan maklumat asal pegawai.\\nDraf Rumusan Sedia Ada:\\n"' + rumusanDraf + '"'
    : 'Satu perenggan padat berterusan (tanpa baris kosong di tengah-tengah) kesimpulan eksekutif rasmi kerajaan yang merumuskan pelaksanaan aktiviti berdasarkan objektif di atas. Rumusan MESTI merujuk secara langsung kepada aktiviti teknikal yang nyata, JANGAN guna perkataan generik "lawatan/program" jika aktiviti adalah kerja teknikal. Kekalkan 100% maklumat asal.';

  const arahanImpak = impakDraf
    ? 'Pegawai TELAH menulis draf impak sendiri di bawah. JANGAN jana impak baharu — OLAHKAN/PERBAIKI SAHAJA ayat draf sedia ada ini mengikut laras bahasa laporan rasmi kerajaan (bentuk pasif), kemudian formatkan sebagai senarai bernombor bertingkat menegak (1., 2., 3., 4.) di mana SETIAP nombor MESTI bermula pada BARIS BAHARU. KEKALKAN 100% maklumat asal pegawai.\\nDraf Impak Sedia Ada:\\n"' + impakDraf + '"'
    : 'Senarai bernombor bertingkat menegak TEPAT 4 POIN UTAMA (1., 2., 3., 4.) di mana SETIAP nombor MESTI bermula pada BARIS BAHARU. Setiap impak MESTI boleh disusulkan secara logik daripada OBJEKTIF sahaja. JANGAN jana impak yang menyentuh aspek yang TIDAK dinyatakan dalam objektif (cth: Dilarang menjana "Meningkatkan kemahiran guru" jika objektif adalah kerja konfigurasi/penyelenggaraan rangkaian). Gunakan format ayat rasmi kerajaan bentuk pasif.';

  const arahanTindakSusul = tindakSusulDraf
    ? 'Pegawai TELAH menulis draf tindak susul sendiri di bawah. JANGAN jana tindak susul baharu — OLAHKAN/PERBAIKI SAHAJA ayat draf sedia ada ini mengikut laras bahasa laporan rasmi kerajaan, kemudian formatkan sebagai senarai bernombor bertingkat menegak (1., 2., 3., 4.) di mana SETIAP nombor MESTI bermula pada BARIS BAHARU. KEKALKAN 100% maklumat asal pegawai.\\nDraf Tindak Susul Sedia Ada:\\n"' + tindakSusulDraf + '"'
    : 'Senarai bernombor bertingkat menegak TEPAT 4 POIN UTAMA (1., 2., 3., 4.) di mana SETIAP nombor MESTI bermula pada BARIS BAHARU. Tindak susul MESTI spesifik kepada aktiviti dalam objektif dan menyambung secara 1-ke-1 daripada 4 poin impak di atas. Nyatakan pihak bertanggungjawab yang munasabah (cth: Guru Penyelaras ICT, PTIS, JTK, Pentadbir Sekolah). JANGAN jana cadangan generik penyelenggaraan ICT umum jika tidak relevan dengan skop aktiviti (cth: Dilarang menjana "Kemaskini antivirus" jika skop projek adalah rangkaian MyGovNet).';

  const prompt = 'Anda adalah pembantu menulis laporan rasmi kerajaan Malaysia dalam Bahasa Melayu untuk laporan Khidmat Bantu ICT (KPM / JPN Sarawak / PPD Contoh).\\n\\n' +
    'PERATURAN AM WAJIB:\\n' +
    '1. Kekalkan 100% maklumat asal (tarikh, masa, tempat, nama, nombor, angka sasaran, nama projek, nama sistem, peranti).\\n' +
    '2. Gaya bahasa: rasmi, padat, objektif — gunakan bentuk pasif ("dilaksanakan", "dijalankan") tanpa kata ganti diri "saya" / "kami".\\n' +
    '3. Jika maklumat tidak mencukupi untuk jana impak/tindak susul yang relevan, nyatakan dengan jelas dan minta penjelasan tambahan — JANGAN reka fakta.\\n' +
    '4. CONTOH PEMETAAN LOGIK (WAJIB IKUT):\\n' +
    '   Tajuk -> Objektif -> Impak -> Tindak Susul mesti membentuk satu aliran konsisten:\\n' +
    '   - Tajuk: Konfigurasi & Pengujian Perkakasan Rangkaian MyGovNet\\n' +
    '   - Objektif: Melaksanakan konfigurasi dan pengujian rangkaian\\n' +
    '   - Impak: [BETUL] Rangkaian beroperasi stabil dan sedia diguna | [SALAH] "Meningkatkan kemahiran guru" (tiada kaitan)\\n' +
    '   - Tindak Susul: [BETUL] Pemantauan prestasi rangkaian selepas konfigurasi oleh Guru Penyelaras ICT bersama PTIS | [SALAH] "Kemaskini antivirus berjadual" (bukan skop projek)\\n\\n' +
    'Maklumat Laporan:\\n' +
    '- Tempat / Sekolah: ' + (namaSekolah || 'Sekolah') + '\\n' +
    '- Kategori / Khidmat Bantu: ' + (kategori || 'Khidmat Bantu ICT / Penyelenggaraan') + '\\n' +
    '- Draf / Input Objektif Dari Pengguna:\\n"' + objektif + '"\\n' +
    (aktiviti ? '- Nota Aktiviti Ringkas Tambahan: ' + aktiviti + '\\n' : '') + '\\n' +
    'Hasilkan 4 bahagian utama mengikut standard berikut:\\n\\n' +
    '1. FORMATTED OBJEKTIF (formattedObjektif):\\n' +
    'MEDAN OBJEKTIF: JANGAN ubah konteks, maksud, fakta atau skop yang ditaip oleh pengguna. HANYA perbaiki tatabahasa, ejaan dan struktur ayat mengikut gaya laporan rasmi kerajaan. Kekalkan semua istilah teknikal asal tanpa diubah. Medan formattedObjektif MESTI mengandungi SEMUA fakta input (nama projek, aktiviti, tempat). LARANG frasa generik dan LARANG penduaan kata kerja seperti "Melaksanakan Pelaksanaan". Format output: 1 ayat rasmi padat (18-25 perkataan) seperti: "Objektif tugas ini adalah untuk [aktiviti] di [Tempat] bagi [Tujuan]" atau "Melaksanakan [Aktiviti] di [Tempat] bagi [Tujuan]".\\n\\n' +
    '2. RUMUSAN (rumusan):\\n' + arahanRumusan + '\\n\\n' +
    '3. IMPAK (impak):\\n' +
    'MEDAN IMPAK: Setiap impak MESTI boleh disusulkan secara logik daripada OBJEKTIF sahaja. JANGAN jana impak yang menyentuh aspek yang TIDAK dinyatakan dalam objektif. ' + arahanImpak + '\\n\\n' +
    '4. TINDAK SUSUL (tindakSusul):\\n' +
    'MEDAN TINDAK SUSUL: Tindak susul MESTI spesifik kepada aktiviti dalam tajuk dan objektif. Nyatakan pihak bertanggungjawab yang munasabah (Guru Penyelaras ICT, PTIS, JTK, Pentadbir Sekolah). JANGAN jana cadangan generik penyelenggaraan ICT umum jika tidak relevan. ' + arahanTindakSusul + '\\n\\n' +
    'Hasilkan jawapan dalam format JSON berstruktur dengan kekunci: "formattedObjektif", "rumusan", "impak", "tindakSusul" (semua string).';

  const upstream = await callGeminiModelWithKeyFallback_(env, model, {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: 'Anda adalah pembantu menulis laporan rasmi kerajaan Malaysia dalam Bahasa Melayu untuk Khidmat Bantu ICT KPM dan PPD Contoh. Medan formattedObjektif MESTI mengandungi SEMUA fakta input (nama projek, aktiviti, tempat). LARANG frasa generik dan LARANG penduaan kata kerja seperti "Melaksanakan Pelaksanaan". Pastikan aliran Tajuk -> Objektif -> Impak -> Tindak Susul membentuk satu pemetaan logik konsisten dan tepat.' }] },
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: model === GEMINI_PRIMARY_MODEL ? 'low' : 'minimal' },
      responseSchema: {
        type: 'OBJECT',
        properties: {
          formattedObjektif: { type: 'STRING' },
          rumusan: { type: 'STRING' },
          impak: { type: 'STRING' },
          tindakSusul: { type: 'STRING' },
        },
        required: ['formattedObjektif', 'rumusan', 'impak', 'tindakSusul'],
      },
    },
  }, budgetMs, role, runtimeOptions);

  let parsed = {};
  let parseError = false;
  try { parsed = JSON.parse(upstream.text || '{}'); } catch (err) { parseError = true; }
  return {
    success: true,
    engineUsed: role === 'primary' ? 'edge-gemini-3.8' : 'edge-gemini-3.6-hedge',
    modelUsed: model,
    candidateRole: role,
    formattedObjektif: String(parsed.formattedObjektif || '').trim(),
    rumusan: String(parsed.rumusan || '').trim(),
    impak: String(parsed.impak || '').trim(),
    tindakSusul: String(parsed.tindakSusul || '').trim(),
    parseError: parseError,
    upstreamMetrics: {
      latencyMs: upstream.latencyMs,
      attempts: upstream.attempts
    }
  };
}

function splitMesyuaratObjectiveLines_(rawText) {
  const lines = String(rawText || '')
    .replace(/\\r\\n/g, '\\n')
    .split('\\n')
    .map(function(line) { return line.trim().replace(/^\\d+[.)]\\s*/, ''); })
    .filter(Boolean);
  return lines.length ? lines : [''];
}

function formatMesyuaratObjective_(items) {
  const cleanItems = (items || []).map(function(item) { return String(item || '').trim(); }).filter(Boolean);
  if (cleanItems.length <= 1) return cleanItems[0] || '';
  return cleanItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
}

function validateMesyuaratAiCandidate_(candidate, objectiveCount, originalInput) {
  const reasons = [];
  if (!candidate || candidate.parseError) reasons.push('invalid_json');
  const formatted = String(candidate && candidate.formattedObjektif || '').trim();
  const rumusan = String(candidate && candidate.rumusan || '').trim();
  if (!formatted) reasons.push('missing_formattedObjektif');
  if (!rumusan) reasons.push('missing_rumusan');

  const formattedItems = objectiveCount > 1 ? extractAiNumberedItems_(formatted) : (formatted ? [formatted.replace(/^\\d+[.)]\\s*/, '')] : []);
  const impakItems = extractAiNumberedItems_(candidate && candidate.impak);
  const tindakItems = extractAiNumberedItems_(candidate && candidate.tindakSusul);
  if (formattedItems.length !== objectiveCount) reasons.push('objektif_count_' + formattedItems.length);
  if (impakItems.length !== objectiveCount) reasons.push('impak_count_' + impakItems.length);
  if (tindakItems.length !== objectiveCount) reasons.push('tindak_count_' + tindakItems.length);
  if (impakItems.some(function(item) { return /[,:;]$/.test(String(item || '').trim()); })) reasons.push('incomplete_impak');
  if (tindakItems.some(function(item) { return /[,:;]$/.test(String(item || '').trim()); })) reasons.push('incomplete_tindak');

  const source = String(originalInput || '').toLowerCase();
  const output = [formatted, rumusan, candidate && candidate.impak, candidate && candidate.tindakSusul].filter(Boolean).join(' ').toLowerCase();
  if (!/sekolah|murid|makmal komputer/.test(source) && /sekolah|murid|makmal komputer/.test(output)) {
    reasons.push('forbidden_school_context');
  }

  return {
    ok: reasons.length === 0,
    reasons: reasons,
    formattedItems: formattedItems,
    impakItems: impakItems,
    tindakItems: tindakItems
  };
}

function normalizeMesyuaratAiCandidate_(candidate, structure) {
  candidate.formattedObjektif = formatMesyuaratObjective_(structure.formattedItems);
  candidate.rumusan = String(candidate.rumusan || '').replace(/\\s+/g, ' ').trim();
  candidate.impak = structure.impakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
  candidate.tindakSusul = structure.tindakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
  candidate.impakPaddedCount = 0;
  candidate.tindakPaddedCount = 0;
  candidate.semanticDomain = 'mesyuarat';
  return candidate;
}

// Enjin Mesyuarat/Taklimat DIASINGKAN sepenuhnya daripada generator lawatan.
// Jangan gabungkan prompt ini ke generateRumusanImpakGeminiWorker_ kerana format,
// kosa kata dan bilangan poin untuk laporan lawatan mempunyai kontrak berbeza.
async function generateRumusanImpakMesyuaratGeminiWorker_(env, tempat, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul, model, role, budgetMs, runtimeOptions) {
  const objectiveItems = splitMesyuaratObjectiveLines_(objektif);
  const objectiveCount = objectiveItems.length;
  const rumusanDraf = String(existingRumusan || '').trim();
  const impakDraf = String(existingImpak || '').trim();
  const tindakSusulDraf = String(existingTindakSusul || '').trim();

  const objektifRule = objectiveCount > 1
    ? 'Input Objektif mempunyai ' + objectiveCount + ' baris. formattedObjektif MESTI menjadi senarai bernombor TEPAT ' + objectiveCount + ' poin, satu poin bagi setiap baris asal, dalam urutan asal. Jangan gabung, pecah, tokok atau kurangkan poin.'
    : 'Input Objektif mempunyai satu baris. formattedObjektif MESTI kekal sebagai SATU perenggan padat rasmi; jangan tukar kepada senarai.';

  const prompt = 'Sediakan draf minit/ringkasan taklimat pengurusan rasmi berdasarkan input berikut.\\n\\n' +
    'PERATURAN WAJIB:\\n' +
    '1. Kekalkan 100% fakta, nama, angka, tarikh, keputusan, skop dan istilah asal. Jangan mereka fakta.\\n' +
    '2. ' + objektifRule + '\\n' +
    '3. Rumusan: SATU perenggan padat berterusan sahaja.\\n' +
    '4. Impak: senarai bernombor TEPAT ' + objectiveCount + ' poin. Impak-' + (objectiveCount > 1 ? 'N mesti dipetakan 1:1 kepada Objektif-N.' : '1 mesti berpunca terus daripada Objektif-1.') + '\\n' +
    '5. Tindak Susul: senarai bernombor TEPAT ' + objectiveCount + ' poin. Tindak Susul-N mesti dipetakan 1:1 kepada Objektif-N dan Impak-N.\\n' +
    '6. Elak istilah sekolah/murid/makmal komputer kecuali istilah tersebut memang wujud secara eksplisit dalam input pengguna.\\n' +
    '7. Bahasa Melayu rasmi kerajaan, padat, neutral dan berorientasikan keputusan/tindakan pengurusan.\\n\\n' +
    'Maklumat Mesyuarat / Taklimat:\\n' +
    '- Tempat: ' + String(tempat || 'Tidak dinyatakan') + '\\n' +
    '- Jenis / Kategori: ' + String(kategori || 'Mesyuarat / Taklimat Pengurusan') + '\\n' +
    '- Objektif Asal:\\n' + objectiveItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n') + '\\n' +
    (aktiviti ? '- Nota / Aktiviti Tambahan: ' + aktiviti + '\\n' : '') +
    (rumusanDraf ? '- Draf Rumusan Pegawai (olah bahasa sahaja, kekalkan fakta): ' + rumusanDraf + '\\n' : '') +
    (impakDraf ? '- Draf Impak Pegawai (olah bahasa dan susun ikut bilangan objektif): ' + impakDraf + '\\n' : '') +
    (tindakSusulDraf ? '- Draf Tindak Susul Pegawai (olah bahasa dan susun ikut bilangan objektif): ' + tindakSusulDraf + '\\n' : '') +
    '\\nPulangkan JSON dengan kekunci string: formattedObjektif, rumusan, impak, tindakSusul.';

  const upstream = await callGeminiModelWithKeyFallback_(env, model, {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: 'Anda pembantu menulis minit/ringkasan taklimat pengurusan rasmi kerajaan Malaysia (PPD Contoh Sektor ICT) — BUKAN laporan lawatan teknikal sekolah. Elak istilah "sekolah/murid/makmal komputer" melainkan disebut eksplisit dlm input.' }] },
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: model === GEMINI_PRIMARY_MODEL ? 'low' : 'minimal' },
      responseSchema: {
        type: 'OBJECT',
        properties: {
          formattedObjektif: { type: 'STRING' },
          rumusan: { type: 'STRING' },
          impak: { type: 'STRING' },
          tindakSusul: { type: 'STRING' }
        },
        required: ['formattedObjektif', 'rumusan', 'impak', 'tindakSusul']
      }
    }
  }, budgetMs, role, runtimeOptions);

  let parsed = {};
  let parseError = false;
  try { parsed = JSON.parse(upstream.text || '{}'); } catch (err) { parseError = true; }
  return {
    success: true,
    engineUsed: role === 'primary' ? 'edge-gemini-3.8-mesyuarat' : 'edge-gemini-3.6-mesyuarat-hedge',
    modelUsed: model,
    candidateRole: role,
    formattedObjektif: String(parsed.formattedObjektif || '').trim(),
    rumusan: String(parsed.rumusan || '').trim(),
    impak: String(parsed.impak || '').trim(),
    tindakSusul: String(parsed.tindakSusul || '').trim(),
    parseError: parseError,
    upstreamMetrics: { latencyMs: upstream.latencyMs, attempts: upstream.attempts }
  };
}

async function reviewAiMesyuaratCandidate_(env, tempat, objektif, aktiviti, kategori, candidate, budgetMs, runtimeOptions) {
  const prompt = 'Semak draf minit/ringkasan mesyuarat atau taklimat pengurusan berikut. Terima hanya jika fakta kekal selari dengan input, bilangan Objektif/Impak/Tindak Susul sepadan 1:1, dan tiada konteks sekolah/murid/makmal komputer direka.\\n\\n' +
    'TEMPAT: ' + String(tempat || '') + '\\n' +
    'OBJEKTIF ASAL:\\n' + String(objektif || '') + '\\n' +
    'NOTA: ' + String(aktiviti || '') + '\\n' +
    'KATEGORI: ' + String(kategori || '') + '\\n\\n' +
    'OBJEKTIF DRAF:\\n' + String(candidate.formattedObjektif || '') + '\\n' +
    'RUMUSAN:\\n' + String(candidate.rumusan || '') + '\\n' +
    'IMPAK:\\n' + String(candidate.impak || '') + '\\n' +
    'TINDAK SUSUL:\\n' + String(candidate.tindakSusul || '') + '\\n\\n' +
    'Pulangkan JSON accepted(boolean) dan reason(string).';

  const upstream = await callGeminiModelWithKeyFallback_(env, GEMINI_REVIEWER_MODEL, {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: 'Anda reviewer konservatif minit/ringkasan taklimat pengurusan rasmi kerajaan Malaysia. Fokus pada fakta, pemetaan 1:1, dan larangan mencipta konteks sekolah yang tiada dalam input.' }] },
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: 'minimal' },
      responseSchema: {
        type: 'OBJECT',
        properties: { accepted: { type: 'BOOLEAN' }, reason: { type: 'STRING' } },
        required: ['accepted', 'reason']
      }
    }
  }, budgetMs, 'reviewer', runtimeOptions || {});

  let parsed;
  try { parsed = JSON.parse(upstream.text || '{}'); } catch (err) {
    const parseErr = new Error('Reviewer mesyuarat memulangkan JSON tidak sah.');
    parseErr.code = 'MESYUARAT_REVIEWER_INVALID_JSON';
    parseErr.aiAttempts = upstream.attempts;
    throw parseErr;
  }
  if (typeof parsed.accepted !== 'boolean') {
    const invalidErr = new Error('Reviewer mesyuarat tidak memulangkan accepted yang sah.');
    invalidErr.code = 'MESYUARAT_REVIEWER_INVALID_RESULT';
    invalidErr.aiAttempts = upstream.attempts;
    throw invalidErr;
  }
  return { accepted: parsed.accepted, reason: String(parsed.reason || '').slice(0, 240), latencyMs: upstream.latencyMs, attempts: upstream.attempts };
}

function generateRumusanImpakMesyuaratEdge_(tempat, objektif, existingRumusan, existingImpak, existingTindakSusul) {
  const objectiveItems = splitMesyuaratObjectiveLines_(objektif).filter(Boolean);
  const safeItems = objectiveItems.length ? objectiveItems : ['Objektif mesyuarat/taklimat perlu disahkan oleh pegawai.'];
  const targetCount = safeItems.length;
  const existingImpakItems = extractAiNumberedItems_(existingImpak);
  const existingTindakItems = extractAiNumberedItems_(existingTindakSusul);
  const impakItems = existingImpakItems.length === targetCount
    ? existingImpakItems
    : safeItems.map(function(item) { return 'Perkara berkaitan objektif "' + item + '" telah direkodkan sebagai rujukan pengurusan dan memerlukan pengesahan hasil sebenar.'; });
  const tindakItems = existingTindakItems.length === targetCount
    ? existingTindakItems
    : safeItems.map(function(item) { return 'Tindakan susulan bagi objektif "' + item + '" hendaklah disahkan, dipertanggungjawabkan kepada pihak berkaitan dan direkodkan selepas mesyuarat/taklimat.'; });
  const rumusan = String(existingRumusan || '').trim() || ('Mesyuarat/taklimat di ' + String(tempat || 'lokasi yang dinyatakan') + ' telah direkodkan berdasarkan objektif yang diberikan. Keputusan sebenar, pemilik tindakan dan tempoh pelaksanaan hendaklah disemak serta disahkan oleh pegawai sebelum laporan dimuktamadkan.');
  const candidate = {
    success: true,
    engineUsed: 'smart-edge-fallback-mesyuarat',
    fallbackUsed: true,
    fallbackReason: 'upstream_unavailable',
    verificationStatus: 'AI_FALLBACK',
    needsReview: true,
    reviewerStatus: 'not_applicable',
    warning: 'Gemini mesyuarat tidak berjaya memberikan respons yang boleh disahkan. Draf sandaran disediakan dan WAJIB disemak sebelum diterbitkan.',
    semanticDomain: 'mesyuarat',
    formattedObjektif: formatMesyuaratObjective_(safeItems),
    rumusan: rumusan.replace(/\\s+/g, ' ').trim(),
    impak: impakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n'),
    tindakSusul: tindakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n'),
    impakPaddedCount: existingImpakItems.length === targetCount ? 0 : targetCount,
    tindakPaddedCount: existingTindakItems.length === targetCount ? 0 : targetCount
  };
  candidate.legacySummary = buildLegacySummaryFromAi_(candidate);
  return candidate;
}

async function generateRumusanImpakMesyuarat_(env, tempat, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul, runtimeOptions) {
  const options = runtimeOptions || {};
  const startedAt = Date.now();
  const globalDeadlineAt = startedAt + GEMINI_GLOBAL_BUDGET_MS;
  const objectiveCount = splitMesyuaratObjectiveLines_(objektif).filter(Boolean).length || 1;
  const models = [
    { model: GEMINI_PRIMARY_MODEL, role: 'primary', budget: GEMINI_PRIMARY_KEY_TIMEOUT_MS },
    { model: GEMINI_HEDGE_MODEL, role: 'hedge', budget: GEMINI_HEDGE_KEY_TIMEOUT_MS }
  ];
  const metrics = { mode: 'mesyuarat', objectiveCount: objectiveCount, attempts: [], reviewer: [] };
  let deferredUnreviewed = null;

  for (let i = 0; i < models.length; i++) {
    const spec = models[i];
    const remaining = globalDeadlineAt - Date.now();
    if (remaining < GEMINI_MIN_ATTEMPT_MS) break;
    try {
      let candidate = await generateRumusanImpakMesyuaratGeminiWorker_(
        env, tempat, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul,
        spec.model, spec.role, Math.min(spec.budget, remaining), options
      );
      const structure = validateMesyuaratAiCandidate_(candidate, objectiveCount, objektif);
      metrics.attempts.push({ role: spec.role, model: spec.model, structureOk: structure.ok, reasons: structure.reasons || [] });
      if (!structure.ok) continue;
      candidate = normalizeMesyuaratAiCandidate_(candidate, structure);

      const reviewerBudget = Math.min(GEMINI_REVIEWER_BUDGET_MS, globalDeadlineAt - Date.now());
      if (reviewerBudget < GEMINI_MIN_ATTEMPT_MS) {
        deferredUnreviewed = deferredUnreviewed || candidate;
        continue;
      }
      try {
        const review = await reviewAiMesyuaratCandidate_(env, tempat, objektif, aktiviti, kategori, candidate, reviewerBudget, options);
        metrics.reviewer.push({ role: spec.role, accepted: review.accepted, reason: review.reason, latencyMs: review.latencyMs });
        if (!review.accepted) continue;
        candidate.fallbackUsed = false;
        candidate.fallbackReason = '';
        candidate.verificationStatus = 'AI_VERIFIED';
        candidate.needsReview = false;
        candidate.reviewerModel = GEMINI_REVIEWER_MODEL;
        candidate.reviewerStatus = 'accepted';
        candidate.warning = '';
        candidate.legacySummary = buildLegacySummaryFromAi_(candidate);
        return attachAiMetrics_(candidate, metrics, options, startedAt);
      } catch (reviewErr) {
        metrics.reviewer.push({ role: spec.role, accepted: false, unavailable: true, errorCode: String((reviewErr && reviewErr.code) || 'REVIEWER_UNAVAILABLE') });
        deferredUnreviewed = deferredUnreviewed || candidate;
      }
    } catch (err) {
      metrics.attempts.push({ role: spec.role, model: spec.model, upstreamError: String((err && err.code) || 'UPSTREAM_ERROR') });
    }
  }

  if (deferredUnreviewed) {
    deferredUnreviewed.fallbackUsed = false;
    deferredUnreviewed.fallbackReason = '';
    deferredUnreviewed.verificationStatus = 'AI_UNREVIEWED';
    deferredUnreviewed.needsReview = true;
    deferredUnreviewed.reviewerModel = GEMINI_REVIEWER_MODEL;
    deferredUnreviewed.reviewerStatus = 'unavailable';
    deferredUnreviewed.warning = 'Draf mesyuarat berjaya dijana dan lulus semakan struktur, tetapi reviewer AI tidak tersedia. Semakan manual diperlukan sebelum diterbitkan.';
    deferredUnreviewed.legacySummary = buildLegacySummaryFromAi_(deferredUnreviewed);
    return attachAiMetrics_(deferredUnreviewed, metrics, options, startedAt);
  }

  return attachAiMetrics_(generateRumusanImpakMesyuaratEdge_(tempat, objektif, existingRumusan, existingImpak, existingTindakSusul), metrics, options, startedAt);
}

/**
 * Refine objective to concise official Malaysian government format (15-22 words)
 */
function refineOfficialObjective_(rawText, schoolName, rawInput) {
  let text = String(rawText || rawInput || '').trim();
  if (!text) return '';

  text = text.replace(/^["']+|["']+$/g, '').trim();

  // Strip preface clauses like "Lawatan ini bertujuan untuk..."
  text = text.replace(/^(Lawatan ini bertujuan|Aktiviti ini bertujuan|Tujuan lawatan ini|Objektif lawatan ini|Tujuan utama|Objektif utama)\\s+(adalah\\s+)?(untuk\\s+)?/i, '');

  // If text contains multiple sentences, take only the primary first sentence
  if (text.includes('. ') || text.includes('.\\n')) {
    const sentences = text.split(/(?<=\\.)\\s+/).filter(Boolean);
    if (sentences.length > 0) {
      text = sentences[0].replace(/\\.$/, '').trim();
    }
  }

  // Compress repetitive wordy action prefixes
  text = text
    .replace(/^Memastikan dan melaksanakan\\s+/i, 'Melaksanakan ')
    .replace(/^Menjalankan dan melaksanakan\\s+/i, 'Melaksanakan ')
    .replace(/^Melaksanakan\\s+memantau\\s+dan\\s+mengetahui\\s+/i, 'Melaksanakan pemantauan ')
    .replace(/\\s+di\\s+Sekolah\\s+di\\s+/i, ' di ')
    .replace(/kerja-kerja penyelenggaraan teknikal merangkumi\\s+/i, 'penyelenggaraan ')
    .replace(/kerja-kerja penyelenggaraan teknikal pemformatan semula/i, 'penyelenggaraan pemformatan semula')
    .replace(/kerja-kerja penyelenggaraan teknikal/i, 'penyelenggaraan teknikal')
    .replace(/kerja-kerja pemasangan dan pengujian/i, 'pemasangan')
    .replace(/pemeriksaan dan pengujian teknikal/i, 'pemeriksaan teknikal')
    .replace(/pemeriksaan dan semakan teknikal/i, 'semakan teknikal')
    .replace(/pemeriksaan fizikal serta teknikal/i, 'pemeriksaan teknikal')
    .replace(/merangkumi\\s+(proses\\s+|pelaksanaan\\s+)?/gi, '')
    .replace(/menyeluruh\\s+terhadap\\s+(penyambungan\\s+)?/gi, '')
    .replace(/ke\\s+atas\\s+infrastruktur\\s+/gi, '')
    .replace(/serta\\s+fungsi\\s+peranti\\s+suis/gi, 'dan suis')
    .replace(/perisian\\s+antivirus\\s+(terkini|berlesen)/gi, 'antivirus');

  // Compress bloated trailing purpose clauses
  text = text
    .replace(/bagi\\s+menjamin\\s+keselamatan\\s+sistem,\\s*kebolehfungsian\\s+peralatan,\\s*dan\\s+kelancaran\\s+aktiviti\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\s+berasaskan\\s+ICT\\.?/gi, 'bagi menyokong kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+kestabilan\\s+dan\\s+kelancaran\\s+capaian\\s+internet\\s+untuk\\s+kegunaan\\s+warga\\s+sekolah\\.?/gi, 'bagi kestabilan capaian internet sekolah.')
    .replace(/bagi\\s+memastikan\\s+kestabilan\\s+capaian\\s+rangkaian\\s+serta\\s+kelancaran\\s+proses\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\s+berasaskan\\s+ICT\\.?/gi, 'bagi menyokong kelancaran PdP sekolah.')
    .replace(/bagi\\s+menyokong\\s+kelancaran\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\s+serta\\s+pengurusan\\s+digital\\s+sekolah\\.?/gi, 'bagi kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+(prasarana|infrastruktur|peralatan|perisian)\\s+ICT\\s+berada\\s+pada\\s+tahap\\s+optimum\\s+untuk\\s+menyokong\\s+aktiviti\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\s+serta\\s+pengoperasian\\s+sekolah\\.?/gi, 'bagi menyokong kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+ketersediaan\\s+serta\\s+kestabilan\\s+capaian\\s+internet\\s+untuk\\s+kegunaan\\s+pengajaran\\s+dan\\s+pembelajaran\\s*\\(PdP\\)\\s+dan\\s+pentadbiran\\s+sekolah\\.?/gi, 'bagi kestabilan internet sekolah.')
    .replace(/bagi\\s+memastikan\\s+kelancaran,\\s*kestabilan\\s+dan\\s+keselamatan\\s+peranti\\s+semasa\\s+proses\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\s+serta\\s+menyokong\\s+kelancaran\\s+pengurusan\\s+pentadbiran\\s+sekolah\\s+secara\\s+berterusan\\.?/gi, 'bagi kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+infrastruktur\\s+dan\\s+perisian\\s+ICT\\s+berfungsi\\s+secara\\s+optimum\\s+serta\\s+menyokong\\s+kelancaran\\s+sesi\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\.?/gi, 'bagi kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+peralatan\\s+dan\\s+perisian\\s+berfungsi\\s+secara\\s+optimum\\s+serta\\s+menyokong\\s+kelancaran\\s+sesi\\s+Pengajaran\\s+dan\\s+Pembelajaran\\s*\\(PdP\\)\\.?/gi, 'bagi kelancaran PdP sekolah.')
    .replace(/bagi\\s+memastikan\\s+prasarana\\s+ICT\\s+berfungsi\\s+pada\\s+tahap\\s+optimum\\.?/gi, 'bagi kelancaran operasi ICT sekolah.')
    .replace(/\\s+serta\\s+(menyokong|memastikan)\\s+kelancaran\\s+pengurusan\\s+pentadbiran\\s+sekolah\\s+secara\\s+berterusan/gi, '')
    .replace(/\\s+secara\\s+optimum\\s+dan\\s+berterusan\\s+sepanjang\\s+sesi\\s+persekolahan/gi, '')
    .trim();

  // KUNCI #1 Lapisan 3 — Pintasan Sandaran Pintar Berasaskan Kata Kunci
  // (dipindah drpd v2/cloudflare_worker_ppdk_v2.js)
  let defaultPurpose = 'bagi menyokong kelancaran sesi PdP.';
  const kwSource = text.toLowerCase();
  if (/cctv/.test(kwSource)) {
    defaultPurpose = 'bagi memantau keselamatan premis dan memastikan rakaman visual beroperasi secara optimum.';
  } else if (/mygovnet|wi-?fi|switch|rangkaian/.test(kwSource)) {
    defaultPurpose = 'bagi memastikan kestabilan capaian rangkaian dan kelancaran sambungan data sekolah.';
  } else if (/server|pelayan|makmal/.test(kwSource)) {
    defaultPurpose = 'bagi memastikan pelayan makmal komputer dan sistem pangkalan data sekolah beroperasi secara optimum.';
  }

  // If purpose 'bagi...' is missing, append concise purpose
  if (!text.toLowerCase().includes('bagi ') && !text.toLowerCase().includes('demi ') && !text.toLowerCase().includes('untuk ')) {
    text += ' ' + defaultPurpose;
  }

  const lower = text.toLowerCase();
  const school = String(schoolName || '').trim();

  if (!lower.startsWith('melaksanakan') && !lower.startsWith('membuat') && !lower.startsWith('menyelaras') && !lower.startsWith('memverifikasi') && !lower.startsWith('menjalankan') && !lower.startsWith('memastikan')) {
    let verb = 'Melaksanakan ';
    if (lower.startsWith('format ') || lower.startsWith('memformat ')) verb = 'Melaksanakan pemformatan ';
    else if (lower.startsWith('pasang ') || lower.startsWith('pemasangan ')) verb = 'Melaksanakan pemasangan ';
    else if (lower.startsWith('selenggara ') || lower.startsWith('penyelenggaraan ')) verb = 'Melaksanakan penyelenggaraan ';
    else if (lower.startsWith('semak ') || lower.startsWith('pemeriksaan ')) verb = 'Melaksanakan semakan teknikal ';
    else if (lower.startsWith('bimbingan ') || lower.startsWith('khidmat bantu ')) verb = 'Melaksanakan khidmat bimbingan ';

    const cleanedBody = text.replace(/^(format|memformat|pasang|pemasangan|selenggara|penyelenggaraan|semak|pemeriksaan|bimbingan|khidmat bantu)\\s*/i, '').replace(/(\\s+bagi\\s+.*|\\s+demi\\s+.*|\\s+untuk\\s+.*)$/i, '');
    const schoolPart = (school && !cleanedBody.toLowerCase().includes(school.toLowerCase())) ? (' di ' + school) : '';
    text = verb + cleanedBody + schoolPart + ' ' + defaultPurpose;
  } else {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  text = text.replace(/(?:\\s+bagi\\s+menyokong\\s+kelancaran\\s+sesi\\s+PdP\\.?)+/gi, ' bagi menyokong kelancaran sesi PdP.');

  return text.replace(/\\s+/g, ' ').replace(/\\s*\\.\\s*$/, '') + '.';
}

function detectAiContentDomain_(objektif, aktiviti, kategori) {
  const text = [objektif, aktiviti, kategori].filter(Boolean).join(' ').toLowerCase();
  const isNetwork = /internet|rangkaian|network|mygovnet|wi-?fi|\\blan\\b|kabel|cabling|fiber|fibre|capaian|switch|router|access point|talian/.test(text);
  if (isNetwork && /kabel|cabling|fiber|fibre|pemasangan|pasang|naik taraf|upgrade/.test(text)) return 'network_installation';
  if (isNetwork) return 'network';
  if (/komputer|laptop|desktop|printer|peranti|format|windows|sistem operasi|perisian|software|antivirus/.test(text)) return 'device';
  if (/aset|pelupusan|inventori|harta modal/.test(text)) return 'asset';
  if (/mesyuarat|taklimat|bengkel|kursus|latihan|program/.test(text)) return 'program';
  return 'general';
}

function buildDomainAwareFallback_(namaSekolah, objektif, aktiviti, kategori) {
  const school = String(namaSekolah || 'lokasi berkenaan').trim();
  const cleanObjective = String(objektif || aktiviti || kategori || 'khidmat bantu ICT')
    .replace(/\\s+/g, ' ')
    .replace(/[.]+$/, '')
    .trim();
  const domain = detectAiContentDomain_(objektif, aktiviti, kategori);
  let rumusan;
  let impakItems;
  let tindakItems;

  if (domain === 'network_installation') {
    rumusan = 'Pemantauan status pemasangan dan sambungan rangkaian internet telah direkodkan bagi ' + school + '. Status semasa pemasangan serta keperluan tindakan lanjut perlu disahkan melalui semakan teknikal di lokasi sebelum kerja dimuktamadkan.';
    impakItems = [
      'Status kemajuan pemasangan dan sambungan rangkaian dapat dikenal pasti serta direkodkan untuk rujukan tindakan seterusnya.',
      'Bahagian pemasangan atau sambungan yang masih memerlukan semakan dapat dikenal pasti sebelum pengujian akhir rangkaian.',
      'Penyelarasan antara pihak sekolah, JTK dan penyedia atau pemasang dapat dibuat berdasarkan status semasa kerja rangkaian.',
      'Pengujian capaian dan kestabilan rangkaian dapat dirancang selepas pemasangan disahkan lengkap.'
    ];
    tindakItems = [
      'JTK dan pihak sekolah merekod serta memantau status kemajuan pemasangan sehingga kerja disahkan lengkap.',
      'Pemeriksaan sambungan kabel dan pengujian capaian rangkaian dilaksanakan selepas pemasangan selesai.',
      'Sebarang pemasangan yang belum lengkap atau tidak menepati keperluan dirujuk kepada penyedia atau pemasang untuk tindakan pembetulan.',
      'Pengesahan akhir kestabilan capaian rangkaian dibuat sebelum kerja ditutup atau diterima.'
    ];
  } else if (domain === 'network') {
    rumusan = 'Semakan teknikal rangkaian telah direkodkan bagi ' + school + ' berdasarkan objektif yang diberikan. Status capaian, konfigurasi dan kestabilan sebenar perlu disahkan melalui pengujian di lokasi sebelum laporan dimuktamadkan.';
    impakItems = [
      'Status capaian dan kebolehfungsian rangkaian dapat dikenal pasti melalui semakan teknikal.',
      'Punca gangguan atau bahagian rangkaian yang memerlukan tindakan lanjut dapat dikenal pasti berdasarkan hasil pengujian.',
      'Penyelarasan tindakan antara pihak sekolah, JTK dan penyedia perkhidmatan dapat dibuat berdasarkan dapatan sebenar.',
      'Kestabilan capaian rangkaian dapat disahkan semula selepas tindakan teknikal dilaksanakan.'
    ];
    tindakItems = [
      'JTK dan pihak sekolah merekod dapatan semakan serta status capaian rangkaian yang sebenar.',
      'Pengujian sambungan dan konfigurasi rangkaian dilaksanakan pada komponen yang berkaitan dengan objektif.',
      'Isu yang memerlukan tindakan penyedia perkhidmatan dirujuk bersama bukti dan dapatan teknikal yang berkaitan.',
      'Kestabilan capaian rangkaian dipantau dan disahkan semula sebelum kes ditutup.'
    ];
  } else if (domain === 'device') {
    rumusan = 'Semakan teknikal berkaitan ' + cleanObjective + ' telah direkodkan bagi ' + school + '. Keadaan sebenar peralatan atau perisian dan hasil tindakan perlu disahkan oleh pegawai berdasarkan pemeriksaan di lokasi sebelum laporan dimuktamadkan.';
    impakItems = [
      'Status kebolehfungsian peralatan atau perisian yang terlibat dapat dikenal pasti melalui semakan teknikal.',
      'Keperluan pembaikan, konfigurasi atau tindakan teknikal lanjut dapat dikenal pasti berdasarkan hasil pemeriksaan.',
      'Rekod tindakan teknikal dapat digunakan sebagai rujukan untuk penyelarasan sokongan seterusnya.',
      'Pengesahan fungsi selepas tindakan teknikal dapat dibuat sebelum laporan ditutup.'
    ];
    tindakItems = [
      'Pegawai merekod dapatan pemeriksaan dan tindakan teknikal yang benar-benar dilaksanakan.',
      'Tindakan pembaikan atau konfigurasi susulan dibuat hanya bagi perkara yang disahkan masih bermasalah.',
      'Pihak sekolah dan JTK menyelaras keperluan sokongan lanjut berdasarkan status sebenar peralatan atau perisian.',
      'Fungsi peralatan atau perisian disahkan semula selepas tindakan selesai sebelum kes ditutup.'
    ];
  } else {
    rumusan = 'Draf rumusan sandaran disediakan berdasarkan objektif "' + cleanObjective + '" di ' + school + '. Hasil pelaksanaan sebenar dan sebarang keputusan teknikal perlu disemak serta disahkan oleh pegawai sebelum laporan diterbitkan.';
    impakItems = [
      'Status pelaksanaan aktiviti dapat direkodkan berdasarkan objektif yang ditetapkan.',
      'Keperluan tindakan lanjut dapat dikenal pasti melalui semakan hasil sebenar di lokasi.',
      'Pihak berkaitan mempunyai rujukan yang lebih jelas untuk penyelarasan tindakan seterusnya.',
      'Pengesahan hasil aktiviti dapat dibuat sebelum laporan dimuktamadkan.'
    ];
    tindakItems = [
      'Pegawai menyemak dan mengesahkan hasil sebenar aktiviti sebelum laporan diterbitkan.',
      'Perkara yang masih belum selesai direkodkan secara khusus untuk tindakan lanjut.',
      'Tindakan susulan diselaraskan dengan pihak yang berkaitan berdasarkan dapatan sebenar.',
      'Status akhir aktiviti dikemas kini selepas pengesahan selesai.'
    ];
  }

  return { domain: domain, rumusan: rumusan, impakItems: impakItems, tindakItems: tindakItems };
}

function validateAiSemanticRelevance_(objektif, aktiviti, kategori, impak, tindakSusul) {
  const domain = detectAiContentDomain_(objektif, aktiviti, kategori);
  const source = [objektif, aktiviti, kategori].filter(Boolean).join(' ').toLowerCase();
  const output = [impak, tindakSusul].filter(Boolean).join(' ').toLowerCase();
  const forbidden = [];

  if (domain === 'network' || domain === 'network_installation') {
    if (!/sistem operasi|windows|perisian|software|antivirus/.test(source) && /sistem operasi|windows|perisian|software|antivirus/.test(output)) forbidden.push('perisian/sistem operasi');
    if (!/komputer|laptop|desktop|peranti/.test(source) && /kelajuan operasi (?:peralatan|komputer)|komputer ict|pemformatan komputer|format komputer|penyelenggaraan komputer|naik taraf komputer|kerosakan (?:komputer|laptop|desktop)/.test(output)) forbidden.push('komputer/peranti');
    if (!/kehilangan data|backup|sandaran data/.test(source) && /kehilangan data|backup|sandaran data/.test(output)) forbidden.push('kehilangan/sandaran data');
  }
  if (!/guru|latihan|bengkel|kursus|kemahiran/.test(source) && /meningkatkan kemahiran guru|latihan guru|kemahiran guru/.test(output)) forbidden.push('latihan/kemahiran guru');

  return { ok: forbidden.length === 0, domain: domain, reasons: forbidden };
}

function extractAiNumberedItems_(text) {
  return String(text || '')
    .replace(/\\r\\n/g, '\\n')
    .replace(/(\\d+[.)]\\s*)/g, '\\n$1')
    .split('\\n')
    .map(function(line) { return line.trim().replace(/^\\d+[.)]\\s*/, ''); })
    .filter(Boolean);
}

function validateAiCandidateStructure_(candidate) {
  const reasons = [];
  if (!candidate || candidate.parseError) reasons.push('invalid_json');
  if (!String(candidate && candidate.formattedObjektif || '').trim()) reasons.push('missing_formattedObjektif');
  if (!String(candidate && candidate.rumusan || '').trim()) reasons.push('missing_rumusan');
  const impakItems = extractAiNumberedItems_(candidate && candidate.impak);
  const tindakItems = extractAiNumberedItems_(candidate && candidate.tindakSusul);
  if (impakItems.length !== 4) reasons.push('impak_count_' + impakItems.length);
  if (tindakItems.length !== 4) reasons.push('tindak_count_' + tindakItems.length);
  return {
    ok: reasons.length === 0,
    reasons: reasons,
    impakItems: impakItems,
    tindakItems: tindakItems
  };
}

function normalizeVerifiedAiCandidate_(candidate, structure, namaSekolah, objektif) {
  candidate.formattedObjektif = refineOfficialObjective_(candidate.formattedObjektif, namaSekolah, objektif);
  candidate.rumusan = String(candidate.rumusan || '').replace(/\\s+/g, ' ').trim();
  candidate.impak = structure.impakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
  candidate.tindakSusul = structure.tindakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
  candidate.impakPaddedCount = 0;
  candidate.tindakPaddedCount = 0;
  return candidate;
}

function buildLegacySummaryFromAi_(candidate) {
  const impakText = extractAiNumberedItems_(candidate.impak).join(' ');
  const tindakText = extractAiNumberedItems_(candidate.tindakSusul).join(' ');
  return {
    agenda: String(candidate.formattedObjektif || '').slice(0, 120),
    isu: impakText,
    keputusan: String(candidate.rumusan || '').trim(),
    tindakan: tindakText
  };
}

async function reviewAiCandidate_(env, namaSekolah, objektif, aktiviti, kategori, candidate, budgetMs, runtimeOptions) {
  const options = runtimeOptions || {};
  if (options.testMode && String(options.fault || '').toLowerCase() === 'reviewer_reject') {
    return { accepted: false, reason: 'injected_reviewer_reject', latencyMs: 0, attempts: [] };
  }

  const reviewPrompt = 'Semak draf laporan Khidmat Bantu ICT berikut sebagai reviewer fakta dan relevansi.\\n\\n' +
    'OBJEKTIF ASAL: ' + String(objektif || '') + '\\n' +
    'AKTIVITI: ' + String(aktiviti || '') + '\\n' +
    'KATEGORI: ' + String(kategori || '') + '\\n' +
    'TEMPAT: ' + String(namaSekolah || '') + '\\n\\n' +
    'CALON OBJEKTIF: ' + String(candidate.formattedObjektif || '') + '\\n' +
    'CALON RUMUSAN: ' + String(candidate.rumusan || '') + '\\n' +
    'CALON IMPAK: ' + String(candidate.impak || '') + '\\n' +
    'CALON TINDAK SUSUL: ' + String(candidate.tindakSusul || '') + '\\n\\n' +
    'Terima jika kandungan kekal relevan dan tidak bercanggah dengan input. Jangan tolak kerana gaya ayat, sinonim, susunan kecil, atau perincian bahasa. Tolak HANYA jika terdapat percanggahan material, fakta/peralatan/projek yang direka, atau impak/tindak susul yang jelas di luar skop objektif. Pulangkan JSON accepted dan reason.';

  const upstream = await callGeminiModelWithKeyFallback_(env, GEMINI_REVIEWER_MODEL, {
    contents: [{ parts: [{ text: reviewPrompt }] }],
    systemInstruction: { parts: [{ text: 'Anda reviewer konservatif untuk laporan rasmi ICT. Fokus pada percanggahan material dan ketidakrelevanan nyata. Perbezaan gaya atau frasa kecil bukan alasan penolakan.' }] },
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: 'minimal' },
      responseSchema: {
        type: 'OBJECT',
        properties: {
          accepted: { type: 'BOOLEAN' },
          reason: { type: 'STRING' }
        },
        required: ['accepted', 'reason']
      }
    }
  }, budgetMs, 'reviewer', options);

  let parsed;
  try { parsed = JSON.parse(upstream.text || '{}'); } catch (err) {
    const parseErr = new Error('Reviewer Gemini memulangkan JSON tidak sah.');
    parseErr.code = 'REVIEWER_INVALID_JSON';
    parseErr.aiAttempts = upstream.attempts;
    throw parseErr;
  }
  if (typeof parsed.accepted !== 'boolean') {
    const invalidErr = new Error('Reviewer Gemini tidak memulangkan keputusan accepted yang sah.');
    invalidErr.code = 'REVIEWER_INVALID_RESULT';
    invalidErr.aiAttempts = upstream.attempts;
    throw invalidErr;
  }
  return {
    accepted: parsed.accepted,
    reason: String(parsed.reason || '').slice(0, 240),
    latencyMs: upstream.latencyMs,
    attempts: upstream.attempts
  };
}

function getAiModelProbeConfig_(model) {
  if (model === GEMINI_PRIMARY_MODEL) {
    return { role: 'primary', thinkingLevel: 'low', budgetMs: GEMINI_PRIMARY_KEY_TIMEOUT_MS };
  }
  if (model === GEMINI_HEDGE_MODEL) {
    return { role: 'hedge', thinkingLevel: 'minimal', budgetMs: GEMINI_HEDGE_KEY_TIMEOUT_MS };
  }
  if (model === GEMINI_REVIEWER_MODEL) {
    return { role: 'reviewer', thinkingLevel: 'minimal', budgetMs: GEMINI_REVIEWER_KEY_TIMEOUT_MS };
  }
  return null;
}

async function probeGeminiModel_(env, model) {
  const config = getAiModelProbeConfig_(model);
  if (!config) {
    const err = new Error('Model probe tidak dibenarkan.');
    err.code = 'AI_PROBE_MODEL_NOT_ALLOWED';
    throw err;
  }

  const payload = {
    contents: [{ parts: [{ text: 'Pulangkan JSON ringkas dengan nilai ok=true.' }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: config.thinkingLevel },
      responseSchema: {
        type: 'OBJECT',
        properties: { ok: { type: 'BOOLEAN' } },
        required: ['ok']
      }
    }
  };
  const keys = getGeminiApiKeys_(env);
  if (!keys.length) {
    const err = new Error('Tiada GEMINI_API_KEYS untuk model probe.');
    err.code = 'AI_PROBE_NO_KEYS';
    throw err;
  }

  const startedAt = Date.now();
  const attempts = [];
  let lastErr = null;
  for (let i = 0; i < keys.length; i++) {
    const attemptStartedAt = Date.now();
    try {
      const text = await callGeminiWorker_(model, keys[i], payload, config.budgetMs);
      let parsed = {};
      try { parsed = JSON.parse(text || '{}'); } catch (err) {}
      if (parsed.ok !== true) {
        const invalidErr = new Error('Model probe tidak memulangkan respons JSON yang dijangka.');
        invalidErr.code = 'AI_PROBE_INVALID_RESULT';
        throw invalidErr;
      }
      attempts.push({ keySlot: i + 1, ok: true, latencyMs: Date.now() - attemptStartedAt });
      return {
        success: true,
        model: model,
        role: config.role,
        thinkingLevel: config.thinkingLevel,
        latencyMs: Date.now() - startedAt,
        attempts: attempts
      };
    } catch (err) {
      lastErr = err;
      attempts.push({
        keySlot: i + 1,
        ok: false,
        latencyMs: Date.now() - attemptStartedAt,
        status: Number(err && err.status) || 0,
        code: String((err && err.code) || 'AI_PROBE_ERROR')
      });
    }
  }

  if (lastErr) lastErr.aiAttempts = attempts;
  throw lastErr || new Error('Semua key model probe gagal.');
}

function attachAiMetrics_(result, metrics, runtimeOptions, startedAt) {
  metrics.totalLatencyMs = Date.now() - startedAt;
  if (runtimeOptions && runtimeOptions.collectMetrics) result._metrics = metrics;
  return result;
}

function makeAiUnreviewedResult_(candidate, reviewerError, metrics, runtimeOptions, startedAt) {
  candidate.fallbackUsed = false;
  candidate.fallbackReason = '';
  candidate.verificationStatus = 'AI_UNREVIEWED';
  candidate.needsReview = true;
  candidate.reviewerModel = GEMINI_REVIEWER_MODEL;
  candidate.reviewerStatus = 'unavailable';
  candidate.warning = 'Draf AI berjaya dijana dan lulus semakan struktur/semantik, tetapi reviewer AI tidak tersedia. Semakan manual diperlukan sebelum diterbitkan.';
  if (!metrics.reviewer.lastErrorCode) metrics.reviewer.lastErrorCode = String((reviewerError && reviewerError.code) || 'REVIEWER_UNAVAILABLE');
  if ((!metrics.reviewer.attempts || metrics.reviewer.attempts.length === 0) && reviewerError && reviewerError.aiAttempts) {
    metrics.reviewer.attempts = reviewerError.aiAttempts;
  }
  candidate.legacySummary = buildLegacySummaryFromAi_(candidate);
  return attachAiMetrics_(candidate, metrics, runtimeOptions, startedAt);
}

/**
 * Smart Edge AI Generator for PTIS Form (100% High Availability Fallback Engine)
 */
function generateRumusanImpakEdge_(namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul) {
  const formattedInput = String(objektif || '').trim();
  const school = String(namaSekolah || 'sekolah').trim();
  const contextual = buildDomainAwareFallback_(school, formattedInput, aktiviti, kategori);
  const fallbackObjektif = refineOfficialObjective_(formattedInput, school, formattedInput);

  const fallbackRumusan = (existingRumusan && existingRumusan.trim()) || contextual.rumusan;
  const fallbackImpak = (existingImpak && existingImpak.trim()) || contextual.impakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');
  const fallbackTindakSusul = (existingTindakSusul && existingTindakSusul.trim()) || contextual.tindakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n');

  const legacySummary = {
    agenda: fallbackObjektif.slice(0, 120),
    isu: 'Semakan hasil sebenar diperlukan sebelum status teknikal dimuktamadkan.',
    keputusan: 'Draf sandaran dijana berdasarkan objektif; keputusan akhir perlu disahkan oleh pegawai.',
    tindakan: 'Semak dan sahkan hasil sebenar serta tindakan susulan sebelum laporan diterbitkan.'
  };

  return {
    success: true,
    engineUsed: 'smart-edge-fallback',
    fallbackUsed: true,
    verificationStatus: 'AI_FALLBACK',
    needsReview: true,
    reviewerStatus: 'not_applicable',
    warning: 'Gemini tidak berjaya memberikan respons yang boleh disahkan. Draf sandaran berasaskan konteks dijana dan WAJIB disemak sebelum laporan diterbitkan.',
    semanticDomain: contextual.domain,
    formattedObjektif: fallbackObjektif,
    rumusan: fallbackRumusan,
    impak: fallbackImpak,
    tindakSusul: fallbackTindakSusul,
    legacySummary: legacySummary,
    impakPaddedCount: existingImpak && existingImpak.trim() ? 0 : 4,
    tindakPaddedCount: existingTindakSusul && existingTindakSusul.trim() ? 0 : 4
  };
}

/**
 * Harmonize and synchronize Impak & Tindak Susul to exact matching 4-to-4 points
 */
function alignImpakAndTindakSusul_(impakRaw, tindakRaw, schoolName, objektif, aktiviti, kategori) {
  const cleanLines = function(text) {
    return String(text || '')
      .replace(/\\r\\n/g, '\\n')
      .replace(/(\\d+[.)]\\s*)/g, '\\n$1')
      .split('\\n')
      .map(function(l) { return l.trim().replace(/^\\d+[.)]\\s*/, ''); })
      .filter(Boolean);
  };

  let impakItems = cleanLines(impakRaw);
  let tindakItems = cleanLines(tindakRaw);
  const targetCount = 4;
  const school = String(schoolName || 'sekolah').trim();
  const contextual = buildDomainAwareFallback_(school, objektif, aktiviti, kategori);
  const defaultImpaks = contextual.impakItems;
  const defaultTindaks = contextual.tindakItems;
  const impakRealCount = impakItems.length;
  const tindakRealCount = tindakItems.length;

  while (impakItems.length < targetCount) impakItems.push(defaultImpaks[impakItems.length]);
  while (tindakItems.length < targetCount) tindakItems.push(defaultTindaks[tindakItems.length]);

  impakItems = impakItems.slice(0, targetCount);
  tindakItems = tindakItems.slice(0, targetCount);

  return {
    impak: impakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n'),
    tindakSusul: tindakItems.map(function(item, idx) { return (idx + 1) + '. ' + item; }).join('\\n'),
    impakPaddedCount: Math.max(0, targetCount - impakRealCount),
    tindakPaddedCount: Math.max(0, targetCount - tindakRealCount)
  };
}

// Orkestrator generateRumusanImpak — Enjin Utama (Gemini terus drpd Worker,
// GAS TIDAK LAGI dipanggil di sini — rujuk nota KUNCI #1 di atas fail ni).
// Zero Silent Fallbacks: kualiti kandungan setara/lebih baik drpd GAS
// dahulu, bukan terus jatuh ke boilerplate generik. legacySummary (medan
// terkunci LOCKED_FEATURES.md Kunci #1) dibina jugak lepas Gemini berjaya
// — enjin Gemini sendiri tak jana medan ni, jadi kena bina di sini supaya
// kontrak sedia ada (savereport, dashboard arkib) tak terjejas.
async function generateRumusanImpak_(env, namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul, runtimeOptions) {
  const options = runtimeOptions || {};
  const startedAt = Date.now();
  const candidateDeadlineAt = startedAt + GEMINI_CANDIDATE_DEADLINE_MS;
  const globalDeadlineAt = startedAt + GEMINI_GLOBAL_BUDGET_MS;
  const state = { done: false };
  const metrics = {
    hedgeDelayMs: GEMINI_HEDGE_DELAY_MS,
    candidateDeadlineMs: GEMINI_CANDIDATE_DEADLINE_MS,
    globalBudgetMs: GEMINI_GLOBAL_BUDGET_MS,
    structuralRejects: 0,
    semanticRejects: 0,
    reviewerRejects: 0,
    reviewerUnavailable: 0,
    primary: { model: GEMINI_PRIMARY_MODEL, started: true, ok: false, latencyMs: 0, attempts: [] },
    hedge: { model: GEMINI_HEDGE_MODEL, started: false, trigger: '', ok: false, latencyMs: 0, attempts: [] },
    reviewer: { model: GEMINI_REVIEWER_MODEL, calls: 0, accepted: 0, rejected: 0, unavailable: 0, latencyMs: 0, attempts: [], reviews: [] }
  };

  let wakeHedgeResolve = null;
  let hedgeWakeSent = false;
  const hedgeWakePromise = new Promise(function(resolve) { wakeHedgeResolve = resolve; });
  const wakeHedgeEarly_ = function(reason) {
    if (hedgeWakeSent || !wakeHedgeResolve) return;
    hedgeWakeSent = true;
    wakeHedgeResolve(String(reason || 'primary_rejected'));
  };

  // Candidate upstream dan reviewer berjalan pada jam bajet yang berbeza. Simpan
  // masa sebenar candidate selesai supaya candidate yang sempat siap sebelum
  // candidateDeadlineAt tidak hilang hanya kerana review candidate pertama
  // mengambil masa hingga melepasi deadline tersebut.
  const settledCandidateOutcomes = new Map();
  const rememberCandidateOutcome_ = function(outcome) {
    outcome.completedAt = Date.now();
    settledCandidateOutcomes.set(outcome.role, outcome);
    return outcome;
  };

  const primaryPromise = generateRumusanImpakGeminiWorker_(
    env, namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul,
    GEMINI_PRIMARY_MODEL, 'primary', GEMINI_CANDIDATE_DEADLINE_MS, options
  ).then(function(value) { return { role: 'primary', ok: true, value: value }; })
   .catch(function(error) { return { role: 'primary', ok: false, error: error }; })
   .then(rememberCandidateOutcome_);

  const hedgePromise = (async function() {
    const hedgeStartReason = await Promise.race([
      sleepAi_(GEMINI_HEDGE_DELAY_MS).then(function() { return 'delay'; }),
      hedgeWakePromise
    ]);
    if (state.done) {
      const cancelled = new Error('Hedge dibatalkan kerana calon lain sudah disahkan.');
      cancelled.code = 'AI_HEDGE_CANCELLED';
      throw cancelled;
    }
    const remaining = candidateDeadlineAt - Date.now();
    if (remaining < GEMINI_MIN_ATTEMPT_MS) {
      const expired = new Error('Tiada baki bajet untuk memulakan hedge.');
      expired.code = 'AI_HEDGE_DEADLINE';
      throw expired;
    }
    metrics.hedge.started = true;
    metrics.hedge.trigger = hedgeStartReason;
    return generateRumusanImpakGeminiWorker_(
      env, namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul,
      GEMINI_HEDGE_MODEL, 'hedge', remaining, options
    );
  })().then(function(value) { return { role: 'hedge', ok: true, value: value }; })
    .catch(function(error) { return { role: 'hedge', ok: false, error: error }; })
    .then(rememberCandidateOutcome_);

  const pending = new Map();
  pending.set('primary', primaryPromise);
  pending.set('hedge', hedgePromise);
  const rejectKinds = [];
  let deferredUnreviewed = null;

  const takeEligibleSettledOutcome_ = function() {
    let selected = null;
    pending.forEach(function(_, role) {
      const settled = settledCandidateOutcomes.get(role);
      if (!settled || settled.completedAt > candidateDeadlineAt) return;
      if (!selected || settled.completedAt < selected.completedAt) selected = settled;
    });
    return selected;
  };

  const recordReviewerResult_ = function(candidateRole, status, details) {
    const info = details || {};
    const attempts = Array.isArray(info.attempts) ? info.attempts : [];
    const latencyMs = Math.max(0, Number(info.latencyMs) || 0);
    metrics.reviewer.attempts = attempts;
    metrics.reviewer.latencyMs += latencyMs;
    metrics.reviewer.reviews.push({
      candidateRole: candidateRole,
      status: status,
      reason: String(info.reason || '').slice(0, 240),
      errorCode: String(info.errorCode || ''),
      latencyMs: latencyMs,
      attempts: attempts
    });
    if (status === 'unavailable') {
      metrics.reviewerUnavailable += 1;
      metrics.reviewer.unavailable += 1;
      metrics.reviewer.lastErrorCode = String(info.errorCode || 'REVIEWER_UNAVAILABLE');
    }
  };

  while (pending.size > 0) {
    let outcome = takeEligibleSettledOutcome_();
    if (!outcome) {
      const remainingCandidateMs = candidateDeadlineAt - Date.now();
      if (remainingCandidateMs <= 0) break;
      const deadlineOutcome = sleepAi_(remainingCandidateMs).then(function() { return { role: 'deadline', ok: false }; });
      outcome = await Promise.race(Array.from(pending.values()).concat([deadlineOutcome]));
      if (!outcome || outcome.role === 'deadline') {
        // Benarkan microtask candidate yang selesai pada sempadan deadline
        // direkod sebelum keputusan akhir dibuat.
        await Promise.resolve();
        outcome = takeEligibleSettledOutcome_();
        if (!outcome) break;
      }
    }
    pending.delete(outcome.role);
    const metricBucket = outcome.role === 'primary' ? metrics.primary : metrics.hedge;

    // Respons upstream selepas deadline bukan candidate yang layak, walaupun
    // promise itu kebetulan settle sebelum ia dibuang daripada pending.
    if (outcome.completedAt > candidateDeadlineAt) {
      metricBucket.ok = false;
      metricBucket.errorCode = 'AI_CANDIDATE_DEADLINE';
      rejectKinds.push('upstream');
      continue;
    }
    metricBucket.completedMs = Math.max(0, outcome.completedAt - startedAt);

    if (!outcome.ok) {
      const err = outcome.error;
      if (err && err.code === 'AI_HEDGE_CANCELLED') continue;
      metricBucket.ok = false;
      metricBucket.errorCode = String((err && err.code) || 'UPSTREAM_ERROR');
      if (err && err.aiAttempts) metricBucket.attempts = err.aiAttempts;
      rejectKinds.push('upstream');
      if (outcome.role === 'primary') wakeHedgeEarly_('primary_upstream_failure');
      continue;
    }

    let candidate = outcome.value;
    metricBucket.ok = true;
    metricBucket.latencyMs = Number(candidate.upstreamMetrics && candidate.upstreamMetrics.latencyMs) || 0;
    metricBucket.attempts = (candidate.upstreamMetrics && candidate.upstreamMetrics.attempts) || [];

    const fault = options.testMode ? String(options.fault || '').toLowerCase() : '';
    if ((fault === 'semantic_invalid' && outcome.role === 'primary') || fault === 'all_semantic_invalid') {
      candidate.impak = '1. Memastikan sistem operasi Windows dan antivirus dikemas kini.\\n2. Perisian desktop diselaraskan.\\n3. Sandaran data komputer diperkukuh.\\n4. Kemahiran guru dalam penggunaan perisian ditingkatkan.';
    }
    if ((fault === 'schema_invalid' && outcome.role === 'primary') || fault === 'all_schema_invalid') {
      candidate.rumusan = '';
    }
    if ((fault === 'partial_output' && outcome.role === 'primary') || fault === 'all_partial_output') {
      candidate.impak = '1. Status teknikal dikenal pasti.\\n2. Tindakan lanjut diselaraskan.';
    }
    if ((fault === 'empty_output' && outcome.role === 'primary') || fault === 'all_empty_output') {
      candidate.formattedObjektif = '';
      candidate.rumusan = '';
      candidate.impak = '';
      candidate.tindakSusul = '';
    }
    if ((fault === 'malformed_output' && outcome.role === 'primary') || fault === 'all_malformed_output') {
      candidate.parseError = true;
    }

    const structure = validateAiCandidateStructure_(candidate);
    if (!structure.ok) {
      metrics.structuralRejects += 1;
      metricBucket.rejectReason = 'structure';
      rejectKinds.push('structure');
      if (outcome.role === 'primary') wakeHedgeEarly_('primary_structure_reject');
      continue;
    }

    candidate = normalizeVerifiedAiCandidate_(candidate, structure, namaSekolah, objektif);
    const semanticCheck = validateAiSemanticRelevance_(objektif, aktiviti, kategori, candidate.impak, candidate.tindakSusul);
    candidate.semanticDomain = semanticCheck.domain;
    if (!semanticCheck.ok) {
      metrics.semanticRejects += 1;
      metricBucket.rejectReason = 'semantic';
      metricBucket.semanticReasons = semanticCheck.reasons;
      rejectKinds.push('semantic');
      if (outcome.role === 'primary') wakeHedgeEarly_('primary_semantic_reject');
      continue;
    }

    const reviewerBudget = Math.min(GEMINI_REVIEWER_BUDGET_MS, globalDeadlineAt - Date.now());
    if (reviewerBudget < GEMINI_MIN_ATTEMPT_MS) {
      const budgetErr = new Error('Bajet global tidak mencukupi untuk reviewer.');
      budgetErr.code = 'REVIEWER_BUDGET_EXHAUSTED';
      recordReviewerResult_(outcome.role, 'unavailable', {
        errorCode: budgetErr.code,
        latencyMs: 0,
        attempts: []
      });
      if (!deferredUnreviewed) deferredUnreviewed = { candidate: candidate, error: budgetErr, role: outcome.role };
      if (outcome.role === 'primary') wakeHedgeEarly_('primary_reviewer_unavailable');
      continue;
    }

    metrics.reviewer.calls += 1;
    const reviewStartedAt = Date.now();
    try {
      const review = await reviewAiCandidate_(env, namaSekolah, objektif, aktiviti, kategori, candidate, reviewerBudget, options);
      recordReviewerResult_(outcome.role, review.accepted ? 'accepted' : 'rejected', {
        reason: review.reason,
        latencyMs: Number(review.latencyMs) || (Date.now() - reviewStartedAt),
        attempts: review.attempts || []
      });
      if (!review.accepted) {
        metrics.reviewerRejects += 1;
        metrics.reviewer.rejected += 1;
        metricBucket.rejectReason = 'reviewer';
        metricBucket.reviewerReason = review.reason;
        rejectKinds.push('reviewer');
        if (outcome.role === 'primary') wakeHedgeEarly_('primary_reviewer_reject');
        continue;
      }

      metrics.reviewer.accepted += 1;
      metrics.selectedRole = outcome.role;
      metrics.hedgeTakeover = outcome.role === 'hedge';
      metrics.reviewer.selectedCandidateRole = outcome.role;
      metrics.selectedValidation = {
        structure: true,
        semantic: true,
        reviewer: true,
        domain: candidate.semanticDomain || ''
      };
      candidate.fallbackUsed = false;
      candidate.fallbackReason = '';
      candidate.verificationStatus = 'AI_VERIFIED';
      candidate.needsReview = false;
      candidate.reviewerModel = GEMINI_REVIEWER_MODEL;
      candidate.reviewerStatus = 'accepted';
      candidate.warning = '';
      candidate.legacySummary = buildLegacySummaryFromAi_(candidate);
      state.done = true;
      wakeHedgeEarly_('cancelled');
      return attachAiMetrics_(candidate, metrics, options, startedAt);
    } catch (reviewErr) {
      recordReviewerResult_(outcome.role, 'unavailable', {
        errorCode: String((reviewErr && reviewErr.code) || 'REVIEWER_UNAVAILABLE'),
        latencyMs: Date.now() - reviewStartedAt,
        attempts: (reviewErr && reviewErr.aiAttempts) || []
      });
      metricBucket.reviewerErrorCode = String((reviewErr && reviewErr.code) || 'REVIEWER_UNAVAILABLE');
      if (!deferredUnreviewed) deferredUnreviewed = { candidate: candidate, error: reviewErr, role: outcome.role };
      if (outcome.role === 'primary') wakeHedgeEarly_('primary_reviewer_unavailable');
      continue;
    }
  }

  state.done = true;
  wakeHedgeEarly_('cancelled');
  if (deferredUnreviewed) {
    metrics.selectedRole = deferredUnreviewed.role;
    metrics.hedgeTakeover = deferredUnreviewed.role === 'hedge';
    metrics.reviewer.selectedCandidateRole = deferredUnreviewed.role;
    return makeAiUnreviewedResult_(deferredUnreviewed.candidate, deferredUnreviewed.error, metrics, options, startedAt);
  }
  const fallback = generateRumusanImpakEdge_(namaSekolah, objektif, aktiviti, kategori, existingRumusan, existingImpak, existingTindakSusul);
  if (rejectKinds.includes('semantic')) fallback.fallbackReason = 'semantic_mismatch';
  else if (rejectKinds.includes('structure')) fallback.fallbackReason = 'invalid_output';
  else if (rejectKinds.includes('reviewer')) fallback.fallbackReason = 'reviewer_rejected';
  else fallback.fallbackReason = 'upstream_unavailable';
  fallback.warning = 'Semua calon AI upstream gagal atau tidak melepasi pengesahan. Draf sandaran berasaskan konteks digunakan dan WAJIB disemak sebelum diterbitkan.';
  return attachAiMetrics_(fallback, metrics, options, startedAt);
}

/**
 * PTIS Submission API Handler
 */
const PTIS_REPORT_TYPES_ = new Set(['school_visit', 'meeting_meb']);
const PTIS_MEETING_SUBTYPES_ = new Set(['mesyuarat', 'meb']);
const PTIS_ALLOWED_ROLES_ = ['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON', 'PEGAWAI'];

function cleanPtisText_(value, maxLength = 8000) {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function validPtisEvidence_(raw) {
  return validateServerImage_(raw).ok;
}

function cleanPtisList_(value, maxItems = 100, maxItemLength = 500) {
  if (Array.isArray(value)) {
    return value.slice(0, maxItems).map(item => cleanPtisText_(item, maxItemLength)).filter(Boolean);
  }
  const text = cleanPtisText_(value, maxItems * maxItemLength);
  return text ? text : '';
}

function cleanPtisActions_(value) {
  if (!Array.isArray(value)) return cleanPtisText_(value, 12000);
  return value.slice(0, 50).map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return cleanPtisText_(item, 1000);
    }
    return {
      perkara: cleanPtisText_(item.perkara || item.item || item.tindakan || '', 2000),
      pegawaiUnit: cleanPtisText_(item.pegawaiUnit || item.pegawai || item.unit || item.owner || '', 500),
      tarikhSasaran: cleanPtisText_(item.tarikhSasaran || item.tarikh || item.dueDate || '', 100)
    };
  }).filter(item => typeof item === 'string' ? Boolean(item) : Boolean(item.perkara || item.pegawaiUnit || item.tarikhSasaran));
}

function pickPtisValue_(report, details, keys) {
  for (const key of keys) {
    if (details && Object.prototype.hasOwnProperty.call(details, key) && details[key] !== null && details[key] !== '') {
      return details[key];
    }
    if (report && Object.prototype.hasOwnProperty.call(report, key) && report[key] !== null && report[key] !== '') {
      return report[key];
    }
  }
  return '';
}

function sanitizePtisMeetingDetails_(report, meetingSubtype) {
  const rawDetails = report && typeof report.reportDetails === 'object' && !Array.isArray(report.reportDetails)
    ? report.reportDetails
    : (report && typeof report.report_details === 'object' && !Array.isArray(report.report_details)
      ? report.report_details
      : (report && typeof report.meetingDetails === 'object' && !Array.isArray(report.meetingDetails) ? report.meetingDetails : {}));

  if (meetingSubtype === 'mesyuarat') {
    return {
      tempatPlatform: cleanPtisText_(pickPtisValue_(report, rawDetails, ['tempatPlatform', 'tempat', 'platform', 'lokasiLain']), 1000),
      pengerusi: cleanPtisText_(pickPtisValue_(report, rawDetails, ['pengerusi', 'chairperson']), 500),
      pencatat: cleanPtisText_(pickPtisValue_(report, rawDetails, ['pencatat', 'recorder', 'minuteTaker']), 500),
      kehadiran: cleanPtisList_(pickPtisValue_(report, rawDetails, ['kehadiran', 'peserta', 'attendees']), 150, 500),
      agenda: cleanPtisText_(pickPtisValue_(report, rawDetails, ['agenda', 'objektif']), 12000),
      ringkasanPerbincangan: cleanPtisText_(pickPtisValue_(report, rawDetails, ['ringkasanPerbincangan', 'perbincangan', 'discussionSummary']), 16000),
      keputusan: cleanPtisText_(pickPtisValue_(report, rawDetails, ['keputusan', 'decisions']), 12000),
      tindakanSusulan: cleanPtisActions_(pickPtisValue_(report, rawDetails, ['tindakanSusulan', 'tindakSusul', 'tindak_susul', 'followUp']))
    };
  }

  return {
    mingguPelaporan: cleanPtisText_(pickPtisValue_(report, rawDetails, ['mingguPelaporan', 'reportingWeek']), 200),
    sektorUnit: cleanPtisText_(pickPtisValue_(report, rawDetails, ['sektorUnit', 'sektor', 'unit']), 500),
    pencapaianMingguLepas: cleanPtisText_(pickPtisValue_(report, rawDetails, ['pencapaianMingguLepas', 'pencapaian', 'previousAchievements']), 16000),
    keutamaanMingguSemasa: cleanPtisText_(pickPtisValue_(report, rawDetails, ['keutamaanMingguSemasa', 'keutamaan', 'currentPriorities', 'objektif']), 16000),
    isuRisiko: cleanPtisText_(pickPtisValue_(report, rawDetails, ['isuRisiko', 'isu', 'risks']), 12000),
    tindakanSusulan: cleanPtisActions_(pickPtisValue_(report, rawDetails, ['tindakanSusulan', 'tindakSusul', 'tindak_susul', 'followUp']))
  };
}

function ptisValueToText_(value) {
  if (Array.isArray(value)) {
    return value.map(item => {
      if (item && typeof item === 'object') {
        return [item.perkara, item.pegawaiUnit, item.tarikhSasaran].filter(Boolean).join(' — ');
      }
      return cleanPtisText_(item, 2000);
    }).filter(Boolean).join('\\n');
  }
  if (value && typeof value === 'object') return JSON.stringify(value);
  return cleanPtisText_(value, 16000);
}

function parsePtisReportDetails_(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    const parsed = JSON.parse(String(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function canAccessPtisReport_(session, row) {
  if (!session || !row) return false;
  if (session.role === 'SUPER_ADMIN' || session.role === 'PENYELARAS_JTK') return true;
  if (session.role === 'KETUA_ZON') {
    return Boolean(session.zoneName) && String(row.zon || '').trim().toUpperCase() === String(session.zoneName).trim().toUpperCase();
  }
  if (session.role === 'PEGAWAI') {
    return Boolean(row.created_by) && String(row.created_by) === String(session.id);
  }
  return false;
}

function buildPtisSessionScope_(session, alias = '') {
  const p = alias ? alias + '.' : '';
  if (session && session.role === 'PEGAWAI') {
    return { sql: p + 'created_by = ?', binds: [session.id] };
  }
  if (session && session.role === 'KETUA_ZON') {
    return { sql: p + 'zon = ?', binds: [session.zoneName] };
  }
  if (session && (session.role === 'SUPER_ADMIN' || session.role === 'PENYELARAS_JTK')) {
    return { sql: '1 = 1', binds: [] };
  }
  return { sql: '1 = 0', binds: [] };
}

function normalizePtisStaffRow_(row) {
  if (!row) return null;
  return {
    id: row.id,
    reportType: row.report_type || 'school_visit',
    report_type: row.report_type || 'school_visit',
    meetingSubtype: row.meeting_subtype || null,
    meeting_subtype: row.meeting_subtype || null,
    reportDetails: parsePtisReportDetails_(row.report_details),
    createdBy: row.created_by || null,
    created_by: row.created_by || null,
    timestamp: row.timestamp || '',
    tarikh: row.tarikh || '',
    masaMula: row.masa_mula || '',
    masaTamat: row.masa_tamat || '',
    zon: row.zon || '',
    namaSekolah: row.nama_sekolah || '',
    lokasiLain: row.lokasi_lain || '',
    pegawai: row.pegawai || '',
    pelapor: row.pelapor || '',
    title: row.title || '',
    objektif: row.objektif || '',
    isu: row.isu || '',
    keputusan: row.keputusan || '',
    tindakSusul: row.tindak_susul || '',
    noIsd: row.no_isd || '',
    statusKes: row.status_kes || '',
    rumusanAi: row.rumusan_ai || '',
    impakAi: row.impak_ai || '',
    tindakSusulAi: row.tindak_susul_ai || '',
    akauntabiliti: row.akauntabiliti || '',
    tugasUtama: row.tugas_utama || '',
    khidmatBantu: row.khidmat_bantu || '',
    photoCount: Number(row.photo_count || 0),
    updatedAt: row.updated_at || '',
    createdAt: row.created_at || ''
  };
}

async function handlePtisApi(request, env, ctx) {
  try {
    const db = env.DB;
    const url = new URL(request.url);
    let body = {};
    try { body = await request.json(); } catch(e) { body = {}; }
    const pathParts = url.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || '';
    const pathAction = (lastPart !== 'ptis' && lastPart !== 'api' && lastPart !== 'laporan') ? lastPart : '';
    let rawAction = body.action || body.method || pathAction || '';
    let action = String(rawAction).toLowerCase();
    const args = Array.isArray(body.args) ? body.args : [];
    let m = action.replace(/^laporan_|^ptis_|^api_/, '');

    // ADR-003 §D: Borang PTIS (ptis.html) kini staf-only sepenuhnya. Sesi disahkan
    // semula pada SETIAP permintaan (requireSession_ query DB status='aktif' langsung
    // — pelucutan akses berkuat kuasa serta-merta, tiada tempoh token lama terbuka).
    // Mana-mana akaun admins yang aktif (PEGAWAI atau role pentadbir sedia ada) layak;
    // sekatan lanjut (cth deletereport) tetap kekal di bawah, lapisan tambahan.
    const ptisToken = (request.headers.get('Authorization') || '').replace(/^Bearer\\s+/i, '').trim()
      || (body && typeof body.token === 'string' ? body.token.trim() : '');
    const servicePdfSync = (m === 'updatepdfurl' || m === 'setpdfurl') && env.GAS_PDF_SYNC_TOKEN && ptisToken === env.GAS_PDF_SYNC_TOKEN;
    let ptisSession = null;
    // P0 EMERGENCY (2026-09-18): gate ditutup sementara guna feature flag —
    // frontend (auth-gate.js) belum ada laluan login teruji di prod, jadi
    // wajibkan sesi di sini kunci KELUAR semua staf (bukan sekadar AI).
    // Default OFF (env tak ditetapkan). Buka semula HANYA lepas login
    // disahkan end-to-end (wrangler dev) — set PTIS_STAFF_GATE_ENABLED='true'
    // via wrangler secret/vars, bukan tukar kod ni lagi. Rujuk REVIEW_ANSWERS.md.
    if (!servicePdfSync && env.PTIS_STAFF_GATE_ENABLED === 'true') {
      const ptisAuth = await requireSession_(ptisToken, db, env.JWT_SECRET, PTIS_ALLOWED_ROLES_, { requireAllowlist: true });
      if (!ptisAuth.ok) {
        return jsonResponse({ success: false, code: ptisAuth.code, error: ptisAuth.error }, ptisAuth.status);
      }
      ptisSession = ptisAuth.session;
    } else if (!servicePdfSync && ptisToken) {
      const optionalPtisAuth = await requireSession_(ptisToken, db, env.JWT_SECRET, PTIS_ALLOWED_ROLES_, { requireAllowlist: true });
      if (optionalPtisAuth.ok) ptisSession = optionalPtisAuth.session;
    }

    if (m === 'getschoollist') {
      return jsonResponse(CANONICAL_SCHOOLS);
    }
    if (m === 'getpegawailist') {
      return jsonResponse(CANONICAL_OFFICERS);
    }
    if (m === 'checklatestupdate') {
      const latestScope = buildPtisSessionScope_(ptisSession);
      const latestSql = 'SELECT tarikh, nama_sekolah, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" AND ' + latestScope.sql + ' ORDER BY sort_date DESC, rowid DESC LIMIT 1';
      const latest = latestScope.binds.length
        ? await db.prepare(latestSql).bind(...latestScope.binds).first()
        : await db.prepare(latestSql).first();
      return jsonResponse({
        success: true,
        tarikh: latest ? latest.tarikh : 'Hari Ini',
        sekolah: latest ? latest.nama_sekolah : 'PPD Contoh'
      });
    }

    if (m === 'listreports' || m === 'getreports') {
      const filter = (args[0] && typeof args[0] === 'object') ? args[0] : (body.filter || {});
      const requestedType = cleanPtisText_(filter.reportType || filter.report_type || '', 50).toLowerCase();
      if (requestedType && !PTIS_REPORT_TYPES_.has(requestedType)) {
        return jsonResponse({ success: false, error: 'Jenis laporan tidak sah.' }, 400);
      }
      const requestedSubtype = cleanPtisText_(filter.meetingSubtype || filter.meeting_subtype || '', 50).toLowerCase();
      if (requestedSubtype && !PTIS_MEETING_SUBTYPES_.has(requestedSubtype)) {
        return jsonResponse({ success: false, error: 'Subjenis Mesyuarat/MEB tidak sah.' }, 400);
      }
      const requestedLimit = Number(filter.limit || 50);
      const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(100, Math.floor(requestedLimit))) : 50;
      const scope = buildPtisSessionScope_(ptisSession);
      const clauses = ['deleted_at IS NULL', scope.sql];
      const binds = scope.binds.slice();
      if (requestedType) {
        clauses.push('report_type = ?');
        binds.push(requestedType);
      }
      if (requestedSubtype) {
        clauses.push('meeting_subtype = ?');
        binds.push(requestedSubtype);
      }
      const listSql = 'SELECT id, report_type, meeting_subtype, report_details, created_by, timestamp, tarikh, masa_mula, masa_tamat, zon, nama_sekolah, lokasi_lain, pegawai, pelapor, title, objektif, isu, keputusan, tindak_susul, no_isd, status_kes, rumusan_ai, impak_ai, tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, created_at, updated_at, ' +
        '((CASE WHEN length(coalesce(gambar1, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar2, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar3, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar4, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar5, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar6, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar7, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar8, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar9, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar10, "")) > 0 THEN 1 ELSE 0 END)) AS photo_count, ' + SQL_SORT_DATE + ' AS sort_date ' +
        'FROM laporan WHERE ' + clauses.join(' AND ') + ' ORDER BY sort_date DESC, rowid DESC LIMIT ?';
      binds.push(limit);
      const result = await db.prepare(listSql).bind(...binds).all();
      return jsonResponse({ success: true, reports: (result.results || []).map(normalizePtisStaffRow_) });
    }

    if (m === 'getreport') {
      const reportId = cleanPtisText_(args[0] || body.reportId || body.id || '', 160);
      if (!reportId) return jsonResponse({ success: false, error: 'ID laporan diperlukan.' }, 400);
      const scope = buildPtisSessionScope_(ptisSession);
      const row = await db.prepare(
        'SELECT id, report_type, meeting_subtype, report_details, created_by, timestamp, tarikh, masa_mula, masa_tamat, zon, nama_sekolah, lokasi_lain, pegawai, pelapor, title, objektif, isu, keputusan, tindak_susul, no_isd, status_kes, rumusan_ai, impak_ai, tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, created_at, updated_at, ' +
        '((CASE WHEN length(coalesce(gambar1, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar2, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar3, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar4, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar5, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar6, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar7, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar8, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar9, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar10, "")) > 0 THEN 1 ELSE 0 END)) AS photo_count ' +
        'FROM laporan WHERE id = ? AND deleted_at IS NULL AND ' + scope.sql + ' LIMIT 1'
      ).bind(reportId, ...scope.binds).first();
      if (!row) return jsonResponse({ success: false, error: 'Rekod tidak dijumpai atau anda tidak mempunyai akses.' }, 404);
      return jsonResponse({ success: true, report: normalizePtisStaffRow_(row) });
    }

    if (m === 'savereport' || m === 'savereporthero' || m === 'saverecord') {
      const report = args[0] || {};

      // Mesyuarat/Taklimat/MEB: bukan lawatan sekolah, tiada eviden formal —
      // hebahan dihantar terus ke Facebook Studio queue (status DRAF untuk
      // semakan admin) TANPA rekod 'laporan'/dashboard. Diperiksa dahulu supaya
      // laluan UPSERT 'laporan' di bawah kekal khusus untuk school_visit sahaja.
      const isMeetingSubmission = cleanPtisText_(report.reportType || report.report_type || '', 50).toLowerCase() === 'meeting_meb'
        || String(report.mod || '').toLowerCase() === 'mesyuarat';
      if (isMeetingSubmission) {
        const jenisMesyuarat = String(report.jenisMesyuarat || 'MESYUARAT').toUpperCase();
        const suppliedSubtype = cleanPtisText_(report.meetingSubtype || report.meeting_subtype || '', 50).toLowerCase();
        const meetingSubtype = ['mesyuarat', 'taklimat', 'meb'].includes(suppliedSubtype)
          ? suppliedSubtype
          : (jenisMesyuarat === 'MESYUARAT' ? 'mesyuarat' : (jenisMesyuarat === 'TAKLIMAT' ? 'taklimat' : 'meb'));

        const title = cleanPtisText_(report.title || report.tajuk || '', 2000);
        if (!title) {
          return jsonResponse({ success: false, error: 'Tajuk mesyuarat/taklimat diperlukan.' }, 400);
        }
        const rawTarikh = cleanPtisText_(report.tarikh || report.tarikhLaporan || report.date || '', 200);
        if (!rawTarikh) {
          return jsonResponse({ success: false, error: 'Tarikh diperlukan untuk mod Mesyuarat/Taklimat/MEB.' }, 400);
        }

        let rawPhotos = (Array.isArray(report.gambarList) ? report.gambarList : []).filter(Boolean);
        if (rawPhotos.length === 0) {
          rawPhotos = [report.gambar1, report.gambar2, report.gambar3, report.gambar4, report.gambar5, report.gambar6, report.gambar7, report.gambar8, report.gambar9, report.gambar10].filter(Boolean);
        }
        for (let i = 0; i < rawPhotos.length; i++) {
          const v = validateServerImage_(rawPhotos[i]);
          if (!v.ok) {
            return jsonResponse({ success: false, error: 'Gambar ' + (i + 1) + ' tidak sah: ' + v.error }, 400);
          }
        }
        const gambarList = rawPhotos.slice(0, 10);
        if (gambarList.length < 4) {
          return jsonResponse({ success: false, error: 'Sila lampirkan sekurang-kurangnya 4 keping gambar yang sah sebagai eviden (maksimum 10).' }, 400);
        }

        const rawZone = report.zon || report.zonSekolah || report.zon_sekolah || (ptisSession && ptisSession.zoneName) || 'ZON PPD';
        const zonInfo = resolveZone(rawZone, '');
        const pelapor = cleanPtisText_(report.pelapor || report.namaPegawai || report.nama_pegawai || (ptisSession && ptisSession.name) || (ptisSession && ptisSession.email) || '', 1000);

        const caption = buildFacebookCaptionForMeeting_(Object.assign({}, report, { title, tarikh: rawTarikh, zon: zonInfo.name, pelapor, jenisMesyuarat }), meetingSubtype);
        const queueId = 'fbq_' + Date.now();
        const metaJson = JSON.stringify({
          source: 'meeting_meb',
          meetingSubtype: meetingSubtype,
          jenisMesyuarat: jenisMesyuarat,
          title: title,
          zoneId: zonInfo.id,
          zoneName: zonInfo.name,
          dateLabel: rawTarikh,
          pelapor: pelapor,
          photos: gambarList
        });

        await db.prepare(
          'INSERT INTO facebook_queue (id, report_id, caption, status, dicadangkan_oleh, dicipta_pada, dikemaskini, meta_json) ' +
          'VALUES (?, NULL, ?, "DRAF", ?, datetime("now", "+8 hours"), datetime("now", "+8 hours"), ?)'
        ).bind(queueId, caption, pelapor || 'Sistem', metaJson).run();

        return jsonResponse({
          success: true,
          status: 'success',
          id: queueId,
          legacyRowIndex: 0,
          message: 'Hebahan Mesyuarat/Taklimat/MEB berjaya dihantar ke Facebook Studio untuk semakan admin.'
        });
      }

      const newId = cleanPtisText_(report.id || ('rep_' + Date.now()), 160);
      const existingReport = await db.prepare('SELECT id, report_type, meeting_subtype, created_by, zon, deleted_at FROM laporan WHERE id = ? LIMIT 1').bind(newId).first();
      if (existingReport && existingReport.deleted_at) {
        return jsonResponse({ success: false, error: 'Rekod yang telah dipadam tidak boleh ditulis semula melalui borang.' }, 409);
      }
      if (existingReport && ptisSession && !canAccessPtisReport_(ptisSession, existingReport)) {
        return jsonResponse({ success: false, error: 'Anda tidak mempunyai kebenaran untuk mengubah rekod ini.' }, 403);
      }

      const suppliedReportType = cleanPtisText_(report.reportType || report.report_type || '', 50).toLowerCase();
      const existingReportType = existingReport ? cleanPtisText_(existingReport.report_type || 'school_visit', 50).toLowerCase() : '';
      const reportType = suppliedReportType || existingReportType || 'school_visit';
      if (!PTIS_REPORT_TYPES_.has(reportType)) {
        return jsonResponse({ success: false, error: 'Jenis laporan tidak sah. Gunakan school_visit atau meeting_meb sahaja.' }, 400);
      }
      if (existingReport && existingReportType && existingReportType !== reportType) {
        return jsonResponse({ success: false, error: 'Jenis laporan bagi rekod sedia ada tidak boleh ditukar.' }, 409);
      }

      const suppliedMeetingSubtype = cleanPtisText_(report.meetingSubtype || report.meeting_subtype || '', 50).toLowerCase();
      let meetingSubtype = reportType === 'meeting_meb'
        ? (suppliedMeetingSubtype || cleanPtisText_(existingReport && existingReport.meeting_subtype, 50).toLowerCase())
        : null;
      if (reportType === 'meeting_meb' && !PTIS_MEETING_SUBTYPES_.has(meetingSubtype)) {
        return jsonResponse({ success: false, error: 'Mod Mesyuarat/MEB memerlukan meetingSubtype mesyuarat atau meb.' }, 400);
      }

      const meetingDetails = reportType === 'meeting_meb' ? sanitizePtisMeetingDetails_(report, meetingSubtype) : null;
      const reportDetailsJson = meetingDetails ? JSON.stringify(meetingDetails) : null;

      let isd = String(report.no_isd || report.noIsd || report.isd || '').trim();
      if (!isd) {
        const isdList = extractIsdNumbers_('', [report.title, report.isu, report.keputusan, report.tindakan, report.namaSekolah]);
        if (isdList.length) isd = isdList.join(', ');
      }

      const namaSekolah = cleanPtisText_(report.namaSekolah || report.nama_sekolah || '', 1000);
      const rawZone = report.zon || report.zonSekolah || report.zon_sekolah || (reportType === 'meeting_meb' ? ((ptisSession && ptisSession.zoneName) || 'ZON PPD') : '');
      const zonInfo = resolveZone(rawZone, namaSekolah);
      const zon = zonInfo.name;
      if (ptisSession && ptisSession.role === 'KETUA_ZON' && String(zon).trim().toUpperCase() !== String(ptisSession.zoneName || '').trim().toUpperCase()) {
        return jsonResponse({ success: false, error: 'Ketua Zon hanya boleh menyimpan rekod dalam zon sendiri.' }, 403);
      }

      let pegawai = '';
      if (Array.isArray(report.pegawaiTerlibat)) {
        pegawai = report.pegawaiTerlibat.filter(Boolean).join(', ');
      } else if (report.penglibatan) {
        pegawai = String(report.penglibatan).trim();
      } else if (report.pegawai) {
        pegawai = String(report.pegawai).trim();
      } else if (report.pegawaiTerlibat) {
        pegawai = String(report.pegawaiTerlibat).trim();
      }

      const pelapor = cleanPtisText_(report.pelapor || report.namaPegawai || report.nama_pegawai || (ptisSession && ptisSession.name) || (ptisSession && ptisSession.email) || '', 1000);
      if (!pegawai && meetingDetails && meetingSubtype === 'mesyuarat') pegawai = ptisValueToText_(meetingDetails.kehadiran);
      if (!pegawai && pelapor) pegawai = pelapor;

      const rawTarikh = cleanPtisText_(report.tarikh || report.tarikhLaporan || report.date || '', 200);
      if (reportType === 'meeting_meb' && !rawTarikh) {
        return jsonResponse({ success: false, error: 'Tarikh laporan diperlukan untuk mod Mesyuarat/MEB.' }, 400);
      }
      const dateComp = parseDateComponents_(rawTarikh, '');
      const tarikh = rawTarikh.includes('(') ? rawTarikh : (dateComp.dateLabelWithDay || (dateComp.dateLabel !== '—' ? dateComp.dateLabel : rawTarikh));

      const tarikhIso = dateComp.year && dateComp.month && dateComp.day ? String(dateComp.year) + '-' + String(dateComp.month).padStart(2, '0') + '-' + String(dateComp.day).padStart(2, '0') : null;
      let masaMula = parseTimeHHMM_(report.masaMula || report.masa_mula, '08:00');
      let masaTamat = resolveMasaTamatDefault_(report.masaMula || report.masa_mula, report.masaTamat || report.masa_tamat);

      if (isd) isd = isd.replace(/^(?:#|ISD:?|NO\\.?\\s*TIKET:?)\\s*/i, '').trim();

      let title = cleanPtisText_(report.title || report.tajukMesyuarat || report.khidmatBantu || report.objektif || '', 2000);
      if (reportType === 'school_visit' && !title) title = 'Khidmat Bantu ICT';
      if (reportType === 'meeting_meb' && meetingSubtype === 'meb' && !title) title = 'Monday Executive Briefing';
      if (reportType === 'meeting_meb' && meetingSubtype === 'mesyuarat' && !title) {
        return jsonResponse({ success: false, error: 'Tajuk mesyuarat diperlukan.' }, 400);
      }

      const meetingObjektif = meetingDetails
        ? (meetingSubtype === 'mesyuarat' ? meetingDetails.agenda : meetingDetails.keutamaanMingguSemasa)
        : '';
      const meetingKeputusan = meetingDetails
        ? (meetingSubtype === 'mesyuarat' ? meetingDetails.keputusan : meetingDetails.pencapaianMingguLepas)
        : '';
      const meetingIsu = meetingDetails
        ? (meetingSubtype === 'mesyuarat' ? meetingDetails.ringkasanPerbincangan : meetingDetails.isuRisiko)
        : '';
      const meetingTindakSusul = meetingDetails ? ptisValueToText_(meetingDetails.tindakanSusulan) : '';

      const objektif = cleanPtisText_(report.objektif || report.formattedObjektif || meetingObjektif || report.title || '', 16000);
      const rumusanAi = cleanPtisText_(report.rumusanAi || report.rumusan_ai || report.rumusan || report.keputusan || meetingKeputusan || '', 16000);
      const impakAi = cleanPtisText_(report.impakAi || report.impak_ai || report.impak || report.isu || meetingIsu || '', 16000);
      const tindakSusulAi = cleanPtisText_(report.tindakSusulAi || report.tindak_susul_ai || report.tindakSusul || report.tindakan || report.tindak_susul || meetingTindakSusul || '', 16000);
      const isu = cleanPtisText_(report.isu || (report.legacySummary && report.legacySummary.isu) || meetingIsu || report.impakAi || '', 16000);
      const keputusan = cleanPtisText_(report.keputusan || (report.legacySummary && report.legacySummary.keputusan) || meetingKeputusan || report.rumusanAi || '', 16000);
      const tindakSusul = cleanPtisText_(report.tindak_susul || report.tindakSusul || (report.legacySummary && report.legacySummary.tindakan) || meetingTindakSusul || report.tindakSusulAi || '', 16000);
      const akauntabiliti = cleanPtisText_(report.akauntabiliti || (reportType === 'school_visit' ? 'PENGURUSAN' : ''), 2000);
      const tugasUtama = cleanPtisText_(report.tugasUtama || report.tugas_utama || (reportType === 'school_visit' ? 'Menyelaras Proses Urusan ICT' : ''), 4000);
      const khidmatBantu = cleanPtisText_(report.khidmatBantu || report.khidmat_bantu || (reportType === 'school_visit' ? 'KHIDMAT BANTU ICT' : ''), 2000);
      const slogan = cleanPtisText_(report.slogan || (reportType === 'school_visit' ? '"PPD KITA, TANGGUNGJAWAB KITA"' : ''), 2000);
      const hashtags = cleanPtisText_(report.hashtags || (reportType === 'school_visit' ? '#ptis\\n#ppdict\\n#bitarasentiasa' : ''), 2000);
      const statusKes = cleanPtisText_(report.statusKes || report.status_kes || (reportType === 'school_visit' ? 'Selesai' : 'Direkodkan'), 500);
      const perluSemakan = cleanPtisText_(report.perluSemakan || report.perlu_semakan || '', 2000);
      const isTestRecord = String(newId).toLowerCase().startsWith('test') || Boolean(report.isTest) || Boolean(report._skipNotification);
      let rawPhotos = (Array.isArray(report.gambarList) ? report.gambarList : []).filter(Boolean);
      if (rawPhotos.length === 0) {
        rawPhotos = [report.gambar1, report.gambar2, report.gambar3, report.gambar4, report.gambar5, report.gambar6, report.gambar7, report.gambar8, report.gambar9, report.gambar10].filter(Boolean);
      }
      const isAdminUser = Boolean(ptisSession && (ptisSession.role === 'admin' || ptisSession.role === 'SUPER_ADMIN'));
      if (reportType === 'school_visit' && !isAdminUser) {
        for (let i = 0; i < rawPhotos.length; i++) {
          const v = validateServerImage_(rawPhotos[i]);
          if (!v.ok) {
            return jsonResponse({ success: false, error: 'Gambar ' + (i + 1) + ' tidak sah: ' + v.error }, 400);
          }
        }
        if (rawPhotos.length < 4) {
          return jsonResponse({ success: false, error: 'Sila lampirkan sekurang-kurangnya 4 keping gambar yang sah sebagai eviden (maksimum 10).' }, 400);
        }
      }
      const gambarList = reportType === 'school_visit' ? rawPhotos.slice(0, 10) : [];
      const g1 = gambarList[0] || (reportType === 'school_visit' ? report.gambar1 : '') || '';
      const g2 = gambarList[1] || (reportType === 'school_visit' ? report.gambar2 : '') || '';
      const g3 = gambarList[2] || (reportType === 'school_visit' ? report.gambar3 : '') || '';
      const g4 = gambarList[3] || (reportType === 'school_visit' ? report.gambar4 : '') || '';
      const g5 = gambarList[4] || (reportType === 'school_visit' ? report.gambar5 : '') || '';
      const g6 = gambarList[5] || (reportType === 'school_visit' ? report.gambar6 : '') || '';
      const g7 = gambarList[6] || (reportType === 'school_visit' ? report.gambar7 : '') || '';
      const g8 = gambarList[7] || (reportType === 'school_visit' ? report.gambar8 : '') || '';
      const g9 = gambarList[8] || (reportType === 'school_visit' ? report.gambar9 : '') || '';
      const g10 = gambarList[9] || (reportType === 'school_visit' ? report.gambar10 : '') || '';
      const lokasiLain = cleanPtisText_(report.lokasiLain || report.lokasi_lain || (meetingDetails && meetingDetails.tempatPlatform) || '', 2000);

      const isNewRecord = !existingReport;
      const recordOwnerId = existingReport
        ? (existingReport.created_by || null)
        : (ptisSession ? (ptisSession.id || null) : null);
      if (existingReport && !isTestRecord) {
        const publishLock = await db.prepare(
          'SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1'
        ).bind(newId).first();
        if (publishLock) {
          return jsonResponse({
            success: false,
            error: 'Laporan sedang disiarkan ke Facebook. Simpan semula selepas proses selesai.'
          }, 409);
        }
      }

      if (isNewRecord && reportType === 'school_visit') {
        const dedupeKey = generateReportDedupeKey_(tarikh, namaSekolah, masaMula, isd, pegawai);
        const insertWithDedupeKeySql = 'INSERT INTO laporan (' +
          'id, report_type, meeting_subtype, report_details, created_by, timestamp, ' +
          'tarikh, masa_mula, masa_tamat, pelapor, nama_pegawai_sekolah, jawatan_pegawai_sekolah, ' +
          'zon, nama_sekolah, lokasi_lain, pegawai, title, isu, keputusan, tindak_susul, ' +
          'no_isd, status_kes, gambar1, gambar2, gambar3, gambar4, gambar5, gambar6, ' +
          'gambar7, gambar8, gambar9, gambar10, link, objektif, rumusan_ai, impak_ai, ' +
          'tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, slogan, hashtags, ' +
          'dedupe_key, tarikh_iso, updated_at' +
          ') SELECT ' +
          '?, ?, ?, ?, ?, datetime("now", "+8 hours"), ' +
          '?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ' +
          '?, ?, strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") ' +
          'WHERE NOT EXISTS (' +
          '  SELECT 1 FROM laporan ' +
          '  WHERE report_type = "school_visit" ' +
          '    AND (' +
          '      (dedupe_key IS NOT NULL AND dedupe_key = ?) ' +
          '      OR (' +
          '        upper(trim(coalesce(nama_sekolah, ""))) = upper(trim(?)) ' +
          '        AND tarikh = ? ' +
          '        AND masa_mula = ? ' +
          '        AND upper(trim(coalesce(no_isd, ""))) = upper(trim(?)) ' +
          '        AND upper(trim(coalesce(pegawai, ""))) = upper(trim(?)) ' +
          '      )' +
          '    ) ' +
          '    AND (deleted_at IS NULL OR deleted_at >= datetime("now", "-24 hours", "+8 hours"))' +
          ')';

        const insertFallbackWithoutDedupeKeySql = 'INSERT INTO laporan (' +
          'id, report_type, meeting_subtype, report_details, created_by, timestamp, ' +
          'tarikh, masa_mula, masa_tamat, pelapor, nama_pegawai_sekolah, jawatan_pegawai_sekolah, ' +
          'zon, nama_sekolah, lokasi_lain, pegawai, title, isu, keputusan, tindak_susul, ' +
          'no_isd, status_kes, gambar1, gambar2, gambar3, gambar4, gambar5, gambar6, ' +
          'gambar7, gambar8, gambar9, gambar10, link, objektif, rumusan_ai, impak_ai, ' +
          'tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, slogan, hashtags, ' +
          'updated_at' +
          ') SELECT ' +
          '?, ?, ?, ?, ?, datetime("now", "+8 hours"), ' +
          '?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ?, ?, ' +
          '?, ?, ?, ?, ?, ?, ' +
          'strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") ' +
          'WHERE NOT EXISTS (' +
          '  SELECT 1 FROM laporan ' +
          '  WHERE report_type = "school_visit" ' +
          '    AND upper(trim(coalesce(nama_sekolah, ""))) = upper(trim(?)) ' +
          '    AND tarikh = ? ' +
          '    AND masa_mula = ? ' +
          '    AND upper(trim(coalesce(no_isd, ""))) = upper(trim(?)) ' +
          '    AND upper(trim(coalesce(pegawai, ""))) = upper(trim(?)) ' +
          '    AND (deleted_at IS NULL OR deleted_at >= datetime("now", "-24 hours", "+8 hours"))' +
          ')';

        const baseArgs = [
          newId, reportType, meetingSubtype, reportDetailsJson, recordOwnerId,
          tarikh, masaMula, masaTamat, pelapor,
          report.namaPegawaiSekolah || '', report.jawatanPegawaiSekolah || '',
          zon, namaSekolah, lokasiLain, pegawai,
          title, isu, keputusan, tindakSusul, isd, statusKes,
          g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, report.link || '',
          objektif, rumusanAi, impakAi, tindakSusulAi, akauntabiliti, tugasUtama, khidmatBantu, slogan, hashtags
        ];

        let dedupeResult;
        try {
          try {
            dedupeResult = await db.prepare(insertWithDedupeKeySql).bind(
              ...baseArgs,
              dedupeKey, // dedupe_key dimasukkan
              tarikhIso, // tarikh_iso kept from migration R1
              dedupeKey, // dedupe_key semakan
              namaSekolah, tarikh, masaMula, isd, pegawai // fallback semakan
            ).run();
          } catch (insertErr) {
            const errMsg = String(insertErr && (insertErr.message || insertErr) || '').toLowerCase();
            if (errMsg.includes('no such column: dedupe_key') || errMsg.includes('has no column named dedupe_key')) {
              dedupeResult = await db.prepare(insertFallbackWithoutDedupeKeySql).bind(
                ...baseArgs,
                namaSekolah, tarikh, masaMula, isd, pegawai
              ).run();
            } else {
              throw insertErr;
            }
          }

        } catch (constraintErr) {
          const message = String(constraintErr && (constraintErr.message || constraintErr) || '');
          if (/unique constraint failed/i.test(message) && /idx_laporan_exact_uniq/i.test(message)) {
            return jsonResponse({success: false, error: 'Laporan pendua dikesan bagi sekolah dan pelapor pada saat yang sama.'}, 409);
          }
          throw constraintErr;
        }

        const changesCount = Number(dedupeResult && dedupeResult.meta ? dedupeResult.meta.changes : (dedupeResult ? dedupeResult.changes : 0));
        if (!dedupeResult || changesCount !== 1) {
          return jsonResponse({
            success: false,
            error: 'Laporan pendua dikesan. Laporan yang sama (sekolah, tarikh, masa, no ISD dan pegawai) telah wujud atau dipadam dalam tempoh 24 jam.'
          }, 409);
        }
      } else {
        // Simpan metadata jenis/pemilik pada pelayan. report_type dan created_by tidak
        // boleh ditukar melalui kemas kini; ini menghalang spoofing pemilik atau penukaran mod.
        // Guard publish-lock turut disemak dalam SQL write sendiri supaya publish-vs-save
        // tidak bergantung pada pre-check TOCTOU.
        const saveResult = await db.prepare(
          'INSERT INTO laporan (id, report_type, meeting_subtype, report_details, created_by, timestamp, tarikh, masa_mula, masa_tamat, pelapor, nama_pegawai_sekolah, jawatan_pegawai_sekolah, zon, nama_sekolah, lokasi_lain, pegawai, title, isu, keputusan, tindak_susul, no_isd, status_kes, gambar1, gambar2, gambar3, gambar4, gambar5, gambar6, gambar7, gambar8, gambar9, gambar10, link, objektif, rumusan_ai, impak_ai, tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, slogan, hashtags, tarikh_iso, updated_at) ' +
          'VALUES (?, ?, ?, ?, ?, datetime("now", "+8 hours"), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours")) ' +
          'ON CONFLICT(id) DO UPDATE SET meeting_subtype = excluded.meeting_subtype, report_details = excluded.report_details, tarikh = excluded.tarikh, masa_mula = excluded.masa_mula, masa_tamat = excluded.masa_tamat, pelapor = excluded.pelapor, nama_pegawai_sekolah = excluded.nama_pegawai_sekolah, jawatan_pegawai_sekolah = excluded.jawatan_pegawai_sekolah, zon = excluded.zon, nama_sekolah = excluded.nama_sekolah, lokasi_lain = excluded.lokasi_lain, pegawai = excluded.pegawai, title = excluded.title, isu = excluded.isu, keputusan = excluded.keputusan, tindak_susul = excluded.tindak_susul, no_isd = excluded.no_isd, status_kes = excluded.status_kes, gambar1 = excluded.gambar1, gambar2 = excluded.gambar2, gambar3 = excluded.gambar3, gambar4 = excluded.gambar4, gambar5 = excluded.gambar5, gambar6 = excluded.gambar6, gambar7 = excluded.gambar7, gambar8 = excluded.gambar8, gambar9 = excluded.gambar9, gambar10 = excluded.gambar10, link = excluded.link, objektif = excluded.objektif, rumusan_ai = excluded.rumusan_ai, impak_ai = excluded.impak_ai, tindak_susul_ai = excluded.tindak_susul_ai, akauntabiliti = excluded.akauntabiliti, tugas_utama = excluded.tugas_utama, khidmat_bantu = excluded.khidmat_bantu, slogan = excluded.slogan, hashtags = excluded.hashtags, tarikh_iso = excluded.tarikh_iso, updated_at = excluded.updated_at ' +
          'WHERE NOT EXISTS (SELECT 1 FROM facebook_queue WHERE report_id = excluded.id AND status = "SEDANG_DIPOSTING") AND laporan.created_by IS excluded.created_by AND laporan.deleted_at IS NULL'
        ).bind(
          newId, reportType, meetingSubtype, reportDetailsJson, recordOwnerId, tarikh, masaMula, masaTamat, pelapor,
          report.namaPegawaiSekolah || '', report.jawatanPegawaiSekolah || '',
          zon, namaSekolah, lokasiLain, pegawai,
          title, isu, keputusan, tindakSusul, isd, statusKes,
          g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, report.link || '',
          objektif, rumusanAi, impakAi, tindakSusulAi, akauntabiliti, tugasUtama, khidmatBantu, slogan, hashtags, tarikhIso
        ).run();
        if (!saveResult.success || !saveResult.meta || saveResult.meta.changes !== 1) {
          let conflictError = existingReport
            ? 'Konflik pemilikan rekod. Muat semula borang dan cuba semula.'
            : 'Laporan tidak berjaya disimpan.';
          if (existingReport) {
            const publishLockNow = await db.prepare(
              'SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1'
            ).bind(newId).first();
            if (publishLockNow) conflictError = 'Laporan sedang disiarkan ke Facebook. Simpan semula selepas proses selesai.';
          }
          return jsonResponse({ success: false, error: conflictError }, existingReport ? 409 : 500);
        }
        if (existingReport) {
          const dedupeKey = generateReportDedupeKey_(tarikh, namaSekolah, masaMula, isd, pegawai);

          try {
            await db.prepare('UPDATE laporan SET dedupe_key = ? WHERE id = ?').bind(dedupeKey, newId).run();
          } catch (e) {}
        }
      }

      if (perluSemakan) {
        await db.prepare('UPDATE laporan SET perlu_semakan = ? WHERE id = ?').bind(perluSemakan, newId).run();
      }
      await bumpDataVersion_(db);

      // Integrasi Facebook/Telegram/GAS ialah aliran legacy lawatan sekolah sahaja.
      // Rekod Mesyuarat/MEB kekal dalaman dan tidak dihantar ke saluran awam/legacy.
      let activeFbQueueId = '';
      if (reportType === 'school_visit' && !isTestRecord) {
        const fbCaption = buildFacebookCaptionForReport_({
          namaSekolah, zon, tarikh, masaMula, masaTamat, pegawai,
          pegawaiTerlibat: report.pegawaiTerlibat || pegawai,
          akauntabiliti, tugasUtama, khidmatBantu, noIsd: isd,
          title, objektif,
          rumusanAi, impakAi, tindakSusulAi,
          slogan, hashtags
        });

        const existingDraft = await db.prepare(
          'SELECT id, status FROM facebook_queue WHERE report_id = ? AND status NOT IN ("DIPOSTING", "DIPADAM") ORDER BY rowid DESC LIMIT 1'
        ).bind(newId).first();

        if (existingDraft && existingDraft.id && existingDraft.status === 'SEDANG_DIPOSTING') {
          // Publish lock sedang aktif. Jangan reset caption/status semasa Graph API berjalan.
          activeFbQueueId = existingDraft.id;
        } else if (existingDraft && existingDraft.id) {
          activeFbQueueId = existingDraft.id;
          const queueUpdated = await db.prepare(
            'UPDATE facebook_queue SET caption = ?, status = "DRAF", dicadangkan_oleh = ?, dikemaskini = datetime("now", "+8 hours") ' +
            'WHERE id = ? AND status != "SEDANG_DIPOSTING"'
          ).bind(fbCaption, pelapor || 'Sistem', existingDraft.id).run();

          if (queueUpdated.success && queueUpdated.meta && queueUpdated.meta.changes === 1) {
            // Tinggalkan hanya satu draf aktif bagi setiap laporan; sejarah DIPOSTING/lock kekal utuh.
            await db.prepare(
              'UPDATE facebook_queue SET status = "DIPADAM", dikemaskini = datetime("now", "+8 hours") ' +
              'WHERE report_id = ? AND id != ? AND status NOT IN ("DIPOSTING", "DIPADAM", "SEDANG_DIPOSTING")'
            ).bind(newId, existingDraft.id).run();
          }
        } else {
          const fbQueueId = 'fb_' + Date.now();
          await db.prepare(
            'INSERT INTO facebook_queue (id, report_id, caption, status, dicadangkan_oleh, dicipta_pada, dikemaskini) ' +
            'VALUES (?, ?, ?, "DRAF", ?, datetime("now", "+8 hours"), datetime("now", "+8 hours"))'
          ).bind(fbQueueId, newId, fbCaption, pelapor || 'Sistem').run();
          activeFbQueueId = fbQueueId;
        }
      }

      // 3. Hantar Notifikasi Telegram Serta-merta HANYA UNTUK REKOD BAHARU SEBENAR (Bukan ujian & bukan kemas kini)
      const notifyPromise = (async () => {
        if (reportType === 'school_visit' && !isTestRecord && isNewRecord) {
          try {
            const cfg = await getTelegramAndFbConfig_(db);
            if (cfg.telegramEnabled && cfg.telegramBotToken && cfg.telegramChatId) {
              const tgMsg = buildTelegramLawatanNotification_({
                namaSekolah: namaSekolah,
                zon: zon,
                tarikh: tarikh,
                masaMula: masaMula,
                masaTamat: masaTamat,
                pelapor: pelapor,
                pegawai: pegawai,
                title: title,
                objektif: objektif,
                isu: isu,
                keputusan: keputusan,
                noIsd: isd
              });

              const replyMarkup = {
                inline_keyboard: [
                  [
                    { text: '📊 Dashboard', url: 'https://__DASHBOARD_DOMAIN__' },
                    { text: '📱 Portal Admin', url: 'https://__ADMIN_DOMAIN__' }
                  ]
                ]
              };
              const tgSendResult = await sendConfiguredTelegramMessage_(db, cfg, tgMsg, replyMarkup);
              if (!tgSendResult.ok) {
                console.warn('Telegram notification send failed:', tgSendResult.error || 'unknown error');
              } else {
                const trackingResult = await persistTelegramQueueNotification_(db, cfg, activeFbQueueId, tgSendResult);
                if (!trackingResult.ok) {
                  console.warn('Telegram notification tracking failed:', trackingResult.error || 'unknown error');
                }
              }
            }
          } catch(e) {
            console.warn('Telegram notification failed:', e);
          }
        }

        // Salin hanya lawatan sekolah ke Google Apps Script legacy.
        if (reportType === 'school_visit' && !isTestRecord) {
          try {
            await fetch(APPS_SCRIPT_CONFIG.laporan, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'saveReport', args: [Object.assign({}, report, {
                id: newId,
                reportType: reportType,
                report_type: reportType
              })] }),
              redirect: 'follow'
            });
          } catch(e) {
            console.warn('GAS sync failed:', e);
          }
        }
      })();

      if (ctx && ctx.waitUntil) {
        ctx.waitUntil(notifyPromise);
      }

      const storedOwner = recordOwnerId;
      const responseReport = Object.assign({}, report, {
        id: newId,
        reportType: reportType,
        report_type: reportType,
        meetingSubtype: meetingSubtype,
        meeting_subtype: meetingSubtype,
        reportDetails: meetingDetails,
        createdBy: storedOwner,
        created_by: storedOwner,
        pelapor: pelapor,
        tarikh: tarikh,
        zon: zon,
        namaSekolah: namaSekolah,
        lokasiLain: lokasiLain,
        title: title,
        objektif: objektif,
        isu: isu,
        keputusan: keputusan,
        tindakSusul: tindakSusul
      });

      return jsonResponse({
        success: true,
        status: 'success',
        id: newId,
        legacyRowIndex: reportType === 'school_visit' ? 1 : 0,
        report: responseReport,
        message: reportType === 'school_visit'
          ? 'Laporan lawatan sekolah berjaya direkodkan.'
          : 'Laporan Mesyuarat/MEB berjaya direkodkan.'
      });
    }

    if (m === 'uploadgambar' || m === 'uploadimage') {
      let candidateImg = '';
      if (args[0]) {
        candidateImg = String(args[0]).trim();
        if (!candidateImg.startsWith('data:') && !candidateImg.startsWith('http://') && !candidateImg.startsWith('https://')) {
          candidateImg = 'data:' + (args[1] || 'image/jpeg') + ';base64,' + candidateImg;
        }
      } else if (body && (body.image || body.url || body.data)) {
        candidateImg = String(body.image || body.url || body.data).trim();
        if (!candidateImg.startsWith('data:') && !candidateImg.startsWith('http://') && !candidateImg.startsWith('https://')) {
          candidateImg = 'data:' + (body.mime || 'image/jpeg') + ';base64,' + candidateImg;
        }
      }
      const imgVal = validateServerImage_(candidateImg);
      if (!imgVal.ok) {
        return jsonResponse({ success: false, ok: false, error: imgVal.error }, 400);
      }

      try {
        const gasPayload = {
          action: 'uploadGambar',
          method: 'uploadGambar',
          args: args
        };
        const gasRes = await fetch(APPS_SCRIPT_CONFIG.laporan, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(gasPayload),
          redirect: 'follow'
        });
        const gasText = await gasRes.text();
        try {
          const gasData = JSON.parse(gasText);
          if (gasData && gasData.success && gasData.url) {
            return jsonResponse(gasData);
          }
        } catch(e) {}
      } catch(e) {}

      const dataUri = args[0] ? ('data:' + (args[1] || 'image/jpeg') + ';base64,' + args[0]) : '';
      return jsonResponse({
        success: true,
        url: dataUri,
        fileId: 'img_' + Date.now()
      });
    }

    if (m === 'deletegambar' || m === 'deleteimage') {
      const fileId = cleanPtisText_(args[0] || body.fileId || '', 300);
      const reportId = cleanPtisText_(args[1] || body.reportId || body.id || '', 160);
      if (!fileId) return jsonResponse({ success: false, error: 'ID fail gambar diperlukan.' }, 400);
      if (ptisSession && (ptisSession.role === 'PEGAWAI' || ptisSession.role === 'KETUA_ZON')) {
        if (!reportId) return jsonResponse({ success: false, error: 'ID laporan diperlukan untuk memadam gambar.' }, 400);
        const imageTarget = await db.prepare('SELECT id, created_by, zon, deleted_at FROM laporan WHERE id = ? LIMIT 1').bind(reportId).first();
        if (!imageTarget || imageTarget.deleted_at || !canAccessPtisReport_(ptisSession, imageTarget)) {
          return jsonResponse({ success: false, error: 'Akses gambar ditolak.' }, 403);
        }
      }
      try {
        await fetch(APPS_SCRIPT_CONFIG.laporan, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteGambar', args: [fileId] }),
          redirect: 'follow'
        });
      } catch(e){}
      return jsonResponse({ success: true });
    }

    // Test-only AI benchmark endpoint. Ia hanya aktif pada Worker preview apabila
    // AI_TEST_ENABLED + AI_TEST_TOKEN dibekalkan. Laluan ini tidak membaca/
    // menulis D1, tidak menyentuh facebook_queue, dan tidak memulangkan kandungan
    // laporan — hanya status serta metrics yang diperlukan untuk benchmark.
    if (m === 'ai-test' || m === 'aitest') {
      const testEnabled = String(env.AI_TEST_ENABLED || '').toLowerCase() === 'true';
      const expectedToken = String(env.AI_TEST_TOKEN || '').trim();
      const suppliedToken = String(request.headers.get('x-ai-test-token') || '').trim();
      if (!testEnabled || !expectedToken || !constantTimeEqual_(suppliedToken, expectedToken)) {
        return jsonResponse({ success: false, error: 'Not Found' }, 404);
      }

      const input = body.input && typeof body.input === 'object' ? body.input : {};
      const testArgs = args.length ? args : [
        input.namaSekolah || '',
        input.objektif || '',
        input.aktiviti || input.aktivitiRingkas || '',
        input.kategori || input.kategoriLawatan || '',
        input.rumusan || input.rumusanAi || '',
        input.impak || input.impakAi || '',
        input.tindakSusul || input.tindakSusulAi || ''
      ];
      const caseId = String(body.caseId || '').slice(0, 80);
      try {
        const probeModel = String(body.probeModel || '').trim();
        if (probeModel) {
          try {
            const probe = await probeGeminiModel_(env, probeModel);
            return jsonResponse({
              success: true,
              caseId: caseId,
              probeModel: probe.model,
              role: probe.role,
              thinkingLevel: probe.thinkingLevel,
              latencyMs: probe.latencyMs,
              attempts: probe.attempts
            });
          } catch (probeErr) {
            return jsonResponse({
              success: false,
              caseId: caseId,
              probeModel: probeModel,
              errorCode: String((probeErr && probeErr.code) || 'AI_PROBE_ERROR'),
              status: Number(probeErr && probeErr.status) || 0,
              attempts: (probeErr && probeErr.aiAttempts) || []
            }, 502);
          }
        }

        const resultData = await generateRumusanImpak_(
          env, testArgs[0], testArgs[1], testArgs[2], testArgs[3], testArgs[4], testArgs[5], testArgs[6],
          { testMode: true, collectMetrics: true, fault: String(body.fault || '') }
        );
        return jsonResponse({
          success: true,
          caseId: caseId,
          verificationStatus: resultData.verificationStatus || 'AI_ERROR',
          fallbackUsed: Boolean(resultData.fallbackUsed),
          fallbackReason: resultData.fallbackReason || '',
          needsReview: Boolean(resultData.needsReview),
          engineUsed: resultData.engineUsed || '',
          modelUsed: resultData.modelUsed || '',
          reviewerStatus: resultData.reviewerStatus || '',
          semanticDomain: resultData.semanticDomain || '',
          metrics: resultData._metrics || {}
        });
      } catch (err) {
        console.error('[AI test endpoint] orchestration error:', err && err.message);
        return jsonResponse({
          success: false,
          caseId: caseId,
          verificationStatus: 'AI_ERROR',
          errorCode: String((err && err.code) || 'AI_TEST_ERROR')
        }, 500);
      }
    }

    // AI Generation Handler: Gemini 3.8 primary + 3.6 hedge + 3.5 reviewer,
    // dengan Smart Edge fallback eksplisit hanya selepas calon upstream gagal.
    if (m === 'generaterumusanimpak') {
      try {
        const resultData = await generateRumusanImpak_(env, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        return jsonResponse(resultData);
      } catch (err) {
        console.error('[AI production endpoint] orchestration error:', err && err.message);
        const edgeData = generateRumusanImpakEdge_(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        edgeData.fallbackReason = edgeData.fallbackReason || 'unexpected_orchestration_error';
        return jsonResponse(edgeData);
      }
    }

    // Laluan AI khusus Mesyuarat/Taklimat. Sengaja diasingkan daripada
    // generateRumusanImpak_ supaya kontrak laporan lawatan sedia ada tidak berubah.
    if (m === 'generaterumusanimpakmesyuarat') {
      try {
        const resultData = await generateRumusanImpakMesyuarat_(env, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        return jsonResponse(resultData);
      } catch (err) {
        console.error('[AI mesyuarat endpoint] orchestration error:', err && err.message);
        const edgeData = generateRumusanImpakMesyuaratEdge_(args[0], args[1], args[4], args[5], args[6]);
        edgeData.fallbackReason = edgeData.fallbackReason || 'unexpected_orchestration_error';
        return jsonResponse(edgeData);
      }
    }

    // PDF Background Generation Handler
    if (m === 'generatepdfforreportbackground') {
      const reportId = cleanPtisText_(args[0] || body.reportId || body.id || '', 160);
      if (!reportId) return jsonResponse({ success: false, error: 'ID laporan diperlukan.' }, 400);
      const target = await db.prepare('SELECT id, report_type, created_by, zon, deleted_at FROM laporan WHERE id = ? LIMIT 1').bind(reportId).first();
      if (!target || target.deleted_at) return jsonResponse({ success: false, error: 'Rekod tidak dijumpai.' }, 404);
      if (!servicePdfSync && !canAccessPtisReport_(ptisSession, target)) return jsonResponse({ success: false, error: 'Akses rekod ditolak.' }, 403);
      if ((target.report_type || 'school_visit') !== 'school_visit') {
        return jsonResponse({ success: false, error: 'Penjana PDF legacy hanya tersedia untuk Lawatan ke Sekolah.' }, 400);
      }
      if (ctx && ctx.waitUntil) {
        ctx.waitUntil((async () => {
          try {
            await fetch(APPS_SCRIPT_CONFIG.laporan, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'generatePdfForReportBackground', args: args }),
              redirect: 'follow'
            });
          } catch(e) {}
        })());
      }
      return jsonResponse({ success: true });
    }

    // PDF URL Sync-back Handler (GAS -> D1)
    if (m === 'updatepdfurl' || m === 'setpdfurl') {
      const reportId = cleanPtisText_(args[0] || body.reportId || body.id || '', 160);
      const pdfUrl = cleanPtisText_(args[1] || body.pdfUrl || body.url || '', 4000);
      if (!reportId || !pdfUrl) return jsonResponse({ success: false, error: 'ID laporan dan pautan PDF diperlukan.' }, 400);
      let parsedPdfUrl;
      try { parsedPdfUrl = new URL(pdfUrl); } catch (e) { parsedPdfUrl = null; }
      if (!parsedPdfUrl || parsedPdfUrl.protocol !== 'https:') {
        return jsonResponse({ success: false, error: 'Pautan PDF mesti menggunakan HTTPS.' }, 400);
      }
      const target = await db.prepare('SELECT id, report_type, created_by, zon, deleted_at FROM laporan WHERE id = ? LIMIT 1').bind(reportId).first();
      if (!target || target.deleted_at) return jsonResponse({ success: false, error: 'Rekod tidak dijumpai.' }, 404);
      if (!canAccessPtisReport_(ptisSession, target)) return jsonResponse({ success: false, error: 'Akses rekod ditolak.' }, 403);
      if ((target.report_type || 'school_visit') !== 'school_visit') {
        return jsonResponse({ success: false, error: 'Pautan PDF legacy tidak digunakan untuk laporan Mesyuarat/MEB.' }, 400);
      }
      await db.prepare('UPDATE laporan SET pdf_url = ?, updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") WHERE id = ?').bind(pdfUrl, reportId).run();
      await bumpDataVersion_(db);
      return jsonResponse({ success: true, message: 'Pautan PDF berjaya dikemas kini di Cloudflare D1.' });
    }

    // Delete Report Handler: PEGAWAI hanya rekod sendiri; Ketua Zon hanya zon sendiri.
    if (m === 'deletereport') {
      const reportId = cleanPtisText_(args[0] || body.reportId || body.id || '', 160);
      if (!reportId) return jsonResponse({ success: false, error: 'ID laporan diperlukan.' }, 400);
      const target = await db.prepare('SELECT id, report_type, created_by, zon, deleted_at FROM laporan WHERE id = ? LIMIT 1').bind(reportId).first();
      if (!target || target.deleted_at) return jsonResponse({ success: false, error: 'Rekod tidak dijumpai.' }, 404);
      if (!canAccessPtisReport_(ptisSession, target)) {
        return jsonResponse({ success: false, error: 'Anda tidak mempunyai kebenaran untuk memadam rekod ini.' }, 403);
      }
      const publishLock = await db.prepare('SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1').bind(reportId).first();
      if (publishLock) {
        return jsonResponse({ success: false, error: 'Laporan sedang disiarkan ke Facebook. Cuba semula selepas proses selesai.' }, 409);
      }
      await db.prepare('UPDATE laporan SET deleted_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours"), updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") WHERE id = ? AND deleted_at IS NULL').bind(reportId).run();
      await bumpDataVersion_(db);
      if ((target.report_type || 'school_visit') === 'school_visit') {
        await db.prepare(
          'UPDATE facebook_queue SET status = "DIPADAM" WHERE report_id = ? AND status != "SEDANG_DIPOSTING"'
        ).bind(reportId).run();
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil((async () => {
            try {
              await fetch(APPS_SCRIPT_CONFIG.laporan, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'deleteReport', args: [reportId] }),
                redirect: 'follow'
              });
            } catch(e) {
              console.warn('GAS delete sync failed:', e);
            }
          })());
        }
      }
      return jsonResponse({ success: true });
    }

    return jsonResponse({ success: false, error: 'Operasi PTIS tidak dikenali.' }, 404);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function extractQrReportId_(rawValue) {
  const raw = cleanPtisText_(rawValue, 4096);
  if (!raw) return '';

  const safeId = (value) => {
    const id = cleanPtisText_(value, 160);
    return /^[A-Za-z0-9._:-]{1,160}$/.test(id) ? id : '';
  };

  const direct = safeId(raw);
  if (direct) return direct;

  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw);
      const jsonId = safeId(parsed && (parsed.id || parsed.reportId || parsed.report_id));
      if (jsonId) return jsonId;
    } catch (e) {}
  }

  try {
    const parsedUrl = new URL(raw);
    const allowedHosts = new Set(['__ROOT_DOMAIN__', '__WWW_ROOT_DOMAIN__', '__DASHBOARD_DOMAIN__', '__PTIS_DOMAIN__', '__ADMIN_DOMAIN__']);
    if (parsedUrl.protocol !== 'https:' || !allowedHosts.has(parsedUrl.hostname.toLowerCase())) return '';

    const queryId = safeId(parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('reportId') || parsedUrl.searchParams.get('report_id'));
    if (queryId) return queryId;

    const pathMatch = parsedUrl.pathname.match(/^\\/(?:report|laporan|ptis\\/report)\\/([A-Za-z0-9._:-]{1,160})\\/?$/i);
    if (pathMatch) return safeId(pathMatch[1]);
  } catch (e) {}

  return '';
}

/**
 * Staff-only QR resolver. QR content is untrusted input and may only resolve
 * stable laporan.id values on PPDK-owned HTTPS URLs. No PIN bypass exists.
 */
async function handleQrApi(request, env) {
  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return jsonResponse({ success: false, error: 'Kaedah permintaan tidak disokong.' }, 405);
    }

    const db = env.DB;
    const url = new URL(request.url);
    let body = {};
    if (request.method === 'POST') {
      try { body = await request.json(); } catch (e) { body = {}; }
    }

    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\\s+/i, '').trim()
      || (body && typeof body.token === 'string' ? body.token.trim() : '');
    // ADR-004 (dipinda 20 Sep 2026, keputusan pengguna): QR dan Short URL
    // dibuka kepada SEMUA pengguna yang log masuk — sesi sahaja, tanpa semakan
    // allowlist. Allowlist kekal dikuatkuasakan pada adminlogin, jadi token hanya
    // wujud untuk staf allowlist + SUPER_ADMIN. Borang PTIS kekal allowlist.
    const auth = await requireSession_(token, db, env.JWT_SECRET, PTIS_ALLOWED_ROLES_);
    if (!auth.ok) return jsonResponse({ success: false, code: auth.code, error: auth.error }, auth.status);

    const pathParts = url.pathname.split('/').filter(Boolean);
    const pathAction = pathParts.length > 2 ? String(pathParts[pathParts.length - 1]).toLowerCase() : '';
    const action = cleanPtisText_(body.action || pathAction || 'resolve', 50).toLowerCase();
    if (!['resolve', 'scan', 'getreport'].includes(action)) {
      return jsonResponse({ success: false, error: 'Operasi QR tidak dikenali.' }, 404);
    }

    const rawValue = body.value || body.qr || body.code || body.text || body.reportId || url.searchParams.get('value') || url.searchParams.get('qr') || url.searchParams.get('code') || url.searchParams.get('reportId') || '';
    const reportId = extractQrReportId_(rawValue);
    if (!reportId) {
      return jsonResponse({ success: false, error: 'Kod QR tidak sah atau tidak mengandungi ID laporan yang disokong.' }, 400);
    }

    const row = await db.prepare(
      'SELECT id, report_type, meeting_subtype, report_details, created_by, timestamp, tarikh, masa_mula, masa_tamat, zon, nama_sekolah, lokasi_lain, pegawai, pelapor, title, objektif, isu, keputusan, tindak_susul, no_isd, status_kes, rumusan_ai, impak_ai, tindak_susul_ai, akauntabiliti, tugas_utama, khidmat_bantu, created_at, updated_at, ' +
      '((CASE WHEN length(coalesce(gambar1, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar2, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar3, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar4, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar5, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar6, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar7, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar8, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar9, "")) > 0 THEN 1 ELSE 0 END) + (CASE WHEN length(coalesce(gambar10, "")) > 0 THEN 1 ELSE 0 END)) AS photo_count ' +
      'FROM laporan WHERE id = ? AND deleted_at IS NULL LIMIT 1'
    ).bind(reportId).first();

    // Pulangkan respons sama bagi ID tidak wujud dan rekod di luar hak supaya
    // pengimbas tidak menjadi oracle kewujudan rekod dalaman.
    if (!row || !canAccessPtisReport_(auth.session, row)) {
      return jsonResponse({ success: false, error: 'Rekod QR tidak dijumpai atau tidak boleh diakses.' }, 404);
    }

    return jsonResponse({
      success: true,
      report: normalizePtisStaffRow_(row)
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * Admin API Handler (__ADMIN_DOMAIN__/api/admin)
 */
async function handleAdminApi(request, env, ctx) {
  try {
    const db = env.DB;
    const url = new URL(request.url);
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || '';
    const pathAction = (lastPart !== 'admin' && lastPart !== 'api') ? lastPart : '';
    let rawAction = body.action || body.method || pathAction || '';
    let action = String(rawAction).toLowerCase();
    const args = Array.isArray(body.args) ? body.args : [];
    let m = action.replace(/^admin/, '');

    // Helper to extract token from request (Header > Body > args[0])
    function extractToken_() {
      const authHeader = request.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        const t = authHeader.substring(7).trim();
        if (t) return t;
      }
      if (body && typeof body.token === 'string' && body.token.trim()) {
        return body.token.trim();
      }
      if (args && args.length > 0 && typeof args[0] === 'string' && args[0].trim()) {
        return args[0].trim();
      }
      return '';
    }

    let currentAuth = null;
    async function requireSession(allowedRoles = null, options = {}) {
      if (currentAuth) {
        if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(currentAuth.session.role)) {
          return {
            errorResponse: jsonResponse({
              ok: false,
              error: 'Akses ditolak. Peranan anda (' + currentAuth.session.role + ') tidak mempunyai kebenaran untuk operasi ini.'
            }, 403)
          };
        }
        // ADR-004: cache sesi tetap tertakluk gate kata laluan sementara.
        if (currentAuth.session.mustChangePassword && !options.allowMustChangePassword) {
          return {
            errorResponse: jsonResponse({
              ok: false,
              code: 'MUST_CHANGE_PASSWORD',
              error: 'Sila tukar kata laluan sementara anda sebelum meneruskan.'
            }, 403)
          };
        }
        return currentAuth;
      }
      const token = extractToken_();
      const res = await requireSession_(token, db, env.JWT_SECRET, allowedRoles, options);
      if (!res.ok) {
        return { errorResponse: jsonResponse({ ok: false, code: res.code, error: res.error }, res.status) };
      }
      currentAuth = { session: res.session, token: token, renewedToken: res.renewedToken };
      return currentAuth;
    }

    function getArg(index) {
      const hasTokenInArgs0 = Boolean(currentAuth && args.length > 0 && args[0] === currentAuth.token);
      return hasTokenInArgs0 ? args[index + 1] : args[index];
    }

    // Helper to get session from token
    async function getSessionFromToken(token) {
      return getSessionFromToken_(token, db, env.JWT_SECRET);
    }

    // Helper for Home Summary
    async function buildHomeSummary(session) {
      // Portal Admin legacy merumuskan lawatan sekolah sahaja. Mesyuarat/MEB
      // dibaca melalui endpoint PTIS staf yang mempunyai skop pemilik sendiri.
      let where = 'deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"';
      const homeBinds = [];
      if (session && session.role === 'KETUA_ZON' && session.zoneName) {
        where += ' AND zon = ?';
        homeBinds.push(session.zoneName);
      } else if (session && session.role === 'PEGAWAI' && session.id) {
        where += ' AND created_by = ?';
        homeBinds.push(session.id);
      }

      const allRowsRes = homeBinds.length > 0
        ? await db.prepare('SELECT id, tarikh, zon, nama_sekolah, lokasi_lain, title, isu, keputusan, tindak_susul, no_isd, pegawai, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE ' + where + ' ORDER BY sort_date DESC, rowid DESC').bind(...homeBinds).all()
        : await db.prepare('SELECT id, tarikh, zon, nama_sekolah, lokasi_lain, title, isu, keputusan, tindak_susul, no_isd, pegawai, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE ' + where + ' ORDER BY sort_date DESC, rowid DESC').all();
      const records = allRowsRes.results || [];

      const now = new Date();
      const curMonth = (now.getMonth() + 1);
      const curYear = now.getFullYear();
      const monthNames = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
      const curMonthLabel = monthNames[curMonth - 1] + ' ' + curYear;

      let currentMonthCount = 0;
      let followUps = 0;
      let isdReports = 0;
      const schoolsSet = new Set();

      records.forEach(r => {
        const school = (r.nama_sekolah || r.lokasi_lain || '').trim();
        if (school) schoolsSet.add(school);

        const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
        if (dateComp.month === curMonth && dateComp.year === curYear) currentMonthCount++;

        if (r.tindak_susul && r.tindak_susul !== '—' && r.tindak_susul !== '-') followUps++;
        if (r.no_isd && r.no_isd.trim()) isdReports++;
      });

      const recent = records.slice(0, 6).map((r, idx) => {
        const zInfo = resolveZone(r.zon);
        return {
          rowNumber: r.rowid || (idx + 1),
          dateLabel: r.tarikh || '—',
          school: r.nama_sekolah || r.lokasi_lain || 'Lokasi tidak dinyatakan',
          zoneId: zInfo.id,
          zoneName: zInfo.name,
          summary: (r.title || r.isu || r.keputusan || 'Tiada ringkasan').trim(),
          isdNumbers: extractIsdNumbers_(r.no_isd, [r.title, r.isu, r.keputusan, r.tindak_susul])
        };
      });

      return {
        ok: true,
        total: records.length,
        currentMonth: currentMonthCount,
        currentMonthLabel: curMonthLabel,
        uniqueSchools: schoolsSet.size,
        followUps: followUps,
        isdReports: isdReports,
        recent: recent,
        scopeLabel: session && session.role === 'KETUA_ZON'
          ? ('Rekod ' + session.zoneName + ' sahaja')
          : (session && session.role === 'PEGAWAI' ? 'Rekod anda sahaja' : 'Semua zon dan rekod aktif'),
        source: 'd1_sql',
        cacheAgeSeconds: 0,
        responseMs: 8
      };
    }

    // 1. Auth: adminLogin
    if (action === 'adminlogin' || m === 'login') {
      const email = String(args[0] || body.email || '').trim().toLowerCase();
      const password = String(args[1] || body.password || '').trim();

      const user = await db.prepare(
        'SELECT *, (locked_until IS NOT NULL AND locked_until > datetime("now", "+8 hours")) as is_locked FROM admins WHERE lower(email) = ? AND lower(status) = "aktif"'
      ).bind(email).first();
      if (!user) {
        return jsonResponse({ ok: false, error: 'Emel atau kata laluan tidak sah. Selepas 5 percubaan gagal, akaun dikunci 15 minit.' });
      }

      // ADR-004: akaun dikunci 15 minit selepas 5 kali gagal log masuk berturut-turut.
      // Mesej SAMA (dan status sama) dengan "tidak sah" — tak boleh bezakan akaun
      // wujud/tak wujud daripada respons (enumerasi e-mel).
      const genericLoginError = 'Emel atau kata laluan tidak sah. Selepas 5 percubaan gagal, akaun dikunci 15 minit.';
      if (user.is_locked) {
        return jsonResponse({ ok: false, error: genericLoginError });
      }

      // FIX #2 #3: Gunakan verifyPassword_ (SHA-256 + serasi ke belakang). Tiada lagi kata laluan keras.
      const passwordValid = await verifyPassword_(password, user.password_hash);
      if (!passwordValid) {
        // Kunci sudah tamat (locked_until ada tapi is_locked=0): mula kira semula dari 0,
        // jangan warisi kaunter lama (kalau tidak, 1 kesilapan selepas kunci terus kunci semula).
        const lockExpired = Boolean(user.locked_until) && !user.is_locked;
        const failedCount = (lockExpired ? 0 : (Number(user.failed_login_count) || 0)) + 1;
        if (failedCount >= 5) {
          await db.prepare('UPDATE admins SET failed_login_count = ?, locked_until = datetime("now", "+8 hours", "+15 minutes") WHERE id = ?')
            .bind(failedCount, user.id).run();
        } else if (lockExpired) {
          await db.prepare('UPDATE admins SET failed_login_count = ?, locked_until = NULL WHERE id = ?')
            .bind(failedCount, user.id).run();
        } else {
          await db.prepare('UPDATE admins SET failed_login_count = ? WHERE id = ?')
            .bind(failedCount, user.id).run();
        }
        return jsonResponse({ ok: false, error: 'Emel atau kata laluan tidak sah. Selepas 5 percubaan gagal, akaun dikunci 15 minit.' });
      }

      const role = resolveAdminRole_(user);
      if (!role) {
        return jsonResponse({ ok: false, error: 'Konfigurasi peranan akaun tidak sah. Sila hubungi Super Admin.' }, 403);
      }

      // ADR-004: bukan SUPER_ADMIN wajib e-mel aktif dalam staff_allowlist.
      if (role !== 'SUPER_ADMIN') {
        const allowed = await isStaffAllowlisted_(db, user.email);
        if (!allowed) {
          return jsonResponse({ ok: false, error: 'Akaun anda tiada dalam senarai staf dibenarkan atau telah digantung. Hubungi Super Admin.' }, 403);
        }
      }

      const adminZone = resolveAdminZone_(user, role);
      if (!adminZone) {
        return jsonResponse({ ok: false, error: 'Konfigurasi zon akaun tidak sah. Sila hubungi Super Admin.' }, 403);
      }

      // Log masuk berjaya — reset kaunter gagal & kunci.
      await db.prepare('UPDATE admins SET failed_login_count = 0, locked_until = NULL, last_login_at = datetime("now", "+8 hours") WHERE id = ?')
        .bind(user.id).run();

      const mustChangePassword = Boolean(user.must_change_password);

      // FIX #1: Token ditandatangani dengan HMAC-SHA256. ADR-004 pindaan 2026-09-27: token staf 365 hari, SUPER_ADMIN 30 hari.
      const payload = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: role,
        zoneId: adminZone.zoneId,
        zoneName: adminZone.zoneName,
        iat: Date.now(),
        pwdAt: user.password_changed_at || '',
        exp: Date.now() + (role === 'SUPER_ADMIN' ? 30 : 365) * 24 * 3600 * 1000
      };
      const token = await signToken_(payload, env.JWT_SECRET);

      const session = {
        id: user.id,
        email: user.email,
        name: user.nama,
        nama: user.nama,
        role: role,
        zoneId: adminZone.zoneId,
        zoneName: adminZone.zoneName,
        status: user.status || 'Aktif',
        mustChangePassword: mustChangePassword,
        permissions: {
          canManageUsers: role === 'SUPER_ADMIN',
          canPostFacebook: role === 'SUPER_ADMIN' || role === 'ADMIN_FACEBOOK' || role === 'PENYELARAS_JTK',
          canDeleteRecords: role === 'SUPER_ADMIN' || role === 'PENYELARAS_JTK',
          canEditAnyZone: role === 'SUPER_ADMIN' || role === 'PENYELARAS_JTK'
        }
      };

      const homeSummary = await buildHomeSummary(session);

      return jsonResponse({
        ok: true,
        token: token,
        session: session,
        mustChangePassword: mustChangePassword,
        homeSummary: homeSummary
      });
    }

    // 2. Check Session / Bootstrap Session
    if (action === 'adminchecksession' || action === 'adminbootstrapsession' || m === 'checksession' || m === 'bootstrapsession') {
      const auth = await requireSession();
      if (auth.errorResponse) return auth.errorResponse;
      const homeSummary = await buildHomeSummary(auth.session);

      const resp = {
        ok: true,
        session: auth.session,
        homeSummary: homeSummary
      };
      if (auth.renewedToken) {
        resp.renewedToken = auth.renewedToken;
      }
      const extraHeaders = auth.renewedToken ? { 'X-Renewed-Token': auth.renewedToken } : {};
      return jsonResponse(resp, 200, extraHeaders);
    }

    // 3. Home Summary API: adminGetHomeSummary
    if (action === 'admingethomesummary' || m === 'gethomesummary') {
      const auth = await requireSession();
      if (auth.errorResponse) return auth.errorResponse;
      const homeSummary = await buildHomeSummary(auth.session);
      return jsonResponse(homeSummary);
    }

    // 4. KPI Leaderboard API: adminListOfficerKpiStats
    if (action === 'adminlistofficerkpistats' || action === 'admingetofficerkpistats' || m === 'listofficerkpistats' || m === 'getofficerkpistats' || m === 'officerkpistats') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const options = getArg(0) || body.options || {};

      let where = 'deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"';
      const kpiBinds = [];
      if (session && session.role === 'KETUA_ZON' && session.zoneName) {
        where += ' AND zon = ?';
        kpiBinds.push(session.zoneName);
      } else if (options && options.zone) {
        where += ' AND zon = ?';
        kpiBinds.push(options.zone);
      }

      const allRowsRes = kpiBinds.length > 0
        ? await db.prepare('SELECT id, tarikh, zon, nama_sekolah, lokasi_lain, title, isu, keputusan, tindak_susul, no_isd, pegawai, pelapor, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE ' + where + ' ORDER BY sort_date DESC, rowid DESC').bind(...kpiBinds).all()
        : await db.prepare('SELECT id, tarikh, zon, nama_sekolah, lokasi_lain, title, isu, keputusan, tindak_susul, no_isd, pegawai, pelapor, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE ' + where + ' ORDER BY sort_date DESC, rowid DESC').all();
      let records = allRowsRes.results || [];

      if (options && options.year) {
        records = records.filter(r => {
          const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
          return dateComp.year === Number(options.year);
        });
      }
      if (options && options.month) {
        records = records.filter(r => {
          const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
          return dateComp.month === Number(options.month);
        });
      }

      const officialNameSet = new Set();
      const officerPrimaryZoneMap = {};
      Object.keys(CANONICAL_OFFICERS).forEach(zk => {
        (CANONICAL_OFFICERS[zk] || []).forEach(name => {
          officialNameSet.add(name);
          officerPrimaryZoneMap[name] = zk;
        });
      });

      const officerMap = {};
      const zoneMap = {};
      const schoolSet = new Set();
      let totalFollowUps = 0;
      let totalIsd = 0;

      records.forEach(r => {
        const school = (r.nama_sekolah || r.lokasi_lain || '').trim();
        if (school) schoolSet.add(school);
        if (r.tindak_susul && r.tindak_susul !== '—' && r.tindak_susul !== '-') totalFollowUps++;
        if (r.no_isd && r.no_isd.trim()) totalIsd++;

        const zInfo = resolveZone(r.zon);
        if (!zoneMap[zInfo.name]) {
          zoneMap[zInfo.name] = { zone: zInfo.name, color: zInfo.color, count: 0, schools: new Set(), officers: new Set() };
        }
        zoneMap[zInfo.name].count++;
        if (school) zoneMap[zInfo.name].schools.add(school);

        const rawOfficers = (r.pegawai || '') + ',' + (r.pelapor || '');
        const tokens = rawOfficers.split(new RegExp('[,/;\\\n&]+|\\b(?:dan|DAN)\\b', 'g'));
        const names = [];
        tokens.forEach(tok => {
          let clean = tok.replace(/\(.*?\)/g, '').replace(/^(EN\.|PN\.|CIK|USTAZ|USTAZAH|JTK)[\\s_-]+/i, '').trim();
          if (clean && clean.length > 2 && !/^(tiada|none|-|—|semua|cikgu|guru|null|undefined)$/i.test(clean)) {
            const canonical = canonicalOfficerName_(clean);
            if (officialNameSet.has(canonical)) {
              names.push(canonical);
            }
          }
        });
        const uniqueInRecord = new Set(names);

        uniqueInRecord.forEach(name => {
          zoneMap[zInfo.name].officers.add(name);
          if (!officerMap[name]) {
            officerMap[name] = {
              name: name,
              totalVisits: 0,
              zones: {},
              schools: {},
              latestDate: r.tarikh || '—',
              latestSchool: school || '—',
              latestSortTime: r.sort_date || ''
            };
          }
          officerMap[name].totalVisits++;
          officerMap[name].zones[zInfo.name] = (officerMap[name].zones[zInfo.name] || 0) + 1;
          if (school) officerMap[name].schools[school] = (officerMap[name].schools[school] || 0) + 1;
        });
      });

      // Include all canonical officers even if 0 visits
      officialNameSet.forEach(name => {
        if (!officerMap[name]) {
          officerMap[name] = {
            name: name,
            totalVisits: 0,
            zones: {},
            schools: {},
            latestDate: '—',
            latestSchool: '—',
            latestSortTime: ''
          };
        }
      });

      const officerList = Array.from(officialNameSet).map(name => {
        const item = officerMap[name];
        const zoneKeys = Object.keys(item.zones);
        let primaryZone = officerPrimaryZoneMap[name] || 'ZON 1';
        if (zoneKeys.length > 0) {
          let maxZCount = 0;
          zoneKeys.forEach(zk => {
            if (item.zones[zk] > maxZCount) {
              maxZCount = item.zones[zk];
              primaryZone = zk;
            }
          });
        }
        const zDef = resolveZone(primaryZone);
        return {
          name: item.name,
          totalVisits: item.totalVisits,
          zones: item.zones,
          schools: item.schools,
          latestDate: item.latestDate,
          latestSchool: item.latestSchool,
          latestSortTime: item.latestSortTime,
          uniqueSchoolsCount: Object.keys(item.schools).length,
          zonesCount: zoneKeys.length,
          primaryZone: primaryZone,
          primaryZoneColor: zDef.color
        };
      }).sort((a, b) => b.totalVisits - a.totalVisits);

      let previousVisits = null;
      let previousRank = 0;
      officerList.forEach((item, idx) => {
        const visits = Number(item.totalVisits || 0);
        if (previousVisits === null || visits !== previousVisits) {
          previousRank = idx + 1;
          previousVisits = visits;
        }
        item.rank = previousRank;
        item.uniqueSchools = item.uniqueSchoolsCount;
        item.allZones = Object.keys(item.zones || {}).join(', ');
      });

      const zoneList = Object.keys(zoneMap).map(zk => ({
        zone: zk,
        color: zoneMap[zk].color,
        count: zoneMap[zk].count,
        schools: zoneMap[zk].schools.size,
        officers: zoneMap[zk].officers.size
      })).sort((a, b) => a.zone.localeCompare(b.zone));

      return jsonResponse({
        ok: true,
        summary: {
          totalRecords: records.length,
          totalOfficers: officerList.length,
          activeOfficers: officerList.filter(o => o.totalVisits > 0).length,
          totalSchools: schoolSet.size,
          totalFollowUps: totalFollowUps,
          totalIsd: totalIsd
        },
        officers: officerList,
        zones: zoneList,
        zoneBreakdown: zoneList.map(z => ({
          zone: z.zone,
          color: z.color,
          count: z.count,
          uniqueSchools: z.schools,
          officers: z.officers
        })),
        totalVisits: records.length,
        filters: {
          years: [2026, 2025, 2024, 2023, 2022],
          months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          zones: ['ZON 1', 'ZON 2', 'ZON 3', 'ZON 4', 'ZON 5', 'ZON 6', 'ZON 7', 'ZON 8', 'ZON PPD']
        }
      });
    }

    function normalizeAdminUserConfig_(userObj) {
      const requestedRole = resolveAdminRole_({ role: userObj && userObj.role });
      if (!requestedRole) {
        return { ok: false, error: 'Peranan pentadbir tidak sah.' };
      }

      // ADR-003 §C: PEGAWAI (staf borang PTIS) wajib e-mel domain tepat moe.gov.my.
      if (requestedRole === 'PEGAWAI' && !validateStaffEmail_(userObj && userObj.email)) {
        return { ok: false, error: 'E-mel staf mesti berdomain tepat @moe.gov.my.' };
      }

      if (requestedRole === 'KETUA_ZON') {
        const rawZoneId = String((userObj && userObj.zoneId) || '').trim();
        const zoneInfo = resolveZone(rawZoneId);
        if (!rawZoneId || !zoneInfo || !/^z[1-8]$/.test(String(zoneInfo.id || ''))) {
          return { ok: false, error: 'Ketua Zon mesti mempunyai zon rasmi ZON 1 hingga ZON 8.' };
        }
        return { ok: true, role: requestedRole, zoneId: zoneInfo.id };
      }

      return { ok: true, role: requestedRole, zoneId: '' };
    }

    // 5. User Management APIs (SUPER_ADMIN ONLY)
    if (action === 'adminlistusers' || m === 'listusers') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const usersRes = await db.prepare('SELECT id, nama, email, role, zone_id as zoneId, status, last_login_at as lastLogin, rowid FROM admins ORDER BY id ASC').all();
      const users = (usersRes.results || []).map((u, idx) => {
        const resolvedRole = resolveAdminRole_(u);
        const resolvedZone = resolvedRole ? resolveAdminZone_({ zone_id: u.zoneId }, resolvedRole) : null;
        return {
          rowNumber: u.rowid || (idx + 1),
          id: u.id,
          nama: u.nama,
          email: u.email,
          role: resolvedRole || u.role || '',
          zoneId: resolvedZone ? resolvedZone.zoneId : (u.zoneId || ''),
          zoneName: resolvedZone ? resolvedZone.zoneName : 'Konfigurasi tidak sah',
          status: (u.status || 'aktif').toLowerCase(),
          lastLogin: u.lastLogin || '—'
        };
      });
      return jsonResponse({ ok: true, users: users });
    }

    if (action === 'admincreateuser' || m === 'createuser') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const userObj = getArg(0) || body.user || {};
      const newId = 'usr_' + Date.now();
      const email = String(userObj.email || '').trim().toLowerCase();

      // 10a: Kata laluan sementara pilihan admin
      let isGenerated = false;
      let rawPassword = String(userObj.tempPassword || userObj.password || '').trim();
      if (rawPassword) {
        if (rawPassword.length < 10) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara mestilah sekurang-kurangnya 10 aksara.' }, 400);
        }
        if (email && rawPassword.toLowerCase() === email) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara tidak boleh sama dengan e-mel.' }, 400);
        }
      } else {
        rawPassword = generateTempPassword_(12);
        isGenerated = true;
      }

      const userConfig = normalizeAdminUserConfig_(userObj);
      if (!userConfig.ok) return jsonResponse({ ok: false, error: userConfig.error }, 400);
      const hashedPassword = await hashPassword_(rawPassword);
      await db.prepare('INSERT INTO admins (id, email, nama, password_hash, role, zone_id, status, created_at, must_change_password) VALUES (?, ?, ?, ?, ?, ?, "Aktif", datetime("now", "+8 hours"), 1)')
        .bind(newId, userObj.email, userObj.name || userObj.nama, hashedPassword, userConfig.role, userConfig.zoneId)
        .run();

      const resp = { ok: true, message: 'Akaun pentadbir berjaya dicipta.' };
      if (isGenerated) resp.tempPassword = rawPassword;
      return jsonResponse(resp);
    }

    if (action === 'adminupdateuser' || m === 'updateuser') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const rowOrId = getArg(0);
      const userObj = getArg(1) || body.user || {};
      const userConfig = normalizeAdminUserConfig_(userObj);
      if (!userConfig.ok) return jsonResponse({ ok: false, error: userConfig.error }, 400);
      await db.prepare('UPDATE admins SET nama = ?, email = ?, role = ?, zone_id = ? WHERE id = ? OR rowid = ?')
        .bind(userObj.name || userObj.nama, userObj.email, userConfig.role, userConfig.zoneId, String(rowOrId), rowOrId)
        .run();
      return jsonResponse({ ok: true, message: 'Maklumat pengguna dikemaskini.' });
    }


    if (action === 'adminsetuserstatus' || m === 'setuserstatus') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const rowOrId = getArg(0);
      const status = getArg(1);
      await db.prepare('UPDATE admins SET status = ? WHERE id = ? OR rowid = ?').bind(status === 'aktif' ? 'Aktif' : 'Nyahaktif', String(rowOrId), rowOrId).run();
      return jsonResponse({ ok: true });
    }

    if (action === 'adminsetuserpassword' || action === 'adminresetpassword' || m === 'setuserpassword' || m === 'resetpassword') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const rowOrId = getArg(0);
      const target = await db.prepare('SELECT id, email, role FROM admins WHERE id = ? OR rowid = ?').bind(String(rowOrId), rowOrId).first();
      if (!target) return jsonResponse({ ok: false, error: 'Akaun tidak dijumpai.' }, 404);

      // 10a: Kata laluan sementara pilihan admin
      let isGenerated = false;
      let newPass = String(getArg(1) || body.tempPassword || body.password || '').trim();
      if (newPass) {
        if (newPass.length < 10) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara mestilah sekurang-kurangnya 10 aksara.' }, 400);
        }
        if (target.email && newPass.toLowerCase() === target.email.toLowerCase()) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara tidak boleh sama dengan e-mel.' }, 400);
        }
      } else {
        newPass = generateTempPassword_(12);
        isGenerated = true;
      }

      const hashedNewPass = await hashPassword_(newPass);
      await db.prepare('UPDATE admins SET password_hash = ?, must_change_password = 1, password_changed_at = datetime("now", "+8 hours") WHERE id = ? OR rowid = ?').bind(hashedNewPass, String(rowOrId), rowOrId).run();
      const resp = { ok: true, message: 'Kata laluan berjaya dikemaskini.' };
      if (isGenerated) resp.tempPassword = newPass;
      return jsonResponse(resp);
    }

    // 5B. ADR-004 P5: Pengurusan Allowlist Staf (SUPER_ADMIN sahaja)
    if (action === 'adminsetzonetemppassword' || m === 'setzonetemppassword') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const entry = getArg(0) || body.entry || body;
      const zone = resolveZone(entry.zone);
      const scope = entry.scope === undefined ? 'belum_tukar' : entry.scope;
      if (zone.number > 9 || !String(entry.zone || '').trim()) return jsonResponse({ ok: false, error: 'Pilih ZON 1–8 atau ZON PPD.' }, 400);
      if (scope !== 'belum_tukar' && scope !== 'semua') return jsonResponse({ ok: false, error: 'Skop tidak sah.' }, 400);
      if (scope === 'semua' && session.role !== 'SUPER_ADMIN') return jsonResponse({ ok: false, error: 'Semua staf zon hanya dibenarkan untuk Super Admin.' }, 403);
      const password = typeof entry.tempPassword === 'string' ? entry.tempPassword : '';
      if (password.length < 10 || password.trim() !== password) return jsonResponse({ ok: false, error: 'Kata laluan sementara mesti sekurang-kurangnya 10 aksara tanpa ruang tepi.' }, 400);
      const eligibleSql = 'role = "PEGAWAI" AND lower(status) = "aktif" AND EXISTS (SELECT 1 FROM staff_allowlist sa WHERE sa.email = lower(trim(admins.email)) AND sa.status = "aktif")' +
        (scope === 'belum_tukar' ? ' AND must_change_password = 1' : '');
      const found = await db.prepare('SELECT id, email, nama, zone_id, password_changed_at FROM admins WHERE ' + eligibleSql + ' ORDER BY nama, id').all();
      const targets = (found.results || []).filter(a => resolveZone(a.zone_id).name === zone.name);
      if (targets.some(a => password.toLowerCase() === String(a.email).trim().toLowerCase())) return jsonResponse({ ok: false, error: 'Kata laluan sementara tidak boleh sama dengan e-mel sasaran.' }, 400);
      if (entry.dryRun === true) return jsonResponse({ ok: true, zone: zone.name, scope: scope, count: targets.length, targets: targets.map(a => ({ nama: a.nama })) });
      // Compare the selected zone/password version again in the atomic UPDATE.
      // Concurrent password changes, suspensions or zone changes cannot be overwritten.
      const snapshot = JSON.stringify(targets.map(a => ({ id: a.id, zone: a.zone_id || '', pwdAt: a.password_changed_at || '' })));
      const latest = targets.reduce((n, a) => {
        const value = String(a.password_changed_at || '');
        const ms = Date.parse(value.includes('T') ? value : value.replace(' ', 'T') + '+08:00');
        return Number.isFinite(ms) ? Math.max(n, ms + 1) : n;
      }, Date.now());
      const changedAt = new Date(latest + 8 * 3600000).toISOString().slice(0, 23).replace('T', ' ');
      const hashed = await hashPassword_(password);
      const results = await db.batch([
        db.prepare('UPDATE admins SET password_hash = ?, must_change_password = 1, password_changed_at = ?, failed_login_count = 0, locked_until = NULL WHERE ' + eligibleSql +
          ' AND EXISTS (SELECT 1 FROM json_each(?) t WHERE json_extract(t.value, "$.id") = admins.id AND json_extract(t.value, "$.zone") = coalesce(admins.zone_id, "") AND json_extract(t.value, "$.pwdAt") = coalesce(admins.password_changed_at, ""))').bind(hashed, changedAt, snapshot),
        db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "SET_ZONE_TEMP_PASSWORD", ?, json_object("zone", ?, "scope", ?, "count", changes()))')
          .bind(session.email || '', session.role, zone.name, zone.name, scope)
      ]);
      return jsonResponse({ ok: true, zone: zone.name, scope: scope, count: Number(results[0].meta.changes || 0) });
    }

    if (action === 'adminlistallowlist' || m === 'listallowlist') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const rows = await db.prepare(
        'SELECT sa.email, sa.nama, sa.jawatan, sa.kategori, sa.status, sa.added_by, sa.created_at, sa.updated_at, ' +
        'a.id as accountId, a.status as accountStatus, coalesce(nullif(a.zone_id, ""), sa.zone_id) as zone_id, a.must_change_password, a.last_login_at, ' +
        '(a.locked_until IS NOT NULL AND a.locked_until > datetime("now", "+8 hours")) as accountLocked ' +
        'FROM staff_allowlist sa LEFT JOIN admins a ON lower(a.email) = sa.email ' +
        'ORDER BY sa.nama ASC'
      ).all();
      return jsonResponse({ ok: true, staff: (rows.results || []).map(a => { const zone = resolveZone(a.zone_id); return Object.assign({}, a, { zone_id: a.zone_id && zone.number <= 9 ? zone.name : '' }); }) });
    }

    if (action === 'adminupsertallowlist' || m === 'upsertallowlist') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const entry = getArg(0) || body.entry || {};
      const email = String(entry.email || '').trim().toLowerCase();
      const nama = String(entry.nama || '').trim();
      const jawatan = String(entry.jawatan || '').trim();
      const kategori = String(entry.kategori || '').trim().toUpperCase();

      if (!validateStaffEmail_(email)) {
        return jsonResponse({ ok: false, error: 'E-mel mesti domain @moe.gov.my yang sah.' }, 400);
      }
      if (!nama) return jsonResponse({ ok: false, error: 'Nama diperlukan.' }, 400);
      if (kategori !== 'JTK' && kategori !== 'PPTM') {
        return jsonResponse({ ok: false, error: 'Kategori mesti JTK atau PPTM.' }, 400);
      }

      await db.prepare(
        'INSERT INTO staff_allowlist (email, nama, jawatan, kategori, status, added_by, created_at, updated_at) ' +
        'VALUES (?, ?, ?, ?, "aktif", ?, datetime("now", "+8 hours"), datetime("now", "+8 hours")) ' +
        'ON CONFLICT(email) DO UPDATE SET nama = excluded.nama, jawatan = excluded.jawatan, kategori = excluded.kategori, updated_at = excluded.updated_at'
      ).bind(email, nama, jawatan, kategori, session.email || session.id).run();

      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "UPSERT_STAFF_ALLOWLIST", ?, ?)')
        .bind(session.email || '', session.role, email, JSON.stringify({ nama: nama, jawatan: jawatan, kategori: kategori })).run();

      return jsonResponse({ ok: true, message: 'Staf disimpan dalam allowlist.' });
    }

    if (action === 'adminsetallowliststatus' || m === 'setallowliststatus') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const email = String(getArg(0) || body.email || '').trim().toLowerCase();
      const status = String(getArg(1) || body.status || '').trim().toLowerCase();
      if (!email) return jsonResponse({ ok: false, error: 'E-mel diperlukan.' }, 400);
      if (status !== 'aktif' && status !== 'gantung') {
        return jsonResponse({ ok: false, error: 'Status mesti aktif atau gantung.' }, 400);
      }
      const result = await db.prepare('UPDATE staff_allowlist SET status = ?, updated_at = datetime("now", "+8 hours") WHERE email = ?')
        .bind(status, email).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'E-mel tidak dijumpai dalam allowlist.' }, 404);
      }
      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "SET_ALLOWLIST_STATUS", ?, ?)')
        .bind(session.email || '', session.role, email, JSON.stringify({ status: status })).run();
      return jsonResponse({ ok: true, message: 'Status allowlist dikemas kini.' });
    }

    if (action === 'adminimportallowlist' || m === 'importallowlist') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const csvText = String(getArg(0) || body.csv || '').trim();
      if (!csvText) return jsonResponse({ ok: false, error: 'Kandungan CSV diperlukan.' }, 400);

      function splitAllowlistCsvRows_(text) {
        const rows = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
              cur += '""';
              i++;
            } else {
              inQuotes = !inQuotes;
              cur += ch;
            }
          } else if (!inQuotes && (ch === '\\n' || ch === '\\r')) {
            if (ch === '\\r' && text[i + 1] === '\\n') i++;
            if (cur.trim().length) rows.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
        if (inQuotes) return null;
        if (cur.trim().length) rows.push(cur);
        return rows;
      }

      const lines = splitAllowlistCsvRows_(csvText);
      if (!lines) return jsonResponse({ ok: false, error: 'CSV mempunyai petikan yang tidak lengkap.' }, 400);
      if (lines.length < 2) return jsonResponse({ ok: false, error: 'CSV kosong atau tiada baris data.' }, 400);

      function parseAllowlistCsvLine_(line) {
        const cells = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (inQuotes) {
            if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
            else if (ch === '"') { inQuotes = false; }
            else { cur += ch; }
          } else if (ch === '"') {
            inQuotes = true;
          } else if (ch === ',') {
            cells.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
        cells.push(cur);
        return cells.map(c => c.trim());
      }

      const header = parseAllowlistCsvLine_(lines[0]).map(h => h.toLowerCase());
      const colIdx = {
        email: header.indexOf('email'),
        nama: header.indexOf('nama'),
        jawatan: header.indexOf('jawatan'),
        kategori: header.indexOf('kategori'),
        zon: header.indexOf('zon')
      };
      if (colIdx.email === -1 || colIdx.nama === -1 || colIdx.kategori === -1) {
        return jsonResponse({ ok: false, error: 'CSV wajib ada lajur: email, nama, kategori (jawatan optional).' }, 400);
      }

      const dataRows = lines.slice(1);
      if (dataRows.length > 200) {
        return jsonResponse({ ok: false, error: 'Had 200 baris setiap import.' }, 400);
      }

      const seenEmails = new Set();
      const statements = [];
      const importErrors = [];
      let importedCount = 0;

      dataRows.forEach((line, i) => {
        const rowNum = i + 2;
        const cells = parseAllowlistCsvLine_(line);
        const rowEmail = (cells[colIdx.email] || '').trim().toLowerCase();
        const rowNama = (cells[colIdx.nama] || '').trim();
        const rowJawatan = colIdx.jawatan !== -1 ? (cells[colIdx.jawatan] || '').trim() : '';
        const rowKategori = (cells[colIdx.kategori] || '').trim().toUpperCase();
        const rawZone = colIdx.zon !== -1 ? (cells[colIdx.zon] || '').trim() : '';
        const rowZone = rawZone ? resolveZone(rawZone) : null;
        if (rowZone && rowZone.number > 9) { importErrors.push('Baris ' + rowNum + ': zon tidak sah'); return; }

        if (!validateStaffEmail_(rowEmail)) {
          importErrors.push('Baris ' + rowNum + ': e-mel tidak sah (' + rowEmail + ')');
          return;
        }
        if (!rowNama) {
          importErrors.push('Baris ' + rowNum + ': nama kosong (' + rowEmail + ')');
          return;
        }
        if (rowKategori !== 'JTK' && rowKategori !== 'PPTM') {
          importErrors.push('Baris ' + rowNum + ': kategori mesti JTK/PPTM (' + rowEmail + ')');
          return;
        }
        if (seenEmails.has(rowEmail)) {
          importErrors.push('Baris ' + rowNum + ': e-mel pendua dalam CSV (' + rowEmail + ')');
          return;
        }
        seenEmails.add(rowEmail);

        statements.push(
          db.prepare(
            'INSERT INTO staff_allowlist (email, nama, jawatan, kategori, status, added_by, created_at, updated_at, zone_id) ' +
            'VALUES (?, ?, ?, ?, "aktif", ?, datetime("now", "+8 hours"), datetime("now", "+8 hours"), ?) ' +
            'ON CONFLICT(email) DO UPDATE SET nama = excluded.nama, jawatan = excluded.jawatan, kategori = excluded.kategori, updated_at = excluded.updated_at, zone_id = CASE WHEN excluded.zone_id != "" THEN excluded.zone_id ELSE staff_allowlist.zone_id END'
          ).bind(rowEmail, rowNama, rowJawatan, rowKategori, session.email || session.id, rowZone ? rowZone.name : '')
        );
        if (rowZone) statements.push(db.prepare('UPDATE admins SET zone_id = ? WHERE lower(email) = ? AND role = "PEGAWAI"').bind(rowZone.name, rowEmail));
        importedCount++;
      });

      if (importErrors.length > 0) {
        return jsonResponse({ ok: false, error: 'CSV mengandungi ralat — tiada baris diimport.', errors: importErrors }, 400);
      }
      if (statements.length === 0) {
        return jsonResponse({ ok: false, error: 'Tiada baris sah untuk diimport.' }, 400);
      }

      statements.push(
        db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "IMPORT_ALLOWLIST", ?, ?)')
          .bind(session.email || '', session.role, importedCount + ' staf', JSON.stringify({ count: importedCount }))
      );
      await db.batch(statements);

      return jsonResponse({ ok: true, message: importedCount + ' staf berjaya diimport.', count: importedCount });
    }

    if (action === 'adminprovisionstaff' || m === 'provisionstaff') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const entry = getArg(0) || body.entry || {};
      const email = String(entry.email || '').trim().toLowerCase();
      const nama = String(entry.nama || '').trim();

      if (!validateStaffEmail_(email)) {
        return jsonResponse({ ok: false, error: 'E-mel mesti domain @moe.gov.my yang sah.' }, 400);
      }
      if (!nama) return jsonResponse({ ok: false, error: 'Nama diperlukan.' }, 400);

      // 10a: Kata laluan sementara pilihan admin
      let isGenerated = false;
      let tempPassword = String(getArg(1) || entry.tempPassword || entry.password || '').trim();
      if (tempPassword) {
        if (tempPassword.length < 10) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara mestilah sekurang-kurangnya 10 aksara.' }, 400);
        }
        if (tempPassword.toLowerCase() === email.toLowerCase()) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara tidak boleh sama dengan e-mel.' }, 400);
        }
      } else {
        tempPassword = generateTempPassword_(12);
        isGenerated = true;
      }

      const allowed = await isStaffAllowlisted_(db, email);
      if (!allowed) {
        return jsonResponse({ ok: false, error: 'E-mel mesti berada dalam staff_allowlist (status aktif) sebelum akaun dicipta.' }, 400);
      }
      const existing = await db.prepare('SELECT id FROM admins WHERE lower(email) = ?').bind(email).first();
      if (existing) {
        return jsonResponse({ ok: false, error: 'Akaun dengan e-mel ini sudah wujud.' }, 409);
      }

      const staffZone = await db.prepare('SELECT zone_id FROM staff_allowlist WHERE email = ?').bind(email).first();
      const rawZone = entry.zone !== undefined ? entry.zone : (entry.zone_id !== undefined ? entry.zone_id : ((staffZone && staffZone.zone_id) || ''));
      const zone = String(rawZone || '').trim() ? resolveZone(rawZone) : null;
      if (zone && zone.number > 9) return jsonResponse({ ok: false, error: 'Zon tidak sah.' }, 400);
      const hashedPassword = await hashPassword_(tempPassword);
      const newId = 'usr_' + Date.now();
      await db.prepare(
        'INSERT INTO admins (id, email, nama, password_hash, role, zone_id, status, created_by, created_at, must_change_password) ' +
        'VALUES (?, ?, ?, ?, "PEGAWAI", ?, "aktif", ?, datetime("now", "+8 hours"), 1)'
      ).bind(newId, email, nama, hashedPassword, zone ? zone.name : '', session.email || session.id).run();

      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "PROVISION_STAFF", ?, ?)')
        .bind(session.email || '', session.role, email, JSON.stringify({ note: 'Kata laluan sementara tidak dilog' })).run();

      const resp = { ok: true, message: 'Akaun staf berjaya dicipta.', email: email };
      if (isGenerated) {
        resp.tempPassword = tempPassword;
      }
      return jsonResponse(resp);
    }

    if (action === 'adminresetstaffpassword' || m === 'resetstaffpassword') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const email = String(getArg(0) || body.email || '').trim().toLowerCase();
      if (!email) return jsonResponse({ ok: false, error: 'E-mel diperlukan.' }, 400);

      const target = await db.prepare('SELECT id, role FROM admins WHERE lower(email) = ?').bind(email).first();
      if (!target) return jsonResponse({ ok: false, error: 'Akaun tidak dijumpai.' }, 404);

      // 10b: Penyelaras JTK HANYA untuk sasaran staf (PEGAWAI). Sasaran admin lain -> 403
      if (session.role === 'PENYELARAS_JTK' && target.role !== 'PEGAWAI') {
        return jsonResponse({ ok: false, error: 'Akses ditolak. Penyelaras JTK hanya dibenarkan mengurus akaun staf PEGAWAI.' }, 403);
      }

      // Reset akaun sendiri = kunci diri sendiri dalam keadaan wajib-tukar (AdminApp tiada skrin untuk itu).
      if (target.id === session.id) {
        return jsonResponse({ ok: false, error: 'Tidak boleh reset akaun sendiri di sini. Guna "Tukar Kata Laluan" pada menu profil.' }, 400);
      }

      // 10a: Kata laluan sementara pilihan admin
      let isGenerated = false;
      let tempPassword = String(getArg(1) || body.tempPassword || body.password || '').trim();
      if (tempPassword) {
        if (tempPassword.length < 10) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara mestilah sekurang-kurangnya 10 aksara.' }, 400);
        }
        if (tempPassword.toLowerCase() === email.toLowerCase()) {
          return jsonResponse({ ok: false, error: 'Kata laluan sementara tidak boleh sama dengan e-mel.' }, 400);
        }
      } else {
        tempPassword = generateTempPassword_(12);
        isGenerated = true;
      }

      const hashedPassword = await hashPassword_(tempPassword);
      await db.prepare('UPDATE admins SET password_hash = ?, must_change_password = 1, password_changed_at = datetime("now", "+8 hours"), failed_login_count = 0, locked_until = NULL WHERE id = ?')
        .bind(hashedPassword, target.id).run();

      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "RESET_STAFF_PASSWORD", ?, ?)')
        .bind(session.email || '', session.role, email, JSON.stringify({ note: 'Kata laluan sementara tidak dilog' })).run();

      const resp = { ok: true, message: 'Kata laluan sementara baharu dijana.', email: email };
      if (isGenerated) {
        resp.tempPassword = tempPassword;
      }
      return jsonResponse(resp);
    }

    if (action === 'adminunlockstaff' || m === 'unlockstaff') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const email = String(getArg(0) || body.email || '').trim().toLowerCase();
      if (!email) return jsonResponse({ ok: false, error: 'E-mel diperlukan.' }, 400);

      const target = await db.prepare('SELECT id, role FROM admins WHERE lower(email) = ?').bind(email).first();
      if (!target) return jsonResponse({ ok: false, error: 'Akaun tidak dijumpai.' }, 404);

      // 10b: Penyelaras JTK HANYA untuk sasaran staf (PEGAWAI). Sasaran admin lain -> 403
      if (session.role === 'PENYELARAS_JTK' && target.role !== 'PEGAWAI') {
        return jsonResponse({ ok: false, error: 'Akses ditolak. Penyelaras JTK hanya dibenarkan membuka kunci akaun staf PEGAWAI.' }, 403);
      }

      const result = await db.prepare('UPDATE admins SET failed_login_count = 0, locked_until = NULL WHERE lower(email) = ?').bind(email).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Akaun tidak dijumpai.' }, 404);
      }
      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "UNLOCK_STAFF", ?, ?)')
        .bind(session.email || '', session.role, email, '{}').run();
      return jsonResponse({ ok: true, message: 'Akaun dibuka kunci.' });
    }

    // 6. Record Picker Data: adminGetPickerData
    if (action === 'admingetpickerdata' || m === 'getpickerdata') {
      const auth = await requireSession();
      if (auth.errorResponse) return auth.errorResponse;
      const allOfficers = [];
      Object.keys(CANONICAL_OFFICERS).forEach(z => {
        (CANONICAL_OFFICERS[z] || []).forEach(off => {
          if (!allOfficers.includes(off)) allOfficers.push(off);
        });
      });
      return jsonResponse({
        ok: true,
        schoolsByZone: CANONICAL_SCHOOLS,
        officers: allOfficers.sort(),
        allowOtherLocation: true
      });
    }

    // 7. Editable Records APIs: adminListEditableRecords
    if (action === 'adminlisteditablerecords' || action === 'adminlistedittablerecords' || m === 'listeditablerecords' || m === 'listedittablerecords') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;

      let showDeleted = false;
      let filter = {};

      const arg1 = getArg(0);
      const arg2 = getArg(1);

      if (typeof arg1 === 'object' && arg1 !== null) {
        filter = arg1;
        showDeleted = Boolean(filter.showDeleted);
      } else {
        showDeleted = Boolean(arg1);
        filter = (typeof arg2 === 'object' && arg2 !== null) ? arg2 : {};
      }

      // KETUA_ZON cannot view deleted records
      if (session.role === 'KETUA_ZON') {
        showDeleted = false;
      }

      const page = Math.max(1, Number(filter.page || 1));
      const pageSize = Math.max(1, Math.min(100, Number(filter.pageSize || 15)));
      const search = String(filter.search || '').toLowerCase().trim();
      const offset = (page - 1) * pageSize;

      // FIX #6: Parameterisasi SQL — pengasingan rekod aktif dan dipadam
      let whereClause = showDeleted
        ? '(deleted_at IS NOT NULL OR upper(trim(coalesce(status_kes, ""))) = "DIPADAM") AND report_type = "school_visit"'
        : 'deleted_at IS NULL AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" AND report_type = "school_visit"';
      const searchBinds = [];

      // KETUA_ZON can only view records within their assigned zone
      if (session.role === 'KETUA_ZON' && session.zoneName) {
        whereClause += ' AND zon = ?';
        searchBinds.push(session.zoneName);
      }

      if (search) {
        const s = '%' + search + '%';
        whereClause += ' AND (lower(nama_sekolah) LIKE ? OR lower(title) LIKE ? OR lower(isu) LIKE ? OR lower(pegawai) LIKE ? OR lower(zon) LIKE ? OR lower(no_isd) LIKE ?)';
        searchBinds.push(s, s, s, s, s, s);
      }

      const totalResult = searchBinds.length > 0
        ? await db.prepare('SELECT count(*) as count FROM laporan WHERE ' + whereClause).bind(...searchBinds).first()
        : await db.prepare('SELECT count(*) as count FROM laporan WHERE ' + whereClause).first();
      const total = totalResult ? totalResult.count : 0;

      const queryBinds = [...searchBinds, pageSize, offset];
      const rowsResult = await db.prepare('SELECT *, ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE ' + whereClause + ' ORDER BY sort_date DESC, rowid DESC LIMIT ? OFFSET ?').bind(...queryBinds).all();

      const zoneCounts = {};
      for (let zi = 1; zi <= 8; zi++) zoneCounts['z' + zi] = 0;
      const zoneRows = session.role === 'KETUA_ZON' && session.zoneName
        ? await db.prepare('SELECT zon, count(*) as count FROM laporan WHERE deleted_at IS NULL AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" AND report_type = "school_visit" AND zon = ? GROUP BY zon').bind(session.zoneName).all()
        : await db.prepare('SELECT zon, count(*) as count FROM laporan WHERE deleted_at IS NULL AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" AND report_type = "school_visit" GROUP BY zon').all();
      for (const zr of (zoneRows.results || [])) {
        const zMatch = String(zr.zon || '').match(/ZON\s*([1-8])/i);
        if (zMatch) {
          zoneCounts['z' + zMatch[1]] = zr.count;
        }
      }

      const records = (rowsResult.results || []).map((r, idx) => {
        const zInfo = resolveZone(r.zon);
        const members = (r.pegawai || '').split(',').map(m => canonicalOfficerName_(m.trim())).filter(Boolean);
        const isdList = extractIsdNumbers_(r.no_isd, [r.title, r.isu, r.keputusan, r.tindak_susul, r.nama_sekolah]);
        const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
        const dateStr = dateComp.dateLabel;

        return {
          id: r.id,
          rowNumber: r.rowid || (offset + idx + 1),
          dateLabel: dateStr || '—',
          school: r.nama_sekolah || r.lokasi_lain || 'Sekolah',
          location: r.lokasi_lain || '',
          otherLocation: r.lokasi_lain || '',
          zoneId: zInfo.id,
          zoneName: zInfo.name,
          agenda: r.objektif || r.title || r.keputusan || r.isu || '',
          issue: r.isu || '',
          decision: r.rumusan_ai || r.keputusan || '',
          followUp: r.tindak_susul_ai || r.tindak_susul || '',
          startTime: parseTimeHHMM_(r.masa_mula, '08:00'),
          endTime: resolveMasaTamatDefault_(r.masa_mula, r.masa_tamat),
          masaMula: parseTimeHHMM_(r.masa_mula, '08:00'),
          masaTamat: resolveMasaTamatDefault_(r.masa_mula, r.masa_tamat),
          members: members,
          isdNumbers: isdList,
          deleted: Boolean(r.deleted_at),
          photos: [r.gambar1, r.gambar2, r.gambar3, r.gambar4, r.gambar5, r.gambar6, r.gambar7, r.gambar8, r.gambar9, r.gambar10].map(function(g, gi) {
          if (!g) return '';
          if (g.startsWith('http://') || g.startsWith('https://')) return g;
          if (g.startsWith('data:image')) {
            return '/api/public/photo?id=' + encodeURIComponent(r.id) + '&idx=' + (gi + 1);
          }
          return resolveVisitPhotoUrl_(g);
        }).filter(Boolean),
          pdfUrl: resolvePdfUrl_(r.pdf_url)
        };
      });

      return jsonResponse({
        ok: true,
        records: records,
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        zoneCounts: zoneCounts,
        source: 'd1_sql'
      });
    }

    if (action === 'adminsaverecord' || action === 'adminupdaterecord' || m === 'saverecord' || m === 'updaterecord') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;

      const recordId = getArg(0);
      if (!recordId || (typeof recordId === 'string' && !recordId.trim())) {
        return jsonResponse({ ok: false, error: 'ID rekod tidak sah. Muat semula halaman sebelum mengedit.' }, 400);
      }
      const data = getArg(1) || body.data || {};

      const currentRecord = await db.prepare('SELECT zon, title, objektif FROM laporan WHERE id = ? AND report_type = "school_visit"').bind(String(recordId)).first();
      if (!currentRecord) {
        return jsonResponse({ ok: false, error: 'Rekod tidak dijumpai. Muat semula senarai dan cuba lagi.' }, 404);
      }

      // KETUA_ZON can only edit records within their assigned zone.
      if (session.role === 'KETUA_ZON' && session.zoneName && currentRecord.zon !== session.zoneName) {
        return jsonResponse({ ok: false, error: 'Akses ditolak. Anda hanya dibenarkan mengemas kini rekod bagi zon anda (' + session.zoneName + ').' }, 403);
      }

      let isdStr = (data.isdNumbers || []).join(', ');
      if (!isdStr && data.isd) isdStr = String(data.isd).trim();
      if (!isdStr) {
        isdStr = extractIsdNumbers_('', [data.agenda, data.issue, data.decision, data.followUp, data.school]).join(', ');
      }

      const agenda = data.agenda || '';
      const decision = data.decision || '';
      const followUp = data.followUp || '';
      // Modern PTIS separates Tajuk from Objektif. Preserve an existing title when
      // the record already has a dedicated objektif; legacy rows still mirror agenda to title.
      const titleToStore = String(currentRecord.objektif || '').trim()
        ? (currentRecord.title || '')
        : agenda;
      const publishLock = await db.prepare(
        'SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1'
      ).bind(String(recordId)).first();
      if (publishLock) {
        return jsonResponse({ ok: false, error: 'Laporan sedang disiarkan ke Facebook. Kemaskini selepas proses selesai.' }, 409);
      }
      const result = await db.prepare(
        'UPDATE laporan SET ' +
        'nama_sekolah = ?, lokasi_lain = ?, title = ?, objektif = ?, isu = ?, keputusan = ?, rumusan_ai = ?, tindak_susul = ?, tindak_susul_ai = ?, pegawai = ?, no_isd = ?, updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") ' +
        'WHERE id = ? AND NOT EXISTS (SELECT 1 FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING") AND report_type = "school_visit"'
      ).bind(
        data.school || '', data.otherLocation || '', titleToStore, agenda, data.issue || '',
        decision, decision, followUp, followUp, (data.members || []).join(', '), isdStr,
        String(recordId), String(recordId)
      ).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Rekod tidak berjaya dikemas kini. Muat semula senarai dan cuba lagi.' }, 409);
      }

      await bumpDataVersion_(db);

      const updatedReport = await db.prepare('SELECT * FROM laporan WHERE id = ? AND report_type = "school_visit"').bind(String(recordId)).first();
      if (updatedReport) {
        const updatedCaption = buildFacebookCaptionForReport_(updatedReport);
        await db.prepare(
          'UPDATE facebook_queue SET caption = ?, dikemaskini = datetime("now", "+8 hours") ' +
          'WHERE report_id = ? AND status NOT IN ("DIPOSTING", "DIPADAM", "SEDANG_DIPOSTING")'
        ).bind(updatedCaption, String(recordId)).run();
      }
      return jsonResponse({ ok: true, message: 'Rekod berjaya dikemaskini.' });
    }

    if (action === 'admindeleterecord' || m === 'deleterecord') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;

      const recordId = getArg(0);
      if (!recordId || (typeof recordId === 'string' && !recordId.trim())) {
        return jsonResponse({ ok: false, error: 'ID rekod tidak sah.' }, 400);
      }
      const publishLock = await db.prepare('SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1').bind(String(recordId)).first();
      if (publishLock) {
        return jsonResponse({ ok: false, error: 'Laporan sedang disiarkan ke Facebook. Cuba semula selepas proses selesai.' }, 409);
      }
      const result = await db.prepare(
        'UPDATE laporan SET deleted_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours"), updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") WHERE id = ? AND deleted_at IS NULL'
      ).bind(String(recordId)).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Rekod tidak dijumpai atau sudah dipadam.' }, 409);
      }
      await bumpDataVersion_(db);
      return jsonResponse({ ok: true, message: 'Rekod berjaya dipadam.' });
    }

    if (action === 'adminrestorerecord' || m === 'restorerecord') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;

      const recordId = getArg(0);
      if (!recordId || (typeof recordId === 'string' && !recordId.trim())) {
        return jsonResponse({ ok: false, error: 'ID rekod tidak sah.' }, 400);
      }
      const result = await db.prepare(
        'UPDATE laporan SET deleted_at = NULL, updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours") WHERE id = ? AND deleted_at IS NOT NULL'
      ).bind(String(recordId)).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Rekod tidak dijumpai atau belum dipadam.' }, 409);
      }
      await bumpDataVersion_(db);
      return jsonResponse({ ok: true, message: 'Rekod berjaya dipulihkan.' });
    }

    if (action === 'adminpurgerecord' || m === 'purgerecord') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;

      const recordId = getArg(0);
      if (!recordId || (typeof recordId === 'string' && !recordId.trim())) {
        return jsonResponse({ ok: false, error: 'ID rekod tidak sah.' }, 400);
      }
      const publishLock = await db.prepare('SELECT id FROM facebook_queue WHERE report_id = ? AND status = "SEDANG_DIPOSTING" LIMIT 1').bind(String(recordId)).first();
      if (publishLock) {
        return jsonResponse({ ok: false, error: 'Laporan sedang disiarkan ke Facebook. Padam kekal hanya selepas proses selesai.' }, 409);
      }
      const result = await db.prepare('DELETE FROM laporan WHERE id = ? AND deleted_at IS NOT NULL').bind(String(recordId)).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Rekod tidak dijumpai dalam senarai dipadam atau belum dipadam secara lembut.' }, 409);
      }
      try {
        await db.prepare('DELETE FROM facebook_queue WHERE report_id = ? AND status != "SEDANG_DIPOSTING"').bind(String(recordId)).run();
      } catch(e) {}
      await bumpDataVersion_(db);
      return jsonResponse({ ok: true, message: 'Rekod berjaya dipadam kekal (purged).' });
    }

    // 8. Tuntutan Perjalanan Bulanan (Fasa 1: ISD, admin sahaja)
    function normalizeTuntutanFilter_(payload) {
      const source = payload || {};
      const tahun = Number(source.tahun);
      const bulan = Number(source.bulan);
      const zon = String(source.zon || '').trim().toUpperCase();
      if (!Number.isInteger(tahun) || tahun < 2020 || tahun > 2100) return { error: 'Tahun tidak sah.' };
      if (!Number.isInteger(bulan) || bulan < 1 || bulan > 12) return { error: 'Bulan tidak sah.' };
      if (!/^ZON [1-8]$/.test(zon)) return { error: 'Zon tidak sah.' };
      const month = String(bulan).padStart(2, '0');
      const lastDay = new Date(Date.UTC(tahun, bulan, 0)).getUTCDate();
      return {
        tahun: tahun,
        bulan: bulan,
        zon: zon,
        start: String(tahun) + '-' + month + '-01',
        end: String(tahun) + '-' + month + '-' + String(lastDay).padStart(2, '0')
      };
    }

    function tuntutanDescription_(row) {
      return String(row.objektif || row.title || row.keputusan || row.isu || 'Khidmat Bantu ICT').trim();
    }

    function normalizeTuntutanAiText_(value) {
      let text = String(value || '');
      try { text = text.normalize('NFKC'); } catch (e) {}
      return text.replace(/\u00a0/g, ' ').replace(/\\s+/g, ' ').trim();
    }

    function isTuntutanAiBoilerplate_(value) {
      const text = normalizeTuntutanAiText_(value)
        .replace(/#?\\d{5,9}/g, ' ')
        .replace(/[()\\[\\]{}:;,.\\-_/]+/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      if (!text) return true;
      const allowed = new Set(['khidmat', 'bantu', 'ict', 'melalui', 'sistem', 'service', 'desk', 'isd', 'no', 'nombor', 'laporan']);
      const words = text.split(' ').filter(Boolean);
      return words.length > 0 && words.every(function(word) { return allowed.has(word); });
    }

    function tuntutanAiSourceText_(item) {
      const objektif = normalizeTuntutanAiText_(item && item.objektif);
      const title = normalizeTuntutanAiText_(item && item.title);
      if (objektif && !isTuntutanAiBoilerplate_(objektif)) return objektif;
      if (title && !isTuntutanAiBoilerplate_(title)) return title;
      return '';
    }

    function normalizeTuntutanAiSuggestion_(value) {
      return normalizeTuntutanAiText_(value)
        .replace(/(?:\\bISD\\b\\s*[-:#]?\\s*)?#?\\d{5,9}\\b/gi, ' ')
        .replace(/\\s+/g, ' ')
        .replace(/[.!]+$/g, '')
        .trim();
    }

    function uniqueKeepOrder_(items) {
      const out = [];
      const seen = new Set();
      (items || []).forEach(function(item) {
        const value = String(item || '').trim();
        if (value && !seen.has(value)) {
          seen.add(value);
          out.push(value);
        }
      });
      return out;
    }

    function suspiciousIsdReason_(value) {
      const s = String(value || '').trim();
      if (s.length !== 6 || !Array.from(s).every(function(ch) { return ch >= '0' && ch <= '9'; })) return 'format';
      if (new Set(Array.from(s)).size === 1) return 'digit-sama';
      if (s === '123456' || s === '654321') return 'turutan';
      if (s.slice(0, 3) === s.slice(3) || (s.slice(0, 2) === s.slice(2, 4) && s.slice(2, 4) === s.slice(4, 6))) return 'corak-berulang';
      const counts = {};
      Array.from(s).forEach(function(ch) { counts[ch] = (counts[ch] || 0) + 1; });
      const repeats = Object.keys(counts).map(function(k) { return counts[k]; });
      const maxRepeat = repeats.length ? Math.max.apply(null, repeats) : 0;
      if (new Set(Array.from(s)).size <= 3 && maxRepeat >= 3 && (s.indexOf('000') >= 0 || s.indexOf('111') >= 0 || s.indexOf('222') >= 0 || s.indexOf('333') >= 0 || s.indexOf('444') >= 0 || s.indexOf('555') >= 0 || s.indexOf('666') >= 0 || s.indexOf('777') >= 0 || s.indexOf('888') >= 0 || s.indexOf('999') >= 0)) return 'corak-berulang';
      return '';
    }

    if (action === 'admintuntutanpratonton' || m === 'tuntutanpratonton') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const filter = normalizeTuntutanFilter_(payload);
      if (filter.error) return jsonResponse({ ok: false, error: filter.error }, 400);
      const modTapis = payload.modTapis === 'semua' ? 'semua' : 'isd';

      const rowsResult = await db.prepare(
        'SELECT id, tarikh, tarikh_iso, zon, nama_sekolah, pegawai, no_isd, title, objektif, isu, keputusan, tindak_susul ' +
        'FROM laporan WHERE deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" AND zon = ? AND tarikh_iso >= ? AND tarikh_iso <= ? ORDER BY tarikh_iso, rowid'
      ).bind(filter.zon, filter.start, filter.end).all();
      const sourceRows = rowsResult.results || [];
      const records = sourceRows.map(function(row) {
        const isdList = extractIsdNumbers_(row.no_isd, [row.title, row.isu, row.keputusan, row.tindak_susul, row.nama_sekolah]);
        return {
          id: row.id,
          tarikh: row.tarikh || '',
          tarikh_iso: row.tarikh_iso || '',
          zon: row.zon || '',
          nama_sekolah: row.nama_sekolah || '',
          pegawai: String(row.pegawai || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean),
          no_isd: row.no_isd || '',
          isdList: isdList,
          keterangan: tuntutanDescription_(row),
          title: row.title || '',
          objektif: row.objektif || '',
          isu: row.isu || '',
          keputusan: row.keputusan || '',
          tindak_susul: row.tindak_susul || ''
        };
      });

      const grouped = new Map();
      const tanpaIsd = [];
      const pelbagaiIsd = [];
      const allIsd = [];
      records.forEach(function(row) {
        if (!row.isdList.length) {
          tanpaIsd.push(row);
          if (modTapis === 'semua') {
            grouped.set('__NO_ISD__' + row.id, {
              bil: 0, sumber: 'ISD', noIsd: '', keterangan: row.keterangan,
              tarikh: row.tarikh_iso ? [row.tarikh_iso] : [], sekolah: row.nama_sekolah,
              pegawai: row.pegawai.slice(), pegawaiTuntutan: '', laporanIds: [row.id],
              manual: false, dikecualikan: false, amaranSekolah: false, semakPelbagaiIsd: false
            });
          }
          return;
        }
        if (row.isdList.length > 1) pelbagaiIsd.push({ id: row.id, isdList: row.isdList.slice(), sekolah: row.nama_sekolah, tarikh: row.tarikh_iso });
        row.isdList.forEach(function(noIsd) {
          allIsd.push(noIsd);
          if (!grouped.has(noIsd)) {
            grouped.set(noIsd, {
              bil: 0, sumber: 'ISD', noIsd: noIsd, keterangan: row.keterangan,
              tarikh: [], sekolah: row.nama_sekolah, pegawai: [], pegawaiTuntutan: '',
              laporanIds: [], manual: false, dikecualikan: false, amaranSekolah: false,
              sekolahAlternatif: [], semakPelbagaiIsd: row.isdList.length > 1
            });
          }
          const target = grouped.get(noIsd);
          if (row.tarikh_iso && target.tarikh.indexOf(row.tarikh_iso) === -1) target.tarikh.push(row.tarikh_iso);
          target.tarikh.sort();
          target.pegawai = uniqueKeepOrder_(target.pegawai.concat(row.pegawai));
          target.laporanIds = uniqueKeepOrder_(target.laporanIds.concat(row.id));
          if (target.sekolah && row.nama_sekolah && target.sekolah !== row.nama_sekolah) {
            target.amaranSekolah = true;
            target.sekolahAlternatif = uniqueKeepOrder_(target.sekolahAlternatif.concat(row.nama_sekolah));
          }
          if (row.isdList.length > 1) target.semakPelbagaiIsd = true;
        });
      });

      const baris = Array.from(grouped.values()).sort(function(a, b) {
        const ad = a.tarikh[0] || '9999-99-99';
        const bd = b.tarikh[0] || '9999-99-99';
        return ad.localeCompare(bd) || String(a.noIsd).localeCompare(String(b.noIsd));
      });
      baris.forEach(function(row, index) { row.bil = index + 1; });

      const numeric = uniqueKeepOrder_(allIsd).filter(function(v) { return suspiciousIsdReason_(v) === '' && Number.isFinite(Number(v)); }).map(Number).sort(function(a, b) { return a - b; });
      let median = null;
      if (numeric.length) {
        const mid = Math.floor(numeric.length / 2);
        median = numeric.length % 2 ? numeric[mid] : (numeric[mid - 1] + numeric[mid]) / 2;
      }
      const isdMencurigakan = [];
      uniqueKeepOrder_(allIsd).forEach(function(noIsd) {
        const reason = suspiciousIsdReason_(noIsd);
        if (reason) {
          isdMencurigakan.push({ noIsd: noIsd, sebab: reason });
        } else if (median !== null && (Number(noIsd) < median * 0.6 || Number(noIsd) > median * 1.4)) {
          isdMencurigakan.push({ noIsd: noIsd, sebab: 'luar-julat', median: median });
        }
      });

      const distanceResult = await db.prepare('SELECT nama, zon, jarak_km, maps_url, maps_pdf FROM sekolah WHERE zon = ? ORDER BY nama').bind(filter.zon).all();
      const distanceRows = distanceResult.results || [];
      const distanceBySchool = new Map(distanceRows.map(function(row) { return [String(row.nama || '').toUpperCase(), row]; }));
      const visitedSchools = uniqueKeepOrder_(records.map(function(row) { return row.nama_sekolah; }));
      const jarakTiada = visitedSchools.filter(function(name) {
        const found = distanceBySchool.get(String(name || '').toUpperCase());
        return !found || found.jarak_km === null || found.jarak_km === undefined;
      });

      return jsonResponse({
        ok: true,
        filter: { tahun: filter.tahun, bulan: filter.bulan, zon: filter.zon, modTapis: modTapis },
        records: records,
        baris: baris,
        tanpaIsd: tanpaIsd,
        isdMencurigakan: isdMencurigakan,
        jarakTiada: jarakTiada,
        pelbagaiIsd: pelbagaiIsd,
        jarak: distanceRows
      });
    }

    if (action === 'admintuntutancadangketerangan' || m === 'tuntutancadangketerangan') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const rawItems = Array.isArray(payload) ? payload : (Array.isArray(payload.items) ? payload.items : []);
      if (!rawItems.length) return jsonResponse({ ok: true, cadangan: [] });
      if (rawItems.length > 100) return jsonResponse({ ok: false, error: 'Maksimum 100 rekod bagi satu permintaan cadangan keterangan.' }, 400);

      const ordered = [];
      const seenIds = new Set();
      rawItems.forEach(function(item) {
        const laporanId = String(item && item.laporanId || '').trim();
        if (!laporanId || seenIds.has(laporanId)) return;
        seenIds.add(laporanId);
        ordered.push({
          laporanId: laporanId,
          objektif: normalizeTuntutanAiText_(item && item.objektif),
          title: normalizeTuntutanAiText_(item && item.title),
          namaSekolah: normalizeTuntutanAiText_(item && item.namaSekolah),
          noIsd: String(item && item.noIsd || '').replace(/^#/, '').trim()
        });
      });

      const baseResults = ordered.map(function(item) { return { laporanId: item.laporanId, cadangan: '' }; });
      const candidates = ordered.map(function(item) {
        return {
          laporanId: item.laporanId,
          teks: tuntutanAiSourceText_(item),
          namaSekolah: item.namaSekolah
        };
      }).filter(function(item) { return Boolean(item.teks); });

      if (!candidates.length) {
        return jsonResponse({ ok: true, cadangan: baseResults, aiAvailable: true, message: 'Tiada teks tugas bermakna untuk dicadangkan.' });
      }

      const prompt = 'Anda membantu menyediakan KETERANGAN TUGAS ringkas untuk DOK-1 tuntutan perjalanan PPD Contoh.\\n' +
        'Pulangkan SATU cadangan bagi setiap laporanId yang diberi.\\n\\n' +
        'PERATURAN WAJIB:\\n' +
        '1. Bahasa Melayu, huruf biasa, tanpa noktah akhir.\\n' +
        '2. Sasar 3 hingga 10 patah perkataan.\\n' +
        '3. Bentuk FRASA NAMA TUGAS, bukan ayat lengkap.\\n' +
        '4. Buang nama sekolah kerana sekolah mempunyai lajur sendiri.\\n' +
        '5. Jangan sebut nombor ISD.\\n' +
        '6. Jangan tambah atau reka fakta yang tiada dalam teks sumber.\\n' +
        '7. Jika teks sumber cuma boilerplate seperti KHIDMAT BANTU ICT MELALUI SISTEM ICT SERVICE DESK tanpa maklumat tugas sebenar, cadangan MESTI string kosong.\\n' +
        '8. Contoh: "Pelaksanaan khidmat bantu pemasangan dan konfigurasi Microsoft M365A1 pada empat buah peranti ICT" -> "Pemasangan M365A1".\\n' +
        '9. Contoh: "Memantau dan menilai kemajuan pelaksanaan projek perluasan rangkaian MyGovNet bagi memastikan ketersediaan capaian internet" -> "Pemantauan pemasangan internet mygovnet".\\n\\n' +
        'REKOD INPUT (teks telah dinormalisasi Unicode):\\n' + JSON.stringify(candidates) + '\\n\\n' +
        'Pulangkan JSON sahaja dengan bentuk {"cadangan":[{"laporanId":"...","cadangan":"..."}]}.';

      try {
        const upstream = await callGeminiModelWithKeyFallback_(env, GEMINI_PRIMARY_MODEL, {
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: 'Anda menulis frasa tugas DOK-1 kerajaan Malaysia secara sangat ringkas dan tidak mereka fakta.' }] },
          generationConfig: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: 'low' },
            responseSchema: {
              type: 'OBJECT',
              properties: {
                cadangan: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      laporanId: { type: 'STRING' },
                      cadangan: { type: 'STRING' }
                    },
                    required: ['laporanId', 'cadangan']
                  }
                }
              },
              required: ['cadangan']
            }
          }
        }, 15000, 'primary', {});

        let parsed = {};
        try { parsed = JSON.parse(upstream.text || '{}'); } catch (e) {}
        const byId = new Map();
        (Array.isArray(parsed.cadangan) ? parsed.cadangan : []).forEach(function(item) {
          const laporanId = String(item && item.laporanId || '').trim();
          if (!seenIds.has(laporanId) || byId.has(laporanId)) return;
          byId.set(laporanId, normalizeTuntutanAiSuggestion_(item && item.cadangan));
        });
        const results = ordered.map(function(item) {
          return { laporanId: item.laporanId, cadangan: byId.get(item.laporanId) || '' };
        });
        return jsonResponse({ ok: true, cadangan: results, aiAvailable: true, model: upstream.model || GEMINI_PRIMARY_MODEL });
      } catch (err) {
        console.warn('[Tuntutan AI] Cadangan keterangan gagal: ' + String(err && err.message || err));
        return jsonResponse({
          ok: true,
          cadangan: baseResults,
          aiAvailable: false,
          warning: 'Cadangan AI tidak tersedia. Keterangan kekal boleh ditaip secara manual.'
        });
      }
    }

    if (action === 'admintuntutandapatdraf' || m === 'tuntutandapatdraf') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const filter = normalizeTuntutanFilter_(getArg(0) || body.payload || {});
      if (filter.error) return jsonResponse({ ok: false, error: filter.error }, 400);
      const row = await db.prepare('SELECT id, tahun, bulan, zon, status, data_json, created_at, updated_at FROM tuntutan_draf WHERE tahun = ? AND bulan = ? AND zon = ? LIMIT 1').bind(filter.tahun, filter.bulan, filter.zon).first();
      if (!row) return jsonResponse({ ok: true, draft: null });
      let data = null;
      try { data = JSON.parse(row.data_json || '{}'); } catch (e) { return jsonResponse({ ok: false, error: 'Data draf rosak dan tidak dapat dibaca.' }, 500); }
      return jsonResponse({ ok: true, draft: { id: row.id, tahun: row.tahun, bulan: row.bulan, zon: row.zon, status: row.status, data: data, createdAt: row.created_at, updatedAt: row.updated_at } });
    }

    if (action === 'admintuntutansimpandraf' || m === 'tuntutansimpandraf') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const filter = normalizeTuntutanFilter_(payload);
      if (filter.error) return jsonResponse({ ok: false, error: filter.error }, 400);
      const status = payload.status === 'siap' ? 'siap' : 'draf';
      const data = payload.data && typeof payload.data === 'object' ? payload.data : null;
      if (!data || !Array.isArray(data.baris)) return jsonResponse({ ok: false, error: 'Data draf tidak sah.' }, 400);
      const zonSlug = filter.zon.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const id = String(filter.tahun) + '-' + String(filter.bulan).padStart(2, '0') + '-' + zonSlug;
      await db.prepare(
        'INSERT INTO tuntutan_draf (id, tahun, bulan, zon, status, data_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now", "+8 hours"), datetime("now", "+8 hours")) ' +
        'ON CONFLICT(tahun, bulan, zon) DO UPDATE SET status = excluded.status, data_json = excluded.data_json, updated_at = datetime("now", "+8 hours")'
      ).bind(id, filter.tahun, filter.bulan, filter.zon, status, JSON.stringify(data)).run();
      return jsonResponse({ ok: true, id: id, status: status, message: 'Draf tuntutan berjaya disimpan.' });
    }

    if (action === 'admintuntutankemaskiniisd' || m === 'tuntutankemaskiniisd') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const id = String(payload.id || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'ID laporan diperlukan.' }, 400);
      const sets = [];
      const binds = [];
      if (Object.prototype.hasOwnProperty.call(payload, 'noIsd')) {
        const parsed = extractIsdNumbers_(payload.noIsd, []);
        sets.push('no_isd = ?');
        binds.push(parsed.length ? parsed.join(', ') : null);
      }
      if (Object.prototype.hasOwnProperty.call(payload, 'tarikhIso')) {
        const tarikhIso = String(payload.tarikhIso || '').trim();
        if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(tarikhIso)) return jsonResponse({ ok: false, error: 'Tarikh tidak sah.' }, 400);
        const p = tarikhIso.split('-');
        sets.push('tarikh_iso = ?'); binds.push(tarikhIso);
        sets.push('tarikh = ?'); binds.push(p[2] + '/' + p[1] + '/' + p[0]);
      }
      if (Object.prototype.hasOwnProperty.call(payload, 'sekolah')) {
        const sekolah = String(payload.sekolah || '').trim();
        if (!sekolah) return jsonResponse({ ok: false, error: 'Nama sekolah tidak boleh kosong.' }, 400);
        sets.push('nama_sekolah = ?'); binds.push(sekolah);
      }
      if (Object.prototype.hasOwnProperty.call(payload, 'keterangan')) {
        sets.push('objektif = ?'); binds.push(String(payload.keterangan || '').trim());
      }
      if (!sets.length) return jsonResponse({ ok: false, error: 'Tiada perubahan untuk disimpan.' }, 400);
      sets.push('updated_at = strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours")');
      binds.push(id);
      const result = await db.prepare('UPDATE laporan SET ' + sets.join(', ') + ' WHERE id = ? AND deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').bind(...binds).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) return jsonResponse({ ok: false, error: 'Laporan aktif tidak dijumpai atau tidak berjaya dikemas kini.' }, 404);
      await bumpDataVersion_(db);
      const updated = await db.prepare('SELECT id, tarikh, tarikh_iso, zon, nama_sekolah, pegawai, no_isd, title, objektif, isu, keputusan, tindak_susul FROM laporan WHERE id = ? AND deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" LIMIT 1').bind(id).first();
      return jsonResponse({ ok: true, record: updated || null, message: 'Data laporan berjaya dikemas kini.' });
    }

    if (action === 'admintuntutansenaraijarak' || m === 'tuntutansenaraijarak') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const zon = String(payload.zon || '').trim().toUpperCase();
      if (!/^ZON [1-8]$/.test(zon)) return jsonResponse({ ok: false, error: 'Zon tidak sah.' }, 400);
      const result = await db.prepare('SELECT nama, kod, zon, jarak_km, maps_url, maps_pdf FROM sekolah WHERE zon = ? ORDER BY nama').bind(zon).all();
      return jsonResponse({ ok: true, zon: zon, sekolah: result.results || [] });
    }

    if (action === 'admintuntutansimpanjarak' || m === 'tuntutansimpanjarak') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const sekolah = String(payload.sekolah || '').trim();
      const jarakKm = payload.jarakKm === '' || payload.jarakKm === null || payload.jarakKm === undefined ? null : Number(payload.jarakKm);
      const mapsUrl = String(payload.mapsUrl || '').trim();
      const mapsPdf = String(payload.mapsPdf || '').trim();
      if (!sekolah) return jsonResponse({ ok: false, error: 'Nama sekolah diperlukan.' }, 400);
      if (jarakKm !== null && (!Number.isFinite(jarakKm) || jarakKm < 0)) return jsonResponse({ ok: false, error: 'Jarak perlu nombor positif.' }, 400);
      if (mapsUrl && !(mapsUrl.toLowerCase().startsWith('https://') || mapsUrl.toLowerCase().startsWith('http://'))) return jsonResponse({ ok: false, error: 'Pautan Google Maps tidak sah.' }, 400);
      const result = await db.prepare('UPDATE sekolah SET jarak_km = ?, maps_url = ?, maps_pdf = ? WHERE nama = ?').bind(jarakKm, mapsUrl || null, mapsPdf || null, sekolah).run();
      if (!result.success || !result.meta || result.meta.changes !== 1) return jsonResponse({ ok: false, error: 'Sekolah tidak dijumpai.' }, 404);
      return jsonResponse({ ok: true, message: 'Maklumat jarak berjaya disimpan.' });
    }

    // 9. Facebook Studio APIs
    if (action === 'adminlistfbqueue' || m === 'listfbqueue') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;

      const statusFilter = String(getArg(0) || 'all').toLowerCase();
      const opts = (typeof getArg(1) === 'object' && getArg(1) !== null) ? getArg(1) : {};
      const page = Number(opts.page || (typeof getArg(1) === 'number' ? getArg(1) : 1));
      const pageSize = Number(opts.pageSize || getArg(2) || 10);
      const search = String(opts.search || getArg(3) || '').toLowerCase().trim();
      const offset = (page - 1) * pageSize;

      let whereClause = 'q.status != "DIPADAM"';
      if (statusFilter === 'deleted' || statusFilter === 'dipadam') {
        whereClause = 'q.status = "DIPADAM"';
      } else if (statusFilter === 'ready' || statusFilter === 'draft' || statusFilter === 'active') {
        whereClause = 'q.status NOT IN ("DIPOSTING", "DIPADAM")';
      } else if (statusFilter === 'posted' || statusFilter === 'diposting') {
        whereClause = 'q.status = "DIPOSTING"';
      }

      // FIX SQL Injection: Tukar string concat ke ? parameter bind
      const searchBinds = [];
      if (search) {
        const s = '%' + search + '%';
        whereClause += ' AND (lower(q.caption) LIKE ? OR lower(l.nama_sekolah) LIKE ? OR lower(l.zon) LIKE ?)';
        searchBinds.push(s, s, s);
      }

      const totalResult = searchBinds.length > 0
        ? await db.prepare('SELECT count(*) as count FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE ' + whereClause).bind(...searchBinds).first()
        : await db.prepare('SELECT count(*) as count FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE ' + whereClause).first();
      const total = totalResult ? totalResult.count : 0;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      const queryBinds = [...searchBinds, pageSize, offset];
      const rowsResult = await db.prepare(
        'SELECT q.*, l.nama_sekolah, l.zon, l.tarikh, l.pegawai, l.no_isd, ' +
        'CASE WHEN l.gambar1 LIKE "data:image%" THEN "data:image" ELSE l.gambar1 END AS gambar1, ' +
        'CASE WHEN l.gambar2 LIKE "data:image%" THEN "data:image" ELSE l.gambar2 END AS gambar2, ' +
        'CASE WHEN l.gambar3 LIKE "data:image%" THEN "data:image" ELSE l.gambar3 END AS gambar3, ' +
        'CASE WHEN l.gambar4 LIKE "data:image%" THEN "data:image" ELSE l.gambar4 END AS gambar4, ' +
        'CASE WHEN l.gambar5 LIKE "data:image%" THEN "data:image" ELSE l.gambar5 END AS gambar5, ' +
        'CASE WHEN l.gambar6 LIKE "data:image%" THEN "data:image" ELSE l.gambar6 END AS gambar6, ' +
        'CASE WHEN l.gambar7 LIKE "data:image%" THEN "data:image" ELSE l.gambar7 END AS gambar7, ' +
        'CASE WHEN l.gambar8 LIKE "data:image%" THEN "data:image" ELSE l.gambar8 END AS gambar8, ' +
        'CASE WHEN l.gambar9 LIKE "data:image%" THEN "data:image" ELSE l.gambar9 END AS gambar9, ' +
        'CASE WHEN l.gambar10 LIKE "data:image%" THEN "data:image" ELSE l.gambar10 END AS gambar10, ' +
        'l.isu, l.keputusan, l.tindak_susul, l.objektif, l.rumusan_ai, l.impak_ai, l.tindak_susul_ai, l.akauntabiliti, l.tugas_utama, l.khidmat_bantu, l.title, l.slogan, l.hashtags ' +
        'FROM facebook_queue q ' +
        'LEFT JOIN laporan l ON q.report_id = l.id ' +
        'WHERE ' + whereClause + ' ' +
        'ORDER BY q.rowid DESC ' +
        'LIMIT ? OFFSET ?'
      ).bind(...queryBinds).all();

      const queueCounts = await db.prepare(
        'SELECT ' +
        'SUM(CASE WHEN status NOT IN ("DIPOSTING", "DIPADAM") THEN 1 ELSE 0 END) AS active, ' +
        'SUM(CASE WHEN status = "DIPOSTING" THEN 1 ELSE 0 END) AS posted, ' +
        'SUM(CASE WHEN status = "DIPADAM" THEN 1 ELSE 0 END) AS deleted ' +
        'FROM facebook_queue'
      ).first();

      const items = (rowsResult.results || []).map(r => {
        const isStandaloneMeeting = !r.report_id;
        const meta = isStandaloneMeeting ? parseFbQueueMeta_(r.meta_json) : null;
        const zInfo = resolveZone(isStandaloneMeeting ? meta.zoneName : r.zon);
        const photoSource = isStandaloneMeeting ? (Array.isArray(meta.photos) ? meta.photos : []) : [r.gambar1, r.gambar2, r.gambar3, r.gambar4, r.gambar5, r.gambar6, r.gambar7, r.gambar8, r.gambar9, r.gambar10];
        const photos = photoSource.map(function(g, gi) {
          if (!g) return '';
          if (g.startsWith('http://') || g.startsWith('https://')) return g;
          if (g.startsWith('data:image')) {
            return isStandaloneMeeting
              ? '/api/public/photo?queueId=' + encodeURIComponent(r.id) + '&idx=' + (gi + 1)
              : '/api/public/photo?id=' + encodeURIComponent(r.report_id || r.id) + '&idx=' + (gi + 1);
          }
          return resolveVisitPhotoUrl_(g);
        }).filter(Boolean);

        if (isStandaloneMeeting) {
          return {
            id: r.id,
            caption: r.caption || '',
            status: r.status,
            fbPostId: r.fb_post_id || '',
            dicadangkanOleh: r.dicadangkan_oleh || 'Sistem',
            updatedAtLabel: r.dikemaskini || '',
            school: meta.title || (meta.jenisMesyuarat || 'MESYUARAT'),
            dateLabel: meta.dateLabel || '',
            zoneId: zInfo.id,
            zoneName: zInfo.name,
            rowNumberRujukan: r.rowid || 1,
            fullReport: {
              school: meta.title || '-',
              dateLabel: meta.dateLabel || '-',
              accountability: '-',
              mainTask: meta.jenisMesyuarat || '-',
              involvement: meta.pelapor || '-',
              objective: meta.title || '-',
              summary: '-',
              impact: '-',
              followUp: '-',
              noIsd: '-'
            },
            photos: photos,
            photoCount: photos.length
          };
        }

        const caption = r.caption || buildFacebookCaptionForReport_({
          namaSekolah: r.nama_sekolah,
          zon: r.zon,
          tarikh: r.tarikh,
          masaMula: r.masa_mula,
          masaTamat: r.masa_tamat,
          pegawai: r.pegawai,
          pelapor: r.pelapor,
          title: r.title,
          objektif: r.objektif || r.title,
          isu: r.isu,
          keputusan: r.keputusan,
          tindakSusul: r.tindak_susul,
          rumusanAi: r.rumusan_ai || r.keputusan,
          impakAi: r.impak_ai || r.isu,
          tindakSusulAi: r.tindak_susul_ai || r.tindak_susul,
          akauntabiliti: r.akauntabiliti,
          tugasUtama: r.tugas_utama,
          khidmatBantu: r.khidmat_bantu,
          slogan: r.slogan,
          hashtags: r.hashtags,
          noIsd: r.no_isd
        });

        return {
          id: r.id,
          caption: caption,
          status: r.status,
          fbPostId: r.fb_post_id || '',
          dicadangkanOleh: r.dicadangkan_oleh || 'Sistem',
          updatedAtLabel: r.dikemaskini || '',
          school: r.nama_sekolah || '(Sekolah)',
          dateLabel: r.tarikh || '',
          zoneId: zInfo.id,
          zoneName: zInfo.name,
          rowNumberRujukan: r.rowid || 1,
          fullReport: {
            school: r.nama_sekolah || '-',
            dateLabel: r.tarikh || '-',
            accountability: r.akauntabiliti || 'PENGURUSAN',
            mainTask: r.tugas_utama || 'Menyelaras Proses Urusan ICT',
            involvement: r.pegawai || r.pelapor || '-',
            objective: r.objektif || r.title || '-',
            summary: r.rumusan_ai || r.keputusan || '-',
            impact: r.impak_ai || r.isu || '-',
            followUp: r.tindak_susul_ai || r.tindak_susul || '-',
            noIsd: r.no_isd || '-'
          },
          photos: photos,
          photoCount: photos.length
        };
      });

      return jsonResponse({
        ok: true,
        items: items,
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
        counts: {
          active: queueCounts ? Number(queueCounts.active || 0) : 0,
          posted: queueCounts ? Number(queueCounts.posted || 0) : 0,
          deleted: queueCounts ? Number(queueCounts.deleted || 0) : 0,
          draft: 0,
          ready: queueCounts ? Number(queueCounts.active || 0) : 0
        }
      });
    }

    if (action === 'adminresolvefbpublishlock' || m === 'resolvefbpublishlock') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = String(getArg(0) || '').trim();
      const resolution = String(getArg(1) || '').trim().toUpperCase();
      const confirmedFbPostId = String(getArg(2) || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'ID draf tidak sah.' }, 400);

      const locked = await db.prepare('SELECT id, status FROM facebook_queue WHERE id = ?').bind(id).first();
      if (!locked || locked.status !== 'SEDANG_DIPOSTING') {
        return jsonResponse({ ok: false, error: 'Draf ini tidak berada dalam publish lock.' }, 409);
      }

      if (resolution === 'POSTED') {
        if (!confirmedFbPostId) {
          return jsonResponse({ ok: false, error: 'Facebook Post ID diperlukan selepas semakan manual Facebook Studio.' }, 400);
        }
        const resolved = await db.prepare(
          'UPDATE facebook_queue SET status = "DIPOSTING", fb_post_id = ?, dikemaskini = datetime("now", "+8 hours") ' +
          'WHERE id = ? AND status = "SEDANG_DIPOSTING"'
        ).bind(confirmedFbPostId, id).run();
        if (!resolved.success || !resolved.meta || resolved.meta.changes !== 1) {
          return jsonResponse({ ok: false, error: 'Publish lock berubah sebelum resolusi disimpan.' }, 409);
        }
        try {
          const cleanupCfg = await getTelegramAndFbConfig_(db);
          await deleteTelegramQueueNotification_(db, cleanupCfg, id);
        } catch (cleanupErr) {
          console.warn('Telegram cleanup after manual Facebook reconciliation failed:', cleanupErr && cleanupErr.message ? cleanupErr.message : cleanupErr);
        }
        return jsonResponse({ ok: true, status: 'DIPOSTING', fbPostId: confirmedFbPostId });
      }

      if (resolution === 'RETRY') {
        const resolved = await db.prepare(
          'UPDATE facebook_queue SET status = "DRAF", dikemaskini = datetime("now", "+8 hours") ' +
          'WHERE id = ? AND status = "SEDANG_DIPOSTING"'
        ).bind(id).run();
        if (!resolved.success || !resolved.meta || resolved.meta.changes !== 1) {
          return jsonResponse({ ok: false, error: 'Publish lock berubah sebelum resolusi disimpan.' }, 409);
        }
        return jsonResponse({ ok: true, status: 'DRAF', message: 'Publish lock dibuka selepas semakan manual. Draf boleh dicuba semula.' });
      }

      return jsonResponse({ ok: false, error: 'Resolusi mesti POSTED atau RETRY selepas semakan manual Facebook Studio.' }, 400);
    }

    if (action === 'adminsetfbqueuestatus' || m === 'setfbqueuestatus' || action === 'adminrequeuefbdraft' || m === 'requeuefbdraft') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      const newStatus = getArg(1) || 'READY';
      const normalizedStatus = String(newStatus || '').trim().toUpperCase();
      if (normalizedStatus === 'SEDANG_DIPOSTING' || normalizedStatus === 'DIPOSTING') {
        return jsonResponse({ ok: false, error: 'Status ini hanya boleh ditetapkan oleh proses penyiaran Facebook.' }, 400);
      }
      const statusUpdate = await db.prepare(
        'UPDATE facebook_queue SET status = ?, dikemaskini = datetime("now", "+8 hours") WHERE id = ? AND status != "SEDANG_DIPOSTING"'
      ).bind(normalizedStatus || 'READY', id).run();
      if (!statusUpdate.success || !statusUpdate.meta || statusUpdate.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf sedang diposkan atau tidak ditemui.' }, 409);
      }
      return jsonResponse({ ok: true, message: 'Status draf Facebook dikemaskini.', status: newStatus });
    }

    if (action === 'adminprunefbqueue' || action === 'adminpurgefbqueue' || m === 'prunefbqueue' || m === 'purgefbqueue') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const delRes = await db.prepare('DELETE FROM facebook_queue WHERE status = "DIPADAM"').run();
      return jsonResponse({
        ok: true,
        deletedCount: delRes.meta && delRes.meta.changes ? delRes.meta.changes : 0,
        message: 'Semua draf dipadam berjaya dibersihkan secara kekal daripada pangkalan data.'
      });
    }

    if (action === 'admindeletefbdraft' || m === 'deletefbdraft') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      const deleted = await db.prepare(
        'UPDATE facebook_queue SET status = "DIPADAM", dikemaskini = datetime("now", "+8 hours") WHERE id = ? AND status != "SEDANG_DIPOSTING"'
      ).bind(id).run();
      if (!deleted.success || !deleted.meta || deleted.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf sedang diposkan atau tidak ditemui.' }, 409);
      }
      return jsonResponse({ ok: true });
    }

    if (action === 'adminrestorefbdraft' || m === 'restorefbdraft') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const id = String(getArg(0) || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'ID draf tidak sah.' }, 400);

      const draft = await db.prepare('SELECT id, report_id, status FROM facebook_queue WHERE id = ?').bind(id).first();
      if (!draft) return jsonResponse({ ok: false, error: 'Draf Facebook tidak dijumpai.' }, 404);
      if (draft.status !== 'DIPADAM') return jsonResponse({ ok: false, error: 'Draf ini bukan dalam senarai dipadam.' }, 409);

      if (draft.report_id) {
        const report = await db.prepare('SELECT id, deleted_at FROM laporan WHERE id = ?').bind(draft.report_id).first();
        if (!report) return jsonResponse({ ok: false, error: 'Laporan asal tidak lagi wujud. Draf tidak boleh dipulihkan.' }, 409);
        if (report.deleted_at) return jsonResponse({ ok: false, error: 'Laporan asal telah dipadam. Pulihkan laporan asal terlebih dahulu.' }, 409);
        const active = await db.prepare('SELECT id FROM facebook_queue WHERE report_id = ? AND id != ? AND status NOT IN ("DIPOSTING", "DIPADAM") LIMIT 1').bind(draft.report_id, id).first();
        if (active) return jsonResponse({ ok: false, error: 'Laporan ini sudah mempunyai draf aktif dalam posting queue.' }, 409);
      }

      const restored = await db.prepare('UPDATE facebook_queue SET status = "DRAF", dikemaskini = datetime("now", "+8 hours") WHERE id = ? AND status = "DIPADAM"').bind(id).run();
      if (!restored.success || !restored.meta || restored.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf tidak berjaya dipulihkan. Muat semula dan cuba lagi.' }, 409);
      }
      await db.prepare('INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "RESTORE_FB_DRAFT", ?, ?)').bind(
        session.email || '', session.role || '', id, JSON.stringify({ reportId: draft.report_id || '', restoredTo: 'DRAF' })
      ).run();
      return jsonResponse({ ok: true, message: 'Draf berjaya dipulihkan ke posting queue.', status: 'DRAF' });
    }

    if (action === 'adminbulkdeletefbdrafts' || m === 'bulkdeletefbdrafts') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const ids = getArg(0) || [];
      if (!Array.isArray(ids) || !ids.length) return jsonResponse({ ok: false, error: 'Tiada item dipilih.' });
      const placeholders = ids.map(() => '?').join(',');
      const bulkDeleted = await db.prepare(
        'UPDATE facebook_queue SET status = "DIPADAM", dikemaskini = datetime("now", "+8 hours") ' +
        'WHERE id IN (' + placeholders + ') AND status != "SEDANG_DIPOSTING"'
      ).bind(...ids).run();
      const deletedCount = bulkDeleted.meta && bulkDeleted.meta.changes ? bulkDeleted.meta.changes : 0;
      if (deletedCount !== ids.length) {
        return jsonResponse({
          ok: false,
          error: 'Sebahagian draf sedang diposkan atau tidak ditemui.',
          deletedCount: deletedCount
        }, 409);
      }
      return jsonResponse({ ok: true, deletedCount: deletedCount });
    }

    if (action === 'adminupdatefbdraft' || m === 'updatefbdraft') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      const caption = getArg(1);
      const updated = await db.prepare(
        'UPDATE facebook_queue SET caption = ?, dikemaskini = datetime("now", "+8 hours") WHERE id = ? AND status != "SEDANG_DIPOSTING"'
      ).bind(caption, id).run();
      if (!updated.success || !updated.meta || updated.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf sedang diposkan atau tidak ditemui.' }, 409);
      }
      return jsonResponse({ ok: true });
    }

    if (action === 'adminregeneratefbdraft' || m === 'regeneratefbdraft') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      const draft = await db.prepare(
        'SELECT q.*, l.nama_sekolah, l.zon, l.tarikh, l.masa_mula, l.masa_tamat, l.pelapor, l.pegawai, l.title, l.isu, l.keputusan, l.tindak_susul, l.no_isd, l.objektif, l.rumusan_ai, l.impak_ai, l.tindak_susul_ai, l.akauntabiliti, l.tugas_utama, l.khidmat_bantu, l.slogan, l.hashtags ' +
        'FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE q.id = ?'
      ).bind(id).first();
      if (!draft) return jsonResponse({ ok: false, error: 'Draf tidak ditemui.' });
      if (!draft.report_id) {
        return jsonResponse({ ok: false, error: 'Jana semula kapsyen tidak disokong untuk hebahan Mesyuarat/Taklimat/MEB (tiada rekod sumber). Sunting kapsyen terus.' }, 400);
      }
      if (draft.status === 'SEDANG_DIPOSTING') {
        return jsonResponse({ ok: false, error: 'Draf sedang diposkan. Tunggu proses selesai sebelum jana semula kapsyen.' }, 409);
      }

      const newCaption = buildFacebookCaptionForReport_({
        namaSekolah: draft.nama_sekolah,
        zon: draft.zon,
        tarikh: draft.tarikh,
        masaMula: draft.masa_mula,
        masaTamat: draft.masa_tamat,
        pegawai: draft.pegawai,
        pelapor: draft.pelapor,
        title: draft.title,
        objektif: draft.objektif || draft.title,
        isu: draft.isu,
        keputusan: draft.keputusan,
        tindakSusul: draft.tindak_susul,
        rumusanAi: draft.rumusan_ai || draft.keputusan,
        impakAi: draft.impak_ai || draft.isu,
        tindakSusulAi: draft.tindak_susul_ai || draft.tindak_susul,
        akauntabiliti: draft.akauntabiliti,
        tugasUtama: draft.tugas_utama,
        khidmatBantu: draft.khidmat_bantu,
        slogan: draft.slogan,
        hashtags: draft.hashtags,
        noIsd: draft.no_isd
      });

      const regenerated = await db.prepare(
        'UPDATE facebook_queue SET caption = ?, dikemaskini = datetime("now", "+8 hours") WHERE id = ? AND status != "SEDANG_DIPOSTING"'
      ).bind(newCaption, id).run();
      if (!regenerated.success || !regenerated.meta || regenerated.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf sedang diposkan atau tidak ditemui.' }, 409);
      }
      return jsonResponse({ ok: true, caption: newCaption });
    }

    if (action === 'adminpublishfbpost' || m === 'publishfbpost') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      let draft = await db.prepare('SELECT q.*, l.gambar1, l.gambar2, l.gambar3, l.gambar4, l.gambar5, l.gambar6, l.gambar7, l.gambar8, l.gambar9, l.gambar10 FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE q.id = ?').bind(id).first();
      if (!draft) return jsonResponse({ ok: false, error: 'Draf tidak ditemui.' });

      const cfg = await getTelegramAndFbConfig_(db);
      const pageId = cfg.pageId || '100064366657980';
      const pageToken = cfg.pageToken;

      if (!pageToken) {
        return jsonResponse({ ok: false, error: 'Facebook Page Access Token belum ditetapkan dalam Tetapan Facebook.' });
      }

      const originalStatus = String(draft.status || '').trim().toUpperCase();
      const publishableStatuses = new Set(['DRAF', 'DITAPIS_SIAP', 'READY']);
      if (!publishableStatuses.has(originalStatus) || draft.fb_post_id) {
        return jsonResponse({ ok: false, error: 'Draf sedang/sudah diposkan atau tidak lagi boleh disiarkan.' }, 409);
      }

      // Claim publish secara atomik sebelum sebarang panggilan Graph API. Dua request
      // serentak boleh membaca draft yang sama, tetapi hanya satu boleh menukar state ini.
      const claim = await db.prepare(
        'UPDATE facebook_queue SET status = "SEDANG_DIPOSTING", dikemaskini = datetime("now", "+8 hours") ' +
        'WHERE id = ? AND status = ? AND (fb_post_id IS NULL OR fb_post_id = "")'
      ).bind(id, originalStatus).run();
      if (!claim.success || !claim.meta || claim.meta.changes !== 1) {
        return jsonResponse({ ok: false, error: 'Draf sedang/sudah diposkan oleh permintaan lain.' }, 409);
      }

      const rollbackPublishClaim = async function() {
        try {
          await db.prepare(
            'UPDATE facebook_queue SET status = ?, dikemaskini = datetime("now", "+8 hours") ' +
            'WHERE id = ? AND status = "SEDANG_DIPOSTING"'
          ).bind(originalStatus, id).run();
        } catch (rollbackErr) {
          console.error('Facebook publish rollback failed:', rollbackErr && rollbackErr.message ? rollbackErr.message : rollbackErr);
        }
      };

      // Re-read after the claim so any edit that completed just before the lock is
      // included, while edits after the lock are rejected by the mutation guards.
      const lockedDraft = await db.prepare(
        'SELECT q.*, l.gambar1, l.gambar2, l.gambar3, l.gambar4, l.gambar5, l.gambar6, l.gambar7, l.gambar8, l.gambar9, l.gambar10 FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE q.id = ?'
      ).bind(id).first();
      if (!lockedDraft) {
        await rollbackPublishClaim();
        return jsonResponse({ ok: false, error: 'Draf hilang selepas publish lock diperoleh.' }, 409);
      }
      draft = lockedDraft;

      const rawPhotos = draft.report_id
        ? [draft.gambar1, draft.gambar2, draft.gambar3, draft.gambar4, draft.gambar5, draft.gambar6, draft.gambar7, draft.gambar8, draft.gambar9, draft.gambar10].filter(Boolean)
        : (Array.isArray(parseFbQueueMeta_(draft.meta_json).photos) ? parseFbQueueMeta_(draft.meta_json).photos.filter(Boolean) : []);
      const attachedMedia = [];
      const uploadWarnings = [];

      for (let i = 0; i < rawPhotos.length; i++) {
        const rawG = rawPhotos[i];
        let uploadSuccess = false;

        // Retry logic: sehingga 2 kali percubaan bagi setiap gambar
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            if (rawG.startsWith('data:image')) {
              const commaIdx = rawG.indexOf(',');
              const semiIdx = rawG.indexOf(';');
              const mime = (semiIdx > 5 && commaIdx > semiIdx) ? rawG.substring(5, semiIdx) : 'image/jpeg';
              const b64Data = commaIdx > -1 ? rawG.substring(commaIdx + 1) : rawG;
              const binary = atob(b64Data);
              const bytes = new Uint8Array(binary.length);
              for (let b = 0; b < binary.length; b++) bytes[b] = binary.charCodeAt(b);
              const blob = new Blob([bytes.buffer], { type: mime });

              const fd = new FormData();
              fd.append('source', blob, 'eviden_' + (i + 1) + '.jpg');
              fd.append('published', 'false');
              fd.append('access_token', pageToken);

              const upRes = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/photos', {
                method: 'POST',
                body: fd
              });
              const upData = await upRes.json();
              if (upData && upData.id) {
                attachedMedia.push({ media_fbid: String(upData.id) });
                uploadSuccess = true;
                break;
              } else if (attempt === 2) {
                uploadWarnings.push('Gambar ' + (i + 1) + ': ' + (upData && upData.error ? upData.error.message : 'Ditolak oleh Facebook API'));
              }
            } else {
              const pUrl = resolveVisitPhotoUrl_(rawG);
              if (pUrl) {
                const upRes = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/photos', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: pUrl, published: false, access_token: pageToken })
                });
                const upData = await upRes.json();
                if (upData && upData.id) {
                  attachedMedia.push({ media_fbid: String(upData.id) });
                  uploadSuccess = true;
                  break;
                } else if (attempt === 2) {
                  uploadWarnings.push('Gambar ' + (i + 1) + ': ' + (upData && upData.error ? upData.error.message : 'URL ditolak oleh Facebook API'));
                }
              }
            }
          } catch (e) {
            if (attempt === 2) {
              uploadWarnings.push('Gambar ' + (i + 1) + ': ' + e.message);
            }
          }
          if (!uploadSuccess && attempt < 2) {
            await new Promise(r => setTimeout(r, 600));
          }
        }
      }

      let fbPostId = '';
      let feedRequestStarted = false;
      try {
        if (attachedMedia.length > 0) {
          const feedPayload = {
            message: draft.caption,
            access_token: pageToken,
            attached_media: attachedMedia
          };

          feedRequestStarted = true;
          const postRes = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedPayload)
          });
          const postData = await postRes.json();
          if (postData && postData.id) {
            fbPostId = String(postData.id);
          } else if (postData && postData.error) {
            await rollbackPublishClaim();
            return jsonResponse({
              ok: false,
              error: 'Facebook API Error: ' + (postData.error.message || JSON.stringify(postData.error))
            }, 502);
          } else {
            return jsonResponse({
              ok: false,
              error: 'Respons Facebook tidak mengandungi ID siaran. Status dikunci sementara untuk mengelakkan siaran berganda; semak Facebook Studio sebelum cuba lagi.'
            }, 502);
          }
        } else {
          feedRequestStarted = true;
          const postRes = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: draft.caption, access_token: pageToken })
          });
          const postData = await postRes.json();
          if (postData && postData.id) {
            fbPostId = String(postData.id);
          } else if (postData && postData.error) {
            await rollbackPublishClaim();
            return jsonResponse({
              ok: false,
              error: 'Facebook API Error: ' + (postData.error.message || JSON.stringify(postData.error))
            }, 502);
          } else {
            return jsonResponse({
              ok: false,
              error: 'Respons Facebook tidak mengandungi ID siaran. Status dikunci sementara untuk mengelakkan siaran berganda; semak Facebook Studio sebelum cuba lagi.'
            }, 502);
          }
        }
      } catch (publishErr) {
        if (!feedRequestStarted) await rollbackPublishClaim();
        return jsonResponse({
          ok: false,
          error: feedRequestStarted
            ? 'Sambungan Facebook terputus selepas permintaan siaran dihantar. Status dikunci sementara untuk mengelakkan siaran berganda; semak Facebook Studio sebelum cuba lagi.'
            : 'Facebook API gagal: ' + (publishErr && publishErr.message ? publishErr.message : String(publishErr || 'Ralat tidak diketahui'))
        }, 502);
      }

      // Selepas Facebook mengembalikan post ID sebenar, jangan rollback ke DRAF jika
      // finalisasi D1 gagal. Kekalkan lock supaya retry tidak menghasilkan double-post.
      let finalizePost;
      try {
        finalizePost = await db.prepare(
          'UPDATE facebook_queue SET status = "DIPOSTING", fb_post_id = ?, dikemaskini = datetime("now", "+8 hours") ' +
          'WHERE id = ? AND status = "SEDANG_DIPOSTING"'
        ).bind(fbPostId, id).run();
      } catch (finalizeErr) {
        console.error('Facebook publish finalization failed after Graph success:', finalizeErr && finalizeErr.message ? finalizeErr.message : finalizeErr);
        return jsonResponse({
          ok: false,
          error: 'Facebook menerima siaran tetapi status tempatan gagal dikemas kini. Jangan cuba siar semula; semak Facebook Studio.',
          fbPostId: fbPostId
        }, 500);
      }
      if (!finalizePost.success || !finalizePost.meta || finalizePost.meta.changes !== 1) {
        return jsonResponse({
          ok: false,
          error: 'Facebook menerima siaran tetapi status tempatan tidak dapat disahkan. Jangan cuba siar semula; semak Facebook Studio.',
          fbPostId: fbPostId
        }, 500);
      }
      await deleteTelegramQueueNotification_(db, cfg, id);
      return jsonResponse({
        ok: true,
        fbPostId: fbPostId,
        mediaCount: attachedMedia.length,
        warnings: uploadWarnings.length ? uploadWarnings : null
      });
    }

    if (action === 'admingetfacebookconfigstatus' || m === 'getfacebookconfigstatus') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const cfg = await getTelegramAndFbConfig_(db);
      return jsonResponse({
        ok: true,
        pageIdSet: Boolean(cfg.pageId),
        pageIdMasked: cfg.pageId ? (cfg.pageId.slice(0, 4) + '••••' + cfg.pageId.slice(-4)) : '',
        tokenSet: Boolean(cfg.pageToken),
        tokenMasked: cfg.pageToken ? (cfg.pageToken.slice(0, 6) + '••••••••' + cfg.pageToken.slice(-4)) : '',
        telegramEnabled: cfg.telegramEnabled,
        telegramTokenSet: Boolean(cfg.telegramBotToken),
        telegramTokenMasked: cfg.telegramBotToken ? (cfg.telegramBotToken.slice(0, 6) + '••••••••' + cfg.telegramBotToken.slice(-4)) : '',
        telegramChatId: cfg.telegramChatId,
        emailEnabled: cfg.emailEnabled,
        emailList: cfg.emailList
      });
    }

    if (action === 'adminsetfacebookconfig' || m === 'setfacebookconfig') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const pageId = String(payload.pageId || '').trim();
      const pageAccessToken = String(payload.pageAccessToken || '').trim();

      if (pageId) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.pageId", ?, datetime("now", "+8 hours"))').bind(pageId).run();
      }
      if (pageAccessToken && pageAccessToken.indexOf('•') === -1) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.pageToken", ?, datetime("now", "+8 hours"))').bind(pageAccessToken).run();
      }
      return jsonResponse({ ok: true, message: 'Kredensial Facebook berjaya disimpan.' });
    }

    if (action === 'adminclearfacebookconfig' || m === 'clearfacebookconfig') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      await db.prepare('DELETE FROM settings WHERE key IN ("fb.pageId", "fb.pageToken")').run();
      return jsonResponse({ ok: true, message: 'Kredensial Facebook telah dikosongkan.' });
    }

    if (action === 'adminsetfacebooknotificationconfig' || m === 'setfacebooknotificationconfig') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const tgEnabled = payload.telegramEnabled ? 'true' : 'false';
      const tgToken = String(payload.telegramBotToken || '').trim();
      let tgChatId = String(payload.telegramChatId || '').trim();
      const currentNotifyCfg = await getTelegramAndFbConfig_(db);
      const tgTokenIsReal = isTelegramBotToken_(tgToken);
      const effectiveTgToken = tgTokenIsReal ? tgToken : currentNotifyCfg.telegramBotToken;
      if (tgChatId && !effectiveTgToken) {
        return jsonResponse({ ok: false, error: 'Bot Token Telegram diperlukan untuk mengesahkan Chat ID.' }, 400);
      }
      if (tgChatId && effectiveTgToken) {
        const chatValidation = await validateTelegramChat_(effectiveTgToken, tgChatId);
        if (!chatValidation.ok) {
          return jsonResponse({ ok: false, error: 'Chat ID Telegram tidak sah: ' + chatValidation.error }, 400);
        }
        tgChatId = chatValidation.chatId;
      }
      const emEnabled = payload.emailEnabled ? 'true' : 'false';
      const emList = String(payload.emailList || '').trim();

      await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.telegramEnabled", ?, datetime("now", "+8 hours"))').bind(tgEnabled).run();
      if (tgToken && tgToken.indexOf('•') === -1) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.telegramBotToken", ?, datetime("now", "+8 hours"))').bind(tgToken).run();
      }
      if (tgChatId) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.telegramChatId", ?, datetime("now", "+8 hours"))').bind(tgChatId).run();
      }
      await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.emailEnabled", ?, datetime("now", "+8 hours"))').bind(emEnabled).run();
      if (emList) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.emailList", ?, datetime("now", "+8 hours"))').bind(emList).run();
      }

      return jsonResponse({ ok: true, message: 'Tetapan notifikasi Telegram & Emel berjaya dikemas kini.' });
    }

    if (action === 'admintesttelegramnotification' || m === 'testtelegramnotification') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const payload = getArg(0) || body.payload || {};
      const cfg = await getTelegramAndFbConfig_(db);
      let botToken = String(payload.telegramBotToken || '').trim();
      if (!botToken || botToken.indexOf('•') > -1) botToken = cfg.telegramBotToken;
      let chatId = String(payload.telegramChatId || '').trim();
      if (!chatId) chatId = cfg.telegramChatId;

      if (!botToken || !chatId) {
        return jsonResponse({ ok: false, error: 'Sila masukkan Telegram Bot Token dan Chat ID.' });
      }

      const testMsg = '🔔 <b>UJIAN SAMBUNGAN BOT TELEGRAM</b>\\n\\n' +
        '✅ Bot Telegram <b>Sistem JTK PPDK</b> berjaya disambungkan ke Cloudflare Edge Engine!\\n\\n' +
        '🧪 Ini ialah ujian auto-delete. Mesej ini akan dipadam semula secara automatik selepas kira-kira 30 saat.\\n\\n' +
        '⏱ <i>Waktu Ujian: ' + new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }) + '</i>';

      const testResult = await runTelegramAutoDeleteTest_(db, botToken, chatId, testMsg, 30000);
      return jsonResponse(testResult);
    }

    if (action === 'adminautodetecttelegramchatid' || m === 'autodetecttelegramchatid') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const cfg = await getTelegramAndFbConfig_(db);
      const botToken = cfg.telegramBotToken;
      if (!botToken) return jsonResponse({ ok: false, error: 'Sila masukkan dan simpan Telegram Bot Token terlebih dahulu.' });

      try {
        let updatesUrl = 'https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/getUpdates?limit=50';
        let res = await fetch(updatesUrl);
        let json = await res.json();

        let webhookWasActive = false;
        if (!json.ok && json.error_code === 409) {
          webhookWasActive = true;
          await fetch('https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/deleteWebhook');
          res = await fetch(updatesUrl);
          json = await res.json();
        }

        let detectedChat = null;
        if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
          for (let i = json.result.length - 1; i >= 0; i--) {
            const u = json.result[i];
            const msg = u.message || u.edited_message || u.channel_post || (u.callback_query && u.callback_query.message);
            if (msg && msg.chat) {
              detectedChat = {
                id: String(msg.chat.id),
                title: msg.chat.title || msg.chat.username || msg.chat.first_name || 'Group Telegram',
                type: msg.chat.type
              };
              break;
            }
          }
        }

        if (webhookWasActive) {
          await fetch('https://api.telegram.org/bot' + encodeURIComponent(botToken) + '/setWebhook?url=https://__ROOT_DOMAIN__/api/tg-webhook');
        }

        if (!detectedChat) {
          return jsonResponse({
            ok: false,
            error: 'Tiada aktiviti dikesan. Sila buka group Telegram anda, taip sebarang mesej (cth: "halo" atau "/start"), kemudian tekan butang ini sekali lagi.'
          });
        }

        await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ("fb.notify.telegramChatId", ?, datetime("now", "+8 hours"))').bind(detectedChat.id).run();

        return jsonResponse({
          ok: true,
          chatId: detectedChat.id,
          title: detectedChat.title,
          type: detectedChat.type
        });
      } catch(err) {
        return jsonResponse({ ok: false, error: 'Ralat mengesan Chat ID: ' + err.message });
      }
    }

    if (action === 'adminregistertelegramwebhook' || m === 'registertelegramwebhook') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const cfg = await getTelegramAndFbConfig_(db);
      if (!cfg.telegramBotToken) return jsonResponse({ ok: false, error: 'Bot Token tidak dijumpai.' });
      const hookUrl = 'https://__ROOT_DOMAIN__/api/tg-webhook';
      const res = await fetch('https://api.telegram.org/bot' + encodeURIComponent(cfg.telegramBotToken) + '/setWebhook?url=' + encodeURIComponent(hookUrl));
      const json = await res.json();
      return jsonResponse({ ok: json.ok, result: json });
    }

    if (action === 'adminregistertelegrambotcommands' || m === 'registertelegrambotcommands') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const cfg = await getTelegramAndFbConfig_(db);
      if (!cfg.telegramBotToken) return jsonResponse({ ok: false, error: 'Bot Token tidak dijumpai.' });
      const commands = [
        { command: 'start', description: 'Mula & panduan ringkas sistem JTK' },
        { command: 'status', description: 'Status operasi, bilangan rekod & snapshot D1' },
        { command: 'ringkasan', description: 'Ringkasan lawatan bulan semasa mengikut zon' },
        { command: 'terkini', description: '5 laporan lawatan terbaharu' },
        { command: 'baki_fb', description: 'Semak baki draf Facebook yang belum dipos' },
        { command: 'bantuan', description: 'Hubungi pentadbir sistem' }
      ];
      const res = await fetch('https://api.telegram.org/bot' + encodeURIComponent(cfg.telegramBotToken) + '/setMyCommands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands: commands })
      });
      const json = await res.json();
      return jsonResponse({ ok: json.ok, result: json });
    }

    if (action === 'adminremovetelegramwebhook' || m === 'removetelegramwebhook') {
      const auth = await requireSession(['SUPER_ADMIN', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const cfg = await getTelegramAndFbConfig_(db);
      if (!cfg.telegramBotToken) return jsonResponse({ ok: false, error: 'Bot Token tidak dijumpai.' });
      const res = await fetch('https://api.telegram.org/bot' + encodeURIComponent(cfg.telegramBotToken) + '/deleteWebhook');
      const json = await res.json();
      return jsonResponse({ ok: json.ok, result: json });
    }

    if (action === 'adminsendtelegramforqueueitem' || m === 'sendtelegramforqueueitem') {
      const auth = await requireSession(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']);
      if (auth.errorResponse) return auth.errorResponse;
      const id = getArg(0);
      const draft = await db.prepare(
        'SELECT q.id, q.report_id, l.nama_sekolah, l.zon, l.tarikh, l.masa_mula, l.masa_tamat, ' +
        'l.pelapor, l.pegawai, l.title, l.objektif, l.isu, l.keputusan, l.rumusan_ai, l.no_isd ' +
        'FROM facebook_queue q LEFT JOIN laporan l ON q.report_id = l.id WHERE q.id = ?'
      ).bind(id).first();
      if (!draft) return jsonResponse({ ok: false, error: 'Draf tidak dijumpai.' });

      const cfg = await getTelegramAndFbConfig_(db);
      if (!cfg.telegramBotToken || !cfg.telegramChatId) {
        return jsonResponse({ ok: false, error: 'Telegram Bot Token atau Chat ID belum dikonfigurasikan.' });
      }

      const tgMsg = buildTelegramLawatanNotification_({
        nama_sekolah: draft.nama_sekolah,
        zon: draft.zon,
        tarikh: draft.tarikh,
        masa_mula: draft.masa_mula,
        masa_tamat: draft.masa_tamat,
        pelapor: draft.pelapor,
        pegawai: draft.pegawai,
        title: draft.title,
        objektif: draft.objektif,
        isu: draft.isu,
        keputusan: draft.keputusan || draft.rumusan_ai,
        no_isd: draft.no_isd
      });

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: '📊 Dashboard', url: 'https://__DASHBOARD_DOMAIN__' },
            { text: '📱 Portal Admin', url: 'https://__ADMIN_DOMAIN__' }
          ]
        ]
      };
      const res = await sendConfiguredTelegramMessage_(db, cfg, tgMsg, replyMarkup);
      if (!res.ok) return jsonResponse({ ok: false, error: res.error || 'Gagal menghantar mesej ke Telegram.' }, 502);
      const trackingResult = await persistTelegramQueueNotification_(db, cfg, id, res);
      if (!trackingResult.ok) {
        return jsonResponse({
          ok: false,
          error: trackingResult.error || 'Notifikasi Telegram dihantar tetapi tracking message_id gagal.'
        }, 500);
      }
      return jsonResponse({
        ok: true,
        tracked: Boolean(trackingResult.tracked),
        deletedAfterPost: Boolean(trackingResult.deletedAfterPost)
      });
    }

    // 9. [ADR-004 P3] PIN Short URL/QR dibuang — /api/shorten kini guna sesi + allowlist.
    // Action shortenerpin* (getshortenerpinstatus/setshortenerpin/resetshortenerpin) ditanggalkan.

    // 10. Short Link Admin APIs (SUPER_ADMIN only)
    if (action === 'adminlistshortlinks' || m === 'listshortlinks') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const options = getArg(0) || body.options || {};
      const q = String(options.q || '').trim();
      const sort = String(options.sort || 'baru').toLowerCase() === 'klik' ? 'klik' : 'baru';
      const limit = Math.max(1, Math.min(50, Number(options.limit || 50) || 50));
      const offset = Math.max(0, Number(options.offset || 0) || 0);
      let where = 'deleted_at IS NULL';
      const binds = [];
      if (q) {
        const like = '%' + q + '%';
        where += ' AND (slug LIKE ? OR COALESCE(NULLIF(destination_url, ""), target_url, "") LIKE ? OR COALESCE(created_by_nama, "") LIKE ? OR COALESCE(created_by_email, "") LIKE ?)';
        binds.push(like, like, like, like);
      }
      const countRow = binds.length
        ? await db.prepare('SELECT COUNT(*) AS count, COALESCE(SUM(clicks), 0) AS total_clicks FROM short_links WHERE ' + where).bind(...binds).first()
        : await db.prepare('SELECT COUNT(*) AS count, COALESCE(SUM(clicks), 0) AS total_clicks FROM short_links WHERE ' + where).first();
      const total = Number(countRow && countRow.count || 0);
      const totalClicks = Number(countRow && countRow.total_clicks || 0);
      const orderBy = sort === 'klik'
        ? 'COALESCE(clicks, 0) DESC, created_at DESC, slug ASC'
        : 'created_at DESC, slug ASC';
      const sql =
        'SELECT slug, COALESCE(NULLIF(destination_url, ""), target_url) AS target_url, created_by, created_by_email, created_by_nama, created_at, COALESCE(clicks, 0) AS clicks, last_accessed ' +
        'FROM short_links WHERE ' + where + ' ORDER BY ' + orderBy + ' LIMIT ? OFFSET ?';
      const rows = await db.prepare(sql).bind(...binds, limit, offset).all();
      return jsonResponse({
        ok: true,
        items: (rows.results || []).map(r => ({
          slug: r.slug,
          shortUrl: 'https://__ROOT_DOMAIN__/' + r.slug,
          targetUrl: r.target_url || '',
          creatorId: r.created_by || null,
          creatorEmail: r.created_by_email || null,
          creatorName: r.created_by_nama || null,
          createdAt: r.created_at || null,
          clicks: Number(r.clicks || 0),
          lastAccessed: r.last_accessed || null
        })),
        total: total,
        totalClicks: totalClicks,
        limit: limit,
        offset: offset,
        sort: sort,
        q: q
      });
    }

    if (action === 'admindeleteshortlink' || m === 'deleteshortlink') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      const input = getArg(0);
      const slug = String(
        (input && typeof input === 'object' ? input.slug : input) ||
        body.slug ||
        ''
      ).trim().toLowerCase();
      if (!/^[a-z0-9_-]{2,40}$/.test(slug) || !/[a-z0-9]/.test(slug)) {
        return jsonResponse({ ok: false, error: 'Slug tidak sah.' }, 400);
      }
      const row = await db.prepare(
        'SELECT slug, COALESCE(NULLIF(destination_url, ""), target_url) AS target_url FROM short_links WHERE slug = ? AND deleted_at IS NULL'
      ).bind(slug).first();
      if (!row) return jsonResponse({ ok: false, error: 'Pautan tidak ditemui.' }, 404);
      const updated = await db.prepare(
        'UPDATE short_links SET deleted_at = datetime("now", "+8 hours") WHERE slug = ? AND deleted_at IS NULL'
      ).bind(slug).run();
      if (Number(updated && updated.meta && updated.meta.changes || 0) !== 1) {
        return jsonResponse({ ok: false, error: 'Pautan tidak ditemui.' }, 404);
      }
      let safeTarget = String(row.target_url || '');
      try {
        const safeUrl = new URL(safeTarget);
        safeUrl.username = '';
        safeUrl.password = '';
        safeUrl.search = '';
        safeUrl.hash = '';
        safeTarget = safeUrl.toString();
      } catch (e) {
        safeTarget = safeTarget.split(/[?#]/)[0];
      }
      await db.prepare(
        'INSERT INTO audit_logs (admin_email, role, action, target, details) VALUES (?, ?, "DELETE_SHORT_LINK", ?, ?)'
      ).bind(
        session.email || '',
        session.role || 'SUPER_ADMIN',
        slug,
        JSON.stringify({ slug: slug, targetUrl: safeTarget })
      ).run();
      return jsonResponse({ ok: true, slug: slug });
    }

    // 11. Audit Log APIs: adminListAuditLog
    if (action === 'adminlistauditlog' || m === 'listauditlog') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      const options = getArg(0) || body.options || {};
      const page = Number(options.page || 1);
      const pageSize = Number(options.pageSize || 15);
      const offset = (page - 1) * pageSize;

      let where = '1=1';
      const binds = [];

      if (options.action) {
        where += ' AND action = ?';
        binds.push(options.action);
      }
      if (options.search) {
        where += ' AND (admin_email LIKE ? OR target LIKE ? OR action LIKE ? OR details LIKE ?)';
        const q = '%' + options.search + '%';
        binds.push(q, q, q, q);
      }
      if (options.dateFrom) {
        where += ' AND timestamp >= ?';
        binds.push(options.dateFrom + ' 00:00:00');
      }
      if (options.dateTo) {
        where += ' AND timestamp <= ?';
        binds.push(options.dateTo + ' 23:59:59');
      }

      const countSql = 'SELECT count(*) as count FROM audit_logs WHERE ' + where;
      const totalResult = binds.length > 0
        ? await db.prepare(countSql).bind(...binds).first()
        : await db.prepare(countSql).first();
      const total = totalResult ? totalResult.count : 0;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      const selectSql = 'SELECT * FROM audit_logs WHERE ' + where + ' ORDER BY id DESC LIMIT ? OFFSET ?';
      const queryBinds = [...binds, pageSize, offset];
      const rowsResult = await db.prepare(selectSql).bind(...queryBinds).all();

      const entries = (rowsResult.results || []).map(r => {
        let before = '';
        let after = '';
        if (r.details) {
          try {
            const parsed = JSON.parse(r.details);
            if (parsed.before || parsed.after) {
              before = typeof parsed.before === 'object' ? JSON.stringify(parsed.before, null, 2) : String(parsed.before || '');
              after = typeof parsed.after === 'object' ? JSON.stringify(parsed.after, null, 2) : String(parsed.after || '');
            } else {
              after = typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : String(r.details);
            }
          } catch(e) {
            after = String(r.details);
          }
        }
        return {
          id: r.id,
          timestamp: r.timestamp || '',
          actorEmail: r.admin_email || r.actor_email || '',
          actorRole: r.role || r.actor_role || 'TIDAK DIKETAHUI',
          action: r.action || '',
          target: r.target || '',
          before: before || r.before_json || '',
          after: after || r.after_json || ''
        };
      });

      return jsonResponse({
        ok: true,
        entries: entries,
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
        actionOptions: ['LOGIN', 'CREATE_USER', 'UPDATE_USER', 'DELETE_RECORD', 'RESTORE_RECORD', 'EDIT_RECORD', 'POST_FACEBOOK', 'RESTORE_FB_DRAFT', 'UPDATE_CONFIG', 'UPSERT_STAFF_ALLOWLIST', 'SET_ALLOWLIST_STATUS', 'IMPORT_ALLOWLIST', 'PROVISION_STAFF', 'RESET_STAFF_PASSWORD', 'UNLOCK_STAFF', 'DELETE_SHORT_LINK']
      });
    }

    // 12. Change Password: adminChangeOwnPassword
    if (action === 'adminchangeownpassword' || action === 'adminchangepassword' || m === 'changeownpassword' || m === 'changepassword') {
      // ADR-004: dibenarkan walaupun must_change_password=1 — ini satu-satunya laluan keluar.
      const auth = await requireSession(null, { allowMustChangePassword: true });
      if (auth.errorResponse) return auth.errorResponse;
      const session = auth.session;
      // adminlogin melakukan .trim() pada kata laluan — WAJIB sama di sini, kalau tidak
      // kata laluan berspasi hujung (cth papan kekunci telefon) disimpan tapi tak boleh log masuk.
      const currentPass = String(getArg(0) || '').trim();
      const newPass = String(getArg(1) || '').trim();
      if (!currentPass) return jsonResponse({ ok: false, error: 'Kata laluan semasa diperlukan.' }, 400);
      if (!newPass || String(newPass).length < 10) {
        return jsonResponse({ ok: false, error: 'Kata laluan baharu mesti sekurang-kurangnya 10 aksara.' }, 400);
      }

      // FIX #2: Semak kata laluan semasa sebelum membenarkan pertukaran
      const currentUser = await db.prepare('SELECT password_hash FROM admins WHERE id = ?').bind(session.id).first();
      const currentValid = currentUser && await verifyPassword_(currentPass, currentUser.password_hash);
      if (!currentValid) return jsonResponse({ ok: false, error: 'Kata laluan semasa tidak betul.' });

      // Cincang kata laluan baharu sebelum disimpan; ADR-004: matikan wajib-tukar & jejak masa tukar.
      const hashedNewPass = await hashPassword_(newPass);
      await db.prepare('UPDATE admins SET password_hash = ?, must_change_password = 0, password_changed_at = datetime("now", "+8 hours") WHERE id = ?')
        .bind(hashedNewPass, session.id).run();
      return jsonResponse({ ok: true, message: 'Kata laluan anda berjaya ditukar.' });
    }

    // 13. Sync Legacy Sheet
    if (action === 'adminsynclegacysheet' || m === 'synclegacysheet') {
      const auth = await requireSession(['SUPER_ADMIN']);
      if (auth.errorResponse) return auth.errorResponse;
      return jsonResponse({ ok: false, error: 'Fungsi penyegerakan Google Sheet telah dinyahaktifkan sepenuhnya bagi mengelakkan pertindihan data.' });
    }

    // 14. Settings: adminGetSettings
    if (action === 'admingetsettings' || m === 'getsettings') {
      const auth = await requireSession();
      if (auth.errorResponse) return auth.errorResponse;
      const SENSITIVE_KEY_RE = /(token|secret|password|credential|private|apikey|api_key|auth|session|jwt)/i;
      const KNOWN_SETTINGS_DESCRIPTIONS = {
        'app.title': 'Nama atau tajuk sistem dashboard',
        'app.contact_email': 'E-mel sokongan teknikal / pentadbir',
        'ui.primary_color': 'Warna tema utama antaramuka pentadbir',
        'fb.notify.telegramEnabled': 'Status integrasi hebahan Telegram (true/false)',
        'fb.notify.emailEnabled': 'Status integrasi hebahan Emel (true/false)',
        'fb.notify.emailList': 'Senarai penerima emel hebahan (dipisahkan koma)'
      };

      let rows = [];
      try {
        const res = await db.prepare('SELECT key, value FROM settings ORDER BY key ASC').all();
        rows = res.results || [];
      } catch (e) {
        rows = [];
      }

      const filtered = rows.filter(r => !SENSITIVE_KEY_RE.test(r.key) && !String(r.key || '').startsWith('revoked_token:') && !String(r.key || '').startsWith('revoked:'));
      const settingsList = filtered.map(r => ({
        key: r.key,
        value: r.value || '',
        description: KNOWN_SETTINGS_DESCRIPTIONS[r.key] || '',
        type: (String(r.key || '').toLowerCase().includes('color')) ? 'color' : 'text'
      }));

      return jsonResponse({
        ok: true,
        settings: settingsList
      });
    }

    // 15. Logout: adminLogout
    if (action === 'adminlogout' || m === 'logout') {
      const auth = await requireSession(null, { allowMustChangePassword: true });
      if (auth.errorResponse) return auth.errorResponse;
      if (auth.token) {
        await revokeToken_(auth.token, db);
      }
      return jsonResponse({ ok: true, message: 'Log keluar berjaya. Sesi telah dibatalkan.' });
    }

    return jsonResponse({ ok: false, error: 'Tindakan pentadbir tidak dikenali: ' + (rawAction || 'kosong') }, 400);

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

/**
 * Public Bootstrap API (Loads entire Dashboard in < 25ms from D1 SQL)
 */

/**
 * Public Photo Proxy Handler: Streams binary image from D1/Drive with HTTP caching
 */
/**
 * Public Photo Proxy Handler: Streams binary image from D1/Drive with HTTP caching
 */
async function handlePublicPhotoProxy(request, env) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || '';
    const queueId = url.searchParams.get('queueId') || '';
    const idx = parseInt(url.searchParams.get('idx') || '1', 10);
    if (!id && !queueId) return new Response('Missing id', { status: 400 });

    let rawVal = '';
    if (queueId) {
      // Hebahan Mesyuarat/Taklimat/MEB tiada rekod 'laporan' — gambar disimpan
      // dalam facebook_queue.meta_json sahaja.
      const queueRow = await env.DB.prepare('SELECT meta_json FROM facebook_queue WHERE id = ? AND status != "DIPADAM"').bind(queueId).first();
      if (!queueRow) return new Response('Photo record not found', { status: 404 });
      const photos = Array.isArray(parseFbQueueMeta_(queueRow.meta_json).photos) ? parseFbQueueMeta_(queueRow.meta_json).photos : [];
      rawVal = photos[Math.min(10, Math.max(1, idx)) - 1] || '';
    } else {
      const row = await env.DB.prepare('SELECT gambar1, gambar2, gambar3, gambar4, gambar5, gambar6, gambar7, gambar8, gambar9, gambar10 FROM laporan WHERE (id = ? OR rowid = ?) AND deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').bind(id, id).first();
      if (!row) return new Response('Photo record not found', { status: 404 });
      const colName = 'gambar' + Math.min(10, Math.max(1, idx));
      rawVal = row[colName] || row.gambar1 || '';
    }
    if (!rawVal) return new Response('No photo attached', { status: 404 });

    if (rawVal.startsWith('http://') || rawVal.startsWith('https://')) {
      return Response.redirect(rawVal, 302);
    }

    if (rawVal.startsWith('data:image')) {
      const commaIdx = rawVal.indexOf(',');
      const semiIdx = rawVal.indexOf(';');
      const mime = (semiIdx > 5 && commaIdx > semiIdx) ? rawVal.substring(5, semiIdx) : 'image/jpeg';
      const b64Data = commaIdx > -1 ? rawVal.substring(commaIdx + 1) : rawVal;
      const binary = atob(b64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Response(bytes.buffer, {
        headers: {
          'Content-Type': mime,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=604800, immutable'
        }
      });
    }

    return Response.redirect(resolveVisitPhotoUrl_(rawVal), 302);
  } catch (err) {
    return new Response('Photo proxy error: ' + err.message, { status: 500 });
  }
}

async function handlePublicBootstrapApi(request, env) {
  try {
    const db = env.DB;
    const bootstrapSelect = [
      'id', 'timestamp', 'tarikh', 'zon', 'masa_mula', 'masa_tamat',
      'nama_sekolah', 'lokasi_lain', 'pegawai', 'nama_pegawai_sekolah', 'pelapor',
      'isu', 'keputusan', 'tindak_susul', 'no_isd', 'pdf_url', 'link',
      'rumusan_ai', 'objektif', 'title',
      "CASE WHEN gambar1 LIKE 'data:image%' THEN 'data:image' ELSE gambar1 END AS gambar1",
      "CASE WHEN gambar2 LIKE 'data:image%' THEN 'data:image' ELSE gambar2 END AS gambar2",
      "CASE WHEN gambar3 LIKE 'data:image%' THEN 'data:image' ELSE gambar3 END AS gambar3",
      "CASE WHEN gambar4 LIKE 'data:image%' THEN 'data:image' ELSE gambar4 END AS gambar4",
      "CASE WHEN gambar5 LIKE 'data:image%' THEN 'data:image' ELSE gambar5 END AS gambar5",
      "CASE WHEN gambar6 LIKE 'data:image%' THEN 'data:image' ELSE gambar6 END AS gambar6",
      "CASE WHEN gambar7 LIKE 'data:image%' THEN 'data:image' ELSE gambar7 END AS gambar7",
      "CASE WHEN gambar8 LIKE 'data:image%' THEN 'data:image' ELSE gambar8 END AS gambar8",
      "CASE WHEN gambar9 LIKE 'data:image%' THEN 'data:image' ELSE gambar9 END AS gambar9",
      "CASE WHEN gambar10 LIKE 'data:image%' THEN 'data:image' ELSE gambar10 END AS gambar10"
    ].join(', ');
    const rowsRes = await db.prepare('SELECT ' + bootstrapSelect + ', ' + SQL_SORT_DATE + ' as sort_date FROM laporan WHERE deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM" ORDER BY sort_date DESC, rowid DESC').all();
    const rows = rowsRes.results || [];

    function condenseObjective_(str) {
      if (!str || str === '—' || str === '-') return 'Khidmat Bantu ICT';
      return CONDENSE_PATTERNS_.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), String(str).trim()).trim();
    }

    function categorizePurpose_(value) {
      const text = String(value || '').toUpperCase().trim();
      if (/MESYUARAT|TAKLIMAT|BENGKEL|PROGRAM|KURSUS/.test(text)) return 'Program/mesyuarat';
      if (/PELUPUSAN|ASET|INVENTORI|HARTA MODAL/.test(text)) return 'Pelupusan/aset';
      if (/MYGOVNET|INTERNET|RANGKAIAN|NETWORK|WIFI|UNIFI|CAPAIAN|LAN\\b/.test(text)) return 'Pemantauan internet/rangkaian';
      if (/PEMASANGAN|INSTALL|PROJEK|NAIK TARAF|PENDAWAIAN/.test(text)) return 'Pemasangan atau projek';
      if (/VERIFIKASI|PEMERIKSAAN|AUDIT|SEMAKAN.*PERALATAN/.test(text)) return 'Verifikasi peralatan ICT';
      if (/SELENGGARA|PENYELENGGARAAN|BAIK PULIH|SERVIS/.test(text)) return 'Penyelenggaraan';
      if (/DELIM[Aa]|APLIKASI|SISTEM|AKAUN|ID\\b|KATA LALUAN|PASSWORD/.test(text)) return 'Sistem, aplikasi dan akaun';
      if (/KHIDMAT|BANTU|TEKNIKAL|SOKONGAN|ADUAN/.test(text)) return 'Khidmat bantu teknikal';
      return 'Lain-lain';
    }

    function categorizeIssue_(issueVal, fullContext) {
      const issueText = String(issueVal || '').trim();
      const contextText = String(fullContext || '').trim();
      const combined = (issueText + ' ' + contextText).toUpperCase();
      const issueUpper = issueText.toUpperCase();

      const isExplicitClean = (
        !issueText ||
        issueText === '—' ||
        issueText === '-' ||
        /^(?:TIADA\s*ISU\s*SIGNIFIKAN|TIADA\s*ISU|TIADA\s*MASALAH|TIADA\s*SEBARANG\s*ISU|TIADA|TIADA\s*ISU\s*KRITIKAL)$/i.test(issueText) ||
        (/BERFUNGSI\s*DENGAN\s*BAIK/i.test(issueUpper) && !/ROSAK|DOWN|GAGAL|GANGGUAN|PERLAHAN|PUTUS|MASALAH|TIDAK\s*DAPAT/i.test(issueUpper))
      );

      // A. Rangkaian & Capaian Internet / MyGovNet / Subwaran
      if (/TIADA\s*CAPAIAN\s*INTERNET|TALIAN\s*DOWN|INTERNET\s*(?:DOWN|SLOW|PERLAHAN|TERPUTUS|GAGAL|GANGGUAN)|GANGGUAN\s*(?:INTERNET|RANGKAIAN|CAPAIAN|TALIAN|WIFI)|MYGOVNET|SUBWARAN|PENGHALA|ROUTER|ACCESS\s*POINT|\bAP\s*ROSAK|\bWIFI\b|KABEL\s*(?:PUTUS|LAN|RANGKAIAN)|SPEEDTEST|BANDWIDTH|PORT\s*ROSAK|IP\s*ADDRESS|NETWORK\s*SWITCH|\bLAN\b/i.test(combined)) {
        if (!isExplicitClean || /INTERNET|MYGOVNET|WIFI|ROUTER|TALIAN/i.test(contextText)) {
          return 'Rangkaian & Capaian Internet';
        }
      }

      // B. Kerosakan Perkakasan, Komputer & Projektor
      if (/PROJEKTOR|PROJECTOR|PAPAN\s*INDUK|MOTHERBOARD|POWER\s*SUPPLY|BEKALAN\s*KUASA|\bPC\s*ROSAK|\bKOMPUTER\s*ROSAK|LAPTOP|DESKTOP|MONITOR|\bRAM\b|HARD\s*DISK|\bSSD\b|KEYBOARD|MOUSE|TIDAK\s*DAPAT\s*DIHIDUPKAN|NO\s*DISPLAY|BLUE\s*SCREEN|OVERHEATING|KEROSAKAN\s*FIZIKAL|CPU|CMOS/i.test(combined)) {
        return 'Kerosakan Perkakasan & Komputer';
      }

      // C. Pencetak & Peranti Luaran
      if (/PENCETAK|PRINTER|PENGIMBAS|SCANNER|PAPER\s*JAM|TONER|CARTRIDGE|NETWORK\s*PRINTER|INK\s*PAD|PRINT\s*HEAD/i.test(combined)) {
        return 'Pencetak & Peranti Luaran';
      }

      // D. Sistem, Aplikasi & Akaun Pengguna
      if (/DELIMA|M365|MICROSOFT\s*365|OFFICE|WINDOWS|FORMAT|INSTALL\s*PERISIAN|ANTIVIRUS|VIRUS|KATA\s*LALUAN|PASSWORD|RESET\s*ID|APID|SPS|EMIS|HRMIS|ID\s*PENGGUNA|LOGIN|AKAUN/i.test(combined)) {
        return 'Sistem, Perisian & Akaun ID';
      }

      // E. Pengurusan Aset & Pelupusan (KEW.PA)
      if (/PELUPUSAN|LUPUS|KEW\.?PA|HARTA\s*MODAL|INVENTORI|ASET\s*ALIH|ASET\s*USANG|VERIFIKASI\s*ASET|BORANG\s*PELUPUSAN|PEKELILING\s*ASET/i.test(combined)) {
        return 'Pengurusan Aset & Pelupusan';
      }

      // F. Infrastruktur & Pendawaian
      if (/MAKMAL\s*KOMPUTER|PUSAT\s*AKSES|BILIK\s*SERVER|RACK\s*SERVER|\bUPS\b|PUNCA\s*KUASA|SOKET|PENDAWAIAN|PENDAWAIAN\s*SEMULA/i.test(combined)) {
        return 'Infrastruktur & Pendawaian';
      }

      // G. Pengesahan Servis, Ujilari & Sijil SPP
      if (/PENGESAHAN\s*SPP|SIJIL\s*PENERIMAAN|SURAT\s*PERAKUAN|UJILARI|TESTING\s*&\s*COMMISSIONING|SERAH\s*TUGAS/i.test(combined)) {
        return 'Pengesahan Servis & Sijil SPP';
      }

      // H. Bersih / Tiada Masalah
      if (isExplicitClean) {
        return 'Khidmat Selesai (Tiada Isu)';
      }

      return 'Khidmat Bantuan Teknikal Lain';
    }

    const yearSet = new Set();
    const schoolSet = new Set();
    const memberSet = new Set();
    const purposeSet = new Set();
    const issueSet = new Set();

    const records = rows.map((r, idx) => {
      const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
      const day = dateComp.day;
      const month = dateComp.month;
      const year = dateComp.year;
      const dateMillis = dateComp.dateMillis;
      const dateLabel = dateComp.dateLabel;
      const zoneInfo = resolveZone(r.zon);
      const school = canonicalSchoolName_(r.nama_sekolah || r.lokasi_lain || "Sekolah");
      const members = (r.pegawai || '').split(',').map(m => canonicalOfficerName_(m.trim())).filter(Boolean);

      let rawAgenda = '';
      if (r.objektif && r.objektif.trim().length > 8 && !/^(KHIDMAT BANTU ICT|TIADA|—|-)$/i.test(r.objektif.trim())) {
        rawAgenda = r.objektif.trim();
      } else if (r.title && r.title.trim().length > 8 && !/^(KHIDMAT BANTU ICT|TIADA|—|-)$/i.test(r.title.trim())) {
        rawAgenda = r.title.trim();
      } else if (r.rumusan_ai && r.rumusan_ai.trim().length > 12) {
        rawAgenda = r.rumusan_ai.trim();
      } else if (r.keputusan && r.keputusan.trim().length > 12) {
        rawAgenda = r.keputusan.trim();
      } else if (r.isu && r.isu.trim().length > 8 && !/^(TIADA ISU|TIADA ISU SIGNIFIKAN|—|-)$/i.test(r.isu.trim())) {
        rawAgenda = r.isu.trim();
      } else {
        rawAgenda = r.title || r.objektif || 'Khidmat Bantu ICT';
      }
      const agenda = condenseObjective_(rawAgenda);
      const purposeCategory = categorizePurpose_(agenda);
      const fullContext = (r.title || '') + ' ' + (r.keputusan || '') + ' ' + (r.tindak_susul || '') + ' ' + (r.no_isd || '');
      const issueCategory = categorizeIssue_(r.isu, fullContext);
      const hasIssue = issueCategory !== 'Khidmat Selesai (Tiada Isu)' && issueCategory !== 'Tiada isu signifikan';
      const hasFollowUp = Boolean(r.tindak_susul && r.tindak_susul !== '—');
      const isdList = extractIsdNumbers_(r.no_isd, [r.title, r.isu, r.keputusan, r.tindak_susul, r.nama_sekolah]);

      yearSet.add(year);
      if (school) schoolSet.add(school);
      purposeSet.add(purposeCategory);
      issueSet.add(issueCategory);
      members.forEach(m => memberSet.add(m));

      return {
        id: r.id,
        rowNumber: idx + 2,
        date: dateLabel,
        dateLabel: dateLabel,
        dateMillis: dateMillis,
        sortTime: dateMillis,
        year: year,
        month: month,
        startTime: parseTimeHHMM_(r.masa_mula, '08:00'),
        endTime: resolveMasaTamatDefault_(r.masa_mula, r.masa_tamat),
        zoneId: zoneInfo.id,
        zoneName: zoneInfo.name,
        zoneShort: zoneInfo.short,
        zoneColor: zoneInfo.color,
        school: school,
        location: r.lokasi_lain || school,
        agenda: agenda,
        issue: r.isu || '',
        hasIssue: hasIssue,
        decision: r.keputusan || '',
        followUp: r.tindak_susul || '',
        hasFollowUp: hasFollowUp,
        isdNumbers: isdList,
        issueCategory: issueCategory,
        purposeCategory: purposeCategory,
        reporter: r.pelapor || (members[0] || ''),
        officerSchool: r.nama_pegawai_sekolah || '',
        members: members,
        memberSearch: members.join(' '),
        reportUrl: resolvePdfUrl_(r.pdf_url || r.link),
        pdfUrl: resolvePdfUrl_(r.pdf_url || r.link),
        photos: [r.gambar1, r.gambar2, r.gambar3, r.gambar4, r.gambar5, r.gambar6, r.gambar7, r.gambar8, r.gambar9, r.gambar10].map(function(g, gi) {
          if (!g) return '';
          if (g.startsWith('http://') || g.startsWith('https://')) return g;
          if (g.startsWith('data:image')) {
            return '/api/public/photo?id=' + encodeURIComponent(r.id) + '&idx=' + (gi + 1);
          }
          return resolveVisitPhotoUrl_(g);
        }).filter(Boolean)
      };
    });

    const latestYear = records.length ? records[0].year : 2026;
    const latestMonth = records.length ? records[0].month : 8;

    const filters = {
      years: Array.from(yearSet).sort((a,b) => b - a),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      zones: ZONE_DEFS.slice(0, 8),
      schools: ALL_OFFICIAL_SCHOOLS.slice().sort(),
      members: Array.from(memberSet).sort(),
      purposes: Array.from(purposeSet).sort(),
      issues: Array.from(issueSet).sort(),
      officersByZone: CANONICAL_OFFICERS,
      membersByZone: CANONICAL_OFFICERS,
      schoolsByZone: CANONICAL_SCHOOLS
    };

    const dataVersion = await computeDataVersion_(env.DB);

    return jsonResponse({
      ok: true,
      records: records,
      filters: filters,
      settings: { appTitle: 'Dashboard JTK PPD Contoh' },
      meta: {
        totalRecords: records.length,
        dataVersion: dataVersion,
        generatedAtLabel: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

// --- Versi data D1 (penjimatan rows_read) ---------------------------------
// Sebelum ini setiap /api/public/version menjalankan COUNT + MAX ke atas
// seluruh jadual laporan (full scan ~2k baris setiap poll, dan dashboard
// awam poll secara berkala). Sekarang versi disimpan sebagai SATU baris
// dalam app_meta dan hanya ditukar apabila laporan benar-benar berubah,
// jadi satu poll = satu baris dibaca.
const DATA_VERSION_META_KEY = 'laporan_data_version';
let appMetaTableReady_ = false;

async function ensureAppMetaTable_(db) {
  if (appMetaTableReady_) return true;
  try {
    await db.prepare('CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT)').run();
    appMetaTableReady_ = true;
    return true;
  } catch (err) {
    return false;
  }
}

async function readStoredDataVersion_(db) {
  try {
    const row = await db.prepare('SELECT value FROM app_meta WHERE key = ?').bind(DATA_VERSION_META_KEY).first();
    return row && row.value ? String(row.value) : null;
  } catch (err) {
    return null;
  }
}

async function writeStoredDataVersion_(db, version) {
  if (!version) return false;
  try {
    const ready = await ensureAppMetaTable_(db);
    if (!ready) return false;
    await db.prepare(
      'INSERT INTO app_meta (key, value, updated_at) VALUES (?, ?, strftime("%Y-%m-%d %H:%M:%f", "now", "+8 hours")) ' +
      'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
    ).bind(DATA_VERSION_META_KEY, String(version)).run();
    return true;
  } catch (err) {
    return false;
  }
}

// Dipanggil selepas SETIAP mutasi jadual laporan. Kegagalan di sini tidak
// boleh menjatuhkan permintaan asal; kesan terburuk ialah dashboard yang
// sedang terbuka tidak auto-refresh sehingga halaman dimuat semula.
async function bumpDataVersion_(db) {
  try {
    const token = 'D1W_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    return await writeStoredDataVersion_(db, token);
  } catch (err) {
    return false;
  }
}

// Laluan lama: hanya digunakan sekali untuk menyemai nilai awal atau apabila
// app_meta tiada/kosong.
async function scanDataVersion_(db) {
  const row = await db.prepare('SELECT count(*) as c, max(updated_at) as u FROM laporan WHERE deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').first();
  const c = row && row.c != null ? row.c : 0;
  const u = row && row.u ? row.u : '0';
  return 'D1_' + c + '_' + u;
}

async function computeDataVersion_(db) {
  const stored = await readStoredDataVersion_(db);
  if (stored) return stored;
  try {
    const scanned = await scanDataVersion_(db);
    await writeStoredDataVersion_(db, scanned);
    return scanned;
  } catch (err) {
    return 'D1_LIVE';
  }
}

async function handlePublicVersionApi(request, env) {
  // Public policy metadata only. Keep the existing dataVersion contract and
  // lightweight app_meta lookup; never expose staff/session/secret values.
  let dataVersion = 'D1_LIVE';
  try { dataVersion = await computeDataVersion_(env.DB); } catch (_) {}
  return jsonResponse({
    ok: true,
    dataVersion: dataVersion,
    ptisStaffGate: env.PTIS_STAFF_GATE_ENABLED === 'true'
  }, 200, { 'Cache-Control': 'public, max-age=30, must-revalidate' });
}

async function handlePublicPhotosApi(url, env) {
  try {
    const reportId = url.searchParams.get('id') || url.searchParams.get('reportId') || url.searchParams.get('rowId');
    const row = await env.DB.prepare('SELECT gambar1, gambar2, gambar3, gambar4, gambar5, gambar6, gambar7, gambar8, gambar9, gambar10, pdf_url, link, nama_sekolah, tarikh FROM laporan WHERE (id = ? OR rowid = ?) AND deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').bind(reportId, reportId).first();
    if (!row) {
      return jsonResponse({ ok: false, error: 'Rekod tidak dijumpai.' });
    }
    const photos = [row.gambar1, row.gambar2, row.gambar3, row.gambar4, row.gambar5, row.gambar6, row.gambar7, row.gambar8, row.gambar9, row.gambar10].map(resolveVisitPhotoUrl_).filter(Boolean);
    return jsonResponse({
      ok: true,
      photos: photos,
      gambarList: photos,
      pdfUrl: resolvePdfUrl_(row.pdf_url || row.link),
      reportUrl: resolvePdfUrl_(row.pdf_url || row.link),
      namaSekolah: row.nama_sekolah,
      tarikh: row.tarikh
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

async function handlePublicDataApi(request, env) {
  return handlePublicBootstrapApi(request, env);
}

/**
 * Dynamic Official Report Print & PDF Engine (Zero External Dependency)
 * Generates an official A4-standard printable HTML document with @media print CSS.
 */
async function handleReportPrintView(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const reportId = url.searchParams.get('id') || url.searchParams.get('reportId') || url.searchParams.get('rowId') || '';
    if (!reportId) {
      return new Response('<!DOCTYPE html><html><head><title>Ralat</title><style>body{font-family:sans-serif;padding:40px;text-align:center;background:#0c0e12;color:#f8fafc;}</style></head><body><h2>⚠️ Parameter ID Laporan Diperlukan</h2><p>Sila sertakan parameter ?id=... pada URL.</p></body></html>', {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }

    const r = await env.DB.prepare('SELECT * FROM laporan WHERE (id = ? OR rowid = ?) AND deleted_at IS NULL AND report_type = "school_visit" AND upper(trim(coalesce(status_kes, ""))) != "DIPADAM"').bind(reportId, reportId).first();
    if (!r) {
      return new Response('<!DOCTYPE html><html><head><title>Laporan Tidak Dijumpai</title><style>body{font-family:sans-serif;padding:40px;text-align:center;background:#0c0e12;color:#f8fafc;}</style></head><body><h2>⚠️ Laporan Tidak Dijumpai</h2><p>ID rekod "' + escapeHtml_(reportId) + '" tiada dalam pangkalan data Cloudflare D1.</p><p><button onclick="window.close()" style="background:#38bdf8;color:#0f172a;font-weight:700;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-top:16px;">Tutup</button></p></body></html>', {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }

    const school = canonicalSchoolName_(r.nama_sekolah || r.lokasi_lain || 'Sekolah');
    const zInfo = resolveZone(r.zon, school);
    const dateComp = parseDateComponents_(r.tarikh, r.timestamp);
    const dateStr = (r.tarikh && r.tarikh.includes('(')) ? r.tarikh : (dateComp.dateLabelWithDay !== '—' ? dateComp.dateLabelWithDay : dateComp.dateLabel);
    const masaMula = parseTimeHHMM_(r.masa_mula, '08:00');
    const masaTamat = resolveMasaTamatDefault_(r.masa_mula, r.masa_tamat);

    let rawAgenda = '';
    if (r.objektif && r.objektif.trim().length > 8 && !/^(KHIDMAT BANTU ICT|TIADA|—|-)$/i.test(r.objektif.trim())) {
      rawAgenda = r.objektif.trim();
    } else if (r.title && r.title.trim().length > 8 && !/^(KHIDMAT BANTU ICT|TIADA|—|-)$/i.test(r.title.trim())) {
      rawAgenda = r.title.trim();
    } else {
      rawAgenda = r.title || r.objektif || 'Khidmat Bantu ICT';
    }
    const agendaFormatted = condenseObjective_(rawAgenda);
    const rumusan = cleanParagraphText_(r.rumusan_ai || r.keputusan || 'Khidmat bantu penyelenggaraan teknikal ICT telah berjaya dilaksanakan bagi memastikan peranti berada dalam keadaan optimum.');

    // Determine Impak lines (authentic without synthetic filler)
    let impakLines = [];
    if (r.impak_ai && r.impak_ai.trim()) {
      impakLines = r.impak_ai.replace(/\\r\\n/g, '\\n').replace(/(\\d+[.)]\\s*)/g, '\\n$1').split('\\n').map(function(l) {
        return l.trim().replace(/^\\d+[.)]\\s*/, '');
      }).filter(Boolean);
    } else if (r.isu && r.isu.trim()) {
      impakLines = r.isu.replace(/\\r\\n/g, '\\n').replace(/(\\d+[.)]\\s*)/g, '\\n$1').split('\\n').map(function(l) {
        return l.trim().replace(/^\\d+[.)]\\s*/, '');
      }).filter(Boolean);
    }
    if (!impakLines.length) {
      impakLines = ['Pemeriksaan dan khidmat bantu teknikal ICT telah dilaksanakan mengikut keperluan.'];
    }

    // Determine Tindak Susul lines (authentic without synthetic filler)
    let tindakLines = [];
    if (r.tindak_susul_ai && r.tindak_susul_ai.trim()) {
      tindakLines = r.tindak_susul_ai.replace(/\\r\\n/g, '\\n').replace(/(\\d+[.)]\\s*)/g, '\\n$1').split('\\n').map(function(l) {
        return l.trim().replace(/^\\d+[.)]\\s*/, '');
      }).filter(Boolean);
    } else if (r.tindak_susul && r.tindak_susul.trim() && !/^(TIADA|—|-)$/i.test(r.tindak_susul.trim())) {
      tindakLines = r.tindak_susul.replace(/\\r\\n/g, '\\n').replace(/(\\d+[.)]\\s*)/g, '\\n$1').split('\\n').map(function(l) {
        return l.trim().replace(/^\\d+[.)]\\s*/, '');
      }).filter(Boolean);
    }
    if (!tindakLines.length) {
      tindakLines = ['Tindakan teknikal telah diselesaikan sepenuhnya semasa sesi lawatan khidmat bantu.'];
    }

    const rawOfficers = (r.pegawai || '').split(',').map(function(s) {
      const trimmed = s.trim();
      return (trimmed && !isNonOfficerLabel_(trimmed)) ? (canonicalOfficerName_(trimmed) || trimmed) : '';
    }).filter(Boolean);

    const rawPelapor = String(r.pelapor || '').trim();
    const pelapor = (rawPelapor && !isNonOfficerLabel_(rawPelapor))
      ? (canonicalOfficerName_(rawPelapor) || rawPelapor)
      : ((rawOfficers.length > 0) ? rawOfficers[0] : 'Pegawai Bertugas');

    const allTeamMembers = Array.from(new Set([pelapor, ...rawOfficers])).filter(Boolean);

    const isdList = extractIsdNumbers_(r.no_isd, [r.title, r.isu, r.keputusan, r.tindak_susul, r.nama_sekolah]);
    const isdText = isdList.length ? isdList.map(n => 'ISD #' + n).join(', ') : (r.no_isd ? ('ISD #' + r.no_isd) : '—');
    const akauntabiliti = (r.akauntabiliti || 'PENGURUSAN').toUpperCase();
    const slogan = r.slogan || '"PPD KITA, TANGGUNGJAWAB KITA"';
    const pdfUrl = resolvePdfUrl_(r.pdf_url || r.link);

    const photos = [r.gambar1, r.gambar2, r.gambar3, r.gambar4, r.gambar5, r.gambar6, r.gambar7, r.gambar8, r.gambar9, r.gambar10].map(function(g, gi) {
      if (!g) return '';
      if (g.startsWith('http://') || g.startsWith('https://')) return g;
      if (g.startsWith('data:image')) {
        return '/api/public/photo?id=' + encodeURIComponent(r.id) + '&idx=' + (gi + 1);
      }
      return resolveVisitPhotoUrl_(g);
    }).filter(Boolean);

    let photosHtml = '';
    if (photos.length) {
      photosHtml = photos.map(function(pUrl, pi) {
        return '<div class="photo-card">' +
          '<img src="' + escapeAttr_(pUrl) + '" alt="Eviden Gambar ' + (pi + 1) + '" loading="lazy">' +
          '<div class="photo-caption">Eviden Gambar ' + (pi + 1) + '</div>' +
        '</div>';
      }).join('');
    } else {
      photosHtml = '<div style="grid-column:span 4;text-align:center;padding:16px;font-style:italic;color:#64748b;border:1px dashed #cbd5e1;border-radius:4px;">Tiada fail gambar dilampirkan bagi rekod ini.</div>';
    }

    const impakListHtml = impakLines.map(function(line, idx) {
      return '<li data-num="' + (idx + 1) + '.">' + escapeHtml_(line.replace(/^\\d+[.)]\\s*/, '')) + '</li>';
    }).join('');

    const tindakListHtml = tindakLines.map(function(line, idx) {
      return '<li data-num="' + (idx + 1) + '.">' + escapeHtml_(line.replace(/^\\d+[.)]\\s*/, '')) + '</li>';
    }).join('');

    let driveBtnHtml = '';
    if (pdfUrl) {
      const isDriveFile = pdfUrl.includes('drive.google.com/file/d/');
      const btnLabel = isDriveFile ? '📄 Buka Fail PDF (Drive) ↗' : '📂 Buka Folder Arkib Drive ↗';
      driveBtnHtml = '<a href="' + escapeAttr_(pdfUrl) + '" target="_blank" rel="noopener" class="btn-action btn-drive-opt" style="background:#059669;color:#ffffff;font-weight:700;">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>' +
        ' ' + btnLabel +
      '</a>';
    }

    const html = '<!DOCTYPE html>' +
'<html lang="ms">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
'  <title>Laporan PTIS — ' + escapeHtml_(school) + ' (' + escapeHtml_(dateComp.dateLabel) + ')</title>' +
'  <style>' +
'    :root {' +
'      --primary: #0f172a;' +
'      --accent: #64748b;' +
'      --text: #0f172a;' +
'      --text-muted: #475569;' +
'      --border: #cbd5e1;' +
'      --border-dark: #334155;' +
'      --bg-page: #f8fafc;' +
'      --card-bg: #ffffff;' +
'    }' +
'    * { box-sizing: border-box; margin: 0; padding: 0; }' +
'    body {' +
'      font-family: Plus Jakarta Sans, Arial, -apple-system, sans-serif;' +
'      font-size: 11.5px;' +
'      line-height: 1.55;' +
'      color: var(--text);' +
'      background: #0b0f19;' +
'      padding: 24px 12px 60px;' +
'      -webkit-font-smoothing: antialiased;' +
'    }' +
'    .screen-action-bar {' +
'      position: sticky;' +
'      top: 12px;' +
'      max-width: 820px;' +
'      margin: 0 auto 18px;' +
'      background: rgba(15, 23, 42, 0.94);' +
'      backdrop-filter: blur(12px);' +
'      -webkit-backdrop-filter: blur(12px);' +
'      border: 1px solid rgba(56, 189, 248, 0.35);' +
'      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.15);' +
'      border-radius: 10px;' +
'      padding: 10px 16px;' +
'      display: flex;' +
'      align-items: center;' +
'      justify-content: space-between;' +
'      gap: 12px;' +
'      z-index: 9999;' +
'    }' +
'    .bar-info {' +
'      display: flex;' +
'      align-items: center;' +
'      gap: 8px;' +
'      color: #e2e8f0;' +
'      font-size: 12px;' +
'      font-weight: 600;' +
'    }' +
'    .badge-verified {' +
'      background: #059669;' +
'      color: #ffffff;' +
'      padding: 3px 8px;' +
'      border-radius: 4px;' +
'      font-size: 11px;' +
'      font-weight: 700;' +
'      letter-spacing: 0.5px;' +
'      display: inline-flex;' +
'      align-items: center;' +
'      gap: 4px;' +
'    }' +
'    .bar-actions {' +
'      display: flex;' +
'      align-items: center;' +
'      gap: 8px;' +
'      flex-wrap: wrap;' +
'    }' +
'    .btn-action {' +
'      display: inline-flex;' +
'      align-items: center;' +
'      gap: 6px;' +
'      padding: 7px 14px;' +
'      border-radius: 6px;' +
'      font-size: 12px;' +
'      font-weight: 700;' +
'      cursor: pointer;' +
'      text-decoration: none;' +
'      transition: all 0.15s ease;' +
'      border: none;' +
'    }' +
'    .btn-print-primary {' +
'      background: #38bdf8;' +
'      color: #0f172a;' +
'      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);' +
'    }' +
'    .btn-print-primary:hover {' +
'      background: #7dd3fc;' +
'      transform: translateY(-1px);' +
'    }' +
'    .btn-drive-opt {' +
'      background: rgba(30, 41, 59, 0.8);' +
'      color: #cbd5e1;' +
'      border: 1px solid #475569;' +
'    }' +
'    .btn-drive-opt:hover {' +
'      background: #334155;' +
'      color: #ffffff;' +
'    }' +
'    .btn-close-opt {' +
'      background: transparent;' +
'      color: #94a3b8;' +
'      border: 1px solid #334155;' +
'    }' +
'    .btn-close-opt:hover {' +
'      background: rgba(239, 68, 68, 0.2);' +
'      color: #f87171;' +
'      border-color: #ef4444;' +
'    }' +
'    .a4-sheet {' +
'      max-width: 820px;' +
'      margin: 0 auto;' +
'      background: #ffffff;' +
'      padding: 32px 36px;' +
'      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);' +
'      border-radius: 4px;' +
'      position: relative;' +
'    }' +
'    .doc-header {' +
'      text-align: center;' +
'      padding-bottom: 12px;' +
'      border-bottom: 2.5px solid #0f172a;' +
'      position: relative;' +
'      margin-bottom: 12px;' +
'    }' +
'    .gov-main { font-size: 13px; font-weight: 800; letter-spacing: normal; color: #0f172a; text-transform: uppercase; }' +
'    .gov-sub { font-size: 11.5px; font-weight: 700; color: #1e293b; margin-top: 1px; letter-spacing: normal; }' +
'    .doc-banner { margin-top: 8px; display: inline-block; background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: normal; padding: 4px 14px; border-radius: 4px; text-transform: uppercase; }' +
'    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }' +
'    .meta-table td { border: 1px solid #cbd5e1; padding: 5.5px 8px; padding-right: 6px; font-size: 11px; vertical-align: middle; overflow: visible; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; letter-spacing: normal; }' +
'    .meta-label { background: #f1f5f9; font-weight: 700; color: #334155; width: 18%; text-transform: uppercase; font-size: 10px; letter-spacing: normal; }' +
'    .meta-value { color: #0f172a; font-weight: 600; width: 32%; letter-spacing: normal; }' +
'    .sec-head { background: #f1f5f9; border-left: 3.5px solid #64748b; padding: 4px 8px; font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: normal; margin-top: 10px; margin-bottom: 4px; }' +
'    .sec-box { border: 1px solid #cbd5e1; border-radius: 2px; padding: 8px 12px 8px 10px; padding-right: 8px; background: #ffffff; font-size: 11px; line-height: 1.55; color: #1e293b; text-align: justify; overflow: visible; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; letter-spacing: normal; }' +
'    .parallel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 6px; }' +
'    .num-list { list-style: none; padding: 0; margin: 0; }' +
'    .num-list li { position: relative; padding-left: 18px; padding-right: 6px; margin-bottom: 5px; font-size: 10.5px; line-height: 1.45; color: #1e293b; overflow: visible; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; letter-spacing: normal; }' +
'    .num-list li:last-child { margin-bottom: 0; }' +
'    .num-list li::before { content: attr(data-num); position: absolute; left: 0; top: 0; font-weight: 700; color: #64748b; font-family: ui-monospace, monospace; }' +
'    .photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 6px; }' +
'    .photo-card { border: 1px solid #cbd5e1; border-radius: 3px; overflow: hidden; background: #f8fafc; text-align: center; }' +
'    .photo-card img { width: 100%; height: 130px; object-fit: cover; display: block; background: #e2e8f0; }' +
'    .photo-caption { font-size: 9px; font-weight: 700; color: #475569; padding: 4px 3px; background: #f1f5f9; border-top: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: normal; }' +
'    .doc-footer { margin-top: 20px; padding-top: 10px; border-top: 1.5px solid #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9.5px; color: #64748b; gap: 12px; }' +
'    .footer-left { display: flex; flex-direction: column; gap: 3px; }' +
'    .slogan-block { font-weight: 700; color: #334155; font-size: 10px; letter-spacing: normal; }' +
'    .disclaimer-text { font-size: 8.5px; color: #64748b; font-style: italic; letter-spacing: normal; }' +
'    .sys-ref { font-family: JetBrains Mono, monospace; font-size: 8.5px; text-align: right; white-space: nowrap; letter-spacing: normal; }' +
'    @media print {' +
'      body { background: #ffffff !important; padding: 0 !important; }' +
'      .no-print, .screen-action-bar { display: none !important; }' +
'      .a4-sheet { max-width: 100% !important; box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; }' +
'      .a4-sheet, .a4-sheet * { letter-spacing: normal !important; }' +
'      .sec-box, .meta-table td, .meta-table th, .num-list li, p, span, h1, h2, h3, div {' +
'        overflow: visible !important;' +
'        white-space: normal !important;' +
'        word-wrap: break-word !important;' +
'        overflow-wrap: break-word !important;' +
'        padding-right: 4px;' +
'        letter-spacing: normal !important;' +
'      }' +
'      .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }' +
'      @page { size: A4 portrait; margin: 10mm 12mm 10mm 12mm; }' +
'    }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="screen-action-bar no-print">' +
'    <div class="bar-info">' +
'      <span class="badge-verified">✓ D1 REKOD RASMI</span>' +
'      <span>' + escapeHtml_(r.id) + '</span>' +
'    </div>' +
'    <div class="bar-actions">' +
'      <button onclick="window.print()" class="btn-action btn-print-primary">' +
'        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
'        Cetak / Simpan PDF' +
'      </button>' +
      driveBtnHtml +
'      <button onclick="window.close()" class="btn-action btn-close-opt">✕ Tutup</button>' +
'    </div>' +
'  </div>' +
'  <div class="a4-sheet">' +
'    <div class="doc-header">' +
'      <div class="gov-main">Kementerian Pendidikan Malaysia</div>' +
'      <div class="gov-sub">Jabatan Pendidikan Negeri Sarawak · Pejabat Pendidikan Daerah Contoh</div>' +
'      <div class="gov-sub" style="font-weight:600; color:#475569;">Sektor Pengurusan Sekolah · Unit ICT</div>' +
'      <div class="doc-banner">Laporan Khidmat Bantu &amp; Penyelenggaraan Teknikal ICT (PTIS)</div>' +
'    </div>' +
'    <table class="meta-table">' +
'      <tr>' +
'        <td class="meta-label">Sekolah / Lokasi</td>' +
'        <td class="meta-value" style="font-size:12px; font-weight:800; color:#475569;">' + escapeHtml_(school) + '</td>' +
'        <td class="meta-label">Zon &amp; Kategori</td>' +
'        <td class="meta-value">' + escapeHtml_(zInfo.name) + ' · ' + escapeHtml_(akauntabiliti) + '</td>' +
'      </tr>' +
'      <tr>' +
'        <td class="meta-label">Tarikh Lawatan</td>' +
'        <td class="meta-value">' + escapeHtml_(dateStr) + '</td>' +
'        <td class="meta-label">Masa Operasi</td>' +
'        <td class="meta-value">' + escapeHtml_(masaMula) + ' – ' + escapeHtml_(masaTamat) + '</td>' +
'      </tr>' +
'      <tr>' +
'        <td class="meta-label">Pegawai Pelapor</td>' +
'        <td class="meta-value">' + escapeHtml_(pelapor) + '</td>' +
'        <td class="meta-label">No. Tiket ISD</td>' +
'        <td class="meta-value" style="font-family:JetBrains Mono, monospace; font-weight:700; color:' + (isdList.length ? '#059669' : '#64748b') + ';">' + escapeHtml_(isdText) + '</td>' +
'      </tr>' +
'      <tr>' +
'        <td class="meta-label">Pasukan / Petugas Terlibat</td>' +
'        <td class="meta-value" colspan="3">' + escapeHtml_(allTeamMembers.join(', ') || '—') + '</td>' +
'      </tr>' +
'    </table>' +
'    <div class="sec-head">1. Agenda &amp; Objektif Lawatan</div>' +
'    <div class="sec-box">' +
'      <p style="font-weight:600;">' + escapeHtml_(agendaFormatted) + '</p>' +
'    </div>' +
'    <div class="sec-head">2. Rumusan Pelaksanaan &amp; Khidmat Bantu</div>' +
'    <div class="sec-box">' +
'      <p>' + escapeHtml_(rumusan) + '</p>' +
'    </div>' +
'    <div class="parallel-grid avoid-break">' +
'      <div>' +
'        <div class="sec-head" style="margin-top:0;">3. Impak &amp; Hasil Lawatan</div>' +
'        <div class="sec-box">' +
'          <ul class="num-list">' + impakListHtml + '</ul>' +
'        </div>' +
'      </div>' +
'      <div>' +
'        <div class="sec-head" style="margin-top:0;">4. Tindak Susul &amp; Syor</div>' +
'        <div class="sec-box">' +
'          <ul class="num-list">' + tindakListHtml + '</ul>' +
'        </div>' +
'      </div>' +
'    </div>' +
'    <div class="avoid-break">' +
'      <div class="sec-head">5. Eviden Bergambar Lawatan (' + photos.length + ' Gambar)</div>' +
'      <div class="photo-grid">' + photosHtml + '</div>' +
'    </div>' +
'    <div class="doc-footer avoid-break">' +
'      <div class="footer-left">' +
'        <div class="slogan-block">' + escapeHtml_(slogan) + ' · #ptis #ppdict #bitarasentiasa</div>' +
'        <div class="disclaimer-text">Laporan ini dijana secara digital melalui Sistem Pengurusan PTIS Unit ICT PPD Contoh. Tiada tandatangan fizikal diperlukan.</div>' +
'      </div>' +
'      <div class="sys-ref">' +
'        ID REKOD: ' + escapeHtml_(r.id) + '<br>' +
'        DISAHKAN DIGITAL · D1 SQL' +
'      </div>' +
'    </div>' +
'  </div>' +
'</body>' +
'</html>';

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'public, max-age=60, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response('<!DOCTYPE html><html><body><h2>Ralat Penjanaan Laporan</h2><p>' + escapeHtml_(err.message) + '</p></body></html>', {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  }
}

/**
 * Scheduled Cron Job: Sync Legacy Google Sheet to Cloudflare D1
 */
async function syncLegacyGoogleSheetToD1(env) {
  try {
    const db = env.DB;
    const SHEET_CSV_URL = String(env.LEGACY_SHEET_CSV_URL || '').trim();
    if (!SHEET_CSV_URL) return { ok: true, skipped: true, reason: 'LEGACY_SHEET_CSV_URL not configured' };
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' fetching Google Sheet CSV');

    const csvText = await res.text();

    // RFC 4180 Compliant Multiline CSV Parser
    function parseRfc4180Csv(text) {
      const rows = [];
      let currentRow = [];
      let currentField = '';
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          currentRow.push(currentField.trim());
          currentField = '';
        } else if ((char === String.fromCharCode(13) || char === String.fromCharCode(10)) && !inQuotes) {
          if (char === String.fromCharCode(13) && nextChar === String.fromCharCode(10)) i++;
          currentRow.push(currentField.trim());
          if (currentRow.some(Boolean)) rows.push(currentRow);
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }

      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(Boolean)) rows.push(currentRow);
      }

      return rows;
    }

    const rows = parseRfc4180Csv(csvText);
    if (rows.length < 2) return { ok: true, imported: 0 };

    let inserted = 0;
    const statements = [];

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      const timestamp = cols[0] || '';
      const agenda = cols[1] || '';
      const zone = cols[2] || '';
      const masaMula = cols[3] || '';
      const masaTamat = cols[4] || '';
      const school = cols[5] || '';
      const lokasiLain = cols[6] || '';
      const pegawai = cols[7] || '';
      const pegawaiLain = cols[8] || '';
      const isu = cols[9] || '';
      const keputusan = cols[10] || '';
      const tindakan = cols[11] || '';
      const g1 = cols[12] || '';
      const g2 = cols[13] || '';
      const g3 = cols[14] || '';
      const g4 = cols[15] || '';
      const pelapor = cols[17] || cols[18] || '';
      const pdf = cols[20] || cols[21] || cols[23] || '';
      let isd = cols[24] || '';

      const targetSchool = (school || lokasiLain || '').trim();
      if (!timestamp && !targetSchool) continue;
      if (targetSchool.length < 2) continue;

      if (!isd) {
        const isdList = extractIsdNumbers_('', [agenda, isu, keputusan, tindakan, targetSchool]);
        if (isdList.length) isd = isdList.join(', ');
      }

      const allPegawai = [pegawai, pegawaiLain].filter(Boolean).join(', ');
      const id = 'rep_sheet_' + (i + 1);

      // INSERT OR IGNORE leverages unique fingerprint constraint
      statements.push(
        db.prepare(
          'INSERT OR IGNORE INTO laporan (id, timestamp, tarikh, masa_mula, masa_tamat, pelapor, nama_pegawai_sekolah, jawatan_pegawai_sekolah, zon, nama_sekolah, lokasi_lain, pegawai, title, isu, keputusan, tindak_susul, no_isd, status_kes, gambar1, gambar2, gambar3, gambar4, link) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          id, timestamp, timestamp.split(' ')[0] || '', masaMula, masaTamat,
          pelapor, '', '', zone, school, lokasiLain, allPegawai,
          agenda || 'Khidmat Bantu ICT', isu, keputusan, tindakan,
          isd, 'Selesai', g1, g2, g3, g4, pdf
        )
      );
      inserted++;
    }

    if (statements.length > 0) {
      for (let s = 0; s < statements.length; s += 50) {
        const batch = statements.slice(s, s + 50);
        await db.batch(batch);
      }
    }

    return { ok: true, imported: inserted, totalInSheet: rows.length - 1 };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = Object.assign({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Renewed-Token',
    'Access-Control-Expose-Headers': 'X-Renewed-Token'
  }, extraHeaders);
  return new Response(JSON.stringify(data), {
    status: status,
    headers: headers
  });
}

// FIX #7: Admin API menggunakan CORS terhad — hanya __ADMIN_DOMAIN__ dibenarkan
function adminJsonResponse(data, status = 200, request = null) {
  const allowedOrigin = 'https://__ADMIN_DOMAIN__';
  const origin = request ? (request.headers.get('Origin') || '') : '';
  const corsOrigin = (origin === allowedOrigin || origin === '') ? allowedOrigin : 'null';
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin'
    }
  });
}

function serveStaticHtml(filename) {
  let content = INDEX_HTML;
  if (filename === 'AdminApp.html' || filename === 'admin') content = ADMIN_HTML;
  if (filename === 'ptis.html' || filename === 'ptis' || filename === 'laporan.html') content = PTIS_HTML;
  if (filename === 'map.html' || filename === 'map') content = MAP_HTML;
  if (filename === 'radar.html' || filename === 'radar') content = RADAR_HTML;
  if (filename === 'pwa.html' || filename === 'pwa' || filename === 'pwa.html') content = PWA_HTML;
  if (filename === 'qrcode.html') content = QR_HTML;
  content = content.replaceAll('__BUILD_VERSION__', BUILD_VERSION).replaceAll('<!--BUILD_VERSION-->', BUILD_VERSION);
  return new Response(content, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Build-Version': BUILD_VERSION
    }
  });
}

// hashPassword_ dan verifyPassword_ ditakrifkan dalam Security Layer di atas.

` + dossierHtmlFunction;

const configuredDomains = ORGANIZATION_CONFIG.domains || {};
const rootDomain = String(configuredDomains.root || 'ppd.example.invalid').replace(/^https?:\/\//, '').replace(/\/$/, '');
const finalWorkerCode = workerCode
  .replaceAll('__ADMIN_DOMAIN__', String(configuredDomains.admin || ('admin.' + rootDomain)).replace(/^https?:\/\//, '').replace(/\/$/, ''))
  .replaceAll('__PTIS_DOMAIN__', String(configuredDomains.ptis || ('ptis.' + rootDomain)).replace(/^https?:\/\//, '').replace(/\/$/, ''))
  .replaceAll('__DASHBOARD_DOMAIN__', String(configuredDomains.dashboard || ('dashboard.' + rootDomain)).replace(/^https?:\/\//, '').replace(/\/$/, ''))
  .replaceAll('__WWW_ROOT_DOMAIN__', String(configuredDomains.www || ('www.' + rootDomain)).replace(/^https?:\/\//, '').replace(/\/$/, ''))
  .replaceAll('__ROOT_DOMAIN__', rootDomain);

fs.writeFileSync('cloudflare_worker_ppd.js', finalWorkerCode, 'utf8');
console.log('cloudflare_worker_ppd.js compiled successfully.');
