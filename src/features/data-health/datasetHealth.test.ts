import { describe, it, expect } from "vitest";
import { computeSystemDataHealth } from "./datasetHealth";
import { Champion, Trait, Item, Augment, TeamComp } from "@/types/tft";
import { Wisp } from "@/features/wisps/types/wisp";
import { PetSpecies } from "@/features/pets/types/pet";
import { HexCore } from "@/features/hex-cores/types/hexCore";

describe("computeSystemDataHealth", () => {
  const dummyChampion: Champion = {
    id: "da_18_ahri",
    apiName: "da_18_ahri",
    name: "Ahri",
    cost: 4,
    imageUrl: "",
    traits: ["fated"],
    health: [650, 1170, 2106],
    attackDamage: [50, 90, 162],
    armor: 30,
    magicResist: 30,
    attackSpeed: 0.75,
    ability: {
      name: "Spirit Rush",
      description: "Dashes and damages",
      mana: { starting: 0, total: 60 },
    },
  };

  const dummyTrait: Trait = {
    id: "fated",
    apiName: "fated",
    name: "Fated",
    iconUrl: "",
    description: "Pairs units",
    breakpoints: [],
  };

  const dummyItem: Item = {
    id: "infinity_edge",
    apiName: "infinity_edge",
    name: "Infinity Edge",
    imageUrl: "",
    description: "Critical strikes",
    type: "completed",
  };

  const dummyAugment: Augment = {
    id: "silver_ticket",
    apiName: "silver_ticket",
    name: "Silver Ticket",
    iconUrl: "",
    description: "Free rerolls",
    tier: "silver",
  };

  const dummyComp: TeamComp = {
    id: "comp_1",
    name: "Fated Ahri Carry",
    tier: "S",
    patch: "18.3",
    setId: "18",
    difficulty: "Medium",
    champions: [
      {
        championId: "da_18_ahri",
        name: "Ahri",
        cost: 4,
        imageUrl: "",
        isCarry: true,
        items: ["infinity_edge"],
      },
    ],
    traits: [{ traitId: "fated", name: "Fated", count: 1, iconUrl: "", style: "gold" }],
    recommendedItems: [],
    augments: ["silver_ticket"],
  };

  const dummyWisp: Wisp = {
    id: "da_18_zap",
    name: "Zap",
    description: "Zaps nearby enemies",
    setId: "18",
    patch: "18.3",
    source: "communitydragon",
    verified: true,
  };

  const dummyPetSpecies: PetSpecies = {
    id: "hauntling",
    name: "Hauntling",
    variants: [
      { id: "hauntling_1", name: "Classic Hauntling", rarity: "rare" },
    ],
    source: "communitydragon",
    verified: true,
  };

  const dummyHexCore: HexCore = {
    id: "hex_1",
    name: "Moonfall",
    tier: "hero",
    description: "Speculative",
    verified: false,
  };

  it("calculates healthy status when relations and coverage are sound", () => {
    // Generate 74 dummy champions to meet healthy threshold
    const champions = Array.from({ length: 74 }, (_, i) => ({
      ...dummyChampion,
      id: `champ_${i}`,
      apiName: `champ_${i}`,
    }));
    champions[0] = dummyChampion;

    const traits = Array.from({ length: 36 }, (_, i) => ({
      ...dummyTrait,
      id: i === 0 ? "fated" : `trait_${i}`,
    }));

    const items = Array.from({ length: 171 }, (_, i) => ({
      ...dummyItem,
      id: i === 0 ? "infinity_edge" : `item_${i}`,
    }));

    const augments = Array.from({ length: 345 }, (_, i) => ({
      ...dummyAugment,
      id: i === 0 ? "silver_ticket" : `aug_${i}`,
    }));

    const teamComps = Array.from({ length: 12 }, (_, i) => ({
      ...dummyComp,
      id: `comp_${i}`,
    }));

    const petSpecies = Array.from({ length: 138 }, (_, i) => ({
      ...dummyPetSpecies,
      id: `species_${i}`,
    }));

    const report = computeSystemDataHealth({
      champions,
      traits,
      items,
      augments,
      teamComps,
      wisps: [dummyWisp],
      petSpecies,
      hexCores: [dummyHexCore],
    });

    expect(report.overallStatus).toBe("healthy");
    expect(report.brokenReferences.brokenChampions).toBe(0);
    expect(report.brokenReferences.brokenItems).toBe(0);
    expect(report.championStats.hp).toBe(74);
    expect(report.championStats.ad).toBe(74);

    const champDataset = report.datasets.find((d) => d.name === "Champions");
    expect(champDataset?.integrityStatus).toBe("healthy");
    expect(champDataset?.verificationStatus).toBe("verified");
  });

  it("detects broken references in team comps and reports critical error", () => {
    const brokenComp: TeamComp = {
      ...dummyComp,
      champions: [
        {
          championId: "non_existent_champ",
          name: "Unknown",
          cost: 1,
          imageUrl: "",
        },
      ],
    };

    const report = computeSystemDataHealth({
      champions: [dummyChampion],
      traits: [dummyTrait],
      items: [dummyItem],
      augments: [dummyAugment],
      teamComps: [brokenComp],
      wisps: [dummyWisp],
      petSpecies: [dummyPetSpecies],
      hexCores: [dummyHexCore],
    });

    expect(report.brokenReferences.brokenChampions).toBe(1);
    expect(report.overallStatus).toBe("critical");
  });
});
