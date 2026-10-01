import { describe, it, expect } from "vitest";
import { shouldIncludeTftItem } from "./itemFilter";
import { RawItemLike } from "../resolvers/itemTypeResolver";

describe("itemFilter (shouldIncludeTftItem)", () => {
  it("includes valid completed items", () => {
    const raw: RawItemLike = {
      apiName: "TFT_Item_InfinityEdge",
      name: "Infinity Edge",
      desc: "Grants 35 Attack Damage and 15 Critical Strike Chance.",
      icon: "assets/maps/particles/tft/item_infinity_edge.png",
      from: [1, 2],
    };

    expect(shouldIncludeTftItem(raw)).toBe(true);
  });

  it("rejects items with missing or empty name", () => {
    expect(
      shouldIncludeTftItem({
        apiName: "TFT_Item_Empty",
        name: "",
        desc: "Empty",
        icon: "icon.png",
      })
    ).toBe(false);

    expect(
      shouldIncludeTftItem({
        apiName: "TFT_Item_Null",
        name: null as unknown as string,
        desc: "Null",
        icon: "icon.png",
      })
    ).toBe(false);
  });

  it("rejects placeholder localization keys", () => {
    expect(
      shouldIncludeTftItem({
        apiName: "TFT_Item_Key1",
        name: "tft_item_name_placeholder",
        desc: "Description",
        icon: "icon.png",
      })
    ).toBe(false);

    expect(
      shouldIncludeTftItem({
        apiName: "TFT_Item_Key2",
        name: "Infinity Edge",
        desc: "tft_item_description_untranslated",
        icon: "icon.png",
      })
    ).toBe(false);
  });

  it("rejects internal and debug markers", () => {
    const rejectedMarkers = [
      "TFT8_AdminCause_PhysicalDamage",
      "TFT_Item_DebugTool",
      "TFT_Item_DummyItem",
      "TFT_Item_CheatCode",
      "TFT_Item_ArmoryReroll",
    ];

    for (const apiName of rejectedMarkers) {
      expect(
        shouldIncludeTftItem({
          apiName,
          name: "Some Item",
          desc: "Some Desc",
          icon: "icon.png",
        })
      ).toBe(false);
    }
  });

  it("rejects items flagged as augments", () => {
    expect(
      shouldIncludeTftItem({
        apiName: "TFT_Item_SomeAugment",
        name: "Rich Get Richer",
        desc: "Gain gold",
        icon: "icon.png",
        isAugment: true,
      })
    ).toBe(false);
  });
});
