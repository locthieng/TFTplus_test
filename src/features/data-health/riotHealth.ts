import { FEATURE_FLAGS } from "@/config/featureFlags";
import { defaultTftStaticResolver } from "@/features/riot/mappers/TftStaticResolver";

export interface RiotHealthDiagnostics {
  livePlayerFeature: boolean;
  liveLeaderboardFeature: boolean;
  apiKeyConfigured: boolean;
  accountServiceStatus: "Ready" | "Missing API Key";
  rankServiceStatus: "Ready" | "Missing API Key";
  matchServiceStatus: "Ready" | "Missing API Key";
  leaderboardServiceStatus: "Ready" | "Missing API Key";
  cacheType: "Redis" | "In-Memory";
  productionCacheStatus: "Ready" | "Dev/Missing";
  supportedRegions: string[];
  concurrencyLimit: number;
  unresolvedMetrics: {
    champions: string[];
    items: string[];
    traits: string[];
    augments: string[];
    totalUnresolved: number;
  };
}

export function computeRiotHealthDiagnostics(): RiotHealthDiagnostics {
  const isKeyConfigured = Boolean(process.env.RIOT_API_KEY);
  const isRedisConfigured = Boolean(process.env.REDIS_URL);
  const concurrency = parseInt(
    process.env.RIOT_ACCOUNT_RESOLUTION_CONCURRENCY || "3",
    10
  );
  const unresolved = defaultTftStaticResolver.getUnresolvedMetrics();
  const totalUnresolved =
    unresolved.champions.length +
    unresolved.items.length +
    unresolved.traits.length +
    unresolved.augments.length;

  return {
    livePlayerFeature: FEATURE_FLAGS.livePlayerData,
    liveLeaderboardFeature: FEATURE_FLAGS.liveLeaderboard,
    apiKeyConfigured: isKeyConfigured,
    accountServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    rankServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    matchServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    leaderboardServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    cacheType: isRedisConfigured ? "Redis" : "In-Memory",
    productionCacheStatus: isRedisConfigured ? "Ready" : "Dev/Missing",
    supportedRegions: ["VN2", "KR", "NA1", "EUW1"],
    concurrencyLimit: concurrency,
    unresolvedMetrics: {
      ...unresolved,
      totalUnresolved,
    },
  };
}
