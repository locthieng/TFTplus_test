import { describe, it, expect } from "vitest";
import { encodeBuilderSnapshot, decodeBuilderSnapshot } from "./builderShareCodec";
import { BoardChampion } from "@/types/tft";

describe("Builder Share Codec & Validation", () => {
  it("should encode and decode a valid board snapshot successfully", () => {
    const validBoard: BoardChampion[] = [
      { championId: "caitlyn", x: 6, y: 3, starLevel: 2, items: ["item1", "item2"] },
      { championId: "vi", x: 2, y: 0, starLevel: 2, items: ["item3"] },
    ];

    const encoded = encodeBuilderSnapshot(validBoard);
    expect(typeof encoded).toBe("string");
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(encoded).not.toContain("=");

    const decoded = decodeBuilderSnapshot(encoded);
    expect(decoded).toEqual(validBoard);
  });

  it("should return null when decoding invalid or corrupted strings", () => {
    expect(decodeBuilderSnapshot("")).toBeNull();
    expect(decodeBuilderSnapshot("not-a-valid-base64-string!@#$")).toBeNull();
    expect(decodeBuilderSnapshot("eyJmb28iOiJiYXIifQ")).toBeNull(); // not an array matching schema
  });

  it("should return null if snapshot exceeds maximum allowed units", () => {
    // 11 units when max is 10
    const oversizedBoard: BoardChampion[] = Array.from({ length: 11 }).map((_, i) => ({
      championId: `champ_${i}`,
      x: i % 7,
      y: Math.floor(i / 7),
      starLevel: 2,
      items: [],
    }));

    expect(() => encodeBuilderSnapshot(oversizedBoard)).toThrow();
  });

  it("should return null if champion coordinates are out of board bounds", () => {
    const outOfBoundsBoard = JSON.stringify([
      { championId: "caitlyn", x: 10, y: 10, starLevel: 2, items: [] },
    ]);
    const encoded = Buffer.from(outOfBoundsBoard).toString("base64url");
    expect(decodeBuilderSnapshot(encoded)).toBeNull();
  });
});
