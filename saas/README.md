# BukuKas — NestJS + SQLite + PWA

Buku kas tenang. Catat pembelian, lihat sisa uang. Database SQLite via NestJS.

## Jalan lokal
```bash
cd api && npm install && npm run start   # http://localhost:3000/api/health
# frontend
python -m http.server 8000  # buka http://localhost:8000/index.html
# API URL disimpan di localStorage key bukukas.api (default localhost:3000/api)
```

## Endpoint NestJS
- `GET /api/health` — cek hidup
- `GET /api/tx?q=&cat=` — list transaksi
- `POST /api/tx` — {title, amount, cat, date, type:in|out}
- `DELETE /api/tx/:id`
- `GET /api/setting/saldo-awal` / `POST /api/setting/saldo-awal` {saldoAwal}
- `GET /api/setting/summary` — {saldoAwal,sumIn,sumOut,saldo}

## Jadi APK
APK dibuild di GitHub Actions (tanpa JDK lokal): push ke master → Actions → Build BukuKas APK → download artifact `bukukas-debug-apk`.

## Offline
Tanpa API, frontend fallback ke localStorage `bukukas.v1`. Saat API hidup, data NestJS yang dipakai.
