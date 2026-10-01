import { Augment, AugmentTier } from "@/types/tft";

export type AugmentNumericTier = "1" | "2" | "3";

export const AUGMENT_NUMERIC_TIERS: {
  id: AugmentNumericTier;
  tierKey: AugmentTier;
  label: string;
  href: string;
}[] = [
  { id: "1", tierKey: "silver", label: "Tier 1 (Silver)", href: "/augments/1" },
  { id: "2", tierKey: "gold", label: "Tier 2 (Gold)", href: "/augments/2" },
  {
    id: "3",
    tierKey: "prismatic",
    label: "Tier 3 (Prismatic)",
    href: "/augments/3",
  },
];

export function mapNumericTierToAugmentTier(
  tier: AugmentNumericTier
): AugmentTier {
  switch (tier) {
    case "1":
      return "silver";
    case "2":
      return "gold";
    case "3":
      return "prismatic";
  }
}

export function filterAugmentsByNumericTier(
  augments: Augment[],
  tier: AugmentNumericTier
): Augment[] {
  const target = mapNumericTierToAugmentTier(tier);
  return augments.filter((a) => a.tier === target);
}
