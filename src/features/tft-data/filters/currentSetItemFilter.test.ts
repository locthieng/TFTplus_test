import { describe, it, expect } from "vitest";
import {
  isCurrentSetCompatibleItem,
  isLegacySetSpecificApiName,
  isCurrentSetEmblem,
  CurrentSetItemFilterContext,
} from "./currentSetItemFilter";
import { RawItemLike } from "../resolvers/itemTypeResolver";

describe("currentSetItemFilter", () => {
  const context: CurrentSetItemFilterContext = {
    setId: "18",
    currentTraitNames: new Set(["Elderwood", "Coven", "Fae", "Hunter", "Blossom"]),
  };

  it("includes standard global completed items", () => {
    const raw: RawItemLike = {
      apiName: "TFT_Item_InfinityEdge",
      name: "Infinity Edge",
      type: "completed",
    };
    expect(isCurrentSetCompatibleItem(raw, context)).toBe(true);
  });

  it("includes whitelisted global legacy Ornn artifacts", () => {
    const raw: RawItemLike = {
      apiName: "TFT4_Item_OrnnInfinityForce",
      name: "Infinity Force",
      type: "artifact",
    };
    expect(isCurrentSetCompatibleItem(raw, context)).toBe(true);
  });

  it("includes valid current Set 18 emblems", () => {
    const elderwoodEmblem: RawItemLike = {
      apiName: "DA_18_EmblemElderwood",
      name: "Elderwood Emblem",
      type: "emblem",
    };
    expect(isCurrentSetCompatibleItem(elderwoodEmblem, context)).toBe(true);
    expect(isCurrentSetEmblem(elderwoodEmblem, context.currentTraitNames)).toBe(true);
  });

  it("rejects previous set emblems (Set 13, Set 16, etc.)", () => {
    const set13Emblem: RawItemLike = {
      apiName: "TFT13_Item_FamilyEmblemItem",
      name: "Family Emblem",
      type: "emblem",
    };
    expect(isCurrentSetCompatibleItem(set13Emblem, context)).toBe(false);

    const set16Emblem: RawItemLike = {
      apiName: "TFT16_Item_ZaunEmblemItem",
      name: "Zaun Emblem",
      type: "emblem",
    };
    expect(isCurrentSetCompatibleItem(set16Emblem, context)).toBe(false);
  });

  it("rejects previous set trait-specific items (Set 14, Set 12)", () => {
    const set14Item: RawItemLike = {
      apiName: "TFT14_NaafiriCyberneticItem_Radiant",
      name: "Radiant Cybernetic",
      type: "radiant",
    };
    expect(isCurrentSetCompatibleItem(set14Item, context)).toBe(false);

    const set12Item: RawItemLike = {
      apiName: "TFT12_Item_Faerie_ArmorRadiant",
      name: "Faerie Queen's Armor",
      type: "radiant",
    };
    expect(isCurrentSetCompatibleItem(set12Item, context)).toBe(false);
  });

  it("identifies legacy set-specific API names", () => {
    expect(isLegacySetSpecificApiName("TFT13_Item_ChemBaron")).toBe(true);
    expect(isLegacySetSpecificApiName("tft7_item_assassin")).toBe(true);
    expect(isLegacySetSpecificApiName("TFT18_Augment_Elderwood")).toBe(false);
    expect(isLegacySetSpecificApiName("TFT_Item_InfinityEdge")).toBe(false);
    expect(isLegacySetSpecificApiName("DA_18_EmblemElderwood")).toBe(false);
  });
});
