import { describe, it, expect, vi } from "vitest";
import { PlayerProfileService } from "./PlayerProfileService";
import { RiotAccountService } from "../account/RiotAccountService";
import { TftRankService } from "../rank/TftRankService";
import { TftMatchService } from "../matches/TftMatchService";
import { PlayerMatchSummary } from "../matches/tftMatch.types";

describe("PlayerProfileService", () => {
  const dummyAccount = {
    puuid: "mock-puuid-1",
    gameName: "Faker",
    tagLine: "KR1",
  };

  const dummyMatches: PlayerMatchSummary[] = [
    {
      matchId: "M1",
      gameDatetime: 1000,
      gameLengthSeconds: 1800,
      placement: 1,
      level: 9,
      goldLeft: 10,
      units: [],
      traits: [],
      augmentIds: [],
    },
    {
      matchId: "M2",
      gameDatetime: 2000,
      gameLengthSeconds: 1700,
      placement: 3,
      level: 8,
      goldLeft: 5,
      units: [],
      traits: [],
      augmentIds: [],
    },
    {
      matchId: "M3",
      gameDatetime: 3000,
      gameLengthSeconds: 1600,
      placement: 5,
      level: 8,
      goldLeft: 0,
      units: [],
      traits: [],
      augmentIds: [],
    },
  ];

  it("combines account, rank, and recent match metrics correctly", async () => {
    const mockAccountService = {
      getAccountByRiotId: vi.fn().mockResolvedValue(dummyAccount),
    } as unknown as RiotAccountService;

    const mockRankService = {
      getPlayerRank: vi.fn().mockResolvedValue({
        queueType: "RANKED_TFT",
        tier: "CHALLENGER",
        rank: "I",
        leaguePoints: 1250,
        wins: 100,
        losses: 50,
        games: 150,
      }),
    } as unknown as TftRankService;

    const mockMatchService = {
      getPlayerMatches: vi.fn().mockResolvedValue({
        matches: dummyMatches,
        failedMatchIds: [],
      }),
    } as unknown as TftMatchService;

    const service = new PlayerProfileService(
      mockAccountService,
      mockRankService,
      mockMatchService
    );

    const profile = await service.getPlayerProfile("kr", "Faker", "KR1");

    expect(profile.account.gameName).toBe("Faker");
    expect(profile.rank?.tier).toBe("CHALLENGER");
    expect(profile.recentMatches.length).toBe(3);
    expect(profile.recentStats.averagePlacement).toBe(3);
    expect(profile.recentStats.top4Count).toBe(2);
    expect(profile.warnings).toBeUndefined();
  });

  it("handles rank service failure by setting warning instead of failing profile", async () => {
    const mockAccountService = {
      getAccountByRiotId: vi.fn().mockResolvedValue(dummyAccount),
    } as unknown as RiotAccountService;

    const mockRankService = {
      getPlayerRank: vi.fn().mockRejectedValue(new Error("503 Riot unavailable")),
    } as unknown as TftRankService;

    const mockMatchService = {
      getPlayerMatches: vi.fn().mockResolvedValue({
        matches: dummyMatches,
        failedMatchIds: [],
      }),
    } as unknown as TftMatchService;

    const service = new PlayerProfileService(
      mockAccountService,
      mockRankService,
      mockMatchService
    );

    const profile = await service.getPlayerProfile("kr", "Faker", "KR1");

    expect(profile.account.gameName).toBe("Faker");
    expect(profile.rank).toBeUndefined();
    expect(profile.warnings?.rankUnavailable).toBe(true);
    expect(profile.warnings?.messages.length).toBeGreaterThan(0);
  });

  it("handles partial match loading and informs through warnings", async () => {
    const mockAccountService = {
      getAccountByRiotId: vi.fn().mockResolvedValue(dummyAccount),
    } as unknown as RiotAccountService;

    const mockRankService = {
      getPlayerRank: vi.fn().mockResolvedValue(undefined),
    } as unknown as TftRankService;

    const mockMatchService = {
      getPlayerMatches: vi.fn().mockResolvedValue({
        matches: dummyMatches.slice(0, 2),
        failedMatchIds: ["M3"],
      }),
    } as unknown as TftMatchService;

    const service = new PlayerProfileService(
      mockAccountService,
      mockRankService,
      mockMatchService
    );

    const profile = await service.getPlayerProfile("kr", "Faker", "KR1");

    expect(profile.recentMatches.length).toBe(2);
    expect(profile.warnings?.failedMatchCount).toBe(1);
    expect(profile.warnings?.messages[0]).toContain("2 of 3 recent matches loaded");
  });
});
