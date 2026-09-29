# Pemasangan

## Keperluan

- Node.js 20 atau lebih baharu
- Akaun Cloudflare
- Wrangler CLI melalui `npx wrangler`
- Domain sendiri adalah pilihan untuk percubaan, tetapi disyorkan untuk production

## 1. Pasang dependency

```bash
npm install
```

## 2. Konfigurasi organisasi

Edit:

- `config/organization.json`
- `config/zones.json`
- `data/schools.example.csv`
- `data/officers.example.csv`

Kemudian:

```bash
npm run configure
```

Arahan ini menjana konfigurasi browser, runtime build dan `data/schools.generated.sql`.

## 3. Uji local

```bash
npm test
npm run build
npm run dev
```

Local dev server menyediakan frontend pada port `8787` secara default. API remote dinyahaktifkan secara default.

## 4. Sediakan Cloudflare

Teruskan dengan [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md).
