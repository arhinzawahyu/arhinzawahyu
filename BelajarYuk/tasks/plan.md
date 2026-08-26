# Implementation Plan: BelajarYuk MVP

## Overview

AI Tutor personal untuk mahasiswa: login, kuis onboarding pembentuk persona,
chat adaptif dengan Gemini (streaming), memori kesulitan ("Topik Sulitku"),
dan upload materi kuliah dengan RAG. Stack: Astro (v7, terpasang saat scaffold;
rencana awal menyebut v5) + React islands +
Supabase (Auth, Postgres+pgvector, Storage) + Drizzle ORM + Tailwind.
Referensi desain: `docs/superpowers/specs/2026-08-26-belajaryuk-design.md`,
arah visual: `DESIGN.md`.

## Architecture Decisions

- **Satu proyek Astro** untuk UI + API routes; API key Gemini hanya di server.
- **Supabase** menyediakan Auth, Postgres+pgvector, Storage (keputusan Opsi B).
- **Persona engine = fungsi murni** `(profil, insights, chunks, riwayat) → systemPrompt`;
  prioritas testing tertinggi (snapshot test).
- **Streaming via SSE** dari API route Astro ke React island chat.
- **Vertical slicing**: setiap tugas meninggalkan aplikasi dalam keadaan jalan.
- Semua UI mematuhi `antislop.md` (mode DURING) + `DESIGN.md` (dial ENERGY 1 /
  RHYTHM 2 / MOTION 1–2). Delivery Gate antislop wajib lulus sebelum selesai.

## Task List

### Fase A — Fondasi & Chat Adaptif

