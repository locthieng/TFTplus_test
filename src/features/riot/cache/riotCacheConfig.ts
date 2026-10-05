export type RiotCacheProvider = "upstash-rest" | "vercel-kv-rest" | "memory";

export interface RiotCacheConfigStatus {
  provider: RiotCacheProvider;
  productionReady: boolean;
  url?: string;
  token?: string;
}

export function getRiotCacheConfig(): RiotCacheConfigStatus {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return {
      provider: "upstash-rest",
      productionReady: true,
      url: upstashUrl,
      token: upstashToken,
    };
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    return {
      provider: "vercel-kv-rest",
      productionReady: true,
      url: kvUrl,
      token: kvToken,
    };
  }

  return {
    provider: "memory",
    productionReady: false,
  };
}
