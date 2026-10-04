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

  it("detects Redis cache architecture when REDIS_URL is configured", () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("Redis");
    expect(diag.productionCacheStatus).toBe("Ready");
  });

  it("detects In-Memory cache architecture when REDIS_URL is absent", () => {
    delete process.env.REDIS_URL;
    const diag = computeRiotHealthDiagnostics();
    expect(diag.cacheType).toBe("In-Memory");
    expect(diag.productionCacheStatus).toBe("Dev/Missing");
  });

  it("includes unresolved static entity counters and total count", () => {
    const diag = computeRiotHealthDiagnostics();
    expect(diag.unresolvedMetrics).toBeDefined();
    expect(Array.isArray(diag.unresolvedMetrics.champions)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.items)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.traits)).toBe(true);
    expect(Array.isArray(diag.unresolvedMetrics.augments)).toBe(true);
    expect(typeof diag.unresolvedMetrics.totalUnresolved).toBe("number");
  });
});
