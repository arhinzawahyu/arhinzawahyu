import { describe, expect, it } from "vitest";
import { hitungSkor } from "../lib/kuis/skor";
import { susunPrompt, type InsightMemori, type PotonganMateri } from "./personaEngine";

const PROFIL_DASAR = hitungSkor({
  n1: "n1a", n2: "n2a", n3: "n3a",
  t1: "t1a", t2: "t2a",
  m1: "m1a", m2: "m2a",
  g1: "g1a", g2: "g2a", g3: "g3a", g4: "g4a", g5: "g5a",
});

const INSIGHT_CONTOH: InsightMemori[] = [
  { topik: "rekursi", tingkat: 4, catatan: "sering salah menentukan basis kasus" },
];

const CHUNK_CONTOH: PotonganMateri[] = [
  {
    judulMateri: "Modul PBO",
    halaman: 12,
    konten: "Enkapsulasi adalah pembungkusan data dan method dalam satu unit.",
  },
];

describe("susunPrompt", () => {
  it("selalu memuat lapisan dasar dan persona meski insights dan chunks kosong", () => {
    const prompt = susunPrompt({ profil: PROFIL_DASAR });
    expect(prompt).toContain("BelajarYuk");
    expect(prompt).toContain("bimbing lewat pertanyaan dan langkah kecil");
    expect(prompt).toContain("Cara bicaramu");
    expect(prompt).not.toContain("kesulitan pengguna dari sesi");
    expect(prompt).not.toContain("Kutipan materi kuliah");
  });

  it("dimensi nada mengubah instruksi bicara", () => {
    const formal = susunPrompt({ profil: { ...PROFIL_DASAR, nada_bicara: 1 } });
    const santai = susunPrompt({ profil: { ...PROFIL_DASAR, nada_bicara: 5 } });
    expect(formal).toContain("formal dan santun");
    expect(santai).toContain("santai ala kakak tingkat");
  });

  it("setiap gaya penjelasan memunculkan instruksinya sendiri", () => {
    const frasaKunci = {
      analogi: "pembanding sehari-hari",
      "langkah-detail": "langkah bernomor",
      "contoh-dulu": "satu contoh konkret",
      intisari: "poin inti terlebih dahulu",
    } as const;
    for (const [gaya, frasa] of Object.entries(frasaKunci)) {
      const prompt = susunPrompt({ profil: { ...PROFIL_DASAR, gaya_penjelasan: gaya as never } });
      expect(prompt).toContain(frasa);
    }
  });

  it("tempo dan motivasi ekstrem menghasilkan arahan berbeda", () => {
    const pelanPenuhDorongan = susunPrompt({ profil: { ...PROFIL_DASAR, tempo: 1, motivasi: 1 } });
    const cepatToThePoint = susunPrompt({ profil: { ...PROFIL_DASAR, tempo: 5, motivasi: 5 } });
    expect(pelanPenuhDorongan).toContain("pelan-pelan");
    expect(pelanPenuhDorongan).toContain("apresiasi");
    expect(cepatToThePoint).toContain("Ringkas dan padat");
    expect(cepatToThePoint).toContain("Tanpa kalimat penghargaan");
  });

  it("insight kesulitan masuk sebagai lapis tersendiri lengkap dengan arahan tindak lanjut", () => {
    const prompt = susunPrompt({ profil: PROFIL_DASAR, insights: INSIGHT_CONTOH });
    expect(prompt).toContain("rekursi");
    expect(prompt).toContain("tingkat 4/5");
    expect(prompt).toContain("tawarkan latihan tambahan");
  });

  it("potongan materi RAG membawa judul halaman dan larangan mengarang", () => {
    const prompt = susunPrompt({ profil: PROFIL_DASAR, chunks: CHUNK_CONTOH });
    expect(prompt).toContain("[Modul PBO · halaman 12]");
    expect(prompt).toContain("Enkapsulasi");
    expect(prompt).toContain("jangan mengarang isi halaman");
  });

  it("urutan lapisan: dasar, persona, insights, chunks", () => {
    const prompt = susunPrompt({
      profil: PROFIL_DASAR,
      insights: INSIGHT_CONTOH,
      chunks: CHUNK_CONTOH,
    });
    const iDasar = prompt.indexOf("Aturan dasar kerjamu");
    const iPersona = prompt.indexOf("Cara bicaramu");
    const iInsight = prompt.indexOf("kesulitan pengguna dari sesi");
    const iChunk = prompt.indexOf("Kutipan materi kuliah");
    expect(iDasar).toBeLessThan(iPersona);
    expect(iPersona).toBeLessThan(iInsight);
    expect(iInsight).toBeLessThan(iChunk);
  });

  it("snapshot utuh prompt untuk profil menengah dengan satu insight dan satu potongan materi", () => {
    const profilMenengah = {
      ...PROFIL_DASAR,
      nada_bicara: 4,
      tempo: 3,
      motivasi: 2,
      gaya_penjelasan: "contoh-dulu" as const,
      tipe_label: "Praktisi Contoh",
    };
    const prompt = susunPrompt({
      profil: profilMenengah,
      insights: INSIGHT_CONTOH,
      chunks: CHUNK_CONTOH,
    });
    expect(prompt).toMatchInlineSnapshot(`
      "Kamu adalah BelajarYuk, tutor AI personal untuk mahasiswa Indonesia.
      Aturan dasar kerjamu:
      - Berbicara dalam bahasa Indonesia yang baik.
      - Tujuanmu membuat pengguna benar-benar paham, bukan sekadar memberi jawaban jadi.
      - Untuk soal latihan atau PR: bimbing lewat pertanyaan dan langkah kecil; jangan langsung memberikan jawaban akhir.
      - Bila informasi kurang, nyatakan asumsimu secara terbuka.
      - Bila sesuatu di luar kemampuanmu, akui dengan jujur.

      Cara bicaramu, disusun dari profil belajar pengguna:
      - Nada: Gunakan bahasa Indonesia santai ala kakak tingkat yang akrab; boleh ekspresif, tetapi tetap menghargai.
      - Gaya penjelasan: Buka dengan satu contoh konkret yang dikerjakan sampai tuntas, lalu rangkum teorinya sesudahnya.
      - Tempo: Panjang jawaban sedang: cukup jelas, tanpa bertele-tele.
      - Motivasi: Tunjukkan apresiasi saat pengguna membuat kemajuan; dorongan membantu mereka bertahan.

      Catatan kesulitan pengguna dari sesi-sesi sebelumnya:
      - rekursi (tingkat 4/5): sering salah menentukan basis kasus
      Bila salah satu topik itu muncul: perlambat tempo, pecah menjadi langkah lebih kecil, dan tawarkan latihan tambahan setelah penjelasan.

      Kutipan materi kuliah milik pengguna, gunakan sebagai acuan utama jawaban dan sebutkan judul materi serta halamannya saat mengutip:
      [Modul PBO · halaman 12]
      Enkapsulasi adalah pembungkusan data dan method dalam satu unit.
      Bila kutipan di atas tidak memuat informasi yang dibutuhkan, katakan terus terang bahwa hal itu tidak ditemukan di materinya; jangan mengarang isi halaman."
    `);
  });
});
