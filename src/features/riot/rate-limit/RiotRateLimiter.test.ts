import { describe, it, expect, vi } from "vitest";
import {
  DefaultRiotRateLimiter,
  parseRateLimitWindows,
  getRiotRateLimitScopes,
} from "./RiotRateLimiter";
import { RiotApiError } from "../client/RiotApiError";

describe("RiotRateLimiter", () => {
  describe("getRiotRateLimitScopes", () => {
    it("extracts host as appScope and stable method family as methodScope", () => {
      const accountScopes = getRiotRateLimitScopes(
        "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Faker/KR1"
      );
      expect(accountScopes.appScope).toBe("asia.api.riotgames.com");
      expect(accountScopes.methodScope).toBe(
        "asia.api.riotgames.com:account-v1/by-riot-id"
      );
      // Ensure no raw player names or tags in methodScope
      expect(accountScopes.methodScope).not.toContain("Faker");
      expect(accountScopes.methodScope).not.toContain("KR1");

      const matchScopes = getRiotRateLimitScopes(
        "https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/01234567-89ab-cdef/ids?count=10"
      );
      expect(matchScopes.appScope).toBe("asia.api.riotgames.com");
      expect(matchScopes.methodScope).toBe(
        "asia.api.riotgames.com:tft-match-v1/by-puuid-ids"
      );
      expect(matchScopes.methodScope).not.toContain("01234567-89ab-cdef");

      const matchDetailScopes = getRiotRateLimitScopes(
        "https://asia.api.riotgames.com/tft/match/v1/matches/KR_712345678"
      );
      expect(matchDetailScopes.appScope).toBe("asia.api.riotgames.com");
      expect(matchDetailScopes.methodScope).toBe(
        "asia.api.riotgames.com:tft-match-v1/match-detail"
      );
      expect(matchDetailScopes.methodScope).not.toContain("KR_712345678");

      const rankScopes = getRiotRateLimitScopes(
        "https://vn2.api.riotgames.com/tft/league/v1/by-puuid/test-puuid"
      );
      expect(rankScopes.appScope).toBe("vn2.api.riotgames.com");
      expect(rankScopes.methodScope).toBe(
        "vn2.api.riotgames.com:tft-league-v1/by-puuid"
      );
    });
  });

  describe("parseRateLimitWindows", () => {
    it("parses single and multi-window limit and count headers", () => {
      const windows = parseRateLimitWindows(
        "20:1,100:120",
        "5:1,30:120"
      );

      expect(windows).toEqual([
        { limit: 20, windowSeconds: 1, used: 5 },
        { limit: 100, windowSeconds: 120, used: 30 },
      ]);
    });

    it("returns empty array when headers are missing or malformed", () => {
      expect(parseRateLimitWindows(undefined, undefined)).toEqual([]);
      expect(parseRateLimitWindows("invalid", "invalid")).toEqual([]);
    });
  });

  describe("DefaultRiotRateLimiter dual scoping & proactive throttling", () => {
    it("shares app usage across different method endpoints on the same host", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const accountScopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:account-v1/by-riot-id",
      };
      const matchScopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:tft-match-v1/by-puuid-ids",
      };

      // Account response reports app usage near capacity (95/100)
      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "95:120",
        "x-method-rate-limit": "50:10",
        "x-method-rate-limit-count": "5:10",
      });

      limiter.recordResponse(accountScopes, headers, 200);

      // Now match request on same host should trigger proactive backoff
      await limiter.beforeRequest(matchScopes);
      expect(sleepFn).toHaveBeenCalledWith(200);
    });

    it("keeps method limits isolated between different method scopes", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const accountScopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:account-v1/by-riot-id",
      };
      const matchScopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:tft-match-v1/by-puuid-ids",
      };

      // Method limit on account saturated (10:1)
      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "20:120",
        "x-method-rate-limit": "10:1",
        "x-method-rate-limit-count": "10:1",
      });

      limiter.recordResponse(accountScopes, headers, 200);

      // Match request has independent method scope and is not throttled
      await limiter.beforeRequest(matchScopes);
      expect(sleepFn).not.toHaveBeenCalled();

      // But Account request IS throttled
      await limiter.beforeRequest(accountScopes);
      expect(sleepFn).toHaveBeenCalledWith(1000);
    });

    it("keeps different region hosts independent", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const asiaScopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:account-v1/by-riot-id",
      };
      const naScopes = {
        appScope: "na1.api.riotgames.com",
        methodScope: "na1.api.riotgames.com:tft-league-v1/by-puuid",
      };

      // Asia host near limit (92%)
      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "92:120",
      });
      limiter.recordResponse(asiaScopes, headers, 200);

      // NA host should not be affected
      await limiter.beforeRequest(naScopes);
      expect(sleepFn).not.toHaveBeenCalled();

      // Asia host throttles
      await limiter.beforeRequest(asiaScopes);
      expect(sleepFn).toHaveBeenCalledWith(200);
    });

    it("waits briefly for short saturated window (<= 2s)", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const scopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:test",
      };

      const headers = new Headers({
        "x-method-rate-limit": "20:1",
        "x-method-rate-limit-count": "20:1", // 100% on 1s window
      });

      limiter.recordResponse(scopes, headers, 200);
      await limiter.beforeRequest(scopes);

      expect(sleepFn).toHaveBeenCalledWith(1000);
    });

    it("throws typed LOCAL_RATE_LIMITED error when long window (> 10s) is saturated", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const scopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:test",
      };

      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "100:120", // 100% on 120s window
      });

      limiter.recordResponse(scopes, headers, 200);

      await expect(limiter.beforeRequest(scopes)).rejects.toThrow(RiotApiError);
      await expect(limiter.beforeRequest(scopes)).rejects.toMatchObject({
        code: "LOCAL_RATE_LIMITED",
        statusCode: 429,
        retryAfterSeconds: 120,
      });
      expect(sleepFn).not.toHaveBeenCalled();
    });

    it("waits controlled duration when Retry-After is <= 2s", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const scopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:test",
      };

      const headers = new Headers({
        "retry-after": "2",
      });

      limiter.recordResponse(scopes, headers, 429);
      await limiter.beforeRequest(scopes);

      expect(sleepFn).toHaveBeenCalled();
      const delay = sleepFn.mock.calls[0][0];
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThanOrEqual(2000);
    });

    it("throws RATE_LIMITED error when upstream Retry-After is > 2s", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const scopes = {
        appScope: "asia.api.riotgames.com",
        methodScope: "asia.api.riotgames.com:test",
      };

      const headers = new Headers({
        "retry-after": "5",
      });

      limiter.recordResponse(scopes, headers, 429);

      await expect(limiter.beforeRequest(scopes)).rejects.toThrow(RiotApiError);
      await expect(limiter.beforeRequest(scopes)).rejects.toMatchObject({
        code: "RATE_LIMITED",
        statusCode: 429,
        retryAfterSeconds: 5,
      });
      expect(sleepFn).not.toHaveBeenCalled();
    });
  });
});
