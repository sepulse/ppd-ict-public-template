# Setup Pentadbir

Untuk pemasangan baru, jana satu fail SQL bootstrap secara local.

## PowerShell

```powershell
$env:ADMIN_EMAIL="admin@contoh.gov.my"
$env:ADMIN_NAME="Pentadbir Utama"
$env:ADMIN_PASSWORD="GantiDenganKataLaluanKuat"
npm run admin:bootstrap
```

## macOS/Linux

```bash
ADMIN_EMAIL="admin@contoh.gov.my" \
ADMIN_NAME="Pentadbir Utama" \
ADMIN_PASSWORD="GantiDenganKataLaluanKuat" \
npm run admin:bootstrap
```

Ini menghasilkan `data/admin.generated.sql`. Fail tersebut diabaikan oleh Git.

Import:

```bash
npx wrangler d1 execute ppd-ict-db --remote --file=data/admin.generated.sql
```

Selepas berjaya log masuk, urus pengguna seterusnya melalui Portal Admin dan padam salinan tempatan `data/admin.generated.sql` apabila tidak lagi diperlukan.
