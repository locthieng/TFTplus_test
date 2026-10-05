import "server-only";

import { RiotApiClient, defaultRiotApiClient } from "../client/RiotApiClient";
import { RiotCache, defaultRiotCache } from "../cache/RiotCache";
import { buildRiotCacheKey } from "../cache/riotCacheKeys";
import { RiotRegionalRoute } from "../routing/riotRouting.types";
import { getRegionalBaseUrl } from "../routing/riotRouting";
import { RiotLogger, defaultRiotLogger } from "../logging/RiotLogger";

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export class RiotAccountService {
  constructor(
    private readonly client: RiotApiClient = defaultRiotApiClient,
    private readonly cache: RiotCache = defaultRiotCache,
    private readonly logger: RiotLogger = defaultRiotLogger
  ) {}

  async getAccountByRiotId(
    regionalRoute: RiotRegionalRoute,
    gameName: string,
    tagLine: string
  ): Promise<RiotAccount> {
    const cacheKey = buildRiotCacheKey("account", regionalRoute, gameName, tagLine);

    const cached = await this.cache.get<RiotAccount>(cacheKey);
    if (cached) {
      this.logger.logCacheHit("RiotAccountService", "getAccountByRiotId", {
        namespace: "account",
        region: regionalRoute,
      });
      return cached;
    }
    this.logger.logCacheMiss("RiotAccountService", "getAccountByRiotId", {
      namespace: "account",
      region: regionalRoute,
    });

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;

    const account = await this.client.get<RiotAccount>(url);

    // Cache for 30 minutes (1800s)
    await this.cache.set(cacheKey, account, 1800);
    // Also cache by PUUID
    const puuidKey = buildRiotCacheKey("account_by_puuid", regionalRoute, account.puuid);
    await this.cache.set(puuidKey, account, 1800);

    return account;
  }

  async getAccountByPuuid(
    regionalRoute: RiotRegionalRoute,
    puuid: string
  ): Promise<RiotAccount> {
    const cacheKey = buildRiotCacheKey("account_by_puuid", regionalRoute, puuid);
    const cached = await this.cache.get<RiotAccount>(cacheKey);
    if (cached) {
      this.logger.logCacheHit("RiotAccountService", "getAccountByPuuid", {
        namespace: "account_by_puuid",
        region: regionalRoute,
        identifierTruncated: this.logger.truncatePuuid(puuid),
      });
      return cached;
    }
    this.logger.logCacheMiss("RiotAccountService", "getAccountByPuuid", {
      namespace: "account_by_puuid",
      region: regionalRoute,
      identifierTruncated: this.logger.truncatePuuid(puuid),
    });

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;

    const account = await this.client.get<RiotAccount>(url);
    await this.cache.set(cacheKey, account, 1800);

    return account;
  }
}

export const defaultRiotAccountService = new RiotAccountService();
