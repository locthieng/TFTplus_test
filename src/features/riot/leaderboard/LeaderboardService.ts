import "server-only";

import { PlatformRegion } from "@/types/region";
import { RiotApiClient, defaultRiotApiClient } from "../client/RiotApiClient";
import { RiotCache, defaultRiotCache } from "../cache/RiotCache";
import { buildRiotCacheKey } from "../cache/riotCacheKeys";
import { RiotAccountService, defaultRiotAccountService } from "../account/RiotAccountService";
import { getRegionRouting, getPlatformBaseUrl } from "../routing/riotRouting";
import { RiotLogger, defaultRiotLogger } from "../logging/RiotLogger";

export interface RawLeagueListDto {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: Array<{
    puuid?: string;
    summonerId: string;
    leaguePoints: number;
    rank: string;
    wins: number;
    losses: number;
    veteran?: boolean;
    inactive?: boolean;
    freshBlood?: boolean;
    hotStreak?: boolean;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  puuid?: string;
  summonerId?: string;
  accountResolved: boolean;
  gameName?: string;
  tagLine?: string;
  tier: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  games: number;
}

export class LeaderboardService {
  constructor(
    private readonly client: RiotApiClient = defaultRiotApiClient,
    private readonly cache: RiotCache = defaultRiotCache,
    private readonly accountService: RiotAccountService = defaultRiotAccountService,
    private readonly logger: RiotLogger = defaultRiotLogger
  ) {}

  async getChallengerLeaderboard(
    region: PlatformRegion,
    limit = 25
  ): Promise<LeaderboardEntry[]> {
    const routing = getRegionRouting(region);
    if (!routing) {
      throw new Error(`Unsupported region for leaderboard: ${region}`);
    }

    const cacheKey = buildRiotCacheKey("leaderboard", region, limit);
    const cached = await this.cache.get<LeaderboardEntry[]>(cacheKey);
    if (cached) {
      this.logger.logCacheHit("LeaderboardService", "getChallengerLeaderboard", {
        namespace: "leaderboard",
        region,
      });
      return cached;
    }
    this.logger.logCacheMiss("LeaderboardService", "getChallengerLeaderboard", {
      namespace: "leaderboard",
      region,
    });

    const baseUrl = getPlatformBaseUrl(routing.platformRoute);
    const url = `${baseUrl}/tft/league/v1/challenger?queue=RANKED_TFT`;

    const leagueData = await this.client.get<RawLeagueListDto>(url);
    const sortedRaw = (leagueData.entries || [])
      .sort((a, b) => b.leaguePoints - a.leaguePoints)
      .slice(0, limit);

    // Controlled concurrency configurable via RIOT_ACCOUNT_RESOLUTION_CONCURRENCY (default: 3)
    const chunkSize = Math.max(
      1,
      Math.min(
        10,
        parseInt(process.env.RIOT_ACCOUNT_RESOLUTION_CONCURRENCY || "3", 10)
      )
    );
    const results: LeaderboardEntry[] = [];

    for (let i = 0; i < sortedRaw.length; i += chunkSize) {
      const chunk = sortedRaw.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (entry, indexInChunk) => {
        const rank = i + indexInChunk + 1;
        let accountResolved = false;
        let gameName: string | undefined = undefined;
        let tagLine: string | undefined = undefined;

        if (entry.puuid) {
          try {
            const acc = await this.accountService.getAccountByPuuid(
              routing.regionalRoute,
              entry.puuid
            );
            gameName = acc.gameName;
            tagLine = acc.tagLine;
            accountResolved = true;
          } catch {
            accountResolved = false;
          }
        }

        const wins = entry.wins || 0;
        const losses = entry.losses || 0;

        return {
          rank,
          puuid: entry.puuid,
          summonerId: entry.summonerId,
          accountResolved,
          gameName,
          tagLine,
          tier: leagueData.tier || "CHALLENGER",
          leaguePoints: entry.leaguePoints || 0,
          wins,
          losses,
          games: wins + losses,
        };
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    // Cache leaderboard for 5 minutes (300s)
    await this.cache.set(cacheKey, results, 300);
    return results;
  }
}

export const defaultLeaderboardService = new LeaderboardService();
