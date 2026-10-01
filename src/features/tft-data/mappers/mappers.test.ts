import { describe, it, expect } from "vitest";
import { RawChampionSchema } from "../schemas/championSourceSchema";
import { RawTraitSchema } from "../schemas/traitSourceSchema";
import { RawItemSchema } from "../schemas/itemSourceSchema";
import { mapRawChampionToDomain } from "./championMapper";
import { mapRawTraitToDomain } from "./traitMapper";
import { mapRawItemToDomain } from "./itemMapper";
import { mapRawAugmentToDomain } from "./augmentMapper";

describe("TFT Data Mappers", () => {
  it("maps raw champion to domain model with normalized stats and traits", () => {
    const raw = {
      apiName: "DA_Gromp18_AP",
      name: "Gromp",
      cost: 2,
      icon: "assets/characters/tft18_gromp/tft18_gromp_square.png",
      traits: ["Riftbeast", "Adaptor"],
      stats: {
        hp: 550,
        attackDamage: 30,
        attackSpeed: 0.7,
        armor: 30,
        magicResist: 30,
        range: 4,
        initialMana: 0,
        mana: 60,
      },
      ability: {
        name: "Belchy Bubble",
        desc: "Adaptor: Deal magic damage to target.",
      },
    };

    const parsed = RawChampionSchema.parse(raw);
    const domain = mapRawChampionToDomain(parsed);
    expect(domain.id).toBe("da_gromp18_ap");
    expect(domain.name).toBe("Gromp");
    expect(domain.cost).toBe(2);
    expect(domain.traits).toEqual(["riftbeast", "adaptor"]);
    expect(domain.health?.[0]).toBe(550);
    expect(domain.range).toBe(4);
    expect(domain.ability?.name).toBe("Belchy Bubble");
    expect(domain.ability?.mana?.starting).toBe(0);
    expect(domain.ability?.mana?.total).toBe(60);
    expect(domain.imageUrl).toContain("https://raw.communitydragon.org/latest/game/");
  });

  it("maps raw trait to domain model with sorted breakpoints and styled tiers", () => {
    const raw = {
      apiName: "DA_18_Elderwood",
      name: "Elderwood",
      icon: "assets/ux/traiticons/trait_icon_18_elderwood.png",
      desc: "Gain placeable Elderwood plants.",
      effects: [
        { minUnits: 5, style: 3 }, // gold
        { minUnits: 3, style: 1 }, // bronze
        { minUnits: 7, style: 4 }, // prismatic
      ],
    };

    const parsed = RawTraitSchema.parse(raw);
    const domain = mapRawTraitToDomain(parsed);
    expect(domain.id).toBe("elderwood");
    expect(domain.name).toBe("Elderwood");
    expect(domain.breakpoints.length).toBe(3);
    // Should be sorted ascending by minUnits
    expect(domain.breakpoints[0].minUnits).toBe(3);
    expect(domain.breakpoints[0].style).toBe("bronze");
    expect(domain.breakpoints[1].minUnits).toBe(5);
    expect(domain.breakpoints[1].style).toBe("gold");
    expect(domain.breakpoints[2].minUnits).toBe(7);
    expect(domain.breakpoints[2].style).toBe("prismatic");
  });

  it("maps raw item and detects type correctly", () => {
    const rawCompleted = {
      apiName: "TFT_Item_InfinityEdge",
      name: "Infinity Edge",
      desc: "Grant %AD and %Crit.",
      loadoutsIcon: "assets/maps/tft/icons/items/infinity_edge.png",
      from: [1, 9],
      effects: {
        AD: 0.35,
        Crit: 0.35,
      },
    };

    const parsedCompleted = RawItemSchema.parse(rawCompleted);
    const domainCompleted = mapRawItemToDomain(parsedCompleted);
    expect(domainCompleted.name).toBe("Infinity Edge");
    expect(domainCompleted.type).toBe("completed");

    const rawRadiant = {
      apiName: "TFT5_Item_InfinityEdgeRadiant",
      name: "Zenith Edge",
      desc: "Radiant version of Infinity Edge.",
      loadoutsIcon: "assets/maps/tft/icons/items/zenith_edge.png",
      from: [],
    };

    const parsedRadiant = RawItemSchema.parse(rawRadiant);
    const domainRadiant = mapRawItemToDomain(parsedRadiant);
    expect(domainRadiant.type).toBe("radiant");
  });

  it("maps raw augment with tier determination", () => {
    const rawAugment = {
      apiName: "TFT9_Augment_PrismaticTicket",
      name: "Prismatic Ticket",
      desc: "Each time your shop is refreshed, you have a chance to gain a free refresh.",
      loadoutsIcon: "assets/maps/tft/icons/augments/prismatic_ticket.png",
    };

    const parsedAugment = RawItemSchema.parse(rawAugment);
    const domainAug = mapRawAugmentToDomain(parsedAugment);
    expect(domainAug.name).toBe("Prismatic Ticket");
    expect(domainAug.tier).toBe("prismatic");
  });
});
