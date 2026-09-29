# Import Sekolah dan Pegawai

## Sekolah

Edit `data/schools.example.csv` dengan kolum:

```text
nama,kod,zon,kategori,lat,lng,jarak_km
```

`zon` mesti sepadan dengan ID dalam `config/zones.json`.

`lat` dan `lng` digunakan oleh peta/radar. `jarak_km` boleh dibiarkan kosong jika modul tuntutan belum digunakan.

Selepas edit:

```bash
npm run configure
```

Kemudian import SQL yang dijana:

```bash
npx wrangler d1 execute ppd-ict-db --remote --file=data/schools.generated.sql
```

## Pegawai

Edit `data/officers.example.csv`:

```text
nama,jawatan,kategori,zon,email
```

E-mel tidak dimasukkan ke browser runtime oleh generator. Pengurusan akaun dan allowlist production hendaklah dibuat melalui portal Admin/D1 setempat.
