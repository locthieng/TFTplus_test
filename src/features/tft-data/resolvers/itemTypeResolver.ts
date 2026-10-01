import { ItemType } from "@/types/tft";

const STANDARD_COMPONENT_APIS = new Set([
  "tft_item_bfsword",
  "tft_item_recurvebow",
  "tft_item_needlesslylargerod",
  "tft_item_tearofthegoddess",
  "tft_item_chainvest",
  "tft_item_negatroncloak",
  "tft_item_giantsbelt",
  "tft_item_spatula",
  "tft_item_sparringgloves",
  "tft_item_fryingpan",
]);

const STANDARD_COMPONENT_NAMES = new Set([
  "b.f. sword",
  "recurve bow",
  "needlessly large rod",
  "tear of the goddess",
  "chain vest",
  "negatron cloak",
  "giant's belt",
  "spatula",
  "sparring gloves",
  "frying pan",
]);

export type RawItemLike = {
  apiName: string;
  name?: string | null;
  desc?: string | null;
  icon?: string | null;
  isAugment?: boolean | null;
  composition?: string[] | null;
  from?: (number | string)[] | null;
  effects?: Record<string, unknown> | null;
  unique?: boolean | null;
  [key: string]: unknown;
};

/**
 * Resolves an item's gameplay category.
 * If the item is internal, debug, or does not match any valid category, returns null.
 */
export function resolveItemType(raw: RawItemLike): ItemType | null {
  const api = raw.apiName.toLowerCase();
  const name = (raw.name || "").trim().toLowerCase();

  // Internal and placeholder rejection
  if (
    !name ||
    name.startsWith("tft_item_name_") ||
    api.includes("admincause") ||
    api.includes("debug") ||
    api.includes("test") ||
    api.includes("dummy") ||
    api.includes("helper") ||
    api.includes("armory") ||
    api.includes("placeholder")
  ) {
    return null;
  }

  // 1. Radiant
  if (api.includes("radiant") || name.includes("radiant")) {
    return "radiant";
  }

  // 2. Artifact (Ornn)
  if (
    api.includes("artifact") ||
    api.includes("ornn") ||
    name.includes("artifact") ||
    api.startsWith("tft4_item_ornn") ||
    api.startsWith("tft9_item_ornn")
  ) {
    return "artifact";
  }

  // 3. Support
  if (api.includes("support") || name.includes("support")) {
    return "support";
  }

  // 4. Emblem
  if (api.includes("emblem") || name.includes("emblem")) {
    return "emblem";
  }

  // 5. Standard Component
  if (
    STANDARD_COMPONENT_APIS.has(api) ||
    STANDARD_COMPONENT_NAMES.has(name)
  ) {
    return "component";
  }

  // 6. Completed Item (has recipe of 2 or more components)
  const hasComposition =
    (raw.composition && raw.composition.length >= 2) ||
    (raw.from && raw.from.length >= 2);

  if (hasComposition) {
    return "completed";
  }

  // Reject anything that doesn't fit standard equippable TFT categories
  return null;
}
