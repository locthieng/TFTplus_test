import { PlatformRegion } from "@/types/region";

export type RiotPlatformRoute = "VN2" | "NA1" | "KR" | "EUW1";

export type RiotRegionalRoute = "ASIA" | "AMERICAS" | "EUROPE";

export interface RegionRoutingConfig {
  region: PlatformRegion;
  platformRoute: RiotPlatformRoute;
  regionalRoute: RiotRegionalRoute;
  displayName: string;
}
