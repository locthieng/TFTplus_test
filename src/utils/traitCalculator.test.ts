import { describe, it, expect } from "vitest";
import { calculateBoardTraits } from "./traitCalculator";
import { BoardChampion, Champion, Trait } from "@/types/tft";

describe("Trait Calculator (TFT Rules Engine — Pure)", () => {
  // Test Fixtures
  const testChampions: Champion[] = [
    {
      id: "caitlyn",
      apiName: "TFT_Caitlyn",
      name: "Caitlyn",
      cost: 5,
      imageUrl: "/caitlyn.png",
      traits: ["enforcer", "sniper"],
    },
    {
      id: "vi",
      apiName: "TFT_Vi",
      name: "Vi",
      cost: 4,
      imageUrl: "/vi.png",
      traits: ["enforcer", "pitfighter"],
    },
    {
      id: "loris",
      apiName: "TFT_Loris",
      name: "Loris",
      cost: 3,
      imageUrl: "/loris.png",
      traits: ["enforcer"],
    },
  ];

  const testTraits: Trait[] = [
    {
      id: "enforcer",
      apiName: "TFT_Enforcer",
      name: "Enforcer",
      iconUrl: "/enforcer.png",
      description: "Enforcer trait",
      breakpoints: [
        { minUnits: 2, style: "bronze" },
        { minUnits: 3, style: "gold" },
      ],
    },
    {
      id: "sniper",
      apiName: "TFT_Sniper",
      name: "Sniper",
      iconUrl: "/sniper.png",
      description: "Sniper trait",
      breakpoints: [{ minUnits: 2, style: "bronze" }],
    },
    {
      id: "pitfighter",
      apiName: "TFT_PitFighter",
      name: "Pit Fighter",
      iconUrl: "/pitfighter.png",
      description: "Pit Fighter trait",
      breakpoints: [{ minUnits: 2, style: "bronze" }],
    },
  ];

  const championsMap = new Map<string, Champion>(testChampions.map((c) => [c.id, c]));
  const traitsMap = new Map<string, Trait>(testTraits.map((t) => [t.id, t]));

  it("should return empty array when no champions are on board", () => {
    const traits = calculateBoardTraits({
      board: [],
      championsById: championsMap,
      traitsById: traitsMap,
    });
    expect(traits).toEqual([]);
  });

  it("should count duplicate champions only once", () => {
    const boardWithDuplicates: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "caitlyn", x: 1, y: 0, starLevel: 1, items: [] },
    ];

    const traits = calculateBoardTraits({
      board: boardWithDuplicates,
      championsById: championsMap,
      traitsById: traitsMap,
    });

    const enforcer = traits.find((t) => t.trait.id === "enforcer");
    expect(enforcer).toBeDefined();
    expect(enforcer?.count).toBe(1);
    expect(enforcer?.isActive).toBe(false);
  });

  it("should safely ignore unknown champions without throwing", () => {
    const boardWithUnknown: BoardChampion[] = [
      { championId: "unknown_hero_999", x: 0, y: 0, starLevel: 2, items: [] },
    ];

    const traits = calculateBoardTraits({
      board: boardWithUnknown,
      championsById: championsMap,
      traitsById: traitsMap,
    });

    expect(traits).toEqual([]);
  });

  it("should select the highest active breakpoint when count increases", () => {
    const boardWith3Enforcers: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "vi", x: 1, y: 0, starLevel: 2, items: [] },
      { championId: "loris", x: 2, y: 0, starLevel: 2, items: [] },
    ];

    const traits = calculateBoardTraits({
      board: boardWith3Enforcers,
      championsById: championsMap,
      traitsById: traitsMap,
    });

    const enforcer = traits.find((t) => t.trait.id === "enforcer");
    expect(enforcer?.count).toBe(3);
    expect(enforcer?.isActive).toBe(true);
    expect(enforcer?.activeBreakpoint?.style).toBe("gold");
  });

  it("should sort active traits ahead of inactive traits deterministically", () => {
    const board: BoardChampion[] = [
      { championId: "caitlyn", x: 0, y: 0, starLevel: 2, items: [] },
      { championId: "vi", x: 1, y: 0, starLevel: 2, items: [] },
    ];

    const traits = calculateBoardTraits({
      board,
      championsById: championsMap,
      traitsById: traitsMap,
    });

    expect(traits.length).toBeGreaterThan(0);
    expect(traits[0].isActive).toBe(true);
    expect(traits[0].trait.id).toBe("enforcer");
  });
});
