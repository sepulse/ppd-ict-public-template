// Jana SQL seed staff_allowlist dari private/staff_allowlist.csv.
// Skrip public ini hanya menulis fail SQL untuk semakan; ia tidak menjalankan Wrangler.
//
// Guna:
//   node scripts/seed_staff_allowlist.js -> jana SQL sahaja
//
// CSV columns (header wajib): email,nama,jawatan,kategori

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'private', 'staff_allowlist.csv');
const OUT_SQL_PATH = path.join(__dirname, '..', 'private', 'staff_allowlist_seed.sql');
const MAX_ROWS = 200;

function parseCsvLine(line) {
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
  return cells.map((c) => c.trim());
}

function sqlEscape(value) {
  return String(value == null ? '' : value).replace(/'/g, "''");
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`Tak jumpa ${CSV_PATH}. Siapkan CSV dahulu (kolum: email,nama,jawatan,kategori).`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    console.error('CSV kosong.');
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idx = {
    email: header.indexOf('email'),
    nama: header.indexOf('nama'),
    jawatan: header.indexOf('jawatan'),
    kategori: header.indexOf('kategori'),
  };
  if (idx.email === -1 || idx.nama === -1 || idx.kategori === -1) {
    console.error('CSV wajib ada lajur: email,nama,kategori (jawatan optional).');
    process.exit(1);
  }

  const dataRows = lines.slice(1);
  if (dataRows.length > MAX_ROWS) {
    console.error(`Terlalu banyak baris (${dataRows.length}). Had ${MAX_ROWS} baris sekali import.`);
    process.exit(1);
  }

  const seenEmails = new Set();
  const values = [];
  const errors = [];

  dataRows.forEach((line, i) => {
    const rowNum = i + 2; // +2: 1-based + header line
    const cells = parseCsvLine(line);
    const email = (cells[idx.email] || '').trim().toLowerCase();
    const nama = (cells[idx.nama] || '').trim();
    const jawatan = idx.jawatan !== -1 ? (cells[idx.jawatan] || '').trim() : '';
    const kategori = (cells[idx.kategori] || '').trim().toUpperCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(`Baris ${rowNum}: email tidak sah ("${email}")`);
      return;
    }
    if (!nama) {
      errors.push(`Baris ${rowNum}: nama kosong (${email})`);
      return;
    }
    if (kategori !== 'JTK' && kategori !== 'PPTM') {
      errors.push(`Baris ${rowNum}: kategori mesti JTK/PPTM ("${kategori}", ${email})`);
      return;
    }
    if (seenEmails.has(email)) {
      errors.push(`Baris ${rowNum}: email pendua dalam CSV (${email})`);
      return;
    }
    seenEmails.add(email);

    values.push(
      `('${sqlEscape(email)}', '${sqlEscape(nama)}', '${sqlEscape(jawatan)}', '${sqlEscape(kategori)}', 'aktif', 'seed_staff_allowlist.js', datetime('now', '+8 hours'), datetime('now', '+8 hours'))`
    );
  });

  if (errors.length > 0) {
    console.error(`${errors.length} ralat dalam CSV — betulkan dahulu, tiada SQL dijana:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  if (values.length === 0) {
    console.error('Tiada baris sah untuk seed.');
    process.exit(1);
  }

  const sql = `INSERT INTO staff_allowlist (email, nama, jawatan, kategori, status, added_by, created_at, updated_at)\nVALUES\n${values.join(',\n')}\nON CONFLICT(email) DO UPDATE SET\n  nama = excluded.nama,\n  jawatan = excluded.jawatan,\n  kategori = excluded.kategori,\n  updated_at = excluded.updated_at;\n`;

  fs.writeFileSync(OUT_SQL_PATH, sql, 'utf8');
  console.log(`SQL dijana: ${OUT_SQL_PATH} (${values.length} staf).`);

  console.log('Semak fail SQL sebelum menjalankannya secara manual dengan Wrangler.');
}

main();
