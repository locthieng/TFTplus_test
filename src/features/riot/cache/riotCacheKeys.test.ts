import { describe, it, expect } from "vitest";
import { buildRiotCacheKey, RIOT_CACHE_PREFIX, RIOT_CACHE_VERSION } from "./riotCacheKeys";

describe("riotCacheKeys", () => {
  it("prefixes keys with standard prefix and version", () => {
    const key = buildRiotCacheKey("account", "asia", "faker", "kr1");
    expect(key).toBe(`${RIOT_CACHE_PREFIX}:${RIOT_CACHE_VERSION}:account:asia:faker:kr1`);
  });

  it("handles case-insensitivity and trimming", () => {
    const key = buildRiotCacheKey("Rank", " VN2 ", "PUUID-123 ");
    expect(key).toBe("tftplus:riot:v1:rank:vn2:puuid-123");
  });

  it("handles match detail and leaderboard namespaces correctly", () => {
    expect(buildRiotCacheKey("match_detail", "sea", "VN2_12345")).toBe(
      "tftplus:riot:v1:match_detail:sea:vn2_12345"
    );
    expect(buildRiotCacheKey("leaderboard", "vn", 25)).toBe(
      "tftplus:riot:v1:leaderboard:vn:25"
    );
  });
});
