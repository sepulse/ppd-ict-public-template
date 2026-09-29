import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"') {
      if (quoted && next === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      row.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(field); field = '';
      if (row.some(v => v.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows.shift().map(v => v.trim());
  return rows.map(values => Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').trim()])));
}

const organization = readJson('config/organization.json');
const zones = readJson('config/zones.json');
const schools = parseCsv(fs.readFileSync(path.join(root, 'data/schools.example.csv'), 'utf8'));
const officers = parseCsv(fs.readFileSync(path.join(root, 'data/officers.example.csv'), 'utf8'));

const schoolsByZone = Object.fromEntries(zones.map(z => [z.id, []]));
for (const school of schools) {
  if (!schoolsByZone[school.zon]) schoolsByZone[school.zon] = [];
  schoolsByZone[school.zon].push(school.nama);
}

const officersByZone = Object.fromEntries(zones.map(z => [z.id, []]));
const officerPositions = {};
for (const officer of officers) {
  if (!officersByZone[officer.zon]) officersByZone[officer.zon] = [];
  officersByZone[officer.zon].push(officer.nama);
  officerPositions[officer.nama] = officer.jawatan;
}

const runtime = {
  organization,
  zones,
  schools,
  officers: officers.map(({ email, ...safe }) => safe),
  schoolsByZone,
  officersByZone,
  officerPositions
};

for (const manifestName of ['manifest.json', 'manifest.webmanifest']) {
  const manifestPath = path.join(root, manifestName);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const domains = organization.domains || {};
  const systemName = organization.systemName || 'Portal ICT';
  const orgShort = organization.organizationShortName || 'PPD Contoh';
  manifest.name = `${systemName} - ${orgShort}`;
  manifest.short_name = systemName;
  manifest.description = `Portal pengurusan laporan, dashboard, peta dan utiliti ICT untuk ${organization.organizationName || orgShort}.`;
  manifest.background_color = '#F8FAFC';
  manifest.theme_color = '#F8FAFC';
  if (Array.isArray(manifest.shortcuts)) {
    manifest.shortcuts.forEach(item => {
      if (item.short_name === 'Dashboard' && domains.dashboard) item.url = `https://${domains.dashboard}`;
      if (item.short_name === 'Borang' && domains.ptis) item.url = `https://${domains.ptis}`;
    });
  }
  const origins = [
    domains.root,
    domains.root ? `www.${domains.root}` : '',
    domains.dashboard,
    domains.ptis,
    domains.admin
  ].filter(Boolean).map(domain => ({ origin: `https://${domain}` }));
  manifest.scope_extensions = origins;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

fs.writeFileSync(
  path.join(root, 'config/runtime.generated.json'),
  JSON.stringify(runtime, null, 2) + '\n',
  'utf8'
);

fs.writeFileSync(
  path.join(root, 'assets/public-config.js'),
  `(function(root){\n` +
  `  'use strict';\n` +
  `  const config = ${JSON.stringify(runtime, null, 2)};\n` +
  `  root.PPD_SYSTEM_CONFIG = Object.freeze(config);\n` +
  `  const isLocal = root.location && /^(localhost|127\\.0\\.0\\.1)$/.test(root.location.hostname || '');\n` +
  `  if (isLocal && root.navigator && root.navigator.serviceWorker) {\n` +
  `    root.navigator.serviceWorker.getRegistrations().then(list => list.forEach(reg => reg.unregister())).catch(() => {});\n` +
  `    if (root.caches && root.caches.keys) root.caches.keys().then(keys => keys.forEach(key => root.caches.delete(key))).catch(() => {});\n` +
  `  }\n` +
  `  function applyBranding(){\n` +
  `    if (!root.document) return;\n` +
  `    const org = config.organization || {};\n` +
  `    const replacements = [\n` +
  `      ['Pejabat Pendidikan Daerah Contoh', org.organizationName || 'Pejabat Pendidikan Daerah Contoh'],\n` +
  `      ['PEJABAT PENDIDIKAN DAERAH CONTOH', String(org.organizationName || 'Pejabat Pendidikan Daerah Contoh').toUpperCase()],\n` +
  `      ['PPD CONTOH', String(org.organizationShortName || 'PPD Contoh').toUpperCase()],\n` +
  `      ['PPD Contoh', org.organizationShortName || 'PPD Contoh'],\n` +
  `      ['PPD-ICT', org.systemName || 'Portal ICT'],\n` +
  `      ['Portal ICT', org.systemName || 'Portal ICT'],\n` +
  `      ['ppd.example.invalid', (org.domains && org.domains.root) || 'ppd.example.invalid'],\n` +
  `      ['dashboard.ppd.example.invalid', (org.domains && org.domains.dashboard) || 'dashboard.ppd.example.invalid'],\n` +
  `      ['admin.ppd.example.invalid', (org.domains && org.domains.admin) || 'admin.ppd.example.invalid'],\n` +
  `      ['ptis.ppd.example.invalid', (org.domains && org.domains.ptis) || 'ptis.ppd.example.invalid']\n` +
  `    ];\n` +
  `    const swap = value => replacements.reduce((out, pair) => String(out).split(pair[0]).join(pair[1]), String(value));\n` +
  `    if (root.document.title) root.document.title = swap(root.document.title);\n` +
  `    const walker = root.document.createTreeWalker(root.document.body || root.document.documentElement, NodeFilter.SHOW_TEXT);\n` +
  `    const nodes = []; let node; while ((node = walker.nextNode())) nodes.push(node);\n` +
  `    nodes.forEach(textNode => { const parent = textNode.parentElement; if (!parent || /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/.test(parent.tagName)) return; const next = swap(textNode.nodeValue); if (next !== textNode.nodeValue) textNode.nodeValue = next; });\n` +
  `    root.document.querySelectorAll('[href],[content],[placeholder],[title]').forEach(el => {\n` +
  `      ['href','content','placeholder','title'].forEach(attr => { if (!el.hasAttribute(attr)) return; const before = el.getAttribute(attr); const after = swap(before); if (after !== before) el.setAttribute(attr, after); });\n` +
  `    });\n` +
  `  }\n` +
  `  if (root.document) { if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', applyBranding, {once:true}); else applyBranding(); }\n` +
  `})(typeof window !== 'undefined' ? window : globalThis);\n`,
  'utf8'
);

const esc = value => `'${String(value ?? '').replaceAll("'", "''")}'`;
const seed = [
  '-- Generated from data/schools.example.csv by npm run configure.',
  '-- Replace the example CSV with your own PPD data before production use.',
  'DELETE FROM sekolah;',
  ...schools.map(s => `INSERT INTO sekolah (nama,kod,zon,kategori,lat,lng,jarak_km) VALUES (${esc(s.nama)},${esc(s.kod)},${esc(s.zon)},${esc(s.kategori)},${Number(s.lat) || 'NULL'},${Number(s.lng) || 'NULL'},${s.jarak_km === '' ? 'NULL' : Number(s.jarak_km)});`)
];
fs.writeFileSync(path.join(root, 'data/schools.generated.sql'), seed.join('\n') + '\n', 'utf8');

console.log(`Configured ${schools.length} locations, ${officers.length} officers and ${zones.length} zone definitions.`);
