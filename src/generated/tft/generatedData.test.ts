import { describe, it, expect } from "vitest";
import championsData from "./champions.json";
import traitsData from "./traits.json";
import itemsData from "./items.json";
import augmentsData from "./augments.json";
import manifestData from "./manifest.json";
import { Champion, Trait, Item, Augment } from "@/types/tft";
import { VERIFIED_GLOBAL_LEGACY_ARTIFACTS } from "@/features/tft-data/filters/currentSetItemFilter";

describe("Generated Static TFT Data Quality Tests", () => {
  const champions = championsData as unknown as Champion[];
  const traits = traitsData as unknown as Trait[];
  const items = itemsData as unknown as Item[];
  const augments = augmentsData as unknown as Augment[];

  it("validates manifest structure and metadata", () => {
    expect(manifestData.set).toBe("18");
    expect(manifestData.name).toBe("Enchanted Wilds");
    expect(manifestData.patch).toBe("18.3");
    expect(manifestData.championCount).toBe(champions.length);
    expect(manifestData.traitCount).toBe(traits.length);
    expect(manifestData.itemCount).toBe(items.length);
    expect(manifestData.augmentCount).toBe(augments.length);
  });

  describe("Champions Dataset", () => {
    it("has expected count and valid fields", () => {
      expect(champions.length).toBeGreaterThan(40);
      for (const c of champions) {
        expect(c.id).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.cost).toBeGreaterThanOrEqual(1);
        expect(c.cost).toBeLessThanOrEqual(6);
        expect(c.imageUrl).toContain("https://");
        expect(c.traits.length).toBeGreaterThan(0);
      }
    });

    it("has unique champion IDs", () => {
      const ids = champions.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(champions.length);
    });

    it("reports stat coverage without failing on legitimately missing non-core stats", () => {
      const total = champions.length;
      const hpCount = champions.filter((c) => c.health && c.health.length > 0).length;
      const adCount = champions.filter((c) => c.attackDamage && c.attackDamage.length > 0).length;
      const armorCount = champions.filter((c) => c.armor != null).length;
      const mrCount = champions.filter((c) => c.magicResist != null).length;
      const asCount = champions.filter((c) => c.attackSpeed != null).length;
      const manaCount = champions.filter((c) => c.ability?.mana != null).length;
      const critCount = champions.filter((c) => c.critChance != null).length;

      console.log(`\n[Champion Stat Coverage] Total: ${total}`);
      console.log(`  HP coverage:     ${hpCount} / ${total} (${Math.round((hpCount / total) * 100)}%)`);
      console.log(`  AD coverage:     ${adCount} / ${total} (${Math.round((adCount / total) * 100)}%)`);
      console.log(`  Armor coverage:  ${armorCount} / ${total} (${Math.round((armorCount / total) * 100)}%)`);
      console.log(`  MR coverage:     ${mrCount} / ${total} (${Math.round((mrCount / total) * 100)}%)`);
      console.log(`  AS coverage:     ${asCount} / ${total} (${Math.round((asCount / total) * 100)}%)`);
      console.log(`  Mana coverage:   ${manaCount} / ${total} (${Math.round((manaCount / total) * 100)}%)`);
      console.log(`  Crit coverage:   ${critCount} / ${total} (${Math.round((critCount / total) * 100)}%)`);

      expect(hpCount).toBeGreaterThanOrEqual(40);
      expect(adCount).toBeGreaterThanOrEqual(40);
    });
  });

  describe("Traits Dataset", () => {
    it("has expected count and valid breakpoints", () => {
      expect(traits.length).toBeGreaterThan(20);
      for (const t of traits) {
        expect(t.id).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.iconUrl).toContain("https://");
        expect(Array.isArray(t.breakpoints)).toBe(true);
      }
    });

    it("has unique trait IDs", () => {
      const ids = traits.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(traits.length);
    });
  });

  describe("Items Dataset", () => {
    it("has reasonable count within expected range (50 to 400)", () => {
      expect(items.length).toBeGreaterThanOrEqual(50);
      expect(items.length).toBeLessThanOrEqual(400);
    });

    it("contains no internal debug markers or placeholder localization names", () => {
      for (const item of items) {
        expect(item.name.toLowerCase()).not.toContain("tft_item_name_");
        expect(item.name.toLowerCase()).not.toContain("admincause");
        expect(item.apiName.toLowerCase()).not.toContain("admincause");
        expect(item.apiName.toLowerCase()).not.toContain("debug");
      }
    });

    it("rejects previous-set specific items (e.g. Set 12, 13, 14, 15, 16, 17) unless whitelisted global artifacts", () => {
      for (const item of items) {
        const apiLower = item.apiName.toLowerCase();
        if (/^tft(1[0-7]|[1-9])_/i.test(apiLower)) {
          expect(VERIFIED_GLOBAL_LEGACY_ARTIFACTS.has(apiLower)).toBe(true);
        }
      }
    });

    it("ensures every emblem corresponds to an active Set 18 trait", () => {
      const emblemItems = items.filter((i) => i.type === "emblem");
      expect(emblemItems.length).toBeGreaterThan(5);

      for (const emblem of emblemItems) {
        const cleanName = emblem.name.toLowerCase().replace(/\s*emblem\s*/i, "").trim();
        const traitExists = traits.some((t) => {
          const tName = t.name.toLowerCase();
          const tId = t.id.toLowerCase();
          return (
            cleanName === tName ||
            cleanName === tId ||
            emblem.apiName.toLowerCase().includes(tId) ||
            emblem.apiName.toLowerCase().includes(tName.replace(/\s+/g, ""))
          );
        });
        expect(
          traitExists,
          `Emblem "${emblem.name}" (${emblem.apiName}) does not match any Set 18 trait`
        ).toBe(true);
      }
    });

    it("ensures item descriptions are clean of tokens and HTML entities", () => {
      for (const item of items) {
        expect(item.description).not.toContain("@TFTUnitProperty");
        expect(item.description).not.toContain("&nbsp;");
      }
    });

    it("has unique item IDs and valid item types", () => {
      const validTypes = new Set([
        "completed",
        "component",
        "radiant",
        "artifact",
        "support",
        "emblem",
      ]);

      const ids = items.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(items.length);

      for (const item of items) {
        expect(validTypes.has(item.type)).toBe(true);
      }
    });
  });

  describe("Augments Dataset", () => {
    it("has reasonable count within expected range (50 to 400)", () => {
      expect(augments.length).toBeGreaterThanOrEqual(50);
      expect(augments.length).toBeLessThanOrEqual(400);
    });

    it("does not contain any previous set augments (e.g. Set 13, 12, 11)", () => {
      expect(
        augments.some((a) => a.apiName.toLowerCase().startsWith("tft13_"))
      ).toBe(false);
      expect(
        augments.some((a) => a.apiName.toLowerCase().startsWith("tft12_"))
      ).toBe(false);
      expect(
        augments.some((a) => a.apiName.toLowerCase().startsWith("tft11_"))
      ).toBe(false);
    });

    it("ensures augment descriptions are clean of tokens and HTML entities", () => {
      for (const aug of augments) {
        expect(aug.description).not.toContain("@TFTUnitProperty");
        expect(aug.description).not.toContain("&nbsp;");
      }
    });

    it("has valid names, tiers, and icons", () => {
      const validTiers = new Set(["silver", "gold", "prismatic"]);
      for (const aug of augments) {
        expect(aug.name).toBeTruthy();
        expect(aug.name.toLowerCase()).not.toContain("tft_");
        expect(validTiers.has(aug.tier)).toBe(true);
        expect(aug.iconUrl).toContain("https://");
      }
    });
  });
});
