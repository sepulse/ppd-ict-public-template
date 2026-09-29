# Customization

## Branding

Edit `config/organization.json` untuk:

- nama sistem;
- nama penuh dan nama pendek PPD;
- domain root/dashboard/admin/PTIS;
- koordinat hab PPD;
- timezone;
- integrasi pilihan.

Kemudian jalankan:

```bash
npm run configure
```

## Zon

Edit `config/zones.json`. Versi UI semasa direka berasaskan lapan slot zon utama + `ZON PPD`; nama kawasan dan warna boleh ditukar tanpa menyentuh Worker.

## Logo

Ikon aplikasi berada di `icons/`. Ganti fail dengan saiz/nama yang sama untuk branding organisasi.

Untuk kembali kepada ikon ICT generik bawaan:

```bash
npm run icons:generate
```

Logo sekolah adalah pilihan. Jika digunakan, letakkan thumbnail PNG di:

```text
school_logos/thumbnails/<KOD_SEKOLAH>.png
```

Jika logo tidak tersedia, peta memaparkan kod sekolah sebagai fallback.

## Integrasi

Facebook, Telegram, AI dan Google Apps Script bukan syarat untuk modul asas. Biarkan nilai integration kosong atau feature dimatikan sehingga credential organisasi siap.
