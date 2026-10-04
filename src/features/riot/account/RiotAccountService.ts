import "server-only";

import { RiotApiClient, defaultRiotApiClient } from "../client/RiotApiClient";
import { RiotCache, defaultRiotCache } from "../cache/RiotCache";
import { RiotRegionalRoute } from "../routing/riotRouting.types";
import { getRegionalBaseUrl } from "../routing/riotRouting";

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export class RiotAccountService {
  constructor(
    private readonly client: RiotApiClient = defaultRiotApiClient,
    private readonly cache: RiotCache = defaultRiotCache
  ) {}

  async getAccountByRiotId(
    regionalRoute: RiotRegionalRoute,
    gameName: string,
    tagLine: string
  ): Promise<RiotAccount> {
    const cacheKey = `account:${regionalRoute.toLowerCase()}:${encodeURIComponent(
      gameName.toLowerCase()
    )}:${encodeURIComponent(tagLine.toLowerCase())}`;

    const cached = await this.cache.get<RiotAccount>(cacheKey);
    if (cached) return cached;

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;

    const account = await this.client.get<RiotAccount>(url);

    // Cache for 30 minutes (1800s)
    await this.cache.set(cacheKey, account, 1800);
    // Also cache by PUUID
    await this.cache.set(`account_by_puuid:${regionalRoute.toLowerCase()}:${account.puuid}`, account, 1800);

    return account;
  }

  async getAccountByPuuid(
    regionalRoute: RiotRegionalRoute,
    puuid: string
  ): Promise<RiotAccount> {
    const cacheKey = `account_by_puuid:${regionalRoute.toLowerCase()}:${puuid}`;
    const cached = await this.cache.get<RiotAccount>(cacheKey);
    if (cached) return cached;

    const baseUrl = getRegionalBaseUrl(regionalRoute);
    const url = `${baseUrl}/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;

    const account = await this.client.get<RiotAccount>(url);
    await this.cache.set(cacheKey, account, 1800);

    return account;
  }
}

export const defaultRiotAccountService = new RiotAccountService();
