import { describe, expect, it } from "vitest";
import { WARNA } from "./design-tokens";

describe("token warna DESIGN.md", () => {
  it("identik dengan palet yang ditetapkan pemilik produk", () => {
    expect(WARNA.base.toLowerCase()).toBe("#222222");
    expect(WARNA.ink.toLowerCase()).toBe("#fffeec");
    expect(WARNA.accent.toLowerCase()).toBe("#cac426");
  });
});
