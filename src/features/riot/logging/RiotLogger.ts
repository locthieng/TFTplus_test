import "server-only";

export type RiotLogEventType =
  | "request_start"
  | "request_success"
  | "request_error"
  | "retry"
  | "rate_limited"
  | "timeout"
  | "cache_hit"
  | "cache_miss";

export interface RiotLogEvent {
  service: string;
  operation: string;
  event: RiotLogEventType;
  region?: string;
  status?: number | string;
  durationMs?: number;
  retryCount?: number;
  rateLimited?: boolean;
  cacheHit?: boolean;
  message?: string;
  puuidTruncated?: string;
}

// Backward-compatible alias for existing callers
export type RiotLogEntry = Omit<Partial<RiotLogEvent>, "status"> & {
  service: string;
  operation: string;
  regionOrPlatform?: string;
  status?: "success" | "error" | "cache_hit" | "rate_limited" | number;
};

export class RiotLogger {
  log(entry: RiotLogEntry): void {
    const timestamp = new Date().toISOString();
    const safePayload = {
      timestamp,
      ...entry,
    };

    // Sanitize any potential accidental keys or tokens
    const serialized = JSON.stringify(safePayload);
    if (/RGAPI-[a-zA-Z0-9-]+/i.test(serialized) || /Bearer\s+[a-zA-Z0-9-_]+/i.test(serialized)) {
      console.warn(`[RiotLogger] ${timestamp} [REDACTED_SECRET_EVENT]`);
      return;
    }

    const isWarning =
      entry.status === "error" ||
      entry.status === "rate_limited" ||
      (typeof entry.status === "number" && entry.status >= 400) ||
      entry.event === "request_error" ||
      entry.event === "rate_limited";

    if (isWarning) {
      console.warn(`[RiotLogger] ${serialized}`);
    } else {
      console.log(`[RiotLogger] ${serialized}`);
    }
  }

  logRequestStart(params: { service: string; operation: string; region?: string }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "request_start",
      region: params.region,
    });
  }

  logRequestSuccess(params: {
    service: string;
    operation: string;
    region?: string;
    status: number;
    durationMs: number;
    retryCount?: number;
  }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "request_success",
      region: params.region,
      status: params.status,
      durationMs: params.durationMs,
      retryCount: params.retryCount,
    });
  }

  logRequestError(params: {
    service: string;
    operation: string;
    region?: string;
    status?: number;
    durationMs?: number;
    message?: string;
    retryCount?: number;
  }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "request_error",
      region: params.region,
      status: params.status,
      durationMs: params.durationMs,
      retryCount: params.retryCount,
      message: params.message,
    });
  }

  logRetry(params: {
    service: string;
    operation: string;
    region?: string;
    status?: number;
    retryCount: number;
    message?: string;
  }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "retry",
      region: params.region,
      status: params.status,
      retryCount: params.retryCount,
      message: params.message,
    });
  }

  logRateLimited(params: {
    service: string;
    operation: string;
    region?: string;
    status?: number;
    retryAfterSeconds?: number;
  }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "rate_limited",
      region: params.region,
      status: params.status || 429,
      rateLimited: true,
      message: params.retryAfterSeconds ? `Retry-After: ${params.retryAfterSeconds}s` : undefined,
    });
  }

  logTimeout(params: {
    service: string;
    operation: string;
    region?: string;
    durationMs: number;
  }): void {
    this.log({
      service: params.service,
      operation: params.operation,
      event: "timeout",
      region: params.region,
      durationMs: params.durationMs,
      message: "Request timed out",
    });
  }

  logCacheHit(service: string, operation: string, key?: string): void {
    this.log({
      service,
      operation,
      event: "cache_hit",
      cacheHit: true,
      message: key ? `Key: ${key}` : undefined,
    });
  }

  logCacheMiss(service: string, operation: string, key?: string): void {
    this.log({
      service,
      operation,
      event: "cache_miss",
      cacheHit: false,
      message: key ? `Key: ${key}` : undefined,
    });
  }

  truncatePuuid(puuid?: string): string | undefined {
    if (!puuid) return undefined;
    return puuid.length > 8 ? `${puuid.slice(0, 4)}...${puuid.slice(-4)}` : puuid;
  }
}

export const defaultRiotLogger = new RiotLogger();
