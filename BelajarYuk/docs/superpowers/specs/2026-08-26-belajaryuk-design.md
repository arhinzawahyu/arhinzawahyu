# Desain Produk: BelajarYuk — AI Tutor Personal untuk Mahasiswa

- **Tanggal:** 2026-08-26
- **Status:** Disetujui melalui sesi brainstorming (menunggu review final)
- **Fase:** Rilis pertama (MVP)

---

## 1. Ringkasan Produk

BelajarYuk adalah website tutor AI personal bagi mahasiswa satu kampus. Pembeda utamanya dibanding chatbot biasa adalah **mesin personalisasi**: setiap pengguna memiliki profil tipe belajar (diperoleh dari kuis onboarding), dan AI menyesuaikan **nada bicara, gaya penjelasan, level kesulitan**, serta **mengingat topik yang sulit** bagi pengguna tersebut untuk ditindaklanjuti di percakapan berikutnya.

Pengguna juga dapat mengunggah materi kuliah (PDF/PPT) yang menjadi konteks jawaban AI melalui pipeline RAG.

## 2. Tujuan & Kriteria Sukses

| # | Kriteria | Ukuran |
|---|---|---|
| 1 | Mahasiswa baru bisa daftar → kuis → mulai chat | < 5 menit |
| 2 | Jawaban AI terasa berbeda antar tipe persona | evaluasi manual: set pertanyaan tetap × beberapa persona menghasilkan gaya jawaban yang jelas berbeda |
| 3 | AI mengingat kesulitan user antar sesi | topik yang diekstrak muncul di dashboard "Topik Sulitku" dan dipakai di sesi berikutnya |
| 4 | Biaya API terkendali | pemakaian bertahan dalam free tier Gemini lewat kuota harian per user |

## 3. Ruang Lingkup

### 3.1 Dalam MVP — dibangun berurutan dalam 3 fase

**Fase A — Fondasi & Chat Adaptif**
1. Scaffold proyek Astro (SSR, adapter Node) + React islands.
2. Autentikasi Supabase (email/password): daftar, masuk, keluar.
3. Kuis onboarding "Kenali Dirimu" (~12 pertanyaan pilihan ganda) → profil persona.
4. Persona engine: perangkai system prompt berlapis (Lapis 1–3).
5. Chat UI interaktif (React island) dengan jawaban streaming dari Gemini.
6. Riwayat percakapan tersimpan per user.

**Fase B — Memori Kesulitan ("Topik Sulitku")**
1. Di akhir sesi chat, proses background memanggil model ekstraksi untuk mendeteksi topik yang membuat user kesulitan → disimpan ke tabel `insights`.
2. Lapis 3 system prompt menyertakan insights sehingga AI proaktif memberi latihan/pendekatan berbeda pada topik itu.
3. Dashboard menampilkan daftar "Topik Sulitku" (bisa ditandai selesai/dihapus).

**Fase C — Upload Materi (RAG)**
1. Upload PDF/PPT ke Supabase Storage.
2. Server mem-parse teks (per halaman), memecah menjadi chunk ±800 karakter (overlap ±100).
3. Setiap chunk di-embed (Gemini `text-embedding-004`, 768 dimensi) dan disimpan di Postgres `pgvector`.
4. Saat chat dengan materi terpilih: pertanyaan di-embed → cari top-5 chunk milik user itu → disisipkan sebagai Lapis 4 system prompt, jawaban mencantumkan rujukan halaman.
5. Status materi: `processing → ready / failed`, terlihat di UI.

### 3.2 Di luar cakupan rilis pertama (kandidat fase 2+)

- Generator kuis/soal latihan otomatis dari materi.
- Adaptasi implisit per-pesan (analisis pola/bobot kesulitan dari tiap balasan user); MVP menggunakan ekstraksi end-of-session + sinyal eksplisit saat chat.
- Mode kelas/dosen, multi-bahasa UI, aplikasi mobile native, paket berbayar.

## 4. Alur Pengguna

