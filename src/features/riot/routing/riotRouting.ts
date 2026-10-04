import { PlatformRegion } from "@/types/region";
import {
  RiotPlatformRoute,
  RiotRegionalRoute,
  RegionRoutingConfig,
} from "./riotRouting.types";

export const REGION_ROUTING_MAP: Record<PlatformRegion, RegionRoutingConfig> = {
  vn: {
    region: "vn",
    platformRoute: "VN2",
    regionalRoute: "ASIA",
    displayName: "Vietnam",
  },
  kr: {
    region: "kr",
    platformRoute: "KR",
    regionalRoute: "ASIA",
    displayName: "Korea",
  },
  na: {
    region: "na",
    platformRoute: "NA1",
    regionalRoute: "AMERICAS",
    displayName: "North America",
  },
  euw: {
    region: "euw",
    platformRoute: "EUW1",
    regionalRoute: "EUROPE",
    displayName: "Europe West",
  },
};

export function getRegionRouting(region: string): RegionRoutingConfig | null {
  const norm = region.toLowerCase() as PlatformRegion;
  return REGION_ROUTING_MAP[norm] ?? null;
}

export function getPlatformRoute(region: string): RiotPlatformRoute {
  const cfg = getRegionRouting(region);
  if (!cfg) {
    throw new Error(`Unsupported region for Riot platform routing: ${region}`);
  }
  return cfg.platformRoute;
}

export function getRegionalRoute(region: string): RiotRegionalRoute {
  const cfg = getRegionRouting(region);
  if (!cfg) {
    throw new Error(`Unsupported region for Riot regional routing: ${region}`);
  }
  return cfg.regionalRoute;
}

export function getPlatformBaseUrl(platform: RiotPlatformRoute): string {
  return `https://${platform.toLowerCase()}.api.riotgames.com`;
}

export function getRegionalBaseUrl(regional: RiotRegionalRoute): string {
  return `https://${regional.toLowerCase()}.api.riotgames.com`;
}
