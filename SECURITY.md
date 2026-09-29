# Security

## Sebelum deploy

- Gunakan D1 database baharu untuk setiap organisasi.
- Jana `JWT_SECRET` rawak dan simpan sebagai Cloudflare Worker secret.
- Semak semua akaun awal dan paksa amalan kata laluan organisasi yang sesuai.
- Jangan commit `wrangler.toml`, `.dev.vars`, `.env`, `data/*.generated.sql` atau eksport D1.
- Aktifkan integrasi Facebook, Telegram, Gemini atau Google Apps Script hanya selepas credential disimpan melalui mekanisme secret/config yang sesuai.

## Data peribadi

Repo public hanya menyediakan data contoh. Nama pegawai, e-mel, laporan, gambar, rekod sekolah dalaman dan credential organisasi hendaklah berada dalam database/config setempat yang tidak dikomit.

## Local development

`npm run dev` tidak menghubungi API remote secara default. Untuk membaca backend remote secara sengaja, tetapkan `PPD_ENABLE_REMOTE_PROXY=1` dan pastikan domain dalam `config/organization.json` ialah milik organisasi anda.

## Melaporkan isu keselamatan

Jangan masukkan token, kata laluan, data staf atau rekod sebenar dalam GitHub Issue awam. Gunakan saluran private maintainer repo bagi laporan yang mengandungi maklumat sensitif.
