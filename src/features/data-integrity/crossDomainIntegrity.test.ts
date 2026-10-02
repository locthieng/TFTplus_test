import { describe, it, expect } from "vitest";
import championsData from "@/generated/tft/champions.json";
import traitsData from "@/generated/tft/traits.json";
import itemsData from "@/generated/tft/items.json";
import augmentsData from "@/generated/tft/augments.json";
import { SET18_TEAM_COMPS } from "@/features/team-comps/data/set18TeamComps";
import { WISPS_DATA } from "@/features/wisps/data/wispsData";
import { PETS_DATA } from "@/features/pets/data/petsData";
import { HEX_CORES_DATA } from "@/features/hex-cores/data/hexCoresData";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { MockTeamCompRepository } from "@/features/team-comps/repositories/MockTeamCompRepository";

describe("Cross-Domain Reference Parity & Integrity", () => {
  it("verifies full coverage of Set 18 static dataset", () => {
    expect(championsData.length).toBeGreaterThanOrEqual(70);
    expect(traitsData.length).toBeGreaterThanOrEqual(30);
    expect(itemsData.length).toBeGreaterThanOrEqual(150);
    expect(augmentsData.length).toBeGreaterThanOrEqual(300);
    expect(SET18_TEAM_COMPS.length).toBeGreaterThanOrEqual(10);
    expect(WISPS_DATA.length).toBeGreaterThan(0);
    expect(PETS_DATA.length).toBeGreaterThan(0);
    expect(HEX_CORES_DATA.length).toBeGreaterThan(0);
  });

  it("verifies all champions have non-empty images, names, and traits", () => {
    for (const c of championsData) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.imageUrl).toBeTruthy();
      expect(c.cost).toBeGreaterThanOrEqual(1);
      expect(c.cost).toBeLessThanOrEqual(5);
      expect(c.traits.length).toBeGreaterThan(0);
    }
  });

  it("verifies all items have valid names, images, descriptions, and types", () => {
    for (const item of itemsData) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(typeof item.description).toBe("string");
      expect(item.imageUrl).toBeTruthy();
      expect([
        "component",
        "completed",
        "radiant",
        "artifact",
        "support",
        "emblem",
      ]).toContain(item.type);
    }
  });

  it("verifies all Wisps, Pets, and Hex Cores have valid attributes", () => {
    for (const wisp of WISPS_DATA) {
      expect(wisp.id).toBeTruthy();
      expect(wisp.name).toBeTruthy();
      expect(wisp.description).toBeTruthy();
    }

    for (const pet of PETS_DATA) {
      expect(pet.id).toBeTruthy();
      expect(pet.name).toBeTruthy();
      expect(pet.species).toBeTruthy();
      expect(["Default", "Common", "Rare", "Epic", "Legendary", "Mythic"]).toContain(pet.rarity);
    }

    for (const core of HEX_CORES_DATA) {
      expect(core.id).toBeTruthy();
      expect(core.name).toBeTruthy();
      expect(["hero", "priority", "alternative"]).toContain(core.tier);
      expect(core.description).toBeTruthy();
    }
  });

  it("verifies MockTeamCompRepository returns Set 18 comps when filtered by setId", async () => {
    const repo = new MockTeamCompRepository();
    const currentComps = await repo.getTeamComps({
      setId: TFT_RELEASE_CONFIG.setId,
    });

    expect(currentComps.length).toBeGreaterThanOrEqual(10);
    for (const comp of currentComps) {
      expect(comp.setId).toBe(TFT_RELEASE_CONFIG.setId);
    }

    // Verify Set 13 comps are not mixed in when filtering by Set 18
    const set13Leak = currentComps.filter((c) => c.setId === "13");
    expect(set13Leak.length).toBe(0);
  });
});
