import { describe, it, expect } from "vitest";
import { buildItemRecipeIndex, getCraftableItemsForComponent } from "./itemRecipeIndex";
import itemsData from "@/generated/tft/items.json";
import { Item } from "@/types/tft";

describe("itemRecipeIndex", () => {
  it("builds reverse index correctly for items in dataset", () => {
    const items = itemsData as Item[];
    const index = buildItemRecipeIndex(items);

    expect(index.size).toBeGreaterThan(0);

    // BF Sword should combine into Deathblade, Infinity Edge, Bloodthirster, etc.
    const bfCombos = getCraftableItemsForComponent(index, "tft_item_bfsword");
    expect(bfCombos.length).toBeGreaterThan(0);

    const comboNames = bfCombos.map((i) => i.name.toLowerCase());
    expect(comboNames).toContain("deathblade");
    expect(comboNames).toContain("infinity edge");
    expect(comboNames).toContain("bloodthirster");
  });

  it("handles duplicate components without duplicating completed item", () => {
    const mockItems: Item[] = [
      {
        id: "deathblade",
        apiName: "TFT_Item_Deathblade",
        name: "Deathblade",
        type: "completed",
        description: "AD item",
        composition: ["bfsword", "bfsword"],
        imageUrl: "",
      },
    ];

    const index = buildItemRecipeIndex(mockItems);
    const results = getCraftableItemsForComponent(index, "bfsword");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("deathblade");
  });
});
