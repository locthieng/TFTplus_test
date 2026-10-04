import "server-only";

import { PlatformRegion } from "@/types/region";
import { getRegionRouting } from "../routing/riotRouting";
import { RiotAccountService, defaultRiotAccountService, RiotAccount } from "../account/RiotAccountService";
import { TftRankService, defaultTftRankService, TftRank } from "../rank/TftRankService";
import { TftMatchService, defaultTftMatchService, MatchFetchResult } from "../matches/TftMatchService";
import { PlayerMatchSummary } from "../matches/tftMatch.types";
import { RiotApiError } from "../client/RiotApiError";

export interface RecentMatchStats {
  gamesCount: number;
  averagePlacement: number;
  top4Count: number;
  top4Rate: number;
  firstPlaceCount: number;
  firstPlaceRate: number;
}

export interface PlayerProfileWarnings {
  rankUnavailable?: boolean;
  matchesUnavailable?: boolean;
  failedMatchCount?: number;
  messages: string[];
}

export interface PlayerProfile {
  account: RiotAccount;
  region: PlatformRegion;
  rank?: TftRank;
  recentMatches: PlayerMatchSummary[];
  recentStats: RecentMatchStats;
  warnings?: PlayerProfileWarnings;
}

export class PlayerProfileService {
  constructor(
    private readonly accountService: RiotAccountService = defaultRiotAccountService,
    private readonly rankService: TftRankService = defaultTftRankService,
    private readonly matchService: TftMatchService = defaultTftMatchService
  ) {}

  async getPlayerProfile(
    region: PlatformRegion,
    gameName: string,
    tagLine: string
  ): Promise<PlayerProfile> {
    const routing = getRegionRouting(region);
    if (!routing) {
      throw new RiotApiError({
        message: `Unsupported region '${region}'`,
        code: "INVALID_INPUT",
        statusCode: 400,
      });
    }

    // 1. Resolve Account (fails profile if account lookup fails)
    const account = await this.accountService.getAccountByRiotId(
      routing.regionalRoute,
      gameName,
      tagLine
    );

    const warnings: PlayerProfileWarnings = {
      messages: [],
    };

    // 2. Concurrently fetch Rank and Matches with explicit failure tracking
    const rankPromise = this.rankService
      .getPlayerRank(routing.platformRoute, account.puuid)
      .catch((err: unknown) => {
        warnings.rankUnavailable = true;
        warnings.messages.push(
          err instanceof RiotApiError && err.code === "RATE_LIMITED"
            ? "Rank temporarily unavailable due to rate limits."
            : "Rank information is temporarily unavailable."
        );
        return undefined;
      });

    const matchPromise = this.matchService
      .getPlayerMatches(routing.regionalRoute, account.puuid, 10)
      .catch((err: unknown) => {
        warnings.matchesUnavailable = true;
        warnings.messages.push(
          err instanceof RiotApiError && err.code === "RATE_LIMITED"
            ? "Match history temporarily unavailable due to rate limits."
            : "Match history is temporarily unavailable."
        );
        return { matches: [] as PlayerMatchSummary[], failedMatchIds: [] as string[] };
      });

    const [rank, matchResult] = await Promise.all([rankPromise, matchPromise]);

    const { matches: recentMatches, failedMatchIds } = matchResult as MatchFetchResult;

    if (failedMatchIds.length > 0) {
      warnings.failedMatchCount = failedMatchIds.length;
      const totalExpected = recentMatches.length + failedMatchIds.length;
      warnings.messages.push(
        `${recentMatches.length} of ${totalExpected} recent matches loaded successfully.`
      );
    }

    // 3. Compute stats derived strictly from recent matches
    const gamesCount = recentMatches.length;
    let averagePlacement = 0;
    let top4Count = 0;
    let firstPlaceCount = 0;

    if (gamesCount > 0) {
      const sumPlacement = recentMatches.reduce((acc, m) => acc + m.placement, 0);
      averagePlacement = parseFloat((sumPlacement / gamesCount).toFixed(2));
      top4Count = recentMatches.filter((m) => m.placement <= 4).length;
      firstPlaceCount = recentMatches.filter((m) => m.placement === 1).length;
    }

    const recentStats: RecentMatchStats = {
      gamesCount,
      averagePlacement,
      top4Count,
      top4Rate: gamesCount > 0 ? Math.round((top4Count / gamesCount) * 100) : 0,
      firstPlaceCount,
      firstPlaceRate: gamesCount > 0 ? Math.round((firstPlaceCount / gamesCount) * 100) : 0,
    };

    return {
      account,
      region,
      rank,
      recentMatches,
      recentStats,
      warnings: warnings.messages.length > 0 ? warnings : undefined,
    };
  }
}

export const defaultPlayerProfileService = new PlayerProfileService();