```
                    ┌──────────────────┐
                    │     LANDING      │
                    └────────┬─────────┘
                             │ klik "Mulai Belajar"
                             ▼
                    ┌──────────────────┐
        ┌──────────►│ DAFTAR / MASUK   │◄──────────┐
        │           │ (Supabase Auth)  │           │
        │           └────────┬─────────┘           │
        │                    ▼                     │
        │              ┌──────────────┐   TIDAK    │
        │              │ Punya profil │────────────┘
        │              │ persona?     │ (default netral,
        │              └──────┬───────┘  didorong isi kuis)
        │                     │ belum
        │                     ▼
        │           ┌───────────────────┐
        │           │  KUIS ONBOARDING  │ ~12 pertanyaan
        │           └────────┬──────────┘
        │                    ▼
        │           ┌───────────────────┐
        │           │ HASIL TIPE BELAJAR│ label arketipe + skor dimensi
        │           └────────┬──────────┘
        │                    ▼
        │           ┌───────────────────┐
        └───────────│     DASHBOARD     │
                    │ • Mulai chat      │
                    │ • Materi (file)   │
                    │ • Topik Sulitku   │
                    └───┬──────────┬────┘
                        ▼          ▼
              ┌──────────────┐  ┌──────────────────┐
              │  CHAT DENGAN │  │ MATERIKU: upload │
              │  AI TUTOR    │  │ → parse → chunk  │
              │ (adaptif)    │  │ → embed → ready  │
              └──────┬───────┘  └──────────────────┘
                     │ akhir sesi (background)
                     ▼
              ┌───────────────────┐
              │ EKSTRAKSI INSIGHT │ → tabel `insights`
              └───────────────────┘ → dipakai sesi berikutnya
```

Catatan alur:
1. Kuis onboarding adalah gerbang wajib setelah daftar; boleh dilewati (persona default "netral") tapi didorong.
2. Chat dapat memilih satu materi sebagai konteks (opsional).
3. Insight kesulitan terkumpul otomatis — tanpa user mengulang cerita.

## 5. Arsitektur Sistem

```
┌────────────────────────────────────────────────────┐
│                    BROWSER                          │
│   Halaman Astro (SSR) + React Islands:              │
│   • Chat UI (streaming)  • Kuis onboarding          │
│   • Upload & daftar materi • Dashboard              │
└─────────────────┬──────────────────────────────────┘
                  │ HTTPS (session cookie)
                  ▼
┌────────────────────────────────────────────────────┐
│            ASTRO SERVER (satu proyek)               │
│  Middleware : validasi session + cek kuota harian   │
│  API Routes :                                      │
│   POST /api/chat     → streaming jawaban (SSE)      │
│   POST /api/materi   → upload & proses file         │
│   POST /api/persona  → simpan hasil kuis            │
│   GET  /api/insight  → daftar Topik Sulitku         │
│  🧠 PERSONA ENGINE (perangkai prompt)               │
│  📄 RAG PIPELINE  (chunk → embed → search)          │
└──────┬─────────────┬──────────────┬────────────────┘
       │             │              │
       ▼             ▼              ▼
 ┌───────────┐ ┌─────────────┐ ┌─────────────┐
 │  GEMINI   │ │  SUPABASE   │ │  SUPABASE   │
 │  API      │ │  AUTH       │ │  STORAGE    │
 │ (chat +   │ │ (login,     │ │ (file PDF/  │
 │ embedding)│ │  session)   │ │  PPT user)  │
 └───────────┘ └──────┬──────┘ └─────────────┘
                      ▼
              ┌──────────────┐
              │   POSTGRES   │
              │  + pgvector  │
              └──────────────┘
```

Aturan arsitektur:
- **API key Gemini hanya di server Astro** — browser hanya berkomunikasi dengan API routes milik aplikasi.
- Semua pemanggilan AI melewati satu modul service (`lib/gemini.ts`) agar mudah diganti model/provider.
- Deployment: hosting Node (mis. Vercel/Netlify dengan adapter Astro) + proyek Supabase.

## 6. Mesin Personalisasi (Persona Engine)

### 6.1 Dimensi persona (hasil kuis, skor 1–5)

| Dimensi | Spektrum | Efek pada jawaban |
|---|---|---|
| `nada_bicara` | formal ⟷ santai | sapaan, sapaan pronomen, kesantunan |
| `gaya_penjelasan` | enum: `analogi` \| `langkah-detail` \| `contoh-dulu` \| `intisari` | urutan & bentuk penjelasan |
| `tempo` | santai ⟷ cepat-padat | panjang jawaban default |
| `motivasi` | banyak-dorongan ⟷ langsung-inti | ada/tidaknya afirmasi |

Profil disimpan sebagai JSON (contoh):

```json
{
  "nada_bicara": 4,
  "gaya_penjelasan": "analogi",
  "tempo": 3,
  "motivasi": 2,
  "tipe_label": "Analogi Explorer",
  "versi_kuis": 1
}
```

`versi_kuis` disimpan agar perubahan soal kuis di masa depan tidak merusak interpretasi profil lama.

### 6.2 System prompt berlapis (disusun server per request)

```
[LAPIS 1] Instruksi dasar tutor: identitas BelajarYuk, bahasa Indonesia,
          bimbing dulu (tidak memberi jawaban instan soal PR).
[LAPIS 2] Aturan persona hasil kompilasi profil JSON:
          nada, gaya penjelasan, tempo panjang jawaban, tingkat motivasi.
[LAPIS 3] Memori kesulitan (dari `insights`):
          topik sulit user + instruksi menurunkan tempo/memberi latihan.
[LAPIS 4] Konteks RAG: chunk materi relevan (jika chat memakai materi),
          wajib menyebut sumber halaman.
```

