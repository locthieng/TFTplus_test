import { RawItem } from "../schemas/itemSourceSchema";
import { Augment, AugmentTier } from "@/types/tft";
import { resolveCdragonImageUrl, cleanTftDescription } from "./mapperUtils";

function inferAugmentTier(raw: RawItem): AugmentTier {
  const api = raw.apiName.toLowerCase();
  const icon = (raw.icon || "").toLowerCase();

  if (api.includes("iii") || icon.includes("iii") || api.includes("prismatic"))
    return "prismatic";
  if (api.includes("ii") || icon.includes("ii") || api.includes("gold"))
    return "gold";
  return "silver";
}

export function mapRawAugmentToDomain(raw: RawItem): Augment {
  const iconUrl = resolveCdragonImageUrl(raw.icon);

  return {
    id: raw.apiName.toLowerCase(),
    apiName: raw.apiName,
    name: raw.name || raw.apiName,
    iconUrl,
    description: cleanTftDescription(raw.desc),
    tier: inferAugmentTier(raw),
  };
}
