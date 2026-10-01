/**
 * Resolves a CommunityDragon asset path into a valid CDN PNG URL.
 */
export function resolveCdragonImageUrl(path?: string | null): string {
  if (!path) {
    return "https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/tft_armory.png";
  }

  // Already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const clean = path
    .toLowerCase()
    .replace(/^.*\/game\//, "")
    .replace(/^\/+/, "")
    .replace(/\.tex$/, ".png");

  return `https://raw.communitydragon.org/latest/game/${clean}`;
}

/**
 * Decodes common HTML entities found in Riot/CommunityDragon strings.
 */
export function decodeBasicHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

/**
 * Cleans Riot/CommunityDragon markup formatting like <br>, <rules>, @Variables@, %i:...%, etc.
 * Normalizes punctuation and spacing to ensure clean human-readable descriptions.
 */
export function cleanTftDescription(text?: string | null): string {
  if (!text) return "";

  const withEntitiesDecoded = decodeBasicHtmlEntities(text);

  return withEntitiesDecoded
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/@[^@]+@/g, "")
    .replace(/%i:[a-zA-Z0-9_]+%/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\[\s*\]/g, "")
    .replace(/\s+([,.:;!?])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}
