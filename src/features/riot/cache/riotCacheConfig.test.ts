import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getRiotCacheConfig } from "./riotCacheConfig";

describe("getRiotCacheConfig", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.REDIS_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("detects upstash-rest when both UPSTASH URL and token are configured", () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "secret-token";

    const config = getRiotCacheConfig();
    expect(config.provider).toBe("upstash-rest");
    expect(config.productionReady).toBe(true);
    expect(config.url).toBe("https://mock.upstash.io");
    expect(config.token).toBe("secret-token");
  });

  it("detects vercel-kv-rest when both KV URL and token are configured", () => {
    process.env.KV_REST_API_URL = "https://mock.kv.vercel-storage.com";
    process.env.KV_REST_API_TOKEN = "kv-secret-token";

    const config = getRiotCacheConfig();
    expect(config.provider).toBe("vercel-kv-rest");
    expect(config.productionReady).toBe(true);
    expect(config.url).toBe("https://mock.kv.vercel-storage.com");
    expect(config.token).toBe("kv-secret-token");
  });

  it("falls back to memory when only URL is provided without token", () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";

    const config = getRiotCacheConfig();
    expect(config.provider).toBe("memory");
    expect(config.productionReady).toBe(false);
  });

  it("falls back to memory when only token is provided without URL", () => {
    process.env.UPSTASH_REDIS_REST_TOKEN = "secret-token";

    const config = getRiotCacheConfig();
    expect(config.provider).toBe("memory");
    expect(config.productionReady).toBe(false);
  });

  it("falls back to memory when no Redis env vars are set", () => {
    const config = getRiotCacheConfig();
    expect(config.provider).toBe("memory");
    expect(config.productionReady).toBe(false);
  });

  it("does not claim production ready when only generic REDIS_URL is provided", () => {
    process.env.REDIS_URL = "redis://localhost:6379";

    const config = getRiotCacheConfig();
    expect(config.provider).toBe("memory");
    expect(config.productionReady).toBe(false);
  });
});
