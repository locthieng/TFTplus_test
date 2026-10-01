import { RawItem } from "../schemas/itemSourceSchema";
import { Item } from "@/types/tft";
import { resolveCdragonImageUrl, cleanTftDescription } from "./mapperUtils";
import { resolveItemType } from "../resolvers/itemTypeResolver";

export function mapRawItemToDomain(raw: RawItem): Item {
  const imageUrl = resolveCdragonImageUrl(raw.icon);
  const resolvedType = resolveItemType(raw) || "completed";

  return {
    id: raw.apiName.toLowerCase(),
    apiName: raw.apiName,
    name: raw.name || raw.apiName,
    imageUrl,
    description: cleanTftDescription(raw.desc),
    effects: raw.effects ?? undefined,
    composition: raw.composition ?? undefined,
    type: resolvedType,
    unique: raw.unique ?? undefined,
  };
}
