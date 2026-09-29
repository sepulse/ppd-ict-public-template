# PPD-ICT Public Template

Template sumber terbuka untuk Pejabat Pendidikan Daerah (PPD) membina portal pengurusan ICT berasaskan sistem PTIS/JTK. Ia menyediakan borang lawatan, dashboard, peta/radar sekolah, PWA luar talian, pentadbiran, audit, QR/short URL dan integrasi pilihan Facebook/Telegram.

Repo ini ialah versi **disanitasi untuk penggunaan semula**. Ia tidak mengandungi sejarah Git, akaun, token, kata laluan, senarai pegawai, sekolah, koordinat atau konfigurasi production daripada PPD asal.

## Stack

- Frontend: HTML, CSS dan Vanilla JavaScript
- Backend: Cloudflare Workers
- Database: Cloudflare D1
- PWA: Service Worker + offline queue
- Peta: Leaflet

## Mula cepat

```bash
npm install
npm run configure
npm test
npm run build
```

Kemudian:

1. Edit `config/organization.json`.
2. Edit `config/zones.json`.
3. Ganti kandungan `data/schools.example.csv` dan `data/officers.example.csv` dengan data PPD anda.
4. Jalankan semula `npm run configure`.
5. Salin `wrangler.toml.example` kepada `wrangler.toml` dan isi D1 database ID anda.
6. Ikut [panduan pemasangan](docs/INSTALLATION.md) dan [setup Cloudflare](docs/CLOUDFLARE_SETUP.md).

## Struktur konfigurasi

```text
config/
  organization.json       Nama PPD, domain, hab, feature dan integration
  zones.json              Zon operasi

data/
  schools.example.csv     Sekolah, kod, zon dan GPS
  officers.example.csv    Pegawai dan zon
```

`npm run configure` menjana fail runtime yang digunakan oleh frontend dan SQL import sekolah. Fail generated yang boleh mengandungi konfigurasi setempat tidak perlu dikomit.

## Modul utama

- Dashboard analitik lawatan dan isu ICT
- Borang PTIS dengan sokongan offline
- Portal Admin dengan RBAC dan audit log
- Peta dan radar geospatial sekolah
- QR + short URL
- PWA
- Tuntutan perjalanan
- Facebook Studio dan Telegram sebagai integrasi pilihan

## Model zon

Versi public pertama mengekalkan reka bentuk visual asal dengan lapan slot zon utama dan `ZON PPD` sebagai default. Nama/kawasan/warna dan data sekolah boleh ditukar melalui config. Untuk PPD yang mempunyai struktur zon yang sangat berbeza, beberapa komponen dashboard lama mungkin memerlukan penyesuaian UI tambahan.

## Keselamatan

- Jangan commit `.env`, `.dev.vars`, `wrangler.toml`, token atau fail generated admin.
- Gunakan `wrangler secret put JWT_SECRET` untuk secret sesi.
- Integrasi luar dinyahaktif atau kosong secara default.
- Local dev server tidak proxy ke backend jauh kecuali `PPD_ENABLE_REMOTE_PROXY=1` ditetapkan secara eksplisit.

Lihat [SECURITY.md](SECURITY.md) sebelum deploy production.

## Lesen

MIT — lihat [LICENSE](LICENSE).