#### Task 1: Scaffold proyek & infrastruktur dasar
**Description:** Inisialisasi Astro 5 (adapter Node) + React + Tailwind + Drizzle;
struktur folder (`src/pages`, `src/components/react`, `src/lib`, `src/server`),
env loader (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`),
koneksi Drizzle ke Postgres Supabase, skrip npm (`dev`, `build`, `test`).
**Acceptance criteria:**
- [ ] `npm run dev` menjalankan halaman sambutan bertema gelap `#222222`
- [ ] `npm run build` sukses tanpa error
- [ ] Koneksi DB berhasil (query ping sederhana)
**Verification:** build sukses; query ping DB log sukses; `npm run test` (Vitest terpasang, 1 tes contoh lolos)
**Dependencies:** None
**Files likely touched:** `astro.config.mjs`, `package.json`, `tailwind.config.*`, `src/styles/global.css`, `src/lib/db.ts`, `.env.example`
**Estimated scope:** Medium (3–5 file + konfigurasi)

#### Task 2: Autentikasi (daftar, masuk, keluar) + middleware proteksi
**Description:** Supabase Auth email/password. Halaman `/daftar`, `/masuk`,
middleware validasi session cookie, redirect user belum-login ke `/masuk`.
Tabel `profiles` dibuat otomatis saat registrasi pertama (persona default netral).
**Acceptance criteria:**
- [ ] User bisa daftar, masuk, keluar; session persist antar refresh
- [ ] `/dashboard` tanpa login → redirect `/masuk`
- [ ] State error kredensial salah tampil jelas (bukan silent fail)
**Verification:** alur manual daftar→masuk→keluar; tes integrasi middleware (session invalid → redirect)
**Dependencies:** Task 1
**Files likely touched:** `src/middleware.ts`, `src/pages/daftar.astro`, `src/pages/masuk.astro`, `src/components/react/AuthForm.tsx`, `src/lib/auth.ts`, migration `profiles`
**Estimated scope:** Medium

#### Task 3: Modul kuis onboarding (soal + skoring, fungsi murni)
**Description:** Konfigurasi ±12 pertanyaan pilihan ganda di kode, masing-masing
memetakan jawaban ke skor dimensi persona (`nada_bicara`, `tempo`, `motivasi`: 1–5;
`gaya_penjelasan`: enum). Fungsi `hitungSkor(jawaban) → personaJson` murni + unit test.
Nama 4 arketipe (per dominasi gaya penjelasan) ditetapkan bersama user di sini.
**Acceptance criteria:**
- [ ] `hitungSkor` menghasilkan JSON persona valid untuk kombinasi jawaban apa pun
- [ ] Unit test mencakup kasus ekstrem (semua jawaban seragam, campuran)
**Verification:** `npm run test -- kuis`
**Dependencies:** None (paralel dengan Task 2)
**Files likely touched:** `src/lib/kuis/soal.ts`, `src/lib/kuis/skor.ts`, `src/lib/kuis/skor.test.ts`
**Estimated scope:** Small

#### Task 4: Alur kuis onboarding (UI + API)
**Description:** Halaman `/onboarding` (React island, satu pertanyaan per layar,
progress ringan ala dial tenang) + `POST /api/persona` menyimpan hasil ke
`profiles.persona_json`. Selesai kuis → reveal tipe (reveal halus, MOTION 2)
→ masuk dashboard. Kuis bisa dilewati (persona default).
**Acceptance criteria:**
- [ ] User baru otomatis diarahkan ke `/onboarding` setelah daftar
- [ ] Hasil tersimpan dan tampil benar di dashboard (label tipe)
- [ ] Lewati kuis menghasilkan persona default yang valid
**Verification:** alur manual 2× (isi penuh & lewati); cek baris `profiles`
**Dependencies:** Task 2, Task 3
**Files likely touched:** `src/pages/onboarding.astro`, `src/components/react/KuisOnboarding.tsx`, `src/pages/api/persona.ts`, komponen reveal
**Estimated scope:** Medium

#### Checkpoint A1
- [ ] Build + test hijau
- [ ] Alur daftar → kuis → dashboard berjalan end-to-end
- [ ] Review visual bersama user (token warna, nuansa tenang)

#### Task 5: Persona engine (kompilator system prompt)
**Description:** Fungsi murni `susunPrompt({profil, insights, chunks, riwayat}) → string`
dengan 4 lapis (dasar / persona / memori kesulitan / RAG). Lapis 3–4 menerima array
kosong di fase ini. Snapshot test: setiap dimensi persona mengubah output prompt
secara terverifikasi.
**Acceptance criteria:**
- [ ] Perubahan tiap dimensi profil menghasilkan instruksi berbeda di Lapis 2
- [ ] Insights/chunks kosong tidak merusak output
**Verification:** `npm run test -- persona-engine` (snapshot)
**Dependencies:** Task 3 (tipe persona)
**Files likely touched:** `src/server/personaEngine.ts`, `src/server/personaEngine.test.ts`
**Estimated scope:** Small

#### Task 6: Service Gemini + endpoint chat streaming
**Description:** `src/server/gemini.ts` (satu pintu ke Gemini: chat streaming +
embedding + panggilan JSON untuk ekstraksi; mudah di-mock). `POST /api/chat`
menerima `{conversationId?, pesan, materiId?}`, menyimpan messages, mengembalikan
stream SSE. Riwayat dibatasi 12 pesan terakhir. Error rate-limit → retry 1×.
**Acceptance criteria:**
- [ ] Curl terhadap `/api/chat` menerima stream teks bertahap
- [ ] Pesan user & jawaban final tersimpan di `conversations`/`messages`
- [ ] Tanpa `GEMINI_API_KEY` → error 503 dengan pesan jelas (tidak crash)
**Verification:** curl manual; tes integrasi dengan mock service
**Dependencies:** Task 1, Task 5
**Files likely touched:** `src/server/gemini.ts`, `src/pages/api/chat.ts`, migration `conversations`+`messages`
**Estimated scope:** Medium

#### Task 7: UI chat (React island)
**Description:** `/chat` — daftar percakapan (sidebar tipis), area percakapan,
input, render streaming, auto-scroll, tombol kirim disabled saat menunggu.
Empty/loading/error state lengkap (R-27). Keyboard: Enter kirim, Shift+Enter baris baru,
focus ring `#CAC426` (R-32). Bubble user `ink` tinted, jawaban AI di permukaan polos.
**Acceptance criteria:**
- [ ] Percakapan baru & lanjutan berfungsi dengan streaming tampak real-time
- [ ] Tiga state (kosong/muat/gagal+coba lagi) ada dan benar
- [ ] Navigasi keyboard penuh; mobile tidak overflow (tap target ≥44px)
**Verification:** manual desktop+viewport mobile; tes komponen state gagal
**Dependencies:** Task 6
**Files likely touched:** `src/pages/chat.astro`, `src/components/react/Chat*.tsx`, hook stream
**Estimated scope:** Large → dipecah: 7a struktur+state dasar, 7a selesai dulu, 7b polish interaksi

#### Task 8: Kuota harian per user
**Description:** Middleware cek `usage_daily` (batas default 25 req chat/hari);
increment pada setiap panggilan `/api/chat`; respons 429 ramah + jam reset.
Widget kuota disiapkan untuk dashboard (Task 10).
**Acceptance criteria:**
- [ ] Permintaan ke-26 hari itu ditolak dengan pesan ramah
- [ ] Counter reset otomatis di hari berikutnya (unik per user+tanggal)
**Verification:** tes integrasi (seed counter mendekati batas)
**Dependencies:** Task 6
**Files likely touched:** `src/middleware.ts`, migration `usage_daily`, `src/lib/kuota.ts`
**Estimated scope:** Small

#### Checkpoint A2 (rilis internal pertama)
- [ ] End-to-end: daftar → kuis → chat adaptif dengan nada/gaya berbeda antar persona
- [ ] Evaluasi manual: 1 set pertanyaan × ≥3 persona, jawaban jelas berbeda gaya
- [ ] Review dengan user sebelum Fase B

### Fase B — Memori Kesulitan

#### Task 9: Ekstraksi insight akhir sesi
**Description:** Tombol "Akhiri sesi" (atau idle >30 mnt) memicu
`POST /api/insight/ekstrak`: transkrip dikirim ke Gemini (mode JSON) → daftar
topik sulit → upsert `insights` (hindari duplikat topik per user).
**Acceptance criteria:**
- [ ] Percakapan berisi "aku bingung rekursi" menghasilkan insight topik rekursi
- [ ] Ekstraksi ulang tidak menduplikasi topik yang sama
**Verification:** tes integrasi dengan respons Gemini dimock
**Dependencies:** Task 6
**Files likely touched:** `src/pages/api/insight/ekstrak.ts`, migration `insights`, `src/server/gemini.ts` (mode JSON)
**Estimated scope:** Medium

#### Task 10: Dashboard CRM-style
**Description:** `/dashboard`: sidebar (Chat, Materiku, Topik Sulitku, Pengaturan —
hanya item yang benar-benar ada, R-24) + grid widget: kuota harian, percakapan
terakhir, Topik Sulitku (tandai selesai/hapus), kartu profil tipe (+ubah gaya).
Semua widget punya empty/loading/error state. Data-dense tapi rapi (dial ENERGY 1).
**Acceptance criteria:**
- [ ] Keempat widget tampil data nyata dari DB
- [ ] Topik Sulitku bisa ditandai selesai & hilang dari daftar aktif
- [ ] Mobile: sidebar menjadi navigasi bawah/atas yang tetap usable
**Verification:** manual desktop+mobile; cek tiga state per widget
**Dependencies:** Task 8 (data kuota), Task 9 (insights)
**Files likely touched:** `src/pages/dashboard.astro`, `src/components/react/Dashboard*.tsx`
**Estimated scope:** Large → pecah: 10a layout+profil+percakapan, 10b topik sulitku+aksi

#### Task 11: Follow-up dari Topik Sulitku
**Description:** Tombol "Latih lagi" pada item insight membuka percakapan baru
dengan pesan pembuka berkonteks topik tersebut; persona engine otomatis
menurunkan tempo & meminta pendekatan beda (via Lapis 3).
**Acceptance criteria:**
- [ ] Klik "Latih lagi" → chat terbuka dengan konteks topik terlihat pada jawaban AI
**Verification:** manual 1 skenario end-to-end
**Dependencies:** Task 9, Task 7
**Files likely touched:** `src/components/react/TopikSulitku.tsx`, util deep-link chat
**Estimated scope:** Small

#### Checkpoint B
- [ ] Insight muncul otomatis, dipakai sesi berikutnya, terkelola di dashboard
- [ ] Review dengan user

### Fase C — Upload Materi (RAG)

#### Task 12: Upload & kelola materi
**Description:** `/materi` — form upload (pdf/pptx ≤20MB) → Supabase Storage →
baris `materi` status `processing`. Daftar materi (tabel) + status badge fungsional
+ hapus. Validasi tipe/ukuran; pesan jelas untuk file ditolak.
**Acceptance criteria:**
- [ ] Upload pdf valid → entri muncul status processing→ready (dummy parse dulu boleh)
- [ ] File >20MB / tipe salah → ditolak dengan pesan spesifik
**Verification:** manual 3 kasus (valid, terlalu besar, tipe salah)
**Dependencies:** Task 1
**Files likely touched:** `src/pages/materi.astro`, `src/pages/api/materi/index.ts`, migration `materi`, komponen tabel
**Estimated scope:** Medium

#### Task 13: Parse, chunk, embed, simpan vektor
**Description:** Worker pasca-upload: ekstrak teks per halaman (PDF teks; PPTX),
chunk ±800 karakter overlap ±100 (fungsi murni + test), embedding
`text-embedding-004`, simpan ke `materi_chunks` (pgvector, indeks HNSW).
Status gagal-parse (PDF scan) → `failed` + alasan.
**Acceptance criteria:**
- [ ] PDF teks → chunk ter-embed, jumlah & ukuran konsisten (unit test chunking)
- [ ] PDF hasil scan → status failed dengan alasan terbaca user
**Verification:** `npm run test -- chunk`; manual upload 2 jenis PDF
**Dependencies:** Task 12
**Files likely touched:** `src/server/pipeline/{parse,chunk,embed}.ts`, migration `materi_chunks`
**Estimated scope:** Medium

#### Task 14: Chat dengan konteks materi (RAG retrieval)
**Description:** Di chat, pemilih materi (opsional). Saat aktif: embedding
pertanyaan → top-5 chunk (filter ketat user_id+materi_id) → Lapis 4 prompt →
jawaban menyebut sumber halaman. Jika materi masih `processing` → info jelas.
**Acceptance criteria:**
- [ ] Pertanyaan tentang isi file terpilih dijawab akurat + sitasi halaman
- [ ] Materi user lain tidak pernah masuk hasil pencarian (tes isolasi)
**Verification:** tes integrasi search (mock embedding) + manual end-to-end
**Dependencies:** Task 13, Task 7
**Files likely touched:** `src/server/rag.ts`, `src/pages/api/chat.ts`, `PemilihMateri.tsx`
**Estimated scope:** Medium

#### Checkpoint C
- [ ] Siklus penuh: upload → ready → tanya isi file → jawaban tersitasi
- [ ] Review dengan user

### Fase D — Polish Publik & Gerbang Kelulusan

#### Task 15: Landing page scrollytelling halus
**Description:** Satu halaman publik bercerita ("kenapa tutor harus mengenalmu dulu")
dengan reveal lembut (MOTION 2, transform/opacity saja, `prefers-reduced-motion`
dihormati), demo pergantian gaya jawaban antar persona sebagai momen inti,
CTA spesifik (bukan "Get Started"). Copywriting melewati filter antislop-copywriting:
tanpa em dash, tanpa buzzword, tanpa statistik/testimoni palsu (belum ada data nyata).
Struktur section mengikuti narasi produk (R-05), bukan template hero-kartu.
**Acceptance criteria:**
- [ ] Semua klaim di landing dapat dipertanggungjawabkan; nol angka palsu
- [ ] Reveal hanya transform/opacity; reduced-motion mematikan animasi
- [ ] Navbar hanya menautkan bagian yang ada (R-24)
**Verification:** audit antislop blok Hard Gate; mobile viewport check
**Dependencies:** Task 4 (label arketipe nyata untuk demo)
**Files likely touched:** `src/pages/index.astro`, komponen reveal, `public/` font
**Estimated scope:** Large → pecah: 15a struktur+copy, 15b motion+polish

#### Task 16: Tipografi final, aksesibilitas, mobile sweep
**Description:** Putuskan pasangan font bersama user (opsi + alasan diajukan,
keputusan tetap milik user per DESIGN.md), terapkan scale tipografi, audit
kontras semua kombinasi (R-25), keyboard sweep seluruh alur (R-32), uji 375px/
768px/1440px (R-03), lengkapi meta SEO dasar.
**Acceptance criteria:**
- [ ] Nol pelanggaran kontras AA; fokus terlihat di semua kontrol
- [ ] Tidak ada horizontal overflow di 3 breakpoint
**Verification:** checklist manual + lighthouse a11y ≥95
**Dependencies:** Task 15
**Files likely touched:** `global.css`, `tailwind.config`, font assets
**Estimated scope:** Medium

#### Task 17: Evaluasi kualitas AI + Delivery Gate antislop + rilis
**Description:** Jalankan suite evaluasi (set pertanyaan tetap × persona × 2 bahasa
formalitas), catat temuan, sesuaikan prompt jika perlu. Jalankan Delivery Gate
antislop penuh (Hard Gate, Purpose-Gate, Liveliness, Craftsmanship) dan lampirkan
laporan PASS/FAIL. Build produksi + smoke test deployment.
**Acceptance criteria:**
- [ ] Laporan gate antislop: semua PASS dengan bukti
- [ ] `npm run build` sukses; app jalan di mode produksi
**Verification:** dokumen `anti-slop/gate-report.md` + log deploy
**Dependencies:** Semua sebelumnya
**Estimated scope:** Medium

#### Checkpoint Akhir
- [ ] Seluruh acceptance criteria spesifikasi §2 terpenuhi
- [ ] Siap dirilis ke pengguna awal kampus

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| PDF hasil scan tak terbaca | Sedang | Terdeteksi eksplisit → status failed + pesan panduan (Task 13) |
| Rate limit kuota gratis Gemini habis di jam sibuk | Sedang | Retry 1×, antrean ringan, kuota harian membatasi total beban |
| Streaming SSE di edge/hosting tertentu bermasalah | Sedang | Adapter Node; fallback polling sederhana bila perlu |
| Scope creep fitur tambahan | Tinggi | Semua ide baru masuk backlog fase 2, tidak masuk MVP |
| Kualitas adaptasi persona terasa samar | Tinggi | Suite evaluasi Task 17 + snapshot prompt per dimensi sejak Task 5 |

## Open Questions (untuk user, bukan blocker implementasi awal)

1. Nama 4 arketipe persona (dibutuhkan saat Task 3; usulan akan diajukan).
2. Pilihan tipografi final (Task 16; opsi + alasan akan diajukan).
3. Domain/deploy target (Vercel vs Netlify vs VPS) — boleh memilih saat Task 17.
