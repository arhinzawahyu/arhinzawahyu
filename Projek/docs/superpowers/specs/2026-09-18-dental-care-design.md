# Dental Care Website — PRD / Design Spec

**Tanggal:** 2026-09-18
**Stack lock:** Next.js 14 (App Router, TypeScript) + Supabase (Postgres + Auth + Storage) + Lenis + Vercel
**Scope:** A+B+C — Company Profile + Booking + Edukasi/SEO. Slice MVP = A + B inti (tanpa payment). v2 = blog/CMS/testimoni. Nanti = multi-cabang/rekam medis.
**Status:** Draft — menunggu jawaban Open Questions

---

## 1. Problem Statement

**Siapa dirugikan:** (a) Pasien umum dan keluarga yang butuh informasi layanan, harga transparan, profil dokter, dan jadwal yang akurat sebelum booking; (b) Admin klinik yang kebanjiran chat WA/telepon tanpa pencatatan, double-booking, dan no-show.

**Kenapa:** Klinik gigi tidak punya website yang memadai — info tersebar di Instagram/Google Maps/WA. Pasien ragu soal harga dan dokter tersedia, booking tidak tercatat, SEO kalah dari kompetitor. Akibat: akuisisi rendah, operasional berantakan, kepercayaan pasien rendah.

---

## 2. Target User + 2 Persona

**Segmen primer:** Dewasa 20-45 tahun di kota, cari klinik gigi via Google/Instagram, booking via HP luar jam kerja.

### Persona 1 — Dina, 28, pekerja kantoran (estetika)
- Goals: whitening/veneer, butuh before-after, harga transparan, booking cepat via HP.
- Frustasi: harga tidak jelas, jadwal dokter tidak update, harus telpon.
- Perilaku: riset via Google/IG, bandingkan 2-3 klinik, booking malam hari.

### Persona 2 — Sari, 34, ibu 2 anak (keluarga)
- Goals: klinik ramah anak dekat rumah, jadwal dokter jelas, booking keluarga tanpa antre lama.
- Frustasi: takut antre lama, anak rewel, info dokter anak tidak ada.
- Perilaku: cari klinik terdekat via Maps, cek review, booking H-1 via WA.

**Secondary user:** Admin Klinik — kelola layanan/dokter/jadwal, konfirmasi/batal janji, kelola konten promo/artikel. Butuh panel sederhana.

---

## 3. Goals dan Non-Goals

**Goals MVP:**
- G1: Visitor → request janji < 3 klik dari landing.
- G2: Admin konfirmasi/batal < 10 menit.
- G3: SEO dasar + Lenis smooth UX, Lighthouse Performance > 90, mobile perfect.
- G4: Validasi slot anti bentrok, rate-limit anti spam.

**Non-Goals MVP (eksplisit tidak dikerjakan):**
- Payment online / DP, rekam medis, multi-cabang, chat realtime, login sosmed, mobile app native, integrasi BPJS/asuransi, loyalty. Masuk v2/nanti.

---

## 4. User Stories

1. Sebagai visitor saya ingin melihat daftar layanan + harga supaya membandingkan sebelum booking.
2. Sebagai visitor saya ingin melihat profil dokter + spesialisasi + jadwal supaya memilih dokter yang tersedia.
3. Sebagai visitor saya ingin booking dengan memilih layanan/dokter/tanggal/jam + isi WA/keluhan supaya dapat slot tanpa telpon.
4. Sebagai visitor saya ingin membaca artikel edukasi supaya percaya klinik kompeten.
5. Sebagai visitor saya ingin melihat alamat, Maps, jam operasional, dan CTA WA supaya datang tanpa tersesat.
6. Sebagai admin saya ingin login dan mengelola layanan/dokter/jadwal supaya info selalu update.
7. Sebagai admin saya ingin approve/tolak/reschedule janji supaya kapasitas terkontrol dan pasien dapat notifikasi.

---

## 5. Daftar Fitur — MVP / v2 / Nanti

**MVP (must-have untuk launch):**
- Landing elegan + navigasi Lenis, katalog layanan, profil dokter + jadwal mingguan, form booking (create pending → admin confirm/cancel), panel admin auth (email+password, role admin), kontak/WA/Maps embed, SEO dasar (metadata, sitemap, OG).

**v2 (nice-to-have setelah validasi):**
- Blog/CMS artikel edukasi, testimoni/promo/banner, dashboard analitik kunjungan, notifikasi email/WA via Edge Function, captcha/rate-limit hardening.

**Nanti:**
- Multi-cabang, pembayaran DP, rekam medis pasien, loyalty/paket, integrasi asuransi, PWA.

---

## 6. Functional Requirements Detail per Fitur MVP

