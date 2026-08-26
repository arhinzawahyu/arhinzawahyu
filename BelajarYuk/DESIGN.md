# DESIGN.md — Arah Desain BelajarYuk

> Dokumen ini adalah transkripsi keputusan pemilik produk (bukan karangan agent).
> Sumber: sesi brainstorming 2026-08-26. Detail teknis lengkap ada di
> `docs/superpowers/specs/2026-08-26-belajaryuk-design.md` §13.

## Identitas

- **Produk:** BelajarYuk, AI Tutor personal untuk mahasiswa.
- **Pembeda:** tutor yang mengenali tipe belajar pengguna lalu menyesuaikan cara bicaranya.

## Palet Warna (final, ditetapkan pemilik)

| Token | Hex | Peran |
|---|---|---|
| `bg-base` | `#222222` | latar utama seluruh aplikasi |
| `ink` | `#FFFEEC` | teks utama & permukaan terang |
| `accent` | `#CAC426` | aksen tunggal: CTA, highlight, status aktif |

Fakta turunan dari palet ini (dicek, bukan opini): ketiga pasangan kombinasi
teks di atas lolos WCAG AA dan AAA pada ukuran teks normal.

## Gaya Visual (ditetapkan pemilik)

1. **Minimalisme** — sedikit elemen per layar, hierarki jelas.
2. **Glassmorphism** — panel kaca sebagai aksen, bukan karakter seluruh UI
   (batas dosis mengikuti aturan R-10 antislop: maksimal 1–2 elemen blur per layar,
   wajib fallback solid).
3. **Scrollytelling** — penceritaan berbasis scroll di landing page dan momen reveal
   hasil kuis onboarding.
4. **Dashboard bergaya CRM modern** — sidebar navigasi + grid widget, padat data tapi rapi.

## Tipografi

**Belum diputuskan oleh pemilik.** Tidak boleh dipilih agent tanpa persetujuan;
agent hanya boleh mengajukan opsi beserta alasannya saat implementasi dimulai.

## Dials Energi (ditetapkan pemilik: "tenang merata")

| Dial | Nilai | Arti praktis |
|---|---|---|
| ENERGY | **1** | tenang & presisi ala Linear di seluruh permukaan |
| RHYTHM | **2** | konsisten dengan beberapa jeda yang disengaja, tanpa ledakan komposisi |
| MOTION | **1 di aplikasi; 2 hanya di landing & hasil kuis** | hover/focus states + reveal scroll halus (transform/opacity); tanpa parallax, pin, atau koreografi berat |

Konsekuensi: "scrollytelling" direalisasikan sebagai **reveal lembut bertahap**
saat scroll, bukan animasi sinematik. Gerak apa pun harus punya alasan UX tertulis
(R-19) dan menghormati `prefers-reduced-motion`.
