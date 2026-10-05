import "server-only";

import { RiotApiError } from "../client/RiotApiError";

export interface RiotRateWindow {
  limit: number;
  windowSeconds: number;
  used: number;
}

export interface RiotRateLimitSnapshot {
  app: RiotRateWindow[];
  method: RiotRateWindow[];
  retryAfterSeconds?: number;
  retryUntilTimestamp?: number;
  updatedAt: number;
}

export interface RiotRateLimitScopes {
  appScope: string;
  methodScope: string;
}

export interface RiotRateLimiter {
  beforeRequest(scope: string | RiotRateLimitScopes): Promise<void>;
  recordResponse(
    scope: string | RiotRateLimitScopes,
    headers?: Headers | null,
    status?: number
  ): void;
  getSnapshot(scope?: string | RiotRateLimitScopes): RiotRateLimitSnapshot | null;
  reset(): void;
}

export interface RiotRateLimiterOptions {
  sleepFn?: (ms: number) => Promise<void>;
}

/**
 * Extracts normalized app and method scopes from a full Riot API request URL.
 * App scope is host-based (e.g., asia.api.riotgames.com).
 * Method scope is host + stable method family (e.g., asia.api.riotgames.com:tft-match-v1/by-puuid-ids),
 * omitting raw identifiers (PUUID, matchId, gameName, tag) to prevent bucket explosion.
 */
export function getRiotRateLimitScopes(url: string): RiotRateLimitScopes {
  try {
    const parsed = new URL(url);
    const host = parsed.host;
    const path = parsed.pathname;

    let methodFamily = "general";
    if (path.includes("/riot/account/v1/accounts/by-riot-id/")) {
      methodFamily = "account-v1/by-riot-id";
    } else if (path.includes("/riot/account/v1/accounts/by-puuid/")) {
      methodFamily = "account-v1/by-puuid";
    } else if (path.includes("/tft/match/v1/matches/by-puuid/") && path.endsWith("/ids")) {
      methodFamily = "tft-match-v1/by-puuid-ids";
    } else if (path.includes("/tft/match/v1/matches/")) {
      methodFamily = "tft-match-v1/match-detail";
    } else if (path.includes("/tft/league/v1/by-puuid/")) {
      methodFamily = "tft-league-v1/by-puuid";
    } else if (path.includes("/tft/league/v1/challenger")) {
      methodFamily = "tft-league-v1/challenger";
    } else {
      const segments = path.split("/").filter(Boolean).slice(0, 3);
      methodFamily = segments.join("-") || "unknown";
    }

    return {
      appScope: host,
      methodScope: `${host}:${methodFamily}`,
    };
  } catch {
    return {
      appScope: "global",
      methodScope: "global:default",
    };
  }
}

/**
 * Parses Riot rate limit and count headers.
 * Example format: "20:1,100:120"
 */
export function parseRateLimitWindows(
  limitHeader?: string | null,
  countHeader?: string | null
): RiotRateWindow[] {
  if (!limitHeader || !countHeader) return [];

  const parseTokens = (header: string) =>
    header
      .split(",")
      .map((part) => part.trim().split(":").map((n) => parseInt(n, 10)))
      .filter(([val, windowSec]) => !isNaN(val) && !isNaN(windowSec));

  const limits = parseTokens(limitHeader);
  const counts = parseTokens(countHeader);

  return limits.map(([limit, windowSeconds], idx) => {
    const matchCount =
      counts.find(([, sec]) => sec === windowSeconds) || counts[idx];
    const used = matchCount ? matchCount[0] : 0;
    return {
      limit,
      windowSeconds,
      used,
    };
  });
}

export class DefaultRiotRateLimiter implements RiotRateLimiter {
  private readonly appScopes = new Map<string, RiotRateWindow[]>();
  private readonly methodScopes = new Map<string, RiotRateWindow[]>();
  private readonly retryUntilByScope = new Map<string, number>();
  private readonly retryAfterByScope = new Map<string, number>();
  private readonly sleepFn: (ms: number) => Promise<void>;

