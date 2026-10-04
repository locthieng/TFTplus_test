import { describe, it, expect } from "vitest";
import { TftStaticResolver } from "./TftStaticResolver";

describe("TftStaticResolver", () => {
  const resolver = new TftStaticResolver();

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

  it("gracefully falls back on unknown character without fake cost or tier and tracks metric", () => {
    const res = resolver.resolveChampion("TFT99_SuperUnit");
    expect(res.resolved).toBe(false);
    expect(res.entity).toBeUndefined(); // Does NOT fabricate cost or fake stats
    expect(res.displayName).toContain("Super Unit");

    const metrics = resolver.getUnresolvedMetrics();
    expect(metrics.champions).toContain("TFT99_SuperUnit");
  });
});
