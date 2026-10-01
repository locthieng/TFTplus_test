import { describe, it, expect } from "vitest";
import { resolveInitialBuilderBoard } from "./builderInitLogic";
import { Champion, Item, TeamComp } from "@/types/tft";
import { encodeBuilderSnapshot } from "../share/builderShareCodec";

describe("builderInitLogic (resolveInitialBuilderBoard)", () => {
  const dummyChamp: Champion = {
    id: "ahri",
    apiName: "TFT11_Ahri",
    name: "Ahri",
    cost: 4,
    traits: ["fated"],
    imageUrl: "https://example.com/ahri.png",
  };

  const dummyItem: Item = {
    id: "spear_of_shojin",
    apiName: "TFT_Item_SpearOfShojin",
    name: "Spear of Shojin",
    type: "completed",
    description: "Mana",
    imageUrl: "https://example.com/shojin.png",
  };

  const championsById = new Map<string, Champion>([["ahri", dummyChamp]]);
  const itemsById = new Map<string, Item>([["spear_of_shojin", dummyItem]]);

  it("prioritizes valid URL snapshot over presets", () => {
    const validSnapshot = encodeBuilderSnapshot([
      { championId: "ahri", x: 2, y: 1, starLevel: 3, items: ["spear_of_shojin"] },
    ]);

    const presetComp: TeamComp = {
      id: "preset-1",
      name: "Sample Comp",
      tier: "S",
      difficulty: "Easy",
      patch: "18.3",
      setId: "18",
      playstyle: "Standard",
      description: "Sample",
      champions: [{ championId: "ahri", name: "Ahri", cost: 4, imageUrl: "img.png" }],
      traits: [],
      augments: [],
      recommendedItems: [],
    };

    const board = resolveInitialBuilderBoard({
      urlSnapshot: validSnapshot,
      currentSetComps: [presetComp],
      championsById,
      itemsById,
    });

    expect(board.length).toBe(1);
    expect(board[0].championId).toBe("ahri");
    expect(board[0].starLevel).toBe(3);
    expect(board[0].x).toBe(2);
    expect(board[0].y).toBe(1);
  });

  it("falls back to current set preset if snapshot is invalid or missing", () => {
    const presetComp: TeamComp = {
      id: "preset-1",
      name: "Sample Comp",
      tier: "S",
      difficulty: "Easy",
      patch: "18.3",
      setId: "18",
      playstyle: "Standard",
      description: "Sample",
      champions: [
        {
          championId: "ahri",
          name: "Ahri",
          cost: 4,
          imageUrl: "img.png",
          position: { row: 3, col: 5 },
          starLevel: 2,
          items: ["spear_of_shojin"],
        },
      ],
      traits: [],
      augments: [],
      recommendedItems: [],
    };

    const board = resolveInitialBuilderBoard({
      urlSnapshot: "invalid_corrupted_snapshot",
      currentSetComps: [presetComp],
      championsById,
      itemsById,
    });

    expect(board.length).toBe(1);
    expect(board[0].championId).toBe("ahri");
    expect(board[0].x).toBe(5);
    expect(board[0].y).toBe(3);
  });

  it("returns empty board if no snapshot and no current set presets exist", () => {
    const board = resolveInitialBuilderBoard({
      urlSnapshot: null,
      currentSetComps: [],
      championsById,
      itemsById,
    });

    expect(board).toEqual([]);
  });
});
