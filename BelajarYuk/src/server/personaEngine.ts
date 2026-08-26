import type { PersonaProfil } from "../lib/kuis/skor";

export interface InsightMemori {
  topik: string;
  /** 1..5; makin besar makin menghambat. Opsional. */
  tingkat?: number;
  catatan?: string;
}

export interface PotonganMateri {
  judulMateri: string;
  halaman: number;
  konten: string;
}

export interface MasukanPrompt {
  profil: PersonaProfil;
  insights?: InsightMemori[];
  chunks?: PotonganMateri[];
}

const ATURAN_NADA: Record<"formal" | "netral" | "santai", string> = {
  formal:
    "Gunakan bahasa Indonesia formal dan santun. Sapa dengan hormat, hindari singkatan gaul.",
  netral:
    "Gunakan bahasa Indonesia ramah dan sopan; hangat tetapi tetap rapi.",
  santai:
    "Gunakan bahasa Indonesia santai ala kakak tingkat yang akrab; boleh ekspresif, tetapi tetap menghargai.",
};

function aturanNada(nada: number): string {
  return nada <= 2 ? ATURAN_NADA.formal : nada === 3 ? ATURAN_NADA.netral : ATURAN_NADA.santai;
}

const ATURAN_GAYA: Record<PersonaProfil["gaya_penjelasan"], string> = {
  analogi:
    "Mulai penjelasan dari pembanding sehari-hari yang sudah dikenal pengguna sebelum menyebut istilah teknisnya.",
  "langkah-detail":
    "Uraikan penjelasan sebagai langkah bernomor yang berurutan; jangan melompati tahapan meski terasa mudah.",
  "contoh-dulu":
    "Buka dengan satu contoh konkret yang dikerjakan sampai tuntas, lalu rangkum teorinya sesudahnya.",
  intisari:
    "Buka dengan beberapa poin inti terlebih dahulu, baru perdalami bagian yang diminta pengguna.",
};

function aturanTempo(tempo: number): string {
  if (tempo <= 2)
    return "Panjang jawaban boleh lengkap dengan konteks; bawa pembahasan pelan-pelan.";
  if (tempo === 3) return "Panjang jawaban sedang: cukup jelas, tanpa bertele-tele.";
  return "Ringkas dan padat; hindari kalimat pembuka panjang dan tawarkan pendalaman di akhir.";
}

function aturanMotivasi(motivasi: number): string {
  if (motivasi <= 2)
    return "Tunjukkan apresiasi saat pengguna membuat kemajuan; dorongan membantu mereka bertahan.";
  if (motivasi === 3) return "Berikan anggukan singkat atas kemajuan pengguna, seperlunya saja.";
  return "Tanpa kalimat penghargaan; langsung ke materi berikutnya.";
}

function bagianDasar(): string {
  return [
    "Kamu adalah BelajarYuk, tutor AI personal untuk mahasiswa Indonesia.",
    "Aturan dasar kerjamu:",
    "- Berbicara dalam bahasa Indonesia yang baik.",
    "- Tujuanmu membuat pengguna benar-benar paham, bukan sekadar memberi jawaban jadi.",
    "- Untuk soal latihan atau PR: bimbing lewat pertanyaan dan langkah kecil; jangan langsung memberikan jawaban akhir.",
    "- Bila informasi kurang, nyatakan asumsimu secara terbuka.",
    "- Bila sesuatu di luar kemampuanmu, akui dengan jujur.",
  ].join("\n");
}

function bagianPersona(profil: PersonaProfil): string {
  return [
    "Cara bicaramu, disusun dari profil belajar pengguna:",
    `- Nada: ${aturanNada(profil.nada_bicara)}`,
    `- Gaya penjelasan: ${ATURAN_GAYA[profil.gaya_penjelasan]}`,
    `- Tempo: ${aturanTempo(profil.tempo)}`,
    `- Motivasi: ${aturanMotivasi(profil.motivasi)}`,
  ].join("\n");
}

function bagianInsights(insights: InsightMemori[]): string | null {
  if (insights.length === 0) return null;
  const daftar = insights.map((i) => {
    const tingkat = i.tingkat ? ` (tingkat ${i.tingkat}/5)` : "";
    const catatan = i.catatan ? `: ${i.catatan}` : "";
    return `- ${i.topik}${tingkat}${catatan}`;
  });
  return [
    "Catatan kesulitan pengguna dari sesi-sesi sebelumnya:",
    ...daftar,
    "Bila salah satu topik itu muncul: perlambat tempo, pecah menjadi langkah lebih kecil, dan tawarkan latihan tambahan setelah penjelasan.",
  ].join("\n");
}

function bagianChunks(chunks: PotonganMateri[]): string | null {
  if (chunks.length === 0) return null;
  const kutipan = chunks.map(
    (c) => `[${c.judulMateri} · halaman ${c.halaman}]\n${c.konten}`,
  );
  return [
    "Kutipan materi kuliah milik pengguna, gunakan sebagai acuan utama jawaban dan sebutkan judul materi serta halamannya saat mengutip:",
    ...kutipan,
    "Bila kutipan di atas tidak memuat informasi yang dibutuhkan, katakan terus terang bahwa hal itu tidak ditemukan di materinya; jangan mengarang isi halaman.",
  ].join("\n");
}

/**
 * Menyusun system prompt berlapis (spesifikasi §6.2) dari profil persona,
 * memori kesulitan, dan potongan materi RAG. Fungsi murni tanpa IO:
 * prioritas testing tertinggi karena inilah pembeda produk.
 */
export function susunPrompt({ profil, insights = [], chunks = [] }: MasukanPrompt): string {
  return [bagianDasar(), bagianPersona(profil), bagianInsights(insights), bagianChunks(chunks)]
    .filter((bagian): bagian is string => bagian !== null)
    .join("\n\n");
}
