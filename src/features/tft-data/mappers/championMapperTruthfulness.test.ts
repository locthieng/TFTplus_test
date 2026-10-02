import { describe, it, expect } from "vitest";
import { mapRawChampionToDomain } from "./championMapper";
import { RawChampion } from "../schemas/championSourceSchema";

describe("Champion Mapper Truthfulness Tests", () => {
  it("returns undefined for missing stats instead of fabricated defaults", () => {
    const rawWithoutStats: RawChampion = {
      apiName: "DA_Test_MissingStats",
      name: "Missing Stats Champ",
      cost: 3,
      traits: ["eldritch"],
      stats: {},
    };

    const domain = mapRawChampionToDomain(rawWithoutStats);
    expect(domain.health).toBeUndefined();
    expect(domain.attackDamage).toBeUndefined();
    expect(domain.attackSpeed).toBeUndefined();
    expect(domain.armor).toBeUndefined();
    expect(domain.magicResist).toBeUndefined();
    expect(domain.range).toBeUndefined();
    expect(domain.critChance).toBeUndefined();
    expect(domain.critDamage).toBeUndefined();
    expect(domain.ability).toBeUndefined();
  });

  it("returns undefined for ability mana when both initialMana and mana are missing", () => {
    const rawWithAbilityNoMana: RawChampion = {
      apiName: "DA_Test_AbilityNoMana",
      name: "No Mana Champ",
      cost: 1,
      traits: ["arcana"],
      stats: {
        hp: 500,
      },
      ability: {
        name: "Passive Ability",
        desc: "A passive skill with no mana cost.",
        variables: [],
      },
    };

    const domain = mapRawChampionToDomain(rawWithAbilityNoMana);
    expect(domain.health).toEqual([500, 900, 1620]);
    expect(domain.ability).toBeDefined();
    expect(domain.ability?.mana).toBeUndefined();
  });

  it("preserves 0 as a valid numeric value without treating it as missing", () => {
    const rawWithZeros: RawChampion = {
      apiName: "DA_Test_ZeroStats",
      name: "Zero Stats Champ",
      cost: 2,
      traits: ["bastion"],
      stats: {
        hp: 600,
        damage: 0,
        armor: 0,
        magicResist: 0,
        initialMana: 0,
        mana: 50,
      },
      ability: {
        name: "Quick Cast",
        desc: "Starts with zero mana.",
        variables: [],
      },
    };

    const domain = mapRawChampionToDomain(rawWithZeros);
    expect(domain.health).toEqual([600, 1080, 1944]);
    // 0 AD scaled
    expect(domain.attackDamage).toEqual([0, 0, 0]);
    // 0 armor and MR preserved
    expect(domain.armor).toBe(0);
    expect(domain.magicResist).toBe(0);
    // 0 initial mana preserved
    expect(domain.ability?.mana?.starting).toBe(0);
    expect(domain.ability?.mana?.total).toBe(50);
  });

  it("correctly maps full valid stats and calculates 1-star, 2-star, and 3-star scalings", () => {
    const rawComplete: RawChampion = {
      apiName: "DA_Test_Complete",
      name: "Complete Champ",
      cost: 4,
      traits: ["blossom", "sorcerer"],
      stats: {
        hp: 750,
        attackDamage: 55,
        attackSpeed: 0.75,
        armor: 40,
        magicResist: 40,
        range: 3,
        critChance: 25,
        critDamage: 140,
        initialMana: 20,
        mana: 80,
      },
      ability: {
        name: "Mystic Blast",
        desc: "Deals heavy magical burst damage.",
        variables: [],
      },
    };

    const domain = mapRawChampionToDomain(rawComplete);
    expect(domain.health).toEqual([750, 1350, 2430]);
    expect(domain.attackDamage).toEqual([55, 99, 178]);
    expect(domain.attackSpeed).toBe(0.75);
    expect(domain.armor).toBe(40);
    expect(domain.magicResist).toBe(40);
    expect(domain.range).toBe(3);
    expect(domain.critChance).toBe(25);
    expect(domain.critDamage).toBe(140);
    expect(domain.ability?.mana?.starting).toBe(20);
    expect(domain.ability?.mana?.total).toBe(80);
  });
});
