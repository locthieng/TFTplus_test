import { describe, it, expect } from "vitest";
import {
  validateImporterCounts,
  resolveCdragonSourceVersion,
  buildManifestData,
  MIN_IMPORTER_THRESHOLDS,
} from "./importerSanity";

describe("importerSanity", () => {
  it("resolves source version separately from TFT patch", () => {
    // When CDRAGON_SOURCE_VERSION is set, use it
    expect(
      resolveCdragonSourceVersion({
        CDRAGON_SOURCE_VERSION: "16.19",
        CDRAGON_VERSION: "18.3",
      })
    ).toBe("16.19");

    // Fallback to legacy CDRAGON_VERSION
    expect(
      resolveCdragonSourceVersion({
        CDRAGON_VERSION: "16.18",
      })
    ).toBe("16.18");

    // Default is 16.19 (not 18.3)
    expect(resolveCdragonSourceVersion({})).toBe("16.19");
    expect(resolveCdragonSourceVersion({})).not.toBe("18.3");
  });

  it("passes validation when all entity counts meet minimum thresholds", () => {
    const validCounts = {
      championCount: 74,
      traitCount: 36,
      itemCount: 171,
      augmentCount: 345,
    };

    const result = validateImporterCounts(validCounts);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails validation when champion count is below threshold (< 70)", () => {
    const lowChamps = {
      championCount: 65,
      traitCount: 36,
      itemCount: 171,
      augmentCount: 345,
    };

    const result = validateImporterCounts(lowChamps);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain(
      `Champion count is low: 65 < ${MIN_IMPORTER_THRESHOLDS.minChampions}`
    );
  });

  it("fails validation when traits, items, or augments are below threshold", () => {
    const lowCounts = {
      championCount: 74,
      traitCount: 25,
      itemCount: 120,
      augmentCount: 200,
    };

    const result = validateImporterCounts(lowCounts);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  it("builds manifest with truthful, separate sourceVersion and patch", () => {
    const manifest = buildManifestData({
      setNumber: 18,
      setName: "Enchanted Wilds",
      patch: "18.3",
      sourceVersion: "16.19",
      counts: {
        championCount: 74,
        traitCount: 36,
        itemCount: 171,
        augmentCount: 345,
      },
    });

    expect(manifest.set).toBe("18");
    expect(manifest.patch).toBe("18.3");
    expect(manifest.sourceVersion).toBe("16.19");
    expect(manifest.sourceVersion).not.toBe("latest");
    expect(manifest.sourceVersion).not.toBe(manifest.patch);
    expect(manifest.source).toBe("communitydragon");
  });
});
