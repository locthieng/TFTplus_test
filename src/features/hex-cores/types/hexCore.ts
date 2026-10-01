export type HexCoreTier = "hero" | "priority" | "alternative";

export interface HexCore {
  id: string;
  name: string;
  iconUrl: string;
  tier: HexCoreTier;
  description: string;
}
