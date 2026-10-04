import { RedisRiotCache } from "./RedisRiotCache";

export interface RiotCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryRiotCache implements RiotCache {
  private store = new Map<string, CacheItem<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.store.get(key);
      if (!item) return null;

      if (Date.now() > item.expiresAt) {
        this.store.delete(key);
        return null;
      }

      return item.value as T;
    } catch (err: unknown) {
      console.warn(`[InMemoryRiotCache] get failed for key "${key}":`, err);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const expiresAt = Date.now() + ttlSeconds * 1000;
      this.store.set(key, { value, expiresAt });
    } catch (err: unknown) {
      console.warn(`[InMemoryRiotCache] set failed for key "${key}":`, err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.store.delete(key);
    } catch {
      // non-fatal
    }
  }

  async clear(): Promise<void> {
    try {
      this.store.clear();
    } catch {
      // non-fatal
    }
  }

  size(): number {
    return this.store.size;
  }
}

export function createRiotCache(): RiotCache {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    return new RedisRiotCache({ url: redisUrl, token: redisToken });
  }

  return new InMemoryRiotCache();
}

// Global singleton cache instance using factory
export const defaultRiotCache: RiotCache = createRiotCache();
