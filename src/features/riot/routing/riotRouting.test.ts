import { describe, it, expect } from "vitest";
import {
  getRegionRouting,
  getPlatformRoute,
  getRegionalRoute,
  getPlatformBaseUrl,
  getRegionalBaseUrl,
} from "./riotRouting";

describe("Riot Routing Model", () => {
  it("resolves correct platform and regional routes for all supported regions", () => {
    expect(getPlatformRoute("vn")).toBe("VN2");
    expect(getRegionalRoute("vn")).toBe("ASIA");

    expect(getPlatformRoute("kr")).toBe("KR");
    expect(getRegionalRoute("kr")).toBe("ASIA");

    expect(getPlatformRoute("na")).toBe("NA1");
    expect(getRegionalRoute("na")).toBe("AMERICAS");

    expect(getPlatformRoute("euw")).toBe("EUW1");
    expect(getRegionalRoute("euw")).toBe("EUROPE");
  });

  it("handles case-insensitive region input", () => {
    expect(getPlatformRoute("VN")).toBe("VN2");
    expect(getRegionalRoute("EuW")).toBe("EUROPE");
  });

  it("throws on unsupported region", () => {
    expect(() => getPlatformRoute("oce")).toThrow();
    expect(() => getRegionalRoute("unknown")).toThrow();
    expect(getRegionRouting("invalid")).toBeNull();
  });

  it("builds correct base URLs", () => {
    expect(getPlatformBaseUrl("VN2")).toBe("https://vn2.api.riotgames.com");
    expect(getPlatformBaseUrl("NA1")).toBe("https://na1.api.riotgames.com");
    expect(getRegionalBaseUrl("ASIA")).toBe("https://asia.api.riotgames.com");
    expect(getRegionalBaseUrl("AMERICAS")).toBe("https://americas.api.riotgames.com");
  });
});
