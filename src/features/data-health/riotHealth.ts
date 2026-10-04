import { FEATURE_FLAGS } from "@/config/featureFlags";
import { defaultTftStaticResolver } from "@/features/riot/mappers/TftStaticResolver";
import { defaultRiotRateLimiter } from "@/features/riot/rate-limit/RiotRateLimiter";

export interface RiotHealthDiagnostics {
  livePlayerFeature: boolean;
  liveLeaderboardFeature: boolean;
  apiKeyConfigured: boolean;
  accountServiceStatus: "Ready" | "Missing API Key";
  rankServiceStatus: "Ready" | "Missing API Key";
  matchServiceStatus: "Ready" | "Missing API Key";
  leaderboardServiceStatus: "Ready" | "Missing API Key";
  rateLimiterStatus: "Ready" | "Missing";
  cacheType: "Redis" | "In-Memory";
  productionCacheStatus: "Ready" | "Warning" | "Dev/Missing";
  supportedRegions: string[];
  concurrencyLimit: number;
  unresolvedMetrics: {
    champions: string[];
    items: string[];
    traits: string[];
    augments: string[];
    totalUnresolved: number;
    sampleUnknownChampions: string[];
    sampleUnknownItems: string[];
    sampleUnknownTraits: string[];
    sampleUnknownAugments: string[];
  };
}

export function computeRiotHealthDiagnostics(): RiotHealthDiagnostics {
  const isKeyConfigured = Boolean(process.env.RIOT_API_KEY && process.env.RIOT_API_KEY.trim().length > 0);
  const isRedisConfigured = Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    process.env.REDIS_URL
  );
  const concurrency = parseInt(
    process.env.RIOT_ACCOUNT_RESOLUTION_CONCURRENCY || "3",
    10
  );

  const diagReport = defaultTftStaticResolver.getDiagnostics().getReport();
  const misses = defaultTftStaticResolver.getUnresolvedMetrics();

  return {
    livePlayerFeature: FEATURE_FLAGS.livePlayerData,
    liveLeaderboardFeature: FEATURE_FLAGS.liveLeaderboard,
    apiKeyConfigured: isKeyConfigured,
    accountServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    rankServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    matchServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    leaderboardServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    rateLimiterStatus: defaultRiotRateLimiter ? "Ready" : "Missing",
    cacheType: isRedisConfigured ? "Redis" : "In-Memory",
    productionCacheStatus: isRedisConfigured ? "Ready" : "Dev/Missing",
    supportedRegions: ["VN2", "KR", "NA1", "EUW1"],
    concurrencyLimit: concurrency,
    unresolvedMetrics: {
      champions: misses.champions,
      items: misses.items,
      traits: misses.traits,
      augments: misses.augments,
      totalUnresolved: diagReport.counts.total,
      sampleUnknownChampions: diagReport.sampleUnknownIds.champions,
      sampleUnknownItems: diagReport.sampleUnknownIds.items,
      sampleUnknownTraits: diagReport.sampleUnknownIds.traits,
      sampleUnknownAugments: diagReport.sampleUnknownIds.augments,
    },
  };
}
