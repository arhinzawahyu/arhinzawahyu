import { describe, expect, it } from "vitest";
import { tentukanRute } from "./rute";

describe("tentukanRute", () => {
  it("anonim menuju rute proteksi dialihkan ke /masuk", () => {
    expect(tentukanRute("/dashboard", false)).toBe("/masuk");
    expect(tentukanRute("/chat", false)).toBe("/masuk");
    expect(tentukanRute("/materi/baru", false)).toBe("/masuk");
    expect(tentukanRute("/onboarding", false)).toBe("/masuk");
  });

  it("anonim bebas mengakses halaman publik", () => {
    expect(tentukanRute("/", false)).toBeNull();
    expect(tentukanRute("/masuk", false)).toBeNull();
    expect(tentukanRute("/daftar", false)).toBeNull();
    expect(tentukanRute("/api/health", false)).toBeNull();
  });

  it("pengguna terotentikasi yang membuka halaman masuk dibawa ke dashboard", () => {
    expect(tentukanRute("/masuk", true)).toBe("/dashboard");
    expect(tentukanRute("/daftar/", true)).toBe("/dashboard");
  });

  it("pengguna terotentikasi bebas menjelajah rute proteksi", () => {
    expect(tentukanRute("/dashboard", true)).toBeNull();
    expect(tentukanRute("/chat/abc", true)).toBeNull();
  });

  it("trailing slash tidak mengubah keputusan", () => {
    expect(tentukanRute("/dashboard/", false)).toBe("/masuk");
  });
});
