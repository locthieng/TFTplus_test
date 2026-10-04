import { describe, it, expect, vi, beforeEach } from "vitest";
import { TftMatchService } from "./TftMatchService";
import { RiotApiClient } from "../client/RiotApiClient";
import { RiotCache } from "../cache/RiotCache";
import { RiotAccountService } from "../account/RiotAccountService";
import { RawMatchDto } from "./tftMatch.types";
import matchDetailFixture from "../__fixtures__/matchDetail.json";

describe("TftMatchService", () => {
  let mockClient: RiotApiClient;
  let mockCache: RiotCache;
  let mockAccountService: RiotAccountService;
  let service: TftMatchService;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as RiotApiClient;

    mockCache = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(undefined),
    } as unknown as RiotCache;

    mockAccountService = {
      getAccountByPuuid: vi.fn(),
    } as unknown as RiotAccountService;

    service = new TftMatchService(mockClient, mockCache, mockAccountService);
  });

  it("fetches and caches match IDs", async () => {
    vi.mocked(mockClient.get).mockResolvedValueOnce(["MATCH_1", "MATCH_2"]);

    const ids = await service.getMatchIds("ASIA", "puuid-123", 2);

    expect(ids).toEqual(["MATCH_1", "MATCH_2"]);
    expect(mockClient.get).toHaveBeenCalledWith(
      "https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/puuid-123/ids?count=2"
    );
    expect(mockCache.set).toHaveBeenCalledWith("match_ids:asia:puuid-123:2", ["MATCH_1", "MATCH_2"], 120);
  });

  it("returns cached match IDs when available", async () => {
    vi.mocked(mockCache.get).mockResolvedValueOnce(["MATCH_CACHED"]);

    const ids = await service.getMatchIds("ASIA", "puuid-123", 5);

    expect(ids).toEqual(["MATCH_CACHED"]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("fetches and caches match detail", async () => {
    vi.mocked(mockClient.get).mockResolvedValueOnce(matchDetailFixture);

    const detail = await service.getMatchDetail("ASIA", "KR_7123456781");

    expect(detail.metadata.match_id).toBe("KR_7123456781");
    expect(mockClient.get).toHaveBeenCalledWith(
      "https://asia.api.riotgames.com/tft/match/v1/matches/KR_7123456781"
    );
    expect(mockCache.set).toHaveBeenCalledWith("match_detail:asia:kr_7123456781", matchDetailFixture, 1800);
  });

  it("preserves failed match IDs when getting player matches", async () => {
    vi.mocked(mockClient.get)
      .mockResolvedValueOnce(["MATCH_OK", "MATCH_FAIL"]) // match IDs
      .mockResolvedValueOnce(matchDetailFixture) // 1st detail ok
      .mockRejectedValueOnce(new Error("Network error")); // 2nd detail fail

    const result = await service.getPlayerMatches("ASIA", "mock-puuid-faker-kr1", 2);

    expect(result.matches.length).toBe(1);
    expect(result.matches[0].matchId).toBe("KR_7123456781");
    expect(result.failedMatchIds).toEqual(["MATCH_FAIL"]);
  });

  it("fetches detailed match and resolves participant accounts", async () => {
    vi.mocked(mockClient.get).mockResolvedValueOnce(matchDetailFixture as RawMatchDto);

    vi.mocked(mockAccountService.getAccountByPuuid)
      .mockResolvedValueOnce({
        puuid: "mock-puuid-faker-kr1",
        gameName: "Hide on bush",
        tagLine: "KR1",
      })
      .mockRejectedValueOnce(new Error("Account not found")); // 2nd participant unresolved

    const detailed = await service.getDetailedMatch("kr", "KR_7123456781");

    expect(detailed.matchId).toBe("KR_7123456781");
    expect(detailed.region).toBe("kr");
    expect(detailed.queueName).toBe("Ranked TFT");
    expect(detailed.participants.length).toBe(2);

    // Participant 1 (placement 1, resolved)
    expect(detailed.participants[0].placement).toBe(1);
    expect(detailed.participants[0].accountResolved).toBe(true);
    expect(detailed.participants[0].gameName).toBe("Hide on bush");
    expect(detailed.participants[0].tagLine).toBe("KR1");
    expect(detailed.participants[0].units.length).toBe(2);

    // Participant 2 (placement 2, unresolved)
    expect(detailed.participants[1].placement).toBe(2);
    expect(detailed.participants[1].accountResolved).toBe(false);
    expect(detailed.participants[1].gameName).toBeUndefined();
    expect(detailed.participants[1].tagLine).toBeUndefined();
  });

  it("throws RiotApiError when given an unsupported region", async () => {
    await expect(service.getDetailedMatch("invalid-region", "MATCH_123")).rejects.toThrow(
      "Unsupported region for match details"
    );
  });
});
