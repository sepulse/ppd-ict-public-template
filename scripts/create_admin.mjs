import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const name = String(process.env.ADMIN_NAME || 'Pentadbir Utama').trim();
const password = String(process.env.ADMIN_PASSWORD || '');

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('Tetapkan ADMIN_EMAIL kepada alamat e-mel yang sah.');
}
if (password.length < 10) {
  throw new Error('Tetapkan ADMIN_PASSWORD sekurang-kurangnya 10 aksara.');
}

const esc = value => `'${String(value).replaceAll("'", "''")}'`;
const hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
const id = 'usr_superadmin';
const sql = [
  '-- Generated locally by scripts/create_admin.mjs. Do not commit this file.',
  'INSERT OR REPLACE INTO admins (id, nama, email, password_hash, role, zone_id, status, created_by, created_at, must_change_password)',
  `VALUES (${esc(id)}, ${esc(name)}, ${esc(email)}, ${esc(hash)}, 'SUPER_ADMIN', '', 'Aktif', 'BOOTSTRAP', datetime('now', '+8 hours'), 0);`,
  ''
].join('\n');

const output = path.join(process.cwd(), 'data', 'admin.generated.sql');
fs.writeFileSync(output, sql, 'utf8');
console.log(`Admin bootstrap SQL generated: ${path.relative(process.cwd(), output)}`);
