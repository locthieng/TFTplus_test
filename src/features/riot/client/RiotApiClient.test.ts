import { describe, it, expect, vi } from "vitest";
import { RiotApiClient } from "./RiotApiClient";
import { RiotApiError } from "./RiotApiError";

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
});
