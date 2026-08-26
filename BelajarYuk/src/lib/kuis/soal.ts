// Bank soal kuis onboarding "Kenali Dirimu".
// Soal disimpan sebagai konfigurasi kode (bukan tabel DB) sesuai spesifikasi §8;
// hanya HASILNYA yang masuk database melalui profiles.persona_json.

export const GAYA_PENJELASAN = ["analogi", "langkah-detail", "contoh-dulu", "intisari"] as const;

export type GayaPenjelasan = (typeof GAYA_PENJELASAN)[number];

/** Dimensi numerik persona; nilai 1..5 sesuai spektrum di spesifikasi §6.1. */
export type DimensiSkala = "nada_bicara" | "tempo" | "motivasi";

export interface OpsiSkala {
  id: string;
  teks: string;
  /** Nilai dimensi untuk opsi ini; 1 = ujung formal/santai/banyak-dorongan, 5 = ujung satunya. */
  nilai: 1 | 2 | 3 | 4 | 5;
}

export interface OpsiGaya {
  id: string;
  teks: string;
  gaya: GayaPenjelasan;
}

export type SoalKuis =
  | { id: string; teks: string; jenis: "skala"; dimensi: DimensiSkala; opsi: OpsiSkala[] }
  | { id: string; teks: string; jenis: "gaya"; opsi: OpsiGaya[] };

/** Peta jawaban: soalId -> opsiId. */
export type JawabanKuis = Record<string, string>;

