import { describe, it, expect, vi } from "vitest";
import { TftRankService } from "./TftRankService";
import { RiotApiClient } from "../client/RiotApiClient";
import { InMemoryRiotCache } from "../cache/RiotCache";
import rankFixture from "../__fixtures__/rank.json";

describe("TftRankService", () => {
  it("extracts RANKED_TFT entry correctly", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(rankFixture),
    } as unknown as RiotApiClient;

    const cache = new InMemoryRiotCache();
    const service = new TftRankService(mockClient, cache);

    const rank = await service.getPlayerRank("KR", "mock-puuid-faker-kr1");

    expect(rank).toBeDefined();
    expect(rank?.tier).toBe("CHALLENGER");
    expect(rank?.leaguePoints).toBe(1250);
    expect(rank?.wins).toBe(180);
    expect(rank?.losses).toBe(120);
    expect(rank?.games).toBe(300);
  });

  it("returns undefined for unranked players", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue([]),
    } as unknown as RiotApiClient;

    const cache = new InMemoryRiotCache();
    const service = new TftRankService(mockClient, cache);

    const rank = await service.getPlayerRank("KR", "mock-puuid-unranked");
    expect(rank).toBeUndefined();
  });

  it("calls the exact /tft/league/v1/by-puuid/{puuid} endpoint across all platforms", async () => {
    const platforms = [
      { route: "VN2" as const, expected: "https://vn2.api.riotgames.com/tft/league/v1/by-puuid/test-puuid" },
      { route: "NA1" as const, expected: "https://na1.api.riotgames.com/tft/league/v1/by-puuid/test-puuid" },
      { route: "KR" as const, expected: "https://kr.api.riotgames.com/tft/league/v1/by-puuid/test-puuid" },
      { route: "EUW1" as const, expected: "https://euw1.api.riotgames.com/tft/league/v1/by-puuid/test-puuid" },
    ];

    for (const p of platforms) {
      const mockClient = {
        get: vi.fn().mockResolvedValue([]),
      } as unknown as RiotApiClient;
      const cache = new InMemoryRiotCache();
      const service = new TftRankService(mockClient, cache);

      await service.getPlayerRank(p.route, "test-puuid");
      expect(mockClient.get).toHaveBeenCalledWith(p.expected);
    }
  });
});
