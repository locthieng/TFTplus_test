import { describe, it, expect } from "vitest";
import { MockTeamCompRepository } from "./MockTeamCompRepository";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

describe("MockTeamCompRepository & Set Compatibility", () => {
  const repo = new MockTeamCompRepository();

  it("returns Set 18 comps when filtering by current Set 18", async () => {
    const currentSetComps = await repo.getTeamComps({
      setId: TFT_RELEASE_CONFIG.setId,
    });
    expect(currentSetComps.length).toBeGreaterThanOrEqual(10);
    expect(
      currentSetComps.every((c) => c.setId === TFT_RELEASE_CONFIG.setId)
    ).toBe(true);
  });

  it("returns mock comps when querying legacy Set 13 explicitly", async () => {
    const set13Comps = await repo.getTeamComps({ setId: "13" });
    expect(set13Comps.length).toBeGreaterThan(0);
    for (const comp of set13Comps) {
      expect(comp.setId).toBe("13");
    }
  });

  it("filters comps by tier and search term", async () => {
    const sTierComps = await repo.getTeamComps({ tier: "S" });
    expect(sTierComps.length).toBeGreaterThan(0);
    expect(sTierComps.every((c) => c.tier === "S")).toBe(true);

    const searchComps = await repo.getTeamComps({ search: "Caitlyn" });
    expect(searchComps.length).toBeGreaterThan(0);
    expect(
      searchComps.every((c) =>
        c.name.toLowerCase().includes("caitlyn") ||
        c.champions.some((ch) => ch.name.toLowerCase().includes("caitlyn"))
      )
    ).toBe(true);
  });

  it("identifies that mock comps do not belong to active set", async () => {
    const sample = await repo.getTeamCompById("enforcer-caitlyn-fast8");
    expect(sample).not.toBeNull();
    expect(sample?.setId).not.toBe(TFT_RELEASE_CONFIG.setId);
  });
});