  constructor(options?: RiotRateLimiterOptions) {
    this.sleepFn =
      options?.sleepFn ||
      ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  private resolveScopes(scope: string | RiotRateLimitScopes): RiotRateLimitScopes {
    if (
      typeof scope === "object" &&
      scope !== null &&
      "appScope" in scope &&
      "methodScope" in scope
    ) {
      return scope;
    }
    const str = String(scope);
    const parts = str.split(":");
    return {
      appScope: parts[0] || str,
      methodScope: str,
    };
  }

  async beforeRequest(scope: string | RiotRateLimitScopes): Promise<void> {
    const { appScope, methodScope } = this.resolveScopes(scope);
    const now = Date.now();

    // 1. Check Retry-After active for either app or method scope
    const appRetryUntil = this.retryUntilByScope.get(appScope) || 0;
    const methodRetryUntil = this.retryUntilByScope.get(methodScope) || 0;
    const maxRetryUntil = Math.max(appRetryUntil, methodRetryUntil);

    if (maxRetryUntil > now) {
      const waitMs = maxRetryUntil - now;
      if (waitMs <= 2000) {
        await this.sleepFn(waitMs);
        return;
      }
      throw RiotApiError.fromStatusCode(
        429,
        undefined,
        Math.ceil(waitMs / 1000),
        `Rate limited by upstream Riot API. Retry after ${Math.ceil(waitMs / 1000)}s.`
      );
    }

    // 2. Check window limits across app and method scopes
    const appWindows = this.appScopes.get(appScope) || [];
    const methodWindows = this.methodScopes.get(methodScope) || [];
    const allWindows = [...appWindows, ...methodWindows];
    if (allWindows.length === 0) return;

    // Check 100% capacity (saturation)
    const saturated = allWindows.find((w) => w.limit > 0 && w.used >= w.limit);
    if (saturated) {
      if (saturated.windowSeconds <= 2) {
        // Short window: brief delay (<= 1s)
        await this.sleepFn(Math.min(saturated.windowSeconds * 1000, 1000));
        return;
      }
      if (saturated.windowSeconds <= 10) {
        // Medium window: bounded delay (<= 2s)
        await this.sleepFn(Math.min(saturated.windowSeconds * 1000, 2000));
        return;
      }
      // Long saturated window (> 10s, e.g. 120s): do not block SSR request; return typed local rate-limited error
      throw RiotApiError.localRateLimited(undefined, saturated.windowSeconds);
    }

    // Check 90% capacity (proactive backoff)
    const nearLimit = allWindows.find(
      (w) => w.limit > 0 && w.used / w.limit >= 0.9
    );
    if (nearLimit) {
      await this.sleepFn(200);
      return;
    }
  }

  recordResponse(
    scope: string | RiotRateLimitScopes,
    headers?: Headers | null,
    status?: number
  ): void {
    if (!headers || typeof headers.get !== "function") return;

    const { appScope, methodScope } = this.resolveScopes(scope);
    const now = Date.now();

    const appLimit = headers.get("x-app-rate-limit");
    const appCount = headers.get("x-app-rate-limit-count");
    const methodLimit = headers.get("x-method-rate-limit");
    const methodCount = headers.get("x-method-rate-limit-count");
    const retryAfterHeader = headers.get("retry-after");

    if (appLimit && appCount) {
      const app = parseRateLimitWindows(appLimit, appCount);
      this.appScopes.set(appScope, app);
    }

    if (methodLimit && methodCount) {
      const method = parseRateLimitWindows(methodLimit, methodCount);
      this.methodScopes.set(methodScope, method);
    }

    if (retryAfterHeader) {
      const parsedSeconds = parseInt(retryAfterHeader, 10);
      if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
        const until = now + parsedSeconds * 1000;
        this.retryAfterByScope.set(appScope, parsedSeconds);
        this.retryUntilByScope.set(appScope, until);
        this.retryAfterByScope.set(methodScope, parsedSeconds);
        this.retryUntilByScope.set(methodScope, until);
      }
    } else if (status === 429) {
      const until = now + 1000;
      this.retryAfterByScope.set(appScope, 1);
      this.retryUntilByScope.set(appScope, until);
      this.retryAfterByScope.set(methodScope, 1);
      this.retryUntilByScope.set(methodScope, until);
    }
  }

  getSnapshot(scope?: string | RiotRateLimitScopes): RiotRateLimitSnapshot | null {
    if (scope) {
      const { appScope, methodScope } = this.resolveScopes(scope);
      const app = this.appScopes.get(appScope) || [];
      const method = this.methodScopes.get(methodScope) || [];
      const retryAfter =
        this.retryAfterByScope.get(methodScope) ??
        this.retryAfterByScope.get(appScope);
      const retryUntil =
        this.retryUntilByScope.get(methodScope) ??
        this.retryUntilByScope.get(appScope);

      return {
        app,
        method,
        retryAfterSeconds: retryAfter,
        retryUntilTimestamp: retryUntil,
        updatedAt: Date.now(),
      };
    }

    // Return first available state
    for (const [appScope, app] of this.appScopes.entries()) {
      return {
        app,
        method: [],
        retryAfterSeconds: this.retryAfterByScope.get(appScope),
        retryUntilTimestamp: this.retryUntilByScope.get(appScope),
        updatedAt: Date.now(),
      };
    }
    return null;
  }

  reset(): void {
    this.appScopes.clear();
    this.methodScopes.clear();
    this.retryUntilByScope.clear();
    this.retryAfterByScope.clear();
  }
}

export const defaultRiotRateLimiter = new DefaultRiotRateLimiter();