Kompilator prompt adalah **fungsi murni** `(profil, insights, chunks, riwayat) → string` — mudah di-unit-test dan menjadi prioritas testing tertinggi.

### 6.3 Adaptasi level kesulitan (dua jalur)

- **Eksplisit (MVP):** instruksi di prompt mewajibkan AI menurunkan kompleksitas dan memecah langkah saat user menyatakan bingung ("aku nggak paham").
- **Implikatif end-of-session (MVP, Fase B):** ekstraksi insight dari transkrip sesi → memperkaya Lapis 3 seiring waktu.
- **Per-pesan implisit (fase 2+, di luar MVP):** analisis pola tiap balasan user.

## 7. Pipeline RAG Materi

```
UPLOAD : PDF/PPT → Supabase Storage → server parse teks per halaman
       → chunk ±800 karakter (overlap ±100) → embedding text-embedding-004
       → simpan pgvector + metadata (user_id, materi_id, no. halaman)

CHAT   : pertanyaan user → embedding → cosine similarity top-5
       (filter ketat user_id + materi_id) → Lapis 4 prompt → Gemini
```

- File yang gagal diparse (mis. PDF hasil scan tanpa teks) → status `failed` + pesan jelas ke user.
- Pencarian vektor selalu difilter `user_id`; materi antar-user tidak mungkin bocor.

## 8. Model Data (Postgres)

| Tabel | Kolom utama | Catatan |
|---|---|---|
| `profiles` | `user_id` (FK auth.users), `persona_json`, `nama` | 1 baris per user; dibuat saat login pertama |
| `materi` | `id`, `user_id`, `judul`, `storage_path`, `status` | status: `processing/ready/failed` |
| `materi_chunks` | `id`, `materi_id`, `user_id`, `konten`, `halaman`, `embedding vector(768)` | indeks IVFFlat/HNSW untuk similarity search |
| `conversations` | `id`, `user_id`, `judul`, `materi_id?` | materi opsional |
| `messages` | `id`, `conversation_id`, `role`, `konten` | role: `user/assistant` |
| `insights` | `id`, `user_id`, `topik`, `tingkat`, `catatan`, `conversation_id`, `resolved_at?` | sumber "Topik Sulitku" |
| `usage_daily` | `user_id`, `tanggal`, `jumlah_permintaan` | unik per (user, tanggal) |

Soal kuis onboarding disimpan sebagai konfigurasi di kode (bukan tabel) — hanya hasilnya yang masuk DB. Row Level Security (RLS) aktif; akses server memakai key service dengan filter `user_id` eksplisit di setiap query.

## 9. Keamanan

1. Session cookie HttpOnly via Supabase Auth; middleware memvalidasi setiap request ke API routes.
2. API key Gemini hanya environment variable server; tidak pernah dikirim ke browser.
3. Isolasi data: setiap query (termasuk pencarian vektor) difilter `user_id`.
4. Validasi upload: batas ukuran file (mis. 20 MB), whitelist tipe (pdf/pptx).

## 10. Penanganan Error

| Situasi | Perlakuan |
|---|---|
| PDF hasil scan / tak terbaca | status `failed`, pesan: gunakan PDF berbasis teks |
| Gemini rate-limit/gangguan | satu kali retry dengan jeda singkat; jika streaming putus di tengah → pesan error + tombol coba lagi, pesan setengah jadi tidak disimpan |
| Kuota harian habis | middleware menolak sebelum memanggil Gemini; pesan ramah + info reset besok |
| Login/session kadaluarsa | redirect ke halaman masuk dengan pesan |

## 11. Kendali Biaya API

1. Kuota harian default **25 permintaan chat/user** (dicatat di `usage_daily`, dicek middleware).
2. Batas maksimum output token per panggilan.
3. Konteks hemat: hanya 12 pesan terakhir yang dikirim ke model; sesi lebih lama diringkas.
4. Model default: `gemini-2.5-flash` (chat) dan `text-embedding-004` (embedding) — dapat diganti via env var tanpa ubah kode.

## 12. Strategi Testing

| Lapisan | Yang diuji | Cara |
|---|---|---|
| Unit — prioritas #1 | Persona engine (fungsi murni penyusun prompt) | snapshot test: profil × insights × chunks → prompt |
| Unit | Logika chunking file | ukuran & overlap konsisten |
| Integration | API routes dengan Gemini dimock | respons cepat, stabil, gratis |
| Evaluasi kualitas AI | Set pertanyaan tetap × beberapa persona | review manual berkala |
| E2E ringan (akhir fase) | Daftar → kuis → chat | Playwright |

