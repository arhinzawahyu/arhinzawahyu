# Todo — BelajarYuk MVP

Rencana lengkap (kriteria, verifikasi, file): lihat `tasks/plan.md`.
Mode kerja: antislop DURING + DESIGN.md (ENERGY 1 / RHYTHM 2 / MOTION 1–2).

## Fase A — Fondasi & Chat Adaptif

- [x] Task 1: Scaffold proyek & infrastruktur dasar (Astro+React+Tailwind+Drizzle+Supabase)
- [ ] Task 2: Autentikasi daftar/masuk/keluar + middleware proteksi
- [ ] Task 3: Modul kuis onboarding — soal & skoring (fungsi murni + test) *(butuh: nama arketipe)*
- [ ] Task 4: Alur kuis onboarding UI + API persona
- [ ] **Checkpoint A1:** build+test hijau; alur daftar→kuis→dashboard E2E; review visual bersama user
- [ ] Task 5: Persona engine — kompilator system prompt 4 lapis (snapshot test)
- [ ] Task 6: Service Gemini + endpoint `/api/chat` streaming SSE
- [ ] Task 7a: UI chat — struktur, state dasar, render streaming
- [ ] Task 7b: UI chat — polish interaksi, 3 state, keyboard, mobile
- [ ] Task 8: Kuota harian per user (`usage_daily` + middleware)
- [ ] **Checkpoint A2:** chat adaptif terasa beda antar persona (evaluasi manual ≥3 persona); review user

## Fase B — Memori Kesulitan

- [ ] Task 9: Ekstraksi insight akhir sesi → tabel `insights`
- [ ] Task 10a: Dashboard CRM — layout sidebar + widget profil/kuota/percakapan
- [ ] Task 10b: Dashboard CRM — Topik Sulitku + aksi selesai/hapus
- [ ] Task 11: Follow-up "Latih lagi" dari Topik Sulitku
- [ ] **Checkpoint B:** insight otomatis terpakai di sesi berikutnya; review user

## Fase C — Upload Materi (RAG)

- [ ] Task 12: Upload & kelola materi (Storage + status processing/ready/failed)
- [ ] Task 13: Parse → chunk → embed → pgvector (+ deteksi PDF scan)
- [ ] Task 14: Chat dengan konteks materi (top-5 retrieval + sitasi halaman)
- [ ] **Checkpoint C:** siklus upload→tanya isi file→jawaban tersitasi; review user

## Fase D — Polish Publik & Gerbang Kelulusan

- [ ] Task 15a: Landing scrollytelling halus — struktur + copywriting (filter antislop)
- [ ] Task 15b: Landing — motion halus + polish (reduced-motion dihormati)
- [ ] Task 16: Tipografi final *(keputusan user)* + audit kontras + keyboard + mobile sweep
- [ ] Task 17: Evaluasi kualitas AI + Delivery Gate antislop (laporan PASS) + build produksi

## Checkpoint Akhir

- [ ] Semua acceptance criteria spesifikasi §2 terpenuhi
- [ ] Siap rilis ke pengguna awal kampus
