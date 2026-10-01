import { describe, it, expect } from "vitest";
import {
  BUILDER_EQUIPPABLE_ITEM_TYPES,
  isBuilderEquippableItem,
} from "./builderItemRules";
import { Item } from "@/types/tft";

describe("builderItemRules", () => {
  it("allows completed, artifact, radiant, support, and emblem", () => {
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("completed")).toBe(true);
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("artifact")).toBe(true);
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("radiant")).toBe(true);
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("support")).toBe(true);
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("emblem")).toBe(true);
  });

  it("disallows components from being equipped directly", () => {
    expect(BUILDER_EQUIPPABLE_ITEM_TYPES.has("component")).toBe(false);
  });

  it("correctly identifies equippable item objects", () => {
    const completedItem: Item = {
      id: "infinity_edge",
      apiName: "TFT_Item_InfinityEdge",
      name: "Infinity Edge",
      type: "completed",
      description: "Desc",
      imageUrl: "icon.png",
    };
    expect(isBuilderEquippableItem(completedItem)).toBe(true);

    const componentItem: Item = {
      id: "bf_sword",
      apiName: "TFT_Item_BFSword",
      name: "B.F. Sword",
      type: "component",
      description: "Desc",
      imageUrl: "icon.png",
    };
    expect(isBuilderEquippableItem(componentItem)).toBe(false);
  });
});
