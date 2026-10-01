import { RawItemLike } from "../resolvers/itemTypeResolver";

export interface CurrentSetItemFilterContext {
  setId: string;
  currentTraitNames: ReadonlySet<string>;
  currentTraitApiNames?: ReadonlySet<string>;
  currentTraitIds?: ReadonlySet<string>;
}

/**
 * Whitelist of verified global legacy artifacts that originated in earlier sets
 * but remain active global Ornn/Artifact items in the convergence.
 */
export const VERIFIED_GLOBAL_LEGACY_ARTIFACTS = new Set<string>([
  "tft4_item_ornnanimavisage",
  "tft4_item_ornndeathsdefiance",
  "tft4_item_ornneternalwinter",
  "tft4_item_ornninfinityforce",
  "tft4_item_ornnmuramana",
  "tft4_item_ornnobsidiancleaver",
  "tft4_item_ornnranduinssanctum",
  "tft4_item_ornnthecollector",
  "tft4_item_ornnzhonyasparadox",
  "tft9_item_ornndeathfiregrasp",
  "tft9_item_ornnhullbreaker",
  "tft9_item_ornnhorizonfocus",
  "tft9_item_ornnprototypeforge",
  "tft9_item_ornntrickstersglass",
]);

/**
 * Detects whether an apiName corresponds to an old set (e.g. tft1_ through tft17_).
 */
export function isLegacySetSpecificApiName(apiName: string): boolean {
  return /^tft(1[0-7]|[1-9])_/i.test(apiName);
}

/**
 * Validates whether an emblem item belongs to the active set traits.
 */
export function isCurrentSetEmblem(
  raw: RawItemLike,
  currentTraitNames: ReadonlySet<string>
): boolean {
  const name = (raw.name || "").trim().toLowerCase();
  const api = raw.apiName.toLowerCase();

  // Strip "Emblem" suffix / prefix
  const cleanName = name.replace(/\s*emblem\s*/i, "").trim();

  for (const traitName of currentTraitNames) {
    const tNameLower = traitName.toLowerCase();
    const tCompact = tNameLower.replace(/\s+/g, "");

    if (
      cleanName === tNameLower ||
      cleanName === tCompact ||
      api.includes(tCompact) ||
      name.includes(tNameLower)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Determines whether a raw item is compatible with the current set:
 * 1. Rejects obsolete set prefixes (tft1_ ... tft17_) unless in the global artifact whitelist.
 * 2. If it is an emblem, ensures it maps to a current set trait.
 * 3. Rejects set-specific mechanics (Mercenary chests, Market offerings, Xerath charms, Chosen items).
 */
export function isCurrentSetCompatibleItem(
  raw: RawItemLike,
  context: CurrentSetItemFilterContext
): boolean {
  const api = raw.apiName.toLowerCase();
  const name = (raw.name || "").trim().toLowerCase();

  // 1. Reject old set mechanics / non-standard entities
  if (
    api.includes("marketoffering") ||
    api.includes("merc") ||
    api.includes("xerathzap") ||
    api.includes("chosen")
  ) {
    return false;
  }

  // 2. Reject legacy set prefixes unless whitelisted global artifacts
  if (isLegacySetSpecificApiName(api)) {
    if (!VERIFIED_GLOBAL_LEGACY_ARTIFACTS.has(api)) {
      return false;
    }
  }

  // 3. If emblem, must match current set trait
  const isEmblem =
    name.includes("emblem") ||
    api.includes("emblem") ||
    raw.type === "emblem";

  if (isEmblem) {
    if (!isCurrentSetEmblem(raw, context.currentTraitNames)) {
      return false;
    }
  }

  return true;
}
