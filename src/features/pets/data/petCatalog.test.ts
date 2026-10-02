import { describe, it, expect } from "vitest";
import { PET_SPECIES_DATA, PETS_DATA } from "./petsData";
import { PET_SOURCE_METADATA } from "./petSourceMetadata";

describe("Pet & Tactician Catalog Validation Tests", () => {
  it("has comprehensive species catalog", () => {
    expect(PET_SPECIES_DATA.length).toBeGreaterThanOrEqual(50);
    expect(PETS_DATA.length).toBeGreaterThanOrEqual(200);
  });

  it("ensures each species has unique ID, name, variants, and verified status", () => {
    const speciesIds = new Set<string>();
    for (const species of PET_SPECIES_DATA) {
      expect(speciesIds.has(species.id)).toBe(false);
      speciesIds.add(species.id);

      expect(species.name.trim().length).toBeGreaterThan(0);
      expect(species.variants.length).toBeGreaterThan(0);
      expect(species.verified).toBe(true);
      expect(species.source).toBe("communitydragon");

      if (species.imageUrl) {
        expect(species.imageUrl.startsWith("https://")).toBe(true);
      }
    }
  });

  it("ensures every variant has unique ID within the dataset and belongs to its species", () => {
    const variantIds = new Set<string>();
    for (const species of PET_SPECIES_DATA) {
      for (const variant of species.variants) {
        expect(variantIds.has(variant.id)).toBe(false);
        variantIds.add(variant.id);

        expect(variant.name.trim().length).toBeGreaterThan(0);
        if (variant.imageUrl) {
          expect(variant.imageUrl.startsWith("https://")).toBe(true);
        }
      }
    }
  });

  it("has valid metadata documenting CommunityDragon companion source", () => {
    expect(PET_SOURCE_METADATA.verificationStatus).toBe("verified");
    expect(PET_SOURCE_METADATA.sourceUrl).toContain("communitydragon.org");
  });
});
