import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { computeRiotHealthDiagnostics } from "./riotHealth";

describe("computeRiotHealthDiagnostics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("reports API key as not configured when RIOT_API_KEY is unset", () => {
    delete process.env.RIOT_API_KEY;
    const diag = computeRiotHealthDiagnostics();
    expect(diag.apiKeyConfigured).toBe(false);
    expect(diag.accountServiceStatus).toBe("Missing API Key");
  });

  it("reports API key as configured when RIOT_API_KEY is present without leaking it", () => {
    process.env.RIOT_API_KEY = "RGAPI-secret-key-12345";
    const diag = computeRiotHealthDiagnostics();
    expect(diag.apiKeyConfigured).toBe(true);
    expect(diag.accountServiceStatus).toBe("Ready");
    expect(JSON.stringify(diag)).not.toContain("RGAPI-secret-key-12345");
  });

  it("falls back to In-Memory when only generic REDIS_URL is provided", () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    process.env.REDIS_URL = "redis://localhost:6379";

    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("In-Memory");
    expect(diag.cacheProvider).toBe("In-Memory");
    expect(diag.productionCacheStatus).toBe("Dev/Missing");
  });

  it("detects Upstash Redis cache architecture when UPSTASH_REDIS_REST_URL and TOKEN are configured", () => {
    delete process.env.REDIS_URL;
    process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";
    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("Redis");
    expect(diag.cacheProvider).toBe("Upstash REST");
    expect(diag.productionCacheStatus).toBe("Ready");
  });

  it("detects Vercel KV cache architecture when KV_REST_API_URL and TOKEN are configured", () => {
    delete process.env.REDIS_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.KV_REST_API_URL = "https://mock.kv.vercel-storage.com";
    process.env.KV_REST_API_TOKEN = "mock-kv-token";
    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("Redis");
    expect(diag.cacheProvider).toBe("Vercel KV REST");
    expect(diag.productionCacheStatus).toBe("Ready");
  });

  it("detects In-Memory cache architecture when no Redis variables are set", () => {
    delete process.env.REDIS_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;

    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("In-Memory");
    expect(diag.cacheProvider).toBe("In-Memory");
    expect(diag.productionCacheStatus).toBe("Dev/Missing");
  });

  it("reports proactive rate limiter and scopes as Ready", () => {
    const diag = computeRiotHealthDiagnostics();
    expect(diag.rateLimiterStatus).toBe("Ready");
    expect(diag.rateLimiterAppScopeStatus).toBe("Ready");
    expect(diag.rateLimiterMethodScopeStatus).toBe("Ready");
  });

  it("reports TFT release and static source truthfully and separately", () => {
    const diag = computeRiotHealthDiagnostics();
    expect(diag.tftRelease).toEqual({
      setId: "18",
      setName: "Enchanted Wilds",
      patch: "18.3",
    });
    expect(diag.staticSource).toEqual({
      provider: "communitydragon",
      version: "16.19",
    });
    expect(diag.staticSource.version).not.toBe(diag.tftRelease.patch);
  });

  it("includes unresolved static entity counters, samples, and total count", () => {
    const diag = computeRiotHealthDiagnostics();
    expect(diag.unresolvedMetrics).toBeDefined();
    expect(Array.isArray(diag.unresolvedMetrics.champions)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.items)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.traits)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.augments)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.sampleUnknownChampions)).toBe(true);
    expect(typeof diag.unresolvedMetrics.totalUnresolved).toBe("number");
  });
});
