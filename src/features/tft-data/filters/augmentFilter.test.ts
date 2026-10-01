import { describe, it, expect } from "vitest";
import { shouldIncludeAugment } from "./augmentFilter";
import { RawItemLike } from "../resolvers/itemTypeResolver";

describe("augmentFilter (shouldIncludeAugment)", () => {
  const set18Whitelist = new Set(["DA_18_BranchingOut", "TFT18_Augment_Elderwood"]);

  it("includes valid Set 18 augments in whitelist", () => {
    const raw: RawItemLike = {
      apiName: "DA_18_BranchingOut",
      name: "Branching Out",
      desc: "Gain an Emblem.",
      icon: "icon.png",
      isAugment: true,
    };

    expect(shouldIncludeAugment(raw, set18Whitelist)).toBe(true);
  });

  it("includes DA_ and TFT18_ prefixed augments", () => {
    const raw: RawItemLike = {
      apiName: "TFT18_Augment_FloralShield",
      name: "Floral Shield",
      desc: "Gain a shield.",
      icon: "icon.png",
      isAugment: true,
    };

    expect(shouldIncludeAugment(raw)).toBe(true);
  });

  it("rejects previous set augments (TFT13_, TFT12_, TFT11_ etc.)", () => {
    const previousSetAugments = [
      "TFT13_Augment_ChemBaronCrest",
      "TFT12_Augment_EldritchHeart",
      "TFT11_Augment_FortuneCrown",
      "TFT10_Augment_Jazz",
      "TFT9_Augment_Noxus",
    ];

    for (const apiName of previousSetAugments) {
      const raw: RawItemLike = {
        apiName,
        name: "Legacy Augment",
        desc: "Old set augment",
        icon: "icon.png",
        isAugment: true,
      };
      expect(shouldIncludeAugment(raw, set18Whitelist)).toBe(false);
      expect(shouldIncludeAugment(raw)).toBe(false);
    }
  });

  it("rejects placeholder localization names", () => {
    const raw: RawItemLike = {
      apiName: "TFT18_Augment_Placeholder",
      name: "tft_item_name_placeholder",
      desc: "Desc",
      icon: "icon.png",
      isAugment: true,
    };

    expect(shouldIncludeAugment(raw)).toBe(false);
  });

  it("rejects non-augment entities", () => {
    const raw: RawItemLike = {
      apiName: "TFT_Item_InfinityEdge",
      name: "Infinity Edge",
      desc: "Item desc",
      icon: "icon.png",
    };

    expect(shouldIncludeAugment(raw)).toBe(false);
  });
});
