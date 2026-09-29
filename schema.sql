-- PPD-ICT public template — latest structure for a NEW installation.
-- No real PPD data, credentials, tokens or production identifiers are included.

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  nama TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  salt TEXT,
  role TEXT,
  zone_id TEXT,
  status TEXT DEFAULT 'aktif',
  created_by TEXT,
  created_at TEXT,
  last_login_at TEXT,
  must_change_password INTEGER NOT NULL DEFAULT 0,
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  password_changed_at TEXT
);

CREATE TABLE IF NOT EXISTS staff_allowlist (
  email TEXT PRIMARY KEY CHECK (email = lower(trim(email))),
  nama TEXT NOT NULL,
  jawatan TEXT,
  kategori TEXT NOT NULL CHECK (kategori IN ('JTK', 'PPTM')),
  zone_id TEXT,
  status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'gantung')),
  added_by TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT DEFAULT (datetime('now', '+8 hours')),
  admin_email TEXT,
  role TEXT,
  action TEXT,
  target TEXT,
  details TEXT
);

CREATE TABLE IF NOT EXISTS facebook_queue (
  id TEXT PRIMARY KEY,
  report_id TEXT,
  row_ref INTEGER,
  caption TEXT,
  status TEXT DEFAULT 'DITAPIS_SIAP',
  fb_post_id TEXT,
  dicadangkan_oleh TEXT,
  dicipta TEXT,
  dikemaskini TEXT,
  dicipta_pada TEXT,
  meta_json TEXT,
  telegram_chat_id TEXT,
  telegram_message_id TEXT,
  telegram_deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS laporan (
  id TEXT PRIMARY KEY,
  report_type TEXT NOT NULL DEFAULT 'school_visit' CHECK (report_type IN ('school_visit', 'meeting_meb')),
  meeting_subtype TEXT DEFAULT NULL CHECK (meeting_subtype IS NULL OR meeting_subtype IN ('mesyuarat', 'meb')),
  report_details TEXT DEFAULT NULL,
  created_by TEXT DEFAULT NULL,
  timestamp TEXT,
  tarikh TEXT,
  zon TEXT,
  masa_mula TEXT,
  masa_tamat TEXT,
  nama_sekolah TEXT,
  lokasi_lain TEXT,
  pegawai TEXT,
  pegawai_lain TEXT,
  isu TEXT,
  keputusan TEXT,
  tindak_susul TEXT,
  nama_pegawai_sekolah TEXT,
  pelapor TEXT,
  no_isd TEXT,
  pdf_url TEXT,
  link TEXT,
  file_id TEXT,
  preview_link TEXT,
  gambar1 TEXT,
  gambar2 TEXT,
  gambar3 TEXT,
  gambar4 TEXT,
  gambar5 TEXT,
  gambar6 TEXT,
  gambar7 TEXT,
  gambar8 TEXT,
  gambar9 TEXT,
  gambar10 TEXT,
  rumusan_ai TEXT,
  impak_ai TEXT,
  tindak_susul_ai TEXT,
  akauntabiliti TEXT,
  tugas_utama TEXT,
  khidmat_bantu TEXT,
  title TEXT,
  slogan TEXT,
  hashtags TEXT,
  created_at TEXT DEFAULT (datetime('now', '+8 hours')),
  jawatan_pegawai_sekolah TEXT,
  status_kes TEXT,
  objektif TEXT,
  sync_id TEXT,
  tarikh_iso TEXT,
  perlu_semakan TEXT DEFAULT NULL,
  mod TEXT DEFAULT 'lawatan',
  jenis_mesyuarat TEXT DEFAULT NULL,
  dedupe_key TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sekolah (
  nama TEXT PRIMARY KEY,
  kod TEXT,
  zon TEXT,
  kategori TEXT,
  lat REAL,
  lng REAL,
  jarak_km REAL,
  maps_url TEXT,
  maps_pdf TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS short_links (
  slug TEXT PRIMARY KEY,
  target_url TEXT,
  created_at TEXT,
  clicks INTEGER DEFAULT 0,
  last_accessed TEXT,
  destination_url TEXT,
  created_by TEXT,
  created_by_email TEXT,
  created_by_nama TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS tuntutan_draf (
  id TEXT PRIMARY KEY,
  tahun INTEGER NOT NULL,
  bulan INTEGER NOT NULL,
  zon TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draf',
  data_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', '+8 hours')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admins_email_status ON admins(email, status);
CREATE INDEX IF NOT EXISTS idx_staff_allowlist_status ON staff_allowlist(status);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_fb_report_id ON facebook_queue(report_id);
CREATE INDEX IF NOT EXISTS idx_fb_status ON facebook_queue(status);
CREATE INDEX IF NOT EXISTS idx_laporan_deleted_at ON laporan(deleted_at);
CREATE INDEX IF NOT EXISTS idx_laporan_report_type ON laporan(report_type);
CREATE INDEX IF NOT EXISTS idx_laporan_created_by ON laporan(created_by);
CREATE INDEX IF NOT EXISTS idx_laporan_created_by_type ON laporan(created_by, report_type);
CREATE INDEX IF NOT EXISTS idx_laporan_dedupe_active ON laporan(dedupe_key) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_laporan_dedupe_tombstone ON laporan(dedupe_key, deleted_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_laporan_exact_uniq ON laporan(timestamp, lower(nama_sekolah), lower(pelapor));
CREATE INDEX IF NOT EXISTS idx_laporan_no_isd ON laporan(no_isd);
CREATE INDEX IF NOT EXISTS idx_laporan_pegawai ON laporan(pegawai);
CREATE INDEX IF NOT EXISTS idx_laporan_pelapor ON laporan(pelapor);
CREATE INDEX IF NOT EXISTS idx_laporan_sekolah ON laporan(nama_sekolah);
CREATE INDEX IF NOT EXISTS idx_laporan_sekolah_tarikh ON laporan(nama_sekolah, tarikh);
CREATE INDEX IF NOT EXISTS idx_laporan_status_kes ON laporan(status_kes);
CREATE UNIQUE INDEX IF NOT EXISTS idx_laporan_sync_id ON laporan(sync_id) WHERE sync_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_laporan_tarikh ON laporan(tarikh);
CREATE INDEX IF NOT EXISTS idx_laporan_tarikh_iso ON laporan(tarikh_iso);
CREATE INDEX IF NOT EXISTS idx_laporan_zon ON laporan(zon);
CREATE INDEX IF NOT EXISTS idx_laporan_zon_tarikh ON laporan(zon, tarikh);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tuntutan_draf_key ON tuntutan_draf(tahun, bulan, zon);
