import { describe, it, expect, vi } from "vitest";
import { LeaderboardService } from "./LeaderboardService";
import { RiotApiClient } from "../client/RiotApiClient";
import { InMemoryRiotCache } from "../cache/RiotCache";
import { RiotAccountService } from "../account/RiotAccountService";
import challengerFixture from "../__fixtures__/challengerLeague.json";

describe("LeaderboardService", () => {
  it("sorts entries by LP and resolves accounts safely", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(challengerFixture),
    } as unknown as RiotApiClient;

    const mockAccountService = {
      getAccountByPuuid: vi.fn().mockImplementation(async (_, puuid) => {
        if (puuid === "mock-puuid-top1") {
          return { puuid, gameName: "Dishsoap", tagLine: "NA1" };
        }
        return { puuid, gameName: "Setsuko", tagLine: "NA1" };
      }),
    } as unknown as RiotAccountService;

    const cache = new InMemoryRiotCache();
    const service = new LeaderboardService(mockClient, cache, mockAccountService);

    const entries = await service.getChallengerLeaderboard("na", 2);

    expect(entries.length).toBe(2);
    expect(entries[0].rank).toBe(1);
    expect(entries[0].accountResolved).toBe(true);
    expect(entries[0].gameName).toBe("Dishsoap");
    expect(entries[0].leaguePoints).toBe(1650);
    expect(entries[0].games).toBe(320); // 210 wins + 110 losses

    expect(entries[1].rank).toBe(2);
    expect(entries[1].accountResolved).toBe(true);
    expect(entries[1].gameName).toBe("Setsuko");
    expect(entries[1].leaguePoints).toBe(1520);
    expect(entries[1].games).toBe(310);

    expect(mockClient.get).toHaveBeenCalledWith(
      "https://na1.api.riotgames.com/tft/league/v1/challenger?queue=RANKED_TFT"
    );
  });

  it("handles unresolved account without fabricating fake name or tag", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(challengerFixture),
    } as unknown as RiotApiClient;

    const mockAccountService = {
      getAccountByPuuid: vi.fn().mockRejectedValue(new Error("Account not found")),
    } as unknown as RiotAccountService;

    const cache = new InMemoryRiotCache();
    const service = new LeaderboardService(mockClient, cache, mockAccountService);

    const entries = await service.getChallengerLeaderboard("na", 1);

    expect(entries[0].accountResolved).toBe(false);
    expect(entries[0].gameName).toBeUndefined();
    expect(entries[0].tagLine).toBeUndefined();
  });
});
