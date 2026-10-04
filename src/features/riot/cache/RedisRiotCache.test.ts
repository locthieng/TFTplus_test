import { describe, it, expect, vi } from "vitest";
import { RedisRiotCache } from "./RedisRiotCache";
import { createRiotCache, InMemoryRiotCache } from "./RiotCache";

describe("RedisRiotCache and Cache Factory", () => {
  it("factory returns InMemoryRiotCache when no Redis env vars are set", () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.KV_REST_API_URL;

    const cache = createRiotCache();
    expect(cache).toBeInstanceOf(InMemoryRiotCache);

    if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  });

  it("handles GET hit and JSON parsing in RedisRiotCache", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: JSON.stringify({ puuid: "test-123" }) }),
    });

    const originalFetch = global.fetch;
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get<{ puuid: string }>("test-key");
    expect(data).toEqual({ puuid: "test-123" });

    global.fetch = originalFetch;
  });

  it("makes Redis failures non-fatal by returning null", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network connection failed"));
    const originalFetch = global.fetch;
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get("failing-key");
    expect(data).toBeNull();

    await expect(redis.set("failing-key", "val", 60)).resolves.not.toThrow();

    global.fetch = originalFetch;
  });
});
