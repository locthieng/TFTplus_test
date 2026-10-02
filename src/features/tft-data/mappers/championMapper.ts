import { RawChampion } from "../schemas/championSourceSchema";
import { Champion, CostTier } from "@/types/tft";
import { resolveCdragonImageUrl, cleanTftDescription } from "./mapperUtils";

function buildStarScaling(base?: number): number[] | undefined {
  if (base == null || typeof base !== "number") return undefined;
  return [base, Math.round(base * 1.8), Math.round(base * 3.24)];
}

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

  const hp =
    typeof raw.stats?.hp === "number"
      ? raw.stats.hp
      : typeof raw.stats?.health === "number"
      ? raw.stats.health
      : undefined;

  const ad =
    typeof raw.stats?.damage === "number"
      ? raw.stats.damage
      : typeof raw.stats?.attackDamage === "number"
      ? raw.stats.attackDamage
      : undefined;

  const attackSpeed =
    typeof raw.stats?.attackSpeed === "number" ? raw.stats.attackSpeed : undefined;
  const armor = typeof raw.stats?.armor === "number" ? raw.stats.armor : undefined;
  const magicResist =
    typeof raw.stats?.magicResist === "number" ? raw.stats.magicResist : undefined;
  const range = typeof raw.stats?.range === "number" ? raw.stats.range : undefined;
  const critChance =
    typeof raw.stats?.critChance === "number" ? raw.stats.critChance : undefined;
  const critDamage =
    typeof raw.stats?.critDamage === "number" ? raw.stats.critDamage : undefined;

  const initialMana =
    typeof raw.stats?.initialMana === "number" ? raw.stats.initialMana : undefined;
  const totalMana =
    typeof raw.stats?.mana === "number" ? raw.stats.mana : undefined;

  const mana =
    initialMana != null || totalMana != null
      ? {
          starting: initialMana,
          total: totalMana,
        }
      : undefined;

  return {
    id: raw.apiName.toLowerCase(),
    apiName: raw.apiName,
    name: raw.name || raw.apiName,
    cost,
    imageUrl,
    traits,
    health: buildStarScaling(hp),
    attackDamage: buildStarScaling(ad),
    attackSpeed,
    armor,
    magicResist,
    range,
    critChance,
    critDamage,
    ability: raw.ability
      ? {
          name: raw.ability.name || "Ability",
          description: cleanTftDescription(raw.ability.desc),
          mana,
        }
      : undefined,
  };
}
