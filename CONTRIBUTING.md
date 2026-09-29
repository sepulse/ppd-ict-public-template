# Contributing

Sumbangan yang membantu PPD lain menggunakan sistem ini dialu-alukan.

Sebelum membuka pull request:

```bash
npm install
npm test
npm run build
```

Pastikan perubahan:

- tidak menambah credential atau data organisasi sebenar;
- tidak menghardcode nama PPD, domain, sekolah atau pegawai;
- menggunakan `config/` dan `data/` untuk perkara yang berbeza antara PPD;
- mengekalkan sokongan PWA/offline dan kawalan akses sedia ada;
- mempunyai dokumentasi ringkas jika menambah langkah setup baharu.
