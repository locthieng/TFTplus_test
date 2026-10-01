import { resolveItemType, RawItemLike } from "../resolvers/itemTypeResolver";

const REJECTED_MARKERS = [
  "admincause",
  "debug",
  "test",
  "helper",
  "encounter",
  "npc",
  "dummy",
  "armory",
  "placeholder",
  "blank",
  "cheat",
  "tutorial",
  "pve",
  "minion",
  "assist",
];

export function shouldIncludeTftItem(raw: RawItemLike): boolean {
  if (!raw.name || typeof raw.name !== "string") return false;
  const nameTrimmed = raw.name.trim();
  if (nameTrimmed.length === 0) return false;

  // Placeholder localization strings
  if (
    nameTrimmed.startsWith("tft_item_name_") ||
    nameTrimmed.startsWith("TFT_Item_Name_") ||
    nameTrimmed.startsWith("tft_")
  ) {
    return false;
  }

  if (
    raw.desc &&
    (raw.desc.startsWith("tft_item_description_") ||
      raw.desc.startsWith("TFT_Item_Description_"))
  ) {
    return false;
  }

  // Skip augment entities from items collection
  if (raw.isAugment) return false;
  const apiLower = raw.apiName.toLowerCase();
  if (apiLower.includes("augment")) return false;

  for (const marker of REJECTED_MARKERS) {
    if (apiLower.includes(marker)) return false;
  }

  // Must map to a recognized TFT ItemType
  const resolvedType = resolveItemType(raw);
  if (!resolvedType) {
    return false;
  }

  return true;
}
