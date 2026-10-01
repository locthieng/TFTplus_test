import { describe, it, expect } from "vitest";
import { validateBuilderSnapshotDomain } from "./builderSnapshotValidator";
import { Champion, Item } from "@/types/tft";

describe("validateBuilderSnapshotDomain", () => {
  const dummyChampion: Champion = {
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
    description: "+15 Mana per attack",
    imageUrl: "https://example.com/shojin.png",
  };

  const championsById = new Map<string, Champion>([
    ["ahri", dummyChampion],
  ]);

  const itemsById = new Map<string, Item>([
    ["spear_of_shojin", dummyItem],
  ]);

  it("accepts a valid board champion with valid coordinates and items", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 3,
          y: 2,
          starLevel: 2,
          items: ["spear_of_shojin"],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(true);
    expect(result.board.length).toBe(1);
    expect(result.issues.length).toBe(0);
  });

  it("rejects unknown champions and removes them from board", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "unknown_champ_xyz",
          x: 0,
          y: 0,
          starLevel: 2,
          items: [],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board.length).toBe(0);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "UNKNOWN_CHAMPION" }),
      ])
    );
  });

  it("filters out unknown items from a champion while preserving valid unit", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 1,
          y: 1,
          starLevel: 2,
          items: ["spear_of_shojin", "non_existent_item_abc"],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board.length).toBe(1);
    expect(result.board[0].items).toEqual(["spear_of_shojin"]);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "UNKNOWN_ITEM" }),
      ])
    );
  });

  it("rejects duplicate board coordinates", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 2,
          y: 2,
          starLevel: 2,
          items: [],
        },
        {
          championId: "ahri",
          x: 2,
          y: 2,
          starLevel: 1,
          items: [],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board.length).toBe(1);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "DUPLICATE_POSITION" }),
      ])
    );
  });

  it("rejects out of bounds coordinates", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 7, // max is 6 (0-6)
          y: 4, // max is 3 (0-3)
          starLevel: 2,
          items: [],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board.length).toBe(0);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "OUT_OF_BOUNDS" }),
      ])
    );
  });

  it("caps items per champion to 3", () => {
    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 0,
          y: 0,
          starLevel: 2,
          items: [
            "spear_of_shojin",
            "spear_of_shojin",
            "spear_of_shojin",
            "spear_of_shojin",
          ],
        },
      ],
      championsById,
      itemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board[0].items.length).toBe(3);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "EXCEEDS_ITEM_LIMIT" }),
      ])
    );
  });

  it("rejects non-equippable component items via snapshot", () => {
    const componentItem: Item = {
      id: "bf_sword",
      apiName: "TFT_Item_BFSword",
      name: "B.F. Sword",
      type: "component",
      description: "+10 AD",
      imageUrl: "https://example.com/bf.png",
    };

    const localItemsById = new Map<string, Item>([
      ["spear_of_shojin", dummyItem],
      ["bf_sword", componentItem],
    ]);

    const result = validateBuilderSnapshotDomain({
      snapshot: [
        {
          championId: "ahri",
          x: 0,
          y: 0,
          starLevel: 2,
          items: ["bf_sword", "spear_of_shojin"],
        },
      ],
      championsById,
      itemsById: localItemsById,
    });

    expect(result.valid).toBe(false);
    expect(result.board[0].items).toEqual(["spear_of_shojin"]);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "INVALID_ITEM_TYPE" }),
      ])
    );
  });
});
