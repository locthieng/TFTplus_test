import { describe, it, expect } from "vitest";
import { SET18_TEAM_COMPS } from "../data/set18TeamComps";
import championsData from "@/generated/tft/champions.json";
import traitsData from "@/generated/tft/traits.json";
import itemsData from "@/generated/tft/items.json";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

describe("Set 18 Team Comps Integrity & Validation", () => {
  const validChampionIds = new Set(championsData.map((c) => c.id));
  const validTraitIds = new Set(traitsData.map((t) => t.id.toLowerCase().replace(/\s+/g, "")));
  const validItemIds = new Set(itemsData.map((i) => i.id));

  it("contains at least 10 high-quality Set 18 team comps", () => {
    expect(SET18_TEAM_COMPS.length).toBeGreaterThanOrEqual(10);
  });

  it("ensures every comp has unique ID and correct setId/patch", () => {
    const ids = new Set<string>();
    for (const comp of SET18_TEAM_COMPS) {
      expect(ids.has(comp.id)).toBe(false);
      ids.add(comp.id);
      expect(comp.setId).toBe(TFT_RELEASE_CONFIG.setId);
      expect(comp.patch).toBe(TFT_RELEASE_CONFIG.patch);
      expect(["S", "A", "B", "C"]).toContain(comp.tier);
    }
  });

  it("ensures all champion references exist and have valid board positions", () => {
    for (const comp of SET18_TEAM_COMPS) {
      expect(comp.champions.length).toBeGreaterThanOrEqual(6);
      expect(comp.champions.length).toBeLessThanOrEqual(10);

      const positions = new Set<string>();

      for (const champ of comp.champions) {
        expect(
          validChampionIds.has(champ.championId),
          `Champion ${champ.championId} in comp ${comp.id} must exist in champions.json`
        ).toBe(true);

        if (champ.position) {
          expect(champ.position.row).toBeGreaterThanOrEqual(0);
          expect(champ.position.row).toBeLessThanOrEqual(3);
          expect(champ.position.col).toBeGreaterThanOrEqual(0);
          expect(champ.position.col).toBeLessThanOrEqual(6);

          const posKey = `${champ.position.row}-${champ.position.col}`;
          expect(
            positions.has(posKey),
            `Duplicate board position ${posKey} in comp ${comp.id}`
          ).toBe(false);
          positions.add(posKey);
        }

        if (champ.items && champ.items.length > 0) {
          expect(champ.items.length).toBeLessThanOrEqual(3);
          for (const itemId of champ.items) {
            expect(
              validItemIds.has(itemId),
              `Item ${itemId} on ${champ.name} in comp ${comp.id} must exist in items.json`
            ).toBe(true);
          }
        }
      }
    }
  });

  it("ensures all trait references map to active Set 18 traits", () => {
    for (const comp of SET18_TEAM_COMPS) {
      for (const trait of comp.traits) {
        const normId = trait.traitId.toLowerCase().replace(/\s+/g, "");
        expect(
          validTraitIds.has(normId),
          `Trait ${trait.traitId} in comp ${comp.id} must exist in traits.json`
        ).toBe(true);
        expect(trait.count).toBeGreaterThan(0);
      }
    }
  });

  it("ensures all recommendedItems reference valid items and existing champions in comp", () => {
    for (const comp of SET18_TEAM_COMPS) {
      const champIdsInComp = new Set(comp.champions.map((c) => c.championId));
      for (const rec of comp.recommendedItems) {
        expect(
          champIdsInComp.has(rec.championId),
          `Recommended item assigned to ${rec.championId} which is not in comp ${comp.id}`
        ).toBe(true);
        expect(
          validItemIds.has(rec.itemId),
          `Recommended item ${rec.itemId} in comp ${comp.id} must exist in items.json`
        ).toBe(true);
      }
    }
  });

  it("ensures carryChampionIds and coreChampionIds belong to the composition", () => {
    for (const comp of SET18_TEAM_COMPS) {
      const champIdsInComp = new Set(comp.champions.map((c) => c.championId));
      if (comp.carryChampionIds) {
        for (const carryId of comp.carryChampionIds) {
          expect(champIdsInComp.has(carryId)).toBe(true);
        }
      }
      if (comp.coreChampionIds) {
        for (const coreId of comp.coreChampionIds) {
          expect(champIdsInComp.has(coreId)).toBe(true);
        }
      }
    }
  });
});
