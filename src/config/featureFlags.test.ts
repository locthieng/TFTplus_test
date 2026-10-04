import { describe, it, expect } from "vitest";
import { FEATURE_FLAGS } from "./featureFlags";

describe("Production Feature Flags Tests", () => {
  it("enforces safe production defaults for experimental features", () => {
    // Verified static features
    expect(FEATURE_FLAGS.wisps).toBe(true);
    expect(FEATURE_FLAGS.pets).toBe(true);

    // Unverified / experimental features must remain disabled
    expect(FEATURE_FLAGS.hexCores).toBe(false);
    expect(FEATURE_FLAGS.riotLogin).toBe(false);
    expect(FEATURE_FLAGS.liveLeaderboard).toBe(false);
    expect(typeof FEATURE_FLAGS.livePlayerData).toBe("boolean");
    expect(FEATURE_FLAGS.livePlayerData).toBe(false);
  });
});
