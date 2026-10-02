import { describe, it, expect } from "vitest";
import { WISPS_DATA } from "./wispsData";
import { WISP_SOURCE_METADATA } from "./wispSourceMetadata";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

describe("Wisp Authentic Dataset Validation Tests", () => {
  it("has non-empty authentic Set 18 wisps dataset", () => {
    expect(WISPS_DATA.length).toBeGreaterThanOrEqual(50);
  });

  it("ensures each wisp has a unique ID and non-empty name and description", () => {
    const ids = new Set<string>();
    for (const wisp of WISPS_DATA) {
      expect(ids.has(wisp.id)).toBe(false);
      ids.add(wisp.id);

      expect(wisp.name.trim().length).toBeGreaterThan(0);
      expect(wisp.description.trim().length).toBeGreaterThan(0);
      expect(wisp.setId).toBe(TFT_RELEASE_CONFIG.setId);
      expect(wisp.patch).toBe(TFT_RELEASE_CONFIG.patch);
      expect(wisp.verified).toBe(true);
      expect(wisp.source).toBe("communitydragon");
    }
  });

  it("contains no cosmetic or placeholder naming remnants", () => {
    const forbidden = ["river sprite", "forest luminary", "moonlit wisp", "solar spark", "coven familiar"];
    for (const wisp of WISPS_DATA) {
      const lower = wisp.name.toLowerCase();
      for (const f of forbidden) {
        expect(lower).not.toBe(f);
      }
      expect(lower).not.toContain("placeholder");
      expect(lower).not.toContain("debug");
      expect(lower).not.toContain("tft_");
    }
  });

  it("has valid metadata matching release configuration", () => {
    expect(WISP_SOURCE_METADATA.setId).toBe(TFT_RELEASE_CONFIG.setId);
    expect(WISP_SOURCE_METADATA.patch).toBe(TFT_RELEASE_CONFIG.patch);
    expect(WISP_SOURCE_METADATA.verificationStatus).toBe("verified");
  });
});
