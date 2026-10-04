export const RIOT_CACHE_PREFIX = "tftplus:riot";
export const RIOT_CACHE_VERSION = "v1";

/**
 * Builds a standardized, versioned cache key for Riot API resources.
 * Example output: "tftplus:riot:v1:account:asia:faker:kr1"
 */
export function buildRiotCacheKey(
  namespace: string,
  ...segments: (string | number)[]
): string {
  const normalizedSegments = segments.map((s) =>
    encodeURIComponent(String(s).trim().toLowerCase())
  );
  return [
    RIOT_CACHE_PREFIX,
    RIOT_CACHE_VERSION,
    encodeURIComponent(namespace.trim().toLowerCase()),
    ...normalizedSegments,
  ].join(":");
}
