import { Champion, Trait, Item, Augment, TeamComp } from "@/types/tft";
import { Wisp } from "@/features/wisps/types/wisp";
import { PetSpecies } from "@/features/pets/types/pet";
import { HexCore } from "@/features/hex-cores/types/hexCore";
import {
  DatasetHealth,
  HealthStatus,
  SystemDataHealthReport,
  ChampionStatCoverage,
} from "./datasetHealth.types";

export interface ComputeHealthParams {
  champions: Champion[];
  traits: Trait[];
  items: Item[];
  augments: Augment[];
  teamComps: TeamComp[];
  wisps: Wisp[];
  petSpecies: PetSpecies[];
  hexCores: HexCore[];
}

export function computeSystemDataHealth({
  champions,
  traits,
  items,
  augments,
  teamComps,
  wisps,
  petSpecies,
  hexCores,
}: ComputeHealthParams): SystemDataHealthReport {
  const champMap = new Map(champions.map((c) => [c.id.toLowerCase(), c]));
  for (const c of champions) {
    if (c.apiName) champMap.set(c.apiName.toLowerCase(), c);
  }

  const itemMap = new Map(items.map((i) => [i.id.toLowerCase(), i]));
  const traitMap = new Map(
    traits.map((t) => [t.id.toLowerCase().replace(/\s+/g, ""), t])
  );
  const augmentMap = new Map(augments.map((a) => [a.id.toLowerCase(), a]));

  // Check relational integrity in team comps
  let brokenChampions = 0;
  let brokenItems = 0;
  let brokenTraits = 0;
  let brokenAugments = 0;

  for (const comp of teamComps) {
    for (const c of comp.champions) {
      if (!champMap.has(c.championId.toLowerCase())) brokenChampions++;
      if (c.items) {
        for (const it of c.items) {
          if (!itemMap.has(it.toLowerCase())) brokenItems++;
        }
      }
    }
    for (const t of comp.traits) {
      const norm = t.traitId.toLowerCase().replace(/\s+/g, "");
      if (!traitMap.has(norm)) brokenTraits++;
    }
    if (comp.augments) {
      for (const augId of comp.augments) {
        if (!augmentMap.has(augId.toLowerCase())) brokenAugments++;
      }
    }
  }

  // Champion Stat Coverage
  const totalChamps = champions.length;
  const hp = champions.filter((c) => c.health && c.health.length > 0).length;
  const ad = champions.filter((c) => c.attackDamage && c.attackDamage.length > 0).length;
  const armor = champions.filter((c) => c.armor != null).length;
  const mr = champions.filter((c) => c.magicResist != null).length;
  const as = champions.filter((c) => c.attackSpeed != null).length;
  const mana = champions.filter((c) => c.ability?.mana != null).length;
  const crit = champions.filter((c) => c.critChance != null).length;

  const championStats: ChampionStatCoverage = {
    total: totalChamps,
    hp,
    ad,
    armor,
    mr,
    as,
    mana,
    crit,
    percentages: {
      hp: totalChamps > 0 ? Math.round((hp / totalChamps) * 100) : 0,
      ad: totalChamps > 0 ? Math.round((ad / totalChamps) * 100) : 0,
      armor: totalChamps > 0 ? Math.round((armor / totalChamps) * 100) : 0,
      mr: totalChamps > 0 ? Math.round((mr / totalChamps) * 100) : 0,
      as: totalChamps > 0 ? Math.round((as / totalChamps) * 100) : 0,
      mana: totalChamps > 0 ? Math.round((mana / totalChamps) * 100) : 0,
      crit: totalChamps > 0 ? Math.round((crit / totalChamps) * 100) : 0,
    },
  };

  const datasets: DatasetHealth[] = [];

  // 1. Champions
  const champIssues: string[] = [];
  if (totalChamps < 70) champIssues.push(`Champion count is low (${totalChamps} < 70 expected)`);
  datasets.push({
    name: "Champions",
    itemCount: totalChamps,
    itemCountLabel: `${totalChamps} units`,
    integrityStatus: champIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: totalChamps,
      expected: 74,
      percentage: totalChamps > 0 ? Math.round((totalChamps / 74) * 100) : 0,
    },
    issues: champIssues,
  });

  // 2. Traits
  const traitIssues: string[] = [];
  if (traits.length < 30) traitIssues.push(`Trait count is low (${traits.length} < 30)`);
  datasets.push({
    name: "Traits",
    itemCount: traits.length,
    itemCountLabel: `${traits.length} origins/classes`,
    integrityStatus: traitIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: traits.length,
      expected: 36,
      percentage: traits.length > 0 ? Math.round((traits.length / 36) * 100) : 0,
    },
    issues: traitIssues,
  });

  // 3. Items
  const itemIssues: string[] = [];
  if (items.length < 150) itemIssues.push(`Item count is low (${items.length} < 150)`);
  datasets.push({
    name: "Items",
    itemCount: items.length,
    itemCountLabel: `${items.length} equipment items`,
    integrityStatus: itemIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: items.length,
      expected: 171,
      percentage: items.length > 0 ? Math.round((items.length / 171) * 100) : 0,
    },
    issues: itemIssues,
  });

  // 4. Augments
  const augIssues: string[] = [];
  if (augments.length < 300) augIssues.push(`Augment count is low (${augments.length} < 300)`);
  datasets.push({
    name: "Augments",
    itemCount: augments.length,
    itemCountLabel: `${augments.length} hextech augments`,
    integrityStatus: augIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: augments.length,
      expected: 345,
      percentage: augments.length > 0 ? Math.round((augments.length / 345) * 100) : 0,
    },
    issues: augIssues,
  });

  // 5. Team Comps
  const compIssues: string[] = [];
  if (brokenChampions > 0) compIssues.push(`${brokenChampions} broken champion reference(s)`);
  if (brokenItems > 0) compIssues.push(`${brokenItems} broken item reference(s)`);
  if (brokenTraits > 0) compIssues.push(`${brokenTraits} broken trait reference(s)`);
  if (brokenAugments > 0) compIssues.push(`${brokenAugments} broken augment reference(s)`);
  if (teamComps.length < 10) compIssues.push(`Curated comp count is low (${teamComps.length} < 10)`);
  datasets.push({
    name: "Team Comps",
    itemCount: teamComps.length,
    itemCountLabel: `${teamComps.length} meta setups`,
    integrityStatus: compIssues.length === 0 ? "healthy" : brokenChampions > 0 || brokenItems > 0 ? "critical" : "warning",
    verificationStatus: "curated",
    releaseCompatible: true,
    coverage: {
      current: teamComps.length,
      expected: 12,
      percentage: teamComps.length > 0 ? Math.round((teamComps.length / 12) * 100) : 0,
    },
    issues: compIssues,
  });

  // 6. Wisps
  const unverifiedWisps = wisps.filter((w) => !w.verified).length;
  const wispIssues: string[] = [];
  if (unverifiedWisps > 0) wispIssues.push(`${unverifiedWisps} unverified wisps found`);
  if (wisps.length === 0) wispIssues.push("No Set 18 wisps indexed");
  datasets.push({
    name: "Wisps",
    itemCount: wisps.length,
    itemCountLabel: `${wisps.length} shop mechanics`,
    integrityStatus: wispIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: wisps.length,
      expected: 162,
      percentage: wisps.length > 0 ? Math.round((wisps.length / 162) * 100) : 0,
    },
    issues: wispIssues,
  });

  // 7. Pets / Tacticians
  const totalVariants = petSpecies.reduce((sum, s) => sum + (s.variants?.length || 0), 0);
  const petIssues: string[] = [];
  if (petSpecies.length < 100) petIssues.push(`Pet species count is low (${petSpecies.length} < 100)`);
  datasets.push({
    name: "Pets",
    itemCount: petSpecies.length,
    itemCountLabel: `${petSpecies.length} species (${totalVariants} variants)`,
    integrityStatus: petIssues.length === 0 ? "healthy" : "warning",
    verificationStatus: "verified",
    releaseCompatible: true,
    coverage: {
      current: petSpecies.length,
      expected: 138,
      percentage: petSpecies.length > 0 ? Math.round((petSpecies.length / 138) * 100) : 0,
    },
    issues: petIssues,
  });

  // 8. Hex Cores
  const verifiedHexCores = hexCores.filter((h) => h.verified).length;
  const hexCoreIssues = [
    "Marked speculative / unverified.",
    "Disabled in production via FEATURE_FLAGS.hexCores.",
  ];
  datasets.push({
    name: "Hex Cores",
    itemCount: hexCores.length,
    itemCountLabel: `${hexCores.length} speculative entries`,
    integrityStatus: "warning",
    verificationStatus: verifiedHexCores > 0 ? "curated" : "unverified",
    releaseCompatible: false,
    coverage: {
      current: verifiedHexCores,
      expected: hexCores.length,
      percentage: hexCores.length > 0 ? Math.round((verifiedHexCores / hexCores.length) * 100) : 0,
    },
    issues: hexCoreIssues,
  });

  // Determine overall status
  const hasCritical =
    brokenChampions > 0 ||
    brokenItems > 0 ||
    totalChamps === 0 ||
    items.length === 0;

  const hasWarning =
    datasets.some((d) => d.integrityStatus === "warning" && d.name !== "Hex Cores") ||
    champIssues.length > 0 ||
    traitIssues.length > 0;

  const overallStatus: HealthStatus = hasCritical
    ? "critical"
    : hasWarning
    ? "warning"
    : "healthy";

  return {
    overallStatus,
    datasets,
    championStats,
    brokenReferences: {
      brokenChampions,
      brokenItems,
      brokenTraits,
      brokenAugments,
    },
    evaluatedAt: new Date().toISOString(),
  };
}
