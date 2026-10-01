import { BoardChampion, CalculatedTrait, TraitBreakpoint } from "@/types/tft";
import { MOCK_CHAMPIONS, MOCK_TRAITS } from "@/data/mockTftData";

/**
 * Calculates active and inactive traits based on champions currently placed on the board.
 * In standard TFT rules:
 * 1. Only unique champions count towards trait thresholds (duplicates do not increase trait counts).
 * 2. Active traits are sorted by highest breakpoint tier first, then by unit count descending.
 */
export function calculateBoardTraits(boardChampions: BoardChampion[]): CalculatedTrait[] {
  if (!boardChampions || boardChampions.length === 0) return [];

  // 1. Get unique champion IDs on the board
  const uniqueChampionIds = Array.from(new Set(boardChampions.map((c) => c.championId)));

  // 2. Count unit occurrences per trait
  const traitCounts: Record<string, number> = {};

  for (const champId of uniqueChampionIds) {
    const champion = MOCK_CHAMPIONS.find((c) => c.id === champId);
    if (!champion) continue;

    for (const traitId of champion.traits) {
      traitCounts[traitId] = (traitCounts[traitId] || 0) + 1;
    }
  }

  // 3. Map to CalculatedTrait objects with active breakpoints
  const results: CalculatedTrait[] = [];

  for (const [traitId, count] of Object.entries(traitCounts)) {
    const trait = MOCK_TRAITS.find((t) => t.id === traitId || t.apiName === traitId);
    if (!trait) continue;

    // Find highest active breakpoint
    let activeBreakpoint: TraitBreakpoint | undefined;
    for (const bp of trait.breakpoints) {
      if (count >= bp.minUnits) {
        if (!activeBreakpoint || bp.minUnits > activeBreakpoint.minUnits) {
          activeBreakpoint = bp;
        }
      }
    }

    results.push({
      trait,
      count,
      activeBreakpoint,
      isActive: activeBreakpoint !== undefined,
    });
  }

  // 4. Sort: Active traits first (prismatic -> gold -> silver -> bronze), then count desc
  const styleWeights: Record<string, number> = {
    prismatic: 4,
    gold: 3,
    silver: 2,
    bronze: 1,
  };

  return results.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;

    if (a.isActive && b.isActive && a.activeBreakpoint && b.activeBreakpoint) {
      const weightA = styleWeights[a.activeBreakpoint.style] || 0;
      const weightB = styleWeights[b.activeBreakpoint.style] || 0;
      if (weightA !== weightB) return weightB - weightA;
    }

    return b.count - a.count;
  });
}
