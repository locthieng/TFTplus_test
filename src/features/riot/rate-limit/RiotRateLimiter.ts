import "server-only";

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

export interface RiotRateLimiter {
  beforeRequest(scope: string): Promise<void>;
  recordResponse(scope: string, headers?: Headers | null, status?: number): void;
  getSnapshot(scope?: string): RiotRateLimitSnapshot | null;
  reset(): void;
}

export interface RiotRateLimiterOptions {
  sleepFn?: (ms: number) => Promise<void>;
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
  private readonly scopes = new Map<string, RiotRateLimitSnapshot>();
  private readonly sleepFn: (ms: number) => Promise<void>;

  constructor(options?: RiotRateLimiterOptions) {
    this.sleepFn =
      options?.sleepFn ||
      ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  async beforeRequest(scope: string): Promise<void> {
    const state = this.scopes.get(scope);
    if (!state) return;

    const now = Date.now();

    // 1. Retry-After is actively enforced
    if (state.retryUntilTimestamp && state.retryUntilTimestamp > now) {
      const waitMs = state.retryUntilTimestamp - now;
      if (waitMs > 0) {
        await this.sleepFn(waitMs);
      }
      return;
    }

    // 2. Check window limits
    const allWindows = [...state.app, ...state.method];
    if (allWindows.length === 0) return;

    // Check 100% capacity (limit reached)
    const saturated = allWindows.find((w) => w.limit > 0 && w.used >= w.limit);
    if (saturated) {
      // Saturated: conservative delay to allow window rotation
      const safeDelayMs = Math.min(saturated.windowSeconds * 1000, 1000);
      await this.sleepFn(safeDelayMs);
      return;
    }

    // Check 90% capacity (proactive backoff)
    const nearLimit = allWindows.find(
      (w) => w.limit > 0 && w.used / w.limit >= 0.9
    );
    if (nearLimit) {
      // Near limit: small throttle delay
      await this.sleepFn(200);
      return;
    }
  }

  recordResponse(scope: string, headers?: Headers | null, status?: number): void {
    if (!headers || typeof headers.get !== "function") return;

    const now = Date.now();
    const appLimit = headers.get("x-app-rate-limit");
    const appCount = headers.get("x-app-rate-limit-count");
    const methodLimit = headers.get("x-method-rate-limit");
    const methodCount = headers.get("x-method-rate-limit-count");
    const retryAfterHeader = headers.get("retry-after");

    const app = parseRateLimitWindows(appLimit, appCount);
    const method = parseRateLimitWindows(methodLimit, methodCount);

    let retryAfterSeconds: number | undefined;
    let retryUntilTimestamp: number | undefined;

    if (retryAfterHeader) {
      const parsedSeconds = parseInt(retryAfterHeader, 10);
      if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
        retryAfterSeconds = parsedSeconds;
        retryUntilTimestamp = now + parsedSeconds * 1000;
      }
    } else if (status === 429) {
      retryAfterSeconds = 1;
      retryUntilTimestamp = now + 1000;
    }

    const snapshot: RiotRateLimitSnapshot = {
      app,
      method,
      retryAfterSeconds,
      retryUntilTimestamp,
      updatedAt: now,
    };

    this.scopes.set(scope, snapshot);
  }

  getSnapshot(scope?: string): RiotRateLimitSnapshot | null {
    if (scope) {
      return this.scopes.get(scope) || null;
    }
    // Return first available scope or null
    for (const snap of this.scopes.values()) {
      return snap;
    }
    return null;
  }

  reset(): void {
    this.scopes.clear();
  }
}

export const defaultRiotRateLimiter = new DefaultRiotRateLimiter();
