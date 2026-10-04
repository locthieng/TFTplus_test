import "server-only";

export interface RiotLogEntry {
  service: string;
  operation: string;
  regionOrPlatform?: string;
  status: "success" | "error" | "cache_hit" | "rate_limited";
  durationMs?: number;
  retryCount?: number;
  message?: string;
  puuidTruncated?: string;
}

export class RiotLogger {
  log(entry: RiotLogEntry): void {
    const timestamp = new Date().toISOString();
    const safePayload = {
      timestamp,
      ...entry,
    };

    // Sanitize any potential accidental keys or tokens
    const serialized = JSON.stringify(safePayload);
    if (serialized.includes("RGAPI-")) {
      console.warn(`[RiotLogger] ${timestamp} [REDACTED_SECRET_EVENT]`);
      return;
    }

    if (entry.status === "error" || entry.status === "rate_limited") {
      console.warn(`[RiotLogger] ${serialized}`);
    } else {
      console.log(`[RiotLogger] ${serialized}`);
    }
  }

  truncatePuuid(puuid?: string): string | undefined {
    if (!puuid) return undefined;
    return puuid.length > 8 ? `${puuid.slice(0, 4)}...${puuid.slice(-4)}` : puuid;
  }
}

export const defaultRiotLogger = new RiotLogger();
