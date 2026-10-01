import { RawItemLike } from "../resolvers/itemTypeResolver";

const PREVIOUS_SET_PREFIXES = [
  "tft1_",
  "tft2_",
  "tft3_",
  "tft4_",
  "tft5_",
  "tft6_",
  "tft7_",
  "tft8_",
  "tft9_",
  "tft10_",
  "tft11_",
  "tft12_",
  "tft13_",
  "tft14_",
  "tft15_",
  "tft16_",
  "tft17_",
];

const REJECTED_AUGMENT_MARKERS = [
  "tutorial",
  "debug",
  "test",
  "dummy",
  "admincause",
  "placeholder",
  "blank",
  "cheat",
];

export function shouldIncludeAugment(
  raw: RawItemLike,
  set18AugmentApiNames?: ReadonlySet<string>
): boolean {
  if (!raw.name || typeof raw.name !== "string") return false;
  const nameTrimmed = raw.name.trim();
  if (nameTrimmed.length === 0) return false;

  // Placeholder localization string
  if (
    nameTrimmed.startsWith("tft_item_name_") ||
    nameTrimmed.startsWith("TFT_Item_Name_") ||
    nameTrimmed.startsWith("tft_")
  ) {
    return false;
  }

  const apiLower = raw.apiName.toLowerCase();

  // Reject previous sets
  for (const prefix of PREVIOUS_SET_PREFIXES) {
    if (apiLower.startsWith(prefix)) return false;
  }

  // Reject internal markers
  for (const marker of REJECTED_AUGMENT_MARKERS) {
    if (apiLower.includes(marker)) return false;
  }

  // Must be an augment
  const isAug =
    raw.isAugment ||
    apiLower.includes("augment") ||
    (set18AugmentApiNames && set18AugmentApiNames.has(raw.apiName));

  if (!isAug) return false;

  // If Set 18 augment set is provided, verify it belongs to Set 18
  if (set18AugmentApiNames && set18AugmentApiNames.size > 0) {
    if (set18AugmentApiNames.has(raw.apiName)) return true;
    if (apiLower.startsWith("da_") || apiLower.startsWith("tft18_")) return true;
    return false;
  }

  // Fallback: must start with DA_ or TFT18_
  if (apiLower.startsWith("da_") || apiLower.startsWith("tft18_")) {
    return true;
  }

  return false;
}
