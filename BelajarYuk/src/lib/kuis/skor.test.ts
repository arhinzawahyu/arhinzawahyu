import { describe, expect, it } from "vitest";
import { hitungSkor } from "./skor";

// Set dasar: semua skala di ujung formal/santai/banyak-dorongan, semua gaya = analogi.
const DASAR = {
  n1: "n1a",
  n2: "n2a",
  n3: "n3a",
  t1: "t1a",
  t2: "t2a",
  m1: "m1a",
  m2: "m2a",
  g1: "g1a",
  g2: "g2a",
  g3: "g3a",
  g4: "g4a",
  g5: "g5a",
};

describe("hitungSkor", () => {
  it("menghitung dimensi skala lewat rata-rata dan mengenali arketipe dominan", () => {
    const profil = hitungSkor(DASAR);
    expect(profil).toEqual({
      nada_bicara: 1,
      tempo: 1,
      motivasi: 1,
      gaya_penjelasan: "analogi",
      tipe_label: "Juru Analogi",
      versi_kuis: 1,
    });
  });

  it("ujung sebaliknya menghasilkan nilai maksimum dan label intisari", () => {
    const profil = hitungSkor({
      n1: "n1d",
      n2: "n2d",
      n3: "n3c",
      t1: "t1c",
      t2: "t2c",
      m1: "m1c",
      m2: "m2c",
      g1: "g1d",
      g2: "g2d",
      g3: "g3d",
      g4: "g4d",
      g5: "g5d",
    });
    expect(profil.nada_bicara).toBe(5);
    expect(profil.tempo).toBe(5);
    expect(profil.motivasi).toBe(5);
    expect(profil.gaya_penjelasan).toBe("intisari");
    expect(profil.tipe_label).toBe("Pemburu Inti");
  });

  it("nilai campuran dibulatkan dengan benar", () => {
    // nada: n1a(1), n2b(3), n3c(5) -> rata-rata 3
    const profil = hitungSkor({ ...DASAR, n1: "n1a", n2: "n2b", n3: "n3c" });
    expect(profil.nada_bicara).toBe(3);
  });

  it("seri frekuensi gaya dimenangkan oleh urutan konstan (analogi sebelum langkah-detail)", () => {
    const jawaban = { ...DASAR, g3: "g3b", g4: "g4b", g5: "g5c" };
    // analogi 2, langkah-detail 2, contoh-dulu 1, intisari 0
    const profil = hitungSkor(jawaban);
    expect(profil.gaya_penjelasan).toBe("analogi");
  });

  it("seri antara langkah-detail dan contoh-dulu dimenangkan langkah-detail", () => {
    const jawaban = { ...DASAR, g2: "g2b", g3: "g3c", g4: "g4b", g5: "g5c" };
    // analogi 1, langkah-detail 2, contoh-dulu 2, intisari 0
    const profil = hitungSkor(jawaban);
    expect(profil.gaya_penjelasan).toBe("langkah-detail");
  });

  it("menolak jawaban yang tidak lengkap dan menyebut id soalnya", () => {
    const { t2: _t2, g5: _g5, ...kurang } = DASAR;
    expect(() => hitungSkor(kurang)).toThrow(/t2.*g5|g5.*t2/s);
  });

  it("id soal asing diabaikan tanpa merusak hasil", () => {
    const denganAsing = { ...DASAR, zz: "tidak-ada" };
    expect(hitungSkor(denganAsing)).toEqual(hitungSkor({ ...DASAR }));
  });

  it("opsi tak dikenal pada soal resmi ditolak", () => {
    expect(() => hitungSkor({ ...DASAR, n1: "hantu" })).toThrow(/n1/);
  });
});
