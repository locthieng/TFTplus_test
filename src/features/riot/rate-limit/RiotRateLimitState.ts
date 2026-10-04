import "server-only";

export interface RiotRateLimitSnapshot {
  appLimit?: string;
  appCount?: string;
  methodLimit?: string;
  methodCount?: string;
  retryAfterSeconds?: number;
  updatedAt: string;
}

export class RiotRateLimitState {
  private lastSnapshot: RiotRateLimitSnapshot | null = null;

  updateFromHeaders(headers?: Headers): void {
    if (!headers || typeof headers.get !== "function") return;

    const appLimit = headers.get("x-app-rate-limit") || undefined;
    const appCount = headers.get("x-app-rate-limit-count") || undefined;
    const methodLimit = headers.get("x-method-rate-limit") || undefined;
    const methodCount = headers.get("x-method-rate-limit-count") || undefined;
    const retryAfter = headers.get("retry-after");

    this.lastSnapshot = {
      appLimit,
      appCount,
      methodLimit,
      methodCount,
      retryAfterSeconds: retryAfter ? parseInt(retryAfter, 10) : undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  getSnapshot(): RiotRateLimitSnapshot | null {
    return this.lastSnapshot;
  }
}

export const defaultRateLimitState = new RiotRateLimitState();