**FR1 — Katalog Layanan**
- CRUD: name, slug, deskripsi, price_min, price_max, duration_min, image_url.
- Public read, admin write (RLS). Validasi harga dan durasi wajib.

**FR2 — Dokter & Jadwal**
- Dokter: name, specialization, bio, photo_url.
- Jadwal: doctor_id, day_of_week (0-6), start_time, end_time, slot 30/60 menit. Admin atur, public read.

**FR3 — Booking**
- Form: patient_name, patient_wa (validasi format ID), service_id, doctor_id, date, time, note.
- Validasi: slot dalam jadwal dokter, tidak bentrok (DB constraint `unique(doctor_id, date, time) where status != 'cancelled'`), tanggal >= hari ini.
- Status: pending → confirmed | cancelled (+ alasan). Batal ≤ H-1. Admin action via panel → trigger notifikasi (Supabase Edge Function ke WA/email; fallback tampil instruksi hubungi WA jika gateway belum ada).
- Anti-spam: rate limit per IP/WA, honeypot.

**FR4 — Admin & Auth**
- Supabase Auth email+password, role `admin` di `profiles`. RLS: anon read services/doctors/schedules/appointments terbatas; admin full CRUD + update status.

**FR5 — Kontak**
- Alamat, Maps embed, jam operasional, CTA WA (`wa.me`).

**FR6 — UX/Tech**
- Lenis smooth scroll (client-only, dynamic import, respect `prefers-reduced-motion`), responsive (mobile/tablet/desktop), a11y, SEO (Next.js App Router metadata, sitemap.xml, robots.txt, OG).

---

## 7. Sketsa Data Model

**Postgres (Supabase), RLS enabled:**

- `profiles(id uuid PK FK auth.users, email text, role text check role in ('admin','staff'))`
- `services(id uuid PK, slug text unique, name text, description text, price_min int, price_max int, duration_min int, image_url text, created_at timestamptz)`
- `doctors(id uuid PK, name text, specialization text, bio text, photo_url text)`
- `schedules(id uuid PK, doctor_id uuid FK doctors, day_of_week int 0-6, start_time time, end_time time)`
- `appointments(id uuid PK, service_id uuid FK services, doctor_id uuid FK doctors, patient_name text, patient_wa text, date date, time time, status text check in ('pending','confirmed','cancelled'), note text, created_at timestamptz)` — unique index `(doctor_id, date, time) where status != 'cancelled'`
- `articles(id uuid PK, slug text unique, title text, content text, cover_url text, published_at timestamptz)` — v2
- `testimonials(id uuid PK, name text, rating int, content text)` — v2, hanya data real

---

## 8. Edge Case dan Failure State

- Slot bentrok: reject dengan pesan "Slot sudah terisi, pilih jam lain" (DB constraint + cek aplikasi).
- WA tidak valid: validasi regex ID, error inline.
- Dokter cuti mendadak: admin cancel massal tanggal tsb + notif ke pasien (manual WA jika gateway belum ada).
- Spam booking: rate limit (mis. 3/jam per WA/IP) + honeypot, 429.
- Supabase down: form fallback arahkan ke WA direct (`wa.me` dengan prefill) + banner error.
- Lenis SSR mismatch: Lenis hanya client, skip saat `prefers-reduced-motion: reduce`.
- Tanggal lampau / jam di luar jadwal: validasi client+server, error inline.
- Auth admin gagal: pesan generik, lockout sederhana.

---

## 9. Success Metrics

**Launch (2 minggu):** Lighthouse Performance > 90 (mobile), 0 a11y critical, funnel visitor→booking request > 5%/minggu, confirm rate > 70%, admin response < 10 menit, 20 janji/bulan organik.
**Validasi "puas" (definisi selesai MVP):** Founder nyatakan puas + metrics di atas tercapai di staging/Vercel preview, diukur manual + Supabase dashboard.

---

## 10. Open Questions

- **OQ1:** Nama klinik, alamat, 1 cabang atau multi? (mempengaruhi Maps dan data model cabang)
- **OQ2:** Daftar layanan + harga fix apa? (isi awal `services`)
- **OQ3:** Jam operasional + durasi slot (30/60 menit)?
- **OQ4:** Butuh WA gateway (Fonnte/Wablas) atau manual WA di MVP?
- **OQ5:** Domain sudah ada? (untuk SEO/sitemap)
- **OQ6:** Konten awal dokter (nama, spesialisasi, foto) dan artikel edukasi tersedia?
- **OQ7:** Stack lock A (Next.js+Supabase) sudah final — konfirmasi tidak kembali ke CI4?

> Requirement ambigu ditandai OQ — tidak dikarang. Jawaban OQ meng-unblock seed data dan integrasi WA.
