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

    expect(warnSpy).toHaveBeenCalledWith(
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

  it("logs cache hits and misses with safe metadata and does not leak full cache keys or identifiers", () => {
    const rawPuuid = "01234567-89ab-cdef-0123-456789abcdef";
    const rawRiotId = "SecretPlayer#VN1";

    logger.logCacheHit("RiotAccountService", "getAccountByPuuid", {
      namespace: "account_by_puuid",
      region: "asia",
      identifierTruncated: logger.truncatePuuid(rawPuuid),
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"cache_hit"')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"puuidTruncated":"0123...cdef"')
    );

    const callPayload = logSpy.mock.calls[0][0];
    expect(callPayload).not.toContain(rawPuuid);
    expect(callPayload).not.toContain(rawRiotId);
    expect(callPayload).not.toContain("tftplus:riot:v1:");

    logger.logCacheMiss("TftRankService", "getPlayerRank", {
      namespace: "rank",
      region: "vn2",
    });
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"event":"cache_miss"')
    );
  });

  it("sanitizes legacy full cache keys passed as strings", () => {
    const fullPuuid = "sensitive-puuid-abcdef123456";
    const legacyKey = `tftplus:riot:v1:account_by_puuid:asia:${fullPuuid}`;

    logger.logCacheHit("LegacyService", "getOp", legacyKey);

    const loggedOutput = logSpy.mock.calls[0][0];
    expect(loggedOutput).not.toContain(fullPuuid);
    expect(loggedOutput).not.toContain(legacyKey);
    expect(loggedOutput).toContain('"message":"Namespace: account_by_puuid"');
  });

  it("truncates identifiers and puuids safely", () => {
    expect(logger.truncateIdentifier(undefined)).toBeUndefined();
    expect(logger.truncateIdentifier("1234")).toBe("1234");
    expect(logger.truncateIdentifier("1234567890abcdef")).toBe("1234...cdef");
    expect(logger.truncatePuuid("1234567890abcdef")).toBe("1234...cdef");
  });
});
