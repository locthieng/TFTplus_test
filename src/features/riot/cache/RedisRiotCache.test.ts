import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RedisRiotCache } from "./RedisRiotCache";
import { createRiotCache, InMemoryRiotCache } from "./RiotCache";

describe("RedisRiotCache and Cache Factory", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("factory returns InMemoryRiotCache when no Redis env vars are set", () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.KV_REST_API_URL;

    const cache = createRiotCache();
    expect(cache).toBeInstanceOf(InMemoryRiotCache);

    if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  });

  it("handles GET hit and parses valid JSON", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: JSON.stringify({ puuid: "test-123" }) }),
    });
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get<{ puuid: string }>("test-key");
    expect(data).toEqual({ puuid: "test-123" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://mock-redis.upstash.io/get/test-key",
      expect.objectContaining({
        headers: { Authorization: "Bearer mock-token" },
        cache: "no-store",
      })
    );
  });

  it("handles GET miss (result is null)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: null }),
    });
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get("missing-key");
    expect(data).toBeNull();
  });

  it("handles GET hit with plain string (invalid JSON fallback)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: "raw-non-json-string" }),
    });
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get<string>("string-key");
    expect(data).toBe("raw-non-json-string");
  });

  it("SET uses POST, sends value in body, and passes TTL in query param", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const payload = { foo: "bar", count: 42 };
    await redis.set("my:test:key", payload, 180);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [callUrl, callOptions] = mockFetch.mock.calls[0];

    expect(callUrl).toBe("https://mock-redis.upstash.io/set/my%3Atest%3Akey?EX=180");
    expect(callOptions.method).toBe("POST");
    expect(callOptions.headers).toEqual({
      Authorization: "Bearer mock-token",
      "Content-Type": "text/plain",
    });
    expect(callOptions.body).toBe(JSON.stringify(payload));
    expect(callOptions.cache).toBe("no-store");
  });

  it("makes Redis failures non-fatal by returning null on GET and not throwing on SET", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network connection failed"));
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    const data = await redis.get("failing-key");
    expect(data).toBeNull();

    await expect(redis.set("failing-key", "val", 60)).resolves.not.toThrow();
  });

  it("handles non-200 HTTP response on SET without throwing", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch = mockFetch;

    const redis = new RedisRiotCache({
      url: "https://mock-redis.upstash.io",
      token: "mock-token",
    });

    await expect(redis.set("error-key", { test: 1 }, 60)).resolves.not.toThrow();
  });
});
