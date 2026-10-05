import "server-only";

import { RiotApiClient, defaultRiotApiClient } from "../client/RiotApiClient";
import { RiotCache, defaultRiotCache } from "../cache/RiotCache";
import { buildRiotCacheKey } from "../cache/riotCacheKeys";
import { RiotPlatformRoute } from "../routing/riotRouting.types";
import { getPlatformBaseUrl } from "../routing/riotRouting";
import { RiotLogger, defaultRiotLogger } from "../logging/RiotLogger";

export interface RawLeagueEntry {
  leagueId?: string;
  queueType: string;
  tier: string;
  rank?: string;
  puuid?: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran?: boolean;
  inactive?: boolean;
  freshBlood?: boolean;
  hotStreak?: boolean;
}

export interface TftRank {
  queueType: string;
  tier: string;
  rank?: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  games: number;
}

export class TftRankService {
  constructor(
    private readonly client: RiotApiClient = defaultRiotApiClient,
    private readonly cache: RiotCache = defaultRiotCache,
    private readonly logger: RiotLogger = defaultRiotLogger
  ) {}

  async getPlayerRank(
    platformRoute: RiotPlatformRoute,
    puuid: string
  ): Promise<TftRank | undefined> {
    const cacheKey = buildRiotCacheKey("rank", platformRoute, puuid);
    const cached = await this.cache.get<TftRank | "UNRANKED">(cacheKey);
    if (cached) {
      this.logger.logCacheHit("TftRankService", "getPlayerRank", {
        namespace: "rank",
        region: platformRoute,
        identifierTruncated: this.logger.truncatePuuid(puuid),
      });
      return cached === "UNRANKED" ? undefined : cached;
    }
    this.logger.logCacheMiss("TftRankService", "getPlayerRank", {
      namespace: "rank",
      region: platformRoute,
      identifierTruncated: this.logger.truncatePuuid(puuid),
    });

    const baseUrl = getPlatformBaseUrl(platformRoute);
    const url = `${baseUrl}/tft/league/v1/by-puuid/${encodeURIComponent(puuid)}`;

    try {
      const entries = await this.client.get<RawLeagueEntry[]>(url);
      const rankedTft = entries.find((e) => e.queueType === "RANKED_TFT");

      if (!rankedTft) {
        // Cache unranked status for 120s
        await this.cache.set(cacheKey, "UNRANKED", 120);
        return undefined;
      }

      const rank: TftRank = {
        queueType: rankedTft.queueType,
        tier: rankedTft.tier,
        rank: rankedTft.rank,
        leaguePoints: rankedTft.leaguePoints || 0,
        wins: rankedTft.wins || 0,
        losses: rankedTft.losses || 0,
        games: (rankedTft.wins || 0) + (rankedTft.losses || 0),
      };

      await this.cache.set(cacheKey, rank, 120);
      return rank;
    } catch (err: unknown) {
      throw err;
    }
  }
}

export const defaultTftRankService = new TftRankService();
