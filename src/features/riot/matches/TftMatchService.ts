import "server-only";

import { RiotApiClient, defaultRiotApiClient } from "../client/RiotApiClient";
import { RiotCache, defaultRiotCache } from "../cache/RiotCache";
import { RiotAccountService, defaultRiotAccountService } from "../account/RiotAccountService";
import { RiotRegionalRoute } from "../routing/riotRouting.types";
import { getRegionalBaseUrl, getRegionRouting } from "../routing/riotRouting";
import { RiotApiError } from "../client/RiotApiError";
import {
  RawMatchDto,
  PlayerMatchSummary,
  DetailedMatch,
  DetailedMatchParticipant,
  getQueueName,
} from "./tftMatch.types";
import { mapRawMatchToPlayerSummary } from "./tftMatchMapper";

export interface MatchFetchResult {
  matches: PlayerMatchSummary[];
  failedMatchIds: string[];
}

export class TftMatchService {
  constructor(
    private readonly client: RiotApiClient = defaultRiotApiClient,
    private readonly cache: RiotCache = defaultRiotCache,
    private readonly accountService: RiotAccountService = defaultRiotAccountService
  ) {}

  async getMatchIds(
    regionalRoute: RiotRegionalRoute,
    puuid: string,
    count = 10
  ): Promise<string[]> {
    const cacheKey = `match_ids:${regionalRoute.toLowerCase()}:${puuid}:${count}`;
    const cached = await this.cache.get<string[]>(cacheKey);
    if (cached) return cached;

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/tft/match/v1/matches/by-puuid/${encodeURIComponent(
      puuid
    )}/ids?count=${count}`;

    const matchIds = await this.client.get<string[]>(url);
    await this.cache.set(cacheKey, matchIds, 120); // 2 minutes TTL
    return matchIds;
  }

  async getMatchDetail(
    regionalRoute: RiotRegionalRoute,
    matchId: string
  ): Promise<RawMatchDto> {
    const cacheKey = `match_detail:${regionalRoute.toLowerCase()}:${matchId.toLowerCase()}`;
    const cached = await this.cache.get<RawMatchDto>(cacheKey);
    if (cached) return cached;

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/tft/match/v1/matches/${encodeURIComponent(matchId)}`;

    const detail = await this.client.get<RawMatchDto>(url);
    await this.cache.set(cacheKey, detail, 1800); // 30 minutes TTL
    return detail;
  }

  async getPlayerMatches(
    regionalRoute: RiotRegionalRoute,
    puuid: string,
    count = 10
  ): Promise<MatchFetchResult> {
    const matchIds = await this.getMatchIds(regionalRoute, puuid, count);
    if (matchIds.length === 0) {
      return { matches: [], failedMatchIds: [] };
    }

    // Controlled concurrency in batches of 4
    const BATCH_SIZE = 4;
    const matches: PlayerMatchSummary[] = [];
    const failedMatchIds: string[] = [];

    for (let i = 0; i < matchIds.length; i += BATCH_SIZE) {
      const batchIds = matchIds.slice(i, i + BATCH_SIZE);
      const batchPromises = batchIds.map(async (id) => {
        try {
          const detail = await this.getMatchDetail(regionalRoute, id);
          const summary = mapRawMatchToPlayerSummary(detail, puuid);
          if (summary) {
            return { success: true as const, id, summary };
          }
          return { success: false as const, id };
        } catch {
          return { success: false as const, id };
        }
      });

      const results = await Promise.all(batchPromises);
      for (const res of results) {
        if (res.success && res.summary) {
          matches.push(res.summary);
        } else {
          failedMatchIds.push(res.id);
        }
      }
    }

    return { matches, failedMatchIds };
  }

  async getDetailedMatch(
    region: string,
    matchId: string
  ): Promise<DetailedMatch> {
    const norm = region.toLowerCase();
    let routing = getRegionRouting(norm);
    if (!routing) {
      if (norm.startsWith("vn")) routing = getRegionRouting("vn");
      else if (norm.startsWith("kr")) routing = getRegionRouting("kr");
      else if (norm.startsWith("na")) routing = getRegionRouting("na");
      else if (norm.startsWith("euw")) routing = getRegionRouting("euw");
    }

    if (!routing) {
      throw new RiotApiError({
        message: `Unsupported region for match details: '${region}'`,
        code: "INVALID_INPUT",
        statusCode: 400,
      });
    }

    const detail = await this.getMatchDetail(routing.regionalRoute, matchId);

    const chunkSize = Math.max(
      1,
      Math.min(
        10,
        parseInt(process.env.RIOT_ACCOUNT_RESOLUTION_CONCURRENCY || "3", 10)
      )
    );

    const rawParticipants = detail.info.participants || [];
    const participants: DetailedMatchParticipant[] = [];

    for (let i = 0; i < rawParticipants.length; i += chunkSize) {
      const chunk = rawParticipants.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (p) => {
        let accountResolved = false;
        let gameName: string | undefined = undefined;
        let tagLine: string | undefined = undefined;

        if (p.puuid) {
          try {
            const acc = await this.accountService.getAccountByPuuid(
              routing!.regionalRoute,
              p.puuid
            );
            gameName = acc.gameName;
            tagLine = acc.tagLine;
            accountResolved = true;
          } catch {
            accountResolved = false;
          }
        }

        return {
          puuid: p.puuid,
          accountResolved,
          gameName,
          tagLine,
          placement: p.placement,
          level: p.level,
          goldLeft: p.gold_left,
          lastRound: p.last_round,
          timeEliminated: p.time_eliminated,
          augments: p.augments || [],
          traits: (p.traits || []).map((t) => ({
            name: t.name,
            numUnits: t.num_units,
            style: t.style,
            tierCurrent: t.tier_current,
            tierTotal: t.tier_total,
          })),
          units: (p.units || []).map((u) => ({
            characterId: u.character_id,
            starLevel: u.tier ?? 1,
            itemNames: u.itemNames || [],
            rarity: u.rarity,
          })),
        };
      });

      const chunkResults = await Promise.all(chunkPromises);
      participants.push(...chunkResults);
    }

    // Sort participants by placement ascending (1st -> 8th)
    participants.sort((a, b) => a.placement - b.placement);

    return {
      matchId: detail.metadata.match_id || matchId,
      region: routing.region,
      gameDatetime: detail.info.game_datetime,
      gameLengthSeconds: detail.info.game_length,
      queueId: detail.info.queue_id,
      queueName: getQueueName(detail.info.queue_id),
      tftSetNumber: detail.info.tft_set_number,
      gameVersion: detail.info.game_version,
      participants,
    };
  }
}

export const defaultTftMatchService = new TftMatchService();
