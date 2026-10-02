import { describe, it, expect } from "vitest";
import { SET18_TEAM_COMPS } from "@/features/team-comps/data/set18TeamComps";
import championsData from "@/generated/tft/champions.json";
import itemsData from "@/generated/tft/items.json";
import traitsData from "@/generated/tft/traits.json";
import augmentsData from "@/generated/tft/augments.json";

describe("Team Comps Cross-Domain Integrity Test", () => {
  const championIds = new Set(championsData.map((c) => c.id.toLowerCase()));
  const itemIds = new Set(itemsData.map((i) => i.id.toLowerCase()));
  const traitIds = new Set(traitsData.map((t) => t.id.toLowerCase()));
  const augmentIds = new Set(augmentsData.map((a) => a.id.toLowerCase()));

  it("should have at least 10 valid Set 18 team compositions", () => {
    expect(SET18_TEAM_COMPS.length).toBeGreaterThanOrEqual(10);
  });

  SET18_TEAM_COMPS.forEach((comp) => {
    describe(`Composition: ${comp.name} (${comp.id})`, () => {
      it("should have all champions existing in the verified champions dataset", () => {
        expect(comp.champions.length).toBeGreaterThan(0);
        for (const champ of comp.champions) {
          const exists = championIds.has(champ.championId.toLowerCase());
          expect(
            exists,
            `Champion "${champ.championId}" in comp "${comp.id}" must exist in champions.json`
          ).toBe(true);
        }
      });

      it("should have all carry and core champion IDs existing in the composition and dataset", () => {
        for (const carryId of comp.carryChampionIds || []) {
          expect(
            championIds.has(carryId.toLowerCase()),
            `Carry champion "${carryId}" must exist in champions.json`
          ).toBe(true);
        }
        for (const coreId of comp.coreChampionIds || []) {
          expect(
            championIds.has(coreId.toLowerCase()),
            `Core champion "${coreId}" must exist in champions.json`
          ).toBe(true);
        }
      });

      it("should have all equipped items existing in the verified items dataset", () => {
        for (const champ of comp.champions) {
          for (const itemId of champ.items || []) {
            const exists = itemIds.has(itemId.toLowerCase());
            expect(
              exists,
              `Item "${itemId}" equipped on "${champ.championId}" in comp "${comp.id}" must exist in items.json`
            ).toBe(true);
          }
        }
      });

      it("should have all traits existing in the verified traits dataset", () => {
        for (const trait of comp.traits || []) {
          const exists = traitIds.has(trait.traitId.toLowerCase());
          expect(
            exists,
            `Trait "${trait.traitId}" in comp "${comp.id}" must exist in traits.json`
          ).toBe(true);
        }
      });

      it("should have all recommended augments existing in the verified augments dataset", () => {
        expect(comp.augments?.length).toBeGreaterThan(0);
        for (const augId of comp.augments || []) {
          const exists = augmentIds.has(augId.toLowerCase());
          expect(
            exists,
            `Augment "${augId}" in comp "${comp.id}" must exist in augments.json`
          ).toBe(true);
        }
      });
    });
  });
});