## 13. Arah Desain Visual

Gaya keseluruhan: **minimalisme gelap + glassmorphism**, momen **scrollytelling halus** pada halaman publik & hasil kuis, dan dashboard bergaya **CRM modern** untuk area setelah login. Satu bahasa visual untuk semuanya: tenang, sedikit elemen, satu aksen kuning. Dial energi resmi (lihat `DESIGN.md`): **ENERGY 1 / RHYTHM 2 / MOTION 1, kecuali MOTION 2 di landing & hasil kuis (reveal scroll halus)**.

### 13.1 Token Warna

| Token | Hex | Peran |
|---|---|---|
| `bg-base` | `#222222` | latar utama seluruh aplikasi (charcoal hangat) |
| `ink` | `#FFFEEC` | teks utama, permukaan terang, bubble user |
| `accent` | `#CAC426` | CTA, highlight, status aktif, grafik kuota |

- Kontras aman: `#FFFEEC` di atas `#222222` ≈ 15:1; `#CAC426` di atas `#222222` ≈ 9:1; tombol memakai teks `#222222` di atas `#CAC426` ≈ 9:1 — semua lolos WCAG AA/AAA.
- Gradien/netral lain hanya boleh diturunkan dari ketiga warna ini (opacity/varian alpha) — tidak menambah hue baru.

### 13.2 Glassmorphism (token komponen)

- Panel kaca: latar `rgba(255,254,236, 0.05±0.03)` + `backdrop-filter: blur(16px)` + border `1px rgba(255,254,236,0.10)` + radius 16–24 px.
- Maksimal 1–2 lapis blur per layar (kinerja); wajib ada fallback latar solid bila `backdrop-filter` tidak didukung.
- Dipakai pada: kartu dashboard, panel chat, modal, navbar mengambang. Tidak dipakai pada area baca panjang (jawaban AI tetap di permukaan polos agar nyaman dibaca).

### 13.3 Tipografi (usulan)

- Display/judul: geometris berkarakter (mis. Space Grotesk) — dipakai besar di landing & hasil kuis.
- Body/UI: Inter. Kode dalam jawaban AI: JetBrains Mono.
- Hierarki ketat ala minimalis: ukuran melompat jelas (12/14/16/24/40+), lebar baris baca ±65–75 karakter.

### 13.4 Penempatan Gaya per Permukaan

| Permukaan | Gaya dominan |
|---|---|
| Landing (publik) | **Scrollytelling halus (MOTION 2)**: cerita "kenapa tutor harus mengenalmu dulu", bagian-bagian reveal lembut bertahap saat scroll, kartu kaca berisi contoh jawaban AI yang berubah gaya sesuai persona; tanpa parallax/pin |
| Hasil kuis onboarding | **Scrollytelling singkat**: reveal tipe belajar sebagai momen signature |
| Chat | Minimalis gelap: fokus ke percakapan, panel kaca tipis untuk input, tanpa dekorasi berlebih |
| Dashboard | **CRM-style**: sidebar nav (Chat, Materiku, Topik Sulitku, Pengaturan) + grid widget — kartu kuota harian, daftar percakapan terakhir, daftar Topik Sulitku, tabel materi dengan status. Rasa seperti Linear/Notion: padat data tapi rapi |

### 13.5 Gerak & Aksesibilitas

- Animasi scroll memakai transform/opacity saja; hormati `prefers-reduced-motion`.
- Semua interaksi punya state jelas (hover/focus/disabled) memakai token di atas; focus ring pakai `#CAC426`.



| Lapisan | Pilihan |
|---|---|
| Framework | Astro 7 (SSR, adapter Node; terpasang saat scaffold 2026-08) |
| Komponen interaktif | React (islands) |
| Auth, DB, Storage | Supabase (Auth, Postgres + pgvector, Storage) |
| ORM/query | Drizzle ORM |
| Styling | Tailwind CSS |
| AI | Google Gemini (`gemini-2.5-flash`, `text-embedding-004`) |
| Bahasa UI | Indonesia |
| Testing | Vitest (+ Testing Library), Playwright (E2E) |

## 14. Asumsi & Keputusan Terbuka

- Satu instansi kampus pada awalnya; belum ada multi-tenant.
- Kuota harian dan parameter chunk adalah nilai awal yang dapat diubah via konfigurasi tanpa migrasi skema.
- Label arketipe: hasil kuis memetakan dominasi `gaya_penjelasan` ke salah satu dari 4 nama tipe (satu per nilai enum di §6.1); daftar namanya ditentukan saat implementasi kuis tanpa mengubah skema dimensi.
