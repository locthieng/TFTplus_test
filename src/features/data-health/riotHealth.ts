import { FEATURE_FLAGS } from "@/config/featureFlags";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { defaultTftStaticResolver } from "@/features/riot/mappers/TftStaticResolver";
import { defaultRiotRateLimiter } from "@/features/riot/rate-limit/RiotRateLimiter";
import { getRiotCacheConfig } from "@/features/riot/cache/riotCacheConfig";

export interface RiotHealthDiagnostics {
  livePlayerFeature: boolean;
  liveLeaderboardFeature: boolean;
  apiKeyConfigured: boolean;
  accountServiceStatus: "Ready" | "Missing API Key";
  rankServiceStatus: "Ready" | "Missing API Key";
  matchServiceStatus: "Ready" | "Missing API Key";
  leaderboardServiceStatus: "Ready" | "Missing API Key";
  rateLimiterStatus: "Ready" | "Missing";
  rateLimiterAppScopeStatus: "Ready" | "Missing";
  rateLimiterMethodScopeStatus: "Ready" | "Missing";
  cacheType: "Redis" | "In-Memory";
  cacheProvider: "Upstash REST" | "Vercel KV REST" | "In-Memory";
  productionCacheStatus: "Ready" | "Warning" | "Dev/Missing";
  tftRelease: {
    setId: string;
    setName: string;
    patch: string;
  };
  staticSource: {
    provider: string;
    version: string;
  };
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
  const isKeyConfigured = Boolean(
    process.env.RIOT_API_KEY && process.env.RIOT_API_KEY.trim().length > 0
  );
  const cacheConfig = getRiotCacheConfig();
  const concurrency = parseInt(
    process.env.RIOT_ACCOUNT_RESOLUTION_CONCURRENCY || "3",
    10
  );

  const diagReport = defaultTftStaticResolver.getDiagnostics().getReport();
  const misses = defaultTftStaticResolver.getUnresolvedMetrics();

  const providerLabel =
    cacheConfig.provider === "upstash-rest"
      ? ("Upstash REST" as const)
      : cacheConfig.provider === "vercel-kv-rest"
      ? ("Vercel KV REST" as const)
      : ("In-Memory" as const);

  return {
    livePlayerFeature: FEATURE_FLAGS.livePlayerData,
    liveLeaderboardFeature: FEATURE_FLAGS.liveLeaderboard,
    apiKeyConfigured: isKeyConfigured,
    accountServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    rankServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    matchServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    leaderboardServiceStatus: isKeyConfigured ? "Ready" : "Missing API Key",
    rateLimiterStatus: defaultRiotRateLimiter ? "Ready" : "Missing",
    rateLimiterAppScopeStatus: defaultRiotRateLimiter ? "Ready" : "Missing",
    rateLimiterMethodScopeStatus: defaultRiotRateLimiter ? "Ready" : "Missing",
    cacheType: cacheConfig.productionReady ? "Redis" : "In-Memory",
    cacheProvider: providerLabel,
    productionCacheStatus: cacheConfig.productionReady ? "Ready" : "Dev/Missing",
    tftRelease: {
      setId: TFT_RELEASE_CONFIG.setId,
      setName: TFT_RELEASE_CONFIG.setName,
      patch: TFT_RELEASE_CONFIG.patch,
    },
    staticSource: {
      provider: TFT_RELEASE_CONFIG.source.provider,
      version: TFT_RELEASE_CONFIG.source.version,
    },
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
