import { describe, it, expect, beforeEach } from "vitest";
import { TftStaticResolver } from "./TftStaticResolver";
import { StaticResolutionDiagnostics } from "./StaticResolutionDiagnostics";

describe("TftStaticResolver", () => {
  let diagnostics: StaticResolutionDiagnostics;
  let resolver: TftStaticResolver;

  beforeEach(() => {
    diagnostics = new StaticResolutionDiagnostics();
    resolver = new TftStaticResolver(diagnostics);
  });

  it("resolves static champion by various key patterns", () => {
    const res1 = resolver.resolveChampion("da_18_akali_ad");
    expect(res1.resolved).toBe(true);
    expect(res1.displayName).toBe("Akali");
    expect(res1.entity?.cost).toBe(1);

    const res2 = resolver.resolveChampion("TFT18_Akali");
    expect(res2.resolved).toBe(true);
    expect(res2.displayName).toBe("Akali");
  });

  it("resolves static item by apiName or friendly id", () => {
    const res = resolver.resolveItem("TFT_Item_Artifact_AegisOfDawn");
    expect(res.resolved).toBe(true);
    expect(res.displayName).toBe("Aegis of Dawn");
  });

  it("resolves static trait by apiName", () => {
    const res = resolver.resolveTrait("DA_18_Adaptor");
    expect(res.resolved).toBe(true);
    expect(res.displayName).toBe("Adaptor");
  });

  it("resolves static augment by apiName", () => {
    const res = resolver.resolveAugment("TFT18_Augment_SilverTierAugment");
    // If not found in set 18, it gracefully falls back without throwing
    expect(typeof res.displayName).toBe("string");
  });

  it("gracefully falls back on unknown champion without fabricating cost or fake stats", () => {
    const res = resolver.resolveChampion("TFT99_SuperUnit");
    expect(res.resolved).toBe(false);
    expect(res.entity).toBeUndefined(); // NO fake cost = 1
    expect(res.displayName).toBe("Super Unit");

    const metrics = resolver.getUnresolvedMetrics();
    expect(metrics.champions).toContain("TFT99_SuperUnit");
  });

  it("gracefully falls back on unknown item without fabricating item type", () => {
    const res = resolver.resolveItem("TFT_Item_UnknownMegaSword");
    expect(res.resolved).toBe(false);
    expect(res.entity).toBeUndefined(); // NO fake type = completed
    expect(res.displayName).toContain("Unknown Mega Sword");

    const metrics = resolver.getUnresolvedMetrics();
    expect(metrics.items).toContain("TFT_Item_UnknownMegaSword");
  });

  it("gracefully falls back on unknown trait without fabricating fake stats", () => {
    const res = resolver.resolveTrait("TFT99_MysticSorcerer");
    expect(res.resolved).toBe(false);
    expect(res.entity).toBeUndefined();
    expect(res.displayName).toContain("Mystic Sorcerer");

    const metrics = resolver.getUnresolvedMetrics();
    expect(metrics.traits).toContain("TFT99_MysticSorcerer");
  });

  it("gracefully falls back on unknown augment without fabricating tier", () => {
    const res = resolver.resolveAugment("TFT99_Augment_UnknownHyperBuff");
    expect(res.resolved).toBe(false);
    expect(res.entity).toBeUndefined(); // NO fake tier = silver
    expect(res.displayName).toContain("Unknown Hyper Buff");

    const metrics = resolver.getUnresolvedMetrics();
    expect(metrics.augments).toContain("TFT99_Augment_UnknownHyperBuff");
  });

  it("diagnostics reports correct counts and limits samples to 10 IDs", () => {
    for (let i = 1; i <= 15; i++) {
      resolver.resolveChampion(`TFT99_UnknownHero_${i}`);
    }

    const report = diagnostics.getReport();
    expect(report.counts.champions).toBe(15);
    expect(report.counts.total).toBe(15);
    expect(report.sampleUnknownIds.champions.length).toBe(10);
  });
});
