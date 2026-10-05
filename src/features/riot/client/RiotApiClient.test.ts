import { describe, it, expect, vi } from "vitest";
import { RiotApiClient } from "./RiotApiClient";
import { RiotApiError } from "./RiotApiError";
import { RiotRateLimiter } from "../rate-limit/RiotRateLimiter";
import { RiotLogger } from "../logging/RiotLogger";

describe("RiotApiClient", () => {
  it("throws UNAUTHORIZED if API key is not configured", async () => {
    const client = new RiotApiClient({ apiKey: "" });
    await expect(client.get("https://asia.api.riotgames.com/test")).rejects.toThrow(
      /API Key is not configured/
    );
  });

  it("sends X-Riot-Token header on requests", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const client = new RiotApiClient({
      apiKey: "RGAPI-mock-key-1234",
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    const data = await client.get<{ success: boolean }>(
      "https://asia.api.riotgames.com/test"
    );

    expect(data.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://asia.api.riotgames.com/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Riot-Token": "RGAPI-mock-key-1234",
        }),
      })
    );
  });

  it("maps 404 to NOT_FOUND RiotApiError", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers(),
      json: async () => ({ status: { message: "Data not found" } }),
    });

    const client = new RiotApiClient({
      apiKey: "RGAPI-mock-key",
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    try {
      await client.get("https://asia.api.riotgames.com/account");
      expect.unreachable();
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(RiotApiError);
      const riotErr = err as RiotApiError;
      expect(riotErr.code).toBe("NOT_FOUND");
      expect(riotErr.statusCode).toBe(404);
    }
  });

  it("maps 429 with large Retry-After to RATE_LIMITED without looping", async () => {
    const headers = new Headers();
    headers.set("retry-after", "10");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers,
      json: async () => ({}),
    });

    const client = new RiotApiClient({
      apiKey: "RGAPI-mock-key",
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    try {
      await client.get("https://asia.api.riotgames.com/rate-limited");
      expect.unreachable();
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(RiotApiError);
      const riotErr = err as RiotApiError;
      expect(riotErr.code).toBe("RATE_LIMITED");
      expect(riotErr.retryAfterSeconds).toBe(10);
    }
  });

  it("calls rate limiter beforeRequest and recordResponse during request lifecycle", async () => {
    const mockRateLimiter: RiotRateLimiter = {
      beforeRequest: vi.fn().mockResolvedValue(undefined),
      recordResponse: vi.fn(),
      getSnapshot: vi.fn().mockReturnValue(null),
      reset: vi.fn(),
    };

    const headers = new Headers({ "x-app-rate-limit": "20:1" });
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers,
      json: async () => ({ ok: true }),
    });

    const client = new RiotApiClient({
      apiKey: "RGAPI-test",
      fetchFn: mockFetch as unknown as typeof fetch,
      rateLimiter: mockRateLimiter,
    });

    await client.get("https://asia.api.riotgames.com/tft/match/v1/test");

    expect(mockRateLimiter.beforeRequest).toHaveBeenCalledTimes(1);
    expect(mockRateLimiter.recordResponse).toHaveBeenCalledTimes(1);
    expect(mockRateLimiter.recordResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        appScope: "asia.api.riotgames.com",
      }),
      headers,
      200
    );
  });

  it("logger redacts any secret keys if passed accidentally", () => {
    const logger = new RiotLogger();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logger.log({
      service: "TestService",
      operation: "TestOp",
      status: "error",
      message: "Exposing RGAPI-12345-secret-key",
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[REDACTED_SECRET_EVENT]")
    );
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("RGAPI-12345-secret-key")
    );

    warnSpy.mockRestore();
  });
});
