import { describe, it, expect } from "vitest";
import { StaticTftRepository } from "./StaticTftRepository";
import { tftService } from "@/services/tft";

describe("StaticTftRepository & TftService", () => {
  const repo = new StaticTftRepository();

  it("loads Set 18 champions from static data", async () => {
    const champions = await repo.getChampions();
    expect(champions.length).toBeGreaterThan(50);

    const firstChamp = champions[0];
    expect(firstChamp.id).toBeDefined();
    expect(firstChamp.name).toBeDefined();
    expect(firstChamp.cost).toBeGreaterThanOrEqual(1);
    expect(firstChamp.cost).toBeLessThanOrEqual(5);
  });

  it("retrieves a champion by ID case-insensitively", async () => {
    const champions = await repo.getChampions();
    const sample = champions[0];

    const found = await repo.getChampionById(sample.id.toUpperCase());
    expect(found).not.toBeNull();
    expect(found?.name).toBe(sample.name);
  });

  it("loads Set 18 traits from static data", async () => {
    const traits = await repo.getTraits();
    expect(traits.length).toBeGreaterThan(20);

    const elderwood = await repo.getTraitById("elderwood");
    expect(elderwood).not.toBeNull();
    expect(elderwood?.name).toBe("Elderwood");
    expect(elderwood?.breakpoints.length).toBeGreaterThan(0);
  });

  it("loads items and augments from static data", async () => {
    const items = await repo.getItems();
    expect(items.length).toBeGreaterThan(100);

    const augments = await repo.getAugments();
    expect(augments.length).toBeGreaterThan(30);
  });

  it("retrieves champion by apiName", async () => {
    const champions = await repo.getChampions();
    const sample = champions.find((c) => c.apiName);
    expect(sample).toBeDefined();
    if (sample && sample.apiName) {
      const found = await repo.getChampionById(sample.apiName);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(sample.id);
    }
  });

  it("retrieves item and augment by id case-insensitively", async () => {
    const items = await repo.getItems();
    const sampleItem = items[0];
    const foundItem = await repo.getItemById(sampleItem.id.toUpperCase());
    expect(foundItem).not.toBeNull();
    expect(foundItem?.name).toBe(sampleItem.name);

    const augments = await repo.getAugments();
    const sampleAug = augments[0];
    const foundAug = await repo.getAugmentById(sampleAug.id.toUpperCase());
    expect(foundAug).not.toBeNull();
    expect(foundAug?.name).toBe(sampleAug.name);
  });

  it("has unique IDs across all entities", async () => {
    const champions = await repo.getChampions();
    const champIds = new Set(champions.map((c) => c.id));
    expect(champIds.size).toBe(champions.length);

    const traits = await repo.getTraits();
    const traitIds = new Set(traits.map((t) => t.id));
    expect(traitIds.size).toBe(traits.length);

    const items = await repo.getItems();
    const itemIds = new Set(items.map((i) => i.id));
    expect(itemIds.size).toBe(items.length);

    const augments = await repo.getAugments();
    const augIds = new Set(augments.map((a) => a.id));
    expect(augIds.size).toBe(augments.length);
  });

  it("tftService correctly filters champions by cost and search", async () => {
    const cost5Champs = await tftService.getChampions({ cost: 5 });
    expect(cost5Champs.length).toBeGreaterThan(0);
    expect(cost5Champs.every((c) => c.cost === 5)).toBe(true);

    const searchChamps = await tftService.getChampions({ search: "a" });
    expect(searchChamps.length).toBeGreaterThan(0);
    expect(
      searchChamps.every((c) => c.name.toLowerCase().includes("a"))
    ).toBe(true);
  });
});
