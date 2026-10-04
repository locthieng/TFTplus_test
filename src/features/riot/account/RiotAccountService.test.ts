import { describe, it, expect, vi } from "vitest";
import { RiotAccountService } from "./RiotAccountService";
import { RiotApiClient } from "../client/RiotApiClient";
import { InMemoryRiotCache } from "../cache/RiotCache";
import accountFixture from "../__fixtures__/account.json";

describe("RiotAccountService", () => {
  it("fetches and caches account by Riot ID", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(accountFixture),
    } as unknown as RiotApiClient;

    const cache = new InMemoryRiotCache();
    const service = new RiotAccountService(mockClient, cache);

    const account = await service.getAccountByRiotId("ASIA", "Faker", "KR1");

    expect(account.puuid).toBe("mock-puuid-faker-kr1");
    expect(account.gameName).toBe("Faker");
    expect(account.tagLine).toBe("KR1");
    expect(mockClient.get).toHaveBeenCalledTimes(1);

    // Second call should hit cache
    const cachedAccount = await service.getAccountByRiotId("ASIA", "Faker", "KR1");
    expect(cachedAccount).toEqual(account);
    expect(mockClient.get).toHaveBeenCalledTimes(1);
  });
});
