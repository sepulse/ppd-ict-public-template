# Migrations

Repo public ini bermula dengan `schema.sql` yang mewakili struktur pemasangan baharu.

- Untuk pemasangan baharu, gunakan `schema.sql` dan kemudian import `data/schools.generated.sql` selepas `npm run configure`.
- Folder ini disediakan untuk migration **baharu selepas versi public pertama**.
- Jangan salin migration production daripada PPD lain kerana ia mungkin mengandungi seed data, nama sekolah atau pembetulan khusus organisasi.
