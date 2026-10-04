import { describe, it, expect, vi } from "vitest";
import {
  DefaultRiotRateLimiter,
  parseRateLimitWindows,
} from "./RiotRateLimiter";

describe("RiotRateLimiter", () => {
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

  describe("DefaultRiotRateLimiter proactive throttling", () => {
    it("does not delay when no state is recorded", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      await limiter.beforeRequest("test-scope");
      expect(sleepFn).not.toHaveBeenCalled();
    });

    it("does not delay when capacity is under 90%", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "50:120",
      });

      limiter.recordResponse("test-scope", headers, 200);
      await limiter.beforeRequest("test-scope");

      expect(sleepFn).not.toHaveBeenCalled();
    });

    it("applies proactive delay (200ms) when usage is >= 90%", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const headers = new Headers({
        "x-app-rate-limit": "100:120",
        "x-app-rate-limit-count": "92:120", // 92% >= 90%
      });

      limiter.recordResponse("test-scope", headers, 200);
      await limiter.beforeRequest("test-scope");

      expect(sleepFn).toHaveBeenCalledWith(200);
    });

    it("waits when usage reaches 100% capacity", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const headers = new Headers({
        "x-app-rate-limit": "20:1",
        "x-app-rate-limit-count": "20:1", // 100%
      });

      limiter.recordResponse("test-scope", headers, 200);
      await limiter.beforeRequest("test-scope");

      expect(sleepFn).toHaveBeenCalledWith(1000);
    });

    it("waits when Retry-After is active", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      const headers = new Headers({
        "retry-after": "3",
      });

      limiter.recordResponse("test-scope", headers, 429);
      await limiter.beforeRequest("test-scope");

      expect(sleepFn).toHaveBeenCalled();
      const delay = sleepFn.mock.calls[0][0];
      expect(delay).toBeGreaterThan(2000);
      expect(delay).toBeLessThanOrEqual(3000);
    });

    it("handles 429 status code with fallback 1s delay when retry-after header is absent", async () => {
      const sleepFn = vi.fn().mockResolvedValue(undefined);
      const limiter = new DefaultRiotRateLimiter({ sleepFn });

      limiter.recordResponse("test-scope", new Headers(), 429);
      await limiter.beforeRequest("test-scope");

      expect(sleepFn).toHaveBeenCalledWith(expect.any(Number));
    });

    it("produces snapshots for diagnostics", () => {
      const limiter = new DefaultRiotRateLimiter();
      const headers = new Headers({
        "x-app-rate-limit": "20:1,100:120",
        "x-app-rate-limit-count": "2:1,10:120",
        "x-method-rate-limit": "200:10",
        "x-method-rate-limit-count": "5:10",
      });

      limiter.recordResponse("scope-1", headers, 200);
      const snapshot = limiter.getSnapshot("scope-1");

      expect(snapshot).not.toBeNull();
      expect(snapshot?.app.length).toBe(2);
      expect(snapshot?.method.length).toBe(1);
      expect(snapshot?.app[0].used).toBe(2);
    });
  });
});
