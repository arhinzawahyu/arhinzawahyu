import { SOAL_KUIS, GAYA_PENJELASAN, type DimensiSkala, type GayaPenjelasan, type JawabanKuis } from "./soal";

export const VERSI_KUIS = 1;

/**
 * Urutan pemecah seri untuk gaya penjelasan: bila frekuensi seri,
 * gaya yang lebih awal di daftar ini yang menang. Konstan dan deterministik.
 */
export const GAYA_URUTAN: readonly GayaPenjelasan[] = [...GAYA_PENJELASAN];

/** Nama arketipe resmi (keputusan pemilik: "Set Karakter", 2026-08-26). */
export const LABEL_ARKETIPE = {
  "analogi": "Juru Analogi",
  "langkah-detail": "Sang Sistematis",
  "contoh-dulu": "Praktisi Contoh",
  "intisari": "Pemburu Inti",
} as const satisfies Record<GayaPenjelasan, string>;

export interface PersonaProfil {
  nada_bicara: number;
  tempo: number;
  motivasi: number;
  gaya_penjelasan: GayaPenjelasan;
  tipe_label: string;
  versi_kuis: number;
}

const DIMENSI_SKALA: readonly DimensiSkala[] = ["nada_bicara", "tempo", "motivasi"];

function rataRataDimensi(dimensi: DimensiSkala, jawaban: JawabanKuis): number {
  const nilaiPerSoal = SOAL_KUIS.filter(
    (soal) => soal.jenis === "skala" && soal.dimensi === dimensi,
  ).map((soal) => {
    const opsiId = jawaban[soal.id];
    const opsi = soal.opsi.find((o) => o.id === opsiId);
    if (!opsi) {
      throw new Error(`Jawaban soal ${soal.id} tidak mengenal opsi "${String(opsiId)}"`);
    }
    return opsi.nilai;
  });

  const total = nilaiPerSoal.reduce((a, b) => a + b, 0);
  return Math.min(5, Math.max(1, Math.round(total / nilaiPerSoal.length)));
}

function gayaDominan(jawaban: JawabanKuis): GayaPenjelasan {
  const frekuensi = Object.fromEntries(GAYA_URUTAN.map((g) => [g, 0])) as Record<GayaPenjelasan, number>;

  for (const soal of SOAL_KUIS) {
    if (soal.jenis !== "gaya") continue;
    const opsi = soal.opsi.find((o) => o.id === jawaban[soal.id]);
    if (!opsi) {
      throw new Error(`Jawaban soal ${soal.id} tidak mengenal opsi "${jawaban[soal.id]}"`);
    }
    frekuensi[opsi.gaya] += 1;
  }

  // Strictly greater: pada skor seri, gaya yang lebih dulu di GAYA_URUTAN menang.
  return GAYA_URUTAN.reduce(
    (terkuat, gaya) => (frekuensi[gaya] > frekuensi[terkuat] ? gaya : terkuat),
    GAYA_URUTAN[0],
  );
}

/**
 * Menghitung persona dari jawaban kuis. Fungsi murni: tidak menyentuh DB maupun IO,
 * sehingga mudah diuji dan dipakai ulang (API persona maupun pengubahan profil).
 */
export function hitungSkor(jawaban: JawabanKuis): PersonaProfil {
  const soalKurang = SOAL_KUIS.filter((s) => !jawaban[s.id]).map((s) => s.id);
  if (soalKurang.length > 0) {
    throw new Error(`Jawaban kurang untuk soal: ${soalKurang.join(", ")}`);
  }

  const [nada_bicara, tempo, motivasi] = DIMENSI_SKALA.map((d) => rataRataDimensi(d, jawaban));
  const gaya_penjelasan = gayaDominan(jawaban);

  return {
    nada_bicara,
    tempo,
    motivasi,
    gaya_penjelasan,
    tipe_label: LABEL_ARKETIPE[gaya_penjelasan],
    versi_kuis: VERSI_KUIS,
  };
}
