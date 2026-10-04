import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RiotLogger } from "./RiotLogger";

describe("RiotLogger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  const logger = new RiotLogger();

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("redacts RGAPI- API tokens and does not leak them", () => {
    logger.log({
      service: "TestService",
      operation: "TestOp",
      status: "error",
      message: "Secret key is RGAPI-abcdef-123456",
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[REDACTED_SECRET_EVENT]")
    );
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("RGAPI-abcdef-123456")
    );
  });

  it("redacts Bearer tokens and does not leak them", () => {
    logger.log({
      service: "RedisRiotCache",
      operation: "set",
      status: "error",
      message: "Authorization: Bearer secret-redis-token-123",
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[REDACTED_SECRET_EVENT]")
    );
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("secret-redis-token-123")
    );
  });

  it("logs structured request start and success events cleanly", () => {
    logger.logRequestStart({
      service: "RiotApiClient",
      operation: "test-op",
      region: "kr",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"request_start"')
    );

    logger.logRequestSuccess({
      service: "RiotApiClient",
      operation: "test-op",
      status: 200,
      durationMs: 42,
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"request_success"')
    );
  });

  it("logs retry and rate_limited events as warnings", () => {
    logger.logRetry({
      service: "RiotApiClient",
      operation: "test-op",
      status: 503,
      retryCount: 1,
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"retry"')
    );

    logger.logRateLimited({
      service: "RiotApiClient",
      operation: "test-op",
      retryAfterSeconds: 5,
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"rate_limited"')
    );
  });

  it("logs cache hits and misses", () => {
    logger.logCacheHit("TftRankService", "getPlayerRank", "test:key");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"cache_hit"')
    );

    logger.logCacheMiss("TftRankService", "getPlayerRank", "test:key");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"cache_miss"')
    );
  });

  it("truncates puuid safely", () => {
    expect(logger.truncatePuuid(undefined)).toBeUndefined();
    expect(logger.truncatePuuid("1234")).toBe("1234");
    expect(logger.truncatePuuid("1234567890abcdef")).toBe("1234...cdef");
  });
});
