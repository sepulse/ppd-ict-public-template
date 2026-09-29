# Cloudflare Setup

## 1. Login

```bash
npx wrangler login
```

## 2. Cipta D1

```bash
npx wrangler d1 create ppd-ict-db
```

Cloudflare akan memulangkan `database_id`.

Salin konfigurasi:

### PowerShell

```powershell
Copy-Item wrangler.toml.example wrangler.toml
```

### macOS/Linux

```bash
cp wrangler.toml.example wrangler.toml
```

Masukkan `database_id` yang diberikan Cloudflare ke `wrangler.toml`.

## 3. Inisialisasi schema

```bash
npx wrangler d1 execute ppd-ict-db --remote --file=schema.sql
npm run configure
npx wrangler d1 execute ppd-ict-db --remote --file=data/schools.generated.sql
```

## 4. Secret sesi

Jana secret rawak yang panjang kemudian:

```bash
npx wrangler secret put JWT_SECRET
```

`GEMINI_API_KEY`, `GAS_PDF_SYNC_TOKEN` dan integrasi legacy hanya diperlukan jika ciri berkenaan digunakan.

## 5. Bootstrap Super Admin

Ikut [ADMIN_SETUP.md](ADMIN_SETUP.md).

## 6. Build dan deploy

```bash
npm run build
npx wrangler deploy
```

Tambah custom domain/routes milik PPD anda dalam `wrangler.toml` selepas domain tersedia.
