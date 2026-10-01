import { describe, it, expect } from "vitest";
import { calculateBoardTraits } from "./traitCalculator";
import { BoardChampion } from "@/types/tft";

describe("Trait Calculator (TFT Rules Engine)", () => {
  it("should return empty array when no champions are on board", () => {
    const traits = calculateBoardTraits([]);
    expect(traits).toEqual([]);
  });

  it("should count duplicate champions only once", () => {
    const boardWithDuplicates: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "caitlyn", x: 1, y: 0, starLevel: 1, items: [] }, // duplicate unit
    ];

    const traits = calculateBoardTraits(boardWithDuplicates);
    const enforcer = traits.find((t) => t.trait.id === "enforcer");

    expect(enforcer).toBeDefined();
    expect(enforcer?.count).toBe(1);
    expect(enforcer?.isActive).toBe(false); // minUnits is 2
  });

  it("should activate traits when unit threshold is met and assign correct breakpoint style", () => {
    const board: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "vi", x: 1, y: 0, starLevel: 2, items: [] },
    ];

    const traits = calculateBoardTraits(board);
    const enforcer = traits.find((t) => t.trait.id === "enforcer");

    expect(enforcer).toBeDefined();
    expect(enforcer?.count).toBe(2);
    expect(enforcer?.isActive).toBe(true);
    expect(enforcer?.activeBreakpoint?.style).toBe("bronze");
    expect(enforcer?.activeBreakpoint?.minUnits).toBe(2);
  });

  it("should sort active traits ahead of inactive traits", () => {
    const board: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "vi", x: 1, y: 0, starLevel: 2, items: [] },
    ];

    const traits = calculateBoardTraits(board);
    expect(traits.length).toBeGreaterThan(0);
    expect(traits[0].isActive).toBe(true);
  });
});
