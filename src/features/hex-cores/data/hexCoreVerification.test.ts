import { describe, it, expect } from "vitest";
import { HEX_CORES_DATA } from "./hexCoresData";
import { HEX_CORE_SOURCE_METADATA } from "./hexCoreSourceMetadata";
import { FEATURE_FLAGS } from "@/config/featureFlags";

describe("Hex Core Verification & Feature Flag Tests", () => {
  it("enforces that unverified hex cores are flagged as unverified", () => {
    expect(HEX_CORES_DATA.length).toBeGreaterThan(0);
    for (const core of HEX_CORES_DATA) {
      expect(core.verified).toBe(false);
      expect(core.source).toBe("curated-speculative");
      expect(core.setId).toBe("18");
      expect(core.patch).toBe("18.3");
    }
  });

  it("has metadata documenting unverified status", () => {
    expect(HEX_CORE_SOURCE_METADATA.verificationStatus).toBe("unverified");
    expect(HEX_CORE_SOURCE_METADATA.setId).toBe("18");
    expect(HEX_CORE_SOURCE_METADATA.sourceNotes).toContain("hidden from production");
  });

  it("keeps hexCores disabled in production feature flags", () => {
    expect(FEATURE_FLAGS.hexCores).toBe(false);
  });
});
