import { RawChampion } from "../schemas/championSourceSchema";
import { Champion, CostTier } from "@/types/tft";
import { resolveCdragonImageUrl, cleanTftDescription } from "./mapperUtils";

export function mapRawChampionToDomain(raw: RawChampion): Champion {
  const iconPath = raw.tileIcon || raw.squareIcon || raw.icon;
  const imageUrl = resolveCdragonImageUrl(iconPath);

  // Normalize cost between 1 and 6
  const rawCost = typeof raw.cost === "number" ? raw.cost : 1;
  const cost = (Math.max(1, Math.min(6, rawCost)) || 1) as CostTier;

  // Normalize traits: use lowercase slugs
  const traits = (raw.traits || [])
    .filter((t) => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim().toLowerCase());

  const hp = raw.stats?.hp || raw.stats?.health || 650;
  const ad = raw.stats?.damage || raw.stats?.attackDamage || 50;

  return {
    id: raw.apiName.toLowerCase(),
    apiName: raw.apiName,
    name: raw.name || raw.apiName,
    cost,
    imageUrl,
    traits,
    health: [hp, Math.round(hp * 1.8), Math.round(hp * 3.24)],
    attackDamage: [ad, Math.round(ad * 1.8), Math.round(ad * 3.24)],
    attackSpeed: raw.stats?.attackSpeed || 0.7,
    armor: raw.stats?.armor || 35,
    magicResist: raw.stats?.magicResist || 35,
    range: raw.stats?.range || 1,
    ability: raw.ability
      ? {
          name: raw.ability.name || "Ability",
          description: cleanTftDescription(raw.ability.desc),
          mana: {
            starting: raw.stats?.initialMana || 0,
            total: raw.stats?.mana || 80,
          },
        }
      : undefined,
  };
}
