import "server-only";

import { RiotApiError } from "./RiotApiError";
import { defaultRateLimitState } from "../rate-limit/RiotRateLimitState";
import {
  RiotRateLimiter,
  defaultRiotRateLimiter,
} from "../rate-limit/RiotRateLimiter";
import { RiotLogger, defaultRiotLogger } from "../logging/RiotLogger";

export type { RiotRateLimitSnapshot } from "../rate-limit/RiotRateLimiter";

export interface RiotApiClientConfig {
  apiKey?: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
  rateLimiter?: RiotRateLimiter;
  logger?: RiotLogger;
}

export class RiotApiClient {
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;
  private readonly rateLimiter?: RiotRateLimiter;
  private readonly logger: RiotLogger;

  constructor(config?: RiotApiClientConfig) {
    if (typeof window !== "undefined") {
      throw new Error("RiotApiClient cannot be executed in browser/client context.");
    }

    this.apiKey = config?.apiKey || process.env.RIOT_API_KEY || "";
    this.timeoutMs =
      config?.timeoutMs ??
      parseInt(process.env.RIOT_API_TIMEOUT_MS || "8000", 10);
    this.fetchFn = config?.fetchFn || fetch;
    this.rateLimiter =
      config?.rateLimiter !== undefined
        ? config.rateLimiter
        : defaultRiotRateLimiter;
    this.logger = config?.logger || defaultRiotLogger;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private extractScope(url: string): string {
    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname
        .split("/")
        .filter(Boolean)
        .slice(0, 3)
        .join("/");
      return `${parsed.host}/${pathParts}`;
    } catch {
      return "global";
    }
  }

  async get<T>(url: string, attempt = 1): Promise<T> {
    if (!this.isConfigured()) {
      throw new RiotApiError({
        message: "Riot API Key is not configured on the server.",
        code: "UNAUTHORIZED",
        statusCode: 401,
        endpoint: url,
      });
    }

    const scope = this.extractScope(url);
    const startTime = Date.now();

    // 1. Proactive Rate Limiting
    if (this.rateLimiter) {
      await this.rateLimiter.beforeRequest(scope);
    }

    if (attempt === 1) {
      this.logger.logRequestStart({
        service: "RiotApiClient",
        operation: scope,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchFn(url, {
        method: "GET",
        headers: {
          "X-Riot-Token": this.apiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;

      // 2. Track rate limit response headers
      if (this.rateLimiter && response.headers) {
        this.rateLimiter.recordResponse(scope, response.headers, response.status);
      }

      if (response.headers && typeof response.headers.get === "function") {
        defaultRateLimitState.updateFromHeaders(response.headers);
      }

      // Handle successful response
      if (response.ok) {
        this.logger.logRequestSuccess({
          service: "RiotApiClient",
          operation: scope,
          status: response.status,
          durationMs,
          retryCount: attempt - 1,
        });
        return (await response.json()) as T;
      }

      const status = response.status;
      const retryAfterHeader = response.headers?.get
        ? response.headers.get("retry-after")
        : null;
      const retryAfter = retryAfterHeader
        ? parseInt(retryAfterHeader, 10)
        : undefined;

      // Rate limit (429) retry strategy: retry once if wait time <= 2s
      if (status === 429) {
        this.logger.logRateLimited({
          service: "RiotApiClient",
          operation: scope,
          status: 429,
          retryAfterSeconds: retryAfter,
        });

        if (attempt === 1 && retryAfter != null && retryAfter <= 2) {
          this.logger.logRetry({
            service: "RiotApiClient",
            operation: scope,
            status: 429,
            retryCount: attempt,
            message: `Retrying after 429 backoff (${retryAfter}s)`,
          });
          await this.delay(retryAfter * 1000);
          return this.get<T>(url, attempt + 1);
        }
        throw RiotApiError.fromStatusCode(status, url, retryAfter);
      }

      // 5xx Server Error retry strategy: retry up to 2 times with exponential backoff
      if ((status === 500 || status === 503) && attempt <= 2) {
        this.logger.logRetry({
          service: "RiotApiClient",
          operation: scope,
          status,
          retryCount: attempt,
          message: `Retrying after server error ${status}`,
        });
        await this.delay(300 * Math.pow(2, attempt - 1));
        return this.get<T>(url, attempt + 1);
      }

      let errorDetail: string | undefined;
      try {
        const errorBody = await response.json();
        if (
          typeof errorBody === "object" &&
          errorBody !== null &&
          "status" in errorBody
        ) {
          const s = (errorBody as { status?: { message?: string } }).status;
          errorDetail = s?.message;
        }
      } catch {
        // Body was not json or empty
      }

      this.logger.logRequestError({
        service: "RiotApiClient",
        operation: scope,
        status,
        durationMs,
        message: errorDetail || `HTTP ${status}`,
        retryCount: attempt - 1,
      });

      throw RiotApiError.fromStatusCode(status, url, retryAfter, errorDetail);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;

      if (error instanceof RiotApiError) {
        throw error;
      }

      if (
        (error instanceof Error && error.name === "AbortError") ||
        (error as { name?: string })?.name === "AbortError"
      ) {
        this.logger.logTimeout({
          service: "RiotApiClient",
          operation: scope,
          durationMs,
        });
        throw RiotApiError.timeout(url, this.timeoutMs);
      }

      this.logger.logRequestError({
        service: "RiotApiClient",
        operation: scope,
        durationMs,
        message:
          error instanceof Error
            ? error.message
            : "Network error contacting Riot API",
        retryCount: attempt - 1,
      });

      throw new RiotApiError({
        message:
          error instanceof Error
            ? error.message
            : "Network error contacting Riot API",
        code: "SERVICE_UNAVAILABLE",
        endpoint: url,
      });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton client instance
export const defaultRiotApiClient = new RiotApiClient();
