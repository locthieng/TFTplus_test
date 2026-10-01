import { RawTrait } from "../schemas/traitSourceSchema";
import { Trait, TraitBreakpoint, TraitTierStyle } from "@/types/tft";
import { resolveCdragonImageUrl, cleanTftDescription } from "./mapperUtils";

function styleNumberToStyle(styleNum?: number | null): TraitTierStyle {
  switch (styleNum) {
    case 4:
      return "prismatic";
    case 3:
      return "gold";
    case 2:
      return "silver";
    default:
      return "bronze";
  }
}

export function mapRawTraitToDomain(raw: RawTrait): Trait {
  const iconUrl = resolveCdragonImageUrl(raw.icon);

  const breakpoints: TraitBreakpoint[] = (raw.effects || [])
    .filter(
      (e): e is typeof e & { minUnits: number } =>
        typeof e.minUnits === "number" && e.minUnits > 0
    )
    .sort((a, b) => a.minUnits - b.minUnits)
    .map((e) => ({
      minUnits: e.minUnits,
      maxUnits: e.maxUnits || undefined,
      style: styleNumberToStyle(e.style),
      description: `${e.minUnits} Units`,
    }));

  return {
    id: raw.name.toLowerCase().replace(/\s+/g, ""),
    apiName: raw.apiName,
    name: raw.name || raw.apiName,
    iconUrl,
    description: cleanTftDescription(raw.desc),
    breakpoints,
  };
}
