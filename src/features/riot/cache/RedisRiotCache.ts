import "server-only";

import { RiotCache } from "./RiotCache";

export interface RedisCacheConfig {
  url: string;
  token: string;
}

/**
 * Upstash REST-compatible Redis cache implementation.
 * Zero external client dependencies needed; uses native fetch.
 */
export class RedisRiotCache implements RiotCache {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: RedisCacheConfig) {
    this.baseUrl = config.url.replace(/\/$/, "");
    this.token = config.token;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}/get/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.result === null || data.result === undefined) {
        return null;
      }

      if (typeof data.result === "string") {
        try {
          return JSON.parse(data.result) as T;
        } catch {
          return data.result as T;
        }
      }

      return data.result as T;
    } catch (err: unknown) {
      console.warn(`[RedisRiotCache] GET failed for key "${key}":`, err);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      await fetch(
        `${this.baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(
          serialized
        )}?ex=${ttlSeconds}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          cache: "no-store",
        }
      );
    } catch (err: unknown) {
      console.warn(`[RedisRiotCache] SET failed for key "${key}":`, err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/del/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        cache: "no-store",
      });
    } catch (err: unknown) {
      console.warn(`[RedisRiotCache] DEL failed for key "${key}":`, err);
    }
  }

  async clear(): Promise<void> {
    // No-op for safety in shared Redis database
  }
}