export const SOAL_KUIS: SoalKuis[] = [
  {
    id: "n1",
    teks: "Bagaimana sapaan pembuka dari tutor AI terasa paling pas buatmu?",
    jenis: "skala",
    dimensi: "nada_bicara",
    opsi: [
      { id: "n1a", teks: "Selamat pagi. Mari kita mulai sesi belajar hari ini.", nilai: 1 },
      { id: "n1b", teks: "Pagi! Semoga harimu lancar, kita mulai ya.", nilai: 2 },
      { id: "n1c", teks: "Hai! Siap lanjut belajar lagi?", nilai: 4 },
      { id: "n1d", teks: "Yo! Gas kita mulai, gimana kabarmu?", nilai: 5 },
    ],
  },
  {
    id: "n2",
    teks: "Kalau jawabanmu ternyata keliru, gaya koreksi seperti apa yang nyaman buatmu?",
    jenis: "skala",
    dimensi: "nada_bicara",
    opsi: [
      { id: "n2a", teks: "Baik, ada ketidaksesuaian pada langkah kedua. Mari kita periksa.", nilai: 1 },
      { id: "n2b", teks: "Hmm, hampir benar. Coba cek lagi langkah keduanya.", nilai: 3 },
      { id: "n2c", teks: "Oops, nyangkut di langkah dua. Kita bedah bareng ya.", nilai: 4 },
      { id: "n2d", teks: "Waduh, meleset! Santai, ini bagian yang sering bikin orang kejebak kok.", nilai: 5 },
    ],
  },
  {
    id: "n3",
    teks: "Sebutan apa yang enak dipakai tutor saat membicaramu?",
    jenis: "skala",
    dimensi: "nada_bicara",
    opsi: [
      { id: "n3a", teks: "Anda / Saudara", nilai: 1 },
      { id: "n3b", teks: "Kamu", nilai: 3 },
      { id: "n3c", teks: "Panggilan akrab ala teman", nilai: 5 },
    ],
  },
  {
    id: "t1",
    teks: "Panjang jawaban default seperti apa yang kamu mau untuk pertanyaan biasa?",
    jenis: "skala",
    dimensi: "tempo",
    opsi: [
      { id: "t1a", teks: "Panjang dan santai, bawa pelan-pelan dengan konteks dulu.", nilai: 1 },
      { id: "t1b", teks: "Sedang: jelas tapi tidak bertele-tele.", nilai: 3 },
      { id: "t1c", teks: "Singkat padat, langsung ke inti.", nilai: 5 },
    ],
  },
  {
    id: "t2",
    teks: "Kalau topiknya menarik, kamu lebih suka…",
    jenis: "skala",
    dimensi: "tempo",
    opsi: [
      { id: "t2a", teks: "Digali perlahan, satu-satu sambil banyak contoh.", nilai: 1 },
      { id: "t2b", teks: "Alur standar: definisi, contoh, lalu latihan.", nilai: 3 },
      { id: "t2c", teks: "Ringkasan cepat dulu, dalami hanya kalau perlu.", nilai: 5 },
    ],
  },
  {
    id: "m1",
    teks: "Saat kamu berhasil memahami sesuatu, respons seperti apa yang paling kamu sukai?",
    jenis: "skala",
    dimensi: "motivasi",
    opsi: [
      { id: "m1a", teks: "Rayakan! Apresiasi yang antusias bikin semangat.", nilai: 1 },
      { id: "m1b", teks: "Cukup ucapan singkat: bagus, lanjut.", nilai: 3 },
      { id: "m1c", teks: "Tidak perlu basa-basi, langsung materi berikutnya.", nilai: 5 },
    ],
  },
  {
    id: "m2",
    teks: "Kalau kamu mulai paham setelah sempat lama bingung, tutor sebaiknya…",
    jenis: "skala",
    dimensi: "motivasi",
    opsi: [
      { id: "m2a", teks: "Tekankan progresnya: kamu sudah jauh dari posisi awal!", nilai: 1 },
      { id: "m2b", teks: "Sebut sekilas bahwa ini kemajuan, lalu lanjut.", nilai: 3 },
      { id: "m2c", teks: "Lanjut saja, fokus menyelesaikan topik.", nilai: 5 },
    ],
  },
  {
    id: "g1",
    teks: "Cara mana yang paling membuatmu merasa \"nah, gitu!\" saat bertemu topik baru?",
    jenis: "gaya",
    opsi: [
      { id: "g1a", teks: "Dibandingkan dengan hal sehari-hari yang sudah aku kenal.", gaya: "analogi" },
      { id: "g1b", teks: "Diuraikan langkah demi langkah secara berurutan.", gaya: "langkah-detail" },
      { id: "g1c", teks: "Ditunjukkan contohnya dulu, teori menyusul.", gaya: "contoh-dulu" },
      { id: "g1d", teks: "Diringkas dulu intinya dalam beberapa poin.", gaya: "intisari" },
    ],
  },
  {
    id: "g2",
    teks: "Materi rumus matematika paling mudah masuk lewat…",
    jenis: "gaya",
    opsi: [
      { id: "g2a", teks: "Cerita atau situasi nyata yang mewakili rumusnya.", gaya: "analogi" },
      { id: "g2b", teks: "Penurunan rumus langkah demi langkah.", gaya: "langkah-detail" },
      { id: "g2c", teks: "Contoh soal yang dikerjakan dari awal sampai akhir.", gaya: "contoh-dulu" },
      { id: "g2d", teks: "Daftar simbol dan aturan pentingnya saja.", gaya: "intisari" },
    ],
  },
  {
    id: "g3",
    teks: "Kalau penjelasan barusan terasa panjang, yang paling membantumu adalah…",
    jenis: "gaya",
    opsi: [
      { id: "g3a", teks: "Mengulangnya dengan pembanding yang berbeda.", gaya: "analogi" },
      { id: "g3b", teks: "Rangkuman bernomor sesuai urutan tadi.", gaya: "langkah-detail" },
      { id: "g3c", teks: "Satu contoh lagi yang serupa.", gaya: "contoh-dulu" },
      { id: "g3d", teks: "Tiga kalimat kunci dari semuanya.", gaya: "intisari" },
    ],
  },
  {
    id: "g4",
    teks: "Untuk latihan setelah belajar, kamu memilih…",
    jenis: "gaya",
    opsi: [
      { id: "g4a", teks: "Soal cerita yang menggelitik imajinasi.", gaya: "analogi" },
      { id: "g4b", teks: "Soal bertingkat dari mudah ke sulit secara runtut.", gaya: "langkah-detail" },
      { id: "g4c", teks: "Soal mirip contoh yang baru saja dibahas.", gaya: "contoh-dulu" },
      { id: "g4d", teks: "Beberapa soal inti saja yang mewakili.", gaya: "intisari" },
    ],
  },
  {
    id: "g5",
    teks: "Kamu bilang \"aku masih bingung\". Respons manakah yang paling menolong?",
    jenis: "gaya",
    opsi: [
      { id: "g5a", teks: "Coba pendekatan lain lewat perbandingan baru.", gaya: "analogi" },
      { id: "g5b", teks: "Pecah lagi menjadi langkah-langkah yang lebih kecil.", gaya: "langkah-detail" },
      { id: "g5c", teks: "Ayo lihat contoh konkret bersama-sama.", gaya: "contoh-dulu" },
      { id: "g5d", teks: "Fokus dulu ke satu inti masalahnya saja.", gaya: "intisari" },
    ],
  },
];
