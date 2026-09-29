'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const allowedExt = new Set(['.html', '.js', '.mjs', '.cjs', '.json', '.md', '.sql', '.toml', '.css', '.webmanifest', '.txt', '.csv']);
const ignoredDirs = new Set(['.git', 'node_modules', 'public']);

const forbidden = [
  [/ppdk\.ch/i, 'domain production ppdk.ch'],
  [/PPD\s+Kuching/i, 'nama organisasi production'],
  [/78498aca-f4ca-4274-bcba-a6ec292665ab/i, 'D1 database id production'],
  [/ictppdkuching@gmail\.com/i, 'e-mel admin production'],
  [/1lAuWlgT0N1gu3weLHBi0bzX9PkUBdUdN8h2jrylTD2I/i, 'Google Sheet id production'],
  [/1Sew5Zj-eWoB_XqggR11ZPF8DUwJFnAG9/i, 'Google Drive folder id production'],
  [/AKfycbyXm_vlETZLcwjKSdZMOm4B_MCcwm_Alsu1W5x4lZdv3Edy37iIhH6PTgV16LhJA-0v/i, 'GAS laporan id production'],
  [/AKfycbx3iueH4el-1VgGU8UQI7TLd4Ughc1ZTWdbNcKZo59ehlMn5DN5X6eVjiLjEDBm8h2B/i, 'GAS dashboard id production'],
  [/SK\s+BAKO\b/i, 'contoh sekolah production'],
  [/SJKC\s+CHUNG\s+HUA/i, 'contoh sekolah production'],
  [/BAKO\s*&\s*MUARA\s+TEBAS/i, 'nama kawasan production'],
  [/RTM\s+SARAWAK/i, 'hab production']
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (allowedExt.has(path.extname(entry.name).toLowerCase()) && full !== __filename) out.push(full);
  }
  return out;
}

const violations = [];
for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const [rx, label] of forbidden) {
    if (rx.test(text)) violations.push(`${path.relative(root, file)}: ${label}`);
  }
}

assert.deepStrictEqual(violations, [], `Public template contains forbidden production material:\n${violations.join('\n')}`);
assert.ok(fs.existsSync(path.join(root, 'wrangler.toml.example')), 'wrangler.toml.example is required');
assert.ok(!fs.existsSync(path.join(root, 'wrangler.toml')), 'wrangler.toml must remain local-only in the public template');
assert.ok(!fs.existsSync(path.join(root, 'private')), 'private/ must never exist in the public template');

console.log('PASS public template safety scan');
